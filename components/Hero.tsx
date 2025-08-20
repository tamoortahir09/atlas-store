'use client';

import { useState, useEffect, useRef } from 'react';

// Extend Window interface to include YouTube API
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export default function Hero() {
  const [isLoaded, setIsLoaded] = useState(false);
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load YouTube API
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    // Initialize player when API is ready
    window.onYouTubeIframeAPIReady = () => {
      if (containerRef.current) {
        playerRef.current = new window.YT.Player(containerRef.current, {
          videoId: 'QoAlbWR5ExY',
          playerVars: {
            autoplay: 1,
            mute: 1,
            controls: 0,
            showinfo: 0,
            rel: 0,
            iv_load_policy: 3,
            modestbranding: 1,
            start: 0,
            disablekb: 1,
            fs: 0,
            playsinline: 1
          },
          events: {
            onReady: (event: any) => {
              event.target.mute();
              event.target.playVideo();
              
              // Set up interval to check current time and loop at 40 seconds
              setInterval(() => {
                if (event.target.getCurrentTime && event.target.getCurrentTime() >= 40) {
                  event.target.seekTo(0, true);
                }
              }, 100); // Check every 100ms for smooth looping
            },
            onStateChange: (event: any) => {
              // Ensure video keeps playing
              if (event.data === window.YT.PlayerState.ENDED) {
                event.target.seekTo(0, true);
                event.target.playVideo();
              }
            }
          }
        });
      }
    };

    // Trigger glitch effect after component mounts
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => {
      clearTimeout(timer);
      if (playerRef.current && playerRef.current.destroy) {
        playerRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* YouTube Video Background */}
      <div className="absolute inset-0 w-full h-full">
        <div
          ref={containerRef}
          className="w-full h-full"
          style={{
            width: '100vw',
            height: '100vh',
            transform: 'scale(1.3)', // Scale up to hide borders
            transformOrigin: 'center center'
          }}
        />
      </div>

      {/* Dark overlay to ensure text readability */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Enhanced Grid overlay for tech aesthetic */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full grid-overlay"></div>
      </div>

      {/* Vignette overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/20 to-black/60"></div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none"></div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="particle particle-1"></div>
        <div className="particle particle-2"></div>
        <div className="particle particle-3"></div>
        <div className="particle particle-4"></div>
        <div className="particle particle-5"></div>
        <div className="particle particle-6"></div>
        <div className="particle particle-7"></div>
        <div className="particle particle-8"></div>
      </div>

      {/* Dynamic Light Beams */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="light-beam light-beam-1"></div>
        <div className="light-beam light-beam-2"></div>
        <div className="light-beam light-beam-3"></div>
      </div>

      {/* Animated Geometric Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="geometric-shape shape-1"></div>
        <div className="geometric-shape shape-2"></div>
        <div className="geometric-shape shape-3"></div>
      </div>

      {/* Overlaid Content - Front Layer */}
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <div className={`text-center px-6 max-w-4xl w-full transition-all duration-500 content-entrance ${
          isLoaded ? 'glitch-text-loaded' : 'glitch-text-initial'
        }`}>
        {/* Atlas Logo */}
        <div className="mb-6 hero-logo-container">
          <img 
            src="/logo/png/logo.png" 
            alt="Atlas Logo" 
            className="mx-auto hero-logo-animate"
            style={{
              height: 'clamp(60px, 8vw, 120px)',
              width: 'auto',
              filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.8))'
            }}
          />
        </div>

        {/* Subtitle Text */}
        <div className="mb-12 relative flex justify-center hero-subtitle-container">
          <div className="subtitle-width-container">
            <h2 
              className="text-white/80 uppercase text-center font-light hero-subtitle-animate"
              style={{ 
                fontSize: 'clamp(12px, 1.5vw, 18px)',
                textShadow: '0 2px 10px rgba(0,0,0,0.8)',
                letterSpacing: 'clamp(2px, 0.5vw, 6px)',
                lineHeight: '1.2',
                whiteSpace: 'nowrap'
              }}
            >
              <span className="word-1 hero-word-animate">The</span>
              <span className="word-2 text-red hero-word-animate">leaders</span>
              <span className="word-3 hero-word-animate">of</span>
              <span className="word-4 hero-word-animate">the</span>
              <span className="word-5 hero-word-animate">modded</span>
              <span className="word-6 hero-word-animate">scene</span>
            </h2>
          </div>
        </div>

        {/* Enhanced CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 hero-buttons-container">
          {/* Primary Button */}
          <button className="group relative overflow-hidden bg-gradient-to-r from-[#E60000] to-[#cc0000] hover:from-[#cc0000] hover:to-[#b30000] text-white px-10 py-4 rounded-lg transition-all duration-300 min-w-[220px] shadow-2xl hover:shadow-[#E60000]/40 transform hover:scale-105 hover:-translate-y-1 hero-button-animate hero-button-1">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Shimmer effect */}
            <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-all duration-700 transform -translate-x-full group-hover:translate-x-full"></div>
            
            {/* Button content */}
            <span className="relative flex items-center justify-center gap-3 font-bold uppercase tracking-wider text-sm">
              <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              EXPLORE SERVERS
            </span>
            
            {/* Glowing border */}
            <div className="absolute inset-0 rounded-lg border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
          
          {/* Secondary Button */}
          <button className="group relative overflow-hidden bg-white/5 hover:bg-white/10 backdrop-blur-lg text-white border border-white/20 hover:border-white/40 px-10 py-4 rounded-lg transition-all duration-300 min-w-[220px] shadow-xl hover:shadow-2xl hero-button-animate hero-button-2">
            {/* Glass effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent opacity-40 group-hover:opacity-70 transition-opacity duration-300 rounded-lg"></div>
            
            {/* Inner glow */}
            <div className="absolute inset-0 rounded-lg shadow-inner opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ boxShadow: 'inset 0 1px 3px rgba(255,255,255,0.1)' }}></div>
            
            {/* Red shine glare effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 transform -skew-x-12 -translate-x-full group-hover:translate-x-full red-shine"></div>
            
            {/* Button content */}
            <span className="relative flex items-center justify-center gap-3 font-semibold uppercase tracking-wider text-sm">
              <svg className="w-5 h-5 transform group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Browse Store
            </span>
          </button>
        </div>
      </div>

            {/* Server Status Indicator */}
      <div className="absolute bottom-8 right-8 z-30 hero-status-container">
        <div className="relative bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2 rounded-lg shadow-2xl">
          {/* Glass effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent rounded-lg"></div>
          <div className="absolute inset-0 bg-gradient-to-tl from-white/5 via-transparent to-white/10 rounded-lg"></div>
          
          <div className="relative flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
            <span 
              className="text-white font-medium"
              style={{ 
                fontSize: '14px',
                textShadow: '0 1px 2px rgba(0,0,0,0.5)'
              }}
            >
              342 Online
            </span>
          </div>
        </div>
      </div>

      {/* Ping Indicators - Bottom Left */}
      <div className="absolute bottom-8 left-8 z-30 hero-ping-container">
        <div className="relative bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2 rounded-lg shadow-2xl">
          {/* Glass effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent rounded-lg"></div>
          <div className="absolute inset-0 bg-gradient-to-tl from-white/5 via-transparent to-white/10 rounded-lg"></div>
          
          <div className="relative flex items-center gap-6">
            {/* Australia */}
            <div className="flex items-center gap-2">
              <div className="w-4 h-3 rounded-sm overflow-hidden flex shadow-md">
                <div className="w-1/3 bg-blue-500"></div>
                <div className="w-1/3 bg-white"></div>
                <div className="w-1/3 bg-red-500"></div>
              </div>
              <span className="text-white text-xs font-medium" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>AU</span>
              <span className="text-green-400 text-xs font-mono font-semibold" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>42ms</span>
            </div>
            
            {/* Europe */}
            <div className="flex items-center gap-2">
              <div className="w-4 h-3 rounded-sm overflow-hidden flex shadow-md">
                <div className="w-1/3 bg-blue-600"></div>
                <div className="w-1/3 bg-white"></div>
                <div className="w-1/3 bg-blue-600"></div>
              </div>
              <span className="text-white text-xs font-medium" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>EU</span>
              <span className="text-yellow-400 text-xs font-mono font-semibold" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>156ms</span>
            </div>
            
            {/* America */}
            <div className="flex items-center gap-2">
              <div className="w-4 h-3 rounded-sm overflow-hidden flex shadow-md">
                <div className="w-1/3 bg-red-600"></div>
                <div className="w-1/3 bg-white"></div>
                <div className="w-1/3 bg-blue-600"></div>
              </div>
              <span className="text-white text-xs font-medium" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>US</span>
              <span className="text-red-400 text-xs font-mono font-semibold" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>298ms</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Down Indicator - Centered with full page width */}
      <div className="absolute bottom-4 z-30 flex flex-col items-center opacity-40 hover:opacity-70 transition-opacity duration-300" style={{ left: '50vw', transform: 'translateX(-50%)' }}>
        <div className="w-6 h-8 border border-white/20 rounded-full flex justify-center items-start pt-1.5 relative overflow-hidden">
          <div className="w-0.5 h-2 bg-white/30 rounded-full animate-scroll-down"></div>
        </div>
        <span className="text-white/40 text-xs mt-2 uppercase tracking-wider text-center whitespace-nowrap">Scroll Down</span>
      </div>

      
      <style jsx>{`
        @keyframes scroll-down {
          0% {
            transform: translateY(0);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateY(8px);
            opacity: 0;
          }
        }
        .animate-scroll-down {
          animation: scroll-down 2s ease-in-out infinite;
        }

        /* Red Shine Effect */
        .red-shine {
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(230, 0, 0, 0.1) 25%,
            rgba(230, 0, 0, 0.4) 50%,
            rgba(230, 0, 0, 0.1) 75%,
            transparent 100%
          );
          animation: red-glare 4s ease-in-out infinite;
          animation-delay: 1s;
        }

        @keyframes red-glare {
          0% {
            transform: skewX(-12deg) translateX(-150%);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          40% {
            opacity: 1;
          }
          60% {
            transform: skewX(-12deg) translateX(150%);
            opacity: 0;
          }
          100% {
            transform: skewX(-12deg) translateX(150%);
            opacity: 0;
          }
        }

        /* Floating Particles */
        .particle {
          position: absolute;
          background: radial-gradient(circle, rgba(230, 0, 0, 0.8) 0%, rgba(230, 0, 0, 0.3) 50%, transparent 100%);
          border-radius: 50%;
          animation: float 15s infinite linear;
        }
        
        .particle-1 { width: 4px; height: 4px; left: 10%; animation-delay: 0s; animation-duration: 20s; }
        .particle-2 { width: 6px; height: 6px; left: 20%; animation-delay: -5s; animation-duration: 25s; }
        .particle-3 { width: 3px; height: 3px; left: 30%; animation-delay: -10s; animation-duration: 18s; }
        .particle-4 { width: 5px; height: 5px; left: 50%; animation-delay: -15s; animation-duration: 22s; }
        .particle-5 { width: 4px; height: 4px; left: 70%; animation-delay: -8s; animation-duration: 19s; }
        .particle-6 { width: 7px; height: 7px; left: 80%; animation-delay: -12s; animation-duration: 24s; }
        .particle-7 { width: 3px; height: 3px; left: 90%; animation-delay: -3s; animation-duration: 21s; }
        .particle-8 { width: 5px; height: 5px; left: 60%; animation-delay: -18s; animation-duration: 17s; }

        @keyframes float {
          0% {
            transform: translateY(100vh) translateX(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) translateX(20px) rotate(360deg);
            opacity: 0;
          }
        }

        /* Dynamic Light Beams */
        .light-beam {
          position: absolute;
          background: linear-gradient(45deg, transparent, rgba(230, 0, 0, 0.1), rgba(255, 255, 255, 0.05), transparent);
          transform-origin: center;
          animation: beam-sweep 8s ease-in-out infinite;
        }
        
        .light-beam-1 {
          width: 2px;
          height: 100vh;
          left: 20%;
          animation-delay: 0s;
        }
        
        .light-beam-2 {
          width: 1px;
          height: 100vh;
          left: 60%;
          animation-delay: -3s;
        }
        
        .light-beam-3 {
          width: 3px;
          height: 100vh;
          left: 80%;
          animation-delay: -6s;
        }

        @keyframes beam-sweep {
          0%, 100% {
            opacity: 0;
            transform: translateX(-50px) rotate(-5deg);
          }
          50% {
            opacity: 0.6;
            transform: translateX(50px) rotate(5deg);
          }
        }

        /* Geometric Shapes */
        .geometric-shape {
          position: absolute;
          border: 1px solid rgba(230, 0, 0, 0.3);
          animation: geometric-float 12s ease-in-out infinite;
        }
        
        .shape-1 {
          width: 60px;
          height: 60px;
          top: 20%;
          left: 15%;
          transform: rotate(45deg);
          animation-delay: 0s;
        }
        
        .shape-2 {
          width: 40px;
          height: 40px;
          top: 60%;
          right: 20%;
          border-radius: 50%;
          animation-delay: -4s;
        }
        
        .shape-3 {
          width: 80px;
          height: 80px;
          bottom: 30%;
          left: 70%;
          clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
          background: rgba(230, 0, 0, 0.1);
          border: none;
          animation-delay: -8s;
        }

        @keyframes geometric-float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.3;
          }
          33% {
            transform: translateY(-20px) rotate(120deg);
            opacity: 0.6;
          }
          66% {
            transform: translateY(10px) rotate(240deg);
            opacity: 0.4;
          }
        }

        /* Enhanced Grid with Pulse Effect */
        .grid-overlay {
          background-image: 
            linear-gradient(rgba(230, 0, 0, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(230, 0, 0, 0.05) 1px, transparent 1px),
            linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
          background-size: 100px 100px, 100px 100px, 20px 20px, 20px 20px;
          animation: grid-pulse 4s ease-in-out infinite;
        }

        @keyframes grid-pulse {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.6;
          }
        }

        /* Content Entrance Animation */
        .content-entrance {
          animation: content-fade-in 1.5s ease-out forwards;
        }

        @keyframes content-fade-in {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Hero Page Load Animations */
        .hero-logo-container {
          opacity: 0;
          transform: translateY(60px) scale(0.7);
          animation: hero-logo-entrance 1.2s ease-out 0.3s forwards;
        }

        .hero-subtitle-container {
          opacity: 0;
          transform: translateY(40px);
          animation: hero-subtitle-entrance 1s ease-out 1.2s forwards;
        }

        .hero-buttons-container {
          opacity: 0;
          transform: translateY(30px);
          animation: hero-buttons-entrance 0.8s ease-out 2s forwards;
        }

        /* Individual word animations */
        .hero-word-animate {
          opacity: 0;
          transform: translateY(20px);
          display: inline-block;
          margin-right: 0.2em;
          transition: all 0.3s ease;
        }

        .word-1 { animation: word-appear 0.4s ease-out 1.8s forwards; }
        .word-2 { animation: word-appear 0.4s ease-out 2.0s forwards; }
        .word-3 { animation: word-appear 0.4s ease-out 2.2s forwards; }
        .word-4 { animation: word-appear 0.4s ease-out 2.4s forwards; }
        .word-5 { animation: word-appear 0.4s ease-out 2.6s forwards; }
        .word-6 { animation: word-appear 0.4s ease-out 2.8s forwards; }

        /* Individual button animations */
        .hero-button-animate {
          opacity: 0;
          transform: translateY(25px) scale(0.95);
        }

        .hero-button-1 {
          animation: button-entrance 0.6s ease-out 3.2s forwards;
        }

        .hero-button-2 {
          animation: button-entrance 0.6s ease-out 3.5s forwards;
        }

        /* Status and Scroll Indicators */
        .hero-status-container {
          opacity: 0;
          transform: translateX(30px);
          animation: status-entrance 0.6s ease-out 4s forwards;
        }

        .hero-scroll-container {
          opacity: 0;
          transform: translateY(20px);
          animation: scroll-entrance 0.6s ease-out 4.2s forwards;
        }

        .hero-ping-container {
          opacity: 0;
          transform: translateX(-30px);
          animation: ping-entrance 0.6s ease-out 3.8s forwards;
        }

        /* Keyframe Animations */
        @keyframes hero-logo-entrance {
          0% {
            opacity: 0;
            transform: translateY(60px) scale(0.7);
            filter: drop-shadow(0 4px 20px rgba(0,0,0,0.8));
          }
          60% {
            opacity: 0.8;
            transform: translateY(10px) scale(0.95);
            filter: drop-shadow(0 4px 20px rgba(0,0,0,0.8));
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: drop-shadow(0 4px 20px rgba(0,0,0,0.8));
          }
        }

        @keyframes hero-subtitle-entrance {
          0% {
            opacity: 0;
            transform: translateY(40px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes hero-buttons-entrance {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes word-appear {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes button-entrance {
          0% {
            opacity: 0;
            transform: translateY(25px) scale(0.95);
          }
          70% {
            transform: translateY(-5px) scale(1.02);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes status-entrance {
          0% {
            opacity: 0;
            transform: translateX(30px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes scroll-entrance {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 0.4;
            transform: translateY(0);
          }
        }

        @keyframes ping-entrance {
          0% {
            opacity: 0;
            transform: translateX(-30px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        /* Subtitle Container Pulse */
        .subtitle-container {
          animation: subtitle-pulse 3s ease-in-out infinite;
        }

        @keyframes subtitle-pulse {
          0%, 100% {
            box-shadow: 0 0 20px rgba(230, 0, 0, 0.1);
          }
          50% {
            box-shadow: 0 0 40px rgba(230, 0, 0, 0.3), 0 0 60px rgba(230, 0, 0, 0.1);
          }
        }

        /* Scanning Line Effect */
        .scanning-line {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(230, 0, 0, 0.8), rgba(255, 255, 255, 0.6), rgba(230, 0, 0, 0.8), transparent);
          animation: scan-line 4s ease-in-out infinite;
        }

        @keyframes scan-line {
          0% {
            left: -100%;
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            left: 100%;
            opacity: 0;
          }
        }

        /* Typewriter Text Animation */
        .typewriter-text span {
          opacity: 0;
          animation: typewriter-appear 0.5s ease-out forwards;
        }

        .word-1 { animation-delay: 0.5s; }
        .word-2 { animation-delay: 0.8s; }
        .word-3 { animation-delay: 1.1s; }
        .word-4 { animation-delay: 1.4s; }
        .word-5 { animation-delay: 1.7s; }
        .word-6 { animation-delay: 2.0s; }

        @keyframes typewriter-appear {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Text Glitch Effect */
        .text-glitch {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: rgba(230, 0, 0, 0.7);
          opacity: 0;
          animation: glitch-flicker 6s ease-in-out infinite;
          font-weight: 500;
          text-transform: uppercase;
          pointer-events: none;
        }

        @keyframes glitch-flicker {
          0%, 94%, 100% {
            opacity: 0;
            transform: translate(-50%, -50%) skew(0deg);
          }
          95% {
            opacity: 0.8;
            transform: translate(-48%, -50%) skew(2deg);
          }
          96% {
            opacity: 0.6;
            transform: translate(-52%, -50%) skew(-1deg);
          }
          97% {
            opacity: 0.9;
            transform: translate(-50%, -48%) skew(1deg);
          }
          98% {
            opacity: 0.7;
            transform: translate(-50%, -52%) skew(-2deg);
          }
          99% {
            opacity: 0.8;
            transform: translate(-50%, -50%) skew(0deg);
          }
        }

        /* Subtitle Width Container */
        .subtitle-width-container {
          width: auto;
          min-width: clamp(280px, 40vw, 500px);
          display: flex;
          justify-content: center;
          align-items: center;
          white-space: nowrap;
        }

        /* Red Text Styling */
        .text-red {
          color: #E60000 !important;
          text-shadow: 0 2px 10px rgba(0,0,0,0.8), 0 0 15px rgba(230, 0, 0, 0.4) !important;
        }

        /* Enhanced Word Hover Effects */
        .typewriter-text span {
          display: inline-block;
          margin-right: 0.2em;
          transition: all 0.3s ease;
          cursor: default;
        }

        .typewriter-text span:hover {
          color: #E60000;
          transform: translateY(-2px);
          text-shadow: 0 4px 15px rgba(230, 0, 0, 0.6);
        }

        /* Override hover effect for red text */
        .typewriter-text span.text-red:hover {
          color: #ff1a1a;
          text-shadow: 0 4px 15px rgba(230, 0, 0, 0.8), 0 0 20px rgba(230, 0, 0, 0.6);
        }

        /* Breathing Animation for Container */
        .subtitle-container:hover {
          animation: breathing 2s ease-in-out infinite;
        }

        @keyframes breathing {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.02);
          }
        }
      `}</style>
      </div>
    </div>
  );
}