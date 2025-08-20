'use client';

import { useState, useEffect } from 'react';

export default function GlitchOverlay() {
  const [isGlitching, setIsGlitching] = useState(false);
  const [glitchType, setGlitchType] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Random glitch bursts
    const glitchInterval = setInterval(() => {
      if (Math.random() < 0.3) { // 30% chance every interval
        setIsGlitching(true);
        setGlitchType(Math.floor(Math.random() * 3)); // 3 different glitch types
        
        setTimeout(() => {
          setIsGlitching(false);
        }, 200 + Math.random() * 300); // 200-500ms duration
      }
    }, 3000 + Math.random() * 4000); // Every 3-7 seconds

    return () => clearInterval(glitchInterval);
  }, [mounted]);

  if (!mounted) {
    return (
      <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden">
        {/* Constant Subtle Effects Only */}
        
        {/* Vertical RGB Shift Lines */}
        <div className="absolute inset-0 opacity-5">
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: `
                repeating-linear-gradient(
                  90deg,
                  transparent 0px,
                  transparent 2px,
                  #ff000010 2px,
                  #ff000010 3px,
                  transparent 3px,
                  transparent 6px,
                  #00ff0010 6px,
                  #00ff0010 7px,
                  transparent 7px,
                  transparent 10px
                )
              `
            }}
          />
        </div>

        {/* Static Noise */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-screen glitch-static" />

        {/* Occasional Scan Line */}
        <div className="absolute inset-0">
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent glitch-scan-line" />
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden">
      {/* RGB Separation Glitch */}
      <div 
        className={`absolute inset-0 opacity-0 mix-blend-screen transition-opacity duration-100 ${
          isGlitching && glitchType === 0 ? 'opacity-30 glitch-rgb' : ''
        }`}
        style={{
          background: `
            linear-gradient(90deg, 
              #ff000020 0%, transparent 2%, transparent 98%, #00ff0020 100%),
            linear-gradient(0deg, 
              transparent 0%, #0000ff15 50%, transparent 100%)
          `
        }}
      />

      {/* Horizontal Scan Lines */}
      <div 
        className={`absolute inset-0 opacity-0 transition-opacity duration-100 ${
          isGlitching && glitchType === 1 ? 'opacity-80 glitch-lines' : ''
        }`}
      >
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-full bg-white/10 glitch-line"
            style={{
              height: '2px',
              top: `${10 + i * 12}%`,
              animationDelay: `${i * 0.1}s`,
              mixBlendMode: 'screen'
            }}
          />
        ))}
      </div>

      {/* Digital Noise Blocks */}
      <div 
        className={`absolute inset-0 opacity-0 transition-opacity duration-100 ${
          isGlitching && glitchType === 2 ? 'opacity-40 glitch-noise' : ''
        }`}
      >
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-red-500/20 glitch-block"
            style={{
              width: `${5 + Math.random() * 15}%`,
              height: `${2 + Math.random() * 8}%`,
              left: `${Math.random() * 90}%`,
              top: `${Math.random() * 90}%`,
              animationDelay: `${i * 0.05}s`,
              mixBlendMode: 'multiply'
            }}
          />
        ))}
      </div>

      {/* Constant Subtle Effects */}
      
      {/* Vertical RGB Shift Lines */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                90deg,
                transparent 0px,
                transparent 2px,
                #ff000010 2px,
                #ff000010 3px,
                transparent 3px,
                transparent 6px,
                #00ff0010 6px,
                #00ff0010 7px,
                transparent 7px,
                transparent 10px
              )
            `
          }}
        />
      </div>

      {/* Static Noise */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-screen glitch-static" />

      {/* Occasional Scan Line */}
      <div className="absolute inset-0">
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent glitch-scan-line" />
      </div>
    </div>
  );
}