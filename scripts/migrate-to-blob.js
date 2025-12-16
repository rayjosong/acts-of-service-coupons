import { put } from '@vercel/blob';
import { JWT } from 'google-auth-library';
import dotenv from 'dotenv';

dotenv.config();

// Google Sheets configuration
const SPREADSHEET_ID = process.env.VITE_GOOGLE_SHEETS_SPREADSHEET_ID;
const SERVICE_ACCOUNT_EMAIL = process.env.VITE_GOOGLE_SERVICE_ACCOUNT_EMAIL;
const PRIVATE_KEY = process.env.VITE_GOOGLE_PRIVATE_KEY;

// Vercel Blob configuration
const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

async function fetchFromSheet(range) {
  const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];

  const jwt = new JWT({
    email: SERVICE_ACCOUNT_EMAIL,
    key: PRIVATE_KEY,
    scopes: SCOPES,
  });

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}`;
  const response = await jwt.request({ url });

  const rows = response.data.values || [];
  const headers = rows[0];
  const data = rows.slice(1).map(row => {
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = row[index] || '';
    });
    return obj;
  });

  return data;
}

async function uploadToBlob(filename, data) {
  try {
    const blob = await put(filename, JSON.stringify(data, null, 2), {
      access: 'public',
      contentType: 'application/json',
      token: BLOB_TOKEN
    });
    console.log(`✅ Uploaded ${filename}:`, blob.url);
    return blob;
  } catch (error) {
    console.error(`❌ Failed to upload ${filename}:`, error);
    throw error;
  }
}

async function migrateData() {
  console.log('🚀 Starting migration from Google Sheets to Vercel Blob...\n');

  if (!BLOB_TOKEN) {
    console.error('❌ BLOB_READ_WRITE_TOKEN environment variable not set');
    process.exit(1);
  }

  try {
    // Fetch data from Google Sheets
    console.log('📊 Fetching data from Google Sheets...');

    const coupons = await fetchFromSheet('Coupons');
    console.log(`   Found ${coupons.length} coupons`);

    const couponStates = await fetchFromSheet('CouponState');
    console.log(`   Found ${couponStates.length} coupon states`);

    const requestHistory = await fetchFromSheet('RequestHistory');
    console.log(`   Found ${requestHistory.length} request history entries`);

    // Transform request history data
    const transformedHistory = requestHistory.map(entry => ({
      ...entry,
      id: parseInt(entry.id) || Date.now() + Math.random(),
      couponId: parseInt(entry.couponId),
      timestamp: entry.timestamp || new Date().toISOString()
    }));

    // Upload to Vercel Blob
    console.log('\n☁️ Uploading data to Vercel Blob...');

    await Promise.all([
      uploadToBlob('coupons.json', coupons),
      uploadToBlob('coupon-state.json', couponStates),
      uploadToBlob('request-history.json', transformedHistory)
    ]);

    console.log('\n✨ Migration completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`   • Coupons: ${coupons.length}`);
    console.log(`   • States: ${couponStates.length}`);
    console.log(`   • History: ${transformedHistory.length}`);

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    process.exit(1);
  }
}

// Run the migration
migrateData();