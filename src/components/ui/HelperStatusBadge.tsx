import React from 'react';
import { motion } from 'framer-motion';
import { HeartHandshake } from 'lucide-react';
import { COLORS } from '../../types/theme';

export const HelperStatusBadge: React.FC = () => (
  <motion.div
    className="flex items-center justify-center p-3 font-bold text-lg text-white rounded-full shadow-xl"
    animate={{ scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] }}
    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    style={{ backgroundColor: COLORS.mintGreen, color: COLORS.warmGray, borderRadius: '9999px', border: `3px solid ${COLORS.warmGray}` }}
  >
    <HeartHandshake className="w-6 h-6 mr-2" />
    <span className="text-sm sm:text-base">helper status: on duty! 🛡️</span>
  </motion.div>
);