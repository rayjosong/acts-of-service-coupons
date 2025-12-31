import { list, put } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { couponId, title, details } = req.body;

    if (!couponId || !title) {
      return res.status(400).json({ error: 'Missing required fields: couponId, title' });
    }

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

    const newEntry = {
      id: Date.now(),
      couponId: couponId,
      title: title,
      details: details || '',
      timestamp: new Date().toISOString()
    };

    const updatedHistory = [...currentHistory, newEntry];

    const stateIndex = currentState.findIndex((s) => s.couponId === couponId);
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

    await Promise.all([
      put('request-history.json', JSON.stringify(updatedHistory, null, 2), {
        access: 'public',
        contentType: 'application/json',
        allowOverwrite: true
      }),
      put('coupon-state.json', JSON.stringify(currentState, null, 2), {
        access: 'public',
        contentType: 'application/json',
        allowOverwrite: true
      })
    ]);

    if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
      try {
        const message = `🎫 Coupon Redeemed!\n\n` +
          `Title: ${title}\n` +
          `Details: ${details || 'No details'}\n` +
          `Time: ${new Date().toLocaleString()}`;

        await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: process.env.TELEGRAM_CHAT_ID,
            text: message
          })
        });
      } catch (telegramError) {
        console.warn('Failed to send Telegram notification:', telegramError);
      }
    }

    res.status(200).json({ success: true, message: 'Coupon redeemed successfully' });
  } catch (error) {
    console.error('Error redeeming coupon:', error);
    res.status(500).json({ error: 'Failed to redeem coupon', details: error.message });
  }
}
