import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
        <Toaster
          position='top-right'
          toastOptions={{
            className: 'font-outfit',
            style: {
              background: '#fff',
              color: '#101828',
              borderRadius: '12px',
              boxShadow: '0px 4px 8px -2px rgba(16, 24, 40, 0.1)',
            },
            success: {
              iconTheme: {
                primary: '#12B76A',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#F04438',
                secondary: '#fff',
              },
            },
          }}
        />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
);
