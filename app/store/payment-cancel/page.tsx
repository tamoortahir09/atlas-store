'use client';

import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { XCircle, ArrowLeft, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export default function PaymentCancelPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const planId = searchParams.get('planId');

  useEffect(() => {
    // Show cancel toast
    toast({
      title: "Payment Cancelled",
      description: "Your payment was cancelled. No charges were made.",
      variant: "destructive",
    });

    // Send postMessage to parent window (for subscription stepper)
    if (window.opener && planId) {
      try {
        window.opener.postMessage({
          type: 'paymentCancel',
          planId: planId,
          timestamp: Date.now()
        }, window.location.origin);
        console.log('Payment cancel message sent to parent window', { planId });
      } catch (error) {
        console.error('Failed to send payment cancel message:', error);
      }
    }
  }, [toast, planId]);

  return (
    <div className="bg-[#0A0A0A] pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto text-center">
        {/* Error Icon and Header */}
        <div className="mb-12">
          <div className="relative mb-8">
            <div className="w-24 h-24 mx-auto bg-[#E60000]/10 rounded-full flex items-center justify-center border-2 border-[#E60000]/30">
              <XCircle className="h-12 w-12 text-[#E60000]" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">Payment Cancelled</h1>
          <p className="text-lg text-[#CCCCCC] max-w-lg mx-auto leading-relaxed">
            Your payment was cancelled and no charges were made to your account.
          </p>
        </div>

        {/* Information Card */}
        <div className="bg-[#1A1A1A]/50 border border-[#333333]/50 rounded-xl p-8 mb-10">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-[#E60000]/20 rounded-lg flex items-center justify-center">
              <ShoppingCart className="h-6 w-6 text-[#E60000]" />
            </div>
          </div>
          <h2 className="text-xl font-semibold text-white mb-6">What would you like to do?</h2>
          <div className="text-[#CCCCCC] space-y-3 text-left max-w-md mx-auto">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-[#E60000] rounded-full flex-shrink-0"></div>
              <p>Return to your basket to try again</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-[#E60000] rounded-full flex-shrink-0"></div>
              <p>Browse our store for other items</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-[#E60000] rounded-full flex-shrink-0"></div>
              <p>Contact support if you experienced issues</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
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