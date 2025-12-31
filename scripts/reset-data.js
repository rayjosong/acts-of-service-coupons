#!/usr/bin/env node

/**
 * Reset production data (coupon-state.json and request-history.json)
 *
 * Usage:
 *   node scripts/reset-data.js
 *
 * This will clear all redemption history and reset claim counts to zero.
 */

import { config } from 'dotenv';
import { put } from '@vercel/blob';

// Load environment variables
config();

async function resetData() {
  try {
    console.log('🔄 Resetting production data...');
    console.log('');

    // Reset coupon-state.json (empty array = all claims = 0)
    console.log('⬆️  Resetting coupon-state.json...');
    await put('coupon-state.json', '[]', {
      access: 'public',
      contentType: 'application/json',
      allowOverwrite: true,
      token: process.env.BLOB_READ_WRITE_TOKEN
    });
    console.log('✅ coupon-state.json reset');

    // Reset request-history.json (empty array = no history)
    console.log('⬆️  Resetting request-history.json...');
    await put('request-history.json', '[]', {
      access: 'public',
      contentType: 'application/json',
      allowOverwrite: true,
      token: process.env.BLOB_READ_WRITE_TOKEN
    });
    console.log('✅ request-history.json reset');

    console.log('');
    console.log('🎉 Done! All claim counts and history have been reset to zero.');
    console.log('   Refresh your app to see the changes.');

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.message.includes('BLOB_READ_WRITE_TOKEN')) {
      console.error('');
      console.error('💡 Make sure BLOB_READ_WRITE_TOKEN is set:');
      console.error('   vercel env pull .env.local');
    }
    process.exit(1);
  }
}

resetData();
