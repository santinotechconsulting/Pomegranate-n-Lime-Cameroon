import React from 'react';
import { Heart } from 'lucide-react';
import type { Product, ProductVariant } from '../types/store';
import { useStore } from '../context/StoreContext';
import { LazyImage } from './LazyImage';

interface ProductCardProps {
  product: Product;
  selectedVariant?: ProductVariant;
  wished?: boolean;
  className?: string;
}

export function ProductCard({
  product,
  selectedVariant,
  wished,
  className = '',
}: ProductCardProps) {
  const { navigate, formatPrice, isWishlisted, toggleWishlist, openAddToCartModal } = useStore();
  const variant = selectedVariant || product.variants?.[0];
  const sku = variant?.sku || '';
  const imageSrc =
    variant?.images?.[0] || product.images?.[0] || '/productBlank.svg';
  const priceMinor = variant?.priceMinorUnit || 4500;
  const isWished = wished !== undefined ? wished : isWishlisted(product._id, sku);
  const isBestSeller = Boolean(product.isBestSeller);
  const isNewArrival = !isBestSeller && (product.tags || []).some((t) => /new|christmas/i.test(t));

  const productHref = `/products/${product.slug}${sku ? `?variant=${encodeURIComponent(sku)}` : ''}`;

  return (
    <article
      className={`group flex flex-col justify-between rounded-xl border border-champagne bg-chiffon overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(25,29,69,0.09)] ${className}`}
    >
      <div className="relative flex flex-col">
        <a
          href={productHref}
          onClick={(e) => {
            e.preventDefault();
            navigate(productHref);
          }}
          className="relative block aspect-[4/4.2] w-full overflow-hidden bg-champagne/25"
        >
          <LazyImage
            src={imageSrc}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Top Left Tag: Best Seller rotating gold animation OR New Arrival */}
          {isBestSeller && (
            <div className="absolute left-3 top-3 z-10">
              <div className="bestseller-tag">
                <span className="bestseller-tag-inner luxury-gold-shimmer text-[11px] tracking-wide font-sans">
                  Best Seller
                </span>
              </div>
            </div>
          )}
          {!isBestSeller && isNewArrival && (
            <div className="absolute left-3 top-3 z-10 rounded-full border border-champagne/80 bg-chiffon/95 px-3 py-1 text-[11px] font-medium text-antiquity shadow-sm font-sans">
              New Arrival
            </div>
          )}
        </a>

        {/* Top Right Wishlist Heart */}
        <button
          type="button"
          aria-label={isWished ? 'Remove from wishlist' : 'Add to Wishlist'}
          title={isWished ? 'Remove from wishlist' : 'Add to Wishlist'}
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product, sku);
          }}
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-chiffon/90 border border-champagne text-antiquity shadow-sm transition-transform duration-200 hover:scale-110 cursor-pointer"
        >
          <Heart
            className="h-4 w-4"
            fill={isWished ? '#ac6628' : 'none'}
            strokeWidth={1.9}
          />
        </button>

        {/* Card Content */}
        <div className="flex flex-col gap-2 p-3.5 sm:p-4">
          <a
            href={productHref}
            onClick={(e) => {
              e.preventDefault();
              navigate(productHref);
            }}
            className="text-[15px] sm:text-[16px] font-serif leading-snug text-admiral line-clamp-2 min-h-[2.6em] hover:text-antiquity transition-colors"
            title={product.name}
          >
            {product.name}
          </a>

          <div className="flex items-baseline gap-2 pt-0.5">
            <span className="text-[11px] font-sans uppercase tracking-wider text-admiral/60">
              MRP
            </span>
            <span className="text-[16px] sm:text-[17px] font-serif font-semibold text-admiral tabular-nums">
              {formatPrice(priceMinor)}
            </span>
          </div>
        </div>
      </div>

      <div className="px-3.5 pb-3.5 sm:px-4 sm:pb-4">
        <button
          type="button"
          onClick={() => openAddToCartModal(product, variant)}
          className="flex w-full items-center justify-center rounded-[40px] border border-antiquity bg-transparent py-2.5 px-4 text-[13px] sm:text-[14px] font-medium text-antiquity transition-all duration-200 hover:bg-antiquity hover:text-chiffon active:scale-[0.98] cursor-pointer whitespace-nowrap"
        >
          Add to Cart
        </button>
      </div>
    </article>
  );
}
