import React, { useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import {
  CAMEROON_CITIES,
  COUNTRY_DIAL_OPTIONS,
  formatFullPhone,
  getDialOptionByCountry,
  validatePhoneForCountry,
} from '../data/cameroon';
import { useDocumentSeo, useStore } from '../context/StoreContext';
import { Spinner } from '../components/Spinner';

interface AuthPageProps {
  mode: 'login' | 'register' | 'forgot-password';
}

export function AuthPage({ mode }: AuthPageProps) {
  const { searchQuery, navigate, refreshUser, showToast } = useStore();
  const params = useMemo(() => new URLSearchParams(searchQuery), [searchQuery]);
  const nextPath = params.get('next') || '/account';
  const reason = params.get('reason') || '';

  useDocumentSeo({
    title:
      mode === 'register'
        ? "Create Account | Pomegranate 'n' Lime Cameroon"
        : mode === 'forgot-password'
        ? "Reset Password | Pomegranate 'n' Lime Cameroon"
        : "Login | Pomegranate 'n' Lime Cameroon",
    description:
      "Sign in or register your Pomegranate 'n' Lime Cameroon account to track orders, save your wishlist, and manage Cameroon delivery addresses.",
  });

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [country, setCountry] = useState('Cameroon');
  const [localPhone, setLocalPhone] = useState('');
  const [city, setCity] = useState('Douala');
  const [phoneDropdownOpen, setPhoneDropdownOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const dialOpt = getDialOptionByCountry(country);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'forgot-password') {
      if (!email.trim()) {
        setError('Please enter your registered email address.');
        return;
      }
      setResetSent(true);
      showToast('Password reset link sent to your email.');
      return;
    }

    if (mode === 'register') {
      if (!name.trim() || !email.trim()) {
        setError('Full name and email are required.');
        return;
      }
      if (localPhone.trim()) {
        const check = validatePhoneForCountry(country, localPhone);
        if (!check.isValid) {
          setError(check.error || 'Invalid phone number.');
          return;
        }
      }
      setSubmitting(true);
      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          credentials: 'same-origin',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            phoneNumber: localPhone.trim() ? formatFullPhone(country, localPhone) : '',
            city,
          }),
        });
        if (!res.ok) {
          const d = await res.json().catch(() => null);
          setError(d?.error || 'Could not create account.');
          return;
        }
        await refreshUser();
        showToast('Welcome to Pomegranate ‘n’ Lime Cameroon!');
        navigate(nextPath);
      } finally {
        setSubmitting(false);
      }
      return;
    }

    // Login
    if (!email.trim() || !password.trim()) {
      setError('Email and password are required.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/auth/sign-in/email', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => null);
        setError(d?.error || 'Sign in failed.');
        return;
      }
      await refreshUser();
      showToast('Signed in successfully');
      navigate(nextPath);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemoLogin = async () => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/auth/demo', { method: 'POST', credentials: 'same-origin' });
      if (res.ok) {
        await refreshUser();
        showToast('Signed in as Aminatou Ndiaye (Douala)');
        navigate(nextPath);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const contextMessage =
    reason === 'wishlist'
      ? 'Create or sign in to your account to save favourites to your Wishlist.'
      : reason === 'checkout'
      ? 'Sign in to complete your Cameroon order seamlessly.'
      : reason === 'address'
      ? 'Sign in to add or manage your Cameroon delivery addresses.'
      : '';

  return (
    <div className="mx-auto max-w-lg px-4 py-12 sm:py-16">
      <div className="rounded-2xl border border-champagne bg-chiffon p-6 sm:p-9 shadow-lg">
        <div className="text-center mb-6">
          <img src="/logo.png" alt="Pomegranate 'n' Lime Cameroon" className="mx-auto h-14 w-14 object-contain mb-3" />
          <h1 className="text-[28px] sm:text-[34px] font-display text-admiral">
            {mode === 'register'
              ? 'Create Account'
              : mode === 'forgot-password'
              ? 'Reset Password'
              : 'Welcome Back'}
          </h1>
          <p className="mt-1 text-[14px] text-antiquity">
            {contextMessage ||
              (mode === 'register'
                ? 'Join Pomegranate ‘n’ Lime Cameroon Atelier'
                : mode === 'forgot-password'
                ? 'Enter your email and we will send recovery instructions'
                : 'Sign in to your Cameroon Atelier account')}
          </p>
        </div>

        {resetSent ? (
          <div className="rounded-xl border border-champagne bg-biege/60 p-5 text-center">
            <p className="text-[14px] text-admiral mb-4">
              Recovery instructions have been sent to <strong>{email}</strong>.
            </p>
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="rounded-full bg-admiral px-6 py-2.5 text-[14px] text-chiffon cursor-pointer"
            >
              Return to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {mode === 'register' && (
              <div>
                <label className="block text-[14px] text-admiral mb-1">Full Name *</label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Aminatou Ndiaye"
                  className="h-11 w-full rounded-[41px] border border-champagne bg-white px-4 text-[14px] text-admiral outline-none focus:border-antiquity"
                />
              </div>
            )}

            <div>
              <label className="block text-[14px] text-admiral mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="aminatou.ndiaye@bonapriso.cm"
                className="h-11 w-full rounded-[41px] border border-champagne bg-white px-4 text-[14px] text-admiral outline-none focus:border-antiquity"
              />
            </div>

            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-[14px] text-admiral mb-1">Phone Number (Cameroon +237 default)</label>
                  <div className="relative flex h-11 w-full items-center gap-2 rounded-[41px] border border-champagne bg-white pr-3">
                    <button
                      type="button"
                      onClick={() => setPhoneDropdownOpen((p) => !p)}
                      className="flex h-full w-[108px] shrink-0 items-center justify-between rounded-l-[41px] bg-champagne px-3 text-[13px] text-admiral cursor-pointer tabular-nums"
                    >
                      <span>
                        {dialOpt.isoCode} (+{dialOpt.phonecode})
                      </span>
                      <ChevronDown className="h-3.5 w-3.5" />
                    </button>
                    <input
                      type="tel"
                      inputMode="numeric"
                      maxLength={dialOpt.maxLength}
                      value={localPhone}
                      onChange={(e) => setLocalPhone(e.target.value.replace(/[^\d]/g, ''))}
                      placeholder="677482910"
                      className="w-full bg-transparent text-[14px] text-admiral outline-none tabular-nums"
                    />
                    {phoneDropdownOpen && (
                      <div className="absolute left-0 top-full z-40 mt-1 max-h-52 w-64 overflow-auto rounded-lg border border-champagne bg-chiffon py-1 shadow-xl">
                        {COUNTRY_DIAL_OPTIONS.map((opt) => (
                          <button
                            key={opt.name}
                            type="button"
                            onClick={() => {
                              setCountry(opt.name);
                              setPhoneDropdownOpen(false);
                            }}
                            className="flex w-full justify-between px-4 py-2 text-left text-[13px] text-admiral hover:bg-champagne/50 cursor-pointer"
                          >
                            <span>{opt.name}</span>
                            <span className="text-antiquity tabular-nums">+{opt.phonecode}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-[14px] text-admiral mb-1">Cameroon City</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="h-11 w-full rounded-[41px] border border-champagne bg-white px-4 text-[14px] text-admiral outline-none cursor-pointer"
                  >
                    {CAMEROON_CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {mode !== 'forgot-password' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[14px] text-admiral">Password *</label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => navigate('/forgot-password')}
                      className="text-[12px] text-antiquity hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-11 w-full rounded-[41px] border border-champagne bg-white px-4 text-[14px] text-admiral outline-none focus:border-antiquity"
                />
              </div>
            )}

            {error && <p className="text-[13px] text-[#ff383c]">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 h-11 w-full rounded-[40px] bg-admiral text-[15px] font-medium text-chiffon hover:opacity-90 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              {submitting && <Spinner size="xs" color="light" />}
              <span>
                {mode === 'register'
                  ? 'Create Account'
                  : mode === 'forgot-password'
                  ? 'Send Reset Link'
                  : 'Sign In'}
              </span>
            </button>

            {mode !== 'forgot-password' && (
              <button
                type="button"
                disabled={submitting}
                onClick={handleDemoLogin}
                className="h-11 w-full rounded-[40px] border border-antiquity bg-biege/60 text-[14px] font-medium text-antiquity hover:bg-champagne/50 cursor-pointer"
              >
                Continue as Aminatou (Douala Demo)
              </button>
            )}
          </form>
        )}

        <div className="mt-6 border-t border-champagne/60 pt-4 text-center text-[13.5px] text-admiral/80">
          {mode === 'login' ? (
            <>
              New to Pomegranate ‘n’ Lime Cameroon?{' '}
              <button
                type="button"
                onClick={() => navigate(`/register?next=${encodeURIComponent(nextPath)}`)}
                className="font-semibold text-antiquity underline cursor-pointer"
              >
                Register here
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigate(`/login?next=${encodeURIComponent(nextPath)}`)}
                className="font-semibold text-antiquity underline cursor-pointer"
              >
                Sign in
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
