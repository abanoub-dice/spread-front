import type { LoginCredentials, LoginResponse, AppUser } from '../interfaces/user';
import axiosInstance from './axiosInstance';

// ------------------------------------------------------------------------------------------------ //
// !Auth
export const logout = async () => {
  const res = await axiosInstance.post('/v1/auth/logout');
  return res;
};

export const userLogin = async (
  data: LoginCredentials,
  userType: 'dicer' | 'client'
): Promise<LoginResponse> => {
  const endpoint = `/${userType}/auth/login`;
  const res = await axiosInstance.post(endpoint, data);

  return res.data;
};

export const getCurrentUser = async (userType: 'dicer' | 'client'): Promise<{ user: AppUser }> => {
  const res = await axiosInstance.get(`/${userType}/auth/user`);
  return res.data;
};

export const sendResetLink = async (
  data: { email: string; turnstileToken: string },
  userType: 'dicer' | 'client'
): Promise<any> => {
  const endpoint = `/${userType}/auth/forgot-password`;
  const res = await axiosInstance.post(endpoint, data);
  return res.data;
};

export const resetPassword = async (
  data: { token: string; email: string; password: string; password_confirmation: string },
  userType: 'dicer' | 'client'
): Promise<any> => {
  const endpoint = `/${userType}/auth/reset-password`;
  const res = await axiosInstance.post(endpoint, data);
  return res.data;
};
