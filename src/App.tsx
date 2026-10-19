import React, { useState, useEffect } from 'react';
import { WebsiteListing, CurrencyCode, PublicSettings, FAQItem, PurchaseOrder } from './types';
import { Navbar } from './components/Navbar';
import { HeroShowcase } from './components/HeroShowcase';
import { StatsSection } from './components/StatsSection';
import { CategoriesSection } from './components/CategoriesSection';
import { WhyChooseUs } from './components/WhyChooseUs';
import { CustomDevSection } from './components/CustomDevSection';
import { HowItWorks } from './components/HowItWorks';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';
import { WebsiteCard } from './components/WebsiteCard';
import { WebsiteDetailView } from './components/WebsiteDetailView';
import { MarketplaceView } from './components/MarketplaceView';
import { CustomOrderForm } from './components/CustomOrderForm';
import { ContactSection } from './components/ContactSection';
import { AboutSection } from './components/AboutSection';
import { LiveDemoModal } from './components/LiveDemoModal';
import { PurchaseOrderModal } from './components/PurchaseOrderModal';
import { OrderStatusModal } from './components/OrderStatusModal';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { PolicyModal } from './components/PolicyModal';
import { AdminLoginPage } from './admin/AdminLoginPage';
import { AdminDashboard } from './admin/AdminDashboard';
import { ArrowRight, Loader2 } from 'lucide-react';
import { storageService } from './utils/storage';
import { safeFetchJson } from './utils/api';

