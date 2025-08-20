'use client';

import { useState, useEffect } from 'react';
import { Copy, CheckCircle, ExternalLink, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import DevTools from '@/components/DevTools';

export default function LinkingPage() {
  const router = useRouter();
  const { 
    user, 
    loading, 
    error, 
    isSteamLinked, 
    isDiscordLinked, 
    isGoogleLinked,
    login,
    unlink,
    clearError
  } = useAuth();

  const [copiedSteam, setCopiedSteam] = useState(false);
  const [copiedDiscord, setCopiedDiscord] = useState(false);

  const copyToClipboard = async (text: string, type: 'steam' | 'discord') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'steam') {
        setCopiedSteam(true);
        setTimeout(() => setCopiedSteam(false), 2000);
      } else {
        setCopiedDiscord(true);
        setTimeout(() => setCopiedDiscord(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleUnlinkDiscord = async () => {
    try {
      await unlink.discord();
    } catch (err) {
      console.error('Failed to unlink Discord:', err);
    }
  };

  const handleUnlinkGoogle = async () => {
    try {
      await unlink.google();
    } catch (err) {
      console.error('Failed to unlink Google:', err);
    }
  };

  // Check if all required accounts are linked
  const allRequiredComplete = isSteamLinked;

  // Handle navigation after successful linking
  useEffect(() => {
    if (allRequiredComplete && user?.steam_id) {
      // Optional: Redirect to dashboard after successful linking
      // router.push('/dashboard');
    }
  }, [allRequiredComplete, user, router]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: 'url(/linking/linking-background.webp)' 
          }}
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--atlas-red)] mx-auto mb-4"></div>
            <p className="text-[var(--atlas-light-gray)]">Loading your account information...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: 'url(/linking/linking-background.webp)' 
        }}
      />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/30" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-20">
        {/* Header */}
        <div className="text-center mb-12 max-w-2xl">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 competitive-text">
            Link Your Accounts
          </h1>
          <p className="text-lg text-[var(--atlas-light-gray)] leading-relaxed">
            Kindly link your Steam and Discord accounts to access the platform.
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="w-full max-w-2xl mb-6">
            <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-red-300 text-sm">{error}</p>
              <button 
                onClick={() => clearError()}
                className="ml-auto text-red-400 hover:text-red-300"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Account Linking Cards */}
        <div className="w-full max-w-2xl space-y-6">
          
          {/* Steam Account */}
          <div className="bg-black/60 backdrop-blur-sm border border-[#333333] rounded-lg p-6 transition-all duration-300 hover:border-[var(--atlas-red)]/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  isSteamLinked 
                    ? 'bg-gradient-to-br from-[var(--atlas-red)] to-[var(--atlas-red-hover)]' 
                    : 'bg-gray-600'
                }`}>
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                    <path d="M16.5 5a4.5 4.5 0 1 1-.653 8.953L11.5 16.962V17a3 3 0 0 1-2.824 3H8.5a3 3 0 0 1-2.94-2.402L3 16.5V13l3.51 1.755a2.99 2.99 0 0 1 2.834-.635l2.727-3.818A4.5 4.5 0 0 1 16.5 5"></path>
                    <circle cx="16.5" cy="9.5" r="1" fill="currentColor"></circle>
                  </svg>
                </div>
                <div className="flex-1">
                  {isSteamLinked ? (
                    <>
                      <h3 className="text-white font-medium competitive-text">{user?.name || 'Steam User'}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                        <span className="text-[var(--atlas-light-gray)] text-sm font-mono">{user?.steam_id}</span>
                    <button
                          onClick={() => copyToClipboard(user?.steam_id || '', 'steam')}
                      className="text-[var(--atlas-light-gray)] hover:text-white transition-colors"
                    >
                      {copiedSteam ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                    </>
                  ) : (
                    <>
                      <h3 className="text-white font-medium competitive-text">Link Steam Account</h3>
                      <p className="text-[var(--atlas-light-gray)] text-sm">
                        Connect your Steam account to enable gaming features
                      </p>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-3">
                {isSteamLinked ? (
                  <>
                    <span className="text-xs text-red-400 font-medium">Required</span>
              <CheckCircle className="w-6 h-6 text-green-500" />
                  </>
                ) : (
                  <>
                    <span className="text-xs text-red-400 font-medium">Required</span>
                    <button 
                      onClick={login.steam}
                      className="bg-[var(--atlas-red)] hover:bg-[var(--atlas-red-hover)] text-white px-6 py-2 rounded text-sm font-medium transition-colors"
                    >
                      Connect
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Discord Account */}
          <div className="bg-black/60 backdrop-blur-sm border border-[#333333] rounded-lg p-6 transition-all duration-300 hover:border-[var(--atlas-red)]/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  isDiscordLinked ? 'bg-[#5865F2]' : 'bg-gray-600'
                }`}>
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                  </svg>
                </div>
                <div className="flex-1">
                  {isDiscordLinked ? (
                    <>
                      <h3 className="text-white font-medium competitive-text">{user?.discord_name || 'Discord User'}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-[var(--atlas-light-gray)] text-sm font-mono">{user?.discord_id}</span>
                    <button
                          onClick={() => copyToClipboard(user?.discord_id || '', 'discord')}
                      className="text-[var(--atlas-light-gray)] hover:text-white transition-colors"
                    >
                      {copiedDiscord ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                    </>
                  ) : (
                    <>
                      <h3 className="text-white font-medium competitive-text">Link Discord Account</h3>
                      <p className="text-[var(--atlas-light-gray)] text-sm">
                        Connect Discord for community features and notifications
                      </p>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-3">
                {isDiscordLinked ? (
                  <>
                    <button 
                      onClick={handleUnlinkDiscord}
                      className="bg-[var(--atlas-red)] hover:bg-[var(--atlas-red-hover)] text-white px-4 py-2 rounded text-sm font-medium transition-colors"
                    >
                      Unlink
                </button>
                <CheckCircle className="w-6 h-6 text-green-500" />
                  </>
                ) : (
                  <button 
                    onClick={login.discord}
                    disabled={!isSteamLinked}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Connect
                  </button>
                )}
              </div>
            </div>
          </div>

                    {/* YouTube Account */}
          <div className="bg-black/60 backdrop-blur-sm border border-[#333333] rounded-lg p-6 transition-all duration-300 hover:border-[var(--atlas-red)]/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  isGoogleLinked ? 'bg-[#FF0000]' : 'bg-gray-600'
                }`}>
                  {isGoogleLinked && user?.creator?.image_url ? (
                    <img 
                      src={user.creator.image_url} 
                      alt="Creator Avatar"
                      className="w-full h-full rounded-lg object-cover"
                    />
                  ) : (
                    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  {isGoogleLinked ? (
                    <>
                      <h3 className="text-white font-medium competitive-text">{user?.creator?.name || 'Creator'}</h3>
                      <p className="text-[var(--atlas-light-gray)] text-sm">
                        {user?.creator?.email}
                      </p>
                    </>
                  ) : (
                    <>
                      <h3 className="text-white font-medium competitive-text">Link your YouTube Account</h3>
                      <p className="text-[var(--atlas-light-gray)] text-sm">
                        Are you a creator? Join our creator program and earn rewards.
                      </p>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-3">
                {isGoogleLinked ? (
                  <>
                    <button 
                      onClick={handleUnlinkGoogle}
                      className="bg-[var(--atlas-red)] hover:bg-[var(--atlas-red-hover)] text-white px-4 py-2 rounded text-sm font-medium transition-colors"
                    >
                      Unlink
                    </button>
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  </>
                ) : (
                  <button 
                    onClick={login.google}
                    disabled={!isSteamLinked}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded text-sm font-medium transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>Connect</span>
                    <ExternalLink className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {allRequiredComplete && (
          <div className="mt-8 text-center">
            <div className="bg-green-900/20 border border-green-500/50 rounded-lg p-4 flex items-center justify-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
              <p className="text-green-300">
                ✅ All required accounts linked! You can now access the platform.
              </p>
            </div>
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-12 text-center">
          <p className="text-[var(--atlas-light-gray)] text-sm">
            Need help? Contact our{" "}
            <a href="/support" className="text-[var(--atlas-red)] hover:text-[var(--atlas-red-hover)] transition-colors underline">
              support team
            </a>
          </p>
        </div>
      </div>
      
      {/* DevTools Component */}
      <DevTools />
    </div>
  );
} 