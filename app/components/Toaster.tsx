import { Snackbar, Alert, Slide } from '@mui/material';
import type { AlertColor, SlideProps } from '@mui/material';
import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';

interface Toast {
  id: string;
  message: string;
  severity: AlertColor;
  duration: number;
}

interface ToasterContextType {
  showToaster: (message: string, severity?: AlertColor, duration?: number) => void;
}

const ToasterContext = createContext<ToasterContextType | null>(null);

export const useToaster = () => {
  const context = useContext(ToasterContext);
  if (!context) {
    throw new Error('useToaster must be used within a ToasterProvider');
  }
  return context;
};

interface ToasterProviderProps {
  children: ReactNode;
}

// Helper for unique ID generation
const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 10);
};

export const ToasterProvider: React.FC<ToasterProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToaster = useCallback((message: string, severity: AlertColor = 'info', duration: number = 3000) => {
    const id = generateId();
    setToasts((prevToasts) => [...prevToasts, { id, message, severity, duration }]);
  }, []);

  const handleClose = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  // Helper to calculate bottom offset for each toast
  const getBottomOffset = useCallback((index: number) => 20 + index * 60, []);

  // Memoize the rendered snackbars for performance
  const snackbars = useMemo(() => (
    toasts.map((toast, idx) => (
      <Snackbar
        key={toast.id}
        open
        autoHideDuration={toast.duration}
        onClose={() => handleClose(toast.id)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        slots={{ transition: Slide }}
        slotProps={{ transition: { direction: 'left' } as SlideProps }}
        sx={{
          position: 'fixed',
          bottom: `${getBottomOffset(toasts.length - 1 - idx)}px !important`,
          right: '20px !important',
        }}
      >
        <Alert onClose={() => handleClose(toast.id)} severity={toast.severity} sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    ))
  ), [toasts, handleClose, getBottomOffset]);

  return (
    <ToasterContext.Provider value={{ showToaster }}>
      {children}
      {snackbars}
    </ToasterContext.Provider>
  );
}; 