"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function ProTranslationSection() {
    return (
        <section className="relative py-16 md:py-24 px-4 sm:px-6 md:px-8 text-center max-w-5xl mx-auto w-full overflow-hidden">
            {/* Background Watermark */}
            <div className="absolute top-0 -left-20 md:-left-100 w-[400px] md:w-[700px] h-[400px] md:h-[700px] pointer-events-none select-none z-0 opacity-50">
                <img
                    src="/products-logo.svg"
                    alt="Product Logo"
                    className="w-full h-full object-contain brightness-150"
                />
            </div>

            <div className="mb-6 relative z-10">
                <img
                    src="/products-logo.svg"
                    alt="Product Logo"
                    className="w-12 h-12 md:w-16 md:h-16 mx-auto object-contain brightness-150"
                />
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
              @keyframes sunriseText {
                0% {
                  background-position: 50% 100%;
                  opacity: 0;
                  transform: translateY(20px);
                  filter: blur(8px);
                }
                100% {
                  background-position: 50% 0%;
                  opacity: 1;
                  transform: translateY(0);
                  filter: blur(0);
                }
              }
              @keyframes sunGlow {
                0% { opacity: 0; transform: scale(0.8); }
                100% { opacity: 1; transform: scale(1); }
              }
            `}} />

            <div className="relative inline-block mb-6">
                {/* Subtle Sun Glow Background */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] blur-[90px] rounded-full -z-10 animate-[sunGlow_2s_ease-out_forwards]"></div>

                <h2 className="text-2xl sm:text-3xl lg:text-3xl font-bold tracking-tight relative z-10">
                    <span className="bg-clip-text text-white bg-[length:100%_200%] animate-[sunriseText_1.8s_cubic-bezier(0.2,0.8,0.2,1)_forwards] inline-block">
                        Precision Meets Productivity.
                    </span>
                </h2>
            </div>
            <p className="text-base sm:text-lg text-zinc-400 mb-8 max-w-lg mx-auto">
                More than AI. Built for real productivity.
            </p>

            <div className="flex flex-col items-center gap-4 mb-16 md:mb-24">
                <Link href="/pricing" className="px-6 py-3 rounded-full bg-white text-black font-medium hover:bg-zinc-200 transition-colors text-sm sm:text-base">
                    Compare Plans
                </Link>
                <span className="text-sm text-zinc-500">Starting at ₹759/month</span>
            </div>


            {/* Translation Feature Highlight */}
            <div className="relative w-full text-left">
                <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-64 text-right pr-8 hidden lg:block">
                    {/* Decorative left text? Optional based on screenshot */}
                </div>

                <div className="bg-gradient-to-b from-[#1A1A1A] to-black border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row relative">

                    {/* Left Half (Input) */}
                    <div className="flex-1 p-6 md:p-8 border-r-0 md:border-r border-b md:border-b-0 border-white/5 relative">
                        <div className="absolute top-4 right-4 flex gap-2">
                            <span className="text-xs text-zinc-500">System</span>
                        </div>
                        <div className="mt-8 text-xl sm:text-2xl md:text-3xl font-light text-zinc-300">
                            Interface Controls
                        </div>
                        {/* Cursor */}
                        <div className="w-0.5 h-6 md:h-8 bg-blue-500 animate-pulse mt-2"></div>
                    </div>

                    {/* Center Swap Icon */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-[#2A2A2A] rounded-full border border-white/10 flex items-center justify-center z-10 hidden md:flex">
                        <ArrowRight className="w-4 h-4 text-zinc-500" />
                    </div>

                    {/* Right Half (Output) */}
                    <div className="flex-1 p-6 md:p-8 bg-black/50">
                        <div className="absolute top-4 right-4 flex gap-2">
                            <span className="text-xs text-zinc-500">User</span>
                        </div>
                        <div className="mt-8 text-xl sm:text-2xl md:text-3xl font-light text-zinc-600">
                            Input & Output
                        </div>
                    </div>
                </div>
            </div>

        </section>
    );
}
