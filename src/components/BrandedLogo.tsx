
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
 * with subtle, low-contrast white lines and high-end frosted glass effect.
 * Sits under a semi-transparent white background for a faded look.
 */
export function BrandedLogo({ 
  url, 
  size = 48, 
  className,
  showPuzzleLines = true 
}: BrandedLogoProps) {
  if (!url) {
    return (
      <div className={cn("flex items-center justify-center bg-white/40 backdrop-blur-md rounded-xl border border-white/60 shadow-sm", className)} style={{ width: size, height: size }}>
        <ChefHat size={size * 0.6} className="text-primary opacity-40" />
      </div>
    );
  }

  return (
    <div 
      className={cn(
        "relative overflow-hidden bg-white/40 backdrop-blur-md border border-white/60 shadow-sm", 
        className
      )}
      style={{ width: size, height: size }}
    >
      {showPuzzleLines ? (
        <div className="grid grid-cols-2 grid-rows-2 w-full h-full p-[1px] bg-white/20">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="relative overflow-hidden border-[0.5px] border-white/5">
              <div
                className="absolute w-[200%] h-[200%]"
                style={{
                  backgroundImage: `url(${url})`,
                  backgroundSize: '100% 100%',
                  left: `-${(i % 2) * 100}%`,
                  top: `-${Math.floor(i / 2) * 100}%`,
                }}
              />
              {/* Soft low-contrast overlay */}
              <div className="absolute inset-0 bg-white/5" />
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
