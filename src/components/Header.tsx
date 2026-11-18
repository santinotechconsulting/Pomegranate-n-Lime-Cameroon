import React, { useEffect, useRef, useState } from 'react';
import {
  ChevronDown,
  Heart,
  LogOut,
  MapPin,
  Package,
  Search,
  ShoppingBag,
  User,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { LazyImage } from './LazyImage';

const STORY_LINKS = [
  { name: 'Our Story', href: '/our-story' },
  { name: 'Product Story', href: '/our-story/product-story' },
  { name: 'Brand Story', href: '/our-story/brand-story' },
  { name: 'Work Story', href: '/our-story/work-story' },
  { name: 'Blogs', href: '/our-story/blogs' },
];

export function Header() {
  const {
    currentPath,
    navigate,
    user,
    refreshUser,
    collections,
    products,
    cart,
    openCartDrawer,
    isCartDrawerOpen,
    formatPrice,
    showToast,
  } = useStore();

  // Ambient music player
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [musicOn, setMusicOn] = useState(false);

  // Hover dropdowns for Collections / Our World
  const [openNavMenu, setOpenNavMenu] = useState<'collections' | 'our-world' | null>(null);
  const closeNavTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // User account menu dropdown
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const [logoutModal, setLogoutModal] = useState(false);

  // Search modal
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const audio = new Audio('/uploads/audio/1791727848097-f5b8a00f.mp3');
    audio.loop = true;
    audio.volume = 0.45;
    audioRef.current = audio;
    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  const toggleMusic = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (musicOn) {
      audio.pause();
      setMusicOn(false);
    } else {
      try {
        await audio.play();
        setMusicOn(true);
      } catch {
        setMusicOn(false);
      }
    }
  };

  useEffect(() => {
    if (!userMenuOpen) return;
    const onDown = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [userMenuOpen]);

  useEffect(() => {
    if (!searchOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSearchOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [searchOpen]);

  const handleScheduleNavClose = () => {
    if (closeNavTimer.current) clearTimeout(closeNavTimer.current);
    closeNavTimer.current = setTimeout(() => setOpenNavMenu(null), 180);
  };

  const handleCancelNavClose = () => {
    if (closeNavTimer.current) clearTimeout(closeNavTimer.current);
  };

  const handleLogout = async () => {
    await fetch('/api/auth/sign-out', { method: 'POST', credentials: 'same-origin' });
    setLogoutModal(false);
    setUserMenuOpen(false);
    await refreshUser();
    showToast('Logged out successfully');
    navigate('/');
  };

  const navClass = (active: boolean) =>
    `relative whitespace-nowrap px-2 lg:px-3 py-1 text-[13px] md:text-[14px] xl:text-[16px] uppercase leading-none text-chiffon transition-all duration-300 after:absolute after:left-2 after:right-2 after:-bottom-2 after:h-[1px] after:bg-antiquity after:origin-center after:transition-transform after:duration-300 ${
      active ? 'after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-100'
    }`;

  const q = searchTerm.trim().toLowerCase();
  const matchedProducts = q
    ? products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            (p.collectionSlugs || []).some((c) => c.toLowerCase().includes(q)) ||
            (p.tags || []).some((t) => t.toLowerCase().includes(q))
        )
        .slice(0, 8)
    : products.slice(0, 4);

  const isCartHighlighted = isCartDrawerOpen || currentPath === '/cart' || currentPath.startsWith('/checkout');
  const isWishlistHighlighted = currentPath === '/account/wishlist';

  return (
    <>
      <header className="sticky top-0 z-40 sm:h-24 h-18 bg-admiral shadow-[0_4px_20px_rgba(0,0,0,0.25)]">
        <div className="relative mx-auto flex h-full max-w-[1920px] items-center px-3 min-[340px]:px-5 lg:px-5 xl:px-8">
          {/* Left Zone: Music Toggle */}
          <div className="flex items-center gap-3 z-10">
            <button
              type="button"
              onClick={toggleMusic}
              aria-label={musicOn ? 'Turn off ambient music' : 'Turn on ambient music'}
              className="flex items-center gap-2 rounded-full border border-champagne/25 bg-[#10132b]/70 px-3 py-1.5 text-chiffon hover:border-primrose/60 transition-colors cursor-pointer"
            >
              {musicOn ? (
                <Volume2 className="h-4 w-4 text-primrose animate-pulse" />
              ) : (
                <VolumeX className="h-4 w-4 text-chiffon/80" />
              )}
              <span className="hidden sm:inline text-[11px] xl:text-[12px] font-sans whitespace-nowrap text-chiffon/90">
                {musicOn ? 'Music Playing' : 'Click to turn on music'}
              </span>
            </button>
          </div>

          {/* Center Zone: Split Navigation + Crest */}
          <div className="absolute left-1/2 flex -translate-x-1/2 items-center gap-6 xl:gap-16">
            <nav className="hidden items-center gap-5 xl:gap-10 lg:flex">
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/');
                }}
                className={navClass(currentPath === '/')}
              >
                Home
              </a>

              <div
                className="relative"
                onMouseEnter={() => {
                  handleCancelNavClose();
                  setOpenNavMenu('collections');
                }}
                onMouseLeave={handleScheduleNavClose}
              >
                <a
                  href="/collections"
                  onClick={(e) => {
                    e.preventDefault();
                    setOpenNavMenu(null);
                    navigate('/collections');
                  }}
                  className={`${navClass(currentPath.startsWith('/collections'))} flex items-center gap-2`}
                >
                  <span>Collections</span>
                  <ChevronDown className="h-4 w-4" />
                </a>

                {openNavMenu === 'collections' && collections.length > 0 && (
                  <div
                    onMouseEnter={handleCancelNavClose}
                    onMouseLeave={handleScheduleNavClose}
                    className="absolute left-1/2 top-full mt-4 -translate-x-1/2 z-50 flex min-w-[200px] flex-col gap-1 rounded-[4px] border border-antiquity bg-chiffon py-2 shadow-[0_8px_24px_rgba(0,0,0,0.18)]"
                  >
                    {collections.map((c, idx) => (
                      <div key={c._id} className="flex flex-col gap-1">
                        {idx > 0 && <span className="h-px w-full bg-champagne" />}
                        <a
                          href={`/collections/${c.slug}`}
                          onClick={(e) => {
                            e.preventDefault();
                            setOpenNavMenu(null);
                            navigate(`/collections/${c.slug}`);
                          }}
                          className="block whitespace-nowrap px-4 py-2.5 text-[13px] capitalize leading-none text-antiquity transition-colors hover:bg-champagne/50"
                        >
                          {c.name.toLowerCase()}
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </nav>

            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigate('/');
              }}
              aria-label="Pomegranate 'n' Lime Cameroon Home"
              className="block h-12 w-[44px] lg:h-14 lg:w-[50px] xl:h-16 xl:w-[58px] shrink-0"
            >
              <img
                src="/logo.png"
                alt="Pomegranate 'n' Lime"
                className="h-full w-full object-contain"
              />
            </a>

            <nav className="hidden items-center gap-5 xl:gap-10 lg:flex">
              <a
                href="/products"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/products');
                }}
                className={navClass(currentPath.startsWith('/products'))}
              >
                Products
              </a>

              <div
                className="relative"
                onMouseEnter={() => {
                  handleCancelNavClose();
                  setOpenNavMenu('our-world');
                }}
                onMouseLeave={handleScheduleNavClose}
              >
                <button
                  type="button"
                  onClick={() => {
                    setOpenNavMenu(null);
                    navigate('/our-story');
                  }}
                  className={`${navClass(currentPath.startsWith('/our-story'))} flex items-center gap-2 cursor-pointer bg-transparent border-0 outline-none`}
                >
                  <span>Our World</span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {openNavMenu === 'our-world' && (
                  <div
                    onMouseEnter={handleCancelNavClose}
                    onMouseLeave={handleScheduleNavClose}
                    className="absolute left-1/2 top-full mt-4 -translate-x-1/2 z-50 flex min-w-[165px] flex-col gap-1 rounded-[4px] border border-antiquity bg-chiffon py-2 shadow-[0_8px_24px_rgba(0,0,0,0.18)]"
                  >
                    {STORY_LINKS.map((s, idx) => (
                      <div key={s.href} className="flex flex-col gap-1">
                        {idx > 0 && <span className="h-px w-full bg-champagne" />}
                        <a
                          href={s.href}
                          onClick={(e) => {
                            e.preventDefault();
                            setOpenNavMenu(null);
                            navigate(s.href);
                          }}
                          className="block whitespace-nowrap px-4 py-2.5 text-[13px] leading-none text-antiquity transition-colors hover:bg-champagne/50"
                        >
                          {s.name}
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </nav>
          </div>

          {/* Right Zone: Search, Wishlist, Account Dashboard, Cart */}
          <div className="ml-auto flex items-center sm:gap-4 gap-2 xl:gap-7 text-chiffon z-10">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search products"
              className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            >
              <Search className="h-5 w-5" />
            </button>

            <div className="group relative hidden lg:flex items-center justify-center">
              <a
                href="/account/wishlist"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/account/wishlist');
                }}
                aria-label="Wishlist"
                className="flex items-center justify-center transition-opacity hover:opacity-80"
              >
                <Heart
                  className="h-6 w-6"
                  fill={isWishlistHighlighted ? '#f3f0dd' : 'none'}
                />
              </a>
              <div className="pointer-events-none absolute left-1/2 top-full mt-2.5 -translate-x-1/2 whitespace-nowrap rounded-md bg-chiffon px-2.5 py-1 text-[12px] font-medium text-admiral opacity-0 shadow-[0_4px_12px_rgba(0,0,0,0.2)] transition-all duration-200 group-hover:opacity-100 z-50">
                Wishlist
              </div>
            </div>

            {/* Account User Dropdown */}
            <div ref={userMenuRef} className="relative hidden lg:block">
              <button
                type="button"
                onClick={() => setUserMenuOpen((prev) => !prev)}
                aria-label="User account menu"
                className="flex items-center gap-2 rounded-full border border-champagne/30 px-2.5 py-1.5 hover:bg-white/10 transition-colors cursor-pointer"
              >
                <User
                  className="h-5 w-5"
                  fill={currentPath.startsWith('/account') ? '#e5a946' : 'none'}
                />
                {user && (
                  <span className="hidden xl:inline max-w-[110px] truncate text-[13px] font-sans text-chiffon">
                    {user.name.split(' ')[0]}
                  </span>
                )}
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-3 z-50 w-56 rounded-xl border border-champagne bg-chiffon p-2 text-admiral shadow-[0_12px_30px_rgba(0,0,0,0.22)]">
                  {user ? (
                    <>
                      <div className="px-3 py-2 border-b border-champagne/60 mb-1">
                        <div className="text-[14px] font-bold text-admiral truncate">{user.name}</div>
                        <div className="text-[11px] text-admiral/65 truncate">{user.email}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setUserMenuOpen(false);
                          navigate('/account');
                        }}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] text-antiquity hover:bg-champagne/50 cursor-pointer"
                      >
                        <User className="h-4 w-4" />
                        <span>Profile</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setUserMenuOpen(false);
                          navigate('/account/orders');
                        }}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] text-antiquity hover:bg-champagne/50 cursor-pointer"
                      >
                        <Package className="h-4 w-4" />
                        <span>Orders</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setUserMenuOpen(false);
                          navigate('/account/wishlist');
                        }}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] text-antiquity hover:bg-champagne/50 cursor-pointer"
                      >
                        <Heart className="h-4 w-4" />
                        <span>My Wishlist</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setUserMenuOpen(false);
                          navigate('/account/addresses');
                        }}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] text-antiquity hover:bg-champagne/50 cursor-pointer"
                      >
                        <MapPin className="h-4 w-4" />
                        <span>Addresses</span>
                      </button>
                      <div className="my-1 h-px bg-champagne" />
                      <button
                        type="button"
                        onClick={() => setLogoutModal(true)}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] text-admiral hover:bg-champagne/50 cursor-pointer"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col gap-1 p-1">
                      <button
                        type="button"
                        onClick={() => {
                          setUserMenuOpen(false);
                          navigate('/login');
                        }}
                        className="rounded-lg bg-admiral px-3 py-2 text-[14px] font-medium text-chiffon hover:opacity-90 cursor-pointer"
                      >
                        Login
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setUserMenuOpen(false);
                          navigate('/register');
                        }}
                        className="rounded-lg border border-champagne px-3 py-2 text-[14px] font-medium text-antiquity hover:bg-champagne/40 cursor-pointer"
                      >
                        Register
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Cart Trigger */}
            <button
              type="button"
              onClick={() => {
                if (window.innerWidth < 1024 || currentPath === '/cart') {
                  navigate('/cart');
                } else {
                  openCartDrawer();
                }
              }}
              aria-label="Open Cart"
              className="relative cursor-pointer rounded-lg bg-[#10132b] p-2 shadow-[0_4px_4px_rgba(0,0,0,0.25)] transition-opacity hover:opacity-90"
            >
              <ShoppingBag
                className="h-6 w-6"
                fill={isCartHighlighted ? '#f3f0dd' : 'none'}
              />
              {cart.items.length > 0 && (
                <span className="pointer-events-none absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-chiffon text-[12px] font-bold text-admiral tabular-nums">
                  {cart.items.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Search Overlay Modal */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-[130] flex items-start justify-center bg-black/55 pt-16 sm:pt-24 px-4 backdrop-blur-xs"
          onClick={() => setSearchOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[740px] rounded-[24px] border border-champagne bg-chiffon p-5 sm:p-6 shadow-2xl"
          >
            <div className="flex items-center gap-3 rounded-full border border-champagne bg-white/85 px-4 py-2.5">
              <Search className="h-5 w-5 text-antiquity shrink-0" />
              <input
                autoFocus
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchTerm.trim()) {
                    setSearchOpen(false);
                    navigate(`/products?q=${encodeURIComponent(searchTerm.trim())}`);
                  }
                }}
                placeholder="Search table runners, mats, napkins, Christmas Yard, Life At Court..."
                className="w-full bg-transparent text-[15px] text-admiral outline-none placeholder:text-admiral/45 font-sans"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                aria-label="Close search"
                className="rounded-full p-1 text-admiral/70 hover:bg-champagne/40 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4">
              <div className="mb-2 flex items-center justify-between text-[12px] font-sans uppercase tracking-wider text-admiral/60">
                <span>{q ? 'Matching Creations' : 'Popular Pieces'}</span>
                {q && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchOpen(false);
                      navigate(`/products?q=${encodeURIComponent(searchTerm.trim())}`);
                    }}
                    className="text-antiquity font-semibold hover:underline cursor-pointer"
                  >
                    View all results
                  </button>
                )}
              </div>

              {matchedProducts.length === 0 ? (
                <p className="py-6 text-center text-[14px] text-admiral/70">
                  No pieces matched “{searchTerm}”. Try “Snowflake”, “Lotus”, or “Equestrian”.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[52vh] overflow-y-auto custom-scrollbar pr-1">
                  {matchedProducts.map((p) => {
                    const v = p.variants?.[0];
                    const img = v?.images?.[0] || p.images?.[0] || '/productBlank.svg';
                    return (
                      <button
                        key={p._id}
                        type="button"
                        onClick={() => {
                          setSearchOpen(false);
                          navigate(`/products/${p.slug}`);
                        }}
                        className="flex items-center gap-3 rounded-xl border border-champagne bg-biege/40 p-2.5 text-left hover:bg-champagne/40 transition-colors cursor-pointer"
                      >
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-champagne/30">
                          <LazyImage src={img} alt={p.name} fill className="object-cover" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-[14px] font-serif text-admiral line-clamp-1">
                            {p.name}
                          </div>
                          <div className="text-[13px] font-semibold text-antiquity tabular-nums">
                            {formatPrice(v?.priceMinorUnit || 4500)}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Confirm Logout Dialog */}
      {logoutModal && (
        <div
          className="fixed inset-0 z-[180] flex items-center justify-center bg-black/45 px-4"
          onClick={() => setLogoutModal(false)}
        >
          <div
            role="dialog"
            aria-label="Confirm Logout"
            onClick={(e) => e.stopPropagation()}
            className="flex w-full max-w-sm flex-col gap-5 rounded-lg border border-champagne bg-chiffon p-6 shadow-xl"
          >
            <h2 className="text-[20px] font-bold text-admiral">Confirm Logout</h2>
            <p className="text-[15px] text-admiral">Are you sure you want to log out?</p>
            <div className="flex w-full gap-4">
              <button
                type="button"
                onClick={() => setLogoutModal(false)}
                className="flex-1 rounded-[40px] border border-admiral py-2.5 text-[15px] text-admiral hover:bg-champagne cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="flex-1 rounded-[40px] bg-admiral py-2.5 text-[15px] text-chiffon hover:opacity-90 cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
