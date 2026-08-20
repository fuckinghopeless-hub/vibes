import React from 'react';

/**
 * VIBES Constant Logo Component
 * This logo styling is locked and independent of any global application font changes.
 */
export const VibeLogoSvg: React.FC = () => {
  return (
    <div className="select-none py-1 flex items-center overflow-visible">
      <span
        className="text-black dark:text-white select-none transition-colors duration-150 inline-block"
        style={{
          fontFamily: '"Outfit", system-ui, -apple-system, sans-serif',
          fontWeight: 900,
          fontSize: '1.75rem',
          letterSpacing: '-0.055em',
          transform: 'scaleX(1.35) skewX(-2deg)',
          transformOrigin: 'left center',
          display: 'inline-block',
          marginRight: '0.4em',
          lineHeight: 1,
        }}
      >
        vibes
      </span>
    </div>
  );
};
