import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { soundEngine } from '../../lib/soundEngine';

type ButtonVariant = 'primary' | 'tonal' | 'outlined' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface M3ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

export const M3Button: React.FC<M3ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  onClick,
  disabled,
  className = '',
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-[var(--accent-primary)] text-[var(--accent-text)] border-2 border-[var(--accent-primary)] shadow-sm hover:opacity-90';
      case 'tonal':
        return 'bg-zinc-100 text-black hover:bg-zinc-200 border-2 border-zinc-200 dark:bg-zinc-800 dark:text-white dark:border-zinc-700 dark:hover:bg-zinc-700';
      case 'outlined':
        return 'bg-white dark:bg-zinc-900/60 text-black dark:text-zinc-200 border-2 border-zinc-300 dark:border-zinc-700 hover:border-black dark:hover:border-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/80';
      case 'ghost':
        return 'bg-transparent text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/80 border-2 border-transparent';
      case 'danger':
        return 'bg-red-50 text-red-600 border-2 border-red-200 hover:bg-red-100 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/60 dark:hover:bg-red-900/40';
      default:
        return '';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'h-9 px-3.5 text-xs font-bold gap-1.5 rounded-xl';
      case 'lg':
        return 'h-12 px-6 text-sm font-bold gap-2.5 rounded-2xl';
      default:
        return 'h-11 px-4 sm:px-5 text-xs sm:text-sm font-bold gap-2 rounded-2xl';
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || isLoading) return;
    soundEngine.playButtonClick();
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <motion.button
      whileTap={disabled || isLoading ? undefined : { scale: 0.98 }}
      transition={{ duration: 0.1, ease: [0.2, 0.8, 0.2, 1] }}
      onClick={handleClick}
      disabled={disabled || isLoading}
      className={`relative inline-flex items-center justify-center tracking-tight select-none outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#141416] transition-colors duration-150 cursor-pointer ${
        disabled || isLoading ? 'opacity-30 cursor-not-allowed pointer-events-none' : ''
      } ${getVariantStyles()} ${getSizeStyles()} ${className}`}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : (
        leftIcon && <span className="flex-shrink-0">{leftIcon}</span>
      )}
      <span className="truncate">{children}</span>
      {!isLoading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
    </motion.button>
  );
};
