import { type RouteConfig, index, route } from '@react-router/dev/routes';

const clientPublicRoutes = [
  route('client', 'layouts/Client/ClientPublicLayout.tsx', [
    route('login', 'routes/client/public/Login.tsx'),
    route('forgot-password', 'routes/client/public/ForgotPassword.tsx'),
    route('reset-password', 'routes/client/public/ResetPassword.tsx'),
  ]),
] satisfies RouteConfig;

const dicerPublicRoutes = [
  route('dicer', 'layouts/Dicer/DicerPublicLayout.tsx', [
    route('login', 'routes/dicer/public/Login.tsx'),
    route('forgot-password', 'routes/dicer/public/ForgotPassword.tsx'),
    route('reset-password', 'routes/dicer/public/ResetPassword.tsx'),
  ]),
] satisfies RouteConfig;

// Public routes that don't require authentication
const publicRoutes = [
  ...dicerPublicRoutes,
  ...clientPublicRoutes,
] satisfies RouteConfig;

// // Protected routes that require Dicer authentication
// const dicerProtectedRoutes = [
//   route('dicer', 'layouts/Dicer/DicerLayout.tsx', [
//     index('routes/Home.tsx'),
//   ]),
// ] satisfies RouteConfig;

// // Protected routes that require Client authentication
// const clientProtectedRoutes = [
//   route('client', 'layouts/Client/ClientLayout.tsx', [
//     index('routes/Home.tsx'),
//   ]),
// ] satisfies RouteConfig;

// Combine all routes
export default [...publicRoutes] satisfies RouteConfig;

// List of public routes that don't require authentication
export const publicRoutesList: string[] = ['/dicer/login', '/client/login', '/forgot-password', '/reset-password'];

// Route constants
export const ADMIN_ROUTES = {
  USERS: '/admin-panel/users',
  PROJECT_CATEGORIES: '/admin-panel/categories/project',
  PRODUCTION_ITEMS: '/admin-panel/categories/productionItem',
  BASE: '/admin-panel',
} as const;
