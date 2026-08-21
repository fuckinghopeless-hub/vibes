import { create } from 'zustand';
import { 
  UserProfile, 
  ThemeMode, 
  AccentColor, 
  FontSizeScale, 
  TaskItem, 
  NavTab, 
  SidebarState, 
  TaskPriority, 
  TaskEnergyLevel, 
  TaskType, 
  SubTaskItem, 
  TaskMetricTarget, 
  TaskSchedule,
  GoalItem,
  GoalTrackingType,
  GoalFrequencyType,
  ElasticTierConfig
} from '../types';
import { soundEngine } from '../lib/soundEngine';

export interface CreateTaskInput {
  title: string;
  description?: string;
  priority?: TaskPriority;
  energyLevel?: TaskEnergyLevel;
  complexity?: 'easy' | 'medium' | 'hard';
  type?: TaskType;
  hasTimeEstimate?: boolean;
  estimatedMinutes?: number;
  autoCompleteOnTimerEnd?: boolean;
  dueDate?: string;
  scheduledTime?: string;
  schedule?: TaskSchedule;
  tags?: string[];
  completionCriteria?: string;
  checklist?: SubTaskItem[];
  metricTarget?: TaskMetricTarget;
  linkedGoalId?: string;
  goalImpactValue?: number;
  goalImpactUnit?: string;
  triggerCue?: string;
  estimatedPomodoros?: number;
  tag?: string;
}

export interface CreateGoalInput {
  title: string;
  description?: string;
  trackingType?: GoalTrackingType;
  targetValue: number;
  currentValue?: number;
  unit: string;
  startDate?: string;
  endDate: string;
  elasticTiers?: ElasticTierConfig;
  frequencyType?: GoalFrequencyType;
  targetDaysPerWeek?: number;
  selectedDays?: number[];
  restDays?: number[];
  triggerCue?: string;
  category?: string;
  reminderTime?: string;
  reminderText?: string;
}

interface VibeState {
  user: UserProfile | null;
  themeMode: ThemeMode;
  accentColor: AccentColor;
  fontSize: FontSizeScale;
  activeTab: NavTab;
  sidebarState: SidebarState;
  tasks: TaskItem[];
  goals: GoalItem[];
  isLoading: boolean;

  // Active Focus Session State
  activeFocusTaskId: string | null;
  activeFocusTaskTitle: string | null;
  focusWorkMinutes: number;
  focusBreakMinutes: number;
  focusAutoComplete: boolean;

  // System & Profile Actions
  setThemeMode: (mode: ThemeMode) => void;
  toggleThemeMode: () => void;
  setAccentColor: (color: AccentColor) => void;
  setFontSize: (size: FontSizeScale) => void;
  setActiveTab: (tab: NavTab) => void;
  setSidebarState: (state: SidebarState) => void;
  toggleSidebar: () => void;
  registerUser: (username: string, isGuest?: boolean, email?: string) => void;
  logout: () => void;
  toggleSound: (enabled?: boolean) => void;

  // Task Actions
  addTask: (input: CreateTaskInput | string) => void;
  updateTask: (taskId: string, updates: Partial<TaskItem>) => void;
  toggleTask: (taskId: string) => void;
  toggleSubTask: (taskId: string, subTaskId: string) => void;
  updateTaskMetric: (taskId: string, current: number) => void;
  deleteTask: (taskId: string) => void;
  getPopularTags: () => { tag: string; count: number }[];

  // Focus Actions
  startTaskFocus: (taskId: string, minutes?: number, title?: string, autoComplete?: boolean) => void;
  clearTaskFocus: () => void;
  setFocusSettings: (workMins: number, breakMins: number, autoComplete?: boolean) => void;
  completeActiveFocusTask: () => void;

