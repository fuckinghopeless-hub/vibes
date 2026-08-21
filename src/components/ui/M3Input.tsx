import React from 'react';

interface M3InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const M3Input: React.FC<M3InputProps> = ({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5 text-left">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-bold text-black dark:text-white select-none tracking-tight"
        >
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3.5 text-zinc-500 dark:text-zinc-400 pointer-events-none flex items-center justify-center">
            {leftIcon}
          </div>
        )}

        <input
          id={inputId}
          className={`w-full py-2.5 px-3.5 text-sm font-semibold rounded-xl bg-white dark:bg-[#141416] text-black dark:text-white border-2 ${
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
              : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 focus:border-black dark:focus:border-white'
          } outline-none transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:ring-2 focus:ring-[var(--accent-ring)] ${
            leftIcon ? 'pl-10' : ''
          } ${rightIcon ? 'pr-10' : ''} ${className}`}
          {...props}
        />

        {rightIcon && (
          <div className="absolute right-3.5 flex items-center justify-center text-zinc-500 dark:text-zinc-400">
            {rightIcon}
          </div>
        )}
      </div>

      {hint && !error && (
        <p className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 pl-1">
          {hint}
        </p>
      )}

      {error && (
        <p className="text-xs font-bold text-red-500 dark:text-red-400 pl-1">
          {error}
        </p>
      )}
    </div>
  );
};
