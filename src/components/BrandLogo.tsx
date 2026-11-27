import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const SIZE_CLASSES: Record<NonNullable<BrandLogoProps['size']>, string> = {
  sm: 'w-10 h-10',
  md: 'w-12 h-12 sm:w-14 sm:h-14',
  lg: 'w-20 h-20 sm:w-24 sm:h-24',
  xl: 'w-28 h-28 sm:w-32 sm:h-32',
};

export const BrandLogo: React.FC<BrandLogoProps> = ({ size = 'md', className = '' }) => {
  return (
    <div
      className={`${SIZE_CLASSES[size]} rounded-full overflow-hidden bg-[#02050d] border-2 border-cyan-400/60 shadow-lg shadow-cyan-500/25 shrink-0 relative ${className}`}
    >
      <img
        src="/assets/aistudio/image_2ffb590b.png"
        alt="Elvora Vision Logo"
        className="w-full h-full object-cover object-[50%_60%] scale-[1.03] select-none pointer-events-none"
      />
    </div>
  );
};
