import axiosInstance from './axiosInstance';

export interface Account {
  id: number;
  name: string;
  logo: string;
  pmp_link: string | null;
  description: string;
  monthly_posts_limit: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

// ------------------------------------------------------------------------------------------------ //
// !Dicer APIs
export const getDicerAccounts = async (): Promise<Account[]> => {
  const res = await axiosInstance.get('/api/dicer/accounts');
  return res.data;
}; 