[21.08.2026 0:05] Егор: Установите Google Документы!
Вносите изменения, оставляйте комментарии и редактируйте файлы одновременно с другими пользователями.
НЕТУСТАНОВИТЬ
ТЗ Приложения Самоконтроля И Геймификации
Архитектурно-техническое задание на разработку персональной веб-платформы геймифицированного самоконтроля
Концептуальный и поведенческо-психологический фундамент платформы
Разрабатываемая система представляет собой высокотехнологичную среду управления персональной продуктивностью, объединяющую методы поведенческой экономики, классические механики ролевых игр (RPG) и жесткие механизмы контрактов об обязательствах. В основе платформы лежит автоматизация цикла формирования привычек, состоящего из триггера (cue), автоматической рутины (routine) и калиброванного подкрепления (reward). Главным отличием от традиционных трекеров задач является отказ от исключительно позитивного стимулирования в пользу сбалансированной системы асимметричного давления, базирующейся на эффекте неприятия потерь (loss aversion).
Анализ существующих решений показывает, что базовые инструменты учетной продуктивности используют слабые стимулы: сброс числового счетчика дней не создает достаточного эмоционального резонанса для преодоления импульсивного уклонения от сложных задач. С другой стороны, радикальные геймифицированные системы, такие как Habitica, применяющие механики полного уничтожения персонажа (death penalty) при утрате здоровья (HP), демонстрируют уязвимость в долгосрочном удержании пользователей. Эмпирические данные сервисов аналитики геймификации фиксируют критическое падение возврата пользователей (return rate) после срыва серии задач: лишь 0,90% пользователей с потерянной серией в 2–3 дня и 1,42% с серией в 4–7 дней возвращаются к активной работе. Окончательность поражения и полное обнуление накапливаемого годами статуса провоцируют психологический отказ от использования инструмента.
Для устранения этого структурного недостатка проектируемая система внедряет концепцию «динамического эмоционального трения и реабилитации» (Dynamic Friction & Rehabilitation). Вместо полного фатального сброса прогресса срыв обязательств активирует каскад обратимых дебаффов: визуальную деградацию интерфейса, ограничение доступа к функционалу, начисление балов стыда (Shame Score) и блокировку получения опыта до прохождения процедуры рефлексии с указанием причин срыва. В сочетании с механиками контрактов Одиссея (Odyssean commitment tracking), популяризированными платформой Beeminder, где progress отслеживается относительно строгой математической линии риска (derailment line), система создает детерминированную среду, в которой прокрастинация становится инвазивной и эмоционально некомфортной.
Платформа / Инструмент
Модель мотивации и механика
Поведенческий триггер наказания
Защита от фальсификации (Anti-Gaming)
Риск окончательного отказа (Churn Rate)
Habitica
RPG: Очки опыта (XP), Здоровье (HP), Экипировка
Утрата HP при пропуске, гибель персонажа и сброс уровня
Низкая (выполнение фантомных задач без валидации)
Высокий (менее 1.5% возврата после гибели персонажа)
Beeminder
Контракты обязательств (Commitment Contracts)
Денежное списание при выходе за пределы траектории (Yellow Brick Road)
Высокая (интеграция с API и жесткие количественные метрики)
Средний (высокий порог входа из-за финансовых рисков)
Forest
Тайм-блокинг с визуализацией экосистемы
Гибель виртуального дерева при прерывании сессии фокуса
Низкая (отслеживание только активности экрана)
Низкий (локальный урон без разрушения глобального статуса)
Проектируемая система
Гибридная: Динамический RPG-движок + Траектории срывов
Дебаффы UI, заморозка опыта, Shame Log, каскадный урон HP
Высокая (алгоритмы затухания XP, проверки объемов)
Оптимальный (реабилитационные квесты вместо сброса)
Системная архитектура и технологический стек
Проектирование системы рассчитано на реализацию в парадигме ИИ-ориентированной разработки (Vibe Coding) с использованием современных высокоуровневых фреймворков, обеспечивающих максимальную типобезопасность, высокую скорость итераций и модульность.
[21.08.2026 0:05] Егор: Архитектура строится по монолитной схеме с четким разделением клиентского и серверного слоев.
Технологический стек включает в себя:
Исполнительная среда и фреймворк: Next.js (App Router) на базе TypeScript.
Слой представления и стилизации: Tailwind CSS, библиотека компонентов shadcn/ui, векторная графика Lucide React и анимационный движок Framer Motion.
База данных и аутентификация: Supabase (PostgreSQL), использующий встроенные механизмы авторизации (Supabase Auth) и защиты данных на уровне строк (Row Level Security, RLS).
Управление локальным и серверным состоянием: Zustand для хранения мгновенного игрового состояния и состояния UI; React Query (TanStack Query) для асинхронного взаимодействия с API.
Валидация и утилиты: Zod для строгого контроля типов схем на границах API, Date-fns для расчетов временных интервалов и часовых поясов.
Инструментарий разработки: pnpm, ESLint, Cursor IDE.
Иерархическая структура исходного кода проекта организована по функциональным доменам:
src/app/ — Маршруты приложения, серверные страницы и API-хендлеры (App Router).
(auth)/ — Страницы аутентификации и восстановления доступа.
(dashboard)/ — Защищенная зона приложения (дашборд, цели, задачи, сессии фокуса, лог стыда).
api/gamification/ — Серверные эндпоинты расчета игрового состояния.
src/components/ — Изолированные UI-компоненты.
ui/ — Атомарные элементы интерфейса библиотеки shadcn/ui.
dashboard/ — Виджеты отображения показателей, графиков и матриц задач.
gamification/ — Визуальные элементы ролевой системы (бары HP/XP, значки дебаффов, модальные окна рефлексии).
focus/ — Компоненты таймера и визуализации сессий глубокой работы.
src/lib/ — Бизнес-логика и системные интеграции.
supabase/ — Клиентские и серверные конфиги подключения к БД.
gamification/ — Математические модули: расчет опыта, урона, затухания и Anti-Gaming проверок.
src/store/ — Глобальные сторы Zustand для управления состоянием интерфейса.
src/types/ — Автоматически сгенерированные и пользовательские типы TypeScript.
supabase/migrations/[span_75](start_span)[span_75](end_span) — SQL-скрипты миграций базы данных.
Конфигурация операционной среды AI Vibe-Coding (.cursor/rules)
Для обеспечения предсказуемого поведения генеративных моделей в Cursor IDE и предотвращения внесения неавторизованных изменений в архитектуру, контекстные правила проекта разбиваются на узкоспециализированные файлы внутри каталога .cursor/rules/.
Файл .[span_85](start_span)[span_85](end_span)[span_90](start_span)[span_90](end_span)cursor/rules/core-context.mdc
Режим активации: alwaysApply: true (применяется ко всем запросам, объем до 200 слов).
description: Core project context, tech stack rules, and mandatory check commands. alwaysApply: true
This is a solo personal productivity system built with Next.js 14 App Router, TypeScript, Tailwind CSS, Supabase (Postgres/RLS), and Zustand.
Strict Working Boundaries:
Maintain modular architecture. Do not rewrite working code outside the requested scope.
Use TypeScript strict mode. Never use 'any'.
Server logic must enforce Supabase Row Level Security (RLS).
Shared UI components belong in src/components/ui/ (shadcn/ui pattern).
Gamification calculations must remain deterministic and execute on the server boundary.
Verification commands before success report:
Run pnpm typecheck to verify TypeScript integrity.
Run pnpm lint to check code formatting and standards.
Файл .cursor/rules/database-rules.mdc
Режим активации: alwaysApply: false, globs: ["src/lib/supabase//*", "supabase/migrations//*", "src/types/database.ts"].
description: Database migration safety, RLS policy enforcement, and schema validation. alwaysApply: false globs: ["src/lib/supabase//*", "supabase/migrations//*", "src/types/database.ts"]
DB schema modifications must be saved as SQL files in supabase/migrations/.
[21.08.2026 0:05] Егор: Every table MUST enforce Row Level Security (RLS) scoped to auth.uid().
Use explicit column SELECT statements instead of SELECT * for performance.
Maintain foreign key integrity and CASCADE rules on user deletions.
Run pnpm supabase gen types typescript after applying migrations.
Файл .cursor/rules/gamification-engine.mdc
Режим активации: alwaysApply: false, description: "Rules for XP, HP, Streaks, Debuffs, and Anti-Gaming logic".
description: Rules for XP, HP, Streaks, Debuffs, and Anti-Gaming logic alwaysApply: false
Gamification state recalculations must live inside src/lib/gamification/.
Never trust client-provided XP/HP values. Re-calculate state server-side.
Apply exponential anti-gaming decay when completed tasks exceed the daily limit.
Any HP loss event must write an entry to the penalties table.
Debuffs override standard UI colors and apply a 0.5x multiplier to earned XP.
Схема базы данных и моделирование данных (PostgreSQL / Supabase)
Структура базы данных спроектирована с учетом требований полной изоляции данных пользователей через RLS, поддержки сложных агрегаций и сохранения истории каждого игрового транзакционного события.
-- Включение расширения UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
[span_76](start_span)[span_76](end_span)
-- 1. Таблица профилей пользователей и игровых атрибутов
CREATE TABLE public.profiles (
   id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
   username TEXT NOT NULL UNIQUE,
   level INT NOT NULL DEFAULT 1,
   current_xp INT NOT NULL DEFAULT 0,
   next_level_xp INT NOT NULL DEFAULT 100,
   current_hp INT NOT NULL DEFAULT 100,
   max_hp INT NOT NULL DEFAULT 100,
   mana_points INT NOT NULL DEFAULT 50,
   max_mana_points INT NOT NULL DEFAULT 50,
   streak_count INT NOT NULL DEFAULT 0,
   shame_score INT NOT NULL DEFAULT 0,
   debuff_active BOOLEAN NOT NULL DEFAULT FALSE,
   debuff_multiplier NUMERIC(3, 2) NOT NULL DEFAULT 1.00,
   created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
   updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Таблица долгосрочных целей (Beeminder-style trajectory)
CREATE TABLE public.goals (
   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
   user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
   title TEXT NOT NULL,
   description TEXT,
   target_value NUMERIC(10, 2) NOT NULL,
   current_value NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
   unit TEXT NOT NULL,
   start_date DATE NOT NULL DEFAULT CURRENT_DATE,
   end_date DATE NOT NULL,
   derailment_threshold NUMERIC(10, 2) NOT NULL,
   is_archived BOOLEAN NOT NULL DEFAULT FALSE,
   created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Перечисления и таблица задач/привычек
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE task_type AS ENUM ('one_off', 'daily', 'habit');

CREATE TABLE public.tasks (
   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
   user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
   goal_id UUID REFERENCES public.goals(id) ON DELETE SET NULL,
   title TEXT NOT NULL,
   priority task_priority NOT NULL DEFAULT 'medium',
   type task_type NOT NULL DEFAULT 'one_off',
   base_xp INT NOT NULL DEFAULT 15,
   hp_penalty INT NOT NULL DEFAULT 10,
   estimated_pomodoros INT NOT NULL DEFAULT 1,
   completed_pomodoros INT NOT NULL DEFAULT 0,
   is_completed BOOLEAN NOT NULL DEFAULT FALSE,
   due_date TIMESTAMPTZ,
   last_completed_at TIMESTAMPTZ,
   created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Таблица сессий фокусного времени
CREATE TABLE public.focus_sessions (
   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
   user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
   task_id UUID REFERENCES public.tasks(id) ON DELETE SET NULL,
   duration_minutes INT NOT NULL,
   is_successful BOOLEAN NOT NULL DEFAULT TRUE,
   interruption_reason TEXT,
   started_at TIMESTAMPTZ NOT NULL,
   ended_at TIMESTAMPTZ NOT NULL
);
[21.08.2026 0:05] Егор: -- 5. Журнал штрафов и нарушений (Shame Log)
CREATE TABLE public.penalties (
   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
   user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
   task_id UUID REFERENCES public.tasks(id) ON DELETE SET NULL,
   reason TEXT NOT NULL,
   hp_deducted INT NOT NULL,
   shame_points_added INT NOT NULL,
   reflection_notes TEXT,
   is_resolved BOOLEAN NOT NULL DEFAULT FALSE,
   created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Настройка Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.focus_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.penalties ENABLE ROW LEVEL SECURITY;

-- Политики безопасности для доступа только к собственным данным
CREATE POLICY "Users can access their own profile" ON public.profiles
   FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users can access their own goals" ON public.goals
   FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can access their own tasks" ON public.tasks
   FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can access their own focus sessions" ON public.focus_sessions
   FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can access their own penalties" ON public.penalties
   FOR ALL USING (auth.uid() = user_id);
Математический движок геймификации и механизмы защиты от обхода (Anti-Gaming Engine)
Математический аппарата системы гарантирует объективность игровой прогрессии. Поведенческий движок предотвращает оптимизацию объемов за счет выполнения множества мелких тривиальных задач (proxy metric gaming).
Математическая формула расчета опыта (XP Calculation)
Величина зачисляемого опыта за каждую выполненную задачу рассчитывается динамически на сервере:
XP_{earned} = BaseXP \cdot M_{priority} \cdot M_{streak} \cdot Debuff_{active} \cdot AntiGamingFactor
Параметры функции имеют следующие значения:
BaseXP: Базовый опыт задачи (по умолчанию 15\,XP).
M_{priority}: Коэффициент приоритета (Low = 1.0, Medium = 1.3, High = 1.7, Critical = 2.5).
M_{streak}: Множитель текущей серии, рассчитываемый по формуле:
M_{streak} = 1 + \min\left(0.5, \frac{StreakCount}{20}\right)
Debuff_{active}: Коэффициент штрафа. При наличии незакрытых нарушений в Shame Log значение равно 0.5, иначе 1.0.
AntiGamingFactor: Экспоненциальный фактор затухания, включающийся при превышении порога в N = 8 выполненных задач за текущие сутки:
AntiGamingFactor = \begin{cases} 1.0, & \text{если } DailyCount \le N \\ e^{-\lambda \cdot (DailyCount - N)}, & \text{если } DailyCount > N \end{cases}
где \lambda = 0.20. Каждый последующий шаг сверх нормы снижает получаемый опыт, сводя к нулю целесообразность искусственной накрутки счетчиков.
Алгоритм расчета урона здоровью (HP Penalty Mechanics)
Невыполнение задачи или пропуск ежедневного обязательства приводит к каскадному списыванию пунктов здоровья:
HP_{deducted} = BasePenalty \cdot \left(1 + \ln(StreakCount + 1)\right) \cdot Weight_{priority}
Психологический смысл логарифмического масштабирования заключается в том, что срыв длительной серии задач наносит более существенный урон, активируя механизм неприятия потерь на основании уже вложенных усилий.
Траектория схода с цели (Derailment Line Trajectory)
Для долгосрочных целей расчет требуемого минимального прогресса в момент времени t производится по формуле линейной идеальной траектории:
Y_{required}(t) = Y_0 + \left(\frac{TargetValue - Y_0}{T_{end} - T_{start}}\righ[span_30](start_span)[span_30](end_span)t) \cdot (t - T_{start})
Если фактический прогресс Y_{current}(t) < Y_{required}(t) - DerailmentThreshold, цель переводится в критический статус. Системный контроллер накладывает ежедневный штраф в размере 15\,HP до момента возвращения показателей в коридор нормы.
// src/lib/gamification/xp-calculator.ts
[21.08.2026 0:05] Егор: export interface TaskRewardInput {
 baseXp: number;
 priority: 'low' | 'medium' | 'high' | 'critical';
 streakCount: number;
 hasActiveDebuff: boolean;
 dailyCompletedTasksCount: number;
}

export function calculateXpGain(input: TaskRewardInput): number {
 const priorityMultipliers: Record<string, number> = {
   low: 1.0,
   medium: 1.3,
   high: 1.7,
   critical: 2.5,
 };

 const priorityMult = priorityMultipliers[input.priority] ?? 1.0;
 const streakMult = 1 + Math.min(0.5, input.streakCount / 20);
 const debuffMult = input.hasActiveDebuff ? 0.5 : 1.0;

 // Расчет затухания Anti-Gaming
 const maxThreshold = 8;
 const lambda = 0.20;
 let antiGamingFactor = 1.0;

 if (input.dailyCompletedTasksCount > maxThreshold) {
   const excess = input.dailyCompletedTasksCount - maxThreshold;
   antiGamingFactor = Math.exp(-lambda * excess);
 }

 const rawXp = input.baseXp * priorityMult * streakMult * debuffMult * antiGamingFactor;
 return Math.max(1, Math.round(rawXp));
}
Дизайн-система, цветовая палитра и интерфейсный каркас (Dark UI/UX)
Визуальное оформление интерфейса основывается на стандартах проектирования глубоких темных тем (Material Dark UI). Главными целями являются снижение зрительного утомления, создание эффекта полной погруженности в рабочую среду и использование ненасыщенных семантических акцентов для передачи информации о статусах и рисках без ослепления пользователя.
Токен UI
CSS Значение / HSL
Элемент интерфейса
Назначение и эмоциональный эффект
--bg-base
#08090D / 228 25% 4%
Главный подстилающий фон
Глубокое погружение, отсутствие цветового шума
--surface-card
#11131C / 228 24% 9%
Карточки задач, контейнеры
Контрастность первого уровня, группировка элементов
--sur[span_102](start_span)[span_102](end_span)[span_104](start_span)[span_104](end_span)face-border
#1E2235 / 228 27% 16%
Границы карточек и разделители
Строгая пространственная иерархия
--accent-xp
#8B5CF6 / 263 90% 66%
Прогресс опыта, плашки уровня
Активация ощущения роста и творческого подьема
--sta[span_106](start_span)[span_106](end_span)tus-hp-ok
#10B981 / 158 84% 39%
Индикатор здоровья (>50%)
Ощущение контроля, стабильности и безопасности
--status-hp-warn
#F59E0B / 38 92% 50%
Индикатор здоровья (25%-50%)
Внимание, необходимость фокусировки
--status-hp-danger
#EF4444 / 0 84% 60%
Критический уровень HP (<25%)
Тревожность, мгновенный призыв к ликвидации срыва
--mana-focus
#06B6D4 / 189 94% 43%
Таймер фокуса, шкала маны
Спокойная концентрация, ясность мышления
--text-primary
#F3F4F6 / 220 14% 96%
Основные заголовки, активный текст
Высокая читаемость без зрительной усталости
--tex[span_107](start_span)[span_107](end_span)t-secondary
#9CA3AF / 218 11% 65%
Метаданные, описания, таймштампы
Второстепенный контекст
Компоновка пользовательского интерфейса распределена по функциональным зонам дашборда для обеспечения оперативного доступа к информации:
Зона дашборда
Элементы структуры
Игровые механики и поведение
Верхняя панель (Profile Deck)
Аватар, индикаторы Lv, XP, HP, Mana, счетчик Streak
Отображение глобального статуса, визуальные эффекты при получении опыта или урона
Системный баннер (Debuff Alert)
Активный аларм с описанием штрафа и кнопкой рефлексии
Блокировка получения полной награды, вызов модального окна Shame Log
Центральный левый блок
Траектория целей (Beeminder Graph), линейный график
Визуализация текущего схода с траектории и границы риска
Центральный правый блок
Матрица задач, сгруппированная по приоритетам и срокам
Интерактивный список с быстрым завершением, отображением базового XP
Нижняя левая секция
Виджет таймера глубокой работы (Pomodoro Focus Deck)
Запуск сессий с фиксацией прерываний и зачислением очков Mana
Нижняя правая секция
Журнал нарушений (Shame & Penalty Audit Log)
Просмотр необработанных срывов, заполнение обязательной формы рефлексии
Поэтапный план разработки для Vibe-Coding (Implementation Roadmap)
[21.08.2026 0:05] Егор: Процесс разработки разбит на 5 изолированных спринтов. Каждый этап представляет собой самодостаточную веху, подготовленную для пошаговой генерации через ИИ-ассистентов с контролем результатов.
Фаза разработки
Фокус и ключевые задачи
Основные артефакты и компоненты
Проверочная команда / Валидация
Фаза 1: Инфраструктура, БД и Auth
Инициализация Next.js, настройка Supabase, RLS и схем таблиц.
01_initial_schema.sql, supabaseClient.ts, .cursor/rules/.
pnpm typecheck
Фаза 2: Движок задач и Focus Timer
Создание CRUD задач, фильтрация, интерфейс Pomodoro-таймера.
TaskMat[span_77](start_span)[span_77](end_span)rix.tsx, FocusTimer.tsx, useTaskStore.ts.
Проверка работы таймера и добавления задач
Фаза 3: Математика геймификации
Реализация модулей XP/HP, Anti-Gaming и наложения дебаффов.
xp-calculator.ts, hp-engine.ts, Server Actions обновления.
Юнит-тесты формул затухания XP
Фаза 4: Траектории и Shame Log
Визуализация графиков целей, модальное окно рефлексии срывов.
GoalChart.tsx, ShameLogModal.tsx, penalties API.
Ручной сценарий имитации срыва задачи
Фаза 5: UI Polish & Sound FX
Анимации Framer Motion, звуковой движок, полировка темного UI.
sound-engine.ts, Framer Motion wrappers, глобальный UI.
pnpm lint и финальный визуальный аудит
Подробное описание и промпты фаз разработки
Фаза 1: Базовая инфраструктура, база данных и аутентификация
Цель: Создать проектный каркас, применить SQL-миграцию, настроить RLS-политики и файлы правил .cursor/rules/.
ИИ-Промпт для генерации:"Создай структуру проекта Next.js 14 App Router с Tailwind CSS и shadcn/ui. Напиши SQL-миграцию в supabase/migrations/01_schema.sql для таблиц profiles, goa[span_87](start_span)[span_87](end_span)[span_92](start_span)[span_92](end_span)ls, tasks, focus_sessions, penalties. Включи RLS для всех таблиц, разрешив доступ только владельцу записи (auth.uid() = user_id). Добавь файлы .cursor/rules/core-context.mdc и .cursor/rules/database-rules.mdc."
Фаза 2: Ядро управления задачами и таймер фокуса
Цель: Построить интерфейс управления задачами с фильтрацией по приоритетам и полнофункциональный таймер Pomodoro.
ИИ-Промпт для генерации:"Реализуй UI дашборда задачи в src/components/dashboard/TaskMatrix.tsx. Создай Server Actions для добавления, редактирования и отметки выполнения задач. Реализуй компонент таймера фокуса FocusTimer.tsx с использованием Zustand для управления состоянием отсчета и сохранения завершенных сессий в таблицу focus_sessions."
Фаза 3: Серверный движок геймификации
Цель: Внедрить математическую логику расчета XP, списания HP и проверки лимитов Anti-Gaming.
ИИ-Промпт для генерации:"Создай модуль src/lib/gamification/xp-calculator.ts и имплементируй формулу расчета XP с учетом приоритета, серий и экспоненциального затухания Anti-Gaming при выполнении более 8 задач за день. Создай Server Action completeTaskAction, который пересчитывает профиль пользователя и атомарно обновляет таблицы profiles и tasks."
Фаза 4: Траектории целей и модуль рефлексии срывов (Shame Engine)
Цель: Разработать визуализацию графиков целей с линией риска и закрытый контур проработки нарушений Shame Log[span_36](start_span)[span_36](end_span).
ИИ-Промпт для генерации:"Создай компонент графика целей GoalChart.tsx с отрисовкой линии требуемого прогресса. Реализуй интерфейс ShameLog.tsx. Если у пользователя debuff_active === true, заблокируй получение базового опыта и заставь пройти форму рефлексии причины срыва задачи для снятия штрафа."
Фаза 5: Анимации, звуковое сопровождение и финальный UI-аудит
Цель: Внедрить микро-взаимодействия через Framer Motion, звуковые эффекты для ключевых событий и провести финальную проверку.
ИИ-Промпт для генерации:"Добавь анимации Framer Motion для бара прогресса XP и модального окна поднятия уровня. Создай легкий Web Audio API модуль для воспроизведения звуков завершения задачи, получения урона и старта таймера. Проверь цветовую гамму на соответствие токенам темной темы."
[21.08.2026 0:05] Егор: Протокол верификации и контроля качества системной целостности
Для обеспечения надежности системы при регулярной итеративной доработке через ИИ-инструменты устанавливается обязательный регламент приемки функционала:
Проверка строгости типов (Type Safety): Запуск команды pnpm typecheck после каждого сгенерированного модуля. Компиляция должна проходить без единой ошибки типа.
Аудит форматирования кода: Выполнение pnpm lint для исключения потенциальных проблем с вызовом React Hooks или неиспользуемыми импортами.
Валидация изоляции данных (RLS Audit): Проверка через консоль Supabase, что прямой запрос к таблицам с чужим user_id возвращает пустой массив данных.
Тестирование защиты от накрутки (Anti-Gaming Test): Имитация последовательного быстрого завершения 12 тестовых задач. Опыт с 9 по 12 задачу должен стремиться к минимальным значениям (1\,XP), подтверждая работу экспоненциального затухания.
Контроль UI-дебаффов: Проверка корректности применения штрафного коэффициента 0.5\times при наличии неотреагированных записей в журнале нарушений.
Представленная спецификация формирует исчерпывающий технический план, обеспечивающий баланс между инженерной дисциплиной, эстетической привлекательностью темного интерфейса и психологической эффективностью механик геймификации.
Источники
1. Gamification Productivity Apps: 8 Examples Analyzed (2026) - Trophy, https://trophy.so/blog/productivity-gamification-examples 2. 4 Hacking Motivation - MIT Press Direct, https://direct.mit.edu/books/oa-monograph/chapter-pdf/2257199/9780262352031_cas.pdf 3. 12 Apps Like Habitica - TMS Outsource, https://tms-outsource.com/blog/posts/apps-like-habitica/ 4. The Moral Psychology of Hope 178660972X, 9781786609724 - DOKUMEN.PUB, https://dokumen.pub/the-moral-psychology-of-hope-178660972x-9781786609724.html 5. Best Anti-Procrastination Apps (2026 Guide) - Goals and Progress, https://goalsandprogress.com/best-anti-procrastination-apps/ 6. Hacking Life: Systematized Living And Its Discontents 0262038153, 9780262038157, 0262352036, 9780262352031, 0262038153, 9780262352048, 0262538997, 9780262538992 - DOKUMEN.PUB, https://dokumen.pub/hacking-life-systematized-living-and-its-discontents-0262038153-9780262038157-0262352036-9780262352031-0262038153-9780262352048-0262538997-9780262538992.html 7. Cursor Rules Examples for Real Projects - Vibe Code, https://www.vibecodesource.com/blog/cursor-rules-examples/ 8. vibecodex — vibe coding rules for production - GitHub, https://github.com/yerdaulet-damir/vibe-coding-rules 9. Cursor Rules: Complete .mdc Guide & 15 Templates (2026) - Vibe Coding Academy, https://www.vibecodingacademy.ai/blog/cursor-rules-complete-guide 10. The Perfect Cursor AI setup for React and Next.js - Builder.io, https://www.builder.io/blog/cursor-ai-tips-react-nextjs 11. Dark theme - Material Design, https://m2.material.io/design/color/dark-theme.html 12. 60+ Best Dark mode screen 2026 UI/UX Inspiration - Muzli, https://muz.li/inspiration/dark-mode/ 13. Best 33 Dark UI Design Color Palettes | Octet Design Labs, https://octet.design/colors/user-interfaces/dark-ui-design/ 14. Vibe Coding in 2025: Complete Guide to AI-Powered Development Tools | Startupbricks, https://www.startupbricks.in/blog/vibe-coding-guide-2025/