"use client"

import Navbar from "@/components/NavBar"
import GradientBlinds from "@/components/GradientBlinds"

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#07080a]">
      <Navbar />
      
      {/* Animated Gradient Background */}
      <div className="fixed inset-0 w-full h-screen flex items-center justify-center">
        <GradientBlinds
          gradientColors={["#0f1629", "#1e3a8a", "#2563eb", "#1d4ed8"]}
          angle={50}
          noise={0.25}
          blindCount={13}
          blindMinWidth={50}
          spotlightRadius={0.38}
          spotlightSoftness={1.6}
          spotlightOpacity={0.42}
          mouseDampening={0.15}
          distortAmount={0.8}
          shineDirection="right"
          mixBlendMode="overlay"
          animateColors={false}
          transitionDuration={2000}
        />
      </div>

      <div className="relative z-10 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl mt-15 md:text-5xl font-bold text-white mb-4">
              Privacy Policy
            </h1>
            <p className="text-lg text-white">
              Last Updated: 01 Nov 2025
            </p>
          </div>

          <div className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl">
            <div className="prose prose-invert max-w-none">
              <p className="text-white/80 mb-6">
                This Privacy Policy describes how Intellaris Private Limited ("Company," "we," "our," or "us") collects, uses, stores, shares, and protects information when you access or use LoopSync – One Window, including its browser extension, applications, website, APIs, cloud services, and associated platforms (collectively, the "Service").
              </p>
              
              <p className="text-white/80 mb-6">
                By accessing or using the Service, you acknowledge that you have read, understood, and agreed to the practices described in this Privacy Policy. If you do not agree, you must stop using the Service.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. Definitions</h2>
              <p className="text-white/80 mb-4">
                For purposes of this Privacy Policy:
              </p>
              <ul className="list-disc list-inside text-white/80 mb-6 space-y-2">
                <li><span className="font-semibold">"Personal Data"</span> means any information that identifies, relates to, describes, or can reasonably be associated with an individual.</li>
                <li><span className="font-semibold">"Usage Data"</span> means analytics or technical information automatically collected when interacting with the Service.</li>
                <li><span className="font-semibold">"Content"</span> means text, code snippets, screenshots, data, documents, or any input you voluntarily provide to the Service.</li>
                <li><span className="font-semibold">"Process / Processing"</span> refers to any action performed on data, including collection, storage, analysis, transmission, or deletion.</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. Scope</h2>
              <p className="text-white/80 mb-4">
                This Privacy Policy applies to all users of LoopSync – One Window, including individuals, teams, and enterprise users, and covers all platforms where the Service is offered.
              </p>
              <p className="text-white/80 mb-4">
                It does not apply to:
              </p>
              <ul className="list-disc list-inside text-white/80 mb-6 space-y-2">
                <li>Third-party integrations you choose to connect with LoopSync,</li>
                <li>External websites linked to or from the Service,</li>
                <li>Data processed independently by third-party AI models not controlled by us.</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. Information We Collect</h2>
              <h3 className="text-xl font-semibold text-white mt-6 mb-3">3.1 Information You Provide</h3>
              <p className="text-white/80 mb-4">
                We collect information that you voluntarily submit, including:
              </p>
              
              <h4 className="text-lg font-semibold text-white mt-4 mb-2">Account & Profile Information</h4>
              <ul className="list-disc list-inside text-white/80 mb-4 space-y-1">
                <li>Name</li>
                <li>Email address</li>
                <li>Phone number (optional)</li>
                <li>Organization details</li>
                <li>Authentication credentials (securely hashed)</li>
              </ul>
              
              <h4 className="text-lg font-semibold text-white mt-4 mb-2">User Content</h4>
              <p className="text-white/80 mb-4">
                LoopSync is a cloud-based intelligent framework that captures, analyzes, and processes content, including:
              </p>
              <ul className="list-disc list-inside text-white/80 mb-4 space-y-1">
                <li>Screenshots or on-screen content you choose to capture</li>
                <li>Text you type or paste</li>
                <li>Code snippets</li>
                <li>Documents</li>
                <li>Tasks, prompts, or queries submitted to the model</li>
                <li>Metadata relating to captured content</li>
              </ul>
              <p className="text-white/80 mb-4 italic">
                Note: LoopSync's stealth/invisible mode respects all user-triggered actions and does not collect hidden or unauthorized data.
              </p>
              
              <h4 className="text-lg font-semibold text-white mt-4 mb-2">Communication Data</h4>
              <ul className="list-disc list-inside text-white/80 mb-6 space-y-1">
                <li>Support requests</li>
                <li>Feedback or surveys</li>
                <li>Interactions with customer success channels</li>
              </ul>
              
              <h3 className="text-xl font-semibold text-white mt-6 mb-3">3.2 Information Automatically Collected</h3>
              <h4 className="text-lg font-semibold text-white mt-4 mb-2">Device & Technical Information</h4>
              <ul className="list-disc list-inside text-white/80 mb-4 space-y-1">
                <li>IP address</li>
                <li>Browser type/version</li>
                <li>Operating system</li>
                <li>Device identifiers</li>
                <li>Session logs</li>
                <li>Crash diagnostics</li>
                <li>Performance metrics</li>
              </ul>
              
              <h4 className="text-lg font-semibold text-white mt-4 mb-2">Usage Data</h4>
              <ul className="list-disc list-inside text-white/80 mb-6 space-y-1">
                <li>Frequency of feature use</li>
                <li>API call metadata</li>
                <li>Interaction timestamps</li>
                <li>Extension events</li>
                <li>Model processing statistics</li>
              </ul>
              <p className="text-white/80 mb-6">
                We use cookies, beacons, local storage, and similar technologies to enhance functionality, authentication, and analytics.
              </p>
              
              <h3 className="text-xl font-semibold text-white mt-6 mb-3">3.3 Third-Party Sources</h3>
              <p className="text-white/80 mb-6">
                We may receive information from:
              </p>
              <ul className="list-disc list-inside text-white/80 mb-6 space-y-1">
                <li>Authentication providers (e.g., Google OAuth)</li>
                <li>Payment processors</li>
                <li>Enterprise administrators</li>
                <li>Publicly available sources</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">4. How We Use Your Information</h2>
              <p className="text-white/80 mb-4">
                We process data strictly for legitimate, disclosed purposes, including:
              </p>
              
              <h3 className="text-xl font-semibold text-white mt-6 mb-3">4.1 To Provide and Improve the Service</h3>
              <ul className="list-disc list-inside text-white/80 mb-4 space-y-1">
                <li>Model reasoning, analysis, and content understanding</li>
                <li>Personalization and performance optimization</li>
                <li>Training on aggregated, anonymized datasets (unless opted-out)</li>
                <li>Bug fixes and operational diagnostics</li>
              </ul>
              
              <h3 className="text-xl font-semibold text-white mt-6 mb-3">4.2 To Ensure Security</h3>
              <ul className="list-disc list-inside text-white/80 mb-4 space-y-1">
                <li>Fraud detection</li>
                <li>Abuse prevention</li>
                <li>Account integrity verification</li>
                <li>Unauthorized data access monitoring</li>
              </ul>
              
              <h3 className="text-xl font-semibold text-white mt-6 mb-3">4.3 For Communication</h3>
              <ul className="list-disc list-inside text-white/80 mb-4 space-y-1">
                <li>Service alerts and updates</li>
                <li>Administrative notices</li>
                <li>Customer support</li>
              </ul>
              
              <h3 className="text-xl font-semibold text-white mt-6 mb-3">4.4 Legal and Compliance Obligations</h3>
              <ul className="list-disc list-inside text-white/80 mb-6 space-y-1">
                <li>Responding to lawful requests</li>
                <li>Enforcing terms</li>
                <li>Preventing violations or harmful behavior</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">5. Legal Bases for Processing (for GDPR/Global Applicability)</h2>
              <p className="text-white/80 mb-6">
                We process Personal Data based on:
              </p>
              <ul className="list-disc list-inside text-white/80 mb-6 space-y-1">
                <li>Consent</li>
                <li>Contractual necessity</li>
                <li>Legitimate interests (product improvement, security)</li>
                <li>Compliance with legal obligations</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">6. Sharing of Information</h2>
              <p className="text-white/80 mb-4">
                We do not sell Personal Data.
              </p>
              <p className="text-white/80 mb-4">
                We may share your data with:
              </p>
              
              <h3 className="text-xl font-semibold text-white mt-6 mb-3">6.1 Service Providers</h3>
              <p className="text-white/80 mb-4">
                Trusted vendors supporting:
              </p>
              <ul className="list-disc list-inside text-white/80 mb-4 space-y-1">
                <li>Hosting (cloud providers)</li>
                <li>Data storage</li>
                <li>Analytics</li>
                <li>Authentication</li>
                <li>Payment processing</li>
              </ul>
              <p className="text-white/80 mb-4">
                Providers are contractually bound to confidentiality and data protection obligations.
              </p>
              
              <h3 className="text-xl font-semibold text-white mt-6 mb-3">6.2 Third-Party Integrations</h3>
              <p className="text-white/80 mb-4">
                If you choose to connect LoopSync with external tools (e.g., GitHub, Notion), data is shared only with your authorization.
              </p>
              
              <h3 className="text-xl font-semibold text-white mt-6 mb-3">6.3 Corporate Transactions</h3>
              <p className="text-white/80 mb-4">
                In case of merger, acquisition, restructuring, or asset sale, data may be transferred subject to confidentiality safeguards.
              </p>
              
              <h3 className="text-xl font-semibold text-white mt-6 mb-3">6.4 Legal Requirements</h3>
              <p className="text-white/80 mb-6">
                We may disclose data when required by:
              </p>
              <ul className="list-disc list-inside text-white/80 mb-4 space-y-1">
                <li>Court orders</li>
                <li>Law enforcement</li>
                <li>Regulatory obligations</li>
              </ul>
              <p className="text-white/80 mb-6">
                Whenever legally permissible, we will notify affected users.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">7. Data Retention</h2>
              <p className="text-white/80 mb-4">
                We retain Personal Data only as long as necessary for:
              </p>
              <ul className="list-disc list-inside text-white/80 mb-4 space-y-1">
                <li>Providing the Service</li>
                <li>Meeting legal obligations</li>
                <li>Resolving disputes</li>
                <li>Enforcing agreements</li>
              </ul>
              <p className="text-white/80 mb-6">
                Users may request deletion of their data at any time (see Section 10).
                Content submitted to models is retained in accordance with user settings and plan type.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">8. Data Security</h2>
              <p className="text-white/80 mb-4">
                We implement industry-standard measures, including:
              </p>
              <ul className="list-disc list-inside text-white/80 mb-6 space-y-1">
                <li>Encryption at rest and in transit</li>
                <li>Access controls</li>
                <li>Multi-factor authentication</li>
                <li>Network isolation</li>
                <li>Periodic vulnerability assessments</li>
              </ul>
              <p className="text-white/80 mb-6">
                Despite safeguards, no system is 100% secure. Users are encouraged to maintain strong credentials and follow best practices.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">9. International Data Transfers</h2>
              <p className="text-white/80 mb-4">
                Your information may be processed in jurisdictions outside your country of residence.
                We ensure adequate protection through:
              </p>
              <ul className="list-disc list-inside text-white/80 mb-6 space-y-1">
                <li>Standard Contractual Clauses</li>
                <li>Data Processing Agreements</li>
                <li>Regional compliance certifications</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">10. Your Rights</h2>
              <p className="text-white/80 mb-4">
                Depending on your jurisdiction, you may have rights to:
              </p>
              <ul className="list-disc list-inside text-white/80 mb-4 space-y-1">
                <li>Access your data</li>
                <li>Correct inaccurate information</li>
                <li>Delete your data ("Right to be Forgotten")</li>
                <li>Object to certain processing</li>
                <li>Restrict processing</li>
                <li>Withdraw consent</li>
                <li>Portability of your data</li>
                <li>Opt-out of non-essential data collection</li>
              </ul>
              <p className="text-white/80 mb-4">
                Requests can be made at:
              </p>
              <p className="text-white font-bold mb-6">
                legal.company@intellaris.co
              </p>
              <p className="text-white/80 mb-6">
                We respond to verified requests within applicable legal timelines.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">11. Children's Privacy</h2>
              <p className="text-white/80 mb-6">
                The Service is not intended for individuals under 16 years.
                We do not knowingly collect data from minors.
                If you believe that data has been collected inadvertently, contact us for prompt removal.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">12. Third-Party Links & AI Models</h2>
              <p className="text-white/80 mb-4">
                LoopSync may interact with:
              </p>
              <ul className="list-disc list-inside text-white/80 mb-4 space-y-1">
                <li>Third-party APIs</li>
                <li>External documentation</li>
                <li>AI processing models</li>
              </ul>
              <p className="text-white/80 mb-6">
                We are not responsible for data practices of external entities.
                Users are encouraged to review the privacy terms of such providers.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">13. Changes to This Policy</h2>
              <p className="text-white/80 mb-4">
                We may update this Privacy Policy from time to time.
                Material changes will be communicated through:
              </p>
              <ul className="list-disc list-inside text-white/80 mb-4 space-y-1">
                <li>Email notifications</li>
                <li>In-app alerts</li>
                <li>Website notices</li>
              </ul>
              <p className="text-white/80 mb-6">
                Continued use of the Service constitutes acceptance of the revised policy.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">14. Contact Us</h2>
              <p className="text-white/80 mb-4">
                For questions, requests, or complaints related to privacy:
              </p>
              <p className="text-white font-semibold mb-2">
                INTELLARIS PRIVATE LIMITED
              </p>
              <p className="text-white font-semibold mb-2">
                Khaniram Boro Pathghy, Garchuk, Kamrup (Metro), Assam, India - 781035
              </p>
              <p className="text-white font-semibold mb-2">
                Email: privacy.onewindow@intellaris.co
              </p>
              <p className="text-white font-semibold mb-6">
                Website: www.intellaris.co
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}