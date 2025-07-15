import type { LoginCredentials, LoginResponse, AppUser } from '../interfaces/user';
import axiosInstance from './axiosInstance';

// ------------------------------------------------------------------------------------------------ //
// !Auth
export const logout = async () => {
  const res = await axiosInstance.post('/v1/auth/logout');
  return res;
};

export const userLogin = async (data: LoginCredentials): Promise<LoginResponse> => {
  const res = await axiosInstance.post('/v1/auth/login', data);

  return res.data;
};

export const getCurrentUser = async (): Promise<AppUser> => {
  const res = await axiosInstance.get('/v1/auth/profile');
  return res.data;
};

export const sendResetLink = async (data: { email: string }): Promise<any> => {
	const res = await axiosInstance.post('/v1/auth/forgot-password', data);
	return res.data;
};

export const resetPassword = async (data: { token: string; password: string }): Promise<any> => {
	const res = await axiosInstance.put(`/v1/auth/reset-password?token=${data.token}`, { password: data.password });
	return res.data;
};
