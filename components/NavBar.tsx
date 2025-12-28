"use client"

import { useState, useEffect } from "react"
import { ChevronRightCircle, ExternalLink, Link2, Link2Off, SwitchCamera } from "lucide-react"
import CountryCurrencyDropdown from "./CurrencyDropdown"
import { getStoredTokens } from "@/lib/api"
import Link from "next/link"

interface NavbarProps {
  className?: string
}

export default function Navbar({ className }: NavbarProps) {
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
        className={`fixed top-4 z-[9999] mx-auto w-full flex flex-row items-center justify-between self-start rounded-full backdrop-blur-md border transition-all duration-300 max-w-6xl px-4 border-transparent shadow-none py-2 ${className || ""}`}
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
        </div>

        {/* Desktop Navigation Links */}
        <div className="absolute inset-0 hidden flex-1 flex-row items-center justify-center space-x-2 text-sm font-semibold text-white/70 transition duration-200 hover:text-white md:flex md:space-x-2">
          <a className="relative px-4 py-2 text-white hover:underline transition-colors cursor-pointer" href="/models">
            <span className="relative z-20">Models</span>
          </a>
          {/* <a className="relative px-4 py-2 text-white hover:underline transition-colors cursor-pointer" href="/products">
            <span className="relative z-20">Products</span>
          </a> */}
          <a className="relative px-4 py-2 text-white hover:underline transition-colors cursor-pointer" href="/pricing">
            <span className="relative z-20">Pricing</span>
          </a>
          <a className="relative px-4 py-2 text-white hover:underline transition-colors cursor-pointer" href="/download-manual">
            <span className="relative z-20">Manual</span>
          </a>
          <a className="relative px-4 py-2 text-white hover:underline transition-colors cursor-pointer" href="/developers">
            <span className="relative z-20">Developers</span>
          </a>

          <a className="relative px-4 py-2 text-white hover:underline transition-colors cursor-pointer" href="/company">
            <span className="relative z-20">Company</span>
          </a>
          <a className="relative px-4 py-2 text-white hover:underline transition-colors cursor-pointer" href="https://loopsync.cloud/policies" target="_blank" rel="noopener noreferrer">
            <span className="relative z-20">Policies</span>
            <ExternalLink className="w-4 h-4 ml-1 relative bottom-0.5 inline text-white font-bold" />
          </a>
        </div>


        <div className="flex items-center gap-3">
          {/* Mobile Menu Toggle */}
          <button
            className="flex md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
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
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[9998] bg-black/95 backdrop-blur-xl pt-24 px-6 md:hidden">
          <nav className="flex flex-col gap-6 text-xl font-medium text-white">
            <a href="/models" className="hover:text-gray-300" onClick={() => setIsMobileMenuOpen(false)}>Models</a>
            <a href="/products" className="hover:text-gray-300" onClick={() => setIsMobileMenuOpen(false)}>Products</a>
            <a href="/pricing" className="hover:text-gray-300" onClick={() => setIsMobileMenuOpen(false)}>Pricing</a>
            <a href="/download-manual" className="hover:text-gray-300" onClick={() => setIsMobileMenuOpen(false)}>Manual</a>
            <a href="/developers" className="hover:text-gray-300" onClick={() => setIsMobileMenuOpen(false)}>Developers</a>
            <a href="/company" className="hover:text-gray-300" onClick={() => setIsMobileMenuOpen(false)}>Company</a>
            <a href="https://loopsync.cloud/policies" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
              Policies <ExternalLink className="w-4 h-4" />
            </a>

            <div className="h-px bg-white/10 my-2"></div>

            {isAuthenticated ? (
              <Link href="https://loopsync.cloud/home" onClick={() => setIsMobileMenuOpen(false)}>
                <button className="w-full rounded-full font-semibold px-4 py-3 text-base border text-black bg-white">
                  Open Console
                </button>
              </Link>
            ) : (
              <div className="flex flex-col gap-3">
                <a
                  href="https://loopsync.cloud/open-account?login=true"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full rounded-full font-semibold text-center px-4 py-3 text-base border border-white/10 text-white hover:bg-white/5"
                >
                  Login
                </a>
                <a
                  href="https://loopsync.cloud/open-account?login=false"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full rounded-full font-semibold text-center px-4 py-3 text-base border text-black bg-white"
                >
                  Open Account
                </a>
              </div>
            )}
          </nav>
        </div>
      )}
    </>
  )
}
