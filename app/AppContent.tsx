'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { setReferral } from '@/lib/referral';

export default function AppContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    // Handle referral links
    const refParam = searchParams.get('ref');
    if (refParam) {
      // Validate that it looks like a Steam ID (should be numeric and reasonable length)
      if (/^\d{17}$/.test(refParam)) {
        setReferral(refParam);
        console.log('Referral link detected:', refParam);
      } else {
        console.warn('Invalid referral parameter:', refParam);
      }
    }

    // Redirect to store page
    router.push('/store');
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-white">Redirecting to Atlas Store...</div>
    </div>
  );
} 