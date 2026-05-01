
'use client';

import React, { useEffect, useState } from 'react';
import { getSafeLogoUrl } from '@/app/lib/branding';

interface PuzzleLoaderProps {
  imageUrl?: string;
}

export function PuzzleLoader({ imageUrl }: PuzzleLoaderProps) {
  const [finalImageUrl, setFinalImageUrl] = useState<string>('');
  const [assembledCount, setAssembledCount] = useState(0);
  const [offsets, setOffsets] = useState<{ x: number; y: number; r: number }[]>([]);

  const gridSize = 2; // 2x2 grid for 4 quadrants
  const pieces = [0, 1, 3, 2]; // Spiral sequence (TL -> TR -> BR -> BL)

  useEffect(() => {
    // Resolve the branding logo
    setFinalImageUrl(getSafeLogoUrl(imageUrl));

    // Initialize shattered positions
    const initialOffsets = [0, 1, 2, 3].map(() => ({
      x: (Math.random() - 0.5) * 800,
      y: (Math.random() - 0.5) * 800,
      r: (Math.random() - 0.5) * 270,
    }));
    setOffsets(initialOffsets);

    // Sequence the assembly over 5 seconds
    const interval = setInterval(() => {
      setAssembledCount((prev) => {
        if (prev >= 4) {
          clearInterval(interval);
          return 4;
        }
        return prev + 1;
      });
    }, 1100); 

    return () => clearInterval(interval);
  }, [imageUrl]);

  if (offsets.length === 0) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background overflow-hidden select-none">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-50" />
      
      <div className="relative w-80 h-80 md:w-[450px] md:h-[450px] mb-16 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] rounded-[2.5rem] overflow-hidden bg-white/60 backdrop-blur-md border border-white/40">
        {finalImageUrl ? (
          <div className="grid grid-cols-2 grid-rows-2 w-full h-full relative p-[1px] bg-white/30">
            {[0, 1, 2, 3].map((i) => {
              const row = Math.floor(i / gridSize);
              const col = i % gridSize;
              
              const sequencePos = pieces.indexOf(i) + 1;
              const isAssembled = assembledCount >= sequencePos;
              const offset = offsets[i];

              return (
                <div
                  key={i}
                  className="relative overflow-hidden transition-all duration-[1200ms] cubic-bezier(0.34, 1.56, 0.64, 1) border-[1px] border-white/20"
                  style={{
                    transform: isAssembled 
                      ? 'translate(0, 0) rotate(0) scale(1)' 
                      : `translate(${offset.x}px, ${offset.y}px) rotate(${offset.r}deg) scale(0.6)`,
                    opacity: isAssembled ? 1 : 0.15,
                    filter: isAssembled ? 'grayscale(0)' : 'grayscale(1) blur(2px)',
                    zIndex: isAssembled ? 10 : 1,
                  }}
                >
                  <div
                    className="absolute w-[200%] h-[200%]"
                    style={{
                      backgroundImage: `url(${finalImageUrl})`,
                      backgroundSize: '100% 100%',
                      left: `-${col * 100}%`,
                      top: `-${row * 100}%`,
                    }}
                  />
                  <div className="absolute inset-0 bg-white/5 border-[0.5px] border-white/10 shadow-[inset_0_0_4px_rgba(255,255,255,0.4)]" />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted/10">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          </div>
        )}
      </div>
      
      <div className="text-center space-y-6">
        <div className="space-y-1">
          <h2 className="text-5xl font-headline font-black text-primary tracking-tighter animate-in fade-in slide-in-from-bottom-4 duration-1000">
            KITCHEN PROFIT
          </h2>
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.5em] opacity-40">
            Managing margins for food business
          </p>
        </div>
        
        <div className="flex flex-col items-center gap-4">
          <div className="w-64 h-1 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-1000 ease-out"
              style={{ width: `${(assembledCount / 4) * 100}%` }}
            />
          </div>
          <div className="flex items-center gap-3">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <p className="text-[9px] text-primary font-black uppercase tracking-[0.3em] opacity-70">
              {assembledCount < 4 ? `Synchronizing Intelligence` : 'Platform Ready'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
