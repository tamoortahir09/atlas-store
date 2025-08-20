'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, HelpCircle, ChevronDown, ChevronUp, Search, Server, ShoppingBag, Users, Settings } from 'lucide-react';

const faqCategories = [
  {
    id: 'server',
    title: 'Server & Connection',
    icon: Server,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    faqs: [
      {
        question: 'How do I connect to Atlas servers?',
        answer: 'You can connect by pressing F1 in Rust and typing "connect [server-ip]" or by finding our servers in the modded server list. Our server IPs are available on the main website.'
      },
      {
        question: 'What are the server wipe schedules?',
        answer: 'Our main servers wipe every Thursday at 3PM AEST. Map wipes occur weekly, while BP wipes happen monthly. Check our Discord for exact wipe times and announcements.'
      },
      {
        question: 'Why can\'t I connect to the server?',
        answer: 'Common issues include: server being full, outdated Rust client, network connectivity issues, or being banned. Try restarting Rust and Steam, or check our Discord for server status updates.'
      },
      {
        question: 'What is the server population and queue system?',
        answer: 'Our servers support up to 200 players. VIP members get priority queue access during high traffic times. Queue times vary based on server popularity and time of day.'
      }
    ]
  },
  {
    id: 'store',
    title: 'Store & Purchases',
    icon: ShoppingBag,
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/30',
    faqs: [
      {
        question: 'How do I purchase VIP or ranks?',
        answer: 'Visit our store page, select your desired rank or package, and complete the purchase through our secure payment system. Items are delivered automatically after payment confirmation.'
      },
      {
        question: 'When do I receive my purchased items?',
        answer: 'Most purchases are delivered instantly after payment confirmation. If you don\'t receive your items within 10 minutes, please create a support ticket with your purchase details.'
      },
      {
        question: 'Can I refund my purchase?',
        answer: 'Refunds are handled case-by-case. Digital goods are generally non-refundable once delivered, but we may consider refunds for technical issues or billing errors within 48 hours of purchase.'
      },
      {
        question: 'Do my purchases carry over between wipes?',
        answer: 'Yes! All purchased ranks, VIP status, and cosmetic items persist through wipes. Only in-game items obtained through kits will need to be reclaimed after each wipe.'
      }
    ]
  },
  {
    id: 'gameplay',
    title: 'Gameplay & Rules',
    icon: Users,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/30',
    faqs: [
      {
        question: 'What is the team limit on Atlas servers?',
        answer: 'Maximum team size is 4 players. This includes formal teams, alliances, and informal cooperation. Exceeding this limit may result in warnings or bans.'
      },
      {
        question: 'Are there any building restrictions?',
        answer: 'Yes. You cannot build within 100m of monuments, block roads/pathways, or build in caves. Excessive honeycomb and spam building are also prohibited.'
      },
      {
        question: 'What happens if I break server rules?',
        answer: 'Violations result in escalating penalties: warnings, temporary mutes, temporary bans (24h-7d), or permanent bans for severe violations. Cheating results in immediate permanent bans.'
      },
      {
        question: 'Can I appeal a ban or punishment?',
        answer: 'Yes, you can appeal through our support ticket system. Provide your Steam ID, ban reason, and explanation. Appeals are reviewed by senior staff members.'
      }
    ]
  },
  {
    id: 'technical',
    title: 'Technical Support',
    icon: Settings,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
    faqs: [
      {
        question: 'I\'m experiencing lag or performance issues',
        answer: 'Try lowering graphics settings, verifying Rust files through Steam, updating drivers, and closing unnecessary programs. If issues persist, check our Discord for server status or create a bug report.'
      },
      {
        question: 'My items disappeared or I lost progress',
        answer: 'Item loss can occur due to server restarts, rollbacks, or bugs. We cannot restore lost items in most cases, but you can report persistent bugs through our bug report system.'
      },
      {
        question: 'How do I report cheaters or rule violations?',
        answer: 'Use our "Report Cheater" form in the support section. Provide the player\'s Steam ID, server, evidence (screenshots/videos), and detailed description of the violation.'
      },
      {
        question: 'The website or store isn\'t working properly',
        answer: 'Try clearing your browser cache, disabling ad blockers, or using a different browser. If issues persist, create a general support ticket with details about the problem.'
      }
    ]
  }
];

