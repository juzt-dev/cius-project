import React from 'react';

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
}

const ShinyText: React.FC<ShinyTextProps> = ({
  text,
  disabled = false,
  speed = 5,
  className = '',
}) => {
  const animationDuration = `${speed}s`;

  if (disabled) {
    // Normal black text without gradient when disabled
    return (
      <span
        className={`inline-block text-black font-semibold transition-all duration-300 ${className}`}
      >
        {text}
      </span>
    );
  }

  return (
    <>
      {/* Light mode - orange metallic effect on hover */}
      <div
        className={`bg-clip-text text-transparent inline-block dark:hidden animate-shine transition-all duration-300 ${className}`}
        style={{
          backgroundImage:
            'linear-gradient(110deg, #1a1a1a 20%, #4a4a4a 35%, #ff8c42 45%, #ffb366 50%, #ff8c42 55%, #4a4a4a 65%, #1a1a1a 80%)',
          backgroundSize: '300% 100%',
          WebkitBackgroundClip: 'text',
          MozBackgroundClip: 'text',
          animationDuration: animationDuration,
          animationTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
          fontWeight: '600',
          filter: 'contrast(1.1)',
        }}
      >
        {text}
      </div>

      {/* Dark mode - orange metallic effect on hover */}
      <div
        className={`hidden dark:inline-block bg-clip-text text-transparent animate-shine transition-all duration-300 ${className}`}
        style={{
          backgroundImage:
            'linear-gradient(110deg, #1a1a1a 20%, #4a4a4a 35%, #ff8c42 45%, #ffb366 50%, #ff8c42 55%, #4a4a4a 65%, #1a1a1a 80%)',
          backgroundSize: '300% 100%',
          WebkitBackgroundClip: 'text',
          MozBackgroundClip: 'text',
          animationDuration: animationDuration,
          animationTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
          fontWeight: '600',
          filter: 'contrast(1.1)',
        }}
      >
        {text}
      </div>
    </>
  );
};

export default ShinyText;
