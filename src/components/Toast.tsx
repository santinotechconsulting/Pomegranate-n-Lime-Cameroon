import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

interface ToastProps {
  show: boolean;
  type?: 'success' | 'error';
  message: string;
  linkText?: string;
  linkHref?: string;
  onNavigate?: (href: string) => void;
  onClose: () => void;
}

export function Toast({
  show,
  type = 'success',
  message,
  linkText,
  linkHref,
  onNavigate,
  onClose,
}: ToastProps) {
  useEffect(() => {
    if (!show) return;
    const t = setTimeout(onClose, 3800);
    return () => clearTimeout(t);
  }, [show, onClose]);

  if (!show || !message) return null;

  return (
    <div className="fixed top-20 sm:top-26 right-4 left-4 sm:left-auto z-[220] flex justify-end pointer-events-none">
      <div
        role="status"
        className={`pointer-events-auto flex items-center gap-3 rounded-xl border px-4 py-3 shadow-[0_8px_24px_rgba(25,29,69,0.18)] backdrop-blur-sm max-w-md transition-all duration-200 ${
          type === 'error'
            ? 'border-[#ff383c]/40 bg-chiffon text-[#c0262a]'
            : 'border-champagne bg-chiffon text-admiral'
        }`}
      >
        {type === 'error' ? (
          <AlertCircle className="h-4 w-4 shrink-0 text-[#ff383c]" />
        ) : (
          <CheckCircle2 className="h-4 w-4 shrink-0 text-antiquity" />
        )}
        <span className="text-[13px] sm:text-[14px] leading-snug font-sans">{message}</span>
        {linkText && linkHref && (
          <a
            href={linkHref}
            onClick={(e) => {
              if (onNavigate) {
                e.preventDefault();
                onNavigate(linkHref);
                onClose();
              }
            }}
            className="ml-1 shrink-0 text-[13px] font-semibold text-antiquity underline underline-offset-2 hover:opacity-80 whitespace-nowrap"
          >
            {linkText}
          </a>
        )}
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss message"
          className="ml-1 text-admiral/60 hover:text-admiral cursor-pointer p-0.5 flex items-center justify-center transition-colors"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
