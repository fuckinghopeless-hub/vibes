export type ThemeMode = 'light' | 'dark';

export type AccentColor = 'monochrome' | 'blue' | 'emerald' | 'amber' | 'purple' | 'rose';

export type FontSizeScale = string; // e.g. '13px', '14px', '15px', '16px', '17px', '18px'

export type NavTab = 'overview' | 'tasks' | 'focus' | 'goals' | 'settings';

export type SidebarState = 'expanded' | 'collapsed' | 'hidden';

export interface UserProfile {
  id: string;
  username: string;
  email?: string;
  soundEnabled: boolean;
  createdAt: string;
  isGuest: boolean;
}

export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';
export type TaskEnergyLevel = 'low' | 'medium' | 'high';
export type TaskType = 'one_off' | 'routine' | 'milestone';

export interface SubTaskItem {
  id: string;
  title: string;
  isCompleted: boolean;
}

export interface TaskMetricTarget {
  current: number;
  target: number;
  unit: string;
}

export interface TaskSchedule {
  frequency: 'daily' | 'weekdays' | 'weekends' | 'custom';
  daysOfWeek?: number[]; // 1 = Пн, ..., 7 = Вс
  timeSlot?: string; // например '09:00 - 10:00'
  completedDates?: string[]; // YYYY-MM-DD
}

export interface TaskItem {
  id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  energyLevel?: TaskEnergyLevel;
  complexity?: 'easy' | 'medium' | 'hard';
  type: TaskType;

  // Оценка времени
  hasTimeEstimate?: boolean;
  estimatedMinutes?: number;
  autoCompleteOnTimerEnd?: boolean;
  completedMinutes?: number;
  dueDate?: string;
  scheduledTime?: string;
  schedule?: TaskSchedule;

  // Теги
  tags: string[];

  // Критерии завершения (Definition of Done)
  completionCriteria?: string;
  checklist?: SubTaskItem[];
  metricTarget?: TaskMetricTarget;

  // Привязка к цели и сила влияния
  linkedGoalId?: string;
  goalImpactValue?: number;
  goalImpactUnit?: string;

  // Триггер контекста (Habit Stacking)
  triggerCue?: string;

  isCompleted: boolean;
  streakCount?: number;
  createdAt: string;
  updatedAt?: string;

  // Поля обратной совместимости
  estimatedPomodoros?: number;
  completedPomodoros?: number;
  tag?: string;
  blockers?: string;
  contingencyPlan?: string;
}

export type GoalTrackingType = 'numeric' | 'binary' | 'timer' | 'elastic';
export type GoalFrequencyType = 'daily' | 'weekdays' | 'times_per_week' | 'custom_days';
export type GoalTrajectoryStatus = 'on_track' | 'behind';

export interface ElasticTierConfig {
  min: { val: number; label: string };
  norm: { val: number; label: string };
  max: { val: number; label: string };
}

export interface GoalLogEntry {
  id: string;
  date: string; // YYYY-MM-DD
  timestamp: string;
  value: number;
  tier?: 'min' | 'norm' | 'max';
  note?: string;
}

export interface GoalItem {
  id: string;
  title: string;
  description?: string;
  trackingType: GoalTrackingType;
  currentValue: number;
  targetValue: number;
  unit: string;
  startDate: string;
  endDate: string;

  // Эластичные уровни (Шкала усилий)
  elasticTiers?: ElasticTierConfig;

  // Гибкая периодичность
  frequencyType: GoalFrequencyType;
  targetDaysPerWeek?: number; // например, 3 или 4 дня в неделю
  selectedDays?: number[]; // 1..7 для custom_days
  restDays?: number[]; // дни отдыха

  // Привязка к триггеру (Habit Stacking)
  triggerCue?: string; // например: "После утреннего кофе", "Перед сном"
  category?: string; // "Обучение", "Здоровье", "Код", "Рутина"

  // История логов и активности
  history: GoalLogEntry[];

  // Умные напоминания
  reminderTime?: string;
  reminderText?: string;

  isArchived?: boolean;
  createdAt: string;
  updatedAt?: string;
}
