import { createBrowserRouter, Navigate } from 'react-router-dom';
import { RootLayout } from '../layouts/RootLayout';
import { Docs } from '../pages/Docs';
import { Home } from '../pages/Home';
import { Hunt } from '../pages/Hunt';
import { Cookies, Privacy, Terms } from '../pages/Legal';
import { NotFound } from '../pages/NotFound';
import { ProofDetail, VerdictDetail } from '../pages/ProofDetail';
import { Proofs } from '../pages/Proofs';
import { Vault } from '../pages/Vault';
import { Verifier } from '../pages/Verifier';
import { Wish } from '../pages/Wish';
import { Wishes } from '../pages/Wishes';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'proofs', element: <Proofs /> },
      { path: 'proofs/v/:id', element: <VerdictDetail /> },
      { path: 'proofs/:id', element: <ProofDetail /> },
      { path: 'wishes', element: <Wishes /> },
      { path: 'wish', element: <Wish /> },
      { path: 'hunt', element: <Hunt /> },
      { path: 'verifier', element: <Verifier /> },
      { path: 'vault', element: <Vault /> },
      { path: 'docs', element: <Docs /> },
      { path: 'docs/pod', element: <Navigate to="/docs/token" replace /> },
      { path: 'docs/:slug', element: <Docs /> },
      { path: 'terms', element: <Terms /> },
      { path: 'privacy', element: <Privacy /> },
      { path: 'cookies', element: <Cookies /> },
      { path: '*', element: <NotFound /> },
    ],
  },
], {
  future: { v7_relativeSplatPath: true, v7_fetcherPersist: true, v7_normalizeFormMethod: true, v7_partialHydration: true, v7_skipActionErrorRevalidation: true },
});
