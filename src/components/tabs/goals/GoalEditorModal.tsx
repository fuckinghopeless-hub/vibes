import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  Target, 
  CheckSquare, 
  Timer, 
  Layers, 
  Sparkles
} from 'lucide-react';
import { 
  GoalItem, 
  GoalTrackingType, 
  GoalFrequencyType, 
  ElasticTierConfig 
} from '../../../types';
import { useVibeStore, CreateGoalInput } from '../../../store/useVibeStore';
import { POPULAR_HABIT_TRIGGERS } from '../../../lib/goals';
import { M3Button } from '../../ui/M3Button';
import { M3Input } from '../../ui/M3Input';

interface GoalEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialGoal?: GoalItem | null;
}

export const GoalEditorModal: React.FC<GoalEditorModalProps> = ({
  isOpen,
  onClose,
  initialGoal,
}) => {
  const { addGoal, updateGoal } = useVibeStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Обучение');
  const [trackingType, setTrackingType] = useState<GoalTrackingType>('numeric');
  
  // Target & units
  const [targetValue, setTargetValue] = useState('100');
  const [unit, setUnit] = useState('страниц');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );

  // Elastic Tiers
  const [minVal, setMinVal] = useState('2');
  const [minLabel, setMinLabel] = useState('Минимум (плохой день)');
  const [normVal, setNormVal] = useState('10');
  const [normLabel, setNormLabel] = useState('Норма (обычный день)');
  const [maxVal, setMaxVal] = useState('30');
  const [maxLabel, setMaxLabel] = useState('Максимум (отличный день)');

  // Frequency
  const [frequencyType, setFrequencyType] = useState<GoalFrequencyType>('daily');
  const [targetDaysPerWeek, setTargetDaysPerWeek] = useState(3);
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5]);

  // Habit Stacking Trigger
  const [triggerCue, setTriggerCue] = useState('');
  const [reminderTime, setReminderTime] = useState('');
  const [reminderText, setReminderText] = useState('');

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      if (initialGoal) {
        setTitle(initialGoal.title);
        setDescription(initialGoal.description || '');
        setCategory(initialGoal.category || 'Обучение');
        setTrackingType(initialGoal.trackingType || 'numeric');
        setTargetValue(String(initialGoal.targetValue || 100));
        setUnit(initialGoal.unit || 'ед.');
        setStartDate(initialGoal.startDate || new Date().toISOString().split('T')[0]);
        setEndDate(initialGoal.endDate);
        setFrequencyType(initialGoal.frequencyType || 'daily');
        setTargetDaysPerWeek(initialGoal.targetDaysPerWeek || 3);
        setSelectedDays(initialGoal.selectedDays || [1, 2, 3, 4, 5]);
        setTriggerCue(initialGoal.triggerCue || '');
        setReminderTime(initialGoal.reminderTime || '');
        setReminderText(initialGoal.reminderText || '');

        if (initialGoal.elasticTiers) {
          setMinVal(String(initialGoal.elasticTiers.min.val));
          setMinLabel(initialGoal.elasticTiers.min.label);
          setNormVal(String(initialGoal.elasticTiers.norm.val));
          setNormLabel(initialGoal.elasticTiers.norm.label);
          setMaxVal(String(initialGoal.elasticTiers.max.val));
          setMaxLabel(initialGoal.elasticTiers.max.label);
        }
      } else {
        setTitle('');
        setDescription('');
        setCategory('Обучение');
        setTrackingType('numeric');
        setTargetValue('100');
        setUnit('страниц');
        setStartDate(new Date().toISOString().split('T')[0]);
        setEndDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
        setFrequencyType('daily');
        setTargetDaysPerWeek(3);
        setSelectedDays([1, 2, 3, 4, 5]);
        setTriggerCue('');
        setReminderTime('');
        setReminderText('');
        setMinVal('2');
        setNormVal('10');
        setMaxVal('30');
      }
    }
  }, [isOpen, initialGoal]);

  if (!isOpen || !mounted) return null;

  const toggleDay = (day: number) => {
    if (selectedDays.includes(day)) {
      if (selectedDays.length > 1) {
        setSelectedDays(selectedDays.filter((d) => d !== day));
      }
    } else {
      setSelectedDays([...selectedDays, day].sort());
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    let elasticTiers: ElasticTierConfig | undefined = undefined;
    if (trackingType === 'elastic') {
      elasticTiers = {
        min: { val: Number(minVal) || 1, label: minLabel },
        norm: { val: Number(normVal) || 5, label: normLabel },
        max: { val: Number(maxVal) || 10, label: maxLabel },
      };
    }

    const payload: CreateGoalInput = {
      title: title.trim(),
      description: description.trim() || undefined,
      category,
      trackingType,
      targetValue: parseFloat(targetValue) || 100,
      unit: unit.trim() || 'ед.',
      startDate,
      endDate,
      elasticTiers,
      frequencyType,
      targetDaysPerWeek: frequencyType === 'times_per_week' ? targetDaysPerWeek : undefined,
      selectedDays: frequencyType === 'custom_days' ? selectedDays : undefined,
      triggerCue: triggerCue.trim() || undefined,
      reminderTime: reminderTime || undefined,
      reminderText: reminderText.trim() || undefined,
    };

    if (initialGoal) {
      updateGoal(initialGoal.id, payload as Partial<GoalItem>);
    } else {
      addGoal(payload);
    }

    onClose();
  };

  const DAYS = [
    { day: 1, label: 'Пн' },
    { day: 2, label: 'Вт' },
    { day: 3, label: 'Ср' },
    { day: 4, label: 'Чт' },
    { day: 5, label: 'Пт' },
    { day: 6, label: 'Сб' },
    { day: 7, label: 'Вс' },
  ];

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-hidden">
      <div 
        className="relative w-full max-w-2xl max-h-[92vh] flex flex-col bg-white dark:bg-[#141416] border-2 border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden animate-modal-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/90 dark:bg-zinc-900/90 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-black shadow-md flex-shrink-0">
              <Target className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h2 className="text-base sm:text-lg font-bold text-black dark:text-white tracking-tight">
                {initialGoal ? 'Редактирование цели' : 'Создание траектории цели'}
              </h2>
              <p className="text-xs text-zinc-500 font-medium">
                Эластичные уровни, триггеры привычек и гибкая периодичность
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

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 text-left">
          {/* 1. Title and Category */}
          <div className="space-y-3">
            <M3Input
              label="Название цели или привычки"
              placeholder="Например: Прочитать 300 страниц книги по архитектуре"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-black dark:text-white">
                  Категория цели
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full py-2.5 px-3 text-xs sm:text-sm font-semibold rounded-xl bg-white dark:bg-[#18181B] text-black dark:text-white border-2 border-zinc-200 dark:border-zinc-800 outline-none"
                >
                  <option value="Обучение">📚 Обучение & Развитие</option>
                  <option value="Код">💻 Код & Проекты</option>
                  <option value="Здоровье">🏃 Здоровье & Спорт</option>
                  <option value="Рутина">⚡ Личная Рутина</option>
                  <option value="Карьера">💼 Карьера & Бизнес</option>
                </select>
              </div>

              <M3Input
                label="Описание (необязательно)"
                placeholder="Краткий контекст или мотивация"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          {/* 2. Tracking Format Selector */}
          <div className="space-y-2 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border-2 border-zinc-200 dark:border-zinc-800">
            <label className="block text-xs font-bold text-black dark:text-white mb-1">
              Формат учета прогресса
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => {
                  setTrackingType('numeric');
                  setUnit('страниц');
                }}
                className={`p-3 rounded-xl border-2 text-center transition-all btn-spring flex flex-col items-center gap-1.5 ${
                  trackingType === 'numeric'
                    ? 'bg-black dark:bg-white text-white dark:text-black border-transparent shadow-sm'
                    : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700'
                }`}
              >
                <Target className="w-4 h-4" />
                <span className="text-xs font-bold">Числовой</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setTrackingType('elastic');
                  setUnit('страниц');
                }}
                className={`p-3 rounded-xl border-2 text-center transition-all btn-spring flex flex-col items-center gap-1.5 ${
                  trackingType === 'elastic'
                    ? 'bg-black dark:bg-white text-white dark:text-black border-transparent shadow-sm'
                    : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span className="text-xs font-bold">Эластичный</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setTrackingType('binary');
                  setUnit('раз');
                  setTargetValue('30');
                }}
                className={`p-3 rounded-xl border-2 text-center transition-all btn-spring flex flex-col items-center gap-1.5 ${
                  trackingType === 'binary'
                    ? 'bg-black dark:bg-white text-white dark:text-black border-transparent shadow-sm'
                    : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700'
                }`}
              >
                <CheckSquare className="w-4 h-4" />
                <span className="text-xs font-bold">Чекбокс</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setTrackingType('timer');
                  setUnit('минут');
                  setTargetValue('600');
                }}
                className={`p-3 rounded-xl border-2 text-center transition-all btn-spring flex flex-col items-center gap-1.5 ${
                  trackingType === 'timer'
                    ? 'bg-black dark:bg-white text-white dark:text-black border-transparent shadow-sm'
                    : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700'
                }`}
              >
                <Timer className="w-4 h-4" />
                <span className="text-xs font-bold">Таймер</span>
              </button>
            </div>

            {/* Elastic Tiers Configuration (Min - Norm - Max) */}
            {trackingType === 'elastic' && (
              <div className="mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-700/80 space-y-2.5 animate-modal-in">
                <div className="flex items-center gap-1.5 text-xs font-bold text-black dark:text-white">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Шкала усилий (Elastic Habits): защита от паралича перфекционизма</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 space-y-1">
                    <span className="text-[11px] font-bold text-zinc-500 block">🥉 Минимум (плохой день)</span>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min={1}
                        value={minVal}
                        onChange={(e) => setMinVal(e.target.value)}
                        className="w-16 p-1.5 text-xs font-mono font-bold rounded-lg bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-black dark:text-white"
                      />
                      <span className="text-xs font-medium text-zinc-500">{unit}</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 space-y-1">
                    <span className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300 block">🥈 Норма (обычный день)</span>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min={1}
                        value={normVal}
                        onChange={(e) => setNormVal(e.target.value)}
                        className="w-16 p-1.5 text-xs font-mono font-bold rounded-lg bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-black dark:text-white"
                      />
                      <span className="text-xs font-medium text-zinc-500">{unit}</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 space-y-1">
                    <span className="text-[11px] font-bold text-black dark:text-white block">🥇 Максимум (отличный день)</span>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min={1}
                        value={maxVal}
                        onChange={(e) => setMaxVal(e.target.value)}
                        className="w-16 p-1.5 text-xs font-mono font-bold rounded-lg bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-black dark:text-white"
                      />
                      <span className="text-xs font-medium text-zinc-500">{unit}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 3. Target Values & Deadlines */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <M3Input
              label="Общая цель"
              type="number"
              min={1}
              value={targetValue}
              onChange={(e) => setTargetValue(e.target.value)}
              required
            />
            <M3Input
              label="Единица измерения"
              placeholder="страниц, часов, задач"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              required
            />
            <M3Input
              label="Срок (Дедлайн)"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>

          {/* 4. Flexible Frequency */}
          <div className="space-y-2.5 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border-2 border-zinc-200 dark:border-zinc-800">
            <label className="block text-xs font-bold text-black dark:text-white">
              Периодичность и дни отдыха
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setFrequencyType('daily')}
                className={`p-2.5 rounded-xl border text-xs font-bold transition-all btn-spring ${
                  frequencyType === 'daily'
                    ? 'bg-black dark:bg-white text-white dark:text-black border-transparent shadow-sm'
                    : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700'
                }`}
              >
                Ежедневно
              </button>
              <button
                type="button"
                onClick={() => setFrequencyType('weekdays')}
                className={`p-2.5 rounded-xl border text-xs font-bold transition-all btn-spring ${
                  frequencyType === 'weekdays'
                    ? 'bg-black dark:bg-white text-white dark:text-black border-transparent shadow-sm'
                    : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700'
                }`}
              >
                По будням
              </button>
              <button
                type="button"
                onClick={() => setFrequencyType('times_per_week')}
                className={`p-2.5 rounded-xl border text-xs font-bold transition-all btn-spring ${
                  frequencyType === 'times_per_week'
                    ? 'bg-black dark:bg-white text-white dark:text-black border-transparent shadow-sm'
                    : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700'
                }`}
              >
                N раз в неделю
              </button>
              <button
                type="button"
                onClick={() => setFrequencyType('custom_days')}
                className={`p-2.5 rounded-xl border text-xs font-bold transition-all btn-spring ${
                  frequencyType === 'custom_days'
                    ? 'bg-black dark:bg-white text-white dark:text-black border-transparent shadow-sm'
                    : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700'
                }`}
              >
                Выбранные дни
              </button>
            </div>

            {frequencyType === 'times_per_week' && (
              <div className="flex items-center gap-3 pt-2">
                <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400">
                  Целевое количество дней в неделю:
                </span>
                <div className="flex items-center gap-1.5">
                  {[2, 3, 4, 5, 6].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setTargetDaysPerWeek(num)}
                      className={`w-8 h-8 rounded-xl font-mono text-xs font-bold border transition-all btn-spring ${
                        targetDaysPerWeek === num
                          ? 'bg-black dark:bg-white text-white dark:text-black border-transparent shadow-sm'
                          : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {frequencyType === 'custom_days' && (
              <div className="flex items-center gap-1.5 pt-2">
                {DAYS.map((d) => (
                  <button
                    key={d.day}
                    type="button"
                    onClick={() => toggleDay(d.day)}
                    className={`w-9 h-9 rounded-xl text-xs font-bold border transition-all btn-spring ${
                      selectedDays.includes(d.day)
                        ? 'bg-black dark:bg-white text-white dark:text-black border-transparent shadow-sm'
                        : 'bg-white dark:bg-zinc-800 text-zinc-400 border-zinc-200 dark:border-zinc-700'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 5. Habit Stacking Trigger Context */}
          <div className="space-y-2.5 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border-2 border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-black dark:text-white">
                Триггер Habit Stacking (Контекст привычки)
              </label>
              <span className="text-[10px] font-mono text-zinc-400">Atomic Habits</span>
            </div>

            <M3Input
              placeholder="Например: Сразу после утреннего кофе"
              value={triggerCue}
              onChange={(e) => setTriggerCue(e.target.value)}
            />

            <div className="flex flex-wrap gap-1.5 pt-1">
              {POPULAR_HABIT_TRIGGERS.slice(0, 4).map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setTriggerCue(preset)}
                  className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:border-black dark:hover:border-white transition-colors"
                >
                  + {preset}
                </button>
              ))}
            </div>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/90 dark:bg-zinc-900/90 flex-shrink-0">
          <M3Button variant="ghost" size="md" onClick={onClose}>
            Отмена
          </M3Button>
          <M3Button variant="primary" size="md" onClick={handleSubmit} className="px-6 font-bold shadow-md">
            {initialGoal ? 'Сохранить изменения' : 'Создать цель'}
          </M3Button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
