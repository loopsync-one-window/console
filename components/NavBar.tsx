"use client"

import { useState, useEffect } from "react"
import { ChevronRightCircle, ExternalLink, Link2, Link2Off, SwitchCamera } from "lucide-react"
import CountryCurrencyDropdown from "./CurrencyDropdown"
import { getStoredTokens } from "@/lib/api"
import Link from "next/link"

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const [showOpenAccount, setShowOpenAccount] = useState(true) // New state for toggling text
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    const checkAuth = () => {
      try {
        const { accessToken } = getStoredTokens()
        setIsAuthenticated(Boolean(accessToken))
      } catch {
        setIsAuthenticated(false)
      }
    }
    checkAuth()
    const onStorage = (e: StorageEvent) => {
      if (!e || !e.key) return
      if (e.key === "accessToken" || e.key === "refreshToken" || e.key === "expiresAt") {
        checkAuth()
      }
    }
    window.addEventListener("storage", onStorage)
    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("storage", onStorage)
    }
  }, [])

  const handleMobileNavClick = (sectionId: string) => {
    setIsMobileMenuOpen(false)
    const element = document.getElementById(sectionId)
    if (element) {
      const headerOffset = 120
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
      const offsetPosition = elementPosition - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
    }
  }

  const handleWalletConnect = () => {
    setIsWalletConnected(!isWalletConnected)
  }

  return (
    <>
      {/* Desktop Header */}
      <header
        className={`fixed top-4 z-[9999] mx-auto hidden w-full flex-row items-center justify-between self-start rounded-full backdrop-blur-md md:flex border transition-all duration-300 max-w-6xl px-4 border-transparent shadow-none py-2`}
        style={{
          willChange: "transform",
          transform: "translateZ(0) translateX(-50%)",
          backfaceVisibility: "hidden",
          perspective: "1000px",
          background: isScrolled ? "transparent" : "transparent",
          left: "50%",
        }}
      >
        <div className="z-50 flex items-center justify-center gap-2 transition-all duration-300">
          <a
            className="flex items-center justify-center gap-2"
            href="/"
          >
            <img
              src="/resources/logo.svg"
              alt="LoopSync Logo"
              className="h-9 w-auto brightness-150 contrast-125"
            />
          </a>
          {/* <CountryCurrencyDropdown /> */}
        </div>

        <div className="absolute inset-0 hidden flex-1 flex-row items-center justify-center space-x-2 text-sm font-semibold text-white/70 transition duration-200 hover:text-white md:flex md:space-x-2">
          <a className="relative px-4 py-2 text-white hover:underline transition-colors cursor-pointer" href="/models">
            <span className="relative z-20">Models</span>
          </a>
          <a className="relative px-4 py-2 text-white hover:underline transition-colors cursor-pointer" href="/use-cases">
            <span className="relative z-20">Use Cases</span>
          </a>
          <a className="relative px-4 py-2 text-white hover:underline transition-colors cursor-pointer" href="/pricing">
            <span className="relative z-20">Pricing</span>
          </a>
          <a className="relative px-4 py-2 text-white hover:underline transition-colors cursor-pointer" href="/download-manual">
            <span className="relative z-20">Manual</span>
          </a>

          <a className="relative px-4 py-2 text-white hover:underline transition-colors cursor-pointer" href="/company">
            <span className="relative z-20">Company</span>
          </a>
          <a className="relative px-4 py-2 text-white hover:underline transition-colors cursor-pointer" href="https://loopsync.cloud/policies" target="_blank" rel="noopener noreferrer">
            <span className="relative z-20 mb-1">Policies</span>
            <ExternalLink className="w-4 h-4 ml-1 mb-1 inline text-white font-bold" />
          </a>
          {/* <a className="relative px-4 py-2 text-white hover:underline transition-colors cursor-pointer" href="/contact">
            <span className="relative z-20">Contact Us</span>
          </a> */}

          {/* <a className="relative px-4 py-2 text-white hover:underline transition-colors cursor-pointer" href="https://investors.intellaris.co" target="_blank" rel="noopener noreferrer">
            <span className="relative z-20 mb-1">Investor Relations</span>
            <ExternalLink className="w-4 h-4 ml-1 mb-1 inline text-white font-bold" />
          </a> */}
        </div>


        <div className="flex items-center gap-3">

          {isAuthenticated ? (
            <Link href="https://loopsync.cloud/home">
              <button
                className="rounded-full font-semibold relative cursor-pointer hover:-translate-y-0.5 transition-all duration-200 inline-block text-center px-4 py-2 text-sm border text-black bg-white"
              >
                Open Console
              </button>
            </Link>
          ) : (
            <>
              <a
                href="https://loopsync.cloud/open-account?login=true"
                className="rounded-full font-semibold relative cursor-pointer hover:-translate-y-0.5 transition-all duration-200 inline-block text-center px-4 py-2 text-sm border border-white/10 text-white bg-transparent hover:border-white/10"
              >
                Login
              </a>
              <a
                href="https://loopsync.cloud/open-account?login=false"
                className="rounded-full font-semibold relative cursor-pointer hover:-translate-y-0.5 transition-all duration-200 inline-block text-center px-4 py-2 text-sm border text-black bg-white"
              >
                Open Account
              </a>
            </>
          )}
        </div>
      </header>
    </>
  )
}
