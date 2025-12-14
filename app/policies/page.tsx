"use client"

import Navbar from "@/components/NavBar"
import GradientBlinds from "@/components/GradientBlinds"
import Link from "next/link"

export default function Policies() {
  const policies = [
    {
      title: "Privacy Policy",
      description: "Learn how we collect, use, and protect your personal information.",
      href: "/policies/privacy-policy",
      gradientColors: ["#0f1629", "#1e3a8a", "#2563eb", "#1d4ed8"]
    },
    {
      title: "Terms of Use",
      description: "Understand the terms and conditions governing your use of our services.",
      href: "/policies/terms-of-use",
      gradientColors: ["#001a00", "#003300", "#00cc00", "#00ff00"]
    },
    {
      title: "Software License",
      description: "Read the licensing agreement for our software and services.",
      href: "/policies/software-license",
      gradientColors: ["#1a0000", "#330000", "#cc0000", "#ff0000"]
    },
    {
      title: "Fair Use Policy",
      description: "Understand our guidelines for fair and responsible usage of our services.",
      href: "/policies/fair-use-policy",
      gradientColors: ["#300010", "#660033", "#cc3399", "#ff66cc"]
    },
    {
      title: "Refund Policy",
      description: "Learn about our refund terms and conditions for subscriptions and purchases.",
      href: "/policies/refund-policy",
      gradientColors: ["#1a1a1a", "#2d2d2d", "#404040", "#595959"]
    },
    {
      title: "Contact Information",
      description: "How to reach us for support, sales, and other inquiries.",
      href: "/policies/contact",
      gradientColors: ["#1a0033", "#330066", "#663399", "#9966cc"]
    },
    {
      title: "Shipping Policy",
      description: "Terms and conditions for delivery of physical goods and merchandise.",
      href: "/policies/shipping",
      gradientColors: ["#001a33", "#003366", "#0066cc", "#0099ff"]
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

      <div className="relative z-10 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Policies & Legal
            </h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Review our policies to understand how we operate and how we protect your rights and information.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {policies.map((policy, index) => (
              <Link 
                key={index}
                href={policy.href}
                className="block group"
              >
                <div className="h-full bg-black/30 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-2xl hover:border-white/20 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="mb-4">
                    <div className="w-full h-32 rounded-lg overflow-hidden">
                      <div className="w-full h-full relative">
                        <GradientBlinds
                          gradientColors={policy.gradientColors}
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
                    {policy.title}
                  </h3>
                  <p className="text-white/70 text-sm">
                    {policy.description}
                  </p>
                  
                  <div className="mt-4 flex items-center text-white text-sm font-medium group-hover:text-white transition-colors">
                    <span>Read policy</span>
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
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}