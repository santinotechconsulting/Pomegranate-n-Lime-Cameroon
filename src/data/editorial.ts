export interface StorySectionData {
  slug: string;
  heading: string;
  subtitle: string;
  heroImage: string;
  footerImage?: string;
  paragraphs: string[];
}

export interface WorkStoryVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  reelUrl: string;
  duration: string;
}

export interface BlogArticle {
  id: string;
  title: string;
  publishedAt: string;
  readTime: string;
  tags: string[];
  headerImage: string;
  excerpt: string;
  paragraphs: string[];
}

export const STORY_SECTIONS: Record<string, StorySectionData> = {
  'our-story': {
    slug: 'our-story',
    heading: 'Our Story',
    subtitle: 'Reviving Handcrafted Courtyard Grandeur for Modern Cameroon & Global Tables',
    heroImage: '/uploads/img/1791631409305-264ac293.png',
    footerImage: '/uploads/img/1791631443715-e0adb612.png',
    paragraphs: [
      'When I set sail to this company, it was with a desire to bring back traditional elegance dipped in decadence. Ah! The allure of all things delectable and refined. That had always been the standard for centuries in our society, but somehow the age of machines slowly shrank the joy of all things handmade and handcrafted. That underlying richness of yore was replaced, and over time redefined, into simplicity. Grand wasn’t elegant anymore and affluence got the side eye.',
      'But what if I didn’t want to be simple? The fact is, some people can never be simple in taste. They like to self indulge and take profound joy in deriving elegance out of curated extravagance. When I entered stores in hopes of finding elegant goods I did love a lot of things, but more often than not, our rich and lush heritage was missing — that pride in handcrafted glory was gone.',
      'I wanted finesse in everything seen and unseen — why shouldn’t the napery under the crockery be as inspiring as the artistry on the crockery? After all, it is in my space and I have chosen it, so why should I choose the mundane? And so began my journey of reimagining aesthetics and finding a way of reintroducing them through art, literature, and architecture.',
      'Every culture in every era successfully achieved the pinnacle of style by Mastering the Art of Hosting. From royal Indian forts to the warm, generous reception rooms of Douala, Yaoundé, and the Grassfields of Cameroon, a perfect host doesn’t just put out sumptuous food — they put together their finest napery, crockery, cushions, flowers, and the best pieces they own.',
      'At Pomegranate ‘n’ Lime Cameroon, our Bonapriso and Bastos ateliers celebrate this timeless spirit of hospitality: bringing artisanal hand-embroidered linen table mats, runners, and dinner napkins to discerning Cameroon households and the global diaspora.',
    ],
  },
  'brand-story': {
    slug: 'brand-story',
    heading: 'Brand Story',
    subtitle: 'The Relish of Sweet with a Hint of Tart',
    heroImage: '/uploads/img/1791631346110-260c567b.png',
    footerImage: '/uploads/img/1791631400373-f4d21985.png',
    paragraphs: [
      'Pomegranate ‘n’ Lime is a window into our cultural past — a very well curated, distinguished and tasteful past. Through our brand we are hoping to lay out a route towards the all but forgotten grandeur of our cultures, both Eastern, African, and Western. We wish to share an experience that gratifies not just your discerning taste but your visual senses as well.',
      'To express the brand desire we chose the name Pomegranate ‘n’ Lime for its uniqueness — the relish of sweet with a hint of tart. Pomegranates have signified richness and abundance since the dawn of civilization. Beauty, good luck, and prosperity are woven into the very idea of the pomegranate fruit. Limes and citrus represent freshness, purity of soul, and the bittersweet vibrancy of life.',
      'Pomegranate and citrus blossoms have appeared in carvings, sculpture, tapestry, and exquisitely woven fabrics such as chintz, silk, linen, and chenille across great civilizations. The courtyard was the melting pot of society — appearances were cultivated, discernment was served, and sophistication was delicately sipped upon.',
      'Pomegranate ‘n’ Lime Cameroon invites you into these Courtyards of Grandeur to reacquaint ourselves with effortless aesthetics and elegant soirées across Douala, Yaoundé, Kribi, and beyond. Elegance is a choice — let each moment be picturesque.',
    ],
  },
  'product-story': {
    slug: 'product-story',
    heading: 'Product Story',
    subtitle: 'Narrative Craftsmanship Woven Frame by Frame',
    heroImage: '/uploads/img/1791631068372-31a91f2c.png',
    footerImage: '/uploads/img/1791631300245-3edaa409.png',
    paragraphs: [
      'If I wanted something simple then I would have reached for a glass of water. And for me, that is where simple ends. The rest of the choices we make should be an absolute delight! Every range has a theme woven around a story based on personal experiences.',
      'These stories pan out in front of you, weaving each magical tale frame by frame. Hence in most of the collections it was decided that we would keep each mat different — each a piece of art in itself, showcasing yet another frame of the same story. This has now become our signature style.',
      'The entire process begins with animated discussions over steaming Cameroonian Arabica coffee from the Western Highlands and design sketches spread across the studio table. Color palettes, custom-dyed 85% pure linen weaves, and myriad silk and metallic threads are selected so each motif sings through the fabric.',
      'Because every piece is hand-dyed and hand-embroidered by master artisans, subtle variations in thread tension and tone appear from one piece to another — making every set truly singular to your dining room.',
    ],
  },
};

