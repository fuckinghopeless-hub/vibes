import React, { useState } from 'react';
import { User, Lock, Mail, Sun, Moon, ArrowRight } from 'lucide-react';
import { useVibeStore } from '../../store/useVibeStore';
import { VibeLogoSvg } from '../svg/VibeLogoSvg';
import { M3Button } from '../ui/M3Button';
import { M3Input } from '../ui/M3Input';
import { M3Card } from '../ui/M3Card';

export const AuthCard: React.FC = () => {
  const { registerUser, themeMode, toggleThemeMode } = useVibeStore();

  const [mode, setMode] = useState<'register' | 'login'>('register');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Введите имя пользователя');
      return;
    }
    if (mode === 'register' && password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов');
      return;
    }

    setError('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      registerUser(username, false, email);
    }, 150);
  };

  const handleGuestPlay = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      registerUser(username || 'Гость', true);
    }, 100);
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-4 md:py-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-4">
        <VibeLogoSvg />
        <button
          onClick={toggleThemeMode}
          className="p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-[#141416] text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-all shadow-sm"
          title={themeMode === 'light' ? 'Тёмная тема' : 'Светлая тема'}
        >
          {themeMode === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </button>
      </div>

      <M3Card className="p-6 md:p-7 space-y-4">
        {/* Header Title */}
        <div>
          <h1 className="text-xl font-semibold text-black dark:text-white tracking-tight">
            {mode === 'register' ? 'Регистрация' : 'Вход'}
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Персональная система продуктивности
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex bg-zinc-100 dark:bg-zinc-800/80 p-1 rounded-xl border border-zinc-200 dark:border-zinc-700">
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError('');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              mode === 'register'
                ? 'bg-white dark:bg-zinc-700 text-black dark:text-white shadow-sm'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white'
            }`}
          >
            Регистрация
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError('');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              mode === 'login'
                ? 'bg-white dark:bg-zinc-700 text-black dark:text-white shadow-sm'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white'
            }`}
          >
            Вход
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-3.5">
          {error && (
            <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs font-semibold">
              {error}
            </div>
          )}

          <M3Input
            label="Имя пользователя"
            placeholder="например: alex"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            leftIcon={<User className="w-4 h-4" />}
            required
          />

          <M3Input
            label="Электронная почта"
            type="email"
            placeholder="user@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail className="w-4 h-4" />}
          />

          <M3Input
            label="Пароль"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<Lock className="w-4 h-4" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-xs font-semibold text-zinc-500 hover:text-black dark:hover:text-white"
              >
                {showPassword ? 'Скрыть' : 'Показать'}
              </button>
            }
          />

          <div className="pt-2 space-y-2.5">
            <M3Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isLoading}
              className="w-full"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {mode === 'register' ? 'Зарегистрироваться' : 'Войти'}
            </M3Button>

            <M3Button
              type="button"
              variant="outlined"
              size="md"
              onClick={handleGuestPlay}
              isLoading={isLoading}
              className="w-full text-xs"
            >
              Продолжить как гость
            </M3Button>
          </div>
        </form>
      </M3Card>
    </div>
  );
};
