// Image URL resolution and professional SVG fallback generator for Smart Developer

export function resolveImageUrl(url?: string): string {
  if (!url || typeof url !== 'string' || !url.trim()) {
    return '';
  }

  const clean = url.trim();

  // Normalize legacy /src/assets/images/ to /assets/images/
  if (clean.startsWith('/src/assets/images/')) {
    return clean.replace('/src/assets/images/', '/assets/images/');
  }

  // Normalize relative src/assets/images/
  if (clean.startsWith('src/assets/images/')) {
    return '/' + clean.replace('src/assets/images/', 'assets/images/');
  }

  return clean;
}

// Generate high-fidelity SVG preview placeholder for missing/loading demo website images
export function getCategoryPlaceholderSvg(category: string = 'Website', title: string = 'Demo Showcase'): string {
  const safeCategory = (category || 'Custom Website').toUpperCase();
  const safeTitle = (title || 'Smart Developer Project').replace(/[<>&"]/g, '');

  let gradientStart = '#1e3a8a'; // Blue
  let gradientEnd = '#3b82f6';
  let badgeBg = '#1d4ed8';
  let iconSymbol = '⚡';

  if (safeCategory.includes('COMMERCE') || safeCategory.includes('STORE')) {
    gradientStart = '#0f172a';
    gradientEnd = '#0284c7';
    badgeBg = '#0369a1';
    iconSymbol = '🛍️';
  } else if (safeCategory.includes('REAL ESTATE') || safeCategory.includes('ESTATE')) {
    gradientStart = '#111827';
    gradientEnd = '#059669';
    badgeBg = '#047857';
    iconSymbol = '🏛️';
  } else if (safeCategory.includes('FASHION') || safeCategory.includes('CLOTHING')) {
    gradientStart = '#18181b';
    gradientEnd = '#9333ea';
    badgeBg = '#7e22ce';
    iconSymbol = '✨';
  } else if (safeCategory.includes('SAAS') || safeCategory.includes('APPLICATION')) {
    gradientStart = '#090d16';
    gradientEnd = '#2563eb';
    badgeBg = '#1d4ed8';
    iconSymbol = '📊';
  } else if (safeCategory.includes('BEAUTY') || safeCategory.includes('COSMETICS')) {
    gradientStart = '#1f131a';
    gradientEnd = '#e11d48';
    badgeBg = '#be123c';
    iconSymbol = '🌸';
  } else if (safeCategory.includes('PORTFOLIO')) {
    gradientStart = '#0f172a';
    gradientEnd = '#4f46e5';
    badgeBg = '#4338ca';
    iconSymbol = '💼';
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="100%" height="100%">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${gradientStart}"/>
        <stop offset="50%" stop-color="#0b0f19"/>
        <stop offset="100%" stop-color="${gradientEnd}"/>
      </linearGradient>
      <linearGradient id="cardGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#1e2438"/>
        <stop offset="100%" stop-color="#111625"/>
      </linearGradient>
    </defs>
    <rect width="800" height="500" fill="url(#bg)"/>
    <g opacity="0.08">
      <path d="M0,50 Q200,10 400,50 T800,50" fill="none" stroke="#ffffff" stroke-width="2"/>
      <path d="M0,150 Q200,110 400,150 T800,150" fill="none" stroke="#ffffff" stroke-width="2"/>
      <path d="M0,250 Q200,210 400,250 T800,250" fill="none" stroke="#ffffff" stroke-width="2"/>
      <path d="M0,350 Q200,310 400,350 T800,350" fill="none" stroke="#ffffff" stroke-width="2"/>
    </g>
    <!-- Browser Window Chrome -->
    <rect x="70" y="55" width="660" height="390" rx="16" fill="url(#cardGrad)" stroke="#334155" stroke-width="2"/>
    <rect x="70" y="55" width="660" height="42" rx="16" fill="#141a29"/>
    <rect x="70" y="80" width="660" height="17" fill="#141a29"/>
    <!-- Window Control Dots -->
    <circle cx="98" cy="76" r="6" fill="#ef4444"/>
    <circle cx="118" cy="76" r="6" fill="#f59e0b"/>
    <circle cx="138" cy="76" r="6" fill="#10b981"/>
    <!-- Mock URL bar -->
    <rect x="180" y="65" width="360" height="22" rx="6" fill="#0b0f19" stroke="#1e293b"/>
    <text x="360" y="80" fill="#64748b" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" text-anchor="middle">smartdeveloper.demo/${safeCategory.toLowerCase().replace(/\s+/g, '-')}</text>
    <!-- Badge -->
    <rect x="110" y="130" width="160" height="28" rx="6" fill="${badgeBg}"/>
    <text x="190" y="148" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="700" font-size="11" text-anchor="middle" letter-spacing="1">${safeCategory}</text>
    <!-- Main Title -->
    <text x="110" y="210" fill="#f8fafc" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="800" font-size="24">${safeTitle.slice(0, 32)}</text>
    <!-- Subtitle / Spec -->
    <text x="110" y="245" fill="#94a3b8" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14">Interactive Live Preview &amp; Source Code Ready</text>
    <!-- Mock Feature Cards -->
    <rect x="110" y="280" width="170" height="120" rx="10" fill="#0f172a" stroke="#1e293b"/>
    <text x="130" y="315" fill="#60a5fa" font-size="20">${iconSymbol}</text>
    <text x="130" y="345" fill="#f1f5f9" font-family="sans-serif" font-size="12" font-weight="600">Responsive UI</text>
    <text x="130" y="365" fill="#64748b" font-family="sans-serif" font-size="10">Mobile, Tablet, Desktop</text>

    <rect x="300" y="280" width="170" height="120" rx="10" fill="#0f172a" stroke="#1e293b"/>
    <text x="320" y="315" fill="#34d399" font-size="20">⚡</text>
    <text x="320" y="345" fill="#f1f5f9" font-family="sans-serif" font-size="12" font-weight="600">React 19 + Vite</text>
    <text x="320" y="365" fill="#64748b" font-family="sans-serif" font-size="10">Clean Tailwind v4 Code</text>

    <rect x="490" y="280" width="170" height="120" rx="10" fill="#0f172a" stroke="#1e293b"/>
    <text x="510" y="315" fill="#a78bfa" font-size="20">📦</text>
    <text x="510" y="345" fill="#f1f5f9" font-family="sans-serif" font-size="12" font-weight="600">Production Ready</text>
    <text x="510" y="365" fill="#64748b" font-family="sans-serif" font-size="10">ZIP Package &amp; Support</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
