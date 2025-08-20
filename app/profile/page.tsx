'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useGemBalance } from '@/hooks/useGemBalance';
import { useGemPurchases } from '@/hooks/useGemPurchases';
import { useOwnedItems } from '@/hooks/useOwnedItems';
import { usePayNowProducts } from '@/hooks/usePayNowProducts';
import { getReferralInfo } from '@/lib/referral';
import { useRouter } from 'next/navigation';
import { Clock, Calendar, Gift, History, CreditCard, Trophy, Package, Star, Shield, Gem, Users, Zap, TrendingUp, Award, AlertCircle, Loader2, RefreshCw, Copy, ShoppingBag, User, Link, ExternalLink } from 'lucide-react';
import Image from 'next/image';

export default function ProfilePage() {
  const { user, isAuthenticated, loading } = useAuth();
  const { gemBalance, isLoading: gemBalanceLoading, error: gemBalanceError, refresh: refreshGemBalance } = useGemBalance();
  const { gemPurchases, isLoading: gemPurchasesLoading, error: gemPurchasesError, refresh: refreshGemPurchases } = useGemPurchases();
  const { ownedItems, isLoading: ownedItemsLoading, error: ownedItemsError, refresh: refreshOwnedItems } = useOwnedItems();
    const {
    customer, 
    packages: payNowPackages, 
    transactions: payNowTransactions, 
    stats: payNowStats,
    isLoading: payNowLoading,
    error: payNowError,
    refresh: refreshPayNow,
    cancelSubscription
  } = usePayNowProducts();

  // Debug logging
  console.log('Profile page - PayNow data:', {
    customer: customer?.id,
    packagesCount: payNowPackages.length,
    transactionsCount: payNowTransactions.length,
    transactions: payNowTransactions,
    isLoading: payNowLoading,
    error: payNowError,
    storeId: process.env.NEXT_PUBLIC_PAYNOW_STORE_ID
  });

  // Debug user data
  console.log('Profile page - User data:', {
    isAuthenticated,
    userId: user?.steam_id,
    userName: user?.name,
    fullUser: user
  });
  
  // Debug console for troubleshooting
  useEffect(() => {
    console.log('Profile page - Auth state changed:', {
      isAuthenticated,
      loading,
      user,
      timestamp: new Date().toISOString()
    });
  }, [isAuthenticated, loading, user]);

  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, loading, router]);

  // Calculate stats from data
  const calculateGemStats = () => {
    const totalEarned = gemPurchases
      .filter(purchase => purchase.amount > 0)
      .reduce((total, purchase) => total + purchase.amount, 0);
    
    const totalSpent = gemPurchases
      .filter(purchase => purchase.amount < 0)
      .reduce((total, purchase) => total + Math.abs(purchase.amount), 0);

    return {
      currentBalance: gemBalance || 0,
      totalEarned,
      totalSpent
    };
  };

  const calculateReferralStats = () => {
    const referralTransactions = gemPurchases.filter(purchase => {
      const itemName = purchase.data?.item_name?.toLowerCase() || '';
      const saveId = purchase.save_id?.toLowerCase() || '';
      
      return (
        purchase.amount > 0 &&
        (
          itemName.includes('referral') || itemName.includes('refer') || itemName.includes('invite') ||
          itemName.includes('friend') || itemName.includes('recruitment') ||
          saveId.includes('referral') || saveId.includes('refer') || saveId.includes('invite')
        )
      );
    });

    const totalRewards = referralTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
    
    // Estimate referral count (assuming 250 gems per referral as mentioned in UI)
    const referralCount = Math.floor(totalRewards / 250);

    return {
      count: Math.max(referralCount, referralTransactions.length),
      totalRewards
    };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatPrice = (price: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(price / 100); // Convert from cents to dollars
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
      console.log(`${label} copied to clipboard`);
    } catch (err) {
      console.error(`Failed to copy ${label}`, err);
    }
  };

  const refreshAllData = async () => {
    try {
      await Promise.all([
        refreshGemBalance(),
        refreshGemPurchases(),
        refreshOwnedItems(),
        refreshPayNow()
      ]);
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  };

  const handleCancelSubscription = async (subscriptionId: string, packageName: string) => {
    try {
      await cancelSubscription(subscriptionId);
      console.log(`Cancelled subscription ${subscriptionId} for ${packageName}`);
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center pt-20">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-[#E60000] animate-spin mx-auto mb-4" />
          <p className="text-white">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center pt-20">
        <div className="text-center p-8 bg-[#1A1A1A] rounded-xl border border-[#333333]">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-white mb-4">Authentication Required</h2>
          <p className="text-[#CCCCCC] mb-6">Please sign in with Steam to view your profile and manage your purchases.</p>
          <button 
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-[#E60000] hover:bg-[#cc0000] text-white rounded-lg font-medium transition-colors"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  const gemStats = calculateGemStats();
  const referralStats = calculateReferralStats();
  const activePackages = payNowPackages.filter(pkg => pkg.status === 'active');
  
  // Get current referral info for debugging
  const currentReferralInfo = getReferralInfo();

  const getPurchaseTitle = (purchase: any) => {
    if (purchase.data.type)
      return `${capitalizeWordsInTitle(purchase.data.type)} (${purchase.data.item_name})`;
    else 
      return `${purchase.type === 'transaction' ? 'Purchase Reward' : capitalizeWordsInTitle(purchase.type)}`
  };

  const capitalizeWordsInTitle = (title: string) => {
    return title.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="bg-[#0A0A0A] pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Profile Header */}
        <div className="bg-[#1A1A1A]/50 rounded-xl p-6 mb-8 border border-[#333333]/50 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-[#E60000] flex items-center justify-center border-2 border-[#E60000]">
              {customer?.profile?.avatar_url || customer?.steam?.avatar_url ? (
                <Image
                  src={customer.profile?.avatar_url || customer.steam?.avatar_url || ''}
                  alt="Profile Avatar"
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="h-8 w-8 text-white" />
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{customer?.name || user?.name || 'User'}</h1>
              <p className="text-sm text-[#CCCCCC]">Steam ID: {user?.steam_id || 'Not loaded'}</p>
              <p className="text-sm text-[#999999]">Member since {customer ? formatDate(customer.created_at) : 'Unknown'}</p>
            </div>
          </div>
          <button
            onClick={refreshAllData}
            disabled={gemBalanceLoading || gemPurchasesLoading || ownedItemsLoading || payNowLoading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#E60000] hover:bg-[#cc0000] text-white rounded-lg font-medium transition-colors text-sm disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${(gemBalanceLoading || gemPurchasesLoading || ownedItemsLoading || payNowLoading) ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-[#1A1A1A]/50 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-medium text-sm transition-all ${
                activeTab === 'overview'
                  ? 'bg-[#E60000] text-white shadow-lg'
                  : 'text-[#CCCCCC] hover:text-white hover:bg-[#333333]/50'
              }`}
            >
              <Package className="h-4 w-4" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-medium text-sm transition-all ${
                activeTab === 'history'
                  ? 'bg-[#E60000] text-white shadow-lg'
                  : 'text-[#CCCCCC] hover:text-white hover:bg-[#333333]/50'
              }`}
            >
              <History className="h-4 w-4" />
              History
            </button>
            {/* <button
              onClick={() => setActiveTab('owned-items')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-medium text-sm transition-all ${
                activeTab === 'owned-items'
                  ? 'bg-[#E60000] text-white shadow-lg'
                  : 'text-[#CCCCCC] hover:text-white hover:bg-[#333333]/50'
              }`}
            >
              <ShoppingBag className="h-4 w-4" />
              Gem Items
            </button> */}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#1A1A1A]/50 p-4 rounded-xl border border-[#333333]/50">
                <h3 className="text-sm font-medium text-[#CCCCCC]">Active Products</h3>
                <p className="text-2xl font-bold text-white">
                  {payNowLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin inline" />
                  ) : (
                    activePackages.length
                  )}
                </p>
              </div>
              <div className="bg-[#1A1A1A]/50 p-4 rounded-xl border border-[#333333]/50">
                <h3 className="text-sm font-medium text-[#CCCCCC]">Gem Items</h3>
                <p className="text-2xl font-bold text-white">
                  {ownedItemsLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin inline" />
                  ) : (
                    ownedItems.filter(item => item.isActive).length
                  )}
                </p>
              </div>
              <div className="bg-[#1A1A1A]/50 p-4 rounded-xl border border-[#333333]/50">
                <h3 className="text-sm font-medium text-[#CCCCCC]">Gem Balance</h3>
                <p className="text-2xl font-bold text-[#E60000]">
                  {gemBalanceLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin inline" />
                  ) : gemBalanceError ? (
                    <span className="text-red-400 text-sm">Error</span>
                  ) : (
                    gemStats.currentBalance.toLocaleString()
                  )}
                </p>
              </div>
              <div className="bg-[#1A1A1A]/50 p-4 rounded-xl border border-[#333333]/50">
                <h3 className="text-sm font-medium text-[#CCCCCC]">Referrals</h3>
                <p className="text-2xl font-bold text-[#ff6b35]">
                  {gemPurchasesLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin inline" />
                  ) : (
                    referralStats.count
                  )}
                </p>
              </div>
            </div>

            {/* Account Linking Section
            <div className="bg-[#1A1A1A]/50 rounded-xl border border-[#333333]/50 overflow-hidden">
              <div className="p-6 border-b border-[#333333]/50">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Link className="h-5 w-5 text-[#E60000]" />
                  Account Linking
                </h2>
              </div>
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">Link Additional Accounts</h3>
                    <p className="text-[#CCCCCC] mb-4">
                      Connect your Discord and Google accounts for enhanced features and access to exclusive content.
                    </p>
                    <div className="flex flex-wrap gap-2 text-sm text-[#999999]">
                      <span>• Discord server access</span>
                      <span>• Creator program benefits</span>
                      <span>• Enhanced social features</span>
                    </div>
                  </div>
                  <button
                    onClick={() => router.push('/linking')}
                    className="px-6 py-3 bg-[#E60000] hover:bg-[#cc0000] text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 shrink-0"
                  >
                    <Link className="h-4 w-4" />
                    Link Accounts
                  </button>
                </div>
              </div>
            </div> */}

            {/* Gems Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-[#1A1A1A]/50 rounded-xl border border-[#333333]/50 overflow-hidden">
                <div className="p-6 border-b border-[#333333]/50">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Gem className="h-5 w-5 text-purple-400" />
                    Gems Overview
                  </h2>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                        <Gem className="h-5 w-5 text-purple-400" />
                      </div>
                      <div>
                        <div className="text-sm text-[#CCCCCC]">Current Balance</div>
                        <div className="text-xl font-bold text-white">
                          {gemBalanceLoading ? (
                            <Loader2 className="h-5 w-5 animate-spin inline" />
                          ) : gemBalanceError ? (
                            <span className="text-red-400 text-sm">Error loading</span>
                          ) : (
                            `${gemStats.currentBalance.toLocaleString()} Gems`
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#E60000]/20 rounded-lg flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-[#E60000]" />
                      </div>
                      <div>
                        <div className="text-sm text-[#CCCCCC]">Total Earned</div>
                        <div className="text-xl font-bold text-white">
                          {gemPurchasesLoading ? (
                            <Loader2 className="h-5 w-5 animate-spin inline" />
                          ) : (
                            `${gemStats.totalEarned.toLocaleString()} Gems`
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Referrals Program */}
              <div className="bg-[#1A1A1A]/50 rounded-xl border border-[#333333]/50 overflow-hidden">
                <div className="p-6 border-b border-[#333333]/50">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Users className="h-5 w-5 text-[#ff6b35]" />
                    Referrals Program
                  </h2>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#ff6b35]/20 rounded-lg flex items-center justify-center">
                        <Users className="h-5 w-5 text-[#ff6b35]" />
                      </div>
                      <div>
                        <div className="text-sm text-[#CCCCCC]">Successful Referrals</div>
                        <div className="text-xl font-bold text-white">
                          {gemPurchasesLoading ? (
                            <Loader2 className="h-5 w-5 animate-spin inline" />
                          ) : (
                            `${referralStats.count} Players`
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-[#333333]/30 rounded-lg p-4">
                    <div className="text-sm text-[#CCCCCC] mb-2">Referral Link</div>
                    <div className="flex items-center gap-2">
                      <input 
                        type="text" 
                        value={`${window.location.origin}/?ref=${user?.steam_id || 'STEAMID'}`}
                        readOnly
                        className="flex-1 bg-[#222222]/30 border border-[#333333]/50 rounded-lg px-3 py-2 text-sm text-[#CCCCCC] font-mono"
                      />
                      <button
                        onClick={() => {
                          copyToClipboard(`${window.location.origin}/?ref=${user?.steam_id || 'STEAMID'}`, 'Referral Link');
                        }}
                        className="p-2 bg-[#E60000]/20 hover:bg-[#E60000]/30 text-[#E60000] rounded-lg transition-colors border border-[#E60000]/30"
                        title="Copy Referral Link"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="text-xs text-[#999999] mt-2">
                      Earn 7 gems for every $1 your referrals spend!
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Products (PayNow Subscriptions/Products) */}
            <div className="bg-[#1A1A1A]/50 rounded-xl border border-[#333333]/50 overflow-hidden">
              <div className="p-6 border-b border-[#333333]/50">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Zap className="h-5 w-5 text-[#E60000]" />
                  Active Products ({payNowLoading ? '...' : activePackages.length})
                </h2>
              </div>
              <div className="p-6">
                {payNowLoading ? (
                  <div className="text-center py-8">
                    <Loader2 className="h-8 w-8 text-[#E60000] animate-spin mx-auto mb-4" />
                    <p className="text-[#CCCCCC]">Loading active products...</p>
                  </div>
                ) : payNowError ? (
                  <div className="text-center py-8">
                    <AlertCircle className="h-8 w-8 text-red-400 mx-auto mb-4" />
                    <p className="text-red-400 mb-4">Failed to load active products</p>
                    <button 
                      onClick={refreshPayNow}
                      className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                ) : activePackages.length === 0 ? (
                  <div className="p-8 text-center">
                    <Package className="h-16 w-16 text-[#666666] mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No Active Products</h3>
                    <p className="text-[#CCCCCC] mb-4">You don't have any active subscriptions or products yet.</p>
                    <button 
                      onClick={() => router.push('/store')}
                      className="px-6 py-3 bg-[#E60000] hover:bg-[#cc0000] text-white rounded-lg font-medium transition-colors"
                    >
                      Browse Store
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activePackages.slice(0, 3).map(pkg => (
                      <div key={pkg.id} className="bg-[#333333]/30 rounded-lg p-4 border border-[#333333]/30">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="p-2 bg-[#E60000]/20 rounded-lg">
                              {pkg.type === 'subscription' ? <Calendar className="h-4 w-4 text-[#E60000]" /> : <Package className="h-4 w-4 text-[#E60000]" />}
                            </div>
                            <div>
                              <div className="flex items-center gap-3 mb-1">
                                <h3 className="font-medium text-white">{pkg.name}</h3>
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-600/20 text-green-400">
                                  {pkg.type === 'subscription' ? 'Subscription' : pkg.type === 'gift' ? 'Gift' : 'Active'}
                                </span>
                                {pkg.giftedBy && (
                                  <span className="inline-flex items-center px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs">
                                    <Gift className="h-3 w-3 mr-1" />
                                    Gift from {pkg.giftedBy}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-[#CCCCCC]">
                                Purchased {formatDate(pkg.purchaseDate)}
                                {pkg.expiryDate && ` • Expires ${formatDate(pkg.expiryDate)}`}
                              </p>
                              {pkg.tags.length > 0 && (
                                <div className="flex gap-1 mt-1">
                                  {pkg.tags.map((tag, index) => (
                                    <span key={index} className="text-xs bg-[#444444]/50 text-[#CCCCCC] px-2 py-1 rounded">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-[#E60000] font-medium">{formatPrice(pkg.price)}</div>
                            <div className="text-xs text-[#999999]">Purchase Price</div>
                            {pkg.type === 'subscription' && (
                              <button
                                onClick={() => handleCancelSubscription(pkg.id, pkg.name)}
                                className="mt-2 px-3 py-1 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded text-xs transition-colors"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    {activePackages.length > 3 && (
                      <button
                        onClick={() => setActiveTab('history')}
                        className="w-full py-2 text-[#E60000] hover:text-white transition-colors text-sm"
                      >
                        View all {activePackages.length} active products →
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-6">
            {/* Gem Purchase History */}
            <div className="bg-[#1A1A1A]/50 rounded-xl border border-[#333333]/50 overflow-hidden">
              <div className="p-6 border-b border-[#333333]/50">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Gem className="h-5 w-5 text-purple-400" />
                  Gem Purchase History ({gemPurchasesLoading ? '...' : gemPurchases.length})
                </h2>
              </div>
              <div className="p-6">
                {gemPurchasesLoading ? (
                  <div className="text-center py-8">
                    <Loader2 className="h-8 w-8 text-purple-400 animate-spin mx-auto mb-4" />
                    <p className="text-[#CCCCCC]">Loading gem purchases...</p>
                  </div>
                ) : gemPurchasesError ? (
                  <div className="text-center py-8">
                    <AlertCircle className="h-8 w-8 text-red-400 mx-auto mb-4" />
                    <p className="text-red-400 mb-4">Failed to load gem purchases</p>
                    <button 
                      onClick={refreshGemPurchases}
                      className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                ) : gemPurchases.length === 0 ? (
                  <div className="text-center py-8">
                    <Gem className="h-16 w-16 text-[#666666] mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No Gem Purchases Yet</h3>
                    <p className="text-[#CCCCCC]">Your gem purchase history will appear here.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {gemPurchases.slice(0, 10).map(purchase => (
                      <div key={purchase.id} className="bg-[#333333]/30 rounded-lg p-4 border border-[#333333]/30">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="p-2 bg-purple-600/20 rounded-lg">
                              <Gem className="h-4 w-4 text-purple-400" />
                            </div>
                            <div>
                              <div className="flex items-center gap-3 mb-1">
                                <div className="font-medium text-white">{getPurchaseTitle(purchase)}</div>
                                {purchase.is_confirmed && (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-600/20 text-green-400">
                                    Confirmed
                                  </span>
                                )}
                                {purchase.is_rollback && (
                                  <span className="inline-flex items-center px-2 py-1 bg-red-600/20 text-red-400 rounded text-xs">
                                    Rollback
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-[#CCCCCC]">
                                {formatDate(purchase.created_at)} • {purchase.type === 'spend' ? 'Purchase' : 'Reward'}
                              </div>
                              {purchase.transaction_id && (
                                <div className="text-xs text-[#999999] mt-1 flex items-center gap-2">
                                  <span>Transaction ID: {purchase.transaction_id}</span>
                                  <button
                                    onClick={() => copyToClipboard(purchase.transaction_id!, 'Transaction ID')}
                                    className="p-1 hover:bg-[#333333]/50 rounded transition-colors"
                                    title="Copy Transaction ID"
                                  >
                                    <Copy className="h-3 w-3" />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`font-semibold text-lg ${
                              purchase.amount < 0 ? 'text-red-400' : 'text-green-400'
                            }`}>
                              {purchase.amount < 0 ? '' : '+'}{purchase.amount} Gems
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {gemPurchases.length > 10 && (
                      <div className="text-center py-4">
                        <p className="text-[#999999] text-sm">
                          Showing 10 of {gemPurchases.length} gem transactions
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            {/* PayNow Transaction History */}
            <div className="bg-[#1A1A1A]/50 rounded-xl border border-[#333333]/50 overflow-hidden">
              <div className="p-6 border-b border-[#333333]/50">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-blue-400" />
                  Transaction History ({payNowLoading ? '...' : payNowTransactions.length})
                </h2>
              </div>
              <div className="p-6">
                {payNowLoading ? (
                  <div className="text-center py-8">
                    <Loader2 className="h-8 w-8 text-blue-400 animate-spin mx-auto mb-4" />
                    <p className="text-[#CCCCCC]">Loading transaction history...</p>
                  </div>
                ) : payNowError ? (
                  <div className="text-center py-8">
                    <AlertCircle className="h-8 w-8 text-red-400 mx-auto mb-4" />
                    <p className="text-red-400 mb-4">Failed to load transaction history</p>
                    <button 
                      onClick={refreshPayNow}
                      className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                ) : payNowTransactions.length === 0 ? (
                  <div className="text-center py-8">
                    <CreditCard className="h-16 w-16 text-[#666666] mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No Transaction History</h3>
                    <p className="text-[#CCCCCC]">Your purchase history will appear here.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {payNowTransactions.slice(0, 10).map(transaction => (
                      <div key={transaction.id} className="bg-[#333333]/30 rounded-lg p-4 border border-[#333333]/30">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="p-2 bg-blue-600/20 rounded-lg">
                              {transaction.type === 'gift_received' ? <Gift className="h-4 w-4 text-blue-400" /> : <CreditCard className="h-4 w-4 text-blue-400" />}
                            </div>
                            <div>
                              <div className="flex items-center gap-3 mb-1">
                                <div className="font-medium text-white">{transaction.packageName}</div>
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-600/20 text-green-400">
                                  {transaction.status}
                                </span>
                              </div>
                              <div className="text-sm text-[#CCCCCC]">
                                {formatDate(transaction.date)} • {transaction.type === 'gift_received' ? `Gift from ${transaction.sender}` : transaction.type === 'gift_sent' ? `Gift to ${transaction.recipient}` : 'Purchase'}
                              </div>
                              {(transaction.paynowId || transaction.orderId) && (
                                <div className="text-xs text-[#999999] mt-1 flex items-center gap-2">
                                  <span>ID: {transaction.orderId || transaction.paynowId}</span>
                                  <button
                                    onClick={() => copyToClipboard(transaction.orderId || transaction.paynowId!, 'Transaction ID')}
                                    className="p-1 hover:bg-[#333333]/50 rounded transition-colors"
                                    title="Copy Transaction ID"
                                  >
                                    <Copy className="h-3 w-3" />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-semibold text-white">{formatPrice(transaction.amount)}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {payNowTransactions.length > 10 && (
                      <div className="text-center py-4">
                        <p className="text-[#999999] text-sm">
                          Showing 10 of {payNowTransactions.length} transactions
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'owned-items' && (
          <div className="bg-[#1A1A1A]/50 rounded-xl border border-[#333333]/50 overflow-hidden">
            <div className="p-6 border-b border-[#333333]/50">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-[#E60000]" />
                Gem-Purchased Items ({ownedItemsLoading ? '...' : ownedItems.length})
              </h2>
            </div>
            <div className="p-6">
              {ownedItemsLoading ? (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 text-[#E60000] animate-spin mx-auto mb-4" />
                  <p className="text-[#CCCCCC]">Loading gem-purchased items...</p>
                </div>
              ) : ownedItemsError ? (
                <div className="text-center py-8">
                  <AlertCircle className="h-8 w-8 text-red-400 mx-auto mb-4" />
                  <p className="text-red-400 mb-4">Failed to load gem-purchased items</p>
                  <button 
                    onClick={refreshOwnedItems}
                    className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              ) : ownedItems.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingBag className="h-16 w-16 text-[#666666] mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No Gem Items Owned</h3>
                  <p className="text-[#CCCCCC]">Items purchased with gems will appear here.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {ownedItems.map(item => (
                    <div key={item.id} className="bg-[#333333]/30 rounded-lg p-4 border border-[#333333]/30">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-[#E60000]/20 rounded-lg">
                            <ShoppingBag className="h-4 w-4 text-[#E60000]" />
                          </div>
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <div className="font-medium text-white">{item.name}</div>
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                item.isActive 
                                  ? 'bg-green-600/20 text-green-400'
                                  : 'bg-gray-600/20 text-gray-400'
                              }`}>
                                {item.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                            <div className="text-sm text-[#CCCCCC]">
                              Purchased {formatDate(item.created_at)}
                              {item.expires_at && ` • Expires ${formatDate(item.expires_at)}`}
                            </div>
                            <div className="text-xs text-[#999999] mt-1 flex items-center gap-2">
                              <span>Item ID: {item.item_id}</span>
                              <button
                                onClick={() => copyToClipboard(item.item_id, 'Item ID')}
                                className="p-1 hover:bg-[#333333]/50 rounded transition-colors"
                                title="Copy Item ID"
                              >
                                <Copy className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-[#E60000]">
                            {item.price} Gems
                          </div>
                          <div className="text-sm text-[#999999]">
                            Purchase Price
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
