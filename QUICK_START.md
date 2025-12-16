# Quick Start with Vercel CLI

## Prerequisites
- Node.js installed
- GitHub account
- Vercel account (free)

## One-Time Setup

### 1. Install Vercel CLI & Login
```bash
# Already installed as dev dependency
npm install

# Login to Vercel (one-time)
npx vercel login
```

### 2. Link Your Project
```bash
# Link to your Vercel account
npx vercel link

# It will ask:
# - Set up and deploy? → Yes
# - Which scope? → Your account
# - Link to existing project? → No (first time)
# - Project name? → acts-of-service-coupons
# - Directory? → ./
```

### 3. Setup Environment Variables
Create `.env.local`:
```env
BLOB_READ_WRITE_TOKEN=your_blob_token_here
```

Get your blob token from:
1. Go to [vercel.com](https://vercel.com) → Your Project → Storage
2. Create a new Blob store
3. Copy the "Blob Read-Write Token"

## Development Commands

### Local Development (with API!)
```bash
# This runs both Vite dev server AND API routes locally
npm run dev:vercel

# Or use npx if preferred
npx vercel dev
```

Now you can:
- Visit http://localhost:3000
- Test API routes locally
- Save/redeem coupons with persistence
- Use all features as if deployed!

### Regular Vite Development (UI only)
```bash
# For UI/UX work only (no API)
npm run dev
```

### Deploy to Production
```bash
# Deploy with a single command
npx vercel --prod
```

## Testing APIs Locally

With `npm run dev:vercel` running:
```javascript
// Test in browser console
fetch('/api/coupons').then(r => r.json()).then(console.log)
fetch('/api/history').then(r => r.json()).then(console.log)
```

## That's it! 🎉

You now have:
- ✅ Local API development
- ✅ Hot reload for both frontend and backend
- ✅ One-command deployment
- ✅ Free hosting on Vercel

Your app works exactly the same locally as in production!