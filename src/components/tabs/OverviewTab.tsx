import React, { useMemo } from 'react';
import { 
  CheckCircle2, 
  Calendar, 
  Play, 
  Sparkles, 
  Target, 
  Zap, 
  ArrowRight, 
  Check, 
  Plus
} from 'lucide-react';
import { useVibeStore } from '../../store/useVibeStore';
import { M3Card } from '../ui/M3Card';
import { M3Button } from '../ui/M3Button';
import { getTodayGoalStatus, calculateGoalTrajectory } from '../../lib/goals';

export const OverviewTab: React.FC = () => {
  const { 
    tasks, 
    goals, 
    toggleTask, 
    startTaskFocus, 
    logGoalProgress, 
    setActiveTab 
  } = useVibeStore();

  const todayStr = new Date().toISOString().split('T')[0];

  // 1. Calculate Day Summary Time Stats
  const totalPlannedMinutes = useMemo(() => {
    return tasks
      .filter((t) => t.hasTimeEstimate && t.estimatedMinutes && t.estimatedMinutes > 0)
      .reduce((sum, t) => sum + (t.estimatedMinutes || 0), 0);
  }, [tasks]);

  const completedMinutes = useMemo(() => {
    return tasks
      .reduce((sum, t) => {
        if (t.isCompleted && t.hasTimeEstimate && t.estimatedMinutes) {
          return sum + t.estimatedMinutes;
        }
        if (t.completedMinutes && t.completedMinutes > 0) {
          return sum + t.completedMinutes;
        }
        return sum;
      }, 0);
  }, [tasks]);

  const formatHoursMinutes = (mins: number) => {
    if (mins === 0) return '0 мин';
    if (mins < 60) return `${mins} мин`;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m > 0 ? `${h} ч ${m} мин` : `${h} ч`;
  };

  const totalTasksCount = tasks.length;
  const completedTasksCount = tasks.filter((t) => t.isCompleted).length;
  const taskProgressPercent = totalTasksCount > 0 
    ? Math.round((completedTasksCount / totalTasksCount) * 100) 
    : 0;

  // 2. Pinned & High Priority Tasks for Today
  const pinnedTasks = useMemo(() => {
    return tasks
      .filter((t) => {
        if (t.isCompleted) return false;
        const isTodayDue = t.dueDate === todayStr;
        const isOverdue = t.dueDate && t.dueDate < todayStr;
        const isHighPriority = t.priority === 'high' || t.priority === 'critical';
        const isRoutine = t.type === 'routine';
        return isTodayDue || isOverdue || isHighPriority || isRoutine;
      })
      .slice(0, 5);
  }, [tasks, todayStr]);

  // Top focus task (for quick focus launch)
  const topFocusTask = pinnedTasks.find((t) => !t.isCompleted) || tasks.find((t) => !t.isCompleted);

  // Active goals for Quick-Log Deck
  const activeGoals = goals.filter((g) => !g.isArchived).slice(0, 4);

  return (
    <div className="space-y-6 w-full max-w-5xl mx-auto text-left">
      {/* Top Welcome Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-black dark:text-white tracking-tight">
            Центр Управления
          </h2>
          <p className="text-xs sm:text-sm font-medium text-zinc-500 dark:text-zinc-400 mt-1">
            Сводка дня в реальном времени, горящие задачи и быстрый логгинг привычек
          </p>
        </div>

        <div className="flex items-center gap-2">
          <M3Button
            variant="outlined"
            size="sm"
            onClick={() => setActiveTab('goals')}
            className="text-xs font-bold px-3 py-2"
            leftIcon={<Target className="w-3.5 h-3.5" />}
          >
            Все цели
          </M3Button>

          <M3Button
            variant="primary"
            size="sm"
            onClick={() => setActiveTab('tasks')}
            className="text-xs font-bold px-3.5 py-2 shadow-sm"
            leftIcon={<Plus className="w-3.5 h-3.5 stroke-[2.5]" />}
          >
            Создать задачу
          </M3Button>
        </div>
      </div>

      {/* 1. Top Grid: Day Analytics Card & Mini Focus Launcher */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Day Analytics Card (Spans 2 cols) */}
        <M3Card className="p-5 sm:p-6 lg:col-span-2 space-y-4 border-2 border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-bold flex-shrink-0 shadow-sm">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-black dark:text-white">
                  Продуктивность сегодня
                </h3>
                <p className="text-xs font-medium text-zinc-500">
                  Выполнено {completedTasksCount} из {totalTasksCount} запланированных задач ({taskProgressPercent}%)
                </p>
              </div>
            </div>

            <div className="text-right font-mono text-xs font-bold text-black dark:text-white">
              <span>{taskProgressPercent}%</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-2.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-700">
            <div
              style={{ width: `${taskProgressPercent}%` }}
              className="h-full bg-[var(--accent-primary)] rounded-full transition-all duration-300 ease-out"
            />
          </div>

          {/* Time & Stats Metrics Row */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800 text-xs">
            <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/80">
              <span className="text-[10px] font-mono text-zinc-400 block mb-0.5">В фокусе</span>
              <strong className="text-black dark:text-white font-bold text-xs sm:text-sm">
                {formatHoursMinutes(completedMinutes)}
              </strong>
            </div>

            <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/80">
              <span className="text-[10px] font-mono text-zinc-400 block mb-0.5">Запланировано</span>
              <strong className="text-black dark:text-white font-bold text-xs sm:text-sm">
                {formatHoursMinutes(totalPlannedMinutes)}
              </strong>
            </div>

            <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/80">
              <span className="text-[10px] font-mono text-zinc-400 block mb-0.5">Активные цели</span>
              <strong className="text-black dark:text-white font-bold text-xs sm:text-sm">
                {goals.length}
              </strong>
            </div>
          </div>
        </M3Card>

        {/* Mini Quick Focus Launcher Card */}
        <M3Card className="p-5 sm:p-6 space-y-3.5 border-2 border-zinc-200 dark:border-zinc-800 flex flex-col justify-between shadow-sm">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
                Быстрый фокус
              </span>
              <span className="text-xs font-mono font-bold text-zinc-500">25 мин</span>
            </div>

            {topFocusTask ? (
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-black dark:text-white line-clamp-2">
                  {topFocusTask.title}
                </h4>
                {topFocusTask.scheduledTime && (
                  <p className="text-[11px] font-mono text-zinc-400 mt-0.5">
                    Слот: {topFocusTask.scheduledTime}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-xs text-zinc-500">Все задачи выполнены!</p>
            )}
          </div>

          {topFocusTask && (
            <M3Button
              variant="primary"
              size="sm"
              onClick={() =>
                startTaskFocus(
                  topFocusTask.id,
                  topFocusTask.estimatedMinutes || 25,
                  topFocusTask.title,
                  topFocusTask.autoCompleteOnTimerEnd !== false
                )
              }
              className="w-full font-bold text-xs shadow-sm"
              leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}
            >
              Запустить таймер
            </M3Button>
          )}
        </M3Card>
      </div>

      {/* 2. Main Middle Row: Pinned Today's Tasks & Quick-Log Habits Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Widget 1: Pinned Tasks & Deadlines */}
        <M3Card className="p-5 sm:p-6 space-y-4 border-2 border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm sm:text-base font-bold text-black dark:text-white flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Горящие задачи & Дедлайны ({pinnedTasks.length})</span>
              </h3>

              <button
                onClick={() => setActiveTab('tasks')}
                className="text-xs font-bold text-zinc-500 hover:text-black dark:hover:text-white flex items-center gap-1"
              >
                Все задачи <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {pinnedTasks.length === 0 ? (
              <div className="p-6 text-center text-xs text-zinc-500 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
                На сегодня нет горящих задач с дедлайном.
              </div>
            ) : (
              <div className="space-y-2">
                {pinnedTasks.map((t) => (
                  <div
                    key={t.id}
                    className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/80 flex items-center justify-between gap-3 btn-spring"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <button
                        type="button"
                        onClick={() => toggleTask(t.id)}
                        className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                          t.isCompleted
                            ? 'bg-black dark:bg-white border-black dark:border-white text-white dark:text-black'
                            : 'border-zinc-300 dark:border-zinc-600'
                        }`}
                      >
                        {t.isCompleted && <Check className="w-3 h-3 stroke-[3]" />}
                      </button>

                      <div className="min-w-0">
                        <span className="text-xs font-bold text-black dark:text-white truncate block">
                          {t.title}
                        </span>
                        <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400">
                          {t.dueDate && <span>Срок: {t.dueDate}</span>}
                          {t.priority === 'critical' && (
                            <span className="text-red-500 font-bold">Критичный</span>
                          )}
                          {t.priority === 'high' && (
                            <span className="text-zinc-800 dark:text-zinc-200 font-bold">Высокий</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        startTaskFocus(
                          t.id,
                          t.estimatedMinutes || 25,
                          t.title,
                          t.autoCompleteOnTimerEnd !== false
                        )
                      }
                      className="p-1.5 rounded-xl text-zinc-500 hover:text-black dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                      title="Запустить сессию фокуса"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </M3Card>

        {/* Widget 2: Quick-Log Habits Deck (1-click Logging) */}
        <M3Card className="p-5 sm:p-6 space-y-4 border-2 border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm sm:text-base font-bold text-black dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Быстрый логгинг привычек & целей</span>
              </h3>

              <button
                onClick={() => setActiveTab('goals')}
                className="text-xs font-bold text-zinc-500 hover:text-black dark:hover:text-white flex items-center gap-1"
              >
                Траектории <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {activeGoals.length === 0 ? (
              <div className="p-6 text-center text-xs text-zinc-500 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
                Нет активных целей. Создайте цель во вкладке «Траектории целей».
              </div>
            ) : (
              <div className="space-y-2.5">
                {activeGoals.map((g) => {
                  const todayStatus = getTodayGoalStatus(g);
                  const trajectory = calculateGoalTrajectory(g);

                  return (
                    <div
                      key={g.id}
                      className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/80 space-y-2"
                    >
                      {/* Top Title & Progress */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-black dark:text-white truncate">
                            {g.title}
                          </h4>
                          <span className="text-[10px] font-mono text-zinc-400">
                            {g.currentValue}/{g.targetValue} {g.unit} ({trajectory.percentProgress}%)
                          </span>
                        </div>

                        {todayStatus.isDoneToday ? (
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                            <Check className="w-3 h-3" /> Залоггировано
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono text-zinc-400">
                            Сегодня: 0
                          </span>
                        )}
                      </div>

                      {/* 1-Click Logging Buttons based on Tracking Type */}
                      <div className="flex items-center gap-1.5 pt-0.5">
                        {g.trackingType === 'elastic' && g.elasticTiers ? (
                          <>
                            <button
                              onClick={() => logGoalProgress(g.id, g.elasticTiers!.min.val, 'min', 'Минимум дня')}
                              className="flex-1 py-1.5 px-2 rounded-xl text-[11px] font-bold bg-zinc-200/80 dark:bg-zinc-700 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all btn-spring"
                              title={g.elasticTiers.min.label}
                            >
                              🥉 Min (+{g.elasticTiers.min.val})
                            </button>
                            <button
                              onClick={() => logGoalProgress(g.id, g.elasticTiers!.norm.val, 'norm', 'Норма дня')}
                              className="flex-1 py-1.5 px-2 rounded-xl text-[11px] font-bold bg-zinc-200/80 dark:bg-zinc-700 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all btn-spring"
                              title={g.elasticTiers.norm.label}
                            >
                              🥈 Norm (+{g.elasticTiers.norm.val})
                            </button>
                            <button
                              onClick={() => logGoalProgress(g.id, g.elasticTiers!.max.val, 'max', 'Максимум дня')}
                              className="flex-1 py-1.5 px-2 rounded-xl text-[11px] font-bold bg-zinc-200/80 dark:bg-zinc-700 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all btn-spring"
                              title={g.elasticTiers.max.label}
                            >
                              🥇 Max (+{g.elasticTiers.max.val})
                            </button>
                          </>
                        ) : g.trackingType === 'binary' ? (
                          <button
                            onClick={() => logGoalProgress(g.id, 1, undefined, 'Выполнено')}
                            className="w-full py-1.5 rounded-xl text-xs font-bold bg-black dark:bg-white text-white dark:text-black btn-spring flex items-center justify-center gap-1.5 shadow-sm"
                          >
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            Отметить выполнение на сегодня
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => logGoalProgress(g.id, 1, undefined, '+1')}
                              className="py-1 px-3 rounded-xl text-xs font-bold bg-zinc-200/80 dark:bg-zinc-700 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all btn-spring"
                            >
                              +1 {g.unit}
                            </button>
                            <button
                              onClick={() => logGoalProgress(g.id, 5, undefined, '+5')}
                              className="py-1 px-3 rounded-xl text-xs font-bold bg-zinc-200/80 dark:bg-zinc-700 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all btn-spring"
                            >
                              +5
                            </button>
                            <button
                              onClick={() => logGoalProgress(g.id, 10, undefined, '+10')}
                              className="py-1 px-3 rounded-xl text-xs font-bold bg-zinc-200/80 dark:bg-zinc-700 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all btn-spring"
                            >
                              +10
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </M3Card>
      </div>
    </div>
  );
};
