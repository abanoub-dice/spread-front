import { type RouteConfig, index, route } from '@react-router/dev/routes';

// Public routes that don't require authentication
const publicRoutes = [
  route('', 'layouts/Public/PublicLayout.tsx', [
    route('dicer/login', 'routes/public/login/Login.tsx'),
    route('client/login', 'routes/public/login/Login.tsx'),
    route('forgot-password', 'routes/public/forgot-password/ForgotPassword.tsx'),
    route('reset-password', 'routes/public/reset-password/ResetPassword.tsx'),
  ]),
] satisfies RouteConfig;

// Protected routes that require Dicer authentication
const dicerProtectedRoutes = [
  route('', 'layouts/Dicer/DicerLayout.tsx', [index('routes/home.tsx')]),
] satisfies RouteConfig;

// Protected routes that require Client authentication
const clientProtectedRoutes = [
  route('client', 'layouts/Client/ClientLayout.tsx', [index('routes/home.tsx')]),
] satisfies RouteConfig;

// Combine all routes
export default [...publicRoutes, ...dicerProtectedRoutes, ...clientProtectedRoutes] satisfies RouteConfig;

// List of public routes that don't require authentication
export const publicRoutesList: string[] = ['/dicer/login', '/client/login', '/forgot-password', '/reset-password'];

// Route constants
export const ADMIN_ROUTES = {
  USERS: '/admin-panel/users',
  PROJECT_CATEGORIES: '/admin-panel/categories/project',
  PRODUCTION_ITEMS: '/admin-panel/categories/productionItem',
  BASE: '/admin-panel',
} as const;
