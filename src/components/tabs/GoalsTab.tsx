import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  Plus, 
  Trash2, 
  Calendar, 
  Target, 
  CheckCircle2, 
  AlertCircle, 
  Layers, 
  Grid, 
  GitCommit, 
  Check, 
  Play, 
  Edit3, 
  Sparkles,
  Repeat
} from 'lucide-react';
import { useVibeStore } from '../../store/useVibeStore';
import { GoalItem } from '../../types';
import { M3Button } from '../ui/M3Button';
import { M3Card } from '../ui/M3Card';
import { GoalEditorModal } from './goals/GoalEditorModal';
import { 
  calculateGoalTrajectory, 
  getTodayGoalStatus, 
  getWeeklyGoalProgress, 
  generate30DaysHeatmap 
} from '../../lib/goals';

type ViewMode = 'cards' | 'heatmap' | 'stacks';

export const GoalsTab: React.FC = () => {
  const { goals, deleteGoal, logGoalProgress, startTaskFocus, tasks } = useVibeStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<GoalItem | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = useMemo(() => {
    const set = new Set<string>();
    goals.forEach((g) => {
      if (g.category) set.add(g.category);
    });
    return ['all', ...Array.from(set)];
  }, [goals]);

  const filteredGoals = useMemo(() => {
    return goals.filter((g) => {
      if (selectedCategory !== 'all' && g.category !== selectedCategory) return false;
      return true;
    });
  }, [goals, selectedCategory]);

  // Group goals by Trigger Cue for Habit Stacking timeline
  const triggerGroups = useMemo(() => {
    const map = new Map<string, GoalItem[]>();
    filteredGoals.forEach((g) => {
      const cue = g.triggerCue?.trim() || 'Без триггера (по расписанию)';
      const list = map.get(cue) || [];
      list.push(g);
      map.set(cue, list);
    });
    return Array.from(map.entries());
  }, [filteredGoals]);

  const handleOpenCreate = () => {
    setEditingGoal(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (goal: GoalItem) => {
    setEditingGoal(goal);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 w-full max-w-5xl mx-auto text-left">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-black dark:text-white tracking-tight">
            Траектории Целей & Привычки
          </h2>
          <p className="text-xs sm:text-sm font-medium text-zinc-500 dark:text-zinc-400 mt-1">
            Эластичные привычки (Min/Norm/Max), идеальный темп Beeminder и цепочки триггеров
          </p>
        </div>

        <div className="flex items-center gap-2">
          <M3Button
            variant="primary"
            size="md"
            onClick={handleOpenCreate}
            className="px-5 py-2.5 font-bold shadow-md"
            leftIcon={<Plus className="w-4 h-4 stroke-[2.5]" />}
          >
            Новая цель
          </M3Button>
        </div>
      </div>

      {/* Controls Bar: View Switcher & Category Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-2 rounded-2xl bg-zinc-100/80 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
        {/* View Mode Switcher */}
        <div className="flex bg-white dark:bg-zinc-800 p-1 rounded-xl border border-zinc-200 dark:border-zinc-700">
          <button
            type="button"
            onClick={() => setViewMode('cards')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all btn-spring flex items-center gap-1.5 ${
              viewMode === 'cards'
                ? 'bg-black dark:bg-white text-white dark:text-black shadow-sm'
                : 'text-zinc-500 hover:text-black dark:hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Карточки</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('heatmap')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all btn-spring flex items-center gap-1.5 ${
              viewMode === 'heatmap'
                ? 'bg-black dark:bg-white text-white dark:text-black shadow-sm'
                : 'text-zinc-500 hover:text-black dark:hover:text-white'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Матрица (Heatmap)</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('stacks')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all btn-spring flex items-center gap-1.5 ${
              viewMode === 'stacks'
                ? 'bg-black dark:bg-white text-white dark:text-black shadow-sm'
                : 'text-zinc-500 hover:text-black dark:hover:text-white'
            }`}
          >
            <GitCommit className="w-3.5 h-3.5" />
            <span>Триггеры (Stacks)</span>
          </button>
        </div>

        {/* Categories Chips */}
        {categories.length > 2 && (
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-black dark:bg-white text-white dark:text-black shadow-sm'
                    : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
                }`}
              >
                {cat === 'all' ? 'Все категории' : cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Content Rendering */}
      {goals.length === 0 ? (
        <M3Card className="p-10 sm:p-12 text-center space-y-4">
          <div className="w-14 h-14 rounded-3xl bg-zinc-100 dark:bg-zinc-800 text-zinc-400 flex items-center justify-center mx-auto shadow-inner">
            <TrendingUp className="w-7 h-7" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-base sm:text-lg font-bold text-black dark:text-white">
              Нет активных траекторий целей
            </h3>
            <p className="text-xs sm:text-sm font-medium text-zinc-500 max-w-md mx-auto">
              Создайте цель с эластичными уровнями (Минимум / Норма / Максимум) и триггерами привычек, чтобы выстроить идеальный темп.
            </p>
          </div>

          <div className="pt-2">
            <M3Button
              variant="primary"
              size="md"
              onClick={handleOpenCreate}
              className="px-6 py-3 font-bold text-sm"
              leftIcon={<Plus className="w-4 h-4 stroke-[3]" />}
            >
              Создать первую цель
            </M3Button>
          </div>
        </M3Card>
      ) : viewMode === 'cards' ? (
        /* 1. CARDS VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredGoals.map((goal) => {
            const trajectory = calculateGoalTrajectory(goal);
            const todayStatus = getTodayGoalStatus(goal);
            const weeklyProgress = getWeeklyGoalProgress(goal);
            const linkedTasks = tasks.filter((t) => t.linkedGoalId === goal.id);

            return (
              <M3Card
                key={goal.id}
                className="p-5 sm:p-6 space-y-4 text-left border-2 hover:border-black dark:hover:border-zinc-400 transition-all shadow-sm flex flex-col justify-between"
              >
                <div className="space-y-3.5">
                  {/* Top Row: Title, Category, Status, Actions */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                          {goal.category || 'Обучение'}
                        </span>

                        {goal.triggerCue && (
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border border-zinc-200 dark:border-zinc-700 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-amber-500" />
                            {goal.triggerCue}
                          </span>
                        )}
                      </div>

                      <h4 className="font-bold text-base text-black dark:text-white tracking-tight truncate">
                        {goal.title}
                      </h4>

                      {goal.description && (
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
                          {goal.description}
                        </p>
                      )}

                      <div className="flex items-center gap-3 text-xs font-mono text-zinc-400 pt-0.5">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {trajectory.daysRemaining} дн. до конца
                        </span>
                        {goal.frequencyType === 'times_per_week' && (
                          <span className="flex items-center gap-1">
                            <Repeat className="w-3 h-3" /> Неделя: {weeklyProgress.daysCompletedThisWeek}/{weeklyProgress.targetDaysThisWeek}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {trajectory.status === 'on_track' ? (
                        <span className="text-[11px] font-bold font-mono px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> В графике
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold font-mono px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> Отставание ({Math.abs(Math.round(trajectory.delta))} {goal.unit})
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => handleOpenEdit(goal)}
                        className="p-1.5 text-zinc-400 hover:text-black dark:hover:text-white rounded-xl transition-colors btn-spring"
                        title="Редактировать"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteGoal(goal.id)}
                        className="p-1.5 text-zinc-400 hover:text-red-500 rounded-xl transition-colors btn-spring"
                        title="Удалить"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-mono font-medium text-zinc-600 dark:text-zinc-400">
                      <span className="flex items-center gap-1">
                        <Target className="w-3.5 h-3.5" /> Прогресс:
                      </span>
                      <span className="font-bold text-black dark:text-white">
                        {goal.currentValue} / {goal.targetValue} {goal.unit} ({trajectory.percentProgress}%)
                      </span>
                    </div>

                    <div className="relative h-2.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-700">
                      <div
                        style={{ width: `${trajectory.percentProgress}%` }}
                        className="h-full bg-[var(--accent-primary)] rounded-full transition-all duration-300"
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                      <span>План: {trajectory.requiredValue} {goal.unit}</span>
                      <span>
                        {trajectory.delta >= 0 
                          ? `Опережение: +${Math.round(trajectory.delta)} ${goal.unit}`
                          : `Отставание: ${Math.round(trajectory.delta)} ${goal.unit}`
                        }
                      </span>
                    </div>
                  </div>

                  {/* Linked Tasks Preview */}
                  {linkedTasks.length > 0 && (
                    <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 space-y-1.5 text-xs">
                      <span className="text-[11px] font-bold text-zinc-500 block">
                        Связанные задачи ({linkedTasks.length}):
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {linkedTasks.map((lt) => (
                          <span
                            key={lt.id}
                            className={`px-2 py-0.5 rounded-lg text-[11px] font-medium border ${
                              lt.isCompleted
                                ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 line-through'
                                : 'bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border-zinc-200 dark:border-zinc-700'
                            }`}
                          >
                            {lt.title} (+{lt.goalImpactValue || 1} {goal.unit})
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Logging Controls */}
                <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-2">
                  {goal.trackingType === 'elastic' && goal.elasticTiers ? (
                    <div className="flex items-center gap-1.5 w-full">
                      <button
                        onClick={() => logGoalProgress(goal.id, goal.elasticTiers!.min.val, 'min', 'Минимум')}
                        className="flex-1 py-1.5 px-2 rounded-xl text-xs font-bold bg-zinc-100 dark:bg-zinc-800 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black border border-zinc-200 dark:border-zinc-700 transition-all btn-spring"
                        title={goal.elasticTiers.min.label}
                      >
                        🥉 Min (+{goal.elasticTiers.min.val})
                      </button>
                      <button
                        onClick={() => logGoalProgress(goal.id, goal.elasticTiers!.norm.val, 'norm', 'Норма')}
                        className="flex-1 py-1.5 px-2 rounded-xl text-xs font-bold bg-zinc-100 dark:bg-zinc-800 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black border border-zinc-200 dark:border-zinc-700 transition-all btn-spring"
                        title={goal.elasticTiers.norm.label}
                      >
                        🥈 Norm (+{goal.elasticTiers.norm.val})
                      </button>
                      <button
                        onClick={() => logGoalProgress(goal.id, goal.elasticTiers!.max.val, 'max', 'Максимум')}
                        className="flex-1 py-1.5 px-2 rounded-xl text-xs font-bold bg-zinc-100 dark:bg-zinc-800 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black border border-zinc-200 dark:border-zinc-700 transition-all btn-spring"
                        title={goal.elasticTiers.max.label}
                      >
                        🥇 Max (+{goal.elasticTiers.max.val})
                      </button>
                    </div>
                  ) : goal.trackingType === 'timer' ? (
                    <button
                      onClick={() => startTaskFocus(goal.id, 25, goal.title, true)}
                      className="w-full py-2 rounded-xl text-xs font-bold bg-black dark:bg-white text-white dark:text-black btn-spring flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      Запустить 25-мин практику
                    </button>
                  ) : goal.trackingType === 'binary' ? (
                    <button
                      onClick={() => logGoalProgress(goal.id, 1, undefined, 'Выполнено')}
                      className={`w-full py-2 rounded-xl text-xs font-bold transition-all btn-spring flex items-center justify-center gap-1.5 shadow-sm ${
                        todayStatus.isDoneToday
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                          : 'bg-black dark:bg-white text-white dark:text-black'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      {todayStatus.isDoneToday ? 'Залоггировано на сегодня' : 'Отметить на сегодня'}
                    </button>
                  ) : (
                    <div className="flex items-center gap-1.5 w-full">
                      <button
                        onClick={() => logGoalProgress(goal.id, 1, undefined, '+1')}
                        className="flex-1 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black border border-zinc-200 dark:border-zinc-700 text-xs font-bold transition-all btn-spring"
                      >
                        +1 {goal.unit}
                      </button>
                      <button
                        onClick={() => logGoalProgress(goal.id, 5, undefined, '+5')}
                        className="flex-1 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black border border-zinc-200 dark:border-zinc-700 text-xs font-bold transition-all btn-spring"
                      >
                        +5
                      </button>
                      <button
                        onClick={() => logGoalProgress(goal.id, 10, undefined, '+10')}
                        className="flex-1 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black border border-zinc-200 dark:border-zinc-700 text-xs font-bold transition-all btn-spring"
                      >
                        +10
                      </button>
                    </div>
                  )}
                </div>
              </M3Card>
            );
          })}
        </div>
      ) : viewMode === 'heatmap' ? (
        /* 2. 30-DAY HEATMAP MATRIX VIEW */
        <div className="space-y-4">
          {filteredGoals.map((goal) => {
            const cells = generate30DaysHeatmap(goal);
            const trajectory = calculateGoalTrajectory(goal);

            return (
              <M3Card key={goal.id} className="p-5 sm:p-6 space-y-4 border-2 border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white border border-zinc-200 dark:border-zinc-700">
                      {goal.category || 'Обучение'}
                    </span>
                    <h4 className="font-bold text-base text-black dark:text-white">
                      {goal.title}
                    </h4>
                  </div>

                  <span className="text-xs font-mono font-bold text-black dark:text-white">
                    {goal.currentValue} / {goal.targetValue} {goal.unit} ({trajectory.percentProgress}%)
                  </span>
                </div>

                {/* 28-day 4-week Heatmap Grid */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-mono text-zinc-400 block">
                    Активность за последние 4 недели (28 дней):
                  </span>

                  <div className="grid grid-cols-7 sm:grid-cols-14 gap-1.5 pt-1">
                    {cells.map((cell) => (
                      <div
                        key={cell.date}
                        className={`h-9 rounded-xl border flex flex-col items-center justify-center text-[10px] font-mono transition-all ${
                          cell.intensity === 3
                            ? 'bg-black dark:bg-white text-white dark:text-black border-transparent font-bold shadow-sm'
                            : cell.intensity === 2
                            ? 'bg-zinc-700 text-white dark:bg-zinc-300 dark:text-black border-transparent font-semibold'
                            : cell.intensity === 1
                            ? 'bg-zinc-300 text-black dark:bg-zinc-700 dark:text-white border-transparent'
                            : 'bg-zinc-100 dark:bg-zinc-800/60 text-zinc-400 border-zinc-200 dark:border-zinc-800'
                        } ${cell.isToday ? 'ring-2 ring-[var(--accent-primary)] ring-offset-1' : ''}`}
                        title={`${cell.date}: ${cell.value} ${goal.unit} ${cell.tier ? `(${cell.tier})` : ''}`}
                      >
                        <span>{cell.dayOfMonth}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </M3Card>
            );
          })}
        </div>
      ) : (
        /* 3. HABIT STACKING TIMELINE VIEW */
        <div className="space-y-6">
          {triggerGroups.map(([cue, groupGoals]) => (
            <div key={cue} className="space-y-3">
              <div className="flex items-center gap-2 pb-1 border-b border-zinc-200 dark:border-zinc-800">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm sm:text-base font-bold text-black dark:text-white">
                  {cue}
                </h3>
                <span className="text-xs font-mono text-zinc-400">({groupGoals.length})</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {groupGoals.map((goal) => {
                  const trajectory = calculateGoalTrajectory(goal);
                  return (
                    <M3Card key={goal.id} className="p-4 space-y-3 border-2 border-zinc-200 dark:border-zinc-800">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs sm:text-sm font-bold text-black dark:text-white truncate">
                          {goal.title}
                        </h4>
                        <span className="text-[11px] font-mono font-bold text-black dark:text-white">
                          {trajectory.percentProgress}%
                        </span>
                      </div>

                      {goal.trackingType === 'elastic' && goal.elasticTiers ? (
                        <div className="flex items-center gap-1 pt-1">
                          <button
                            onClick={() => logGoalProgress(goal.id, goal.elasticTiers!.min.val, 'min', 'Минимум')}
                            className="flex-1 py-1.5 px-2 rounded-xl text-[11px] font-bold bg-zinc-100 dark:bg-zinc-800 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black border border-zinc-200 dark:border-zinc-700 transition-all btn-spring"
                          >
                            🥉 Min
                          </button>
                          <button
                            onClick={() => logGoalProgress(goal.id, goal.elasticTiers!.norm.val, 'norm', 'Норма')}
                            className="flex-1 py-1.5 px-2 rounded-xl text-[11px] font-bold bg-zinc-100 dark:bg-zinc-800 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black border border-zinc-200 dark:border-zinc-700 transition-all btn-spring"
                          >
                            🥈 Norm
                          </button>
                          <button
                            onClick={() => logGoalProgress(goal.id, goal.elasticTiers!.max.val, 'max', 'Максимум')}
                            className="flex-1 py-1.5 px-2 rounded-xl text-[11px] font-bold bg-zinc-100 dark:bg-zinc-800 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black border border-zinc-200 dark:border-zinc-700 transition-all btn-spring"
                          >
                            🥇 Max
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => logGoalProgress(goal.id, 1, undefined, '+1')}
                          className="w-full py-1.5 rounded-xl text-xs font-bold bg-black dark:bg-white text-white dark:text-black btn-spring flex items-center justify-center gap-1 shadow-sm"
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          Выполнить шаг (+1 {goal.unit})
                        </button>
                      )}
                    </M3Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Goal Editor Modal */}
      <GoalEditorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialGoal={editingGoal}
      />
    </div>
  );
};
