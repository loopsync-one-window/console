"use client";

import { Dithering } from "@paper-design/shaders-react"
import GradientBlinds from "@/components/GradientBlinds"
import StrategicUpdateBanner from "@/components/StrategicUpdateBanner"
import { useState, useEffect } from "react"
import Navbar from "@/components/NavBar"
import { Upload, ArrowUpRight } from "lucide-react"
import Link from "next/link"

import ProductivityKeyboardSection from "@/components/home/sections/ProductivityKeyboardSection"
import ProTranslationSection from "@/components/home/sections/ProTranslationSection"
import ExtensibilitySection from "@/components/home/sections/ExtensibilitySection"
import FeaturesBentoGrid from "@/components/home/sections/FeaturesBentoGrid"
import Footer from "@/components/Footer"

export default function Home() {
  const [isBannerVisible, setIsBannerVisible] = useState(false)
  const [isWebGLSupported, setIsWebGLSupported] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsBannerVisible(false), 100)

    // Check for WebGL support
    try {
      const canvas = document.createElement("canvas")
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
      if (!gl) {
        setIsWebGLSupported(false)
      }
    } catch (e) {
      setIsWebGLSupported(false)
    }

    return () => clearTimeout(timer)
  }, [])

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden text-white bg-black">
      {/* Background Layer */}
      <div className="absolute top-0 left-0 w-full h-screen z-0 flex items-center justify-center bg-transparent pointer-events-none">

        {isWebGLSupported ? (
          <>
            {/* Desktop: Gradient Blinds */}
            <div className="hidden sm:block w-full h-full">
              <GradientBlinds
                gradientColors={["#000000ff", "#0033ffff", "#0033ffff", "#000000ff"]}
                angle={60}
                noise={0.0}
                blindCount={7}
                blindMinWidth={40}
                spotlightRadius={0.4}
                spotlightSoftness={2.6}
                spotlightOpacity={0.42}
                mouseDampening={0.15}
                distortAmount={3.8}
                shineDirection="right"
                mixBlendMode="normal"
                animateColors={true}
                transitionDuration={2000}
              />
            </div>

            {/* Mobile: Dithering + Blur */}
            <div className="sm:hidden absolute inset-0 w-full h-full">
              <div className="absolute inset-0 z-0">
                <Dithering
                  style={{ height: "100%", width: "100%" }}
                  colorBack="#000000"
                  colorFront="#00ffc3ff"
                  shape={"circle" as any}
                  type="4x4"
                  pxSize={3.5}
                  offsetX={0}
                  offsetY={0}
                  scale={0.8}
                  rotation={0}
                  speed={2.5}
                />
              </div>
              {/* Layered Blur */}
              <div className="absolute inset-0 z-10 backdrop-blur-3xl bg-black/10"></div>
            </div>
          </>
        ) : (
          /* Fallback for no WebGL support */
          <div className="absolute inset-0 bg-gradient-to-br from-black via-[#fff]/15 to-black w-full h-full" />
        )}

        <div className="absolute inset-0 bg-transparent z-10" />
      </div>

      <StrategicUpdateBanner isVisible={isBannerVisible} onClose={() => setIsBannerVisible(false)} />

      <Navbar
        className={`transition-transform duration-1000 ease-out ${isBannerVisible ? "translate-y-14" : "translate-y-0"
          }`}
      />

      <div className="relative z-10 text-white">
        {/* Full Screen Hero Section */}
        <div className="flex min-h-screen w-full flex-col items-center justify-center px-4 sm:px-6 relative">
          <div className="flex w-full max-w-7xl flex-col items-center gap-6 text-center sm:gap-8 -mt-20">
            {/* Animation Styles */}
            <style dangerouslySetInnerHTML={{
              __html: `
                @keyframes fadeUp {
                  from { opacity: 0; transform: translateY(20px); }
                  to { opacity: 1; transform: translateY(0); }
                }
              `
            }} />

            <h1 className="drop-shadow-2xl text-3xl sm:text-4xl lg:text-7xl font-bold text-white font-geom mt-25 opacity-0 animate-[fadeUp_1s_cubic-bezier(0.16,1,0.3,1)_forwards]">
              <span className="block sm:hidden text-4xl font-medium">One window. Everything.</span>
              <span className="hidden sm:block">All your productivity <br />tools in one place.</span>
            </h1>

            <p className="max-w-xl lg:max-w-3xl text-sm sm:text-base lg:text-lg font-semibold text-white drop-shadow-lg opacity-0 animate-[fadeUp_1s_cubic-bezier(0.16,1,0.3,1)_0.2s_forwards]">
              Find apps, extensions, and software in one simple platform. <br className="hidden sm:block" />Discover useful tools without the clutter.
            </p>

            <div className="mt-4 flex w-full flex-col gap-4 sm:w-auto sm:flex-row opacity-0 animate-[fadeUp_1s_cubic-bezier(0.16,1,0.3,1)_0.4s_forwards]">
              <a
                href="https://loopsync.cloud/open-account?login=false"
                className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-white/20 bg-white/10 px-8 py-3 text-sm sm:text-base font-semibold text-white shadow-lg backdrop-blur-xl transition-all duration-200 hover:border-white/40 hover:bg-white/20 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-white/70 focus:ring-offset-0 active:scale-[0.97] sm:w-auto"
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
                className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-white/20 bg-white/10 px-8 py-3 text-sm sm:text-base font-semibold text-white shadow-lg backdrop-blur-xl transition-all duration-200 hover:border-white/40 hover:bg-white/20 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-white/70 focus:ring-offset-0 active:scale-[0.97] sm:w-auto"
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


          {/* <ScrollIndicator /> */}
        </div>

        {/* Content Sections */}
        <ProductivityKeyboardSection />
        <ProTranslationSection />
        <ExtensibilitySection />
        <FeaturesBentoGrid />


        <Footer />
      </div>

      {/* FIXED ELEMENTS - Stay on screen while scrolling */}

      {/* QR Code - Hidden on Mobile */}
      <div className="fixed bottom-6 right-6 hidden flex-col items-center space-y-1 lg:flex z-50">
        <a href="https://loopsync.cloud/one-window/support/resources" target="_blank" rel="noopener noreferrer">
          <img
            src="/resources/qr-support.svg"
            alt="QR Code"
            className="h-20 w-20 opacity-90 transition duration-200 hover:opacity-100"
          />
        </a>
        <span className="max-w-[8rem] text-center text-xs font-medium leading-tight text-white">
          Scan or Click for<br /><span className="font-semibold text-white">One Window Support</span>
        </span>
      </div>

      {/* Developer Popup - Hidden on Mobile */}
      <div className="fixed bottom-6 left-6 hidden animate-[slideUpFade_1s_ease-out_forwards] flex-col items-start lg:flex z-50">
        <Link href="/developers" className="group relative w-64 overflow-hidden rounded-2xl border border-white/10 bg-black/40 p-4 shadow-2xl backdrop-blur-md transition-all hover:scale-105 hover:border-white/20 active:scale-95">
          <style dangerouslySetInnerHTML={{
            __html: `
                    @keyframes borderRotate {
                      0% { transform: rotate(0deg); }
                      100% { transform: rotate(360deg); }
                    }
                  `
          }} />

          <div className="relative z-10 flex items-center gap-4">
            {/* Mini Isometric Stack Icon */}
            <div className="relative h-12 w-12 flex-shrink-0">
              <div className="absolute inset-0 rounded-3xl bg-[#0033ffff] blur-md transition-colors group-hover:bg-[#0033ffff]"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Upload className="h-6 w-6 text-[#fff] transition-colors group-hover:text-[#fff]" />
              </div>
            </div>

            <div>
              <h3 className="text-left text-sm font-bold leading-tight text-white transition-colors group-hover:text-white">Publish to Store</h3>
              <p className="mt-0.5 text-left text-[12px] leading-tight text-white">Build & ship your apps.</p>
            </div>

            <ArrowUpRight className="absolute right-2 top-2 h-4 w-4 text-zinc-600 transition-colors group-hover:text-white" />
          </div>
        </Link>
      </div>

    </main>
  )
}