export const WORK_STORY_VIDEOS: WorkStoryVideo[] = [
  {
    id: '6aca20d2c6526b0529d3445c',
    title: 'Life At Court | Royal Welcome',
    description:
      'Behind-the-scenes look at the hand-embroidery and courtyard table styling that brought Life At Court to life — inspired by royal hospitality and ceremonial feasts.',
    thumbnail: '/uploads/img/1792039819793-df22785e.png',
    reelUrl: 'https://www.instagram.com/reel/DeEqFaHRmFL/',
    duration: '0:48',
  },
  {
    id: '6ad1faa7f2f3384dc7b9a714',
    title: 'The Christmas Yard | Holiday Table Setting',
    description:
      'Setting an unforgettable festive dinner table in Bonapriso with our Light Blue Snowflakes Runner, Gnomes Motif, and Cream Hand-Embroidered Mats.',
    thumbnail: '/uploads/img/1792039896615-2d167322.png',
    reelUrl: 'https://www.instagram.com/reel/DedwQfIoZIO/',
    duration: '0:54',
  },
  {
    id: 'cameroon-atelier-craft',
    title: 'Douala & Yaoundé Hosting Atelier',
    description:
      'Curating linen place settings for intimate family brunches, diplomatic receptions, and weekend gatherings along Cameroon’s Atlantic coast.',
    thumbnail: '/uploads/img/1794217515211-36188aa5.jpg',
    reelUrl: 'https://www.instagram.com/pomegranate_n_lime/',
    duration: '1:12',
  },
];

export const BLOG_ARTICLES: BlogArticle[] = [
  {
    id: '6ae186e0c2fe166095457723',
    title: 'The Royal Courtyards',
    publishedAt: 'November 4, 2026',
    readTime: '4 min read',
    tags: ['royal', 'courtyards', 'luxuryhomelinen', 'embroiderednapkins'],
    headerImage: '/uploads/img/1793171172703-fc1b723e.jpg',
    excerpt:
      'My recent visit to the Amer Fort in Jaipur gave me a vivid glimpse into what life and ceremonial hosting in a Royal household looked like.',
    paragraphs: [
      'My recent visit to the Amer fort in Jaipur gave me a vivid glimpse into what life or a typical day in the Royal household looked like. Closing my eyes, I transported myself back and picked the year 1630. Standing in the Royal Courtyard I could see the hustle and bustle of attendants preparing chambers and ceremonial dining halls.',
      'One can imagine the feasts on festive days, and more importantly, the individual chosen to organise these occasions. The station came with heavy responsibilities. Kitchen entourages prepared delicacies to be presented in serveware of gold and silver, while attendants took immense care in selecting fine linen.',
      'Silk and velvet place mats lay beneath large serving platters, paired with heavily embroidered tray covers and exquisite wraps. Within the dining space were regal cushions set upon carpets, and each place setting featured delicately embroidered fine linen napkins.',
      'Across continents — from the historic courtyards of Jaipur to the ceremonial chefferies of West Cameroon and modern salons in Bonapriso and Bastos — true grandeur is always felt in the care we lavish on our guests at table.',
    ],
  },
  {
    id: 'cameroon-art-of-hosting',
    title: 'Mastering the Art of Hosting in Douala & Yaoundé',
    publishedAt: 'November 12, 2026',
    readTime: '3 min read',
    tags: ['cameroon', 'douala', 'yaounde', 'tablelinens', 'hosting'],
    headerImage: '/uploads/img/1793777837039-c30332f3.jpg',
    excerpt:
      'From sunlit Sunday lunches in Bonapriso to formal evening dinners in Bastos, discover how textured embroidered linen transforms Cameroonian hospitality.',
    paragraphs: [
      'In Cameroon, hospitality is never casual — it is an enduring art of warmth, abundance, and pride. When family and friends gather around a table, the setting itself signals how deeply the guests are cherished.',
      'Pairing our cream or light blue 85% linen mats with tropical botanicals, warm brass candlelight, and hand-painted porcelain creates a dining silhouette that honours both classic heritage and contemporary Central African elegance.',
      'Whether you are hosting an intimate four-person supper or a twelve-guest celebration, alternating motifs from The Christmas Yard, Equestrian, or Life At Court ensures every seat feels uniquely composed.',
    ],
  },
];

