import { WebsiteListing, PublicSettings, FAQItem, CustomInquiry, PurchaseOrder } from '../types';
import { safeFetchJson } from './api';

const STORAGE_KEYS = {
  LISTINGS: 'smart_developer_listings_v2',
  SETTINGS: 'smart_developer_settings_v2',
  FAQS: 'smart_developer_faqs_v2',
  CATEGORIES: 'smart_developer_categories_v2',
  INQUIRIES: 'smart_developer_inquiries_v2',
  ORDERS: 'smart_developer_orders_v2',
  ADMIN_TOKEN: 'smart_developer_admin_token'
};

export const INITIAL_PUBLIC_SETTINGS: PublicSettings = {
  businessEmail: 'smartbuy9@gmail.com',
  whatsappNumber: '+923098569707',
  whatsappEnabled: true,
  showStatistics: false,
  completedProjectsCount: 24,
  socialLinks: {
    github: '',
    linkedin: '',
    twitter: ''
  }
};

export const INITIAL_LISTINGS: WebsiteListing[] = [
  {
    id: 'web-1',
    title: 'Aura Luxe — High-End Minimalist E-Commerce Store',
    slug: 'aura-luxe-ecommerce',
    category: 'E-commerce Stores',
    shortDescription: 'Modern, high-converting luxury store with interactive shopping bag, smooth transitions, and Stripe-ready payment workflow.',
    fullDescription: 'Aura Luxe is an architectural, ultra-clean e-commerce web platform designed for luxury home goods, designer furniture, and curated fashion. Engineered with React 19, TypeScript, and responsive Tailwind layouts, this template includes a fast slide-out cart drawer, product variants, instant image zoom, and modular components ready for database integration.',
    priceUSD: 149,
    featured: true,
    published: true,
    thumbnail: '/assets/images/ecommerce_luxury_store_1792311614226.jpg',
    screenshots: [
      '/assets/images/ecommerce_luxury_store_1792311614226.jpg',
      '/assets/images/hero_showcase_dark_1792311614014.jpg'
    ],
    liveDemoUrl: '#demo/aura-luxe',
    sourceCodeAvailable: true,
    customizationAvailable: true,
    techStack: ['React 19', 'TypeScript', 'Tailwind CSS v4', 'Express API Ready', 'Stripe Schema Ready', 'Motion'],
    includedPages: ['Hero & Collections', 'Curated Product Grid', 'Quick View & Detail Modal', 'Slide-out Shopping Bag', 'Checkout Review', 'Brand Story & Journal'],
    responsiveSpecs: '100% fluid responsive across Mobile (375px+), Tablet, Desktop (1440px), and Ultra-wide screens.',
    whatYouReceive: [
      'Complete unminified source code (ZIP package)',
      'TypeScript interfaces and clean modular components',
      'Local setup guide and one-click deployment instructions',
      'Commercial license for client or personal use',
      '30 days direct developer email support'
    ],
    customizationServices: [
      { title: 'Brand Theme Customization & Logo Integration', priceUSD: 49 },
      { title: 'Payment Gateway Setup (Stripe/PayPal/Local)', priceUSD: 79 },
      { title: 'Full Production Deployment to Vercel/Cloud', priceUSD: 59 }
    ],
    demoType: 'ecommerce',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'web-2',
    title: 'Avant-Garde Estates — Architectural Luxury Real Estate',
    slug: 'avant-garde-estates',
    category: 'Real Estate Websites',
    shortDescription: 'Editorial real estate agency portal featuring luxury villas, immersive property listings, and lead capture inquiry forms.',
    fullDescription: 'Avant-Garde Estates delivers an international high-end luxury real estate experience. Built with fluid property search filters (location, price bracket, bedrooms, property types), interactive photo galleries, mortgage calculation modules, and high-retention client consultation inquiry forms.',
    priceUSD: 189,
    featured: true,
    published: true,
    thumbnail: '/assets/images/real_estate_luxury_web_1792311614353.jpg',
    screenshots: [
      '/assets/images/real_estate_luxury_web_1792311614353.jpg'
    ],
    liveDemoUrl: '#demo/avant-garde',
    sourceCodeAvailable: true,
    customizationAvailable: true,
    techStack: ['React 19', 'TypeScript', 'Tailwind CSS v4', 'Interactive Filters', 'Lead Form Handler'],
    includedPages: ['Hero Showcase with Live Search', 'Property Grid & Detail Modal', 'Location & Amenity Specs', 'Private Viewing Request Form', 'Agent Profile & Testimonials'],
    responsiveSpecs: 'Mobile-first navigation, fluid touch gallery viewer, optimized for high-DPI displays.',
    whatYouReceive: [
      'Complete clean source code with TypeScript types',
      'Sample property listings schema and image assets',
      'Step-by-step documentation for adding new listings',
      'Commercial usage rights for real estate clients',
      '30 days technical support'
    ],
    customizationServices: [
      { title: 'Custom Property Data Model & CMS Connection', priceUSD: 89 },
      { title: 'Interactive Map & Geocoding Integration', priceUSD: 99 }
    ],
    demoType: 'realestate',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'web-3',
    title: 'Void Archives — High-Fashion Streetwear Brand & Apparel',
    slug: 'void-archives-fashion',
    category: 'Clothing Brand Websites',
    shortDescription: 'Contemporary dark aesthetic apparel store with lookbook storytelling, size selector, and drop announcement system.',
    fullDescription: 'Void Archives is designed for modern streetwear labels, apparel drops, and avant-garde clothing designers. Features high-impact hero drop announcement banner, seasonal lookbook showcase, size variations with stock status, and rapid add-to-cart workflow.',
    priceUSD: 169,
    featured: true,
    published: true,
    thumbnail: '/assets/images/fashion_brand_website_1792311615530.jpg',
    screenshots: [
      '/assets/images/fashion_brand_website_1792311615530.jpg'
    ],
    liveDemoUrl: '#demo/void-archives',
    sourceCodeAvailable: true,
    customizationAvailable: true,
    techStack: ['React 19', 'TypeScript', 'Tailwind CSS v4', 'Dynamic Lookbook', 'Cart State Machine'],
    includedPages: ['Hero Drop Banner', 'Lookbook & Editorial View', 'Product Grid with Size Pill Pickers', 'Quick Cart Drawer', 'Brand Philosophy Page'],
    responsiveSpecs: 'Ultra-fast mobile touch interactions, sticky bottom CTA on mobile product view.',
    whatYouReceive: [
      'Full source code package with zero dependencies bloat',
      'Customizable color palette tokens and typography config',
      'Setup guide for local development and live hosting',
      'Unlimited commercial deployment license'
    ],
    customizationServices: [
      { title: 'Brand Aesthetic Restyling & Content Upload', priceUSD: 59 },
      { title: 'Inventory & Order Webhook Configuration', priceUSD: 89 }
    ],
    demoType: 'fashion',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'web-4',
    title: 'Aether Cloud — Enterprise SaaS Analytics & Developer Console',
    slug: 'aether-cloud-saas',
    category: 'SaaS and Web Applications',
    shortDescription: 'Dark-mode modern web app dashboard and marketing landing page with interactive telemetry charts and pricing tiers.',
    fullDescription: 'Aether Cloud provides a complete SaaS front-end foundation: from a high-converting marketing landing page with feature deep-dives and comparison tables to an authentic, interactive metrics dashboard with latency charts, active project trackers, and plan upgrades.',
    priceUSD: 199,
    featured: true,
    published: true,
    thumbnail: '/assets/images/saas_analytics_platform_1792311615607.jpg',
    screenshots: [
      '/assets/images/saas_analytics_platform_1792311615607.jpg',
      '/assets/images/hero_showcase_dark_1792311614014.jpg'
    ],
    liveDemoUrl: '#demo/aether-cloud',
    sourceCodeAvailable: true,
    customizationAvailable: true,
    techStack: ['React 19', 'TypeScript', 'Tailwind CSS v4', 'SVG Telemetry Charts', 'Theme & State Engine'],
    includedPages: ['Product Landing Page', 'Interactive Analytics Console', 'Query & Performance Monitor', 'Tiered Pricing Table', 'Documentation Layout'],
    responsiveSpecs: 'Collapsible sidebar on mobile/tablet, tabular numeric alignments for high-precision data display.',
    whatYouReceive: [
      'Complete React & Express source code',
      'Pre-configured dark-mode design system',
      'API schema and mock endpoint handlers',
      'Commercial SaaS project license'
    ],
    customizationServices: [
      { title: 'Custom Backend API Wiring & Authentication', priceUSD: 129 },
      { title: 'Database Migration & Docker Setup', priceUSD: 99 }
    ],
    demoType: 'saas',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'web-5',
    title: 'Lumina Botanical — Beauty, Skincare & Cosmetics Store',
    slug: 'lumina-botanical-beauty',
    category: 'Beauty and Cosmetics Stores',
    shortDescription: 'Clean, elegant beauty storefront with ingredient transparency tabs, skin routine quiz, and reviews gallery.',
    fullDescription: 'Designed for skincare, organic cosmetics, and wellness brands. Features clean soft aesthetics, product routine builder, ingredient breakdown accordions, customer reviews with image attachments, and mobile-optimized one-tap checkout flow.',
    priceUSD: 159,
    featured: false,
    published: true,
    thumbnail: '/assets/images/ecommerce_luxury_store_1792311614226.jpg',
    screenshots: [
      '/assets/images/ecommerce_luxury_store_1792311614226.jpg'
    ],
    liveDemoUrl: '#demo/lumina-botanical',
    sourceCodeAvailable: true,
    customizationAvailable: true,
    techStack: ['React 19', 'TypeScript', 'Tailwind CSS v4', 'Routine Selector', 'Customer Review Carousel'],
    includedPages: ['Hero & Routine Quiz', 'Best Sellers Grid', 'Ingredient Index', 'Cart & Promo Code Engine', 'About the Formulation'],
    responsiveSpecs: 'Tested across all iOS and Android mobile viewports.',
    whatYouReceive: [
      'Full uncompiled & compiled source code',
      'Design asset components and Tailwind config',
      'Comprehensive deployment documentation'
    ],
    customizationServices: [
      { title: 'Custom Brand Palette & Typography Adaptation', priceUSD: 49 }
    ],
    demoType: 'ecommerce',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'web-6',
    title: 'Monolith Studio — Creative Direction & Engineering Portfolio',
    slug: 'monolith-portfolio',
    category: 'Portfolio Websites',
    shortDescription: 'Bold editorial portfolio for senior developers, creative engineers, and digital design agencies.',
    fullDescription: 'An impactful personal portfolio and studio agency website. Boasts an interactive project showcase, live project inspect modals, client recommendation marquee, service pricing packages, and direct calendar consultation integration.',
    priceUSD: 129,
    featured: false,
    published: true,
    thumbnail: '/assets/images/hero_showcase_dark_1792311614014.jpg',
    screenshots: [
      '/assets/images/hero_showcase_dark_1792311614014.jpg'
    ],
    liveDemoUrl: '#demo/monolith-portfolio',
    sourceCodeAvailable: true,
    customizationAvailable: true,
    techStack: ['React 19', 'TypeScript', 'Tailwind CSS v4', 'Motion Animations', 'Project Lightbox'],
    includedPages: ['Hero with Dynamic Pitch', 'Curated Selected Works Grid', 'Interactive Project Lightbox', 'Service Packages & Pricing', 'Instant Contact Terminal'],
    responsiveSpecs: 'Smooth performance across 60Hz and 120Hz displays.',
    whatYouReceive: [
      'Complete unminified source code',
      'Resume & project data configuration JSON',
      'Hosting instructions for GitHub Pages / Vercel / Netlify'
    ],
    customizationServices: [
      { title: 'Complete Personal Branding & Bio Setup', priceUSD: 39 }
    ],
    demoType: 'portfolio',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const INITIAL_FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'What is included when I purchase a website source code package?',
    answer: 'You receive the complete, unminified source code repository (ZIP package) containing all frontend and backend components, TypeScript interfaces, Tailwind styling, clean project documentation, and step-by-step local setup and cloud deployment instructions.',
    category: 'Source Code'
  },
  {
    id: 'faq-2',
    question: 'Can I view a live demo before purchasing?',
    answer: 'Yes! Every website listing includes an interactive live demo preview with responsive device switching (Desktop, Tablet, Mobile) right here on Smart Developer, as well as a full-screen preview option.',
    category: 'Live Demos'
  },
  {
    id: 'faq-3',
    question: 'Do you provide customization services if I need custom features?',
    answer: 'Absolutely. You can request custom modifications, logo and branding changes, payment gateway integrations (Stripe, PayPal, local bank channels), or full custom web application development through our Custom Development form.',
    category: 'Customization'
  },
  {
    id: 'faq-4',
    question: 'What payment methods do you accept for international clients?',
    answer: 'We cater to clients in Pakistan, the USA, UK, Canada, Australia, and worldwide. We accept direct Bank Wire Transfers, Wise, Payoneer, Crypto (USDT), and official Card/Stripe invoices.',
    category: 'Payment Methods'
  },
  {
    id: 'faq-5',
    question: 'How fast do I receive the website code after submitting a purchase request?',
    answer: 'Once your purchase request is verified by our team (usually within 1 to 4 hours), your digital package download link and setup documentation are delivered directly to your verified email.',
    category: 'Delivery Time'
  },
  {
    id: 'faq-6',
    question: 'Do you help with hosting, domain connection, and launch?',
    answer: 'Yes, we provide deployment guides for leading cloud providers (Cloudflare, Vercel, Cloud Run, Netlify, VPS). You can also select our Full Deployment add-on service to have us handle domain DNS and production launch for you.',
    category: 'Hosting & Domains'
  },
  {
    id: 'faq-7',
    question: 'What kind of support is included?',
    answer: 'Every purchase includes 30 days of direct developer email support for setup assistance, bug fixes, and general questions regarding the codebase.',
    category: 'Support'
  }
];

