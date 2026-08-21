import { GoalItem, GoalTrajectoryStatus } from '../types';

/**
 * Расчет идеальной траектории прогресса к долгосрочной цели (Beeminder-style)
 */
export function calculateGoalTrajectory(goal: GoalItem): {
  requiredValue: number;
  delta: number;
  percentProgress: number;
  status: GoalTrajectoryStatus;
  daysRemaining: number;
} {
  const start = new Date(goal.startDate).getTime();
  const end = new Date(goal.endDate).getTime();
  const now = Date.now();

  const totalDuration = Math.max(1, end - start);
  const elapsed = Math.max(0, Math.min(totalDuration, now - start));
  const timeFraction = elapsed / totalDuration;

  const requiredValue = Math.round(goal.targetValue * timeFraction * 10) / 10;
  const delta = goal.currentValue - requiredValue;
  const percentProgress = Math.min(100, Math.round((goal.currentValue / Math.max(1, goal.targetValue)) * 100));

  const msPerDay = 1000 * 60 * 60 * 24;
  const daysRemaining = Math.max(0, Math.ceil((end - now) / msPerDay));

  const status: GoalTrajectoryStatus = delta >= 0 ? 'on_track' : 'behind';

  return {
    requiredValue,
    delta,
    percentProgress,
    status,
    daysRemaining,
  };
}

/**
 * Получение активности за сегодня для конкретной цели
 */
export function getTodayGoalStatus(goal: GoalItem): {
  isDoneToday: boolean;
  todayValue: number;
  todayTier?: 'min' | 'norm' | 'max';
} {
  const todayStr = new Date().toISOString().split('T')[0];
  const todayLogs = (goal.history || []).filter((h) => h.date === todayStr);

  if (todayLogs.length === 0) {
    return { isDoneToday: false, todayValue: 0 };
  }

  const todayValue = todayLogs.reduce((sum, l) => sum + l.value, 0);
  const latestTier = todayLogs[todayLogs.length - 1]?.tier;

  let isDoneToday = false;
  if (goal.trackingType === 'binary') {
    isDoneToday = todayValue >= 1;
  } else if (goal.trackingType === 'elastic' && goal.elasticTiers) {
    isDoneToday = todayValue >= goal.elasticTiers.min.val;
  } else {
    isDoneToday = todayValue > 0;
  }

  return {
    isDoneToday,
    todayValue,
    todayTier: latestTier,
  };
}

/**
 * Расчет прогресса за текущую неделю (для периодичности N раз в неделю)
 */
export function getWeeklyGoalProgress(goal: GoalItem): {
  daysCompletedThisWeek: number;
  targetDaysThisWeek: number;
  isWeekGoalMet: boolean;
} {
  const now = new Date();
  const currentDayOfWeek = now.getDay() === 0 ? 7 : now.getDay(); // 1 = Пн, 7 = Вс

  // Получаем дату понедельника текущей недели
  const monday = new Date(now);
  monday.setDate(now.getDate() - (currentDayOfWeek - 1));
  monday.setHours(0, 0, 0, 0);

  const mondayStr = monday.toISOString().split('T')[0];

  const logsThisWeek = (goal.history || []).filter((h) => h.date >= mondayStr);
  const distinctDaysThisWeek = new Set(logsThisWeek.map((h) => h.date)).size;

  let targetDays = 7;
  if (goal.frequencyType === 'times_per_week') {
    targetDays = goal.targetDaysPerWeek || 3;
  } else if (goal.frequencyType === 'weekdays') {
    targetDays = 5;
  } else if (goal.frequencyType === 'custom_days') {
    targetDays = goal.selectedDays?.length || 7;
  }

  return {
    daysCompletedThisWeek: distinctDaysThisWeek,
    targetDaysThisWeek: targetDays,
    isWeekGoalMet: distinctDaysThisWeek >= targetDays,
  };
}

/**
 * Генерация матрицы активности за последние N дней (для Heatmap / Calendar)
 */
export interface HeatmapDayCell {
  date: string;
  dayOfMonth: number;
  dayOfWeek: number; // 1 = Пн ... 7 = Вс
  isToday: boolean;
  value: number;
  tier?: 'min' | 'norm' | 'max';
  intensity: 0 | 1 | 2 | 3; // 0 = пусто, 1 = min, 2 = norm, 3 = max
}

export function generate30DaysHeatmap(goal: GoalItem): HeatmapDayCell[] {
  const result: HeatmapDayCell[] = [];
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  const historyMap = new Map<string, { value: number; tier?: 'min' | 'norm' | 'max' }>();
  (goal.history || []).forEach((h) => {
    const existing = historyMap.get(h.date);
    if (existing) {
      existing.value += h.value;
      if (h.tier) existing.tier = h.tier;
    } else {
      historyMap.set(h.date, { value: h.value, tier: h.tier });
    }
  });

  for (let i = 27; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const log = historyMap.get(dateStr);

    const val = log?.value || 0;
    let intensity: 0 | 1 | 2 | 3 = 0;

    if (val > 0) {
      if (log?.tier === 'max') intensity = 3;
      else if (log?.tier === 'norm') intensity = 2;
      else if (log?.tier === 'min') intensity = 1;
      else intensity = 2;
    }

    const dayOfWeek = d.getDay() === 0 ? 7 : d.getDay();

    result.push({
      date: dateStr,
      dayOfMonth: d.getDate(),
      dayOfWeek,
      isToday: dateStr === todayStr,
      value: val,
      tier: log?.tier,
      intensity,
    });
  }

  return result;
}

/**
 * Популярные пресеты триггеров Habit Stacking
 */
export const POPULAR_HABIT_TRIGGERS = [
  'Сразу после утреннего кофе',
  'Перед началом рабочего дня',
  'Сразу после обеденного перерыва',
  'После завершения вечерней тренировки',
  'Перед отходом ко сну',
  'Сразу после открытия IDE / Редактора',
  'Во время первой чашки чая',
];