export const CAMEROON_FAQS = {
  categories: [
    { id: 'orders-shipping', name: 'Orders & Shipping (Cameroon & Global)' },
    { id: 'payments-momo', name: 'Mobile Money & Payments' },
    { id: 'orders-changes', name: 'Orders, Changes & Cancellations' },
    { id: 'returns-exchanges', name: 'Returns, Exchanges & Damaged Products' },
    { id: 'products-care', name: 'Products & Care' },
    { id: 'account-wishlist', name: 'Account & Wishlist' },
  ],
  items: [
    {
      id: 'faq-1',
      category: 'orders-shipping',
      question: 'How long does delivery take within Cameroon?',
      answer:
        'Express courier delivery in Douala (Bonapriso, Akwa, Bonanjo, Makepe) and Yaoundé (Bastos, Golf, Centre-Ville) takes 2–3 business days after dispatch. Regional deliveries to Bafoussam, Buea, Limbe, Bamenda, Kribi, Garoua, and Maroua take 3–7 business days. Orders above 150,000 FCFA qualify for complimentary delivery in Douala and Yaoundé.',
    },
    {
      id: 'faq-2',
      category: 'orders-shipping',
      question: 'How can I track my order?',
      answer:
        'Once your order is dispatched, we send your tracking code via SMS/WhatsApp (+237) and email. You can also view real-time status under "Orders" in your Account Dashboard or on our Track Order page.',
    },
    {
      id: 'faq-3',
      category: 'orders-shipping',
      question: 'Do you ship internationally from Cameroon?',
      answer:
        'Yes! We ship worldwide to Europe, North America, West & Central Africa, and the Middle East via DHL Express. Shipping rates are calculated at checkout based on your delivery address. Import duties and customs taxes imposed by the destination country are borne by the recipient.',
    },
    {
      id: 'faq-4',
      category: 'payments-momo',
      question: 'Can I pay with MTN Mobile Money or Orange Money?',
      answer:
        'Yes. We support MTN MoMo, Orange Money Cameroon, Visa/Mastercard international cards, and Cash on Delivery (for verified addresses in Douala and Yaoundé). You can view prices in FCFA (XAF), USD ($), or EUR (€).',
    },
    {
      id: 'faq-5',
      category: 'payments-momo',
      question: 'Will I receive an official Cameroon tax invoice?',
      answer:
        'Yes. Every confirmed order includes a downloadable PDF Tax Invoice in your Account -> Orders dashboard with our Cameroon SARL registration (NIU & RC) and itemized tax breakdown.',
    },
    {
      id: 'faq-6',
      category: 'orders-changes',
      question: 'Can I change my delivery address or cancel after placing an order?',
      answer:
        'You can request cancellation for unshipped orders directly from your Account -> Orders page by selecting "Cancel Order" and choosing a reason. Delivery addresses cannot be modified once an order enters dispatch.',
    },
    {
      id: 'faq-7',
      category: 'returns-exchanges',
      question: 'What is your return & exchange policy?',
      answer:
        'Products are eligible for exchange for quality or transit damage issues within 48 hours of delivery, provided original packaging and tags are intact and items have not been used or washed. Please share an unboxing photo or video via WhatsApp (+237 6 77 48 29 10) or support@pomegranatenlime.cm within 24 hours.',
    },
    {
      id: 'faq-8',
      category: 'products-care',
      question: 'How should I care for hand-embroidered linen mats and runners?',
      answer:
        'Dry clean only. Store table mats flat (never folded) and keep table runners rolled when not in use so the hand-embroidery and woven linen finish remain crisp and smooth.',
    },
    {
      id: 'faq-9',
      category: 'products-care',
      question: 'Why is there a minimum quantity of 4 for Table Mats?',
      answer:
        'Individual Table Mats require a minimum total of 4 mats per order — you may mix and match any motif across any collection to compose your own bespoke dining set.',
    },
    {
      id: 'faq-10',
      category: 'account-wishlist',
      question: 'How do I save favourites and manage Cameroon delivery addresses?',
      answer:
        'Click the heart icon on any product to save it to "My Wishlist" inside your Account Dashboard. Under "Addresses", you can save multiple Cameroon Quartiers (e.g. Home in Bonapriso, Office in Bastos) and set a Default address for one-click checkout.',
    },
  ],
};
