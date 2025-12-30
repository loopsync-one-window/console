"use client";

import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Sparkles, TreeDeciduousIcon } from "lucide-react";

export default function CareersPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-white/20 relative overflow-hidden flex flex-col">

            {/* Ambient Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[20%] w-[60vw] h-[60vw] bg-purple-900/10 rounded-full blur-[120px] mix-blend-screen opacity-100" />
                <div className="absolute bottom-[-20%] right-[20%] w-[50vw] h-[50vw] bg-violet-900/10 rounded-full blur-[100px] mix-blend-screen opacity-100" />
            </div>

            <Navbar />

            <main className="flex-grow relative z-10 flex flex-col items-center justify-center text-center px-4 sm:px-6 pt-32 pb-20 max-w-4xl mx-auto w-full">



                <h1 className="text-5xl mt-20 md:text-7xl font-semibold tracking-tight leading-tight bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent mb-6 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100">
                    Build what's next.
                </h1>

                <p className="text-lg md:text-xl text-white/60 max-w-2xl leading-relaxed mb-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                    We are looking for passionate individuals to join us in shaping the future of intelligent software.
                </p>

                {/* Coming Soon / Values */}
                <div className="w-full max-w-2xl animate-in fade-in zoom-in duration-1000 delay-300">
                    <div className="bg-transparent border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-white/5">
                                <TreeDeciduousIcon className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-medium text-white">Open Roles</h3>
                            <p className="text-sm text-white/40 mb-6">
                                We don't have any specific openings listed at the moment, but we are always looking for talent.
                            </p>
                            <a href="mailto:careers@intellaris.co" className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-white text-black font-medium text-sm hover:bg-gray-200 transition-all shadow-lg hover:shadow-white/20">
                                Send us your resume
                            </a>
                        </div>
                    </div>
                </div>

            </main>

            <Footer />
        </div>
    );
}
