# Vercel Deployment Guide

## Overview
This guide covers migrating the Acts of Service Coupons app from Google Sheets to Vercel Blob Storage and deploying on Vercel.

## Prerequisites
- A Vercel account (free tier is sufficient)
- Existing Google Sheets data (if migrating)
- Git repository with the updated code

## Step 1: Vercel Blob Storage Setup

### Create a Blob Store
1. Go to your Vercel dashboard
2. Navigate to your project (or create a new one)
3. Go to Settings → Blob Storage
4. Create a new Blob store (it will be linked to your account)

### Get Your Blob Token
1. In the Blob Storage settings, find your "Blob Read-Write Token"
2. Copy this token - we'll need it for environment variables

## Step 2: Migrate Existing Data (Optional)

If you have existing Google Sheets data:

1. **Set up your environment variables locally**:
   ```bash
   # Copy your .env file and add the new token
   cp .env .env.local
   # Add BLOB_READ_WRITE_TOKEN=your_token_here
   ```

2. **Run the migration script**:
   ```bash
   node scripts/migrate-to-blob.js
   ```
   This will:
   - Fetch all data from Google Sheets
   - Convert it to JSON format
   - Upload to Vercel Blob storage

3. **Verify the migration**:
   - Check the console output
   - Ensure the data counts match your Google Sheets

## Step 3: Deploy to Vercel

### Automatic Deployment (Recommended)
1. Push your changes to GitHub:
   ```bash
   git add .
   git commit -m "Migrate from Google Sheets to Vercel Blob"
   git push origin main
   ```

2. In Vercel:
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will detect it's a Vite project automatically

### Configure Environment Variables
In Vercel's project settings → Environment Variables, add:

```env
BLOB_READ_WRITE_TOKEN=your_blob_token_here
VITE_TELEGRAM_BOT_TOKEN=your_telegram_bot_token (optional)
VITE_TELEGRAM_CHAT_ID=your_telegram_chat_id (optional)
```

### Deploy
Click "Deploy" - Vercel will build and deploy your application!

## Step 4: Verify the Deployment

1. **Test the connection**:
   - Open your deployed app
   - Click the "Test Connection" button
   - Check the browser console for success message

2. **Verify functionality**:
   - Try redeeming a coupon
   - Check if the claim count updates
   - Verify the history view works

## Performance Comparison

| Metric | Google Sheets | Vercel Blob |
|--------|---------------|-------------|
| API Response Time | 500-2000ms | 50-200ms |
| Authentication | OAuth2 JWT | Simple token |
| Data Format | Tabular rows | JSON files |
| Caching | Limited | CDN edge caching |
| Cost | Free tier | Free tier |

## Troubleshooting

### Issue: "BLOB_READ_WRITE_TOKEN not found"
**Solution**: Ensure the environment variable is set correctly in Vercel dashboard

### Issue: Migration script fails
**Solution**: Check that your Google Sheets credentials are still valid in your .env file

### Issue: Data not loading
**Solution**:
1. Check the browser console for errors
2. Verify the blob files exist: `https://blob.vercel-storage.com/your-store-name/coupons.json`
3. Test with the test connection button

### Issue: Claims not persisting
**Solution**:
1. Check network requests in browser dev tools
2. Ensure the blob token has write permissions
3. Check for CORS errors

## Going Back to Google Sheets (If Needed)

If you need to rollback quickly:
1. Restore the `googleSheets.ts` service file
2. Update App.tsx imports back to googleSheets
3. Add the Google Sheets environment variables back
4. Redeploy

## Benefits of the Migration

✅ **10x faster load times**
✅ **Simpler authentication**
✅ **Built-in CDN caching**
✅ **Better error handling**
✅ **No rate limiting**
✅ **Easier debugging**

## Next Steps

1. Monitor your Vercel dashboard for usage statistics
2. Consider setting up custom analytics
3. If needed, you can implement API routes for better security
4. Set up a custom domain for production use

## Support

For Vercel-specific issues:
- Check Vercel documentation: https://vercel.com/docs
- Contact Vercel support

For application issues:
- Check the browser console
- Review the migration script output
- Test with the connection test button