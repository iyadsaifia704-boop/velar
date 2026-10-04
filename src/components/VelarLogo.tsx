import React from 'react';

interface VelarLogoProps {
  className?: string;
  variant?: 'full' | 'horizontal' | 'mark-only' | 'text-only';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  light?: boolean;
}

export const VelarLogo: React.FC<VelarLogoProps> = ({
  className = '',
  variant = 'full',
  size = 'md',
  light = true,
}) => {
  // Exact geometric vector replica of the metallic folded 'V' emblem from VELAR brand board
  const Emblem = ({ markSize = 36 }: { markSize?: number }) => (
    <svg
      width={markSize}
      height={markSize}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform duration-300 hover:scale-105"
      aria-label="VELAR Emblem"
    >
      <defs>
        {/* Platinum / Metallic Silver Gradients */}
        <linearGradient id="velarSilverGrad1" x1="20" y1="15" x2="60" y2="105" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="35%" stopColor="#D4D9E2" />
          <stop offset="70%" stopColor="#8A97A8" />
          <stop offset="100%" stopColor="#4A5666" />
        </linearGradient>

        <linearGradient id="velarSilverGrad2" x1="60" y1="105" x2="100" y2="15" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7B8899" />
          <stop offset="40%" stopColor="#BCC6D3" />
          <stop offset="75%" stopColor="#EEF2F6" />
          <stop offset="100%" stopColor="#FFFFFF" />
        </linearGradient>

        <linearGradient id="velarFoldShadow" x1="45" y1="50" x2="75" y2="85" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1E252E" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#0B0E13" stopOpacity="0.4" />
        </linearGradient>
      </defs>

      {/* Left facet arm */}
      <polygon
        points="22,18 42,18 60,78 46,78"
        fill="url(#velarSilverGrad1)"
      />

      {/* Main geometric folded ribbon V */}
      <polygon
        points="98,18 78,18 60,78 46,78 60,104"
        fill="url(#velarSilverGrad2)"
      />

      {/* Intersecting interior facet giving the 3D folded illusion */}
      <polygon
        points="42,18 60,62 78,18 64,18 60,38 56,18"
        fill="url(#velarFoldShadow)"
      />

      {/* Front folding accent blade */}
      <polygon
        points="46,78 60,104 60,78"
        fill="#9AA7B6"
        opacity="0.9"
      />
    </svg>
  );

  const emblemSizes = {
    sm: 24,
    md: 32,
    lg: 44,
    xl: 64,
  };

  const textSizes = {
    sm: 'text-sm tracking-[0.25em]',
    md: 'text-base tracking-[0.3em]',
    lg: 'text-xl tracking-[0.35em]',
    xl: 'text-3xl tracking-[0.4em]',
  };

  const subSizes = {
    sm: 'text-[9px] tracking-[0.25em]',
    md: 'text-[10px] tracking-[0.3em]',
    lg: 'text-xs tracking-[0.35em]',
    xl: 'text-sm tracking-[0.4em]',
  };

  const textColor = light ? 'text-slate-100' : 'text-slate-900';
  const subColor = light ? 'text-slate-400' : 'text-slate-500';

  if (variant === 'mark-only') {
    return <Emblem markSize={emblemSizes[size]} />;
  }

  if (variant === 'text-only') {
    return (
      <div className={`flex flex-col items-center select-none ${className}`}>
        <span className={`font-semibold uppercase font-sans ${textSizes[size]} ${textColor}`}>
          VELAR
        </span>
        <span className={`font-medium uppercase ${subSizes[size]} ${subColor} mt-0.5`}>
          MEN'S FASHION
        </span>
      </div>
    );
  }

  if (variant === 'horizontal') {
    return (
      <div className={`flex items-center gap-3 select-none ${className}`}>
        <Emblem markSize={emblemSizes[size]} />
        <div className="flex flex-col">
          <span className={`font-semibold uppercase font-sans ${textSizes[size]} ${textColor} leading-tight`}>
            VELAR
          </span>
          <span className={`font-medium uppercase ${subSizes[size]} ${subColor} leading-tight`}>
            MEN'S FASHION
          </span>
        </div>
      </div>
    );
  }

  // Full stacked lockup (as on brand board & luxury shopping bag)
  return (
    <div className={`flex flex-col items-center text-center select-none ${className}`}>
      <Emblem markSize={emblemSizes[size]} />
      <span className={`font-semibold uppercase font-sans ${textSizes[size]} ${textColor} mt-2.5`}>
        VELAR
      </span>
      <span className={`font-medium uppercase ${subSizes[size]} ${subColor} mt-1`}>
        MEN'S FASHION
      </span>
    </div>
  );
};
