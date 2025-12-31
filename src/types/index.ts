// Raw types from Google Sheets
export interface CouponDefinition {
  id: number;
  title: string;
  description: string;
  iconName: string;
  maxClaims: number;
  category?: string;
  isActive: boolean;
}

export interface CouponState {
  couponId: number;
  currentClaims: number;
  lastUpdated: string;
}

// Merged type for use in app (same as current Coupon but with iconName)
export interface Coupon {
  id: number;
  title: string;
  desc: string;
  iconName: string;  // Changed from icon: React.ElementType
  maxClaims: number;
  currentClaims: number;
}

// Raw type from Google Sheets
export interface RequestHistoryRecord {
  id: number;
  couponId: number;
  title: string;
  details: string;
  timestamp: string; // ISO string
  redeemedBy?: string; // Optional: who redeemed it
}

// Type used in the app (timestamp as ISO string)
export interface RequestHistoryItem {
  id: number;
  couponId: number;
  title: string;
  timestamp: string; // ISO string
  details: string;
}