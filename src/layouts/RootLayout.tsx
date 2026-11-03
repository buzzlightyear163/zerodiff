import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { WalletModal } from '../components/WalletModal';
import { useReveal } from '../hooks/useReveal';

function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        el.scrollIntoView();
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

export function RootLayout() {
  const { pathname } = useLocation();
  useReveal(pathname);
  return (
    <>
      <ScrollManager />
      <div className="gridlines" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
      <div className="grain" aria-hidden="true" />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <WalletModal />
    </>
  );
}
