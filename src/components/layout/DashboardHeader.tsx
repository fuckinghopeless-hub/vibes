import React from 'react';
import { PanelLeftOpen, Sun, Moon, LogOut, Volume2, VolumeX } from 'lucide-react';
import { useVibeStore } from '../../store/useVibeStore';
import { M3Button } from '../ui/M3Button';

const TAB_TITLES: Record<string, string> = {
  overview: 'Центр управления днем',
  tasks: 'Задачи & Рутины',
  focus: 'Таймер глубокого фокуса',
  goals: 'Траектории целей & Привычки',
  settings: 'Настройки системы',
};

export const DashboardHeader: React.FC = () => {
  const { 
    activeTab, 
    sidebarState, 
    setSidebarState, 
    themeMode, 
    toggleThemeMode, 
    user, 
    toggleSound, 
    logout 
  } = useVibeStore();

  const isSoundOn = user?.soundEnabled ?? true;

  return (
    <header className="h-16 px-4 sm:px-6 bg-white dark:bg-[#141416] border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-4 shadow-sm z-10 select-none">
      {/* Left side: Sidebar Toggle (when hidden) + Clean Tab Title */}
      <div className="flex items-center gap-3 min-w-0">
        {sidebarState === 'hidden' && (
          <button
            onClick={() => setSidebarState('expanded')}
            className="p-2 rounded-xl border border-zinc-300 dark:border-zinc-700 hover:border-black dark:hover:border-white text-zinc-700 dark:text-zinc-300 transition-colors flex items-center justify-center btn-spring"
            title="Развернуть боковое меню"
          >
            <PanelLeftOpen className="w-4 h-4" />
          </button>
        )}

        <h1 className="text-sm sm:text-base font-extrabold text-black dark:text-white tracking-tight truncate">
          {TAB_TITLES[activeTab] || 'VIBES'}
        </h1>
      </div>

      {/* Right side: Sound toggle + Theme toggle + Logout */}
      <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
        {/* Sound Toggle */}
        <button
          type="button"
          onClick={() => toggleSound()}
          className={`p-2 rounded-xl border transition-all btn-spring flex items-center justify-center shadow-sm ${
            isSoundOn
              ? 'bg-zinc-100 dark:bg-zinc-800/80 border-zinc-300 dark:border-zinc-700 text-black dark:text-white'
              : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-400'
          }`}
          title={isSoundOn ? 'Звуковые эффекты включены' : 'Звук отключен'}
        >
          {isSoundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Theme Toggle */}
        <button
          type="button"
          onClick={toggleThemeMode}
          className="p-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-all btn-spring flex items-center justify-center shadow-sm"
          title={themeMode === 'light' ? 'Переключить на темную тему' : 'Переключить на светлую тему'}
        >
          {themeMode === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </button>

        {/* Logout Button */}
        <M3Button
          variant="ghost"
          size="sm"
          onClick={logout}
          className="text-xs text-zinc-600 dark:text-zinc-400 hover:text-red-600 dark:hover:red-400 h-9 px-3"
          leftIcon={<LogOut className="w-4 h-4" />}
        >
          <span className="hidden sm:inline">Выйти</span>
        </M3Button>
      </div>
    </header>
  );
};
