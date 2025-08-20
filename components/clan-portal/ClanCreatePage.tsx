'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, Users, Globe, Bot, Crown, Zap, Star, Lock, Check } from 'lucide-react';

const regions = [
  { id: 'NA', name: 'North America', flag: '🇺🇸' },
  { id: 'EU', name: 'Europe', flag: '🇪🇺' },
  { id: 'AS', name: 'Asia', flag: '🌏' },
  { id: 'OC', name: 'Oceania', flag: '🇦🇺' },
  { id: 'SA', name: 'South America', flag: '🇧🇷' }
];

const servers = [
  { id: 'atlas-main', name: 'Atlas Main (10x)', type: '10x' },
  { id: 'atlas-vanilla', name: 'Atlas Vanilla', type: 'Vanilla' },
  { id: 'atlas-hardcore', name: 'Atlas Hardcore (5x)', type: '5x' },
  { id: 'atlas-creative', name: 'Atlas Creative', type: 'Creative' }
];

const premiumFeatures = [
  {
    id: 'custom-logo',
    name: 'Custom Logo Upload',
    description: 'Upload your own clan logo instead of using emojis',
    cost: 500,
    icon: Upload
  },
  {
    id: 'name-change',
    name: 'Name Changes',
    description: 'Ability to change clan name and tag after creation',
    cost: 250,
    icon: Crown
  },
  {
    id: 'custom-banner',
    name: 'Custom Banner',
    description: 'Personalized banner for your clan profile',
    cost: 750,
    icon: Star
  },
  {
    id: 'priority-support',
    name: 'Priority Support',
    description: 'Faster response time for clan-related issues',
    cost: 300,
    icon: Zap
  }
];

