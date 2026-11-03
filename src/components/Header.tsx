import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { BRAND, short } from '../data/brand';
import { useWallet } from '../lib/wallet';
import { Seal, XIcon } from './Icons';

export const NAV = [
  { to: '/proofs', label: 'Proofs' },
  { to: '/wishes', label: 'Wishes' },
  { to: '/hunt', label: 'Hunt' },
  { to: '/verifier', label: 'Verifier' },
  { to: '/docs', label: 'Docs' },
];

const MOBILE_EXTRA = [
  { to: '/wish', label: 'Sign a wish' },
  { to: '/vault', label: 'Vault' },
];

export function WalletButton() {
  const { status, address, openModal, disconnect } = useWallet();
  if (status === 'connected' && address) {
    return (
      <button type="button" className="pill white" onClick={disconnect} title="Disconnect">
        {short(address, 4, 4)}
      </button>
    );
  }
  return (
    <button type="button" className="pill white" onClick={openModal} disabled={status === 'connecting'}>
      {status === 'connecting' ? 'Connecting...' : 'Connect wallet'}
    </button>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <header className="hdr">
        <Link className="logo" aria-label={`${BRAND.name}, home`} to="/">
          <img src={BRAND.mark} alt={BRAND.name} width={44} height={44} />
        </Link>
        <nav aria-label="Main">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} className={({ isActive }) => (isActive ? 'on' : '')}>
              <Seal />
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="right">
          <a href={BRAND.xUrl} target="_blank" rel="noopener" aria-label={`${BRAND.name} on X`}>
            <XIcon />
          </a>
          <WalletButton />
          <button className="burger" type="button" aria-label="Menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>
      {open && (
        <div className="mnav">
          {[...NAV, ...MOBILE_EXTRA].map((n) => (
            <Link key={n.to} to={n.to} onClick={() => setOpen(false)}>
              {n.label}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
