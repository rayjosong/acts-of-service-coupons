# Vercel CLI Troubleshooting

## Issue: `npm run dev:vercel` Error

### Quick Fix Steps:

1. **Ensure you're logged in to Vercel:**
   ```bash
   npx vercel login
   ```

2. **Link your project (first time only):**
   ```bash
   npx vercel link
   # Select: Yes → Your account → Create new project
   ```

3. **Set up your environment variables:**
   Create `.env.local`:
   ```env
   BLOB_READ_WRITE_TOKEN=your_token_here
   ```

4. **Try running again:**
   ```bash
   npm run dev:vercel
   ```

## Common Errors:

### "Command `vercel dev` requires confirmation"
✅ Fixed: Updated to `vercel dev --yes`

### "Function Runtimes must have a valid version"
✅ Fixed: Updated to `nodejs20.x`

### "BLOB_READ_WRITE_TOKEN not found"
Create `.env.local` with your token from Vercel dashboard

### "Project not linked"
Run `npx vercel link` to link your project

## Alternative: If CLI Still Doesn't Work

### Option 1: Use Vite Dev Server (UI Only)
```bash
npm run dev
# Opens at http://localhost:5173
# Shows fallback coupons, no API
```

### Option 2: Deploy Directly to Vercel
```bash
# Push to GitHub
git add .
git commit -m "Update"
git push

# Deploy from Vercel dashboard
```

### Option 3: Test API Endpoints Online
After deploying to Vercel, test at:
```javascript
// In browser console on your deployed site
fetch('/api/coupons').then(r => r.json()).then(console.log)
```

## What Works vs What Doesn't

### `npm run dev` (Vite only):
- ✅ Full UI/UX
- ✅ Animations
- ✅ Responsive design
- ❌ No API routes
- ❌ No data persistence

### `npm run dev:vercel` (Full app):
- ✅ Everything (if CLI works)
- ✅ API routes
- ✅ Data persistence
- ✅ Full functionality

### Deployed on Vercel:
- ✅ Everything works perfectly
- ✅ No setup needed
- ✅ Instant global access

## Simplest Workflow:
1. Develop UI with `npm run dev`
2. Push to GitHub when done
3. Deploy on Vercel with one click
4. Test everything online