/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { Suspense, lazy } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { AddressBanner } from './components/AddressBanner';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Toast } from './components/Toast';
import { CartDrawer } from './components/CartDrawer';
import { AddToCartPopup } from './components/AddToCartPopup';
import { ContactModal } from './components/ContactModal';
import { WhatsAppButton } from './components/WhatsAppButton';
import { Spinner } from './components/Spinner';

// Eager HomePage for fastest first paint; lazy-split secondary routes for global speed
import { HomePage } from './pages/HomePage';

const CollectionsPage = lazy(() =>
  import('./pages/CollectionsPage').then((m) => ({ default: m.CollectionsPage }))
);
const ProductsPage = lazy(() =>
  import('./pages/ProductsPage').then((m) => ({ default: m.ProductsPage }))
);
const ProductDetailPage = lazy(() =>
  import('./pages/ProductDetailPage').then((m) => ({ default: m.ProductDetailPage }))
);
const OurStoryPage = lazy(() =>
  import('./pages/OurStoryPage').then((m) => ({ default: m.OurStoryPage }))
);
const CartPage = lazy(() =>
  import('./pages/CartPage').then((m) => ({ default: m.CartPage }))
);
const CheckoutPage = lazy(() =>
  import('./pages/CheckoutPage').then((m) => ({ default: m.CheckoutPage }))
);
const FaqPage = lazy(() =>
  import('./pages/FaqPage').then((m) => ({ default: m.FaqPage }))
);
const TrackOrderPage = lazy(() =>
  import('./pages/TrackOrderPage').then((m) => ({ default: m.TrackOrderPage }))
);
const MenuPage = lazy(() =>
  import('./pages/MenuPage').then((m) => ({ default: m.MenuPage }))
);
const AuthPage = lazy(() =>
  import('./pages/AuthPage').then((m) => ({ default: m.AuthPage }))
);
const PolicyPage = lazy(() =>
  import('./pages/PolicyPage').then((m) => ({ default: m.PolicyPage }))
);

// Account Dashboard & Profile Settings
const ProfilePage = lazy(() =>
  import('./pages/account/ProfilePage').then((m) => ({ default: m.ProfilePage }))
);
const OrdersPage = lazy(() =>
  import('./pages/account/OrdersPage').then((m) => ({ default: m.OrdersPage }))
);
const WishlistPage = lazy(() =>
  import('./pages/account/WishlistPage').then((m) => ({ default: m.WishlistPage }))
);
const AddressesPage = lazy(() =>
  import('./pages/account/AddressesPage').then((m) => ({ default: m.AddressesPage }))
);

function RouteView() {
  const { currentPath, navigate } = useStore();
  const path = currentPath.replace(/\/+$/, '') || '/';

  if (path === '/') return <HomePage />;

  if (path === '/collections') return <CollectionsPage />;
  if (path.startsWith('/collections/')) {
    const slug = decodeURIComponent(path.slice('/collections/'.length).split('/')[0]);
    return <CollectionsPage slug={slug} />;
  }

  if (path === '/products') return <ProductsPage />;
  if (path.startsWith('/products/')) {
    const slug = decodeURIComponent(path.slice('/products/'.length).split('/')[0]);
    return <ProductDetailPage slug={slug} />;
  }

  if (path === '/our-story') return <OurStoryPage section="our-story" />;
  if (path === '/our-story/brand-story') return <OurStoryPage section="brand-story" />;
  if (path === '/our-story/product-story') return <OurStoryPage section="product-story" />;
  if (path === '/our-story/work-story') return <OurStoryPage section="work-story" />;
  if (path === '/our-story/blogs') return <OurStoryPage section="blogs" />;
  if (path.startsWith('/our-story/blogs/')) {
    const id = decodeURIComponent(path.slice('/our-story/blogs/'.length));
    return <OurStoryPage section="blogs" blogId={id} />;
  }

  if (path === '/account') return <ProfilePage />;
  if (path === '/account/orders') return <OrdersPage />;
  if (path === '/account/wishlist') return <WishlistPage />;
  if (path === '/account/addresses') return <AddressesPage />;

  if (path === '/cart') return <CartPage />;
  if (path === '/checkout') return <CheckoutPage mode="checkout" />;
  if (path === '/checkout/address') return <CheckoutPage mode="address" />;

  if (path === '/faq') return <FaqPage />;
  if (path === '/track-order') return <TrackOrderPage />;
  if (path === '/menu') return <MenuPage />;

  if (path === '/login') return <AuthPage mode="login" />;
  if (path === '/register') return <AuthPage mode="register" />;
  if (path === '/forgot-password') return <AuthPage mode="forgot-password" />;

  if (path.startsWith('/policies/')) {
    const pol = path.slice('/policies/'.length) as
      | 'privacy-policy'
      | 'terms-of-use'
      | 'returns-exchanges'
      | 'general-terms-and-conditions';
    return <PolicyPage policy={pol} />;
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <h1 className="text-[36px] font-display text-admiral">Page Not Found</h1>
      <p className="mt-2 text-[15px] text-admiral/75">
        The requested courtyard room could not be found.
      </p>
      <button
        type="button"
        onClick={() => navigate('/')}
        className="mt-6 rounded-[40px] bg-admiral px-8 py-3 text-[14px] text-chiffon cursor-pointer"
      >
        Return Home
      </button>
    </div>
  );
}

function ConnectedToast() {
  const { toast, hideToast, navigate } = useStore();
  return (
    <Toast
      show={toast.show}
      type={toast.type}
      message={toast.message}
      linkText={toast.linkText}
      linkHref={toast.linkHref}
      onNavigate={navigate}
      onClose={hideToast}
    />
  );
}

export default function App() {
  return (
    <StoreProvider>
      <div className="min-h-screen flex flex-col bg-chiffon text-admiral selection:bg-champagne selection:text-admiral">
        <Header />
        <AddressBanner />
        <main className="flex-1 pb-20 lg:pb-0">
          <Suspense
            fallback={
              <div className="flex min-h-[60vh] items-center justify-center">
                <Spinner size="md" label="Loading..." />
              </div>
            }
          >
            <RouteView />
          </Suspense>
        </main>
        <Footer />
        <MobileBottomNav />
        <CartDrawer />
        <AddToCartPopup />
        <ContactModal />
        <WhatsAppButton />
        <ConnectedToast />
      </div>
    </StoreProvider>
  );
}
