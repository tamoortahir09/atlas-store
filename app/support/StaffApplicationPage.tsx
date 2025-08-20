'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, Briefcase, MessageSquare, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import Stepper from '@/components/Stepper';

interface ApplicationData {
  // Step 1: Personal Information
  age: string;
  timezone: string;
  realName: string;

  // Step 2: Experience & Availability
  experience: string;
  availability: string;
  hoursPerWeek: string;
  rustHours: string;

  // Step 3: Application Questions
  whyJoin: string;
  scenario: string;
  references: string;
  additionalInfo: string;
}

// Mock authenticated user data (placeholder for Discord linking)
const authenticatedUser = {
  username: 'PlayerOne#1234',
  discordId: '123456789012345678',
  steamId: '76561198123456789',
  avatar: 'https://cdn.discordapp.com/avatars/123456789012345678/abc123.png'
};

export default function StaffApplicationPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ApplicationData>({
    age: '',
    timezone: '',
    realName: '',
    experience: '',
    availability: '',
    hoursPerWeek: '',
    rustHours: '',
    whyJoin: '',
    scenario: '',
    references: '',
    additionalInfo: ''
  });

  const steps = ['Personal Information', 'Experience & Availability', 'Application Questions', 'Review & Submit'];

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
      applicant: authenticatedUser,
      submittedAt: new Date().toISOString()
    };
    console.log('Application submitted:', submissionData);
  };

  const handleBackClick = () => {
    router.push('/support');
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.age && formData.timezone;
      case 2:
        return formData.experience && formData.availability && formData.rustHours;
      case 3:
        return formData.whyJoin && formData.scenario;
      default:
        return true;
    }
  };

  const timezones = [
    'UTC-12 (Baker Island)',
    'UTC-11 (American Samoa)',
    'UTC-10 (Hawaii)',
    'UTC-9 (Alaska)',
    'UTC-8 (PST)',
    'UTC-7 (MST)',
    'UTC-6 (CST)',
    'UTC-5 (EST)',
    'UTC-4 (Atlantic)',
    'UTC-3 (Brazil)',
    'UTC-2 (Mid-Atlantic)',
    'UTC-1 (Azores)',
    'UTC+0 (GMT/London)',
    'UTC+1 (CET/Berlin)',
    'UTC+2 (EET/Cairo)',
    'UTC+3 (Moscow)',
    'UTC+4 (Gulf)',
    'UTC+5 (Pakistan)',
    'UTC+6 (Bangladesh)',
    'UTC+7 (Thailand)',
    'UTC+8 (China/Singapore)',
    'UTC+9 (Japan)',
    'UTC+10 (Australia East)',
    'UTC+11 (Pacific)',
    'UTC+12 (New Zealand)'
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
          <div className="inline-block bg-[#E60000]/20 border border-[#E60000]/50 px-4 py-2 rounded-lg mb-4">
            <span className="text-[#E60000] text-sm font-medium uppercase tracking-wider flex items-center gap-2 font-orbitron">
              <Briefcase size={14} />
              Staff Application
            </span>
          </div>
          
          <h1 className="text-white text-4xl font-bold mb-3 font-russo">
            Join Our Staff Team
          </h1>
          <p className="text-[#CCCCCC] text-lg max-w-2xl mx-auto mb-4 font-orbitron">
            Help us maintain the best Rust gaming experience. We're looking for dedicated individuals to join our moderation team.
          </p>

          {/* Requirements */}
          <div className="bg-[#111111] border border-[#333333] rounded-xl p-4">
            <h3 className="text-white font-bold text-lg mb-3 flex items-center gap-2 font-russo">
              <AlertCircle size={18} />
              Requirements
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[#CCCCCC] text-sm">
              <div>
                <ul className="space-y-1 font-orbitron">
                  <li>• Minimum age: 16 years old</li>
                  <li>• 200+ hours in Rust</li>
                  <li>• Good understanding of server rules</li>
                </ul>
              </div>
              <div>
                <ul className="space-y-1 font-orbitron">
                  <li>• Available at least 10 hours/week</li>
                  <li>• Professional attitude</li>
                  <li>• No recent bans on Atlas servers</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Authenticated User Info */}
        <div className="bg-[#111111] border border-[#333333] rounded-xl p-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#E60000] rounded-full flex items-center justify-center">
              <User size={20} className="text-white" />
            </div>
            <div>
              <div className="text-white font-medium font-orbitron">Applying as: {authenticatedUser.username}</div>
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
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <User className="text-[#E60000]" size={20} />
                <h3 className="text-white font-bold text-lg font-russo">Personal Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#CCCCCC] font-medium mb-2 font-orbitron">
                    Age *
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    min="16"
                    max="100"
                    placeholder="18"
                    className="w-full bg-[#222222] border border-[#444444] rounded-lg px-4 py-3 text-white placeholder-[#666666] focus:border-[#E60000] focus:outline-none transition-colors font-orbitron"
                  />
                </div>
                <div>
                  <label className="block text-[#CCCCCC] font-medium mb-2 font-orbitron">
                    Timezone *
                  </label>
                  <select
                    name="timezone"
                    value={formData.timezone}
                    onChange={handleInputChange}
                    className="w-full bg-[#222222] border border-[#444444] rounded-lg px-4 py-3 text-white focus:border-[#E60000] focus:outline-none transition-colors font-orbitron"
                  >
                    <option value="">Select timezone</option>
                    {timezones.map(tz => (
                      <option key={tz} value={tz}>
                        {tz}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#CCCCCC] font-medium mb-2 font-orbitron">
                  First Name (optional)
                </label>
                <input
                  type="text"
                  name="realName"
                  value={formData.realName}
                  onChange={handleInputChange}
                  placeholder="Your first name"
                  className="w-full bg-[#222222] border border-[#444444] rounded-lg px-4 py-3 text-white placeholder-[#666666] focus:border-[#E60000] focus:outline-none transition-colors font-orbitron"
                />
              </div>
            </div>
          )}

          {/* Step 2: Experience & Availability */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <Briefcase className="text-[#E60000]" size={20} />
                <h3 className="text-white font-bold text-lg font-russo">Experience & Availability</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#CCCCCC] font-medium mb-2 font-orbitron">
                    Hours in Rust *
                  </label>
                  <input
                    type="number"
                    name="rustHours"
                    value={formData.rustHours}
                    onChange={handleInputChange}
                    min="0"
                    placeholder="500"
                    className="w-full bg-[#222222] border border-[#444444] rounded-lg px-4 py-3 text-white placeholder-[#666666] focus:border-[#E60000] focus:outline-none transition-colors font-orbitron"
                  />
                </div>
                <div>
                  <label className="block text-[#CCCCCC] font-medium mb-2 font-orbitron">
                    Hours Available Per Week *
                  </label>
                  <input
                    type="number"
                    name="hoursPerWeek"
                    value={formData.hoursPerWeek}
                    onChange={handleInputChange}
                    min="0"
                    placeholder="15"
                    className="w-full bg-[#222222] border border-[#444444] rounded-lg px-4 py-3 text-white placeholder-[#666666] focus:border-[#E60000] focus:outline-none transition-colors font-orbitron"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#CCCCCC] font-medium mb-2 font-orbitron">
                  Gaming & Moderation Experience *
                </label>
                <textarea
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  placeholder="Tell us about your gaming experience, any previous moderation roles, community involvement, etc."
                  rows={5}
                  className="w-full bg-[#222222] border border-[#444444] rounded-lg px-4 py-3 text-white placeholder-[#666666] focus:border-[#E60000] focus:outline-none transition-colors resize-none font-orbitron"
                />
              </div>

              <div>
                <label className="block text-[#CCCCCC] font-medium mb-2 font-orbitron">
                  Availability Schedule *
                </label>
                <textarea
                  name="availability"
                  value={formData.availability}
                  onChange={handleInputChange}
                  placeholder="When are you typically available? Include days of the week and time ranges in your timezone. Example: Mon-Fri 6PM-11PM, Weekends 2PM-10PM"
                  rows={3}
                  className="w-full bg-[#222222] border border-[#444444] rounded-lg px-4 py-3 text-white placeholder-[#666666] focus:border-[#E60000] focus:outline-none transition-colors resize-none font-orbitron"
                />
              </div>
            </div>
          )}

          {/* Step 3: Application Questions */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <MessageSquare className="text-[#E60000]" size={20} />
                <h3 className="text-white font-bold text-lg font-russo">Application Questions</h3>
              </div>

              <div>
                <label className="block text-[#CCCCCC] font-medium mb-2 font-orbitron">
                  Why do you want to join our staff team? *
                </label>
                <textarea
                  name="whyJoin"
                  value={formData.whyJoin}
                  onChange={handleInputChange}
                  placeholder="What motivates you to become a staff member? What can you bring to our team? How do you want to contribute to the Atlas community?"
                  rows={4}
                  className="w-full bg-[#222222] border border-[#444444] rounded-lg px-4 py-3 text-white placeholder-[#666666] focus:border-[#E60000] focus:outline-none transition-colors resize-none font-orbitron"
                />
              </div>

              <div>
                <label className="block text-[#CCCCCC] font-medium mb-2 font-orbitron">
                  Scenario: How would you handle a player repeatedly griefing new players? *
                </label>
                <textarea
                  name="scenario"
                  value={formData.scenario}
                  onChange={handleInputChange}
                  placeholder="Describe your approach to handling this situation. Include investigation steps, communication with players, and potential consequences."
                  rows={4}
                  className="w-full bg-[#222222] border border-[#444444] rounded-lg px-4 py-3 text-white placeholder-[#666666] focus:border-[#E60000] focus:outline-none transition-colors resize-none font-orbitron"
                />
              </div>

              <div>
                <label className="block text-[#CCCCCC] font-medium mb-2 font-orbitron">
                  References
                </label>
                <textarea
                  name="references"
                  value={formData.references}
                  onChange={handleInputChange}
                  placeholder="Can any current Atlas staff members vouch for you? Any other gaming community references or people who can speak to your character?"
                  rows={3}
                  className="w-full bg-[#222222] border border-[#444444] rounded-lg px-4 py-3 text-white placeholder-[#666666] focus:border-[#E60000] focus:outline-none transition-colors resize-none font-orbitron"
                />
              </div>

              <div>
                <label className="block text-[#CCCCCC] font-medium mb-2 font-orbitron">
                  Additional Information
                </label>
                <textarea
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleInputChange}
                  placeholder="Anything else you'd like us to know about you? Special skills, languages, technical abilities, etc."
                  rows={3}
                  className="w-full bg-[#222222] border border-[#444444] rounded-lg px-4 py-3 text-white placeholder-[#666666] focus:border-[#E60000] focus:outline-none transition-colors resize-none font-orbitron"
                />
              </div>
            </div>
          )}

          {/* Step 4: Review & Submit */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="text-[#E60000]" size={20} />
                <h3 className="text-white font-bold text-lg font-russo">Review & Submit</h3>
              </div>

              <div className="bg-[#1a1a1a] border border-[#444444] rounded-lg p-4">
                <h4 className="text-white font-medium mb-3 font-russo">Application Summary</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-[#CCCCCC] mb-1 font-orbitron">Applicant:</div>
                    <div className="text-white font-orbitron">{authenticatedUser.username}</div>
                  </div>
                  <div>
                    <div className="text-[#CCCCCC] mb-1 font-orbitron">Age:</div>
                    <div className="text-white font-orbitron">{formData.age}</div>
                  </div>
                  <div>
                    <div className="text-[#CCCCCC] mb-1 font-orbitron">Timezone:</div>
                    <div className="text-white font-orbitron">{formData.timezone}</div>
                  </div>
                  <div>
                    <div className="text-[#CCCCCC] mb-1 font-orbitron">Rust Hours:</div>
                    <div className="text-white font-orbitron">{formData.rustHours}</div>
                  </div>
                  <div>
                    <div className="text-[#CCCCCC] mb-1 font-orbitron">Weekly Availability:</div>
                    <div className="text-white font-orbitron">{formData.hoursPerWeek} hours</div>
                  </div>
                </div>
              </div>

              <div className="bg-[#E60000]/10 border border-[#E60000]/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Clock size={18} className="text-[#E60000] flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[#E60000] font-medium mb-2 font-orbitron">Application Process</div>
                    <div className="text-[#CCCCCC] text-sm space-y-1 font-orbitron">
                      <div>• Applications are reviewed by our staff team</div>
                      <div>• Successful applicants will be contacted for an interview</div>
                      <div>• Training period provided for new staff members</div>
                      <div>• All updates will be provided through our website system</div>
                    </div>
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
              Submit Application
            </button>
          )}
        </div>
      </div>
    </div>
  );
}