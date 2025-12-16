import React from 'react';
import { motion } from 'framer-motion';

export const Confetti: React.FC = () => (
  <motion.div
    initial={{ opacity: 1 }}
    animate={{ opacity: 0, y: -200 }}
    transition={{ duration: 1.5 }}
    className="fixed inset-0 pointer-events-none z-50"
  >
    {Array.from({ length: 50 }).map((_, i) => (
      <span
        key={i}
        className="absolute text-xl"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          transform: `rotate(${Math.random() * 360}deg)`,
        }}
      >
        {Math.random() > 0.5 ? '✨' : '🌟'}
      </span>
    ))}
  </motion.div>
);