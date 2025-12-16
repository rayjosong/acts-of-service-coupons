import { put, list } from '@vercel/blob';
import type { Coupon, RequestHistoryItem, CouponDefinition, RequestHistoryRecord } from '../types';

interface CouponState {
  couponId: number;
  currentClaims: number;
  lastUpdated: string;
}

const DEFAULT_COUPONS: CouponDefinition[] = [
  {
    id: 1,
    title: "Bubble Tea Craving Satisfier",
    description: "I'll get you that bubble tea you're craving",
    iconName: "coffee",
    maxClaims: 5,
    category: "food",
    isActive: true
  },
  {
    id: 2,
    title: "Late Night Food Run",
    description: "When you're hungry and everything's closed, I got you",
    iconName: "utensils",
    maxClaims: 3,
    category: "food",
    isActive: true
  },
  {
    id: 3,
    title: "Shoulder Massage Session",
    description: "15 minutes of stress relief for those tense shoulders",
    iconName: "heart",
    maxClaims: 10,
    category: "service",
    isActive: true
  },
  {
    id: 4,
    title: "Errand Runner",
    description: "I'll run that errand you've been procrastinating on",
    iconName: "package",
    maxClaims: 7,
    category: "service",
    isActive: true
  },
  {
    id: 5,
    title: "Listening Ear",
    description: "30 minutes of uninterrupted listening about anything",
    iconName: "message-circle",
    maxClaims: 20,
    category: "service",
    isActive: true
  },
  {
    id: 6,
    title: "Movie Night Companion",
    description: "I'll watch that movie you want to see with you",
    iconName: "film",
    maxClaims: 4,
    category: "entertainment",
    isActive: true
  },
  {
    id: 7,
    title: "Study Buddy",
    description: "2 hours of focused study session together",
    iconName: "book-open",
    maxClaims: 8,
    category: "study",
    isActive: true
  },
  {
    id: 8,
    title: "Breakfast in Bed",
    description: "Surprise morning meal delivered to your bed",
    iconName: "sunrise",
    maxClaims: 3,
    category: "food",
    isActive: true
  },
  {
    id: 9,
    title: "Tech Support",
    description: "I'll help fix your tech issues for 1 hour",
    iconName: "laptop",
    maxClaims: 5,
    category: "service",
    isActive: true
  }
];

// Helper function to fetch and parse JSON from blob
async function fetchJSON<T>(filename: string): Promise<T | null> {
  try {
    const { blobs } = await list({ prefix: filename });
    const blob = blobs.find(b => b.pathname === filename);

    if (!blob) return null;

    const response = await fetch(blob.url);
    if (!response.ok) return null;

    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${filename}:`, error);
    return null;
  }
}

// Helper function to upload JSON to blob
async function uploadJSON<T>(filename: string, data: T): Promise<void> {
  try {
    const blob = await put(filename, JSON.stringify(data, null, 2), {
      access: 'public',
      contentType: 'application/json'
    });
    console.log(`Uploaded ${filename}:`, blob.url);
  } catch (error) {
    console.error(`Error uploading ${filename}:`, error);
    throw error;
  }
}

// Initialize blob storage with default data if empty
export async function initializeBlobStorage(): Promise<void> {
  console.log('Initializing Vercel Blob storage...');

  const coupons = await fetchJSON<CouponDefinition[]>('coupons.json');
  const couponStates = await fetchJSON<CouponState[]>('coupon-state.json');
  const requestHistory = await fetchJSON<RequestHistoryRecord[]>('request-history.json');

  if (!coupons) {
    console.log('Creating default coupons...');
    await uploadJSON('coupons.json', DEFAULT_COUPONS);
  }

  if (!couponStates) {
    console.log('Creating initial coupon states...');
    const initialState: CouponState[] = DEFAULT_COUPONS.map(coupon => ({
      couponId: coupon.id,
      currentClaims: 0,
      lastUpdated: new Date().toISOString()
    }));
    await uploadJSON('coupon-state.json', initialState);
  }

  if (!requestHistory) {
    console.log('Creating empty request history...');
    await uploadJSON('request-history.json', []);
  }

  console.log('Blob storage initialized successfully!');
}

export async function fetchCoupons(): Promise<Coupon[]> {
  try {
    const coupons = await fetchJSON<CouponDefinition[]>('coupons.json') || DEFAULT_COUPONS;
    const states = await fetchJSON<CouponState[]>('coupon-state.json') || [];

    // Merge coupons with their states
    const mergedCoupons: Coupon[] = coupons.map(coupon => {
      const state = states.find(s => s.couponId === coupon.id);
      return {
        id: coupon.id,
        title: coupon.title,
        desc: coupon.description, // Map description to desc
        iconName: coupon.iconName,
        maxClaims: coupon.maxClaims,
        currentClaims: state?.currentClaims || 0
      };
    });

    return mergedCoupons;
  } catch (error) {
    console.error('Error fetching coupons:', error);
    // Return fallback coupons
    return DEFAULT_COUPONS.map(coupon => ({
      id: coupon.id,
      title: coupon.title,
      desc: coupon.description,
      iconName: coupon.iconName,
      maxClaims: coupon.maxClaims,
      currentClaims: 0
    }));
  }
}

export async function fetchRequestHistory(): Promise<RequestHistoryItem[]> {
  try {
    const history = await fetchJSON<RequestHistoryRecord[]>('request-history.json');

    if (!history) return [];

    // Convert timestamp strings to numbers for compatibility
    return history.map(entry => ({
      id: entry.id,
      couponId: entry.couponId,
      title: entry.title,
      timestamp: Date.parse(entry.timestamp) / 1000,
      details: entry.details
    }));
  } catch (error) {
    console.error('Error fetching request history:', error);
    return [];
  }
}

export async function addRequestHistory(id: number, title: string, details: string): Promise<void> {
  try {
    // Fetch current data
    const currentHistory = await fetchJSON<RequestHistoryRecord[]>('request-history.json') || [];
    const currentState = await fetchJSON<CouponState[]>('coupon-state.json') || [];

    // Create new entry
    const newEntry: RequestHistoryRecord = {
      id: Date.now(),
      couponId: id,
      title,
      details,
      timestamp: new Date().toISOString()
    };

    // Add to history
    const updatedHistory = [...currentHistory, newEntry];

    // Update coupon state
    const stateIndex = currentState.findIndex(s => s.couponId === id);
    if (stateIndex >= 0) {
      currentState[stateIndex].currentClaims++;
      currentState[stateIndex].lastUpdated = new Date().toISOString();
    } else {
      currentState.push({
        couponId: id,
        currentClaims: 1,
        lastUpdated: new Date().toISOString()
      });
    }

    // Upload updated data
    await Promise.all([
      uploadJSON('request-history.json', updatedHistory),
      uploadJSON('coupon-state.json', currentState)
    ]);

    console.log('Request history updated successfully');
  } catch (error) {
    console.error('Error adding request history:', error);
    throw error;
  }
}

// Test function for Vercel Blob connection
export async function testVercelBlobConnection(): Promise<boolean> {
  try {
    const token = import.meta.env.VITE_BLOB_READ_WRITE_TOKEN;
    if (!token) {
      console.error('BLOB_READ_WRITE_TOKEN not found');
      return false;
    }

    // Test by listing blobs
    const { blobs } = await list();
    console.log(`Successfully connected to Vercel Blob. Found ${blobs.length} files.`);
    return true;
  } catch (error) {
    console.error('Failed to connect to Vercel Blob:', error);
    return false;
  }
}