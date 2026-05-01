'use client';

import React, { useEffect, useState } from 'react';
import { getSafeLogoUrl } from '@/app/lib/branding';

interface PuzzleLoaderProps {
  imageUrl?: string;
}

export function PuzzleLoader({ imageUrl }: PuzzleLoaderProps) {
  const [finalImageUrl, setFinalImageUrl] = useState<string>('');
  
  const gridSize = 4; // 4x4 grid
  const pieces = Array.from({ length: gridSize * gridSize }, (_, i) => i);
  const [mounted, setMounted] = useState(false);
  const [offsets, setOffsets] = useState<{x: number, y: number, r: number}[]>([]);

  // Sequential order for the pieces to animate (Spiral sequence)
  const sequentialOrder = [
    0, 1, 2, 3,
    7, 11, 15, 14,
    13, 12, 8, 4,
    5, 6, 10, 9
  ];

  useEffect(() => {
    // Resolve logo URL
    const logo = getSafeLogoUrl(imageUrl);
    setFinalImageUrl(logo);

    // Generate dramatic random starting offsets for the "shattered" look
    const initialOffsets = pieces.map(() => ({
      x: (Math.random() - 0.5) * 800,
      y: (Math.random() - 0.5) * 800,
      r: (Math.random() - 0.5) * 720,
    }));
    
    setOffsets(initialOffsets);
    
    // Trigger the assembly with a slight delay to allow the "shattered" state to render
    const timer = setTimeout(() => {
      setMounted(true);
    }, 300);
    return () => clearTimeout(timer);
  }, [imageUrl]);

  if (offsets.length === 0) {
    return <div className="fixed inset-0 z-[100] bg-background" />;
  }

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background overflow-hidden animate-in fade-in duration-700">
      {/* Premium backdrop glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />
      
      <div className="relative w-64 h-64 md:w-80 md:h-80 mb-16 shadow-[0_0_50px_-12px_rgba(0,0,0,0.15)] rounded-3xl overflow-hidden">
        {finalImageUrl ? (
          <div className="grid grid-cols-4 grid-rows-4 w-full h-full relative bg-white">
            {pieces.map((i) => {
              const row = Math.floor(i / gridSize);
              const col = i % gridSize;
              const offset = offsets[i];
              
              // Calculate animation delay based on the sequential spiral order
              // Increased delay per piece (100ms) for "one box following the other" effect
              const delayIndex = sequentialOrder.indexOf(i);
              const delay = delayIndex * 100; 

              return (
                <div
                  key={i}
                  className="relative overflow-hidden transition-all duration-[1200ms] cubic-bezier(0.34, 1.56, 0.64, 1)"
                  style={{
                    transform: mounted 
                      ? 'translate(0, 0) rotate(0) scale(1)' 
                      : `translate(${offset.x}px, ${offset.y}px) rotate(${offset.r}deg) scale(0.5)`,
                    opacity: mounted ? 1 : 0,
                    transitionDelay: `${delay}ms`,
                    // Subtly visible borders during assembly for a mechanical feel
                    outline: mounted ? '0px solid transparent' : '1px solid rgba(0,0,0,0.05)',
                  }}
                >
                  <div
                    className="absolute w-[400%] h-[400%]"
                    style={{
                      backgroundImage: `url(${finalImageUrl})`,
                      backgroundSize: '100% 100%',
                      left: `-${col * 100}%`,
                      top: `-${row * 100}%`,
                    }}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="w-full h-full rounded-3xl bg-muted/20 flex items-center justify-center border-2 border-dashed border-primary/20">
             <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          </div>
        )}
      </div>
      
      <div className="text-center space-y-6 z-10">
        <div className="overflow-hidden">
          <h2 className={`text-3xl font-headline font-black text-primary tracking-tighter transition-all duration-1000 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
            KITCHEN PROF
          </h2>
        </div>
        
        <div className="flex flex-col items-center gap-4">
          <div className="w-48 h-1 bg-muted rounded-full overflow-hidden relative">
             <div className="absolute inset-0 bg-primary/20" />
             <div className="h-full bg-primary animate-[loading_7s_linear_infinite]" />
          </div>
          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.4em] opacity-60 animate-pulse">
            Syncing Market Data
          </p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes loading {
          0% { width: 0%; transform: translateX(-100%); }
          10% { width: 10%; transform: translateX(0); }
          100% { width: 100%; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
