import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  Clock, 
  Tag as TagIcon, 
  CheckSquare, 
  FileText, 
  Plus, 
  Trash2, 
  Zap, 
  Target, 
  Repeat,
  SlidersHorizontal,
  Sparkles
} from 'lucide-react';
import { 
  TaskItem, 
  TaskPriority, 
  TaskEnergyLevel, 
  TaskType, 
  SubTaskItem, 
  TaskMetricTarget,
  TaskSchedule 
} from '../../../types';
import { useVibeStore, CreateTaskInput } from '../../../store/useVibeStore';
import { POPULAR_HABIT_TRIGGERS } from '../../../lib/goals';
import { M3Button } from '../../ui/M3Button';
import { M3Input } from '../../ui/M3Input';

interface TaskEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTask?: TaskItem | null;
}

type ModalTab = 'general' | 'time' | 'priority' | 'subtasks' | 'goal';

const TIME_PRESETS = [
  { label: '10 мин', value: 10 },
  { label: '15 мин', value: 15 },
  { label: '25 мин', value: 25 },
  { label: '30 мин', value: 30 },
  { label: '45 мин', value: 45 },
  { label: '1 час', value: 60 },
  { label: '1.5 ч', value: 90 },
  { label: '2 ч', value: 120 },
];

const DAYS_MAP = [
  { day: 1, label: 'Пн' },
  { day: 2, label: 'Вт' },
  { day: 3, label: 'Ср' },
  { day: 4, label: 'Чт' },
  { day: 5, label: 'Пт' },
  { day: 6, label: 'Сб' },
  { day: 7, label: 'Вс' },
];

