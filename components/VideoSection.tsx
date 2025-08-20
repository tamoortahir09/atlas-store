'use client';

export default function VideoSection() {
  return (
    <section className="py-20 bg-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div>
              <div className="inline-block bg-[#E60000]/20 border border-[#E60000]/50 px-4 py-2 rounded mb-6">
                <span className="text-[#E60000] text-sm font-medium uppercase tracking-wider">
                  Latest Update
                </span>
              </div>
              
              <h2 className="text-white text-4xl lg:text-5xl font-bold leading-tight mb-6">
                ATLAS 2.0
                <span className="block text-2xl lg:text-3xl text-gray-300 font-normal mt-2">
                  Platform Launch
                </span>
              </h2>
              
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                Atlas 2.0 launches with enhanced statistics tracking, improved server performance, and a completely redesigned platform. Experience the next generation of modded Rust gameplay.
              </p>
              
              <p className="text-gray-400 leading-relaxed">
                Our latest update showcases new gameplay features, advanced statistics tracking, and community tools that make Atlas the premier destination for competitive Rust gaming.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[#E60000] rounded-full"></div>
                <span className="text-gray-300">Enhanced Performance Monitoring</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[#E60000] rounded-full"></div>
                <span className="text-gray-300">Advanced Statistics Platform</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[#E60000] rounded-full"></div>
                <span className="text-gray-300">Improved Community Tools</span>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-4">
              <button className="bg-[#E60000] hover:bg-[#cc0000] text-white px-8 py-3 rounded transition-all duration-200 font-medium uppercase tracking-wider">
                Explore Features
              </button>
            </div>
          </div>

          {/* Right Video */}
          <div className="relative">
            {/* Angular Video Container */}
            <div className="relative">
              {/* Outer Angular Border */}
              <div 
                className="relative p-4 bg-gradient-to-br from-[#E60000]/20 via-transparent to-[#E60000]/10"
                style={{
                  clipPath: 'polygon(0 0, calc(100% - 30px) 0, 100% 30px, 100% 100%, 30px 100%, 0 calc(100% - 30px))'
                }}
              >
                {/* Inner Video Container */}
                <div 
                  className="relative bg-black border-2 border-[#E60000]/30 overflow-hidden"
                  style={{
                    clipPath: 'polygon(0 0, calc(100% - 25px) 0, 100% 25px, 100% 100%, 25px 100%, 0 calc(100% - 25px))'
                  }}
                >
                  {/* Video Iframe */}
                  <div className="aspect-video relative">
                    <iframe
                      src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&loop=1&playlist=dQw4w9WgXcQ&modestbranding=1"
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{ pointerEvents: 'none' }}
                    ></iframe>
                    
                    {/* Overlay to prevent interaction */}
                    <div className="absolute inset-0 bg-transparent pointer-events-none"></div>
                  </div>

                  {/* Video Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-white font-medium text-sm">Atlas Website 2.0 Update</h3>
                        <p className="text-gray-400 text-xs">New Platform Features</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-[#E60000] rounded-full animate-pulse"></div>
                        <span className="text-[#E60000] text-xs font-medium">LIVE</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Corner Decorations */}
              <div className="absolute -top-2 -left-2 w-8 h-8 border-l-2 border-t-2 border-[#E60000]/50"></div>
              <div className="absolute -top-2 -right-2 w-8 h-8 border-r-2 border-t-2 border-[#E60000]/50"></div>
              <div className="absolute -bottom-2 -left-2 w-8 h-8 border-l-2 border-b-2 border-[#E60000]/50"></div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 border-r-2 border-b-2 border-[#E60000]/50"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}