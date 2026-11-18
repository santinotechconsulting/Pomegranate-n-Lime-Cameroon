import React, { useEffect, useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import { useDocumentSeo, useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { Spinner } from '../components/Spinner';

export function ProductsPage() {
  const { products, collections, searchQuery, catalogLoaded, navigate } = useStore();

  const initialQ = useMemo(() => {
    const params = new URLSearchParams(searchQuery);
    return params.get('q') || '';
  }, [searchQuery]);

  const initialCol = useMemo(() => {
    const params = new URLSearchParams(searchQuery);
    return params.get('collection') || 'all';
  }, [searchQuery]);

  const [query, setQuery] = useState(initialQ);
  const [selectedCollection, setSelectedCollection] = useState(initialCol);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'name'>('featured');

  useEffect(() => {
    setQuery(initialQ);
  }, [initialQ]);

  useEffect(() => {
    setSelectedCollection(initialCol);
  }, [initialCol]);

  useDocumentSeo({
    title: query
      ? `Search "${query}" | Pomegranate 'n' Lime Cameroon`
      : "All Products | Pomegranate 'n' Lime Cameroon",
    description:
      "Shop all handcrafted table mats, runners, dinner napkins, and full dining sets in FCFA, USD, or EUR — delivered across Cameroon.",
    canonicalPath: '/products',
  });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = products.filter((p) => {
      if (selectedCollection !== 'all' && !(p.collectionSlugs || []).includes(selectedCollection)) {
        return false;
      }
      if (
        selectedCategory !== 'All' &&
        (p.productCategory || '').toLowerCase() !== selectedCategory.toLowerCase()
      ) {
        return false;
      }
      if (q) {
        const hay = `${p.name} ${(p.tags || []).join(' ')} ${(p.collectionSlugs || []).join(' ')} ${
          p.productCategory || ''
        }`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    if (sortBy === 'price-asc') {
      list = [...list].sort(
        (a, b) => (a.variants?.[0]?.priceMinorUnit || 0) - (b.variants?.[0]?.priceMinorUnit || 0)
      );
    } else if (sortBy === 'price-desc') {
      list = [...list].sort(
        (a, b) => (b.variants?.[0]?.priceMinorUnit || 0) - (a.variants?.[0]?.priceMinorUnit || 0)
      );
    } else if (sortBy === 'name') {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    }
    return list;
  }, [products, query, selectedCollection, selectedCategory, sortBy]);

  if (!catalogLoaded) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="md" label="Loading catalog..." />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1920px] px-4 sm:px-8 lg:px-16 xl:px-24 py-10 sm:py-14">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[32px] sm:text-[42px] font-display text-admiral">
            All Bespoke Table Linens
          </h1>
          <p className="mt-1 text-[14px] sm:text-[16px] text-antiquity">
            Hand-embroidered mats, runners, napkins &amp; complete sets available across Cameroon
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-[360px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-admiral/50" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search mats, runners, napkins..."
            className="h-11 w-full rounded-full border border-champagne bg-white/90 pl-10 pr-9 text-[14px] text-admiral outline-none focus:border-antiquity"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                navigate('/products');
              }}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-admiral/50 hover:text-admiral cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-xl border border-champagne bg-biege/40 p-4 mb-8">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedCollection('all')}
            className={`rounded-full px-3.5 py-1.5 text-[12px] font-sans cursor-pointer transition-colors ${
              selectedCollection === 'all'
                ? 'bg-admiral text-primrose font-medium'
                : 'bg-chiffon border border-champagne text-admiral hover:bg-champagne/50'
            }`}
          >
            All Collections
          </button>
          {collections.map((c) => (
            <button
              key={c._id}
              type="button"
              onClick={() => setSelectedCollection(c.slug)}
              className={`rounded-full px-3.5 py-1.5 text-[12px] font-sans cursor-pointer transition-colors ${
                selectedCollection === c.slug
                  ? 'bg-admiral text-primrose font-medium'
                  : 'bg-chiffon border border-champagne text-admiral hover:bg-champagne/50'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            {['All', 'Set', 'Runner', 'Mat', 'Napkin'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-3 py-1 text-[12px] font-sans cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-antiquity text-chiffon font-medium'
                    : 'border border-champagne bg-chiffon text-admiral hover:bg-champagne/40'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="rounded-full border border-champagne bg-chiffon px-4 py-1.5 text-[13px] text-admiral outline-none cursor-pointer"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name">Alphabetical (A–Z)</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-5 text-[13px] text-admiral/70 tabular-nums">
        Showing {filtered.length} {filtered.length === 1 ? 'product' : 'products'}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-champagne bg-chiffon py-16 px-4 text-center">
          <img src="/productBlank.svg" alt="No products found" className="h-44 w-44 mb-5 opacity-80" />
          <h2 className="text-[22px] font-serif text-admiral">No matching pieces found</h2>
          <p className="mt-1 text-[14px] text-admiral/70">
            Try clearing your filters or searching another motif like “Christmas”, “Lotus”, or “Equestrian”.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setSelectedCollection('all');
              setSelectedCategory('All');
            }}
            className="mt-5 rounded-full bg-admiral px-6 py-2.5 text-[14px] text-chiffon cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
