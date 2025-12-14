"use client"

import Navbar from "@/components/NavBar"
import GradientBlinds from "@/components/GradientBlinds"

export default function FairUsePolicy() {
  return (
    <div className="min-h-screen bg-[#07080a]">
      <Navbar />
      
      {/* Animated Gradient Background */}
      <div className="fixed inset-0 w-full h-screen flex items-center justify-center">
        <GradientBlinds
          gradientColors={["#300010", "#660033", "#cc3399", "#ff66cc"]}
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
            <h1 className="text-4xl md:text-5xl mt-15 font-bold text-white mb-4">
              Fair Use Policy
            </h1>
            <p className="text-lg text-white">
              Last Updated: 01 Nov 2025
            </p>
          </div>

          <div className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl">
            <div className="prose prose-invert max-w-none">
              <p className="text-white/80 mb-6">
                This Fair Use Policy ("Policy") outlines the acceptable usage limits and guidelines for the LoopSync – One Window service provided by Intellaris Private Limited ("Company," "we," "our," or "us"). This Policy is designed to ensure fair access to our services for all users while preventing abuse that could impact service quality.
              </p>
              
              <p className="text-white/80 mb-6">
                By using our Service, you agree to comply with this Fair Use Policy. We reserve the right to modify these guidelines at any time and may take action against users who violate this Policy.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. Purpose of This Policy</h2>
              <p className="text-white/80 mb-6">
                The purpose of this Fair Use Policy is to ensure that all users have equitable access to our services while maintaining the quality and performance of our platform. This Policy helps us identify and address usage patterns that could negatively impact other users or the overall service.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. General Usage Guidelines</h2>
              <p className="text-white/80 mb-4">
                We encourage all users to use our Service responsibly. General guidelines include:
              </p>
              <ul className="list-disc list-inside text-white/80 mb-6 space-y-2">
                <li>Use the Service for its intended purposes only</li>
                <li>Do not attempt to circumvent usage limits or restrictions</li>
                <li>Do not use the Service in ways that could harm system performance</li>
                <li>Respect the rights of other users and their data</li>
                <li>Comply with all applicable laws and regulations</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. Usage Limits</h2>
              <h3 className="text-xl font-semibold text-white mt-6 mb-3">3.1 Free Tier Limits</h3>
              <p className="text-white/80 mb-4">
                Free tier users are subject to the following limits:
              </p>
              <ul className="list-disc list-inside text-white/80 mb-4 space-y-1">
                <li>Maximum API requests: 1,000 per day</li>
                <li>Storage limit: 100 MB</li>
                <li>Processing time: 30 minutes per day</li>
                <li>Screenshot captures: 50 per day</li>
              </ul>
              
              <h3 className="text-xl font-semibold text-white mt-6 mb-3">3.2 Pro Tier Limits</h3>
              <p className="text-white/80 mb-4">
                Pro tier users are subject to the following limits:
              </p>
              <ul className="list-disc list-inside text-white/80 mb-6 space-y-1">
                <li>Maximum API requests: 10,000 per day</li>
                <li>Storage limit: 10 GB</li>
                <li>Processing time: 5 hours per day</li>
                <li>Screenshot captures: 500 per day</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">4. Prohibited Activities</h2>
              <p className="text-white/80 mb-4">
                The following activities are strictly prohibited:
              </p>
              <ul className="list-disc list-inside text-white/80 mb-6 space-y-2">
                <li>Using the Service for competitive analysis or data mining</li>
                <li>Automated bulk processing without authorization</li>
                <li>Attempting to reverse engineer our systems</li>
                <li>Using the Service to distribute spam or malicious content</li>
                <li>Reselling or redistributing our services without permission</li>
                <li>Excessive usage that impacts other users' experience</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">5. Monitoring and Enforcement</h2>
              <p className="text-white/80 mb-4">
                We monitor usage patterns to ensure compliance with this Policy. Actions we may take include:
              </p>
              <ul className="list-disc list-inside text-white/80 mb-6 space-y-2">
                <li>Temporary rate limiting for excessive usage</li>
                <li>Notifying users of potential violations</li>
                <li>Requiring upgrade to higher-tier plans for legitimate high usage</li>
                <li>Suspending or terminating accounts for serious violations</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">6. Exception Requests</h2>
              <p className="text-white/80 mb-6">
                If you have legitimate needs that exceed standard usage limits, you may request an exception by contacting our support team. We will review requests on a case-by-case basis and may require additional information or payment for extended usage.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">7. Data Processing Fair Use</h2>
              <p className="text-white/80 mb-4">
                When processing content through our AI systems, users should:
              </p>
              <ul className="list-disc list-inside text-white/80 mb-6 space-y-2">
                <li>Submit relevant, purposeful content only</li>
                <li>Avoid submitting repetitive or meaningless data</li>
                <li>Respect intellectual property rights in submitted content</li>
                <li>Ensure content is appropriate for our systems</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">8. Storage Fair Use</h2>
              <p className="text-white/80 mb-6">
                Our storage systems are intended for active project data. Users should not use our storage as a backup or archival solution for large volumes of inactive data. We may contact users with excessive inactive storage to optimize their usage.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">9. Network and Bandwidth Fair Use</h2>
              <p className="text-white/80 mb-6">
                Users should avoid activities that consume excessive bandwidth or create network strain, including but not limited to: streaming large files through our systems, using our services as content delivery networks, or creating artificial traffic patterns.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">10. Changes to This Policy</h2>
              <p className="text-white/80 mb-4">
                We reserve the right to modify this Fair Use Policy at any time. Changes will be communicated through:
              </p>
              <ul className="list-disc list-inside text-white/80 mb-6 space-y-2">
                <li>Email notifications to registered users</li>
                <li>Updates to this page on our website</li>
                <li>In-app notifications when relevant</li>
              </ul>
              <p className="text-white/80 mb-6">
                Continued use of the Service after changes constitutes acceptance of the revised Policy.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">11. Contact Information</h2>
              <p className="text-white/80 mb-4">
                For questions about this Fair Use Policy:
              </p>
              <p className="text-white font-semibold mb-2">
                INTELLARIS PRIVATE LIMITED
              </p>
              <p className="text-white font-semibold mb-2">
                Khaniram Boro Pathghy, Garchuk, Kamrup (Metro), Assam, India - 781035
              </p>
              <p className="text-white font-semibold mb-2">
                Email: legal.company@intellaris.co
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