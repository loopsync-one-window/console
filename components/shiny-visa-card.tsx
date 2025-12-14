"use client"

import type React from "react"
import { useState } from "react"

export default function ShinyVisaCard() {
  const [isHovered, setIsHovered] = useState(false)
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)
  const [shineX, setShineX] = useState(0)
  const [shineY, setShineY] = useState(0)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // 3D tilt
    setRotateY((x - centerX) * 0.02)
    setRotateX((centerY - y) * 0.02)

    // Shine position
    setShineX(x)
    setShineY(y)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setRotateX(0)
    setRotateY(0)
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-white p-4">
      <style>{`
        @keyframes shimmerSweep {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }

        .card-container {
          perspective: 1200px;
        }

        .card-inner {
          transition: transform 0.15s ease-out;
          transform-style: preserve-3d;
        }

        .card-shine {
          position: absolute;
          pointer-events: none;
          background: radial-gradient(
            circle at var(--shine-x, 50%) var(--shine-y, 50%),
            rgba(255, 255, 255, 0.8) 0%,
            rgba(255, 255, 255, 0.3) 20%,
            transparent 60%
          );
          mix-blend-mode: screen;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .card-inner:hover .card-shine {
          opacity: 1;
        }

        .shimmer {
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.3),
            transparent
          );
          background-size: 1000px 100%;
          animation: shimmerSweep 3s infinite;
        }

        .card-number-spacing {
          letter-spacing: 0.15em;
        }

        .hologram-effect {
          background: linear-gradient(
            135deg,
            rgba(139, 92, 246, 0.1),
            rgba(59, 130, 246, 0.05)
          );
          border: 1px solid rgba(139, 92, 246, 0.2);
        }
      `}</style>

      <div
        className="card-container"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className="card-inner relative w-96 h-64 rounded-2xl shadow-2xl overflow-hidden"
          style={{
            transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${isHovered ? 1.02 : 1})`,
            background: "#000000",
            color: "black",
          }}
        >
          {/* Background gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black opacity-40" />

          {/* Shine sweep overlay */}
          <div
            className="card-shine absolute inset-0"
            style={
              {
                "--shine-x": `${(shineX / 384) * 100}%`,
                "--shine-y": `${(shineY / 256) * 100}%`,
              } as React.CSSProperties
            }
          />

          {/* Shimmer animation */}
          <div className="absolute inset-0 shimmer opacity-40" />

          {/* Card content */}
          <div className="relative w-full h-full p-8 flex flex-col justify-between">
            {/* Top section */}
            <div className="flex justify-between items-start">
              {/* VISA Logo */}
              <svg width="56" height="36" viewBox="0 0 56 36" fill="none" className="drop-shadow-lg">
                <rect width="56" height="36" rx="4" fill="white" />
                <text x="8" y="24" fontSize="14" fontWeight="bold" fill="#1a1a2e">
                  VISA
                </text>
              </svg>

              {/* Hologram indicator */}
              <div className="hologram-effect px-2 py-1 rounded backdrop-blur-sm">
                <div className="text-xs font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                  HOLOGRAM
                </div>
              </div>
            </div>

            {/* Middle section */}
            <div className="space-y-6">
              {/* EMV Chip */}
              <div className="w-14 h-14">
                <svg width="56" height="56" viewBox="0 0 56 56" fill="none" className="drop-shadow-lg">
                  {/* Chip background */}
                  <rect width="56" height="56" rx="4" fill="#FFD700" />

                  {/* Chip contacts */}
                  <circle cx="14" cy="14" r="3" fill="#1a1a2e" />
                  <circle cx="28" cy="14" r="3" fill="#1a1a2e" />
                  <circle cx="42" cy="14" r="3" fill="#1a1a2e" />
                  <circle cx="14" cy="28" r="3" fill="#1a1a2e" />
                  <circle cx="28" cy="28" r="3" fill="#1a1a2e" />
                  <circle cx="42" cy="28" r="3" fill="#1a1a2e" />
                  <circle cx="14" cy="42" r="3" fill="#1a1a2e" />
                  <circle cx="28" cy="42" r="3" fill="#1a1a2e" />
                  <circle cx="42" cy="42" r="3" fill="#1a1a2e" />

                  {/* Grid lines */}
                  <line x1="8" y1="8" x2="48" y2="8" stroke="#1a1a2e" strokeWidth="0.5" opacity="0.5" />
                  <line x1="8" y1="48" x2="48" y2="48" stroke="#1a1a2e" strokeWidth="0.5" opacity="0.5" />
                </svg>
              </div>

              {/* Card number */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-400 tracking-widest">CARD NUMBER</p>
                <p className="card-number-spacing text-xl font-mono font-semibold text-white drop-shadow-lg">
                  4321 5678 9012 3456
                </p>
              </div>
            </div>

            {/* Bottom section */}
            <div className="flex justify-between items-end">
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-400 tracking-widest">CARDHOLDER</p>
                <p className="text-sm font-semibold text-white drop-shadow-lg">JOHN DOE</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-400 tracking-widest">EXPIRES</p>
                <p className="text-sm font-mono font-semibold text-white drop-shadow-lg">08/29</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
