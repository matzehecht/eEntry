/* eslint-disable import/no-unused-modules */
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './index.css';
import './i18n';
import { Providers } from './Providers';

// eslint-disable-next-line no-type-assertion/no-type-assertion
createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Providers>
      <App />
    </Providers>
  </React.StrictMode>
);
