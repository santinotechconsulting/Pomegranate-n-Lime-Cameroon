import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, ChevronDown, MapPin, Plus, ShieldCheck } from 'lucide-react';
import {
  CAMEROON_CONTACT,
  CAMEROON_REGIONS,
  COUNTRY_DIAL_OPTIONS,
  detectCountryFromPhone,
  estimateDeliveryForAddress,
  formatFullPhone,
  getDialOptionByCountry,
  validatePhoneForCountry,
} from '../data/cameroon';
import { useDocumentSeo, useStore } from '../context/StoreContext';
import type { Address, Order } from '../types/store';
import { LazyImage } from '../components/LazyImage';
import { Spinner } from '../components/Spinner';

interface CheckoutPageProps {
  mode?: 'checkout' | 'address';
}

const PAYMENT_METHODS = [
  {
    id: 'MTN Mobile Money (MoMo)',
    label: 'MTN Mobile Money (MoMo)',
    hint: 'Instant +237 MTN MoMo prompt to your phone',
  },
  {
    id: 'Orange Money Cameroon',
    label: 'Orange Money Cameroon',
    hint: 'Authorize cleanly via #150# Orange Money',
  },
  {
    id: 'Cash on Delivery (Douala & Yaoundé)',
    label: 'Cash on Delivery (Douala & Yaoundé)',
    hint: 'Pay our atelier courier upon unboxing inspection',
  },
  {
    id: 'Visa / Mastercard International',
    label: 'Visa / Mastercard International',
    hint: 'Ideal for global diaspora gifting to Cameroon',
  },
];

