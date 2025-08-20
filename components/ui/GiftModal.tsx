'use client';

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Gift, X, Loader, ExternalLink, Info } from 'lucide-react';

interface GiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (giftInfo: { platform: string; id: string; displayName?: string }[]) => void;
  itemName: string;
}

export function GiftModal({ isOpen, onClose, onSubmit, itemName }: GiftModalProps) {
  const [steam64, setSteam64] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState('');

  const validateSteam64 = (id: string): boolean => {
    // Steam64 ID should be 17 digits and start with 7656119
    return /^7656119\d{10}$/.test(id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!steam64.trim()) {
      setError('Please enter a Steam64 ID');
      return;
    }

    if (!validateSteam64(steam64)) {
      setError('Invalid Steam64 ID format. Steam64 IDs should be 17 digits starting with 7656119.');
      return;
    }

    setIsValidating(true);
    setError('');

    try {
      const giftInfo = [{
        platform: 'steam',
        id: steam64,
        displayName: displayName.trim() || `User ${steam64.slice(-4)}`,
      }];

      onSubmit(giftInfo);
      
      // Reset form
      setSteam64('');
      setDisplayName('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsValidating(false);
    }
  };

  const handleClose = () => {
    setSteam64('');
    setDisplayName('');
    setError('');
    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={handleClose} 
      />

      {/* Modal Container */}
      <div className="relative bg-gradient-to-br from-rank-default-800 via-rank-default-900 to-rank-default-900 rounded-2xl w-full max-w-md border border-rank-default-700 shadow-2xl shadow-black/50">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white/10 border border-white/20">
              <Gift className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Gift {itemName}</h2>
              <p className="text-rank-default-400 text-sm">Send this item to a friend</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-white/70 hover:text-white transition-colors p-1"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Steam64 ID Input */}
            <div>
              <label className="block text-white font-medium mb-2">
                Recipient's Steam64 ID *
              </label>
              <input
                type="text"
                value={steam64}
                onChange={(e) => setSteam64(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="76561198000000000"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50
                  focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30
                  transition-all duration-200"
              />
            </div>

            {/* Display Name Input */}
            <div>
              <label className="block text-white font-medium mb-2">
                Recipient's Name (Optional)
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Friend's name for your reference"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50
                  focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30
                  transition-all duration-200"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            {/* Help Section */}
            <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
              <div className="flex items-start gap-3">
                <Info className="h-4 w-4 text-rank-default-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-rank-default-400">
                  <p className="font-medium mb-2">How to find Steam64 ID:</p>
                  <ol className="list-decimal list-inside space-y-1 text-white/80 text-xs mb-2">
                    <li>Go to your Steam profile</li>
                    <li>Copy the profile URL</li>
                    <li>Use a Steam ID converter online</li>
                  </ol>
                  <a 
                    href="https://steamid.io/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-white hover:text-rank-default-300 transition-colors text-xs"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Steam ID Converter
                  </a>
                </div>
              </div>
            </div>

            {/* Gift Info */}
            <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
              <div className="flex items-center gap-2 text-rank-default-400 text-sm">
                <Gift className="h-4 w-4 flex-shrink-0" />
                <span>The gift will be delivered directly to the recipient's Steam account after purchase.</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white border border-white/20 py-3 rounded-lg font-medium transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isValidating || !steam64.trim()}
                className="flex-1 bg-white/20 hover:bg-white/30 text-white py-3 rounded-lg font-medium transition-all
                  disabled:opacity-50 disabled:cursor-not-allowed border border-white/30"
              >
                {isValidating ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader className="h-4 w-4 animate-spin" />
                    <span>Sending...</span>
                  </div>
                ) : (
                  'Send Gift'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  // Use createPortal to render the modal at the document root level
  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null;
} 