// Production-ready resilient API fetcher for Smart Developer
// Eliminates "Unexpected end of JSON input" and safely handles non-JSON / HTML / offline responses

export interface SafeFetchResult<T> {
  ok: boolean;
  status: number;
  data: T | null;
  error?: string;
  isJson: boolean;
}

export async function safeFetchJson<T = any>(
  url: string,
  options?: RequestInit
): Promise<SafeFetchResult<T>> {
  try {
    const res = await fetch(url, options);
    const contentType = res.headers.get('content-type') || '';
    const text = await res.text();

    if (!text || !text.trim()) {
      return {
        ok: res.ok,
        status: res.status,
        data: null,
        isJson: false,
        error: res.ok ? undefined : `Request returned empty response (HTTP ${res.status})`
      };
    }

    const trimmed = text.trim();
    const isJson =
      contentType.includes('application/json') ||
      trimmed.startsWith('{') ||
      trimmed.startsWith('[');

    if (!isJson) {
      return {
        ok: false,
        status: res.status,
        data: null,
        isJson: false,
        error: `Server returned non-JSON response (${res.status} ${res.statusText || 'Static Fallback'}). Check backend route / Cloudflare functions.`
      };
    }

    try {
      const parsed = JSON.parse(trimmed) as T;
      const errorMsg = !res.ok
        ? ((parsed as any)?.error || (parsed as any)?.message || `Request failed with HTTP ${res.status}`)
        : undefined;

      return {
        ok: res.ok,
        status: res.status,
        data: parsed,
        isJson: true,
        error: errorMsg
      };
    } catch (parseErr: any) {
      return {
        ok: false,
        status: res.status,
        data: null,
        isJson: false,
        error: `Invalid JSON received from server: ${parseErr.message}`
      };
    }
  } catch (netErr: any) {
    return {
      ok: false,
      status: 0,
      data: null,
      isJson: false,
      error: netErr.message || 'Network connection failed'
    };
  }
}
