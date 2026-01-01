import React from 'react';
import { motion } from 'framer-motion';
import { History, ChevronLeft, Dices, CheckCircle2 } from 'lucide-react';
import { RequestHistoryItem } from '../../types';
import { COLORS } from '../../types/theme';

interface RequestHistoryProps {
  history: RequestHistoryItem[];
  onBack: () => void;
}

export const RequestHistory: React.FC<RequestHistoryProps> = ({ history, onBack }) => {
  // History is already sorted by the API (newest first)

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold" style={{ color: COLORS.warmGray }}>
          <History className="w-8 h-8 mr-3 inline-block" />
          request history
        </h1>
        <motion.button
          onClick={onBack}
          className="flex items-center py-2 px-4 font-bold rounded-full shadow-md transition-colors"
          style={{ backgroundColor: COLORS.pinkBubblegum, color: COLORS.warmGray }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          back
        </motion.button>
      </div>

      {history.length === 0 ? (
        <div className="text-center p-10 rounded-xl" style={{ backgroundColor: COLORS.lilac, color: COLORS.warmGray }}>
          <Dices className="w-12 h-12 mx-auto mb-4" />
          <p className="text-lg font-semibold">no requests yet! redeem a coupon to start.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((request) => (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-xl border-2 border-dashed shadow-md"
              style={{ backgroundColor: COLORS.creamyYellow, borderColor: COLORS.mintGreen, color: COLORS.warmGray }}
            >
              <div className="flex justify-between items-start border-b border-dashed pb-2 mb-2" style={{ borderColor: COLORS.pinkBubblegum }}>
                <h3 className="text-xl font-extrabold flex items-center">
                  <CheckCircle2 className="w-5 h-5 mr-2 text-green-600" />
                  {request.title}
                </h3>
                <span className="text-sm font-semibold whitespace-nowrap">
                  {new Date(request.timestamp).toLocaleString()}
                </span>
              </div>
              <p className="text-sm font-bold mb-1">details:</p>
              <div className="text-xs p-3 rounded-lg bg-white/50">
                <p className="whitespace-pre-wrap font-sans">{request.details || "no special instructions."}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};