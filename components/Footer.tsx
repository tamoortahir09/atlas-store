'use client';
import { ArrowUp } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Youtube } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolling, setIsScrolling] = useState(false);

  const scrollToTop = () => {
    setIsScrolling(true);
    
    const startPosition = window.scrollY;
    const duration = 300;
    const startTime = performance.now();
    
    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      
      const newPosition = startPosition * (1 - easeOutQuart);
      window.scrollTo(0, newPosition);
      
      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      } else {
        setIsScrolling(false);
      }
    };
    
    requestAnimationFrame(animateScroll);
  };

  return (
    <footer className="text-gray-300 relative z-50 bg-black">
      <div className="container mx-auto py-12 px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          
          {/* Navigation - Left Side */}
          <div className="lg:justify-self-start">            

            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex flex-col gap-3">
                <h3 className="text-lg font-semibold mb-4 text-white">Atlas</h3>
                <button 
                    onClick={() => router.push('/terms')}
                    className="text-gray-300 hover:text-red-400 transition-colors text-left"
                  >
                    Terms of Service
                  </button>
                  <button 
                    onClick={() => router.push('/privacy')}
                    className="text-gray-300 hover:text-red-400 transition-colors text-left"
                  >
                    Privacy Policy
                  </button>
                </div>
                <div className="flex flex-col gap-3">
                <h3 className="text-lg font-semibold mb-4 text-white">PayNow</h3>
                  <button 
                    onClick={() => window.open('https://paynow.gg/terms-of-service', '_blank')}
                    className="text-gray-300 hover:text-red-400 transition-colors text-left"
                  >
                    Terms of Service
                  </button>
                  <button 
                    onClick={() => window.open('https://paynow.gg/user-agreement', '_blank')}
                    className="text-gray-300 hover:text-red-400 transition-colors text-left"
                  >
                    User Agreement
                  </button>
                  <button 
                    onClick={() => window.open('https://paynow.gg/privacy-policy', '_blank')}
                    className="text-gray-300 hover:text-red-400 transition-colors text-left"
                  >
                    Privacy Policy
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Logo - Center */}
          <div className="lg:justify-self-center">
            <div className="flex flex-col items-center gap-4">
              <img 
                src="/logo/svg/Atlas-Full.svg" 
                alt="Atlas" 
                className="h-12 brightness-0 invert cursor-pointer" 
                onClick={() => router.push('/')}
              />
            </div>
          </div>

          {/* Social Links - Right Side */}
          <div className="lg:justify-self-end">
            <h3 className="text-lg font-semibold mb-4 text-white">Socials</h3>
            <div className="grid grid-cols-2 gap-4 max-w-xs">
              <a 
                href="https://www.youtube.com/@AtlasRustOfficial" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors group"
              >
                <div className="p-2 bg-gray-800 rounded-lg group-hover:bg-gray-700 transition-colors">
                  <Youtube className="w-5 h-5 text-red-600" />
                </div>
                <span>Youtube</span>
              </a>
              
              <a 
                href="https://discord.gg/atlasrust" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors group"
              >
                <div className="p-2 bg-gray-800 rounded-lg group-hover:bg-gray-700 transition-colors">
                    <img src="/Socials/discord.svg" alt="Discord" className="h-5 w-5" />
                </div>
                <span>Discord</span>
              </a>
              
              <a 
                href="https://x.com/RustAtlas" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors group"
              >
                <div className="p-2 bg-gray-800 rounded-lg group-hover:bg-gray-700 transition-colors">
                  <img src="/Socials/x.svg" alt="Twitter" className="h-5 w-5 brightness-0 invert" />
                </div>
                <span>Twitter</span>
              </a>
              
              <a 
                href="https://www.tiktok.com/@atlasrustservers" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors group"
              >
                <div className="p-2 bg-gray-800 rounded-lg group-hover:bg-gray-700 transition-colors">
                  <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-.88-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.10z"/>
                  </svg>
                </div>
                <span>Tiktok</span>
              </a>
            </div>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div className="text-sm text-gray-400 text-left">
              <p>&copy; 2025 Atlas Store. All rights reserved.</p>
            </div>
            <div className="text-sm text-gray-400 text-center">
              <p>Providing the best premium rust servers since 2021</p>
            </div>
            
            {/* Return to Top Button */}
            <div className="flex justify-end">
              <button
                onClick={scrollToTop}
                disabled={isScrolling}
                className="group relative flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-800 to-gray-700 hover:from-red-600 hover:to-red-500 text-gray-300 hover:text-white rounded-xl shadow-lg hover:shadow-red-500/25 transition-all duration-300 ease-out transform hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden"
              >
                {/* Animated background shimmer */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out"></div>
                
                {/* Arrow with animation */}
                <ArrowUp 
                  className={`h-4 w-4 transition-all duration-300 ${
                    isScrolling 
                      ? 'animate-bounce' 
                      : 'group-hover:-translate-y-1 group-hover:scale-110'
                  }`} 
                />
                
                {/* Text */}
                <span className="relative text-sm font-medium">
                  {isScrolling ? 'Scrolling...' : 'Back to Top'}
                </span>
                
                {/* Subtle glow effect */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-500/0 via-red-500/20 to-red-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}