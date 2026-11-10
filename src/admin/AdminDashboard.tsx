import React, { useState, useEffect, useMemo } from 'react';
import {
  WebsiteListing,
  CustomInquiry,
  PurchaseOrder,
  FAQItem,
  PublicSettings,
  TeamMember,
  UserRole
} from '../types';
import {
  LayoutDashboard,
  Layers,
  Inbox,
  ShoppingBag,
  Settings,
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
  Eye,
  ExternalLink,
  ShieldCheck,
  LogOut,
  Save,
  Loader2,
  AlertCircle,
  HelpCircle,
  Clock,
  Phone,
  Mail,
  ArrowRight,
  FolderTree,
  FileQuestion,
  SlidersHorizontal,
  Search,
  Upload,
  CheckCircle2,
  Star,
  Image as ImageIcon,
  FileCode,
  FolderArchive,
  Download,
  Link as LinkIcon,
  Globe,
  Users,
  UserPlus,
  UserMinus,
  Crown,
  ShieldAlert,
  Lock
} from 'lucide-react';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { safeFetchJson } from '../utils/api';
import { storageService, notifyDataChanged } from '../utils/storage';

interface AdminDashboardProps {
  token: string;
  onLogout: () => void;
  onClose: () => void;
}

export type AdminTab =
  | 'overview'
  | 'websites'
  | 'add-website'
  | 'categories'
  | 'orders'
  | 'customer-inquiries'
  | 'custom-requests'
  | 'faqs'
  | 'team'
  | 'contact-settings';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  token,
  onLogout,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  const [listings, setListings] = useState<WebsiteListing[]>([]);
  const [inquiries, setInquiries] = useState<CustomInquiry[]>([]);
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [settings, setSettings] = useState<PublicSettings>({
    businessEmail: 'smartbuy9@gmail.com',
    whatsappNumber: '+923001234567',
    whatsappEnabled: true,
    showStatistics: false,
    completedProjectsCount: 24,
    socialLinks: {}
  });

  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Listing editor state
  const [editingListing, setEditingListing] = useState<Partial<WebsiteListing> | null>(null);
  const [showListingModal, setShowListingModal] = useState(false);
  const [savingListing, setSavingListing] = useState(false);
  const [pkrHelperInput, setPkrHelperInput] = useState('');
  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  const [galleryImages, setGalleryImages] = useState<{ url: string; name: string }[]>([]);
  const [showMediaPickerModal, setShowMediaPickerModal] = useState<false | 'thumbnail' | 'screenshot'>(false);

  // Categories state
  const [newCategoryName, setNewCategoryName] = useState('');

  // FAQ editor state
  const [editingFaq, setEditingFaq] = useState<Partial<FAQItem> | null>(null);

  // Role & Team Management
  const [userRole, setUserRole] = useState<UserRole>(() => {
    return (localStorage.getItem('smart_developer_admin_role') as UserRole) || 'owner';
  });
  const [userEmail, setUserEmail] = useState<string>(() => {
    return localStorage.getItem('smart_developer_admin_email') || 'smartdeveloper125@gmail.com';
  });
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberName, setNewMemberName] = useState('');
  const [teamLoading, setTeamLoading] = useState(false);
  const [teamActionError, setTeamActionError] = useState<string | null>(null);

  // Search & Filter States
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');
  const [inquirySearch, setInquirySearch] = useState('');

  // Password state
  const [newPassword, setNewPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const fetchTeamMembers = async () => {
    try {
      const res = await safeFetchJson<{
        success: boolean;
        teamMembers: TeamMember[];
        isOwner: boolean;
        currentRole: UserRole;
        currentEmail: string;
      }>('/api/admin/team', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok && res.data) {
        if (res.data.teamMembers) setTeamMembers(res.data.teamMembers);
        if (res.data.currentRole) {
          setUserRole(res.data.currentRole);
          localStorage.setItem('smart_developer_admin_role', res.data.currentRole);
        }
        if (res.data.currentEmail) {
          setUserEmail(res.data.currentEmail);
          localStorage.setItem('smart_developer_admin_email', res.data.currentEmail);
        }
      }
    } catch (err) {
      console.error('Error fetching team members:', err);
    }
  };

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      };

      fetchTeamMembers();

      const [resListings, resInquiries, resOrders, resSettings, resFaqs, resCats] = await Promise.all([
        safeFetchJson<{ success: boolean; listings: WebsiteListing[] }>('/api/admin/listings', { headers }),
        safeFetchJson<{ success: boolean; inquiries: CustomInquiry[] }>('/api/admin/inquiries', { headers }),
        safeFetchJson<{ success: boolean; orders: PurchaseOrder[] }>('/api/admin/orders', { headers }),
        safeFetchJson<{ success: boolean; settings: PublicSettings }>('/api/admin/settings', { headers }),
        safeFetchJson<{ success: boolean; faqs: FAQItem[] }>('/api/faqs'),
        safeFetchJson<{ success: boolean; categories: string[] }>('/api/categories')
      ]);

      if (resListings.status === 401 && !token.startsWith('token_') && !token.startsWith('google_')) {
        onLogout();
        return;
      }

      // Listings: use API or fallback to storageService
      if (resListings.ok && resListings.data?.listings) {
        setListings(resListings.data.listings);
      } else {
        const stored = await storageService.getListings();
        setListings(stored);
      }

      // Inquiries
      if (resInquiries.ok && resInquiries.data?.inquiries) {
        setInquiries(resInquiries.data.inquiries);
      }

      // Orders
      if (resOrders.ok && resOrders.data?.orders) {
        setOrders(resOrders.data.orders);
      }

      // Settings
      if (resSettings.ok && resSettings.data?.settings) {
        setSettings(resSettings.data.settings);
      } else {
        const storedSettings = await storageService.getSettings();
        setSettings(storedSettings);
      }

      // FAQs
      if (resFaqs.ok && resFaqs.data?.faqs) {
        setFaqs(resFaqs.data.faqs);
      } else {
        const storedFaqs = await storageService.getFaqs();
        setFaqs(storedFaqs);
      }

      // Categories
      if (resCats.ok && resCats.data?.categories) {
        setCategories(resCats.data.categories);
      } else {
        const storedCats = await storageService.getCategories();
        setCategories(storedCats);
      }
    } catch (err: any) {
      console.error('Error loading admin records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [token]);

  const showNotification = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  // Split Inquiries into Customer Messages vs Custom Website Requests
  const customerMessages = useMemo(
    () => inquiries.filter((i) => i.country === 'Direct Message' || i.websiteType === 'General Consultation'),
    [inquiries]
  );

  const customWebsiteRequests = useMemo(
    () => inquiries.filter((i) => i.country !== 'Direct Message' && i.websiteType !== 'General Consultation'),
    [inquiries]
  );

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (orderStatusFilter !== 'All' && o.paymentStatus !== orderStatusFilter) return false;
      if (orderSearch.trim()) {
        const q = orderSearch.toLowerCase();
        const matchNum = o.orderNumber.toLowerCase().includes(q);
        const matchBuyer = o.customerName.toLowerCase().includes(q) || o.customerEmail.toLowerCase().includes(q);
        const matchTitle = o.websiteTitle.toLowerCase().includes(q);
        return matchNum || matchBuyer || matchTitle;
      }
      return true;
    });
  }, [orders, orderStatusFilter, orderSearch]);

  // Image Upload handler (Base64 file reading + local and cloud persistence)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'thumbnail' | 'screenshot') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageUploadLoading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64Data = reader.result as string;
        let finalUrl = base64Data;

        const res = await safeFetchJson<{ success: boolean; url: string }>('/api/admin/upload-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ dataUrl: base64Data, filename: file.name })
        });

        if (res.ok && res.data?.url) {
          finalUrl = res.data.url;
        }

        if (editingListing) {
          if (field === 'thumbnail') {
            setEditingListing({ ...editingListing, thumbnail: finalUrl });
          } else {
            const currentScreenshots = editingListing.screenshots || [];
            setEditingListing({
              ...editingListing,
              screenshots: [...currentScreenshots, finalUrl]
            });
          }
          showNotification('Image uploaded successfully.');
        }
      } catch (err: any) {
        showNotification('Image upload error: ' + (err.message || 'Check connection'));
      } finally {
        setImageUploadLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };



  // Fetch gallery images
  const fetchGalleryImages = async () => {
    try {
      const res = await safeFetchJson<{ success: boolean; images: { url: string; name: string }[] }>('/api/admin/gallery-images', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok && res.data?.images && res.data.images.length > 0) {
        setGalleryImages(res.data.images);
      } else {
        throw new Error('No images from endpoint');
      }
    } catch {
      // Fallback preset demo images
      setGalleryImages([
        { url: '/assets/images/ecommerce_luxury_store_1792311614226.jpg', name: 'Aura Luxe E-Commerce' },
        { url: '/assets/images/saas_analytics_platform_1792311615607.jpg', name: 'Nexus Cloud SaaS' },
        { url: '/assets/images/real_estate_luxury_web_1792311614353.jpg', name: 'Elysian Estates Real Estate' },
        { url: '/assets/images/fashion_brand_website_1792311615530.jpg', name: 'Atelier Streetwear Fashion' },
        { url: '/assets/images/hero_showcase_dark_1792311614014.jpg', name: 'Smart Developer Hero Showcase' }
      ]);
    }
  };

  const handleSelectGalleryImage = (url: string) => {
    if (!editingListing) return;
    if (showMediaPickerModal === 'thumbnail') {
      setEditingListing({ ...editingListing, thumbnail: url });
      showNotification('Thumbnail updated from Media Library.');
    } else if (showMediaPickerModal === 'screenshot') {
      const currentScreenshots = editingListing.screenshots || [];
      setEditingListing({ ...editingListing, screenshots: [...currentScreenshots, url] });
      showNotification('Screenshot added from Media Library.');
    }
    setShowMediaPickerModal(false);
  };

  // -------------------------------------------------------------
  // LISTING HANDLERS
  // -------------------------------------------------------------
  const openNewListingModal = () => {
    setPkrHelperInput('');
    setEditingListing({
      title: '',
      category: categories[0] || 'E-commerce Stores',
      shortDescription: '',
      fullDescription: '',
      pricePKR: 25000,
      priceUSD: 90,
      featured: false,
      published: true,
      thumbnail: '/assets/images/hero_showcase_dark_1792311614014.jpg',
      screenshots: [],
      liveDemoUrl: '',
      sourceCodeAvailable: true,
      sourceCodeUrl: '',
      sourceCodeNotes: '',
      customizationAvailable: true,
      techStack: ['React', 'TypeScript', 'Tailwind CSS'],
      includedPages: ['Home', 'About', 'Contact'],
      responsiveSpecs: '100% fluid responsive design for all devices',
      whatYouReceive: ['Complete clean source code (ZIP)', 'Setup documentation', 'Direct developer support'],
      customizationServices: [{ title: 'Brand styling & Logo integration', priceUSD: 49 }],
      demoType: 'generic'
    });
    setShowListingModal(true);
  };

  const handleSaveListing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingListing) return;

    const trimmedTitle = (editingListing.title || '').trim();
    if (!trimmedTitle) {
      showNotification('Website ka Title enter karna zaroori hai.');
      return;
    }

    const pkr = Number(editingListing.pricePKR) || (editingListing.priceUSD ? Math.round(Number(editingListing.priceUSD) * 278.5) : 25000);
    const usd = Math.round(pkr / 278.5) || 90;
    const finalThumbnail = editingListing.thumbnail?.trim() || '/assets/images/hero_showcase_dark_1792311614014.jpg';
    const finalShortDesc = editingListing.shortDescription?.trim() || `Turnkey ${editingListing.category || 'ready-made'} website package with modern responsive design.`;

    const payload: Partial<WebsiteListing> = {
      ...editingListing,
      title: trimmedTitle,
      pricePKR: pkr,
      priceUSD: usd,
      thumbnail: finalThumbnail,
      shortDescription: finalShortDesc,
      liveDemoUrl: (editingListing.liveDemoUrl || '').trim(),
      sourceCodeUrl: (editingListing.sourceCodeUrl || '').trim(),
      published: editingListing.published !== false
    };

    setSavingListing(true);
    try {
      await storageService.saveListing(payload, token);
      showNotification('Website listing kamiyabi se save ho gayi aur live catalog me add ho gayi!');
      setShowListingModal(false);
      setEditingListing(null);
      if (activeTab === 'add-website') {
        setActiveTab('websites');
      }
      await fetchAdminData();
    } catch (err: any) {
      console.error('Save listing error:', err);
      showNotification('Failed to save listing: ' + (err.message || 'Error'));
    } finally {
      setSavingListing(false);
    }
  };

  const handleDeleteListing = async (id: string) => {
    if (userRole === 'member') {
      showNotification('Permission Denied: Team members have add-only access. Only Owner (smartdeveloper125@gmail.com) can delete listings.');
      return;
    }
    if (!window.confirm('Are you sure you want to delete this website listing? This action cannot be undone.')) {
      return;
    }
    try {
      await storageService.deleteListing(id, token);
      showNotification('Website listing deleted from catalog.');
      fetchAdminData();
    } catch (err: any) {
      showNotification('Delete error: ' + (err.message || 'Error'));
    }
  };

  const handleTogglePublish = async (listing: WebsiteListing) => {
    try {
      await storageService.saveListing({
        ...listing,
        published: !listing.published
      }, token);
      showNotification(`Website ${!listing.published ? 'published' : 'unpublished'}.`);
      fetchAdminData();
    } catch (err: any) {
      showNotification('Toggle error: ' + (err.message || 'Error'));
    }
  };

  // -------------------------------------------------------------
  // CATEGORIES HANDLERS
  // -------------------------------------------------------------
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = newCategoryName.trim();
    if (!name) return;

    try {
      const res = await safeFetchJson<{ success: boolean; categories: string[] }>('/api/admin/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name })
      });

      if (res.ok && res.data?.categories) {
        setCategories(res.data.categories);
      } else {
        const next = Array.from(new Set([...categories, name]));
        setCategories(next);
      }
      setNewCategoryName('');
      showNotification('Category added successfully.');
      notifyDataChanged();
    } catch (err: any) {
      showNotification('Add category error: ' + (err.message || 'Error'));
    }
  };

  const handleDeleteCategory = async (catName: string) => {
    if (userRole === 'member') {
      showNotification('Permission Denied: Team members cannot delete categories. Only Owner (smartdeveloper125@gmail.com) can delete.');
      return;
    }
    if (!window.confirm(`Are you sure you want to delete category "${catName}"?`)) {
      return;
    }
    try {
      const res = await safeFetchJson<{ success: boolean; categories: string[] }>(
        `/api/admin/categories/${encodeURIComponent(catName)}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      if (res.ok && res.data?.categories) {
        setCategories(res.data.categories);
      } else {
        setCategories(categories.filter((c) => c !== catName));
      }
      showNotification('Category deleted.');
      notifyDataChanged();
    } catch (err: any) {
      showNotification('Delete category error: ' + (err.message || 'Error'));
    }
  };

  // -------------------------------------------------------------
  // INQUIRY HANDLERS
  // -------------------------------------------------------------
  const handleUpdateInquiryStatus = async (id: string, status: CustomInquiry['status'], adminNotes?: string) => {
    try {
      await safeFetchJson(`/api/admin/inquiries/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status, adminNotes })
      });
      // Update local state immediately
      setInquiries((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status, adminNotes: adminNotes ?? item.adminNotes } : item))
      );
      showNotification('Inquiry status updated.');
    } catch (err: any) {
      showNotification('Update error: ' + (err.message || 'Error'));
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    if (userRole === 'member') {
      showNotification('Permission Denied: Team members cannot delete inquiries. Only Owner can delete.');
      return;
    }
    if (!window.confirm('Are you sure you want to delete this customer inquiry?')) {
      return;
    }
    try {
      await safeFetchJson(`/api/admin/inquiries/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      setInquiries((prev) => prev.filter((i) => i.id !== id));
      showNotification('Inquiry deleted.');
    } catch (err: any) {
      showNotification('Delete inquiry error: ' + (err.message || 'Error'));
    }
  };

  // -------------------------------------------------------------
  // ORDER HANDLERS
  // -------------------------------------------------------------
  const handleUpdateOrder = async (
    orderNumber: string,
    updates: {
      paymentStatus?: PurchaseOrder['paymentStatus'];
      deliveryStatus?: PurchaseOrder['deliveryStatus'];
      downloadLink?: string;
      deliveryPackageNotes?: string;
    }
  ) => {
    try {
      await safeFetchJson(`/api/admin/orders/${orderNumber}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });
      setOrders((prev) =>
        prev.map((o) => (o.orderNumber === orderNumber ? { ...o, ...updates } : o))
      );
      showNotification(`Order ${orderNumber} updated.`);
    } catch (err: any) {
      showNotification('Update order error: ' + (err.message || 'Error'));
    }
  };

  // -------------------------------------------------------------
  // SETTINGS HANDLERS
  // -------------------------------------------------------------
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await safeFetchJson('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });
      localStorage.setItem('smart_developer_settings_v2', JSON.stringify(settings));
      showNotification('Contact and platform settings saved.');
      notifyDataChanged();
      fetchAdminData();
    } catch (err: any) {
      showNotification('Settings save error: ' + (err.message || 'Error'));
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      showNotification('Password must be at least 6 characters long.');
      return;
    }

    try {
      const res = await safeFetchJson('/api/admin/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ newPassword })
      });
      if (res.ok) {
        setPasswordSuccess(true);
        setNewPassword('');
        showNotification('Master administrator password updated.');
        setTimeout(() => setPasswordSuccess(false), 3000);
      } else {
        showNotification(res.error || 'Failed to update password');
      }
    } catch (err: any) {
      showNotification('Change password error: ' + (err.message || 'Error'));
    }
  };

  // FAQs
  const handleSaveFAQ = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFaq || !editingFaq.question || !editingFaq.answer) return;

    try {
      const res = await safeFetchJson<{ success: boolean; faq: FAQItem }>('/api/admin/faqs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editingFaq)
      });
      if (res.ok && res.data?.faq) {
        const savedFaq = res.data.faq;
        setFaqs((prev) => {
          const idx = prev.findIndex((f) => f.id === savedFaq.id);
          if (idx !== -1) {
            const next = [...prev];
            next[idx] = savedFaq;
            return next;
          }
          return [...prev, savedFaq];
        });
      }
      showNotification('FAQ saved.');
      setEditingFaq(null);
      notifyDataChanged();
      fetchAdminData();
    } catch (err: any) {
      showNotification('FAQ save error: ' + (err.message || 'Error'));
    }
  };

  const handleDeleteFAQ = async (id: string) => {
    if (userRole === 'member') {
      showNotification('Permission Denied: Team members cannot delete FAQs. Only Owner can delete.');
      return;
    }
    if (!window.confirm('Are you sure you want to delete this FAQ?')) {
      return;
    }
    try {
      await safeFetchJson(`/api/admin/faqs/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      setFaqs((prev) => prev.filter((f) => f.id !== id));
      showNotification('FAQ deleted.');
      notifyDataChanged();
    } catch (err: any) {
      showNotification('Delete FAQ error: ' + (err.message || 'Error'));
    }
  };

  // -------------------------------------------------------------
  // TEAM MANAGEMENT HANDLERS (OWNER ONLY)
  // -------------------------------------------------------------
  const handleAddTeamMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userRole === 'member') {
      showNotification('Permission Denied: Only Owner (smartdeveloper125@gmail.com) can add team members.');
      return;
    }
    const clean = newMemberEmail.trim().toLowerCase();
    if (!clean || !clean.includes('@')) {
      setTeamActionError('Please enter a valid Google email address.');
      return;
    }

    setTeamLoading(true);
    setTeamActionError(null);
    try {
      const res = await safeFetchJson<{ success: boolean; member: TeamMember; error?: string; message?: string }>('/api/admin/team', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          email: clean,
          name: newMemberName.trim()
        })
      });

      if (res.ok && res.data?.member) {
        showNotification(res.data.message || `Access granted to ${clean}`);
        setNewMemberEmail('');
        setNewMemberName('');
        fetchTeamMembers();
      } else {
        setTeamActionError(res.error || 'Failed to add team member');
        showNotification(res.error || 'Failed to add team member');
      }
    } catch (err: any) {
      setTeamActionError(err.message || 'Error adding team member');
      showNotification('Error: ' + (err.message || 'Failed'));
    } finally {
      setTeamLoading(false);
    }
  };

  const handleRemoveTeamMember = async (id: string, email: string) => {
    if (userRole === 'member') {
      showNotification('Permission Denied: Only Owner can remove team members.');
      return;
    }
    if (!window.confirm(`Are you sure you want to revoke admin panel access for "${email}"?`)) {
      return;
    }

    setTeamLoading(true);
    try {
      const res = await safeFetchJson<{ success: boolean; error?: string; message?: string }>(`/api/admin/team/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        showNotification(`Access revoked for ${email}`);
        fetchTeamMembers();
      } else {
        showNotification(res.error || 'Failed to revoke access');
      }
    } catch (err: any) {
      showNotification('Error revoking access: ' + (err.message || 'Failed'));
    } finally {
      setTeamLoading(false);
    }
  };

  // Summary Metrics
  const totalPublishedWebsites = listings.filter((l) => l.published).length;
  const pendingInquiriesCount = inquiries.filter((i) => i.status === 'New').length;
  const totalOrdersCount = orders.length;
  const pendingPaymentVerifications = orders.filter((o) => o.paymentStatus === 'Pending Verification').length;

  return (
    <div className="min-h-screen bg-[#07080d] text-slate-100 flex flex-col font-sans">
      {/* Top Bar Header */}
      <header className="h-16 border-b border-white/10 bg-[#0c0f1c] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center font-bold text-white text-xs shadow-md shadow-blue-500/20">
            SD
          </div>
          <div>
            <span className="font-extrabold text-white text-sm tracking-tight">Smart Developer</span>
            <span className="text-[11px] text-blue-400 block font-mono">Master Administrator Portal (/admin)</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* User Role & Email Badge */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs">
            {userRole === 'owner' ? (
              <span className="flex items-center gap-1.5 text-amber-300 font-bold bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-lg text-[11px]">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>Owner (Full Access)</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-blue-300 font-bold bg-blue-500/15 border border-blue-500/30 px-2 py-0.5 rounded-lg text-[11px]">
                <Users className="w-3.5 h-3.5 text-blue-400" />
                <span>Team Member (Add-Only)</span>
              </span>
            )}
            <span className="text-slate-400 font-mono text-[11px] truncate max-w-[200px]" title={userEmail}>
              {userEmail}
            </span>
          </div>

          {statusMessage && (
            <span className="hidden sm:inline-flex text-xs text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-800 animate-in fade-in">
              {statusMessage}
            </span>
          )}

          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">View Public Website</span>
          </button>

          <button
            onClick={onLogout}
            className="px-3 py-1.5 text-xs text-rose-300 hover:text-white bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/40 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Admin Workspace with Sidebar */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Exact Sidebar Navigation Requested by User */}
        <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-white/10 bg-[#090c17] p-3 sm:p-4 space-y-1 shrink-0">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'overview' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('websites')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'websites' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Layers className="w-4 h-4" />
              <span>Manage Websites</span>
            </div>
            <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded font-mono">
              {listings.length}
            </span>
          </button>

          <button
            onClick={openNewListingModal}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-blue-400 hover:text-blue-300 hover:bg-blue-950/30 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Website</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'categories' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <FolderTree className="w-4 h-4" />
              <span>Categories</span>
            </div>
            <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded font-mono">
              {categories.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'orders' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-4 h-4" />
              <span>Manage Orders</span>
            </div>
            {pendingPaymentVerifications > 0 && (
              <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded font-mono font-bold">
                {pendingPaymentVerifications}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('customer-inquiries')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'customer-inquiries' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Inbox className="w-4 h-4" />
              <span>Customer Inquiries</span>
            </div>
            <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded font-mono">
              {customerMessages.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('custom-requests')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'custom-requests' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <FileQuestion className="w-4 h-4" />
              <span>Custom Website Requests</span>
            </div>
            <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded font-mono">
              {customWebsiteRequests.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('faqs')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'faqs' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <HelpCircle className="w-4 h-4" />
              <span>Manage FAQs</span>
            </div>
            <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded font-mono">
              {faqs.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('team')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'team' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Team Members</span>
            </div>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono font-bold">
              {teamMembers.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('contact-settings')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'contact-settings' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Contact Settings</span>
          </button>

          <div className="pt-4 border-t border-white/5">
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/30 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Content Pane */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-24 text-slate-400 text-xs">
              <Loader2 className="w-6 h-6 animate-spin mr-2.5 text-blue-500" />
              <span>Connecting to persistent database records...</span>
            </div>
          ) : (
            <>
              {/* 1. DASHBOARD OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-8 animate-in fade-in duration-200">
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white">
                      Dashboard Overview
                    </h1>
                    <p className="text-xs text-slate-400">
                      Real persistent database state for Smart Developer marketplace and client orders.
                    </p>
                  </div>

                  {/* Summary Cards: Actual Database Values */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-5 rounded-2xl bg-[#0d101e] border border-white/10 space-y-1">
                      <span className="text-xs text-slate-400">Total Published Websites</span>
                      <div className="text-3xl font-extrabold text-white font-mono tabular-nums">
                        {totalPublishedWebsites}
                      </div>
                      <span className="text-[11px] text-blue-400">
                        {listings.length} total catalog packages
                      </span>
                    </div>

                    <div className="p-5 rounded-2xl bg-[#0d101e] border border-white/10 space-y-1">
                      <span className="text-xs text-slate-400">Pending Inquiries</span>
                      <div className="text-3xl font-extrabold text-white font-mono tabular-nums">
                        {pendingInquiriesCount}
                      </div>
                      <span className="text-[11px] text-emerald-400">
                        Awaiting initial response
                      </span>
                    </div>

                    <div className="p-5 rounded-2xl bg-[#0d101e] border border-white/10 space-y-1">
                      <span className="text-xs text-slate-400">Total Orders</span>
                      <div className="text-3xl font-extrabold text-white font-mono tabular-nums">
                        {totalOrdersCount}
                      </div>
                      <span className="text-[11px] text-indigo-400">
                        Purchase requests registered
                      </span>
                    </div>

                    <div className="p-5 rounded-2xl bg-[#0d101e] border border-white/10 space-y-1">
                      <span className="text-xs text-slate-400">Pending Payment Verifications</span>
                      <div className="text-3xl font-extrabold text-white font-mono tabular-nums text-amber-400">
                        {pendingPaymentVerifications}
                      </div>
                      <span className="text-[11px] text-amber-300">
                        Require admin approval
                      </span>
                    </div>
                  </div>

                  {/* Recent Activity Dual Columns */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Orders Overview */}
                    <div className="p-6 rounded-2xl bg-[#0d101e] border border-white/10 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-white">Recent Purchase Orders</h3>
                        <button
                          onClick={() => setActiveTab('orders')}
                          className="text-xs text-blue-400 hover:text-blue-300"
                        >
                          View All ({orders.length}) →
                        </button>
                      </div>

                      {orders.length === 0 ? (
                        <div className="py-8 text-center text-xs text-slate-500">
                          No orders registered yet.
                        </div>
                      ) : (
                        <div className="space-y-2.5">
                          {orders.slice(0, 4).map((o) => (
                            <div
                              key={o.orderNumber}
                              className="p-3 bg-[#121626] border border-white/5 rounded-xl flex items-center justify-between text-xs"
                            >
                              <div>
                                <span className="font-mono text-emerald-400 font-semibold">{o.orderNumber}</span>
                                <div className="text-white font-medium truncate max-w-xs">{o.websiteTitle}</div>
                                <div className="text-[11px] text-slate-400">{o.customerName} ({o.customerCountry})</div>
                              </div>
                              <div className="text-right">
                                <span className="font-mono font-bold text-white">${o.amount}</span>
                                <span className={`block text-[10px] font-semibold ${
                                  o.paymentStatus === 'Verified & Paid' ? 'text-emerald-400' : 'text-amber-400'
                                }`}>
                                  {o.paymentStatus}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Recent Custom Requests Overview */}
                    <div className="p-6 rounded-2xl bg-[#0d101e] border border-white/10 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-white">Recent Custom Website Requests</h3>
                        <button
                          onClick={() => setActiveTab('custom-requests')}
                          className="text-xs text-blue-400 hover:text-blue-300"
                        >
                          View All ({customWebsiteRequests.length}) →
                        </button>
                      </div>

                      {customWebsiteRequests.length === 0 ? (
                        <div className="py-8 text-center text-xs text-slate-500">
                          No custom project requests logged yet.
                        </div>
                      ) : (
                        <div className="space-y-2.5">
                          {customWebsiteRequests.slice(0, 4).map((r) => (
                            <div
                              key={r.id}
                              className="p-3 bg-[#121626] border border-white/5 rounded-xl flex items-center justify-between text-xs"
                            >
                              <div>
                                <span className="font-mono text-blue-400 font-semibold">{r.id}</span>
                                <div className="text-white font-medium">{r.fullName} · {r.businessName}</div>
                                <div className="text-[11px] text-slate-400">{r.websiteType} ({r.country})</div>
                              </div>
                              <div className="text-right">
                                <span className="text-[11px] font-mono text-blue-300 block">{r.budgetRange}</span>
                                <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-slate-300">
                                  {r.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* 2. MANAGE WEBSITES */}
              {activeTab === 'websites' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h1 className="text-2xl font-bold tracking-tight text-white">Manage Websites</h1>
                      <p className="text-xs text-slate-400">
                        Create, edit, delete, publish/unpublish, and feature website packages in your live marketplace.
                      </p>
                    </div>

                    <button
                      onClick={openNewListingModal}
                      className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 self-start cursor-pointer shadow-md transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New Website</span>
                    </button>
                  </div>

                  {/* Listings Table */}
                  <div className="rounded-2xl border border-white/10 bg-[#0d101e] overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#121626] text-slate-400 border-b border-white/10 uppercase tracking-wider text-[11px]">
                          <tr>
                            <th className="p-4">Thumbnail</th>
                            <th className="p-4">Title & Slug</th>
                            <th className="p-4">Category</th>
                            <th className="p-4">Price (PKR)</th>
                            <th className="p-4">Featured</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {listings.map((l) => (
                            <tr key={l.id} className="hover:bg-white/[0.02] transition-colors">
                              <td className="p-4">
                                  <div className="w-14 h-10 rounded-lg overflow-hidden bg-slate-900 border border-white/10">
                                    <ImageWithFallback
                                      src={l.thumbnail}
                                      alt={l.title}
                                      category={l.category}
                                      title={l.title}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                              </td>
                              <td className="p-4 max-w-xs">
                                <span className="font-semibold text-white block truncate">{l.title}</span>
                                <span className="text-[11px] text-slate-500 font-mono">{l.slug}</span>
                              </td>
                              <td className="p-4 text-slate-300">{l.category}</td>
                              <td className="p-4 font-mono font-bold text-emerald-400">
                                ₨ {(l.pricePKR || Math.round(l.priceUSD * 278.5)).toLocaleString()}
                              </td>
                              <td className="p-4">
                                {l.featured ? (
                                  <span className="text-amber-400 flex items-center gap-1 text-[11px]">
                                    <Star className="w-3.5 h-3.5 fill-amber-400" /> Featured
                                  </span>
                                ) : (
                                  <span className="text-slate-500 text-[11px]">Standard</span>
                                )}
                              </td>
                              <td className="p-4">
                                <button
                                  onClick={() => handleTogglePublish(l)}
                                  className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors cursor-pointer ${
                                    l.published
                                      ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800'
                                      : 'bg-slate-800 text-slate-400 hover:text-white'
                                  }`}
                                  title="Click to toggle publish"
                                >
                                  {l.published ? 'Published' : 'Draft / Hidden'}
                                </button>
                              </td>
                              <td className="p-4 text-right space-x-2">
                                <button
                                  onClick={() => {
                                    const pkrVal = l.pricePKR || Math.round((Number(l.priceUSD) || 99) * 278.5);
                                    setEditingListing({
                                      ...l,
                                      pricePKR: pkrVal,
                                      priceUSD: l.priceUSD || Math.round(pkrVal / 278.5)
                                    });
                                    setShowListingModal(true);
                                  }}
                                  className="p-1.5 text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                                  title="Edit Website"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                {userRole === 'owner' ? (
                                  <button
                                    onClick={() => handleDeleteListing(l.id)}
                                    className="p-1.5 text-rose-400 hover:text-rose-200 bg-rose-950/40 hover:bg-rose-900/60 rounded-lg transition-colors cursor-pointer"
                                    title="Delete Website"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleDeleteListing(l.id)}
                                    className="p-1.5 text-slate-500 hover:text-slate-400 bg-white/5 rounded-lg transition-colors cursor-not-allowed opacity-60"
                                    title="Delete restricted: Team members cannot delete listings (Owner only)"
                                  >
                                    <Lock className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. CATEGORIES MANAGEMENT */}
              {activeTab === 'categories' && (
                <div className="space-y-6 animate-in fade-in duration-200 max-w-4xl">
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white">Categories Management</h1>
                    <p className="text-xs text-slate-400">
                      Organize your website catalog into business industries and marketplace sections.
                    </p>
                  </div>

                  {/* Add Category Form */}
                  <form
                    onSubmit={handleAddCategory}
                    className="p-5 rounded-2xl border border-white/10 bg-[#0d101e] flex gap-3"
                  >
                    <input
                      type="text"
                      required
                      placeholder="Enter new category name (e.g. AI SaaS Apps, Travel Agencies)..."
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      className="flex-1 px-4 py-2.5 bg-[#141829] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Category</span>
                    </button>
                  </form>

                  {/* Categories Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {categories.map((cat) => {
                      const count = listings.filter((l) => l.category === cat).length;
                      return (
                        <div
                          key={cat}
                          className="p-4 rounded-xl border border-white/10 bg-[#0d101e] flex items-center justify-between text-xs"
                        >
                          <div>
                            <span className="font-semibold text-white block">{cat}</span>
                            <span className="text-[11px] text-slate-400 font-mono">
                              {count} website{count === 1 ? '' : 's'} assigned
                            </span>
                          </div>
                          {userRole === 'owner' ? (
                            <button
                              onClick={() => handleDeleteCategory(cat)}
                              className="p-1.5 text-rose-400 hover:text-white bg-rose-950/30 hover:bg-rose-900/50 rounded-lg transition-colors cursor-pointer"
                              title="Delete category"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleDeleteCategory(cat)}
                              className="p-1.5 text-slate-500 bg-white/5 rounded-lg transition-colors cursor-not-allowed opacity-60"
                              title="Delete restricted for team members"
                            >
                              <Lock className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 4. MANAGE ORDERS */}
              {activeTab === 'orders' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h1 className="text-2xl font-bold tracking-tight text-white">Manage Orders</h1>
                      <p className="text-xs text-slate-400">
                        Verify client bank/gateway payments, deliver source code download packages, and manage fulfillment.
                      </p>
                    </div>

                    {/* Filter toolbar */}
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="Search orders..."
                          value={orderSearch}
                          onChange={(e) => setOrderSearch(e.target.value)}
                          className="pl-8 pr-3 py-1.5 bg-[#121626] border border-white/10 rounded-lg text-xs text-white"
                        />
                      </div>
                      <select
                        value={orderStatusFilter}
                        onChange={(e) => setOrderStatusFilter(e.target.value)}
                        className="px-2.5 py-1.5 bg-[#121626] border border-white/10 rounded-lg text-xs text-white cursor-pointer"
                      >
                        <option value="All">All Statuses</option>
                        <option value="Pending Verification">Pending Verification</option>
                        <option value="Verified & Paid">Verified & Paid</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>
                  </div>

                  {filteredOrders.length === 0 ? (
                    <div className="p-12 text-center rounded-2xl border border-white/10 bg-[#0d101e] text-slate-500 text-xs">
                      No orders match your filter.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredOrders.map((ord) => (
                        <div
                          key={ord.orderNumber}
                          className="p-5 rounded-2xl border border-white/10 bg-[#0d101e] space-y-4 text-xs shadow-lg"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                            <div className="flex items-center gap-3">
                              <span className="font-mono text-emerald-400 font-bold text-sm">
                                {ord.orderNumber}
                              </span>
                              <span className="text-slate-400">·</span>
                              <span className="font-semibold text-white">{ord.websiteTitle}</span>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="font-bold text-white font-mono text-sm">
                                ${ord.amount} {ord.currency}
                              </span>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                ord.paymentStatus === 'Verified & Paid'
                                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                                  : ord.paymentStatus === 'Rejected'
                                  ? 'bg-rose-950/80 text-rose-300 border border-rose-800'
                                  : 'bg-amber-950/80 text-amber-300 border border-amber-800'
                              }`}>
                                {ord.paymentStatus}
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-slate-300">
                            <div>
                              <span className="text-[10px] text-slate-500 block uppercase">Client Name</span>
                              <span className="font-medium text-white">{ord.customerName}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-500 block uppercase">Email</span>
                              <span className="font-medium text-white">{ord.customerEmail}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-500 block uppercase">Payment Method</span>
                              <span className="font-medium text-blue-400">{ord.preferredPaymentMethod}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-500 block uppercase">Country & License</span>
                              <span className="text-slate-200">{ord.customerCountry} · {ord.licenseType}</span>
                            </div>
                          </div>

                          {/* Verification & Delivery Controls */}
                          <div className="p-4 rounded-xl bg-[#121526] border border-white/10 space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <label className="text-[11px] font-semibold text-slate-300">
                                  Payment Verification Status
                                </label>
                                <select
                                  value={ord.paymentStatus}
                                  onChange={(e) =>
                                    handleUpdateOrder(ord.orderNumber, {
                                      paymentStatus: e.target.value as any
                                    })
                                  }
                                  className="w-full px-3 py-2 bg-[#171b2e] border border-white/10 rounded-lg text-xs text-white focus:outline-none cursor-pointer"
                                >
                                  <option value="Pending Verification">Pending Verification</option>
                                  <option value="Verified & Paid">Verified & Paid (Unlocks Delivery)</option>
                                  <option value="Rejected">Rejected</option>
                                </select>
                              </div>

                              <div className="space-y-1">
                                <label className="text-[11px] font-semibold text-slate-300">
                                  Delivery Status
                                </label>
                                <select
                                  value={ord.deliveryStatus}
                                  onChange={(e) =>
                                    handleUpdateOrder(ord.orderNumber, {
                                      deliveryStatus: e.target.value as any
                                    })
                                  }
                                  className="w-full px-3 py-2 bg-[#171b2e] border border-white/10 rounded-lg text-xs text-white focus:outline-none cursor-pointer"
                                >
                                  <option value="Preparing Package">Preparing Package</option>
                                  <option value="Delivered">Delivered</option>
                                  <option value="On Hold">On Hold</option>
                                </select>
                              </div>
                            </div>

                            {/* Source code download link */}
                            <div className="space-y-1 pt-1">
                              <label className="text-[11px] font-semibold text-emerald-400">
                                Authorized Source Code Download Link (Unlocked for Buyer When Verified)
                              </label>
                              <input
                                type="url"
                                defaultValue={ord.downloadLink || ''}
                                placeholder="https://drive.google.com/... or https://smartdeveloper.io/packages/..."
                                onBlur={(e) =>
                                  handleUpdateOrder(ord.orderNumber, { downloadLink: e.target.value })
                                }
                                className="w-full px-3 py-2 bg-[#171b2e] border border-white/10 rounded-lg text-xs text-white font-mono"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[11px] font-semibold text-slate-300">
                                Delivery Package Notes & Instructions
                              </label>
                              <textarea
                                rows={2}
                                defaultValue={ord.deliveryPackageNotes || ''}
                                placeholder="Include ZIP extraction password, environment file notes, or GitHub repo invite..."
                                onBlur={(e) =>
                                  handleUpdateOrder(ord.orderNumber, { deliveryPackageNotes: e.target.value })
                                }
                                className="w-full px-3 py-2 bg-[#171b2e] border border-white/10 rounded-lg text-xs text-white"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 5. CUSTOMER INQUIRIES (Messages from Contact Form) */}
              {activeTab === 'customer-inquiries' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white">Customer Inquiries</h1>
                    <p className="text-xs text-slate-400">
                      Messages received from the contact form and general consultation requests.
                    </p>
                  </div>

                  {customerMessages.length === 0 ? (
                    <div className="p-12 text-center rounded-2xl border border-white/10 bg-[#0d101e] text-slate-500 text-xs">
                      No general customer messages received yet.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {customerMessages.map((msg) => (
                        <div
                          key={msg.id}
                          className="p-5 rounded-2xl border border-white/10 bg-[#0d101e] space-y-3 text-xs"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                            <div className="flex items-center gap-3">
                              <span className="font-mono text-blue-400 font-bold">{msg.id}</span>
                              <span className="text-slate-400">·</span>
                              <span className="font-semibold text-white text-sm">{msg.fullName}</span>
                              <span className="text-slate-400">({msg.email})</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <select
                                value={msg.status}
                                onChange={(e) =>
                                  handleUpdateInquiryStatus(msg.id, e.target.value as any, msg.adminNotes)
                                }
                                className="bg-[#141829] border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none cursor-pointer"
                              >
                                {['New', 'In Review', 'Quoted', 'In Progress', 'Completed', 'Archived'].map((st) => (
                                  <option key={st} value={st}>{st}</option>
                                ))}
                              </select>

                              {userRole === 'owner' ? (
                                <button
                                  onClick={() => handleDeleteInquiry(msg.id)}
                                  className="p-1.5 text-rose-400 hover:text-white bg-rose-950/40 rounded-lg cursor-pointer"
                                  title="Delete"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleDeleteInquiry(msg.id)}
                                  className="p-1.5 text-slate-500 bg-white/5 rounded-lg cursor-not-allowed opacity-60"
                                  title="Delete restricted for team members"
                                >
                                  <Lock className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>

                          <div>
                            <span className="text-[10px] text-slate-500 block uppercase mb-1">Subject / Message</span>
                            <p className="p-3 rounded-xl bg-[#121524] text-slate-200 whitespace-pre-line leading-relaxed">
                              {msg.projectDescription}
                            </p>
                          </div>

                          <div className="pt-2">
                            <input
                              type="text"
                              defaultValue={msg.adminNotes || ''}
                              placeholder="Add internal notes (e.g. Replied via email on Oct 18)..."
                              onBlur={(e) => handleUpdateInquiryStatus(msg.id, msg.status, e.target.value)}
                              className="w-full px-3 py-1.5 bg-[#141829] border border-white/10 rounded-lg text-xs text-white"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 6. CUSTOM WEBSITE REQUESTS */}
              {activeTab === 'custom-requests' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white">Custom Website Requests</h1>
                    <p className="text-xs text-slate-400">
                      Bespoke website project orders with specifications, budget brackets, and required features.
                    </p>
                  </div>

                  {customWebsiteRequests.length === 0 ? (
                    <div className="p-12 text-center rounded-2xl border border-white/10 bg-[#0d101e] text-slate-500 text-xs">
                      No bespoke custom website requests submitted yet.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {customWebsiteRequests.map((req) => (
                        <div
                          key={req.id}
                          className="p-5 rounded-2xl border border-white/10 bg-[#0d101e] space-y-4 text-xs shadow-lg"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                            <div className="flex items-center gap-3">
                              <span className="font-mono text-blue-400 font-bold">{req.id}</span>
                              <span className="text-slate-400">·</span>
                              <span className="font-semibold text-white text-sm">{req.fullName}</span>
                              <span className="text-slate-400">({req.email})</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <select
                                value={req.status}
                                onChange={(e) =>
                                  handleUpdateInquiryStatus(req.id, e.target.value as any, req.adminNotes)
                                }
                                className="bg-[#141829] border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none cursor-pointer"
                              >
                                {['New', 'In Review', 'Quoted', 'In Progress', 'Completed', 'Archived'].map((st) => (
                                  <option key={st} value={st}>{st}</option>
                                ))}
                              </select>

                              {userRole === 'owner' ? (
                                <button
                                  onClick={() => handleDeleteInquiry(req.id)}
                                  className="p-1.5 text-rose-400 hover:text-white bg-rose-950/40 rounded-lg cursor-pointer"
                                  title="Delete"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleDeleteInquiry(req.id)}
                                  className="p-1.5 text-slate-500 bg-white/5 rounded-lg cursor-not-allowed opacity-60"
                                  title="Delete restricted for team members"
                                >
                                  <Lock className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-slate-300">
                            <div>
                              <span className="text-[10px] text-slate-500 block uppercase">Business Name</span>
                              <span className="font-medium text-white">{req.businessName}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-500 block uppercase">Market / Country</span>
                              <span className="font-medium text-white">{req.country}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-500 block uppercase">Website Type</span>
                              <span className="font-medium text-white">{req.websiteType}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-500 block uppercase">Budget Bracket</span>
                              <span className="font-mono font-medium text-blue-400">{req.budgetRange}</span>
                            </div>
                          </div>

                          {req.desiredCompletionDate && (
                            <div className="text-slate-400">
                              <span>Timeline: </span>
                              <span className="text-white font-medium">{req.desiredCompletionDate}</span>
                            </div>
                          )}

                          {req.requiredFeatures && req.requiredFeatures.length > 0 && (
                            <div>
                              <span className="text-[10px] text-slate-500 block uppercase mb-1">
                                Required Features Checklist
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {req.requiredFeatures.map((f, i) => (
                                  <span key={i} className="px-2.5 py-1 rounded bg-[#15192c] border border-white/5 text-[11px] text-slate-200">
                                    {f}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          <div>
                            <span className="text-[10px] text-slate-500 block uppercase mb-1">
                              Project Scope & Description
                            </span>
                            <p className="p-3.5 rounded-xl bg-[#121524] text-slate-200 whitespace-pre-line leading-relaxed">
                              {req.projectDescription}
                            </p>
                          </div>

                          {req.referenceUrl && (
                            <div className="text-xs">
                              <span className="text-slate-400">Reference URL: </span>
                              <a
                                href={req.referenceUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-400 hover:underline"
                              >
                                {req.referenceUrl}
                              </a>
                            </div>
                          )}

                          <div className="pt-2">
                            <span className="text-[10px] text-slate-500 block uppercase mb-1">
                              Private Admin Notes
                            </span>
                            <input
                              type="text"
                              defaultValue={req.adminNotes || ''}
                              placeholder="Add private quote details, milestones, or client communication notes..."
                              onBlur={(e) => handleUpdateInquiryStatus(req.id, req.status, e.target.value)}
                              className="w-full px-3 py-2 bg-[#141829] border border-white/10 rounded-lg text-xs text-white"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 7. MANAGE FAQS */}
              {activeTab === 'faqs' && (
                <div className="space-y-6 animate-in fade-in duration-200 max-w-4xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-2xl font-bold tracking-tight text-white">Manage FAQs</h1>
                      <p className="text-xs text-slate-400">
                        Edit public FAQs displayed on the Smart Developer homepage.
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        setEditingFaq({
                          question: '',
                          answer: '',
                          category: 'General'
                        })
                      }
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add FAQ</span>
                    </button>
                  </div>

                  {editingFaq && (
                    <form
                      onSubmit={handleSaveFAQ}
                      className="p-5 rounded-2xl bg-[#0d101e] border border-blue-500/40 space-y-4"
                    >
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                        {editingFaq.id ? 'Edit FAQ' : 'New FAQ Item'}
                      </h3>
                      <div className="space-y-2">
                        <input
                          type="text"
                          required
                          placeholder="Question..."
                          value={editingFaq.question || ''}
                          onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })}
                          className="w-full px-3 py-2 bg-[#141829] border border-white/10 rounded-xl text-xs text-white"
                        />
                        <input
                          type="text"
                          placeholder="Category (e.g. Source Code, Payment, Hosting)..."
                          value={editingFaq.category || ''}
                          onChange={(e) => setEditingFaq({ ...editingFaq, category: e.target.value })}
                          className="w-full px-3 py-2 bg-[#141829] border border-white/10 rounded-xl text-xs text-white"
                        />
                        <textarea
                          rows={3}
                          required
                          placeholder="Answer..."
                          value={editingFaq.answer || ''}
                          onChange={(e) => setEditingFaq({ ...editingFaq, answer: e.target.value })}
                          className="w-full px-3 py-2 bg-[#141829] border border-white/10 rounded-xl text-xs text-white leading-relaxed"
                        />
                      </div>
                      <div className="flex gap-2 justify-end">
                        <button
                          type="button"
                          onClick={() => setEditingFaq(null)}
                          className="px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-white/5 rounded-lg"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 text-xs text-white bg-blue-600 hover:bg-blue-500 font-semibold rounded-lg"
                        >
                          Save FAQ
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="space-y-2.5">
                    {faqs.map((faq) => (
                      <div
                        key={faq.id}
                        className="p-4 rounded-xl bg-[#0d101e] border border-white/5 flex items-start justify-between gap-4 text-xs"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-blue-400 font-semibold font-mono">{faq.category}</span>
                            <span className="text-slate-500">·</span>
                            <span className="font-bold text-white text-sm">{faq.question}</span>
                          </div>
                          <p className="text-slate-300 leading-relaxed pt-1">{faq.answer}</p>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => setEditingFaq(faq)}
                            className="p-1.5 text-slate-400 hover:text-white"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          {userRole === 'owner' ? (
                            <button
                              onClick={() => handleDeleteFAQ(faq.id)}
                              className="p-1.5 text-rose-400 hover:text-white rounded-lg cursor-pointer"
                              title="Delete FAQ"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleDeleteFAQ(faq.id)}
                              className="p-1.5 text-slate-500 bg-white/5 rounded-lg cursor-not-allowed opacity-60"
                              title="Delete restricted for team members"
                            >
                              <Lock className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 8. CONTACT SETTINGS */}
              {activeTab === 'contact-settings' && (
                <div className="space-y-8 animate-in fade-in duration-200 max-w-4xl">
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white">Contact & Platform Settings</h1>
                    <p className="text-xs text-slate-400">
                      Configure your verified business email, WhatsApp contact number, and homepage statistics visibility.
                    </p>
                  </div>

                  <form
                    onSubmit={handleSaveSettings}
                    className="p-6 rounded-2xl border border-white/10 bg-[#0d101e] space-y-6 shadow-xl"
                  >
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                      Official Communication Channels
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">Primary Business Email</label>
                        <input
                          type="email"
                          required
                          value={settings.businessEmail}
                          onChange={(e) => setSettings({ ...settings, businessEmail: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-[#141829] border border-white/10 rounded-xl text-xs text-white"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">
                          WhatsApp Contact Number (International)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. +923001234567"
                          value={settings.whatsappNumber}
                          onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-[#141829] border border-white/10 rounded-xl text-xs text-white"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="whatsappEnabled"
                        checked={settings.whatsappEnabled}
                        onChange={(e) => setSettings({ ...settings, whatsappEnabled: e.target.checked })}
                        className="rounded text-blue-600 focus:ring-0 cursor-pointer"
                      />
                      <label htmlFor="whatsappEnabled" className="text-xs text-slate-200 cursor-pointer">
                        Enable Floating WhatsApp Button on Public Website
                      </label>
                    </div>

                    <div className="pt-4 border-t border-white/10 space-y-3">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                        Homepage Statistics Governance
                      </h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Per prompt instructions: &ldquo;Display editable statistics such as websites available, categories, and completed projects. Do not invent fake client numbers, testimonials, ratings, or business achievements. Hide statistics until genuine information is available.&rdquo;
                      </p>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="showStatistics"
                          checked={settings.showStatistics}
                          onChange={(e) => setSettings({ ...settings, showStatistics: e.target.checked })}
                          className="rounded text-blue-600 focus:ring-0 cursor-pointer"
                        />
                        <label htmlFor="showStatistics" className="text-xs font-semibold text-white cursor-pointer">
                          Display Verified Statistics Strip on Homepage
                        </label>
                      </div>

                      {settings.showStatistics && (
                        <div className="space-y-1.5 max-w-xs pt-1">
                          <label className="text-xs text-slate-300">Verified Completed Projects Count</label>
                          <input
                            type="number"
                            min="0"
                            value={settings.completedProjectsCount}
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                completedProjectsCount: parseInt(e.target.value, 10) || 0
                              })
                            }
                            className="w-full px-3.5 py-2 bg-[#141829] border border-white/10 rounded-xl text-xs text-white font-mono"
                          />
                        </div>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Platform Settings</span>
                    </button>
                  </form>

                  {/* Administrator Access & Security Notice */}
                  <div className="p-6 rounded-2xl border border-blue-500/20 bg-gradient-to-br from-[#0d101e] to-blue-950/20 space-y-4 shadow-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                          <ShieldCheck className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                            Administrator Security &amp; Access Control
                          </h3>
                          <p className="text-xs text-slate-400">
                            Username and password login have been permanently removed.
                          </p>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                        Locked &amp; Secured
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
                      <div className="text-xs text-slate-300 font-medium">
                        Primary Authorized Google Administrator:
                      </div>
                      <div className="flex items-center gap-2 font-mono text-xs text-emerald-400 bg-[#121626] p-2.5 rounded-lg border border-emerald-500/20">
                        <Mail className="w-4 h-4 text-blue-400" />
                        <span>smartdeveloper125@gmail.com</span>
                      </div>
                      <p className="text-[11px] text-slate-400 pt-1">
                        Only authenticated sign-ins matching this email address are authorized to view or edit website listings, orders, client inquiries, and settings.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* 9. TEAM ACCESS MANAGEMENT */}
              {activeTab === 'team' && (
                <div className="space-y-6 animate-in fade-in duration-200 max-w-5xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
                        <Users className="w-6 h-6 text-blue-400" />
                        <span>Team Access &amp; Permissions</span>
                      </h1>
                      <p className="text-xs text-slate-400">
                        smartdeveloper125@gmail.com (Owner) controls access. Team members can add listings &amp; content, but cannot delete anything.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {userRole === 'owner' ? (
                        <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500/15 border border-amber-500/30 text-amber-300 flex items-center gap-1.5 shadow-sm">
                          <Crown className="w-4 h-4 text-amber-400" />
                          <span>Owner Mode: Full Control</span>
                        </span>
                      ) : (
                        <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-500/15 border border-blue-500/30 text-blue-300 flex items-center gap-1.5 shadow-sm">
                          <ShieldAlert className="w-4 h-4 text-blue-400" />
                          <span>Team Member: Add-Only</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Primary Owner Account Banner */}
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-[#0d101e] via-[#101428] to-blue-950/30 border border-amber-500/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0 shadow-inner">
                        <Crown className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-white">smartdeveloper125@gmail.com</h3>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
                            Primary Owner
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 pt-0.5">
                          Unrestricted Administrator: Can create, edit, delete content, and grant or revoke team access.
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5 shrink-0 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Permanent Super Admin
                    </span>
                  </div>

                  {/* Add New Team Member Form (Owner only) */}
                  {userRole === 'owner' ? (
                    <form
                      onSubmit={handleAddTeamMember}
                      className="p-6 rounded-2xl border border-white/10 bg-[#0d101e] space-y-4 shadow-xl"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <UserPlus className="w-4 h-4 text-emerald-400" />
                          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                            Grant Access to New Team Member
                          </h3>
                        </div>
                        <span className="text-[11px] text-slate-400">
                          Google Sign-In Access
                        </span>
                      </div>

                      {teamActionError && (
                        <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-200 text-xs flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                          <span>{teamActionError}</span>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-300">
                            Google Email Address *
                          </label>
                          <div className="relative">
                            <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                              type="email"
                              required
                              value={newMemberEmail}
                              onChange={(e) => setNewMemberEmail(e.target.value)}
                              placeholder="e.g. colleague@gmail.com"
                              className="w-full pl-10 pr-4 py-2.5 bg-[#141829] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-300">
                            Member Name / Title (Optional)
                          </label>
                          <input
                            type="text"
                            value={newMemberName}
                            onChange={(e) => setNewMemberName(e.target.value)}
                            placeholder="e.g. Ali (Developer) / Sarah"
                            className="w-full px-4 py-2.5 bg-[#141829] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                          />
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-800/30 text-xs text-slate-300 flex items-start gap-2.5">
                        <ShieldAlert className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                        <span className="leading-relaxed text-[11px]">
                          <strong>Enforced Security Policy:</strong> Team members can view the dashboard, upload source code, create website listings, and manage inquiries. Deletion of website listings, categories, FAQs, and inquiries is <strong>strictly locked and restricted</strong> to the Owner.
                        </span>
                      </div>

                      <div className="flex justify-end pt-1">
                        <button
                          type="submit"
                          disabled={teamLoading}
                          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-md shadow-blue-600/30 cursor-pointer"
                        >
                          {teamLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>Granting Access...</span>
                            </>
                          ) : (
                            <>
                              <UserPlus className="w-4 h-4" />
                              <span>Grant Team Access</span>
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="p-5 rounded-2xl border border-blue-800/40 bg-blue-950/20 text-xs text-blue-200 flex items-center gap-3">
                      <Lock className="w-5 h-5 text-blue-400 shrink-0" />
                      <span>
                        You are logged in with Team Member permissions. Only the Primary Owner (smartdeveloper125@gmail.com) can add or remove team members.
                      </span>
                    </div>
                  )}

                  {/* Active Team Members List */}
                  <div className="p-6 rounded-2xl border border-white/10 bg-[#0d101e] space-y-4 shadow-xl">
                    <div className="flex items-center justify-between border-b border-white/5 pb-3">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-400" />
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                          Active Team Members ({teamMembers.length})
                        </h3>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">
                        Role: Add-Only Access
                      </span>
                    </div>

                    {teamMembers.length === 0 ? (
                      <div className="p-10 text-center rounded-xl border border-dashed border-white/10 bg-black/20 space-y-2">
                        <Users className="w-8 h-8 text-slate-600 mx-auto" />
                        <p className="text-xs text-slate-400">
                          No team members added yet.
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Use the form above to grant access to members through their Google email address.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {teamMembers.map((member) => (
                          <div
                            key={member.id}
                            className="p-4 rounded-xl bg-[#121626] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors hover:border-white/10"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-300 font-bold text-xs flex items-center justify-center shrink-0 uppercase">
                                {member.name ? member.name.substring(0, 2) : member.email.substring(0, 2)}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-white text-xs">
                                    {member.name || member.email.split('@')[0]}
                                  </span>
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/15 border border-blue-500/30 text-blue-300">
                                    Team Member (Add-Only)
                                  </span>
                                </div>
                                <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2 pt-0.5">
                                  <Mail className="w-3 h-3 text-slate-500" />
                                  <span>{member.email}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="text-[10px] text-slate-500 font-mono">
                                Added: {new Date(member.addedAt).toLocaleDateString()}
                              </span>
                              {userRole === 'owner' && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveTeamMember(member.id, member.email)}
                                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-300 hover:text-white bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/40 flex items-center gap-1.5 transition-colors cursor-pointer"
                                  title="Revoke access"
                                >
                                  <UserMinus className="w-3.5 h-3.5" />
                                  <span>Remove Access</span>
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Permissions Comparison Table */}
                  <div className="p-6 rounded-2xl border border-white/10 bg-[#0d101e] space-y-4 shadow-xl">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                      Role Permissions Matrix
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-white/10 text-slate-400 font-mono">
                            <th className="py-2.5 px-3">Permission / Action</th>
                            <th className="py-2.5 px-3 text-amber-300">👑 Owner (smartdeveloper125)</th>
                            <th className="py-2.5 px-3 text-blue-300">👥 Team Members</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-slate-300">
                          <tr>
                            <td className="py-2.5 px-3 font-medium text-white">Google OAuth Login</td>
                            <td className="py-2.5 px-3 text-emerald-400 font-semibold">Allowed (Full Access)</td>
                            <td className="py-2.5 px-3 text-emerald-400 font-semibold">Allowed (Invited Emails)</td>
                          </tr>
                          <tr>
                            <td className="py-2.5 px-3 font-medium text-white">Add Website Listings &amp; Upload Source Code</td>
                            <td className="py-2.5 px-3 text-emerald-400">Yes (Allowed)</td>
                            <td className="py-2.5 px-3 text-emerald-400">Yes (Allowed)</td>
                          </tr>
                          <tr>
                            <td className="py-2.5 px-3 font-medium text-white">Edit Website Listings &amp; Upload Media</td>
                            <td className="py-2.5 px-3 text-emerald-400">Yes (Allowed)</td>
                            <td className="py-2.5 px-3 text-emerald-400">Yes (Allowed)</td>
                          </tr>
                          <tr>
                            <td className="py-2.5 px-3 font-medium text-white">Add Categories &amp; FAQs</td>
                            <td className="py-2.5 px-3 text-emerald-400">Yes (Allowed)</td>
                            <td className="py-2.5 px-3 text-emerald-400">Yes (Allowed)</td>
                          </tr>
                          <tr>
                            <td className="py-2.5 px-3 font-medium text-white">View Inquiries &amp; Manage Orders</td>
                            <td className="py-2.5 px-3 text-emerald-400">Yes (Allowed)</td>
                            <td className="py-2.5 px-3 text-emerald-400">Yes (Allowed)</td>
                          </tr>
                          <tr className="bg-rose-950/20">
                            <td className="py-2.5 px-3 font-medium text-rose-300">Delete Websites, Categories, Inquiries, FAQs</td>
                            <td className="py-2.5 px-3 text-emerald-400 font-bold">Yes (Owner Only)</td>
                            <td className="py-2.5 px-3 text-rose-400 font-bold">❌ Locked (No Delete)</td>
                          </tr>
                          <tr className="bg-rose-950/20">
                            <td className="py-2.5 px-3 font-medium text-rose-300">Invite &amp; Remove Team Members</td>
                            <td className="py-2.5 px-3 text-emerald-400 font-bold">Yes (Owner Only)</td>
                            <td className="py-2.5 px-3 text-rose-400 font-bold">❌ Locked (Restricted)</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Website Listing Create / Edit Modal (With Image Upload Support) */}
      {showListingModal && editingListing && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md p-4 sm:p-6 flex justify-center items-start">
          <div className="relative w-full max-w-3xl bg-[#0c0f1e] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100 my-8">
            <button
              onClick={() => {
                setShowListingModal(false);
                setEditingListing(null);
              }}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/5 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <form onSubmit={handleSaveListing} className="space-y-5 text-xs">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>{editingListing.id ? 'Edit Website Listing' : 'Add New Website Package'}</span>
                  {editingListing.id && (
                    <span className="text-xs font-mono text-blue-400 bg-blue-950/60 border border-blue-800/60 px-2 py-0.5 rounded-md">
                      ID: {editingListing.id}
                    </span>
                  )}
                </h3>
                <p className="text-slate-400 mt-0.5">Website ka title, category, qeemat (price), live demo URL aur details set karein.</p>
              </div>

              {/* ROW 1: BASIC INFO */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="font-bold text-slate-200 text-xs flex items-center justify-between">
                    <span>Website Title *</span>
                    <span className="text-[10px] text-slate-500 font-normal">e.g. Aura Luxe Luxury E-Commerce</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editingListing.title || ''}
                    onChange={(e) => setEditingListing({ ...editingListing, title: e.target.value })}
                    placeholder="Enter website title..."
                    className="w-full px-3.5 py-2.5 bg-[#141829] border border-white/15 rounded-xl text-xs text-white placeholder-slate-500 focus:border-blue-500 font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-200 text-xs">Category *</label>
                  <select
                    value={editingListing.category || categories[0] || 'E-commerce Stores'}
                    onChange={(e) => setEditingListing({ ...editingListing, category: e.target.value })}
                    className="w-full px-3 py-2.5 bg-[#141829] border border-white/15 rounded-xl text-xs text-white cursor-pointer focus:border-blue-500"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* ROW 2: DEDICATED PRICE INPUT IN PKR (PAKISTANI RUPEES) */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/50 via-[#12162a] to-teal-950/40 border border-emerald-500/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">💵</span>
                    <label className="font-bold text-white text-xs tracking-wide">
                      Website Price / Qeemat (₨ PKR) *
                    </label>
                  </div>
                  <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/70 border border-cyan-800/60 px-2.5 py-0.5 rounded-full">
                    ≈ ${Math.round((Number(editingListing.pricePKR) || (Number(editingListing.priceUSD) || 0) * 278.5) / 278.5)} USD
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400 font-bold text-sm">₨</span>
                    <input
                      type="number"
                      min="500"
                      step="500"
                      required
                      value={
                        editingListing.pricePKR !== undefined && editingListing.pricePKR !== null
                          ? editingListing.pricePKR
                          : (editingListing.priceUSD ? Math.round(Number(editingListing.priceUSD) * 278.5) : '')
                      }
                      onChange={(e) => {
                        const val = e.target.value === '' ? ('' as any) : Number(e.target.value);
                        setEditingListing({
                          ...editingListing,
                          pricePKR: val,
                          priceUSD: val ? Math.round(Number(val) / 278.5) : 0
                        });
                      }}
                      placeholder="e.g. 25000"
                      className="w-full pl-9 pr-3 py-2.5 bg-[#181d33] border border-emerald-500/40 rounded-xl text-sm text-white font-mono font-bold placeholder-slate-500 focus:border-emerald-500 shadow-inner"
                    />
                  </div>

                  {/* Quick PKR price presets */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] text-slate-400 mr-1">Presets:</span>
                    {[15000, 25000, 35000, 50000, 75000, 100000].map((p) => {
                      const currentVal = Number(editingListing.pricePKR) || (editingListing.priceUSD ? Math.round(Number(editingListing.priceUSD) * 278.5) : 0);
                      const isSelected = currentVal === p;
                      return (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setEditingListing({
                            ...editingListing,
                            pricePKR: p,
                            priceUSD: Math.round(p / 278.5)
                          })}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-semibold border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/30'
                              : 'bg-[#181d33] text-slate-300 border-white/10 hover:border-white/30'
                          }`}
                        >
                          ₨ {p >= 1000 ? `${p / 1000}k` : p}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* ROW 3: LIVE WORKING WEBSITE DEMO LINK */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-[#0e1722] to-cyan-950/30 border border-emerald-500/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-emerald-400" />
                    <label className="font-bold text-white text-xs">
                      Live Working Website Demo Link (URL)
                    </label>
                  </div>
                  <span className="text-[10px] text-emerald-300 font-mono bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-0.5 rounded-full">
                    Live Demo Link
                  </span>
                </div>

                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <LinkIcon className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="url"
                      value={editingListing.liveDemoUrl || ''}
                      onChange={(e) => setEditingListing({ ...editingListing, liveDemoUrl: e.target.value })}
                      placeholder="https://my-website-demo.vercel.app or https://your-domain.com"
                      className="w-full pl-9 pr-3 py-2.5 bg-[#141829] border border-white/15 rounded-xl text-xs text-white font-mono placeholder-slate-500 focus:border-emerald-500"
                    />
                  </div>
                  {editingListing.liveDemoUrl && editingListing.liveDemoUrl.startsWith('http') && (
                    <a
                      href={editingListing.liveDemoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 shadow-sm"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Test Link</span>
                    </a>
                  )}
                </div>
                <p className="text-[11px] text-slate-400">
                  Yahan live website ka link paste karein taake buyers button dabane par aapki live working website dekh sakein. (Agar link na ho to built-in simulator mockup dikhega).
                </p>
              </div>

              {/* Built-in Interactive Simulator Type Fallback */}
              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold flex items-center justify-between text-xs">
                  <span>Built-in Simulator Template (Fallback Mockup Type)</span>
                  <span className="text-[10px] text-slate-500">Agar link na ho to ye theme preview chalegi</span>
                </label>
                <select
                  value={editingListing.demoType || 'generic'}
                  onChange={(e) =>
                    setEditingListing({
                      ...editingListing,
                      demoType: e.target.value as any
                    })
                  }
                  className="w-full px-3 py-2.5 bg-[#141829] border border-white/10 rounded-xl text-xs text-white cursor-pointer focus:border-blue-500"
                >
                  <option value="ecommerce">E-commerce Store (Products &amp; Cart Drawer)</option>
                  <option value="realestate">Real Estate Portal (Property Grid &amp; Filters)</option>
                  <option value="fashion">Fashion &amp; Apparel (Lookbook &amp; Size Selector)</option>
                  <option value="saas">SaaS Application (Analytics &amp; Dashboard)</option>
                  <option value="portfolio">Creative Portfolio</option>
                  <option value="restaurant">Restaurant &amp; Cafe</option>
                  <option value="generic">Generic Modern Business Showcase</option>
                </select>
              </div>

              {/* Thumbnail Image input + Gallery Upload options */}
              <div className="space-y-3 p-4 rounded-xl bg-[#101424] border border-white/10">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-200 text-xs flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-blue-400" />
                    <span>Website Thumbnail Image (Gallery / File)</span>
                  </label>
                  {imageUploadLoading && (
                    <span className="text-[11px] text-blue-400 flex items-center gap-1">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Uploading from gallery...</span>
                    </span>
                  )}
                </div>

                {/* Visual Image Preview */}
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  <div className="w-full sm:w-44 h-28 rounded-lg bg-[#0b0e1a] border border-white/10 overflow-hidden relative shrink-0 flex items-center justify-center group">
                    {editingListing.thumbnail ? (
                      <>
                        <img
                          src={editingListing.thumbnail}
                          alt="Thumbnail Preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <label className="p-1.5 rounded-md bg-blue-600 text-white cursor-pointer hover:bg-blue-500" title="Change from gallery">
                            <Upload className="w-3.5 h-3.5" />
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileUpload(e, 'thumbnail')}
                              className="hidden"
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => setEditingListing({ ...editingListing, thumbnail: '' })}
                            className="p-1.5 rounded-md bg-rose-600 text-white hover:bg-rose-500 cursor-pointer"
                            title="Remove image"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center p-2 text-slate-500 text-[11px]">
                        <ImageIcon className="w-6 h-6 mx-auto mb-1 opacity-50" />
                        <span>No image selected</span>
                      </div>
                    )}
                  </div>

                  {/* Actions & URL Input */}
                  <div className="flex-1 space-y-2 w-full">
                    <div className="flex flex-wrap gap-2">
                      {/* Big prominent Gallery button */}
                      <label className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-2 shadow-md shadow-blue-600/30 transition-all">
                        <Upload className="w-4 h-4" />
                        <span>📱 Gallery se Image Choose Karein</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, 'thumbnail')}
                          className="hidden"
                        />
                      </label>

                      {/* Pick from Media Library */}
                      <button
                        type="button"
                        onClick={() => {
                          fetchGalleryImages();
                          setShowMediaPickerModal('thumbnail');
                        }}
                        className="px-3 py-2 bg-[#192038] hover:bg-[#252f52] border border-white/10 rounded-lg text-xs text-slate-200 cursor-pointer flex items-center gap-1.5 transition-colors"
                      >
                        <FolderArchive className="w-4 h-4 text-indigo-400" />
                        <span>Media Library</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editingListing.thumbnail || ''}
                        onChange={(e) => setEditingListing({ ...editingListing, thumbnail: e.target.value })}
                        placeholder="Image URL or choose from gallery above..."
                        className="flex-1 px-3 py-2 bg-[#141829] border border-white/10 rounded-lg text-xs text-white font-mono placeholder-slate-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Project Screenshots from Gallery */}
                <div className="pt-3 border-t border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-300">
                      Additional Gallery Screenshots ({editingListing.screenshots?.length || 0})
                    </span>
                    <div className="flex gap-2">
                      <label className="px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-md text-[11px] text-cyan-300 cursor-pointer flex items-center gap-1">
                        <Plus className="w-3 h-3" />
                        <span>Gallery se Add Karein</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, 'screenshot')}
                          className="hidden"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          fetchGalleryImages();
                          setShowMediaPickerModal('screenshot');
                        }}
                        className="px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-md text-[11px] text-slate-300 flex items-center gap-1"
                      >
                        <span>From Library</span>
                      </button>
                    </div>
                  </div>

                  {editingListing.screenshots && editingListing.screenshots.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto py-1 no-scrollbar">
                      {editingListing.screenshots.map((sUrl, sIdx) => (
                        <div key={sIdx} className="relative w-20 h-14 rounded-md border border-white/10 overflow-hidden shrink-0 group">
                          <img src={sUrl} alt={`Screenshot ${sIdx + 1}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = editingListing.screenshots?.filter((_, i) => i !== sIdx);
                              setEditingListing({ ...editingListing, screenshots: updated });
                            }}
                            className="absolute top-1 right-1 p-0.5 rounded bg-rose-600/90 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Short Summary Description *</label>
                <input
                  type="text"
                  required
                  value={editingListing.shortDescription || ''}
                  onChange={(e) => setEditingListing({ ...editingListing, shortDescription: e.target.value })}
                  className="w-full px-3 py-2 bg-[#141829] border border-white/10 rounded-lg text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Full Description</label>
                <textarea
                  rows={3}
                  value={editingListing.fullDescription || ''}
                  onChange={(e) => setEditingListing({ ...editingListing, fullDescription: e.target.value })}
                  className="w-full px-3 py-2 bg-[#141829] border border-white/10 rounded-lg text-xs text-white leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Technologies (Comma-separated)</label>
                  <input
                    type="text"
                    value={(editingListing.techStack || []).join(', ')}
                    onChange={(e) =>
                      setEditingListing({
                        ...editingListing,
                        techStack: e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                      })
                    }
                    placeholder="React 19, TypeScript, Tailwind CSS, Express"
                    className="w-full px-3 py-2 bg-[#141829] border border-white/10 rounded-lg text-xs text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Included Pages (Comma-separated)</label>
                  <input
                    type="text"
                    value={(editingListing.includedPages || []).join(', ')}
                    onChange={(e) =>
                      setEditingListing({
                        ...editingListing,
                        includedPages: e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                      })
                    }
                    placeholder="Home, Products, Cart, Checkout, Admin"
                    className="w-full px-3 py-2 bg-[#141829] border border-white/10 rounded-lg text-xs text-white"
                  />
                </div>
              </div>

              {/* SOURCE CODE & GITHUB REPOSITORY LINK — ONLY GITHUB REPO LINK, NO FILE UPLOADS */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-purple-950/40 to-indigo-950/30 border border-purple-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-purple-400" />
                    <span className="font-semibold text-white text-xs">
                      GitHub Repository Link (Source Code)
                    </span>
                  </div>
                  <span className="text-[10px] text-purple-300 font-mono bg-purple-950/70 border border-purple-700/50 px-2.5 py-0.5 rounded-full">
                    GitHub Repo Link Only
                  </span>
                </div>

                <div className="space-y-3 pt-1 text-xs">
                  {/* GitHub Repo URL input */}
                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-semibold flex items-center justify-between">
                      <span>GitHub Repository URL *</span>
                      <span className="text-[11px] text-slate-400">e.g. https://github.com/username/repo-name</span>
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <LinkIcon className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="url"
                          value={editingListing.sourceCodeUrl || ''}
                          onChange={(e) => setEditingListing({ ...editingListing, sourceCodeUrl: e.target.value })}
                          placeholder="https://github.com/smartdeveloper/ecommerce-website"
                          className="w-full pl-9 pr-3 py-2.5 bg-[#141829] border border-white/15 rounded-xl text-xs text-white font-mono placeholder-slate-500 focus:border-purple-500"
                        />
                      </div>
                      {editingListing.sourceCodeUrl && editingListing.sourceCodeUrl.startsWith('http') && (
                        <a
                          href={editingListing.sourceCodeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3.5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Open Repo ↗</span>
                        </a>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Source code ke liye sirf GitHub repository ka link aayega (code ya ZIP file upload karne ki zaroorat nahi hai). Payment verify hone par buyer ko yehi repo access diya jata hai.
                    </p>
                  </div>

                  {/* Optional Repo Setup Notes */}
                  <div className="space-y-1">
                    <label className="text-slate-300 font-medium">Repository Setup Notes / Instructions (Optional)</label>
                    <textarea
                      rows={2}
                      value={editingListing.sourceCodeNotes || ''}
                      onChange={(e) => setEditingListing({ ...editingListing, sourceCodeNotes: e.target.value })}
                      placeholder="e.g. Node 20+, run npm install && npm run dev, environment variables..."
                      className="w-full px-3 py-2 bg-[#141829] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingListing.published !== false}
                    onChange={(e) => setEditingListing({ ...editingListing, published: e.target.checked })}
                    className="rounded text-blue-600 focus:ring-0"
                  />
                  <span>Published on Store</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editingListing.featured)}
                    onChange={(e) => setEditingListing({ ...editingListing, featured: e.target.checked })}
                    className="rounded text-blue-600 focus:ring-0"
                  />
                  <span>Featured on Homepage</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingListing.sourceCodeAvailable !== false}
                    onChange={(e) => setEditingListing({ ...editingListing, sourceCodeAvailable: e.target.checked })}
                    className="rounded text-blue-600 focus:ring-0"
                  />
                  <span>Source Code Available</span>
                </label>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowListingModal(false);
                    setEditingListing(null);
                  }}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingListing}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl font-semibold shadow-md flex items-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
                >
                  {savingListing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Saving Website...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Website Package</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MEDIA LIBRARY / GALLERY PICKER MODAL */}
      {showMediaPickerModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#0f1424] border border-white/15 rounded-2xl max-w-2xl w-full p-6 shadow-2xl flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <FolderArchive className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-white text-base">Media Library — Gallery Images</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowMediaPickerModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
              <span>Select any image to assign as {showMediaPickerModal === 'thumbnail' ? 'Thumbnail' : 'Screenshot'}:</span>
              <label className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg cursor-pointer flex items-center gap-1.5 font-medium transition-colors shadow-sm">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload New from Device</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    handleFileUpload(e, showMediaPickerModal);
                    setShowMediaPickerModal(false);
                  }}
                  className="hidden"
                />
              </label>
            </div>

            <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-3 p-1">
              {galleryImages.map((img, i) => (
                <div
                  key={i}
                  onClick={() => handleSelectGalleryImage(img.url)}
                  className="group relative rounded-xl border border-white/10 hover:border-blue-500 overflow-hidden cursor-pointer bg-[#090d18] transition-all hover:scale-102 hover:shadow-lg"
                >
                  <div className="aspect-video w-full overflow-hidden bg-black/40">
                    <img src={img.url} alt={img.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="p-2 text-[11px] text-slate-300 truncate font-mono">
                    {img.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
