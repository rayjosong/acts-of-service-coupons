import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  Star,
  Tv,
  Dices,
  HeartHandshake,
  History,
} from 'lucide-react';

import { COLORS } from './types/theme';
import { Coupon, RequestHistoryItem } from './types';
import { ChibiBear } from './assets/ChibiBear';
import { GinghamBackground } from './components/layout/GinghamBackground';
import { HelperStatusBadge } from './components/ui/HelperStatusBadge';
import { CouponCard } from './components/coupons/CouponCard';
import { RedemptionModal } from './components/modals/RedemptionModal';
import { Confetti } from './components/effects/Confetti';
import { RequestHistory as RequestHistoryView } from './components/views/RequestHistory';

const INITIAL_COUPONS: Coupon[] = [
  { id: 1, title: "Craving Curator", icon: ShoppingBag, desc: "Let's conquer that specific meal craving. Local or otherwise.", maxClaims: 5, currentClaims: 0 },
  { id: 2, title: "Logistics & Lift", icon: HeartHandshake, desc: "Anything heavy that needs moving or reaching, consider it done.", maxClaims: 5, currentClaims: 0 },
  { id: 3, title: "Entertainment Hub", icon: Tv, desc: "Full setup: streaming, charging, and ideal viewing height.", maxClaims: 3, currentClaims: 0 },
  { id: 4, title: "Brain Break Planner", icon: Star, desc: "I'll manually queue up the best movies & playlists for you.", maxClaims: 10, currentClaims: 0 },
  { id: 5, title: "Wildcard Task", icon: Dices, desc: "Redeem for one random task or distraction I must perform.", maxClaims: 1, currentClaims: 0 },
];

const App: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentView, setCurrentView] = useState<'coupons' | 'history'>('coupons');
  const [requestHistory, setRequestHistory] = useState<RequestHistoryItem[]>([]);

  const handleRedeemClick = (coupon: Coupon) => {
    if (coupon.currentClaims < coupon.maxClaims) {
      setSelectedCoupon(coupon);
    }
  };

  const handleConfirmRedemption = (id: number, instructions: string) => {
    const coupon = coupons.find(c => c.id === id);
    if (!coupon) return;

    // Log History
    const historyItem: RequestHistoryItem = {
      id: Date.now(),
      couponId: id,
      title: coupon.title,
      timestamp: Date.now(),
      details: instructions,
    };
    setRequestHistory(prev => [historyItem, ...prev]);

    // Update Claims
    setCoupons(prev => prev.map(c =>
      (c.id === id && c.currentClaims < c.maxClaims)
        ? { ...c, currentClaims: c.currentClaims + 1 }
        : c
    ));

    setSelectedCoupon(null);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 1500);
  };

  return (
    <div className="gingham-bg min-h-screen p-4 sm:p-8">
      <GinghamBackground />
      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {currentView === 'history' ? (
            <RequestHistoryView key="history" history={requestHistory} onBack={() => setCurrentView('coupons')} />
          ) : (
            <motion.div
              key="coupons"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Header */}
              <header
                className="relative mb-8 p-6 shadow-xl shadow-pink-300/80 rounded-[2rem] border-4 border-dashed border-pink-300"
                style={{ backgroundColor: COLORS.lilac, color: COLORS.warmGray }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold mb-1">
                      R&R Station for My Friend! ✨
                    </h1>
                    <p className="text-lg font-medium mb-4">
                      Just sit back. I'm on duty for the heavy lifting.
                    </p>
                  </div>
                  <ChibiBear />
                </div>

                <div className="mt-4 flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
                  <HelperStatusBadge />
                  <motion.button
                    onClick={() => setCurrentView('history')}
                    className="flex items-center py-2 px-4 font-bold rounded-full border-2 transition-colors shadow-md"
                    style={{ backgroundColor: COLORS.mintGreen, borderColor: COLORS.warmGray, color: COLORS.warmGray }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <History className="w-5 h-5 mr-1" />
                    History ({requestHistory.length})
                  </motion.button>
                </div>
              </header>

              {/* Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
                {coupons.map((coupon) => (
                  <CouponCard
                    key={coupon.id}
                    coupon={coupon}
                    onRedeem={handleRedeemClick}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Overlays */}
        <AnimatePresence>
          {selectedCoupon && (
            <RedemptionModal
              coupon={selectedCoupon}
              onClose={() => setSelectedCoupon(null)}
              onConfirm={handleConfirmRedemption}
            />
          )}
          {showConfetti && <Confetti />}
        </AnimatePresence>
      </div>

      <footer className="text-center mt-12 text-sm" style={{ color: COLORS.warmGray }}>
        <p>Built with care by Your Support Team. 2025</p>
      </footer>
    </div>
  );
};

export default App;
