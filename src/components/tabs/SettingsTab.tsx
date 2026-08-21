import React, { useRef } from 'react';
import { 
  Trash2, 
  Info, 
  Palette, 
  Check, 
  Sun, 
  Moon, 
  Type, 
  Volume2, 
  VolumeX, 
  Download, 
  Upload,
  Database,
  Sparkles
} from 'lucide-react';
import { useVibeStore } from '../../store/useVibeStore';
import { AccentColor } from '../../types';
import { APP_VERSION } from '../../version';
import { M3Card } from '../ui/M3Card';
import { M3Button } from '../ui/M3Button';
import { soundEngine } from '../../lib/soundEngine';

const FONT_PRESETS = [
  { val: 13, label: '13px', desc: 'Компакт' },
  { val: 14, label: '14px', desc: 'Умеренный' },
  { val: 15, label: '15px', desc: 'Средний' },
  { val: 16, label: '16px', desc: 'Базовый' },
  { val: 17, label: '17px', desc: 'Крупный' },
  { val: 18, label: '18px', desc: 'Большой' },
];

const ACCENT_OPTIONS: { id: AccentColor; label: string; bgClass: string; borderClass: string }[] = [
  { id: 'monochrome', label: 'Монохром', bgClass: 'bg-black dark:bg-white', borderClass: 'border-zinc-400' },
  { id: 'blue', label: 'Синий (Электрик)', bgClass: 'bg-blue-600', borderClass: 'border-blue-400' },
  { id: 'emerald', label: 'Изумрудный', bgClass: 'bg-emerald-600', borderClass: 'border-emerald-400' },
  { id: 'amber', label: 'Янтарный', bgClass: 'bg-amber-500', borderClass: 'border-amber-400' },
  { id: 'purple', label: 'Фиолетовый', bgClass: 'bg-purple-600', borderClass: 'border-purple-400' },
  { id: 'rose', label: 'Розовый', bgClass: 'bg-rose-500', borderClass: 'border-rose-400' },
];

