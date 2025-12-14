"use client"

import Navbar from "@/components/NavBar"
import GradientBlinds from "@/components/GradientBlinds"

export default function TermsOfUse() {
  return (
    <div className="min-h-screen bg-[#07080a]">
      <Navbar />
      
      {/* Animated Gradient Background */}
      <div className="fixed inset-0 w-full h-screen flex items-center justify-center">
        <GradientBlinds
          gradientColors={["#001a00", "#003300", "#00cc00", "#00ff00"]}
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
              Terms of Use
            </h1>
            <p className="text-lg text-white">
              Last Updated: 01 Nov 2025
            </p>
          </div>

          <div className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl">
            <div className="prose prose-invert max-w-none">
              <p className="text-white/80 mb-6">
                These Terms of Use ("Terms") govern your access to and use of the LoopSync – One Window software, including its browser extension, applications, website, APIs, cloud services, and associated platforms (collectively, the "Service") provided by Intellaris Private Limited ("Company," "we," "our," or "us").
              </p>
              
              <p className="text-white/80 mb-6">
                By accessing or using the Service, you agree to be bound by these Terms. If you do not agree to these Terms, you must not access or use the Service.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. Acceptance of Terms</h2>
              <p className="text-white/80 mb-6">
                By accessing or using our Service, you confirm that you are at least 16 years old and have the legal capacity to enter into these Terms. If you are using the Service on behalf of an organization, you represent that you have the authority to bind that organization to these Terms.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. Service Description</h2>
              <p className="text-white/80 mb-4">
                LoopSync – One Window is an intelligent productivity platform that provides:
              </p>
              <ul className="list-disc list-inside text-white/80 mb-6 space-y-2">
                <li>AI-powered content analysis and processing</li>
                <li>Browser extension for screen capture and interaction</li>
                <li>Cloud-based storage and synchronization</li>
                <li>Collaboration tools and integrations</li>
                <li>API access for developers</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. Account Registration</h2>
              <p className="text-white/80 mb-4">
                To access certain features of the Service, you must register for an account. You agree to:
              </p>
              <ul className="list-disc list-inside text-white/80 mb-6 space-y-2">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and update your information as needed</li>
                <li>Maintain the security of your password</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">4. User Responsibilities</h2>
              <p className="text-white/80 mb-4">
                You are responsible for your use of the Service and any content you provide. You agree not to:
              </p>
              <ul className="list-disc list-inside text-white/80 mb-6 space-y-2">
                <li>Use the Service for any illegal purpose</li>
                <li>Interfere with or disrupt the Service</li>
                <li>Attempt to gain unauthorized access to the Service</li>
                <li>Use the Service to transmit malicious code</li>
                <li>Violate any applicable laws or regulations</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">5. Intellectual Property</h2>
              <p className="text-white/80 mb-6">
                The Service and all content, features, and functionality are owned by Intellaris Private Limited and are protected by copyright, trademark, and other intellectual property laws. You are granted a limited license to use the Service as provided in these Terms.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">6. Subscription and Payments</h2>
              <p className="text-white/80 mb-4">
                Certain features of the Service require a paid subscription. By purchasing a subscription, you agree to:
              </p>
              <ul className="list-disc list-inside text-white/80 mb-6 space-y-2">
                <li>Pay all fees as described at the time of purchase</li>
                <li>Authorize us to charge your payment method</li>
                <li>Accept that fees may change with prior notice</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">7. Termination</h2>
              <p className="text-white/80 mb-6">
                We may terminate or suspend your access to the Service immediately, without prior notice, for any reason, including breach of these Terms. Upon termination, your right to use the Service will cease immediately.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">8. Disclaimer of Warranties</h2>
              <p className="text-white/80 mb-6">
                THE SERVICE IS PROVIDED "AS IS" AND WITHOUT WARRANTIES OF ANY KIND. WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NONINFRINGEMENT.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">9. Limitation of Liability</h2>
              <p className="text-white/80 mb-6">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF THE SERVICE.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">10. Governing Law</h2>
              <p className="text-white/80 mb-6">
                These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions. Any dispute arising from these Terms shall be subject to the exclusive jurisdiction of the courts in Assam, India.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">11. Changes to Terms</h2>
              <p className="text-white/80 mb-4">
                We reserve the right to modify these Terms at any time. We will notify you of any material changes by:
              </p>
              <ul className="list-disc list-inside text-white/80 mb-6 space-y-2">
                <li>Posting the updated Terms on our website</li>
                <li>Sending an email notification</li>
                <li>Providing in-app notifications</li>
              </ul>
              <p className="text-white/80 mb-6">
                Your continued use of the Service after such modifications constitutes your acceptance of the updated Terms.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">12. Contact Information</h2>
              <p className="text-white/80 mb-4">
                For questions about these Terms of Use:
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