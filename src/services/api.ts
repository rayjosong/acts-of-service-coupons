import type { Coupon, RequestHistoryItem } from '../types';

// Base URL for API - in production it's the same domain
const API_BASE = import.meta.env.PROD ? '' : '';

export async function fetchCoupons(): Promise<Coupon[]> {
  try {
    const response = await fetch(`${API_BASE}/api/coupons`);

    if (!response.ok) {
      throw new Error(`Failed to fetch coupons: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching coupons:', error);
    throw error;
  }
}

export async function fetchRequestHistory(): Promise<RequestHistoryItem[]> {
  try {
    const response = await fetch(`${API_BASE}/api/history`);

    if (!response.ok) {
      throw new Error(`Failed to fetch request history: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching request history:', error);
    throw error;
  }
}

export async function addRequestHistory(couponId: number, title: string, details: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE}/api/redeem`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        couponId,
        title,
        details,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to redeem coupon');
    }
  } catch (error) {
    console.error('Error adding request history:', error);
    throw error;
  }
}

// Test function for API connection
export async function testApiConnection(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/api/coupons`);
    if (response.ok) {
      console.log('API connection successful!');
      return true;
    }
    return false;
  } catch (error) {
    console.error('API connection failed:', error);
    return false;
  }
}