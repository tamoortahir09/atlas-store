"use client";

import { ArrowRight, Zap, ShoppingBag, Crown, Star, TrendingUp, Gift, Shield, Target, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function StoreSection() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  const handleShopNow = () => {
    router.push('/store');
  };

  const handleViewPackages = () => {
    router.push('/store');
  };

  // Scroll animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('power-your-game');
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  return (
    <section id="power-your-game" className="min-h-screen bg-black relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        {/* Video background */}
        <video
          src="/Media/videoplayback (1).mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        
        {/* Atlas-branded color overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-[#E60000]/10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[#E60000]/5 to-transparent"></div>
        
        {/* Animated grid pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(230, 0, 0, 0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(230, 0, 0, 0.5) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}></div>
        </div>

        {/* Floating particles */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-[#E60000]/30 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-32 w-1 h-1 bg-[#E60000]/50 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-40 left-40 w-3 h-3 bg-[#E60000]/20 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-8 py-20 flex items-center min-h-screen">
        <div className="grid lg:grid-cols-2 gap-16 items-center w-full">
          
          {/* Left Content Section */}
          <div className={`space-y-8 transition-all duration-1000 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}>
            
            {/* Section Header */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-1 h-12 bg-[#E60000]"></div>
                <div>
                  <p className="text-[#E60000] text-sm uppercase tracking-[0.3em] font-medium">
                    ATLAS STORE
                  </p>
                  <h2 className="text-white text-5xl lg:text-6xl font-black uppercase tracking-wider leading-none">
                    Power Your<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E60000] to-[#ff4444]">
                      Game
                    </span>
                  </h2>
                </div>
              </div>
              
              <p className="text-[#CCCCCC] text-xl leading-relaxed max-w-xl">
                Skip the grind and dominate from day one. Get exclusive gear, 
                priority access, and game-changing advantages that put you ahead 
                of the competition.
              </p>
            </div>

            {/* Benefits Grid */}
            <div className={`grid grid-cols-2 gap-6 transition-all duration-1000 ease-out ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`} style={{ transitionDelay: '200ms' }}>
              
              <div className="bg-black/60 border border-[#E60000]/20 p-6 rounded-xl backdrop-blur-sm hover:border-[#E60000]/40 transition-all duration-300 group">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-[#E60000]/20 rounded-lg flex items-center justify-center group-hover:bg-[#E60000]/30 transition-colors">
                    <Crown className="w-5 h-5 text-[#E60000]" />
                  </div>
                  <h3 className="text-white font-bold text-lg">VIP Access</h3>
                </div>
                <p className="text-[#CCCCCC] text-sm">
                  Skip queues and get priority server access during high traffic times
                </p>
              </div>

              <div className="bg-black/60 border border-[#E60000]/20 p-6 rounded-xl backdrop-blur-sm hover:border-[#E60000]/40 transition-all duration-300 group">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-[#E60000]/20 rounded-lg flex items-center justify-center group-hover:bg-[#E60000]/30 transition-colors">
                    <Shield className="w-5 h-5 text-[#E60000]" />
                  </div>
                  <h3 className="text-white font-bold text-lg">Premium Kits</h3>
                </div>
                                 <p className="text-[#CCCCCC] text-sm">
                   Start each wipe with exclusive gear and supplies others can&apos;t get
                 </p>
              </div>

              <div className="bg-black/60 border border-[#E60000]/20 p-6 rounded-xl backdrop-blur-sm hover:border-[#E60000]/40 transition-all duration-300 group">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-[#E60000]/20 rounded-lg flex items-center justify-center group-hover:bg-[#E60000]/30 transition-colors">
                    <Sparkles className="w-5 h-5 text-[#E60000]" />
                  </div>
                  <h3 className="text-white font-bold text-lg">Cosmetics</h3>
                </div>
                <p className="text-[#CCCCCC] text-sm">
                  Unique skins and items that show your status and dedication
                </p>
              </div>

              <div className="bg-black/60 border border-[#E60000]/20 p-6 rounded-xl backdrop-blur-sm hover:border-[#E60000]/40 transition-all duration-300 group">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-[#E60000]/20 rounded-lg flex items-center justify-center group-hover:bg-[#E60000]/30 transition-colors">
                    <TrendingUp className="w-5 h-5 text-[#E60000]" />
                  </div>
                  <h3 className="text-white font-bold text-lg">Boost XP</h3>
                </div>
                <p className="text-[#CCCCCC] text-sm">
                  Level up faster with permanent XP multipliers and bonuses
                </p>
              </div>
            </div>

            {/* CTA Section */}
            <div className={`bg-gradient-to-r from-black/80 to-black/60 border border-[#E60000]/30 p-6 rounded-xl backdrop-blur-sm transition-all duration-1000 ease-out ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`} style={{ transitionDelay: '400ms' }}>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#E60000] flex items-center justify-center rounded-lg">
                  <ShoppingBag size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-xl uppercase tracking-wider">
                    Start Dominating Today
                  </h3>
                  <p className="text-[#CCCCCC] text-sm">
                                         Join thousands of players who&apos;ve powered up their game
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  className="bg-[#E60000] hover:bg-[#cc0000] text-white px-8 py-4 rounded-lg transition-all duration-300 font-bold uppercase tracking-wider flex items-center justify-center gap-3 shadow-xl hover:shadow-[#E60000]/30 hover:scale-105 group relative overflow-hidden"
                  onClick={handleShopNow}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                  <ShoppingBag size={18} />
                  Shop Now
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button 
                  className="bg-transparent hover:bg-[#E60000]/10 text-[#CCCCCC] hover:text-white border border-[#E60000]/40 hover:border-[#E60000] px-8 py-4 rounded-lg transition-all duration-300 font-bold uppercase tracking-wider hover:scale-105"
                  onClick={handleViewPackages}
                >
                  View All Packages
                </button>
              </div>

              {/* Trust indicators */}
              <div className="flex items-center justify-center gap-8 mt-4 pt-4 border-t border-[#E60000]/20">
                <div className="flex items-center gap-2 text-[#CCCCCC]/70 text-sm">
                  <div className="w-2 h-2 bg-[#E60000] rounded-full animate-pulse"></div>
                  <span>Instant Delivery</span>
                </div>
                <div className="flex items-center gap-2 text-[#CCCCCC]/70 text-sm">
                  <div className="w-2 h-2 bg-[#E60000] rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                  <span>Secure Payments</span>
                </div>
                <div className="flex items-center gap-2 text-[#CCCCCC]/70 text-sm">
                  <div className="w-2 h-2 bg-[#E60000] rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Visual Section */}
          <div className={`relative flex justify-center lg:justify-end transition-all duration-1000 ease-out ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
          }`} style={{ transitionDelay: '600ms' }}>
            
            {/* Main Player Model */}
            <div className="relative">
              <div className="w-80 h-96 bg-black/60 border border-[#E60000]/20 rounded-xl flex items-center justify-center relative overflow-hidden backdrop-blur-sm">
                
                {/* Video Player */}
                <div className="w-full h-full relative">
                  <video
                    src="/3D-assets/MainLoop.webm"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover object-center rounded-xl"
                  />

                  {/* Dark overlay for contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-xl"></div>

                  {/* Equipment highlights */}
                  <div className="absolute top-16 right-6 w-4 h-8 bg-[#E60000]/80 rounded shadow-lg animate-pulse"></div>
                  <div className="absolute bottom-24 left-6 w-5 h-5 bg-[#E60000]/80 rounded shadow-lg animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                  <div className="absolute top-32 left-8 w-3 h-6 bg-[#E60000]/60 rounded shadow-lg animate-pulse" style={{ animationDelay: '1s' }}></div>

                  {/* VIP Badge */}
                  <div className="absolute top-6 left-6 bg-gradient-to-r from-[#E60000] to-[#ff4444] text-white px-3 py-2 rounded-lg text-sm font-bold uppercase tracking-wider shadow-lg">
                    <Crown className="w-4 h-4 inline mr-1" />
                    Premium
                  </div>

                  {/* Power Level Indicator */}
                  <div className="absolute top-6 right-6 bg-black/80 text-[#E60000] px-3 py-2 rounded-lg text-sm font-bold border border-[#E60000]/30">
                    LEVEL 999
                  </div>
                </div>

                {/* Player Status */}
                <div className="absolute bottom-6 left-6 right-6 text-center z-10">
                  <div className="bg-black/80 backdrop-blur-sm border border-[#E60000]/30 rounded-lg p-3">
                    <p className="text-white font-bold text-sm mb-1">ATLAS CHAMPION</p>
                    <div className="flex items-center justify-center gap-2">
                      <Star className="w-4 h-4 text-[#E60000]" />
                      <span className="text-[#CCCCCC] text-xs">Fully Equipped</span>
                      <Star className="w-4 h-4 text-[#E60000]" />
                    </div>
                  </div>
                </div>
              </div>

              

              {/* Decorative Elements */}
              <div className="absolute -top-6 -right-6 text-[#E60000]">
                <Zap size={32} className="animate-pulse" />
              </div>
              <div className="absolute top-12 -right-12 text-[#E60000]/70">
                <Target size={24} className="animate-pulse" style={{ animationDelay: "0.5s" }} />
              </div>
              <div className="absolute top-24 -right-4 text-[#E60000]/50">
                <Sparkles size={20} className="animate-pulse" style={{ animationDelay: "1s" }} />
              </div>
              <div className="absolute -bottom-6 -left-6 text-[#E60000]/40">
                <Shield size={28} className="animate-pulse" style={{ animationDelay: "1.5s" }} />
              </div>

              {/* Background Effects */}
              <div className="absolute -z-10 top-0 right-0 w-40 h-40 bg-[#E60000]/10 rounded-full blur-2xl"></div>
              <div className="absolute -z-10 bottom-0 left-0 w-32 h-32 bg-[#E60000]/15 rounded-full blur-xl"></div>
              
              {/* Animated Circles */}
              <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-[#E60000]/10 rounded-full animate-pulse opacity-50"></div>
              <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-[#E60000]/20 rounded-full animate-pulse opacity-60" style={{ animationDelay: '1s' }}></div>
            </div>

            {/* Stats Panel */}
            <div className={`absolute -left-8 top-8 bg-black/80 border border-[#E60000]/30 rounded-lg p-4 backdrop-blur-sm transition-all duration-1000 ease-out ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            }`} style={{ transitionDelay: '800ms' }}>
              <div className="text-center">
                <div className="text-[#E60000] text-2xl font-bold">10,000+</div>
                <div className="text-[#CCCCCC] text-xs uppercase tracking-wider">Active Players</div>
              </div>
            </div>

            
          </div>
        </div>
      </div>
    </section>
  );
}