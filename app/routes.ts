import { type RouteConfig, index, route } from '@react-router/dev/routes';

const routes = [
  // Client routes with ClientLayout
  route('client', 'layouts/Client/ClientLayout.tsx', [
    index('routes/client/protected/ClientHome.tsx'),
  ]),
  
  // Dicer routes with DicerLayout
  route('dicer', 'layouts/Dicer/DicerLayout.tsx', [
    index('routes/dicer/protected/calendar/CalendarView.tsx'),
    route('content', 'routes/dicer/protected/content/ContentManager.tsx'),
    route('content/:id', 'routes/dicer/protected/PostView.tsx'),
    route('upload', 'routes/dicer/protected/UploadContent.tsx'),
    route('insights', 'routes/dicer/protected/insights/Insights.tsx'),
    route('admin', 'routes/dicer/protected/admin/AdminPanel.tsx', [
      route('clients', 'routes/dicer/protected/admin/Clients.tsx'),
      route('accounts', 'routes/dicer/protected/admin/Accounts.tsx'),
      route('team', 'routes/dicer/protected/admin/TeamMembers.tsx'),
    ]),
  ]),
  
  // Public client routes
  route('client', 'layouts/Client/ClientPublicLayout.tsx', [
    route('login', 'routes/client/public/Login.tsx'),
    route('forgot-password', 'routes/client/public/ForgotPassword.tsx'),
    route('reset-password', 'routes/client/public/ResetPassword.tsx'),
  ]),

  // Public dicer routes
  route('dicer', 'layouts/Dicer/DicerPublicLayout.tsx', [
    route('login', 'routes/dicer/public/Login.tsx'),
    route('forgot-password', 'routes/dicer/public/ForgotPassword.tsx'),
    route('reset-password', 'routes/dicer/public/ResetPassword.tsx'),
  ]),
] satisfies RouteConfig;

export default routes;

// List of public routes that don't require authentication
export const publicRoutesList: string[] = [
  '/dicer/login',
  '/client/login',
  '/forgot-password',
  '/reset-password',
];

// Route constants
export const ADMIN_ROUTES = {
  USERS: '/admin-panel/users',
  PROJECT_CATEGORIES: '/admin-panel/categories/project',
  PRODUCTION_ITEMS: '/admin-panel/categories/productionItem',
  BASE: '/admin-panel',
} as const;
