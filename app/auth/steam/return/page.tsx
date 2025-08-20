'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function SteamCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { handleSteamCallback, loading, error } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  
  // Track if callback has already been processed to prevent duplicates
  const callbackProcessedRef = useRef(false);
  const processingRef = useRef(false);
  
  // Store the search params string to detect actual changes
  const searchParamsString = searchParams.toString();

  useEffect(() => {
    const processSteamCallback = async () => {
      // Prevent duplicate processing
      if (processingRef.current || callbackProcessedRef.current) {
        console.log('🚫 Steam callback already processed or in progress, skipping');
        return;
      }

      // Must have search params to process
      if (!searchParamsString) {
        console.log('🚫 No search params found, skipping callback processing');
        return;
      }

      try {
        console.log('🚀 Processing Steam callback...');
        processingRef.current = true;
        setStatus('loading');
        
        // Get all URL parameters
        const params = new URLSearchParams(searchParamsString);
        const paramsObj = Object.fromEntries(params);
        
        console.log('Steam callback params:', paramsObj);
        
        // Call the Redux Steam callback handler
        const response = await handleSteamCallback(paramsObj);
        
        if (response.type === 'success') {
          console.log('✅ Steam authentication successful');
          callbackProcessedRef.current = true;
          setStatus('success');
          // Redirect to home page after successful authentication
          setTimeout(() => {
            router.push('/');
          }, 2000);
        } else if (response.type === 'two_factor') {
          console.log('🔐 Two-factor authentication required');
          // Two-factor authentication - redirect to the provided URL
          callbackProcessedRef.current = true;
          setStatus('success');
          window.location.href = response.url;
        } else {
          throw new Error('No access token received');
        }
        
      } catch (err) {
        console.error('❌ Steam auth error:', err);
        setStatus('error');
      } finally {
        processingRef.current = false;
      }
    };

    processSteamCallback();
  }, [searchParamsString, handleSteamCallback, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E60000] mx-auto mb-4"></div>
          <h2 className="text-white text-xl font-semibold mb-2">Authenticating with Steam</h2>
          <p className="text-[#CCCCCC]">Please wait while we verify your Steam account...</p>
        </div>
      </div>
    );
  }

  if (status === 'error' || error) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-6">
            <h2 className="text-red-400 text-xl font-semibold mb-4">Authentication Failed</h2>
            <p className="text-red-300 mb-6">{error || 'Authentication failed'}</p>
            <button 
              onClick={() => router.push('/')}
              className="bg-[#E60000] hover:bg-[#cc0000] text-white px-6 py-2 rounded font-medium transition-colors"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
                  <div className="text-center">
            <div className="bg-green-900/20 border border-green-500/50 rounded-lg p-6">
              <h2 className="text-green-400 text-xl font-semibold mb-4">Successfully Signed In!</h2>
              <p className="text-green-300 mb-6">You have been successfully authenticated with Steam.</p>
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-400 mx-auto"></div>
              <p className="text-[#CCCCCC] text-sm mt-2">Redirecting to home page...</p>
            </div>
          </div>
      </div>
    );
  }

  return null;
} 