export const TaskEditorModal: React.FC<TaskEditorModalProps> = ({
  isOpen,
  onClose,
  initialTask,
}) => {
  const { addTask, updateTask, goals } = useVibeStore();

  const [activeTab, setActiveTab] = useState<ModalTab>('general');

  // General
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  // Time & Schedule
  const [hasTimeEstimate, setHasTimeEstimate] = useState(true);
  const [estimatedMinutes, setEstimatedMinutes] = useState(30);
  const [autoCompleteOnTimerEnd, setAutoCompleteOnTimerEnd] = useState(true);
  const [taskType, setTaskType] = useState<TaskType>('one_off');
  const [dueDate, setDueDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [frequency, setFrequency] = useState<'daily' | 'weekdays' | 'weekends' | 'custom'>('daily');
  const [customDays, setCustomDays] = useState<number[]>([1, 2, 3, 4, 5]);

  // Priority, Energy, Complexity
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [energyLevel, setEnergyLevel] = useState<TaskEnergyLevel>('medium');
  const [complexity, setComplexity] = useState<'easy' | 'medium' | 'hard'>('medium');

  // Subtasks & Metrics
  const [checklist, setChecklist] = useState<SubTaskItem[]>([]);
  const [newSubTaskTitle, setNewSubTaskTitle] = useState('');
  const [hasMetric, setHasMetric] = useState(false);
  const [metricTarget, setMetricTarget] = useState<TaskMetricTarget>({
    current: 0,
    target: 10,
    unit: 'стр.',
  });

  // Goal Linkage & Habit Stacking
  const [linkedGoalId, setLinkedGoalId] = useState<string>('');
  const [goalImpactValue, setGoalImpactValue] = useState<string>('1');
  const [triggerCue, setTriggerCue] = useState<string>('');

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      if (initialTask) {
        setTitle(initialTask.title || '');
        setDescription(initialTask.description || '');
        setTags(initialTask.tags || (initialTask.tag ? [initialTask.tag] : []));
        setHasTimeEstimate(initialTask.hasTimeEstimate !== false && Boolean(initialTask.estimatedMinutes));
        setEstimatedMinutes(initialTask.estimatedMinutes || 30);
        setAutoCompleteOnTimerEnd(Boolean(initialTask.autoCompleteOnTimerEnd));
        setTaskType(initialTask.type || 'one_off');
        setDueDate(initialTask.dueDate || '');
        setScheduledTime(initialTask.scheduledTime || '');
        setFrequency(initialTask.schedule?.frequency || 'daily');
        setCustomDays(initialTask.schedule?.daysOfWeek || [1, 2, 3, 4, 5]);
        setPriority(initialTask.priority || 'medium');
        setEnergyLevel(initialTask.energyLevel || 'medium');
        setComplexity(initialTask.complexity || 'medium');
        setChecklist(initialTask.checklist ? [...initialTask.checklist] : []);
        setHasMetric(Boolean(initialTask.metricTarget));
        if (initialTask.metricTarget) {
          setMetricTarget({ ...initialTask.metricTarget });
        }
        setLinkedGoalId(initialTask.linkedGoalId || '');
        setGoalImpactValue(String(initialTask.goalImpactValue || 1));
        setTriggerCue(initialTask.triggerCue || '');
      } else {
        // Reset defaults
        setTitle('');
        setDescription('');
        setTags([]);
        setTagInput('');
        setHasTimeEstimate(true);
        setEstimatedMinutes(30);
        setAutoCompleteOnTimerEnd(true);
        setTaskType('one_off');
        setDueDate('');
        setScheduledTime('');
        setFrequency('daily');
        setCustomDays([1, 2, 3, 4, 5]);
        setPriority('medium');
        setEnergyLevel('medium');
        setComplexity('medium');
        setChecklist([]);
        setNewSubTaskTitle('');
        setHasMetric(false);
        setMetricTarget({ current: 0, target: 10, unit: 'стр.' });
        setLinkedGoalId('');
        setGoalImpactValue('1');
        setTriggerCue('');
      }
      setActiveTab('general');
    }
  }, [isOpen, initialTask]);

  if (!isOpen || !mounted) return null;

  // Tag helpers
  const handleAddTag = (t: string) => {
    const clean = t.trim().replace(/^#/, '');
    if (clean && !tags.includes(clean)) {
      setTags([...tags, clean]);
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag(tagInput);
    }
  };

  // Subtask helpers
  const handleAddSubTask = () => {
    if (!newSubTaskTitle.trim()) return;
    const newSub: SubTaskItem = {
      id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      title: newSubTaskTitle.trim(),
      isCompleted: false,
    };
    setChecklist([...checklist, newSub]);
    setNewSubTaskTitle('');
  };

  const handleRemoveSubTask = (id: string) => {
    setChecklist(checklist.filter((st) => st.id !== id));
  };

  const handleToggleCustomDay = (d: number) => {
    if (customDays.includes(d)) {
      if (customDays.length > 1) {
        setCustomDays(customDays.filter((x) => x !== d));
      }
    } else {
      setCustomDays([...customDays, d].sort());
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    let scheduleData: TaskSchedule | undefined = undefined;
    if (taskType === 'routine') {
      scheduleData = {
        frequency,
        daysOfWeek: frequency === 'custom' ? customDays : undefined,
        timeSlot: scheduledTime || undefined,
        completedDates: initialTask?.schedule?.completedDates || [],
      };
    }

    const selectedGoal = goals.find((g) => g.id === linkedGoalId);

    const payload: CreateTaskInput = {
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      energyLevel,
      complexity,
      type: taskType,
      hasTimeEstimate,
      estimatedMinutes: hasTimeEstimate ? Math.max(5, estimatedMinutes) : 0,
      autoCompleteOnTimerEnd: hasTimeEstimate ? autoCompleteOnTimerEnd : false,
      dueDate: dueDate || undefined,
      scheduledTime: scheduledTime || undefined,
      schedule: scheduleData,
      tags,
      checklist: checklist.length > 0 ? checklist : undefined,
      metricTarget: hasMetric ? metricTarget : undefined,
      linkedGoalId: linkedGoalId || undefined,
      goalImpactValue: linkedGoalId ? (parseFloat(goalImpactValue) || 1) : undefined,
      goalImpactUnit: selectedGoal ? selectedGoal.unit : undefined,
      triggerCue: triggerCue.trim() || undefined,
    };

    if (initialTask) {
      updateTask(initialTask.id, payload as Partial<TaskItem>);
    } else {
      addTask(payload);
    }

    onClose();
  };

  const selectedGoal = goals.find((g) => g.id === linkedGoalId);

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-hidden">
      <div 
        className="relative w-full max-w-3xl max-h-[92vh] flex flex-col bg-white dark:bg-[#141416] border-2 border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden animate-modal-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/90 dark:bg-zinc-900/90 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-black shadow-md flex-shrink-0">
              {initialTask ? <SlidersHorizontal className="w-5 h-5" /> : <Plus className="w-5 h-5 stroke-[2.5]" />}
            </div>
            <div className="text-left">
              <h2 className="text-base sm:text-lg font-bold text-black dark:text-white tracking-tight">
                {initialTask ? 'Редактирование задачи' : 'Создание задачи или рутины'}
              </h2>
              <p className="text-xs text-zinc-500 font-medium">
                Тайм-блокинг, чеклисты, привязка к цели и триггеры привычек
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors btn-spring"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. Segmented Tab Bar */}
        <div className="flex-shrink-0 px-4 py-2 bg-zinc-100/70 dark:bg-zinc-900/40 border-b border-zinc-200 dark:border-zinc-800">
          <div className="grid grid-cols-5 p-1 rounded-2xl bg-zinc-200/60 dark:bg-zinc-800/60 gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('general')}
              className={`py-2 px-2 rounded-xl text-xs sm:text-sm font-bold transition-all btn-spring flex items-center justify-center gap-1.5 ${
                activeTab === 'general'
                  ? 'bg-white dark:bg-zinc-900 text-black dark:text-white shadow-sm border border-zinc-200/80 dark:border-zinc-700'
                  : 'text-zinc-500 hover:text-black dark:hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Основное</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('time')}
              className={`py-2 px-2 rounded-xl text-xs sm:text-sm font-bold transition-all btn-spring flex items-center justify-center gap-1.5 ${
                activeTab === 'time'
                  ? 'bg-white dark:bg-zinc-900 text-black dark:text-white shadow-sm border border-zinc-200/80 dark:border-zinc-700'
                  : 'text-zinc-500 hover:text-black dark:hover:text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Время</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('priority')}
              className={`py-2 px-2 rounded-xl text-xs sm:text-sm font-bold transition-all btn-spring flex items-center justify-center gap-1.5 ${
                activeTab === 'priority'
                  ? 'bg-white dark:bg-zinc-900 text-black dark:text-white shadow-sm border border-zinc-200/80 dark:border-zinc-700'
                  : 'text-zinc-500 hover:text-black dark:hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Параметры</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('subtasks')}
              className={`py-2 px-2 rounded-xl text-xs sm:text-sm font-bold transition-all btn-spring flex items-center justify-center gap-1.5 ${
                activeTab === 'subtasks'
                  ? 'bg-white dark:bg-zinc-900 text-black dark:text-white shadow-sm border border-zinc-200/80 dark:border-zinc-700'
                  : 'text-zinc-500 hover:text-black dark:hover:text-white'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Чеклист</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('goal')}
              className={`py-2 px-2 rounded-xl text-xs sm:text-sm font-bold transition-all btn-spring flex items-center justify-center gap-1.5 ${
                activeTab === 'goal'
                  ? 'bg-white dark:bg-zinc-900 text-black dark:text-white shadow-sm border border-zinc-200/80 dark:border-zinc-700'
                  : 'text-zinc-500 hover:text-black dark:hover:text-white'
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Цель & Триггер</span>
            </button>
          </div>
        </div>

        {/* 3. Scrollable Form Content */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-left">
            
            {/* 1. GENERAL TAB */}
            {activeTab === 'general' && (
              <div className="space-y-4 animate-tab-content">
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-black dark:text-white mb-1.5">
                    Название задачи *
                  </label>
                  <input
                    type="text"
                    placeholder="Что конкретно нужно сделать?"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    autoFocus
                    required
                    className="w-full py-3 px-4 text-sm sm:text-base font-bold rounded-2xl bg-white dark:bg-[#18181B] text-black dark:text-white border-2 border-zinc-300 dark:border-zinc-700 focus:border-black dark:focus:border-white outline-none transition-all placeholder:font-normal placeholder:text-zinc-400"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-bold text-black dark:text-white mb-1.5">
                    Детальное описание и заметки
                  </label>
                  <textarea
                    placeholder="Контекст, полезные ссылки, инструкции..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full py-2.5 px-3.5 text-xs sm:text-sm font-medium rounded-2xl bg-white dark:bg-[#18181B] text-black dark:text-white border-2 border-zinc-300 dark:border-zinc-700 focus:border-black dark:focus:border-white outline-none transition-all resize-none placeholder:text-zinc-400"
                  />
                </div>

                {/* Tags Section */}
                <div className="space-y-2">
                  <label className="block text-xs sm:text-sm font-bold text-black dark:text-white">
                    Теги & Категории
                  </label>
                  
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <TagIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                      <input
                        type="text"
                        placeholder="Добавить тег..."
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleTagInputKeyDown}
                        className="w-full py-2.5 pl-10 pr-3 text-xs sm:text-sm font-medium rounded-xl bg-white dark:bg-[#18181B] text-black dark:text-white border-2 border-zinc-300 dark:border-zinc-700 focus:border-black dark:focus:border-white outline-none"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAddTag(tagInput)}
                      className="px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-xs font-bold text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black border border-zinc-300 dark:border-zinc-700 transition-all btn-spring"
                    >
                      Добавить
                    </button>
                  </div>

                  {/* Active Tags */}
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {tags.map((t) => (
                        <span
                          key={t}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-xs font-bold text-black dark:text-white border border-zinc-300 dark:border-zinc-700"
                        >
                          #{t}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(t)}
                            className="text-zinc-400 hover:text-red-500"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 2. TIME TAB */}
            {activeTab === 'time' && (
              <div className="space-y-4 animate-tab-content">
                {/* Type Selection */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-black dark:text-white">
                    Тип задачи
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setTaskType('one_off')}
                      className={`p-3 rounded-2xl border-2 text-center transition-all btn-spring ${
                        taskType === 'one_off'
                          ? 'bg-black dark:bg-white text-white dark:text-black border-transparent shadow-sm'
                          : 'bg-white dark:bg-[#18181B] text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800'
                      }`}
                    >
                      <div className="text-xs font-bold">Разовая</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTaskType('routine')}
                      className={`p-3 rounded-2xl border-2 text-center transition-all btn-spring ${
                        taskType === 'routine'
                          ? 'bg-black dark:bg-white text-white dark:text-black border-transparent shadow-sm'
                          : 'bg-white dark:bg-[#18181B] text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800'
                      }`}
                    >
                      <div className="text-xs font-bold flex items-center justify-center gap-1">
                        <Repeat className="w-3.5 h-3.5" /> Рутина
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTaskType('milestone')}
                      className={`p-3 rounded-2xl border-2 text-center transition-all btn-spring ${
                        taskType === 'milestone'
                          ? 'bg-black dark:bg-white text-white dark:text-black border-transparent shadow-sm'
                          : 'bg-white dark:bg-[#18181B] text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800'
                      }`}
                    >
                      <div className="text-xs font-bold flex items-center justify-center gap-1">
                        <Target className="w-3.5 h-3.5" /> Веха
                      </div>
                    </button>
                  </div>
                </div>

                {/* Routine Frequency */}
                {taskType === 'routine' && (
                  <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-3">
                    <label className="block text-xs font-bold text-black dark:text-white">
                      Частота повторения
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: 'daily', label: 'Ежедневно' },
                        { id: 'weekdays', label: 'По будням' },
                        { id: 'weekends', label: 'По выходным' },
                        { id: 'custom', label: 'Выбранные дни' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setFrequency(item.id as any)}
                          className={`p-2 rounded-xl text-xs font-bold border transition-all btn-spring ${
                            frequency === item.id
                              ? 'bg-black dark:bg-white text-white dark:text-black border-transparent shadow-sm'
                              : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>

                    {frequency === 'custom' && (
                      <div className="flex items-center gap-1.5 pt-2">
                        {DAYS_MAP.map((d) => (
                          <button
                            key={d.day}
                            type="button"
                            onClick={() => handleToggleCustomDay(d.day)}
                            className={`w-9 h-9 rounded-xl text-xs font-bold border transition-all btn-spring ${
                              customDays.includes(d.day)
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
                )}

                {/* Time Estimate */}
                <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-black dark:text-white flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hasTimeEstimate}
                        onChange={(e) => setHasTimeEstimate(e.target.checked)}
                        className="rounded"
                      />
                      Оценка длительности фокуса
                    </label>
                    {hasTimeEstimate && (
                      <span className="text-xs font-mono font-bold text-black dark:text-white">
                        {estimatedMinutes} мин
                      </span>
                    )}
                  </div>

                  {hasTimeEstimate && (
                    <div className="space-y-3 pt-1">
                      <div className="grid grid-cols-4 gap-1.5">
                        {TIME_PRESETS.map((p) => (
                          <button
                            key={p.value}
                            type="button"
                            onClick={() => setEstimatedMinutes(p.value)}
                            className={`py-1.5 text-xs font-bold rounded-xl border transition-all btn-spring ${
                              estimatedMinutes === p.value
                                ? 'bg-black dark:bg-white text-white dark:text-black border-transparent shadow-sm'
                                : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700'
                            }`}
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>

                      <label className="flex items-center gap-2 text-xs font-medium text-zinc-600 dark:text-zinc-400 cursor-pointer pt-1">
                        <input
                          type="checkbox"
                          checked={autoCompleteOnTimerEnd}
                          onChange={(e) => setAutoCompleteOnTimerEnd(e.target.checked)}
                          className="rounded"
                        />
                        Автоматически завершать задачу по окончании таймера
                      </label>
                    </div>
                  )}
                </div>

                {/* Dates & Time Slots */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <M3Input
                    label="Срок выполнения (Дедлайн)"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                  <M3Input
                    label="Тайм-слот дня (например: 09:00 - 10:00)"
                    placeholder="10:00 - 11:30"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* 3. PRIORITY & PARAMETERS TAB */}
            {activeTab === 'priority' && (
              <div className="space-y-4 animate-tab-content">
                {/* Priority */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-black dark:text-white">
                    Приоритет
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'low', label: 'Низкий' },
                      { id: 'medium', label: 'Средний' },
                      { id: 'high', label: 'Высокий' },
                      { id: 'critical', label: 'Критичный' },
                    ].map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setPriority(p.id as any)}
                        className={`p-3 rounded-2xl border-2 text-xs font-bold transition-all btn-spring ${
                          priority === p.id
                            ? 'bg-black dark:bg-white text-white dark:text-black border-transparent shadow-sm'
                            : 'bg-white dark:bg-[#18181B] text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Energy */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-black dark:text-white">
                    Уровень энергии
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'low', label: 'Легкий' },
                      { id: 'medium', label: 'Обычный' },
                      { id: 'high', label: 'Глубокий фокус' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setEnergyLevel(item.id as any)}
                        className={`p-3 rounded-2xl border-2 text-xs font-bold transition-all btn-spring ${
                          energyLevel === item.id
                            ? 'bg-black dark:bg-white text-white dark:text-black border-transparent shadow-sm'
                            : 'bg-white dark:bg-[#18181B] text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Complexity */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-black dark:text-white">
                    Сложность
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'easy', label: 'Простая' },
                      { id: 'medium', label: 'Средняя' },
                      { id: 'hard', label: 'Комплексная' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setComplexity(item.id as any)}
                        className={`p-3 rounded-2xl border-2 text-xs font-bold transition-all btn-spring ${
                          complexity === item.id
                            ? 'bg-black dark:bg-white text-white dark:text-black border-transparent shadow-sm'
                            : 'bg-white dark:bg-[#18181B] text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 4. SUBTASKS & METRICS TAB */}
            {activeTab === 'subtasks' && (
              <div className="space-y-4 animate-tab-content">
                {/* Checklist */}
                <div className="space-y-2.5">
                  <label className="block text-xs font-bold text-black dark:text-white">
                    Чеклист подзадач ({checklist.length})
                  </label>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Название шага..."
                      value={newSubTaskTitle}
                      onChange={(e) => setNewSubTaskTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSubTask();
                        }
                      }}
                      className="flex-1 py-2.5 px-3.5 text-xs sm:text-sm font-medium rounded-xl bg-white dark:bg-[#18181B] text-black dark:text-white border-2 border-zinc-300 dark:border-zinc-700 outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddSubTask}
                      className="px-4 py-2.5 rounded-xl bg-black dark:bg-white text-white dark:text-black text-xs font-bold btn-spring"
                    >
                      + Шаг
                    </button>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    {checklist.map((st) => (
                      <div
                        key={st.id}
                        className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700"
                      >
                        <span className="text-xs font-medium text-black dark:text-white truncate">
                          {st.title}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSubTask(st.id)}
                          className="text-zinc-400 hover:text-red-500 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Numeric Metric */}
                <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-3">
                  <label className="flex items-center gap-2 text-xs font-bold text-black dark:text-white cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasMetric}
                      onChange={(e) => setHasMetric(e.target.checked)}
                      className="rounded"
                    />
                    Числовая цель прогресса (страницы, подходы, задачи)
                  </label>

                  {hasMetric && (
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <M3Input
                        label="Целевое значение"
                        type="number"
                        min={1}
                        value={metricTarget.target}
                        onChange={(e) =>
                          setMetricTarget({ ...metricTarget, target: Number(e.target.value) || 1 })
                        }
                      />
                      <M3Input
                        label="Единица измерения"
                        value={metricTarget.unit}
                        onChange={(e) =>
                          setMetricTarget({ ...metricTarget, unit: e.target.value })
                        }
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 5. GOAL LINKAGE & HABIT STACKING TAB */}
            {activeTab === 'goal' && (
              <div className="space-y-4 animate-tab-content">
                {/* Link to Active Goal */}
                <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border-2 border-zinc-200 dark:border-zinc-800 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-black dark:text-white">
                    <Target className="w-4 h-4" />
                    <span>Вклад в долгосрочную цель</span>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400">
                      Выберите цель из ваших траекторий
                    </label>
                    <select
                      value={linkedGoalId}
                      onChange={(e) => setLinkedGoalId(e.target.value)}
                      className="w-full py-2.5 px-3 text-xs sm:text-sm font-semibold rounded-xl bg-white dark:bg-[#18181B] text-black dark:text-white border-2 border-zinc-200 dark:border-zinc-800 outline-none"
                    >
                      <option value="">(Не привязана к цели)</option>
                      {goals.map((g) => (
                        <option key={g.id} value={g.id}>
                          {g.title} ({g.currentValue}/{g.targetValue} {g.unit})
                        </option>
                      ))}
                    </select>
                  </div>

                  {linkedGoalId && selectedGoal && (
                    <div className="p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-black dark:text-white">
                        <span>Вклад при выполнении задачи:</span>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            min={0.1}
                            step={0.5}
                            value={goalImpactValue}
                            onChange={(e) => setGoalImpactValue(e.target.value)}
                            className="w-20 py-1 px-2 text-xs font-mono font-bold text-center rounded-lg bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-black dark:text-white"
                          />
                          <span className="font-bold">{selectedGoal.unit}</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-zinc-500">
                        При завершении этой задачи к цели <strong>«{selectedGoal.title}»</strong> автоматически добавится <strong>+{goalImpactValue} {selectedGoal.unit}</strong>.
                      </p>
                    </div>
                  )}
                </div>

                {/* Habit Stacking Cue */}
                <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border-2 border-zinc-200 dark:border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-black dark:text-white">
                      <Sparkles className="w-4 h-4" />
                      <span>Триггер привычки (Habit Stacking)</span>
                    </div>
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
              </div>
            )}
          </div>

          {/* 4. Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/90 dark:bg-zinc-900/90 flex-shrink-0">
            <M3Button variant="ghost" size="md" onClick={onClose}>
              Отмена
            </M3Button>
            <M3Button variant="primary" size="md" type="submit" className="px-6 font-bold shadow-md">
              {initialTask ? 'Сохранить изменения' : 'Создать задачу'}
            </M3Button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
