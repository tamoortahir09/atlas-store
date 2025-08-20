'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useAppSelector } from '@/hooks/useRedux';
import { ChevronDown, ChevronUp, Bug, TestTube, Eye, EyeOff } from 'lucide-react';
import { injectDevAuthData, DEV_USER_DATA } from '@/lib/devtools';

export default function DevTools() {
  const { 
    user, 
    isAuthenticated, 
    isSteamLinked, 
    isDiscordLinked, 
    isGoogleLinked, 
    updateUser,
    loading,
    error
  } = useAuth();
  
  const rawState = useAppSelector((state) => state.auth);
  
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'debug' | 'test'>('debug');
  const [showSensitive, setShowSensitive] = useState(false);

  // Use the same user data as devtools.ts for consistency
  const testUserData = DEV_USER_DATA;

  const handleSetTestUser = () => {
    updateUser(testUserData);
    console.log('🧪 Test user data set:', testUserData);
  };

  const handleClearUser = () => {
    updateUser(null);
    console.log('🧪 User data cleared');
  };

  const handleInjectDevAuth = () => {
    injectDevAuthData();
    console.log('🔧 Dev auth data injected - please refresh the page');
  };

  const sanitizeData = (data: any) => {
    if (!data) return data;
    
    const sanitized = { ...data };
    if (!showSensitive) {
      if (sanitized.accessToken) sanitized.accessToken = '[HIDDEN]';
      if (sanitized.refreshToken) sanitized.refreshToken = '[HIDDEN]';
      if (sanitized.store_token) sanitized.store_token = '[HIDDEN]';
    }
    return sanitized;
  };

  // Don't show in production
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    // Disable pointer events for the entire DevTools container so it doesn't block interactions
    // then re-enable them for the interactive children (toggle button and open panel)
    <div className="fixed left-0 top-1/2 -translate-y-1/2 z-[9999] pointer-events-none select-none">
      {/* Toggle Tab */}
      <div className="flex items-center pointer-events-auto select-auto">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`
            bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 
            text-white px-3 py-6 rounded-r-lg flex flex-col items-center justify-center space-y-1
            transition-all duration-300 shadow-lg transform
            ${isOpen ? 'translate-x-0' : 'translate-x-0'}
            writing-mode-vertical
          `}
          style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
        >
          <Bug className="w-4 h-4 rotate-90" />
          <span className="font-medium text-xs tracking-wider">DEV</span>
          {isOpen ? <ChevronUp className="w-3 h-3 rotate-90" /> : <ChevronDown className="w-3 h-3 rotate-90" />}
        </button>

        {/* DevTools Panel */}
        <div className={`
          bg-gray-900 border border-gray-600 rounded-r-lg shadow-2xl w-96 max-h-96 overflow-hidden
          transition-all duration-300 transform
          ${isOpen ? 'translate-x-0 opacity-100 pointer-events-auto' : '-translate-x-full opacity-0 pointer-events-none'}
        `}>
          {/* Tab Headers */}
          <div className="flex bg-gray-800 border-b border-gray-600">
            <button
              onClick={() => setActiveTab('debug')}
              className={`flex-1 px-4 py-2 text-sm font-medium transition-colors flex items-center justify-center space-x-2 ${
                activeTab === 'debug' 
                  ? 'bg-gray-700 text-blue-400 border-b-2 border-blue-400' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              <Bug className="w-4 h-4" />
              <span>Debug</span>
            </button>
            <button
              onClick={() => setActiveTab('test')}
              className={`flex-1 px-4 py-2 text-sm font-medium transition-colors flex items-center justify-center space-x-2 ${
                activeTab === 'test' 
                  ? 'bg-gray-700 text-green-400 border-b-2 border-green-400' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              <TestTube className="w-4 h-4" />
              <span>Test</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-4 text-white text-xs overflow-auto max-h-80">
            {activeTab === 'debug' && (
              <div className="space-y-3">
                {/* Status Indicators */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-gray-800 rounded p-2">
                    <div className="font-semibold text-yellow-400 mb-1">Auth Status</div>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span>Authenticated:</span>
                        <span>{isAuthenticated ? '✅' : '❌'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Loading:</span>
                        <span>{loading ? '⏳' : '✅'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Store Token:</span>
                        <span>{user?.store_token ? '✅' : '❌'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-800 rounded p-2">
                    <div className="font-semibold text-green-400 mb-1">Linked Accounts</div>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span>Steam:</span>
                        <span>{isSteamLinked ? '✅' : '❌'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Discord:</span>
                        <span>{isDiscordLinked ? '✅' : '❌'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>YouTube:</span>
                        <span>{isGoogleLinked ? '✅' : '❌'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Error Display */}
                {error && (
                  <div className="bg-red-900/30 border border-red-500/50 rounded p-2">
                    <div className="font-semibold text-red-400 mb-1">Error</div>
                    <div className="text-red-300 text-xs">{error}</div>
                  </div>
                )}

                {/* Toggle Sensitive Data */}
                <div className="flex items-center justify-between bg-gray-800 rounded p-2">
                  <span className="text-gray-300">Show Sensitive Data</span>
                  <button
                    onClick={() => setShowSensitive(!showSensitive)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {showSensitive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* User Data */}
                <div className="bg-gray-800 rounded p-2">
                  <div className="font-semibold text-blue-400 mb-2">User Data</div>
                  <pre className="text-xs overflow-auto max-h-32 bg-gray-900 p-2 rounded">
                    {JSON.stringify(sanitizeData(user), null, 2)}
                  </pre>
                </div>

                {/* Raw Redux State */}
                <div className="bg-gray-800 rounded p-2">
                  <div className="font-semibold text-purple-400 mb-2">Redux State</div>
                  <pre className="text-xs overflow-auto max-h-32 bg-gray-900 p-2 rounded">
                    {JSON.stringify(sanitizeData(rawState), null, 2)}
                  </pre>
                </div>
              </div>
            )}

            {activeTab === 'test' && (
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-green-400 font-bold mb-2">🧪 Test User Management</h3>
                  <p className="text-gray-300 text-xs mb-4">
                    Use these buttons to test authentication states
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <button 
                    onClick={handleSetTestUser}
                    className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors flex items-center justify-center space-x-2"
                  >
                    <TestTube className="w-4 h-4" />
                    <span>Set Test User Data</span>
                  </button>
                  
                  <button 
                    onClick={handleInjectDevAuth}
                    className="w-full bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors flex items-center justify-center space-x-2"
                  >
                    <Bug className="w-4 h-4" />
                    <span>Inject Dev Auth Data</span>
                  </button>
                  
                  <button 
                    onClick={handleClearUser}
                    className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
                  >
                    Clear User Data
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => window.open('/profile', '_blank')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-xs font-medium transition-colors"
                    >
                      Open Profile
                    </button>
                    
                    <button 
                      onClick={() => window.open('/linking', '_blank')}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded text-xs font-medium transition-colors"
                    >
                      Open Linking
                    </button>
                  </div>
                </div>

                {/* Test User Preview */}
                <div className="bg-gray-800 rounded p-3">
                  <div className="font-semibold text-yellow-400 mb-2">Test User Preview</div>
                  <div className="text-xs space-y-1">
                    <div><strong>Name:</strong> {testUserData.name}</div>
                    <div><strong>Steam ID:</strong> {testUserData.steam_id}</div>
                    <div><strong>Discord ID:</strong> {testUserData.discord_id}</div>
                    <div><strong>Store Token:</strong> {showSensitive ? testUserData.store_token : '[HIDDEN]'}</div>
                    <div><strong>Linked:</strong> {testUserData.isLinked ? '✅' : '❌'}</div>
                    <div><strong>Creator:</strong> {testUserData.isCreator ? '✅' : '❌'}</div>
                  </div>
                </div>

                {/* Quick Auth Tests */}
                <div className="bg-gray-800 rounded p-3">
                  <div className="font-semibold text-orange-400 mb-2">Quick Auth Tests</div>
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        handleSetTestUser();
                        setTimeout(() => window.open('/profile', '_blank'), 500);
                      }}
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded text-xs font-medium transition-colors"
                    >
                      Test: Login → Profile
                    </button>
                    
                    <button
                      onClick={() => {
                        handleInjectDevAuth();
                        setTimeout(() => window.location.reload(), 500);
                      }}
                      className="w-full bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-2 rounded text-xs font-medium transition-colors"
                    >
                      Test: Inject Dev Auth → Reload
                    </button>
                    
                    <button
                      onClick={() => {
                        handleClearUser();
                        setTimeout(() => window.open('/profile', '_blank'), 500);
                      }}
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded text-xs font-medium transition-colors"
                    >
                      Test: No Auth → Profile
                    </button>
                  </div>
                </div>

                {/* Instructions */}
                <div className="bg-blue-900/30 border border-blue-500/50 rounded p-2">
                  <div className="font-semibold text-blue-400 mb-1">Testing Instructions</div>
                  <div className="text-blue-300 text-xs space-y-1">
                    <p>1. Use &quot;Set Test User&quot; for quick Redux testing</p>
                    <p>2. Use &quot;Inject Dev Auth&quot; for localStorage testing</p>
                    <p>3. Check Store Token status in debug tab</p>
                    <p>4. Test profile page PayNow integration</p>
                    <p>5. Use &quot;Clear User Data&quot; to test auth guards</p>
                    <p>6. Check console for debug logs</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 