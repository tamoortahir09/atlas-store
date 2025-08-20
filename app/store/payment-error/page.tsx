'use client';

import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AlertTriangle, ArrowLeft, ShoppingCart, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export default function PaymentErrorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const planId = searchParams.get('planId');
  const error = searchParams.get('error') || 'An unexpected error occurred during payment processing';
  const errorCode = searchParams.get('code');

  useEffect(() => {
    // Show error toast
    toast({
      title: "Payment Error",
      description: "There was an issue processing your payment. Please try again.",
      variant: "destructive",
    });

    // Send postMessage to parent window (for subscription stepper)
    if (window.opener && planId) {
      try {
        window.opener.postMessage({
          type: 'paymentError',
          planId: planId,
          error: error,
          errorCode: errorCode,
          timestamp: Date.now()
        }, window.location.origin);
        console.log('Payment error message sent to parent window', { planId, error, errorCode });
        
        // Auto-close the window after sending the message
        setTimeout(() => {
          window.close();
        }, 2000); // Give user 2 seconds to see the error before closing
      } catch (error) {
        console.error('Failed to send payment error message:', error);
        // Still try to close after a delay even if message sending fails
        setTimeout(() => {
          window.close();
        }, 5000);
      }
    } else {
      // If not opened from a parent window, redirect after showing error
      setTimeout(() => {
        router.push('/store/basket');
      }, 3000);
    }
  }, [toast, planId, error, errorCode, router]);

  return (
    <div className="bg-[#0A0A0A] pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto text-center">
        {/* Error Icon and Header */}
        <div className="mb-12">
          <div className="relative mb-8">
            <div className="w-24 h-24 mx-auto bg-orange-500/10 rounded-full flex items-center justify-center border-2 border-orange-500/30">
              <AlertTriangle className="h-12 w-12 text-orange-500" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">Payment Error</h1>
          <p className="text-lg text-[#CCCCCC] max-w-lg mx-auto leading-relaxed mb-2">
            We encountered an issue while processing your payment.
          </p>
          {window.opener && (
            <p className="text-sm text-[#999999]">
              This window will close automatically in a few seconds...
            </p>
          )}
        </div>

        {/* Error Details Card */}
        <div className="bg-[#1A1A1A]/50 border border-[#333333]/50 rounded-xl p-8 mb-10">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-orange-500" />
            </div>
          </div>
          <h2 className="text-xl font-semibold text-white mb-6">Error Details</h2>
          <div className="space-y-3">
            <p className="text-orange-300 bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
              {error}
            </p>
            {errorCode && (
              <p className="text-sm text-[#999999] bg-[#1A1A1A]/50 border border-[#333333]/30 rounded-lg p-3">
                <span className="font-medium">Error Code:</span> {errorCode}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        {!window.opener && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/store/basket">
                <button className="bg-[#E60000] hover:bg-[#cc0000] text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 w-full sm:w-auto">
                  <ArrowLeft className="w-4 h-4" />
                  Return to Basket
                </button>
              </Link>
              
              <Link href="/store">
                <button className="bg-[#1A1A1A]/50 hover:bg-[#1A1A1A]/70 text-white border border-[#333333]/50 hover:border-[#333333]/70 px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 w-full sm:w-auto">
                  Continue Shopping
                  <ShoppingCart className="w-4 h-4" />
                </button>
              </Link>
            </div>

            <div className="flex justify-center">
              <Link href="/support">
                <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105">
                  <RefreshCw className="w-4 h-4" />
                  Contact Support
                </button>
              </Link>
            </div>
          </div>
        )}

        {/* Reference ID */}
        {planId && (
          <div className="mt-12 p-4 bg-[#1A1A1A]/30 border border-[#333333]/30 rounded-lg">
            <p className="text-sm text-[#999999]">
              <span className="font-medium">Reference ID:</span> {planId}
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 