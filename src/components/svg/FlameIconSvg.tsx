import React from 'react';

interface FlameIconSvgProps {
  className?: string;
  filled?: boolean;
  animated?: boolean;
}

export const FlameIconSvg: React.FC<FlameIconSvgProps> = ({
  className = 'w-5 h-5',
  filled = true,
  animated = false,
}) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} ${animated ? 'animate-pulse' : ''} inline-block transition-transform duration-200`}
    >
      {/* Outer Flame Contour */}
      <path
        d="M12 2C12 2 15.5 6.5 15.5 9.5C15.5 11 14.8 12.2 13.8 13C13.8 13 17.5 13.5 17.5 17C17.5 20.0376 15.0376 22.5 12 22.5C8.96243 22.5 6.5 20.0376 6.5 17C6.5 13.2 9.5 9.5 9.5 9.5C9.5 9.5 10 12 11.2 12C11.5 10.5 12 7 12 2Z"
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Inner Flame Core (High contrast negative space / spark cutout) */}
      <path
        d="M12 15.5C11.1716 15.5 10.5 16.1716 10.5 17C10.5 17.8284 11.1716 18.5 12 18.5C12.8284 18.5 13.5 17.8284 13.5 17C13.5 16.1716 12.8284 15.5 12 15.5Z"
        fill={filled ? (document?.documentElement?.classList.contains('dark') ? '#141416' : '#FFFFFF') : 'currentColor'}
        className="fill-white dark:fill-[#141416]"
      />
    </svg>
  );
};
