import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface WebsiteListing {
  id: string;
  title: string;
  slug: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  priceUSD: number;
  featured: boolean;
  published: boolean;
  thumbnail: string;
  screenshots: string[];
  liveDemoUrl: string;
  sourceCodeAvailable: boolean;
  customizationAvailable: boolean;
  techStack: string[];
  includedPages: string[];
  responsiveSpecs: string;
  whatYouReceive: string[];
  customizationServices: { title: string; priceUSD: number }[];
  demoType: 'ecommerce' | 'realestate' | 'fashion' | 'saas' | 'portfolio' | 'restaurant' | 'generic';
  createdAt: string;
  updatedAt: string;
}

export interface CustomInquiry {
  id: string;
  fullName: string;
  email: string;
  businessName: string;
  country: string;
  websiteType: string;
  requiredFeatures: string[];
  budgetRange: string;
  desiredCompletionDate: string;
  referenceUrl?: string;
  projectDescription: string;
  status: 'New' | 'In Review' | 'Quoted' | 'In Progress' | 'Completed' | 'Archived';
  adminNotes: string;
  createdAt: string;
}

export interface PurchaseOrder {
  orderNumber: string;
  websiteId: string;
  websiteTitle: string;
  amount: number;
  currency: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerCountry: string;
  licenseType: string;
  preferredPaymentMethod: string;
  customizationAddons: string[];
  customerNotes?: string;
  paymentStatus: 'Pending Verification' | 'Verified & Paid' | 'Rejected';
  deliveryStatus: 'Preparing Package' | 'Delivered' | 'On Hold';
  deliveryPackageNotes?: string;
  downloadLink?: string;
  createdAt: string;
}

