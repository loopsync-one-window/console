"use client"

import { useState, useMemo } from "react"
import Navbar from "@/components/NavBar"
import ModelTable from "@/components/models/ModelTable"

export default function ModelsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  // AI Model icon data
  const modelIcons = [
    { id: 1, name: "xAI", logo: "/resources/grok.svg" },
    { id: 2, name: "OpenAI", logo: "/resources/chatgpt.svg" },
    { id: 3, name: "Google", logo: "/resources/gemini.svg" },
  ]

  const providers = [
    { name: "Grok", logo: "/resources/grok.svg" },
    { name: "ChatGPT", logo: "/resources/chatgpt.svg" },
    { name: "Gemini", logo: "/resources/gemini.svg" },
  ];

  const models = [
    {
      model: "LS Compute-A",
      speed: 5,
      intelligence: 3,
      context: "131k",
      imageProcessing: false,
    },
    {
      model: "LS Vision-Pro",
      speed: 3,
      intelligence: 4,
      context: "128k",
      imageProcessing: true,
    },
    {
      model: "LS LC-2M",
      speed: 2,
      intelligence: 3,
      context: "2M",
      imageProcessing: false,
    },
    {
      model: "LS R3-Advanced",
      speed: 4,
      intelligence: 5,
      context: "100k",
      imageProcessing: true,
    },
    {
      model: "LS Fast-Edge",
      speed: 4,
      intelligence: 4,
      context: "8k",
      imageProcessing: false,
    },
    {
      model: "LS Compute-X",
      speed: 3,
      intelligence: 4,
      context: "8k",
      imageProcessing: false,
    },
    {
      model: "LS Compute-Max",
      speed: 4,
      intelligence: 4,
      context: "8k",
      imageProcessing: true,
    },
    {
      model: "LS Compute-Enterprise",
      speed: 5,
      intelligence: 5,
      context: "8k",
      imageProcessing: true,
    }
  ];

  // Filter models based on search query
  const filteredModels = useMemo(() => {
    if (!searchQuery) return models;
    
    const query = searchQuery.toLowerCase();
    return models.filter(model => 
      model.model.toLowerCase().includes(query) ||
      model.context.toLowerCase().includes(query)
    );
  }, [searchQuery, models]);


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
          {/* AI Model Icons - 3 different logos */}
          <div className="mb-16 flex flex-col items-center gap-8">
            <div className="flex justify-center items-center gap-6">
              {modelIcons.map((icon) => (
                <div
                  key={icon.id}
                  className="transition-all duration-300 hover:opacity-100"
                >
                  <div className="w-24 h-24 bg-white/20 rounded-2xl border border-white/20 backdrop-blur-xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform glass-effect">
                    <img src={icon.logo} alt={icon.name} className="w-16 h-16 logo-effect" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Store Title */}
          <h1 className="text-6xl font-bold text-white mb-6 text-center">Our Model Suite</h1>

          {/* Description */}
          <p className="text-center text-gray-400 text-lg mb-12 max-w-4xl leading-relaxed">
                Enterprise-grade AI models enhanced by xAI Grok, OpenAI ChatGPT, and Google Gemini, <br/>optimized for real-time speed, vision understanding, and extended-context reasoning.
          </p>

          {/* Search Bar */}
          <div className="w-full max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-3 bg-white/5 border border-white/10 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-white/30 transition-colors"
              />
              <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                <span className="text-xs text-gray-500">⌘</span>
                <span className="text-xs text-gray-500">K</span>
              </div>
            </div>
          </div>
          
          {/* Added proper spacing between hero section and ModelTable */}
          <div className="mt-16 w-full">
            <ModelTable models={filteredModels} providers={providers} />
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