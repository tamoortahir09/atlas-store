'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Bug, Settings, List, CheckCircle, Link, User } from 'lucide-react';
import Stepper from '@/components/Stepper';

interface BugData {
  // Step 1: Classification
  bugType: string;
  severity: string;
  serverAffected: string;

  // Step 2: Technical Details
  title: string;
  operatingSystem: string;
  gameVersion: string;
  description: string;

  // Step 3: Reproduction
  stepsToReproduce: string;
  expectedBehavior: string;
  actualBehavior: string;
  frequency: string;

  // Step 4: Evidence
  evidenceLink: string;
  additionalInfo: string;
}

// Mock authenticated user data (placeholder for Discord linking)
const authenticatedUser = {
  username: 'PlayerOne#1234',
  discordId: '123456789012345678',
  steamId: '76561198123456789',
  avatar: 'https://cdn.discordapp.com/avatars/123456789012345678/abc123.png'
};

export default function BugReportPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<BugData>({
    bugType: '',
    severity: 'medium',
    serverAffected: '',
    title: '',
    operatingSystem: '',
    gameVersion: '',
    description: '',
    stepsToReproduce: '',
    expectedBehavior: '',
    actualBehavior: '',
    frequency: '',
    evidenceLink: '',
    additionalInfo: ''
  });

  const steps = ['Bug Classification', 'Technical Details', 'Reproduction Steps', 'Evidence & Submit'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (step: number) => {
    setCurrentStep(step);
  };

  const handleSubmit = () => {
    const submissionData = {
      ...formData,
      reporter: authenticatedUser,
      submittedAt: new Date().toISOString()
    };
    console.log('Bug report submitted:', submissionData);
  };

  const handleBackClick = () => {
    router.push('/support');
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.bugType && formData.severity;
      case 2:
        return formData.title && formData.description;
      case 3:
        return formData.actualBehavior;
      default:
        return true;
    }
  };

  const bugTypes = [
    'Gameplay Bug',
    'Server Performance',
    'Connection Issues',
    'UI/Interface Bug',
    'Audio Bug',
    'Graphics/Visual Bug',
    'Plugin/Mod Issue',
    'Other'
  ];

  const servers = [
    'Atlas 10x | AU Main',
    'Atlas 10x | EU Central',
    'Atlas 10x | US East',
    'Atlas 5x | AU Main',
    'Atlas 5x | EU Central',
    'Atlas 2x | AU Vanilla',
    'All Servers',
    'Unknown/Multiple'
  ];

  const frequencies = [
    'Always happens',
    'Sometimes happens',
    'Rarely happens',
    'Happened once',
    'Unknown'
  ];

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

        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="inline-block bg-yellow-500/20 border border-yellow-500/50 px-4 py-2 rounded-lg mb-4">
            <span className="text-yellow-400 text-sm font-medium uppercase tracking-wider flex items-center gap-2 font-orbitron">
              <Bug size={14} />
              Bug Report
            </span>
          </div>
          
          <h1 className="text-white text-4xl font-bold mb-3 font-russo">
            Report a Bug
          </h1>
          <p className="text-[#CCCCCC] text-lg max-w-2xl mx-auto font-orbitron">
            Help us improve Atlas servers by reporting bugs and technical issues. The more details you provide, the faster we can fix it.
          </p>
        </div>

        {/* Authenticated User Info */}
        <div className="bg-[#111111] border border-[#333333] rounded-xl p-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#E60000] rounded-full flex items-center justify-center">
              <User size={20} className="text-white" />
            </div>
            <div>
              <div className="text-white font-medium font-orbitron">Reporting as: {authenticatedUser.username}</div>
              <div className="text-[#CCCCCC] text-sm font-orbitron">Authenticated via Discord</div>
            </div>
          </div>
        </div>

        {/* Stepper */}
        <Stepper 
          steps={steps} 
          currentStep={currentStep} 
          onStepClick={handleStepClick}
        />

        {/* Step Content */}
        <div className="bg-[#111111] border border-[#333333] rounded-xl p-6 min-h-[400px]">
          {/* Step 1: Bug Classification */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <Bug className="text-[#E60000]" size={20} />
                <h3 className="text-white font-bold text-lg font-russo">Bug Classification</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#CCCCCC] font-medium mb-2 font-orbitron">
                    Bug Type *
                  </label>
                  <select
                    name="bugType"
                    value={formData.bugType}
                    onChange={handleInputChange}
                    className="w-full bg-[#222222] border border-[#444444] rounded-lg px-4 py-3 text-white focus:border-[#E60000] focus:outline-none transition-colors font-orbitron"
                  >
                    <option value="">Select type</option>
                    {bugTypes.map(type => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[#CCCCCC] font-medium mb-2 font-orbitron">
                    Severity *
                  </label>
                  <select
                    name="severity"
                    value={formData.severity}
                    onChange={handleInputChange}
                    className="w-full bg-[#222222] border border-[#444444] rounded-lg px-4 py-3 text-white focus:border-[#E60000] focus:outline-none transition-colors font-orbitron"
                  >
                    <option value="low">Low - Minor issue</option>
                    <option value="medium">Medium - Noticeable issue</option>
                    <option value="high">High - Major gameplay impact</option>
                    <option value="critical">Critical - Game breaking</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#CCCCCC] font-medium mb-2 font-orbitron">
                  Server Affected
                </label>
                <select
                  name="serverAffected"
                  value={formData.serverAffected}
                  onChange={handleInputChange}
                  className="w-full bg-[#222222] border border-[#444444] rounded-lg px-4 py-3 text-white focus:border-[#E60000] focus:outline-none transition-colors font-orbitron"
                >
                  <option value="">Select server (if applicable)</option>
                  {servers.map(server => (
                    <option key={server} value={server}>
                      {server}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Step 2: Technical Details */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <Settings className="text-[#E60000]" size={20} />
                <h3 className="text-white font-bold text-lg font-russo">Technical Details</h3>
              </div>

              <div>
                <label className="block text-[#CCCCCC] font-medium mb-2 font-orbitron">
                  Bug Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Brief, descriptive title of the bug"
                  className="w-full bg-[#222222] border border-[#444444] rounded-lg px-4 py-3 text-white placeholder-[#666666] focus:border-[#E60000] focus:outline-none transition-colors font-orbitron"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#CCCCCC] font-medium mb-2 font-orbitron">
                    Operating System
                  </label>
                  <input
                    type="text"
                    name="operatingSystem"
                    value={formData.operatingSystem}
                    onChange={handleInputChange}
                    placeholder="e.g., Windows 11, macOS 14, Linux Ubuntu"
                    className="w-full bg-[#222222] border border-[#444444] rounded-lg px-4 py-3 text-white placeholder-[#666666] focus:border-[#E60000] focus:outline-none transition-colors font-orbitron"
                  />
                </div>
                <div>
                  <label className="block text-[#CCCCCC] font-medium mb-2 font-orbitron">
                    Game Version
                  </label>
                  <input
                    type="text"
                    name="gameVersion"
                    value={formData.gameVersion}
                    onChange={handleInputChange}
                    placeholder="e.g., Latest, Legacy, Beta"
                    className="w-full bg-[#222222] border border-[#444444] rounded-lg px-4 py-3 text-white placeholder-[#666666] focus:border-[#E60000] focus:outline-none transition-colors font-orbitron"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#CCCCCC] font-medium mb-2 font-orbitron">
                  Bug Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe the bug in detail. What happened? When did it occur? What were you doing when it happened?"
                  rows={5}
                  className="w-full bg-[#222222] border border-[#444444] rounded-lg px-4 py-3 text-white placeholder-[#666666] focus:border-[#E60000] focus:outline-none transition-colors resize-none font-orbitron"
                />
              </div>
            </div>
          )}

          {/* Step 3: Reproduction Steps */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <List className="text-[#E60000]" size={20} />
                <h3 className="text-white font-bold text-lg font-russo">Reproduction Steps</h3>
              </div>

              <div>
                <label className="block text-[#CCCCCC] font-medium mb-2 font-orbitron">
                  Steps to Reproduce
                </label>
                <textarea
                  name="stepsToReproduce"
                  value={formData.stepsToReproduce}
                  onChange={handleInputChange}
                  placeholder="1. Go to...&#10;2. Click on...&#10;3. Do this...&#10;4. Bug occurs"
                  rows={4}
                  className="w-full bg-[#222222] border border-[#444444] rounded-lg px-4 py-3 text-white placeholder-[#666666] focus:border-[#E60000] focus:outline-none transition-colors resize-none font-orbitron"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#CCCCCC] font-medium mb-2 font-orbitron">
                    Expected Behavior
                  </label>
                  <textarea
                    name="expectedBehavior"
                    value={formData.expectedBehavior}
                    onChange={handleInputChange}
                    placeholder="What should have happened?"
                    rows={3}
                    className="w-full bg-[#222222] border border-[#444444] rounded-lg px-4 py-3 text-white placeholder-[#666666] focus:border-[#E60000] focus:outline-none transition-colors resize-none font-orbitron"
                  />
                </div>
                <div>
                  <label className="block text-[#CCCCCC] font-medium mb-2 font-orbitron">
                    Actual Behavior *
                  </label>
                  <textarea
                    name="actualBehavior"
                    value={formData.actualBehavior}
                    onChange={handleInputChange}
                    placeholder="What actually happened?"
                    rows={3}
                    className="w-full bg-[#222222] border border-[#444444] rounded-lg px-4 py-3 text-white placeholder-[#666666] focus:border-[#E60000] focus:outline-none transition-colors resize-none font-orbitron"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#CCCCCC] font-medium mb-2 font-orbitron">
                  How Often Does This Happen?
                </label>
                <select
                  name="frequency"
                  value={formData.frequency}
                  onChange={handleInputChange}
                  className="w-full bg-[#222222] border border-[#444444] rounded-lg px-4 py-3 text-white focus:border-[#E60000] focus:outline-none transition-colors font-orbitron"
                >
                  <option value="">Select frequency</option>
                  {frequencies.map(freq => (
                    <option key={freq} value={freq}>
                      {freq}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Step 4: Evidence & Submit */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="text-[#E60000]" size={20} />
                <h3 className="text-white font-bold text-lg font-russo">Evidence & Additional Info</h3>
              </div>

              <div>
                <label className="block text-[#CCCCCC] font-medium mb-2 font-orbitron">
                  Evidence Link (Optional)
                </label>
                <div className="relative">
                  <Link size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#666666]" />
                  <input
                    type="url"
                    name="evidenceLink"
                    value={formData.evidenceLink}
                    onChange={handleInputChange}
                    placeholder="https://youtube.com/... or https://medal.tv/... (screenshots or videos)"
                    className="w-full bg-[#222222] border border-[#444444] rounded-lg pl-10 pr-4 py-3 text-white placeholder-[#666666] focus:border-[#E60000] focus:outline-none transition-colors font-orbitron"
                  />
                </div>
                <div className="mt-1 text-sm text-[#666666] font-orbitron">
                  Provide a link to screenshots or videos showing the bug
                </div>
              </div>

              <div>
                <label className="block text-[#CCCCCC] font-medium mb-2 font-orbitron">
                  Additional Information
                </label>
                <textarea
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleInputChange}
                  placeholder="Any other relevant information, console errors, or context that might help us debug this issue."
                  rows={3}
                  className="w-full bg-[#222222] border border-[#444444] rounded-lg px-4 py-3 text-white placeholder-[#666666] focus:border-[#E60000] focus:outline-none transition-colors resize-none font-orbitron"
                />
              </div>

              {/* Report Summary */}
              <div className="bg-[#1a1a1a] border border-[#444444] rounded-lg p-4">
                <h4 className="text-white font-medium mb-3 font-russo">Bug Report Summary</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-[#CCCCCC] mb-1 font-orbitron">Reporter:</div>
                    <div className="text-white font-orbitron">{authenticatedUser.username}</div>
                  </div>
                  <div>
                    <div className="text-[#CCCCCC] mb-1 font-orbitron">Bug Type:</div>
                    <div className="text-white font-orbitron">{formData.bugType}</div>
                  </div>
                  <div>
                    <div className="text-[#CCCCCC] mb-1 font-orbitron">Severity:</div>
                    <div className="text-white capitalize font-orbitron">{formData.severity}</div>
                  </div>
                  <div>
                    <div className="text-[#CCCCCC] mb-1 font-orbitron">Title:</div>
                    <div className="text-white font-orbitron">{formData.title}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="px-6 py-3 bg-[#333333] hover:bg-[#444444] disabled:bg-[#222222] disabled:text-[#666666] text-white rounded-lg transition-colors disabled:cursor-not-allowed font-orbitron"
          >
            Previous
          </button>

          {currentStep < steps.length ? (
            <button
              onClick={handleNext}
              disabled={!isStepValid(currentStep)}
              className="px-6 py-3 bg-[#E60000] hover:bg-[#cc0000] disabled:bg-[#666666] text-white rounded-lg transition-colors disabled:cursor-not-allowed font-orbitron"
            >
              Next Step
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-6 py-3 bg-[#E60000] hover:bg-[#cc0000] text-white rounded-lg transition-colors font-orbitron"
            >
              Submit Bug Report
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 