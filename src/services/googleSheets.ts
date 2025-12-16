import { Coupon, RequestHistoryItem } from '../types';

// Get environment variables
const SPREADSHEET_ID = import.meta.env.VITE_GOOGLE_SHEETS_SPREADSHEET_ID;
const SERVICE_ACCOUNT_EMAIL = import.meta.env.VITE_GOOGLE_SERVICE_ACCOUNT_EMAIL;
const PRIVATE_KEY = import.meta.env.VITE_GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

// Sheet names
const COUPONS_SHEET = 'Coupons';
const STATE_SHEET = 'CouponState';
const HISTORY_SHEET = 'RequestHistory';

// Base URL for Google Sheets API
const API_BASE = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}`;

/**
 * Create a JWT for service account authentication
 */
async function getAuthToken(): Promise<string> {
  if (!SERVICE_ACCOUNT_EMAIL || !PRIVATE_KEY) {
    throw new Error('Service account credentials not configured');
  }

  // Create JWT header
  const header = {
    alg: 'RS256',
    typ: 'JWT'
  };

  // Create JWT claim set
  const now = Math.floor(Date.now() / 1000);
  const claim = {
    iss: SERVICE_ACCOUNT_EMAIL,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now
  };

  // Base64url encode without padding
  const base64urlEncode = (str: string) => {
    return btoa(str)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  };

  // Encode header and claim
  const encodedHeader = base64urlEncode(JSON.stringify(header));
  const encodedClaim = base64urlEncode(JSON.stringify(claim));

  // Import the private key using Web Crypto API
  const privateKeyPEM = PRIVATE_KEY;
  const privateKeyBase64 = privateKeyPEM
    .replace(/-----BEGIN PRIVATE KEY-----/g, '')
    .replace(/-----END PRIVATE KEY-----/g, '')
    .replace(/\s/g, '');

  // Convert base64 to binary
  const binaryDer = Uint8Array.from(atob(privateKeyBase64), c => c.charCodeAt(0));

  // Import the key
  const privateKey = await window.crypto.subtle.importKey(
    'pkcs8',
    binaryDer.buffer,
    {
      name: 'RSASSA-PKCS1-v1_5',
      hash: { name: 'SHA-256' },
    },
    false,
    ['sign']
  );

  // Create signature
  const data = new TextEncoder().encode(`${encodedHeader}.${encodedClaim}`);
  const signature = await window.crypto.subtle.sign('RSASSA-PKCS1-v1_5', privateKey, data);

  // Encode signature
  const encodedSignature = base64urlEncode(String.fromCharCode(...new Uint8Array(signature)));

  // Create JWT
  const jwt = `${encodedHeader}.${encodedClaim}.${encodedSignature}`;

  // Exchange JWT for access token
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`
  });

  if (!response.ok) {
    throw new Error('Failed to get access token');
  }

  const tokenData = await response.json();
  return tokenData.access_token;
}

/**
 * Helper to make authenticated API calls
 */
async function makeRequest(url: string, options: RequestInit = {}): Promise<Response> {
  const token = await getAuthToken();

  const response = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response;
}

/**
 * Fetch all coupon definitions from the Coupons sheet
 */
