import React from 'react';
import { motion } from 'framer-motion';
import { Coupon } from '../../types';
import { COLORS } from '../../types/theme';
import { getIcon } from '../../utils/iconMap';

interface CouponCardProps {
  coupon: Coupon;
  onRedeem: (coupon: Coupon) => void;
}

export const CouponCard: React.FC<CouponCardProps> = ({ coupon, onRedeem }) => {
  const Icon = getIcon(coupon.iconName);
  const isFullyRedeemed = coupon.currentClaims >= coupon.maxClaims;
  const progress = (coupon.currentClaims / coupon.maxClaims) * 100;

  const cardVariants = {
    initial: {
        rotate: 0,
        scale: 1,
        y: 0,
        zIndex: 1,
        boxShadow: `0 4px 6px -1px rgba(0, 0, 0, 0.1)`
    },
    hover: isFullyRedeemed ? {} : {
        rotate: 5,
        scale: 1.05,
        y: -10,
        zIndex: 10,
        boxShadow: `0 20px 25px -5px rgba(0, 0, 0, 0.1)`,
        transition: { type: 'spring', stiffness: 300, damping: 10 }
    },
    redeemed: { opacity: 0.6, scale: 0.95, boxShadow: `0 4px 8px -2px ${COLORS.warmGray}80` },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      whileHover="hover"
      animate={isFullyRedeemed ? "redeemed" : "initial"}
      className={`relative p-5 rounded-[2rem] border-4 border-dashed border-pink-300 transition-all duration-300 ${isFullyRedeemed ? 'cursor-default' : 'cursor-pointer'}`}
      style={{ backgroundColor: COLORS.creamyYellow, color: COLORS.warmGray, transform: 'rotate(2deg)' }}
    >
      <div className="flex items-center mb-3">
        <Icon className="w-8 h-8 mr-3 p-1 rounded-full border-2" style={{ color: COLORS.warmGray, backgroundColor: COLORS.pinkBubblegum }} />
        <h3 className="text-xl sm:text-2xl font-extrabold">{coupon.title}</h3>
      </div>
      <p className="mb-4 text-sm font-medium">{coupon.desc}</p>

      <div className="mb-4">
        <div className="flex justify-between text-xs font-bold mb-1">
          <span>Claims Left:</span>
          <span>{coupon.maxClaims - coupon.currentClaims} / {coupon.maxClaims}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden border border-gray-300">
          <motion.div
            className="h-3 rounded-full"
            style={{ backgroundColor: COLORS.pinkBubblegum }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {isFullyRedeemed ? (
        <div className="w-full py-3 font-bold rounded-full text-center opacity-70 border-2 border-gray-300 bg-gray-100">
          Fully Redeemed 🚫
        </div>
      ) : (
        <motion.button
          onClick={() => onRedeem(coupon)}
          className="coupon-button w-full py-3 font-bold rounded-full transition-colors"
          style={{ backgroundColor: COLORS.pinkBubblegum, color: COLORS.warmGray }}
          whileTap={{ scale: 0.95 }}
        >
          Redeem Now! ✨
        </motion.button>
      )}
    </motion.div>
  );
};