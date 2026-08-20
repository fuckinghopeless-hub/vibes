import React, { useState } from 'react';
import { CheckCircle2, Plus } from 'lucide-react';
import { M3Card } from '../ui/M3Card';
import { M3Button } from '../ui/M3Button';
import { M3Input } from '../ui/M3Input';

interface ShameEntry {
  id: string;
  reason: string;
  reflection: string;
  createdAt: string;
  resolved: boolean;
}

export const ShameLogTab: React.FC = () => {
  const [entries, setEntries] = useState<ShameEntry[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [reason, setReason] = useState('');
  const [reflection, setReflection] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;
    const newEntry: ShameEntry = {
      id: `shame_${Date.now()}`,
      reason: reason.trim(),
      reflection: reflection.trim(),
      createdAt: new Date().toISOString().split('T')[0],
      resolved: false,
    };
    setEntries([newEntry, ...entries]);
    setReason('');
    setReflection('');
    setIsAdding(false);
  };

  const handleResolve = (id: string) => {
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, resolved: true } : e))
    );
  };

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-black dark:text-white tracking-tight">Журнал Срывов & Рефлексии</h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Фиксация причин невыполнения задач и осознанная проработка срывов (Dynamic Rehabilitation)
          </p>
        </div>

        {!isAdding && (
          <M3Button variant="danger" size="sm" onClick={() => setIsAdding(true)} leftIcon={<Plus className="w-4 h-4" />}>
            Зафиксировать срыв
          </M3Button>
        )}
      </div>

      {isAdding && (
        <M3Card className="p-6">
          <form onSubmit={handleCreate} className="space-y-4">
            <M3Input
              label="Что пошло не так? (Причина срыва)"
              placeholder="Например: Отвлекся на соцсети вместо 25-минутного фокуса"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              autoFocus
              required
            />
            <M3Input
              label="Заметка рефлексии (Как предотвратить в будущем?)"
              placeholder="Например: Включать авиарежим на телефоне перед сессией"
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              required
            />
            <div className="flex items-center gap-2 pt-2">
              <M3Button type="submit" variant="primary" size="sm">
                Сохранить запись
              </M3Button>
              <M3Button type="button" variant="ghost" size="sm" onClick={() => setIsAdding(false)}>
                Отмена
              </M3Button>
            </div>
          </form>
        </M3Card>
      )}

      {entries.length === 0 ? (
        <M3Card className="p-8 text-center space-y-3">
          <CheckCircle2 className="w-10 h-10 mx-auto text-zinc-400" />
          <h3 className="text-base font-bold text-black dark:text-white">Нарушений нет</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
            Все обязательства выполняются вовремя. Дебаффы отсутствуют.
          </p>
        </M3Card>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => (
            <M3Card key={entry.id} className="p-5 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                      {entry.createdAt}
                    </span>
                    <span
                      className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${
                        entry.resolved
                          ? 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                          : 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300'
                      }`}
                    >
                      {entry.resolved ? 'Рефлексия пройдена' : 'Требует проработки'}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-black dark:text-white mt-2">
                    {entry.reason}
                  </h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                    «{entry.reflection}»
                  </p>
                </div>

                {!entry.resolved && (
                  <M3Button variant="tonal" size="sm" onClick={() => handleResolve(entry.id)}>
                    Закрыть срыв
                  </M3Button>
                )}
              </div>
            </M3Card>
          ))}
        </div>
      )}
    </div>
  );
};