export function CheckoutPage({ mode = 'checkout' }: CheckoutPageProps) {
  const {
    user,
    addresses,
    refreshAddresses,
    refreshCart,
    refreshOrders,
    cart,
    formatPrice,
    searchQuery,
    navigate,
    showToast,
  } = useStore();

  useDocumentSeo({
    title:
      mode === 'address'
        ? "Cameroon Delivery Address | Pomegranate 'n' Lime Cameroon"
        : "Checkout | Pomegranate 'n' Lime Cameroon",
    description:
      'Complete your order with MTN MoMo, Orange Money, Cash on Delivery, or card for fast delivery across Cameroon.',
  });

  // Checkout state
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>(PAYMENT_METHODS[0].id);
  const [momoNumber, setMomoNumber] = useState<string>('');
  const [placing, setPlacing] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      const def = addresses.find((a) => a.isDefault) || addresses[0];
      setSelectedAddressId(def._id);
    }
  }, [addresses, selectedAddressId]);

  useEffect(() => {
    if (user?.phoneNumber && !momoNumber) {
      setMomoNumber(user.phoneNumber);
    }
  }, [user, momoNumber]);

  // Address Form State (/checkout/address)
  const editAddressId = useMemo(
    () => new URLSearchParams(searchQuery).get('addressId') || '',
    [searchQuery]
  );
  const returnTo = useMemo(
    () => new URLSearchParams(searchQuery).get('returnTo') || '/account/addresses',
    [searchQuery]
  );

  const existingAddress = useMemo(
    () => addresses.find((a) => a._id === editAddressId),
    [addresses, editAddressId]
  );

  const [label, setLabel] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [fullName, setFullName] = useState('');
  const [country, setCountry] = useState('Cameroon');
  const [localPhone, setLocalPhone] = useState('');
  const [email, setEmail] = useState('');
  const [stateRegion, setStateRegion] = useState('Littoral');
  const [city, setCity] = useState('Douala');
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [pincode, setPincode] = useState('BP 4821');
  const [isDefault, setIsDefault] = useState(false);
  const [savingAddr, setSavingAddr] = useState(false);
  const [phoneDropdownOpen, setPhoneDropdownOpen] = useState(false);
  const [addrError, setAddrError] = useState('');

  useEffect(() => {
    if (mode !== 'address') return;
    if (existingAddress) {
      setLabel((existingAddress.label as 'Home' | 'Work' | 'Other') || 'Home');
      setFullName(existingAddress.fullName);
      const parsed = detectCountryFromPhone(existingAddress.phone);
      setCountry(existingAddress.country || parsed.country || 'Cameroon');
      setLocalPhone(parsed.localNumber);
      setEmail(existingAddress.email || user?.email || '');
      setStateRegion(existingAddress.state || 'Littoral');
      setCity(existingAddress.city || 'Douala');
      setLine1(existingAddress.line1);
      setLine2(existingAddress.line2 || '');
      setPincode(existingAddress.pincode || '');
      setIsDefault(existingAddress.isDefault);
    } else if (user) {
      setFullName(user.name || '');
      const parsed = detectCountryFromPhone(user.phoneNumber);
      setCountry('Cameroon');
      setLocalPhone(parsed.localNumber);
      setEmail(user.email || '');
    }
  }, [mode, existingAddress, user]);

  const regionCities = useMemo(() => {
    const found = CAMEROON_REGIONS.find((r) => r.region === stateRegion);
    return found ? found.cities : CAMEROON_REGIONS[0].cities;
  }, [stateRegion]);

  // Render Address Form (/checkout/address)
  if (mode === 'address') {
    const dialOpt = getDialOptionByCountry(country);

    const handleSaveAddress = async (e: React.FormEvent) => {
      e.preventDefault();
      setAddrError('');
      if (!fullName.trim() || !line1.trim() || !city.trim()) {
        setAddrError('Please enter recipient name, Quartier / street address, and city.');
        return;
      }
      const phoneCheck = validatePhoneForCountry(country, localPhone);
      if (!phoneCheck.isValid) {
        setAddrError(phoneCheck.error || 'Invalid phone number.');
        return;
      }

      setSavingAddr(true);
      try {
        const payload = {
          label,
          fullName: fullName.trim(),
          phone: formatFullPhone(country, localPhone),
          email: email.trim(),
          line1: line1.trim(),
          line2: line2.trim(),
          city: city.trim(),
          state: stateRegion.trim(),
          pincode: pincode.trim() || 'CM',
          country,
          isDefault,
        };
        const res = await fetch(
          existingAddress
            ? `/api/me/addresses/${encodeURIComponent(existingAddress._id)}`
            : '/api/me/addresses',
          {
            method: existingAddress ? 'PATCH' : 'POST',
            credentials: 'same-origin',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(payload),
          }
        );
        if (!res.ok) {
          const d = await res.json().catch(() => null);
          setAddrError(d?.error || 'Could not save address.');
          return;
        }
        await refreshAddresses();
        showToast(existingAddress ? 'Address updated successfully' : 'Cameroon address saved');
        navigate(returnTo);
      } finally {
        setSavingAddr(false);
      }
    };

    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
        <h1 className="text-[30px] sm:text-[38px] font-display text-admiral mb-2">
          {existingAddress ? 'Edit Delivery Address' : 'Add Cameroon Delivery Address'}
        </h1>
        <p className="text-[14px] text-antiquity mb-8">
          Courier service available across all 10 Regions of Cameroon &amp; international destinations
        </p>

        <form
          onSubmit={handleSaveAddress}
          className="flex flex-col gap-5 rounded-2xl border border-champagne bg-chiffon p-6 sm:p-8 shadow-sm"
        >
          {/* Address Label Pills */}
          <div className="flex flex-col gap-2">
            <span className="text-[14px] font-medium text-admiral">Address Type</span>
            <div className="flex gap-2">
              {(['Home', 'Work', 'Other'] as const).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLabel(l)}
                  className={`rounded-full px-5 py-2 text-[13px] font-sans cursor-pointer transition-colors ${
                    label === l
                      ? 'bg-admiral text-primrose font-medium'
                      : 'border border-champagne bg-biege/50 text-admiral hover:bg-champagne/50'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[14px] text-admiral mb-1.5">Full Name *</label>
              <input
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Aminatou Ndiaye"
                className="h-11 w-full rounded-[41px] border border-champagne bg-white/90 px-4 text-[14px] text-admiral outline-none focus:border-antiquity"
              />
            </div>

            <div>
              <label className="block text-[14px] text-admiral mb-1.5">Phone Number *</label>
              <div className="relative flex h-11 w-full items-center gap-2 overflow-visible rounded-[41px] border border-champagne bg-white/90 pr-3">
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
                  required
                  maxLength={dialOpt.maxLength}
                  value={localPhone}
                  onChange={(e) => setLocalPhone(e.target.value.replace(/[^\d]/g, ''))}
                  placeholder="677482910"
                  className="w-full bg-transparent text-[14px] text-admiral outline-none tabular-nums"
                />
                {phoneDropdownOpen && (
                  <div className="absolute left-0 top-full z-40 mt-1 max-h-56 w-64 overflow-auto rounded-lg border border-champagne bg-chiffon py-1 shadow-xl">
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
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[14px] text-admiral mb-1.5">Country</label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="h-11 w-full rounded-[41px] border border-champagne bg-white/90 px-4 text-[14px] text-admiral outline-none cursor-pointer"
              >
                {COUNTRY_DIAL_OPTIONS.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {country === 'Cameroon' ? (
              <div>
                <label className="block text-[14px] text-admiral mb-1.5">Region *</label>
                <select
                  value={stateRegion}
                  onChange={(e) => {
                    const nextReg = e.target.value;
                    setStateRegion(nextReg);
                    const match = CAMEROON_REGIONS.find((r) => r.region === nextReg);
                    if (match && match.cities[0]) setCity(match.cities[0]);
                  }}
                  className="h-11 w-full rounded-[41px] border border-champagne bg-white/90 px-4 text-[14px] text-admiral outline-none cursor-pointer"
                >
                  {CAMEROON_REGIONS.map((r) => (
                    <option key={r.region} value={r.region}>
                      {r.region} ({r.deliveryDays})
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-[14px] text-admiral mb-1.5">State / Province *</label>
                <input
                  required
                  value={stateRegion}
                  onChange={(e) => setStateRegion(e.target.value)}
                  className="h-11 w-full rounded-[41px] border border-champagne bg-white/90 px-4 text-[14px] text-admiral outline-none"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[14px] text-admiral mb-1.5">City / Town *</label>
              {country === 'Cameroon' ? (
                <select
                  value={regionCities.includes(city) ? city : regionCities[0]}
                  onChange={(e) => setCity(e.target.value)}
                  className="h-11 w-full rounded-[41px] border border-champagne bg-white/90 px-4 text-[14px] text-admiral outline-none cursor-pointer"
                >
                  {regionCities.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="h-11 w-full rounded-[41px] border border-champagne bg-white/90 px-4 text-[14px] text-admiral outline-none"
                />
              )}
            </div>

            <div>
              <label className="block text-[14px] text-admiral mb-1.5">BP / Postal Reference</label>
              <input
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="BP 4821"
                className="h-11 w-full rounded-[41px] border border-champagne bg-white/90 px-4 text-[14px] text-admiral outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[14px] text-admiral mb-1.5">
              Street / Residence / Avenue *
            </label>
            <input
              required
              value={line1}
              onChange={(e) => setLine1(e.target.value)}
              placeholder="Villa 14, Rue des Palmiers"
              className="h-11 w-full rounded-[41px] border border-champagne bg-white/90 px-4 text-[14px] text-admiral outline-none focus:border-antiquity"
            />
          </div>

          <div>
            <label className="block text-[14px] text-admiral mb-1.5">
              Quartier &amp; Landmark (Repère)
            </label>
            <input
              value={line2}
              onChange={(e) => setLine2(e.target.value)}
              placeholder="Bonapriso, près du Glacier Moderne / Bastos"
              className="h-11 w-full rounded-[41px] border border-champagne bg-white/90 px-4 text-[14px] text-admiral outline-none focus:border-antiquity"
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="h-4 w-4 accent-[#ac6628] cursor-pointer"
            />
            <span className="text-[14px] text-admiral">Set as my default Cameroon delivery address</span>
          </label>

          {addrError && <p className="text-[13px] text-[#ff383c]">{addrError}</p>}

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate(returnTo)}
              className="rounded-[40px] border border-admiral px-6 py-2.5 text-[14px] text-admiral hover:bg-champagne/40 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={savingAddr}
              className="rounded-[40px] bg-admiral px-8 py-2.5 text-[14px] font-medium text-chiffon hover:opacity-90 disabled:opacity-50 cursor-pointer flex items-center gap-2"
            >
              {savingAddr && <Spinner size="xs" color="light" />}
              <span>{savingAddr ? 'Saving...' : 'Save Address'}</span>
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Confirmed Order View
  if (confirmedOrder) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-14 text-center">
        <div className="rounded-2xl border border-champagne bg-chiffon p-8 sm:p-10 shadow-lg">
          <CheckCircle2 className="mx-auto h-16 w-16 text-[#009E28] mb-4" />
          <h1 className="text-[30px] sm:text-[38px] font-display text-admiral">
            Order Confirmed!
          </h1>
          <p className="mt-2 text-[15px] text-admiral/80">
            Thank you for hosting with Pomegranate ‘n’ Lime Cameroon. Your order{' '}
            <strong className="text-antiquity tabular-nums">#{confirmedOrder.orderNumber}</strong> is confirmed via{' '}
            <strong>{confirmedOrder.paymentMethod}</strong>.
          </p>
          <div className="mt-6 rounded-xl border border-champagne bg-biege/50 p-4 text-left text-[14px] space-y-1">
            <div>
              <strong>Delivering To:</strong> {confirmedOrder.shippingAddress.fullName} —{' '}
              {confirmedOrder.shippingAddress.city}, {confirmedOrder.shippingAddress.state}
            </div>
            <div>
              <strong>Estimated Arrival:</strong> {confirmedOrder.estimatedDelivery}
            </div>
            <div>
              <strong>Total Paid:</strong> {formatPrice(confirmedOrder.totalMinorUnit)}
            </div>
          </div>

          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/account/orders')}
              className="rounded-[40px] bg-admiral px-7 py-3 text-[14px] text-chiffon hover:opacity-90 cursor-pointer"
            >
              View in My Orders
            </button>
            <button
              type="button"
              onClick={() => navigate('/collections')}
              className="rounded-[40px] border border-antiquity px-7 py-3 text-[14px] text-antiquity hover:bg-champagne/40 cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Checkout View (/checkout)
  const selectedAddress: Address | undefined =
    addresses.find((a) => a._id === selectedAddressId) || addresses[0];
  const deliveryEstimate = estimateDeliveryForAddress(
    selectedAddress?.state,
    selectedAddress?.country
  );
  const freeShipping =
    cart.subtotalMinorUnit >= CAMEROON_CONTACT.freeShippingThresholdUsdMinor &&
    (!selectedAddress?.country || selectedAddress.country.toLowerCase() === 'cameroon');
  const shippingFeeMinor = freeShipping ? 0 : deliveryEstimate.feeUsdMinor;
  const grandTotalMinor = cart.totalMinorUnit + shippingFeeMinor;
  const matBlocked = cart.matCount > 0 && cart.matCount < cart.matMinimumQuantity;

  const handlePlaceOrder = async () => {
    if (!selectedAddress || cart.items.length === 0 || matBlocked) return;
    setPlacing(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          addressId: selectedAddress._id,
          address: selectedAddress,
          paymentMethod,
          shippingMinorUnit: shippingFeeMinor,
        }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => null);
        showToast(d?.error || 'Could not place order.', { type: 'error' });
        return;
      }
      const order: Order = await res.json();
      await Promise.all([refreshCart(), refreshOrders()]);
      setConfirmedOrder(order);
      showToast(`Order #${order.orderNumber} confirmed!`);
    } finally {
      setPlacing(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <img src="/cartBlank.svg" alt="Empty cart" className="mx-auto h-44 w-44 mb-5" />
        <h1 className="text-[26px] font-serif text-admiral mb-2">Your cart is empty</h1>
        <p className="text-[14px] text-admiral/75 mb-6">
          Add bespoke table linens to proceed with Cameroon or global checkout.
        </p>
        <button
          type="button"
          onClick={() => navigate('/collections')}
          className="rounded-full bg-admiral px-7 py-2.5 text-[14px] text-chiffon cursor-pointer"
        >
          Browse Collections
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1920px] px-4 sm:px-8 lg:px-16 xl:px-24 py-10 sm:py-14">
      <h1 className="text-[32px] sm:text-[42px] font-display text-admiral mb-8">
        Cameroon &amp; Global Checkout
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 flex flex-col gap-7">
          {/* 1. Delivery Address */}
          <section className="rounded-2xl border border-champagne bg-chiffon p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[20px] font-serif font-bold text-admiral flex items-center gap-2">
                <MapPin className="h-5 w-5 text-antiquity" />
                <span>1. Delivery Address</span>
              </h2>
              <button
                type="button"
                onClick={() => navigate('/checkout/address?returnTo=/checkout')}
                className="inline-flex items-center gap-1 rounded-full bg-champagne px-4 py-1.5 text-[13px] font-medium text-admiral hover:bg-champagne/80 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Add Address</span>
              </button>
            </div>

            {addresses.length === 0 ? (
              <p className="text-[14px] text-admiral/75">
                Please add a Cameroon or international delivery address to continue.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {addresses.map((addr) => {
                  const active = addr._id === selectedAddress?._id;
                  return (
                    <button
                      key={addr._id}
                      type="button"
                      onClick={() => setSelectedAddressId(addr._id)}
                      className={`text-left rounded-xl border p-4 transition-all cursor-pointer ${
                        active
                          ? 'border-antiquity bg-biege shadow-sm ring-1 ring-antiquity'
                          : 'border-champagne bg-chiffon hover:bg-biege/40'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[13px] font-sans font-bold uppercase tracking-wider text-antiquity">
                          {addr.label}
                        </span>
                        {addr.isDefault && (
                          <span className="rounded-full bg-champagne px-2.5 py-0.5 text-[11px] text-admiral">
                            Default
                          </span>
                        )}
                      </div>
                      <div className="font-serif font-semibold text-admiral">{addr.fullName}</div>
                      <div className="text-[13px] text-admiral/75 mt-1">
                        {addr.line1}
                        {addr.line2 ? `, ${addr.line2}` : ''}
                      </div>
                      <div className="text-[13px] text-admiral/75">
                        {addr.city}, {addr.state} — {addr.country}
                      </div>
                      <div className="text-[12px] text-admiral/65 mt-1 tabular-nums">{addr.phone}</div>
                    </button>
                  );
                })}
              </div>
            )}
          </section>

          {/* 2. Payment Method */}
          <section className="rounded-2xl border border-champagne bg-chiffon p-6">
            <h2 className="text-[20px] font-serif font-bold text-admiral flex items-center gap-2 mb-4">
              <ShieldCheck className="h-5 w-5 text-antiquity" />
              <span>2. Cameroon &amp; International Payment</span>
            </h2>

            <div className="flex flex-col gap-3">
              {PAYMENT_METHODS.map((pm) => {
                const selected = paymentMethod === pm.id;
                return (
                  <label
                    key={pm.id}
                    className={`flex items-start gap-3 rounded-xl border p-4 cursor-pointer transition-colors ${
                      selected
                        ? 'border-antiquity bg-biege'
                        : 'border-champagne hover:bg-biege/40'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={selected}
                      onChange={() => setPaymentMethod(pm.id)}
                      className="mt-1 accent-[#ac6628] cursor-pointer"
                    />
                    <div>
                      <div className="text-[15px] font-serif font-semibold text-admiral">
                        {pm.label}
                      </div>
                      <div className="text-[12.5px] text-admiral/70">{pm.hint}</div>
                    </div>
                  </label>
                );
              })}
            </div>

            {(paymentMethod.includes('MoMo') || paymentMethod.includes('Orange Money')) && (
              <div className="mt-4 rounded-xl border border-champagne bg-biege/50 p-4">
                <label className="block text-[13px] font-medium text-admiral mb-1.5">
                  Mobile Money Phone Number (+237)
                </label>
                <input
                  value={momoNumber}
                  onChange={(e) => setMomoNumber(e.target.value)}
                  placeholder="+237 677482910"
                  className="h-10 w-full max-w-xs rounded-[41px] border border-champagne bg-white px-4 text-[14px] text-admiral outline-none focus:border-antiquity tabular-nums"
                />
              </div>
            )}
          </section>
        </div>

        {/* Right: Order Review */}
        <aside className="lg:col-span-5 rounded-2xl border border-champagne bg-biege/50 p-6 flex flex-col gap-5 sticky top-28">
          <h2 className="text-[22px] font-display text-admiral border-b border-champagne pb-3">
            Order Summary ({cart.items.reduce((s, i) => s + i.qty, 0)} items)
          </h2>

          <div className="flex flex-col gap-3 max-h-[280px] overflow-y-auto pr-1 custom-scrollbar">
            {cart.items.map((item) => (
              <div key={item.sku} className="flex items-center justify-between gap-3 text-[13.5px]">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-champagne">
                    <LazyImage
                      src={item.image || '/productBlank.svg'}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="font-serif text-admiral line-clamp-1">{item.name}</div>
                    <div className="text-[12px] text-admiral/65 tabular-nums">Qty: {item.qty}</div>
                  </div>
                </div>
                <span className="font-semibold text-admiral tabular-nums shrink-0">
                  {formatPrice(item.priceMinorUnit * item.qty)}
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2 border-t border-champagne pt-4 text-[14px]">
            <div className="flex justify-between">
              <span className="text-admiral/75">Subtotal</span>
              <span className="tabular-nums">{formatPrice(cart.subtotalMinorUnit)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-admiral/75">Shipping ({deliveryEstimate.label})</span>
              <span className="tabular-nums text-antiquity">
                {shippingFeeMinor === 0 ? 'Free' : formatPrice(shippingFeeMinor)}
              </span>
            </div>
            {cart.giftMinorUnit > 0 && (
              <div className="flex justify-between">
                <span className="text-admiral/75">Gift Box</span>
                <span className="tabular-nums">{formatPrice(cart.giftMinorUnit)}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-champagne pt-3 text-[18px] font-serif font-bold text-admiral">
              <span>Grand Total</span>
              <span className="tabular-nums">{formatPrice(grandTotalMinor)}</span>
            </div>
          </div>

          <button
            type="button"
            disabled={placing || !selectedAddress || matBlocked}
            onClick={handlePlaceOrder}
            className="w-full rounded-[40px] bg-admiral py-3.5 text-[15px] font-medium text-chiffon hover:opacity-90 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
          >
            {placing && <Spinner size="xs" color="light" />}
            <span>{placing ? 'Confirming Order...' : 'Place Order'}</span>
          </button>
        </aside>
      </div>
    </div>
  );
}
