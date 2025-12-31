import { list } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { blobs } = await list();
    const historyBlob = blobs.find(b => b.pathname === 'request-history.json');

    let history = [];

    if (historyBlob) {
      const historyData = await fetch(historyBlob.url).then(r => r.json());

      history = historyData.map((entry) => ({
        id: entry.id,
        couponId: entry.couponId,
        title: entry.title,
        timestamp: Date.parse(entry.timestamp) / 1000,
        details: entry.details
      }));
    }

    history.sort((a, b) => b.timestamp - a.timestamp);

    res.status(200).json(history);
  } catch (error) {
    console.error('Error fetching request history:', error);
    res.status(200).json([]);
  }
}