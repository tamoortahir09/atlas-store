import { Shield, Calendar, Eye, Database, Lock, Globe } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="bg-black text-white">
      {/* Header Section */}
      <div className="bg-gradient-to-b from-black via-gray-900/50 to-black border-b border-gray-800/50">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Shield className="h-8 w-8 text-[#E60000]" />
              <h1 className="text-4xl lg:text-5xl font-bold uppercase tracking-wider">
                Privacy Policy
              </h1>
            </div>
            <p className="text-[#CCCCCC] text-lg max-w-2xl mx-auto">
              Your privacy matters to us. Learn how we collect, use, and protect your information.
            </p>
            <div className="flex items-center justify-center gap-2 mt-4 text-sm text-[#CCCCCC]">
              <Calendar className="h-4 w-4" />
              <span>Last updated: January 1, 2024</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="space-y-12">
          
          {/* Important Notice */}
          <div className="bg-[#E60000]/10 border border-[#E60000]/30 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <Eye className="h-6 w-6 text-[#E60000] mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-white font-bold text-lg mb-2">Your Privacy Rights</h3>
                <p className="text-[#CCCCCC]">
                  This Privacy Policy explains how Atlas Gaming collects, uses, and protects your 
                  personal information when you use our services. We are committed to transparency 
                  and protecting your privacy.
                </p>
              </div>
            </div>
          </div>

          {/* Privacy Sections */}
          <section className="space-y-8">
            
            {/* 1. Information We Collect */}
            <div className="border-l-4 border-[#E60000] pl-6">
              <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide">
                1. Information We Collect
              </h2>
              <div className="space-y-4 text-[#CCCCCC]">
                <h3 className="text-white font-semibold text-lg">Personal Information</h3>
                <p>
                  We collect information you provide directly to us, including:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Steam account information (Steam ID, username, profile data)</li>
                  <li>Discord account information (if linked)</li>
                  <li>Email addresses and contact information</li>
                  <li>Payment information for purchases</li>
                  <li>Support tickets and communications</li>
                </ul>
                
                <h3 className="text-white font-semibold text-lg mt-6">Gameplay Data</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>In-game statistics and performance data</li>
                  <li>Chat messages and voice communications</li>
                  <li>Server connection logs and timestamps</li>
                  <li>Inventory and purchase history</li>
                  <li>Clan and team affiliations</li>
                </ul>

                <h3 className="text-white font-semibold text-lg mt-6">Technical Information</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>IP addresses and device information</li>
                  <li>Browser type and operating system</li>
                  <li>Website usage and navigation patterns</li>
                  <li>Cookies and tracking technologies</li>
                </ul>
              </div>
            </div>

            {/* 2. How We Use Your Information */}
            <div className="border-l-4 border-[#E60000] pl-6">
              <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide">
                2. How We Use Your Information
              </h2>
              <div className="space-y-4 text-[#CCCCCC]">
                <p>
                  We use the information we collect for various purposes, including:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Providing and maintaining our gaming services</li>
                  <li>Processing transactions and managing accounts</li>
                  <li>Preventing cheating and enforcing game rules</li>
                  <li>Improving server performance and user experience</li>
                  <li>Providing customer support and technical assistance</li>
                  <li>Sending important updates and notifications</li>
                  <li>Analyzing usage patterns to enhance our services</li>
                  <li>Complying with legal obligations and preventing fraud</li>
                </ul>
              </div>
            </div>

            {/* 3. Information Sharing */}
            <div className="border-l-4 border-[#E60000] pl-6">
              <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide">
                3. Information Sharing
              </h2>
              <div className="space-y-4 text-[#CCCCCC]">
                <p>
                  We do not sell, trade, or rent your personal information to third parties. 
                  We may share your information in the following circumstances:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Service Providers:</strong> With trusted partners who help us operate our services</li>
                  <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                  <li><strong>Business Transfers:</strong> In connection with mergers or acquisitions</li>
                  <li><strong>Consent:</strong> When you explicitly agree to share information</li>
                  <li><strong>Public Information:</strong> Leaderboards and public statistics</li>
                </ul>
              </div>
            </div>

            {/* 4. Data Security */}
            <div className="border-l-4 border-[#E60000] pl-6">
              <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide">
                4. Data Security
              </h2>
              <div className="space-y-4 text-[#CCCCCC]">
                <p>
                  We implement appropriate security measures to protect your information:
                </p>
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-gray-900/50 border border-gray-700/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Lock className="h-5 w-5 text-[#E60000]" />
                      <span className="text-white font-medium">Encryption</span>
                    </div>
                    <p className="text-sm">Data is encrypted in transit and at rest using industry-standard protocols.</p>
                  </div>
                  <div className="bg-gray-900/50 border border-gray-700/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Database className="h-5 w-5 text-[#E60000]" />
                      <span className="text-white font-medium">Secure Storage</span>
                    </div>
                    <p className="text-sm">Information is stored on secure servers with restricted access.</p>
                  </div>
                </div>
                <p className="mt-4">
                  However, no method of transmission over the internet is 100% secure. 
                  While we strive to protect your information, we cannot guarantee absolute security.
                </p>
              </div>
            </div>

            {/* 5. Cookies and Tracking */}
            <div className="border-l-4 border-[#E60000] pl-6">
              <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide">
                5. Cookies and Tracking
              </h2>
              <div className="space-y-4 text-[#CCCCCC]">
                <p>
                  We use cookies and similar technologies to enhance your experience:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Essential Cookies:</strong> Required for basic website functionality</li>
                  <li><strong>Performance Cookies:</strong> Help us analyze website usage</li>
                  <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
                  <li><strong>Authentication Cookies:</strong> Keep you logged in to your account</li>
                </ul>
                <p>
                  You can control cookies through your browser settings, but disabling them 
                  may affect website functionality.
                </p>
              </div>
            </div>

            {/* 6. Data Retention */}
            <div className="border-l-4 border-[#E60000] pl-6">
              <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide">
                6. Data Retention
              </h2>
              <div className="space-y-4 text-[#CCCCCC]">
                <p>
                  We retain your information for as long as necessary to provide our services:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Account Data:</strong> Retained while your account is active</li>
                  <li><strong>Gameplay Data:</strong> Stored for statistical and anti-cheat purposes</li>
                  <li><strong>Transaction Records:</strong> Kept for legal and accounting requirements</li>
                  <li><strong>Support Communications:</strong> Retained for quality assurance</li>
                  <li><strong>Logs and Analytics:</strong> Typically retained for 12-24 months</li>
                </ul>
              </div>
            </div>

            {/* 7. Your Rights */}
            <div className="border-l-4 border-[#E60000] pl-6">
              <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide">
                7. Your Privacy Rights
              </h2>
              <div className="space-y-4 text-[#CCCCCC]">
                <p>
                  Depending on your location, you may have the following rights:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Access:</strong> Request a copy of your personal information</li>
                  <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                  <li><strong>Deletion:</strong> Request deletion of your personal data</li>
                  <li><strong>Portability:</strong> Receive your data in a portable format</li>
                  <li><strong>Restriction:</strong> Limit how we process your information</li>
                  <li><strong>Objection:</strong> Object to certain types of processing</li>
                </ul>
                <p>
                  To exercise these rights, please contact us using the information provided below.
                </p>
              </div>
            </div>

            {/* 8. Children's Privacy */}
            <div className="border-l-4 border-[#E60000] pl-6">
              <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide">
                8. Children's Privacy
              </h2>
              <div className="space-y-4 text-[#CCCCCC]">
                <p>
                  Our services are not intended for children under 13 years of age. 
                  We do not knowingly collect personal information from children under 13.
                </p>
                <p>
                  If you are a parent or guardian and believe your child has provided us with 
                  personal information, please contact us immediately so we can delete such information.
                </p>
              </div>
            </div>

            {/* 9. International Transfers */}
            <div className="border-l-4 border-[#E60000] pl-6">
              <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide">
                9. International Data Transfers
              </h2>
              <div className="space-y-4 text-[#CCCCCC]">
                <p>
                  Your information may be transferred to and processed in countries other than 
                  your own. We ensure appropriate safeguards are in place to protect your 
                  information during such transfers.
                </p>
                <div className="flex items-center gap-2 mt-4 p-4 bg-gray-900/50 border border-gray-700/50 rounded-lg">
                  <Globe className="h-5 w-5 text-[#E60000]" />
                  <span className="text-white font-medium">Global Service</span>
                  <span className="text-sm ml-auto">Servers in multiple regions for optimal performance</span>
                </div>
              </div>
            </div>

            {/* 10. Changes to Privacy Policy */}
            <div className="border-l-4 border-[#E60000] pl-6">
              <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide">
                10. Changes to This Policy
              </h2>
              <div className="space-y-4 text-[#CCCCCC]">
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of 
                  any changes by posting the new Privacy Policy on this page and updating the 
                  "Last updated" date.
                </p>
                <p>
                  We encourage you to review this Privacy Policy periodically for any changes. 
                  Your continued use of our services after any modifications constitutes 
                  acceptance of the updated policy.
                </p>
              </div>
            </div>

            {/* 11. Contact Us */}
            <div className="border-l-4 border-[#E60000] pl-6">
              <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide">
                11. Contact Information
              </h2>
              <div className="space-y-4 text-[#CCCCCC]">
                <p>
                  If you have any questions about this Privacy Policy or our privacy practices, 
                  please contact us:
                </p>
                <div className="bg-gray-900/50 border border-gray-700/50 rounded-lg p-4 mt-4">
                  <p><strong>Privacy Officer:</strong> privacy@atlas-gaming.com</p>
                  <p><strong>General Support:</strong> support@atlas-gaming.com</p>
                  <p><strong>Discord:</strong> Atlas Gaming Community</p>
                  <p><strong>Website:</strong> www.atlas-gaming.com</p>
                  <p><strong>Response Time:</strong> We aim to respond within 48 hours</p>
                </div>
              </div>
            </div>

          </section>

          {/* Footer Notice */}
          <div className="bg-gray-900/30 border border-gray-700/30 rounded-lg p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Shield className="h-5 w-5 text-[#E60000]" />
              <span className="text-white font-medium">Atlas Gaming Privacy Commitment</span>
            </div>
            <p className="text-[#CCCCCC] text-sm">
              We are committed to protecting your privacy and maintaining the security of your 
              personal information. This policy reflects our current practices and may be 
              updated as our services evolve.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
} 