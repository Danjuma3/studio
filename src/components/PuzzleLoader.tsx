'use client';

import React, { useEffect, useState } from 'react';
import { getSafeLogoUrl } from '@/app/lib/branding';

interface PuzzleLoaderProps {
  imageUrl?: string;
}

export function PuzzleLoader({ imageUrl }: PuzzleLoaderProps) {
  const [finalImageUrl, setFinalImageUrl] = useState<string>('');
  
  const gridSize = 2; // 2x2 grid for 4 distinct segments
  const pieces = Array.from({ length: gridSize * gridSize }, (_, i) => i);
  const [mounted, setMounted] = useState(false);
  const [offsets, setOffsets] = useState<{x: number, y: number, r: number}[]>([]);

  // Sequential order for the 4 segments (Top-Left, Top-Right, Bottom-Right, Bottom-Left)
  const sequentialOrder = [0, 1, 3, 2];

  useEffect(() => {
    // Resolve logo URL
    const logo = getSafeLogoUrl(imageUrl);
    setFinalImageUrl(logo);

    // Initial shattered state: wide spread and rotated
    const initialOffsets = pieces.map(() => ({
      x: (Math.random() - 0.5) * 1000,
      y: (Math.random() - 0.5) * 1000,
      r: (Math.random() - 0.5) * 360,
    }));
    
    setOffsets(initialOffsets);
    
    // Trigger assembly sequence
    const timer = setTimeout(() => {
      setMounted(true);
    }, 500);
    return () => clearTimeout(timer);
  }, [imageUrl]);

  if (offsets.length === 0) {
    return <div className="fixed inset-0 z-[100] bg-background" />;
  }

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background overflow-hidden">
      {/* Background depth effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />
      
      {/* Enlarged Logo Container */}
      <div className="relative w-72 h-72 md:w-96 md:h-96 mb-20 shadow-2xl rounded-[2rem] overflow-hidden bg-white border border-muted/50">
        {finalImageUrl ? (
          <div className="grid grid-cols-2 grid-rows-2 w-full h-full relative">
            {pieces.map((i) => {
              const row = Math.floor(i / gridSize);
              const col = i % gridSize;
              const offset = offsets[i];
              
              // Find the piece's place in the 1-2-3-4 sequence
              const sequenceIndex = sequentialOrder.indexOf(i);
              // 1.2 seconds delay between each piece for a clear rhythmic build
              const delay = sequenceIndex * 1200; 

              return (
                <div
                  key={i}
                  className="relative overflow-hidden transition-all duration-[1800ms] cubic-bezier(0.25, 1, 0.5, 1)"
                  style={{
                    transform: mounted 
                      ? 'translate(0, 0) rotate(0) scale(1)' 
                      : `translate(${offset.x}px, ${offset.y}px) rotate(${offset.r}deg) scale(0.4)`,
                    opacity: mounted ? 1 : 0,
                    transitionDelay: `${delay}ms`,
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
                  {/* Subtle edge highlight for segments */}
                  <div className="absolute inset-0 border-[0.5px] border-black/5 pointer-events-none" />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
             <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          </div>
        )}
      </div>
      
      {/* Branding and Loader */}
      <div className="text-center space-y-8 z-10">
        <div className="space-y-1">
          <h2 className={`text-4xl font-headline font-black text-primary tracking-tighter transition-all duration-1000 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            KITCHEN PROF
          </h2>
          <p className={`text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em] transition-all duration-1000 delay-300 transform ${mounted ? 'translate-y-0 opacity-60' : 'translate-y-4 opacity-0'}`}>
            Master Your Margins
          </p>
        </div>
        
        <div className="flex flex-col items-center gap-6">
          <div className="w-64 h-1.5 bg-muted rounded-full overflow-hidden relative shadow-inner">
             <div className="absolute inset-0 bg-primary/10" />
             <div className="h-full bg-primary animate-[loading_7s_linear_infinite]" />
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
            <p className="text-[9px] text-primary font-bold uppercase tracking-[0.4em] opacity-80">
              Initializing Market Hubs
            </p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes loading {
          0% { width: 0%; transform: translateX(-100%); }
          15% { width: 10%; transform: translateX(0); }
          100% { width: 100%; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
