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
  TaskType 
} from '../types';

export interface CreateTaskInput {
  title: string;
  description?: string;
  priority?: TaskPriority;
  type?: TaskType;
  estimatedPomodoros?: number;
  tag?: string;
  dueDate?: string;
}

interface VibeState {
  user: UserProfile | null;
  themeMode: ThemeMode;
  accentColor: AccentColor;
  fontSize: FontSizeScale;
  activeTab: NavTab;
  sidebarState: SidebarState;
  tasks: TaskItem[];
  isLoading: boolean;

  // Actions
  setThemeMode: (mode: ThemeMode) => void;
  toggleThemeMode: () => void;
  setAccentColor: (color: AccentColor) => void;
  setFontSize: (size: FontSizeScale) => void;
  setActiveTab: (tab: NavTab) => void;
  setSidebarState: (state: SidebarState) => void;
  toggleSidebar: () => void;
  registerUser: (username: string, isGuest?: boolean, email?: string) => void;
  logout: () => void;
  addTask: (input: CreateTaskInput | string) => void;
  toggleTask: (taskId: string) => void;
  deleteTask: (taskId: string) => void;
}

const STORAGE_KEY_USER = 'vibes_current_user';
const STORAGE_KEY_THEME = 'vibes_theme_mode';
const STORAGE_KEY_ACCENT = 'vibes_accent_color';
const STORAGE_KEY_FONT_SIZE = 'vibes_font_size';
const STORAGE_KEY_TASKS = 'vibes_user_tasks';
const STORAGE_KEY_SIDEBAR = 'vibes_sidebar_state';

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

export const useVibeStore = create<VibeState>((set, get) => {
  let initialUser: UserProfile | null = null;
  let initialTheme: ThemeMode = 'light';
  let initialAccent: AccentColor = 'monochrome';
  let initialFontSize: FontSizeScale = '16px';
  let initialTasks: TaskItem[] = [];
  let initialSidebar: SidebarState = 'expanded';

  if (typeof window !== 'undefined') {
    try {
      const savedUser = localStorage.getItem(STORAGE_KEY_USER);
      if (savedUser) initialUser = JSON.parse(savedUser);

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
      if (savedTasks) initialTasks = JSON.parse(savedTasks);

      const savedSidebar = localStorage.getItem(STORAGE_KEY_SIDEBAR) as SidebarState;
      if (savedSidebar && ['expanded', 'collapsed', 'hidden'].includes(savedSidebar)) {
        initialSidebar = savedSidebar;
      }
    } catch {
      // ignore
    }
  }

  return {
    user: initialUser,
    themeMode: initialTheme,
    accentColor: initialAccent,
    fontSize: initialFontSize,
    activeTab: 'tasks',
    sidebarState: initialSidebar,
    tasks: initialTasks,
    isLoading: false,

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
        level: 1,
        streakCount: 0,
        shameScore: 0,
        createdAt: new Date().toISOString(),
        isGuest,
      };

      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(newUser));
      set({ user: newUser });
    },

    logout: () => {
      localStorage.removeItem(STORAGE_KEY_USER);
      set({ user: null });
    },

    addTask: (input: CreateTaskInput | string) => {
      const taskData: CreateTaskInput = typeof input === 'string' ? { title: input } : input;
      if (!taskData.title.trim()) return;

      const newTask: TaskItem = {
        id: `task_${Date.now()}`,
        title: taskData.title.trim(),
        description: taskData.description?.trim(),
        priority: taskData.priority || 'medium',
        type: taskData.type || 'one_off',
        estimatedPomodoros: taskData.estimatedPomodoros || 1,
        completedPomodoros: 0,
        tag: taskData.tag?.trim(),
        dueDate: taskData.dueDate,
        isCompleted: false,
        createdAt: new Date().toISOString(),
      };
      const updated = [newTask, ...get().tasks];
      localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(updated));
      set({ tasks: updated });
    },

    toggleTask: (taskId: string) => {
      const updated = get().tasks.map((t) =>
        t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t
      );
      localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(updated));
      set({ tasks: updated });
    },

    deleteTask: (taskId: string) => {
      const updated = get().tasks.filter((t) => t.id !== taskId);
      localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(updated));
      set({ tasks: updated });
    },
  };
});
