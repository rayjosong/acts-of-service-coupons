export interface Coupon {
  id: number;
  title: string;
  desc: string;
  icon: React.ElementType;
  maxClaims: number;
  currentClaims: number;
}

export interface RequestHistoryItem {
  id: number;
  couponId: number;
  title: string;
  timestamp: number;
  details: string;
}