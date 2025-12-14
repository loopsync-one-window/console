"use client"

import Navbar from "@/components/NavBar"
import GradientBlinds from "@/components/GradientBlinds"

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-[#07080a]">
      <Navbar />
      
      {/* Animated Gradient Background */}
      <div className="fixed inset-0 w-full h-screen flex items-center justify-center">
        <GradientBlinds
          gradientColors={["#1a1a1a", "#2d2d2d", "#404040", "#595959"]}
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
              Refund Policy
            </h1>
            <p className="text-lg text-white">
              Last Updated: 01 Nov 2025
            </p>
          </div>

          <div className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl">
            <div className="prose prose-invert max-w-none">
              <p className="text-white/80 mb-6">
                This Refund Policy ("Policy") describes the terms and conditions regarding refunds for subscriptions and purchases of LoopSync – One Window services provided by Intellaris Private Limited ("Company," "we," "our," or "us").
              </p>
              
              <p className="text-white/80 mb-6">
                By purchasing our services, you agree to the terms of this Refund Policy. We reserve the right to modify this Policy at any time, and such modifications will be effective immediately upon posting.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. General Refund Principles</h2>
              <p className="text-white/80 mb-6">
                We strive to ensure customer satisfaction with our services. However, due to the nature of digital services, refunds are provided at our discretion and in accordance with this Policy.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. Subscription Refunds</h2>
              <h3 className="text-xl font-semibold text-white mt-6 mb-3">2.1 Free Trial Period</h3>
              <p className="text-white/80 mb-6">
                Users who sign up for a free trial are eligible for a full refund of any charges incurred during the trial period if requested within 7 days of the trial start date, provided no premium features were used beyond the trial limits.
              </p>

              <h3 className="text-xl font-semibold text-white mt-6 mb-3">2.2 Monthly Subscriptions</h3>
              <p className="text-white/80 mb-6">
                Monthly subscription refunds may be considered within 7 days of the initial charge if:
              </p>
              <ul className="list-disc list-inside text-white/80 mb-6 space-y-2">
                <li>The service was not as described</li>
                <li>There was a technical issue that prevented service usage</li>
                <li>The user experienced significant service disruption</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mt-6 mb-3">2.3 Annual Subscriptions</h3>
              <p className="text-white/80 mb-6">
                Annual subscription refunds may be considered within 7 days of the initial charge under the same conditions as monthly subscriptions. After this period, pro-rated refunds may be provided for the remaining unused portion of the subscription.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. One-Time Purchases</h2>
              <p className="text-white/80 mb-6">
                Refunds for one-time purchases (such as add-on features or premium tools) may be considered within 7 days of purchase if the product was not as described or if technical issues prevented its use.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">4. Non-Refundable Items</h2>
              <p className="text-white/80 mb-4">
                The following are generally non-refundable:
              </p>
              <ul className="list-disc list-inside text-white/80 mb-6 space-y-2">
                <li>Services used beyond the trial or refund period</li>
                <li>Custom development or implementation services</li>
                <li>Consulting or support services already rendered</li>
                <li>Fees associated with payment processing</li>
                <li>Domain registration or third-party service fees</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">5. Refund Process</h2>
              <p className="text-white/80 mb-4">
                To request a refund, users must:
              </p>
              <ul className="list-disc list-inside text-white/80 mb-6 space-y-2">
                <li>Contact our support team at refunds@loopsync.cloud</li>
                <li>Provide proof of purchase and account information</li>
                <li>Explain the reason for the refund request</li>
                <li>Include any relevant documentation or screenshots</li>
              </ul>
              <p className="text-white/80 mb-6">
                Refund requests will be reviewed within 5-10 business days. Approved refunds will be processed within 30 days of approval.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">6. Chargebacks</h2>
              <p className="text-white/80 mb-6">
                Initiating a chargeback with your payment provider without first contacting us may result in account suspension or termination. We encourage all users to resolve issues directly with our support team before pursuing chargebacks.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">7. Service Credits</h2>
              <p className="text-white/80 mb-6">
                In cases where service disruptions occur, we may offer service credits instead of refunds. These credits can be applied to future billing cycles and are determined based on the duration and impact of the service disruption.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">8. Enterprise and Custom Agreements</h2>
              <p className="text-white/80 mb-6">
                Enterprise customers and those with custom agreements may have different refund terms as outlined in their specific contracts. These terms supersede this general Refund Policy.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">9. Changes to This Policy</h2>
              <p className="text-white/80 mb-4">
                We reserve the right to modify this Refund Policy at any time. Changes will be communicated through:
              </p>
              <ul className="list-disc list-inside text-white/80 mb-6 space-y-2">
                <li>Email notifications to registered users</li>
                <li>Updates to this page on our website</li>
                <li>In-app notifications when relevant</li>
              </ul>
              <p className="text-white/80 mb-6">
                Continued use of our services after changes constitutes acceptance of the revised Policy.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">10. Contact Information</h2>
              <p className="text-white/80 mb-4">
                For questions about this Refund Policy or to request a refund:
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