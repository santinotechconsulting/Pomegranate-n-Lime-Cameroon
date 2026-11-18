import React from 'react';
import { CAMEROON_CONTACT } from '../data/cameroon';
import { useStore } from '../context/StoreContext';

export function WhatsAppButton() {
  const { currentPath, isCartDrawerOpen, isContactOpen } = useStore();

  // Hide behind open full-screen drawers/modals
  if (isCartDrawerOpen || isContactOpen) return null;

  const prefilledText = encodeURIComponent(
    `Bonjour Pomegranate 'n' Lime Cameroon! I would like assistance regarding: ${
      typeof window !== 'undefined' ? window.location.origin + currentPath : currentPath
    }`
  );
  const whatsappUrl = `https://wa.me/${CAMEROON_CONTACT.whatsappDigits}?text=${prefilledText}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Chat with Cameroon Support on WhatsApp (${CAMEROON_CONTACT.whatsappDisplay})`}
      title={`WhatsApp Cameroon Support (${CAMEROON_CONTACT.whatsappDisplay})`}
      className="group fixed bottom-20 right-4 lg:bottom-6 lg:right-6 z-40 flex items-center gap-2.5 rounded-full bg-[#25D366] p-3.5 sm:px-4 sm:py-3 text-white shadow-[0_10px_28px_rgba(25,29,69,0.22)] ring-2 ring-champagne/90 transition-all duration-200 hover:scale-105 hover:bg-[#20bd5a] active:scale-95"
    >
      <svg
        viewBox="0 0 32 32"
        className="h-6 w-6 shrink-0 fill-current"
        aria-hidden="true"
      >
        <path d="M16.004 2.667C8.64 2.667 2.667 8.64 2.667 16c0 2.353.615 4.651 1.784 6.676L2.667 29.333l6.817-1.787A13.28 13.28 0 0 0 16.004 29.333c7.36 0 13.33-5.973 13.33-13.333 0-7.36-5.97-13.333-13.33-13.333Zm7.772 18.885c-.325.915-1.899 1.747-2.633 1.856-.699.104-1.584.148-2.557-.161-.59-.188-1.347-.438-2.317-.857-4.075-1.76-6.737-5.86-6.94-6.132-.203-.271-1.656-2.203-1.656-4.203 0-2 1.049-2.984 1.422-3.391.373-.407.813-.508 1.084-.508.271 0 .542.003.78.014.25.012.586-.095.916.699.339.814 1.153 2.814 1.254 3.017.102.204.17.441.034.712-.136.271-.204.441-.407.678-.203.237-.428.53-.61.712-.203.203-.415.424-.178.831.237.407 1.053 1.737 2.26 2.814 1.553 1.385 2.862 1.814 3.269 2.017.407.204.644.17.882-.102.237-.271 1.017-1.187 1.288-1.594.271-.407.542-.339.915-.203.373.136 2.373 1.119 2.78 1.322.407.204.678.305.78.475.102.17.102.983-.224 1.898Z" />
      </svg>
      <span className="hidden md:inline-block font-sans text-[13px] font-semibold tracking-wide whitespace-nowrap pr-0.5">
        WhatsApp Us
      </span>
    </a>
  );
}
