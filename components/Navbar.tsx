'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ChevronDown, ShoppingCart, X, Trash2, CreditCard, User, LogOut, Package, History, Settings, Gem, Loader2, SkipForward } from 'lucide-react';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import { formatCurrency } from '@/lib/formatters';
import { useAuth } from '@/hooks/useAuth';
import { useGemBalance } from '@/hooks/useGemBalance';
import { usePayNowProducts } from '@/hooks/usePayNowProducts';
import { QueueSkipModal } from '@/components/ui/QueueSkipModal';

// Atlas Rank System (imported from leaderboards) - COMMENTED OUT
// type RankTier = 'demonic_top5' | 'demonic_top25' | 'obsidian3' | 'obsidian2' | 'obsidian1' | 'purple3' | 'purple2' | 'purple1' | 'blue3' | 'blue2' | 'blue1' | 'gold3' | 'gold2' | 'gold1' | 'silver3' | 'silver2' | 'silver1' | 'bronze3' | 'bronze2' | 'bronze1';

// interface RankConfig {
//   tier: RankTier;
//   name: string;
//   image: string;
//   minACS: number;
//   maxACS: number;
//   description: string;
//   color: string;
// }

// // Rank tier configurations (based on ACS thresholds)
// const RANK_CONFIGS: Record<RankTier, RankConfig> = {
//   demonic_top5: {
//     tier: 'demonic_top5',
//     name: 'Demonic Elite',
//     image: '/Emblems/Demonic_Top5.png',
//     minACS: 3100,
//     maxACS: 9999,
//     description: 'Top 5 Global Elite',
//     color: 'text-red-500'
//   },
//   demonic_top25: {
//     tier: 'demonic_top25',
//     name: 'Demonic Legend',
//     image: '/Emblems/Demonic_Top25.png',
//     minACS: 3000,
//     maxACS: 3099,
//     description: 'Top 25 Global Legend',
//     color: 'text-red-400'
//   },
//   obsidian3: {
//     tier: 'obsidian3',
//     name: 'Obsidian III',
//     image: '/Emblems/ob3.png',
//     minACS: 2900,
//     maxACS: 2999,
//     description: 'Obsidian Tier III',
//     color: 'text-gray-800'
//   },
//   obsidian2: {
//     tier: 'obsidian2',
//     name: 'Obsidian II',
//     image: '/Emblems/ob2.png',
//     minACS: 2800,
//     maxACS: 2899,
//     description: 'Obsidian Tier II',
//     color: 'text-gray-700'
//   },
//   obsidian1: {
//     tier: 'obsidian1',
//     name: 'Obsidian I',
//     image: '/Emblems/ob1.png',
//     minACS: 2700,
//     maxACS: 2799,
//     description: 'Obsidian Tier I',
//     color: 'text-gray-600'
//   },
//   purple3: {
//     tier: 'purple3',
//     name: 'Ascendant III',
//     image: '/Emblems/p3.png',
//     minACS: 2600,
//     maxACS: 2699,
//     description: 'Ascendant Tier III',
//     color: 'text-purple-500'
//   },
//   purple2: {
//     tier: 'purple2',
//     name: 'Ascendant II',
//     image: '/Emblems/p2.png',
//     minACS: 2500,
//     maxACS: 2599,
//     description: 'Ascendant Tier II',
//     color: 'text-purple-400'
//   },
//   purple1: {
//     tier: 'purple1',
//     name: 'Ascendant I',
//     image: '/Emblems/p1.png',
//     minACS: 2400,
//     maxACS: 2499,
//     description: 'Ascendant Tier I',
//     color: 'text-purple-300'
//   },
//   blue3: {
//     tier: 'blue3',
//     name: 'Diamond III',
//     image: '/Emblems/blue3.png',
//     minACS: 2300,
//     maxACS: 2399,
//     description: 'Diamond Tier III',
//     color: 'text-blue-500'
//   },
//   blue2: {
//     tier: 'blue2',
//     name: 'Diamond II',
//     image: '/Emblems/blue2.png',
//     minACS: 2200,
//     maxACS: 2299,
//     description: 'Diamond Tier II',
//     color: 'text-blue-400'
//   },
//   blue1: {
//     tier: 'blue1',
//     name: 'Diamond I',
//     image: '/Emblems/blue1.png',
//     minACS: 2100,
//     maxACS: 2199,
//     description: 'Diamond Tier I',
//     color: 'text-blue-300'
//   },
//   gold3: {
//     tier: 'gold3',
//     name: 'Platinum III',
//     image: '/Emblems/Gold3.png',
//     minACS: 2000,
//     maxACS: 2099,
//     description: 'Platinum Tier III',
//     color: 'text-yellow-500'
//   },
//   gold2: {
//     tier: 'gold2',
//     name: 'Platinum II',
//     image: '/Emblems/Gold2.png',
//     minACS: 1900,
//     maxACS: 1999,
//     description: 'Platinum Tier II',
//     color: 'text-yellow-400'
//   },
//   gold1: {
//     tier: 'gold1',
//     name: 'Platinum I',
//     image: '/Emblems/Gold1.png',
//     minACS: 1800,
//     maxACS: 1899,
//     description: 'Platinum Tier I',
//     color: 'text-yellow-300'
//   },
//   silver3: {
//     tier: 'silver3',
//     name: 'Gold III',
//     image: '/Emblems/s3.png',
//     minACS: 1700,
//     maxACS: 1799,
//     description: 'Gold Tier III',
//     color: 'text-gray-400'
//   },
//   silver2: {
//     tier: 'silver2',
//     name: 'Gold II',
//     image: '/Emblems/s2.png',
//     minACS: 1600,
//     maxACS: 1699,
//     description: 'Gold Tier II',
//     color: 'text-gray-300'
//   },
//   silver1: {
//     tier: 'silver1',
//     name: 'Gold I',
//     image: '/Emblems/s1.png',
//     minACS: 1500,
//     maxACS: 1599,
//     description: 'Gold Tier I',
//     color: 'text-gray-200'
//   },
//   bronze3: {
//     tier: 'bronze3',
//     name: 'Silver III',
//     image: '/Emblems/br3.png',
//     minACS: 1400,
//     maxACS: 1499,
//     description: 'Silver Tier III',
//     color: 'text-amber-600'
//   },
//   bronze2: {
//     tier: 'bronze2',
//     name: 'Silver II',
//     image: '/Emblems/br2.png',
//     minACS: 1300,
//     maxACS: 1399,
//     description: 'Silver Tier II',
//     color: 'text-amber-500'
//   },
//   bronze1: {
//     tier: 'bronze1',
//     name: 'Silver I',
//     image: '/Emblems/br1.png',
//     minACS: 0,
//     maxACS: 1299,
//     description: 'Silver Tier I',
//     color: 'text-amber-400'
//   }
// };

