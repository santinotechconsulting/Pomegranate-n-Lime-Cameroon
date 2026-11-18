import React, { useMemo, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useDocumentSeo, useStore } from '../context/StoreContext';
import { LazyImage } from '../components/LazyImage';
import { ProductCard } from '../components/ProductCard';
import { Spinner } from '../components/Spinner';

interface CollectionsPageProps {
  slug?: string;
}

export function CollectionsPage({ slug }: CollectionsPageProps) {
  const { collections, products, catalogLoaded, navigate } = useStore();
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const activeCollection = useMemo(
    () => (slug ? collections.find((c) => c.slug === slug) : undefined),
    [collections, slug]
  );

  useDocumentSeo({
    title: activeCollection
      ? `${activeCollection.name} Collection | Pomegranate 'n' Lime Cameroon`
      : "All Collections | Pomegranate 'n' Lime Cameroon",
    description: activeCollection
      ? `Explore the ${activeCollection.name} artisanal embroidered linen table mats, runners, and napkins — delivered across Cameroon and worldwide.`
      : "Browse Pomegranate 'n' Lime Cameroon signature collections: The Christmas Yard, Equestrian, Life At Court, Sails Up, and Kesariya.",
    canonicalPath: slug ? `/collections/${slug}` : '/collections',
  });

  const collectionProducts = useMemo(() => {
    if (!activeCollection) return [];
    let list = products.filter((p) => (p.collectionSlugs || []).includes(activeCollection.slug));
    if (categoryFilter !== 'All') {
      list = list.filter((p) => (p.productCategory || '').toLowerCase() === categoryFilter.toLowerCase());
    }
    if (sortBy === 'price-asc') {
      list = [...list].sort(
        (a, b) => (a.variants?.[0]?.priceMinorUnit || 0) - (b.variants?.[0]?.priceMinorUnit || 0)
      );
    } else if (sortBy === 'price-desc') {
      list = [...list].sort(
        (a, b) => (b.variants?.[0]?.priceMinorUnit || 0) - (a.variants?.[0]?.priceMinorUnit || 0)
      );
    }
    return list;
  }, [activeCollection, products, categoryFilter, sortBy]);

  if (!catalogLoaded) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="md" label="Loading collections..." />
      </div>
    );
  }

  // Individual Collection View (/collections/:slug)
  if (slug && activeCollection) {
    return (
      <div className="mx-auto max-w-[1920px] px-4 sm:px-8 lg:px-16 xl:px-24 py-8 sm:py-12">
        <button
          type="button"
          onClick={() => navigate('/collections')}
          className="mb-6 inline-flex items-center gap-2 text-[14px] text-antiquity hover:underline cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to All Collections</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-2xl border border-champagne bg-biege/40 p-5 sm:p-8 mb-10">
          <div className="lg:col-span-6 relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-champagne bg-champagne/25">
            <LazyImage
              src={activeCollection.heroImage || activeCollection.cardImage || '/productBlank.svg'}
              alt={activeCollection.name}
              fill
              priority
              className="object-cover"
            />
          </div>

          <div className="lg:col-span-6 flex flex-col gap-4">
            <span className="text-[12px] font-sans uppercase tracking-[0.2em] text-antiquity">
              Pomegranate ‘n’ Lime Cameroon Atelier
            </span>
            <h1 className="text-[32px] sm:text-[44px] font-display text-admiral leading-tight">
              {activeCollection.name}
            </h1>
            {activeCollection.description && (
              <div
                className="text-[15px] leading-relaxed text-admiral/85 space-y-3 font-serif"
                dangerouslySetInnerHTML={{ __html: activeCollection.description }}
              />
            )}
          </div>
        </div>

        {/* Filters & Sorting */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-champagne pb-4 mb-8">
          <div className="flex flex-wrap items-center gap-2">
            {['All', 'Set', 'Runner', 'Mat', 'Napkin'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`rounded-full px-4 py-1.5 text-[13px] font-sans transition-colors cursor-pointer ${
                  categoryFilter === cat
                    ? 'bg-admiral text-primrose font-medium'
                    : 'border border-champagne bg-chiffon text-admiral hover:bg-champagne/50'
                }`}
              >
                {cat === 'All' ? 'All Pieces' : `${cat}s`}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[13px] text-admiral/70 tabular-nums">
              {collectionProducts.length} {collectionProducts.length === 1 ? 'piece' : 'pieces'}
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="rounded-full border border-champagne bg-chiffon px-4 py-1.5 text-[13px] text-admiral outline-none focus:border-antiquity cursor-pointer"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {collectionProducts.length === 0 ? (
          <div className="rounded-xl border border-champagne bg-chiffon p-10 text-center">
            <p className="text-[16px] text-admiral/75">
              No pieces matched the selected filter in {activeCollection.name}.
            </p>
            <button
              type="button"
              onClick={() => setCategoryFilter('All')}
              className="mt-4 rounded-full bg-antiquity px-6 py-2 text-[14px] text-chiffon cursor-pointer"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {collectionProducts.map((prod) => (
              <ProductCard key={prod._id} product={prod} />
            ))}
          </div>
        )}
      </div>
    );
  }

  // All Collections Directory (/collections)
  return (
    <div className="mx-auto max-w-[1920px] px-4 sm:px-8 lg:px-16 xl:px-24 py-10 sm:py-16">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-[34px] sm:text-[46px] font-display text-admiral">
          Signature Collections
        </h1>
        <p className="mt-2 text-[15px] sm:text-[17px] text-antiquity italic">
          Hand-dyed &amp; hand-embroidered in pure 85% linen and fine silk — curated for Cameroon homes &amp; collectors worldwide.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {collections.map((col) => {
          const count = products.filter((p) => (p.collectionSlugs || []).includes(col.slug)).length;
          return (
            <a
              key={col._id}
              href={`/collections/${col.slug}`}
              onClick={(e) => {
                e.preventDefault();
                navigate(`/collections/${col.slug}`);
              }}
              className="group flex flex-col rounded-2xl border border-champagne bg-chiffon overflow-hidden shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-champagne/25">
                <LazyImage
                  src={col.heroImage || col.cardImage || '/productBlank.svg'}
                  alt={col.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute right-3 top-3 rounded-full bg-chiffon/95 border border-champagne px-3 py-1 text-[11px] font-sans font-medium text-admiral tabular-nums">
                  {count} pieces
                </span>
              </div>
              <div className="flex flex-1 flex-col justify-between p-6">
                <div>
                  <h2 className="text-[24px] font-display text-admiral group-hover:text-antiquity transition-colors">
                    {col.name}
                  </h2>
                  <p className="mt-2 text-[14px] text-admiral/75 line-clamp-3 font-serif">
                    {(col.description || '').replace(/<[^>]+>/g, ' ').trim()}
                  </p>
                </div>
                <span className="mt-5 inline-flex w-fit items-center rounded-full border border-antiquity px-5 py-2 text-[13px] font-medium text-antiquity group-hover:bg-antiquity group-hover:text-chiffon transition-colors">
                  Explore Collection
                </span>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
