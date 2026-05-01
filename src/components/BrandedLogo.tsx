
'use client';

import React from 'react';
import { ChefHat } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BrandedLogoProps {
  url?: string;
  size?: number;
  className?: string;
  showPuzzleLines?: boolean;
}

/**
 * Premium Branded Logo component that handles the "Puzzle" aesthetic
 * with permanent obvious white lines and high-end frosted glass effect.
 * Sit under a semi-transparent white background as requested.
 */
export function BrandedLogo({ 
  url, 
  size = 48, 
  className,
  showPuzzleLines = true 
}: BrandedLogoProps) {
  if (!url) {
    return (
      <div className={cn("flex items-center justify-center bg-white/60 backdrop-blur-md rounded-xl border border-white/80 shadow-sm", className)} style={{ width: size, height: size }}>
        <ChefHat size={size * 0.6} className="text-primary opacity-60" />
      </div>
    );
  }

  return (
    <div 
      className={cn(
        "relative overflow-hidden bg-white/60 backdrop-blur-md border border-white/80 shadow-sm", 
        className
      )}
      style={{ width: size, height: size }}
    >
      {showPuzzleLines ? (
        <div className="grid grid-cols-2 grid-rows-2 w-full h-full p-[2px] bg-white">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="relative overflow-hidden border-[1px] border-white">
              <div
                className="absolute w-[200%] h-[200%]"
                style={{
                  backgroundImage: `url(${url})`,
                  backgroundSize: '100% 100%',
                  left: `-${(i % 2) * 100}%`,
                  top: `-${Math.floor(i / 2) * 100}%`,
                }}
              />
              {/* Added a white fade overlay to give it that "under white background" look */}
              <div className="absolute inset-0 bg-white/10" />
            </div>
          ))}
        </div>
      ) : (
        <div 
          className="w-full h-full bg-cover bg-center" 
          style={{ backgroundImage: `url(${url})` }} 
        >
          <div className="absolute inset-0 bg-white/10" />
        </div>
      )}
    </div>
  );
}