export const SettingsTab: React.FC = () => {
  const { 
    themeMode, 
    setThemeMode, 
    accentColor, 
    setAccentColor, 
    fontSize, 
    setFontSize,
    user,
    toggleSound,
    exportDataJson,
    importDataJson
  } = useVibeStore();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentPx = parseInt(fontSize) || 16;
  const minPx = 13;
  const maxPx = 18;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setFontSize(`${val}px`);
  };

  const handleExportBackup = () => {
    const json = exportDataJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const today = new Date().toISOString().split('T')[0];
    a.href = url;
    a.download = `vibes-backup-${today}.json`;
    a.click();
    URL.revokeObjectURL(url);
    soundEngine.playTaskComplete();
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = importDataJson(content);
        if (success) {
          soundEngine.playTaskComplete();
          alert('Резервная копия успешно загружена и синхронизирована!');
        } else {
          alert('Ошибка при чтении файла бэкапа. Проверьте формат JSON.');
        }
      }
    };
    reader.readAsText(file);
  };

  const handleClearData = () => {
    if (window.confirm('Вы уверены, что хотите сбросить все данные задач, целей и настроек?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const isSoundOn = user?.soundEnabled ?? true;

  return (
    <div className="space-y-6 w-full max-w-4xl mx-auto text-left">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-black dark:text-white tracking-tight">
          Настройки
        </h2>
        <p className="text-xs sm:text-sm font-medium text-zinc-500 dark:text-zinc-400 mt-1">
          Кастомизация внешнего вида, аудио-эффектов, масштаба интерфейса и резервного копирования
        </p>
      </div>

      {/* 1. Theme Mode Switcher Card */}
      <M3Card className="p-6 space-y-4 border-2 border-zinc-200 dark:border-zinc-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-black dark:text-white flex-shrink-0 shadow-inner">
              {themeMode === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-black dark:text-white">Тема оформления</h3>
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mt-0.5">
                Переключение между светлым и глубоким тёмным режимом
              </p>
            </div>
          </div>

          {/* Segmented Theme Switcher */}
          <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-2xl border border-zinc-200 dark:border-zinc-700">
            <button
              type="button"
              onClick={() => setThemeMode('light')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all btn-spring flex items-center gap-1.5 ${
                themeMode === 'light'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-zinc-500 hover:text-black'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>Светлая</span>
            </button>
            <button
              type="button"
              onClick={() => setThemeMode('dark')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all btn-spring flex items-center gap-1.5 ${
                themeMode === 'dark'
                  ? 'bg-zinc-700 text-white shadow-sm'
                  : 'text-zinc-500 hover:text-white'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>Тёмная</span>
            </button>
          </div>
        </div>
      </M3Card>

      {/* 2. Audio Effects Card */}
      <M3Card className="p-6 space-y-4 border-2 border-zinc-200 dark:border-zinc-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-black dark:text-white flex-shrink-0 shadow-inner">
              {isSoundOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 text-zinc-400" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-black dark:text-white">Звуковые эффекты (Web Audio)</h3>
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mt-0.5">
                Процедурные тактильные звуки завершения задач и таймера
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <M3Button
              variant="outlined"
              size="sm"
              onClick={() => {
                soundEngine.playTaskComplete();
              }}
              className="text-xs font-bold px-3 py-1.5"
              leftIcon={<Sparkles className="w-3.5 h-3.5" />}
            >
              Тест звука
            </M3Button>

            <button
              type="button"
              onClick={() => toggleSound()}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all btn-spring border ${
                isSoundOn
                  ? 'bg-black dark:bg-white text-white dark:text-black border-transparent shadow-sm'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700'
              }`}
            >
              {isSoundOn ? 'Включено' : 'Выключено'}
            </button>
          </div>
        </div>
      </M3Card>

      {/* 3. Font Scale Studio Card */}
      <M3Card className="p-6 space-y-5 border-2 border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-black dark:text-white flex-shrink-0 shadow-inner">
              <Type className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-black dark:text-white">Масштаб шрифта интерфейса</h3>
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mt-0.5">
                Пропорциональная настройка размера всех элементов
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-black dark:bg-white text-white dark:text-black px-4 py-1.5 rounded-2xl text-xs font-mono font-bold shadow-sm">
            <span>{currentPx}</span>
            <span className="text-[10px] opacity-70">px</span>
          </div>
        </div>

        {/* Range Slider */}
        <div className="space-y-4 pt-1">
          <div className="px-1">
            <input
              type="range"
              min={minPx}
              max={maxPx}
              step={1}
              value={currentPx}
              onChange={handleSliderChange}
              className="w-full"
            />
          </div>

          {/* Grid Presets */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {FONT_PRESETS.map((preset) => {
              const isSelected = currentPx === preset.val;
              return (
                <button
                  key={preset.val}
                  type="button"
                  onClick={() => setFontSize(`${preset.val}px`)}
                  className={`p-2.5 rounded-2xl border-2 text-center transition-all btn-spring ${
                    isSelected
                      ? 'bg-black dark:bg-white text-white dark:text-black border-transparent shadow-md'
                      : 'bg-zinc-50 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-black dark:hover:border-white'
                  }`}
                >
                  <div className="text-xs font-mono font-bold">{preset.label}</div>
                  <div className={`text-[10px] font-medium mt-0.5 ${isSelected ? 'opacity-80' : 'text-zinc-400'}`}>
                    {preset.desc}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </M3Card>

      {/* 4. Accent Color Studio Card */}
      <M3Card className="p-6 space-y-4 border-2 border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-black dark:text-white flex-shrink-0 shadow-inner">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-black dark:text-white">Акцентный цвет</h3>
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mt-0.5">
              Цветовой тон интерактивных кнопок и активных элементов
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
          {ACCENT_OPTIONS.map((opt) => {
            const isSelected = accentColor === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setAccentColor(opt.id)}
                className={`p-3.5 rounded-2xl border-2 flex items-center justify-between gap-3 transition-all text-left btn-spring ${
                  isSelected
                    ? 'border-black dark:border-white bg-zinc-100 dark:bg-zinc-800 shadow-md font-bold'
                    : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 bg-white dark:bg-[#141416]'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={`w-4 h-4 rounded-full flex-shrink-0 shadow-sm border ${opt.bgClass} ${opt.borderClass}`} />
                  <span className="text-xs font-bold text-black dark:text-white truncate">
                    {opt.label}
                  </span>
                </div>
                {isSelected && <Check className="w-4 h-4 text-black dark:text-white flex-shrink-0 stroke-[3]" />}
              </button>
            );
          })}
        </div>
      </M3Card>

      {/* 5. Backup & Restore Card (JSON) */}
      <M3Card className="p-6 space-y-4 border-2 border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-black dark:text-white flex-shrink-0 shadow-inner">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-black dark:text-white">Резервное копирование & Экспорт</h3>
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mt-0.5">
              Сохранение и перенос всех задач, целей и настроек в JSON-файл
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
          <M3Button
            variant="outlined"
            size="md"
            onClick={handleExportBackup}
            className="flex-1 font-bold text-xs"
            leftIcon={<Download className="w-4 h-4" />}
          >
            Экспорт в файл JSON
          </M3Button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportFile}
            accept=".json"
            className="hidden"
          />

          <M3Button
            variant="tonal"
            size="md"
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 font-bold text-xs"
            leftIcon={<Upload className="w-4 h-4" />}
          >
            Импорт из бэкапа
          </M3Button>
        </div>
      </M3Card>

      {/* 6. App Info Card */}
      <M3Card className="p-6 space-y-4 border-2 border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-black dark:text-white flex-shrink-0 shadow-inner">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-black dark:text-white">О платформе</h3>
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mt-0.5">
                VIBES Productivity Platform
              </p>
            </div>
          </div>

          <span className="text-xs font-mono font-bold px-3.5 py-1.5 rounded-2xl bg-black dark:bg-white text-white dark:text-black shadow-sm">
            {APP_VERSION}
          </span>
        </div>

        <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 font-mono">
          <span>Хранилище:</span>
          <span className="flex items-center gap-2 text-black dark:text-white font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Локальный стейт (LocalStorage)</span>
          </span>
        </div>
      </M3Card>

      {/* 7. Storage Reset (Danger Zone) Card */}
      <M3Card className="p-6 space-y-4 border-2 border-red-200 dark:border-red-900/40 bg-red-50/30 dark:bg-red-950/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-red-100 dark:bg-red-900/30 border-2 border-red-200 dark:border-red-800/60 flex items-center justify-center text-red-600 dark:text-red-400 flex-shrink-0 shadow-sm">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-red-600 dark:text-red-400">Сброс данных хранилища</h3>
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mt-0.5">
                Полная очистка всех сохранённых задач, целей и настроек с этого устройства
              </p>
            </div>
          </div>

          <M3Button 
            variant="danger" 
            size="sm" 
            onClick={handleClearData} 
            className="btn-spring px-4 py-2.5 font-bold text-xs flex-shrink-0"
            leftIcon={<Trash2 className="w-3.5 h-3.5" />}
          >
            Очистить всё
          </M3Button>
        </div>
      </M3Card>
    </div>
  );
};
