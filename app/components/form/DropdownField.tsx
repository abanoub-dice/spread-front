import React from 'react';
import {
  FormControl,
  Select,
  MenuItem,
  OutlinedInput,
  Chip,
  Box,
  Typography,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';

// Styles
const styles = {
  select: {
    mt: 1,
    '& .MuiSelect-select': { 
      padding: '10px 16px',
      fontSize: { xs: '12px', sm: '13px', md: '14px' }
    },
    '& .MuiOutlinedInput-root': {
      borderRadius: '10px',
      '&.Mui-error': {
        '& fieldset': {
          borderColor: 'error.main',
        },
        '&:hover fieldset': {
          borderColor: 'error.main',
        },
      },
    },
  },
  placeholder: {
    fontSize: { xs: '11px', sm: '12px', md: '14px' },
    color: 'text.secondary'
  },
  menuItem: {
    fontSize: { xs: '12px', sm: '13px', md: '14px' }
  },
  chip: {
    fontSize: { xs: '10px', sm: '11px', md: '12px' },
    height: 'unset'
  }
} as const;

interface DropdownFieldProps {
  label: string;
  name: string;
  options: { label: string; value: string }[];
  value: string | string[];
  onChange: (event: SelectChangeEvent<string | string[]>) => void;
  error?: string;
  required?: boolean;
  multiple?: boolean;
  placeholder?: string;
  autoComplete?: string;
  disabled?: boolean;
}

const NoDataMenuItem = () => (
  <MenuItem disabled>
    <Typography sx={styles.placeholder}>
      No data to select
    </Typography>
  </MenuItem>
);

const SelectedValue = ({ 
  selected, 
  options, 
  multiple, 
  placeholder 
}: { 
  selected: string | string[]; 
  options: { label: string; value: string }[]; 
  multiple: boolean; 
  placeholder?: string;
}) => {
  if (!selected || (Array.isArray(selected) && selected.length === 0)) {
    return <Typography component="em" sx={styles.placeholder}>{placeholder}</Typography>;
  }

  if (multiple) {
    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
        {(selected as string[]).map((value: string) => {
          const opt = options.find(o => o.value === value);
          return opt ? <Chip key={value} label={opt.label} sx={styles.chip} /> : null;
        })}
      </Box>
    );
  }

  const selectedOption = options.find(opt => opt.value === selected);
  return selectedOption ? (
    <Typography sx={styles.menuItem}>
      {selectedOption.label}
    </Typography>
  ) : (
    <Typography component="em" sx={styles.placeholder}>
      {placeholder}
    </Typography>
  );
};

export const DropdownField: React.FC<DropdownFieldProps> = ({
  label,
  name,
  options,
  value,
  onChange,
  error,
  required = false,
  multiple = false,
  placeholder,
  autoComplete,
  disabled = false,
}) => {
  return (
    <Box>
      <Typography variant="subHeader" sx={{ ml: 1 }}>
        {label}
        {required && <Box component="span" sx={{ color: 'error.main', ml: 0.5 }}>*</Box>}
      </Typography>
      <FormControl fullWidth error={!!error}>
        <Select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          multiple={multiple}
          disabled={disabled}
          input={<OutlinedInput autoComplete={autoComplete} />}
          displayEmpty={!!placeholder}
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: 200,
              },
            },
          }}
          sx={styles.select}
          renderValue={(selected) => (
            <SelectedValue
              selected={selected}
              options={options}
              multiple={multiple}
              placeholder={placeholder}
            />
          )}
        >
          {options.length === 0 ? (
            <NoDataMenuItem />
          ) : (
            options.map(opt => (
              <MenuItem key={opt.value} value={opt.value} sx={styles.menuItem}>
                {opt.label}
              </MenuItem>
            ))
          )}
        </Select>
        {error && (
          <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1 }}>
            {error}
          </Typography>
        )}
      </FormControl>
    </Box>
  );
}; 