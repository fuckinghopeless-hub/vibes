import React, { useState } from 'react';
import { 
  Check, 
  Trash2, 
  Edit3, 
  Clock, 
  Calendar, 
  Flame, 
  Repeat, 
  Target, 
  CheckSquare, 
  ChevronDown, 
  ChevronUp, 
  Play, 
  Zap, 
  Plus, 
  Minus, 
  Sparkles 
} from 'lucide-react';
import { TaskItem, TaskPriority } from '../../../types';
import { useVibeStore } from '../../../store/useVibeStore';

interface TaskCardProps {
  task: TaskItem;
  onEdit: (task: TaskItem) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit }) => {
  const { toggleTask, toggleSubTask, updateTaskMetric, deleteTask, startTaskFocus, goals } = useVibeStore();
  const [isExpanded, setIsExpanded] = useState(false);

  const linkedGoal = goals.find((g) => g.id === task.linkedGoalId);

  const priorityMeta: Record<TaskPriority, { label: string; bg: string }> = {
    low: { label: 'Низкий', bg: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700' },
    medium: { label: 'Средний', bg: 'bg-zinc-200/80 dark:bg-zinc-700/70 text-zinc-800 dark:text-zinc-200 border-zinc-300 dark:border-zinc-600' },
    high: { label: 'Высокий', bg: 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black border-transparent font-bold' },
    critical: { label: 'Критичный', bg: 'bg-red-600 text-white dark:bg-red-500 dark:text-white border-transparent font-bold ring-1 ring-red-500/30' },
  };

  const energyMeta: Record<string, string> = {
    low: 'Легкий',
    medium: 'Обычный',
    high: 'Глубокий фокус',
  };

  const complexityMeta: Record<string, string> = {
    easy: 'Простая',
    medium: 'Средняя',
    hard: 'Комплексная',
  };

  // Subtasks calculation
  const totalSubtasks = task.checklist?.length || 0;
  const completedSubtasks = task.checklist?.filter((s) => s.isCompleted).length || 0;
  const subtasksPercent = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  // Format estimated time
  const formatTime = (mins: number) => {
    if (mins >= 60) {
      const h = Math.floor(mins / 60);
      const m = mins % 60;
      return m > 0 ? `${h} ч ${m} мин` : `${h} ч`;
    }
    return `${mins} мин`;
  };

  // Routine frequency text
  const getFrequencyText = () => {
    if (task.type !== 'routine') return null;
    if (task.schedule?.frequency === 'weekdays') return 'По будням';
    if (task.schedule?.frequency === 'weekends') return 'По выходным';
    if (task.schedule?.frequency === 'custom') return 'Выбранные дни';
    return 'Ежедневно';
  };

  const hasExtraDetails = Boolean(
    task.description ||
    (task.checklist && task.checklist.length > 0) ||
    task.metricTarget ||
    task.completionCriteria ||
    linkedGoal ||
    task.triggerCue
  );

  const hasTime = Boolean(task.hasTimeEstimate && task.estimatedMinutes && task.estimatedMinutes > 0);

  const handleStartFocus = (e: React.MouseEvent) => {
    e.stopPropagation();
    startTaskFocus(
      task.id, 
      task.estimatedMinutes || 25, 
      task.title, 
      task.autoCompleteOnTimerEnd !== false
    );
  };

  return (
    <div
      className={`rounded-3xl border-2 card-spring overflow-hidden ${
        task.isCompleted
          ? 'bg-zinc-50/80 dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800/80 opacity-60'
          : 'bg-white dark:bg-[#18181B] border-zinc-200 dark:border-zinc-700/80 hover:border-black dark:hover:border-zinc-400 shadow-sm'
      }`}
    >
      <div className="p-4 sm:p-5 flex flex-col gap-3">
        {/* Main top row */}
        <div className="flex items-start justify-between gap-3">
          {/* Checkbox and main info */}
          <div className="flex items-start gap-3.5 flex-1 min-w-0">
            {/* Unified 24px Checkbox */}
            <button
              type="button"
              onClick={() => toggleTask(task.id)}
              className={`w-6 h-6 rounded-xl flex items-center justify-center border-2 transition-all btn-spring mt-0.5 flex-shrink-0 ${
                task.isCompleted
                  ? 'bg-black dark:bg-white border-black dark:border-white text-white dark:text-black shadow-sm'
                  : 'border-zinc-300 dark:border-zinc-600 hover:border-black dark:hover:border-white'
              }`}
              title={task.isCompleted ? 'Отменить выполнение' : 'Отметить выполненной'}
            >
              {task.isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </button>

            {/* Title & Metadata */}
            <div className="space-y-1.5 flex-1 min-w-0 text-left">
              <div className="flex flex-wrap items-center gap-1.5">
                <h3
                  onClick={() => toggleTask(task.id)}
                  className={`text-sm sm:text-base font-bold cursor-pointer select-none tracking-tight break-words transition-colors ${
                    task.isCompleted
                      ? 'line-through text-zinc-400 dark:text-zinc-500 font-semibold'
                      : 'text-black dark:text-white hover:opacity-85'
                  }`}
                >
                  {task.title}
                </h3>

                {/* Priority Badge */}
                {task.priority && task.priority !== 'medium' && (
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg border ${priorityMeta[task.priority].bg}`}
                  >
                    {priorityMeta[task.priority].label}
                  </span>
                )}

                {/* Routine Streak Badge */}
                {task.type === 'routine' && (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 flex items-center gap-1">
                    <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span>{task.streakCount || 0} дн</span>
                  </span>
                )}

                {/* Routine Recurrence Badge */}
                {task.type === 'routine' && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700 flex items-center gap-1">
                    <Repeat className="w-3 h-3" />
                    {getFrequencyText()}
                  </span>
                )}

                {/* Linked Goal Badge */}
                {linkedGoal && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white border border-zinc-200 dark:border-zinc-700 flex items-center gap-1">
                    <Target className="w-3 h-3 text-black dark:text-white" />
                    <span className="truncate max-w-[140px]">{linkedGoal.title} (+{task.goalImpactValue || 1} {linkedGoal.unit})</span>
                  </span>
                )}

                {/* Habit Stacking Trigger Badge */}
                {task.triggerCue && (
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span className="truncate max-w-[150px]">{task.triggerCue}</span>
                  </span>
                )}

                {/* Energy Badge */}
                {task.energyLevel && task.energyLevel !== 'medium' && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    {energyMeta[task.energyLevel]}
                  </span>
                )}

                {/* Complexity Badge */}
                {task.complexity && task.complexity !== 'medium' && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                    {complexityMeta[task.complexity]}
                  </span>
                )}

                {/* Milestone Badge */}
                {task.type === 'milestone' && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-black text-white dark:bg-white dark:text-black flex items-center gap-1">
                    <Target className="w-3 h-3" />
                    Веха
                  </span>
                )}
              </div>

              {/* Tags line */}
              {task.tags && task.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-1 pt-0.5">
                  {task.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}

              {/* Quick Info bar */}
              <div className="flex flex-wrap items-center gap-3 text-xs font-mono font-medium text-zinc-500 dark:text-zinc-400 pt-0.5">
                {/* Estimated Time */}
                {hasTime && (
                  <span className="flex items-center gap-1 font-bold text-black dark:text-white bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-lg border border-zinc-200 dark:border-zinc-700">
                    <Clock className="w-3.5 h-3.5" />
                    {formatTime(task.estimatedMinutes || 30)}
                    {task.autoCompleteOnTimerEnd && (
                      <span className="text-[10px] text-zinc-400 font-normal"> (авто)</span>
                    )}
                  </span>
                )}

                {/* Scheduled Slot or Due Date */}
                {task.scheduledTime && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-zinc-400" />
                    {task.scheduledTime}
                  </span>
                )}

                {task.dueDate && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-zinc-400" />
                    Срок: {task.dueDate}
                  </span>
                )}

                {/* Subtask count */}
                {totalSubtasks > 0 && (
                  <span className="flex items-center gap-1 font-bold text-black dark:text-white">
                    <CheckSquare className="w-3.5 h-3.5" />
                    {completedSubtasks}/{totalSubtasks} ({subtasksPercent}%)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {/* Quick focus session button */}
            {hasTime && !task.isCompleted && (
              <button
                type="button"
                onClick={handleStartFocus}
                className="px-2.5 py-1.5 text-black dark:text-white bg-zinc-100 dark:bg-zinc-800 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black rounded-xl btn-spring transition-all border border-zinc-200 dark:border-zinc-700 flex items-center gap-1 text-xs font-bold shadow-sm"
                title="Перейти к таймеру фокуса"
              >
                <Play className="w-3 h-3 fill-current" />
                <span className="hidden sm:inline">Фокус</span>
              </button>
            )}

            {/* Edit button */}
            <button
              type="button"
              onClick={() => onEdit(task)}
              className="p-2 text-zinc-500 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors btn-spring"
              title="Редактировать задачу"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>

            {/* Delete button */}
            <button
              type="button"
              onClick={() => deleteTask(task.id)}
              className="p-2 text-zinc-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors btn-spring"
              title="Удалить задачу"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>

            {/* Expand / Collapse Button */}
            {hasExtraDetails && (
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-2 text-zinc-500 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors btn-spring"
                title={isExpanded ? 'Скрыть детали' : 'Раскрыть подробности'}
              >
                {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            )}
          </div>
        </div>

        {/* Subtasks mini-progress bar */}
        {totalSubtasks > 0 && !isExpanded && (
          <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
            <div
              style={{ width: `${subtasksPercent}%` }}
              className="h-full bg-black dark:bg-white rounded-full transition-all duration-300 ease-out"
            />
          </div>
        )}

        {/* Expanded Details Section */}
        {isExpanded && hasExtraDetails && (
          <div className="mt-1 pt-3 border-t border-zinc-100 dark:border-zinc-800 space-y-3 text-left text-xs animate-tab-content">
            {/* Description */}
            {task.description && (
              <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 text-zinc-700 dark:text-zinc-300 text-xs sm:text-sm font-medium leading-relaxed whitespace-pre-wrap border border-zinc-200 dark:border-zinc-800">
                {task.description}
              </div>
            )}

            {/* Interactive Checklist */}
            {task.checklist && task.checklist.length > 0 && (
              <div className="space-y-2 p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center justify-between text-xs font-bold text-black dark:text-white mb-1">
                  <span className="flex items-center gap-1.5">
                    <CheckSquare className="w-3.5 h-3.5" /> Чеклист ({completedSubtasks}/{totalSubtasks})
                  </span>
                  <span className="font-mono">{subtasksPercent}%</span>
                </div>

                <div className="w-full bg-zinc-200 dark:bg-zinc-700 h-1.5 rounded-full overflow-hidden mb-1.5">
                  <div
                    style={{ width: `${subtasksPercent}%` }}
                    className="h-full bg-black dark:bg-white rounded-full transition-all duration-300 ease-out"
                  />
                </div>

                <div className="space-y-1.5">
                  {task.checklist.map((sub) => (
                    <div
                      key={sub.id}
                      onClick={() => toggleSubTask(task.id, sub.id)}
                      className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-white dark:hover:bg-zinc-800 cursor-pointer select-none transition-colors border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700 btn-spring"
                    >
                      <div
                        className={`w-4 h-4 rounded-lg flex items-center justify-center border-2 transition-colors flex-shrink-0 ${
                          sub.isCompleted
                            ? 'bg-black dark:bg-white border-black dark:border-white text-white dark:text-black'
                            : 'border-zinc-400 dark:border-zinc-600'
                        }`}
                      >
                        {sub.isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <span
                        className={`text-xs sm:text-sm font-medium ${
                          sub.isCompleted
                            ? 'line-through text-zinc-400 dark:text-zinc-500'
                            : 'text-zinc-900 dark:text-zinc-100'
                        }`}
                      >
                        {sub.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Metric Target Bar */}
            {task.metricTarget && (
              <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-black dark:text-white">
                  <span className="flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5" /> Прогресс цели:
                  </span>
                  <span className="font-mono font-bold text-xs sm:text-sm">
                    {task.metricTarget.current} / {task.metricTarget.target} {task.metricTarget.unit}
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="flex-1 bg-zinc-200 dark:bg-zinc-700 h-2 rounded-full overflow-hidden">
                    <div
                      style={{
                        width: `${Math.min(100, Math.round((task.metricTarget.current / task.metricTarget.target) * 100))}%`,
                      }}
                      className="h-full bg-black dark:bg-white rounded-full transition-all duration-300 ease-out"
                    />
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() =>
                        updateTaskMetric(task.id, Math.max(0, (task.metricTarget?.current || 0) - 1))
                      }
                      className="p-1 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 hover:border-black dark:hover:border-white btn-spring"
                      title="Уменьшить"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        updateTaskMetric(task.id, (task.metricTarget?.current || 0) + 1)
                      }
                      className="p-1 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 hover:border-black dark:hover:border-white btn-spring"
                      title="Увеличить"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
