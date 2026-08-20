import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { M3Button } from '../ui/M3Button';
import { M3Card } from '../ui/M3Card';
import { FlameIconSvg } from '../svg/FlameIconSvg';

export const FocusTab: React.FC = () => {
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      if (mode === 'work') {
        setCompletedSessions((c) => c + 1);
        setMode('break');
        setTimeLeft(5 * 60);
      } else {
        setMode('work');
        setTimeLeft(25 * 60);
      }
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, mode]);

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(mode === 'work' ? 25 * 60 : 5 * 60);
  };

  const switchMode = (newMode: 'work' | 'break') => {
    setMode(newMode);
    setIsRunning(false);
    setTimeLeft(newMode === 'work' ? 25 * 60 : 5 * 60);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const totalTime = mode === 'work' ? 25 * 60 : 5 * 60;
  const progressPercent = Math.round(((totalTime - timeLeft) / totalTime) * 100);

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div>
        <h2 className="text-xl font-semibold text-black dark:text-white tracking-tight">Таймер Фокуса</h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
          Метод Pomodoro: 25 минут непрерывной концентрации и 5 минут отдыха
        </p>
      </div>

      <M3Card className="p-8 text-center space-y-6">
        {/* Mode Selector */}
        <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-2xl border border-zinc-200 dark:border-zinc-700 max-w-xs mx-auto">
          <button
            onClick={() => switchMode('work')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              mode === 'work'
                ? 'bg-white dark:bg-zinc-700 text-black dark:text-white shadow-sm'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white'
            }`}
          >
            Фокус (25м)
          </button>
          <button
            onClick={() => switchMode('break')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              mode === 'break'
                ? 'bg-white dark:bg-zinc-700 text-black dark:text-white shadow-sm'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white'
            }`}
          >
            Отдых (5м)
          </button>
        </div>

        {/* Large Digital Clock Display */}
        <div className="py-6">
          <div className="text-6xl md:text-7xl font-mono font-extrabold text-black dark:text-white tracking-tight select-none">
            {formattedTime}
          </div>
          <div className="mt-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
            {mode === 'work' ? 'Глубокая концентрация' : 'Короткий перерыв'}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-700">
          <div
            style={{ width: `${progressPercent}%` }}
            className="h-full bg-black dark:bg-white rounded-full transition-all duration-300"
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <M3Button
            variant="primary"
            size="lg"
            onClick={toggleTimer}
            className="px-8"
            leftIcon={isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
          >
            {isRunning ? 'Пауза' : 'Запустить'}
          </M3Button>

          <M3Button
            variant="outlined"
            size="lg"
            onClick={resetTimer}
            title="Сбросить таймер"
          >
            <RotateCcw className="w-5 h-5" />
          </M3Button>
        </div>

        {/* Completed count */}
        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-center gap-2 text-xs font-mono text-zinc-500 dark:text-zinc-400">
          <FlameIconSvg className="w-4 h-4 text-black dark:text-white" />
          <span>Завершено сессий за сегодня: <strong className="text-black dark:text-white font-bold">{completedSessions}</strong></span>
        </div>
      </M3Card>
    </div>
  );
};
