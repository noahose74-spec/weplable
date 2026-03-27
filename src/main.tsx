import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { AppStateProvider } from './state/AppStateContext';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppStateProvider>
      <RouterProvider router={router} />
    </AppStateProvider>
  </React.StrictMode>,
);
