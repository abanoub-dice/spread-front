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
    queryFn: () => {
      return axiosInstance.get('/v1/dicer/accounts');
    },
    // Add dummy data for testing
    initialData: [
      {
        id: 1,
        name: 'Instagram Account 1',
        logo: 'https://via.placeholder.com/40',
        pmp_link: null,
        description: 'Main Instagram business account',
        monthly_posts_limit: 30,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        deleted_at: null,
      },
      {
        id: 2,
        name: 'Facebook Business Page saddsad ',
        logo: 'https://via.placeholder.com/40',
        pmp_link: null,
        description: 'Company Facebook page',
        monthly_posts_limit: 25,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        deleted_at: null,
      },
      {
        id: 3,
        name: 'Twitter Profile',
        logo: 'https://via.placeholder.com/40',
        pmp_link: null,
        description: 'Official Twitter handle',
        monthly_posts_limit: 50,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        deleted_at: null,
      },
      {
        id: 4,
        name: 'LinkedIn Company Page',
        logo: 'https://via.placeholder.com/40',
        pmp_link: null,
        description: 'Professional LinkedIn presence',
        monthly_posts_limit: 20,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        deleted_at: null,
      },
      {
        id: 5,
        name: 'TikTok Creator Account',
        logo: 'https://via.placeholder.com/40',
        pmp_link: null,
        description: 'TikTok content creator account',
        monthly_posts_limit: 40,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        deleted_at: null,
      },
    ],
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
