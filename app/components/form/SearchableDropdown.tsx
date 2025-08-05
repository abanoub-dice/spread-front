import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  OutlinedInput,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  Paper,
  CircularProgress,
} from '@mui/material';
import { ArrowUp2, SearchNormal, SearchStatus } from 'iconsax-reactjs';

interface Option {
  id: string;
  label: string;
  value: string;
}

interface SearchableDropdownProps {
  options: Option[];
  selectedOption?: Option;
  onOptionSelect: (option: Option) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  label?: string;
  loading?: boolean;
}

export const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
  options,
  selectedOption,
  onOptionSelect,
  placeholder = 'Select an option',
  searchPlaceholder = 'search',
  disabled = false,
  label,
  loading = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter options based on search term
  const filteredOptions = useMemo(() => {
    if (!searchTerm) return options;
    return options.filter(option => option.label.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [options, searchTerm]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        setSearchTerm('');
      }
    }
  };

  const handleOptionSelect = (option: Option) => {
    onOptionSelect(option);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <Box ref={dropdownRef} sx={{ width: '100%', position: 'relative' }}>
      {/* Label */}
      {label && (
        <Typography
          variant="h6"
          sx={{
            mb: 1,
            fontWeight: 500,
            color: 'text.primary',
            fontSize: '14px',
          }}
        >
          {label}
        </Typography>
      )}

      {/* Trigger Button */}
      <Box
        sx={{
          backgroundColor: 'white',
          borderRadius: '8px',
          border: '1px solid #e0e0e0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          cursor: disabled ? 'default' : 'pointer',
          '&:hover': {
            backgroundColor: disabled ? 'transparent' : 'background.defaultSecondary',
            borderColor: disabled ? '#e0e0e0' : 'primary.main',
          },
          '&:focus-within': {
            borderColor: 'primary.main',
            outline: 'none',
          },
        }}
        onClick={handleToggle}
        tabIndex={disabled ? -1 : 0}
        role="button"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 400,
            color: selectedOption ? 'text.dark' : 'text.light',
            maxWidth: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
          title={selectedOption ? selectedOption.label : placeholder}
        >
          {selectedOption 
            ? (selectedOption.label.length > 20 ? `${selectedOption.label.substring(0, 20)}...` : selectedOption.label)
            : placeholder
          }
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {loading && (
            <CircularProgress size={16} sx={{ color: 'text.light' }} />
          )}
          <IconButton
            size="small"
            sx={{
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s',
              color: 'text.dark',
              p: 0.5,
              '&:hover': {
                backgroundColor: 'background.brandTertiary',
                color: 'primary.main',
              },
            }}
          >
            <ArrowUp2 size={16} />
          </IconButton>
        </Box>
      </Box>

      {/* Dropdown Content - Positioned as overlay */}
      {isOpen && (
        <Paper
          elevation={8}
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 1000,
            mt: 1,
            borderRadius: '8px',
            border: '1px solid #e0e0e0',
            backgroundColor: 'white',
            maxHeight: 300,
            overflow: 'hidden',
          }}
        >
          {/* Search Input */}
          <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
            <OutlinedInput
              fullWidth
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={handleSearchChange}
              startAdornment={
                <InputAdornment position="start">
                  <SearchNormal size={16} color="#999" />
                </InputAdornment>
              }
              sx={{
                backgroundColor: 'background.defaultSecondary',
                borderRadius: '10px',
                '& .MuiInputBase-input': {
                  fontSize: '0.875rem',
                  padding: '12px 16px',
                  color: 'text.dark',
                  '&::placeholder': {
                    color: 'text.light',
                    fontSize: '0.875rem',
                    opacity: 1,
                  },
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'text.gray',
                  borderWidth: '1px',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'primary.main',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'primary.main',
                  borderWidth: '1px',
                },
              }}
            />
          </Box>

          {/* Options List */}
          <List sx={{ p: 0, maxHeight: 200, overflow: 'auto' }}>
            {loading ? (
              <ListItem sx={{ py: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', gap: 2 }}>
                  <CircularProgress size={20} sx={{ color: 'primary.main' }} />
                  <Typography variant="body2" color="text.light">
                    Loading options...
                  </Typography>
                </Box>
              </ListItem>
            ) : filteredOptions.length === 0 ? (
              <ListItem sx={{ py: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', gap: 2 }}>
                  <SearchStatus size={20} color="#999" />
                  <Typography variant="body2" color="text.light">
                    {searchTerm ? 'No options found' : 'No options available'}
                  </Typography>
                </Box>
              </ListItem>
            ) : (
              filteredOptions.map(option => (
                <ListItem key={option.id} disablePadding>
                  <ListItemButton
                    onClick={() => handleOptionSelect(option)}
                    sx={{
                      px: 2,
                      py: 1.5,
                      '&:hover': {
                        backgroundColor: 'background.brandTertiary',
                        '& .MuiListItemText-primary': {
                          color: 'primary.main',
                        },
                      },
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 400,
                            color: 'text.dark',
                            maxWidth: '100%',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                          title={option.label}
                        >
                          {option.label.length > 20 ? `${option.label.substring(0, 20)}...` : option.label}
                        </Typography>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              ))
            )}
          </List>
        </Paper>
      )}
    </Box>
  );
};