export default function ClanCreatePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    tag: '',
    description: '',
    region: '',
    server: '',
    type: 'competitive',
    isPublic: true,
    discordIntegration: true,
    selectedFeatures: [] as string[]
  });
  const [logoEmoji, setLogoEmoji] = useState('⚡');
  const [loading, setLoading] = useState(false);

  const handleBackClick = () => {
    router.push('/clans');
  };

  const handleNextStep = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleFeature = (featureId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedFeatures: prev.selectedFeatures.includes(featureId)
        ? prev.selectedFeatures.filter(id => id !== featureId)
        : [...prev.selectedFeatures, featureId]
    }));
  };

  const getTotalCost = () => {
    return formData.selectedFeatures.reduce((total, featureId) => {
      const feature = premiumFeatures.find(f => f.id === featureId);
      return total + (feature?.cost || 0);
    }, 0);
  };

  const handleCreateClan = async () => {
    setLoading(true);
    
    // Simulate clan creation process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Redirect to dashboard system
    router.push('/dashboard');
  };

  const emojiOptions = ['⚡', '🔥', '💎', '🏆', '⚔️', '🛡️', '👑', '🎯', '🚀', '💀', '🐺', '🦅', '🐉', '⭐', '💫', '🌟'];

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Back Button */}
        <button
          onClick={handleBackClick}
          className="flex items-center gap-2 text-[#CCCCCC] hover:text-white transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          <span>Back to Clans</span>
        </button>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-black text-white mb-4">
            Create Your <span className="text-[#E60000]">Clan</span>
          </h1>
          <p className="text-xl text-[#CCCCCC]">Build your empire and dominate the competition</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12">
          {[1, 2, 3, 4].map((stepNum) => (
            <div key={stepNum} className="flex items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                stepNum <= step 
                  ? 'bg-[#E60000] text-white' 
                  : 'bg-[#333333] text-[#CCCCCC]'
              }`}>
                {stepNum < step ? <Check size={20} /> : stepNum}
              </div>
              {stepNum < 4 && (
                <div className={`w-16 h-1 mx-2 ${
                  stepNum < step ? 'bg-[#E60000]' : 'bg-[#333333]'
                }`}></div>
              )}
            </div>
          ))}
        </div>

        {/* Form Container */}
        <div className="bg-[#111111] border border-[#444444] rounded-2xl p-8">
          
          {/* Step 1: Basic Information */}
          {step === 1 && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Basic Information</h2>
                <p className="text-[#CCCCCC]">Choose your clan name, tag, and visual identity</p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-medium text-[#CCCCCC] mb-2">Clan Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter clan name"
                    className="w-full bg-[#222222] border border-[#444444] rounded-lg px-4 py-3 text-white placeholder-[#CCCCCC] focus:outline-none focus:ring-2 focus:ring-[#E60000] focus:border-[#E60000]"
                    maxLength={30}
                  />
                  <div className="text-xs text-[#666666] mt-1">{formData.name.length}/30 characters</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#CCCCCC] mb-2">Clan Tag</label>
                  <input
                    type="text"
                    value={formData.tag}
                    onChange={(e) => handleInputChange('tag', e.target.value.toUpperCase())}
                    placeholder="TAG"
                    className="w-full bg-[#222222] border border-[#444444] rounded-lg px-4 py-3 text-white placeholder-[#CCCCCC] focus:outline-none focus:ring-2 focus:ring-[#E60000] focus:border-[#E60000]"
                    maxLength={5}
                  />
                  <div className="text-xs text-[#666666] mt-1">{formData.tag.length}/5 characters</div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#CCCCCC] mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your clan's mission and goals..."
                  rows={4}
                  className="w-full bg-[#222222] border border-[#444444] rounded-lg px-4 py-3 text-white placeholder-[#CCCCCC] focus:outline-none focus:ring-2 focus:ring-[#E60000] focus:border-[#E60000]"
                  maxLength={500}
                />
                <div className="text-xs text-[#666666] mt-1">{formData.description.length}/500 characters</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#CCCCCC] mb-4">Clan Logo</label>
                <div className="grid grid-cols-8 gap-3">
                  {emojiOptions.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => setLogoEmoji(emoji)}
                      className={`w-12 h-12 text-2xl rounded-lg border-2 transition-all ${
                        logoEmoji === emoji
                          ? 'border-[#E60000] bg-[#E60000]/20'
                          : 'border-[#444444] hover:border-[#666666]'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Server & Region */}
          {step === 2 && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Server & Region</h2>
                <p className="text-[#CCCCCC]">Select your primary region and server</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#CCCCCC] mb-4">Primary Region</label>
                <div className="grid md:grid-cols-3 gap-4">
                  {regions.map((region) => (
                    <button
                      key={region.id}
                      onClick={() => handleInputChange('region', region.id)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        formData.region === region.id
                          ? 'border-[#E60000] bg-[#E60000]/20'
                          : 'border-[#444444] hover:border-[#666666]'
                      }`}
                    >
                      <div className="text-2xl mb-2">{region.flag}</div>
                      <div className="text-white font-medium">{region.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#CCCCCC] mb-4">Primary Server</label>
                <div className="grid md:grid-cols-2 gap-4">
                  {servers.map((server) => (
                    <button
                      key={server.id}
                      onClick={() => handleInputChange('server', server.id)}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        formData.server === server.id
                          ? 'border-[#E60000] bg-[#E60000]/20'
                          : 'border-[#444444] hover:border-[#666666]'
                      }`}
                    >
                      <div className="text-white font-medium">{server.name}</div>
                      <div className="text-[#CCCCCC] text-sm">{server.type}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#CCCCCC] mb-4">Clan Type</label>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { id: 'competitive', name: 'Competitive', desc: 'Serious tournaments and ranked play' },
                    { id: 'casual', name: 'Casual', desc: 'Fun gameplay with friends' },
                    { id: 'mixed', name: 'Mixed', desc: 'Both competitive and casual play' }
                  ].map((type) => (
                    <button
                      key={type.id}
                      onClick={() => handleInputChange('type', type.id)}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        formData.type === type.id
                          ? 'border-[#E60000] bg-[#E60000]/20'
                          : 'border-[#444444] hover:border-[#666666]'
                      }`}
                    >
                      <div className="text-white font-medium">{type.name}</div>
                      <div className="text-[#CCCCCC] text-sm">{type.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Discord Integration */}
          {step === 3 && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Discord Integration</h2>
                <p className="text-[#CCCCCC]">Connect your clan with Discord for seamless management</p>
              </div>

              <div className="bg-[#222222] rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#E60000] rounded-lg flex items-center justify-center">
                    <Bot size={24} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-2">Automatic Discord Setup</h3>
                    <p className="text-[#CCCCCC] mb-4">
                      We'll automatically create a dedicated Discord server for your clan with proper channels and roles.
                    </p>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3 text-sm text-[#CCCCCC]">
                        <Check size={16} className="text-[#E60000]" />
                        <span>Private clan channels</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-[#CCCCCC]">
                        <Check size={16} className="text-[#E60000]" />
                        <span>Automatic role synchronization</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-[#CCCCCC]">
                        <Check size={16} className="text-[#E60000]" />
                        <span>Atlas bot integration</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-[#CCCCCC]">
                        <Check size={16} className="text-[#E60000]" />
                        <span>Event notifications</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.discordIntegration}
                          onChange={(e) => handleInputChange('discordIntegration', e.target.checked)}
                          className="w-5 h-5 text-[#E60000] bg-[#333333] border-[#444444] rounded focus:ring-[#E60000]"
                        />
                        <span className="text-white font-medium">Enable Discord Integration</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#222222] rounded-lg p-6">
                <h3 className="text-lg font-bold text-white mb-4">Privacy Settings</h3>
                <div className="space-y-4">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <div className="text-white font-medium">Public Clan</div>
                      <div className="text-[#CCCCCC] text-sm">Allow players to find and apply to join your clan</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.isPublic}
                      onChange={(e) => handleInputChange('isPublic', e.target.checked)}
                      className="w-5 h-5 text-[#E60000] bg-[#333333] border-[#444444] rounded focus:ring-[#E60000]"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Premium Features */}
          {step === 4 && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Premium Features</h2>
                <p className="text-[#CCCCCC]">Unlock additional customization options with Atlas Gems</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {premiumFeatures.map((feature) => (
                  <div
                    key={feature.id}
                    className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
                      formData.selectedFeatures.includes(feature.id)
                        ? 'border-[#E60000] bg-[#E60000]/20'
                        : 'border-[#444444] hover:border-[#666666]'
                    }`}
                    onClick={() => toggleFeature(feature.id)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-[#E60000] rounded-lg flex items-center justify-center">
                        <feature.icon size={24} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-bold text-white">{feature.name}</h3>
                          <div className="flex items-center gap-2">
                            <span className="text-[#E60000] font-bold">{feature.cost}</span>
                            <span className="text-[#CCCCCC] text-sm">gems</span>
                          </div>
                        </div>
                        <p className="text-[#CCCCCC] text-sm">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {formData.selectedFeatures.length > 0 && (
                <div className="bg-[#E60000]/10 border border-[#E60000]/50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-medium">Total Cost</div>
                      <div className="text-[#CCCCCC] text-sm">{formData.selectedFeatures.length} premium features selected</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-[#E60000]">{getTotalCost()}</div>
                      <div className="text-[#CCCCCC] text-sm">Atlas Gems</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-12">
            <button
              onClick={handlePrevStep}
              disabled={step === 1}
              className="px-6 py-3 bg-[#333333] hover:bg-[#444444] disabled:bg-[#222222] disabled:opacity-50 text-white font-medium rounded-lg transition-colors disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {step < 4 ? (
              <button
                onClick={handleNextStep}
                disabled={
                  (step === 1 && (!formData.name || !formData.tag)) ||
                  (step === 2 && (!formData.region || !formData.server))
                }
                className="px-6 py-3 bg-[#E60000] hover:bg-[#cc0000] disabled:bg-[#444444] disabled:opacity-50 text-white font-medium rounded-lg transition-colors disabled:cursor-not-allowed"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleCreateClan}
                disabled={loading || !formData.name || !formData.tag || !formData.region || !formData.server}
                className="px-8 py-3 bg-[#E60000] hover:bg-[#cc0000] disabled:bg-[#444444] disabled:opacity-50 text-white font-bold rounded-lg transition-all disabled:cursor-not-allowed"
              >
                {loading ? 'Creating Clan...' : 'Create Clan'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}