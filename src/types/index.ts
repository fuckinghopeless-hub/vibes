export type ThemeMode = 'light' | 'dark';

export type AccentColor = 'monochrome' | 'blue' | 'emerald' | 'amber' | 'purple' | 'rose';

export type FontSizeScale = string; // e.g. '12px', '13px', '14px', '15px', '16px', '17px', '18px', '19px', '20px'

export type NavTab = 'tasks' | 'focus' | 'goals' | 'shame' | 'settings';

export type SidebarState = 'expanded' | 'collapsed' | 'hidden';

export interface UserProfile {
  id: string;
  username: string;
  email?: string;
  level: number;
  streakCount: number;
  shameScore: number;
  createdAt: string;
  isGuest: boolean;
}

export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';
export type TaskType = 'one_off' | 'daily' | 'habit';

export interface TaskItem {
  id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  type: TaskType;
  estimatedPomodoros: number;
  completedPomodoros: number;
  tag?: string;
  dueDate?: string;
  isCompleted: boolean;
  createdAt: string;
}

export interface GoalItem {
  id: string;
  title: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  startDate: string;
  endDate: string;
  derailmentThreshold: number;
}
