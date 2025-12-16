/**
 * Test function to verify API connection
 * This can be called from the browser console
 */
// import { testApiConnection } from './api';

export async function testApiEndpointConnection() {
  console.log('Testing API connection...');
  console.log('Testing /api/coupons endpoint...');

  try {
    // Test coupons endpoint
    const couponsResponse = await fetch('/api/coupons');
    if (couponsResponse.ok) {
      const coupons = await couponsResponse.json();
      console.log('✓ Successfully connected to /api/coupons');
      console.log(`Found ${coupons.length} coupons`);
    } else {
      console.error('✗ Failed to connect to /api/coupons:', couponsResponse.status);
    }

    // Test history endpoint
    const historyResponse = await fetch('/api/history');
    if (historyResponse.ok) {
      const history = await historyResponse.json();
      console.log('✓ Successfully connected to /api/history');
      console.log(`Found ${history.length} history entries`);
    } else {
      console.error('✗ Failed to connect to /api/history:', historyResponse.status);
    }

    console.log('\n✅ API endpoints are working correctly!');
  } catch (error) {
    console.error('✗ API connection test failed:', error);
    console.log('\n💡 Make sure:');
    console.log('  - You are running on Vercel (API routes work only on Vercel)');
    console.log('  - Or use the development server with proper proxy setup');
  }

  // Make this function globally available
  (window as any).testApiEndpointConnection = testApiEndpointConnection;
}

// Auto-expose the function when this file is imported
testApiEndpointConnection();