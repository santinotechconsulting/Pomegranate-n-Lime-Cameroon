import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { CurrencyCode } from '../data/cameroon';
import { formatMoney } from '../data/cameroon';
import type {
  Address,
  CartState,
  Collection,
  GiftOption,
  HeroBanner,
  Order,
  Product,
  ProductVariant,
  ShopTheLookData,
  UserProfile,
} from '../types/store';

interface ToastState {
  show: boolean;
  type: 'success' | 'error';
  message: string;
  linkText?: string;
  linkHref?: string;
}

interface AddToCartModalState {
  open: boolean;
  product: Product | null;
  variant: ProductVariant | null;
  qty: number;
}

interface StoreContextValue {
  currentPath: string;
  searchQuery: string;
  navigate: (to: string) => void;
  user: UserProfile | null;
  authChecked: boolean;
  refreshUser: () => Promise<void>;
  setUserLocal: (u: UserProfile | null) => void;
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => Promise<void>;
  formatPrice: (usdMinorUnit: number) => string;
  collections: Collection[];
  products: Product[];
  gifts: GiftOption[];
  banners: HeroBanner[];
  shopTheLook: ShopTheLookData | null;
  bestSellers: Product[];
  catalogLoaded: boolean;
  addresses: Address[];
  refreshAddresses: () => Promise<void>;
  wishlist: Product[];
  isWishlisted: (productId: string, sku?: string) => boolean;
  toggleWishlist: (product: Product, sku?: string) => Promise<void>;
  refreshWishlist: () => Promise<void>;
  orders: Order[];
  refreshOrders: () => Promise<void>;
  cart: CartState;
  refreshCart: () => Promise<void>;
  addToCartDirect: (productId: string, sku: string, qty: number) => Promise<boolean>;
  updateCartQty: (sku: string, qty: number) => Promise<void>;
  removeCartItem: (sku: string) => Promise<void>;
  selectGift: (giftId: string | null) => Promise<void>;
  isCartDrawerOpen: boolean;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  addToCartModal: AddToCartModalState;
  openAddToCartModal: (product: Product, variant?: ProductVariant, qty?: number) => void;
  closeAddToCartModal: () => void;
  isContactOpen: boolean;
  openContact: () => void;
  closeContact: () => void;
  toast: ToastState;
  showToast: (msg: string, opts?: Partial<Omit<ToastState, 'show' | 'message'>>) => void;
  hideToast: () => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
}

export function isMatProduct(p: Product): boolean {
  const cat = (p.productCategory || '').toLowerCase();
  const name = (p.name || '').toLowerCase();
  if (cat === 'set' || name.includes('full set') || name.includes('half set')) return false;
  return cat === 'mat' || (name.includes('mat') && !name.includes('runner') && !name.includes('napkin'));
}

