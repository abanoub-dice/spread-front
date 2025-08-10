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


export interface LoginCredentials {
  email: string;
  password: string;
  turnstileToken?: string;
}

export interface LoginResponse {
  token: string;
  user: AppUser;
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

export enum UserRole {
  ADMIN = 'admin',
  ACCOUNT_MANAGER = 'Account Manager',
  SOCIAL_MEDIA_SPECIALIST = 'Social media specialist'
} 
export interface DicerUser {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
  role: UserRole;
}

export interface ClientUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  account_id: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export type AppUser = DicerUser | ClientUser; 