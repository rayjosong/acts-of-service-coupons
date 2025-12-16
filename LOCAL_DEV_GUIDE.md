# Local Development with Full API Support

## The Easy Way (No Vercel CLI needed!)

Run the full app locally with API routes and data persistence.

### Prerequisites
- Node.js installed
- Vercel Blob token (for data persistence)

### One-Time Setup

1. **Get your Vercel Blob Token**:
   - Go to [vercel.com](https://vercel.com)
   - Create new project or use existing
   - Go to Storage → Create Database → Blob
   - Copy the "Blob Read-Write Token"

2. **Set up environment**:
   ```bash
   # Create .env.local file
   echo "BLOB_READ_WRITE_TOKEN=your_token_here" > .env.local
   ```

### Running the App Locally

#### Option 1: Full App with API (Recommended)
```bash
npm run dev:full
```
This runs:
- API server at http://localhost:3001
- Vite dev server at http://localhost:5173
- Full data persistence to Vercel Blob

#### Option 2: UI Only (No API)
```bash
npm run dev
```
- Runs at http://localhost:5173
- Shows fallback coupons
- No data persistence
- Good for UI/UX work

#### Option 3: Vercel CLI (If you can get it working)
```bash
npm run dev:vercel
```

### Testing the API

With `npm run dev:full` running:

```javascript
// In browser console
fetch('http://localhost:3001/api/coupons')
  .then(r => r.json())
  .then(console.log)
```

### How It Works

The `npm run dev:full` command:
1. Starts a local Express server with your API routes
2. Starts the Vite development server
3. The React app calls the local API server
4. The API server talks to Vercel Blob storage

### Benefits

- ✅ Full functionality locally
- ✅ No Vercel CLI setup needed
- ✅ Hot reload for both frontend and API
- ✅ Real data persistence
- ✅ Same as production

### Troubleshooting

#### "BLOB_READ_WRITE_TOKEN not found"
Create `.env.local` with your token from Vercel dashboard.

#### Port already in use
Stop any existing servers and try again.

#### API not responding
Make sure both servers are running - you should see:
```
🚀 API Server running at http://localhost:3001
VITE vX.X.X  ready in XXX ms
```

### Workflow

1. **For UI development**: Use `npm run dev`
2. **For full testing**: Use `npm run dev:full` with your blob token
3. **When ready to deploy**: Push to GitHub and deploy on Vercel

That's it! You now have a fully functional local development environment! 🎉