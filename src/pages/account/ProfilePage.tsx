import React, { useEffect, useRef, useState } from 'react';
import {
  Check,
  CheckCheck,
  ChevronDown,
  Edit3,
  PenLine,
  User,
} from 'lucide-react';
import {
  CAMEROON_CITIES,
  COUNTRY_DIAL_OPTIONS,
  detectCountryFromPhone,
  formatFullPhone,
  getDialOptionByCountry,
  validatePhoneForCountry,
  type CurrencyCode,
} from '../../data/cameroon';
import { useDocumentSeo, useStore } from '../../context/StoreContext';
import { Spinner } from '../../components/Spinner';
import { AccountSidebar } from './AccountSidebar';

const GENDER_OPTIONS = ['Male', 'Female', 'Other'];

export function ProfilePage() {
  const { user, authChecked, refreshUser, currency, setCurrency, showToast, navigate } = useStore();

  useDocumentSeo({
    title: "My Profile | Pomegranate 'n' Lime Cameroon",
    description: 'Manage your Pomegranate ’n’ Lime Cameroon profile, Cameroon +237 phone number, and hosting preferences.',
  });

  const [editing, setEditing] = useState(false);
  const [hoverEditBtn, setHoverEditBtn] = useState(false);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [country, setCountry] = useState('Cameroon');
  const [localPhone, setLocalPhone] = useState('');
  const [city, setCity] = useState('Douala');
  const [whatsappUpdates, setWhatsappUpdates] = useState(true);
  const [newsletterOptIn, setNewsletterOptIn] = useState(true);
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

  // Custom dropdown states
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [genderDropdownOpen, setGenderDropdownOpen] = useState(false);
  const countryRef = useRef<HTMLDivElement | null>(null);
  const genderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!user) return;
    setName(user.name || '');
    setGender(user.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : '');
    const parsed = detectCountryFromPhone(user.phoneNumber);
    setCountry(parsed.country);
    setLocalPhone(parsed.localNumber);
    setCity(user.city || 'Douala');
    setWhatsappUpdates(user.whatsappUpdates ?? true);
    setNewsletterOptIn(user.newsletterOptIn ?? true);
  }, [user]);

  useEffect(() => {
    if (!countryDropdownOpen) return;
    const onDown = (e: MouseEvent) => {
      if (countryRef.current && !countryRef.current.contains(e.target as Node)) {
        setCountryDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [countryDropdownOpen]);

  useEffect(() => {
    if (!genderDropdownOpen) return;
    const onDown = (e: MouseEvent) => {
      if (genderRef.current && !genderRef.current.contains(e.target as Node)) {
        setGenderDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [genderDropdownOpen]);

  if (!authChecked) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="md" label="Loading your profile..." />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-[600px] px-4 py-20 text-center">
        <h1 className="text-[28px] font-serif text-admiral mb-3">Sign in to view your Profile</h1>
        <p className="text-[15px] text-admiral/75 mb-6">
          Access your Cameroon profile settings, saved addresses, wishlist, and order history.
        </p>
        <div className="flex justify-center gap-4">
          <button
            type="button"
            onClick={() => navigate('/login?next=/account')}
            className="rounded-[40px] bg-admiral px-8 py-3 text-[15px] text-chiffon hover:opacity-90 cursor-pointer"
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => navigate('/register?next=/account')}
            className="rounded-[40px] border border-antiquity px-8 py-3 text-[15px] text-antiquity hover:bg-champagne/40 cursor-pointer"
          >
            Register
          </button>
        </div>
      </div>
    );
  }

  const dialOpt = getDialOptionByCountry(country);

  const handleSave = async () => {
    const nextErrors: { name?: string; phone?: string } = {};
    if (!name.trim()) nextErrors.name = 'Name is required.';
    if (localPhone.trim()) {
      const check = validatePhoneForCountry(country, localPhone);
      if (!check.isValid) nextErrors.phone = check.error;
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSaving(true);
    try {
      const fullPhone = localPhone.trim() ? formatFullPhone(country, localPhone) : '';
      const res = await fetch('/api/me', {
        method: 'PATCH',
        credentials: 'same-origin',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phoneNumber: fullPhone,
          gender: gender ? gender.toLowerCase() : null,
          city,
          whatsappUpdates,
          newsletterOptIn,
        }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => null);
        showToast(d?.error || 'Could not save your details. Please try again.', { type: 'error' });
        return;
      }
      await refreshUser();
      setEditing(false);
      setErrors({});
      showToast('Profile updated successfully');
    } finally {
      setSaving(false);
    }
  };

  const handlePreferencePatch = async (patch: Record<string, unknown>, label: string) => {
    const res = await fetch('/api/me', {
      method: 'PATCH',
      credentials: 'same-origin',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(patch),
    });
    if (res.ok) {
      await refreshUser();
      showToast(label);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-[1920px] flex-col gap-6 px-3 sm:px-6 lg:flex-row lg:gap-10 lg:px-16 xl:px-24 py-8 lg:py-12">
      <AccountSidebar active="profile" sidebarTitle="My Profile" />

      <div className="flex flex-1 flex-col gap-6 min-w-0">
        {/* Profile Summary Card */}
        <section className="relative flex items-center justify-between gap-5 rounded-lg border border-champagne bg-chiffon p-5 overflow-hidden">
          <div className="flex items-center gap-5 md:gap-10 z-10">
            <div className="relative flex h-[92px] w-[92px] sm:h-[120px] sm:w-[120px] shrink-0 items-center justify-center rounded-full border border-champagne bg-biege/60">
              <User className="h-14 w-14 sm:h-[78px] sm:w-[78px] text-antiquity" strokeWidth={1.5} />
            </div>

            <div className="flex min-w-0 flex-col gap-1.5 sm:gap-3">
              <h1 className="text-[20px] sm:text-[24px] font-medium leading-tight sm:leading-[29px] text-admiral break-words">
                {user.name}
              </h1>
              {user.email && (
                <span className="text-[14px] sm:text-[16px] leading-tight text-admiral break-all">
                  {user.email}
                </span>
              )}
              {user.phoneNumber && (
                <span className="text-[16px] sm:text-[20px] leading-tight text-admiral tabular-nums">
                  {user.phoneNumber}
                </span>
              )}
            </div>
          </div>

          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-lg">
            <img
              src="/logo.png"
              alt=""
              className="absolute -bottom-14 -right-9 h-[230px] w-[210px] object-contain opacity-[0.12]"
            />
          </div>
        </section>

        {/* Personal Information Card */}
        <section className="relative flex flex-col gap-8 rounded-lg border border-champagne bg-chiffon p-5">
          <div className="flex items-center justify-between gap-2 z-10">
            <h2 className="text-[18px] sm:text-[24px] font-bold leading-tight text-admiral whitespace-nowrap">
              Personal Information
            </h2>

            <button
              type="button"
              disabled={saving}
              onClick={() => (editing ? handleSave() : setEditing(true))}
              onMouseEnter={() => setHoverEditBtn(true)}
              onMouseLeave={() => setHoverEditBtn(false)}
              className={`flex items-center justify-center gap-2 px-4 py-3 text-[15px] sm:text-[16px] leading-none cursor-pointer transition-all duration-200 ${
                editing
                  ? 'rounded-[32px] bg-admiral text-chiffon shadow-sm hover:opacity-95'
                  : 'rounded-[32px] text-admiral hover:bg-champagne/40'
              } ${saving ? 'opacity-70' : ''}`}
            >
              {saving ? (
                <Spinner size="xs" color={editing ? 'light' : 'brand'} />
              ) : editing ? (
                hoverEditBtn ? (
                  <CheckCheck className="h-4 w-4" />
                ) : (
                  <Check className="h-4 w-4" />
                )
              ) : hoverEditBtn ? (
                <PenLine className="h-4 w-4" />
              ) : (
                <Edit3 className="h-4 w-4" />
              )}
              <span>{saving ? 'Saving...' : editing ? 'Save Info' : 'Edit Info'}</span>
            </button>
          </div>

          <div className="z-10 flex flex-col gap-5">
            <div className="flex flex-col gap-5 md:flex-row md:gap-10">
              {/* Full Name */}
              <div className="flex w-full flex-col gap-2 md:w-[320px]">
                <span className="text-[16px] leading-5 text-admiral">Full Name</span>
                <div
                  className={`flex h-[41px] items-center rounded-[41px] border border-champagne py-3 pl-4 pr-2.5 transition-colors ${
                    editing ? 'bg-white/80' : 'bg-transparent'
                  }`}
                >
                  <input
                    value={name}
                    disabled={!editing}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                    }}
                    className="w-full bg-transparent text-[14px] leading-[17.1px] text-admiral outline-none disabled:opacity-80"
                  />
                </div>
                {errors.name && (
                  <p className="mt-0.5 text-[12px] leading-[14px] text-[#ff383c]">{errors.name}</p>
                )}
              </div>

              {/* Phone no. with Country Selector (Cameroon default) */}
              <div className="flex w-full flex-col gap-2 md:w-[320px]">
                <span className="text-[16px] leading-5 text-admiral">Phone no.</span>
                <div ref={countryRef} className="relative w-full">
                  <div className="flex h-[41px] w-full items-center gap-3 overflow-hidden rounded-[41px] border border-champagne bg-white/90 pr-2.5">
                    <button
                      type="button"
                      disabled={!editing}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setCountryDropdownOpen((prev) => !prev);
                      }}
                      className="cursor-pointer flex h-full w-[112px] shrink-0 items-center justify-between bg-champagne py-2.5 px-3 text-[13px] leading-none text-admiral disabled:cursor-default tabular-nums"
                    >
                      <span className="whitespace-nowrap">
                        {dialOpt.isoCode} (+{dialOpt.phonecode})
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                          countryDropdownOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    <input
                      type="tel"
                      inputMode="numeric"
                      value={localPhone}
                      maxLength={dialOpt.maxLength}
                      disabled={!editing}
                      onChange={(e) => {
                        setLocalPhone(e.target.value.replace(/[^\d]/g, ''));
                        if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
                      }}
                      placeholder="677482910"
                      className="w-full bg-transparent text-[14px] leading-[17.1px] text-admiral outline-none placeholder:text-purple tabular-nums"
                    />
                  </div>

                  {countryDropdownOpen && (
                    <div className="absolute left-0 top-full z-50 mt-1 max-h-60 w-full min-w-[260px] overflow-auto rounded-lg border border-champagne bg-chiffon py-1 shadow-lg custom-scrollbar">
                      {COUNTRY_DIAL_OPTIONS.map((opt) => (
                        <button
                          key={opt.name}
                          type="button"
                          onClick={() => {
                            setCountry(opt.name);
                            if (localPhone.length > opt.maxLength) {
                              setLocalPhone(localPhone.slice(0, opt.maxLength));
                            }
                            setCountryDropdownOpen(false);
                          }}
                          className={`flex w-full items-center justify-between cursor-pointer px-4 py-2.5 text-left text-[14px] leading-tight text-admiral transition-colors ${
                            opt.name === country ? 'bg-champagne font-medium' : 'hover:bg-champagne/60'
                          }`}
                        >
                          <span className="truncate pr-2">{opt.name}</span>
                          <span className="shrink-0 text-antiquity text-[13px] font-medium tabular-nums">
                            +{opt.phonecode}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {errors.phone && (
                  <p className="mt-0.5 text-[12px] leading-[14px] text-[#ff383c]">{errors.phone}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-5 md:flex-row md:gap-10">
              {/* Email (read only) */}
              <div className="flex w-full flex-col gap-2 md:w-[320px]">
                <span className="text-[16px] leading-5 text-admiral">Email</span>
                <div className="flex h-[41px] items-center rounded-[41px] border border-champagne py-3 pl-4 pr-2.5">
                  <input
                    value={user.email}
                    disabled
                    readOnly
                    placeholder="Enter your email"
                    className="w-full bg-transparent text-[14px] leading-[17.1px] text-admiral/70 outline-none select-none"
                  />
                </div>
              </div>

              {/* Gender Custom Dropdown */}
              <div ref={genderRef} className="relative flex w-[180px] flex-col gap-2">
                <span className="text-[16px] leading-5 text-admiral">Gender</span>
                <button
                  type="button"
                  disabled={!editing}
                  onClick={() => setGenderDropdownOpen((prev) => !prev)}
                  className="flex h-[41px] w-full items-center justify-between rounded-[41px] border border-champagne bg-white/40 py-3 pl-5 pr-2.5 text-[14px] leading-none text-admiral disabled:opacity-75 cursor-pointer disabled:cursor-default"
                >
                  <span>{gender || 'Select Gender'}</span>
                  <ChevronDown
                    className={`h-5 w-5 transition-transform duration-200 ${
                      genderDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {genderDropdownOpen && (
                  <div className="absolute top-[74px] z-30 flex w-full flex-col gap-1 rounded-b-xl border border-t-0 border-champagne bg-chiffon pb-2 shadow-md overflow-hidden">
                    {GENDER_OPTIONS.map((opt) => (
                      <div key={opt} className="flex flex-col gap-1">
                        <div className="h-px w-full bg-champagne" />
                        <button
                          type="button"
                          onClick={() => {
                            setGender(gender === opt ? '' : opt);
                            setGenderDropdownOpen(false);
                          }}
                          className={`flex h-[32px] w-full items-center justify-center px-3 text-[14px] capitalize leading-none text-antiquity cursor-pointer transition-colors ${
                            gender === opt ? 'bg-champagne font-medium' : 'bg-chiffon hover:bg-champagne/50'
                          }`}
                        >
                          {opt}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-lg">
            <img
              src="/logo.png"
              alt=""
              className="absolute -bottom-14 -right-9 h-[230px] w-[210px] object-contain opacity-[0.12]"
            />
          </div>
        </section>

        {/* Cameroon Hosting & Notification Settings */}
        <section className="flex flex-col gap-6 rounded-lg border border-champagne bg-chiffon p-5">
          <div className="flex flex-col gap-1">
            <h2 className="text-[18px] sm:text-[22px] font-bold text-admiral">
              Cameroon Atelier &amp; Display Preferences
            </h2>
            <p className="text-[13px] text-admiral/70">
              Customise your default Cameroon delivery hub, display currency, and WhatsApp concierge updates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <span className="text-[15px] text-admiral font-medium">Preferred Currency</span>
              <div className="inline-flex w-fit rounded-full border border-champagne bg-biege/60 p-1 gap-1">
                {(['XAF', 'USD', 'EUR'] as CurrencyCode[]).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={async () => {
                      await setCurrency(c);
                      showToast(`Currency updated to ${c === 'XAF' ? 'FCFA (XAF)' : c}`);
                    }}
                    className={`rounded-full px-4 py-1.5 text-[13px] font-sans font-semibold transition-colors cursor-pointer ${
                      currency === c
                        ? 'bg-admiral text-primrose'
                        : 'text-admiral/80 hover:bg-champagne/50'
                    }`}
                  >
                    {c === 'XAF' ? 'FCFA (XAF)' : c}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-[15px] text-admiral font-medium">Primary Cameroon City</span>
              <select
                value={city}
                onChange={(e) => {
                  const nextCity = e.target.value;
                  setCity(nextCity);
                  handlePreferencePatch({ city: nextCity }, `Primary city set to ${nextCity}`);
                }}
                className="h-[41px] max-w-[260px] rounded-[41px] border border-champagne bg-white/80 px-4 text-[14px] text-admiral outline-none focus:border-antiquity cursor-pointer"
              >
                {CAMEROON_CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-champagne/60">
            <label className="flex items-center justify-between gap-4 rounded-xl border border-champagne bg-biege/40 px-4 py-3 cursor-pointer">
              <div>
                <div className="text-[14px] font-semibold text-admiral">
                  WhatsApp (+237) Dispatch Alerts
                </div>
                <div className="text-[12px] text-admiral/70">
                  Receive live courier updates for Douala, Yaoundé &amp; regional deliveries
                </div>
              </div>
              <input
                type="checkbox"
                checked={whatsappUpdates}
                onChange={(e) => {
                  const next = e.target.checked;
                  setWhatsappUpdates(next);
                  handlePreferencePatch(
                    { whatsappUpdates: next },
                    next ? 'WhatsApp alerts enabled' : 'WhatsApp alerts paused'
                  );
                }}
                className="h-4 w-4 accent-[#ac6628] cursor-pointer shrink-0"
              />
            </label>

            <label className="flex items-center justify-between gap-4 rounded-xl border border-champagne bg-biege/40 px-4 py-3 cursor-pointer">
              <div>
                <div className="text-[14px] font-semibold text-admiral">
                  Private Trunk Show &amp; Lookbook Notes
                </div>
                <div className="text-[12px] text-admiral/70">
                  Early access to seasonal table collections in Bonapriso &amp; Bastos
                </div>
              </div>
              <input
                type="checkbox"
                checked={newsletterOptIn}
                onChange={(e) => {
                  const next = e.target.checked;
                  setNewsletterOptIn(next);
                  handlePreferencePatch(
                    { newsletterOptIn: next },
                    next ? 'Subscribed to Atelier invitations' : 'Atelier invitations paused'
                  );
                }}
                className="h-4 w-4 accent-[#ac6628] cursor-pointer shrink-0"
              />
            </label>
          </div>
        </section>
      </div>
    </div>
  );
}
