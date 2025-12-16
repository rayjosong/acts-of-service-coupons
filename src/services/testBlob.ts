/**
 * Test function to verify Vercel Blob connection
 * This can be called from the browser console
 */
import { list, put } from '@vercel/blob';

export async function testBlobConnection() {
  const BLOB_TOKEN = import.meta.env.VITE_BLOB_READ_WRITE_TOKEN;

  console.log('Testing Vercel Blob connection...');
  console.log('Token configured:', BLOB_TOKEN ? 'Yes' : 'No');

  try {
    // Test if we can list blobs
    const { blobs } = await list({ token: BLOB_TOKEN });
    console.log('✓ Successfully connected to Vercel Blob');
    console.log(`Found ${blobs.length} files in blob storage:`);
    blobs.forEach(blob => {
      console.log(`  - ${blob.pathname} (${blob.size} bytes)`);
    });

    // Test write operation with a test file
    const testContent = {
      test: true,
      timestamp: new Date().toISOString(),
      message: 'This is a test file to verify write access'
    };

    const testBlob = await put('test-write.json', JSON.stringify(testContent), {
      access: 'public',
      contentType: 'application/json',
      token: BLOB_TOKEN
    });

    console.log('✓ Successfully wrote test file:', testBlob.url);

    // Verify we can read it back
    const response = await fetch(testBlob.url);
    if (response.ok) {
      const data = await response.json();
      console.log('✓ Successfully read back test file:', data);
    }

    // Clean up test file
    // Note: Vercel Blob doesn't support deletion in the free tier
    console.log('ℹ Note: Test file will remain in storage (deletion not supported in free tier)');

  } catch (error) {
    console.error('✗ Connection test failed:', error);
  }

  // Make this function globally available
  (window as any).testBlobConnection = testBlobConnection;
}

// Auto-expose the function when this file is imported
testBlobConnection();