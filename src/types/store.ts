import type { CurrencyCode } from '../data/cameroon';

export interface ProductVariant {
  sku: string;
  label?: string;
  priceMinorUnit: number;
  stock: number;
  images?: string[];
  color?: string[];
  occasion?: string[];
  productType?: string[];
  productCategory?: string;
  materialType?: string;
  hsnCode?: string;
  productLength?: number;
  productBreadth?: number;
  productDimensionUnit?: string;
}

export interface Product {
  _id: string;
  slug: string;
  name: string;
  description?: string;
  collectionSlugs?: string[];
  images?: string[];
  variants?: ProductVariant[];
  tags?: string[];
  active?: boolean;
  isBestSeller?: boolean;
  careInstructions?: string;
  disclaimer?: string;
  productCategory?: string;
  minimumQuantity?: number;
  currency?: string;
  tax?: { enabled?: boolean; rate?: number };
  selectedVariantSku?: string;
  selectedVariant?: ProductVariant;
  reviews?: ProductReview[];
}

export interface ProductReview {
  id: string;
  productSlug: string;
  author: string;
  city: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
}

export interface Collection {
  _id: string;
  slug: string;
  name: string;
  description?: string;
  heroImage?: string;
  cardImage?: string;
  sortOrder?: number;
  active?: boolean;
}

export interface GiftOption {
  _id: string;
  name: string;
  price: number;
  description: string;
  image: string;
}

export interface Address {
  _id: string;
  label: string;
  fullName: string;
  phone: string;
  email?: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
}

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  gender: string;
  preferredCurrency: CurrencyCode;
  preferredLanguage: 'en' | 'fr';
  whatsappUpdates: boolean;
  newsletterOptIn: boolean;
  city: string;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  slug: string;
  sku: string;
  name: string;
  variantLabel?: string;
  image?: string;
  priceMinorUnit: number;
  qty: number;
  minimumQuantity?: number;
  isMat?: boolean;
}

export interface CartState {
  items: CartItem[];
  subtotalMinorUnit: number;
  taxTotalMinorUnit: number;
  gift: GiftOption | null;
  giftMinorUnit: number;
  totalMinorUnit: number;
  matMinimumQuantity: number;
  matCount: number;
}

export interface OrderItem {
  productId: string;
  slug: string;
  sku: string;
  name: string;
  variantLabel?: string;
  image?: string;
  priceMinorUnit: number;
  qty: number;
  hsnCode?: string;
  tax?: { rate: number; amountMinorUnit: number };
}

export interface Order {
  _id: string;
  orderNumber: string;
  createdAt: string;
  status: 'placed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  displayStatus?: string;
  estimatedDelivery?: string;
  paymentMethod: string;
  baseCurrency: string;
  paymentCurrency: string;
  exchangeRate: number;
  subtotalMinorUnit: number;
  shippingMinorUnit: number;
  taxTotalMinorUnit: number;
  giftMinorUnit: number;
  gift?: { name: string };
  totalMinorUnit: number;
  customerEmail: string;
  shippingAddress: Address;
  items: OrderItem[];
  statusHistory: Array<{ status: string; at: string; note?: string }>;
  cancellationRequest?: { status: 'pending' | 'rejected' | 'approved'; reason?: string; rejectionReason?: string };
}

export interface HeroBanner {
  image: string;
  heading: string;
  subheading: string;
  ctaText: string;
  ctaHref: string;
  sortOrder: number;
  active: boolean;
}

export interface ShopTheLookData {
  heading: string;
  subheading: string;
  heroImage?: string;
  looks: Array<{
    image: string;
    hotspots: Array<{
      xPct: number;
      yPct: number;
      productId: string;
      variantSku?: string;
      product: Product;
    }>;
  }>;
}