export const INITIAL_CATEGORIES = [
  'E-commerce Stores',
  'Real Estate Websites',
  'Clothing Brand Websites',
  'Beauty and Cosmetics Stores',
  'Portfolio Websites',
  'Restaurant Websites',
  'Business Websites',
  'Landing Pages',
  'SaaS and Web Applications'
];

// Helper to broadcast changes between tabs/components
export function notifyDataChanged() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('smart_developer_data_changed'));
  }
}

// Client Storage Service with API sync & local fallback
export const storageService = {
  // Load public listings
  async getListings(): Promise<WebsiteListing[]> {
    // 1. Try API first
    const res = await safeFetchJson<{ success: boolean; listings: WebsiteListing[] }>('/api/listings');
    if (res.ok && res.data?.listings && Array.isArray(res.data.listings) && res.data.listings.length > 0) {
      localStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(res.data.listings));
      return res.data.listings;
    }

    // 2. Fall back to cached local storage
    const cached = localStorage.getItem(STORAGE_KEYS.LISTINGS);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        // invalid cache
      }
    }

    // 3. Fall back to initial listings
    localStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(INITIAL_LISTINGS));
    return INITIAL_LISTINGS;
  },

  // Load public settings
  async getSettings(): Promise<PublicSettings> {
    const res = await safeFetchJson<{ success: boolean; settings: PublicSettings }>('/api/settings');
    if (res.ok && res.data?.settings) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(res.data.settings));
      return res.data.settings;
    }

    const cached = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed && typeof parsed === 'object') {
          return { ...INITIAL_PUBLIC_SETTINGS, ...parsed };
        }
      } catch (e) {
        // ignore
      }
    }

    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_PUBLIC_SETTINGS));
    return INITIAL_PUBLIC_SETTINGS;
  },

  // Load FAQs
  async getFaqs(): Promise<FAQItem[]> {
    const res = await safeFetchJson<{ success: boolean; faqs: FAQItem[] }>('/api/faqs');
    if (res.ok && res.data?.faqs && Array.isArray(res.data.faqs) && res.data.faqs.length > 0) {
      localStorage.setItem(STORAGE_KEYS.FAQS, JSON.stringify(res.data.faqs));
      return res.data.faqs;
    }

    const cached = localStorage.getItem(STORAGE_KEYS.FAQS);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        // ignore
      }
    }

    localStorage.setItem(STORAGE_KEYS.FAQS, JSON.stringify(INITIAL_FAQS));
    return INITIAL_FAQS;
  },

  // Load Categories
  async getCategories(): Promise<string[]> {
    const res = await safeFetchJson<{ success: boolean; categories: string[] }>('/api/categories');
    if (res.ok && res.data?.categories && Array.isArray(res.data.categories) && res.data.categories.length > 0) {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(res.data.categories));
      return res.data.categories;
    }

    const cached = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        // ignore
      }
    }

    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
    return INITIAL_CATEGORIES;
  },

  // Save or Update Listing
  async saveListing(listing: Partial<WebsiteListing>, token?: string): Promise<WebsiteListing> {
    let savedListing: WebsiteListing | null = null;

    if (token) {
      const res = await safeFetchJson<{ success: boolean; listing: WebsiteListing }>('/api/admin/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(listing)
      });
      if (res.ok && res.data?.listing) {
        savedListing = res.data.listing;
      }
    }

    // Always update local cache for instant UI feedback and persistence
    const currentListings = await this.getListings();
    if (!savedListing) {
      const id = listing.id || `web-${Date.now()}`;
      savedListing = {
        id,
        title: listing.title || 'Untitled Website',
        slug: listing.slug || (listing.title ? listing.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : id),
        category: listing.category || 'Business Websites',
        shortDescription: listing.shortDescription || '',
        fullDescription: listing.fullDescription || '',
        priceUSD: Number(listing.priceUSD) || 99,
        featured: Boolean(listing.featured),
        published: listing.published !== false,
        thumbnail: listing.thumbnail || '/assets/images/hero_showcase_dark_1792311614014.jpg',
        screenshots: listing.screenshots || [],
        liveDemoUrl: listing.liveDemoUrl || '#demo',
        sourceCodeAvailable: listing.sourceCodeAvailable !== false,
        customizationAvailable: listing.customizationAvailable !== false,
        techStack: listing.techStack || ['React 19', 'Tailwind CSS v4'],
        includedPages: listing.includedPages || ['Home', 'About', 'Contact'],
        responsiveSpecs: listing.responsiveSpecs || '100% fluid responsive design',
        whatYouReceive: listing.whatYouReceive || ['Complete source code', 'Documentation', 'Support'],
        customizationServices: listing.customizationServices || [],
        demoType: (listing.demoType as any) || 'generic',
        createdAt: listing.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }

    const idx = currentListings.findIndex((l) => l.id === savedListing!.id);
    let updatedListings: WebsiteListing[];
    if (idx !== -1) {
      updatedListings = [...currentListings];
      updatedListings[idx] = savedListing;
    } else {
      updatedListings = [savedListing, ...currentListings];
    }

    localStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(updatedListings));
    notifyDataChanged();
    return savedListing;
  },

  // Delete Listing
  async deleteListing(id: string, token?: string): Promise<boolean> {
    if (token) {
      await safeFetchJson(`/api/admin/listings/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
    }

    const current = await this.getListings();
    const filtered = current.filter((l) => l.id !== id);
    localStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(filtered));
    notifyDataChanged();
    return true;
  }
};
