import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { SearchableDropdown } from '../../form/SearchableDropdown';
import { QUERY_KEYS } from '~/utils/constants/queryKeys';
import { useToaster } from '../../Toaster';
import { axiosInstance } from '~/utils/api/axiosInstance';

interface Option {
  id: string;
  label: string;
  value: string;
}

interface Account {
  id: string;
  name: string;
  icon?: string;
  color?: string;
}

interface AccountApiResponse {
  id: number;
  name: string;
  logo: string;
  pmp_link: null;
  description: string;
  monthly_posts_limit: number;
  created_at: string;
  updated_at: string;
  deleted_at: null;
}

interface AccountSelectorProps {
  onAccountSelect?: (account: Account) => void;
  selectedAccountId?: string;
}

export const AccountSelector: React.FC<AccountSelectorProps> = ({
  onAccountSelect,
  selectedAccountId,
}) => {
  const [selectedAccount, setSelectedAccount] = useState<Account | undefined>();
  const { showToaster } = useToaster();

  // Fetch accounts using React Query
  const {
    data: accounts = [],
    isLoading: accountsLoading,
    error: accountsError,
  } = useQuery<AccountApiResponse[]>({
    queryKey: [QUERY_KEYS.ACCOUNTS],
    queryFn: async () => {
      const response = await axiosInstance.get('/dicer/accounts');
      return response.data.accounts;
    },
  });

  // Handle error state
  useEffect(() => {
    if (accountsError) {
      showToaster('Failed to load accounts. Please try again later.', 'error', 5000);
    }
  }, [accountsError, showToaster]);

  // Set selected account when selectedAccountId changes
  useEffect(() => {
    if (selectedAccountId && accounts.length > 0) {
      const account = accounts.find(acc => acc.id.toString() === selectedAccountId);
      if (account) {
        setSelectedAccount({
          id: account.id.toString(),
          name: account.name,
          icon: account.name.charAt(0).toUpperCase(),
          color: '#20B2AA',
        });
      }
    }
  }, [selectedAccountId, accounts]);

  // Transform accounts data for the SearchableDropdown
  const accountOptions: Option[] = accounts.map(account => ({
    id: account.id.toString(),
    label: account.name,
    value: account.id.toString(),
  }));

  // Transform selected account for the SearchableDropdown
  const selectedOption: Option | undefined = selectedAccount
    ? {
        id: selectedAccount.id,
        label: selectedAccount.name,
        value: selectedAccount.id,
      }
    : undefined;

  const handleAccountSelect = (option: Option) => {
    const account = accounts.find(acc => acc.id.toString() === option.id);
    if (account) {
      const selectedAccountData: Account = {
        id: account.id.toString(),
        name: account.name,
        icon: account.name.charAt(0).toUpperCase(),
        color: '#20B2AA',
      };
      setSelectedAccount(selectedAccountData);
      if (onAccountSelect) {
        onAccountSelect(selectedAccountData);
      }
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <SearchableDropdown
        options={accountOptions}
        selectedOption={selectedOption}
        onOptionSelect={handleAccountSelect}
        placeholder="Select an account"
        searchPlaceholder="search account"
        loading={accountsLoading}
      />
    </Box>
  );
};

export default AccountSelector;
