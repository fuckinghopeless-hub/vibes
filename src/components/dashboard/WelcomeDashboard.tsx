import React from 'react';
import { useVibeStore } from '../../store/useVibeStore';
import { DashboardSidebar } from '../layout/DashboardSidebar';
import { DashboardHeader } from '../layout/DashboardHeader';
import { TasksTab } from '../tabs/TasksTab';
import { FocusTab } from '../tabs/FocusTab';
import { GoalsTab } from '../tabs/GoalsTab';
import { ShameLogTab } from '../tabs/ShameLogTab';
import { SettingsTab } from '../tabs/SettingsTab';
import { AnimatePresence, motion } from 'framer-motion';

export const WelcomeDashboard: React.FC = () => {
  const { activeTab } = useVibeStore();

  const renderTabContent = () => {
    switch (activeTab) {
      case 'tasks':
        return <TasksTab />;
      case 'focus':
        return <FocusTab />;
      case 'goals':
        return <GoalsTab />;
      case 'shame':
        return <ShameLogTab />;
      case 'settings':
        return <SettingsTab />;
      default:
        return <TasksTab />;
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

        {/* Centralized Full-Width Workspace */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center">
          <div className="w-full max-w-5xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
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
