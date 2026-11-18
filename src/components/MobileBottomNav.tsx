import React from 'react';
import { Grid2X2, Home, Layers, Menu } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export function MobileBottomNav() {
  const { currentPath, navigate } = useStore();

  const items = [
    { label: 'Home', href: '/', icon: Home, active: currentPath === '/' },
    {
      label: 'Collections',
      href: '/collections',
      icon: Layers,
      active: currentPath.startsWith('/collections'),
    },
    {
      label: 'Products',
      href: '/products',
      icon: Grid2X2,
      active: currentPath.startsWith('/products'),
    },
    {
      label: 'Menu',
      href: '/menu',
      icon: Menu,
      active: currentPath === '/menu' || currentPath.startsWith('/account'),
    },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed bottom-0 inset-x-0 z-40 flex h-16 items-center justify-around border-t border-champagne/40 bg-admiral text-chiffon lg:hidden shadow-[0_-4px_18px_rgba(0,0,0,0.2)]"
    >
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <a
            key={item.href}
            href={item.href}
            onClick={(e) => {
              e.preventDefault();
              navigate(item.href);
            }}
            className={`flex flex-1 flex-col items-center justify-center gap-1 py-1.5 text-[11px] font-sans transition-colors ${
              item.active ? 'text-primrose font-semibold' : 'text-chiffon/80'
            }`}
          >
            <Icon className="h-5 w-5" />
            <span>{item.label}</span>
          </a>
        );
      })}
    </nav>
  );
}
