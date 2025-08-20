'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Shield, AlertTriangle, Users, Zap, Ban, MessageSquare } from 'lucide-react';

const ruleCategories = [
  {
    id: 'general',
    title: 'General Server Rules',
    icon: Shield,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    rules: [
      'No cheating, hacking, or exploiting of any kind',
      'No racism, sexism, homophobia, or hate speech',
      'No doxxing or sharing personal information',
      'English only in global chat',
      'No spamming in chat or voice channels',
      'Respect all players and staff members',
      'No advertising other servers or communities'
    ]
  },
  {
    id: 'gameplay',
    title: 'Gameplay Rules',
    icon: Zap,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/30',
    rules: [
      'No griefing or excessive raiding of new players',
      'No blocking monuments, roads, or recyclers',
      'Maximum 4 players per team/clan',
      'No roof camping for extended periods',
      'No excessive toxicity or harassment',
      'No stream sniping or ghosting',
      'Follow the server wipe schedule'
    ]
  },
  {
    id: 'building',
    title: 'Building & Base Rules',
    icon: Users,
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/30',
    rules: [
      'No building in caves or underground areas',
      'No excessive honeycomb or spam building',
      'No building too close to monuments (100m minimum)',
      'No blocking loot spawns or resource nodes',
      'Maximum base height restrictions apply',
      'No building on roads or pathways',
      'Clean up abandoned structures'
    ]
  },
  {
    id: 'violations',
    title: 'Violations & Penalties',
    icon: Ban,
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
    rules: [
      'First offense: Warning or temporary mute',
      'Second offense: 24-48 hour temporary ban',
      'Third offense: 7-day temporary ban',
      'Severe violations: Permanent ban',
      'Cheating/hacking: Immediate permanent ban',
      'Ban evasion: Extended permanent ban',
      'Appeals can be made through support tickets'
    ]
  }
];

export default function RulesPage() {
  const router = useRouter();

  const handleBackClick = () => {
    router.push('/support');
  };

  return (
    <div className="bg-black pt-20 pb-16 font-orbitron">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-[0.02] pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20px 20px, #E60000 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="max-w-6xl mx-auto px-6 relative">
        {/* Back Button */}
        <button
          onClick={handleBackClick}
          className="flex items-center gap-2 text-[#CCCCCC] hover:text-white transition-colors mb-6 font-orbitron"
        >
          <ArrowLeft size={16} />
          <span>Back to Support</span>
        </button>

        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-[#E60000]/20 border border-[#E60000]/50 px-4 py-2 rounded-lg mb-4">
            <span className="text-[#E60000] text-sm font-medium uppercase tracking-wider font-orbitron">
              Server Rules
            </span>
          </div>
          
          <h1 className="text-white text-4xl lg:text-5xl font-bold mb-3 font-russo">
            Atlas Server Rules
          </h1>
          <p className="text-[#CCCCCC] text-lg max-w-3xl mx-auto font-orbitron">
            Please read and follow all server rules to ensure a fair and enjoyable experience for everyone. 
            Violations may result in warnings, temporary bans, or permanent bans depending on severity.
          </p>
        </div>

        {/* Important Notice */}
        <div className="bg-[#E60000]/10 border border-[#E60000]/30 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <AlertTriangle className="text-[#E60000] mt-1" size={24} />
            <div>
              <h3 className="text-white font-bold text-lg mb-2 font-russo">Important Notice</h3>
              <p className="text-[#CCCCCC] font-orbitron">
                By playing on Atlas servers, you agree to follow these rules. Ignorance of the rules is not an excuse for violations. 
                Rules are subject to change at any time. Staff decisions are final.
              </p>
            </div>
          </div>
        </div>

        {/* Rules Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {ruleCategories.map((category) => {
            const IconComponent = category.icon;
            return (
              <div
                key={category.id}
                className={`${category.bgColor} ${category.borderColor} border rounded-xl p-6`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`${category.bgColor} ${category.borderColor} border rounded-lg p-3`}>
                    <IconComponent size={24} className={category.color} />
                  </div>
                  <h3 className="text-white font-bold text-xl font-russo">
                    {category.title}
                  </h3>
                </div>
                
                <ul className="space-y-3">
                  {category.rules.map((rule, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#E60000] rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-[#CCCCCC] font-orbitron leading-relaxed">
                        {rule}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Report Violations */}
        <div className="bg-[#111111] border border-[#333333] rounded-xl p-6">
          <div className="text-center">
            <MessageSquare className="text-[#E60000] mx-auto mb-4" size={32} />
            <h3 className="text-white font-bold text-xl mb-2 font-russo">
              Report Rule Violations
            </h3>
            <p className="text-[#CCCCCC] mb-4 font-orbitron">
              If you witness rule violations, please report them through our support system.
            </p>
            <button
              onClick={() => router.push('/support/report-cheater')}
              className="bg-[#E60000] hover:bg-[#cc0000] text-white px-6 py-3 rounded-lg transition-colors font-orbitron font-medium"
            >
              Report Player
            </button>
          </div>
        </div>

        {/* Last Updated */}
        <div className="text-center mt-8">
          <p className="text-[#666666] text-sm font-orbitron">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
} 