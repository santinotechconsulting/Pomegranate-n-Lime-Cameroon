import React from 'react';
import { Gift, Trash2 } from 'lucide-react';
import { CAMEROON_CONTACT } from '../data/cameroon';
import { useDocumentSeo, useStore } from '../context/StoreContext';
import { LazyImage } from '../components/LazyImage';
import { QuantityStepper } from '../components/QuantityStepper';

export function CartPage() {
  const {
    cart,
    gifts,
    formatPrice,
    updateCartQty,
    removeCartItem,
    selectGift,
    navigate,
  } = useStore();

  useDocumentSeo({
    title: "Shopping Cart | Pomegranate 'n' Lime Cameroon",
    description: 'Review your curated Pomegranate ’n’ Lime Cameroon table linens before checkout.',
    canonicalPath: '/cart',
  });

  const giftBox = gifts[0];
  const matBlocked = cart.matCount > 0 && cart.matCount < cart.matMinimumQuantity;
  const qualifiesFreeDouala = cart.subtotalMinorUnit >= CAMEROON_CONTACT.freeShippingThresholdUsdMinor;

  return (
    <div className="mx-auto max-w-[1920px] px-4 sm:px-8 lg:px-16 xl:px-24 py-10 sm:py-14">
      <h1 className="text-[30px] sm:text-[40px] font-display text-admiral mb-2">
        Your Shopping Cart
      </h1>
      <p className="text-[14px] text-antiquity mb-8">
        Complimentary courier delivery in Douala &amp; Yaoundé on orders above{' '}
        {formatPrice(CAMEROON_CONTACT.freeShippingThresholdUsdMinor)}
      </p>

      {cart.items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-champagne bg-chiffon py-16 px-4 text-center">
          <img src="/cartBlank.svg" alt="Empty cart" className="h-52 w-52 mb-6 opacity-90" />
          <h2 className="text-[24px] font-serif text-admiral mb-2">Your cart is currently empty</h2>
          <p className="text-[15px] text-admiral/75 max-w-md mb-7">
            Explore our signature embroidered linen table sets, runners, and mix-and-match mats.
          </p>
          <button
            type="button"
            onClick={() => navigate('/collections')}
            className="rounded-[40px] bg-admiral px-8 py-3 text-[15px] text-chiffon hover:opacity-90 cursor-pointer"
          >
            Explore Collections
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Itemized Cart List */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            {matBlocked && (
              <div className="rounded-xl border border-[#ff383c]/40 bg-[#ff383c]/10 px-4 py-3 text-[13.5px] text-admiral">
                You currently have <strong>{cart.matCount}</strong> individual table mat(s) in your cart. Please add{' '}
                <strong>{cart.matMinimumQuantity - cart.matCount} more</strong> (minimum {cart.matMinimumQuantity} mats total) before checking out.
              </div>
            )}

            <div className="rounded-2xl border border-champagne bg-chiffon divide-y divide-champagne/60 overflow-hidden">
              {cart.items.map((item) => (
                <div
                  key={item.sku}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <a
                      href={`/products/${item.slug}`}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(`/products/${item.slug}`);
                      }}
                      className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-champagne bg-champagne/25"
                    >
                      <LazyImage
                        src={item.image || '/productBlank.svg'}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </a>
                    <div className="min-w-0">
                      <a
                        href={`/products/${item.slug}`}
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(`/products/${item.slug}`);
                        }}
                        className="text-[17px] font-serif text-admiral hover:text-antiquity line-clamp-2"
                      >
                        {item.name}
                      </a>
                      {item.variantLabel && (
                        <div className="text-[13px] text-admiral/70 mt-0.5">{item.variantLabel}</div>
                      )}
                      <div className="text-[14px] font-semibold text-antiquity mt-1 tabular-nums">
                        {formatPrice(item.priceMinorUnit)} each
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-5">
                    <QuantityStepper
                      qty={item.qty}
                      min={1}
                      onChange={(val) => updateCartQty(item.sku, val)}
                    />
                    <div className="text-right min-w-[110px]">
                      <div className="text-[16px] font-serif font-bold text-admiral tabular-nums">
                        {formatPrice(item.priceMinorUnit * item.qty)}
                      </div>
                    </div>
                    <button
                      type="button"
                      aria-label={`Remove ${item.name}`}
                      onClick={() => removeCartItem(item.sku)}
                      className="p-2 text-admiral/55 hover:text-[#ff383c] cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Gift Box Option */}
            {giftBox && (
              <label className="flex items-center justify-between gap-4 rounded-2xl border border-champagne bg-biege/40 p-5 cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-champagne/70 text-antiquity">
                    <Gift className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-[16px] font-serif font-bold text-admiral">
                      Add Bespoke {giftBox.name} (+{formatPrice(giftBox.price * 100)})
                    </div>
                    <div className="text-[13px] text-admiral/75">
                      {giftBox.description || 'Signature keepsake box wrapped in satin ribbon for Cameroonian celebrations'}
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={Boolean(cart.gift)}
                  onChange={(e) => selectGift(e.target.checked ? giftBox._id : null)}
                  className="h-5 w-5 accent-[#ac6628] cursor-pointer shrink-0"
                />
              </label>
            )}
          </div>

          {/* Right: Order Summary */}
          <aside className="lg:col-span-4 rounded-2xl border border-champagne bg-biege/50 p-6 flex flex-col gap-4 sticky top-28">
            <h2 className="text-[22px] font-display text-admiral border-b border-champagne pb-3">
              Order Summary
            </h2>

            <div className="flex flex-col gap-2.5 text-[14.5px]">
              <div className="flex justify-between">
                <span className="text-admiral/75">Subtotal</span>
                <span className="font-semibold tabular-nums">{formatPrice(cart.subtotalMinorUnit)}</span>
              </div>
              {cart.giftMinorUnit > 0 && (
                <div className="flex justify-between">
                  <span className="text-admiral/75">Gift Box</span>
                  <span className="font-semibold tabular-nums">{formatPrice(cart.giftMinorUnit)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-admiral/75">Douala / Yaoundé Courier</span>
                <span className="font-semibold text-antiquity">
                  {qualifiesFreeDouala ? 'Complimentary' : formatPrice(600)}
                </span>
              </div>
              <div className="flex justify-between border-t border-champagne pt-3 text-[18px] font-serif font-bold text-admiral">
                <span>Estimated Total</span>
                <span className="tabular-nums">{formatPrice(cart.totalMinorUnit)}</span>
              </div>
            </div>

            <button
              type="button"
              disabled={matBlocked}
              onClick={() => navigate('/checkout')}
              className="mt-2 w-full rounded-[40px] bg-admiral py-3.5 text-[15px] font-medium text-chiffon hover:opacity-90 disabled:opacity-45 cursor-pointer"
            >
              Proceed to Checkout
            </button>

            <button
              type="button"
              onClick={() => navigate('/products')}
              className="w-full rounded-[40px] border border-antiquity py-3 text-[14px] text-antiquity hover:bg-champagne/40 cursor-pointer"
            >
              Continue Shopping
            </button>
          </aside>
        </div>
      )}
    </div>
  );
}
