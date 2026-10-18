import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { db } from './src/server/db.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Auth middleware for Admin API
const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization || (req.headers['x-admin-token'] as string);
  const token = authHeader ? authHeader.replace(/^Bearer\s+/i, '').trim() : '';

  if (!token || !db.validateSessionToken(token)) {
    res.status(401).json({ error: 'Unauthorized: Invalid or expired admin credentials' });
    return;
  }
  next();
};

// -------------------------------------------------------------
// PUBLIC API ENDPOINTS
// -------------------------------------------------------------

// Get published listings
app.get('/api/listings', (_req: Request, res: Response) => {
  try {
    const listings = db.getListings(true);
    res.json({ success: true, listings });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch listings' });
  }
});

// Get single listing by id or slug
app.get('/api/listings/:id', (req: Request, res: Response) => {
  try {
    const listing = db.getListingById(req.params.id);
    if (!listing) {
      res.status(404).json({ error: 'Website listing not found' });
      return;
    }
    res.json({ success: true, listing });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch listing' });
  }
});

// Get public settings
app.get('/api/settings', (_req: Request, res: Response) => {
  try {
    const settings = db.getPublicSettings();
    res.json({ success: true, settings });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch settings' });
  }
});

// Get FAQs
app.get('/api/faqs', (_req: Request, res: Response) => {
  try {
    const faqs = db.getFAQs();
    res.json({ success: true, faqs });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch FAQs' });
  }
});

// Get Categories
app.get('/api/categories', (_req: Request, res: Response) => {
  try {
    const categories = db.getCategories();
    res.json({ success: true, categories });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch categories' });
  }
});

