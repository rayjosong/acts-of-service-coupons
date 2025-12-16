# Deploy to Vercel - Simple Guide

## Step 1: Push to GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push origin master
```

## Step 2: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"New Project"**
3. **Import your GitHub repository**
4. Vercel will auto-detect it's a Vite project
5. Click **"Deploy"**

That's it! Your app is now live! 🎉

## Step 3: Add Environment Variables

In your Vercel project dashboard:

1. Go to **Settings** → **Environment Variables**
2. Add:
   ```
   BLOB_READ_WRITE_TOKEN=vercel_blob_rw_your_token_here
   ```
3. Click **"Save"**
4. **Redeploy** (Vercel will ask)

### Getting Your Blob Token:

1. In Vercel project, go to **Storage** tab
2. Click **"Create Database"** → **"Blob"**
3. Follow setup (it's free)
4. Copy the **"Blob Read-Write Token"**
5. Add it to environment variables above

## Step 4: Initialize Your Data (First Time Only)

```bash
# Install Vercel CLI (one time)
npm i -g vercel

# Login
vercel login

# Pull project info
vercel pull

# Run migration
BLOB_READ_WRITE_TOKEN=your_token node scripts/migrate-to-blob.js
```

## Step 5: Verify Deployment

Visit your app at the URL Vercel gave you:
- Click "Test Connection" button
- Try redeeming a coupon
- Check that claim counts persist

## That's It!

Your app is now:
- ✅ Live on Vercel
- ✅ Using Vercel Blob for storage
- ✅ 10-100x faster than Google Sheets
- ✅ Free hosting!

### Update Later:
Just `git push` and Vercel auto-deploys!