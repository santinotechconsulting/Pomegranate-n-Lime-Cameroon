import React from 'react';
import { useDocumentSeo, useStore } from '../../context/StoreContext';
import { ProductCard } from '../../components/ProductCard';
import { Spinner } from '../../components/Spinner';
import { AccountSidebar } from './AccountSidebar';

export function WishlistPage() {
  const { user, authChecked, wishlist, navigate } = useStore();

  useDocumentSeo({
    title: "My Wishlist | Pomegranate 'n' Lime Cameroon",
    description: 'Your saved hand-embroidered table runners, mats, and bespoke dining pieces.',
  });

  if (!authChecked) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="md" label="Loading your wishlist..." />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-[600px] px-4 py-20 text-center">
        <h1 className="text-[28px] font-serif text-admiral mb-3">Sign in to view your Wishlist</h1>
        <p className="text-[15px] text-admiral/75 mb-6">
          Save your favourite table linens and curated sets to revisit anytime.
        </p>
        <button
          type="button"
          onClick={() => navigate('/login?next=/account/wishlist')}
          className="rounded-[40px] bg-admiral px-8 py-3 text-[15px] text-chiffon hover:opacity-90 cursor-pointer"
        >
          Login to Continue
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-[1920px] flex-col gap-6 px-3 sm:px-6 lg:flex-row lg:gap-10 lg:px-16 xl:px-24 py-8 lg:py-12">
      <AccountSidebar active="wishlist" sidebarTitle="My Wishlist" />

      <div className="flex flex-1 flex-col gap-6 min-w-0">
        <div className="px-1">
          <h1 className="text-xl sm:text-[28px] font-serif font-normal text-admiral">
            My Wishlist
          </h1>
          <p className="mt-1 text-xs sm:text-[14px] text-purple">
            Curated pieces saved for your Cameroon dining room
          </p>
        </div>

        {wishlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center pb-8 pt-4 px-4">
            <img src="/wishlistBlank.svg" alt="Your Wishlist is Empty" className="h-56 w-56 mb-6" />
            <h2 className="text-[18px] sm:text-[24px] font-serif text-admiral mb-2.5">
              Your Wishlist is Empty
            </h2>
            <p className="text-[14px] sm:text-[16px] text-admiral/80 mb-8 leading-relaxed max-w-md">
              Save the pieces you love and keep them close. Add your favourites to your wishlist and
              find them whenever you&apos;re ready.
            </p>
            <button
              type="button"
              onClick={() => navigate('/collections')}
              className="rounded-full bg-antiquity px-8 py-2.5 text-[15px] font-medium text-chiffon transition-opacity hover:opacity-90 cursor-pointer"
            >
              Explore Collections
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-5 pb-5 border border-champagne rounded-lg bg-chiffon">
            <div className="flex h-12 items-center border-b border-champagne bg-chiffon px-4 py-3 rounded-t-lg">
              <span className="text-[16px] font-serif text-admiral tabular-nums">
                {wishlist.length} {wishlist.length === 1 ? 'Item' : 'Items'}
              </span>
            </div>

            <div className="grid max-[380px]:grid-cols-1 grid-cols-2 gap-4 px-3 sm:gap-5 sm:px-4 lg:[grid-template-columns:repeat(auto-fill,minmax(240px,1fr))] lg:gap-5 lg:px-5">
              {wishlist.map((product) => {
                const variant =
                  product.selectedVariant ||
                  product.variants?.find((v) => v.sku === product.selectedVariantSku) ||
                  product.variants?.[0];
                const key = `${product._id}-${product.selectedVariantSku || variant?.sku || ''}`;
                return (
                  <ProductCard
                    key={key}
                    product={product}
                    selectedVariant={variant}
                    wished
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
