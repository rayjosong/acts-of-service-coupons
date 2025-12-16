import { google } from 'googleapis';
import { CouponDefinition, CouponState, Coupon, RequestHistoryRecord, RequestHistoryItem } from '../types';

// Configure environment variables
const SPREADSHEET_ID = import.meta.env.VITE_GOOGLE_SHEETS_SPREADSHEET_ID || '';
const API_KEY = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY || '';

// Sheet names
const COUPONS_SHEET = 'Coupons';
const STATE_SHEET = 'CouponState';
const HISTORY_SHEET = 'RequestHistory';

// Initialize Google Sheets API
const sheets = google.sheets('v4');

/**
 * Fetch all coupon definitions from the Coupons sheet
 */
export async function fetchCouponDefinitions(): Promise<CouponDefinition[]> {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${COUPONS_SHEET}!A:G`, // All columns from the Coupons sheet
      key: API_KEY,
    });

    const rows = response.data.values;
    if (!rows || rows.length <= 1) {
      console.warn('No coupon data found in Google Sheets');
      return [];
    }

    // Skip header row and transform data
    return rows.slice(1).map((row) => ({
      id: parseInt(row[0], 10),
      title: row[1] || '',
      description: row[2] || '',
      iconName: row[3] || 'star',
      maxClaims: parseInt(row[4], 10) || 5,
      category: row[5] || '',
      isActive: row[6] === 'true' || row[6] === 'TRUE',
    }));
  } catch (error) {
    console.error('Error fetching coupon definitions:', error);
    return [];
  }
}

/**
 * Fetch all coupon states from the CouponState sheet
 */
export async function fetchCouponStates(): Promise<CouponState[]> {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${STATE_SHEET}!A:C`, // All columns from the CouponState sheet
      key: API_KEY,
    });

    const rows = response.data.values;
    if (!rows || rows.length <= 1) {
      console.warn('No state data found in Google Sheets');
      return [];
    }

    // Skip header row and transform data
    return rows.slice(1).map((row) => ({
      couponId: parseInt(row[0], 10),
      currentClaims: parseInt(row[1], 10) || 0,
      lastUpdated: row[2] || new Date().toISOString(),
    }));
  } catch (error) {
    console.error('Error fetching coupon states:', error);
    return [];
  }
}

/**
 * Merge coupon definitions with their current states
 */
export async function fetchCoupons(): Promise<Coupon[]> {
  const [definitions, states] = await Promise.all([
    fetchCouponDefinitions(),
    fetchCouponStates(),
  ]);

  // Create a map of states for quick lookup
  const stateMap = new Map(
    states.map((state) => [state.couponId, state])
  );

  // Merge definitions with states
  return definitions
    .filter((def) => def.isActive) // Only include active coupons
    .map((def) => {
      const state = stateMap.get(def.id);
      return {
        id: def.id,
        title: def.title,
        desc: def.description,
        iconName: def.iconName,
        maxClaims: def.maxClaims,
        currentClaims: state?.currentClaims || 0,
      };
    });
}

/**
 * Update the claim count for a coupon
 * Note: This requires authentication, not just API key
 * For now, this is a placeholder that would need OAuth setup
 */
export async function updateCouponClaims(
  couponId: number,
  newClaimCount: number
): Promise<boolean> {
  // This would require OAuth2 authentication
  // For now, return false to indicate it's not implemented
  console.warn(
    'updateCouponClaims requires OAuth2 authentication. Not implemented yet.'
  );
  return false;
}

/**
 * Fetch all request history records from the RequestHistory sheet
 */
export async function fetchRequestHistory(): Promise<RequestHistoryItem[]> {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${HISTORY_SHEET}!A:F`, // All columns from the RequestHistory sheet
      key: API_KEY,
    });

    const rows = response.data.values;
    if (!rows || rows.length <= 1) {
      return []; // Return empty if no data
    }

    // Skip header row and transform data
    return rows.slice(1)
      .filter(row => row[0]) // Filter out rows with no ID
      .map((row) => ({
        id: parseInt(row[0], 10),
        couponId: parseInt(row[1], 10),
        title: row[2] || '',
        timestamp: new Date(row[4] || Date.now()).getTime(),
        details: row[3] || '',
      }))
      .sort((a, b) => b.timestamp - a.timestamp); // Sort by newest first
  } catch (error) {
    console.error('Error fetching request history:', error);
    return [];
  }
}

/**
 * Add a new redemption record to the RequestHistory sheet
 * Note: This requires authentication, not just API key
 * For now, this is a placeholder that would need OAuth setup
 */
export async function addRequestHistory(
  couponId: number,
  title: string,
  details: string,
  redeemedBy?: string
): Promise<boolean> {
  // This would require OAuth2 authentication
  // For now, return false to indicate it's not implemented
  console.warn(
    'addRequestHistory requires OAuth2 authentication. Not implemented yet.'
  );

  // When implemented, the data to append would be:
  const newRecord = [
    Date.now(), // id (timestamp)
    couponId,
    title,
    details,
    new Date().toISOString(),
    redeemedBy || 'Anonymous'
  ];

  return false;
}

/**
 * Initialize the Google Sheets structure (for setup)
 */
export async function initializeSheets(): Promise<void> {
  // This would be used to create the initial sheet structure
  // Implementation depends on your needs
  console.log('Sheet initialization placeholder');
}