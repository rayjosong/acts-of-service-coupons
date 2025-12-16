# Local Development Guide

## Running the App Locally

Since the app uses Vercel serverless functions, local development has some limitations:

### What Works Locally:
- ✅ Full UI/UX development
- ✅ All animations and interactions
- ✅ Coupon redemption UI (doesn't persist)
- ✅ History view (empty by default)
- ✅ Mobile responsive testing

### What Doesn't Work Locally:
- ❌ API routes (Vercel-specific)
- ❌ Data persistence
- ❌ Telegram notifications

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:5173
```

## Testing API Routes

API routes only work when deployed on Vercel. To test them:

1. **Deploy to Vercel** (see DEPLOYMENT_GUIDE.md)
2. **Test on deployed URL** using browser console:
   ```javascript
   fetch('/api/coupons').then(r => r.json()).then(console.log)
   ```

## Mock Data

When running locally, the app shows:
- Default set of 9 coupons
- Empty request history
- All claim counts start at 0

## Environment Variables

Create `.env.local` for local development:
```env
# These are NOT used locally but needed for deployment
BLOB_READ_WRITE_TOKEN=your_token_here
VITE_TELEGRAM_BOT_TOKEN=your_token_here (optional)
VITE_TELEGRAM_CHAT_ID=your_chat_id_here (optional)
```

## Common Questions

**Q: Why don't my coupon redemptions save locally?**
A: Data persistence requires Vercel's serverless functions and blob storage.

**Q: How can I test the full functionality?**
A: Deploy to Vercel - it's free and automatic when you push to GitHub.

**Q: Can I run API routes locally?**
A: Not with Vite. You'd need to switch to Next.js for local API development.

## Development Workflow

1. **Develop locally** for UI/UX changes
2. **Push to GitHub** to deploy
3. **Test on Vercel** for full functionality
4. **Iterate as needed**

## Debugging Tips

- Check browser console for errors
- Use React DevTools for component inspection
- Network tab shows API attempts (will fail locally)
- All coupon functionality works for UI testing