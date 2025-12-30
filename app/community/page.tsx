"use client";

import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Users, ArrowRight } from "lucide-react";

export default function CommunityPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-white/20 relative overflow-hidden flex flex-col">

            {/* Ambient Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-indigo-900/10 rounded-full blur-[120px] mix-blend-screen opacity-100" />
                <div className="absolute  bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-blue-900/10 rounded-full blur-[100px] mix-blend-screen opacity-100" />
            </div>

            <Navbar />

            <main className="flex-grow relative z-10 flex flex-col items-center justify-center text-center px-4 sm:px-6 pt-32 pb-20 max-w-4xl mx-auto w-full">

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white/60 backdrop-blur-md mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
                    <span>Community Hub</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-semibold tracking-tight leading-tight bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent mb-6 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100">
                    Join the Conversation.
                </h1>

                <p className="text-lg md:text-xl text-white/60 max-w-2xl leading-relaxed mb-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                    We are building a vibrant community for developers, creators, and innovators. Connect, share, and build the future with LoopSync.
                </p>

                {/* Construction / Coming Soon Indicator */}
                <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm animate-in fade-in zoom-in duration-1000 delay-300">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-white/5">
                            <Users className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-medium text-white">Launching Soon</h3>
                        <p className="text-sm text-white/40">
                            Our community platform is currently under development. Stay tuned for forums, events, and more.
                        </p>
                    </div>
                </div>

            </main>

            <Footer />
        </div>
    );
}
