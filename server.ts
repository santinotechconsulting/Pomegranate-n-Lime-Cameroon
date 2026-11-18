import express, { type Request, type Response, type NextFunction } from 'express';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import crypto from 'node:crypto';

const PORT = Number(process.env.PORT || 3000);
const IS_PROD = process.env.NODE_ENV === 'production';
const ROOT = process.cwd();

interface CatalogVariant {
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

interface CatalogProduct {
  _id: string;
  slug: string;
  name: string;
  description?: string;
  collectionSlugs?: string[];
  images?: string[];
  variants?: CatalogVariant[];
  tags?: string[];
  active?: boolean;
  isBestSeller?: boolean;
  careInstructions?: string;
  disclaimer?: string;
  productCategory?: string;
  minimumQuantity?: number;
  currency?: string;
  tax?: { enabled?: boolean; rate?: number };
}

interface CatalogCollection {
  _id: string;
  slug: string;
  name: string;
  description?: string;
  heroImage?: string;
  cardImage?: string;
  sortOrder?: number;
  active?: boolean;
}

interface CatalogData {
  collections: CatalogCollection[];
  products: CatalogProduct[];
  gifts: Array<{
    _id: string;
    name: string;
    price: number;
    description: string;
    image: string;
    active?: boolean;
  }>;
  banners: Array<{
    image: string;
    heading: string;
    subheading: string;
    ctaText: string;
    ctaHref: string;
    sortOrder: number;
    active: boolean;
  }>;
  shopTheLook: {
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
        product: CatalogProduct;
      }>;
    }>;
  };
  bestSellerSlugs: string[];
  faq: {
    categories: Array<{ id: string; name: string }>;
    items: Array<{ id?: string; category: string; question: string; answer: string; active?: boolean }>;
  };
}

