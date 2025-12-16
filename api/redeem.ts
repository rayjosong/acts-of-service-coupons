import { list, put } from '@vercel/blob';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { couponId, title, details } = req.body;

    if (!couponId || !title) {
      return res.status(400).json({ error: 'Missing required fields: couponId, title' });
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

    // Create new history entry
    const newEntry = {
      id: Date.now(),
      couponId: couponId,
      title: title,
      details: details || '',
      timestamp: new Date().toISOString()
    };

    // Add to history
    const updatedHistory = [...currentHistory, newEntry];

    // Update coupon state
    const stateIndex = currentState.findIndex((s: any) => s.couponId === couponId);
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

    // Upload updated data
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

    console.log('Request history updated successfully');

    // Send Telegram notification (if configured)
    if (process.env.VITE_TELEGRAM_BOT_TOKEN && process.env.VITE_TELEGRAM_CHAT_ID) {
      try {
        const message = `🎫 Coupon Redeemed!\n\n` +
          `Title: ${title}\n` +
          `Details: ${details || 'No details'}\n` +
          `Time: ${new Date().toLocaleString()}`;

        await fetch(`https://api.telegram.org/bot${process.env.VITE_TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: process.env.VITE_TELEGRAM_CHAT_ID,
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
    res.status(500).json({ error: 'Failed to redeem coupon' });
  }
}