export function useDocumentSeo(opts: {
  title: string;
  description?: string;
  canonicalPath?: string;
  jsonLd?: Record<string, unknown>;
}) {
  useEffect(() => {
    document.title = opts.title;
    if (opts.description) {
      const descEl = document.querySelector('meta[name="description"]');
      if (descEl) descEl.setAttribute('content', opts.description);
      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute('content', opts.description);
      const twDesc = document.querySelector('meta[name="twitter:description"]');
      if (twDesc) twDesc.setAttribute('content', opts.description);
    }
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', opts.title);
    const twTitle = document.querySelector('meta[name="twitter:title"]');
    if (twTitle) twTitle.setAttribute('content', opts.title);

    const canonicalHref = window.location.origin + (opts.canonicalPath ?? window.location.pathname);
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = canonicalHref;

    if (opts.jsonLd) {
      let script = document.getElementById('dynamic-route-jsonld') as HTMLScriptElement | null;
      if (!script) {
        script = document.createElement('script');
        script.id = 'dynamic-route-jsonld';
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(opts.jsonLd);
    }
  }, [opts.title, opts.description, opts.canonicalPath, opts.jsonLd]);
}

const EMPTY_CART: CartState = {
  items: [],
  subtotalMinorUnit: 0,
  taxTotalMinorUnit: 0,
  gift: null,
  giftMinorUnit: 0,
  totalMinorUnit: 0,
  matMinimumQuantity: 4,
  matCount: 0,
};

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname || '/');
  const [searchQuery, setSearchQuery] = useState(() => window.location.search || '');

  const [user, setUser] = useState<UserProfile | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    const saved = localStorage.getItem('pnl_cm_currency');
    return saved === 'USD' || saved === 'EUR' || saved === 'XAF' ? saved : 'XAF';
  });

  const [collections, setCollections] = useState<Collection[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [gifts, setGifts] = useState<GiftOption[]>([]);
  const [banners, setBanners] = useState<HeroBanner[]>([]);
  const [shopTheLook, setShopTheLook] = useState<ShopTheLookData | null>(null);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [catalogLoaded, setCatalogLoaded] = useState(false);

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<CartState>(EMPTY_CART);

  const [isCartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [isContactOpen, setContactOpen] = useState(false);
  const [addToCartModal, setAddToCartModal] = useState<AddToCartModalState>({
    open: false,
    product: null,
    variant: null,
    qty: 1,
  });

  const [toast, setToast] = useState<ToastState>({
    show: false,
    type: 'success',
    message: '',
  });

  const showToast = useCallback(
    (message: string, opts?: Partial<Omit<ToastState, 'show' | 'message'>>) => {
      setToast({
        show: true,
        type: opts?.type || 'success',
        message,
        linkText: opts?.linkText,
        linkHref: opts?.linkHref,
      });
    },
    []
  );

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, show: false }));
  }, []);

  const navigate = useCallback((to: string) => {
    if (!to) return;
    if (to.startsWith('http://') || to.startsWith('https://')) {
      const a = document.createElement('a');
      a.href = to;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.click();
      return;
    }
    const [pathname, search] = to.split('?');
    const fullUrl = pathname + (search ? `?${search}` : '');
    if (window.location.pathname + window.location.search !== fullUrl) {
      window.history.pushState({}, '', fullUrl);
    }
    setCurrentPath(pathname || '/');
    setSearchQuery(search ? `?${search}` : '');
    if (!to.includes('#')) {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    }
  }, []);

  useEffect(() => {
    const onPop = () => {
      setCurrentPath(window.location.pathname || '/');
      setSearchQuery(window.location.search || '');
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const refreshCart = useCallback(async () => {
    try {
      const res = await fetch('/api/cart', { credentials: 'same-origin' });
      if (res.ok) setCart(await res.json());
    } catch {
      // ignore transient error
    }
  }, []);

  const refreshAddresses = useCallback(async () => {
    try {
      const res = await fetch('/api/me/addresses', { credentials: 'same-origin' });
      if (res.ok) setAddresses(await res.json());
      else setAddresses([]);
    } catch {
      setAddresses([]);
    }
  }, []);

  const refreshWishlist = useCallback(async () => {
    try {
      const res = await fetch('/api/me/wishlist', { credentials: 'same-origin' });
      if (res.ok) setWishlist(await res.json());
      else setWishlist([]);
    } catch {
      setWishlist([]);
    }
  }, []);

  const refreshOrders = useCallback(async () => {
    try {
      const res = await fetch('/api/me/orders', { credentials: 'same-origin' });
      if (res.ok) setOrders(await res.json());
      else setOrders([]);
    } catch {
      setOrders([]);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch('/api/me', { credentials: 'same-origin' });
      if (res.ok) {
        const u: UserProfile = await res.json();
        setUser(u);
        if (u.preferredCurrency && !localStorage.getItem('pnl_cm_currency')) {
          setCurrencyState(u.preferredCurrency);
        }
        await Promise.all([refreshAddresses(), refreshWishlist(), refreshOrders()]);
      } else {
        setUser(null);
        setAddresses([]);
        setWishlist([]);
        setOrders([]);
      }
    } catch {
      setUser(null);
    } finally {
      setAuthChecked(true);
    }
  }, [refreshAddresses, refreshWishlist, refreshOrders]);

  useEffect(() => {
    (async () => {
      try {
        const [homeRes, prodRes, giftRes] = await Promise.all([
          fetch('/api/home'),
          fetch('/api/products'),
          fetch('/api/gifts'),
        ]);
        if (homeRes.ok) {
          const h = await homeRes.json();
          setBanners(h.banners || []);
          setCollections(h.collections || []);
          setShopTheLook(h.shopTheLook || null);
          setBestSellers(h.bestSellers || []);
        }
        if (prodRes.ok) {
          const p = await prodRes.json();
          setProducts(p.products || []);
        }
        if (giftRes.ok) {
          setGifts(await giftRes.json());
        }
      } finally {
        setCatalogLoaded(true);
      }
    })();
    refreshUser();
    refreshCart();
  }, [refreshUser, refreshCart]);

  const setCurrency = useCallback(
    async (c: CurrencyCode) => {
      setCurrencyState(c);
      localStorage.setItem('pnl_cm_currency', c);
      if (user) {
        try {
          await fetch('/api/me', {
            method: 'PATCH',
            credentials: 'same-origin',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ preferredCurrency: c }),
          });
        } catch {
          // ignore
        }
      }
    },
    [user]
  );

  const formatPrice = useCallback(
    (usdMinorUnit: number) => formatMoney(usdMinorUnit, currency),
    [currency]
  );

  const isWishlisted = useCallback(
    (productId: string, sku?: string) => {
      return wishlist.some(
        (w) =>
          w._id === productId &&
          (sku && w.selectedVariantSku ? w.selectedVariantSku === sku : true)
      );
    },
    [wishlist]
  );

  const toggleWishlist = useCallback(
    async (product: Product, sku?: string) => {
      if (!user) {
        navigate(`/register?next=${encodeURIComponent(currentPath)}&reason=wishlist`);
        return;
      }
      const activeSku = sku || product.variants?.[0]?.sku || '';
      const exists = isWishlisted(product._id, activeSku);
      const q = activeSku ? `?sku=${encodeURIComponent(activeSku)}` : '';
      const res = await fetch(`/api/me/wishlist/${encodeURIComponent(product._id)}${q}`, {
        method: exists ? 'DELETE' : 'PUT',
        credentials: 'same-origin',
      });
      if (res.ok) {
        await refreshWishlist();
        showToast(
          exists
            ? 'This product has been removed from your wishlist'
            : 'This product has been added to your wishlist',
          {
            linkText: 'View Wishlist',
            linkHref: '/account/wishlist',
          }
        );
      }
    },
    [user, navigate, currentPath, isWishlisted, refreshWishlist, showToast]
  );

  const addToCartDirect = useCallback(
    async (productId: string, sku: string, qty: number) => {
      const res = await fetch('/api/cart/items', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ productId, sku, qty }),
      });
      if (res.ok) {
        setCart(await res.json());
        showToast('This product has been added to your cart', {
          linkText: 'View Cart',
          linkHref: '/cart',
        });
        return true;
      }
      return false;
    },
    [showToast]
  );

  const updateCartQty = useCallback(async (sku: string, qty: number) => {
    const res = await fetch(`/api/cart/items/${encodeURIComponent(sku)}`, {
      method: 'PATCH',
      credentials: 'same-origin',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ qty }),
    });
    if (res.ok) setCart(await res.json());
  }, []);

  const removeCartItem = useCallback(async (sku: string) => {
    const res = await fetch(`/api/cart/items/${encodeURIComponent(sku)}`, {
      method: 'DELETE',
      credentials: 'same-origin',
    });
    if (res.ok) setCart(await res.json());
  }, []);

  const selectGift = useCallback(async (giftId: string | null) => {
    const res = await fetch('/api/cart/gift', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ giftId }),
    });
    if (res.ok) setCart(await res.json());
  }, []);

  const openAddToCartModal = useCallback(
    (product: Product, variant?: ProductVariant, qty?: number) => {
      const v = variant || product.variants?.[0] || null;
      const minQty = isMatProduct(product) ? 1 : Math.max(1, product.minimumQuantity || 1);
      setAddToCartModal({
        open: true,
        product,
        variant: v,
        qty: qty ? Math.max(minQty, qty) : minQty,
      });
    },
    []
  );

  const closeAddToCartModal = useCallback(() => {
    setAddToCartModal((prev) => ({ ...prev, open: false }));
  }, []);

  return (
    <StoreContext.Provider
      value={{
        currentPath,
        searchQuery,
        navigate,
        user,
        authChecked,
        refreshUser,
        setUserLocal: setUser,
        currency,
        setCurrency,
        formatPrice,
        collections,
        products,
        gifts,
        banners,
        shopTheLook,
        bestSellers,
        catalogLoaded,
        addresses,
        refreshAddresses,
        wishlist,
        isWishlisted,
        toggleWishlist,
        refreshWishlist,
        orders,
        refreshOrders,
        cart,
        refreshCart,
        addToCartDirect,
        updateCartQty,
        removeCartItem,
        selectGift,
        isCartDrawerOpen,
        openCartDrawer: () => setCartDrawerOpen(true),
        closeCartDrawer: () => setCartDrawerOpen(false),
        addToCartModal,
        openAddToCartModal,
        closeAddToCartModal,
        isContactOpen,
        openContact: () => setContactOpen(true),
        closeContact: () => setContactOpen(false),
        toast,
        showToast,
        hideToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}
