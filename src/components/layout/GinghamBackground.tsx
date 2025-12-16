import React from 'react';
import { COLORS } from '../../types/theme';

export const GinghamBackground: React.FC = () => (
  <style dangerouslySetInnerHTML={{ __html: `
    .gingham-bg {
      background-color: ${COLORS.pinkBubblegum};
      background-image: linear-gradient(45deg, ${COLORS.pinkBubblegum} 25%, transparent 25%),
                        linear-gradient(-45deg, ${COLORS.pinkBubblegum} 25%, transparent 25%),
                        linear-gradient(45deg, transparent 75%, ${COLORS.pinkBubblegum} 75%),
                        linear-gradient(-45deg, transparent 75%, ${COLORS.pinkBubblegum} 75%);
      background-size: 32px 32px;
      background-position: 0 0, 0 16px, 16px -16px, -16px 0;
      min-height: 100vh;
      font-family: 'Inter', sans-serif;
    }
    .coupon-button {
        position: relative;
        overflow: hidden;
        transition: background-color 0.3s ease;
    }
    .coupon-button:not(:disabled)::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, ${COLORS.lightPink}20, transparent, ${COLORS.lightPink}20);
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    .coupon-button:not(:disabled):hover::after {
        opacity: 1;
    }
  `}} />
);