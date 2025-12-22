"use client"

import GradientBlinds from "@/components/GradientBlinds"
import MobileScreeningPage from "./screening/page"
import StrategicUpdateBanner from "@/components/StrategicUpdateBanner"
import { useState, useEffect } from "react"
import Navbar from "@/components/NavBar"

export default function Home() {
  const [isBannerVisible, setIsBannerVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsBannerVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      <div className="block md:hidden">
        <MobileScreeningPage />
      </div>
      <main className="relative h-screen overflow-hidden hidden md:block">
        <StrategicUpdateBanner isVisible={isBannerVisible} onClose={() => setIsBannerVisible(false)} />
        <Navbar
          className={`transition-all duration-1000 ease-out ${isBannerVisible ? "translate-y-[3.5rem]" : ""
            }`}
        />

        {/* Animated Gradient Background */}
        <div className="fixed inset-0 w-full h-screen flex items-center justify-center">
          <GradientBlinds
            gradientColors={["#000000ff", "#d40000ff", "#d70000ff", "#f80000ff"]}
            angle={60}
            noise={0.0}
            blindCount={12}
            blindMinWidth={40}
            spotlightRadius={0.40}
            spotlightSoftness={1.6}
            spotlightOpacity={0.42}
            mouseDampening={0.15}
            distortAmount={3.8}
            shineDirection="right"
            mixBlendMode="overlay"
            animateColors={true}
            transitionDuration={2000}
          />
        </div>

        <div className="relative z-10 flex h-screen flex-col">
          {/* Hero Section */}
          <div className="flex-1 flex items-center justify-center">
            <div className="flex items-center justify-center h-screen w-full px-5 sm:px-20">
              <div className="relative z-10 flex max-w-4xl flex-col items-center gap-8 text-center">
                <h1 className="text-5xl font-bold leading-tight tracking-tight text-white md:text-7xl drop-shadow-2xl">
                  LOOPSYNC
                  <br />
                  ONE WINDOW<sup className="text-sm ml-2 text-white top-[-25] align-super">TM</sup>
                </h1>

                <p className="text-xl text-white/90 max-w-3xl font-semibold drop-shadow-lg">
                  A cloud based single, intelligent framework that sees, understands, and reasons across anything you face - from complex calculations to intricate code and more.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                  <a
                    href="https://loopsync.cloud/open-account?login=false"
                    className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-8 py-4 text-lg font-semibold text-white backdrop-blur-xl shadow-lg transition-all duration-200 hover:bg-white/20 hover:border-white/40 hover:shadow-xl active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-white/70 focus:ring-offset-0"
                  >
                    Try for Free
                    <svg
                      className="ml-2 h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </a>


                  <a
                    href="https://loopsync.cloud/models"
                    className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-8 py-4 text-lg font-semibold text-white backdrop-blur-xl shadow-lg transition-all duration-200 hover:bg-white/20 hover:border-white/40 hover:shadow-xl active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-white/70 focus:ring-offset-0"
                  >
                    Explore Models
                    <svg
                      className="ml-2 h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </a>

                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="fixed bottom-0 left-0 right-0 z-20 pb-6 px-6">
          <div className="flex items-center justify-center relative">

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

            {/* QR Code */}
            <div className="absolute right-0 pr-4 flex flex-col items-center space-y-1 mb-10">
              <a href="https://loopsync.cloud/one-window/support/resources" target="_blank" rel="noopener noreferrer">
                <img
                  src="/resources/qr-support.svg"
                  alt="QR Code"
                  className="w-20 h-20 opacity-90 hover:opacity-100 transition duration-200"
                />
              </a>
              <span className="text-white text-xs font-medium text-center leading-tight max-w-[8rem]">
                Scan or Click for<br /><span className="font-semibold text-white">One Window Support</span>
              </span>
            </div>

          </div>
        </div>

      </main>
    </>
  )
}
