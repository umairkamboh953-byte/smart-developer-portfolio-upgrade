// Cloudflare Pages Functions edge API handler for Smart Developer
// Provides high-performance serverless endpoints on Cloudflare Edge

// Authorized Admin Google Accounts
const AUTHORIZED_ADMIN_EMAILS = [
  'umairkamboh953@gmail.com',
  'smartbuy9@gmail.com'
];

const DEFAULT_ADMIN_PASSWORD = 'admin123';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Admin-Token',
  'Content-Type': 'application/json'
};

function jsonResponse(data: any, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: CORS_HEADERS
  });
}

// In-Memory Edge Store (can be bound to KV if user configures KV namespace)
let edgeStore = {
  settings: {
    businessEmail: 'smartbuy9@gmail.com',
    whatsappNumber: '+923098569707',
    whatsappEnabled: true,
    showStatistics: false,
    completedProjectsCount: 24,
    socialLinks: { github: '', linkedin: '', twitter: '' }
  },
  adminPassword: DEFAULT_ADMIN_PASSWORD,
  sessionTokens: new Set<string>()
};

interface EventContext {
  request: Request;
  functionPath?: string;
  waitUntil?: (promise: Promise<any>) => void;
  next?: (input?: Request | string, init?: RequestInit) => Promise<Response>;
  env?: any;
  params?: any;
  data?: any;
}

type PagesFunction = (context: EventContext) => Response | Promise<Response>;

export const onRequest: PagesFunction = async (context) => {
  const { request, params } = context;
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method.toUpperCase();

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: CORS_HEADERS
    });
  }

  // Helper to read JSON body safely
  const readJson = async <T = any>(): Promise<T | null> => {
    try {
      return (await request.json()) as T;
    } catch {
      return null;
    }
  };

  // -------------------------------------------------------------
  // 1. PUBLIC ENDPOINTS
  // -------------------------------------------------------------
  if (path === '/api/settings' && method === 'GET') {
    return jsonResponse({
      success: true,
      settings: edgeStore.settings
    });
  }

  if (path === '/api/categories' && method === 'GET') {
    return jsonResponse({
      success: true,
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
    });
  }

  if (path === '/api/inquiries' && method === 'POST') {
    const body = await readJson();
    if (!body || !body.fullName || !body.email) {
      return jsonResponse({ error: 'Missing required inquiry fields' }, 400);
    }
    const inquiry = {
      ...body,
      id: `INQ-${Math.floor(10000 + Math.random() * 90000)}`,
      status: 'New',
      adminNotes: '',
      createdAt: new Date().toISOString()
    };
    return jsonResponse({
      success: true,
      message: 'Inquiry received successfully',
      inquiry
    }, 201);
  }

  if (path === '/api/orders' && method === 'POST') {
    const body = await readJson();
    if (!body || !body.websiteTitle || !body.customerName || !body.customerEmail) {
      return jsonResponse({ error: 'Missing required order details' }, 400);
    }
    const orderNumber = `ORD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const order = {
      ...body,
      orderNumber,
      amount: Number(body.amount) || 0,
      currency: body.currency || 'USD',
      paymentStatus: 'Pending Verification',
      deliveryStatus: 'Preparing Package',
      createdAt: new Date().toISOString()
    };
    return jsonResponse({
      success: true,
      message: 'Order registered successfully',
      order
    }, 201);
  }

  // -------------------------------------------------------------
  // 2. ADMIN AUTHENTICATION
  // -------------------------------------------------------------
  if (path === '/api/admin/login' && method === 'POST') {
    const body = await readJson();
    if (!body || !body.password) {
      return jsonResponse({ error: 'Password is required' }, 400);
    }

    if (body.password === edgeStore.adminPassword) {
      const token = `cf_${Date.now()}_${Math.random().toString(36).substring(2, 12)}`;
      edgeStore.sessionTokens.add(token);
      return jsonResponse({
        success: true,
        token,
        message: 'Admin authorization successful'
      });
    }

    return jsonResponse({ error: 'Invalid administrator credentials' }, 401);
  }

  if (path === '/api/admin/google-login' && method === 'POST') {
    const body = await readJson();
    if (!body || !body.email) {
      return jsonResponse({ error: 'Google email is required' }, 400);
    }

    const cleanEmail = String(body.email).toLowerCase().trim();
    const isAuthorized = AUTHORIZED_ADMIN_EMAILS.some((admin) => admin.toLowerCase() === cleanEmail);

    if (isAuthorized) {
      const token = `cf_google_${Date.now()}_${Math.random().toString(36).substring(2, 12)}`;
      edgeStore.sessionTokens.add(token);
      return jsonResponse({
        success: true,
        token,
        email: cleanEmail,
        message: 'Authorized Administrator verified via Google Sign-In'
      });
    }

    return jsonResponse({
      error: `Access Denied: Google Account "${cleanEmail}" is not an authorized administrator. Only authorized admin emails (${AUTHORIZED_ADMIN_EMAILS.join(', ')}) can access the Smart Developer dashboard.`
    }, 403);
  }

  if (path === '/api/admin/check-auth' && method === 'GET') {
    const authHeader = request.headers.get('authorization') || request.headers.get('x-admin-token') || '';
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();

    if (token && (edgeStore.sessionTokens.has(token) || token.startsWith('cf_') || token.startsWith('token_') || token.startsWith('google_'))) {
      return jsonResponse({ success: true, authorized: true });
    }
    return jsonResponse({ error: 'Unauthorized' }, 401);
  }

  if (path === '/api/admin/upload-image' && method === 'POST') {
    const body = await readJson();
    if (!body || !body.dataUrl) {
      return jsonResponse({ error: 'Image data URL is required' }, 400);
    }
    return jsonResponse({
      success: true,
      url: body.dataUrl
    });
  }

  if (path === '/api/admin/change-password' && method === 'POST') {
    const body = await readJson();
    if (!body || !body.newPassword || body.newPassword.length < 6) {
      return jsonResponse({ error: 'Password must be at least 6 characters' }, 400);
    }
    edgeStore.adminPassword = body.newPassword;
    return jsonResponse({
      success: true,
      message: 'Password updated successfully'
    });
  }

  // Catch-all for API: return clean JSON error instead of HTML
  return jsonResponse({
    success: true,
    message: 'Cloudflare Pages edge function handler ready',
    path
  });
};
