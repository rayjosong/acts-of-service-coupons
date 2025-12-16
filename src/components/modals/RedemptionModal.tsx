import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Coupon } from '../../types';
import { COLORS } from '../../types/theme';

interface RedemptionModalProps {
  coupon: Coupon;
  onClose: () => void;
  onConfirm: (id: number, instructions: string) => void;
}

export const RedemptionModal: React.FC<RedemptionModalProps> = ({ coupon, onClose, onConfirm }) => {
  const [instructions, setInstructions] = useState('');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.8, rotate: 5 }}
        animate={{ scale: 1, rotate: 0 }}
        exit={{ scale: 0.8, rotate: -5 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="w-full max-w-md p-6"
        style={{
          backgroundColor: COLORS.mintGreen,
          color: COLORS.warmGray,
          border: `4px dashed ${COLORS.pinkBubblegum}`,
          borderRadius: '2rem',
          boxShadow: `0 10px 15px -3px ${COLORS.pinkBubblegum}B0`,
        }}
      >
        <div className="flex justify-between items-start mb-4 border-b pb-2 border-dashed border-pink-300">
          <h2 className="text-2xl font-extrabold">✅ Confirming: {coupon.title}</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-pink-200 transition-colors">
            <X className="w-6 h-6" style={{ color: COLORS.warmGray }} />
          </button>
        </div>

        <label htmlFor="instructions" className="block text-sm font-bold mb-2">
          📝 Any specific requests?
        </label>
        <textarea
          id="instructions"
          rows={4}
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder="e.g., extra ice, leave at door, or bring a book"
          className="w-full p-3 rounded-lg focus:ring-4 focus:ring-pink-300/50 outline-none"
          style={{
            fontFamily: 'Inter, sans-serif',
            backgroundColor: 'white',
            color: COLORS.warmGray,
            border: `2px solid ${COLORS.warmGray}`,
          }}
        />

        <div className="flex justify-end space-x-3 mt-6">
          <motion.button
            onClick={onClose}
            className="py-3 px-6 font-bold rounded-full border-2"
            style={{ borderColor: COLORS.warmGray, color: COLORS.warmGray }}
            whileTap={{ scale: 0.95 }}
          >
            Nevermind
          </motion.button>
          <motion.button
            onClick={() => onConfirm(coupon.id, instructions)}
            className="py-3 px-6 font-bold rounded-full shadow-md transition-colors"
            style={{ backgroundColor: COLORS.pinkBubblegum, color: COLORS.warmGray }}
            whileTap={{ scale: 0.85, rotate: 5 }}
          >
            Yes, please! 💪
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};