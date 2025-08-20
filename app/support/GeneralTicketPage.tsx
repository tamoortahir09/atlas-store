'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, HelpCircle, FileText, CheckCircle } from 'lucide-react';
import Stepper from '@/components/Stepper';

interface TicketData {
  // Step 1: Issue Details (no contact info needed)
  category: string;
  subject: string;

  // Step 2: Description
  description: string;
  additionalInfo: string;
}

// Mock authenticated user data (placeholder for Discord linking)
const authenticatedUser = {
  username: 'PlayerOne#1234',
  discordId: '123456789012345678',
  steamId: '76561198123456789',
  avatar: 'https://cdn.discordapp.com/avatars/123456789012345678/abc123.png'
};

export default function GeneralTicketPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<TicketData>({
    category: '',
    subject: '',
    description: '',
    additionalInfo: ''
  });

  const steps = ['Issue Details', 'Description', 'Review & Submit'];

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
    console.log('Ticket submitted:', submissionData);
  };

  const handleBackClick = () => {
    router.push('/support');
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.category && formData.subject;
      case 2:
        return formData.description.length >= 20;
      default:
        return true;
    }
  };

  const categories = [
    'Account Issues',
    'Server Connection Problems',
    'Gameplay Issues',
    'Store & Purchases',
    'Clan Management',
    'General Question',
    'Other'
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
          <div className="inline-block bg-blue-500/20 border border-blue-500/50 px-4 py-2 rounded-lg mb-4">
            <span className="text-blue-400 text-sm font-medium uppercase tracking-wider flex items-center gap-2 font-orbitron">
              <HelpCircle size={14} />
              General Support
            </span>
          </div>
          
          <h1 className="text-white text-4xl font-bold mb-3 font-russo">
            Create Support Ticket
          </h1>
          <p className="text-[#CCCCCC] text-lg max-w-2xl mx-auto font-orbitron">
            Get help with your account, server issues, or general questions from our support team.
          </p>
        </div>

        {/* Authenticated User Info */}
        <div className="bg-[#111111] border border-[#333333] rounded-xl p-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#E60000] rounded-full flex items-center justify-center">
              <User size={20} className="text-white" />
            </div>
            <div>
              <div className="text-white font-medium font-orbitron">Submitting as: {authenticatedUser.username}</div>
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
          {/* Step 1: Issue Details */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <HelpCircle className="text-[#E60000]" size={20} />
                <h3 className="text-white font-bold text-lg font-russo">Issue Details</h3>
              </div>

              <div>
                <label className="block text-[#CCCCCC] font-medium mb-2 font-orbitron">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full bg-[#222222] border border-[#444444] rounded-lg px-4 py-3 text-white focus:border-[#E60000] focus:outline-none transition-colors font-orbitron"
                >
                  <option value="">Select category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[#CCCCCC] font-medium mb-2 font-orbitron">
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="Brief description of your issue"
                  className="w-full bg-[#222222] border border-[#444444] rounded-lg px-4 py-3 text-white placeholder-[#666666] focus:border-[#E60000] focus:outline-none transition-colors font-orbitron"
                />
              </div>

              {/* Support Process Info */}
              <div className="bg-[#1a1a1a] border border-[#444444] rounded-lg p-4">
                <h4 className="text-white font-medium mb-2 font-russo">Support Process</h4>
                <div className="text-[#CCCCCC] text-sm font-orbitron">
                  All support requests are handled through our website ticketing system. You'll receive updates and responses directly in your ticket dashboard.
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Description */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="text-[#E60000]" size={20} />
                <h3 className="text-white font-bold text-lg font-russo">Detailed Description</h3>
              </div>

              <div>
                <label className="block text-[#CCCCCC] font-medium mb-2 font-orbitron">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Please provide a detailed description of your issue. Include any error messages, when the problem started, and what you were trying to do."
                  rows={8}
                  className="w-full bg-[#222222] border border-[#444444] rounded-lg px-4 py-3 text-white placeholder-[#666666] focus:border-[#E60000] focus:outline-none transition-colors resize-none font-orbitron"
                />
                <div className="mt-1 text-right text-sm text-[#666666] font-orbitron">
                  {formData.description.length}/20 minimum
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
                  placeholder="Any other relevant information or context that might help us assist you."
                  rows={4}
                  className="w-full bg-[#222222] border border-[#444444] rounded-lg px-4 py-3 text-white placeholder-[#666666] focus:border-[#E60000] focus:outline-none transition-colors resize-none font-orbitron"
                />
              </div>
            </div>
          )}

          {/* Step 3: Review & Submit */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="text-[#E60000]" size={20} />
                <h3 className="text-white font-bold text-lg font-russo">Review & Submit</h3>
              </div>

              <div className="bg-[#1a1a1a] border border-[#444444] rounded-lg p-4">
                <h4 className="text-white font-medium mb-3 font-russo">Ticket Summary</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-[#CCCCCC] mb-1 font-orbitron">Submitter:</div>
                    <div className="text-white font-orbitron">{authenticatedUser.username}</div>
                  </div>
                  <div>
                    <div className="text-[#CCCCCC] mb-1 font-orbitron">Category:</div>
                    <div className="text-white font-orbitron">{formData.category}</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-[#CCCCCC] mb-1 font-orbitron">Subject:</div>
                    <div className="text-white font-orbitron">{formData.subject}</div>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-[#CCCCCC] mb-1 font-orbitron">Description:</div>
                  <div className="text-white text-sm font-orbitron">{formData.description.substring(0, 100)}...</div>
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <div className="text-blue-400 font-medium mb-2 font-orbitron">What happens next?</div>
                <div className="text-[#CCCCCC] text-sm space-y-1 font-orbitron">
                  <div>• Your ticket will be created in our system</div>
                  <div>• Our support team will review your request</div>
                  <div>• You'll receive updates via the website ticket dashboard</div>
                  <div>• Check back regularly for responses and updates</div>
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
              Submit Ticket
            </button>
          )}
        </div>
      </div>
    </div>
  );
}