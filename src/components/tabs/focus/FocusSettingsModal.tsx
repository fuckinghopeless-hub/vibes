import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  Clock, 
  Sliders, 
  Coffee, 
  Check, 
  Volume2, 
  RotateCcw
} from 'lucide-react';
import { useVibeStore } from '../../../store/useVibeStore';
import { M3Button } from '../../ui/M3Button';

interface FocusSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WORK_PRESETS = [
  { label: '15м', val: 15 },
  { label: '25м', val: 25 },
  { label: '30м', val: 30 },
  { label: '45м', val: 45 },
  { label: '60м', val: 60 },
  { label: '90м', val: 90 },
];

const BREAK_PRESETS = [
  { label: '3м', val: 3 },
  { label: '5м', val: 5 },
  { label: '10м', val: 10 },
  { label: '15м', val: 15 },
];

export const FocusSettingsModal: React.FC<FocusSettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { 
    focusWorkMinutes, 
    focusBreakMinutes, 
    focusAutoComplete, 
    setFocusSettings 
  } = useVibeStore();

  const [workMins, setWorkMins] = useState(focusWorkMinutes || 25);
  const [breakMins, setBreakMins] = useState(focusBreakMinutes || 5);
  const [autoComplete, setAutoComplete] = useState(focusAutoComplete);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setWorkMins(focusWorkMinutes || 25);
      setBreakMins(focusBreakMinutes || 5);
      setAutoComplete(focusAutoComplete);
    }
  }, [isOpen, focusWorkMinutes, focusBreakMinutes, focusAutoComplete]);

  if (!isOpen || !mounted) return null;

  const handleSave = () => {
    setFocusSettings(Math.max(1, workMins), Math.max(1, breakMins), autoComplete);
    onClose();
  };

  const handleResetDefaults = () => {
    setWorkMins(25);
    setBreakMins(5);
    setAutoComplete(true);
    setSoundEnabled(true);
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div 
        className="relative w-full max-w-md bg-white dark:bg-[#141416] border-2 border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden animate-modal-in flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/90 dark:bg-zinc-900/90 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-black shadow-sm flex-shrink-0">
              <Sliders className="w-4 h-4" />
            </div>
            <div className="text-left">
              <h2 className="text-base sm:text-lg font-black text-black dark:text-white tracking-tight">
                Настройки таймера фокуса
              </h2>
              <p className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400">
                Интервалы работы и отдыха
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors btn-spring"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 text-left">
          
          {/* Work Duration Section */}
          <div className="space-y-2.5 p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-black dark:text-white flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Сессия фокуса:
              </span>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min={1}
                  max={240}
                  value={workMins}
                  onChange={(e) => setWorkMins(Number(e.target.value) || 1)}
                  className="w-16 py-1 px-2 text-xs font-mono font-black text-center rounded-xl bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-black dark:text-white outline-none"
                />
                <span className="text-xs font-bold text-zinc-500">мин</span>
              </div>
            </div>

            <div className="grid grid-cols-6 gap-1.5">
              {WORK_PRESETS.map((p) => (
                <button
                  key={p.val}
                  type="button"
                  onClick={() => setWorkMins(p.val)}
                  className={`py-1.5 text-xs font-black rounded-xl transition-all btn-spring text-center ${
                    workMins === p.val
                      ? 'bg-black dark:bg-white text-white dark:text-black shadow-sm'
                      : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:border-black dark:hover:border-white'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Break Duration Section */}
          <div className="space-y-2.5 p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-black dark:text-white flex items-center gap-1.5">
                <Coffee className="w-3.5 h-3.5" /> Длительность отдыха:
              </span>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min={1}
                  max={60}
                  value={breakMins}
                  onChange={(e) => setBreakMins(Number(e.target.value) || 1)}
                  className="w-16 py-1 px-2 text-xs font-mono font-black text-center rounded-xl bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-black dark:text-white outline-none"
                />
                <span className="text-xs font-bold text-zinc-500">мин</span>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-1.5">
              {BREAK_PRESETS.map((p) => (
                <button
                  key={p.val}
                  type="button"
                  onClick={() => setBreakMins(p.val)}
                  className={`py-1.5 text-xs font-black rounded-xl transition-all btn-spring text-center ${
                    breakMins === p.val
                      ? 'bg-black dark:bg-white text-white dark:text-black shadow-sm'
                      : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:border-black dark:hover:border-white'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Automation & Behavior Toggles */}
          <div className="space-y-2.5 p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
            {/* Auto Complete Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-black text-black dark:text-white flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 stroke-[3]" /> Авто-завершение задачи
                </div>
                <div className="text-[10px] font-semibold text-zinc-500">
                  Закрывать задачу по окончании таймера
                </div>
              </div>
              <input
                type="checkbox"
                checked={autoComplete}
                onChange={(e) => setAutoComplete(e.target.checked)}
                className="w-4 h-4 accent-black dark:accent-white rounded cursor-pointer"
              />
            </div>

            {/* Sound Notification Toggle */}
            <div className="flex items-center justify-between pt-2 border-t border-zinc-200 dark:border-zinc-800">
              <div>
                <div className="text-xs font-black text-black dark:text-white flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5" /> Звуковое оповещение
                </div>
                <div className="text-[10px] font-semibold text-zinc-500">
                  Сигнал при окончании фокуса/отдыха
                </div>
              </div>
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
                className="w-4 h-4 accent-black dark:accent-white rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Footer Controls */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/90 dark:bg-zinc-900/90 flex-shrink-0">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="flex items-center gap-1 text-xs font-bold text-zinc-500 hover:text-black dark:hover:text-white transition-colors btn-spring"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Сброс</span>
          </button>

          <div className="flex items-center gap-2">
            <M3Button type="button" variant="ghost" size="sm" onClick={onClose} className="btn-spring">
              Отмена
            </M3Button>
            <M3Button type="button" variant="primary" size="sm" onClick={handleSave} className="px-5 font-black btn-spring shadow-sm">
              Сохранить
            </M3Button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
