import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { DropdownField } from '../../form/DropdownField';
import { MonthPickerField } from '../../form/MonthPickerField';
import { FormButton } from '../../form/FormButton';
import { DashboardHeaderSkeleton } from './DashboardHeaderSkeleton';
import { getDicerAccounts } from '~/utils/api/dicerApis';
import { QUERY_KEYS } from '~/utils/constants/queryKeys';
import { useToaster } from '../../Toaster';
import dayjs from '~/utils/date/dayjs';

interface DashboardHeaderProps {
  onGenerateReport?: (accountId: string, selectedMonth: dayjs.Dayjs) => void;
  loading?: boolean;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onGenerateReport,
  loading = false,
}) => {
  const [selectedAccount, setSelectedAccount] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<dayjs.Dayjs | null>(dayjs());
  const { showToaster } = useToaster();

  // Fetch accounts using React Query
  const { 
    data: accounts = [], 
    isLoading: accountsLoading, 
    error: accountsError 
  } = useQuery({
    queryKey: [QUERY_KEYS.ACCOUNTS],
    queryFn: getDicerAccounts,
  });

  // Handle error state
  useEffect(() => {
    if (accountsError) {
      showToaster(
        'Failed to load accounts. Please try again later.',
        'error',
        5000
      );
    }
  }, [accountsError, showToaster]);

  // Show skeleton while loading
  if (accountsLoading) {
    return <DashboardHeaderSkeleton />;
  }

  // Transform accounts data for dropdown
  const accountOptions = accounts.map((account) => ({
    label: account.name,
    value: account.id.toString(),
  }));

  // Show error message if no accounts available
  if (accounts.length === 0 && !accountsLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography
          variant="h4"
          sx={{
            mb: 3,
            fontWeight: 600,
            color: 'text.primary',
          }}
        >
          Team Dashboard
        </Typography>
        <Box
          sx={{
            border: '1px solid',
            borderColor: 'custom.lightBorder',
            borderRadius: '8px',
            backgroundColor: 'background.paper',
            p: 3,
          }}
        >
          <Typography variant="body1" color="error">
            No accounts available. Please contact your administrator.
          </Typography>
        </Box>
      </Box>
    );
  }

  const handleAccountChange = (event: SelectChangeEvent<string | string[]>) => {
    setSelectedAccount(event.target.value as string);
  };

  const handleMonthChange = (date: dayjs.Dayjs | null) => {
    setSelectedMonth(date);
  };

  const handleGenerateReport = () => {
    if (selectedAccount && selectedMonth && onGenerateReport) {
      onGenerateReport(selectedAccount, selectedMonth);
    }
  };

  const isButtonDisabled = !selectedAccount || !selectedMonth;

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Typography
        variant="h4"
        sx={{
          mb: 3,
          fontWeight: 600,
          color: 'text.primary',
        }}
      >
        Team Dashboard
      </Typography>

      {/* Bordered Container */}
      <Box
        sx={{
          border: '1px solid',
          borderColor: 'custom.lightBorder',
          borderRadius: '8px',
          backgroundColor: 'background.paper',
        }}
      >
        {/* Controls Row */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: 3,
            p: 3,
            flexWrap: { xs: 'wrap', md: 'nowrap' },
          }}
        >
          {/* Account Dropdown - 50% width */}
          <Box sx={{ width: { xs: '100%', md: '50%' } }}>
            <Typography
              variant="h3"
              sx={{
                mb: 1,
                ml: 1,
                color: 'text.black',
              }}
            >
              Select Account
            </Typography>
            <DropdownField
              name="account"
              options={accountOptions}
              value={selectedAccount}
              onChange={handleAccountChange}
              placeholder=""
            />
          </Box>

          {/* Right side container for picker and button */}
          <Box 
            sx={{ 
              display: 'flex',
              alignItems: 'flex-end',
              gap: 2,
              width: { xs: '100%', md: '50%' },
              justifyContent: { xs: 'stretch', md: 'flex-end' }
            }}
          >
            {/* Month Picker */}
            <Box sx={{ width: { xs: '100%', md: 'auto' } }}>
              <MonthPickerField
                name="month"
                value={selectedMonth}
                onChange={handleMonthChange}
                placeholder="Select Month"
              />
            </Box>

            {/* Generate Report Button */}
            <Box sx={{ width: { xs: '100%', md: 'auto' } }}>
              <FormButton
                label="Generate Report"
                onClick={handleGenerateReport}
                isLoading={loading}
                fullWidth={false}
                sx={{
                  minWidth: '140px',
                  height: '40px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 500,
                  textTransform: 'none',
                  backgroundColor: isButtonDisabled ? 'grey.300' : 'primary.main',
                  color: isButtonDisabled ? 'grey.600' : 'white',
                  '&:hover': {
                    backgroundColor: isButtonDisabled ? 'grey.300' : 'primary.dark',
                  },
                  pointerEvents: isButtonDisabled ? 'none' : 'auto',
                  opacity: isButtonDisabled ? 0.6 : 1,
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardHeader;
