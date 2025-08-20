'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, RotateCcw, ExternalLink, ArrowRight, ArrowLeft, Clock, Star, Shield, Zap, HelpCircle, Gift, User } from 'lucide-react';
import { usePayNowProducts } from '@/hooks/usePayNowProducts';
import { useProfileData } from '@/hooks/usePayNowProfileData';
import { useAuth } from '@/hooks/useAuth';
import { formatCurrency } from '@/lib/formatters';
import { createCheckout } from '@/lib/paynow';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { CartItem } from '@/lib/store/types';

// Types for stepper state management
export interface SubscriptionStepState {
  itemId: string; // Unique cart item ID
  planId: string; // payNowProductId
  planName: string;
  planPrice: number;
  isGift: boolean;
  giftTo?: {
    displayName?: string;
  };
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'verifying';
  checkoutUrl?: string;
  errorMessage?: string;
  retryCount: number;
}

export interface SubscriptionStepperState {
  selectedItemIds: string[];
  steps: SubscriptionStepState[];
  currentStepIndex: number;
  isOpen: boolean;
  sessionId: string;
  startedAt: string;
}

interface SubscriptionStepperProps {
  isOpen: boolean;
  onClose: (completedIds: string[]) => void;
  items: CartItem[];
}

// Session storage key for persistence
const STEPPER_STORAGE_KEY = 'atlas-subscription-stepper';
const MAX_RETRY_COUNT = 3;
const CHECKOUT_TIMEOUT = 30000; // 30 seconds
const CHECKOUT_WINDOW_TIMEOUT = 300000; // 5 minutes - auto-close abandoned checkouts
const CHECKOUT_INACTIVITY_TIMEOUT = 120000; // 2 minutes - close if no activity

// Style helper functions to avoid complex ternaries
const getStepStatusStyles = (status: SubscriptionStepState['status']) => {
  switch (status) {
    case 'completed': return 'bg-green-500/20 border-green-500/50 text-green-400';
    case 'in_progress': return 'bg-blue-500/20 border-blue-500/50 text-blue-400 animate-pulse';
    case 'failed': return 'bg-red-500/20 border-red-500/50 text-red-400';
    case 'verifying': return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400 animate-pulse';
    default: return 'bg-gray-500/20 border-gray-500/50 text-gray-400';
  }
};

const getStepRowStyles = (status: SubscriptionStepState['status'], isCurrent: boolean) => {
  if (isCurrent) {
    switch (status) {
        case 'verifying': return 'bg-yellow-500/10 border-yellow-500/30';
        default: return 'bg-blue-500/10 border-blue-500/30';
    }
  }
  switch (status) {
    case 'completed': return 'bg-green-500/10 border-green-500/30';
    case 'failed': return 'bg-red-500/10 border-red-500/30';
    default: return 'bg-gray-700/30 border-gray-700/30';
  }
};

const StepperIcon = ({ status }: { status: SubscriptionStepState['status'] }) => {
  if (status === 'completed') return <CheckCircle className="h-6 w-6" />;
  if (status === 'failed') return <AlertCircle className="h-6 w-6" />;
  if (status === 'in_progress') return <Clock className="h-6 w-6" />;
  if (status === 'verifying') return <HelpCircle className="h-6 w-6" />;
  return <Star className="h-6 w-6" />;
};

const StepperStatusMessage = ({ status, errorMessage }: { status: SubscriptionStepState['status'], errorMessage?: string }) => {
  if (status === 'in_progress') {
    return (
      <div className="flex items-center gap-2 text-blue-400 text-sm">
        <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        Checkout in progress...
      </div>
    );
  }
  if (status === 'verifying') {
    return (
      <div className="flex items-center gap-2 text-yellow-400 text-sm">
        <div className="w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
        Verifying payment...
      </div>
    );
  }
  if (status === 'failed' && errorMessage) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mt-3">
        <div className="flex items-center gap-2 text-red-400 text-sm mb-2">
          <AlertCircle className="h-4 w-4" />
          Error
        </div>
        <p className="text-red-400/80 text-sm">{errorMessage}</p>
      </div>
    );
  }
  if (status === 'completed') {
    return (
      <div className="flex items-center gap-2 text-green-400 text-sm">
        <CheckCircle className="h-4 w-4" />
        Successfully purchased!
      </div>
    );
  }
  return null;
};

