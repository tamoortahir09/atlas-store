'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Wrench, Clock, AlertTriangle } from 'lucide-react';
import Image from 'next/image';

export default function MaintenancePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [dots, setDots] = useState('');
  
  // Get the page the user was trying to access
  const fromPage = searchParams.get('from');

  // Animated dots effect
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black flex flex-col">
      
      

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-2xl mx-auto text-center">
          {/* Icon */}
          <div className="relative mb-8">
            <div className="w-24 h-24 mx-auto bg-[#E60000]/10 rounded-full flex items-center justify-center border border-[#E60000]/20">
              <Wrench className="h-12 w-12 text-[#E60000]" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Under Development
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-gray-300 mb-8">
            We're working hard to bring you something amazing{dots}
          </p>
          
          {/* Show which page was being accessed */}
          {fromPage && (
            <div className="mb-6 px-4 py-2 bg-[#E60000]/10 border border-[#E60000]/20 rounded-lg">
              <p className="text-sm text-gray-400">
                You were trying to access: <span className="text-[#E60000] font-medium">{decodeURIComponent(fromPage)}</span>
              </p>
            </div>
          )}

          {/* Description */}
          <div className="bg-[#111111]/50 backdrop-blur-sm border border-[#333333] rounded-lg p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="h-5 w-5 text-[#E60000]" />
              <h2 className="text-lg font-semibold text-white">What's happening?</h2>
            </div>
            <p className="text-gray-300 text-left">
              This page is currently being developed and improved to provide you with the best possible experience. 
              Our team is actively working on new features, performance optimizations, and enhanced functionality.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/')}
              className="px-8 py-3 bg-[#E60000] hover:bg-[#cc0000] text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              Return Home
            </button>
            <button
              disabled
              className="px-8 py-3 bg-transparent border border-[#333333] text-gray-500 font-medium rounded-lg cursor-not-allowed opacity-50"
              title="Support is temporarily unavailable"
            >
              Contact Support
            </button>
          </div>

          {/* Status Message */}
          <div className="mt-12 text-center">
            <p className="text-sm text-gray-500">
              Expected completion: <span className="text-[#E60000]">Coming Soon</span>
            </p>
            <p className="text-xs text-gray-600 mt-2">
              Follow us on Discord for updates and announcements
            </p>
          </div>
        </div>
      </main>
    </div>
  );
} 