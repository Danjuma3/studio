
'use client';

import React, { useEffect, useState } from 'react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function PuzzleLoader() {
  const logo = PlaceHolderImages.find((img) => img.id === 'app-logo');
  const imageUrl = logo?.imageUrl || 'https://picsum.photos/seed/kitchen-prof-logo/512/512';
  
  const gridSize = 4; // 4x4 grid
  const pieces = Array.from({ length: gridSize * gridSize }, (_, i) => i);
  const [mounted, setMounted] = useState(false);
  const [offsets, setOffsets] = useState<{x: number, y: number, r: number}[]>([]);

  useEffect(() => {
    const initialOffsets = pieces.map(() => ({
      x: (Math.random() - 0.5) * 400,
      y: (Math.random() - 0.5) * 400,
      r: (Math.random() - 0.5) * 180,
    }));
    
    setOffsets(initialOffsets);
    
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  if (offsets.length === 0) {
    return <div className="fixed inset-0 z-[100] bg-background" />;
  }

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background animate-in fade-in duration-500">
      <div className="relative w-48 h-48 md:w-64 md:h-64 mb-8">
        <div className="grid grid-cols-4 grid-rows-4 w-full h-full gap-0.5">
          {pieces.map((i) => {
            const row = Math.floor(i / gridSize);
            const col = i % gridSize;
            const offset = offsets[i];

            return (
              <div
                key={i}
                className="relative overflow-hidden border-[0.5px] border-primary/10 transition-all duration-[1500ms] ease-out shadow-sm"
                style={{
                  transform: mounted 
                    ? 'translate(0, 0) rotate(0)' 
                    : `translate(${offset.x}px, ${offset.y}px) rotate(${offset.r}deg)`,
                  opacity: mounted ? 1 : 0,
                  transitionDelay: `${i * 40}ms`,
                }}
              >
                <div
                  className="absolute w-[400%] h-[400%]"
                  style={{
                    backgroundImage: `url(${imageUrl})`,
                    backgroundSize: '100% 100%',
                    left: `-${col * 100}%`,
                    top: `-${row * 100}%`,
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="text-center space-y-2 animate-pulse">
        <h2 className="text-xl font-headline font-black text-primary tracking-tighter">KITCHEN PROF</h2>
        <p className="text-xs text-muted-foreground font-bold uppercase tracking-[0.3em]">Initializing Kitchen...</p>
      </div>
    </div>
  );
}
