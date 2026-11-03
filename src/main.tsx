import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import '@fontsource-variable/martian-mono/wdth.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import '@fontsource/ibm-plex-mono/600.css';
import './styles/global.css';
import { WalletProvider } from './lib/wallet';
import { router } from './routes/AppRoutes';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WalletProvider>
      <RouterProvider router={router} future={{ v7_startTransition: true }} />
    </WalletProvider>
  </StrictMode>,
);