export interface SystemSettings {
  businessEmail: string;
  whatsappNumber: string;
  whatsappEnabled: boolean;
  showStatistics: boolean;
  completedProjectsCount: number;
  socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
  adminPasswordHash: string;
  salt: string;
  sessionToken?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface DatabaseSchema {
  listings: WebsiteListing[];
  inquiries: CustomInquiry[];
  orders: PurchaseOrder[];
  faqs: FAQItem[];
  categories: string[];
  settings: SystemSettings;
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.resolve(DATA_DIR, 'database.json');

function hashPassword(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

const DEFAULT_SALT = 'smart_developer_secure_salt_2026';
// Default initial password: admin123 (can be changed anytime in Admin Settings)
const DEFAULT_HASH = hashPassword('admin123', DEFAULT_SALT);

const INITIAL_DB: DatabaseSchema = {
  settings: {
    businessEmail: 'smartbuy9@gmail.com',
    whatsappNumber: '+923001234567',
    whatsappEnabled: true,
    showStatistics: false, // Default hidden until genuine data configured
    completedProjectsCount: 24,
    socialLinks: {
      github: '',
      linkedin: '',
      twitter: ''
    },
    adminPasswordHash: DEFAULT_HASH,
    salt: DEFAULT_SALT
  },
  listings: [
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
      thumbnail: '/src/assets/images/ecommerce_luxury_store_1792311614226.jpg',
      screenshots: [
        '/src/assets/images/ecommerce_luxury_store_1792311614226.jpg',
        '/src/assets/images/hero_showcase_dark_1792311614014.jpg'
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
      thumbnail: '/src/assets/images/real_estate_luxury_web_1792311614353.jpg',
      screenshots: [
        '/src/assets/images/real_estate_luxury_web_1792311614353.jpg'
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
      thumbnail: '/src/assets/images/fashion_brand_website_1792311615530.jpg',
      screenshots: [
        '/src/assets/images/fashion_brand_website_1792311615530.jpg'
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
      thumbnail: '/src/assets/images/saas_analytics_platform_1792311615607.jpg',
      screenshots: [
        '/src/assets/images/saas_analytics_platform_1792311615607.jpg',
        '/src/assets/images/hero_showcase_dark_1792311614014.jpg'
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
      thumbnail: '/src/assets/images/ecommerce_luxury_store_1792311614226.jpg',
      screenshots: [
        '/src/assets/images/ecommerce_luxury_store_1792311614226.jpg'
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
      thumbnail: '/src/assets/images/hero_showcase_dark_1792311614014.jpg',
      screenshots: [
        '/src/assets/images/hero_showcase_dark_1792311614014.jpg'
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
  ],
  inquiries: [],
  orders: [],
  faqs: [
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
      answer: 'Yes, we provide deployment guides for leading cloud providers (Vercel, Cloud Run, Netlify, AWS, VPS). You can also select our Full Deployment add-on service to have us handle domain DNS and production launch for you.',
      category: 'Hosting & Domains'
    },
    {
      id: 'faq-7',
      question: 'What kind of support is included?',
      answer: 'Every purchase includes 30 days of direct developer email support for setup assistance, bug fixes, and general questions regarding the codebase.',
      category: 'Support'
    }
  ],
  categories: [
    'E-commerce Stores',
    'Real Estate Websites',
    'Clothing Brand Websites',
    'Beauty and Cosmetics Stores',
    'Portfolio Websites',
    'Restaurant Websites',
    'Business Websites',
    'Landing Pages',
    'SaaS and Web Applications'
  ]
};

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.load();
  }

  private load(): DatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        // Ensure all required fields exist
        return {
          ...INITIAL_DB,
          ...parsed,
          settings: { ...INITIAL_DB.settings, ...(parsed.settings || {}) },
          listings: Array.isArray(parsed.listings) && parsed.listings.length > 0 ? parsed.listings : INITIAL_DB.listings,
          faqs: Array.isArray(parsed.faqs) && parsed.faqs.length > 0 ? parsed.faqs : INITIAL_DB.faqs,
          categories: Array.isArray(parsed.categories) && parsed.categories.length > 0 ? parsed.categories : INITIAL_DB.categories,
          inquiries: Array.isArray(parsed.inquiries) ? parsed.inquiries : [],
          orders: Array.isArray(parsed.orders) ? parsed.orders : []
        };
      }
    } catch (err) {
      console.error('Error loading database, resetting to initial state:', err);
    }

    this.saveData(INITIAL_DB);
    return INITIAL_DB;
  }

  private saveData(data: DatabaseSchema): void {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error writing to database file:', err);
    }
  }

  private save(): void {
    this.saveData(this.data);
  }

  // Listings
  public getListings(onlyPublished = true): WebsiteListing[] {
    if (onlyPublished) {
      return this.data.listings.filter((l) => l.published);
    }
    return this.data.listings;
  }

  public getListingById(id: string): WebsiteListing | undefined {
    return this.data.listings.find((l) => l.id === id || l.slug === id);
  }

  public saveListing(listing: Partial<WebsiteListing> & { id?: string }): WebsiteListing {
    const now = new Date().toISOString();
    if (listing.id) {
      const idx = this.data.listings.findIndex((l) => l.id === listing.id);
      if (idx !== -1) {
        this.data.listings[idx] = {
          ...this.data.listings[idx],
          ...listing,
          updatedAt: now
        } as WebsiteListing;
        this.save();
        return this.data.listings[idx];
      }
    }

    const newListing: WebsiteListing = {
      id: listing.id || `web-${Date.now()}`,
      title: listing.title || 'Untitled Website',
      slug: (listing.title || 'untitled').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: listing.category || 'Business Websites',
      shortDescription: listing.shortDescription || '',
      fullDescription: listing.fullDescription || '',
      priceUSD: Number(listing.priceUSD) || 99,
      featured: Boolean(listing.featured),
      published: listing.published !== false,
      thumbnail: listing.thumbnail || '/src/assets/images/hero_showcase_dark_1792311614014.jpg',
      screenshots: listing.screenshots || [],
      liveDemoUrl: listing.liveDemoUrl || '#demo',
      sourceCodeAvailable: listing.sourceCodeAvailable !== false,
      customizationAvailable: listing.customizationAvailable !== false,
      techStack: listing.techStack || ['React', 'TypeScript', 'Tailwind CSS'],
      includedPages: listing.includedPages || ['Home'],
      responsiveSpecs: listing.responsiveSpecs || 'Responsive layout for all devices',
      whatYouReceive: listing.whatYouReceive || ['Full source code', 'Setup documentation'],
      customizationServices: listing.customizationServices || [],
      demoType: listing.demoType || 'generic',
      createdAt: now,
      updatedAt: now
    };

    this.data.listings.unshift(newListing);
    this.save();
    return newListing;
  }

  public deleteListing(id: string): boolean {
    const initialLen = this.data.listings.length;
    this.data.listings = this.data.listings.filter((l) => l.id !== id);
    if (this.data.listings.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  // Inquiries
  public getInquiries(): CustomInquiry[] {
    return this.data.inquiries;
  }

  public addInquiry(inquiry: Omit<CustomInquiry, 'id' | 'status' | 'adminNotes' | 'createdAt'>): CustomInquiry {
    const newInquiry: CustomInquiry = {
      ...inquiry,
      id: `INQ-${Math.floor(10000 + Math.random() * 90000)}`,
      status: 'New',
      adminNotes: '',
      createdAt: new Date().toISOString()
    };
    this.data.inquiries.unshift(newInquiry);
    this.save();
    return newInquiry;
  }

  public updateInquiryStatus(id: string, status: CustomInquiry['status'], adminNotes?: string): CustomInquiry | null {
    const item = this.data.inquiries.find((i) => i.id === id);
    if (!item) return null;
    item.status = status;
    if (adminNotes !== undefined) item.adminNotes = adminNotes;
    this.save();
    return item;
  }

  public deleteInquiry(id: string): boolean {
    const initialLen = this.data.inquiries.length;
    this.data.inquiries = this.data.inquiries.filter((i) => i.id !== id);
    if (this.data.inquiries.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  // Orders
  public getOrders(): PurchaseOrder[] {
    return this.data.orders;
  }

  public addOrder(order: Omit<PurchaseOrder, 'orderNumber' | 'paymentStatus' | 'deliveryStatus' | 'createdAt'>): PurchaseOrder {
    const year = new Date().getFullYear();
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const newOrder: PurchaseOrder = {
      ...order,
      orderNumber: `ORD-${year}-${randomCode}`,
      paymentStatus: 'Pending Verification',
      deliveryStatus: 'Preparing Package',
      createdAt: new Date().toISOString()
    };
    this.data.orders.unshift(newOrder);
    this.save();
    return newOrder;
  }

  public updateOrderStatus(
    orderNumber: string,
    updates: {
      paymentStatus?: PurchaseOrder['paymentStatus'];
      deliveryStatus?: PurchaseOrder['deliveryStatus'];
      deliveryPackageNotes?: string;
      downloadLink?: string;
    }
  ): PurchaseOrder | null {
    const item = this.data.orders.find((o) => o.orderNumber === orderNumber);
    if (!item) return null;
    if (updates.paymentStatus) item.paymentStatus = updates.paymentStatus;
    if (updates.deliveryStatus) item.deliveryStatus = updates.deliveryStatus;
    if (updates.deliveryPackageNotes !== undefined) item.deliveryPackageNotes = updates.deliveryPackageNotes;
    if (updates.downloadLink !== undefined) item.downloadLink = updates.downloadLink;
    this.save();
    return item;
  }

  // Settings
  public getPublicSettings() {
    return {
      businessEmail: this.data.settings.businessEmail,
      whatsappNumber: this.data.settings.whatsappNumber,
      whatsappEnabled: this.data.settings.whatsappEnabled,
      showStatistics: this.data.settings.showStatistics,
      completedProjectsCount: this.data.settings.completedProjectsCount,
      socialLinks: this.data.settings.socialLinks
    };
  }

  public getFullSettings(): SystemSettings {
    return this.data.settings;
  }

  public updateSettings(updates: Partial<SystemSettings>): SystemSettings {
    if (updates.adminPasswordHash && updates.salt) {
      this.data.settings.adminPasswordHash = updates.adminPasswordHash;
      this.data.settings.salt = updates.salt;
    }
    if (updates.businessEmail) this.data.settings.businessEmail = updates.businessEmail;
    if (updates.whatsappNumber !== undefined) this.data.settings.whatsappNumber = updates.whatsappNumber;
    if (updates.whatsappEnabled !== undefined) this.data.settings.whatsappEnabled = updates.whatsappEnabled;
    if (updates.showStatistics !== undefined) this.data.settings.showStatistics = updates.showStatistics;
    if (updates.completedProjectsCount !== undefined) this.data.settings.completedProjectsCount = updates.completedProjectsCount;
    if (updates.socialLinks) this.data.settings.socialLinks = updates.socialLinks;
    this.save();
    return this.data.settings;
  }

  // Auth
  public verifyPassword(password: string): boolean {
    const candidateHash = hashPassword(password, this.data.settings.salt);
    return candidateHash === this.data.settings.adminPasswordHash;
  }

  public changePassword(newPassword: string): void {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = hashPassword(newPassword, salt);
    this.data.settings.salt = salt;
    this.data.settings.adminPasswordHash = hash;
    this.save();
  }

  public generateSessionToken(): string {
    const token = crypto.randomBytes(32).toString('hex');
    this.data.settings.sessionToken = token;
    this.save();
    return token;
  }

  public validateSessionToken(token: string): boolean {
    if (!token || !this.data.settings.sessionToken) return false;
    return token === this.data.settings.sessionToken;
  }

  // FAQs
  public getFAQs(): FAQItem[] {
    return this.data.faqs;
  }

  public saveFAQ(faq: Partial<FAQItem> & { id?: string }): FAQItem {
    if (faq.id) {
      const idx = this.data.faqs.findIndex((f) => f.id === faq.id);
      if (idx !== -1) {
        this.data.faqs[idx] = { ...this.data.faqs[idx], ...faq } as FAQItem;
        this.save();
        return this.data.faqs[idx];
      }
    }
    const newFaq: FAQItem = {
      id: faq.id || `faq-${Date.now()}`,
      question: faq.question || 'New Question',
      answer: faq.answer || 'Answer',
      category: faq.category || 'General'
    };
    this.data.faqs.push(newFaq);
    this.save();
    return newFaq;
  }

  public deleteFAQ(id: string): boolean {
    const initialLen = this.data.faqs.length;
    this.data.faqs = this.data.faqs.filter((f) => f.id !== id);
    if (this.data.faqs.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  // Categories
  public getCategories(): string[] {
    const existingListingCategories = this.data.listings.map((l) => l.category);
    const set = new Set([...this.data.categories, ...existingListingCategories]);
    return Array.from(set).filter(Boolean);
  }

  public addCategory(name: string): string[] {
    const trimmed = name.trim();
    if (!trimmed) return this.getCategories();
    if (!this.data.categories.includes(trimmed)) {
      this.data.categories.push(trimmed);
      this.save();
    }
    return this.getCategories();
  }

  public deleteCategory(name: string): boolean {
    const initialLen = this.data.categories.length;
    this.data.categories = this.data.categories.filter((c) => c !== name);
    if (this.data.categories.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  // Authorized Admin Emails Check
  public isAuthorizedAdminEmail(email: string): boolean {
    if (!email) return false;
    const clean = email.toLowerCase().trim();
    const authorized = [
      'umairkamboh953@gmail.com',
      'smartbuy9@gmail.com',
      (this.data.settings.businessEmail || '').toLowerCase().trim()
    ].filter(Boolean);

    return authorized.includes(clean);
  }
}

export const db = new Database();
