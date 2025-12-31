# Vercel Deployment Fixes - Summary

This document summarizes the issues found and fixes applied to get the Acts of Service Coupons app working on Vercel.

## Deployment URL
https://acts-of-service-coupons.vercel.app

---

## Issues Found and Fixed

### Issue #1: API Routes Not Reachable
**File**: `vercel.json`

**Problem**: The `vercel.json` configuration had a catch-all rewrite rule that redirected ALL requests (including `/api/*`) to `/index.html`:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**Symptom**: API endpoints would return 404 or the frontend HTML instead of JSON responses.

**Fix**: Added API route prioritization before the SPA fallback:

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "/api/:path*"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**Commit**: `c449ed2` - "fix: resolve Vercel deployment issues"

---

### Issue #2: Vercel Blob Overwrite Error
**File**: `api/redeem.js`

**Problem**: The `/api/redeem` endpoint was failing with error:
```
"Vercel Blob: This blob already exists, use allowOverwrite: true if you want to overwrite it."
```

**Root Cause**: Vercel Blob's `put()` method doesn't allow overwriting existing files by default. This is a security feature to prevent accidental data loss.

**Symptom**: Coupon redemption would fail with generic "Failed to redeem coupon" error.

**Fix**: Added `allowOverwrite: true` to the `put()` options:

```javascript
await Promise.all([
  put('request-history.json', JSON.stringify(updatedHistory, null, 2), {
    access: 'public',
    contentType: 'application/json',
    allowOverwrite: true  // <-- Added this
  }),
  put('coupon-state.json', JSON.stringify(currentState, null, 2), {
    access: 'public',
    contentType: 'application/json',
    allowOverwrite: true  // <-- Added this
  })
]);
```

**Commits**:
- `9ae6bd8` - "debug: add detailed logging to redeem endpoint"
- `97a4a7c` - "fix: add allowOverwrite to Vercel Blob put operations"

---

## Git History

```
c449ed2 fix: resolve Vercel deployment issues
       - Fixed vercel.json to prioritize API routes
       - Renamed API files from .ts to .js
9ae6bd8 debug: add detailed logging to redeem endpoint
       - Added detailed error logging to identify the root cause
97a4a7c fix: add allowOverwrite to Vercel Blob put operations
       - Fixed the blob overwrite issue
```

---

## Configuration Verified

### Environment Variables
All required environment variables are configured in Vercel:
- `BLOB_READ_WRITE_TOKEN` - Set for Production, Preview, and Development

### Vercel Blob Storage
- Blob store is created and connected to the project
- Token is properly configured
- Files (`coupons.json`, `coupon-state.json`, `request-history.json`) are auto-created on first use

---

## API Endpoints

All endpoints now working:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/coupons` | Returns all coupons with current claim counts |
| GET | `/api/history` | Returns redemption history (newest first) |
| POST | `/api/redeem` | Redeems a coupon and updates state |

---

## Testing

To verify the deployment:

1. **Test coupons endpoint**:
   ```bash
   curl https://acts-of-service-coupons.vercel.app/api/coupons
   ```

2. **Test redeem endpoint**:
   ```bash
   curl -X POST https://acts-of-service-coupons.vercel.app/api/redeem \
     -H 'Content-Type: application/json' \
     -d '{"couponId":"1","title":"Test","details":"Testing"}'
   ```

3. **Test history endpoint**:
   ```bash
   curl https://acts-of-service-coupons.vercel.app/api/history
   ```

---

## Key Learnings

1. **Vercel rewrites order matters**: API route rewrites must come BEFORE the SPA fallback rewrite in `vercel.json`.

2. **Vercel Blob default behavior**: The `put()` method doesn't overwrite existing files by default. Use `allowOverwrite: true` when you need to update existing files.

3. **Error handling**: Generic error messages hide the root cause. Always include error details in development/debugging.

---

## References

- [Vercel Blob SDK Documentation](https://vercel.com/docs/vercel-blob/using-blob-sdk)
- [Vercel Functions Routing](https://vercel.com/docs/routing-middleware/api)
- [Blob Overwrite Documentation](https://vercel.link/blob-allow-overwrite)

---

## Deployment Status

| Status | Description |
|--------|-------------|
| ✅ API Routes | Working |
| ✅ Blob Storage | Connected and working |
| ✅ Coupon Redemption | Working |
| ✅ History Persistence | Working |
| ✅ Frontend | Deployed at https://acts-of-service-coupons.vercel.app |
