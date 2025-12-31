import { list } from "@vercel/blob";

const DEFAULT_COUPONS = [
  {
    id: 1,
    title: "Bubble Tea Craving Satisfier",
    description:
      "i'll get you your bbtea, 0% sugar cos i know you'll defo be thinking about it being fat",
    iconName: "coffee",
    maxClaims: 20,
    category: "food",
    isActive: true,
  },
  {
    id: 2,
    title: "Late Night Food Run",
    description: "got your back",
    iconName: "utensils",
    maxClaims: 20,
    category: "food",
    isActive: true,
  },
  {
    id: 3,
    title: "Shoulder Massage Session",
    description: "relieve those tense shoulders",
    iconName: "heart",
    maxClaims: 10,
    category: "service",
    isActive: true,
  },
  {
    id: 4,
    title: "Errand Runner",
    description: "don't walk too much, just ask me to do it for you",
    iconName: "package",
    maxClaims: 20,
    category: "service",
    isActive: true,
  },
  {
    id: 5,
    title: "Listening Ear",
    description: "here to let you yap or vent about anything",
    iconName: "message-circle",
    maxClaims: 20,
    category: "service",
    isActive: true,
  },
  {
    id: 6,
    title: "Movie Night Companion",
    description: "tom n jerry also can hehe",
    iconName: "film",
    maxClaims: 10,
    category: "entertainment",
    isActive: true,
  },
  {
    id: 7,
    title: "Study Buddy",
    description: "just study together, no need talk also can",
    iconName: "book-open",
    maxClaims: 10,
    category: "study",
    isActive: true,
  },
  {
    id: 8,
    title: "Breakfast in Bed",
    description: "breakfast delivered to your bed???",
    iconName: "sunrise",
    maxClaims: 10,
    category: "food",
    isActive: true,
  },
  {
    id: 9,
    title: "Tech Support",
    description: "i'll help fix your tech issues hurhur",
    iconName: "laptop",
    maxClaims: 5,
    category: "service",
    isActive: true,
  },
];

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { blobs } = await list();
    const couponsBlob = blobs.find((b) => b.pathname === "coupons.json");
    const statesBlob = blobs.find((b) => b.pathname === "coupon-state.json");

    let coupons = [];

    if (couponsBlob && statesBlob) {
      const [couponsData, statesData] = await Promise.all([
        fetch(couponsBlob.url).then((r) => r.json()),
        fetch(statesBlob.url).then((r) => r.json()),
      ]);

      coupons = couponsData.map((coupon) => {
        const state = statesData.find((s) => s.couponId === coupon.id);
        return {
          id: coupon.id,
          title: coupon.title,
          desc: coupon.description,
          iconName: coupon.iconName,
          maxClaims: coupon.maxClaims,
          currentClaims: state?.currentClaims || 0,
        };
      });
    } else {
      coupons = DEFAULT_COUPONS.map((coupon) => ({
        id: coupon.id,
        title: coupon.title,
        desc: coupon.description,
        iconName: coupon.iconName,
        maxClaims: coupon.maxClaims,
        currentClaims: 0,
      }));
    }

    res.status(200).json(coupons);
  } catch (error) {
    console.error("Error fetching coupons:", error);

    const fallbackCoupons = DEFAULT_COUPONS.map((coupon) => ({
      id: coupon.id,
      title: coupon.title,
      desc: coupon.description,
      iconName: coupon.iconName,
      maxClaims: coupon.maxClaims,
      currentClaims: 0,
    }));

    res.status(200).json(fallbackCoupons);
  }
}
