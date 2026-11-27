import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  writeBatch,
  Unsubscribe
} from 'firebase/firestore';
import {
  db,
  auth,
  handleFirestoreError,
  OperationType,
  isOwnerEmail,
  teamMemberDocId
} from '../firebase';
import {
  WebsiteListing,
  PublicSettings,
  FAQItem,
  CustomInquiry,
  PurchaseOrder,
  TeamMember,
  UserRole
} from '../types';

function sanitizeId(raw: string, prefix: string): string {
  const cleaned = String(raw || '')
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, '-');
  return (cleaned || `${prefix}-${Date.now()}`).slice(0, 128);
}

function clampString(val: unknown, maxLen: number): string {
  return String(val ?? '').slice(0, maxLen);
}

function cleanStringArray(arr: unknown, maxItems: number, maxItemLen = 500): string[] {
  if (!Array.isArray(arr)) return [];
  return arr
    .map((x) => String(x ?? '').trim().slice(0, maxItemLen))
    .filter((x) => x.length > 0)
    .slice(0, maxItems);
}

function buildListingWritePayload(
  listing: Partial<WebsiteListing>,
  id: string,
  createdAt: string,
  createdByEmail?: string
): Record<string, any> {
  const validDemoTypes = ['ecommerce', 'realestate', 'fashion', 'saas', 'portfolio', 'restaurant', 'generic'];
  const demoType = validDemoTypes.includes(String(listing.demoType || ''))
    ? String(listing.demoType)
    : 'generic';

  const pricePKR = Number(listing.pricePKR) || (listing.priceUSD ? Math.round(Number(listing.priceUSD) * 278.5) : 25000);
  const priceUSD = Number(listing.priceUSD) || (listing.pricePKR ? Math.round(Number(listing.pricePKR) / 278.5) : 90);
  const title = clampString((listing.title || 'Untitled Website').trim(), 200) || 'Untitled Website';
  const slug = clampString(
    (listing.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || id),
    200
  );

  const screenshots = Array.isArray(listing.screenshots)
    ? listing.screenshots
        .filter((s) => typeof s === 'string' && s.trim().length > 0 && s.length <= 490000)
        .slice(0, 20)
    : [];

  let thumbnail = String(listing.thumbnail || '/assets/images/hero_showcase_dark_1792311614014.jpg').trim();
  if (!thumbnail || thumbnail.length > 490000) {
    thumbnail = '/assets/images/hero_showcase_dark_1792311614014.jpg';
  }

  const customizationServices = Array.isArray(listing.customizationServices)
    ? listing.customizationServices.slice(0, 20).map((s) => ({
        title: clampString(s?.title || '', 200),
        priceUSD: Number(s?.priceUSD) || 0
      }))
    : [];

  const payload: Record<string, any> = {
    id,
    title,
    slug,
    category: clampString((listing.category || 'Business Websites').trim(), 100) || 'Business Websites',
    shortDescription: clampString(listing.shortDescription || '', 1000),
    fullDescription: clampString(listing.fullDescription || '', 10000),
    pricePKR: Math.max(0, Math.min(100000000, pricePKR)),
    priceUSD: Math.max(0, Math.min(1000000, priceUSD)),
    featured: Boolean(listing.featured),
    published: listing.published !== false,
    thumbnail,
    screenshots,
    liveDemoUrl: clampString(listing.liveDemoUrl || '', 2000),
    sourceCodeAvailable: listing.sourceCodeAvailable !== false,
    sourceCodeUrl: clampString(listing.sourceCodeUrl || '', 2000),
    sourceCodeNotes: clampString(listing.sourceCodeNotes || '', 2000),
    sourceCodeFile: clampString(listing.sourceCodeFile || '', 2000),
    customizationAvailable: listing.customizationAvailable !== false,
    techStack: cleanStringArray(listing.techStack, 30, 120),
    includedPages: cleanStringArray(listing.includedPages, 30, 200),
    responsiveSpecs: clampString(listing.responsiveSpecs || '100% fluid responsive design', 1000),
    whatYouReceive: cleanStringArray(listing.whatYouReceive, 30, 300),
    customizationServices,
    demoType,
    createdAt,
    updatedAt: new Date().toISOString()
  };

  if (createdByEmail) {
    payload.createdByEmail = clampString(createdByEmail.toLowerCase().trim(), 200);
  }

  return payload;
}

