import React, { useEffect } from 'react';
import { Heart, Trash2, X, Gift } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { LazyImage } from './LazyImage';
import { QuantityStepper } from './QuantityStepper';

export function CartDrawer() {
  const {
    isCartDrawerOpen,
    closeCartDrawer,
    cart,
    gifts,
    selectGift,
    updateCartQty,
    removeCartItem,
    isWishlisted,
    toggleWishlist,
    formatPrice,
    navigate,
  } = useStore();

  useEffect(() => {
    if (!isCartDrawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCartDrawer();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isCartDrawerOpen, closeCartDrawer]);

  if (!isCartDrawerOpen) return null;

  const hasMatMinIssue = cart.matCount > 0 && cart.matCount < cart.matMinimumQuantity;
  const giftBox = gifts[0];
  const isGiftSelected = Boolean(cart.gift);

  return (
    <div className="fixed inset-0 z-[120] flex justify-end">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity"
        onClick={closeCartDrawer}
      />

      <aside
        aria-label="Shopping Cart Drawer"
        className="relative z-10 flex h-full w-full max-w-[430px] flex-col bg-chiffon text-admiral shadow-2xl border-l border-champagne"
      >
        <div className="flex items-center justify-between border-b border-champagne px-5 py-4">
          <div className="flex items-baseline gap-2">
            <h2 className="text-[20px] font-serif font-bold text-admiral">Your Cart</h2>
            <span className="text-[13px] text-antiquity tabular-nums">
              ({cart.items.length} {cart.items.length === 1 ? 'item' : 'items'})
            </span>
          </div>
          <button
            type="button"
            onClick={closeCartDrawer}
            aria-label="Close cart"
            className="flex h-8 w-8 items-center justify-center rounded-full text-admiral hover:bg-champagne/40 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-champagne/50">
          {cart.items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center p-8 text-center">
              <img src="/cartBlank.svg" alt="Empty Cart" className="h-44 w-44 mb-4" />
              <h3 className="text-[20px] font-serif text-admiral mb-2">Your Cart is Empty</h3>
              <p className="text-[14px] text-admiral/75 mb-6 max-w-xs">
                Curate bespoke hand-embroidered mats, runners, and dining sets for your table.
              </p>
              <button
                type="button"
                onClick={() => {
                  closeCartDrawer();
                  navigate('/collections');
                }}
                className="rounded-[40px] bg-antiquity px-7 py-2.5 text-[14px] font-medium text-chiffon hover:opacity-90 cursor-pointer"
              >
                Explore Collections
              </button>
            </div>
          ) : (
            cart.items.map((item) => {
              const wished = isWishlisted(item.productId, item.sku);
              const prodHref = `/products/${item.slug}?variant=${encodeURIComponent(item.sku)}`;
              return (
                <div
                  key={item.sku}
                  className="flex gap-4 px-5 py-4 hover:bg-champagne/15 transition-colors"
                >
                  <a
                    href={prodHref}
                    onClick={(e) => {
                      e.preventDefault();
                      closeCartDrawer();
                      navigate(prodHref);
                    }}
                    className="relative h-24 w-[86px] shrink-0 overflow-hidden rounded bg-champagne/40"
                  >
                    <LazyImage
                      src={item.image || '/productBlank.svg'}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </a>

                  <div className="flex flex-1 flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <a
                          href={prodHref}
                          onClick={(e) => {
                            e.preventDefault();
                            closeCartDrawer();
                            navigate(prodHref);
                          }}
                          className="text-[14px] font-serif text-admiral line-clamp-2 hover:text-antiquity"
                        >
                          {item.name}
                        </a>
                        <button
                          type="button"
                          onClick={() =>
                            toggleWishlist(
                              { _id: item.productId, slug: item.slug, name: item.name },
                              item.sku
                            )
                          }
                          aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
                          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-champagne text-antiquity cursor-pointer"
                        >
                          <Heart className="h-3.5 w-3.5" fill={wished ? '#ac6628' : 'none'} />
                        </button>
                      </div>
                      <p className="mt-1 flex items-center gap-2">
                        <span className="text-[11px] text-admiral/60 font-sans">MRP</span>
                        <span className="text-[15px] font-serif font-semibold text-admiral tabular-nums">
                          {formatPrice(item.priceMinorUnit)}
                        </span>
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-2 mt-2">
                      <QuantityStepper
                        size="sm"
                        qty={item.qty}
                        min={item.minimumQuantity || 1}
                        onChange={(next) => updateCartQty(item.sku, next)}
                      />
                      <button
                        type="button"
                        onClick={() => removeCartItem(item.sku)}
                        className="flex items-center gap-1.5 text-[13px] text-antiquity hover:opacity-75 cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {cart.items.length > 0 && (
          <div className="border-t border-champagne bg-biege/60 p-5 flex flex-col gap-3.5">
            {giftBox && (
              <label className="flex items-center justify-between gap-3 rounded-xl border border-champagne bg-chiffon px-3.5 py-2.5 cursor-pointer">
                <div className="flex items-center gap-2.5 min-w-0">
                  <input
                    type="checkbox"
                    checked={isGiftSelected}
                    onChange={(e) => selectGift(e.target.checked ? giftBox._id : null)}
                    className="h-4 w-4 accent-[#ac6628] cursor-pointer"
                  />
                  <Gift className="h-4 w-4 text-antiquity shrink-0" />
                  <div className="min-w-0">
                    <div className="text-[13px] font-medium text-admiral truncate">
                      Add {giftBox.name}
                    </div>
                    <div className="text-[11px] text-admiral/65 truncate">
                      {giftBox.description}
                    </div>
                  </div>
                </div>
                <span className="text-[13px] font-semibold text-antiquity tabular-nums shrink-0">
                  +{formatPrice(giftBox.price * 100)}
                </span>
              </label>
            )}

            {hasMatMinIssue && (
              <p className="rounded-lg bg-[#fff4e5] border border-antiquity/30 px-3 py-2 text-[12px] text-antiquity">
                Mats require a minimum of {cart.matMinimumQuantity} total pieces to checkout (you
                currently have {cart.matCount}).
              </p>
            )}

            <div className="flex items-center justify-between text-[16px] font-serif font-bold text-admiral">
              <span>Estimated Total</span>
              <span className="tabular-nums">{formatPrice(cart.totalMinorUnit)}</span>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  closeCartDrawer();
                  navigate('/cart');
                }}
                className="flex-1 rounded-[40px] border border-admiral py-2.5 text-[14px] font-medium text-admiral hover:bg-champagne/40 cursor-pointer"
              >
                View Cart
              </button>
              <button
                type="button"
                disabled={hasMatMinIssue}
                onClick={() => {
                  closeCartDrawer();
                  navigate('/checkout');
                }}
                className="flex-1 rounded-[40px] bg-antiquity py-2.5 text-[14px] font-medium text-chiffon hover:opacity-90 disabled:opacity-50 cursor-pointer"
              >
                Checkout
              </button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
