import { Coupon } from '../types';

const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID;

export interface TelegramNotificationData {
  coupon: Coupon;
  instructions: string;
  timestamp: number;
}

export const sendTelegramNotification = async (data: TelegramNotificationData): Promise<boolean> => {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.warn('Telegram credentials not configured');
    return false;
  }

  const { coupon, instructions, timestamp } = data;
  const date = new Date(timestamp).toLocaleString();

  const message = `🎫 *New Coupon Redemption!*

📋 *Service:* ${coupon.title}
📝 *Instructions:* ${instructions || 'No specific instructions'}
⏰ *Time:* ${date}
📊 *Status:* ${coupon.currentClaims + 1}/${coupon.maxClaims} claims`;

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'Markdown',
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Telegram API error:', errorData);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Failed to send Telegram notification:', error);
    return false;
  }
};