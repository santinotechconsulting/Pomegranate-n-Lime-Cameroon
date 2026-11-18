import React, { useEffect, useRef, useState } from 'react';
import {
  Heart,
  LogOut,
  MapPin,
  Package,
  User,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Spinner } from '../../components/Spinner';

export type AccountSectionKey = 'profile' | 'orders' | 'wishlist' | 'addresses';

const NAV_ITEMS: Array<{ key: AccountSectionKey; label: string; href: string }> = [
  { key: 'profile', label: 'Profile', href: '/account' },
  { key: 'orders', label: 'Orders', href: '/account/orders' },
  { key: 'wishlist', label: 'My Wishlist', href: '/account/wishlist' },
  { key: 'addresses', label: 'Addresses', href: '/account/addresses' },
];

function renderNavIcon(key: AccountSectionKey, active: boolean) {
  const cls = 'h-5 w-5 shrink-0';
  if (key === 'profile') return <User className={cls} fill={active ? 'currentColor' : 'none'} />;
  if (key === 'orders') return <Package className={cls} />;
  if (key === 'wishlist') return <Heart className={cls} fill={active ? 'currentColor' : 'none'} />;
  return <MapPin className={cls} fill={active ? 'currentColor' : 'none'} />;
}

export function AccountSidebar({
  active,
  sidebarTitle,
}: {
  active: AccountSectionKey;
  sidebarTitle: string;
}) {
  const { navigate, refreshUser, showToast, openContact } = useStore();
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const updateTop = () => {
      const el = sidebarRef.current;
      if (!el) return;
      if (window.innerWidth < 1024) {
        el.style.top = '';
        return;
      }
      const h = el.offsetHeight;
      const vh = window.innerHeight;
      el.style.top = h + 144 > vh ? `${vh - h - 24}px` : '120px';
    };
    updateTop();
    const ro = new ResizeObserver(updateTop);
    if (sidebarRef.current) ro.observe(sidebarRef.current);
    window.addEventListener('resize', updateTop);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateTop);
    };
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch('/api/auth/sign-out', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'content-type': 'application/json' },
        body: '{}',
      });
      setConfirmOpen(false);
      await refreshUser();
      showToast('Logged out successfully');
      setTimeout(() => navigate('/'), 400);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <>
      <div
        ref={sidebarRef}
        className="relative z-20 flex w-full shrink-0 flex-col gap-5 lg:w-[340px] lg:sticky self-start"
        style={{ top: '120px' }}
      >
        {/* Mobile Horizontal Tabs */}
        <div className="flex lg:hidden flex-col gap-3 px-3">
          <div className="flex items-center justify-between">
            <h2 className="text-[20px] font-bold text-admiral">{sidebarTitle}</h2>
            <button
              type="button"
              onClick={() => setConfirmOpen(true)}
              className="flex items-center gap-1.5 text-[13px] text-antiquity hover:opacity-80 cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
          <div className="flex overflow-x-auto no-scrollbar gap-2 pb-1">
            {NAV_ITEMS.map((item) => {
              const isActive = item.key === active;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => navigate(item.href)}
                  className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-[14px] transition-colors shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-admiral text-primrose font-medium shadow-sm'
                      : 'bg-chiffon text-antiquity border border-champagne hover:bg-champagne/40'
                  }`}
                >
                  {renderNavIcon(item.key, isActive)}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Desktop Sticky Sidebar */}
        <div className="hidden lg:flex flex-col gap-5 w-full">
          <div className="flex flex-col rounded-lg border border-champagne bg-chiffon px-5 py-2">
            <div className="flex flex-col pt-5 pb-3 gap-3">
              <h2 className="text-[24px] font-bold leading-[29px] text-admiral">
                {sidebarTitle}
              </h2>
              <div className="h-px w-full bg-champagne" />
            </div>

            <nav className="flex flex-col gap-1" aria-label="Account navigation">
              {NAV_ITEMS.map((item) => {
                const isActive = item.key === active;
                return (
                  <a
                    key={item.key}
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(item.href);
                    }}
                    className={`flex items-center gap-4 rounded-xl px-5 py-4 text-[16px] leading-none transition-colors ${
                      isActive
                        ? 'bg-admiral text-primrose'
                        : 'bg-chiffon text-antiquity hover:bg-champagne/50'
                    }`}
                  >
                    {renderNavIcon(item.key, isActive)}
                    <span>{item.label}</span>
                  </a>
                );
              })}
            </nav>

            <div className="my-1 h-px w-full bg-champagne" />

            <button
              type="button"
              onClick={() => setConfirmOpen(true)}
              className="flex items-center gap-4 rounded-xl bg-chiffon px-5 py-4 text-left text-[16px] leading-none w-full cursor-pointer transition-colors hover:bg-champagne/50 text-antiquity"
            >
              <LogOut className="h-5 w-5 shrink-0" />
              <span>Logout</span>
            </button>
          </div>

          <div className="flex justify-center rounded-lg border border-champagne bg-chiffon px-5 py-4">
            <div className="flex w-full max-w-[300px] flex-col items-center gap-4 py-2">
              <img
                src="/logo-lockup.png"
                alt="Pomegranate 'n' Lime Cameroon"
                className="h-[132px] w-[170px] object-contain"
              />
              <button
                type="button"
                onClick={openContact}
                className="flex h-[43px] w-full items-center justify-center rounded-[40px] bg-antiquity px-8 py-4 text-[16px] leading-none text-chiffon hover:opacity-90 transition-opacity cursor-pointer"
              >
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Logout Modal */}
      {confirmOpen && (
        <div
          className="fixed inset-0 z-[180] flex items-center justify-center bg-black/40 px-4"
          onClick={() => !loggingOut && setConfirmOpen(false)}
        >
          <div
            role="dialog"
            aria-label="Confirm Logout"
            onClick={(e) => e.stopPropagation()}
            className="flex w-full max-w-sm flex-col gap-6 rounded-lg border border-champagne bg-chiffon p-6 shadow-xl"
          >
            <h2 className="text-[20px] font-bold text-admiral">Confirm Logout</h2>
            <p className="text-[16px] text-admiral">Are you sure you want to log out?</p>
            <div className="mt-2 flex w-full gap-4">
              <button
                type="button"
                disabled={loggingOut}
                onClick={() => setConfirmOpen(false)}
                className="flex-1 rounded-[40px] border border-admiral py-2.5 text-[16px] text-admiral hover:bg-champagne cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={loggingOut}
                onClick={handleLogout}
                className="flex-1 rounded-[40px] bg-admiral py-2.5 text-[16px] text-chiffon hover:opacity-90 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loggingOut && <Spinner size="xs" color="light" />}
                <span>{loggingOut ? 'Logging out...' : 'Logout'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
