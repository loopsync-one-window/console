"use client"

import Link from "next/link"
import {
  Smartphone,
  Database,
  Cloud,
  BarChart3,
  ArrowRight,
  CalculatorIcon,
  Globe2
} from "lucide-react"
import Navbar from "@/components/NavBar"

export default function UseCasesPage() {
  const useCases = [
    {
      title: "Complex Math & Scientific Problem Solving",
      icon: CalculatorIcon,
      description: "Capture equations, formulas, or graphs from any site-protected or not, and get instant step-by-step solutions, proofs, and explanations powered by multiple AI models.",
      features: ["Step-by-step solutions", "Alternative methods", "Visualizations", "Element selection"]
    },
    {
      title: "Coding Help, Debugging & Optimization",
      icon: Smartphone,
      description: "Drag over any snippet for instant debugging, optimization, and rewriting, get instant bug checks, logic explanations, optimizations, and conversions.",
      features: ["Bug detection & Logic explanation", "Performance optimization", "Language conversion", "Create Documentation"]
    },
    {
      title: "Web Content Interpretation & Knowledge Extraction",
      icon: Database,
      description: "Summaries, translations, insights, and explanations for anything you drag-select, including text, graphs, dashboards, PDFs, or locked content.",
      features: ["Platform-restricted elements", "Table extraction", "Form field recognition", "Dashboard outputs"]
    },
    {
      title: "Research, Study & Learning Assistance",
      icon: Globe2,
      description: "Capture articles, research papers, or complex concepts to receive simplified explanations, comparisons, or multi-model perspectives for deeper understanding.",
      features: ["Summarizes articles, papers, or reports", "Breaks down complex concepts", "Provides multi-model explanations", "Helps compare ideas or perspectives"]
    },
    {
      title: "Productivity & Workflow Automation",
      icon: BarChart3,
      description: "Turn screenshots or selections into formatted documents, notes, cleaned text, or actionable tasks. Syncs across devices so you can continue on mobile instantly.",
      features: ["Multiple viewpoints", "Model-to-model comparison", "Best-answer synthesis", "High-confidence decisions"]
    },
    {
      title: "Cloud Storage Integration & Live Response Streaming",
      icon: Cloud,
      description: "Seamlessly integrate with popular cloud storage services for automatic backup and organization. As models finish, Atlas streams responses back to the user interface in real time.",
      features: ["Auto-sync capabilities", "Incremental reasoning", "Sync across all devices", "Access permissions"]
    }
  ];
  const ceresCases = [
    {
      title: "Autonomous Navigation",
      icon: Globe2,
      description: "Browse, click, and traverse multi‑step journeys with page understanding and safe constraints.",
      features: ["Link following", "Button clicking", "Multi‑step flows", "Context preservation"]
    },
    {
      title: "Form Filling & Submissions",
      icon: Smartphone,
      description: "Detect inputs, map fields, and submit forms reliably with user approvals when needed.",
      features: ["Field detection", "Validation checks", "Auto‑fill mappings", "Submission confirmations"]
    },
    {
      title: "Data Extraction & Structuring",
      icon: Database,
      description: "Extract tables, lists, and key facts into clean JSON or CSV with high fidelity.",
      features: ["Table parsing", "Selector targeting", "Schema mapping", "Download/export"]
    },
    {
      title: "Workflow Automation in Browser",
      icon: BarChart3,
      description: "Chain tasks into repeatable flows with checkpoints, retries, and timeouts.",
      features: ["Task chaining", "Retry logic", "Timeouts", "Checkpoints"]
    },
    {
      title: "Credential‑Safe Sessions",
      icon: Cloud,
      description: "Operate under scoped permissions and session isolation to protect sensitive actions.",
      features: ["Scoped permissions", "Session isolation", "Action logging", "Revocable tokens"]
    },
    {
      title: "Supervised & Autopilot Modes",
      icon: CalculatorIcon,
      description: "Switch between guided steps and full autopilot. Approvals gate sensitive actions.",
      features: ["Guided mode", "Autopilot mode", "Approval gating", "Activity summaries"]
    }
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
      `}</style>
      {/* Added Navbar */}
      <Navbar />

      {/* Main content container with padding to account for fixed navbar */}
      <div className="pt-20 flex flex-col items-center justify-center px-4 flex-grow">
        {/* Background gradient effect */}
        <div className="absolute inset-0 opacity-60 pointer-events-none overflow-hidden">
          {/* Center blob — larger + lower */}
          <div className="absolute top-32 left-1/2 -translate-x-1/2 w-[450px] h-[450px] bg-red-800 rounded-full blur-[140px]" />

          {/* Left blob — bigger + more spread */}
          <div className="absolute top-1/2 left-1/5 w-[380px] h-[380px] bg-red-800/30 rounded-full blur-[150px]" />

          {/* Right blob — bigger + spread */}
          <div className="absolute bottom-20 right-1/5 w-[420px] h-[420px] bg-red-800/30 rounded-full blur-[150px]" />
        </div>

        {/* Content container */}
        <div className="relative z-10 w-full max-w-6xl flex flex-col mt-35 items-center justify-center">
          {/* Page Title */}
          <h1 className="text-6xl font-bold text-white mb-6 text-center">LoopSync Atlas</h1>
          <p className="text-center text-gray-400 text-lg mb-12 max-w-4xl leading-relaxed">
            Capture anything. Analyze everything. Unlock insights.
          </p>

          {/* Use Cases Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl mb-16">
            {useCases.map((useCase, index) => (
              <div key={index} className="relative group">
                {/* Card with glowing border */}
                <div
                  className={`
                    h-full bg-transparent rounded-3xl border border-white/10 
                    transition-all duration-300 overflow-hidden 
                    group-hover:border-white/20
                    group-hover:shadow-[0_0_15px_rgba(255,255,255,0.35)]
                  `}
                >
                  {/* Card Content */}
                  <div className="relative p-6 flex flex-col h-full text-left">
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-md bg-white/10 flex items-center justify-center mb-4 border border-white/10">
                      <useCase.icon className="w-6 h-6 text-white" />
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-white mb-2">{useCase.title}</h3>

                    {/* Description */}
                    <p className="text-[12px] text-white/80 mb-4 flex-grow">{useCase.description}</p>

                    {/* Divider */}
                    <div className="w-8 h-0.5 bg-white/30 mb-4" />

                    {/* Features */}
                    <div className="space-y-2 mb-6">
                      {useCase.features.map((feature: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-sm bg-white/10 border border-white/20 flex items-center justify-center">
                            <span className="text-white/70 text-[8px]">✓</span>
                          </div>
                          <span className="text-[11px] text-white/70">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="w-full max-w-4xl mb-16">
            <div className="bg-transparent border border-white/10 rounded-lg p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="text-center sm:text-left">
                <h3 className="text-xl font-bold text-white mb-2">Ready to get started?</h3>
                <p className="text-white/80 text-sm">
                  Join thousands of teams using LoopSync Atlas to capture and analyze digital content.
                </p>
              </div>
              <Link
                href="/pricing"
                className="flex items-center gap-2 text-black font-semibold bg-white hover:bg-white px-6 py-3 rounded-full text-sm transition-all border border-white/10 whitespace-nowrap"
              >
                View Pricing
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <h2 className="text-5xl font-bold text-white mb-6 text-center">LoopSync Ceres Assist</h2>
          <p className="text-center text-gray-400 text-lg mb-12 max-w-4xl leading-relaxed">
            Autonomous agentic browser assistant for navigation, forms, extraction, and workflows with safe approvals.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl mb-16">
            {ceresCases.map((useCase, index) => (
              <div key={index} className="relative group">
                <div
                  className={`
                    h-full bg-transparent rounded-3xl border border-white/10 
                    transition-all duration-300 overflow-hidden 
                    group-hover:border-white/20
                    group-hover:shadow-[0_0_15px_rgba(255,255,255,0.35)]
                  `}
                >
                  <div className="relative p-6 flex flex-col h-full text-left">
                    <div className="w-12 h-12 rounded-md bg-white/10 flex items-center justify-center mb-4 border border-white/10">
                      <useCase.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{useCase.title}</h3>
                    <p className="text-[12px] text-white/80 mb-4 flex-grow">{useCase.description}</p>
                    <div className="w-8 h-0.5 bg-white/30 mb-4" />
                    <div className="space-y-2 mb-6">
                      {useCase.features.map((feature: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-sm bg-white/10 border border-white/20 flex items-center justify-center">
                            <span className="text-white/70 text-[8px]">✓</span>
                          </div>
                          <span className="text-[11px] text-white/70">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
