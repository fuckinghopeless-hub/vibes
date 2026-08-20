import React from 'react';
import { PanelLeftOpen, Sun, Moon, LogOut } from 'lucide-react';
import { useVibeStore } from '../../store/useVibeStore';
import { M3Button } from '../ui/M3Button';

const TAB_TITLES: Record<string, string> = {
  tasks: 'Задачи & Привычки',
  focus: 'Таймер глубокого фокуса',
  goals: 'Траектории долгосрочных целей',
  shame: 'Журнал нарушений и рефлексии',
  settings: 'Настройки системы',
};

export const DashboardHeader: React.FC = () => {
  const { activeTab, sidebarState, setSidebarState, themeMode, toggleThemeMode, logout } = useVibeStore();

  return (
    <header className="h-16 px-6 bg-white dark:bg-[#141416] border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between shadow-sm z-10 select-none">
      {/* Left side: Sidebar Toggle (when hidden) + Clean Tab Title */}
      <div className="flex items-center gap-3">
        {sidebarState === 'hidden' && (
          <button
            onClick={() => setSidebarState('expanded')}
            className="p-2 rounded-xl border border-zinc-300 dark:border-zinc-700 hover:border-black dark:hover:border-white text-zinc-700 dark:text-zinc-300 transition-colors flex items-center justify-center"
            title="Развернуть боковое меню"
          >
            <PanelLeftOpen className="w-4 h-4" />
          </button>
        )}

        <h1 className="text-base font-bold text-black dark:text-white tracking-tight">
          {TAB_TITLES[activeTab] || 'VIBES'}
        </h1>
      </div>

      {/* Right side: Theme toggle + Logout */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <button
          onClick={toggleThemeMode}
          className="p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-[#18181B] text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-all shadow-sm flex items-center justify-center"
          title={themeMode === 'light' ? 'Переключить на темную тему' : 'Переключить на светлую тему'}
        >
          {themeMode === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </button>

        <M3Button
          variant="ghost"
          size="sm"
          onClick={logout}
          className="text-xs text-zinc-600 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400"
          leftIcon={<LogOut className="w-4 h-4" />}
        >
          Выйти
        </M3Button>
      </div>
    </header>
  );
};
