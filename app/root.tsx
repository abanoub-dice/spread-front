import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
  useNavigate,
  matchPath,
} from 'react-router';
import type { Route } from './+types/root';
import './app.css';
import { useState, useEffect, useRef } from 'react';
import { publicRoutesList } from './routes';
import { CssBaseline, ThemeProvider as MUIThemeProvider } from '@mui/material';
import { ThemeProvider as EmotionThemeProvider } from '@emotion/react';
import theme from './utils/theme/theme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { store } from './utils/store/store';
import { useAppSelector, useAppDispatch } from './utils/store/hooks/hooks';
import { checkAuth } from './utils/store/slices/userSlice';
import { Loader } from './components/Loader';
import { hideLoader, showLoader } from './utils/store/slices/loaderSlice';
import { ToasterProvider } from './components/Toaster';
import Dialog from './components/Dialog';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
    },
  },
});

function ClientOnly({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return <>{children}</>;
}

export const links: Route.LinksFunction = () => [
  { rel: 'icon', type: 'image/png', href: '/favicon.png' },
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

// New component to handle authentication logic
function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { authenticated } = useAppSelector(state => state.user.data);
  const isLoading = useAppSelector(state => state.loader.isLoading);
  const authChecked = useRef(false);

  // Check if token exists
  const hasToken = localStorage.getItem('token');

  useEffect(() => {
    const isPublicRoute = publicRoutesList.some(route => {
      const pattern = route.replace(/:[^/]+/g, '*');
      return matchPath(pattern, location.pathname);
    });

    // Handle public routes first - redirect immediately if token exists
    if (isPublicRoute) {
      if (hasToken) {
        dispatch(showLoader());
        navigate('/', { replace: true });
        dispatch(hideLoader());
        return;
      }
    }

    if (!isPublicRoute) {
      if (!hasToken) {
        navigate('/dicer/login', { replace: true });
        return;
      }

      if (hasToken && !authenticated && !authChecked.current) {
        authChecked.current = true;
        dispatch(showLoader());
        dispatch(checkAuth());
        dispatch(hideLoader());
        return;
      }
    }
  }, [dispatch, hasToken, authenticated, location.pathname, navigate]);

  // Show loader only if we have a token and are checking auth
  if (hasToken && !authenticated) {
    return <Loader />;
  }

  return (
    <>
      {isLoading && <Loader />}
      <Dialog />
      <Outlet />
    </>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MUIThemeProvider theme={theme}>
        <EmotionThemeProvider theme={theme}>
          <CssBaseline />
          <ClientOnly>
            <Provider store={store}>
              <ToasterProvider>
                <AppContent />
              </ToasterProvider>
            </Provider>
          </ClientOnly>
        </EmotionThemeProvider>
      </MUIThemeProvider>
    </QueryClientProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!';
  let details = 'An unexpected error occurred.';
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error';
    details =
      error.status === 404 ? 'The requested page could not be found.' : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
