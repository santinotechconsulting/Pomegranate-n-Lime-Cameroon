import React, { useEffect, useState } from 'react';
import { ChevronDown, Download, Package, RotateCcw, X } from 'lucide-react';
import { CAMEROON_CONTACT, formatMoney } from '../../data/cameroon';
import { useDocumentSeo, useStore } from '../../context/StoreContext';
import type { Order } from '../../types/store';
import { LazyImage } from '../../components/LazyImage';
import { Spinner } from '../../components/Spinner';
import { AccountSidebar } from './AccountSidebar';

const STATUS_BADGES: Record<string, { label: string; cls: string }> = {
  placed: { label: 'Placed', cls: 'border-[#AE590D] bg-[#AE590D]/10 text-[#AE590D]' },
  processing: { label: 'Placed', cls: 'border-[#AE590D] bg-[#AE590D]/10 text-[#AE590D]' },
  shipped: { label: 'Shipped', cls: 'border-[#6155F5] bg-[#6155F5]/10 text-[#6155F5]' },
  delivered: { label: 'Delivered', cls: 'border-[#009E28] bg-[#009E28]/[0.06] text-[#009E28]' },
  cancelled: { label: 'Cancelled', cls: 'border-[#ff383c] bg-[#ff383c]/20 text-[#ff383c]' },
  refunded: { label: 'Refunded', cls: 'border-[#8e8e93] bg-[#8e8e93]/20 text-[#8e8e93]' },
};

const CANCEL_REASONS = [
  'Ordered by Mistake',
  'Want to Change Order',
  'Delivery Taking Too Long',
  'Other',
];

