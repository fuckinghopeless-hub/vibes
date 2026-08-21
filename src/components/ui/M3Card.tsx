import React from 'react';

interface M3CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const M3Card: React.FC<M3CardProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`rounded-3xl bg-white dark:bg-[#141416] border-2 border-zinc-200 dark:border-zinc-800 shadow-sm transition-all duration-200 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
