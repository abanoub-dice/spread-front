import { UserRole } from './role';

export interface UserSummery {
  id: number;
  email: string;
  name: string;
  role: UserRole;
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isEmailVerified: boolean;
  resetPasswordToken: string | null;
  resetPasswordExpires: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  userType?: 'dicer' | 'client';
}

export interface LoginResponse {
  access_token: string;
  user: AuthUser;
}

export interface UsersResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface UpdateUserData {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface UserFormData extends Omit<CreateUserData, 'password'> {
  confirmPassword?: string;
  password?: string;
} 