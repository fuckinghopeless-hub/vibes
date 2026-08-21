import React from 'react';
import { useVibeStore } from '../../store/useVibeStore';
import { DashboardSidebar } from '../layout/DashboardSidebar';
import { DashboardHeader } from '../layout/DashboardHeader';
import { OverviewTab } from '../tabs/OverviewTab';
import { TasksTab } from '../tabs/TasksTab';
import { FocusTab } from '../tabs/FocusTab';
import { GoalsTab } from '../tabs/GoalsTab';
import { SettingsTab } from '../tabs/SettingsTab';
import { AnimatePresence, motion } from 'framer-motion';

export const WelcomeDashboard: React.FC = () => {
  const { activeTab } = useVibeStore();

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'tasks':
        return <TasksTab />;
      case 'focus':
        return <FocusTab />;
      case 'goals':
        return <GoalsTab />;
      case 'settings':
        return <SettingsTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#ECEEF0] dark:bg-[#09090B] text-black dark:text-white transition-colors duration-200">
      {/* Left Collapsible Navigation Sidebar */}
      <DashboardSidebar />

      {/* Right Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header */}
        <DashboardHeader />

        {/* Centralized Workspace */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 flex justify-center">
          <div className="w-full max-w-5xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.14, ease: [0.25, 1, 0.5, 1] }}
                className="w-full"
              >
                {renderTabContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};
