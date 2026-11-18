import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { isMatProduct, useStore } from '../context/StoreContext';
import type { ProductVariant } from '../types/store';
import { LazyImage } from './LazyImage';
import { QuantityStepper } from './QuantityStepper';
import { Spinner } from './Spinner';

export function AddToCartPopup() {
  const {
    addToCartModal,
    closeAddToCartModal,
    cart,
    addToCartDirect,
    formatPrice,
    navigate,
  } = useStore();

  const { open, product, variant: initialVariant, qty: initialQty } = addToCartModal;
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(initialVariant);
  const [qty, setQty] = useState(initialQty);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setSelectedVariant(initialVariant || product?.variants?.[0] || null);
      setQty(initialQty || 1);
      setError('');
    }
  }, [open, product, initialVariant, initialQty]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeAddToCartModal();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, closeAddToCartModal]);

  if (!open || !product || !selectedVariant) return null;

  const isMat = isMatProduct(product);
  const minQty = isMat ? 1 : Math.max(1, product.minimumQuantity || 1);
  const inCart = cart.items.some((i) => i.sku === selectedVariant.sku);
  const img =
    selectedVariant.images?.[0] || product.images?.[0] || '/productBlank.svg';
  const productUrl = `/products/${product.slug}?variant=${encodeURIComponent(selectedVariant.sku)}`;

  const handleAction = async () => {
    if (inCart) {
      closeAddToCartModal();
      navigate('/cart');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const ok = await addToCartDirect(product._id, selectedVariant.sku, qty);
      if (ok) {
        closeAddToCartModal();
      } else {
        setError('Could not add this item to your cart. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[150] flex items-end md:items-center justify-center bg-black/45 p-0 md:p-4 backdrop-blur-sm"
      onClick={closeAddToCartModal}
    >
      <div
        className="flex flex-col items-center gap-3 w-full max-w-[748px] max-h-[100dvh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Close"
          onClick={closeAddToCartModal}
          className="flex md:hidden h-11 w-11 shrink-0 items-center justify-center rounded-full bg-chiffon shadow-lg border border-champagne cursor-pointer"
        >
          <X className="h-5 w-5 text-admiral" />
        </button>

        <div
          role="dialog"
          aria-label="Add to Cart Confirmation"
          className="relative flex w-full md:max-w-[720px] max-h-[calc(100dvh-4.5rem)] md:max-h-[88vh] overflow-y-auto no-scrollbar flex-col rounded-t-[32px] md:rounded-[32px] border-t border-x md:border border-champagne bg-chiffon p-5 md:p-6 shadow-2xl"
        >
          <div className="pb-3 border-b border-champagne/60 flex items-center justify-center md:justify-between w-full mb-4">
            <h2 className="text-[18px] md:text-[20px] font-serif text-antiquity leading-none">
              Add to Cart
            </h2>
            <button
              type="button"
              onClick={closeAddToCartModal}
              className="hidden md:flex items-center gap-1 text-[16px] font-serif text-admiral hover:opacity-80 cursor-pointer"
            >
              <X className="h-5 w-5" />
              <span>Close</span>
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-stretch w-full">
            <a
              href={productUrl}
              onClick={(e) => {
                e.preventDefault();
                closeAddToCartModal();
                navigate(productUrl);
              }}
              className="relative w-32 h-32 md:w-[260px] md:h-[260px] shrink-0 overflow-hidden rounded-[20px] bg-champagne/30 self-center md:self-start group"
            >
              <LazyImage
                src={img}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </a>

            <div className="flex flex-col justify-between flex-1 min-w-0 gap-3">
              <div className="flex flex-col gap-2">
                <a
                  href={productUrl}
                  onClick={(e) => {
                    e.preventDefault();
                    closeAddToCartModal();
                    navigate(productUrl);
                  }}
                  className="text-[20px] md:text-[24px] leading-tight font-serif text-admiral hover:text-antiquity transition-colors"
                >
                  {product.name}
                </a>
                <div className="flex items-baseline gap-2">
                  <span className="text-[13px] text-admiral font-sans">MRP</span>
                  <span className="text-[20px] font-serif font-semibold text-admiral tabular-nums">
                    {formatPrice(selectedVariant.priceMinorUnit)}
                  </span>
                </div>
                <p className="text-[11px] text-admiral/60 font-sans">
                  Prices displayed include Cameroon VAT/customs guidance where applicable.
                </p>

                {isMat && (
                  <p className="text-[13px] leading-relaxed text-antiquity">
                    Please select a minimum of 4 mats for checkout. You can choose any combination
                    of mats from any collection, as long as the total quantity is at least 4 or more.
                  </p>
                )}

                {product.variants && product.variants.length > 1 && (
                  <div className="flex flex-col gap-2 pt-1">
                    <span className="text-[14px] text-admiral font-serif">Select an option</span>
                    <div className="flex flex-wrap gap-2">
                      {product.variants.map((v) => {
                        const active = v.sku === selectedVariant.sku;
                        return (
                          <button
                            key={v.sku}
                            type="button"
                            onClick={() => {
                              setSelectedVariant(v);
                              setQty(minQty);
                              setError('');
                            }}
                            className={`rounded-[28px] border px-3.5 py-1.5 text-[13px] leading-none cursor-pointer transition-all ${
                              active
                                ? 'border-antiquity text-antiquity bg-champagne/40 font-medium shadow-sm'
                                : 'border-primrose text-admiral hover:border-antiquity/60'
                            }`}
                          >
                            {v.label || v.sku}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-4 mt-2">
                {!inCart && (
                  <div className="flex items-center gap-4">
                    <span className="text-[14px] text-admiral font-serif">Quantity</span>
                    <QuantityStepper qty={qty} min={minQty} onChange={setQty} />
                  </div>
                )}

                <button
                  type="button"
                  disabled={loading}
                  onClick={handleAction}
                  className="flex items-center justify-center gap-2 w-full rounded-[40px] bg-antiquity py-3 px-8 text-[14px] font-medium text-chiffon hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Spinner size="sm" color="light" />
                      <span>Adding...</span>
                    </>
                  ) : inCart ? (
                    'Go to Cart'
                  ) : (
                    'Add to Cart'
                  )}
                </button>

                {error && <p className="text-[12px] text-[#ff383c]">{error}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
