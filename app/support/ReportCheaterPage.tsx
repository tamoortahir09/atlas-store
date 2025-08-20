'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, Settings, FileText, CheckCircle, AlertTriangle, Link, Plus, Upload, X } from 'lucide-react';
import Stepper from '@/components/Stepper';

interface ReportData {
  // Step 1: Player Search
  cheaterSteamId: string;

  // Step 2: Incident Details
  serverId: string;
  cheatType: string;

  // Step 3: Evidence & Description
  description: string;
  evidenceUrls: string[];
  evidenceFiles: File[];
}

// Mock authenticated user data (placeholder for Discord linking)
const authenticatedUser = {
  username: 'PlayerOne#1234',
  discordId: '123456789012345678',
  steamId: '76561198123456789',
  avatar: 'https://cdn.discordapp.com/avatars/123456789012345678/abc123.png'
};

export default function ReportCheaterPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [urlError, setUrlError] = useState('');
  const [formData, setFormData] = useState<ReportData>({
    cheaterSteamId: '',
    serverId: '',
    cheatType: '',
    description: '',
    evidenceUrls: [],
    evidenceFiles: []
  });

  const steps = ['Player Search', 'Incident Details', 'Evidence & Description', 'Review & Submit'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateUrl = (url: string) => {
    if (!url.trim()) return 'URL cannot be empty';
    
    const supportedDomains = [
      'youtube.com',
      'youtu.be',
      'medal.tv',
      'streamable.com'
    ];
    
    try {
      const urlObj = new URL(url);
      const isSupported = supportedDomains.some(domain => urlObj.hostname.includes(domain));
      if (!isSupported) {
        return 'Please use YouTube, Medal.tv, or Streamable links only';
      }
      return '';
    } catch {
      return 'Please enter a valid URL';
    }
  };

  const handleAddVideoUrl = () => {
    const error = validateUrl(newVideoUrl);
    if (error) {
      setUrlError(error);
      return;
    }

    if (formData.evidenceUrls.length >= 5) {
      setUrlError('Maximum 5 videos allowed');
      return;
    }

    setFormData(prev => ({
      ...prev,
      evidenceUrls: [...prev.evidenceUrls, newVideoUrl]
    }));
    setNewVideoUrl('');
    setUrlError('');
  };

  const handleRemoveVideoUrl = (index: number) => {
    setFormData(prev => ({
      ...prev,
      evidenceUrls: prev.evidenceUrls.filter((_, i) => i !== index)
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const maxFileSize = 50 * 1024 * 1024; // 50MB
    const validFiles = files.filter(file => {
      if (file.size > maxFileSize) {
        alert(`File ${file.name} is too large. Maximum size is 50MB.`);
        return false;
      }
      return true;
    });

    setFormData(prev => ({
      ...prev,
      evidenceFiles: [...prev.evidenceFiles, ...validFiles]
    }));

    // Reset the input
    e.target.value = '';
  };

  const handleRemoveFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      evidenceFiles: prev.evidenceFiles.filter((_, i) => i !== index)
    }));
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
    console.log('Report submitted:', submissionData);
  };

  const handleBackClick = () => {
    router.push('/support');
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.cheaterSteamId;
      case 2:
        return formData.serverId && formData.cheatType;
      case 3:
        return true; // No required fields in step 3
      default:
        return true;
    }
  };

  const servers = [
    { id: 'atlas-10x-au', name: 'Atlas 10x | AU Main' },
    { id: 'atlas-10x-eu', name: 'Atlas 10x | EU Central' },
    { id: 'atlas-10x-us', name: 'Atlas 10x | US East' },
    { id: 'atlas-5x-au', name: 'Atlas 5x | AU Main' },
    { id: 'atlas-5x-eu', name: 'Atlas 5x | EU Central' },
    { id: 'atlas-2x-au', name: 'Atlas 2x | AU Vanilla' }
  ];

  const cheatTypes = [
    'Aimbot / ESP',
    'Speed Hacking',
    'No Recoil',
    'Fly Hacking',
    'Item Duplication',
    'Other Exploits'
  ];

  // Check if any evidence has been added
  const hasEvidence = formData.evidenceUrls.length > 0 || formData.evidenceFiles.length > 0;

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
          <div className="inline-block bg-red-500/20 border border-red-500/50 px-4 py-2 rounded-lg mb-4">
            <span className="text-red-400 text-sm font-medium uppercase tracking-wider flex items-center gap-2 font-orbitron">
              <AlertTriangle size={14} />
              Cheater Report
            </span>
          </div>
          
          <h1 className="text-white text-4xl font-bold mb-3 font-russo">
            Report Cheater
          </h1>
          <p className="text-[#CCCCCC] text-lg max-w-2xl mx-auto font-orbitron">
            Help us maintain fair gameplay by reporting suspected cheaters. All reports are investigated thoroughly.
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
          {/* Step 1: Player Search */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <User className="text-[#E60000]" size={20} />
                <h3 className="text-white font-bold text-lg font-russo">Player Identification</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[#CCCCCC] font-medium mb-2 font-orbitron">
                    Suspected Cheater's Steam64 ID *
                  </label>
                  <input
                    type="text"
                    name="cheaterSteamId"
                    value={formData.cheaterSteamId}
                    onChange={handleInputChange}
                    placeholder="76561198000000000"
                    className="w-full bg-[#222222] border border-[#444444] rounded-lg px-4 py-3 text-white placeholder-[#666666] focus:border-[#E60000] focus:outline-none transition-colors font-orbitron"
                  />
                  <div className="mt-1 text-sm text-[#666666] font-orbitron">
                    We'll automatically fetch the player's name and details using their Steam ID
                  </div>
                </div>

                {/* Player Preview (Mock) */}
                {formData.cheaterSteamId && formData.cheaterSteamId.length >= 17 && (
                  <div className="mt-4 p-4 bg-[#1a1a1a] border border-[#444444] rounded-lg">
                    <h4 className="text-white font-medium mb-3 font-russo">Player Found</h4>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-[#333333] rounded border border-[#555555]"></div>
                      <div>
                        <div className="text-white font-medium font-orbitron">SuspiciousPlayer123</div>
                        <div className="text-[#CCCCCC] text-sm font-orbitron">Steam ID: {formData.cheaterSteamId}</div>
                        <div className="text-[#666666] text-xs font-orbitron">Last seen: 2 hours ago</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Incident Details */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <Settings className="text-[#E60000]" size={20} />
                <h3 className="text-white font-bold text-lg font-russo">Incident Details</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#CCCCCC] font-medium mb-2 font-orbitron">
                    Server *
                  </label>
                  <select
                    name="serverId"
                    value={formData.serverId}
                    onChange={handleInputChange}
                    className="w-full bg-[#222222] border border-[#444444] rounded-lg px-4 py-3 text-white focus:border-[#E60000] focus:outline-none transition-colors font-orbitron"
                  >
                    <option value="">Select server</option>
                    {servers.map(server => (
                      <option key={server.id} value={server.id}>
                        {server.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[#CCCCCC] font-medium mb-2 font-orbitron">
                    Type of Cheat *
                  </label>
                  <select
                    name="cheatType"
                    value={formData.cheatType}
                    onChange={handleInputChange}
                    className="w-full bg-[#222222] border border-[#444444] rounded-lg px-4 py-3 text-white focus:border-[#E60000] focus:outline-none transition-colors font-orbitron"
                  >
                    <option value="">Select type</option>
                    {cheatTypes.map(type => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="bg-[#1a1a1a] border border-[#444444] rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle size={18} className="text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-blue-400 font-medium mb-1 font-orbitron">Automatic Recording</div>
                    <div className="text-[#CCCCCC] text-sm font-orbitron">
                      The date and time of this report will be automatically recorded when you submit it. This helps us correlate with server logs.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Evidence & Description */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="text-[#E60000]" size={20} />
                <h3 className="text-white font-bold text-lg font-russo">Evidence & Description</h3>
              </div>

              {/* Evidence Section */}
              <div>
                <label className="block text-[#CCCCCC] font-medium mb-3 font-orbitron">
                  Evidence
                </label>
                
                <div className="border-2 border-dashed border-[#444444] rounded-xl p-6 relative">
                  {!hasEvidence ? (
                    /* Empty State - Show Full Interface */
                    <div className="space-y-6">
                      {/* Video Evidence Section */}
                      <div>
                        <div className="text-center mb-4">
                          <Link size={32} className="text-[#666666] mx-auto mb-3" />
                          <div className="text-white font-medium mb-2 font-orbitron">Add Video Evidence</div>
                          <div className="text-[#CCCCCC] text-sm mb-4 font-orbitron">
                            Upload video links from YouTube, Medal.tv, or Streamable (up to 5 videos)
                          </div>
                          
                          {/* Add Video URL */}
                          <div className="flex gap-2 max-w-md mx-auto">
                            <div className="flex-1 relative">
                              <input
                                type="url"
                                value={newVideoUrl}
                                onChange={(e) => {
                                  setNewVideoUrl(e.target.value);
                                  setUrlError('');
                                }}
                                placeholder="https://youtube.com/..."
                                className="w-full bg-[#222222] border border-[#444444] rounded-lg px-3 py-2 text-white placeholder-[#666666] focus:border-[#E60000] focus:outline-none transition-colors text-sm font-orbitron"
                              />
                            </div>
                            <button
                              onClick={handleAddVideoUrl}
                              disabled={!newVideoUrl.trim()}
                              className="inline-flex items-center gap-1 bg-[#E60000] hover:bg-[#cc0000] disabled:bg-[#666666] disabled:cursor-not-allowed text-white px-3 py-2 rounded transition-colors text-sm font-orbitron"
                            >
                              <Plus size={14} />
                              Add
                            </button>
                          </div>
                          
                          {urlError && (
                            <div className="text-red-400 text-sm mt-2 font-orbitron">{urlError}</div>
                          )}
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="border-t border-[#444444]"></div>

                      {/* File Upload Section */}
                      <div>
                        <div className="text-center">
                          <Upload size={32} className="text-[#666666] mx-auto mb-3" />
                          <div className="text-white font-medium mb-2 font-orbitron">Upload Files</div>
                          <div className="text-[#CCCCCC] text-sm mb-4 font-orbitron">
                            Screenshots, videos, or other evidence files (Max 50MB per file)
                          </div>
                          
                          <input
                            type="file"
                            multiple
                            accept="image/*,video/*"
                            onChange={handleFileUpload}
                            className="hidden"
                            id="file-upload"
                          />
                          <label
                            htmlFor="file-upload"
                            className="inline-flex items-center gap-2 bg-[#333333] hover:bg-[#444444] text-white px-4 py-2 rounded cursor-pointer transition-colors font-orbitron"
                          >
                            <Upload size={16} />
                            Choose Files
                          </label>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Has Evidence State - Show Only Compact Buttons */
                    <div className="flex justify-end gap-2 absolute top-4 right-4">
                      {/* Add Video URL Button */}
                      <button
                        onClick={() => {
                          const url = prompt('Enter video URL (YouTube, Medal.tv, or Streamable):');
                          if (url) {
                            const error = validateUrl(url);
                            if (error) {
                              alert(error);
                              return;
                            }
                            if (formData.evidenceUrls.length >= 5) {
                              alert('Maximum 5 videos allowed');
                              return;
                            }
                            setFormData(prev => ({
                              ...prev,
                              evidenceUrls: [...prev.evidenceUrls, url]
                            }));
                          }
                        }}
                        disabled={formData.evidenceUrls.length >= 5}
                        className="inline-flex items-center gap-1 bg-[#E60000] hover:bg-[#cc0000] disabled:bg-[#666666] disabled:cursor-not-allowed text-white px-3 py-2 rounded transition-colors text-sm font-orbitron"
                      >
                        <Plus size={14} />
                        Add
                      </button>

                      {/* Upload Files Button */}
                      <div>
                        <input
                          type="file"
                          multiple
                          accept="image/*,video/*"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="file-upload-compact"
                        />
                        <label
                          htmlFor="file-upload-compact"
                          className="inline-flex items-center gap-2 bg-[#333333] hover:bg-[#444444] text-white px-3 py-2 rounded cursor-pointer transition-colors text-sm font-orbitron"
                        >
                          <Upload size={14} />
                          Upload
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Evidence Lists - Always Show When Items Exist */}
                  <div className={`space-y-4 ${hasEvidence ? 'pt-12' : ''}`}>
                    {/* Added Videos List */}
                    {formData.evidenceUrls.length > 0 && (
                      <div>
                        <div className="text-[#CCCCCC] text-sm mb-3 font-orbitron">
                          Added Videos ({formData.evidenceUrls.length}):
                        </div>
                        <div className="space-y-2">
                          {formData.evidenceUrls.map((url, index) => (
                            <div key={index} className="flex items-center gap-3 bg-[#1a1a1a] border border-[#333333] rounded-lg p-3">
                              <div className="text-[#E60000] font-medium text-sm font-orbitron">{index + 1}.</div>
                              <div className="flex-1 text-white text-sm truncate font-orbitron">{url}</div>
                              <button
                                onClick={() => handleRemoveVideoUrl(index)}
                                className="text-[#666666] hover:text-red-400 transition-colors"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Uploaded Files List */}
                    {formData.evidenceFiles.length > 0 && (
                      <div>
                        <div className="text-[#CCCCCC] text-sm mb-3 font-orbitron">
                          Uploaded Files ({formData.evidenceFiles.length}):
                        </div>
                        <div className="space-y-2">
                          {formData.evidenceFiles.map((file, index) => (
                            <div key={index} className="flex items-center gap-3 bg-[#1a1a1a] border border-[#333333] rounded-lg p-3">
                              <div className="text-[#E60000] font-medium text-sm font-orbitron">{index + 1}.</div>
                              <div className="flex-1">
                                <div className="text-white text-sm font-orbitron">{file.name}</div>
                                <div className="text-[#666666] text-xs font-orbitron">
                                  {(file.size / 1024 / 1024).toFixed(2)} MB
                                </div>
                              </div>
                              <button
                                onClick={() => handleRemoveFile(index)}
                                className="text-[#666666] hover:text-red-400 transition-colors"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-[#CCCCCC] font-medium mb-2 font-orbitron">
                  Additional Description (optional)
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Provide any additional context about the incident that might help our investigation. This field is optional."
                  rows={5}
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
                <h4 className="text-white font-medium mb-3 font-russo">Report Summary</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-[#CCCCCC] mb-1 font-orbitron">Reporter:</div>
                    <div className="text-white font-orbitron">{authenticatedUser.username}</div>
                  </div>
                  <div>
                    <div className="text-[#CCCCCC] mb-1 font-orbitron">Suspected Cheater ID:</div>
                    <div className="text-white font-orbitron">{formData.cheaterSteamId}</div>
                  </div>
                  <div>
                    <div className="text-[#CCCCCC] mb-1 font-orbitron">Server:</div>
                    <div className="text-white font-orbitron">{servers.find(s => s.id === formData.serverId)?.name}</div>
                  </div>
                  <div>
                    <div className="text-[#CCCCCC] mb-1 font-orbitron">Cheat Type:</div>
                    <div className="text-white font-orbitron">{formData.cheatType}</div>
                  </div>
                  <div>
                    <div className="text-[#CCCCCC] mb-1 font-orbitron">Video Evidence:</div>
                    <div className="text-white font-orbitron">{formData.evidenceUrls.length} video link(s)</div>
                  </div>
                  <div>
                    <div className="text-[#CCCCCC] mb-1 font-orbitron">File Evidence:</div>
                    <div className="text-white font-orbitron">{formData.evidenceFiles.length} file(s)</div>
                  </div>
                  <div>
                    <div className="text-[#CCCCCC] mb-1 font-orbitron">Report Time:</div>
                    <div className="text-white font-orbitron">Will be recorded on submission</div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle size={18} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-yellow-400 font-medium mb-1 font-orbitron">Important Notice</div>
                    <div className="text-[#CCCCCC] text-sm font-orbitron">
                      False reports may result in penalties. By submitting this report, you confirm that all information is accurate. You'll receive updates via our website ticket system.
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
              Submit Report
            </button>
          )}
        </div>
      </div>
    </div>
  );
}