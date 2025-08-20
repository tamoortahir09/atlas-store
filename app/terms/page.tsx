import { Scroll, Calendar, Shield, AlertTriangle } from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="bg-black text-white">
      {/* Header Section */}
      <div className="bg-gradient-to-b from-black via-gray-900/50 to-black border-b border-gray-800/50">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Scroll className="h-8 w-8 text-[#E60000]" />
              <h1 className="text-4xl lg:text-5xl font-bold uppercase tracking-wider">
                Terms of Service
              </h1>
            </div>
            <p className="text-[#CCCCCC] text-lg max-w-2xl mx-auto">
              Please read these terms carefully before using Atlas gaming services
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
              <AlertTriangle className="h-6 w-6 text-[#E60000] mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-white font-bold text-lg mb-2">Important Notice</h3>
                <p className="text-[#CCCCCC]">
                  By accessing and using Atlas gaming services, you acknowledge that you have read, 
                  understood, and agree to be bound by these Terms of Service.
                </p>
              </div>
            </div>
          </div>

          {/* Terms Sections */}
          <section className="space-y-8">
            
            {/* 1. Acceptance of Terms */}
            <div className="border-l-4 border-[#E60000] pl-6">
              <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide">
                1. Acceptance of Terms
              </h2>
              <div className="space-y-4 text-[#CCCCCC]">
                <p>
                  These Terms of Service ("Terms") govern your use of Atlas gaming services, 
                  including our Rust servers, website, and related services (collectively, the "Service").
                </p>
                <p>
                  By accessing or using our Service, you agree to be bound by these Terms. 
                  If you disagree with any part of these terms, you may not access the Service.
                </p>
              </div>
            </div>

            {/* 2. Use of Service */}
            <div className="border-l-4 border-[#E60000] pl-6">
              <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide">
                2. Use of Service
              </h2>
              <div className="space-y-4 text-[#CCCCCC]">
                <p>
                  You may use our Service only for lawful purposes and in accordance with these Terms. 
                  You agree not to use the Service:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>In any way that violates applicable laws or regulations</li>
                  <li>To engage in cheating, hacking, or exploiting game mechanics</li>
                  <li>To harass, abuse, or harm other players</li>
                  <li>To distribute malicious software or content</li>
                  <li>To impersonate Atlas staff or other players</li>
                </ul>
              </div>
            </div>

            {/* 3. Account Responsibilities */}
            <div className="border-l-4 border-[#E60000] pl-6">
              <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide">
                3. Account Responsibilities
              </h2>
              <div className="space-y-4 text-[#CCCCCC]">
                <p>
                  When you create an account with us, you must provide accurate and complete information. 
                  You are responsible for:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Maintaining the security of your account credentials</li>
                  <li>All activities that occur under your account</li>
                  <li>Notifying us immediately of any unauthorized use</li>
                  <li>Ensuring your contact information remains current</li>
                </ul>
              </div>
            </div>

            {/* 4. Purchases and Refunds */}
            <div className="border-l-4 border-[#E60000] pl-6">
              <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide">
                4. Purchases and Refunds
              </h2>
              <div className="space-y-4 text-[#CCCCCC]">
                <p>
                  All purchases made through our Service are final. We offer limited refunds 
                  under specific circumstances:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Technical issues preventing service delivery</li>
                  <li>Duplicate purchases made in error</li>
                  <li>Server downtime exceeding 48 hours</li>
                </ul>
                <p>
                  Refund requests must be submitted within 7 days of purchase and 
                  are subject to review and approval.
                </p>
              </div>
            </div>

            {/* 5. Server Rules and Conduct */}
            <div className="border-l-4 border-[#E60000] pl-6">
              <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide">
                5. Server Rules and Conduct
              </h2>
              <div className="space-y-4 text-[#CCCCCC]">
                <p>
                  Players must adhere to our community guidelines and server rules. 
                  Violations may result in:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Temporary or permanent bans</li>
                  <li>Loss of purchased items or ranks</li>
                  <li>Restriction from certain server features</li>
                  <li>Account termination</li>
                </ul>
              </div>
            </div>

            {/* 6. Intellectual Property */}
            <div className="border-l-4 border-[#E60000] pl-6">
              <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide">
                6. Intellectual Property
              </h2>
              <div className="space-y-4 text-[#CCCCCC]">
                <p>
                  The Service and its original content, features, and functionality are owned by 
                  Atlas and are protected by international copyright, trademark, and other 
                  intellectual property laws.
                </p>
                <p>
                  You may not reproduce, distribute, modify, or create derivative works of 
                  our content without explicit written permission.
                </p>
              </div>
            </div>

            {/* 7. Privacy and Data */}
            <div className="border-l-4 border-[#E60000] pl-6">
              <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide">
                7. Privacy and Data
              </h2>
              <div className="space-y-4 text-[#CCCCCC]">
                <p>
                  Your privacy is important to us. We collect and use information in accordance 
                  with our Privacy Policy. By using our Service, you consent to the collection 
                  and use of information as outlined in our Privacy Policy.
                </p>
                <p>
                  We may collect gameplay data, chat logs, and technical information to 
                  improve our services and ensure fair play.
                </p>
              </div>
            </div>

            {/* 8. Limitation of Liability */}
            <div className="border-l-4 border-[#E60000] pl-6">
              <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide">
                8. Limitation of Liability
              </h2>
              <div className="space-y-4 text-[#CCCCCC]">
                <p>
                  Atlas shall not be liable for any indirect, incidental, special, consequential, 
                  or punitive damages resulting from your use of the Service.
                </p>
                <p>
                  Our total liability shall not exceed the amount paid by you for the Service 
                  in the twelve months preceding the claim.
                </p>
              </div>
            </div>

            {/* 9. Changes to Terms */}
            <div className="border-l-4 border-[#E60000] pl-6">
              <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide">
                9. Changes to Terms
              </h2>
              <div className="space-y-4 text-[#CCCCCC]">
                <p>
                  We reserve the right to modify these Terms at any time. We will notify users 
                  of any changes by posting the new Terms on this page and updating the 
                  "Last updated" date.
                </p>
                <p>
                  Your continued use of the Service after any changes constitutes acceptance 
                  of the new Terms.
                </p>
              </div>
            </div>

            {/* 10. Contact Information */}
            <div className="border-l-4 border-[#E60000] pl-6">
              <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide">
                10. Contact Information
              </h2>
              <div className="space-y-4 text-[#CCCCCC]">
                <p>
                  If you have any questions about these Terms of Service, please contact us at:
                </p>
                <div className="bg-gray-900/50 border border-gray-700/50 rounded-lg p-4 mt-4">
                  <p><strong>Email:</strong> legal@atlas-gaming.com</p>
                  <p><strong>Discord:</strong> Atlas Gaming Community</p>
                  <p><strong>Website:</strong> www.atlas-gaming.com</p>
                </div>
              </div>
            </div>

          </section>

          {/* Footer Notice */}
          <div className="bg-gray-900/30 border border-gray-700/30 rounded-lg p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Shield className="h-5 w-5 text-[#E60000]" />
              <span className="text-white font-medium">Atlas Gaming</span>
            </div>
            <p className="text-[#CCCCCC] text-sm">
              These terms are effective as of the date listed above and will remain in effect 
              except with respect to any changes in their provisions in the future.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
} 