"use client"

import Navbar from "@/components/NavBar"
import GradientBlinds from "@/components/GradientBlinds"

export default function SoftwareLicense() {
  return (
    <div className="min-h-screen bg-[#07080a]">
      <Navbar />
      
      {/* Animated Gradient Background */}
      <div className="fixed inset-0 w-full h-screen flex items-center justify-center">
        <GradientBlinds
          gradientColors={["#3b0a0a", "#7f1d1d", "#dc2626", "#ef4444"]}
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
              Software License Agreement
            </h1>
            <p className="text-lg text-white">
              Last Updated: 01 Nov 2025
            </p>
          </div>

          <div className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl">
            <div className="prose prose-invert max-w-none">
              <p className="text-white/80 mb-6">
                This Software License Agreement ("Agreement") is a legal agreement between you (either an individual or an entity) and Intellaris Private Limited ("Company," "we," "our," or "us") for the use of LoopSync – One Window software, including its browser extension, applications, website, APIs, cloud services, and associated platforms (collectively, the "Software").
              </p>
              
              <p className="text-white/80 mb-6">
                By installing, accessing, or using the Software, you acknowledge that you have read, understood, and agreed to be bound by the terms of this Agreement. If you do not agree to these terms, you must not install or use the Software.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. License Grant</h2>
              <p className="text-white/80 mb-4">
                Subject to the terms of this Agreement, we grant you a limited, non-exclusive, non-transferable, revocable license to use the Software solely for your internal business purposes in accordance with the documentation provided.
              </p>
              <p className="text-white/80 mb-6">
                This license does not include any right to sublicense, distribute, sell, or otherwise transfer the Software or any portion thereof to any third party.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. Restrictions</h2>
              <p className="text-white/80 mb-4">
                You agree not to:
              </p>
              <ul className="list-disc list-inside text-white/80 mb-6 space-y-2">
                <li>Reverse engineer, decompile, disassemble, or attempt to derive the source code of the Software;</li>
                <li>Modify, adapt, or create derivative works based on the Software;</li>
                <li>Rent, lease, lend, sublicense, or otherwise transfer the Software to any third party;</li>
                <li>Remove, alter, or obscure any proprietary notices on the Software;</li>
                <li>Use the Software in any manner that could damage, disable, overburden, or impair our servers or networks;</li>
                <li>Use the Software for any illegal or unauthorized purpose.</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. Ownership</h2>
              <p className="text-white/80 mb-6">
                The Software and all intellectual property rights therein are and shall remain our exclusive property. This Agreement does not grant you any ownership rights in the Software. All rights not expressly granted herein are reserved.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">4. Subscription and Fees</h2>
              <p className="text-white/80 mb-4">
                Access to certain features of the Software may require a subscription and payment of fees. By purchasing a subscription, you agree to pay all fees and charges associated with your subscription at the rates in effect at the time of purchase.
              </p>
              <p className="text-white/80 mb-6">
                All fees are non-refundable except as expressly stated in our Refund Policy or as required by law.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">5. Term and Termination</h2>
              <p className="text-white/80 mb-4">
                This Agreement is effective upon your acceptance and installation of the Software and will continue until terminated.
              </p>
              <p className="text-white/80 mb-4">
                We may terminate this Agreement at any time for any reason, including but not limited to:
              </p>
              <ul className="list-disc list-inside text-white/80 mb-4 space-y-2">
                <li>Your breach of any term of this Agreement;</li>
                <li>Cessation of operations;</li>
                <li>Non-payment of fees;</li>
                <li>At our sole discretion.</li>
              </ul>
              <p className="text-white/80 mb-6">
                Upon termination, you must cease all use of the Software and destroy all copies in your possession.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">6. Disclaimer of Warranties</h2>
              <p className="text-white/80 mb-6">
                THE SOFTWARE IS PROVIDED "AS IS" AND WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SOFTWARE WILL OPERATE ERROR-FREE OR THAT DEFECTS WILL BE CORRECTED.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">7. Limitation of Liability</h2>
              <p className="text-white/80 mb-6">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL WE BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE SOFTWARE.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">8. Indemnification</h2>
              <p className="text-white/80 mb-6">
                You agree to indemnify, defend, and hold harmless Intellaris Private Limited and its affiliates, officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses arising out of or in any way connected with your violation of this Agreement or your use of the Software.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">9. Governing Law</h2>
              <p className="text-white/80 mb-6">
                This Agreement shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions. Any dispute arising from this Agreement shall be subject to the exclusive jurisdiction of the courts in Assam, India.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">10. Changes to This Agreement</h2>
              <p className="text-white/80 mb-4">
                We reserve the right to modify this Agreement at any time. We will notify you of any material changes by posting the updated Agreement on our website or through other appropriate communication channels.
              </p>
              <p className="text-white/80 mb-6">
                Your continued use of the Software after such modifications constitutes your acceptance of the updated Agreement.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">11. Contact Information</h2>
              <p className="text-white/80 mb-4">
                For questions about this Software License Agreement:
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