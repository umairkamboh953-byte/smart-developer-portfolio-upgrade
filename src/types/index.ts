export type CurrencyCode = 'USD' | 'GBP' | 'EUR' | 'PKR' | 'CAD' | 'AUD';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  rateAgainstUSD: number;
}

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

export interface PublicSettings {
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
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}
