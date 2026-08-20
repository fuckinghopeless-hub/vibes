import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface M3CardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
}

export const M3Card: React.FC<M3CardProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className={`rounded-3xl bg-white dark:bg-[#141416] border border-zinc-300 dark:border-zinc-800 shadow-md shadow-zinc-200/50 dark:shadow-black/50 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};
