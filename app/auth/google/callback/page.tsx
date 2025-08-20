'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function GoogleCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { handleGoogleCallback, isAuthenticated, error } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  
  // Track if callback has already been processed to prevent duplicates
  const callbackProcessedRef = useRef(false);
  const processingRef = useRef(false);
  
  // Store the search params string to detect actual changes
  const searchParamsString = searchParams.toString();

  useEffect(() => {
    const processGoogleCallback = async () => {
      // Prevent duplicate processing
      if (processingRef.current || callbackProcessedRef.current) {
        console.log('🚫 Google callback already processed or in progress, skipping');
        return;
      }

      // Must have search params to process
      if (!searchParamsString) {
        console.log('🚫 No search params found, skipping Google callback processing');
        return;
      }

      try {
        console.log('🚀 Processing Google callback...');
        processingRef.current = true;
        setStatus('loading');
        
        // Check if user is authenticated first
        if (!isAuthenticated) {
          throw new Error('You must be logged in with Steam first');
        }
        
        // Get all URL parameters
        const params = new URLSearchParams(searchParamsString);
        const paramsObj = Object.fromEntries(params);
        
        console.log('Google callback params:', paramsObj);
        
        // Call the Redux Google callback handler
        const response = await handleGoogleCallback(paramsObj);
        
        if (response) {
          console.log('✅ Google linking successful');
          callbackProcessedRef.current = true;
          setStatus('success');
          // Redirect back to linking page
          setTimeout(() => {
            router.push('/linking');
          }, 2000);
        } else {
          throw new Error('Failed to link YouTube account');
        }
        
      } catch (err) {
        console.error('❌ Google auth error:', err);
        setStatus('error');
      } finally {
        processingRef.current = false;
      }
    };

    processGoogleCallback();
  }, [searchParamsString, handleGoogleCallback, isAuthenticated, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF0000] mx-auto mb-4"></div>
          <h2 className="text-white text-xl font-semibold mb-2">Linking YouTube Account</h2>
          <p className="text-[var(--atlas-light-gray)]">Please wait while we link your YouTube creator account...</p>
        </div>
      </div>
    );
  }

  if (status === 'error' || error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-6">
            <h2 className="text-red-400 text-xl font-semibold mb-4">YouTube Linking Failed</h2>
            <p className="text-red-300 mb-6">{error || 'YouTube linking failed'}</p>
            <button 
              onClick={() => router.push('/linking')}
              className="bg-[var(--atlas-red)] hover:bg-[var(--atlas-red-hover)] text-white px-6 py-2 rounded font-medium transition-colors"
            >
              Back to Linking
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="bg-green-900/20 border border-green-500/50 rounded-lg p-6">
            <h2 className="text-green-400 text-xl font-semibold mb-4">YouTube Account Linked!</h2>
            <p className="text-green-300 mb-6">Welcome to the Creator Program! Your YouTube account has been successfully linked.</p>
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-400 mx-auto"></div>
            <p className="text-[var(--atlas-light-gray)] text-sm mt-2">Redirecting back to linking page...</p>
          </div>
        </div>
      </div>
    );
  }

  return null;
} 