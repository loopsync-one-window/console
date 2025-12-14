"use client"

import Navbar from "@/components/NavBar"
import GradientBlinds from "@/components/GradientBlinds"
import Link from "next/link"
import { useState } from "react";
import { Building, Package, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";

export default function OneWindow() {

    const [expandedPlans, setExpandedPlans] = useState<Record<string, boolean>>({});
  const [isAnnual, setIsAnnual] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState<{ title: string; description: string } | null>(null);

    const plans = [
        {
          name: "PRO",
          icon: Package,
          monthlyPrice: 19,
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
          monthlyPrice: 29,
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
  
  const features = [
    {
      title: "Intelligent Capture",
      description: "Capture any content with AI-powered understanding and context awareness.",
      href: "/one-window/support/intelligent-capture",
      gradientColors: ["#0f1629", "#1e3a8a", "#2563eb", "#1d4ed8"]
    },
    {
      title: "Smart Analysis",
      description: "Get deep insights and analysis of your captured content with advanced AI models.",
      href: "/one-window/support/smart-analysis",
      gradientColors: ["#001a00", "#003300", "#00cc00", "#00ff00"]
    },
    {
      title: "Seamless Integration",
      description: "Connect with your favorite tools and workflows for maximum productivity.",
      href: "/one-window/support/seamless-integration",
      gradientColors: ["#1a0000", "#330000", "#cc0000", "#ff0000"]
    },
    {
      title: "Privacy First",
      description: "Your data is encrypted and never shared without your explicit permission.",
      href: "/one-window/support/privacy-first",
      gradientColors: ["#300010", "#660033", "#cc3399", "#ff66cc"]
    },
    {
      title: "Cross-Platform",
      description: "Works seamlessly across desktop, mobile, and web applications.",
      href: "/one-window/support/cross-platform",
      gradientColors: ["#1a1a1a", "#2d2d2d", "#404040", "#595959"]
    },
    {
      title: "Advanced Automation",
      description: "Set up custom workflows and automations to save time and reduce manual work.",
      href: "/one-window/support/advanced-automation",
      gradientColors: ["#331a00", "#663300", "#cc6600", "#ff9900"]
    }
  ]

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

      <div className="relative z-10 pt-34 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              One Window Support
            </h1>
            <p className="text-lg text-white/80 max-w-5xl mx-auto">
              One Window Support centralizes all documentation, resources, and support interactions<br/> into a single, streamlined interface designed for clarity, speed, and reliability.            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-16">
            <div className="relative">
              <input
                type="text"
                placeholder="Search documentation, resources, or support articles..."
                className="w-full py-4 px-6 rounded-2xl bg-black/30 backdrop-blur-lg border border-white/10 text-white placeholder-white/60 focus:outline-none  focus:border-transparent"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white hover:bg-gray-300 text-black p-2 rounded-full transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>

          {/* Email Support Button */}
          <div className="flex justify-center mb-16">
            <a 
              href="mailto:support@loopsync.cloud"
              className="inline-flex items-center gap-2 bg-white hover:bg-gray-300 text-black font-semibold py-3 px-6 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              Email One Window Support
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="block group cursor-pointer"
                onClick={() => {
                  setActiveFeature({ title: feature.title, description: feature.description });
                  setModalOpen(true);
                }}
              >
                <div className="h-full bg-black/30 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-2xl hover:border-white/20 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="mb-4">
                    <div className="w-full h-32 rounded-lg overflow-hidden">
                      <div className="w-full h-full relative">
                        <GradientBlinds
                          gradientColors={feature.gradientColors}
                          angle={45}
                          noise={0.2}
                          blindCount={8}
                          blindMinWidth={30}
                          spotlightRadius={0.3}
                          spotlightSoftness={1.2}
                          spotlightOpacity={0.3}
                          mouseDampening={0.1}
                          distortAmount={0.5}
                          shineDirection="right"
                          mixBlendMode="overlay"
                          animateColors={false}
                          transitionDuration={1500}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-white transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-white/70 text-sm">
                    {feature.description}
                  </p>
                  
                  <div className="mt-4 flex items-center text-white text-sm font-medium group-hover:text-white transition-colors">
                    <span>Learn more</span>
                    <svg 
                      className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
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
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="bg-white border border-black/10 shadow-2xl max-w-md rounded-2xl">
          <DialogClose className="absolute right-4 top-4 rounded-sm focus:outline-none disabled:pointer-events-none">
            <X className="h-5 w-5 text-black" />
            <span className="sr-only">Close</span>
          </DialogClose>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-black">Working on it</DialogTitle>
            <DialogDescription className="text-black/70 mt-2">
              {activeFeature?.title ? `${activeFeature.title}` : "Feature"}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 text-black/80 text-sm">
            {activeFeature?.description}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