export function SubscriptionStepper({ isOpen, onClose, items = [] }: SubscriptionStepperProps) {
  const { ranks, isLoading: ranksLoading } = usePayNowProducts();
  const { packages: userPackages, refetch: refetchProfile } = useProfileData();
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Stepper state
  const [stepperState, setStepperState] = useState<SubscriptionStepperState | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [isAllComplete, setIsAllComplete] = useState(false);
  
  // Animation refs
  const stepperRef = useRef<HTMLDivElement>(null);
  const checkoutWindowRef = useRef<Window | null>(null);
  const windowTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const inactivityTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Animation on mount
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setShowContent(true), 100);
      return () => clearTimeout(timer);
    } else {
      setShowContent(false);
    }
  }, [isOpen]);

  // Initialize stepper state
  useEffect(() => {
    if (isOpen && items.length > 0) {
      // Try to restore from sessionStorage first
      if (typeof window !== 'undefined') {
        const saved = sessionStorage.getItem(STEPPER_STORAGE_KEY);
        if (saved) {
          try {
            const parsedState = JSON.parse(saved) as SubscriptionStepperState;
            const savedTime = new Date(parsedState.startedAt);
            const now = new Date();
            const hoursDiff = (now.getTime() - savedTime.getTime()) / (1000 * 60 * 60);

            // Also check if the items in the saved session match the current checkout request
            const currentIds = items.map(i => i.id).sort();
            const savedIds = [...(parsedState.selectedItemIds || [])].sort();
            const sessionMatches = currentIds.length === savedIds.length && currentIds.every((id, index) => id === savedIds[index]);

            if (hoursDiff < 24 && sessionMatches) {
              setStepperState(parsedState);
              console.log('Restored matching stepper state from session', { sessionId: parsedState.sessionId });
              return;
            } else {
              // Discard old or mismatched session data
              console.warn('Discarding old or mismatched stepper session.', {
                reason: hoursDiff >= 24 ? 'expired' : 'mismatched_items'
              });
              sessionStorage.removeItem(STEPPER_STORAGE_KEY);
            }
          } catch (error) {
            console.warn('Failed to restore stepper state', error);
            sessionStorage.removeItem(STEPPER_STORAGE_KEY);
          }
        }
      }

      // Create new stepper state
      const selectedItemIds = items.map(i => i.id);
      if (selectedItemIds.length === 0) return;

      const steps: SubscriptionStepState[] = items.map(item => {
        return {
          itemId: item.id,
          planId: item.payNowProductId || '',
          planName: item.name,
          planPrice: item.price,
          isGift: !!item.isGift,
          giftTo: item.giftTo,
          status: 'pending' as const,
          retryCount: 0
        };
      });

      if (steps.length === 0) return;
       // Filter out any steps that couldn't be created (e.g., missing planId)
       const validSteps = steps.filter(s => s.planId);
       if (validSteps.length !== steps.length) {
           console.warn('Some items could not be added to the stepper due to missing payNowProductId', {
               invalidItemCount: steps.length - validSteps.length,
           });
       }
       if (validSteps.length === 0) return;


      const newState: SubscriptionStepperState = {
        selectedItemIds,
        steps: validSteps,
        currentStepIndex: 0,
        isOpen: true,
        sessionId: Math.random().toString(36).substring(2, 15),
        startedAt: new Date().toISOString()
      };

      setStepperState(newState);
      persistStepperState(newState);
      
      console.log('Initialized new stepper session', {
        sessionId: newState.sessionId,
        stepCount: validSteps.length,
        planNames: validSteps.map(s => s.planName)
      });
    }
  }, [isOpen, items]);

  // Persist state to sessionStorage
  const persistStepperState = useCallback((state: SubscriptionStepperState) => {
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem(STEPPER_STORAGE_KEY, JSON.stringify(state));
      } catch (error) {
        console.error('Failed to persist stepper state', error);
      }
    }
  }, []);

  // Update stepper state and persist
  const updateStepperState = useCallback((updates: Partial<SubscriptionStepperState>) => {
    setStepperState(prev => {
      if (!prev) return null;
      const newState = { ...prev, ...updates };
      persistStepperState(newState);
      return newState;
    });
  }, [persistStepperState]);

  // Update specific step and persist
  const updateStep = useCallback((stepIndex: number, updates: Partial<SubscriptionStepState>) => {
    setStepperState(prev => {
      if (!prev) return null;
      const newSteps = [...prev.steps];
      newSteps[stepIndex] = { ...newSteps[stepIndex], ...updates };
      const newState = { ...prev, steps: newSteps };
      persistStepperState(newState);
      return newState;
    });
  }, [persistStepperState]);

    // Handle checkout for a specific step
    const handleStepCheckout = async (stepIndex: number) => {
        if (!stepperState) return;
        
        const step = stepperState.steps[stepIndex];
        if (step.status !== 'pending' && step.status !== 'failed') return;
    
        const cartItemForCheckout = items.find(i => i.id === step.itemId);
        if (!cartItemForCheckout) {
            console.error('Could not find original cart item for stepper checkout', { step });
            updateStep(stepIndex, { status: 'failed', errorMessage: 'Could not find item in cart.' });
            return;
        }
    
        setIsProcessing(true);
        updateStep(stepIndex, { status: 'in_progress', errorMessage: undefined });
    
        try {
          // Check if user is authenticated
          if (!user || !user.steam_id) {
            throw new Error('Steam authentication required. Please sign in with Steam to continue.');
          }

          const checkoutUrl = await createCheckout(
            [cartItemForCheckout], 
            user,
            'USD', 
            { itemIdForCallback: step.itemId }
          );
          
          if (checkoutUrl) {
            updateStep(stepIndex, { checkoutUrl });
            
            const checkoutWindow = window.open(
              checkoutUrl, 
              `atlas-checkout-${stepIndex}`,
              'width=800,height=900,scrollbars=yes,resizable=yes'
            );
            
            checkoutWindowRef.current = checkoutWindow;
            
            if (!checkoutWindow) {
              throw new Error('Failed to open checkout window. Please disable your pop-up blocker.');
            }

            // Helper function to clear all timeouts
            const clearAllTimeouts = () => {
              if (windowTimeoutRef.current) {
                clearTimeout(windowTimeoutRef.current);
                windowTimeoutRef.current = null;
              }
              if (inactivityTimeoutRef.current) {
                clearTimeout(inactivityTimeoutRef.current);
                inactivityTimeoutRef.current = null;
              }
            };

            // Set up automatic window closing timeouts
            windowTimeoutRef.current = setTimeout(() => {
              if (checkoutWindow && !checkoutWindow.closed) {
                console.warn('Checkout window auto-closed due to timeout', { stepIndex, planId: step.planId });
                checkoutWindow.close();
                updateStep(stepIndex, { 
                  status: 'failed', 
                  errorMessage: 'Checkout session timed out. Please try again.',
                  retryCount: step.retryCount + 1
                });
                setIsProcessing(false);
                checkoutWindowRef.current = null;
                moveToNextStep();
              }
            }, CHECKOUT_WINDOW_TIMEOUT);

            // Set up inactivity timeout (shorter timeout for user abandonment)
            inactivityTimeoutRef.current = setTimeout(() => {
              if (checkoutWindow && !checkoutWindow.closed) {
                console.warn('Checkout window auto-closed due to inactivity', { stepIndex, planId: step.planId });
                checkoutWindow.close();
                updateStep(stepIndex, { 
                  status: 'failed', 
                  errorMessage: 'Checkout was inactive for too long. Please try again.',
                  retryCount: step.retryCount + 1
                });
                setIsProcessing(false);
                checkoutWindowRef.current = null;
                moveToNextStep();
              }
            }, CHECKOUT_INACTIVITY_TIMEOUT);
    
            // --- Improved window monitoring ---
            const handleMessage = (event: MessageEvent) => {
              // Ensure the message is from our domain and is about payment
              if (event.origin !== window.location.origin) return;
              if (typeof event.data !== 'object' || !event.data.type) return;

              const { type, planId: receivedItemId, error } = event.data;
              if (!stepperState || !receivedItemId) return;
              
              const stepIndex = stepperState.steps.findIndex(s => s.itemId === receivedItemId);
              if (stepIndex === -1) {
                console.warn('Stepper received message for an unknown item', { receivedItemId });
                return;
              }
              
              console.log(`Stepper received message: ${type} for item: ${receivedItemId}`, event.data);

              // Clear timeouts when we receive any message
              clearAllTimeouts();

              if (type === 'paymentSuccess') {
                console.log('Payment completed for step', { stepIndex, planId: step.planId, sessionId: stepperState.sessionId });
                
                // Close the checkout window
                if (checkoutWindow && !checkoutWindow.closed) {
                  checkoutWindow.close();
                }
                
                // Atomically update state: mark step as complete and move to the next one.
                setStepperState(prev => {
                  if (!prev) return null;
                  
                  const newSteps = [...prev.steps];
                  newSteps[stepIndex] = { ...newSteps[stepIndex], status: 'completed' };
                  
                  const nextIndex = (stepIndex < prev.steps.length - 1) ? stepIndex + 1 : prev.currentStepIndex;

                  const newState = { ...prev, steps: newSteps, currentStepIndex: nextIndex };
                  persistStepperState(newState);
                  return newState;
                });

                setIsProcessing(false);
                window.removeEventListener('message', handleMessage);
                clearInterval(checkWindowClosed); 
              } else if (type === 'paymentCancel') {
                console.log('Checkout was cancelled', { stepIndex, planId: step.planId, sessionId: stepperState.sessionId });
                
                // Close the checkout window
                if (checkoutWindow && !checkoutWindow.closed) {
                  checkoutWindow.close();
                }
                
                updateStep(stepIndex, { status: 'failed', errorMessage: 'Checkout was cancelled by user.' });
                setIsProcessing(false);
                checkoutWindowRef.current = null;
                moveToNextStep();
              } else if (type === 'paymentError') {
                console.error('Payment error received', { stepIndex, planId: step.planId, error });
                
                // Close the checkout window
                if (checkoutWindow && !checkoutWindow.closed) {
                  checkoutWindow.close();
                }
                
                updateStep(stepIndex, { 
                  status: 'failed', 
                  errorMessage: error || 'Payment processing failed. Please try again.',
                  retryCount: step.retryCount + 1
                });
                setIsProcessing(false);
                checkoutWindowRef.current = null;
                moveToNextStep();
              }
            };
    
            window.addEventListener('message', handleMessage);
    
            const checkWindowClosed = setInterval(() => {
              if (checkoutWindow.closed) {
                clearInterval(checkWindowClosed);
                window.removeEventListener('message', handleMessage);
                clearAllTimeouts(); // Clear timeouts when window is closed
                
                setStepperState(currentStepperState => {
                  if (!currentStepperState) return null;
                  const currentStep = currentStepperState.steps[stepIndex];
    
                  if (currentStep.status === 'in_progress') {
                    console.warn('Checkout window closed unexpectedly. Starting verification.', { stepIndex, planId: currentStep.planId });
                    verifyPurchase(stepIndex);
                  }
                  return currentStepperState;
                });
              }
            }, 500);
          }
        } catch (error) {
          console.error('Checkout creation failed', { stepIndex, planId: step.planId, error, sessionId: stepperState?.sessionId });
          const errorMessage = error instanceof Error ? error.message : 'Checkout failed';
          updateStep(stepIndex, { 
            status: 'failed',
            errorMessage,
            retryCount: step.retryCount + 1
          });
          setIsProcessing(false);
        }
      };

  // Handle retry for failed step
  const handleRetry = (stepIndex: number) => {
    updateStep(stepIndex, { 
      status: 'pending',
      errorMessage: undefined
    });
    handleStepCheckout(stepIndex);
  };

  // Handle skip step
  const handleSkip = (stepIndex: number) => {
    updateStep(stepIndex, { status: 'failed', errorMessage: 'Skipped by user' });
    
    // Move to next step if available
    if (stepIndex < (stepperState?.steps.length || 0) - 1) {
      updateStepperState({ currentStepIndex: stepIndex + 1 });
    }
  };

  // Handle cancel all
  const handleCancelAll = () => {
    const completedIds = stepperState?.steps.filter(s => s.status === 'completed').map(s => s.itemId) || [];
    console.log('User cancelled stepper session', {
      sessionId: stepperState?.sessionId,
      completedSteps: stepperState?.steps.filter(s => s.status === 'completed').length || 0
    });
    
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(STEPPER_STORAGE_KEY);
    }
    
    if (checkoutWindowRef.current && !checkoutWindowRef.current.closed) {
      checkoutWindowRef.current.close();
    }
    
    onClose(completedIds);
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (checkoutWindowRef.current && !checkoutWindowRef.current.closed) {
        checkoutWindowRef.current.close();
      }
      // Clear any active timeouts
      if (windowTimeoutRef.current) {
        clearTimeout(windowTimeoutRef.current);
      }
      if (inactivityTimeoutRef.current) {
        clearTimeout(inactivityTimeoutRef.current);
      }
    };
  }, []);

  // --- Purchase Verification Logic ---
  const verifyPurchase = async (stepIndex: number, attempts: number = 0) => {
    if (!stepperState) return;
    const step = stepperState.steps[stepIndex];

    // For gifts, we cannot reliably verify via the user's profile.
    // We must rely on the postMessage from the success URL.
    // If the window was closed prematurely, we have to assume it failed.
    if (step.isGift) {
        console.warn('Cannot verify gift purchase via profile after window closed.', { step });
        updateStep(stepIndex, {
            status: 'failed',
            errorMessage: 'Checkout window was closed before gift purchase could be confirmed.'
        });
        moveToNextStep();
        return;
    }

    const MAX_VERIFICATION_ATTEMPTS = 5;
    const VERIFICATION_DELAY = 2000; // 2 seconds

    updateStep(stepIndex, { status: 'verifying' });
  
    try {
      await refetchProfile();
  
      const purchasedItem = userPackages.find(p => p.productId === step.planId);
  
      if (purchasedItem) {
        console.log('Purchase verified successfully via API', { stepIndex, planId: step.planId });
        updateStep(stepIndex, { status: 'completed' });
        moveToNextStep();
        setIsProcessing(false);
      } else if (attempts < MAX_VERIFICATION_ATTEMPTS) {
        console.log('Verification attempt failed, retrying...', { stepIndex, planId: step.planId, attempt: attempts + 1 });
        setTimeout(() => verifyPurchase(stepIndex, attempts + 1), VERIFICATION_DELAY);
      } else {
        console.error('Purchase verification failed after multiple attempts', { stepIndex, planId: step.planId });
        updateStep(stepIndex, { 
          status: 'failed', 
          errorMessage: "We couldn't confirm your payment automatically. If you paid, please contact support.",
          retryCount: step.retryCount + 1,
        });
        moveToNextStep();
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('Error during purchase verification API call', { error, stepIndex, planId: step.planId });
      updateStep(stepIndex, {
        status: 'failed',
        errorMessage: 'An error occurred while verifying your purchase.',
        retryCount: step.retryCount + 1,
      });
      moveToNextStep();
      setIsProcessing(false);
    }
  };

  // Effect to check if all steps are completed
  useEffect(() => {
    if (!stepperState || stepperState.steps.length === 0) return;

    const allStepsCompleted = stepperState.steps.every(s => s.status === 'completed');
    
    if (allStepsCompleted) {
        console.log('All stepper items have been purchased successfully.', { sessionId: stepperState.sessionId });
        setIsAllComplete(true);

        const completedIds = stepperState.steps.map(s => s.itemId);
        
        // After a delay, call onClose to update basket and clear cart
        setTimeout(() => {
            onClose(completedIds);
            if (typeof window !== 'undefined') {
              sessionStorage.removeItem(STEPPER_STORAGE_KEY);
            }
        }, 3000);
    }
  }, [stepperState, onClose]);

  // Automatically trigger checkout for the current step if it's pending
  useEffect(() => {
    if (!stepperState || !stepperState.isOpen || isProcessing) {
      return;
    }

    const currentStep = stepperState.steps[stepperState.currentStepIndex];

    // If the current step is pending, automatically start the checkout process for it.
    if (currentStep && currentStep.status === 'pending') {
      // Adding a small delay to allow UI to update and show the next step
      // before the checkout window is opened. This improves user experience.
      const timer = setTimeout(() => {
        handleStepCheckout(stepperState.currentStepIndex);
      }, 750); // 750ms delay for a smooth transition

      return () => clearTimeout(timer);
    }
  }, [stepperState, isProcessing]);

  const moveToNextStep = () => {
    if (!stepperState) return;

    const nextStepIndex = stepperState.steps.findIndex(
      (s, i) => i > stepperState.currentStepIndex && s.status === 'pending'
    );

    if (nextStepIndex !== -1) {
      updateStepperState({ currentStepIndex: nextStepIndex });
    } else {
      // All steps have been attempted (completed or failed), but not all were successful.
      // The isAllComplete effect handles the success scenario.
      // This branch is for when the process finishes without full success.
      const allAttempted = stepperState.steps.every(s => s.status === 'completed' || s.status === 'failed');
      if (allAttempted) {
          console.log('Stepper finished, but not all items were purchased.');
          const completedIds = stepperState.steps.filter(s => s.status === 'completed').map(s => s.itemId);
          onClose(completedIds);
      }
    }
  };

  if (!isOpen || ranksLoading) {
    return null;
  }
  
  if (isAllComplete) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <div className="relative w-full max-w-md bg-store-card-bg/95 backdrop-blur-xl border border-store-card-border rounded-2xl shadow-2xl p-8 text-center">
                <CheckCircle className="text-green-400 h-20 w-20 mx-auto animate-pulse" />
                <h2 className="text-3xl font-bold text-white mt-6">Checkout Complete!</h2>
                <p className="text-store-text-muted mt-2">All your items have been successfully purchased.</p>
                <p className="text-store-text-muted mt-1 text-sm">Your basket will now be cleared. This window will close shortly.</p>
            </div>
        </div>
    );
  }

  if (!stepperState) {
    return null;
  }

  const currentStep = stepperState.steps[stepperState.currentStepIndex];
  const completedSteps = stepperState.steps.filter(s => s.status === 'completed').length;
  const totalSteps = stepperState.steps.length;
  const progressPercentage = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${showContent ? 'opacity-100' : 'opacity-0'}`}
        onClick={handleCancelAll}
      />
      <div 
        ref={stepperRef}
        className={`relative w-full max-w-2xl bg-store-card-bg/95 backdrop-blur-xl border border-store-card-border rounded-2xl shadow-2xl transition-all duration-700 ease-out ${showContent ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-8'}`}
      >
        <div className="relative p-6 border-b border-store-card-border">
          <div className="absolute inset-0 bg-gradient-to-r from-atlas-red/10 via-blue-500/10 to-atlas-red/10 opacity-50" />
          <div className="relative flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Multi-Item Checkout</h2>
              <p className="text-store-text-muted">Step {stepperState.currentStepIndex + 1} of {totalSteps}: {currentStep.planName}</p>
            </div>
            <button onClick={handleCancelAll} className="p-2 rounded-lg hover:bg-store-card-bg/50 text-store-text-muted hover:text-white transition-colors">
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm text-store-text-muted mb-2">
              <span>{completedSteps} completed</span>
              <span>{totalSteps - completedSteps} remaining</span>
            </div>
            <div className="w-full bg-store-card-border rounded-full h-2 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full transition-all duration-1000 ease-out" style={{ width: `${progressPercentage}%` }} />
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="bg-store-card-bg/50 rounded-xl border border-store-card-border p-6 mb-6">
            <div className="flex items-start gap-4">
              <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${getStepStatusStyles(currentStep.status)}`}>
                <StepperIcon status={currentStep.status} />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2">{currentStep.planName}</h3>
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-2xl font-bold text-green-400">{formatCurrency(currentStep.planPrice, 'USD')}</span>
                  <span className="text-sm text-store-text-muted">/one-time</span>
                </div>
                <StepperStatusMessage status={currentStep.status} errorMessage={currentStep.errorMessage} />
                
                {currentStep.status === 'in_progress' && (
                  <div className="mt-2 text-xs text-blue-300/70">
                    Checkout windows will automatically close after 5 minutes of inactivity
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-lg font-semibold text-white mb-3">All Selected Items</h4>
            <div className="space-y-2">
              {stepperState.steps.map((step, index) => (
                <div key={step.itemId} className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-300 ${getStepRowStyles(step.status, index === stepperState.currentStepIndex)}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step.status === 'completed' ? 'bg-green-500 text-white' : step.status === 'failed' ? 'bg-red-500 text-white' : step.status === 'in_progress' ? 'bg-blue-500 text-white' : 'bg-gray-500 text-white'}`}>
                    {step.status === 'completed' ? '✓' : index + 1}
                  </div>
                  <div className="flex-1">
                    <span className="text-white font-medium">{step.planName}</span>
                    <span className="text-store-text-muted ml-2">{formatCurrency(step.planPrice, 'USD')}</span>
                  </div>
                  {step.status === 'in_progress' && <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />}
                  {step.status === 'verifying' && <div className="w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />}
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex gap-3">
            {currentStep.status === 'pending' || (currentStep.status === 'failed' && currentStep.retryCount < MAX_RETRY_COUNT) ? (
              <>
                <Button
                  onClick={() => currentStep.status === 'pending' ? handleStepCheckout(stepperState.currentStepIndex) : handleRetry(stepperState.currentStepIndex)}
                  disabled={isProcessing}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-atlas-red hover:from-blue-700 hover:to-atlas-red-hover text-white font-medium shadow-lg"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Opening Checkout...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      {currentStep.status === 'failed' ? <RotateCcw className="h-4 w-4" /> : <ExternalLink className="h-4 w-4" />}
                      {currentStep.status === 'failed' ? 'Retry Checkout' : 'Go to Checkout'}
                    </div>
                  )}
                </Button>

                <Button
                  onClick={() => handleSkip(stepperState.currentStepIndex)}
                  variant="outline"
                  className="border-store-card-border text-store-text-muted hover:bg-store-card-bg/10"
                >
                  Skip
                </Button>
              </>
            ) : completedSteps === totalSteps ? (
              <Button
                onClick={handleCancelAll}
                className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-medium"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  All Done!
                </div>
              </Button>
            ) : null}

            <Button
              onClick={handleCancelAll}
              variant="outline"
              className="border-red-500/50 text-red-400 hover:bg-red-500/10"
            >
              Cancel All
            </Button>
          </div>
        </div>

        {(isProcessing || currentStep.status === 'verifying') && (
          <div className="absolute inset-0 bg-store-card-bg/80 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-store-text-primary font-medium">
                {currentStep.status === 'verifying' ? 'Verifying payment...' : 'Setting up checkout...'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 