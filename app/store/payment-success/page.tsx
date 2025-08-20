'use client';

import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, ArrowRight, Package } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const planId = searchParams.get('planId');

  useEffect(() => {
    // Show success toast
    toast({
      title: "Payment Successful!",
      description: "Your purchase has been completed successfully.",
    });

    // Clear checkout timestamp
    localStorage.removeItem('lastCheckoutTime');

    // Send postMessage to parent window (for subscription stepper)
    if (window.opener && planId) {
      try {
        window.opener.postMessage({
          type: 'paymentSuccess',
          planId: planId,
          timestamp: Date.now()
        }, window.location.origin);
        console.log('Payment success message sent to parent window', { planId });
      } catch (error) {
        console.error('Failed to send payment success message:', error);
      }
    }
  }, [toast, planId]);

  return (
    <div className="bg-[#0A0A0A] pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto text-center">
        {/* Success Icon and Header */}
        <div className="mb-12">
          <div className="relative mb-8">
            <div className="w-24 h-24 mx-auto bg-green-500/10 rounded-full flex items-center justify-center border-2 border-green-500/30">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">Payment Successful!</h1>
          <p className="text-lg text-[#CCCCCC] max-w-lg mx-auto leading-relaxed">
            Thank you for your purchase. Your items will be delivered shortly.
          </p>
        </div>

        {/* Information Card */}
        <div className="bg-[#1A1A1A]/50 border border-[#333333]/50 rounded-xl p-8 mb-10">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <Package className="h-6 w-6 text-green-500" />
            </div>
          </div>
          <h2 className="text-xl font-semibold text-white mb-6">What happens next?</h2>
          <div className="text-[#CCCCCC] space-y-3 text-left max-w-md mx-auto">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"></div>
              <p>Your items will be delivered to your account within 5-10 minutes</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"></div>
              <p>You'll receive an email confirmation shortly</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"></div>
              <p>Check your in-game inventory for new items</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"></div>
              <p>Join our Discord for support if needed</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/store">
            <button className="bg-[#E60000] hover:bg-[#cc0000] text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 w-full sm:w-auto">
              Continue Shopping
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
          
          <Link href="/dashboard">
            <button className="bg-[#1A1A1A]/50 hover:bg-[#1A1A1A]/70 text-white border border-[#333333]/50 hover:border-[#333333]/70 px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 w-full sm:w-auto">
              View Dashboard
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>

        {/* Order ID */}
        {planId && (
          <div className="mt-12 p-4 bg-[#1A1A1A]/30 border border-[#333333]/30 rounded-lg">
            <p className="text-sm text-[#999999]">
              <span className="font-medium">Order ID:</span> {planId}
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 