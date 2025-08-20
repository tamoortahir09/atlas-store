// Environment variable checker for PayNow integration
export function checkPayNowEnvironment() {
  const issues: string[] = [];
  
  // Check client-side environment variables
  if (typeof window !== 'undefined') {
    if (!process.env.NEXT_PUBLIC_PAYNOW_STORE_ID) {
      issues.push('NEXT_PUBLIC_PAYNOW_STORE_ID is not set');
    }
  }
  
  return {
    isValid: issues.length === 0,
    issues,
    config: {
      storeId: process.env.NEXT_PUBLIC_PAYNOW_STORE_ID || 'NOT_SET',
      hasStoreId: !!process.env.NEXT_PUBLIC_PAYNOW_STORE_ID,
    }
  };
}

export function logPayNowConfig() {
  const check = checkPayNowEnvironment();
  
  console.log('PayNow Configuration Check:', {
    isValid: check.isValid,
    issues: check.issues,
    config: check.config
  });
  
  if (!check.isValid) {
    console.error('❌ PayNow configuration issues found:', check.issues);
  } else {
    console.log('✅ PayNow configuration looks good');
  }
  
  return check;
} 