export default function FAQPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const handleBackClick = () => {
    router.push('/support');
  };

  const toggleExpanded = (categoryId: string, faqIndex: number) => {
    const itemId = `${categoryId}-${faqIndex}`;
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const isExpanded = (categoryId: string, faqIndex: number) => {
    return expandedItems.includes(`${categoryId}-${faqIndex}`);
  };

  // Filter FAQs based on search term
  const filteredCategories = faqCategories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq => 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0 || searchTerm === '');

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
              Frequently Asked Questions
            </span>
          </div>
          
          <h1 className="text-white text-4xl lg:text-5xl font-bold mb-3 font-russo">
            FAQ
          </h1>
          <p className="text-[#CCCCCC] text-lg max-w-3xl mx-auto font-orbitron">
            Find answers to common questions about Atlas servers, gameplay, purchases, and technical issues.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#666666]" size={20} />
          <input
            type="text"
            placeholder="Search frequently asked questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#111111] border border-[#333333] rounded-xl pl-12 pr-4 py-4 text-white placeholder-[#666666] focus:border-[#E60000] focus:outline-none transition-colors font-orbitron"
          />
        </div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {filteredCategories.map((category) => {
            const IconComponent = category.icon;
            return (
              <div key={category.id} className="space-y-4">
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className={`${category.bgColor} ${category.borderColor} border rounded-lg p-3`}>
                    <IconComponent size={24} className={category.color} />
                  </div>
                  <h2 className="text-white font-bold text-2xl font-russo">
                    {category.title}
                  </h2>
                </div>

                {/* FAQ Items */}
                <div className="space-y-3">
                  {category.faqs.map((faq, index) => (
                    <div
                      key={index}
                      className="bg-[#111111] border border-[#333333] rounded-xl overflow-hidden"
                    >
                      <button
                        onClick={() => toggleExpanded(category.id, index)}
                        className="w-full flex items-center justify-between p-6 text-left hover:bg-[#1a1a1a] transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <HelpCircle className="text-[#E60000] flex-shrink-0" size={20} />
                          <h3 className="text-white font-medium font-orbitron">
                            {faq.question}
                          </h3>
                        </div>
                        {isExpanded(category.id, index) ? (
                          <ChevronUp className="text-[#CCCCCC] flex-shrink-0" size={20} />
                        ) : (
                          <ChevronDown className="text-[#CCCCCC] flex-shrink-0" size={20} />
                        )}
                      </button>
                      
                      {isExpanded(category.id, index) && (
                        <div className="px-6 pb-6 border-t border-[#333333]">
                          <div className="pt-4">
                            <p className="text-[#CCCCCC] leading-relaxed font-orbitron">
                              {faq.answer}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* No Results */}
        {searchTerm && filteredCategories.every(cat => cat.faqs.length === 0) && (
          <div className="text-center py-12">
            <HelpCircle className="text-[#666666] mx-auto mb-4" size={48} />
            <h3 className="text-white font-bold text-xl mb-2 font-russo">
              No Results Found
            </h3>
            <p className="text-[#CCCCCC] mb-4 font-orbitron">
                             No FAQs match your search term &quot;{searchTerm}&quot;. Try different keywords or browse all categories.
            </p>
            <button
              onClick={() => setSearchTerm('')}
              className="bg-[#E60000] hover:bg-[#cc0000] text-white px-6 py-3 rounded-lg transition-colors font-orbitron font-medium"
            >
              Clear Search
            </button>
          </div>
        )}

        {/* Still Need Help */}
        <div className="bg-[#111111] border border-[#333333] rounded-xl p-6 mt-12">
          <div className="text-center">
            <HelpCircle className="text-[#E60000] mx-auto mb-4" size={32} />
            <h3 className="text-white font-bold text-xl mb-2 font-russo">
              Still Need Help?
            </h3>
            <p className="text-[#CCCCCC] mb-4 font-orbitron">
                             Can&apos;t find what you&apos;re looking for? Create a support ticket and our team will help you.
            </p>
            <button
              onClick={() => router.push('/support/general-ticket')}
              className="bg-[#E60000] hover:bg-[#cc0000] text-white px-6 py-3 rounded-lg transition-colors font-orbitron font-medium"
            >
              Create Support Ticket
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 