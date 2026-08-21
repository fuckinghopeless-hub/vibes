import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Sliders, 
  Zap, 
  Check,
  X
} from 'lucide-react';
import { useVibeStore } from '../../store/useVibeStore';
import { M3Button } from '../ui/M3Button';
import { M3Card } from '../ui/M3Card';
import { FocusSettingsModal } from './focus/FocusSettingsModal';
import { soundEngine } from '../../lib/soundEngine';

export const FocusTab: React.FC = () => {
  const { 
    activeFocusTaskId, 
    activeFocusTaskTitle, 
    focusWorkMinutes, 
    focusBreakMinutes, 
    focusAutoComplete,
    clearTaskFocus,
    completeActiveFocusTask
  } = useVibeStore();

  const [mode, setMode] = useState<'work' | 'break'>('work');
  const [timeLeft, setTimeLeft] = useState((focusWorkMinutes || 25) * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Sync when task/focus settings change from outside
  useEffect(() => {
    if (focusWorkMinutes) {
      setMode('work');
      setTimeLeft(focusWorkMinutes * 60);
      setIsRunning(false);
    }
  }, [activeFocusTaskId, focusWorkMinutes]);

  // Sync document title with countdown
  useEffect(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const formatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    if (isRunning) {
      document.title = `(${formatted}) ${mode === 'work' ? 'Фокус' : 'Отдых'} • Vibes`;
    } else {
      document.title = 'vibes';
    }

    return () => {
      document.title = 'vibes';
    };
  }, [isRunning, timeLeft, mode]);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      soundEngine.playTimerEnd();

      if (mode === 'work') {
        setCompletedSessions((c) => c + 1);

        // Auto-complete task if enabled and connected
        if (activeFocusTaskId && focusAutoComplete) {
          completeActiveFocusTask();
        }

        // Switch to break
        setMode('break');
        setTimeLeft((focusBreakMinutes || 5) * 60);
      } else {
        // Break ended, switch back to work
        setMode('work');
        setTimeLeft((focusWorkMinutes || 25) * 60);
      }
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, mode, activeFocusTaskId, focusAutoComplete, focusBreakMinutes, focusWorkMinutes, completeActiveFocusTask]);

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(mode === 'work' ? (focusWorkMinutes || 25) * 60 : (focusBreakMinutes || 5) * 60);
  };

  const switchMode = (newMode: 'work' | 'break') => {
    setMode(newMode);
    setIsRunning(false);
    setTimeLeft(newMode === 'work' ? (focusWorkMinutes || 25) * 60 : (focusBreakMinutes || 5) * 60);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const currentTotal = mode === 'work' ? (focusWorkMinutes || 25) * 60 : (focusBreakMinutes || 5) * 60;
  const progressPercent = Math.max(0, Math.min(100, Math.round(((currentTotal - timeLeft) / currentTotal) * 100)));

  return (
    <div className="space-y-6 max-w-xl mx-auto w-full">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="text-left">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-black dark:text-white tracking-tight">
            Таймер Фокуса
          </h2>
          <p className="text-xs sm:text-sm font-medium text-zinc-500 dark:text-zinc-400 mt-1">
            Концентрация и управляемые интервалы глубокой работы
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsSettingsOpen(true)}
          className="px-3.5 py-2 rounded-2xl border-2 transition-all btn-spring flex items-center gap-1.5 text-xs font-bold bg-white dark:bg-[#18181B] text-zinc-800 dark:text-zinc-200 border-zinc-200 dark:border-zinc-700 hover:border-black dark:hover:border-white shadow-sm"
          title="Открыть настройки таймера"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Настройки</span>
        </button>
      </div>

      {/* Linked Task Banner */}
      {activeFocusTaskId && (
        <div className="p-4 rounded-3xl bg-white dark:bg-[#18181B] border-2 border-zinc-200 dark:border-zinc-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-2xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-bold flex-shrink-0 shadow-sm">
              <Zap className="w-4 h-4 fill-current text-white dark:text-black" />
            </div>
            <div className="min-w-0 text-left">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 block">
                Связанная задача
              </span>
              <h3 className="text-xs sm:text-sm font-bold text-black dark:text-white truncate">
                {activeFocusTaskTitle}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={completeActiveFocusTask}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-black dark:bg-white text-white dark:text-black btn-spring flex items-center gap-1.5 shadow-sm"
            >
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              Завершить
            </button>
            <button
              type="button"
              onClick={clearTaskFocus}
              className="p-1.5 rounded-xl text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              title="Отвязать от задачи"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Focus Clock Card */}
      <M3Card className="p-6 sm:p-8 text-center space-y-6 shadow-sm border-2 border-zinc-200 dark:border-zinc-800">
        {/* Mode Selector */}
        <div className="flex bg-zinc-100 dark:bg-zinc-800/90 p-1 rounded-2xl border border-zinc-200 dark:border-zinc-700 max-w-xs mx-auto">
          <button
            onClick={() => switchMode('work')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all btn-spring ${
              mode === 'work'
                ? 'bg-white dark:bg-zinc-700 text-black dark:text-white shadow-sm'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white'
            }`}
          >
            Фокус ({focusWorkMinutes || 25}м)
          </button>
          <button
            onClick={() => switchMode('break')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all btn-spring ${
              mode === 'break'
                ? 'bg-white dark:bg-zinc-700 text-black dark:text-white shadow-sm'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white'
            }`}
          >
            Отдых ({focusBreakMinutes || 5}м)
          </button>
        </div>

        {/* Rock-solid Digital Clock Display */}
        <div className="py-2 space-y-1.5">
          <div className="text-6xl sm:text-7xl font-mono font-extrabold text-black dark:text-white tracking-tight select-none">
            {formattedTime}
          </div>
          <div className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest flex items-center justify-center gap-1.5">
            {isRunning && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />}
            <span>{mode === 'work' ? 'Сессия глубокого фокуса' : 'Интервал отдыха'}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-2.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-700">
          <div
            style={{ width: `${progressPercent}%` }}
            className={`h-full rounded-full transition-all duration-300 ease-out ${
              mode === 'work' ? 'bg-[var(--accent-primary)]' : 'bg-emerald-500'
            }`}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3 pt-1">
          <M3Button
            variant="primary"
            size="lg"
            onClick={toggleTimer}
            className="px-8 py-3.5 text-sm font-bold shadow-sm"
            leftIcon={isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
          >
            {isRunning ? 'Пауза' : 'Запустить'}
          </M3Button>

          <M3Button
            variant="outlined"
            size="lg"
            onClick={resetTimer}
            title="Сбросить таймер"
            className="px-4 py-3.5"
          >
            <RotateCcw className="w-4 h-4" />
          </M3Button>
        </div>

        {/* Session Stats */}
        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-center gap-2 text-xs font-mono font-medium text-zinc-500 dark:text-zinc-400">
          <CheckCircle2 className="w-4 h-4 text-black dark:text-white" />
          <span>
            Завершено сессий: <strong className="text-black dark:text-white font-bold">{completedSessions}</strong>
          </span>
        </div>
      </M3Card>

      {/* Focus Settings Modal Window */}
      <FocusSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
};
