import React from 'react';
import { useVibeStore } from './store/useVibeStore';
import { AuthCard } from './components/auth/AuthCard';
import { WelcomeDashboard } from './components/dashboard/WelcomeDashboard';
import { AnimatePresence, motion } from 'framer-motion';

export const App: React.FC = () => {
  const { user } = useVibeStore();

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#ECEEF0] dark:bg-[#09090B] text-black dark:text-white selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black transition-colors duration-200">
      <AnimatePresence mode="wait">
        {!user ? (
          <motion.div
            key="auth"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full flex items-center justify-center overflow-y-auto p-4"
          >
            <AuthCard />
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full"
          >
            <WelcomeDashboard />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
