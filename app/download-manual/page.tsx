"use client"

import { useState } from "react"
import Link from "next/link"
import { Download, BookOpen, FileText, ArrowRight, Loader2 } from "lucide-react"
import Navbar from "@/components/NavBar"

export default function DownloadManualPage() {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = () => {
    setIsDownloading(true);
    // Simulate a delay before download
    setTimeout(() => {
      // Create a temporary link to trigger download
      const link = document.createElement('a');
      link.href = '/manuals/LS_User_Manual.pdf';
      link.download = 'LS_User_Manual.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsDownloading(false);
    }, 2500);
  };

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
          <div className="absolute top-32 left-1/2 -translate-x-1/2 w-[450px] h-[450px] bg-green-800 rounded-full blur-[140px]" />

          {/* Left blob — bigger + more spread */}
          <div className="absolute top-1/2 left-1/5 w-[380px] h-[380px] bg-green-800/30 rounded-full blur-[150px]" />

          {/* Right blob — bigger + spread */}
          <div className="absolute bottom-20 right-1/5 w-[420px] h-[420px] bg-green-800/30 rounded-full blur-[150px]" />
        </div>

        {/* Content container */}
        <div className="relative z-10 w-full max-w-4xl flex flex-col mt-35 items-center justify-center">
          {/* Page Title */}
          <h1 className="text-6xl font-bold text-white mb-6 text-center">Download Manual</h1>
          <p className="text-center text-gray-400 text-lg mb-12 max-w-2xl leading-relaxed">
            Access the complete LoopSync Atlas Manual for detailed instructions and advanced features.
          </p>

          {/* Download Card */}
          <div className="w-full max-w-2xl mb-16">
            <div className="relative group">
              {/* Card with glowing border */}
              <div
                className={`
                  h-full bg-transparent border border-white/10 
                  transition-all duration-300 overflow-hidden 
                  group-hover:border-white/20
                  group-hover:shadow-[0_0_15px_rgba(255,255,255,0.35)]
                `}
              >
                {/* Card Content */}
                <div className="relative p-8 flex flex-col md:flex-row items-center gap-8">
                  {/* Icon */}
                  <div className="w-20 h-20 rounded-lg bg-white/10 flex items-center justify-center border border-white/10 flex-shrink-0">
                    <BookOpen className="w-10 h-10 text-white" />
                  </div>

                  <div className="flex-grow text-center md:text-left">
                    {/* Title */}
                    <h3 className="text-2xl font-bold text-white mb-2">LoopSync Atlas Manual</h3>

                    {/* Description */}
                    <p className="text-[14px] text-white/80 mb-6">
                      Comprehensive guide covering all features, setup instructions, troubleshooting tips,
                      and best practices for maximizing your LoopSync Atlas experience.
                    </p>

                    {/* File Info */}
                    <div className="flex flex-wrap gap-4 mb-6 justify-center md:justify-start">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-white/70" />
                        <span className="text-[12px] text-white/70">PDF Format</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-white/70" />
                        <span className="text-[12px] text-white/70">4.8 MB</span>
                      </div>
                    </div>

                    {/* Download Button */}
                    <button
                      className="flex items-center justify-center md:justify-start gap-2 text-black font-semibold bg-white hover:bg-white px-6 py-3 rounded-full text-sm transition-all border border-white/10 w-full md:w-auto"
                      onClick={handleDownload}
                      disabled={isDownloading}
                    >
                      {isDownloading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Downloading...
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          Download Manual
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="w-full max-w-2xl mb-16">
            <div className="bg-transparent border border-white/10 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4">Need Help?</h3>
              <p className="text-white/80 text-sm mb-4">
                If you have any questions about using LoopSync Atlas or need assistance with the manual,
                our support team is ready to help.
              </p>
              <Link
                href="https://loopsync.cloud/one-window/support/resources"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-white font-semibold bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full text-sm transition-all border border-white/10"
              >
                Contact Support
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