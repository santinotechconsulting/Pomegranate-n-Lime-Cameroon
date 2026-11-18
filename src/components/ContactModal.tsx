import React, { useEffect, useState } from 'react';
import { Mail, MapPin, MessageCircle, X } from 'lucide-react';
import { CAMEROON_CONTACT } from '../data/cameroon';
import { useStore } from '../context/StoreContext';
import { Spinner } from './Spinner';

export function ContactModal() {
  const { isContactOpen, closeContact, user, showToast } = useStore();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phoneNumber || '+237 ');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (user) {
      setName((prev) => prev || user.name);
      setEmail((prev) => prev || user.email);
      setPhone((prev) => (prev && prev !== '+237 ' ? prev : user.phoneNumber || '+237 '));
    }
  }, [user]);

  useEffect(() => {
    if (!isContactOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeContact();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isContactOpen, closeContact]);

  if (!isContactOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setSending(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name, email, phone, message }),
      });
      if (res.ok) {
        setMessage('');
        closeContact();
        showToast('Thank you! Our Douala Atelier concierge will reply shortly.');
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[160] flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
      onClick={closeContact}
    >
      <div
        role="dialog"
        aria-label="Contact Us"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[540px] rounded-[24px] border border-champagne bg-chiffon p-6 sm:p-8 text-admiral shadow-2xl"
      >
        <button
          type="button"
          onClick={closeContact}
          aria-label="Close contact dialog"
          className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full text-admiral/70 hover:bg-champagne/40 cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-5 pr-8">
          <h2 className="text-[24px] font-serif font-bold text-admiral">
            Speak with our Cameroon Atelier
          </h2>
          <p className="mt-1 text-[14px] text-admiral/75">
            Bespoke table curation, Douala &amp; Yaoundé private appointments, or order support.
          </p>
        </div>

        <div className="mb-5 grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-xl border border-champagne bg-biege/60 p-3.5 text-[13px]">
          <div className="flex items-start gap-2.5">
            <Mail className="h-4 w-4 text-antiquity shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-admiral">Email</div>
              <a href={`mailto:${CAMEROON_CONTACT.email}`} className="text-antiquity hover:underline">
                {CAMEROON_CONTACT.email}
              </a>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <MessageCircle className="h-4 w-4 text-antiquity shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-admiral">WhatsApp Concierge</div>
              <a
                href={`https://wa.me/${CAMEROON_CONTACT.whatsappDigits}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-antiquity hover:underline"
              >
                {CAMEROON_CONTACT.whatsappDisplay}
              </a>
            </div>
          </div>
          <div className="sm:col-span-2 flex items-start gap-2.5 pt-1 border-t border-champagne/60">
            <MapPin className="h-4 w-4 text-antiquity shrink-0 mt-0.5" />
            <div className="text-admiral/85">
              {CAMEROON_CONTACT.doualaAtelier} · {CAMEROON_CONTACT.yaoundeSalon}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="flex flex-col gap-1 text-[13px]">
              <span className="font-medium">Full Name*</span>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="h-10 rounded-full border border-champagne bg-white/80 px-4 text-[14px] outline-none focus:border-antiquity"
              />
            </label>
            <label className="flex flex-col gap-1 text-[13px]">
              <span className="font-medium">Phone / WhatsApp (+237)</span>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+237 6 77 48 29 10"
                className="h-10 rounded-full border border-champagne bg-white/80 px-4 text-[14px] outline-none focus:border-antiquity"
              />
            </label>
          </div>
          <label className="flex flex-col gap-1 text-[13px]">
            <span className="font-medium">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vous@exemple.cm"
              className="h-10 rounded-full border border-champagne bg-white/80 px-4 text-[14px] outline-none focus:border-antiquity"
            />
          </label>
          <label className="flex flex-col gap-1 text-[13px]">
            <span className="font-medium">Message*</span>
            <textarea
              required
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us about your dining table, event date, or order enquiry..."
              className="rounded-2xl border border-champagne bg-white/80 p-3.5 text-[14px] outline-none focus:border-antiquity resize-none"
            />
          </label>
          <button
            type="submit"
            disabled={sending}
            className="mt-1 flex h-11 items-center justify-center gap-2 rounded-[40px] bg-antiquity text-[15px] font-medium text-chiffon hover:opacity-90 cursor-pointer disabled:opacity-60"
          >
            {sending ? <Spinner size="xs" color="light" /> : null}
            <span>{sending ? 'Sending...' : 'Send Message'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
