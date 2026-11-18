import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useDocumentSeo, useStore } from '../context/StoreContext';
import { LazyImage } from '../components/LazyImage';
import { ProductCard } from '../components/ProductCard';
import { Spinner } from '../components/Spinner';

export function HomePage() {
  const {
    banners,
    collections,
    shopTheLook,
    bestSellers,
    catalogLoaded,
    navigate,
  } = useStore();

  useDocumentSeo({
    title: "Pomegranate 'n' Lime Cameroon – Bespoke Table Linens & Hosting",
    description:
      'Mastering the Art of Hosting in Cameroon. Shop artisanal hand-embroidered linen table mats, runners, napkins, and bespoke gift boxes across Douala, Yaoundé & globally.',
    canonicalPath: '/',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Store',
      name: "Pomegranate 'n' Lime Cameroon",
      url: typeof window !== 'undefined' ? window.location.origin : 'https://www.pomegranatenlime.cm',
      priceRange: 'FCFA 15,000 - 600,000',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Rue des Palmiers, Bonapriso',
        addressLocality: 'Douala',
        addressCountry: 'CM',
      },
    },
  });

  // Hero Carousel State with directional CSS slide animation
  const activeBanners = useMemo(
    () => [...banners].filter((b) => b.active !== false).sort((a, b) => a.sortOrder - b.sortOrder),
    [banners]
  );
  const [slideIndex, setSlideIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const [animating, setAnimating] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const goToSlide = useCallback(
    (nextIdx: number, dir: 'next' | 'prev') => {
      if (activeBanners.length <= 1 || nextIdx === slideIndex || animating) return;
      setDirection(dir);
      setPrevIndex(slideIndex);
      setSlideIndex(nextIdx);
      setAnimating(true);
      setTimeout(() => {
        setPrevIndex(null);
        setAnimating(false);
      }, 720);
    },
    [activeBanners.length, slideIndex, animating]
  );

  const handleNextSlide = useCallback(() => {
    if (activeBanners.length <= 1) return;
    goToSlide((slideIndex + 1) % activeBanners.length, 'next');
  }, [activeBanners.length, slideIndex, goToSlide]);

  const handlePrevSlide = useCallback(() => {
    if (activeBanners.length <= 1) return;
    goToSlide((slideIndex - 1 + activeBanners.length) % activeBanners.length, 'prev');
  }, [activeBanners.length, slideIndex, goToSlide]);

  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const timer = setInterval(handleNextSlide, 7000);
    return () => clearInterval(timer);
  }, [activeBanners.length, handleNextSlide]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNextSlide();
      if (e.key === 'ArrowLeft') handlePrevSlide();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleNextSlide, handlePrevSlide]);

  // Shop The Look state
  const [lookIndex, setLookIndex] = useState(0);
  const [hotspotIndex, setHotspotIndex] = useState(0);
  const [mobileLookSheetOpen, setMobileLookSheetOpen] = useState(false);

  const looks = shopTheLook?.looks || [];
  const currentLook = looks[lookIndex];
  const hotspots = currentLook?.hotspots || [];
  const activeHotspot = hotspots[hotspotIndex] || hotspots[0];

  // Best Sellers horizontal scroller
  const bestScrollRef = useRef<HTMLDivElement | null>(null);
  const scrollBestSellers = (dir: 'left' | 'right') => {
    if (!bestScrollRef.current) return;
    const step = bestScrollRef.current.clientWidth * 0.78;
    bestScrollRef.current.scrollBy({ left: dir === 'left' ? -step : step, behavior: 'smooth' });
  };

  if (!catalogLoaded && activeBanners.length === 0) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Spinner size="lg" label="Setting your table..." />
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-clip">
      {/* 1. HERO BANNER CAROUSEL */}
      <section
        aria-label="Featured Collections"
        className="relative w-full aspect-[1440/688] max-h-[82vh] min-h-[260px] overflow-hidden bg-admiral/10 select-none"
        onTouchStart={(e) => {
          touchStartX.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          if (touchStartX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchStartX.current;
          touchStartX.current = null;
          if (Math.abs(dx) > 45) {
            if (dx < 0) handleNextSlide();
            else handlePrevSlide();
          }
        }}
      >
        {activeBanners.map((banner, idx) => {
          const isCurrent = idx === slideIndex;
          const isPrevious = idx === prevIndex;
          if (!isCurrent && !isPrevious) return null;

          let animCls = '';
          if (animating) {
            if (isCurrent) animCls = direction === 'next' ? 'slide-in-right z-20' : 'slide-in-left z-20';
            else if (isPrevious) animCls = direction === 'next' ? 'slide-out-left z-10' : 'slide-out-right z-10';
          } else if (isCurrent) {
            animCls = 'z-20';
          }

          return (
            <div
              key={`${banner.image}-${idx}`}
              className={`absolute inset-0 cursor-pointer ${animCls}`}
              onClick={() => banner.ctaHref && navigate(banner.ctaHref)}
            >
              <LazyImage
                src={banner.image}
                alt={banner.heading || `Pomegranate 'n' Lime Cameroon Collection Banner ${idx + 1}`}
                fill
                priority={idx === 0}
                className="object-cover"
              />
              {(banner.heading || banner.subheading) && (
                <div className="absolute inset-0 bg-gradient-to-t from-admiral/60 via-transparent to-transparent flex items-end p-6 sm:p-12 lg:p-16">
                  <div className="max-w-xl text-chiffon">
                    {banner.heading && (
                      <h1 className="text-[28px] sm:text-[42px] lg:text-[52px] font-display leading-tight">
                        {banner.heading}
                      </h1>
                    )}
                    {banner.subheading && (
                      <p className="mt-2 text-[14px] sm:text-[18px] text-champagne">{banner.subheading}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Hero Arrows */}
        {activeBanners.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous banner"
              onClick={handlePrevSlide}
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-chiffon/85 border border-champagne text-admiral shadow-md transition-transform hover:scale-105 cursor-pointer"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Next banner"
              onClick={handleNextSlide}
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-chiffon/85 border border-champagne text-admiral shadow-md transition-transform hover:scale-105 cursor-pointer"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 rounded-full bg-admiral/35 px-3 py-1.5 backdrop-blur-xs">
              {activeBanners.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Slide ${i + 1}`}
                  onClick={() => goToSlide(i, i > slideIndex ? 'next' : 'prev')}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    i === slideIndex ? 'w-6 bg-primrose' : 'w-2 bg-chiffon/65 hover:bg-chiffon'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </section>

      {/* 2. COLLECTIONS SECTION WITH 3D FLIP CARDS & WALLPAPER BACKDROP */}
      <section className="relative py-14 sm:py-20 lg:py-24 overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-20 bg-repeat bg-center"
          style={{ backgroundImage: "url('/wallpaper.jpg')", backgroundSize: '520px' }}
        />

        <div className="relative z-10 mx-auto max-w-[1920px] px-4 sm:px-8 lg:px-16 xl:px-24">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
            <h2 className="text-[30px] sm:text-[42px] font-display font-normal text-admiral tracking-wide">
              Collections
            </h2>
            <p className="mt-2.5 text-[15px] sm:text-[18px] italic font-serif text-antiquity">
              “Life is a love affair - let us celebrate it with style and elegance”
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 sm:gap-7">
            {collections.map((col) => (
              <a
                key={col._id}
                href={`/collections/${col.slug}`}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/collections/${col.slug}`);
                }}
                className="group block [perspective:1000px] cursor-pointer"
              >
                <div className="relative aspect-[3/4] w-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                  {/* Front: Champagne Crest Artwork Card */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl border border-champagne bg-chiffon p-4 shadow-sm [backface-visibility:hidden] overflow-hidden">
                    {col.cardImage ? (
                      <LazyImage
                        src={col.cardImage}
                        alt={col.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-[22px] font-display text-admiral text-center">{col.name}</span>
                    )}
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-admiral/80 via-admiral/30 to-transparent px-4 py-3 text-center">
                      <span className="text-[14px] tracking-[0.14em] uppercase font-serif text-chiffon">
                        {col.name}
                      </span>
                    </div>
                  </div>

                  {/* Back: Lifestyle Collection Photograph */}
                  <div className="absolute inset-0 rounded-xl border border-antiquity/50 bg-admiral overflow-hidden shadow-lg [transform:rotateY(180deg)] [backface-visibility:hidden]">
                    <LazyImage
                      src={col.heroImage || col.cardImage || '/productBlank.svg'}
                      alt={`${col.name} Table Setting`}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-admiral/85 via-admiral/25 to-transparent flex flex-col justify-end p-5 text-center">
                      <h3 className="text-[20px] font-display tracking-wider text-chiffon uppercase">
                        {col.name}
                      </h3>
                      <span className="mt-2 inline-block self-center rounded-full border border-champagne bg-chiffon/95 px-5 py-1.5 text-[12px] font-sans font-medium text-admiral">
                        Explore Collection
                      </span>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>

          <div className="mt-10 text-center">
            <a
              href="/collections"
              onClick={(e) => {
                e.preventDefault();
                navigate('/collections');
              }}
              className="inline-flex items-center justify-center rounded-[40px] border border-antiquity px-8 py-2.5 text-[14px] font-medium text-antiquity hover:bg-antiquity hover:text-chiffon transition-colors"
            >
              View All Collections
            </a>
          </div>
        </div>
      </section>

      {/* 3. HIGHLIGHT OF THE SEASON (INTERACTIVE SHOP THE LOOK) */}
      {shopTheLook && currentLook && (
        <section className="mx-auto max-w-[1920px] px-4 sm:px-8 lg:px-16 xl:px-24 py-12 sm:py-16">
          <div className="text-center mb-10">
            <h2 className="text-[30px] sm:text-[42px] font-display font-normal text-admiral">
              {shopTheLook.heading || 'Highlight of the Season'}
            </h2>
            <p className="mt-1 text-[14px] sm:text-[16px] text-antiquity font-serif">
              {shopTheLook.subheading || 'Tap a golden motif pin to curate this Cameroon table look'}
            </p>
            <img
              src="/uploads/img/1790701576169-2aa8a9c5.png"
              alt=""
              className="mx-auto mt-3 h-7 w-auto object-contain opacity-85"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-2xl border border-champagne bg-biege/40 p-4 sm:p-6 lg:p-8">
            {/* Left: Interactive Look Photograph + Hotspots */}
            <div className="lg:col-span-8 relative">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-champagne bg-champagne/20">
                <LazyImage
                  src={currentLook.image}
                  alt={`Table Styling Look ${lookIndex + 1}`}
                  fill
                  className="object-cover"
                />

                {hotspots.map((spot, idx) => {
                  const isActive = idx === hotspotIndex;
                  return (
                    <button
                      key={`${spot.productId}-${idx}`}
                      type="button"
                      aria-label={`Inspect ${spot.product.name}`}
                      onMouseEnter={() => setHotspotIndex(idx)}
                      onClick={() => {
                        setHotspotIndex(idx);
                        if (window.innerWidth < 1024) setMobileLookSheetOpen(true);
                      }}
                      style={{ left: `${spot.xPct}%`, top: `${spot.yPct}%` }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-300 cursor-pointer ${
                        isActive
                          ? 'scale-115 border-primrose bg-admiral text-chiffon shadow-[0_0_0_6px_rgba(229,169,70,0.32)]'
                          : 'border-chiffon bg-antiquity/90 text-chiffon hover:scale-110 shadow-md'
                      }`}
                    >
                      <span className="h-2.5 w-2.5 rounded-full bg-chiffon" />
                    </button>
                  );
                })}
              </div>

              {/* Look Switcher Prev/Next */}
              {looks.length > 1 && (
                <div className="mt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      setLookIndex((prev) => (prev - 1 + looks.length) % looks.length);
                      setHotspotIndex(0);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-full border border-champagne bg-chiffon px-4 py-1.5 text-[13px] text-admiral hover:bg-champagne/50 cursor-pointer"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span>Previous Look</span>
                  </button>
                  <span className="text-[13px] font-sans text-admiral/70 tabular-nums">
                    Look {lookIndex + 1} of {looks.length}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setLookIndex((prev) => (prev + 1) % looks.length);
                      setHotspotIndex(0);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-full border border-champagne bg-chiffon px-4 py-1.5 text-[13px] text-admiral hover:bg-champagne/50 cursor-pointer"
                  >
                    <span>Next Look</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Right: Active Hotspot Product Card */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              {activeHotspot && (
                <>
                  <div className="hidden lg:block">
                    <ProductCard
                      product={activeHotspot.product}
                      selectedVariant={
                        activeHotspot.product.variants?.find((v) => v.sku === activeHotspot.variantSku) ||
                        activeHotspot.product.variants?.[0]
                      }
                    />
                  </div>
                  <div className="lg:hidden flex justify-center">
                    <button
                      type="button"
                      onClick={() => setMobileLookSheetOpen(true)}
                      className="rounded-[40px] bg-admiral px-7 py-2.5 text-[14px] text-chiffon cursor-pointer"
                    >
                      View Product in Look ({activeHotspot.product.name.slice(0, 24)}...)
                    </button>
                  </div>
                </>
              )}

              {hotspots.length > 1 && (
                <div className="flex items-center justify-center gap-2 pt-1">
                  {hotspots.map((spot, idx) => (
                    <button
                      key={spot.productId + idx}
                      type="button"
                      aria-label={`Select hotspot ${idx + 1}`}
                      onClick={() => setHotspotIndex(idx)}
                      className={`h-2.5 rounded-full transition-all cursor-pointer ${
                        idx === hotspotIndex ? 'w-7 bg-antiquity' : 'w-2.5 bg-champagne hover:bg-antiquity/50'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Mobile Look Sheet Modal */}
      {mobileLookSheetOpen && activeHotspot && (
        <div
          className="fixed inset-0 z-[140] flex items-end justify-center bg-black/60 p-4 lg:hidden"
          onClick={() => setMobileLookSheetOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-t-2xl bg-chiffon p-4 border border-champagne shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-serif text-[16px] text-admiral">Featured Piece</span>
              <button
                type="button"
                onClick={() => setMobileLookSheetOpen(false)}
                className="p-1 text-admiral cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <ProductCard
              product={activeHotspot.product}
              selectedVariant={
                activeHotspot.product.variants?.find((v) => v.sku === activeHotspot.variantSku) ||
                activeHotspot.product.variants?.[0]
              }
            />
          </div>
        </div>
      )}

      {/* 4. BEST SELLERS HORIZONTAL SLIDER */}
      {bestSellers.length > 0 && (
        <section className="mx-auto max-w-[1920px] px-4 sm:px-8 lg:px-16 xl:px-24 py-12 sm:py-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div className="text-center sm:text-left">
              <h2 className="text-[30px] sm:text-[42px] font-display font-normal text-admiral">
                Best Sellers
              </h2>
              <img
                src="/uploads/img/1790701575963-99f676ac.png"
                alt=""
                className="mx-auto sm:mx-0 mt-2 h-6 w-auto object-contain opacity-85"
              />
            </div>

            <div className="flex items-center justify-center sm:justify-end gap-3">
              <div className="hidden md:flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Scroll best sellers left"
                  onClick={() => scrollBestSellers('left')}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-champagne bg-chiffon text-admiral hover:bg-champagne/60 cursor-pointer"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  aria-label="Scroll best sellers right"
                  onClick={() => scrollBestSellers('right')}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-champagne bg-chiffon text-admiral hover:bg-champagne/60 cursor-pointer"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
              <a
                href="/products"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/products');
                }}
                className="inline-flex items-center justify-center rounded-[40px] bg-admiral px-6 py-2.5 text-[14px] text-chiffon hover:opacity-90 transition-opacity"
              >
                View All Products
              </a>
            </div>
          </div>

          <div
            ref={bestScrollRef}
            className="flex gap-5 overflow-x-auto pb-4 no-scrollbar scroll-smooth snap-x"
          >
            {bestSellers.map((prod) => (
              <div
                key={prod._id}
                className="w-[265px] sm:w-[290px] lg:w-[310px] shrink-0 snap-start"
              >
                <ProductCard product={prod} className="h-full" />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
