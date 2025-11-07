import { Toaster } from 'react-hot-toast';
import React from 'react';

export function ToasterProvider() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#4F46E5',
          color: '#fff',
          padding: '12px 20px',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '500',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          display: 'flex',
          alignItems: 'center',
          maxWidth: '90vw',
          zIndex: 9999,
        },
        success: {
          style: {
            background: '#10B981',
          },
          icon: '✅',
        },
        error: {
          style: {
            background: '#EF4444',
          },
          icon: '❌',
        },
        loading: {
          style: {
            background: '#3B82F6',
          },
          icon: '⏳',
        },
      }}
    />
  );
}
