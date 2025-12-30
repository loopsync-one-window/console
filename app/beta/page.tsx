"use client";

import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Beaker, Bug } from "lucide-react";

export default function BetaPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-white/20 relative overflow-hidden flex flex-col">

            {/* Ambient Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[30%] w-[60vw] h-[60vw] bg-yellow-900/10 rounded-full blur-[120px] mix-blend-screen opacity-100" />
                <div className="absolute bottom-[-20%] right-[30%] w-[50vw] h-[50vw] bg-amber-900/10 rounded-full blur-[100px] mix-blend-screen opacity-100" />
            </div>

            <Navbar />

            <main className="flex-grow relative z-10 flex flex-col items-center justify-center text-center px-4 sm:px-6 pt-32 pb-20 max-w-4xl mx-auto w-full">



                <h1 className="text-5xl mt-20 md:text-7xl font-semibold tracking-tight leading-tight bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent mb-6 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100">
                    Test the future.
                </h1>

                <p className="text-lg md:text-xl text-white/60 max-w-2xl leading-relaxed mb-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                    Get early access to upcoming features. Help us squash bugs and refine the LoopSync experience.
                </p>

                {/* Construction / Coming Soon Indicator */}
                <div className="w-full max-w-md bg-transparent border border-white/10 rounded-2xl p-8 backdrop-blur-sm animate-in fade-in zoom-in duration-1000 delay-300">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-white/5">
                            <Beaker className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-medium text-white">No active beta programs</h3>
                        <p className="text-sm text-white/40">
                            We don't have any public beta releases available right now. Creating an account automatically enrolls you for future invites.
                        </p>
                    </div>
                </div>

            </main>

            <Footer />
        </div>
    );
}
