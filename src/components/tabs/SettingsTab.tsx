import React from 'react';
import { Trash2, Info, CheckCircle2, Palette, Sliders, Check } from 'lucide-react';
import { useVibeStore } from '../../store/useVibeStore';
import { AccentColor } from '../../types';
import { M3Card } from '../ui/M3Card';
import { M3Button } from '../ui/M3Button';

export const SettingsTab: React.FC = () => {
  const { accentColor, setAccentColor, fontSize, setFontSize } = useVibeStore();

  const handleClearData = () => {
    if (window.confirm('Вы уверены, что хотите сбросить все данные задач и профиля?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const accentOptions: { id: AccentColor; label: string; previewClass: string }[] = [
    { id: 'monochrome', label: 'Монохром (Без цвета)', previewClass: 'bg-black dark:bg-white border-zinc-400' },
    { id: 'blue', label: 'Электрик Синий', previewClass: 'bg-blue-600 border-blue-500' },
    { id: 'emerald', label: 'Изумрудный', previewClass: 'bg-emerald-600 border-emerald-500' },
    { id: 'amber', label: 'Янтарный', previewClass: 'bg-amber-500 border-amber-400' },
    { id: 'purple', label: 'Фиолетовый', previewClass: 'bg-purple-600 border-purple-500' },
    { id: 'rose', label: 'Розовый', previewClass: 'bg-rose-500 border-rose-400' },
  ];

  const currentPx = parseInt(fontSize) || 16;
  const minPx = 12;
  const maxPx = 20;
  const fillPercentage = Math.round(((currentPx - minPx) / (maxPx - minPx)) * 100);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setFontSize(`${val}px`);
  };

  const quickPresets = [12, 14, 16, 18, 20];

  return (
    <div className="space-y-6 w-full max-w-2xl mx-auto">
      <div>
        <h2 className="text-xl font-bold text-black dark:text-white tracking-tight">Настройки</h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 font-medium">
          Кастомизация оформления, масштаб текста и управление памятью
        </p>
      </div>

      {/* Font Size Range Slider Card */}
      <M3Card className="p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-black dark:text-white">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-black dark:text-white">Размер шрифта интерфейса</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 font-medium">
                Плавный ползунок регулировки масштаба текста
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-black dark:bg-white text-white dark:text-black px-3.5 py-1 rounded-xl text-xs font-mono font-bold shadow-sm">
            <span>{currentPx}</span>
            <span className="text-[10px] opacity-70">px</span>
          </div>
        </div>

        {/* Custom Range Slider Container */}
        <div className="space-y-4 pt-1">
          <div className="relative flex items-center">
            {/* Background Track with Fill */}
            <div className="absolute left-0 right-0 h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden pointer-events-none">
              <div
                style={{ width: `${fillPercentage}%` }}
                className="h-full bg-[var(--accent-primary)] rounded-full transition-all duration-75"
              />
            </div>

            {/* Native Slider Input */}
            <input
              type="range"
              min={minPx}
              max={maxPx}
              step={1}
              value={currentPx}
              onChange={handleSliderChange}
              className="w-full h-8 z-10"
            />
          </div>

          {/* Notch Markers & Labels */}
          <div className="flex items-center justify-between px-1 text-[11px] font-mono text-zinc-500 dark:text-zinc-400 select-none">
            {quickPresets.map((px) => (
              <button
                key={px}
                type="button"
                onClick={() => setFontSize(`${px}px`)}
                className={`transition-colors flex flex-col items-center gap-1 hover:text-black dark:hover:text-white ${
                  currentPx === px ? 'text-black dark:text-white font-bold' : ''
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${currentPx === px ? 'bg-black dark:bg-white' : 'bg-zinc-300 dark:bg-zinc-700'}`} />
                <span>{px}px {px === 16 ? '★' : ''}</span>
              </button>
            ))}
          </div>

          {/* Live Preview Box */}
          <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs">
            <span className="text-zinc-500 dark:text-zinc-400 font-medium">
              Предпросмотр:
            </span>
            <span className="font-bold text-black dark:text-white truncate">
              VIBES фокус и продуктивность • {currentPx}px
            </span>
          </div>
        </div>
      </M3Card>

      {/* Accent Color Customization Card */}
      <M3Card className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-black dark:text-white">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-black dark:text-white">Акцентный цвет</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 font-medium">
              Выберите оттенок для интерактивных элементов или оставьте строгий монохром
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
          {accentOptions.map((opt) => {
            const isSelected = accentColor === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setAccentColor(opt.id)}
                className={`p-3 rounded-2xl border flex items-center justify-between gap-2.5 transition-all text-left ${
                  isSelected
                    ? 'border-black dark:border-white bg-zinc-100/80 dark:bg-zinc-800 shadow-sm'
                    : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 bg-white dark:bg-[#141416]'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span className={`w-4 h-4 rounded-full flex-shrink-0 border ${opt.previewClass}`} />
                  <span className="text-xs font-semibold text-black dark:text-white truncate">
                    {opt.label.split(' ')[0]}
                  </span>
                </div>
                {isSelected && <Check className="w-4 h-4 text-black dark:text-white flex-shrink-0" />}
              </button>
            );
          })}
        </div>
      </M3Card>

      {/* App Version Card */}
      <M3Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-black dark:text-white">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-black dark:text-white">Версия приложения</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 font-medium">
                VIBES Productivity Platform
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-black dark:bg-white text-white dark:text-black shadow-sm">
              0.1v1
            </span>
          </div>
        </div>

        <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 font-mono">
          <span>Статус системы:</span>
          <span className="flex items-center gap-1.5 text-black dark:text-white font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" /> В сети (Готово к работе)
          </span>
        </div>
      </M3Card>

      {/* Storage Reset Card */}
      <M3Card className="p-6 space-y-4 border-red-200 dark:border-red-900/40">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-red-600 dark:text-red-400">Сброс хранилища</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 font-medium">
              Удалить все сохранённые задачи и локальный профиль с устройства
            </p>
          </div>

          <M3Button variant="danger" size="sm" onClick={handleClearData} leftIcon={<Trash2 className="w-4 h-4" />}>
            Очистить
          </M3Button>
        </div>
      </M3Card>
    </div>
  );
};
