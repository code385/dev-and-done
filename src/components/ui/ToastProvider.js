'use client';

import { Toaster } from 'react-hot-toast';

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: 'var(--color-card)',
          color: 'var(--color-foreground)',
          border: '1px solid var(--color-border)',
          borderRadius: '0.5rem',
          padding: '1rem',
        },
        success: {
          iconTheme: {
            primary: 'var(--color-success)',
            secondary: 'var(--color-background)',
          },
        },
        error: {
          iconTheme: {
            primary: 'var(--color-error)',
            secondary: 'var(--color-background)',
          },
        },
      }}
    />
  );
}

