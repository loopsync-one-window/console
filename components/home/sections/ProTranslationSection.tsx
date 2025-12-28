"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function ProTranslationSection() {
    return (
        <section className="w-full bg-black py-12 sm:py-16 md:py-24 px-4 sm:px-6 md:px-20 relative overflow-hidden">
            <style
                dangerouslySetInnerHTML={{
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
        `,
                }}
            />

            {/* Grid Layout Container */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10 w-full">

                {/* Left Content: Visual (Translation UI) */}
                <div className="relative w-full order-last lg:order-first">
                    {/* Subtle Sun Glow Background behind UI */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] blur-[90px] rounded-full -z-10 animate-[sunGlow_2s_ease-out_forwards] opacity-30" />

                    <div className="bg-gradient-to-b from-[#1A1A1A] to-black border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row relative">
                        {/* Left Half (System Interface) */}
                        <div className="flex-1 p-6 md:p-8 border-r-0 md:border-r border-b md:border-b-0 border-white/5 relative bg-zinc-900/20">
                            <div className="absolute top-4 right-4 flex gap-2">
                                <span className="text-xs text-zinc-500">System</span>
                            </div>
                            <div className="mt-8 text-xl sm:text-2xl font-light text-zinc-300">
                                Interface Controls
                            </div>
                            {/* Cursor Animation */}
                            <div className="w-0.5 h-6 md:h-8 bg-blue-500 animate-pulse mt-2" />
                        </div>

                        {/* Center Swap Icon */}
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-[#2A2A2A] rounded-full border border-white/10 flex items-center justify-center z-10 hidden md:flex">
                            <ArrowRight className="w-4 h-4 text-zinc-500" />
                        </div>

                        {/* Right Half (User Input/Output) */}
                        <div className="flex-1 p-6 md:p-8 bg-black/50">
                            <div className="absolute top-4 right-4 flex gap-2">
                                <span className="text-xs text-zinc-500">User</span>
                            </div>
                            <div className="mt-8 text-xl sm:text-2xl font-light text-zinc-600">
                                Input & Output
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Content: Text Info */}
                <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-6 lg:gap-8 z-10">
                    <div className="space-y-4">
                        <h2 className="text-2xl sm:text-4xl md:text-4xl font-semibold text-white tracking-tight leading-tight font-geom">
                            <span className="bg-clip-text text-white bg-[length:100%_200%] animate-[sunriseText_1.8s_cubic-bezier(0.2,0.8,0.2,1)_forwards] inline-block">
                                Where precision meets productivity.
                            </span>
                        </h2>
                        <p className="text-base sm:text-lg text-zinc-400 max-w-lg mx-auto lg:mx-0">
                            More than AI. Built for real productivity. Seamless translation between your intent and the system's execution.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <Link
                            href="/pricing"
                            className="bg-white text-black min-h-12 px-8 rounded-full font-semibold flex items-center gap-2.5 hover:bg-zinc-200 transition-colors shadow-[0_0_40px_rgba(255,255,255,0.15)] active:scale-95 duration-200 text-sm sm:text-base"
                        >
                            Compare Plans
                        </Link>
                        <span className="text-sm text-zinc-500">Starting at ₹759/month</span>
                    </div>
                </div>

            </div>
        </section>
    );
}
