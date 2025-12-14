"use client"

import Navbar from "@/components/NavBar"
import GradientBlinds from "@/components/GradientBlinds"

export default function ShippingPolicy() {
  return (
    <div className="min-h-screen bg-[#07080a]">
      <Navbar />
      
      {/* Animated Gradient Background */}
      <div className="fixed inset-0 w-full h-screen flex items-center justify-center">
        <GradientBlinds
          gradientColors={["#001a33", "#003366", "#0066cc", "#0099ff"]}
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
              Shipping Policy
            </h1>
            <p className="text-lg text-white">
              Last Updated: 15 Nov 2025
            </p>
          </div>

          <div className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl">
            <div className="prose prose-invert max-w-none">
              <p className="text-white/80 mb-6">
                This Shipping Policy ("Policy") describes the terms and conditions regarding the delivery of products and services provided by Intellaris Private Limited ("Company," "we," "our," or "us") in connection with LoopSync – One Window.
              </p>
              
              <div className="bg-white/10 border border-white rounded-lg p-4 mb-6">
                <h3 className="text-lg font-bold text-white mb-2">Important Notice</h3>
                <p className="text-white">
                  LoopSync - One Window is a Software as a Service (SaaS) platform. We do not ship any physical products. All our offerings are delivered electronically.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. No Physical Products</h2>
              <p className="text-white/80 mb-6">
                LoopSync - One Window is exclusively a cloud-based software platform. We do not manufacture, sell, or distribute any physical goods, merchandise, or materials. Our services are delivered entirely through digital means, including:
              </p>
              <ul className="list-disc list-inside text-white/80 mb-6 space-y-2">
                <li>Browser extension for Chrome and other supported browsers</li>
                <li>Cloud-based AI processing services</li>
                <li>Web application access</li>
                <li>API integrations</li>
                <li>Digital documentation and manuals</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. Electronic Delivery Only</h2>
              <p className="text-white/80 mb-6">
                All products and services are delivered electronically through:
              </p>
              <ul className="list-disc list-inside text-white/80 mb-6 space-y-2">
                <li>Browser-based access to our platform</li>
                <li>Direct download links for software products</li>
                <li>Email delivery of account credentials and documentation</li>
                <li>Online activation of subscription services</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. No Shipping Required</h2>
              <p className="text-white/80 mb-6">
                Since all our offerings are digital, there is no physical shipping involved. Customers receive immediate access to our services upon account creation and subscription activation.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">4. Fraud Prevention</h2>
              <p className="text-white/80 mb-4">
                To protect our customers and prevent fraudulent activities, we:
              </p>
              <ul className="list-disc list-inside text-white/80 mb-6 space-y-2">
                <li>Do not engage with any requests for physical shipping</li>
                <li>Only provide services through our official digital channels</li>
                <li>Verify all account information during registration</li>
                <li>Monitor for suspicious activities and unauthorized access attempts</li>
                <li>Require secure authentication for all account access</li>
              </ul>
              <p className="text-white/80 mb-6">
                Any requests for physical delivery of our products should be considered fraudulent and reported to our security team immediately at security@intellaris.co.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">5. Account Access</h2>
              <p className="text-white/80 mb-6">
                Customers receive instant access to our services upon successful registration and subscription. Access details are provided through:
              </p>
              <ul className="list-disc list-inside text-white/80 mb-6 space-y-2">
                <li>Welcome email with account credentials</li>
                <li>Dashboard access through our website</li>
                <li>Browser extension installation instructions</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">6. International Access</h2>
              <p className="text-white/80 mb-6">
                Our services are accessible globally through the internet. There are no geographic restrictions on accessing our platform, though some features may be subject to local regulations.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">7. Support and Assistance</h2>
              <p className="text-white/80 mb-6">
                For assistance with accessing our services or technical support:
              </p>
              <ul className="list-disc list-inside text-white/80 mb-6 space-y-2">
                <li>Email: support@loopsync.cloud</li>
                <li>Online documentation: loopsync.cloud/docs</li>
                <li>Community support forum: loopsync.cloud/community</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">8. Changes to This Policy</h2>
              <p className="text-white/80 mb-4">
                We reserve the right to modify this Shipping Policy at any time. Changes will be communicated through:
              </p>
              <ul className="list-disc list-inside text-white/80 mb-6 space-y-2">
                <li>Email notifications to registered users</li>
                <li>Updates to this page on our website</li>
                <li>In-app notifications when relevant</li>
              </ul>
              <p className="text-white/80 mb-6">
                Continued use of our services after changes constitutes acceptance of the revised Policy.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">9. Contact Information</h2>
              <p className="text-white/80 mb-4">
                For questions about this policy or to report potential fraud:
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