// // Function to get rank based on ACS score (for individual users)
// const getRankFromACS = (acs: number): RankConfig => {
//   const ranks = Object.values(RANK_CONFIGS).filter(rank => 
//     rank.tier !== 'demonic_top5' && rank.tier !== 'demonic_top25'
//   );
//   return ranks.find(rank => acs >= rank.minACS && acs <= rank.maxACS) || RANK_CONFIGS.bronze1;
// };

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartBounce, setCartBounce] = useState(false);
  const [showQueueSkipModal, setShowQueueSkipModal] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { items, removeItem, clearCart, total } = useCart();
  const { user, isAuthenticated, login, logout, loading } = useAuth();
  const { gemBalance, isLoading: gemLoading, error: gemError, refresh: refreshGems } = useGemBalance();
  const { ranks, isLoadingProducts } = usePayNowProducts();
  
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Simulated user rank data (in production this would come from API) - COMMENTED OUT
  // const userACS = 2487; // Example ACS score
  // const userRank = getRankFromACS(userACS);

  // Get queue skip product data from ranks (VIP rank 1)
  const queueSkipProduct = React.useMemo(() => {
    if (isLoadingProducts || ranks.length === 0) {
      return { price: 14.99, isLoading: true };
    }
    
    // Find VIP rank 1 (position 1) since queue skip is actually VIP Package 1
    const vipRank1 = ranks.find(rank => rank.position === 1);
    
    if (vipRank1) {
      return {
        price: vipRank1.price,
        originalPrice: vipRank1.originalPrice,
        isLoading: false,
        payNowProductId: vipRank1.payNowProductId
      };
    }
    
    return { price: 14.99, isLoading: false };
  }, [ranks, isLoadingProducts]);

  // Check if queue skip has an active sale
  const hasQueueSkipSale = queueSkipProduct.originalPrice && 
                          queueSkipProduct.originalPrice > queueSkipProduct.price;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Trigger cart bounce animation when items change
  useEffect(() => {
    if (itemCount > 0) {
      setCartBounce(true);
      const timer = setTimeout(() => setCartBounce(false), 600);
      return () => clearTimeout(timer);
    }
  }, [itemCount]);

  const handleNavClick = (page: string) => {
    if (page === 'home') {
      router.push('/');
    } else {
      router.push(`/${page}`);
    }
  };

  // const isSupportActive = pathname?.startsWith('/support'); // COMMENTED OUT - Support links disabled
  const isStoreActive = pathname?.startsWith('/store');

  const handleQuickCheckout = () => {
    router.push('/store/basket');
  };

  const handleClearCart = () => {
    clearCart();
  };

  const handleSignIn = () => {
    login.steam();
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleProfileClick = () => {
    router.push('/profile');
  };

  return (
      <nav className="sticky top-0 left-0 right-0 z-50 h-18 py-4 bg-black/90 backdrop-blur-sm border-b border-gray-800/50">
        <div className="container mx-auto px-6 h-full grid grid-cols-3 items-center">
          {/* Atlas Logo - Left Column */}
          <div className="flex items-center cursor-pointer justify-self-start" onClick={() => handleNavClick('home')}>
            <Image 
              src="/logo/png/redlogo.png" 
              alt="Atlas" 
              width={120}
              height={32}
              className="h-8 w-auto"
              priority
            />
          </div>

          {/* Store Header - Center Column */}
          <div className="flex items-center justify-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
              Atlas Store
            </h1>
          </div>

          {/* Cart and Authentication - Right Column */}
          <div className="flex items-center gap-x-2 justify-self-end">
          {/* Queue Skip Button with Dropdown - Always visible */}
          <div className="relative group flex-shrink-0">
            <button className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white rounded-lg transition-all duration-150 shadow-lg font-medium text-sm min-w-[44px]">
              <SkipForward className="h-4 w-4 flex-shrink-0" />
              <span className="hidden lg:inline whitespace-nowrap">Skip Queue</span>
              <ChevronDown className="h-3 w-3 transition-transform group-hover:rotate-180 flex-shrink-0" />
            </button>
            
            {/* Queue Skip Dropdown */}
            <div className="absolute right-0 mt-2 w-80 opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all duration-200 transform scale-95 group-hover:scale-100 z-50">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg blur-md"></div>
                <div className="relative bg-[#111111]/95 backdrop-blur-sm rounded-lg shadow-2xl border border-green-500/30">
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-green-400 font-bold flex items-center gap-2 text-lg">
                        <SkipForward className="h-5 w-5" />
                        Queue Skip Pass
                      </h3>
                      <div className="flex items-center gap-2">
                        {queueSkipProduct.isLoading ? (
                          <span className="text-gray-400 text-sm">Loading...</span>
                        ) : (
                          <>
                            <span className="text-white font-bold px-3 py-1 bg-green-500/20 rounded-full text-sm">
                              {formatCurrency(queueSkipProduct.price, 'USD')}
                            </span>
                            {hasQueueSkipSale && queueSkipProduct.originalPrice && (
                              <span className="text-gray-500 line-through text-xs">
                                {formatCurrency(queueSkipProduct.originalPrice, 'USD')}
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm mb-4">Skip the queue on any server instantly</p>
                    
                    <div className="mb-5">
                      <h4 className="text-yellow-400 text-sm font-semibold mb-2">Benefits</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="h-5 w-5 flex-shrink-0 flex items-center justify-center rounded-full bg-yellow-500/20">
                            <svg className="h-3 w-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="text-gray-300">30-day queue skip access</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-5 w-5 flex-shrink-0 flex items-center justify-center rounded-full bg-yellow-500/20">
                            <svg className="h-3 w-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="text-gray-300">Works on all servers</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setShowQueueSkipModal(true)}
                      disabled={queueSkipProduct.isLoading}
                      className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white font-bold rounded-md transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {queueSkipProduct.isLoading ? 'Loading...' : 'Get Queue Skip'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden sm:block h-6 w-px bg-gray-600/50"></div>

          {/* Authentication Section */}
          {!isAuthenticated ? (
            /* Sign In Button */
            <button 
              onClick={handleSignIn}
              disabled={loading}
              className="flex items-center gap-2 bg-[#E60000] hover:bg-[#cc0000] disabled:bg-[#666666] text-black px-4 py-2 rounded text-sm font-medium uppercase tracking-wider transition-all duration-200"
            >
              <User className="h-4 w-4" />
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
                  ) : (
          /* User Card with Profile and Gems */
          <div className="flex items-center gap-2 p-0 bg-black/30 backdrop-blur-sm rounded-lg border border-gray-600/30">
            {/* Profile Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-2 p-1 rounded-lg bg-transparent hover:bg-white/10 transition-all duration-150">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-[#E60000] flex items-center justify-center">
                  {user?.avatar_image ? (
                    <Image
                      src={user.avatar_image}
                      alt="Profile"
                      width={32}
                      height={32}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="h-4 w-4 text-white" />
                  )}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-white text-sm font-medium truncate max-w-[100px]">{user?.name || 'User'}</p>
                  {/* ACS Rank Display - COMMENTED OUT */}
                  {/* <div className="flex items-center gap-1">
                    <Image
                      src={userRank.image}
                      alt={userRank.name}
                      width={14}
                      height={14}
                      className="w-3.5 h-3.5"
                    />
                    <span className="text-xs text-gray-300">{userACS} ACS</span>
                  </div> */}
                </div>
                                                         {/* Gem Balance - To the right of profile */}
             <div className="flex items-center gap-1 px-2 py-1 bg-gray-100/10 rounded-md hover:bg-gray-100/20 hover:scale-105 cursor-pointer group will-change-transform transition-[transform,background-color] duration-75 delay-0 ease-out">
               <img 
                 src="/atlas-gem.png" 
                 alt="Atlas Gem" 
                 className="h-4 w-4 flex-shrink-0 group-hover:scale-110 will-change-transform transition-transform duration-75 delay-0 ease-out"
               />
               <span className="text-white font-medium text-xs sm:text-sm group-hover:text-yellow-300 transition-colors duration-75 delay-0 ease-out">
                 {gemLoading ? (
                   <Loader2 className="h-4 w-4 animate-spin inline" />
                 ) : gemError ? (
                   <span className="text-red-400 text-xs">Error</span>
                 ) : (
                   (gemBalance || 0).toLocaleString()
                 )}
               </span>
             </div>
                <ChevronDown className="h-4 w-4 text-[#CCCCCC] group-hover:rotate-180 transition-transform duration-200" />
              </button>

              {/* Profile Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-64 bg-[#111111] border border-[#333333] rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-4 border-b border-[#333333]">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-[#E60000] flex items-center justify-center flex-shrink-0">
                      {user?.avatar_image ? (
                        <Image
                          src={user.avatar_image}
                          alt="Profile"
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="h-6 w-6 text-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold text-base truncate">{user?.name || 'User'}</p>
                      <p className="text-[#CCCCCC] text-xs mt-0.5">Steam ID: {user?.steam_id}</p>
                      
                      {/* Rank Section - COMMENTED OUT */}
                      {/* <div className="mt-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Image
                            src={userRank.image}
                            alt={userRank.name}
                            width={20}
                            height={20}
                            className="w-5 h-5"
                          />
                          <span className="text-sm font-medium text-white">{userRank.name}</span>
                        </div>
                        <div className="text-xs text-gray-400">
                          Current Rating - <span className="text-[#E60000] font-semibold">{userACS} ACS</span>
                        </div>
                      </div> */}
                    </div>
                  </div>
                </div>
                
                <div className="py-2">
                  <button
                    onClick={handleProfileClick}
                    className="w-full text-left px-4 py-2 text-sm text-[#CCCCCC] hover:text-white hover:bg-[#222222] transition-colors flex items-center gap-2"
                  >
                    <User className="h-4 w-4" />
                    View Profile
                  </button>
                  
                  <div className="border-t border-[#333333] my-1"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-[#E60000] hover:text-white hover:bg-[#222222] transition-colors flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cart Button - Separate from user card */}
        {true && (
          <div className="relative group">
            <button 
              onClick={handleQuickCheckout}
              className={`relative p-2 rounded-lg bg-black/30 backdrop-blur-sm border border-gray-600/30 hover:bg-white/10 transition-all duration-150 ${
                cartBounce ? 'animate-bounce' : ''
              }`}
            >
              <ShoppingCart className="h-5 w-5 text-white" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#E60000] text-white text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center shadow-lg animate-pulse">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Cart Dropdown */}
            <div className="absolute right-0 mt-2 w-96 z-50 opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all duration-200 transform scale-95 group-hover:scale-100">
              <div className="relative">
                <div className="absolute inset-0 bg-[#111111] rounded-lg blur-md"></div>
                <div className="relative bg-[#111111]/95 backdrop-blur-sm rounded-lg shadow-2xl border border-[#333333]">
                  {/* Cart Header */}
                  <div className="flex items-center justify-between p-4 border-b border-[#333333]">
                    <h3 className="text-white font-bold flex items-center gap-2">
                      <ShoppingCart className="h-5 w-5 text-[#E60000]" />
                      Cart ({itemCount})
                    </h3>
                  </div>

                  {/* Cart Items */}
                  <div className="max-h-64 overflow-y-auto">
                    {items.length === 0 ? (
                      <div className="p-6 text-center">
                        <ShoppingCart className="h-12 w-12 text-[#666666] mx-auto mb-3" />
                        <p className="text-[#CCCCCC] mb-4">Your cart is empty</p>
                        <button 
                          onClick={() => handleNavClick('store')}
                          className="text-[#E60000] hover:text-[#ff3333] transition-colors"
                        >
                          Start shopping
                        </button>
                      </div>
                    ) : (
                      <div className="p-2">
                        {items.map((item, index) => (
                          <div 
                            key={item.id} 
                            className="flex items-center justify-between p-3 bg-[#222222]/50 rounded-lg mb-2"
                            style={{ animationDelay: `${index * 50}ms` }}
                          >
                            <div className="flex-1">
                              <h4 className="text-white font-medium text-sm">{item.name}</h4>
                              <p className="text-[#CCCCCC] text-xs">
                                {item.type === 'gems' ? 'Gem Package' : 
                                 item.type === 'rank' ? 'Server Rank' : 
                                 item.type === 'queue_skip' ? 'Queue Skip' : 'Item'}
                              </p>
                              {item.isGift && (
                                <p className="text-[#E60000] text-xs flex items-center gap-1">
                                  🎁 Gift {item.giftTo?.displayName ? `for ${item.giftTo.displayName}` : ''}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex flex-col items-end">
                                {item.originalPrice && item.originalPrice > item.price && (
                                  <span className="text-xs text-gray-500 line-through">
                                    {formatCurrency(item.originalPrice, 'USD')}
                                  </span>
                                )}
                                <span className="text-white font-medium text-sm">
                                  {formatCurrency(item.price, 'USD')}
                                </span>
                                {item.saleValue && item.saleValue > 0 && (
                                  <span className="text-xs text-green-400">
                                    Save {formatCurrency(item.saleValue, 'USD')}
                                  </span>
                                )}
                              </div>
                              <button
                                onClick={() => removeItem(item.id)}
                                className="text-[#E60000] hover:text-[#ff3333] p-1 rounded transition-colors hover:bg-[#333333]"
                                title="Remove item"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Cart Footer */}
                  {items.length > 0 && (
                    <div className="p-4 border-t border-[#333333] space-y-3">
                      {/* Total */}
                      <div className="flex items-center justify-between">
                        <span className="text-[#CCCCCC] font-medium">Total:</span>
                        <span className="text-white font-bold text-lg">
                          {formatCurrency(total, 'USD')}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={handleClearCart}
                          className="flex items-center justify-center gap-2 px-3 py-2 bg-[#333333] hover:bg-[#444444] text-[#CCCCCC] rounded-md transition-colors text-sm"
                        >
                          <Trash2 className="h-4 w-4" />
                          Clear
                        </button>
                        <button
                          onClick={handleQuickCheckout}
                          className="flex items-center justify-center gap-2 px-3 py-2 bg-[#E60000] hover:bg-[#cc0000] text-white rounded-md transition-all text-sm font-medium"
                        >
                          <CreditCard className="h-4 w-4" />
                          Checkout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>

      {/* Queue Skip Modal */}
      <QueueSkipModal 
        isOpen={showQueueSkipModal} 
        onClose={() => setShowQueueSkipModal(false)} 
      />
    </nav>
  );
}