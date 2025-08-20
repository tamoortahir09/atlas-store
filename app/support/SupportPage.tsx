'use client';

import { useRouter } from 'next/navigation';
import { MessageSquare, Shield, Bug, Users, FileText, ExternalLink } from 'lucide-react';

const supportCategories = [
  {
    id: 'report-cheater',
    title: 'Report Cheater',
    description: 'Report suspected cheaters, hackers, or players violating server rules.',
    icon: Shield,
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30'
  },
  {
    id: 'general-ticket',
    title: 'General Support',
    description: 'Get help with account issues, server problems, or general questions.',
    icon: MessageSquare,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30'
  },
  {
    id: 'bug-report',
    title: 'Bug Report',
    description: 'Report technical issues, server bugs, or gameplay problems.',
    icon: Bug,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/30'
  },
  {
    id: 'staff-application',
    title: 'Staff Application',
    description: 'Apply to join our moderation team and help maintain server quality.',
    icon: Users,
    color: 'text-[#E60000]',
    bgColor: 'bg-[#E60000]/10',
    borderColor: 'border-[#E60000]/30'
  }
];

export default function SupportPage() {
  const router = useRouter();

  const handleCategoryClick = (categoryId: string) => {
    router.push(`/support/${categoryId}`);
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
        {/* Page Header - Reduced spacing */}
        <div className="text-center mb-12">
          <div className="inline-block bg-[#E60000]/20 border border-[#E60000]/50 px-4 py-2 rounded-lg mb-4">
            <span className="text-[#E60000] text-sm font-medium uppercase tracking-wider font-orbitron">
              Support Center
            </span>
          </div>
          
          <h1 className="text-white text-4xl lg:text-5xl font-bold mb-3 font-russo">
            How can we help you?
          </h1>
          <p className="text-[#CCCCCC] text-lg max-w-2xl mx-auto font-orbitron">
            Choose the category that best describes your issue. All support is handled through our website ticketing system.
          </p>
        </div>

        {/* Support Categories Grid - Reduced padding */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {supportCategories.map((category) => {
            const IconComponent = category.icon;
            return (
              <div
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`${category.bgColor} ${category.borderColor} border rounded-xl p-6 cursor-pointer transition-all duration-200 hover:scale-105 hover:bg-opacity-20 group`}
              >
                <div className="flex items-start gap-4">
                  <div className={`${category.bgColor} ${category.borderColor} border rounded-lg p-3`}>
                    <IconComponent size={24} className={category.color} />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-white font-bold text-xl mb-2 group-hover:text-[#E60000] transition-colors font-russo">
                      {category.title}
                    </h3>
                    <p className="text-[#CCCCCC] leading-relaxed text-sm font-orbitron">
                      {category.description}
                    </p>
                    
                    <div className="mt-3 flex items-center gap-2 text-sm text-[#E60000] group-hover:text-white transition-colors font-orbitron">
                      <span>Get Started</span>
                      <ExternalLink size={14} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Links Section - More compact */}
        <div className="bg-[#111111] border border-[#333333] rounded-xl p-6 mb-8">
          <h2 className="text-white font-bold text-xl mb-4 font-russo">Quick Links</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="text-white font-medium mb-2 font-orbitron">Server Rules</h3>
              <p className="text-[#CCCCCC] text-sm mb-2 font-orbitron">
                Review our server rules and community guidelines.
              </p>
              <button 
                onClick={() => router.push('/support/rules')}
                className="text-[#E60000] hover:text-white transition-colors text-sm font-orbitron"
              >
                View Rules →
              </button>
            </div>
            
            <div>
              <h3 className="text-white font-medium mb-2 font-orbitron">FAQ</h3>
              <p className="text-[#CCCCCC] text-sm mb-2 font-orbitron">
                Find answers to commonly asked questions.
              </p>
              <button 
                onClick={() => router.push('/support/faq')}
                className="text-[#E60000] hover:text-white transition-colors text-sm font-orbitron"
              >
                Browse FAQ →
              </button>
            </div>
            
            <div>
              <h3 className="text-white font-medium mb-2 font-orbitron">Discord Community</h3>
              <p className="text-[#CCCCCC] text-sm mb-2 font-orbitron">
                Join our Discord for community discussion and updates.
              </p>
              <button 
                onClick={() => router.push('/support/discord')}
                className="text-[#E60000] hover:text-white transition-colors text-sm font-orbitron"
              >
                Join Discord →
              </button>
            </div>
          </div>
        </div>

        {/* Website Communication Info */}
        <div className="text-center">
          <div className="inline-block bg-[#1a1a1a] border border-[#444444] rounded-xl p-4">
            <h3 className="text-white font-bold text-lg mb-2 font-russo">Support Process</h3>
            <div className="text-[#CCCCCC] text-sm max-w-2xl font-orbitron">
              All support requests are handled through our website ticketing system. You'll receive updates and responses directly through your ticket dashboard.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}