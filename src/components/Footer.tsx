import React from 'react';
import { CAMEROON_CONTACT, type CurrencyCode } from '../data/cameroon';
import { useStore } from '../context/StoreContext';

export function Footer() {
  const { navigate, openContact, currency, setCurrency } = useStore();

  const linkClass =
    'text-[13px] sm:text-[14px] uppercase tracking-wide text-admiral/85 hover:text-antiquity transition-colors cursor-pointer text-left';

  return (
    <footer className="relative border-t border-champagne bg-biege/60 text-admiral pb-20 lg:pb-0">
      <div className="mx-auto max-w-[1920px] px-5 sm:px-8 lg:px-20 xl:px-[140px] py-12 lg:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Column */}
          <div className="flex flex-col items-start gap-4">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigate('/');
              }}
              className="block"
            >
              <img
                src="/logo-lockup.png"
                alt="Pomegranate 'n' Lime Cameroon"
                className="h-28 w-auto object-contain"
              />
            </a>
            <p className="text-[14px] leading-relaxed text-admiral/80 max-w-xs">
              Mastering the Art of Hosting in Cameroon with bespoke hand-embroidered napery, table
              mats, runners, and tableware.
            </p>
            <p className="text-[12px] text-admiral/70">
              {CAMEROON_CONTACT.doualaAtelier}
              <br />
              {CAMEROON_CONTACT.yaoundeSalon}
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-3">
            <h3 className="text-[15px] font-bold uppercase tracking-wider text-antiquity">
              Quick Links
            </h3>
            <ul className="flex flex-col gap-2.5">
              <li>
                <a href="/collections" onClick={(e) => { e.preventDefault(); navigate('/collections'); }} className={linkClass}>
                  Collections
                </a>
              </li>
              <li>
                <a href="/products" onClick={(e) => { e.preventDefault(); navigate('/products'); }} className={linkClass}>
                  Products
                </a>
              </li>
              <li>
                <a href="/our-story" onClick={(e) => { e.preventDefault(); navigate('/our-story'); }} className={linkClass}>
                  Our Story
                </a>
              </li>
              <li>
                <a href="/our-story/product-story" onClick={(e) => { e.preventDefault(); navigate('/our-story/product-story'); }} className={linkClass}>
                  Product Story
                </a>
              </li>
              <li>
                <a href="/our-story/brand-story" onClick={(e) => { e.preventDefault(); navigate('/our-story/brand-story'); }} className={linkClass}>
                  Brand Story
                </a>
              </li>
              <li>
                <a href="/our-story/work-story" onClick={(e) => { e.preventDefault(); navigate('/our-story/work-story'); }} className={linkClass}>
                  Work Story
                </a>
              </li>
              <li>
                <a href="/our-story/blogs" onClick={(e) => { e.preventDefault(); navigate('/our-story/blogs'); }} className={linkClass}>
                  Blogs
                </a>
              </li>
            </ul>
          </div>

          {/* Help & Policies */}
          <div className="flex flex-col gap-3">
            <h3 className="text-[15px] font-bold uppercase tracking-wider text-antiquity">
              Help
            </h3>
            <ul className="flex flex-col gap-2.5">
              <li>
                <a href="/faq" onClick={(e) => { e.preventDefault(); navigate('/faq'); }} className={linkClass}>
                  FAQs
                </a>
              </li>
              <li>
                <a href="/track-order" onClick={(e) => { e.preventDefault(); navigate('/track-order'); }} className={linkClass}>
                  Track Order
                </a>
              </li>
              <li>
                <a href="/account" onClick={(e) => { e.preventDefault(); navigate('/account'); }} className={linkClass}>
                  My Account Dashboard
                </a>
              </li>
              <li>
                <a href="/policies/privacy-policy" onClick={(e) => { e.preventDefault(); navigate('/policies/privacy-policy'); }} className={linkClass}>
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/policies/terms-of-use" onClick={(e) => { e.preventDefault(); navigate('/policies/terms-of-use'); }} className={linkClass}>
                  Terms of Use
                </a>
              </li>
              <li>
                <a href="/policies/returns-exchanges" onClick={(e) => { e.preventDefault(); navigate('/policies/returns-exchanges'); }} className={linkClass}>
                  Returns &amp; Exchanges
                </a>
              </li>
              <li>
                <a href="/policies/general-terms-and-conditions" onClick={(e) => { e.preventDefault(); navigate('/policies/general-terms-and-conditions'); }} className={linkClass}>
                  General Terms &amp; Conditions
                </a>
              </li>
            </ul>
          </div>

          {/* Contact, Currency & Social */}
          <div className="flex flex-col gap-4">
            <h3 className="text-[15px] font-bold uppercase tracking-wider text-antiquity">
              Contact
            </h3>
            <div className="flex flex-col gap-2 text-[14px]">
              <p>
                <span className="font-semibold">EMAIL: </span>
                <a href={`mailto:${CAMEROON_CONTACT.email}`} className="hover:text-antiquity underline-offset-2 hover:underline">
                  {CAMEROON_CONTACT.email}
                </a>
              </p>
              <p>
                <span className="font-semibold">WHATSAPP: </span>
                <a
                  href={`https://wa.me/${CAMEROON_CONTACT.whatsappDigits}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-antiquity tabular-nums"
                >
                  {CAMEROON_CONTACT.whatsappDisplay}
                </a>
              </p>
              <div>
                <button
                  type="button"
                  onClick={openContact}
                  className="mt-1 rounded-[40px] border border-antiquity px-5 py-2 text-[13px] font-medium text-antiquity hover:bg-antiquity hover:text-chiffon transition-colors cursor-pointer"
                >
                  Lets Talk
                </button>
              </div>
            </div>

            {/* Currency Switcher for Cameroon & Global Buyers */}
            <div className="pt-2">
              <div className="text-[12px] font-bold uppercase tracking-wider text-antiquity mb-2">
                Display Currency
              </div>
              <div className="inline-flex rounded-full border border-champagne bg-chiffon p-1 gap-1">
                {(['XAF', 'USD', 'EUR'] as CurrencyCode[]).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCurrency(c)}
                    className={`rounded-full px-3 py-1 text-[12px] font-sans font-semibold transition-colors cursor-pointer ${
                      currency === c
                        ? 'bg-admiral text-primrose'
                        : 'text-admiral/75 hover:bg-champagne/50'
                    }`}
                  >
                    {c === 'XAF' ? 'FCFA' : c}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <h4 className="text-[14px] font-bold uppercase text-antiquity mb-3">
                FOLLOW US ON
              </h4>
              <div className="flex items-center gap-6">
                <a
                  href="https://www.instagram.com/pomegranate_n_lime/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="transition-transform hover:scale-110"
                >
                  <svg className="h-[27px] w-[27px]" viewBox="0 0 27 27" fill="none">
                    <path d="M19.48 2.25H7.52C4.61 2.25 2.25 4.61 2.25 7.52V19.48C2.25 22.39 4.61 24.75 7.52 24.75H19.48C22.39 24.75 24.75 22.39 24.75 19.48V7.52C24.75 4.61 22.39 2.25 19.48 2.25Z" fill="#AC6628" />
                    <circle cx="13.5" cy="13.5" r="4" stroke="white" strokeWidth="1.8" />
                    <circle cx="19" cy="8" r="1.2" fill="white" />
                  </svg>
                </a>
                <a
                  href="https://www.facebook.com/profile.php?id=61593951404879"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="transition-transform hover:scale-110"
                >
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
                    <path d="M24 12C24 5.37 18.63 0 12 0C5.37 0 0 5.37 0 12C0 17.99 4.39 22.95 10.12 23.85V15.47H7.08V12H10.12V9.36C10.12 6.35 11.92 4.69 14.66 4.69C15.97 4.69 17.34 4.92 17.34 4.92V7.88H15.83C14.34 7.88 13.88 8.8 13.88 9.75V12H17.2L16.67 15.47H13.88V23.85C19.61 22.95 24 17.99 24 12Z" fill="#AC6628" />
                    <path d="M16.67 15.47L17.2 12H13.88V9.75C13.88 8.8 14.34 7.88 15.83 7.88H17.34V4.92C17.34 4.92 15.97 4.69 14.66 4.69C11.92 4.69 10.12 6.35 10.12 9.36V12H7.08V15.47H10.12V23.85C10.75 23.95 11.37 24 12 24C12.63 24 13.25 23.95 13.88 23.85V15.47H16.67Z" fill="white" />
                  </svg>
                </a>
                <a
                  href="https://pin.it/7Czv5OduY"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Pinterest"
                  className="transition-transform hover:scale-110"
                >
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
                    <path d="M0 12C0 16.91 2.95 21.14 7.18 22.99C7.15 22.15 7.18 21.15 7.39 20.24C7.62 19.26 8.94 13.7 8.94 13.7C8.94 13.7 8.55 12.93 8.55 11.8C8.55 10.02 9.58 8.69 10.87 8.69C11.96 8.69 12.49 9.51 12.49 10.49C12.49 11.59 11.79 13.23 11.43 14.75C11.13 16.02 12.06 17.06 13.32 17.06C15.59 17.06 17.12 14.14 17.12 10.68C17.12 8.05 15.35 6.08 12.13 6.08C8.49 6.08 6.22 8.8 6.22 11.83C6.22 12.88 6.53 13.61 7.01 14.19C7.24 14.45 7.27 14.55 7.19 14.85C7.13 15.07 7 15.61 6.94 15.82C6.86 16.12 6.62 16.23 6.34 16.12C4.67 15.43 3.88 13.6 3.88 11.53C3.88 8.12 6.76 4.04 12.46 4.04C17.04 4.04 20.06 7.35 20.06 10.91C20.06 15.62 17.44 19.13 13.58 19.13C12.29 19.13 11.07 18.43 10.65 17.64C10.65 17.64 9.95 20.4 9.81 20.94C9.55 21.86 9.05 22.79 8.6 23.51C9.7 23.84 10.85 24 12 24C18.63 24 24 18.63 24 12C24 5.37 18.63 0 12 0C5.37 0 0 5.37 0 12Z" fill="#AC6628" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative border-t border-admiral/20 py-6 text-center font-medium text-admiral">
        <div className="mx-auto flex max-w-[1920px] flex-col items-center justify-center gap-1 px-4 sm:px-6 lg:px-20">
          <div className="text-[14px]">
            © {new Date().getFullYear()} Pomegranate &apos;n&apos; Lime Cameroon. All rights reserved.
          </div>
          <div className="text-[12px] text-admiral/70">
            Bonapriso Atelier, Douala · Bastos Salon, Yaoundé · Global Dispatch
          </div>
        </div>
      </div>
    </footer>
  );
}
