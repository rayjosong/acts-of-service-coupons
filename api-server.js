import express from 'express';
import { list, put } from '@vercel/blob';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Default coupons (same as in API endpoints)
const DEFAULT_COUPONS = [
  {
    id: 1,
    title: "Bubble Tea Craving Satisfier",
    description: "I'll get you that bubble tea you're craving",
    iconName: "coffee",
    maxClaims: 5,
    category: "food",
    isActive: true
  },
  {
    id: 2,
    title: "Late Night Food Run",
    description: "When you're hungry and everything's closed, I got you",
    iconName: "utensils",
    maxClaims: 3,
    category: "food",
    isActive: true
  },
  {
    id: 3,
    title: "Shoulder Massage Session",
    description: "15 minutes of stress relief for those tense shoulders",
    iconName: "heart",
    maxClaims: 10,
    category: "service",
    isActive: true
  },
  {
    id: 4,
    title: "Errand Runner",
    description: "I'll run that errand you've been procrastinating on",
    iconName: "package",
    maxClaims: 7,
    category: "service",
    isActive: true
  },
  {
    id: 5,
    title: "Listening Ear",
    description: "30 minutes of uninterrupted listening about anything",
    iconName: "message-circle",
    maxClaims: 20,
    category: "service",
    isActive: true
  },
  {
    id: 6,
    title: "Movie Night Companion",
    description: "I'll watch that movie you want to see with you",
    iconName: "film",
    maxClaims: 4,
    category: "entertainment",
    isActive: true
  },
  {
    id: 7,
    title: "Study Buddy",
    description: "2 hours of focused study session together",
    iconName: "book-open",
    maxClaims: 8,
    category: "study",
    isActive: true
  },
  {
    id: 8,
    title: "Breakfast in Bed",
    description: "Surprise morning meal delivered to your bed",
    iconName: "sunrise",
    maxClaims: 3,
    category: "food",
    isActive: true
  },
  {
    id: 9,
    title: "Tech Support",
    description: "I'll help fix your tech issues for 1 hour",
    iconName: "laptop",
    maxClaims: 5,
    category: "service",
    isActive: true
  }
];

// API Routes

// GET /api/coupons
app.get('/api/coupons', async (req, res) => {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      // Return default coupons if no blob token
      const coupons = DEFAULT_COUPONS.map(coupon => ({
        id: coupon.id,
        title: coupon.title,
        desc: coupon.description,
        iconName: coupon.iconName,
        maxClaims: coupon.maxClaims,
        currentClaims: 0
      }));
      return res.json(coupons);
    }

    const { blobs } = await list();
    const couponsBlob = blobs.find(b => b.pathname === 'coupons.json');
    const statesBlob = blobs.find(b => b.pathname === 'coupon-state.json');

    let coupons = [];

    if (couponsBlob && statesBlob) {
      const [couponsData, statesData] = await Promise.all([
        fetch(couponsBlob.url).then(r => r.json()),
        fetch(statesBlob.url).then(r => r.json())
      ]);

      coupons = couponsData.map(coupon => {
        const state = statesData.find(s => s.couponId === coupon.id);
        return {
          id: coupon.id,
          title: coupon.title,
          desc: coupon.description,
          iconName: coupon.iconName,
          maxClaims: coupon.maxClaims,
          currentClaims: state?.currentClaims || 0
        };
      });
    } else {
      coupons = DEFAULT_COUPONS.map(coupon => ({
        id: coupon.id,
        title: coupon.title,
        desc: coupon.description,
        iconName: coupon.iconName,
        maxClaims: coupon.maxClaims,
        currentClaims: 0
      }));
    }

    res.json(coupons);
  } catch (error) {
    console.error('Error fetching coupons:', error);
    const fallbackCoupons = DEFAULT_COUPONS.map(coupon => ({
      id: coupon.id,
      title: coupon.title,
      desc: coupon.description,
      iconName: coupon.iconName,
      maxClaims: coupon.maxClaims,
      currentClaims: 0
    }));
    res.json(fallbackCoupons);
  }
});

// GET /api/history
app.get('/api/history', async (req, res) => {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return res.json([]);
    }

    const { blobs } = await list();
    const historyBlob = blobs.find(b => b.pathname === 'request-history.json');

    let history = [];

    if (historyBlob) {
      const historyData = await fetch(historyBlob.url).then(r => r.json());
      history = historyData.map(entry => ({
        id: entry.id,
        couponId: entry.couponId,
        title: entry.title,
        timestamp: Date.parse(entry.timestamp) / 1000,
        details: entry.details
      }));
    }

    history.sort((a, b) => b.timestamp - a.timestamp);
    res.json(history);
  } catch (error) {
    console.error('Error fetching history:', error);
    res.json([]);
  }
});

// POST /api/redeem
app.post('/api/redeem', async (req, res) => {
  try {
    const { couponId, title, details } = req.body;

    if (!couponId || !title) {
      return res.status(400).json({ error: 'Missing required fields: couponId, title' });
    }

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      // Simulate success if no blob token
      return res.json({ success: true, message: 'Coupon redeemed successfully (simulated)' });
    }

    // Fetch current data
    const { blobs } = await list();
    const historyBlob = blobs.find(b => b.pathname === 'request-history.json');
    const statesBlob = blobs.find(b => b.pathname === 'coupon-state.json');

    let currentHistory = [];
    let currentState = [];

    if (historyBlob) {
      currentHistory = await fetch(historyBlob.url).then(r => r.json());
    }

    if (statesBlob) {
      currentState = await fetch(statesBlob.url).then(r => r.json());
    }

    // Create new entry
    const newEntry = {
      id: Date.now(),
      couponId: couponId,
      title: title,
      details: details || '',
      timestamp: new Date().toISOString()
    };

    // Update data
    const updatedHistory = [...currentHistory, newEntry];

    const stateIndex = currentState.findIndex(s => s.couponId === couponId);
    if (stateIndex >= 0) {
      currentState[stateIndex].currentClaims++;
      currentState[stateIndex].lastUpdated = new Date().toISOString();
    } else {
      currentState.push({
        couponId: couponId,
        currentClaims: 1,
        lastUpdated: new Date().toISOString()
      });
    }

    // Upload to blob
    await Promise.all([
      put('request-history.json', JSON.stringify(updatedHistory, null, 2), {
        access: 'public',
        contentType: 'application/json'
      }),
      put('coupon-state.json', JSON.stringify(currentState, null, 2), {
        access: 'public',
        contentType: 'application/json'
      })
    ]);

    res.json({ success: true, message: 'Coupon redeemed successfully' });
  } catch (error) {
    console.error('Error redeeming coupon:', error);
    res.status(500).json({ error: 'Failed to redeem coupon' });
  }
});

app.listen(PORT, () => {
  console.log(`\n🚀 API Server running at http://localhost:${PORT}`);
  console.log(`📡 API Endpoints available:`);
  console.log(`   GET  /api/coupons`);
  console.log(`   GET  /api/history`);
  console.log(`   POST /api/redeem\n`);
});