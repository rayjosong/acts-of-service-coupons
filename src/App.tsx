import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History } from 'lucide-react';

import { COLORS } from './types/theme';
import { Coupon, RequestHistoryItem } from './types';
import { ChibiBear } from './assets/ChibiBear';
import { GinghamBackground } from './components/layout/GinghamBackground';
import { HelperStatusBadge } from './components/ui/HelperStatusBadge';
import { CouponCard } from './components/coupons/CouponCard';
import { RedemptionModal } from './components/modals/RedemptionModal';
import { Confetti } from './components/effects/Confetti';
import { RequestHistory as RequestHistoryView } from './components/views/RequestHistory';
import { fetchCoupons, fetchRequestHistory, addRequestHistory } from './services/api';

// Fallback coupons in case Blob storage fails
const FALLBACK_COUPONS: Coupon[] = [
  {
    id: 1,
    title: "Bubble Tea Craving Satisfier",
    iconName: "coffee",
    desc: "I'll get you that bubble tea you're craving",
    maxClaims: 5,
    currentClaims: 0
  },
  {
    id: 2,
    title: "Meal Craving Satisfier",
    iconName: "utensils",
    desc: "Let me handle your food cravings",
    maxClaims: 5,
    currentClaims: 0
  },
  {
    id: 3,
    title: "Grocery Runner",
    iconName: "shopping-cart",
    desc: "Need groceries? I've got you covered",
    maxClaims: 3,
    currentClaims: 0
  },
];

const App: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>(FALLBACK_COUPONS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentView, setCurrentView] = useState<'coupons' | 'history'>('coupons');
  const [requestHistory, setRequestHistory] = useState<RequestHistoryItem[]>([]);

  // Fetch data from API on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        const [fetchedCoupons, fetchedHistory] = await Promise.all([
          fetchCoupons(),
          fetchRequestHistory()
        ]);

        if (fetchedCoupons.length > 0) {
          setCoupons(fetchedCoupons);
          setError(null);
        }

        setRequestHistory(fetchedHistory);
      } catch (err) {
        console.error('Failed to fetch data from API:', err);
        setError('Failed to load data. Using fallback data.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleRedeemClick = (coupon: Coupon) => {
    if (coupon.currentClaims < coupon.maxClaims) {
      setSelectedCoupon(coupon);
    }
  };

  const handleConfirmRedemption = async (id: number, instructions: string) => {
    const coupon = coupons.find(c => c.id === id);
    if (!coupon) return;

    // Log History
    const historyItem: RequestHistoryItem = {
      id: Date.now(),
      couponId: id,
      title: coupon.title,
      timestamp: new Date().toISOString(),
      details: instructions,
    };
    setRequestHistory(prev => [historyItem, ...prev]);

    // Try to save to API (non-blocking)
    const saveSuccess = await addRequestHistory(id, coupon.title, instructions).catch(err => {
      console.error('Failed to save to API:', err);
      // Show error to user briefly
      setError('Failed to save. Please check console.');
      setTimeout(() => setError(null), 3000);
      return false;
    });

    if (saveSuccess) {
      console.log('Successfully saved to API');
    }

    // Update Claims locally
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
    <div className="min-h-screen p-4 gingham-bg sm:p-8">
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
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="mb-1 text-3xl font-extrabold sm:text-4xl">
                      enjoy your benefits while they're valid 👾👻😛🦦
                    </h1>
                    <p className="mb-4 text-lg font-medium">
                      even if you're better now and can move about, it's good to minimise excessive moving and leave laborious tasks to the people around you hehe. you can be independent again when you're fully recovered ok!
                    </p>
                    {error && (
                      <div className="p-2 mt-2 bg-yellow-100 border border-yellow-300 rounded-lg">
                        <p className="text-sm text-yellow-800">{error}</p>
                      </div>
                    )}
                  </div>
                  <ChibiBear />
                </div>

                <div className="flex flex-col items-center justify-between mt-4 space-y-3 sm:flex-row sm:space-y-0">
                  <div className="flex items-center space-x-3">
                    <HelperStatusBadge />
                  </div>
                  <motion.button
                    onClick={() => setCurrentView('history')}
                    className="flex items-center px-4 py-2 font-bold transition-colors border-2 rounded-full shadow-md"
                    style={{ backgroundColor: COLORS.mintGreen, borderColor: COLORS.warmGray, color: COLORS.warmGray }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <History className="w-5 h-5 mr-1" />
                    History ({requestHistory.length})
                  </motion.button>
                </div>
              </header>

              {/* Loading State */}
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-4 border-b-2 border-pink-300 rounded-full animate-spin"></div>
                    <p className="text-lg font-medium" style={{ color: COLORS.warmGray }}>
                      Loading coupons...
                    </p>
                  </div>
                </div>
              ) : (
                /* Grid */
                <div className="grid grid-cols-1 gap-8 pt-4 sm:grid-cols-2">
                  {coupons.map((coupon) => (
                    <CouponCard
                      key={coupon.id}
                      coupon={coupon}
                      onRedeem={handleRedeemClick}
                    />
                  ))}
                </div>
              )}
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
    </div>
  );
};

export default App;
