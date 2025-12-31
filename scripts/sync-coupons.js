#!/usr/bin/env node

/**
 * Sync coupons.json to Vercel Blob Storage
 *
 * Usage:
 *   node scripts/sync-coupons.js
 *
 * This script uploads the local coupons.json file to Vercel Blob Storage,
 * which updates the coupons shown in the production app.
 */

import { config } from 'dotenv';
import { put } from '@vercel/blob';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Load environment variables
config();

async function syncCoupons() {
  try {
    console.log('📦 Reading coupons.json...');
    const couponsPath = resolve(process.cwd(), 'coupons.json');
    const couponsData = readFileSync(couponsPath, 'utf-8');

    // Validate JSON
    JSON.parse(couponsData);
    console.log('✅ JSON is valid');

    console.log('⬆️  Uploading to Vercel Blob Storage...');
    const result = await put('coupons.json', couponsData, {
      access: 'public',
      contentType: 'application/json',
      allowOverwrite: true,
      token: process.env.BLOB_READ_WRITE_TOKEN
    });

    console.log('✅ Upload successful!');
    console.log(`   URL: ${result.url}`);
    console.log('');
    console.log('🎉 Coupons updated! Refresh your app to see changes.');

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.message.includes('BLOB_READ_WRITE_TOKEN')) {
      console.error('');
      console.error('💡 Tip: Make sure BLOB_READ_WRITE_TOKEN is set in your .env file');
      console.error('   Run: vercel env pull .env.local');
    }
    process.exit(1);
  }
}

syncCoupons();
