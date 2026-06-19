import { CRMData } from './types';
import { INITIAL_MOCK_DATA } from './mockData';

const LOCAL_STORAGE_KEY = 'crm_portal_data_v1';

export function loadCRMData(): CRMData {
  try {
    const serialized = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!serialized) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_MOCK_DATA));
      return INITIAL_MOCK_DATA;
    }
    const parsed = JSON.parse(serialized);
    
    // Auto-merge new high-fidelity bot rules that might be missing from older client states
    let loadedRules = parsed.botRules || [];
    if (loadedRules.length > 0) {
      const existingIds = new Set(loadedRules.map((r: any) => r.id));
      INITIAL_MOCK_DATA.botRules.forEach((rule) => {
        if (!existingIds.has(rule.id)) {
          loadedRules.push(rule);
        }
      });
    } else {
      loadedRules = INITIAL_MOCK_DATA.botRules;
    }
    
    // Ensure nested fields are present
    return {
      customers: parsed.customers || [],
      files: parsed.files || [],
      messages: parsed.messages || [],
      appointments: parsed.appointments || [],
      botRules: loadedRules,
      unresolvedQueries: parsed.unresolvedQueries || [],
      invoices: parsed.invoices || INITIAL_MOCK_DATA.invoices || [],
      customTemplates: parsed.customTemplates || INITIAL_MOCK_DATA.customTemplates || [],
      products: parsed.products || INITIAL_MOCK_DATA.products || [],
      orders: parsed.orders || INITIAL_MOCK_DATA.orders || [],
      blogPosts: parsed.blogPosts || INITIAL_MOCK_DATA.blogPosts || [],
      settings: parsed.settings || {
        activeTemplateId: 'marketing',
        cookieConsentRequired: false,
        gdprLoggingEnabled: true,
        shopEnabled: true,
        blogEnabled: true,
        appointmentsEnabled: true,
        invoicesEnabled: true,
        videosEnabled: true,
        botEnabled: true,
        chatEnabled: true,
        companyName: 'Aura Suite Enterprise',
        companyAddress: 'Musterstraße 1, 80331 München',
        companyEmail: 'support@aura-suite.de',
        companyPhone: '+49 123 456789',
        iban: 'DE49 7835 1520 1883 1941 12',
        bic: 'BYLADEM1LIC',
        taxId: 'DE 123456789'
      }
    };
  } catch (error) {
    console.error('Error loading CRM portal data', error);
    return INITIAL_MOCK_DATA;
  }
}

export function saveCRMData(data: CRMData): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving CRM portal data', error);
  }
}

// Pure JS SHA-256 implementation that works everywhere (even in insecure HTTP contexts)
function sha256Sync(password: string): string {
  function rotateRight(n: number, x: number) {
    return (x >>> n) | (x << (32 - n));
  }
  
  const K = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
  ];

  let H = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
  ];

  const bytes = [];
  for (let i = 0; i < password.length; i++) {
    const ch = password.charCodeAt(i);
    if (ch < 128) {
      bytes.push(ch);
    } else if (ch < 2048) {
      bytes.push(0xc0 | (ch >> 6), 0x80 | (ch & 0x3f));
    } else if (ch < 65536) {
      bytes.push(0xe0 | (ch >> 12), 0x80 | ((ch >> 6) & 0x3f), 0x80 | (ch & 0x3f));
    } else {
      bytes.push(0xf0 | (ch >> 18), 0x80 | ((ch >> 12) & 0x3f), 0x80 | ((ch >> 6) & 0x3f), 0x80 | (ch & 0x3f));
    }
  }

  const l = bytes.length;
  bytes.push(0x80);
  while ((bytes.length + 8) % 64 !== 0) {
    bytes.push(0x00);
  }

  const bits = l * 8;
  bytes.push(0, 0, 0, 0); // High bits
  bytes.push(
    (bits >>> 24) & 0xff,
    (bits >>> 16) & 0xff,
    (bits >>> 8) & 0xff,
    bits & 0xff
  );

  for (let i = 0; i < bytes.length; i += 64) {
    const W = new Int32Array(64);
    for (let t = 0; t < 16; t++) {
      W[t] = (bytes[i + t * 4] << 24) |
             (bytes[i + t * 4 + 1] << 16) |
             (bytes[i + t * 4 + 2] << 8) |
             (bytes[i + t * 4 + 3]);
    }
    for (let t = 16; t < 64; t++) {
      const s0 = rotateRight(7, W[t - 15]) ^ rotateRight(18, W[t - 15]) ^ (W[t - 15] >>> 3);
      const s1 = rotateRight(17, W[t - 2]) ^ rotateRight(19, W[t - 2]) ^ (W[t - 2] >>> 10);
      W[t] = (W[t - 16] + s0 + W[t - 7] + s1) | 0;
    }

    let [a, b, c, d, e, f, g, h] = H;

    for (let t = 0; t < 64; t++) {
      const S1 = rotateRight(6, e) ^ rotateRight(11, e) ^ rotateRight(25, e);
      const ch = (e & f) ^ (~e & g);
      const temp1 = (h + S1 + ch + K[t] + W[t]) | 0;
      const S0 = rotateRight(2, a) ^ rotateRight(13, a) ^ rotateRight(22, a);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (S0 + maj) | 0;

      h = g;
      g = f;
      f = e;
      e = (d + temp1) | 0;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) | 0;
    }

    H[0] = (H[0] + a) | 0;
    H[1] = (H[1] + b) | 0;
    H[2] = (H[2] + c) | 0;
    H[3] = (H[3] + d) | 0;
    H[4] = (H[4] + e) | 0;
    H[5] = (H[5] + f) | 0;
    H[6] = (H[6] + g) | 0;
    H[7] = (H[7] + h) | 0;
  }

  return H.map(val => {
    const hex = (val >>> 0).toString(16);
    return '00000000'.substring(hex.length) + hex;
  }).join('');
}

// Browser-native wrapper with automatic 100% matching offline-friendly fallback
export async function hashPassword(password: string): Promise<string> {
  try {
    return sha256Sync(password);
  } catch (error) {
    console.warn('Hash error, using fallback');
    return sha256Sync(password);
  }
}

export async function fetchServerCRMData(): Promise<CRMData> {
  const res = await fetch('/api/crm-data');
  if (!res.ok) {
    throw new Error('Failed to load CRM data from server');
  }
  return res.json();
}

export async function saveServerCRMData(data: CRMData): Promise<void> {
  const res = await fetch('/api/crm-data', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    throw new Error('Failed to save CRM data to server');
  }
}

