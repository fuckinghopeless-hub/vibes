import React from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard,
  CheckSquare, 
  Timer, 
  TrendingUp, 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  EyeOff
} from 'lucide-react';
import { useVibeStore } from '../../store/useVibeStore';
import { NavTab } from '../../types';
import { VibeLogoSvg } from '../svg/VibeLogoSvg';

export const DashboardSidebar: React.FC = () => {
  const { activeTab, setActiveTab, sidebarState, setSidebarState, user, tasks, goals } = useVibeStore();

  if (sidebarState === 'hidden') return null;

  const isCollapsed = sidebarState === 'collapsed';

  const navItems: { id: NavTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { 
      id: 'overview', 
      label: 'Главная', 
      icon: <LayoutDashboard className="w-5 h-5 flex-shrink-0" />,
    },
    { 
      id: 'tasks', 
      label: 'Задачи', 
      icon: <CheckSquare className="w-5 h-5 flex-shrink-0" />,
      badge: tasks.filter((t) => !t.isCompleted).length || undefined,
    },
    { 
      id: 'focus', 
      label: 'Таймер фокуса', 
      icon: <Timer className="w-5 h-5 flex-shrink-0" /> 
    },
    { 
      id: 'goals', 
      label: 'Траектории целей', 
      icon: <TrendingUp className="w-5 h-5 flex-shrink-0" />,
      badge: goals.length || undefined,
    },
    { 
      id: 'settings', 
      label: 'Настройки', 
      icon: <Settings className="w-5 h-5 flex-shrink-0" /> 
    },
  ];

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 76 : 260 }}
      transition={{ duration: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
      className="h-full bg-white dark:bg-[#141416] border-r border-zinc-200 dark:border-zinc-800 flex flex-col justify-between select-none z-20 shadow-sm"
    >
      {/* Top Section */}
      <div>
        {/* Logo & Toggle Header */}
        <div className={`p-4 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} border-b border-zinc-100 dark:border-zinc-800/80`}>
          {!isCollapsed && <VibeLogoSvg />}
          
          <div className="flex items-center gap-1">
            {/* Collapse toggle */}
            <button
              onClick={() => setSidebarState(isCollapsed ? 'expanded' : 'collapsed')}
              className="p-1.5 rounded-lg text-zinc-500 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors btn-spring"
              title={isCollapsed ? 'Развернуть меню' : 'Свернуть в значки'}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>

            {/* Completely hide sidebar */}
            {!isCollapsed && (
              <button
                onClick={() => setSidebarState('hidden')}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors btn-spring"
                title="Полностью скрыть панель"
              >
                <EyeOff className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1.5">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                title={isCollapsed ? item.label : undefined}
                className={`w-full flex items-center ${
                  isCollapsed ? 'justify-center px-0' : 'justify-between px-3.5'
                } py-3 rounded-2xl text-xs transition-all duration-150 btn-spring ${
                  isActive
                    ? 'bg-[var(--accent-primary)] text-[var(--accent-text)] shadow-sm font-bold'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60 font-medium'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  {item.icon}
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </div>

                {!isCollapsed && item.badge !== undefined && (
                  <span
                    className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-zinc-800 dark:bg-zinc-200 text-white dark:text-black'
                        : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile Summary */}
      {user && (
        <div className={`p-3 border-t border-zinc-100 dark:border-zinc-800/80 ${isCollapsed ? 'text-center' : ''}`}>
          <div
            className={`p-2.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 flex items-center ${
              isCollapsed ? 'justify-center' : 'justify-between gap-2'
            }`}
          >
            <div className="flex items-center gap-2.5 truncate">
              <div className="w-8 h-8 rounded-xl bg-black dark:bg-white text-white dark:text-black font-black flex items-center justify-center text-xs flex-shrink-0 shadow-sm">
                {user.username.charAt(0).toUpperCase()}
              </div>
              {!isCollapsed && (
                <div className="truncate text-left">
                  <div className="text-xs font-bold text-black dark:text-white truncate">
                    {user.username}
                  </div>
                  <div className="text-[10px] text-zinc-500 font-medium truncate">
                    {user.email || (user.isGuest ? 'Гостевой режим' : 'Локальный профиль')}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.aside>
  );
};
