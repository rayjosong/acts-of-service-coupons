# Complete Deployment Guide: Vercel with API Routes

## Overview
This guide covers deploying the Acts of Service Coupons app on Vercel using serverless API routes for secure blob storage access.

## Architecture
```
Client (React/Vite) → API Routes (Vercel Serverless) → Vercel Blob Storage
```

**Benefits:**
- ✅ Secure server-side blob operations
- ✅ No API keys exposed to client
- ✅ Automatic HTTPS and CDN
- ✅ Serverless scaling
- ✅ Free tier available

## Step 1: Prepare Your Repository

Ensure all changes are pushed to GitHub:
```bash
git add .
git commit -m "feat: implement API routes for Vercel deployment"
git push origin master
```

## Step 2: Setup Vercel

1. **Sign up/in to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub (recommended)

2. **Create New Project**
   - Click "New Project"
   - Select your repository
   - Click "Import"

## Step 3: Configure Environment Variables

In Vercel Dashboard → Settings → Environment Variables:

**Required:**
```env
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_your_token_here
```

**Optional (for Telegram notifications):**
```env
VITE_TELEGRAM_BOT_TOKEN=your_bot_token_here
VITE_TELEGRAM_CHAT_ID=your_chat_id_here
```

### Getting Your Blob Token:
1. In your Vercel project, go to "Storage"
2. Click "Create Database" → "Blob"
3. Follow the setup process
4. Copy the "Blob Read-Write Token"

## Step 4: Deploy

1. **Initial Deploy**
   - Click "Deploy" button
   - Wait for build to complete (takes 1-2 minutes)

2. **Verify Deployment**
   - Visit your deployed URL
   - Check that coupons load
   - Try redeeming a coupon
   - Check the history view

## Step 5: Initialize Data (First Time Only)

If you have existing data in Google Sheets:

1. **Run Migration Script**
   ```bash
   # Clone your repo locally
   git clone your-repo-url
   cd your-repo

   # Set environment variables
   echo "BLOB_READ_WRITE_TOKEN=your_token_here" > .env.local

   # Run migration
   node scripts/migrate-to-blob.js
   ```

2. **Verify Migration**
   - Check console output for success
   - Verify data counts match

## Step 6: Test Your Deployment

### Manual Testing Checklist:
- [ ] Homepage loads with coupons
- [ ] "Test Connection" button works
- [ ] Can redeem a coupon
- [ ] Claim count updates after redemption
- [ ] History view shows new entries
- [ ] Mobile responsive design works

### Using Browser Console:
```javascript
// Test API endpoints
testApiEndpointConnection()

// Check if APIs are working
fetch('/api/coupons').then(r => r.json()).then(console.log)
fetch('/api/history').then(r => r.json()).then(console.log)
```

## Development vs Production

### Local Development
- API routes won't work locally (Vercel-specific)
- App will use fallback coupons
- Perfect for UI/UX development

### Production
- Full API functionality
- Persistent data storage
- Telegram notifications (if configured)

## Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Wait for SSL certificate (automatic)

## Monitoring and Debugging

### Vercel Dashboard:
- **Functions Tab**: Monitor API route performance
- **Logs**: View error logs and debugging info
- **Analytics**: Track page views and performance

### Common Issues:

#### "API connection failed"
- Expected in local development
- APIs only work on Vercel deployment

#### "Failed to save coupon"
- Check BLOB_READ_WRITE_TOKEN is set
- Verify blob storage is created
- Check Functions logs in Vercel dashboard

#### "Coupons not loading"
- Check if blob files exist
- Verify API routes are deploying
- Check browser console for errors

## Cost Breakdown (Vercel Free Tier)

- **Hobby Plan**: $0/month
  - 100GB bandwidth/month
  - Unlimited static sites
  - Serverless functions:
    - 100,000 invocations/month
    - 10GB-hours execution/month
  - Blob Storage:
    - 1GB storage
    - 100GB bandwidth/month

This should be more than sufficient for a personal coupon app!

## Performance Optimizations

The app includes:
- ✅ API route caching
- ✅ Static asset optimization
- ✅ Global CDN distribution
- ✅ Automatic code splitting

## Scaling Considerations

If your app grows beyond the free tier:
1. **Pro Plan** ($20/month) for more bandwidth
2. **Scale Blob Storage** as needed
3. **Consider Edge Functions** for global performance

## Rollback Plan

If something goes wrong:
1. Go to Vercel dashboard
2. Click "Deployments"
3. Find the previous working deployment
4. Click "..." → "Promote to Production"

## Support

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Blob Storage**: [vercel.com/docs/storage/vercel-blob](https://vercel.com/docs/storage/vercel-blob)
- **Serverless Functions**: [vercel.com/docs/concepts/functions](https://vercel.com/docs/concepts/functions)

## Success! 🎉

Your app is now deployed with:
- Secure API backend
- Persistent data storage
- Global CDN distribution
- Free hosting on Vercel

Enjoy your fast, scalable coupon redemption system!