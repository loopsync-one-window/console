"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function ExtensibilitySection() {
    return (
        <section className="px-4 sm:px-6 max-w-7xl mx-auto w-full mt-16 md:mt-24">
            <div className="text-center mb-12 md:mb-16">
                <h2 className="text-xl sm:text-3xl font-medium text-zinc-400">
                    Built to extend as your <span className="text-white font-medium">needs grow.</span>
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Atlas Card */}
                <Link href="/products/atlas" className="group relative bg-[#000] border border-white/5 rounded-[2rem] p-6 md:p-8 overflow-hidden hover:border-white/10 transition-colors h-auto min-h-[400px] flex flex-col">
                    <style dangerouslySetInnerHTML={{
                        __html: `
                      @keyframes scanVertical {
                        0% { top: 0; opacity: 0; }
                        15% { opacity: 1; }
                        85% { opacity: 1; }
                        100% { top: 100%; opacity: 0; }
                      }
                    `}} />
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-blue-400">

                                <img
                                    src="/apps/atlas.png"
                                    alt="Product Logo"
                                    className="w-12 h-12 rounded-xl mx-auto object-contain brightness-150"
                                />


                            </div>
                            <span className="font-semibold text-lg text-white">Atlas</span>
                        </div>
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                            <ArrowRight className="w-4 h-4 text-white" />
                        </div>
                    </div>
                    <p className="text-zinc-400 mb-8 text-sm sm:text-base">Pick any part of your screen, use custom commands, and get smart analysis instantly.</p>

                    {/* Abstract Visual: Screen Selection & columns */}
                    <div className="mt-auto relative h-40 w-full">
                        {/* "Screen" Background */}
                        <div className="absolute inset-0 bg-zinc-900/30 rounded-3xl border border-white/5 overflow-hidden">
                            <div className="p-4 space-y-2 opacity-20">
                                <div className="h-2 bg-zinc-500 rounded w-3/4"></div>
                                <div className="h-2 bg-zinc-500 rounded w-1/2"></div>
                                <div className="h-2 bg-zinc-500 rounded w-full"></div>
                                <div className="h-2 bg-zinc-500 rounded w-2/3"></div>
                                <div className="h-2 bg-zinc-500 rounded w-5/6"></div>
                            </div>
                        </div>

                        {/* Selection Box */}
                        <div className="absolute top-4 left-4 w-32 h-24 border border-blue-500/50 border-dashed bg-blue-500/5 rounded-md z-10">
                            {/* Corner handles */}
                            <div className="absolute -top-1 -left-1 w-2 h-2 bg-blue-500"></div>
                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500"></div>
                            <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-500"></div>
                            <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-blue-500"></div>
                            {/* Scan Beam */}
                            <div className="absolute left-0 right-0 h-[4px] bg-blue-400 shadow-[0_0_12px_rgba(96,165,250,0.8)] animate-[scanVertical_3s_linear_infinite]"></div>
                        </div>

                        {/* Response Popover (3 Columns) */}
                        <div className="absolute top-8 left-28 w-48 bg-[#151515] border border-white/10 rounded-lg shadow-2xl p-3 z-20 flex gap-2 animate-[slideUpFade_1s_ease-out_forwards]">
                            {/* Column 1 */}
                            <div className="flex-1 space-y-1.5">
                                <div className="h-1.5 bg-zinc-600 rounded w-full"></div>
                                <div className="h-1.5 bg-zinc-700 rounded w-3/4"></div>
                                <div className="h-1.5 bg-zinc-700 rounded w-full"></div>
                            </div>
                            {/* Column 2 */}
                            <div className="flex-1 space-y-1.5 border-l border-white/5 pl-2">
                                <div className="h-1.5 bg-zinc-600 rounded w-5/6"></div>
                                <div className="h-1.5 bg-zinc-700 rounded w-full"></div>
                            </div>
                            {/* Column 3 */}
                            <div className="flex-1 space-y-1.5 border-l border-white/5 pl-2">
                                <div className="h-1.5 bg-zinc-600 rounded w-full"></div>
                                <div className="h-1.5 bg-zinc-700 rounded w-2/3"></div>
                                <div className="h-1.5 bg-zinc-700 rounded w-full"></div>
                            </div>
                        </div>
                    </div>
                </Link>

                {/* Ceres Assist Card */}
                <Link href="/products/ceres-assist" className="group relative bg-[#000] border border-white/5 rounded-[2rem] p-6 md:p-8 overflow-hidden hover:border-white/10 transition-colors h-auto min-h-[400px] flex flex-col">
                    <style dangerouslySetInnerHTML={{
                        __html: `
                      @keyframes browserType {
                        0% { width: 0; }
                        50% { width: 80%; }
                        100% { width: 80%; }
                      }
                      @keyframes cursorFloat {
                        0% { transform: translate(0, 0); }
                        25% { transform: translate(120px, 40px); }
                        50% { transform: translate(120px, 40px) scale(0.9); }
                        75% { transform: translate(0, 0); }
                        100% { transform: translate(0, 0); }
                      }
                      @keyframes buttonPulse {
                         0%, 45% { transform: scale(1); opacity: 0.5; }
                         50% { transform: scale(0.95); opacity: 1; }
                         55%, 100% { transform: scale(1); opacity: 0.5; }
                      }
                    `}} />
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                                <img
                                    src="/apps/ceres.png"
                                    alt="Product Logo"
                                    className="w-12 h-12 rounded-xl mx-auto object-contain brightness-150"
                                />
                            </div>
                            <span className="font-semibold text-lg text-white">Ceres Assist</span>
                        </div>
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                            <ArrowRight className="w-4 h-4 text-white" />
                        </div>
                    </div>
                    <p className="text-zinc-400 mb-8 text-sm sm:text-base">An autonomous browser agent that navigates the web to perform complex tasks for you.</p>

                    {/* Abstract Visual: Browser Agent UI */}
                    <div className="mt-auto relative h-48 w-full bg-zinc-900/40 rounded-t-xl border-t border-x border-white/5 overflow-hidden">
                        {/* Browser Header */}
                        <div className="h-8 bg-white/5 border-b border-white/5 flex items-center px-3 gap-2">
                            <div className="flex gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-500/20"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500/20"></div>
                            </div>
                            {/* Address Bar */}
                            <div className="flex-1 ml-4 h-5 bg-black/40 rounded flex items-center px-2">
                                <div className="h-2 bg-zinc-600 rounded-sm animate-[browserType_4s_steps(20)_infinite] w-0 overflow-hidden text-[0px]">Searching...</div>
                            </div>
                        </div>

                        {/* Browser Body */}
                        <div className="p-6 relative h-full">
                            {/* Mock Content */}
                            <div className="space-y-3">
                                <div className="h-20 bg-white/5 rounded-lg w-full flex items-center justify-center border border-white/5">
                                    <div className="w-36 h-10 bg-white p-4 rounded-full text-black text-xs flex items-center justify-center animate-[buttonPulse_4s_infinite]">
                                        Confirm Booking
                                    </div>
                                </div>
                                <div className="h-2 bg-zinc-800 rounded w-2/3"></div>
                                <div className="h-2 bg-zinc-800 rounded w-1/2"></div>
                            </div>

                            {/* Agent Cursor */}
                            <div className="absolute top-4 left-4 w-4 h-4 z-10 animate-[cursorFloat_4s_ease-in-out_infinite]">
                                <svg viewBox="0 0 24 24" fill="currentColor" className="text-white drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]">
                                    <path d="M3.5 3.5L10 20L12.5 13.5L19 11L3.5 3.5Z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </Link>


                {/* Lumiflage Card */}
                <Link href="/products/lumiflage" className="group relative bg-[#000] border border-white/5 rounded-[2rem] p-6 md:p-8 overflow-hidden hover:border-white/10 transition-colors h-auto min-h-[400px] flex flex-col">
                    <style dangerouslySetInnerHTML={{
                        __html: `
                      @keyframes softGlow {
                        0%, 100% { opacity: 0.5; box-shadow: 0 0 20px 5px rgba(255, 200, 150, 0.1); transform: scale(1); }
                        50% { opacity: 1; box-shadow: 0 0 40px 10px rgba(255, 220, 180, 0.2); transform: scale(1.02); }
                      }
                      @keyframes faceReveal {
                        0%, 100% { filter: brightness(0.3); }
                        50% { filter: brightness(1.2); }
                      }
                    `}} />

                    <div className="flex items-center justify-between mb-4 relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white border border-white/10">
                                <div className="border-7 border-white"></div>
                            </div>
                            <span className="font-semibold text-lg text-white">Lumiflage</span>
                        </div>
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                            <ArrowRight className="w-4 h-4 text-white" />
                        </div>
                    </div>
                    <p className="text-zinc-400 mb-8 relative z-10 text-sm sm:text-base">A soft screen light that keeps your face visible on video calls - even in the dark.</p>

                    {/* Lumiflage Visual - Dark Room Effect */}
                    <div className="mt-auto relative h-48 w-full flex items-center justify-center">
                        <div className="absolute inset-0 bg-black/50 z-0"></div>

                        {/* The Screen / Light Source */}
                        <div className="relative z-10 w-48 h-32 bg-black border-6 border-white rounded-3xl animate-[softGlow_4s_ease-in-out_infinite] flex items-center justify-center">
                            {/* Abstract "Face" getting lit */}
                            <div className="w-16 h-16 rounded-full bg-white border border-white/10 animate-[faceReveal_4s_ease-in-out_infinite] flex items-center justify-center relative overflow-hidden">
                                <div className="absolute top-[20%] w-[60%] h-[60%] bg-zinc-600 rounded-full opacity-50"></div>
                                <div className="absolute bottom-[-10%] w-[80%] h-[50%] bg-zinc-600 rounded-full opacity-50"></div>
                            </div>

                            {/* Screen Reflection overlay */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent rounded-lg pointer-events-none"></div>
                        </div>

                        {/* Ambient Light Spill on "Desk" */}
                        <div className="absolute bottom-0 w-3/4 h-12 bg-white/5 blur-2xl rounded-full mb-2 animate-[softGlow_4s_ease-in-out_infinite]"></div>
                    </div>
                </Link>
            </div>
        </section >
    );
}