export async function fetchCoupons(): Promise<Coupon[]> {
  try {
    if (!SPREADSHEET_ID || !SERVICE_ACCOUNT_EMAIL || !PRIVATE_KEY) {
      throw new Error('Missing Google Sheets configuration');
    }

    // Fetch coupons
    const couponsResponse = await makeRequest(`${API_BASE}/values/${COUPONS_SHEET}!A:G`);
    const couponsData = await couponsResponse.json();

    // Fetch states
    const statesResponse = await makeRequest(`${API_BASE}/values/${STATE_SHEET}!A:C`);
    const statesData = await statesResponse.json();

    const couponsRows = couponsData.values || [];
    const statesRows = statesData.values || [];

    // Parse coupons (skip header)
    const coupons = couponsRows.slice(1).map(row => ({
      id: parseInt(row[0]),
      title: row[1] || '',
      description: row[2] || '',
      iconName: row[3] || 'star',
      maxClaims: parseInt(row[4]) || 5,
      category: row[5] || '',
      isActive: row[6] === 'true' || row[6] === 'TRUE'
    }));

    // Parse states into a map
    const stateMap = new Map(
      statesRows.slice(1).map(row => [
        parseInt(row[0]),
        {
          currentClaims: parseInt(row[1]) || 0,
          lastUpdated: row[2] || new Date().toISOString()
        }
      ])
    );

    // Merge data
    const mergedCoupons = coupons
      .filter(coupon => coupon.isActive)
      .map(coupon => ({
        id: coupon.id,
        title: coupon.title,
        desc: coupon.description,
        iconName: coupon.iconName,
        maxClaims: coupon.maxClaims,
        currentClaims: stateMap.get(coupon.id)?.currentClaims || 0
      }));

    return mergedCoupons;
  } catch (error) {
    console.error('Error fetching coupons:', error);
    return [];
  }
}

/**
 * Fetch all request history records from the RequestHistory sheet
 */
export async function fetchRequestHistory(): Promise<RequestHistoryItem[]> {
  try {
    if (!SPREADSHEET_ID || !SERVICE_ACCOUNT_EMAIL || !PRIVATE_KEY) {
      throw new Error('Missing Google Sheets configuration');
    }

    const response = await makeRequest(`${API_BASE}/values/${HISTORY_SHEET}!A:F`);
    const data = await response.json();

    const rows = data.values || [];

    const history = rows.slice(1)
      .filter(row => row[0])
      .map(row => ({
        id: parseInt(row[0]),
        couponId: parseInt(row[1]),
        title: row[2] || '',
        details: row[3] || '',
        timestamp: new Date(row[4] || Date.now()).getTime()
      }))
      .sort((a, b) => b.timestamp - a.timestamp);

    return history;
  } catch (error) {
    console.error('Error fetching request history:', error);
    return [];
  }
}

/**
 * Add a new redemption record to the RequestHistory sheet
 * and update the coupon's claim count
 */
export async function addRequestHistory(
  couponId: number,
  title: string,
  details: string,
  redeemedBy?: string
): Promise<boolean> {
  try {
    if (!SPREADSHEET_ID || !SERVICE_ACCOUNT_EMAIL || !PRIVATE_KEY) {
      throw new Error('Missing Google Sheets configuration');
    }

    // 1. Add to request history
    const historyRecord = [
      Date.now(), // id (timestamp)
      couponId,
      title,
      details,
      new Date().toISOString(),
      redeemedBy || 'User' // redeemedBy
    ];

    await makeRequest(`${API_BASE}/values/${HISTORY_SHEET}!A:F:append`, {
      method: 'POST',
      body: JSON.stringify({
        values: [historyRecord]
      })
    });

    // 2. Update coupon claims
    // First, get current state
    const stateResponse = await makeRequest(`${API_BASE}/values/${STATE_SHEET}!A:C`);
    const stateData = await stateResponse.json();
    const stateRows = stateData.values || [];

    const stateRowIndex = stateRows.slice(1).findIndex(row => parseInt(row[0]) === couponId);

    if (stateRowIndex !== -1) {
      const actualRowIndex = stateRowIndex + 2; // +2 for 1-based index + header
      const newClaims = parseInt(stateRows[stateRowIndex + 1][1]) + 1;

      // Update the claims count
      await makeRequest(`${API_BASE}/values/${STATE_SHEET}!B${actualRowIndex}`, {
        method: 'PUT',
        body: JSON.stringify({
          values: [[newClaims]]
        })
      });

      // Update the timestamp
      await makeRequest(`${API_BASE}/values/${STATE_SHEET}!C${actualRowIndex}`, {
        method: 'PUT',
        body: JSON.stringify({
          values: [[new Date().toISOString()]]
        })
      });
    }

    return true;
  } catch (error) {
    console.error('Error adding request history:', error);
    return false;
  }
}