export default function App() {
  // URL Route State: detects /admin, /admin/login, or public paths
  const [currentPath, setCurrentPath] = useState<string>(() => window.location.pathname);

  // In-app public views
  const [currentView, setCurrentView] = useState<'home' | 'marketplace' | 'categories' | 'custom' | 'about' | 'contact' | 'detail'>('home');
  const [selectedListing, setSelectedListing] = useState<WebsiteListing | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Currency
  const [currency, setCurrency] = useState<CurrencyCode>(() => {
    const saved = localStorage.getItem('smart_dev_currency');
    return (saved as CurrencyCode) || 'USD';
  });

  const handleCurrencyChange = (newCurr: CurrencyCode) => {
    setCurrency(newCurr);
    localStorage.setItem('smart_dev_currency', newCurr);
  };

  // Live data from backend database
  const [listings, setListings] = useState<WebsiteListing[]>([]);
  const [settings, setSettings] = useState<PublicSettings>({
    businessEmail: 'smartbuy9@gmail.com',
    whatsappNumber: '+923001234567',
    whatsappEnabled: true,
    showStatistics: false,
    completedProjectsCount: 24,
    socialLinks: {}
  });
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loadingInitial, setLoadingInitial] = useState(true);

  // Modals
  const [activeDemoListing, setActiveDemoListing] = useState<WebsiteListing | null>(null);
  const [activePurchaseListing, setActivePurchaseListing] = useState<WebsiteListing | null>(null);
  const [orderStatusOpen, setOrderStatusOpen] = useState(false);
  const [activePolicy, setActivePolicy] = useState<'terms' | 'privacy' | 'refund' | null>(null);

  // Admin Auth State
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    return localStorage.getItem('smart_developer_admin_token') || null;
  });

  // Listen to browser navigation popstate
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateToPath = (path: string) => {
    window.history.pushState(null, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Fetch initial public store data from persistent backend & cache
  const fetchPublicData = async () => {
    try {
      const [dataListings, dataSettings, dataFaqs] = await Promise.all([
        storageService.getListings(),
        storageService.getSettings(),
        storageService.getFaqs()
      ]);

      if (dataListings && Array.isArray(dataListings)) {
        setListings(dataListings);
      }
      if (dataSettings) {
        setSettings(dataSettings);
      }
      if (dataFaqs && Array.isArray(dataFaqs)) {
        setFaqs(dataFaqs);
      }
    } catch (err) {
      console.error('Error fetching public store data:', err);
    } finally {
      setLoadingInitial(false);
    }
  };

  useEffect(() => {
    fetchPublicData();
    window.addEventListener('smart_developer_data_changed', fetchPublicData);
    return () => {
      window.removeEventListener('smart_developer_data_changed', fetchPublicData);
    };
  }, []);

  // Check admin token validity against server
  useEffect(() => {
    if (adminToken) {
      safeFetchJson('/api/admin/check-auth', {
        headers: { Authorization: `Bearer ${adminToken}` }
      })
        .then((res) => {
          if (!res.ok && res.status === 401) {
            localStorage.removeItem('smart_developer_admin_token');
            setAdminToken(null);
          }
        })
        .catch(() => {});
    }
  }, [adminToken]);

  // Featured listings for homepage
  const featuredListings = listings.filter((l) => l.featured).slice(0, 3);
  const displayListings = featuredListings.length > 0 ? featuredListings : listings.slice(0, 3);

  // Public Navigation router
  const navigateTo = (view: string) => {
    if (currentPath !== '/') {
      window.history.pushState(null, '', '/');
      setCurrentPath('/');
    }
    if (view === 'home' || view === 'marketplace' || view === 'categories' || view === 'custom' || view === 'about' || view === 'contact') {
      setCurrentView(view as any);
      setSelectedListing(null);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenDetail = (listing: WebsiteListing) => {
    setSelectedListing(listing);
    setCurrentView('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
    setCurrentView('marketplace');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // -------------------------------------------------------------
  // ROUTE 1: /admin/login (Dedicated Admin Login Page)
  // -------------------------------------------------------------
  if (currentPath === '/admin/login') {
    // If already logged in, redirect directly to /admin
    if (adminToken) {
      navigateToPath('/admin');
      return null;
    }

    return (
      <AdminLoginPage
        onLoginSuccess={(token) => {
          setAdminToken(token);
          navigateToPath('/admin');
          fetchPublicData();
        }}
        onNavigateHome={() => navigateToPath('/')}
      />
    );
  }

  // -------------------------------------------------------------
  // ROUTE 2: /admin (Dedicated Admin Dashboard Page)
  // -------------------------------------------------------------
  if (currentPath === '/admin') {
    // If not authenticated, redirect to /admin/login
    if (!adminToken) {
      navigateToPath('/admin/login');
      return null;
    }

    return (
      <AdminDashboard
        token={adminToken}
        onLogout={() => {
          localStorage.removeItem('smart_developer_admin_token');
          setAdminToken(null);
          navigateToPath('/admin/login');
          fetchPublicData();
        }}
        onClose={() => {
          navigateToPath('/');
          fetchPublicData();
        }}
      />
    );
  }

  // -------------------------------------------------------------
  // ROUTE 3: PUBLIC WEBSITE (Preserves 100% of existing site)
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#08090E] text-slate-100 flex flex-col selection:bg-blue-600/30 selection:text-blue-200">
      {/* Top Bar Contract Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={navigateTo}
        currency={currency}
        onCurrencyChange={handleCurrencyChange}
        onOpenOrderStatus={() => setOrderStatusOpen(true)}
        onOpenAdminLogin={() => navigateToPath('/admin/login')}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {loadingInitial ? (
          <div className="py-32 flex flex-col items-center justify-center space-y-3 text-slate-400 text-xs">
            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
            <span>Loading Smart Developer Marketplace...</span>
          </div>
        ) : (
          <>
            {/* VIEW 1: HOMEPAGE */}
            {currentView === 'home' && (
              <div className="space-y-0">
                {/* Hero Showcase */}
                <HeroShowcase
                  onExplore={() => navigateTo('marketplace')}
                  onRequestCustom={() => navigateTo('custom')}
                />

                {/* Trust & Genuine Statistics (Only visible if enabled in settings) */}
                <StatsSection settings={settings} listings={listings} />

                {/* Featured Ready-Made Websites */}
                <section className="py-20 border-b border-white/[0.08] relative">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                      <div className="space-y-2">
                        <div className="text-xs font-semibold text-blue-400">Featured Releases</div>
                        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                          Turnkey Website Packages
                        </h2>
                      </div>
                      <button
                        onClick={() => navigateTo('marketplace')}
                        className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 self-start cursor-pointer"
                      >
                        <span>View all {listings.length} websites</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {displayListings.map((listing) => (
                        <WebsiteCard
                          key={listing.id}
                          listing={listing}
                          currency={currency}
                          onLiveDemo={(l) => setActiveDemoListing(l)}
                          onViewDetails={handleOpenDetail}
                          onBuy={(l) => setActivePurchaseListing(l)}
                        />
                      ))}
                    </div>
                  </div>
                </section>

                {/* Categories */}
                <CategoriesSection
                  onSelectCategory={handleCategorySelect}
                  listings={listings}
                />

                {/* Why Choose Smart Developer? */}
                <WhyChooseUs />

                {/* Custom Development Section */}
                <CustomDevSection onOpenCustomQuote={() => navigateTo('custom')} />

                {/* How It Works (5 steps) */}
                <HowItWorks />

                {/* Frequently Asked Questions */}
                <FAQSection faqs={faqs} />
              </div>
            )}

            {/* VIEW 2: EXPLORE WEBSITES / MARKETPLACE */}
            {currentView === 'marketplace' && (
              <MarketplaceView
                listings={listings}
                currency={currency}
                selectedCategory={selectedCategory}
                onSelectCategory={(cat) => setSelectedCategory(cat)}
                onLiveDemo={(l) => setActiveDemoListing(l)}
                onViewDetails={handleOpenDetail}
                onBuy={(l) => setActivePurchaseListing(l)}
                onRequestCustom={() => navigateTo('custom')}
              />
            )}

            {/* VIEW 3: CATEGORIES DEDICATED VIEW */}
            {currentView === 'categories' && (
              <div className="py-12">
                <CategoriesSection
                  onSelectCategory={handleCategorySelect}
                  listings={listings}
                />
              </div>
            )}

            {/* VIEW 4: CUSTOM WEBSITE ORDER FORM */}
            {currentView === 'custom' && (
              <CustomOrderForm
                onExploreMarketplace={() => navigateTo('marketplace')}
              />
            )}

            {/* VIEW 5: ABOUT THE DEVELOPER */}
            {currentView === 'about' && (
              <AboutSection
                onExplore={() => navigateTo('marketplace')}
                onRequestCustom={() => navigateTo('custom')}
              />
            )}

            {/* VIEW 6: CONTACT & COMMUNICATION */}
            {currentView === 'contact' && (
              <ContactSection settings={settings} />
            )}

            {/* VIEW 7: INDIVIDUAL WEBSITE DETAIL PAGE */}
            {currentView === 'detail' && selectedListing && (
              <WebsiteDetailView
                listing={selectedListing}
                allListings={listings}
                currency={currency}
                onBack={() => navigateTo('marketplace')}
                onLiveDemo={(l) => setActiveDemoListing(l)}
                onBuy={(l) => setActivePurchaseListing(l)}
                onSelectListing={handleOpenDetail}
                onRequestCustom={() => navigateTo('custom')}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <Footer
        settings={settings}
        onNavigate={navigateTo}
        onSelectCategory={handleCategorySelect}
        onOpenAdminLogin={() => {
          navigateToPath('/admin/login');
        }}
        onOpenPolicy={(p) => setActivePolicy(p)}
        onOpenOrderStatus={() => setOrderStatusOpen(true)}
      />

      {/* Floating WhatsApp Widget */}
      <FloatingWhatsApp
        settings={settings}
        hideWhenModalOpen={Boolean(activeDemoListing || activePurchaseListing || orderStatusOpen || activePolicy)}
      />

      {/* Live Demo Modal Viewer */}
      {activeDemoListing && (
        <LiveDemoModal
          listing={activeDemoListing}
          currency={currency}
          onClose={() => setActiveDemoListing(null)}
          onBuy={(l) => {
            setActiveDemoListing(null);
            setActivePurchaseListing(l);
          }}
        />
      )}

      {/* Purchase Order Modal */}
      {activePurchaseListing && (
        <PurchaseOrderModal
          listing={activePurchaseListing}
          currency={currency}
          onClose={() => setActivePurchaseListing(null)}
          onOrderCreated={() => {
            fetchPublicData();
          }}
        />
      )}

      {/* Order Status Checker Modal */}
      {orderStatusOpen && (
        <OrderStatusModal onClose={() => setOrderStatusOpen(false)} />
      )}

      {/* Legal & Policy Modals */}
      <PolicyModal
        type={activePolicy}
        onClose={() => setActivePolicy(null)}
      />
    </div>
  );
}