interface AddressRecord {
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

interface OrderItemRecord {
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

interface OrderRecord {
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
  shippingAddress: AddressRecord;
  items: OrderItemRecord[];
  statusHistory: Array<{ status: string; at: string; note?: string }>;
  cancellationRequest?: { status: 'pending' | 'rejected' | 'approved'; reason?: string; rejectionReason?: string };
}

interface ReviewRecord {
  id: string;
  productSlug: string;
  author: string;
  city: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
}

interface UserProfileRecord {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  gender: string;
  preferredCurrency: 'XAF' | 'USD' | 'EUR';
  preferredLanguage: 'en' | 'fr';
  whatsappUpdates: boolean;
  newsletterOptIn: boolean;
  city: string;
  createdAt: string;
}

interface CartItemRecord {
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

interface StoreDb {
  user: UserProfileRecord;
  addresses: AddressRecord[];
  wishlist: Array<{ productId: string; sku?: string }>;
  orders: OrderRecord[];
  cart: {
    items: CartItemRecord[];
    giftId: string | null;
  };
  reviews: ReviewRecord[];
  contactMessages: Array<{ id: string; name: string; email: string; phone: string; message: string; createdAt: string }>;
}

const catalogPath = path.join(ROOT, 'src', 'data', 'catalog.json');
const catalog: CatalogData = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

const dbDir = path.join(ROOT, 'data');
const dbPath = path.join(dbDir, 'store-db.json');

function createInitialDb(): StoreDb {
  const sampleP1 = catalog.products.find((p) => p.slug === 'tcy-cream-full-set-gnomes-runner') || catalog.products[0];
  const sampleP2 = catalog.products.find((p) => p.slug === 'sails-up-white-series-3-mat') || catalog.products[1];
  const sampleP3 = catalog.products.find((p) => p.slug === 'life-at-court-white-mat-lotus') || catalog.products[2];
  const sampleP4 = catalog.products.find((p) => p.slug === 'tcy-light-blue-snowflake-runner') || catalog.products[3];

  const v1 = sampleP1?.variants?.[0];
  const v2 = sampleP2?.variants?.[0];
  const v3 = sampleP3?.variants?.[0];
  const v4 = sampleP4?.variants?.[0];

  return {
    user: {
      _id: 'usr-cm-001',
      name: 'Aminatou Ndiaye',
      email: 'aminatou.ndiaye@bonapriso.cm',
      phoneNumber: '+237 677482910',
      gender: 'female',
      preferredCurrency: 'XAF',
      preferredLanguage: 'en',
      whatsappUpdates: true,
      newsletterOptIn: true,
      city: 'Douala',
      createdAt: '2026-09-14T10:30:00.000Z',
    },
    addresses: [
      {
        _id: 'addr-cm-1',
        label: 'Home',
        fullName: 'Aminatou Ndiaye',
        phone: '+237 677482910',
        email: 'aminatou.ndiaye@bonapriso.cm',
        line1: 'Villa 14, Rue des Palmiers',
        line2: 'Bonapriso, près du Glacier Moderne',
        city: 'Douala',
        state: 'Littoral',
        pincode: 'BP 4821',
        country: 'Cameroon',
        isDefault: true,
      },
      {
        _id: 'addr-cm-2',
        label: 'Work',
        fullName: 'Aminatou Ndiaye',
        phone: '+237 699124578',
        email: 'aminatou.ndiaye@bonapriso.cm',
        line1: 'Immeuble Horizon, Boulevard de l’URSS',
        line2: 'Quartier Bastos',
        city: 'Yaoundé',
        state: 'Centre',
        pincode: 'BP 1109',
        country: 'Cameroon',
        isDefault: false,
      },
    ],
    wishlist: [
      { productId: sampleP1._id, sku: v1?.sku },
      { productId: sampleP3._id, sku: v3?.sku },
      { productId: sampleP4._id, sku: v4?.sku },
    ],
    orders: [
      {
        _id: 'ord-cm-1089',
        orderNumber: 'PNL-CM-1089',
        createdAt: new Date(Date.now() - 3 * 86400_000).toISOString(),
        status: 'shipped',
        displayStatus: 'shipped',
        estimatedDelivery: '2–3 business days (Douala Courier)',
        paymentMethod: 'MTN Mobile Money (MoMo)',
        baseCurrency: 'USD',
        paymentCurrency: 'XAF',
        exchangeRate: 600,
        subtotalMinorUnit: (v4?.priceMinorUnit || 9900) + (v2?.priceMinorUnit || 4500) * 4,
        shippingMinorUnit: 0,
        taxTotalMinorUnit: 0,
        giftMinorUnit: 1200,
        gift: { name: 'A Gift Box' },
        totalMinorUnit: (v4?.priceMinorUnit || 9900) + (v2?.priceMinorUnit || 4500) * 4 + 1200,
        customerEmail: 'aminatou.ndiaye@bonapriso.cm',
        shippingAddress: {
          _id: 'addr-cm-1',
          label: 'Home',
          fullName: 'Aminatou Ndiaye',
          phone: '+237 677482910',
          email: 'aminatou.ndiaye@bonapriso.cm',
          line1: 'Villa 14, Rue des Palmiers',
          line2: 'Bonapriso, près du Glacier Moderne',
          city: 'Douala',
          state: 'Littoral',
          pincode: 'BP 4821',
          country: 'Cameroon',
          isDefault: true,
        },
        items: [
          {
            productId: sampleP4._id,
            slug: sampleP4.slug,
            sku: v4?.sku || 'TCY-26-LB-TR-SNF',
            name: sampleP4.name,
            variantLabel: v4?.label || 'Light Blue Runner, Snowflakes Motif',
            image: v4?.images?.[0] || '/productBlank.svg',
            priceMinorUnit: v4?.priceMinorUnit || 9900,
            qty: 1,
            hsnCode: v4?.hsnCode || '63025200',
            tax: { rate: 0, amountMinorUnit: 0 },
          },
          {
            productId: sampleP2._id,
            slug: sampleP2.slug,
            sku: v2?.sku || 'SU-26-WH3-TM-1319-BR',
            name: sampleP2.name,
            variantLabel: v2?.label || 'White Series 3 Mat',
            image: v2?.images?.[0] || '/productBlank.svg',
            priceMinorUnit: v2?.priceMinorUnit || 4500,
            qty: 4,
            hsnCode: v2?.hsnCode || '63025200',
            tax: { rate: 0, amountMinorUnit: 0 },
          },
        ],
        statusHistory: [
          { status: 'placed', at: new Date(Date.now() - 3 * 86400_000).toISOString(), note: 'Confirmed via MTN MoMo' },
          { status: 'shipped', at: new Date(Date.now() - 1 * 86400_000).toISOString(), note: 'Dispatched from Bonapriso Atelier' },
        ],
      },
      {
        _id: 'ord-cm-1042',
        orderNumber: 'PNL-CM-1042',
        createdAt: new Date(Date.now() - 19 * 86400_000).toISOString(),
        status: 'delivered',
        displayStatus: 'delivered',
        paymentMethod: 'Orange Money Cameroon',
        baseCurrency: 'USD',
        paymentCurrency: 'XAF',
        exchangeRate: 600,
        subtotalMinorUnit: v1?.priceMinorUnit || 95300,
        shippingMinorUnit: 0,
        taxTotalMinorUnit: 0,
        giftMinorUnit: 0,
        totalMinorUnit: v1?.priceMinorUnit || 95300,
        customerEmail: 'aminatou.ndiaye@bonapriso.cm',
        shippingAddress: {
          _id: 'addr-cm-2',
          label: 'Work',
          fullName: 'Aminatou Ndiaye',
          phone: '+237 699124578',
          email: 'aminatou.ndiaye@bonapriso.cm',
          line1: 'Immeuble Horizon, Boulevard de l’URSS',
          line2: 'Quartier Bastos',
          city: 'Yaoundé',
          state: 'Centre',
          pincode: 'BP 1109',
          country: 'Cameroon',
          isDefault: false,
        },
        items: [
          {
            productId: sampleP1._id,
            slug: sampleP1.slug,
            sku: v1?.sku || 'TCY-SET-CR-TM1319-TR-GNO',
            name: sampleP1.name,
            variantLabel: v1?.label || 'Cream Full Set (17 pcs)',
            image: v1?.images?.[0] || '/productBlank.svg',
            priceMinorUnit: v1?.priceMinorUnit || 95300,
            qty: 1,
            hsnCode: v1?.hsnCode || '63025200',
            tax: { rate: 0, amountMinorUnit: 0 },
          },
        ],
        statusHistory: [
          { status: 'placed', at: new Date(Date.now() - 19 * 86400_000).toISOString() },
          { status: 'shipped', at: new Date(Date.now() - 17 * 86400_000).toISOString() },
          { status: 'delivered', at: new Date(Date.now() - 14 * 86400_000).toISOString(), note: 'Signed at Bastos Reception' },
        ],
      },
    ],
    cart: {
      items: [],
      giftId: null,
    },
    reviews: [
      {
        id: 'rev-1',
        productSlug: sampleP1.slug,
        author: 'Aminatou Ndiaye',
        city: 'Douala, Cameroon',
        rating: 5,
        title: 'Showpiece for our Christmas Eve dinner in Bonapriso',
        comment:
          'The hand-embroidered gnomes and crisp cream linen elevated our entire dining room. Guests kept admiring every mat.',
        createdAt: new Date(Date.now() - 12 * 86400_000).toISOString(),
      },
      {
        id: 'rev-2',
        productSlug: sampleP3.slug,
        author: 'Jean-Paul Mbarga',
        city: 'Yaoundé, Cameroon',
        rating: 5,
        title: 'Museum-grade embroidery & fast Yaoundé delivery',
        comment:
          'Arrived beautifully boxed in Bastos within 48 hours. The lotus embroidery has remarkable depth.',
        createdAt: new Date(Date.now() - 8 * 86400_000).toISOString(),
      },
    ],
    contactMessages: [],
  };
}

function loadDb(): StoreDb {
  fs.mkdirSync(dbDir, { recursive: true });
  if (!fs.existsSync(dbPath)) {
    const initial = createInitialDb();
    fs.writeFileSync(dbPath, JSON.stringify(initial, null, 2));
    return initial;
  }
  try {
    return JSON.parse(fs.readFileSync(dbPath, 'utf8')) as StoreDb;
  } catch {
    const initial = createInitialDb();
    fs.writeFileSync(dbPath, JSON.stringify(initial, null, 2));
    return initial;
  }
}

function saveDb(db: StoreDb): void {
  fs.mkdirSync(dbDir, { recursive: true });
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
}

function parseCookies(req: Request): Record<string, string> {
  const header = req.headers.cookie || '';
  const out: Record<string, string> = {};
  for (const part of header.split(';')) {
    const idx = part.indexOf('=');
    if (idx > 0) {
      out[part.slice(0, idx).trim()] = decodeURIComponent(part.slice(idx + 1).trim());
    }
  }
  return out;
}

function isAuthenticated(req: Request): boolean {
  const cookies = parseCookies(req);
  return cookies.pnl_logged_out !== '1';
}

function isMatProduct(product: CatalogProduct): boolean {
  const cat = (product.productCategory || '').toLowerCase();
  const name = (product.name || '').toLowerCase();
  if (cat === 'set' || name.includes('full set') || name.includes('half set')) return false;
  return cat === 'mat' || (name.includes('mat') && !name.includes('runner') && !name.includes('napkin'));
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  // Lightweight gzip compression for text/JSON/HTML/SVG responses
  app.use((req: Request, res: Response, next: NextFunction) => {
    const acceptEncoding = req.headers['accept-encoding'] || '';
    if (!acceptEncoding.includes('gzip')) {
      next();
      return;
    }
    const origJson = res.json.bind(res);
    res.json = ((body: unknown) => {
      const json = JSON.stringify(body);
      if (json.length > 1024) {
        res.setHeader('Content-Encoding', 'gzip');
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.setHeader('Vary', 'Accept-Encoding');
        return res.send(zlib.gzipSync(json));
      }
      return origJson(body);
    }) as typeof res.json;
    next();
  });

  // Transparent caching proxy for any uncached catalog /uploads/img/* asset
  app.get('/uploads/img/:filename', async (req: Request, res: Response, next: NextFunction) => {
    const safeName = path.basename(String(req.params.filename || ''));
    const localFile = path.join(ROOT, 'public', 'uploads', 'img', safeName);
    if (fs.existsSync(localFile)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      res.sendFile(localFile);
      return;
    }
    try {
      const upstream = `https://www.pomegranatenlime.com/_next/image?url=${encodeURIComponent(
        `/uploads/img/${safeName}`
      )}&w=1080&q=78`;
      let r = await fetch(upstream, { headers: { Accept: 'image/jpeg,image/png,*/*' } });
      if (!r.ok) {
        r = await fetch(`https://www.pomegranatenlime.com/uploads/img/${safeName}`);
      }
      if (r.ok) {
        const buf = Buffer.from(await r.arrayBuffer());
        fs.mkdirSync(path.dirname(localFile), { recursive: true });
        fs.writeFileSync(localFile, buf);
        res.setHeader('Content-Type', r.headers.get('content-type') || 'image/jpeg');
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        res.send(buf);
        return;
      }
    } catch {
      // Fallback to next handler / placeholder
    }
    next();
  });

  // Serve public assets with aggressive caching
  app.use(
    express.static(path.join(ROOT, 'public'), {
      maxAge: '365d',
      immutable: true,
    })
  );

  // SEO: robots.txt
  app.get('/robots.txt', (req: Request, res: Response) => {
    const base = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
    res.type('text/plain').send(
      `User-agent: *\nAllow: /\nDisallow: /account\nDisallow: /cart\nDisallow: /checkout\nSitemap: ${base}/sitemap.xml\n`
    );
  });

  // SEO: dynamic sitemap.xml
  app.get('/sitemap.xml', (req: Request, res: Response) => {
    const base = (process.env.APP_URL || `${req.protocol}://${req.get('host')}`).replace(/\/$/, '');
    const staticRoutes = [
      '/',
      '/collections',
      '/products',
      '/our-story',
      '/our-story/brand-story',
      '/our-story/product-story',
      '/our-story/work-story',
      '/our-story/blogs',
      '/faq',
      '/track-order',
      '/policies/privacy-policy',
      '/policies/terms-of-use',
      '/policies/returns-exchanges',
      '/policies/general-terms-and-conditions',
    ];
    const collectionRoutes = catalog.collections.map((c) => `/collections/${c.slug}`);
    const productRoutes = catalog.products.map((p) => `/products/${p.slug}`);
    const allUrls = [...staticRoutes, ...collectionRoutes, ...productRoutes];
    const today = new Date().toISOString().split('T')[0];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${allUrls
      .map(
        (u) =>
          `  <url><loc>${base}${u}</loc><lastmod>${today}</lastmod><changefreq>${
            u === '/' ? 'daily' : 'weekly'
          }</changefreq><priority>${u === '/' ? '1.0' : u.startsWith('/collections') ? '0.9' : '0.8'}</priority></url>`
      )
      .join('\n')}\n</urlset>`;
    res.type('application/xml').send(xml);
  });

  // API: Health
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ ok: true, region: 'Cameroon', currency: 'XAF' });
  });

  // API: Home & Catalog
  app.get('/api/home', (_req: Request, res: Response) => {
    const bestSellers = catalog.bestSellerSlugs
      .map((slug) => catalog.products.find((p) => p.slug === slug))
      .filter(Boolean);
    res.json({
      banners: catalog.banners,
      collections: catalog.collections,
      shopTheLook: catalog.shopTheLook,
      bestSellers,
      music: {
        active: true,
        audioUrl: '/uploads/audio/1791727848097-f5b8a00f.mp3',
        title: 'Ambient Courtyard Serenade',
        loop: true,
        volume: 80,
      },
    });
  });

  app.get('/api/collections', (_req: Request, res: Response) => {
    res.json(catalog.collections);
  });

  app.get('/api/collections/:slug', (req: Request, res: Response) => {
    const col = catalog.collections.find((c) => c.slug === req.params.slug);
    if (!col) {
      res.status(404).json({ error: 'Collection not found' });
      return;
    }
    const products = catalog.products.filter((p) => (p.collectionSlugs || []).includes(col.slug));
    res.json({ collection: col, products });
  });

  app.get('/api/products', (req: Request, res: Response) => {
    const q = String(req.query.q || '').trim().toLowerCase();
    const collection = String(req.query.collection || '').trim();
    const category = String(req.query.category || '').trim().toLowerCase();
    let list = catalog.products;
    if (collection) {
      list = list.filter((p) => (p.collectionSlugs || []).includes(collection));
    }
    if (category && category !== 'all') {
      list = list.filter((p) => (p.productCategory || '').toLowerCase() === category);
    }
    if (q) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.tags || []).some((t) => t.toLowerCase().includes(q)) ||
          (p.collectionSlugs || []).some((c) => c.toLowerCase().includes(q))
      );
    }
    res.json({ products: list, total: list.length });
  });

  app.get('/api/products/:slug', (req: Request, res: Response) => {
    const product = catalog.products.find((p) => p.slug === req.params.slug || p._id === req.params.slug);
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    const db = loadDb();
    const reviews = db.reviews.filter((r) => r.productSlug === product.slug);
    res.json({ ...product, reviews });
  });

  app.post('/api/products/:slug/reviews', (req: Request, res: Response) => {
    const product = catalog.products.find((p) => p.slug === req.params.slug || p._id === req.params.slug);
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    const db = loadDb();
    const { rating, title, comment, author, city } = req.body || {};
    if (!comment || !String(comment).trim()) {
      res.status(400).json({ error: 'Review comment is required.' });
      return;
    }
    const review: ReviewRecord = {
      id: `rev-${Date.now()}`,
      productSlug: product.slug,
      author: String(author || db.user.name).trim(),
      city: String(city || `${db.user.city || 'Douala'}, Cameroon`).trim(),
      rating: Math.min(5, Math.max(1, Number(rating) || 5)),
      title: String(title || 'Verified Purchase').trim(),
      comment: String(comment).trim(),
      createdAt: new Date().toISOString(),
    };
    db.reviews.unshift(review);
    saveDb(db);
    res.status(201).json(review);
  });

  app.get('/api/gifts', (_req: Request, res: Response) => {
    res.json(catalog.gifts);
  });

  app.get('/api/product-categories', (_req: Request, res: Response) => {
    res.json([
      { _id: 'cat-set', name: 'Set', minimumQuantity: 1, priority: 1 },
      { _id: 'cat-runner', name: 'Runner', minimumQuantity: 1, priority: 2 },
      { _id: 'cat-mat', name: 'Mat', minimumQuantity: 4, priority: 3 },
      { _id: 'cat-napkin', name: 'Napkin', minimumQuantity: 1, priority: 4 },
    ]);
  });

  // Auth Endpoints
  app.post('/api/auth/sign-in/email', (req: Request, res: Response) => {
    const { email, password } = req.body || {};
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required.' });
      return;
    }
    const db = loadDb();
    if (String(email).trim().toLowerCase() !== db.user.email.toLowerCase()) {
      db.user.email = String(email).trim().toLowerCase();
      saveDb(db);
    }
    res.clearCookie('pnl_logged_out');
    res.json({ ok: true, user: db.user });
  });

  app.post('/api/auth/register', (req: Request, res: Response) => {
    const { name, email, phoneNumber, gender, city } = req.body || {};
    if (!name || !email) {
      res.status(400).json({ error: 'Full name and email are required.' });
      return;
    }
    const db = loadDb();
    db.user = {
      ...db.user,
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      phoneNumber: phoneNumber ? String(phoneNumber).trim() : db.user.phoneNumber,
      gender: gender ? String(gender).toLowerCase() : db.user.gender,
      city: city ? String(city).trim() : db.user.city,
    };
    saveDb(db);
    res.clearCookie('pnl_logged_out');
    res.status(201).json({ ok: true, user: db.user });
  });

  app.post('/api/auth/demo', (_req: Request, res: Response) => {
    const db = loadDb();
    res.clearCookie('pnl_logged_out');
    res.json({ ok: true, user: db.user });
  });

  app.post('/api/auth/sign-out', (_req: Request, res: Response) => {
    res.cookie('pnl_logged_out', '1', { httpOnly: false, sameSite: 'lax', path: '/' });
    res.json({ ok: true });
  });

  // User Profile & Preferences (/api/me)
  app.get('/api/me', (req: Request, res: Response) => {
    if (!isAuthenticated(req)) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }
    const db = loadDb();
    res.json(db.user);
  });

  app.patch('/api/me', (req: Request, res: Response) => {
    if (!isAuthenticated(req)) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }
    const db = loadDb();
    const { name, phoneNumber, gender, preferredCurrency, preferredLanguage, whatsappUpdates, newsletterOptIn, city } =
      req.body || {};
    if (name !== undefined) {
      if (!String(name).trim()) {
        res.status(400).json({ error: 'Name is required.' });
        return;
      }
      db.user.name = String(name).trim();
    }
    if (phoneNumber !== undefined) db.user.phoneNumber = phoneNumber ? String(phoneNumber).trim() : '';
    if (gender !== undefined) db.user.gender = gender ? String(gender).toLowerCase() : '';
    if (preferredCurrency && ['XAF', 'USD', 'EUR'].includes(preferredCurrency)) {
      db.user.preferredCurrency = preferredCurrency;
    }
    if (preferredLanguage && ['en', 'fr'].includes(preferredLanguage)) {
      db.user.preferredLanguage = preferredLanguage;
    }
    if (typeof whatsappUpdates === 'boolean') db.user.whatsappUpdates = whatsappUpdates;
    if (typeof newsletterOptIn === 'boolean') db.user.newsletterOptIn = newsletterOptIn;
    if (city !== undefined) db.user.city = String(city).trim();
    saveDb(db);
    res.json(db.user);
  });

  // Addresses (/api/me/addresses)
  app.get('/api/me/addresses', (req: Request, res: Response) => {
    if (!isAuthenticated(req)) {
      res.status(401).json([]);
      return;
    }
    const db = loadDb();
    res.json(db.addresses);
  });

  app.post('/api/me/addresses', (req: Request, res: Response) => {
    if (!isAuthenticated(req)) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }
    const db = loadDb();
    const body = req.body || {};
    const makeDefault = Boolean(body.isDefault) || db.addresses.length === 0;
    if (makeDefault) {
      db.addresses.forEach((a) => {
        a.isDefault = false;
      });
    }
    const created: AddressRecord = {
      _id: `addr-${crypto.randomUUID().slice(0, 8)}`,
      label: String(body.label || 'Home'),
      fullName: String(body.fullName || db.user.name),
      phone: String(body.phone || db.user.phoneNumber),
      email: String(body.email || db.user.email),
      line1: String(body.line1 || ''),
      line2: body.line2 ? String(body.line2) : '',
      city: String(body.city || 'Douala'),
      state: String(body.state || 'Littoral'),
      pincode: String(body.pincode || ''),
      country: String(body.country || 'Cameroon'),
      isDefault: makeDefault,
    };
    db.addresses.unshift(created);
    saveDb(db);
    res.status(201).json(created);
  });

  app.patch('/api/me/addresses/:id', (req: Request, res: Response) => {
    if (!isAuthenticated(req)) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }
    const db = loadDb();
    const target = db.addresses.find((a) => a._id === req.params.id);
    if (!target) {
      res.status(404).json({ error: 'Address not found' });
      return;
    }
    const body = req.body || {};
    if (body.isDefault) {
      db.addresses.forEach((a) => {
        a.isDefault = a._id === target._id;
      });
    }
    Object.assign(target, {
      label: body.label ?? target.label,
      fullName: body.fullName ?? target.fullName,
      phone: body.phone ?? target.phone,
      email: body.email ?? target.email,
      line1: body.line1 ?? target.line1,
      line2: body.line2 ?? target.line2,
      city: body.city ?? target.city,
      state: body.state ?? target.state,
      pincode: body.pincode ?? target.pincode,
      country: body.country ?? target.country,
    });
    saveDb(db);
    res.json(target);
  });

  app.delete('/api/me/addresses/:id', (req: Request, res: Response) => {
    if (!isAuthenticated(req)) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }
    const db = loadDb();
    db.addresses = db.addresses.filter((a) => a._id !== req.params.id);
    if (db.addresses.length > 0 && !db.addresses.some((a) => a.isDefault)) {
      db.addresses[0].isDefault = true;
    }
    saveDb(db);
    res.json({ ok: true });
  });

  // Wishlist (/api/me/wishlist)
  app.get('/api/me/wishlist', (req: Request, res: Response) => {
    if (!isAuthenticated(req)) {
      res.status(401).json([]);
      return;
    }
    const db = loadDb();
    const hydrated = db.wishlist
      .map((w) => {
        const prod = catalog.products.find((p) => p._id === w.productId || p.slug === w.productId);
        if (!prod) return null;
        const selectedVariant = prod.variants?.find((v) => v.sku === w.sku) || prod.variants?.[0];
        return {
          ...prod,
          selectedVariantSku: selectedVariant?.sku || w.sku,
          selectedVariant,
        };
      })
      .filter(Boolean);
    res.json(hydrated);
  });

  app.put('/api/me/wishlist/:productId', (req: Request, res: Response) => {
    if (!isAuthenticated(req)) {
      res.status(401).json({ error: 'Please login to save to wishlist.' });
      return;
    }
    const db = loadDb();
    const productId = String(req.params.productId);
    const sku = req.query.sku ? String(req.query.sku) : undefined;
    const exists = db.wishlist.some((w) => w.productId === productId && (sku ? w.sku === sku : true));
    if (!exists) {
      db.wishlist.unshift({ productId, sku });
      saveDb(db);
    }
    res.json({ ok: true });
  });

  app.delete('/api/me/wishlist/:productId', (req: Request, res: Response) => {
    if (!isAuthenticated(req)) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }
    const db = loadDb();
    const productId = String(req.params.productId);
    const sku = req.query.sku ? String(req.query.sku) : undefined;
    db.wishlist = db.wishlist.filter((w) => !(w.productId === productId && (!sku || w.sku === sku)));
    saveDb(db);
    res.json({ ok: true });
  });

  // Orders (/api/me/orders)
  app.get('/api/me/orders', (req: Request, res: Response) => {
    if (!isAuthenticated(req)) {
      res.status(401).json([]);
      return;
    }
    const db = loadDb();
    res.json(db.orders);
  });

  app.get('/api/me/orders/:id', (req: Request, res: Response) => {
    if (!isAuthenticated(req)) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }
    const db = loadDb();
    const order = db.orders.find((o) => o._id === req.params.id || o.orderNumber === req.params.id);
    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }
    res.json(order);
  });

  app.post('/api/me/orders/:id/cancel', (req: Request, res: Response) => {
    if (!isAuthenticated(req)) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }
    const db = loadDb();
    const order = db.orders.find((o) => o._id === req.params.id || o.orderNumber === req.params.id);
    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }
    const reason = String((req.body || {}).reason || 'Customer requested cancellation');
    order.status = 'cancelled';
    order.displayStatus = 'cancelled';
    order.statusHistory.push({ status: 'cancelled', at: new Date().toISOString(), note: reason });
    saveDb(db);
    res.json(order);
  });

  app.get('/api/orders/track/:orderNumber', (req: Request, res: Response) => {
    const db = loadDb();
    const target = String(req.params.orderNumber || '').trim().toUpperCase();
    const order = db.orders.find((o) => o.orderNumber.toUpperCase() === target);
    if (!order) {
      res.status(404).json({ error: 'No order found with that tracking ID.' });
      return;
    }
    res.json(order);
  });

  // Cart & Checkout
  function buildCartResponse(db: StoreDb) {
    const subtotalMinorUnit = db.cart.items.reduce((sum, i) => sum + i.priceMinorUnit * i.qty, 0);
    const gift = db.cart.giftId ? catalog.gifts.find((g) => g._id === db.cart.giftId) || null : null;
    const giftMinorUnit = gift ? gift.price * 100 : 0;
    const matCount = db.cart.items.reduce((sum, i) => (i.isMat ? sum + i.qty : sum), 0);
    return {
      items: db.cart.items,
      subtotalMinorUnit,
      taxTotalMinorUnit: 0,
      gift,
      giftMinorUnit,
      totalMinorUnit: subtotalMinorUnit + giftMinorUnit,
      matMinimumQuantity: 4,
      matCount,
      currency: 'USD',
    };
  }

  app.get('/api/cart', (_req: Request, res: Response) => {
    const db = loadDb();
    res.json(buildCartResponse(db));
  });

  app.post('/api/cart/items', (req: Request, res: Response) => {
    const { productId, sku, qty } = req.body || {};
    const product = catalog.products.find((p) => p._id === productId || p.slug === productId);
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    const variant = product.variants?.find((v) => v.sku === sku) || product.variants?.[0];
    if (!variant) {
      res.status(400).json({ error: 'Variant not available' });
      return;
    }
    const db = loadDb();
    const addQty = Math.max(1, Number(qty) || 1);
    const existing = db.cart.items.find((i) => i.sku === variant.sku);
    if (existing) {
      existing.qty += addQty;
    } else {
      db.cart.items.push({
        productId: product._id,
        slug: product.slug,
        sku: variant.sku,
        name: product.name,
        variantLabel: variant.label,
        image: variant.images?.[0] || product.images?.[0] || '/productBlank.svg',
        priceMinorUnit: variant.priceMinorUnit,
        qty: addQty,
        minimumQuantity: product.minimumQuantity || 1,
        isMat: isMatProduct(product),
      });
    }
    saveDb(db);
    res.json(buildCartResponse(db));
  });

  app.patch('/api/cart/items/:sku', (req: Request, res: Response) => {
    const db = loadDb();
    const sku = decodeURIComponent(String(req.params.sku));
    const qty = Math.max(1, Number((req.body || {}).qty) || 1);
    const item = db.cart.items.find((i) => i.sku === sku);
    if (!item) {
      res.status(404).json({ error: 'Cart item not found' });
      return;
    }
    item.qty = qty;
    saveDb(db);
    res.json(buildCartResponse(db));
  });

  app.delete('/api/cart/items/:sku', (req: Request, res: Response) => {
    const db = loadDb();
    const sku = decodeURIComponent(String(req.params.sku));
    db.cart.items = db.cart.items.filter((i) => i.sku !== sku);
    saveDb(db);
    res.json(buildCartResponse(db));
  });

  app.post('/api/cart/gift', (req: Request, res: Response) => {
    const db = loadDb();
    const { giftId } = req.body || {};
    db.cart.giftId = giftId ? String(giftId) : null;
    saveDb(db);
    res.json(buildCartResponse(db));
  });

  app.post('/api/checkout', (req: Request, res: Response) => {
    const db = loadDb();
    if (db.cart.items.length === 0) {
      res.status(400).json({ error: 'Your cart is empty.' });
      return;
    }
    const { addressId, address, paymentMethod, shippingMinorUnit } = req.body || {};
    const shippingAddress: AddressRecord =
      db.addresses.find((a) => a._id === addressId) ||
      address ||
      db.addresses[0];
    if (!shippingAddress) {
      res.status(400).json({ error: 'Please select or add a delivery address.' });
      return;
    }
    const cartSummary = buildCartResponse(db);
    const shipFee = Number(shippingMinorUnit) || 0;
    const orderNum = `PNL-CM-${Math.floor(1100 + Math.random() * 8800)}`;
    const now = new Date().toISOString();
    const order: OrderRecord = {
      _id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      createdAt: now,
      status: 'placed',
      displayStatus: 'placed',
      estimatedDelivery: shippingAddress.country === 'Cameroon' ? '2–5 business days' : '7–14 business days',
      paymentMethod: String(paymentMethod || 'MTN Mobile Money (MoMo)'),
      baseCurrency: 'USD',
      paymentCurrency: db.user.preferredCurrency || 'XAF',
      exchangeRate: 600,
      subtotalMinorUnit: cartSummary.subtotalMinorUnit,
      shippingMinorUnit: shipFee,
      taxTotalMinorUnit: 0,
      giftMinorUnit: cartSummary.giftMinorUnit,
      gift: cartSummary.gift ? { name: cartSummary.gift.name } : undefined,
      totalMinorUnit: cartSummary.subtotalMinorUnit + shipFee + cartSummary.giftMinorUnit,
      customerEmail: db.user.email,
      shippingAddress,
      items: cartSummary.items.map((i) => ({
        productId: i.productId,
        slug: i.slug,
        sku: i.sku,
        name: i.name,
        variantLabel: i.variantLabel,
        image: i.image,
        priceMinorUnit: i.priceMinorUnit,
        qty: i.qty,
        hsnCode: '63025200',
        tax: { rate: 0, amountMinorUnit: 0 },
      })),
      statusHistory: [{ status: 'placed', at: now, note: `Paid via ${paymentMethod || 'MTN Mobile Money'}` }],
    };
    db.orders.unshift(order);
    db.cart = { items: [], giftId: null };
    saveDb(db);
    res.status(201).json(order);
  });

  app.post('/api/contact', (req: Request, res: Response) => {
    const db = loadDb();
    const { name, email, phone, message } = req.body || {};
    if (!name || !message) {
      res.status(400).json({ error: 'Name and message are required.' });
      return;
    }
    const entry = {
      id: `msg-${Date.now()}`,
      name: String(name).trim(),
      email: String(email || '').trim(),
      phone: String(phone || '').trim(),
      message: String(message).trim(),
      createdAt: new Date().toISOString(),
    };
    db.contactMessages.unshift(entry);
    saveDb(db);
    res.status(201).json({ ok: true, id: entry.id });
  });

  // Vite dev middleware or production static build
  if (!IS_PROD) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.join(ROOT, 'dist');
    app.use(
      express.static(distDir, {
        maxAge: '30d',
        index: false,
      })
    );
    app.get('*', (req: Request, res: Response) => {
      const indexHtmlPath = path.join(distDir, 'index.html');
      let html = fs.readFileSync(indexHtmlPath, 'utf8');
      const reqPath = req.path;
      const base = (process.env.APP_URL || `${req.protocol}://${req.get('host')}`).replace(/\/$/, '');
      let pageTitle = "Pomegranate 'n' Lime Cameroon – Bespoke Table Linens & Hosting";
      let pageDesc =
        'Mastering the Art of Hosting in Cameroon with bespoke hand-embroidered table linens, mats, runners, and fine tableware.';

      if (reqPath.startsWith('/collections/')) {
        const slug = reqPath.split('/collections/')[1]?.split('/')[0];
        const col = catalog.collections.find((c) => c.slug === slug);
        if (col) {
          pageTitle = `${col.name} | Pomegranate 'n' Lime Cameroon`;
          pageDesc = `Explore the ${col.name} handcrafted linen collection — available in Douala, Yaoundé, and worldwide.`;
        }
      } else if (reqPath.startsWith('/products/')) {
        const slug = reqPath.split('/products/')[1]?.split('/')[0];
        const prod = catalog.products.find((p) => p.slug === slug);
        if (prod) {
          pageTitle = `${prod.name} | Pomegranate 'n' Lime Cameroon`;
          pageDesc = `Shop ${prod.name} in Cameroon (FCFA) with express delivery across Douala, Yaoundé, and globally.`;
        }
      } else if (reqPath.startsWith('/account')) {
        pageTitle = "Account Dashboard | Pomegranate 'n' Lime Cameroon";
      } else if (reqPath.startsWith('/faq')) {
        pageTitle = "FAQs | Pomegranate 'n' Lime Cameroon";
      }

      html = html
        .replace(/<title>.*?<\/title>/, `<title>${pageTitle}</title>`)
        .replace(
          /<meta name="description"[^>]*>/,
          `<meta name="description" content="${pageDesc.replace(/"/g, '&quot;')}" />`
        )
        .replace('</head>', `  <link rel="canonical" href="${base}${reqPath}" />\n  </head>`);

      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.send(html);
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Pomegranate 'n' Lime Cameroon running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
