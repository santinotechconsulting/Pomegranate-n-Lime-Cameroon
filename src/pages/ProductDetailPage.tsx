import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Heart, ShieldCheck, Star, Truck } from 'lucide-react';
import { isMatProduct, useDocumentSeo, useStore } from '../context/StoreContext';
import type { Product, ProductReview } from '../types/store';
import { LazyImage } from '../components/LazyImage';
import { ProductCard } from '../components/ProductCard';
import { QuantityStepper } from '../components/QuantityStepper';
import { Spinner } from '../components/Spinner';

interface ProductDetailPageProps {
  slug: string;
}

export function ProductDetailPage({ slug }: ProductDetailPageProps) {
  const {
    products,
    searchQuery,
    navigate,
    formatPrice,
    isWishlisted,
    toggleWishlist,
    addToCartDirect,
    openCartDrawer,
    user,
    showToast,
  } = useStore();

  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedSku, setSelectedSku] = useState<string>('');
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'care' | 'disclaimer' | 'shipping'>('description');

  // Review Form State
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewAuthor, setReviewAuthor] = useState(user?.name || '');
  const [reviewCity, setReviewCity] = useState(user?.city ? `${user.city}, Cameroon` : 'Douala, Cameroon');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetch(`/api/products/${encodeURIComponent(slug)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data: Product | null) => {
        if (!active) return;
        setDetailProduct(data);
        setReviews(data?.reviews || []);
        const paramSku = new URLSearchParams(searchQuery).get('variant');
        const firstSku =
          data?.variants?.find((v) => v.sku === paramSku)?.sku ||
          data?.variants?.[0]?.sku ||
          '';
        setSelectedSku(firstSku);
        setActiveImageIdx(0);
        setQty(data ? (isMatProduct(data) ? 1 : Math.max(1, data.minimumQuantity || 1)) : 1);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [slug, searchQuery]);

  const product = useMemo(
    () => detailProduct || products.find((p) => p.slug === slug) || null,
    [detailProduct, products, slug]
  );

  const selectedVariant = useMemo(() => {
    if (!product?.variants?.length) return undefined;
    return product.variants.find((v) => v.sku === selectedSku) || product.variants[0];
  }, [product, selectedSku]);

  const galleryImages = useMemo(() => {
    const imgs = [
      ...(selectedVariant?.images || []),
      ...(product?.images || []),
    ];
    return Array.from(new Set(imgs.length > 0 ? imgs : ['/productBlank.svg']));
  }, [selectedVariant, product]);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    const col = product.collectionSlugs?.[0];
    return products
      .filter((p) => p._id !== product._id && (!col || (p.collectionSlugs || []).includes(col)))
      .slice(0, 4);
  }, [product, products]);

  useDocumentSeo({
    title: product
      ? `${product.name} | Pomegranate 'n' Lime Cameroon`
      : "Product Details | Pomegranate 'n' Lime Cameroon",
    description: product
      ? `Shop ${product.name} — bespoke hand-embroidered tableware delivered across Douala, Yaoundé, and worldwide.`
      : undefined,
    canonicalPath: `/products/${slug}`,
    jsonLd: product
      ? {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: product.name,
          sku: selectedVariant?.sku || product.slug,
          image: galleryImages[0],
          brand: { '@type': 'Brand', name: "Pomegranate 'n' Lime Cameroon" },
          offers: {
            '@type': 'Offer',
            priceCurrency: 'USD',
            price: ((selectedVariant?.priceMinorUnit || 4500) / 100).toFixed(2),
            availability: 'https://schema.org/InStock',
          },
        }
      : undefined,
  });

  if (loading && !product) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="md" label="Loading craftsmanship details..." />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-[640px] px-4 py-20 text-center">
        <h1 className="text-[28px] font-serif text-admiral">Product Not Found</h1>
        <p className="mt-2 text-[15px] text-admiral/75">
          This piece may have been moved or renamed.
        </p>
        <button
          type="button"
          onClick={() => navigate('/products')}
          className="mt-6 rounded-full bg-admiral px-7 py-2.5 text-[14px] text-chiffon cursor-pointer"
        >
          Browse All Products
        </button>
      </div>
    );
  }

  const minQty = isMatProduct(product) ? 1 : Math.max(1, product.minimumQuantity || 1);
  const wished = isWishlisted(product._id, selectedVariant?.sku);
  const priceMinor = selectedVariant?.priceMinorUnit || 4500;

  const handleAdd = async (goCheckout = false) => {
    if (!selectedVariant) return;
    setAdding(true);
    try {
      const ok = await addToCartDirect(product._id, selectedVariant.sku, qty);
      if (ok) {
        if (goCheckout) navigate('/cart');
        else openCartDrawer();
      }
    } finally {
      setAdding(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    setSubmittingReview(true);
    try {
      const res = await fetch(`/api/products/${encodeURIComponent(product.slug)}/reviews`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          rating: reviewRating,
          title: reviewTitle.trim() || 'Cameroon Client Review',
          comment: reviewComment.trim(),
          author: reviewAuthor.trim() || user?.name || 'Verified Host',
          city: reviewCity.trim() || 'Douala, Cameroon',
        }),
      });
      if (res.ok) {
        const created: ProductReview = await res.json();
        setReviews((prev) => [created, ...prev]);
        setReviewTitle('');
        setReviewComment('');
        showToast('Thank you! Your review has been published.');
      }
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="mx-auto max-w-[1920px] px-4 sm:px-8 lg:px-16 xl:px-24 py-8 sm:py-12">
      <button
        type="button"
        onClick={() => navigate(product.collectionSlugs?.[0] ? `/collections/${product.collectionSlugs[0]}` : '/products')}
        className="mb-6 inline-flex items-center gap-2 text-[14px] text-antiquity hover:underline cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>
          {product.collectionSlugs?.[0]
            ? `Back to ${product.collectionSlugs[0].replace(/-/g, ' ').toUpperCase()}`
            : 'Back to Catalog'}
        </span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left: Sticky Multi-Image Gallery */}
        <div className="lg:col-span-6 lg:sticky lg:top-28 flex flex-col gap-4">
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-champagne bg-champagne/20">
            <LazyImage
              src={galleryImages[activeImageIdx] || galleryImages[0]}
              alt={product.name}
              fill
              priority
              className="object-cover"
            />
          </div>

          {galleryImages.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar">
              {galleryImages.map((img, i) => (
                <button
                  key={`${img}-${i}`}
                  type="button"
                  onClick={() => setActiveImageIdx(i)}
                  className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all cursor-pointer ${
                    i === activeImageIdx ? 'border-antiquity scale-[1.03]' : 'border-champagne opacity-75 hover:opacity-100'
                  }`}
                >
                  <LazyImage src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Info & Actions */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-[12px] font-sans uppercase tracking-[0.16em] text-antiquity mb-2">
              <span>{product.productCategory || 'Bespoke Table Linen'}</span>
              {selectedVariant?.materialType && (
                <>
                  <span>·</span>
                  <span>{selectedVariant.materialType}</span>
                </>
              )}
            </div>

            <h1 className="text-[28px] sm:text-[36px] font-display text-admiral leading-tight">
              {product.name}
            </h1>

            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-[12px] uppercase tracking-wider text-admiral/60 font-sans">MRP</span>
              <span className="text-[28px] font-serif font-semibold text-admiral tabular-nums">
                {formatPrice(priceMinor)}
              </span>
            </div>
          </div>

          {/* Variant Selector */}
          {product.variants && product.variants.length > 1 && (
            <div className="flex flex-col gap-2.5">
              <span className="text-[14px] font-medium text-admiral">
                Select Motif / Variant: <strong className="text-antiquity">{selectedVariant?.label}</strong>
              </span>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <button
                    key={v.sku}
                    type="button"
                    onClick={() => {
                      setSelectedSku(v.sku);
                      setActiveImageIdx(0);
                    }}
                    className={`rounded-full px-4 py-2 text-[13px] border transition-colors cursor-pointer ${
                      v.sku === selectedVariant?.sku
                        ? 'border-admiral bg-admiral text-primrose font-medium'
                        : 'border-champagne bg-chiffon text-admiral hover:bg-champagne/50'
                    }`}
                  >
                    {v.label || v.sku}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Mat Minimum 4 Rule Banner */}
          {isMatProduct(product) && (
            <div className="rounded-xl border border-primrose/60 bg-biege px-4 py-3 text-[13px] text-admiral">
              Note: Individual Table Mats require a combined minimum of <strong>4 mats</strong> in your bag before checkout — mix &amp; match across any motif!
            </div>
          )}

          {/* Quantity + Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <QuantityStepper qty={qty} min={minQty} onChange={setQty} />

            <button
              type="button"
              disabled={adding}
              onClick={() => handleAdd(false)}
              className="flex-1 min-w-[170px] rounded-[40px] bg-admiral py-3.5 px-6 text-[15px] font-medium text-chiffon hover:opacity-90 disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
            >
              {adding && <Spinner size="xs" color="light" />}
              <span>{adding ? 'Adding...' : 'Add to Cart'}</span>
            </button>

            <button
              type="button"
              disabled={adding}
              onClick={() => handleAdd(true)}
              className="rounded-[40px] border border-antiquity px-6 py-3.5 text-[15px] font-medium text-antiquity hover:bg-antiquity hover:text-chiffon transition-colors cursor-pointer"
            >
              Buy Now
            </button>

            <button
              type="button"
              aria-label={wished ? 'Remove from Wishlist' : 'Save to Wishlist'}
              onClick={() => toggleWishlist(product, selectedVariant?.sku)}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-champagne bg-chiffon text-antiquity hover:bg-champagne/40 cursor-pointer"
            >
              <Heart className="h-5 w-5" fill={wished ? '#ac6628' : 'none'} />
            </button>
          </div>

          {/* Cameroon Delivery Assurance */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-xl border border-champagne bg-biege/40 p-4 text-[13px]">
            <div className="flex items-start gap-3">
              <Truck className="h-5 w-5 text-antiquity shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-admiral">Douala &amp; Yaoundé Express</div>
                <div className="text-admiral/70">2–3 business days · Free over 150,000 FCFA</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-antiquity shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-admiral">Cameroon Mobile Money &amp; Card</div>
                <div className="text-admiral/70">MTN MoMo, Orange Money &amp; COD accepted</div>
              </div>
            </div>
          </div>

          {/* Details Tabs */}
          <div className="border-t border-champagne pt-4">
            <div className="flex flex-wrap gap-2 border-b border-champagne pb-3 mb-4">
              {[
                { key: 'description', label: 'Description' },
                { key: 'care', label: 'Care Instructions' },
                { key: 'disclaimer', label: 'Craft Note' },
                { key: 'shipping', label: 'Cameroon Delivery' },
              ].map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setActiveTab(t.key as typeof activeTab)}
                  className={`rounded-full px-4 py-1.5 text-[13px] font-sans cursor-pointer transition-colors ${
                    activeTab === t.key
                      ? 'bg-champagne font-semibold text-admiral'
                      : 'text-admiral/70 hover:bg-champagne/40'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="text-[14.5px] leading-relaxed text-admiral/85 space-y-2.5 font-serif">
              {activeTab === 'description' && (
                <>
                  {product.description ? (
                    <div dangerouslySetInnerHTML={{ __html: product.description }} />
                  ) : (
                    <p>Hand-embroidered artisanal linen Crafted by Pomegranate ‘n’ Lime.</p>
                  )}
                  {selectedVariant?.productLength && selectedVariant?.productBreadth && (
                    <p className="text-[13px] text-antiquity pt-1">
                      Dimensions: {selectedVariant.productLength} × {selectedVariant.productBreadth}{' '}
                      {selectedVariant.productDimensionUnit || 'cm'}
                    </p>
                  )}
                </>
              )}
              {activeTab === 'care' &&
                (product.careInstructions ? (
                  <div dangerouslySetInnerHTML={{ __html: product.careInstructions }} />
                ) : (
                  <p>Dry Clean Only. Store table mats flat and keep runners rolled to preserve embroidery.</p>
                ))}
              {activeTab === 'disclaimer' &&
                (product.disclaimer ? (
                  <div dangerouslySetInnerHTML={{ __html: product.disclaimer }} />
                ) : (
                  <p>Subtle variations are hallmarks of authentic hand-dyeing and hand-embroidery.</p>
                ))}
              {activeTab === 'shipping' && (
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>Douala (Bonapriso, Akwa, Bonanjo) &amp; Yaoundé (Bastos, Golf): 2–3 business days.</li>
                  <li>Bafoussam, Buea, Limbe, Kribi &amp; Bamenda: 3–5 business days.</li>
                  <li>Garoua, Maroua, Ngaoundéré &amp; Bertoua: 5–7 business days.</li>
                  <li>International DHL Express to France, UK, US &amp; diaspora: 7–14 business days.</li>
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <section id="reviews" className="mt-16 border-t border-champagne pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5">
            <h2 className="text-[26px] font-display text-admiral mb-2">Write a Review</h2>
            <p className="text-[14px] text-admiral/75 mb-5">
              Share how this piece elevates your dining table in Cameroon or abroad.
            </p>
            <form
              onSubmit={handleReviewSubmit}
              className="flex flex-col gap-4 rounded-2xl border border-champagne bg-biege/40 p-5"
            >
              <div className="flex items-center gap-2">
                <span className="text-[13px] text-admiral mr-2">Rating:</span>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className="cursor-pointer"
                    aria-label={`${star} stars`}
                  >
                    <Star
                      className="h-5 w-5 text-antiquity"
                      fill={star <= reviewRating ? '#ac6628' : 'none'}
                    />
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  value={reviewAuthor}
                  onChange={(e) => setReviewAuthor(e.target.value)}
                  placeholder="Your Name"
                  className="h-10 rounded-lg border border-champagne bg-white px-3 text-[14px] text-admiral outline-none focus:border-antiquity"
                />
                <input
                  value={reviewCity}
                  onChange={(e) => setReviewCity(e.target.value)}
                  placeholder="City (e.g. Douala, Cameroon)"
                  className="h-10 rounded-lg border border-champagne bg-white px-3 text-[14px] text-admiral outline-none focus:border-antiquity"
                />
              </div>
              <input
                value={reviewTitle}
                onChange={(e) => setReviewTitle(e.target.value)}
                placeholder="Review headline"
                className="h-10 rounded-lg border border-champagne bg-white px-3 text-[14px] text-admiral outline-none focus:border-antiquity"
              />
              <textarea
                rows={3}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Describe the embroidery, linen feel, and table styling..."
                required
                className="rounded-lg border border-champagne bg-white p-3 text-[14px] text-admiral outline-none focus:border-antiquity resize-none"
              />
              <button
                type="submit"
                disabled={submittingReview || !reviewComment.trim()}
                className="self-start rounded-full bg-admiral px-6 py-2.5 text-[14px] text-chiffon hover:opacity-90 disabled:opacity-50 cursor-pointer"
              >
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>

          <div className="lg:col-span-7">
            <h2 className="text-[26px] font-display text-admiral mb-4">
              Client Reviews ({reviews.length})
            </h2>
            {reviews.length === 0 ? (
              <div className="rounded-xl border border-champagne bg-chiffon p-8 text-center text-[14px] text-admiral/70">
                No reviews yet for this piece. Be the first host to share your impressions!
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="rounded-xl border border-champagne bg-chiffon p-5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-antiquity" fill="#ac6628" />
                        ))}
                      </div>
                      <span className="text-[12px] text-admiral/60">
                        {new Date(rev.createdAt).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    <h3 className="mt-2 font-serif font-bold text-[16px] text-admiral">{rev.title}</h3>
                    <p className="mt-1 text-[14px] text-admiral/85 leading-relaxed">{rev.comment}</p>
                    <div className="mt-3 text-[12px] font-sans text-antiquity">
                      — {rev.author} · {rev.city}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-16 border-t border-champagne pt-12">
          <h2 className="text-[28px] font-display text-admiral mb-6">
            Pair With Your Table Setting
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