function buildSettingsPayload(settings: PublicSettings): Record<string, any> {
  return {
    businessEmail: clampString((settings.businessEmail || 'smartbuy9@gmail.com').trim(), 200),
    whatsappNumber: clampString((settings.whatsappNumber || '').trim(), 50),
    whatsappEnabled: Boolean(settings.whatsappEnabled),
    showStatistics: Boolean(settings.showStatistics),
    completedProjectsCount: Math.max(0, Math.min(100000, Number(settings.completedProjectsCount) || 0)),
    socialLinks: {
      tiktok: clampString(settings.socialLinks?.tiktok || '', 500),
      instagram: clampString(settings.socialLinks?.instagram || '', 500),
      facebook: clampString(settings.socialLinks?.facebook || '', 500),
      youtube: clampString(settings.socialLinks?.youtube || '', 500),
      github: clampString(settings.socialLinks?.github || '', 500),
      linkedin: clampString(settings.socialLinks?.linkedin || '', 500),
      twitter: clampString(settings.socialLinks?.twitter || '', 500)
    },
    updatedAt: new Date().toISOString()
  };
}

export const firestoreService = {
  // -------------------------------------------------------------
  // REAL-TIME PUBLIC SUBSCRIPTIONS
  // -------------------------------------------------------------
  subscribePublishedListings(onData: (listings: WebsiteListing[]) => void): Unsubscribe {
    const q = query(collection(db, 'listings'), where('published', '==', true));
    return onSnapshot(
      q,
      (snap) => {
        if (!snap.empty) {
          const items = snap.docs
            .map((d) => d.data() as WebsiteListing)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          onData(items);
        }
      },
      (error) => {
        console.warn('Firestore listings listener error:', error.message);
      }
    );
  },

  subscribePublicSettings(onData: (settings: PublicSettings) => void): Unsubscribe {
    return onSnapshot(
      doc(db, 'settings', 'public'),
      (snap) => {
        if (snap.exists()) {
          onData(snap.data() as PublicSettings);
        }
      },
      (error) => {
        console.warn('Firestore settings listener error:', error.message);
      }
    );
  },

  subscribeFaqs(onData: (faqs: FAQItem[]) => void): Unsubscribe {
    return onSnapshot(
      collection(db, 'faqs'),
      (snap) => {
        if (!snap.empty) {
          onData(snap.docs.map((d) => d.data() as FAQItem));
        }
      },
      (error) => {
        console.warn('Firestore FAQs listener error:', error.message);
      }
    );
  },

  // -------------------------------------------------------------
  // PUBLIC READS
  // -------------------------------------------------------------
  async getPublishedListings(): Promise<WebsiteListing[]> {
    try {
      const q = query(collection(db, 'listings'), where('published', '==', true));
      const snap = await getDocs(q);
      return snap.docs
        .map((d) => d.data() as WebsiteListing)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'listings');
    }
  },

  async getPublicSettings(): Promise<PublicSettings | null> {
    try {
      const snap = await getDoc(doc(db, 'settings', 'public'));
      return snap.exists() ? (snap.data() as PublicSettings) : null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, 'settings/public');
    }
  },

  async getFaqs(): Promise<FAQItem[]> {
    try {
      const snap = await getDocs(collection(db, 'faqs'));
      return snap.docs.map((d) => d.data() as FAQItem);
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'faqs');
    }
  },

  async getCategories(): Promise<string[]> {
    try {
      const snap = await getDocs(collection(db, 'categories'));
      const rows = snap.docs.map((d) => d.data() as { id: string; name: string; order?: number });
      rows.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
      return rows.map((r) => r.name);
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'categories');
    }
  },

  // -------------------------------------------------------------
  // ONE-TIME CLOUD SEEDING (OWNER ONLY WHEN FIRESTORE IS EMPTY)
  // -------------------------------------------------------------
  async ensureInitialSeed(
    initialListings: WebsiteListing[],
    initialSettings: PublicSettings,
    initialFaqs: FAQItem[],
    initialCategories: string[]
  ): Promise<void> {
    const email = auth.currentUser?.email?.toLowerCase().trim();
    if (!email || !isOwnerEmail(email)) return;

    try {
      const settingsRef = doc(db, 'settings', 'public');
      const settingsSnap = await getDoc(settingsRef);
      if (settingsSnap.exists()) {
        return; // Already seeded
      }

      const batch = writeBatch(db);
      batch.set(settingsRef, buildSettingsPayload(initialSettings));

      const existingListingsSnap = await getDocs(collection(db, 'listings'));
      if (existingListingsSnap.empty) {
        for (const item of initialListings) {
          const id = sanitizeId(item.id, 'web');
          batch.set(
            doc(db, 'listings', id),
            buildListingWritePayload(item, id, item.createdAt || new Date().toISOString(), email)
          );
        }
      }

      const existingFaqsSnap = await getDocs(collection(db, 'faqs'));
      if (existingFaqsSnap.empty) {
        for (const faq of initialFaqs) {
          const id = sanitizeId(faq.id, 'faq');
          batch.set(doc(db, 'faqs', id), {
            id,
            question: clampString(faq.question, 500),
            answer: clampString(faq.answer, 5000),
            category: clampString(faq.category || 'General', 100)
          });
        }
      }

      const existingCatsSnap = await getDocs(collection(db, 'categories'));
      if (existingCatsSnap.empty) {
        initialCategories.forEach((name, idx) => {
          const id = sanitizeId(name.toLowerCase(), `cat-${idx}`);
          batch.set(doc(db, 'categories', id), {
            id,
            name: clampString(name, 100),
            order: idx
          });
        });
      }

      await batch.commit();
    } catch (error) {
      console.warn('Initial Firestore seed warning:', error);
    }
  },

  // -------------------------------------------------------------
  // ADMIN LISTINGS CRUD
  // -------------------------------------------------------------
  async getAdminListings(role: UserRole, email: string): Promise<WebsiteListing[]> {
    try {
      if (role === 'owner' && isOwnerEmail(email)) {
        const snap = await getDocs(collection(db, 'listings'));
        return snap.docs
          .map((d) => d.data() as WebsiteListing)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }

      const cleanEmail = email.toLowerCase().trim();
      const [pubSnap, ownSnap] = await Promise.all([
        getDocs(query(collection(db, 'listings'), where('published', '==', true))),
        getDocs(query(collection(db, 'listings'), where('createdByEmail', '==', cleanEmail)))
      ]);

      const map = new Map<string, WebsiteListing>();
      pubSnap.docs.forEach((d) => map.set(d.id, d.data() as WebsiteListing));
      ownSnap.docs.forEach((d) => map.set(d.id, d.data() as WebsiteListing));

      return Array.from(map.values()).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'listings');
    }
  },

  async saveListing(listing: Partial<WebsiteListing>): Promise<WebsiteListing> {
    const id = sanitizeId(listing.id || `web-${Date.now()}`, 'web');
    const docRef = doc(db, 'listings', id);
    const currentEmail = auth.currentUser?.email?.toLowerCase().trim() || '';

    try {
      const existingSnap = await getDoc(docRef);
      if (existingSnap.exists()) {
        const existingData = existingSnap.data() as WebsiteListing;
        const fullPayload = buildListingWritePayload(
          listing,
          id,
          existingData.createdAt || new Date().toISOString()
        );
        // Strip immutable keys so both Owner and Team Member updates pass security rules cleanly
        const { id: _id, createdAt: _createdAt, createdByEmail: _createdBy, ...updateFields } = fullPayload;
        await updateDoc(docRef, updateFields);
        return { ...existingData, ...updateFields, id, createdAt: existingData.createdAt } as WebsiteListing;
      }

      const fullPayload = buildListingWritePayload(
        listing,
        id,
        listing.createdAt || new Date().toISOString(),
        currentEmail || undefined
      );
      await setDoc(docRef, fullPayload);
      return fullPayload as WebsiteListing;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `listings/${id}`);
    }
  },

  async deleteListing(id: string): Promise<void> {
    const cleanId = sanitizeId(id, 'web');
    try {
      await deleteDoc(doc(db, 'listings', cleanId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `listings/${cleanId}`);
    }
  },

  // -------------------------------------------------------------
  // SETTINGS
  // -------------------------------------------------------------
  async savePublicSettings(settings: PublicSettings): Promise<PublicSettings> {
    const payload = buildSettingsPayload(settings);
    try {
      await setDoc(doc(db, 'settings', 'public'), payload);
      return payload as PublicSettings;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'settings/public');
    }
  },

  // -------------------------------------------------------------
  // FAQs & CATEGORIES
  // -------------------------------------------------------------
  async saveFaq(faq: Partial<FAQItem>): Promise<FAQItem> {
    const id = sanitizeId(faq.id || `faq-${Date.now()}`, 'faq');
    const payload: FAQItem = {
      id,
      question: clampString(faq.question || '', 500),
      answer: clampString(faq.answer || '', 5000),
      category: clampString(faq.category || 'General', 100)
    };
    try {
      await setDoc(doc(db, 'faqs', id), payload);
      return payload;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `faqs/${id}`);
    }
  },

  async deleteFaq(id: string): Promise<void> {
    const cleanId = sanitizeId(id, 'faq');
    try {
      await deleteDoc(doc(db, 'faqs', cleanId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `faqs/${cleanId}`);
    }
  },

  async addCategory(name: string): Promise<string[]> {
    const cleanName = clampString(name.trim(), 100);
    const id = sanitizeId(cleanName.toLowerCase(), `cat-${Date.now()}`);
    try {
      await setDoc(doc(db, 'categories', id), {
        id,
        name: cleanName,
        order: Date.now()
      });
      return await this.getCategories();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `categories/${id}`);
    }
  },

  async deleteCategory(name: string): Promise<string[]> {
    try {
      const snap = await getDocs(collection(db, 'categories'));
      const match = snap.docs.find((d) => (d.data() as any).name === name);
      if (match) {
        await deleteDoc(doc(db, 'categories', match.id));
      }
      return await this.getCategories();
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'categories');
    }
  },

  // -------------------------------------------------------------
  // INQUIRIES (PUBLIC CREATE, OWNER READ/UPDATE/DELETE)
  // -------------------------------------------------------------
  async createInquiry(input: Partial<CustomInquiry>): Promise<CustomInquiry> {
    const id = sanitizeId(`INQ-${Math.floor(10000 + Math.random() * 90000)}`, 'INQ');
    const payload: CustomInquiry = {
      id,
      fullName: clampString((input.fullName || '').trim(), 200),
      email: clampString((input.email || '').trim().toLowerCase(), 200),
      businessName: clampString((input.businessName || 'General Inquiry').trim(), 200),
      country: clampString((input.country || 'International').trim(), 100),
      websiteType: clampString((input.websiteType || 'General Consultation').trim(), 150),
      requiredFeatures: cleanStringArray(input.requiredFeatures, 30, 120),
      budgetRange: clampString((input.budgetRange || 'Flexible').trim(), 100),
      desiredCompletionDate: clampString((input.desiredCompletionDate || '').trim(), 100),
      referenceUrl: clampString((input.referenceUrl || '').trim(), 1000),
      projectDescription: clampString((input.projectDescription || '').trim(), 5000),
      status: 'New',
      adminNotes: '',
      createdAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, 'inquiries', id), payload);
      return payload;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `inquiries/${id}`);
    }
  },

  async getInquiries(): Promise<CustomInquiry[]> {
    try {
      const snap = await getDocs(collection(db, 'inquiries'));
      return snap.docs
        .map((d) => d.data() as CustomInquiry)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'inquiries');
    }
  },

  async updateInquiry(id: string, status: CustomInquiry['status'], adminNotes?: string): Promise<void> {
    const cleanId = sanitizeId(id, 'INQ');
    const updates: Record<string, any> = { status };
    if (adminNotes !== undefined) {
      updates.adminNotes = clampString(adminNotes, 3000);
    }
    try {
      await updateDoc(doc(db, 'inquiries', cleanId), updates);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `inquiries/${cleanId}`);
    }
  },

  async deleteInquiry(id: string): Promise<void> {
    const cleanId = sanitizeId(id, 'INQ');
    try {
      await deleteDoc(doc(db, 'inquiries', cleanId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `inquiries/${cleanId}`);
    }
  },

  // -------------------------------------------------------------
  // ORDERS (PUBLIC ATOMIC CREATE + ORDER STATUS TRACKING, OWNER MANAGE)
  // -------------------------------------------------------------
  async createOrder(input: Partial<PurchaseOrder>): Promise<PurchaseOrder> {
    const orderNumber = sanitizeId(
      `ORD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      'ORD'
    );
    const createdAt = new Date().toISOString();

    const privateOrder: Record<string, any> = {
      orderNumber,
      websiteId: clampString(input.websiteId || 'unknown', 128),
      websiteTitle: clampString(input.websiteTitle || 'Website Package', 250),
      amount: Math.max(0, Math.min(100000000, Number(input.amount) || 0)),
      currency: clampString(input.currency || 'PKR', 10),
      customerName: clampString((input.customerName || '').trim(), 200),
      customerEmail: clampString((input.customerEmail || '').trim().toLowerCase(), 200),
      customerPhone: clampString((input.customerPhone || '').trim(), 50),
      customerCountry: clampString((input.customerCountry || 'International').trim(), 100),
      licenseType: clampString(input.licenseType || 'Single Commercial License', 120),
      preferredPaymentMethod: clampString(input.preferredPaymentMethod || 'Bank Transfer', 120),
      customizationAddons: cleanStringArray(input.customizationAddons, 20, 200),
      customerNotes: clampString(input.customerNotes || '', 2000),
      paymentStatus: 'Pending Verification',
      deliveryStatus: 'Preparing Package',
      createdAt
    };

    const publicStatus: Record<string, any> = {
      orderNumber,
      websiteTitle: privateOrder.websiteTitle,
      amount: privateOrder.amount,
      currency: privateOrder.currency,
      licenseType: privateOrder.licenseType,
      preferredPaymentMethod: privateOrder.preferredPaymentMethod,
      paymentStatus: 'Pending Verification',
      deliveryStatus: 'Preparing Package',
      createdAt
    };

    try {
      const batch = writeBatch(db);
      batch.set(doc(db, 'orders', orderNumber), privateOrder);
      batch.set(doc(db, 'orderStatuses', orderNumber), publicStatus);
      await batch.commit();
      return privateOrder as PurchaseOrder;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `orders/${orderNumber}`);
    }
  },

  async lookupOrderStatus(orderNumber: string): Promise<any | null> {
    const cleanId = sanitizeId(orderNumber.trim().toUpperCase(), 'ORD');
    try {
      const snap = await getDoc(doc(db, 'orderStatuses', cleanId));
      if (!snap.exists()) return null;
      const data = snap.data();
      return {
        ...data,
        downloadLink:
          data.paymentStatus === 'Verified & Paid' && data.deliveryStatus === 'Delivered'
            ? data.downloadLink
            : undefined,
        deliveryPackageNotes:
          data.paymentStatus === 'Verified & Paid' ? data.deliveryPackageNotes : undefined
      };
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `orderStatuses/${cleanId}`);
    }
  },

  async getOrders(): Promise<PurchaseOrder[]> {
    try {
      const snap = await getDocs(collection(db, 'orders'));
      return snap.docs
        .map((d) => d.data() as PurchaseOrder)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'orders');
    }
  },

  async updateOrder(
    orderNumber: string,
    updates: {
      paymentStatus?: PurchaseOrder['paymentStatus'];
      deliveryStatus?: PurchaseOrder['deliveryStatus'];
      downloadLink?: string;
      deliveryPackageNotes?: string;
    }
  ): Promise<void> {
    const cleanId = sanitizeId(orderNumber, 'ORD');
    const cleanUpdates: Record<string, any> = {};
    if (updates.paymentStatus !== undefined) cleanUpdates.paymentStatus = updates.paymentStatus;
    if (updates.deliveryStatus !== undefined) cleanUpdates.deliveryStatus = updates.deliveryStatus;
    if (updates.downloadLink !== undefined) cleanUpdates.downloadLink = clampString(updates.downloadLink, 2000);
    if (updates.deliveryPackageNotes !== undefined) {
      cleanUpdates.deliveryPackageNotes = clampString(updates.deliveryPackageNotes, 2000);
    }

    try {
      const batch = writeBatch(db);
      batch.update(doc(db, 'orders', cleanId), cleanUpdates);
      batch.update(doc(db, 'orderStatuses', cleanId), cleanUpdates);
      await batch.commit();
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `orders/${cleanId}`);
    }
  },

  // -------------------------------------------------------------
  // TEAM MEMBERS
  // -------------------------------------------------------------
  async isInvitedTeamMember(email: string): Promise<boolean> {
    const cleanEmail = email.toLowerCase().trim();
    const id = teamMemberDocId(cleanEmail);
    try {
      const snap = await getDoc(doc(db, 'teamMembers', id));
      return snap.exists() && snap.data()?.email === cleanEmail;
    } catch {
      return false;
    }
  },

  async getTeamMembers(): Promise<TeamMember[]> {
    try {
      const snap = await getDocs(collection(db, 'teamMembers'));
      return snap.docs.map((d) => d.data() as TeamMember);
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'teamMembers');
    }
  },

  async addTeamMember(email: string, name: string, addedBy: string): Promise<TeamMember> {
    const cleanEmail = clampString(email.toLowerCase().trim(), 200);
    const id = teamMemberDocId(cleanEmail);
    const member: TeamMember = {
      id,
      email: cleanEmail,
      name: clampString((name || cleanEmail.split('@')[0]).trim(), 120),
      role: 'member',
      addedAt: new Date().toISOString(),
      addedBy: clampString(addedBy.toLowerCase().trim(), 200)
    };
    try {
      await setDoc(doc(db, 'teamMembers', id), member);
      return member;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `teamMembers/${id}`);
    }
  },

  async removeTeamMember(id: string): Promise<void> {
    const cleanId = sanitizeId(id, 'team');
    try {
      await deleteDoc(doc(db, 'teamMembers', cleanId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `teamMembers/${cleanId}`);
    }
  }
};

export async function compressImageFileToDataUrl(file: File, maxWidth = 1200, quality = 0.78): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.onload = () => {
      const rawUrl = reader.result as string;
      const img = new Image();
      img.onerror = () => resolve(rawUrl);
      img.onload = () => {
        const scale = img.width > maxWidth ? maxWidth / img.width : 1;
        const width = Math.round(img.width * scale);
        const height = Math.round(img.height * scale);
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(rawUrl);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const compressed = canvas.toDataURL('image/jpeg', quality);
        resolve(compressed.length < rawUrl.length ? compressed : rawUrl);
      };
      img.src = rawUrl;
    };
    reader.readAsDataURL(file);
  });
}
