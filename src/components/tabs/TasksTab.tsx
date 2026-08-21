import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Clock, 
  CheckCircle2, 
  Repeat, 
  Sparkles,
  Tag as TagIcon
} from 'lucide-react';
import { useVibeStore } from '../../store/useVibeStore';
import { TaskItem } from '../../types';
import { M3Button } from '../ui/M3Button';
import { M3Card } from '../ui/M3Card';
import { TaskEditorModal } from './tasks/TaskEditorModal';
import { TaskCard } from './tasks/TaskCard';

export const TasksTab: React.FC = () => {
  const { tasks, getPopularTags } = useVibeStore();
  const popularTags = getPopularTags();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);

  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'routine' | 'milestone'>('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate day summary time stats
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

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      // Status filter
      if (filter === 'active' && t.isCompleted) return false;
      if (filter === 'completed' && !t.isCompleted) return false;
      if (filter === 'routine' && t.type !== 'routine') return false;
      if (filter === 'milestone' && t.type !== 'milestone') return false;

      // Tag filter
      if (selectedTag) {
        const taskTags = t.tags || (t.tag ? [t.tag] : []);
        if (!taskTags.some((tag) => tag.toLowerCase() === selectedTag.toLowerCase())) {
          return false;
        }
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inTitle = t.title.toLowerCase().includes(q);
        const inDesc = (t.description || '').toLowerCase().includes(q);
        const inTags = (t.tags || []).some((tag) => tag.toLowerCase().includes(q));
        if (!inTitle && !inDesc && !inTags) return false;
      }

      return true;
    });
  }, [tasks, filter, selectedTag, searchQuery]);

  const completedCount = tasks.filter((t) => t.isCompleted).length;
  const routineCount = tasks.filter((t) => t.type === 'routine').length;

  const handleOpenCreateModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (task: TaskItem) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 w-full max-w-5xl mx-auto">
      {/* Top Header & Day Time Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="text-left">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-black dark:text-white tracking-tight">
            Задачи & Рутины
          </h2>
          <p className="text-xs sm:text-sm font-medium text-zinc-500 dark:text-zinc-400 mt-1">
            Конструктор задач, тайм-блоки фокуса, регулярные привычки и чеклисты
          </p>
        </div>

        <div className="flex items-center gap-3">
          <M3Button
            variant="primary"
            size="md"
            onClick={handleOpenCreateModal}
            className="px-6 py-3 font-bold text-sm shadow-md"
            leftIcon={<Plus className="w-5 h-5 stroke-[2.5]" />}
          >
            Создать задачу
          </M3Button>
        </div>
      </div>

      {/* Stats & Time Budget Widget */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-[#18181B] border-2 border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center gap-4 text-left">
          <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-black dark:text-white flex-shrink-0 shadow-inner">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
              Бюджет времени
            </div>
            <div className="text-base sm:text-lg font-extrabold font-mono text-black dark:text-white">
              {formatHoursMinutes(totalPlannedMinutes)}
            </div>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#18181B] border-2 border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center gap-4 text-left">
          <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-black dark:text-white flex-shrink-0 shadow-inner">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
              Выполнено времени
            </div>
            <div className="text-base sm:text-lg font-extrabold font-mono text-black dark:text-white">
              {formatHoursMinutes(completedMinutes)}
            </div>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#18181B] border-2 border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center gap-4 text-left">
          <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-black dark:text-white flex-shrink-0 shadow-inner">
            <Repeat className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
              Постоянные рутины
            </div>
            <div className="text-base sm:text-lg font-extrabold font-mono text-black dark:text-white">
              {routineCount} привычек
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <M3Card className="p-5 sm:p-6 space-y-4">
        {/* Search input and Main Category Filter */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3.5">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Поиск по названию, описанию или тегам..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2.5 pl-11 pr-4 text-xs sm:text-sm font-semibold rounded-2xl bg-zinc-50 dark:bg-zinc-900 text-black dark:text-white border-2 border-zinc-200 dark:border-zinc-800 focus:border-black dark:focus:border-white outline-none placeholder:font-normal placeholder:text-zinc-400"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap bg-zinc-100 dark:bg-zinc-800/80 p-1 rounded-2xl border border-zinc-200 dark:border-zinc-700">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-3.5 py-1.5 text-xs sm:text-sm font-bold rounded-xl transition-all btn-spring ${
                filter === 'all'
                  ? 'bg-white dark:bg-zinc-700 text-black dark:text-white shadow-sm'
                  : 'text-zinc-500 hover:text-black dark:hover:text-white'
              }`}
            >
              Все ({tasks.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('active')}
              className={`px-3.5 py-1.5 text-xs sm:text-sm font-bold rounded-xl transition-all btn-spring ${
                filter === 'active'
                  ? 'bg-white dark:bg-zinc-700 text-black dark:text-white shadow-sm'
                  : 'text-zinc-500 hover:text-black dark:hover:text-white'
              }`}
            >
              В работе ({tasks.length - completedCount})
            </button>
            <button
              type="button"
              onClick={() => setFilter('routine')}
              className={`px-3.5 py-1.5 text-xs sm:text-sm font-bold rounded-xl transition-all btn-spring flex items-center gap-1.5 ${
                filter === 'routine'
                  ? 'bg-white dark:bg-zinc-700 text-black dark:text-white shadow-sm'
                  : 'text-zinc-500 hover:text-black dark:hover:text-white'
              }`}
            >
              <Repeat className="w-3.5 h-3.5" />
              Рутины ({routineCount})
            </button>
            <button
              type="button"
              onClick={() => setFilter('completed')}
              className={`px-3.5 py-1.5 text-xs sm:text-sm font-bold rounded-xl transition-all btn-spring ${
                filter === 'completed'
                  ? 'bg-white dark:bg-zinc-700 text-black dark:text-white shadow-sm'
                  : 'text-zinc-500 hover:text-black dark:hover:text-white'
              }`}
            >
              Готово ({completedCount})
            </button>
          </div>
        </div>

        {/* Dynamic Tags Ribbon (Frequent tags) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-2 border-t border-zinc-100 dark:border-zinc-800">
          <span className="text-xs font-bold text-zinc-400 flex items-center gap-1.5 flex-shrink-0">
            <TagIcon className="w-3.5 h-3.5" /> Теги:
          </span>

          <button
            type="button"
            onClick={() => setSelectedTag(null)}
            className={`px-3 py-1 text-xs font-bold rounded-xl transition-all btn-spring flex-shrink-0 ${
              selectedTag === null
                ? 'bg-black dark:bg-white text-white dark:text-black shadow-sm'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-zinc-400'
            }`}
          >
            Все теги
          </button>

          {popularTags.map(({ tag, count }) => {
            const isCurrent = selectedTag?.toLowerCase() === tag.toLowerCase();
            return (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag(isCurrent ? null : tag)}
                className={`px-3 py-1 text-xs font-bold rounded-xl transition-all btn-spring flex-shrink-0 ${
                  isCurrent
                    ? 'bg-black dark:bg-white text-white dark:text-black shadow-sm'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-400'
                }`}
              >
                #{tag} {count > 0 ? `(${count})` : ''}
              </button>
            );
          })}
        </div>
      </M3Card>

      {/* Task List */}
      <div className="space-y-3.5">
        {filteredTasks.length === 0 ? (
          <M3Card className="p-10 sm:p-12 text-center space-y-4">
            <div className="w-14 h-14 rounded-3xl bg-zinc-100 dark:bg-zinc-800 text-zinc-400 flex items-center justify-center mx-auto shadow-inner">
              <Sparkles className="w-7 h-7" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base sm:text-lg font-bold text-black dark:text-white">
                {searchQuery || selectedTag
                  ? 'По вашему запросу ничего не найдено'
                  : filter === 'routine'
                  ? 'У вас пока нет постоянных рутин'
                  : filter === 'completed'
                  ? 'Нет выполненных задач'
                  : 'Список задач пуст'}
              </h3>
              <p className="text-xs sm:text-sm font-medium text-zinc-500 max-w-md mx-auto">
                {searchQuery || selectedTag
                  ? 'Попробуйте сбросить фильтры или изменить поисковую фразу.'
                  : 'Создайте задачу с нужными параметрами, тайм-блоком и чеклистом шагов.'}
              </p>
            </div>

            <div className="pt-2">
              <M3Button
                variant="primary"
                size="md"
                onClick={handleOpenCreateModal}
                className="px-6 py-3 font-bold text-sm"
                leftIcon={<Plus className="w-4 h-4 stroke-[3]" />}
              >
                Создать первую задачу
              </M3Button>
            </div>
          </M3Card>
        ) : (
          filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} onEdit={handleOpenEditModal} />
          ))
        )}
      </div>

      {/* Task Editor Modal */}
      <TaskEditorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialTask={editingTask}
      />
    </div>
  );
};
