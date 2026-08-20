import React, { useState } from 'react';
import { Plus, Check, Trash2, Timer, Calendar, Tag } from 'lucide-react';
import { useVibeStore } from '../../store/useVibeStore';
import { TaskPriority, TaskType } from '../../types';
import { M3Button } from '../ui/M3Button';
import { M3Card } from '../ui/M3Card';
import { M3Input } from '../ui/M3Input';

export const TasksTab: React.FC = () => {
  const { tasks, addTask, toggleTask, deleteTask } = useVibeStore();
  const [isAdding, setIsAdding] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  // Flexible task form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [type, setType] = useState<TaskType>('one_off');
  const [estimatedPomodoros, setEstimatedPomodoros] = useState(1);
  const [tag, setTag] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addTask({
      title,
      description,
      priority,
      type,
      estimatedPomodoros,
      tag: tag || undefined,
      dueDate: dueDate || undefined,
    });

    // Reset
    setTitle('');
    setDescription('');
    setPriority('medium');
    setType('one_off');
    setEstimatedPomodoros(1);
    setTag('');
    setDueDate('');
    setIsAdding(false);
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'active') return !t.isCompleted;
    if (filter === 'completed') return t.isCompleted;
    return true;
  });

  const completedCount = tasks.filter((t) => t.isCompleted).length;

  const priorityLabels: Record<TaskPriority, { label: string; bg: string }> = {
    low: { label: 'Низкий', bg: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300' },
    medium: { label: 'Средний', bg: 'bg-zinc-200 dark:bg-zinc-700 text-black dark:text-white' },
    high: { label: 'Высокий', bg: 'bg-zinc-300 dark:bg-zinc-600 text-black dark:text-white font-bold' },
    critical: { label: 'Критический', bg: 'bg-black dark:bg-white text-white dark:text-black font-extrabold' },
  };

  const typeLabels: Record<TaskType, string> = {
    one_off: 'Разовая',
    daily: 'Ежедневная',
    habit: 'Привычка',
  };

  const quickTags = ['Код', 'Работа', 'Учеба', 'Спорт', 'Личное'];

  return (
    <div className="space-y-6 w-full">
      {/* Top Controls & Summary */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-black dark:text-white tracking-tight">Задачи & Привычки</h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Гибкая система планирования: приоритеты, дедлайны и тайм-блоки
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Filter Pills */}
          <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl border border-zinc-200 dark:border-zinc-700">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                filter === 'all'
                  ? 'bg-white dark:bg-zinc-700 text-black dark:text-white shadow-sm'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white'
              }`}
            >
              Все ({tasks.length})
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                filter === 'active'
                  ? 'bg-white dark:bg-zinc-700 text-black dark:text-white shadow-sm'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white'
              }`}
            >
              В работе ({tasks.length - completedCount})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                filter === 'completed'
                  ? 'bg-white dark:bg-zinc-700 text-black dark:text-white shadow-sm'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white'
              }`}
            >
              Готово ({completedCount})
            </button>
          </div>

          {!isAdding && (
            <M3Button variant="primary" size="sm" onClick={() => setIsAdding(true)} leftIcon={<Plus className="w-4 h-4" />}>
              Создать
            </M3Button>
          )}
        </div>
      </div>

      {/* Flexible Task Creation Form */}
      {isAdding && (
        <M3Card className="p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/80 pb-3">
            <h3 className="font-bold text-base text-black dark:text-white">Конструктор задачи</h3>
            <span className="text-xs text-zinc-500">Настройте параметры</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <M3Input
              label="Название задачи"
              placeholder="Что нужно сделать?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              required
            />

            <M3Input
              label="Краткое описание (опционально)"
              placeholder="Детали, ссылки или заметки..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            {/* Type & Priority Pickers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Task Type */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-black dark:text-white">Тип задачи</label>
                <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl border border-zinc-200 dark:border-zinc-700">
                  {(['one_off', 'daily', 'habit'] as TaskType[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setType(t)}
                      className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                        type === t
                          ? 'bg-white dark:bg-zinc-700 text-black dark:text-white shadow-sm'
                          : 'text-zinc-500 hover:text-black dark:hover:text-white'
                      }`}
                    >
                      {typeLabels[t]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Priority */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-black dark:text-white">Приоритет</label>
                <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl border border-zinc-200 dark:border-zinc-700">
                  {(['low', 'medium', 'high', 'critical'] as TaskPriority[]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                        priority === p
                          ? 'bg-black dark:bg-white text-white dark:text-black shadow-sm'
                          : 'text-zinc-500 hover:text-black dark:hover:text-white'
                      }`}
                    >
                      {priorityLabels[p].label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Pomodoro & Due Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Pomodoro blocks */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-black dark:text-white flex items-center gap-1.5">
                  <Timer className="w-3.5 h-3.5" />
                  Оценка времени (Pomodoro × 25 мин)
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 6, 8].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setEstimatedPomodoros(num)}
                      className={`w-9 h-9 rounded-xl text-xs font-bold font-mono transition-all ${
                        estimatedPomodoros === num
                          ? 'bg-black dark:bg-white text-white dark:text-black'
                          : 'bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-black dark:hover:border-white'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Due date */}
              <M3Input
                label="Срок выполнения"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>

            {/* Tags */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-black dark:text-white flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" /> Категория / Тег
              </label>
              <div className="flex flex-wrap items-center gap-1.5">
                {quickTags.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTag(tag === t ? '' : t)}
                    className={`px-3 py-1 rounded-xl text-xs font-medium transition-all ${
                      tag === t
                        ? 'bg-black dark:bg-white text-white dark:text-black font-bold'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-400'
                    }`}
                  >
                    #{t}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
              <M3Button type="submit" variant="primary" size="md">
                Создать задачу
              </M3Button>
              <M3Button
                type="button"
                variant="ghost"
                size="md"
                onClick={() => setIsAdding(false)}
              >
                Отмена
              </M3Button>
            </div>
          </form>
        </M3Card>
      )}

      {/* Tasks List */}
      <M3Card className="p-6">
        {filteredTasks.length === 0 ? (
          <div className="py-12 px-4 text-center space-y-3">
            <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">
              {filter === 'all'
                ? 'Список задач пуст'
                : filter === 'active'
                ? 'Нет активных задач'
                : 'Нет выполненных задач'}
            </p>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 max-w-sm mx-auto">
              {filter === 'all'
                ? 'Нажмите кнопку «Создать», чтобы настроить параметры первой задачи.'
                : 'Все дела в этом разделе обработаны.'}
            </p>
            {!isAdding && filter === 'all' && (
              <div className="pt-2">
                <M3Button variant="tonal" size="sm" onClick={() => setIsAdding(true)} leftIcon={<Plus className="w-4 h-4" />}>
                  Создать первую задачу
                </M3Button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                  task.isCompleted
                    ? 'bg-zinc-50/70 dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800 opacity-60'
                    : 'bg-white dark:bg-[#18181B] border-zinc-200 dark:border-zinc-700 hover:border-black dark:hover:border-white shadow-sm'
                }`}
              >
                <div
                  onClick={() => toggleTask(task.id)}
                  className="flex items-start gap-3.5 flex-1 cursor-pointer select-none"
                >
                  <div
                    className={`w-5 h-5 rounded-lg flex items-center justify-center border-2 transition-colors mt-0.5 flex-shrink-0 ${
                      task.isCompleted
                        ? 'bg-black dark:bg-white border-black dark:border-white text-white dark:text-black'
                        : 'border-zinc-400 dark:border-zinc-600'
                    }`}
                  >
                    {task.isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-sm font-bold ${
                          task.isCompleted
                            ? 'line-through text-zinc-400 dark:text-zinc-500'
                            : 'text-black dark:text-white'
                        }`}
                      >
                        {task.title}
                      </span>

                      {/* Tags & Metadata */}
                      {task.tag && (
                        <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                          #{task.tag}
                        </span>
                      )}

                      {task.priority && task.priority !== 'medium' && (
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md ${priorityLabels[task.priority].bg}`}>
                          {priorityLabels[task.priority].label}
                        </span>
                      )}
                    </div>

                    {task.description && (
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                        {task.description}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-zinc-400 pt-0.5">
                      <span className="flex items-center gap-1">
                        <Timer className="w-3 h-3" />
                        {task.estimatedPomodoros} × 25м
                      </span>
                      {task.dueDate && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Срок: {task.dueDate}
                        </span>
                      )}
                      <span>Тип: {typeLabels[task.type || 'one_off']}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-1 pt-2 md:pt-0">
                  <button
                    type="button"
                    onClick={() => deleteTask(task.id)}
                    className="p-2 text-zinc-400 hover:text-red-500 dark:hover:text-red-400 transition-colors rounded-lg"
                    title="Удалить задачу"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </M3Card>
    </div>
  );
};