  // Goals Actions
  addGoal: (input: CreateGoalInput) => void;
  updateGoal: (goalId: string, updates: Partial<GoalItem>) => void;
  logGoalProgress: (goalId: string, value: number, tier?: 'min' | 'norm' | 'max', note?: string) => void;
  deleteGoalLog: (goalId: string, logId: string) => void;
  deleteGoal: (goalId: string) => void;

  // Backup & Restore
  exportDataJson: () => string;
  importDataJson: (jsonString: string) => boolean;
}

const STORAGE_KEY_USER = 'vibes_current_user';
const STORAGE_KEY_THEME = 'vibes_theme_mode';
const STORAGE_KEY_ACCENT = 'vibes_accent_color';
const STORAGE_KEY_FONT_SIZE = 'vibes_font_size';
const STORAGE_KEY_TASKS = 'vibes_user_tasks';
const STORAGE_KEY_SIDEBAR = 'vibes_sidebar_state';
const STORAGE_KEY_GOALS = 'vibes_user_goals';

const applyThemeToDom = (mode: ThemeMode) => {
  if (typeof document !== 'undefined') {
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
};

const applyAccentToDom = (accent: AccentColor) => {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-accent', accent);
  }
};

const applyFontSizeToDom = (size: FontSizeScale) => {
  if (typeof document !== 'undefined') {
    document.documentElement.style.fontSize = size;
  }
};

const normalizeUser = (raw: Partial<UserProfile> | null): UserProfile | null => {
  if (!raw || !raw.username) return null;
  return {
    id: raw.id || `user_${Date.now()}`,
    username: raw.username,
    email: raw.email,
    soundEnabled: raw.soundEnabled !== undefined ? Boolean(raw.soundEnabled) : true,
    createdAt: raw.createdAt || new Date().toISOString(),
    isGuest: raw.isGuest !== undefined ? Boolean(raw.isGuest) : true,
  };
};

const normalizeGoal = (raw: any): GoalItem => {
  return {
    id: raw.id || `goal_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    title: raw.title || 'Цель',
    description: raw.description || '',
    trackingType: raw.trackingType || (raw.elasticTiers ? 'elastic' : 'numeric'),
    currentValue: typeof raw.currentValue === 'number' ? raw.currentValue : 0,
    targetValue: typeof raw.targetValue === 'number' && raw.targetValue > 0 ? raw.targetValue : 100,
    unit: raw.unit || 'ед.',
    startDate: raw.startDate || new Date().toISOString().split('T')[0],
    endDate: raw.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    elasticTiers: raw.elasticTiers || undefined,
    frequencyType: raw.frequencyType || 'daily',
    targetDaysPerWeek: raw.targetDaysPerWeek || 3,
    selectedDays: Array.isArray(raw.selectedDays) ? raw.selectedDays : [1, 2, 3, 4, 5],
    restDays: Array.isArray(raw.restDays) ? raw.restDays : [],
    triggerCue: raw.triggerCue || '',
    category: raw.category || 'Обучение',
    history: Array.isArray(raw.history) ? raw.history : [],
    reminderTime: raw.reminderTime || '',
    reminderText: raw.reminderText || '',
    isArchived: Boolean(raw.isArchived),
    createdAt: raw.createdAt || new Date().toISOString(),
    updatedAt: raw.updatedAt,
  };
};

const normalizeTask = (raw: any): TaskItem => {
  const todayStr = new Date().toISOString().split('T')[0];
  const tags: string[] = Array.isArray(raw.tags)
    ? raw.tags
    : raw.tag
    ? [raw.tag]
    : [];

  const hasTimeEstimate = 
    typeof raw.hasTimeEstimate === 'boolean' 
      ? raw.hasTimeEstimate 
      : Boolean(raw.estimatedMinutes || raw.estimatedPomodoros);

  const estimatedMinutes = 
    typeof raw.estimatedMinutes === 'number' && raw.estimatedMinutes > 0
      ? raw.estimatedMinutes
      : typeof raw.estimatedPomodoros === 'number' && raw.estimatedPomodoros > 0
      ? raw.estimatedPomodoros * 25
      : hasTimeEstimate ? 30 : 0;

  const isRoutine = raw.type === 'routine' || raw.type === 'daily' || raw.type === 'habit';
  const type: TaskType = isRoutine ? 'routine' : raw.type === 'milestone' ? 'milestone' : 'one_off';

  let isCompleted = Boolean(raw.isCompleted);
  const schedule: TaskSchedule | undefined = raw.schedule || (isRoutine ? {
    frequency: 'daily',
    completedDates: raw.isCompleted ? [todayStr] : []
  } : undefined);

  if (isRoutine && schedule?.completedDates) {
    isCompleted = schedule.completedDates.includes(todayStr);
  }

  return {
    id: raw.id || `task_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    title: raw.title || 'Без названия',
    description: raw.description || '',
    priority: raw.priority || 'medium',
    energyLevel: raw.energyLevel || 'medium',
    complexity: raw.complexity || 'medium',
    type,
    hasTimeEstimate,
    estimatedMinutes,
    autoCompleteOnTimerEnd: Boolean(raw.autoCompleteOnTimerEnd),
    completedMinutes: raw.completedMinutes || 0,
    dueDate: raw.dueDate || '',
    scheduledTime: raw.scheduledTime || '',
    schedule,
    tags,
    completionCriteria: raw.completionCriteria || '',
    checklist: Array.isArray(raw.checklist) ? raw.checklist : [],
    metricTarget: raw.metricTarget || undefined,
    linkedGoalId: raw.linkedGoalId || undefined,
    goalImpactValue: typeof raw.goalImpactValue === 'number' ? raw.goalImpactValue : undefined,
    goalImpactUnit: raw.goalImpactUnit || undefined,
    triggerCue: raw.triggerCue || '',
    isCompleted,
    streakCount: raw.streakCount || 0,
    createdAt: raw.createdAt || new Date().toISOString(),
    updatedAt: raw.updatedAt,
  };
};

