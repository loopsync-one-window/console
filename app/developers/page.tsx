"use client";

import React from "react";
import Navbar from "@/components/NavBar";
import Link from "next/link";
import { ArrowUpRight, Code2, Globe, Zap, Box, Upload, Rocket, Terminal, DollarSign } from "lucide-react";

export default function DevelopersPage() {
    return (
        <div className="h-screen bg-black text-white font-sans selection:bg-red-500/30 overflow-hidden relative flex flex-col">
            {/* Navbar */}
            <div className="z-50">
                <Navbar />
            </div>

            {/* Background Glows */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                {/* Top Green Curtain/Aurora */}
                <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[120%] h-[60%] bg-red-900/30 blur-[100px] rounded-[100%] opacity-60"></div>

                {/* Subtle curve separator line */}
                <div className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[110%] h-[40%] border-t border-red-500/50 border-dashed rounded-[100%] opacity-30"></div>

                {/* Bottom faint glow */}
                <div className="absolute bottom-[-20%] left-1/2 -translate-x-1/2 w-[80%] h-[40%] bg-red-500/5 blur-[80px]"></div>
            </div>

            {/* Main Content Container - Centered Vertically */}
            <main className="flex-1 flex flex-col items-center justify-center relative z-10 w-full max-w-7xl mx-auto px-6 pt-16">

                {/* Header Section */}
                <div className="text-center mb-10 flex flex-col items-center animate-[fadeIn_1s_ease-out]">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-white text-xs font-medium tracking-wide mb-6 uppercase">
                        <Terminal className="w-3 h-3" />
                        FOR DEVELOPERS
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-white">
                        Publish your <span className="text-white">Apps</span>
                    </h1>

                    <p className="text-zinc-400 text-lg max-w-xl mx-auto leading-relaxed mb-8">
                        Bring your projects to LoopSync and offer them to the world.
                    </p>

                    <Link href="/developers/account" className="group relative inline-flex items-center gap-3 pl-8 pr-2 py-2 rounded-full bg-white text-black font-semibold hover:bg-[#c09888] transition-all">
                        <span className="text-sm">Open Console</span>
                        <div className="w-8 h-8 rounded-full bg-black/10 group-hover:bg-black/20 flex items-center justify-center">
                            <ArrowUpRight className="w-4 h-4" />
                        </div>
                    </Link>
                </div>

                {/* Grid Layout for Visuals */}
                <div className="w-full flex flex-col items-center gap-12 mt-4">

                    {/* Feature Cards Row */}
                    <div className="flex gap-4 md:gap-6 animate-[slideUpFade_1s_ease-out_0.2s_forwards] opacity-0">
                        <FeatureCard icon={<Code2 />} title="Publish your project" subtitle="Publish your work to LoopSync." />
                        <FeatureCard icon={<Globe />} title="Decide how it's shared" subtitle="Choose who can access your project." />
                        <FeatureCard icon={<DollarSign />} title="Reach people globally" subtitle="Get 95% of the revenue." />
                    </div>

                    {/* Flow Visualization (Compact) */}
                    <div className="w-full max-w-3xl relative mt-4 animate-[slideUpFade_1s_ease-out_0.4s_forwards] opacity-0 hidden md:block">
                        {/* Connecting Line */}
                        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

                        <div className="flex justify-between items-center relative z-10 px-12">
                            <FlowStep icon={<Box />} label="Prepare your project" />
                            <div className="w-2 h-2 rotate-45 bg-black border border-white/50"></div>
                            <FlowStep icon={<Upload />} label="Review & publish" />
                            <div className="w-2 h-2 rotate-45 bg-black border border-white/50"></div>
                            <FlowStep icon={<Rocket />} label="Grow adoption" />
                        </div>
                    </div>

                </div>

            </main>

            {/* Minimal Footer */}
            <div className="relative z-10 py-6 text-center text-white text-[10px] font-semibold uppercase tracking-widest opacity-100">
                Powered by OnDust Engine &bull; Intellaris Private Limited
            </div>
        </div>
    );
}

// Sub-components for cleaner code
function FeatureCard({ icon, title, subtitle }: { icon: React.ReactNode, title: string, subtitle: string }) {
    return (
        <div className="w-32 md:w-40 p-4 rounded-3xl border border-white/5 bg-transparent backdrop-blur-sm flex flex-col items-center justify-center gap-3 hover:bg-white/5 hover:border-white/5 transition-all group cursor-pointer">
            <div className="text-zinc-400 group-hover:text-white transition-colors">
                {React.cloneElement(icon as React.ReactElement<any>, { size: 20 })}
            </div>
            <div className="text-center">
                <p className="text-white font-semibold text-sm">{title}</p>
                <p className="text-zinc-500 text-xs">{subtitle}</p>
            </div>
        </div>
    )
}

function FlowStep({ icon, label }: { icon: React.ReactNode, label: string }) {
    return (
        <div className="flex flex-col items-center gap-3 bg-transparent p-2 rounded-xl backdrop-blur-md border border-transparent transition-colors">
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-white">
                {React.cloneElement(icon as React.ReactElement<any>, { size: 20 })}
            </div>
            <span className="text-xs text-white font-medium tracking-wide">{label}</span>
        </div>
    )
}
