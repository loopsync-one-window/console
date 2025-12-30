"use client";

import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { GitCommit, Sparkles } from "lucide-react";

export default function ChangelogPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-white/20 relative overflow-hidden flex flex-col">

            {/* Ambient Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-pink-900/10 rounded-full blur-[120px] mix-blend-screen opacity-100" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-indigo-900/10 rounded-full blur-[100px] mix-blend-screen opacity-100" />
            </div>

            <Navbar />

            <main className="flex-grow relative z-10 flex flex-col items-center justify-center text-center px-4 sm:px-6 pt-32 pb-20 max-w-4xl mx-auto w-full">



                <h1 className="text-5xl mt-20 md:text-7xl font-semibold tracking-tight leading-tight bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent mb-6 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100">
                    Changelog
                </h1>

                <p className="text-lg md:text-xl text-white/60 max-w-2xl leading-relaxed mb-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                    Follow our journey as we improve and expand LoopSync. New features, fixes, and improvements.
                </p>

                {/* Construction / Coming Soon Indicator */}
                <div className="w-full max-w-2xl text-left animate-in fade-in zoom-in duration-1000 delay-300">

                    {/* Placeholder Entry */}
                    <div className="border-l-2 border-white/10 pl-8 pb-12 relative">
                        {/* Timeline Dot */}
                        <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-black border-2 border-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.5)]"></div>

                        <span className="text-sm font-mono text-pink-400 mb-2 block">v1.0.0 &mdash; Coming Soon</span>
                        <h3 className="text-2xl font-medium text-white mb-4">Initial Public Release</h3>
                        <div className="space-y-4 text-white/60 text-sm leading-relaxed">
                            <p>
                                We are preparing for our first major release. It will include the core LoopSync One Window experience, the app store, and developer tools.
                            </p>
                            <ul className="list-disc pl-4 space-y-1 marker:text-white/20">
                                <li>Global One Window Interface</li>
                                <li>Intelligent App Store</li>
                                <li>Developer Console & SDK</li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-l-2 border-white/5 pl-8 pb-0 relative">
                        <div className="absolute left-[-5px] top-0 w-2 h-2 rounded-full bg-white/20"></div>
                        <p className="text-white/30 text-sm italic">More updates will appear here.</p>
                    </div>

                </div>

            </main>

            <Footer />
        </div>
    );
}
