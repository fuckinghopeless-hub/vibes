import React, { useState } from 'react';
import { TrendingUp, Plus } from 'lucide-react';
import { M3Button } from '../ui/M3Button';
import { M3Card } from '../ui/M3Card';
import { M3Input } from '../ui/M3Input';
import { GoalItem } from '../../types';

export const GoalsTab: React.FC = () => {
  const [goals, setGoals] = useState<GoalItem[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [targetValue, setTargetValue] = useState('100');
  const [unit, setUnit] = useState('страниц');

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const newGoal: GoalItem = {
      id: `goal_${Date.now()}`,
      title: title.trim(),
      currentValue: 0,
      targetValue: parseFloat(targetValue) || 100,
      unit: unit.trim() || 'ед.',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      derailmentThreshold: 10,
    };
    setGoals([newGoal, ...goals]);
    setTitle('');
    setIsAdding(false);
  };

  const handleIncrement = (id: string, delta: number) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          const nextVal = Math.max(0, Math.min(g.targetValue, g.currentValue + delta));
          return { ...g, currentValue: nextVal };
        }
        return g;
      })
    );
  };

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-black dark:text-white tracking-tight">Траектории Целей</h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Контракты обязательств в стиле Beeminder: отслеживание идеальной линии движения к результату
          </p>
        </div>

        {!isAdding && (
          <M3Button variant="primary" size="sm" onClick={() => setIsAdding(true)} leftIcon={<Plus className="w-4 h-4" />}>
            Новая цель
          </M3Button>
        )}
      </div>

      {isAdding && (
        <M3Card className="p-6">
          <form onSubmit={handleAddGoal} className="space-y-4">
            <M3Input
              label="Название долгосрочной цели"
              placeholder="Например: Прочитать 300 страниц книги"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <M3Input
                label="Целевое количество"
                type="number"
                value={targetValue}
                onChange={(e) => setTargetValue(e.target.value)}
                required
              />
              <M3Input
                label="Единица измерения"
                placeholder="страниц, часов, тренировок"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <M3Button type="submit" variant="primary" size="sm">
                Создать траекторию
              </M3Button>
              <M3Button type="button" variant="ghost" size="sm" onClick={() => setIsAdding(false)}>
                Отмена
              </M3Button>
            </div>
          </form>
        </M3Card>
      )}

      {goals.length === 0 ? (
        <M3Card className="p-8 text-center space-y-3">
          <TrendingUp className="w-10 h-10 mx-auto text-zinc-400" />
          <h3 className="text-base font-bold text-black dark:text-white">Нет активных траекторий</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
            Добавьте долгосрочную цель, чтобы построить математическую линию риска и избежать срывов.
          </p>
          {!isAdding && (
            <div className="pt-2">
              <M3Button variant="tonal" size="sm" onClick={() => setIsAdding(true)} leftIcon={<Plus className="w-4 h-4" />}>
                Создать первую цель
              </M3Button>
            </div>
          )}
        </M3Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goals.map((goal) => {
            const percent = Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100));
            return (
              <M3Card key={goal.id} className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-base text-black dark:text-white">{goal.title}</h4>
                    <span className="text-xs text-zinc-500 font-mono">
                      Дедлайн: {goal.endDate}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white">
                    {percent}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-600 dark:text-zinc-400">
                    <span>Текущий прогресс:</span>
                    <span>
                      {goal.currentValue} / {goal.targetValue} {goal.unit}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-700">
                    <div
                      style={{ width: `${percent}%` }}
                      className="h-full bg-black dark:bg-white rounded-full transition-all"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleIncrement(goal.id, 1)}
                      className="px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-xs font-bold text-black dark:text-white transition-colors"
                    >
                      +1 {goal.unit}
                    </button>
                    <button
                      onClick={() => handleIncrement(goal.id, 5)}
                      className="px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-xs font-bold text-black dark:text-white transition-colors"
                    >
                      +5
                    </button>
                  </div>

                  <span className="text-[11px] font-mono text-zinc-400">
                    Траектория в норме
                  </span>
                </div>
              </M3Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
