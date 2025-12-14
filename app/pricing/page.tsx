"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Package, Building, ArrowRight } from "lucide-react"
import Navbar from "@/components/NavBar"
import { useRouter } from "next/navigation"

export default function PricingPage() {
  const router = useRouter();
  const [isAnnual, setIsAnnual] = useState(false);
  const [searchQuery, setSearchQuery] = useState("")

  const [expandedPlans, setExpandedPlans] = useState<Record<string, boolean>>({});

  const plans = [
    {
      name: "PRO",
      icon: Package,
      // Updated pricing values
      monthlyPrice: 759,
      annualPrice: 7399,
      annualSavings: 2000,
      description: "Ideal for individuals and small teams evaluating PRO features.",
      features: ["One Window Intelligence", "Workflow Automations", "Stealth Mode (limited)", "High-accuracy Responses"],
      moreFeatures: 14,
      detailedFeatures: [
        { category: "Free Trial", items: ["5 Requests / day"] },
        { category: "PRO", items: ["80 Requests / day", "500 total monthly quota"] },
        { category: "Included Features", items: [
          "Multi-Model Access (Limited) - Access multiple AI models with reduced parallel outputs.",
          "Code Sync (Limited) - Sync captured code across devices with basic restrictions.",
          "Dual Response View - View up to 2 AI responses side-by-side.",
          "Dashboard Output (Limited) - Access simplified dashboard insights with capped data display."
        ]}
      ]
    },
    {
      name: "PRO PRIME-X",
      icon: Building,
      // Updated pricing values
      monthlyPrice: 1299,
      annualPrice: 12599,
      annualSavings: 3000,
      description: "Built for scaling businesses and teams that need more power.",
      features: ["All in PRO (enhanced)", "One Window Intelligence+", "Priority Compute", "Expanded Context Window"],
      moreFeatures: 25,
      detailedFeatures: [
        { category: "Requests", items: ["Unlimited Requests / day", "1,500 total monthly quota"] },
        { category: "Included Features", items: [
          "Full Multi-Model Access - Leverage all 8 AI models simultaneously for richer, cross-verified insights.",
          "Advanced Code Sync - Sync and manage your code across devices without limits.",
          "Unlimited Response View - Compare and view all model outputs side-by-side for complete reasoning.",
          "Enhanced Dashboard Output - Access full dashboard analytics, summaries, and structured insights.",
          "Priority Processing - Faster response times and priority allocation for all requests."
        ]}
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-[#07080a] flex flex-col">
      <style jsx>{`
        .glass-effect {
          background: rgba(255, 255, 255, 0.08);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.18);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .glass-effect::before {
          content: '';
          position: absolute;
          top: -10px;
          left: -10px;
          right: -10px;
          bottom: -10px;
          background: radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: -1;
        }
        .glass-effect:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: scale(1.05);
        }
        .glass-effect:hover::before {
          opacity: 1;
        }
        .logo-effect {
          filter: brightness(0) invert(1) brightness(1.5) contrast(1.2);
          animation: pulse 2s infinite;
          transition: all 0.3s ease;
        }
        .logo-effect:hover {
          filter: brightness(0) invert(1) brightness(1.7) contrast(1.3) drop-shadow(0 0 8px rgba(255, 255, 255, 0.8));
        }
        @keyframes pulse {
          0% {
            filter: brightness(0) invert(1) brightness(1.5) contrast(1.2);
          }
          50% {
            filter: brightness(0) invert(1) brightness(1.7) contrast(1.3);
          }
          100% {
            filter: brightness(0) invert(1) brightness(1.5) contrast(1.2);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease forwards;
        }
      `}</style>
      {/* Added Navbar */}
      <Navbar />
      
      {/* Main content container with padding to account for fixed navbar */}
      <div className="pt-20 flex flex-col items-center justify-center px-4 flex-grow">
        {/* Background gradient effect */}
        <div className="absolute inset-0 opacity-60 pointer-events-none overflow-hidden">
        {/* Center blob — larger + lower */}
        <div className="absolute top-32 left-1/2 -translate-x-1/2 w-[450px] h-[450px] bg-indigo-800 rounded-full blur-[140px]" />

        {/* Left blob — bigger + more spread */}
        <div className="absolute top-1/2 left-1/5 w-[380px] h-[380px] bg-indigo-800/30 rounded-full blur-[150px]" />

        {/* Right blob — bigger + spread */}
        <div className="absolute bottom-20 right-1/5 w-[420px] h-[420px] bg-indigo-800/30 rounded-full blur-[150px]" />
        </div>

        {/* Content container */}
        <div className="relative z-10 w-full max-w-6xl flex flex-col mt-35 items-center justify-center">
          {/* Store Title */}
          <h1 className="text-6xl font-bold text-white mb-6 text-center">Pricing Plans</h1>

          {/* Description */}
          <p className="text-center text-gray-400 text-lg mb-12 max-w-4xl leading-relaxed">
                Choose the perfect plan for your needs. Start free, upgrade anytime.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex gap-1.5 p-2 rounded-full border border-white/20 bg-white/5 mb-12">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-3 py-1 rounded-full text-[12px] font-bold transition-all ${
                !isAnnual ? "bg-white text-black" : "text-white/70 hover:text-white"
              }`}
            >
              Monthly
            </button>

            <button
              onClick={() => setIsAnnual(true)}
              className={`px-3 py-1 rounded-full text-[12px] font-bold transition-all ${
                isAnnual ? "bg-white text-black" : "text-white/70 hover:text-white"
              }`}
            >
              Annually
            </button>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl mb-16">
            {plans.map((plan, index) => (
              <div key={index} className="relative group">
                {/* Pure black card with glowing border */}
                <div
                  className={`
                    h-full bg-transparent border border-white/10 
                    transition-all duration-300 overflow-hidden 
                    group-hover:border-white/10
                    group-hover:shadow-[0_0_15px_rgba(255,255,255,0.35)]
                  `}
                >
                  {/* Card Content */}
                  <div className="relative p-5 flex flex-col h-full text-left">
                    {/* Icon */}
                    <div className="w-10 h-10 rounded-md bg-white/10 flex items-center justify-center mb-3 border border-white/10">
                      {plan.icon && <plan.icon className="w-5 h-5 text-white" />}
                    </div>

                    {/* Plan Name */}
                    <h3 className="text-[20px] font-bold text-white mb-1">{plan.name}</h3>
                    <p className="text-[12px] text-white font-medium mb-3">{plan.description}</p>

                    {/* Divider */}
                    <div className="w-8 h-0.5 bg-white/30 mb-3" />

                    {/* Price */}
                    <div className="mb-5">
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold text-white">
                          {/* Updated price display to show rupee symbol and custom prices */}
                          ₹{isAnnual ? plan.annualPrice.toLocaleString() : plan.monthlyPrice.toLocaleString()}
                        </span>
                        <span className="text-white/70 text-[12px">
                          {isAnnual ? "/yr" : "/mo"}
                        </span>
                      </div>
                      {/* Show savings for annual plans */}
                      {isAnnual && plan.annualSavings && (
                        <div className="text-[14px] text-white mt-1 p-2 font-bold border border-white/10 w-fit mt-2">
                          Save ₹{plan.annualSavings.toLocaleString()}+
                        </div>
                      )}
                    </div>

                    {/* CTA Button */}
                    <button
                      className="w-full py-3 rounded-full font-semibold cursor-pointer mb-5 transition-all border text-xs bg-white/10 text-white hover:bg-white/20 border-white/10"
                      onClick={() => router.push('/open-account?login=false')}
                    >
                      {plan.name === "PRO" ? "Start Free" : "Get Started"}
                    </button>

                    {/* Features */}
                    <div className="space-y-1 mb-3">
                      <h4 className="text-[12px] font-semibold text-white mb-2">Features:</h4>

                      <div className="space-y-2">
                        {plan.features.map((feature: string, idx: number) => (
                          <div key={idx} className="flex items-center gap-2">
                            <div className="w-3.5 h-3.5 rounded-sm bg-white/10 border border-white/20 flex items-center justify-center">
                              <span className="text-white/70 text-xs">+</span>
                            </div>
                            <span className="text-[12px] text-white/70">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* More Features */}
                    <button 
                      className="text-[12px] text-white/70 hover:text-white transition-colors inline-flex items-center font-bold gap-1 group/more"
                      onClick={() => setExpandedPlans(prev => ({ ...prev, [plan.name]: !prev[plan.name] }))}
                    >
                      and {plan.moreFeatures} more
                      <span className={`group-hover/more:translate-x-0.5 transition-transform ${expandedPlans[plan.name] ? 'rotate-90' : ''}`}>
                        →
                      </span>
                    </button>

                    {/* Expanded Features */}
                    {expandedPlans[plan.name] && (
                      <div className="mt-4 pt-4 border-t border-white/10 animate-fadeIn">
                        {plan.detailedFeatures.map((section, sectionIndex) => (
                          <div key={sectionIndex} className="mb-4">
                            <h5 className="text-[12px] font-bold text-white mb-2">{section.category}</h5>
                            <ul className="space-y-2">
                              {section.items.map((item, itemIndex) => (
                                <li key={itemIndex} className="flex items-start gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-white/30 mt-1.5 flex-shrink-0" />
                                  <span className="text-[12px] text-white/80">{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Note about Models page */}
          <div className="w-full max-w-4xl mb-16">
            <div className="bg-transparent border border-white/10 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-white/80 text-sm">
                For more details about models and overview, navigate to the models page.
              </p>
              <Link 
                href="/models" 
                className="flex items-center gap-2 text-black font-semibold bg-white hover:bg-white px-4 py-2 rounded-full text-sm transition-all border border-white/10"
              >
                View Models
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          
          {/* Footer */}
          <div className="mt-16 w-full py-8 border-t border-white/10">
            {/* Center Content */}
            <div className="text-center text-white text-sm space-y-1">
            <p>
            © 2025{" "}
            <a
              href="https://www.intellaris.co"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold underline hover:font-bold cursor-pointer"
            >
              Intellaris Private Limited
            </a>
            . All rights reserved.
          </p>
              <p className="flex flex-wrap justify-center items-center gap-x-2 text-white/70">
                <a href="/policies/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</a>
                <span className="text-white/40">|</span>
                <a href="/policies/software-license" className="hover:text-white transition-colors">Software License</a>
                <span className="text-white/40">|</span>
                <a href="/policies/terms-of-use" className="hover:text-white transition-colors">Terms of Use</a>
                <span className="text-white/40">|</span>
                <a href="/policies/fair-use-policy" className="hover:text-white transition-colors">Fair Use Policy</a>
                <span className="text-white/40">|</span>
                <a href="/policies/refund-policy" className="hover:text-white transition-colors">Refund Policy</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
