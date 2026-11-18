import React, { useState } from 'react';
import { CheckCircle2, Package, Search, Truck } from 'lucide-react';
import { useDocumentSeo, useStore } from '../context/StoreContext';
import type { Order } from '../types/store';
import { Spinner } from '../components/Spinner';

export function TrackOrderPage() {
  const { formatPrice, navigate } = useStore();
  const [orderNumber, setOrderNumber] = useState('PNL-CM-1089');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState('');

  useDocumentSeo({
    title: "Track Your Order | Pomegranate 'n' Lime Cameroon",
    description:
      'Track your Pomegranate ’n’ Lime Cameroon shipment status across Douala, Yaoundé, and international destinations.',
    canonicalPath: '/track-order',
  });

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim()) return;
    setLoading(true);
    setError('');
    setOrder(null);
    try {
      const res = await fetch(`/api/orders/track/${encodeURIComponent(orderNumber.trim())}`);
      if (!res.ok) {
        const d = await res.json().catch(() => null);
        setError(d?.error || 'Order not found. Try PNL-CM-1089 or PNL-CM-1042.');
        return;
      }
      setOrder(await res.json());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
      <div className="text-center mb-10">
        <h1 className="text-[32px] sm:text-[42px] font-display text-admiral">
          Track Your Order
        </h1>
        <p className="mt-2 text-[15px] text-antiquity">
          Enter your Cameroon order reference (e.g. <span className="font-mono">PNL-CM-1089</span> or{' '}
          <span className="font-mono">PNL-CM-1042</span>)
        </p>
      </div>

      <form
        onSubmit={handleTrack}
        className="flex flex-col sm:flex-row gap-3 rounded-2xl border border-champagne bg-chiffon p-5 shadow-sm mb-8"
      >
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-admiral/50" />
          <input
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder="Order ID (e.g. PNL-CM-1089)"
            className="h-12 w-full rounded-[41px] border border-champagne bg-white pl-11 pr-4 text-[14px] text-admiral outline-none focus:border-antiquity"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="h-12 rounded-[40px] bg-admiral px-8 text-[14px] font-medium text-chiffon hover:opacity-90 cursor-pointer flex items-center justify-center gap-2"
        >
          {loading && <Spinner size="xs" color="light" />}
          <span>{loading ? 'Searching...' : 'Track Order'}</span>
        </button>
      </form>

      {error && (
        <div className="rounded-xl border border-[#ff383c]/40 bg-[#ff383c]/10 p-4 text-center text-[14px] text-admiral">
          {error}
        </div>
      )}

      {order && (
        <div className="rounded-2xl border border-champagne bg-chiffon p-6 sm:p-8 shadow-md">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-champagne pb-4 mb-6">
            <div>
              <span className="text-[12px] font-sans uppercase tracking-wider text-antiquity">
                Shipment Status
              </span>
              <h2 className="text-[24px] font-serif font-bold text-admiral tabular-nums">
                Order #{order.orderNumber}
              </h2>
            </div>
            <span className="rounded-full border border-antiquity bg-biege px-4 py-1.5 text-[13px] font-medium uppercase text-antiquity">
              {order.status}
            </span>
          </div>

          <div className="space-y-4 mb-6">
            {order.statusHistory.map((step, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-admiral text-primrose">
                  {step.status === 'delivered' ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : step.status === 'shipped' ? (
                    <Truck className="h-4 w-4" />
                  ) : (
                    <Package className="h-4 w-4" />
                  )}
                </div>
                <div>
                  <div className="font-serif font-semibold capitalize text-admiral">
                    {step.status}
                  </div>
                  <div className="text-[13px] text-admiral/70">
                    {new Date(step.at).toLocaleString('en-GB', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                    {step.note ? ` · ${step.note}` : ''}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-champagne pt-4 text-[14px]">
            <div>
              Destination: <strong>{order.shippingAddress.city}, {order.shippingAddress.state}</strong> · Total:{' '}
              <strong className="tabular-nums">{formatPrice(order.totalMinorUnit)}</strong>
            </div>
            <button
              type="button"
              onClick={() => navigate('/account/orders')}
              className="text-antiquity underline cursor-pointer"
            >
              Open Full Order History
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
