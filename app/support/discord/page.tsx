'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MessageCircle, ExternalLink, Users, Headphones, Bell } from 'lucide-react';

export default function DiscordPage() {
  const router = useRouter();
  const discordInviteUrl = 'https://discord.gg/atlasrust'; // Replace with your actual Discord invite

  const handleBackClick = () => {
    router.push('/support');
  };

  const handleJoinDiscord = () => {
    window.open(discordInviteUrl, '_blank');
  };

  // Auto redirect after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      window.open(discordInviteUrl, '_blank');
    }, 5000);

    return () => clearTimeout(timer);
  }, [discordInviteUrl]);

  return (
    <div className="bg-black pt-20 pb-16 font-orbitron">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-[0.02] pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20px 20px, #E60000 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="max-w-4xl mx-auto px-6 relative">
        {/* Back Button */}
        <button
          onClick={handleBackClick}
          className="flex items-center gap-2 text-[#CCCCCC] hover:text-white transition-colors mb-6 font-orbitron"
        >
          <ArrowLeft size={16} />
          <span>Back to Support</span>
        </button>

        {/* Main Content */}
        <div className="text-center">
          {/* Discord Logo */}
          <div className="bg-[#5865F2]/20 border border-[#5865F2]/50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <MessageCircle className="text-[#5865F2]" size={48} />
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-white text-4xl lg:text-5xl font-bold mb-3 font-russo">
              Join Our Discord
            </h1>
            <p className="text-[#CCCCCC] text-lg max-w-2xl mx-auto font-orbitron">
              Connect with the Atlas community, get real-time updates, and chat with other players and staff members.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-[#111111] border border-[#333333] rounded-xl p-6">
              <Users className="text-[#E60000] mx-auto mb-4" size={32} />
              <h3 className="text-white font-bold text-lg mb-2 font-russo">Community Chat</h3>
              <p className="text-[#CCCCCC] text-sm font-orbitron">
                Connect with thousands of Atlas players, share tips, and make new friends.
              </p>
            </div>

            <div className="bg-[#111111] border border-[#333333] rounded-xl p-6">
              <Bell className="text-[#E60000] mx-auto mb-4" size={32} />
              <h3 className="text-white font-bold text-lg mb-2 font-russo">Server Updates</h3>
              <p className="text-[#CCCCCC] text-sm font-orbitron">
                Get instant notifications about wipes, events, maintenance, and server news.
              </p>
            </div>

            <div className="bg-[#111111] border border-[#333333] rounded-xl p-6">
              <Headphones className="text-[#E60000] mx-auto mb-4" size={32} />
              <h3 className="text-white font-bold text-lg mb-2 font-russo">Live Support</h3>
              <p className="text-[#CCCCCC] text-sm font-orbitron">
                Get quick help from staff and community members for urgent issues.
              </p>
            </div>
          </div>

          {/* Join Button */}
          <div className="mb-8">
            <button
              onClick={handleJoinDiscord}
              className="bg-[#5865F2] hover:bg-[#4752C4] text-white px-8 py-4 rounded-lg transition-all duration-300 font-bold text-lg flex items-center gap-3 mx-auto shadow-xl hover:scale-105 font-orbitron"
            >
              <MessageCircle size={24} />
              Join Atlas Discord
              <ExternalLink size={20} />
            </button>
          </div>

          {/* Auto Redirect Notice */}
          <div className="bg-[#5865F2]/10 border border-[#5865F2]/30 rounded-xl p-4 mb-8">
            <p className="text-[#CCCCCC] text-sm font-orbitron">
              🚀 You will be automatically redirected to Discord in a few seconds, or click the button above to join now.
            </p>
          </div>

          {/* Discord Rules Preview */}
          <div className="bg-[#111111] border border-[#333333] rounded-xl p-6 text-left">
            <h3 className="text-white font-bold text-lg mb-4 font-russo text-center">
              Discord Server Rules
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <ul className="space-y-2 text-[#CCCCCC] font-orbitron">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-[#E60000] rounded-full mt-2 flex-shrink-0"></div>
                    <span>Be respectful to all members</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-[#E60000] rounded-full mt-2 flex-shrink-0"></div>
                    <span>No spam or excessive caps</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-[#E60000] rounded-full mt-2 flex-shrink-0"></div>
                    <span>Use appropriate channels</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-[#E60000] rounded-full mt-2 flex-shrink-0"></div>
                    <span>No NSFW content</span>
                  </li>
                </ul>
              </div>
              <div>
                <ul className="space-y-2 text-[#CCCCCC] font-orbitron">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-[#E60000] rounded-full mt-2 flex-shrink-0"></div>
                    <span>No advertising other servers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-[#E60000] rounded-full mt-2 flex-shrink-0"></div>
                    <span>Follow Discord Terms of Service</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-[#E60000] rounded-full mt-2 flex-shrink-0"></div>
                    <span>Listen to staff instructions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-[#E60000] rounded-full mt-2 flex-shrink-0"></div>
                    <span>Have fun and be helpful!</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 