function formatDateLong(d: string) {
  return new Date(d).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

function printCameroonInvoice(order: Order) {
  const rows = order.items
    .map(
      (item, i) => `
      <tr>
        <td style="padding:10px;border-bottom:1px solid #e9d8ad;text-align:center;">${i + 1}</td>
        <td style="padding:10px;border-bottom:1px solid #e9d8ad;">
          <div style="font-weight:600;color:#191d45;">${item.name}</div>
          ${item.variantLabel ? `<div style="font-size:11px;color:#5a5f78;">${item.variantLabel}</div>` : ''}
          <div style="font-size:10px;color:#888;font-family:monospace;">SKU: ${item.sku}</div>
        </td>
        <td style="padding:10px;border-bottom:1px solid #e9d8ad;text-align:center;">${item.qty}</td>
        <td style="padding:10px;border-bottom:1px solid #e9d8ad;text-align:right;">${formatMoney(item.priceMinorUnit, 'XAF')}</td>
        <td style="padding:10px;border-bottom:1px solid #e9d8ad;text-align:right;font-weight:600;">${formatMoney(
          item.priceMinorUnit * item.qty,
          'XAF'
        )}</td>
      </tr>`
    )
    .join('');

  const html = `<!doctype html>
  <html><head><title>Invoice - ${order.orderNumber}</title>
  <style>body{font-family:Georgia,serif;color:#191d45;padding:36px;max-width:794px;margin:auto;background:#fff;}</style>
  </head><body>
    <div style="display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #ac6628;padding-bottom:16px;margin-bottom:20px;">
      <div>
        <h1 style="margin:0;font-size:24px;color:#191d45;">Pomegranate 'n' Lime Cameroon</h1>
        <p style="margin:4px 0 0;font-size:12px;color:#555;">${CAMEROON_CONTACT.legalEntity}</p>
        <p style="margin:2px 0;font-size:12px;color:#555;">${CAMEROON_CONTACT.doualaAtelier}</p>
        <p style="margin:2px 0;font-size:11px;color:#777;">${CAMEROON_CONTACT.taxId}</p>
      </div>
      <div style="text-align:right;">
        <div style="font-size:18px;font-weight:bold;color:#ac6628;">TAX INVOICE</div>
        <div style="font-size:13px;margin-top:4px;">Invoice: INV-${order.orderNumber}</div>
        <div style="font-size:12px;color:#555;">Date: ${formatDateLong(order.createdAt)}</div>
        <div style="font-size:12px;color:#555;">Payment: ${order.paymentMethod}</div>
      </div>
    </div>
    <div style="margin-bottom:20px;background:#f3f0dd;padding:14px;border-radius:8px;">
      <div style="font-size:11px;text-transform:uppercase;color:#ac6628;font-weight:bold;">Billed & Shipped To</div>
      <div style="font-size:15px;font-weight:bold;margin-top:4px;">${order.shippingAddress.fullName}</div>
      <div style="font-size:13px;margin-top:2px;">${order.shippingAddress.line1}${
    order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ''
  }</div>
      <div style="font-size:13px;">${order.shippingAddress.city}, ${order.shippingAddress.state} · ${
    order.shippingAddress.country
  }</div>
      <div style="font-size:12px;color:#555;margin-top:4px;">Tel: ${order.shippingAddress.phone} · Email: ${
    order.customerEmail
  }</div>
    </div>
    <table style="width:100%;border-collapse:collapse;font-size:13px;">
      <thead>
        <tr style="background:#191d45;color:#f3f0dd;">
          <th style="padding:10px;">#</th>
          <th style="padding:10px;text-align:left;">Item Description</th>
          <th style="padding:10px;">Qty</th>
          <th style="padding:10px;text-align:right;">Unit Price</th>
          <th style="padding:10px;text-align:right;">Amount</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
    <div style="margin-top:20px;margin-left:auto;max-width:290px;font-size:13px;">
      <div style="display:flex;justify-content:space-between;padding:4px 0;"><span>Subtotal:</span><span>${formatMoney(order.subtotalMinorUnit, 'XAF')}</span></div>
      <div style="display:flex;justify-content:space-between;padding:4px 0;"><span>Shipping:</span><span>${formatMoney(order.shippingMinorUnit, 'XAF')}</span></div>
      ${
        order.giftMinorUnit > 0
          ? `<div style="display:flex;justify-content:space-between;padding:4px 0;"><span>Gift Box:</span><span>${formatMoney(order.giftMinorUnit, 'XAF')}</span></div>`
          : ''
      }
      <div style="display:flex;justify-content:space-between;padding:8px 0;border-top:2px solid #191d45;margin-top:6px;font-weight:bold;font-size:16px;">
        <span>Grand Total:</span><span>${formatMoney(order.totalMinorUnit, 'XAF')}</span>
      </div>
    </div>
    <p style="margin-top:32px;font-size:11px;color:#777;border-top:1px solid #e9d8ad;padding-top:12px;">
      All disputes are subject to Douala / Littoral (Cameroon) OHADA jurisdiction. Thank you for hosting with Pomegranate 'n' Lime Cameroon!
    </p>
  </body></html>`;

  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  iframe.setAttribute('aria-hidden', 'true');
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument || iframe.contentWindow?.document;
  if (doc) {
    doc.open();
    doc.write(html);
    doc.close();
    setTimeout(() => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      } catch {
        // Fallback download if iframe print is blocked
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Invoice-${order.orderNumber}.html`;
        a.click();
        URL.revokeObjectURL(url);
      }
      setTimeout(() => iframe.remove(), 1500);
    }, 150);
  }
}

export function OrdersPage() {
  const {
    user,
    authChecked,
    orders,
    refreshOrders,
    products,
    openAddToCartModal,
    formatPrice,
    navigate,
    showToast,
  } = useStore();

  useDocumentSeo({
    title: "My Orders | Pomegranate 'n' Lime Cameroon",
    description: 'Track your Pomegranate ’n’ Lime Cameroon orders, download official invoices, or manage cancellations.',
  });

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [cancelTarget, setCancelTarget] = useState<Order | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [reasonOpen, setReasonOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedOrder(null);
        if (!cancelling) setCancelTarget(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [cancelling]);

  if (!authChecked) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="md" label="Loading your orders..." />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-[600px] px-4 py-20 text-center">
        <h1 className="text-[28px] font-serif text-admiral mb-3">Sign in to view your Orders</h1>
        <p className="text-[15px] text-admiral/75 mb-6">
          View order statuses, download Cameroon tax invoices, or reorder your favourites.
        </p>
        <button
          type="button"
          onClick={() => navigate('/login?next=/account/orders')}
          className="rounded-[40px] bg-admiral px-8 py-3 text-[15px] text-chiffon hover:opacity-90 cursor-pointer"
        >
          Login to Continue
        </button>
      </div>
    );
  }

  const handleConfirmCancel = async () => {
    if (!cancelTarget || !cancelReason) return;
    setCancelling(true);
    try {
      const res = await fetch(`/api/me/orders/${encodeURIComponent(cancelTarget._id)}/cancel`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ reason: cancelReason }),
      });
      if (res.ok) {
        await refreshOrders();
        if (selectedOrder && selectedOrder._id === cancelTarget._id) {
          setSelectedOrder(await res.json());
        }
        setCancelTarget(null);
        setCancelReason('');
        showToast('Order cancelled successfully');
      }
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-[1920px] flex-col gap-6 px-3 sm:px-6 lg:flex-row lg:gap-10 lg:px-16 xl:px-24 py-8 lg:py-12">
      <AccountSidebar active="orders" sidebarTitle="My Orders" />

      <div className="flex flex-1 flex-col gap-6 min-w-0">
        <div className="px-1">
          <h1 className="text-xl sm:text-[28px] font-serif font-normal text-admiral">
            Orders
          </h1>
          <p className="mt-1 text-xs sm:text-[14px] text-purple">
            Track deliveries across Cameroon &amp; download your invoices
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center pb-8 pt-4 px-4">
            <img src="/orderBlank.svg" alt="No orders yet" className="h-56 w-56 mb-6" />
            <h2 className="text-[20px] sm:text-[24px] font-serif text-admiral mb-2">
              No Orders Yet
            </h2>
            <p className="text-[14px] sm:text-[16px] text-admiral/75 mb-8 max-w-md">
              Explore our bespoke table mats, runners, and dining sets to place your first order.
            </p>
            <button
              type="button"
              onClick={() => navigate('/collections')}
              className="rounded-full bg-antiquity px-8 py-2.5 text-[15px] font-medium text-chiffon hover:opacity-90 cursor-pointer"
            >
              Explore Collections
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {orders.map((order) => {
              const badge = STATUS_BADGES[order.displayStatus || order.status] || STATUS_BADGES.placed;
              const canCancel = order.status === 'placed' || order.status === 'processing';
              return (
                <article
                  key={order._id}
                  className="rounded-xl border border-champagne bg-chiffon p-5 transition-shadow hover:shadow-md"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-champagne/60 pb-4">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[16px] sm:text-[18px] font-serif font-bold text-admiral tabular-nums">
                        Order #{order.orderNumber}
                      </span>
                      <span className="text-[13px] text-admiral/70">
                        Placed on {formatDateLong(order.createdAt)} · {order.paymentMethod}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`flex h-7 items-center justify-center rounded-full border px-4 text-[12px] font-medium leading-none ${badge.cls}`}
                      >
                        {badge.label}
                      </span>
                      <span className="text-[17px] font-serif font-bold text-admiral tabular-nums">
                        {formatPrice(order.totalMinorUnit)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col gap-3">
                    {order.items.map((item) => (
                      <div
                        key={item.sku}
                        className="flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-champagne/30">
                            <LazyImage
                              src={item.image || '/productBlank.svg'}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <a
                              href={`/products/${item.slug}`}
                              onClick={(e) => {
                                e.preventDefault();
                                navigate(`/products/${item.slug}`);
                              }}
                              className="text-[15px] font-serif text-admiral hover:text-antiquity line-clamp-1"
                            >
                              {item.name}
                            </a>
                            <div className="text-[12px] text-admiral/65 tabular-nums">
                              Qty: {item.qty} · {formatPrice(item.priceMinorUnit)} each
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            const prod = products.find((p) => p._id === item.productId || p.slug === item.slug);
                            if (prod) {
                              const variant = prod.variants?.find((v) => v.sku === item.sku) || prod.variants?.[0];
                              openAddToCartModal(prod, variant, item.qty);
                            }
                          }}
                          className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-champagne px-3.5 py-1.5 text-[12px] font-medium text-antiquity hover:bg-champagne/40 cursor-pointer shrink-0"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                          <span>Reorder</span>
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-champagne/60 pt-4">
                    <div className="text-[13px] text-admiral/75">
                      Deliver to: <span className="font-medium text-admiral">{order.shippingAddress.city}, {order.shippingAddress.state}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      {canCancel && (
                        <button
                          type="button"
                          onClick={() => {
                            setCancelTarget(order);
                            setCancelReason('');
                          }}
                          className="rounded-full border border-[#ff383c]/50 px-4 py-2 text-[13px] font-medium text-[#ff383c] hover:bg-[#ff383c]/10 cursor-pointer"
                        >
                          Cancel Order
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => printCameroonInvoice(order)}
                        className="inline-flex items-center gap-1.5 rounded-full bg-champagne px-4 py-2 text-[13px] font-medium text-admiral hover:bg-champagne/80 cursor-pointer"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>Invoice</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedOrder(order)}
                        className="rounded-full bg-admiral px-5 py-2 text-[13px] font-medium text-chiffon hover:opacity-90 cursor-pointer"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-[150] flex items-end lg:items-center justify-center bg-[#232323]/80 p-0 lg:p-4"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="flex flex-col items-center gap-3 w-full lg:max-w-[960px] max-h-[100dvh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedOrder(null)}
              aria-label="Close"
              className="flex lg:hidden h-11 w-11 shrink-0 items-center justify-center rounded-full bg-chiffon shadow-lg border border-champagne cursor-pointer"
            >
              <X className="h-5 w-5 text-admiral" />
            </button>

            <div className="relative flex w-full max-h-[82dvh] lg:max-h-[90vh] flex-col rounded-t-[24px] lg:rounded-[20px] bg-[#f5f1e3] shadow-2xl overflow-hidden">
              <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-champagne/50">
                <div>
                  <h2 className="text-[22px] sm:text-[26px] font-serif text-admiral">
                    Orders Details
                  </h2>
                  <span className="text-[13px] text-admiral/75 tabular-nums">
                    Order Id: {selectedOrder.orderNumber}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="hidden lg:flex items-center gap-1.5 text-[15px] text-admiral hover:opacity-75 font-serif cursor-pointer"
                >
                  <X className="h-4 w-4" />
                  <span>Close</span>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
                <div className="rounded-xl border border-champagne divide-y divide-champagne/50">
                  {selectedOrder.items.map((item) => (
                    <div
                      key={item.sku}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-champagne/30">
                          <LazyImage
                            src={item.image || '/productBlank.svg'}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="text-[16px] font-serif text-admiral">{item.name}</div>
                          {item.variantLabel && (
                            <div className="text-[12px] text-admiral/70">{item.variantLabel}</div>
                          )}
                          <div className="text-[12px] text-antiquity mt-1 tabular-nums">
                            Qty: {item.qty} · {formatPrice(item.priceMinorUnit * item.qty)}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const prod = products.find((p) => p._id === item.productId || p.slug === item.slug);
                          if (prod) {
                            const variant = prod.variants?.find((v) => v.sku === item.sku) || prod.variants?.[0];
                            setSelectedOrder(null);
                            openAddToCartModal(prod, variant, item.qty);
                          }
                        }}
                        className="self-start sm:self-center rounded-full border border-antiquity px-4 py-1.5 text-[13px] text-antiquity hover:bg-antiquity hover:text-chiffon transition-colors cursor-pointer"
                      >
                        Reorder
                      </button>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 rounded-xl border border-champagne p-5">
                  <div className="flex flex-col gap-2 text-[14px]">
                    <div className="font-bold font-serif text-[16px] text-admiral mb-1">
                      Payment &amp; Totals
                    </div>
                    <div className="flex justify-between">
                      <span className="text-admiral/75">Total Quantity</span>
                      <span className="tabular-nums">
                        {selectedOrder.items.reduce((s, i) => s + i.qty, 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-admiral/75">Sub Total</span>
                      <span className="tabular-nums">
                        {formatPrice(selectedOrder.subtotalMinorUnit)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-admiral/75">Shipping</span>
                      <span className="tabular-nums">
                        {selectedOrder.shippingMinorUnit === 0
                          ? 'Free'
                          : formatPrice(selectedOrder.shippingMinorUnit)}
                      </span>
                    </div>
                    {selectedOrder.giftMinorUnit > 0 && (
                      <div className="flex justify-between">
                        <span className="text-admiral/75">
                          Gift Charges ({selectedOrder.gift?.name || 'Gift Box'})
                        </span>
                        <span className="tabular-nums">
                          {formatPrice(selectedOrder.giftMinorUnit)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between border-t border-champagne pt-2 font-bold font-serif text-[16px]">
                      <span>Grand Total</span>
                      <span className="tabular-nums">
                        {formatPrice(selectedOrder.totalMinorUnit)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between gap-4">
                    <div>
                      <div className="font-bold font-serif text-[16px] text-admiral mb-1">
                        Delivery Address
                      </div>
                      <p className="text-[14px] text-admiral/85 leading-relaxed">
                        {selectedOrder.shippingAddress.fullName}
                        <br />
                        {selectedOrder.shippingAddress.line1}
                        {selectedOrder.shippingAddress.line2
                          ? `, ${selectedOrder.shippingAddress.line2}`
                          : ''}
                        <br />
                        {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} —{' '}
                        {selectedOrder.shippingAddress.country}
                        <br />
                        {selectedOrder.shippingAddress.phone}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={() => printCameroonInvoice(selectedOrder)}
                        className="flex h-9 w-full items-center justify-center gap-2 rounded-full bg-champagne text-admiral text-[14px] font-medium hover:bg-champagne/80 cursor-pointer"
                      >
                        <Download className="h-4 w-4" />
                        <span>Download Invoice</span>
                      </button>

                      {selectedOrder.status === 'delivered' && selectedOrder.items[0] && (
                        <button
                          type="button"
                          onClick={() => {
                            const slug = selectedOrder.items[0].slug;
                            setSelectedOrder(null);
                            navigate(`/products/${slug}#reviews`);
                          }}
                          className="flex h-9 w-full items-center justify-center rounded-full border border-champagne text-admiral text-[14px] font-medium hover:bg-champagne/25 cursor-pointer"
                        >
                          Write a product review
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Order Modal */}
      {cancelTarget && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
          onClick={() => !cancelling && setCancelTarget(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
            className="flex w-full max-w-[460px] flex-col gap-4 rounded-[24px] bg-chiffon border border-champagne p-6 sm:p-7 shadow-2xl text-admiral"
          >
            <div className="flex items-start justify-between border-b border-champagne/50 pb-3">
              <div>
                <h2 className="text-[20px] font-serif font-bold">Cancel Order</h2>
                <span className="text-[13px] text-admiral/70">
                  Order ID: <strong className="text-admiral">#{cancelTarget.orderNumber}</strong>
                </span>
              </div>
              <button
                type="button"
                disabled={cancelling}
                onClick={() => setCancelTarget(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-admiral/60 hover:bg-champagne/40 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-[14px]">
              Are you sure you want to cancel order <strong>#{cancelTarget.orderNumber}</strong>?
            </p>

            <div className="relative flex flex-col gap-1.5">
              <label className="text-[13px] font-medium">
                Reason for cancellation <span className="text-[#ff383c]">*</span>
              </label>
              <button
                type="button"
                onClick={() => setReasonOpen((prev) => !prev)}
                className="flex w-full items-center justify-between rounded border border-champagne bg-white p-2.5 text-sm text-admiral cursor-pointer"
              >
                <span>{cancelReason || 'Select a reason...'}</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${
                    reasonOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {reasonOpen && (
                <ul className="rounded border border-champagne bg-white shadow-lg overflow-hidden">
                  {CANCEL_REASONS.map((r) => (
                    <li key={r}>
                      <button
                        type="button"
                        onClick={() => {
                          setCancelReason(r);
                          setReasonOpen(false);
                        }}
                        className="w-full px-3 py-2 text-left text-sm text-admiral hover:bg-champagne/40 cursor-pointer"
                      >
                        {r}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="mt-2 flex gap-3">
              <button
                type="button"
                disabled={cancelling}
                onClick={() => setCancelTarget(null)}
                className="flex-1 rounded-[40px] border border-admiral py-2.5 text-[14px] text-admiral hover:bg-champagne/40 cursor-pointer"
              >
                Keep Order
              </button>
              <button
                type="button"
                disabled={cancelling || !cancelReason}
                onClick={handleConfirmCancel}
                className="flex-1 rounded-[40px] bg-admiral py-2.5 text-[14px] text-chiffon hover:opacity-90 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {cancelling && <Spinner size="xs" color="light" />}
                <span>{cancelling ? 'Cancelling...' : 'Confirm Cancel'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
