"use client";

import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { LifeBuoy, Mail } from "lucide-react";
import Link from "next/link";

export default function SupportPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-white/20 relative overflow-hidden flex flex-col">

            {/* Ambient Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-emerald-900/10 rounded-full blur-[120px] mix-blend-screen opacity-100" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-teal-900/10 rounded-full blur-[100px] mix-blend-screen opacity-100" />
            </div>

            <Navbar />

            <main className="flex-grow relative z-10 flex flex-col items-center justify-center text-center px-4 sm:px-6 pt-32 pb-20 max-w-4xl mx-auto w-full">

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white/60 backdrop-blur-md mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Help Center</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-semibold tracking-tight leading-tight bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent mb-6 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100">
                    We're here to help.
                </h1>

                <p className="text-lg md:text-xl text-white/60 max-w-2xl leading-relaxed mb-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                    Find answers, troubleshoot issues, and get the most out of LoopSync. Our support resources are expanding.
                </p>

                {/* Grid for Support Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full animate-in fade-in zoom-in duration-1000 delay-300">

                    {/* Option 1: Contact */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm hover:bg-white/10 transition-colors">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-white/5">
                                <Mail className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-medium text-white">Contact Support</h3>
                            <p className="text-sm text-white/40 mb-4">
                                Need direct assistance? Reach out to our support team via email.
                            </p>
                            <Link href="/contact" className="text-sm font-medium text-emerald-400 hover:text-emerald-300 hover:underline">
                                Get in touch &rarr;
                            </Link>
                        </div>
                    </div>

                    {/* Option 2: Documentation */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm hover:bg-white/10 transition-colors">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-white/5">
                                <LifeBuoy className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-medium text-white">Documentation</h3>
                            <p className="text-sm text-white/40 mb-4">
                                Browse our technical guides and API references for self-help.
                            </p>
                            <Link href="/developers/docs" className="text-sm font-medium text-emerald-400 hover:text-emerald-300 hover:underline">
                                Read the docs &rarr;
                            </Link>
                        </div>
                    </div>

                </div>

            </main>

            <Footer />
        </div>
    );
}