export const useVibeStore = create<VibeState>((set, get) => {
  let initialUser: UserProfile | null = null;
  let initialTheme: ThemeMode = 'light';
  let initialAccent: AccentColor = 'monochrome';
  let initialFontSize: FontSizeScale = '16px';
  let initialTasks: TaskItem[] = [];
  let initialGoals: GoalItem[] = [];
  let initialSidebar: SidebarState = 'expanded';

  if (typeof window !== 'undefined') {
    try {
      const savedUser = localStorage.getItem(STORAGE_KEY_USER);
      if (savedUser) initialUser = normalizeUser(JSON.parse(savedUser));

      const savedTheme = localStorage.getItem(STORAGE_KEY_THEME) as ThemeMode;
      if (savedTheme === 'dark' || savedTheme === 'light') {
        initialTheme = savedTheme;
      }
      applyThemeToDom(initialTheme);

      const savedAccent = localStorage.getItem(STORAGE_KEY_ACCENT) as AccentColor;
      if (savedAccent && ['monochrome', 'blue', 'emerald', 'amber', 'purple', 'rose'].includes(savedAccent)) {
        initialAccent = savedAccent;
      }
      applyAccentToDom(initialAccent);

      const savedFontSize = localStorage.getItem(STORAGE_KEY_FONT_SIZE) as FontSizeScale;
      if (savedFontSize && ['13px', '14px', '15px', '16px', '17px', '18px'].includes(savedFontSize)) {
        initialFontSize = savedFontSize;
      }
      applyFontSizeToDom(initialFontSize);

      const savedTasks = localStorage.getItem(STORAGE_KEY_TASKS);
      if (savedTasks) {
        const parsed = JSON.parse(savedTasks);
        if (Array.isArray(parsed)) {
          initialTasks = parsed.map(normalizeTask);
        }
      }

      const savedGoals = localStorage.getItem(STORAGE_KEY_GOALS);
      if (savedGoals) {
        const parsed = JSON.parse(savedGoals);
        if (Array.isArray(parsed)) {
          initialGoals = parsed.map(normalizeGoal);
        }
      }

      const savedSidebar = localStorage.getItem(STORAGE_KEY_SIDEBAR) as SidebarState;
      if (savedSidebar && ['expanded', 'collapsed', 'hidden'].includes(savedSidebar)) {
        initialSidebar = savedSidebar;
      }

      if (initialUser) {
        soundEngine.isEnabled = initialUser.soundEnabled;
      }
    } catch {
      // ignore
    }
  }

  const saveUser = (user: UserProfile | null) => {
    if (user) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY_USER);
    }
    set({ user });
  };

  const saveTasks = (tasks: TaskItem[]) => {
    localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
    set({ tasks });
  };

  const saveGoals = (goals: GoalItem[]) => {
    localStorage.setItem(STORAGE_KEY_GOALS, JSON.stringify(goals));
    set({ goals });
  };

  return {
    user: initialUser,
    themeMode: initialTheme,
    accentColor: initialAccent,
    fontSize: initialFontSize,
    activeTab: 'overview',
    sidebarState: initialSidebar,
    tasks: initialTasks,
    goals: initialGoals,
    isLoading: false,

    // Focus Session State
    activeFocusTaskId: null,
    activeFocusTaskTitle: null,
    focusWorkMinutes: 25,
    focusBreakMinutes: 5,
    focusAutoComplete: true,

    setThemeMode: (mode: ThemeMode) => {
      localStorage.setItem(STORAGE_KEY_THEME, mode);
      applyThemeToDom(mode);
      set({ themeMode: mode });
    },

    toggleThemeMode: () => {
      const current = get().themeMode;
      const next: ThemeMode = current === 'light' ? 'dark' : 'light';
      localStorage.setItem(STORAGE_KEY_THEME, next);
      applyThemeToDom(next);
      set({ themeMode: next });
    },

    setAccentColor: (accent: AccentColor) => {
      localStorage.setItem(STORAGE_KEY_ACCENT, accent);
      applyAccentToDom(accent);
      set({ accentColor: accent });
    },

    setFontSize: (size: FontSizeScale) => {
      localStorage.setItem(STORAGE_KEY_FONT_SIZE, size);
      applyFontSizeToDom(size);
      set({ fontSize: size });
    },

    setActiveTab: (tab: NavTab) => {
      set({ activeTab: tab });
    },

    setSidebarState: (state: SidebarState) => {
      localStorage.setItem(STORAGE_KEY_SIDEBAR, state);
      set({ sidebarState: state });
    },

    toggleSidebar: () => {
      const current = get().sidebarState;
      let next: SidebarState = 'collapsed';
      if (current === 'expanded') next = 'collapsed';
      else if (current === 'collapsed') next = 'hidden';
      else next = 'expanded';
      localStorage.setItem(STORAGE_KEY_SIDEBAR, next);
      set({ sidebarState: next });
    },

    registerUser: (username: string, isGuest = true, email?: string) => {
      const newUser: UserProfile = {
        id: isGuest ? `guest_${Date.now()}` : `user_${Date.now()}`,
        username: username.trim() || (isGuest ? 'Гость' : 'Пользователь'),
        email,
        soundEnabled: true,
        createdAt: new Date().toISOString(),
        isGuest,
      };

      soundEngine.isEnabled = true;
      saveUser(newUser);
    },

    logout: () => {
      saveUser(null);
    },

    toggleSound: (enabled?: boolean) => {
      const currentUser = get().user;
      if (!currentUser) return;
      const nextSound = enabled !== undefined ? enabled : !currentUser.soundEnabled;
      soundEngine.isEnabled = nextSound;
      const updated: UserProfile = {
        ...currentUser,
        soundEnabled: nextSound,
      };
      saveUser(updated);
    },

    addTask: (input: CreateTaskInput | string) => {
      const taskData: CreateTaskInput = typeof input === 'string' ? { title: input } : input;
      if (!taskData.title.trim()) return;

      const hasTime = taskData.hasTimeEstimate !== false && (Boolean(taskData.estimatedMinutes) || Boolean(taskData.estimatedPomodoros));
      const estimatedMinutes = hasTime
        ? (taskData.estimatedMinutes || (taskData.estimatedPomodoros ? taskData.estimatedPomodoros * 25 : 30))
        : 0;

      const isRoutine = taskData.type === 'routine';

      const newTask: TaskItem = {
        id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        title: taskData.title.trim(),
        description: taskData.description?.trim() || '',
        priority: taskData.priority || 'medium',
        energyLevel: taskData.energyLevel || 'medium',
        complexity: taskData.complexity || 'medium',
        type: taskData.type || 'one_off',
        hasTimeEstimate: hasTime,
        estimatedMinutes,
        autoCompleteOnTimerEnd: Boolean(taskData.autoCompleteOnTimerEnd),
        completedMinutes: 0,
        dueDate: taskData.dueDate || '',
        scheduledTime: taskData.scheduledTime || '',
        schedule: taskData.schedule || (isRoutine ? { frequency: 'daily', completedDates: [] } : undefined),
        tags: taskData.tags ? taskData.tags.map(t => t.trim()).filter(Boolean) : (taskData.tag ? [taskData.tag.trim()] : []),
        completionCriteria: taskData.completionCriteria?.trim() || '',
        checklist: taskData.checklist || [],
        metricTarget: taskData.metricTarget,
        linkedGoalId: taskData.linkedGoalId || undefined,
        goalImpactValue: taskData.goalImpactValue || undefined,
        goalImpactUnit: taskData.goalImpactUnit || undefined,
        triggerCue: taskData.triggerCue || '',
        isCompleted: false,
        streakCount: 0,
        createdAt: new Date().toISOString(),
      };

      const updated = [newTask, ...get().tasks];
      saveTasks(updated);
    },

    updateTask: (taskId: string, updates: Partial<TaskItem>) => {
      const updated = get().tasks.map((t) => {
        if (t.id !== taskId) return t;
        return {
          ...t,
          ...updates,
          updatedAt: new Date().toISOString(),
        };
      });
      saveTasks(updated);
    },

    toggleTask: (taskId: string) => {
      const todayStr = new Date().toISOString().split('T')[0];
      let isNowCompleted = false;
      let linkedGoalId: string | undefined;
      let goalImpact = 0;

      const updated = get().tasks.map((t) => {
        if (t.id !== taskId) return t;

        linkedGoalId = t.linkedGoalId;
        goalImpact = t.goalImpactValue || 1;

        if (t.type === 'routine') {
          const currentDates = t.schedule?.completedDates || [];
          const isDoneToday = currentDates.includes(todayStr);

          let nextDates: string[];
          let nextStreak = t.streakCount || 0;

          if (isDoneToday) {
            nextDates = currentDates.filter((d) => d !== todayStr);
            nextStreak = Math.max(0, nextStreak - 1);
            isNowCompleted = false;
          } else {
            nextDates = [...currentDates, todayStr];
            nextStreak = nextStreak + 1;
            isNowCompleted = true;
          }

          return {
            ...t,
            isCompleted: isNowCompleted,
            streakCount: nextStreak,
            schedule: {
              ...(t.schedule || { frequency: 'daily' }),
              completedDates: nextDates,
            },
            updatedAt: new Date().toISOString(),
          };
        }

        isNowCompleted = !t.isCompleted;
        return { 
          ...t, 
          isCompleted: isNowCompleted,
          updatedAt: new Date().toISOString(),
        };
      });

      saveTasks(updated);

      if (isNowCompleted) {
        soundEngine.playTaskComplete();
        // Auto contribute to linked goal
        if (linkedGoalId && goalImpact > 0) {
          get().logGoalProgress(linkedGoalId, goalImpact, undefined, 'Выполнение связанной задачи');
        }
      }
    },

    toggleSubTask: (taskId: string, subTaskId: string) => {
      const updated = get().tasks.map((t) => {
        if (t.id !== taskId || !t.checklist) return t;

        const updatedChecklist = t.checklist.map((st) =>
          st.id === subTaskId ? { ...st, isCompleted: !st.isCompleted } : st
        );

        const allCompleted = updatedChecklist.length > 0 && updatedChecklist.every((st) => st.isCompleted);

        return {
          ...t,
          checklist: updatedChecklist,
          isCompleted: allCompleted,
          updatedAt: new Date().toISOString(),
        };
      });

      saveTasks(updated);
    },

    updateTaskMetric: (taskId: string, current: number) => {
      const updated = get().tasks.map((t) => {
        if (t.id !== taskId || !t.metricTarget) return t;

        const clamped = Math.max(0, current);
        const isTargetReached = clamped >= t.metricTarget.target;

        return {
          ...t,
          metricTarget: {
            ...t.metricTarget,
            current: clamped,
          },
          isCompleted: isTargetReached,
          updatedAt: new Date().toISOString(),
        };
      });

      saveTasks(updated);
    },

    deleteTask: (taskId: string) => {
      const updated = get().tasks.filter((t) => t.id !== taskId);
      saveTasks(updated);
    },

    getPopularTags: () => {
      const counts: Record<string, number> = {};
      get().tasks.forEach((t) => {
        if (Array.isArray(t.tags)) {
          t.tags.forEach((tag) => {
            const clean = tag.trim();
            if (clean) {
              counts[clean] = (counts[clean] || 0) + 1;
            }
          });
        }
      });

      const sorted = Object.entries(counts)
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count);

      const defaults = ['Код', 'Работа', 'Учеба', 'Спорт', 'Личное', 'Здоровье', 'Чтение'];
      defaults.forEach((def) => {
        if (!sorted.some((s) => s.tag.toLowerCase() === def.toLowerCase())) {
          sorted.push({ tag: def, count: 0 });
        }
      });

      return sorted.slice(0, 10);
    },

    startTaskFocus: (taskId: string, minutes?: number, title?: string, autoComplete?: boolean) => {
      const workMins = minutes && minutes > 0 ? minutes : 25;
      set({
        activeFocusTaskId: taskId,
        activeFocusTaskTitle: title || 'Фокус по задаче',
        focusWorkMinutes: workMins,
        focusAutoComplete: typeof autoComplete === 'boolean' ? autoComplete : true,
        activeTab: 'focus',
      });
    },

    clearTaskFocus: () => {
      set({
        activeFocusTaskId: null,
        activeFocusTaskTitle: null,
      });
    },

    setFocusSettings: (workMins: number, breakMins: number, autoComplete = true) => {
      set({
        focusWorkMinutes: Math.max(1, workMins),
        focusBreakMinutes: Math.max(1, breakMins),
        focusAutoComplete: autoComplete,
      });
    },

    completeActiveFocusTask: () => {
      const { activeFocusTaskId } = get();
      if (activeFocusTaskId) {
        get().updateTask(activeFocusTaskId, { isCompleted: true });
        const task = get().tasks.find((t) => t.id === activeFocusTaskId);
        if (task && task.linkedGoalId && task.goalImpactValue) {
          get().logGoalProgress(task.linkedGoalId, task.goalImpactValue, undefined, 'Сессия фокуса завершена');
        }
        set({
          activeFocusTaskId: null,
          activeFocusTaskTitle: null,
        });
      }
    },

    addGoal: (input: CreateGoalInput) => {
      if (!input.title.trim()) return;

      const trackingType: GoalTrackingType = input.trackingType || (input.elasticTiers ? 'elastic' : 'numeric');

      const newGoal: GoalItem = {
        id: `goal_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        title: input.title.trim(),
        description: input.description?.trim() || '',
        trackingType,
        currentValue: input.currentValue || 0,
        targetValue: input.targetValue || 100,
        unit: input.unit.trim() || 'ед.',
        startDate: input.startDate || new Date().toISOString().split('T')[0],
        endDate: input.endDate,
        elasticTiers: input.elasticTiers,
        frequencyType: input.frequencyType || 'daily',
        targetDaysPerWeek: input.targetDaysPerWeek || 3,
        selectedDays: input.selectedDays || [1, 2, 3, 4, 5],
        restDays: input.restDays || [],
        triggerCue: input.triggerCue?.trim() || '',
        category: input.category || 'Обучение',
        history: [],
        reminderTime: input.reminderTime || '',
        reminderText: input.reminderText || '',
        isArchived: false,
        createdAt: new Date().toISOString(),
      };

      const updated = [newGoal, ...get().goals];
      saveGoals(updated);
    },

    updateGoal: (goalId: string, updates: Partial<GoalItem>) => {
      const updated = get().goals.map((g) => {
        if (g.id !== goalId) return g;
        return {
          ...g,
          ...updates,
          updatedAt: new Date().toISOString(),
        };
      });
      saveGoals(updated);
    },

    logGoalProgress: (goalId: string, value: number, tier?: 'min' | 'norm' | 'max', note?: string) => {
      const todayStr = new Date().toISOString().split('T')[0];
      const newEntry = {
        id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        date: todayStr,
        timestamp: new Date().toISOString(),
        value,
        tier,
        note,
      };

      const updated = get().goals.map((g) => {
        if (g.id !== goalId) return g;

        const nextVal = Math.max(0, g.currentValue + value);
        return {
          ...g,
          currentValue: nextVal,
          history: [newEntry, ...(g.history || [])],
          updatedAt: new Date().toISOString(),
        };
      });

      saveGoals(updated);
      soundEngine.playTaskComplete();
    },

    deleteGoalLog: (goalId: string, logId: string) => {
      const updated = get().goals.map((g) => {
        if (g.id !== goalId) return g;
        const entry = (g.history || []).find((h) => h.id === logId);
        const deduct = entry ? entry.value : 0;
        const nextVal = Math.max(0, g.currentValue - deduct);
        return {
          ...g,
          currentValue: nextVal,
          history: (g.history || []).filter((h) => h.id !== logId),
          updatedAt: new Date().toISOString(),
        };
      });

      saveGoals(updated);
    },

    deleteGoal: (goalId: string) => {
      const updated = get().goals.filter((g) => g.id !== goalId);
      saveGoals(updated);
    },

    exportDataJson: (): string => {
      const state = {
        version: '1.0.0',
        exportedAt: new Date().toISOString(),
        user: get().user,
        tasks: get().tasks,
        goals: get().goals,
        settings: {
          themeMode: get().themeMode,
          accentColor: get().accentColor,
          fontSize: get().fontSize,
        },
      };
      return JSON.stringify(state, null, 2);
    },

    importDataJson: (jsonString: string): boolean => {
      try {
        const data = JSON.parse(jsonString);
        if (data.user) saveUser(normalizeUser(data.user));
        if (Array.isArray(data.tasks)) saveTasks(data.tasks.map(normalizeTask));
        if (Array.isArray(data.goals)) saveGoals(data.goals.map(normalizeGoal));
        if (data.settings) {
          if (data.settings.themeMode) get().setThemeMode(data.settings.themeMode);
          if (data.settings.accentColor) get().setAccentColor(data.settings.accentColor);
          if (data.settings.fontSize) get().setFontSize(data.settings.fontSize);
        }
        return true;
      } catch {
        return false;
      }
    },
  };
});
