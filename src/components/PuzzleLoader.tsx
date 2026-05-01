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

  // Sequential order for the pieces to animate (spiral-ish or linear sequence)
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

    // Generate random starting offsets for the "shattered" look
    const initialOffsets = pieces.map(() => ({
      x: (Math.random() - 0.5) * 500,
      y: (Math.random() - 0.5) * 500,
      r: (Math.random() - 0.5) * 360,
    }));
    
    setOffsets(initialOffsets);
    
    // Trigger the assembly
    const timer = setTimeout(() => {
      setMounted(true);
    }, 200);
    return () => clearTimeout(timer);
  }, [imageUrl]);

  if (offsets.length === 0) {
    return <div className="fixed inset-0 z-[100] bg-background" />;
  }

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background overflow-hidden animate-in fade-in duration-700">
      {/* Background radial gradient for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="relative w-56 h-56 md:w-72 md:h-72 mb-12">
        {finalImageUrl ? (
          <div className="grid grid-cols-4 grid-rows-4 w-full h-full gap-0.5 relative">
            {pieces.map((i) => {
              const row = Math.floor(i / gridSize);
              const col = i % gridSize;
              const offset = offsets[i];
              
              // Calculate animation delay based on the sequential circular order
              const delayIndex = sequentialOrder.indexOf(i);
              const delay = delayIndex * 60; // 60ms stagger

              return (
                <div
                  key={i}
                  className="relative overflow-hidden border-[0.5px] border-primary/5 bg-muted/10 transition-all duration-[1200ms] cubic-bezier(0.34, 1.56, 0.64, 1)"
                  style={{
                    transform: mounted 
                      ? 'translate(0, 0) rotate(0)' 
                      : `translate(${offset.x}px, ${offset.y}px) rotate(${offset.r}deg)`,
                    opacity: mounted ? 1 : 0,
                    transitionDelay: `${delay}ms`,
                    boxShadow: mounted ? 'none' : '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
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
          <div className="w-full h-full rounded-[2.5rem] bg-primary/5 flex items-center justify-center animate-pulse border-4 border-dashed border-primary/20 relative">
             <div className="absolute inset-0 flex items-center justify-center">
               <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
             </div>
             <div className="text-primary font-headline font-black text-5xl opacity-10">KP</div>
          </div>
        )}
      </div>
      
      <div className="text-center space-y-3 z-10">
        <div className="overflow-hidden">
          <h2 className={`text-2xl font-headline font-black text-primary tracking-tighter transition-all duration-1000 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
            KITCHEN PROF
          </h2>
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.5em] opacity-60">
            Initializing System
          </p>
          <div className="w-32 h-1 bg-muted rounded-full overflow-hidden">
             <div className="h-full bg-primary animate-[loading_7s_ease-in-out_infinite]" />
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes loading {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
}
