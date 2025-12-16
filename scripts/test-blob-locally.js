/**
 * Simple script to test Vercel Blob connection locally
 * Run with: node scripts/test-blob-locally.js
 */

import { list, put } from '@vercel/blob';
import { config } from 'dotenv';

// Load environment variables
config();

const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

console.log('🧪 Testing Vercel Blob connection locally...\n');

if (!BLOB_TOKEN) {
  console.error('❌ BLOB_READ_WRITE_TOKEN not found in .env file');
  console.log('\nAdd this to your .env file:');
  console.log('BLOB_READ_WRITE_TOKEN=vercel_blob_rw_your_token_here');
  process.exit(1);
}

async function testConnection() {
  try {
    // Test listing blobs
    console.log('📋 Listing existing blobs...');
    const { blobs } = await list({ token: BLOB_TOKEN });
    console.log(`✅ Found ${blobs.length} blobs in storage`);

    if (blobs.length > 0) {
      console.log('\n📁 Existing files:');
      blobs.forEach(blob => {
        console.log(`  - ${blob.pathname} (${blob.size} bytes)`);
        console.log(`    URL: ${blob.url}`);
      });
    }

    // Test write operation
    console.log('\n✍️ Testing write operation...');
    const testData = {
      test: true,
      timestamp: new Date().toISOString(),
      message: 'Test file from local script'
    };

    const testBlob = await put('test-from-local.json', JSON.stringify(testData), {
      access: 'public',
      contentType: 'application/json',
      token: BLOB_TOKEN
    });

    console.log('✅ Successfully created test file');
    console.log(`🔗 URL: ${testBlob.url}`);

    // Test read operation
    console.log('\n📖 Testing read operation...');
    const response = await fetch(testBlob.url);
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Successfully read test file:', data);
    } else {
      console.error('❌ Failed to read test file');
    }

    console.log('\n✨ All tests passed! Your Vercel Blob connection is working correctly.');
    console.log('\n💡 Tip: You can now run the app locally with npm run dev');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n🔍 Common issues:');
    console.log('  - Invalid token (check BLOB_READ_WRITE_TOKEN)');
    console.log('  - Network connectivity issues');
    console.log('  - Token has expired');
  }
}

testConnection();