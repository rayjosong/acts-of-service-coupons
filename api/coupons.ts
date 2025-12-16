import { list } from '@vercel/blob';
import type { Coupon, CouponDefinition, CouponState } from '../src/types';

const DEFAULT_COUPONS: CouponDefinition[] = [
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

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { blobs } = await list();
    const couponsBlob = blobs.find(b => b.pathname === 'coupons.json');
    const statesBlob = blobs.find(b => b.pathname === 'coupon-state.json');

    let coupons: Coupon[] = [];

    if (couponsBlob && statesBlob) {
      const [couponsData, statesData] = await Promise.all([
        fetch(couponsBlob.url).then(r => r.json()),
        fetch(statesBlob.url).then(r => r.json())
      ]);

      coupons = couponsData.map((coupon: CouponDefinition) => {
        const state = statesData.find((s: CouponState) => s.couponId === coupon.id);
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

    res.status(200).json(coupons);
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

    res.status(200).json(fallbackCoupons);
  }
}