// Submit Custom Development Inquiry
app.post('/api/inquiries', (req: Request, res: Response) => {
  try {
    const {
      fullName,
      email,
      businessName,
      country,
      websiteType,
      requiredFeatures,
      budgetRange,
      desiredCompletionDate,
      referenceUrl,
      projectDescription
    } = req.body;

    if (!fullName || !email || !businessName || !country || !websiteType || !projectDescription) {
      res.status(400).json({
        error: 'Missing required fields. Please fill out all required details.'
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ error: 'Please enter a valid email address.' });
      return;
    }

    const inquiry = db.addInquiry({
      fullName: String(fullName).trim(),
      email: String(email).trim().toLowerCase(),
      businessName: String(businessName).trim(),
      country: String(country).trim(),
      websiteType: String(websiteType).trim(),
      requiredFeatures: Array.isArray(requiredFeatures) ? requiredFeatures : [],
      budgetRange: String(budgetRange || 'Flexible').trim(),
      desiredCompletionDate: String(desiredCompletionDate || 'Standard turnaround').trim(),
      referenceUrl: referenceUrl ? String(referenceUrl).trim() : '',
      projectDescription: String(projectDescription).trim()
    });

    res.status(201).json({
      success: true,
      message: 'Your custom website inquiry has been safely received. Our development lead will review your project requirements and follow up within 4 to 12 hours.',
      inquiry
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to save inquiry.' });
  }
});

// Submit Purchase Request / Buy Source Code Order
app.post('/api/orders', (req: Request, res: Response) => {
  try {
    const {
      websiteId,
      websiteTitle,
      amount,
      currency,
      customerName,
      customerEmail,
      customerPhone,
      customerCountry,
      licenseType,
      preferredPaymentMethod,
      customizationAddons,
      customerNotes
    } = req.body;

    if (!websiteId || !websiteTitle || !customerName || !customerEmail || !customerCountry || !preferredPaymentMethod) {
      res.status(400).json({
        error: 'Please fill out all required order details.'
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
      res.status(400).json({ error: 'Please enter a valid email address for delivery.' });
      return;
    }

    const order = db.addOrder({
      websiteId: String(websiteId),
      websiteTitle: String(websiteTitle),
      amount: Number(amount) || 0,
      currency: String(currency || 'USD'),
      customerName: String(customerName).trim(),
      customerEmail: String(customerEmail).trim().toLowerCase(),
      customerPhone: customerPhone ? String(customerPhone).trim() : undefined,
      customerCountry: String(customerCountry).trim(),
      licenseType: String(licenseType || 'Single Commercial License'),
      preferredPaymentMethod: String(preferredPaymentMethod),
      customizationAddons: Array.isArray(customizationAddons) ? customizationAddons : [],
      customerNotes: customerNotes ? String(customerNotes).trim() : undefined
    });

    res.status(201).json({
      success: true,
      message: 'Your order request has been registered. You will receive an official invoice and payment confirmation instructions shortly.',
      order
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to submit purchase order.' });
  }
});

// Check Order Status by Reference Number
app.get('/api/orders/:orderNumber', (req: Request, res: Response) => {
  try {
    const orders = db.getOrders();
    const order = orders.find(
      (o) => o.orderNumber.toUpperCase() === req.params.orderNumber.toUpperCase()
    );
    if (!order) {
      res.status(404).json({ error: 'Order reference not found' });
      return;
    }

    // Return sanitized status
    res.json({
      success: true,
      order: {
        orderNumber: order.orderNumber,
        websiteTitle: order.websiteTitle,
        amount: order.amount,
        currency: order.currency,
        paymentStatus: order.paymentStatus,
        deliveryStatus: order.deliveryStatus,
        preferredPaymentMethod: order.preferredPaymentMethod,
        licenseType: order.licenseType,
        createdAt: order.createdAt,
        // Only disclose download link if verified and delivered!
        downloadLink: order.paymentStatus === 'Verified & Paid' && order.deliveryStatus === 'Delivered' ? order.downloadLink : undefined,
        deliveryPackageNotes: order.paymentStatus === 'Verified & Paid' ? order.deliveryPackageNotes : undefined
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to look up order' });
  }
});

// -------------------------------------------------------------
// ADMIN API ENDPOINTS (PROTECTED)
// -------------------------------------------------------------

// Admin Login
app.post('/api/admin/login', (req: Request, res: Response) => {
  try {
    const { password } = req.body;
    if (!password) {
      res.status(400).json({ error: 'Password is required' });
      return;
    }

    if (db.verifyPassword(password)) {
      const token = db.generateSessionToken();
      res.json({
        success: true,
        token,
        message: 'Admin authorization successful'
      });
    } else {
      res.status(401).json({ error: 'Invalid administrator credentials' });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Authentication failed' });
  }
});

// Admin Google Authentication (Restricted to Authorized Admin Email)
app.post('/api/admin/google-login', (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ error: 'Google email is required' });
      return;
    }

    const cleanEmail = String(email).toLowerCase().trim();
    if (db.isAuthorizedAdminEmail(cleanEmail)) {
      const token = db.generateSessionToken();
      res.json({
        success: true,
        token,
        email: cleanEmail,
        message: 'Authorized Administrator verified via Google Sign-In'
      });
    } else {
      res.status(403).json({
        error: `Access Denied: Google Account "${cleanEmail}" is not an authorized administrator. Only authorized admin emails (umairkamboh953@gmail.com / smartbuy9@gmail.com) can access the Smart Developer dashboard.`
      });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Google authentication failed' });
  }
});

// Check Auth status
app.get('/api/admin/check-auth', requireAdmin, (_req: Request, res: Response) => {
  res.json({ success: true, authorized: true });
});

// Get all listings for admin (including drafts)
app.get('/api/admin/listings', requireAdmin, (_req: Request, res: Response) => {
  try {
    const listings = db.getListings(false);
    res.json({ success: true, listings });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Save or create listing
app.post('/api/admin/listings', requireAdmin, (req: Request, res: Response) => {
  try {
    const saved = db.saveListing(req.body);
    res.json({ success: true, listing: saved });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Delete listing
app.delete('/api/admin/listings/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const success = db.deleteListing(req.params.id);
    res.json({ success });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Get all inquiries
app.get('/api/admin/inquiries', requireAdmin, (_req: Request, res: Response) => {
  try {
    const inquiries = db.getInquiries();
    res.json({ success: true, inquiries });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Update inquiry status
app.patch('/api/admin/inquiries/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const { status, adminNotes } = req.body;
    const updated = db.updateInquiryStatus(req.params.id, status, adminNotes);
    if (!updated) {
      res.status(404).json({ error: 'Inquiry not found' });
      return;
    }
    res.json({ success: true, inquiry: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Delete inquiry
app.delete('/api/admin/inquiries/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const success = db.deleteInquiry(req.params.id);
    res.json({ success });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Get all orders
app.get('/api/admin/orders', requireAdmin, (_req: Request, res: Response) => {
  try {
    const orders = db.getOrders();
    res.json({ success: true, orders });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Update order status
app.patch('/api/admin/orders/:orderNumber', requireAdmin, (req: Request, res: Response) => {
  try {
    const { paymentStatus, deliveryStatus, deliveryPackageNotes, downloadLink } = req.body;
    const updated = db.updateOrderStatus(req.params.orderNumber, {
      paymentStatus,
      deliveryStatus,
      deliveryPackageNotes,
      downloadLink
    });
    if (!updated) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }
    res.json({ success: true, order: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Full settings
app.get('/api/admin/settings', requireAdmin, (_req: Request, res: Response) => {
  try {
    const full = db.getFullSettings();
    res.json({
      success: true,
      settings: {
        businessEmail: full.businessEmail,
        whatsappNumber: full.whatsappNumber,
        whatsappEnabled: full.whatsappEnabled,
        showStatistics: full.showStatistics,
        completedProjectsCount: full.completedProjectsCount,
        socialLinks: full.socialLinks
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Update settings
app.post('/api/admin/settings', requireAdmin, (req: Request, res: Response) => {
  try {
    const updated = db.updateSettings(req.body);
    res.json({ success: true, settings: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Change admin password
app.post('/api/admin/change-password', requireAdmin, (req: Request, res: Response) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters long' });
      return;
    }
    db.changePassword(newPassword);
    res.json({ success: true, message: 'Password updated successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Save FAQ
app.post('/api/admin/faqs', requireAdmin, (req: Request, res: Response) => {
  try {
    const saved = db.saveFAQ(req.body);
    res.json({ success: true, faq: saved });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Delete FAQ
app.delete('/api/admin/faqs/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const success = db.deleteFAQ(req.params.id);
    res.json({ success });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Admin Manage Categories
app.post('/api/admin/categories', requireAdmin, (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    if (!name) {
      res.status(400).json({ error: 'Category name is required' });
      return;
    }
    const categories = db.addCategory(name);
    res.json({ success: true, categories });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/categories/:name', requireAdmin, (req: Request, res: Response) => {
  try {
    const success = db.deleteCategory(req.params.name);
    res.json({ success, categories: db.getCategories() });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Admin Image Upload Handler (accepts base64 or data URLs for thumbnails and screenshots)
app.post('/api/admin/upload-image', requireAdmin, (req: Request, res: Response) => {
  try {
    const { dataUrl, filename } = req.body;
    if (!dataUrl) {
      res.status(400).json({ error: 'Image data is required' });
      return;
    }

    // In-memory or filesystem upload directory
    const uploadsDir = path.resolve(__dirname, 'data', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // If it's a data URL, extract format and buffer
    const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (matches && matches.length === 3) {
      const ext = matches[1].split('/')[1] || 'png';
      const safeName = `upload_${Date.now()}_${Math.floor(Math.random() * 1000)}.${ext}`;
      const filePath = path.join(uploadsDir, safeName);
      fs.writeFileSync(filePath, Buffer.from(matches[2], 'base64'));

      // Serve via static or dataUrl directly
      res.json({ success: true, url: dataUrl });
    } else {
      res.json({ success: true, url: dataUrl });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Image upload failed' });
  }
});

// -------------------------------------------------------------
// VITE DEV SERVER / STATIC HANDLER
// -------------------------------------------------------------
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Smart Developer] Full-stack Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
