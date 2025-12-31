import React from 'react';
import { motion } from 'framer-motion';
import { COLORS } from '../types/theme';

export const ChibiBear: React.FC = () => (
  <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute top-0 right-0 z-20 pointer-events-none">
    <motion.g
      initial={{ y: 0 }}
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* Main Head - Lilac */}
      <circle cx="50" cy="50" r="45" fill={COLORS.lilac} stroke={COLORS.warmGray} strokeWidth="3" />
      {/* Ears */}
      <circle cx="20" cy="20" r="15" fill={COLORS.lilac} stroke={COLORS.warmGray} strokeWidth="3" />
      <circle cx="80" cy="20" r="15" fill={COLORS.lilac} stroke={COLORS.warmGray} strokeWidth="3" />

      {/* Muzzle */}
      <circle cx="50" cy="55" r="20" fill={COLORS.creamyYellow} stroke={COLORS.warmGray} strokeWidth="3" />

      {/* Eyes and Nose */}
      <circle cx="40" cy="45" r="3" fill={COLORS.warmGray} />
      <circle cx="60" cy="45" r="3" fill={COLORS.warmGray} />
      <circle cx="50" cy="55" r="3" fill={COLORS.warmGray} />

      {/* Bandage */}
      <rect x="30" y="30" width="40" height="10" rx="4" fill="white" stroke={COLORS.warmGray} strokeWidth="2" />
      <line x1="40" y1="30" x2="40" y2="40" stroke="#FF5757" strokeWidth="2" />
      <line x1="50" y1="30" x2="50" y2="40" stroke="#FF5757" strokeWidth="2" />
      <line x1="60" y1="30" x2="60" y2="40" stroke="#FF5757" strokeWidth="2" />
    </motion.g>
  </svg>
);