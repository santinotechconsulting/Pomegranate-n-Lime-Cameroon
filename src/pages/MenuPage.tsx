import React from 'react';
import { ChevronRight, Heart, MapPin, Package, User } from 'lucide-react';
import type { CurrencyCode } from '../data/cameroon';
import { useDocumentSeo, useStore } from '../context/StoreContext';

export function MenuPage() {
  const { user, collections, currency, setCurrency, navigate, openContact } = useStore();

  useDocumentSeo({
    title: "Directory & Menu | Pomegranate 'n' Lime Cameroon",
    description: 'Browse collections, story chapters, account dashboard, FAQs, and Cameroon atelier links.',
    canonicalPath: '/menu',
  });

  const navLink = (label: string, href: string) => (
    <a
      key={href}
      href={href}
      onClick={(e) => {
        e.preventDefault();
        navigate(href);
      }}
      className="flex items-center justify-between rounded-xl border border-champagne bg-chiffon px-4 py-3.5 text-[15px] font-serif text-admiral hover:bg-biege/60 transition-colors"
    >
      <span>{label}</span>
      <ChevronRight className="h-4 w-4 text-antiquity" />
    </a>
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      <h1 className="text-[28px] sm:text-[36px] font-display text-admiral mb-6">Menu</h1>

      {/* Account Quick Panel */}
      <div className="mb-8 rounded-2xl border border-champagne bg-biege/50 p-5">
        {user ? (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[12px] font-sans uppercase tracking-wider text-antiquity">
                  Signed In
                </div>
                <div className="text-[20px] font-serif text-admiral">{user.name}</div>
                <div className="text-[13px] text-admiral/70">{user.email}</div>
              </div>
              <button
                type="button"
                onClick={() => navigate('/account')}
                className="rounded-full bg-admiral px-5 py-2 text-[13px] text-chiffon cursor-pointer"
              >
                Dashboard
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
              {[
                { label: 'Profile', href: '/account', Icon: User },
                { label: 'Orders', href: '/account/orders', Icon: Package },
                { label: 'Wishlist', href: '/account/wishlist', Icon: Heart },
                { label: 'Addresses', href: '/account/addresses', Icon: MapPin },
              ].map((item) => (
                <button
                  key={item.href}
                  type="button"
                  onClick={() => navigate(item.href)}
                  className="flex items-center gap-2 rounded-lg border border-champagne bg-chiffon px-3 py-2 text-[13px] text-admiral hover:bg-champagne/50 cursor-pointer"
                >
                  <item.Icon className="h-4 w-4 text-antiquity" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-[18px] font-serif text-admiral">Welcome Host</div>
              <div className="text-[13px] text-admiral/70">
                Sign in to manage Cameroon deliveries, wishlist &amp; invoices
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="rounded-full bg-admiral px-5 py-2 text-[13px] text-chiffon cursor-pointer"
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="rounded-full border border-antiquity px-5 py-2 text-[13px] text-antiquity cursor-pointer"
              >
                Register
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Collections */}
      <div className="mb-7">
        <h2 className="text-[13px] font-sans uppercase tracking-[0.16em] text-antiquity mb-3">
          Collections
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {navLink('All Products', '/products')}
          {collections.map((c) => navLink(c.name, `/collections/${c.slug}`))}
        </div>
      </div>

      {/* Our World */}
      <div className="mb-7">
        <h2 className="text-[13px] font-sans uppercase tracking-[0.16em] text-antiquity mb-3">
          Our World &amp; Support
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {navLink('Our Story', '/our-story')}
          {navLink('Brand Story', '/our-story/brand-story')}
          {navLink('Product Story', '/our-story/product-story')}
          {navLink('Work Story', '/our-story/work-story')}
          {navLink('Journal & Blogs', '/our-story/blogs')}
          {navLink('FAQs', '/faq')}
          {navLink('Track Order', '/track-order')}
          <button
            type="button"
            onClick={openContact}
            className="flex items-center justify-between rounded-xl border border-champagne bg-chiffon px-4 py-3.5 text-[15px] font-serif text-admiral hover:bg-biege/60 transition-colors cursor-pointer"
          >
            <span>Contact Cameroon Atelier</span>
            <ChevronRight className="h-4 w-4 text-antiquity" />
          </button>
        </div>
      </div>

      {/* Currency Switcher */}
      <div className="rounded-2xl border border-champagne bg-chiffon p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-[15px] font-serif font-semibold text-admiral">Display Currency</div>
          <div className="text-[12.5px] text-admiral/70">Default Cameroon FCFA (XAF) or global diaspora</div>
        </div>
        <div className="flex rounded-full border border-champagne bg-biege/60 p-1 gap-1">
          {(['XAF', 'USD', 'EUR'] as CurrencyCode[]).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCurrency(c)}
              className={`rounded-full px-4 py-1.5 text-[12px] font-sans font-semibold cursor-pointer ${
                currency === c ? 'bg-admiral text-primrose' : 'text-admiral/75'
              }`}
            >
              {c === 'XAF' ? 'FCFA' : c}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
