"use client";

import React from "react";
import Navbar from "@/components/NavBar";
import Link from "next/link";

export default function NotesPage() {
    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-orange-500/30 overflow-x-hidden relative">
            {/* Navbar */}
            <Navbar />

            <div className="max-w-4xl mx-auto pt-40 pb-32 px-6 relative z-10">

                {/* Profile Image & Header Layout */}
                <div className="flex flex-col md:flex-row items-start md:items-end gap-8 mb-16">
                    {/* Image with rich fade */}
                    <div className="relative w-full md:w-1/3">
                        <div className="absolute -inset-4 bg-gradient-to-tr from-white/20 to-black/20 rounded-3xl blur-2xl opacity-50"></div>
                        <div className="relative rounded-2xl overflow-hidden aspect-[4/5] shadow-2xl border border-white/5">
                            <img
                                src="/founder/profile_me.png"
                                alt="Ripun, Founder"
                                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700 hover:sepia-[.2]"
                            />
                            {/* Inner vignette for focus */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                            <div className="absolute bottom-4 left-4">
                                <p className="text-white font-semibold tracking-wide shadow-black drop-shadow-md">Ripun</p>
                                <p className="text-white/80 text-xs font-medium tracking-wider uppercase">Founder</p>
                            </div>
                        </div>
                    </div>

                    {/* Title */}
                    <div className="flex-1 pb-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-xs font-medium mb-6 backdrop-blur-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                            Founder's Note
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-zinc-500">
                            Building at the speed ideas deserve
                        </h1>
                    </div>
                </div>

                {/* Letter Content */}
                <div className="prose prose-lg prose-invert max-w-none">
                    <div className="space-y-8 text-lg md:text-xl leading-relaxed text-zinc-300 font-light border-l-2 border-white/5 pl-6 md:pl-10">

                        <p className="first-letter:text-4xl first-letter:font-serif first-letter:text-white first-letter:mr-2 first-letter:float-left">
                            To everyone who has found their way to <span className="text-white font-medium">LoopSync</span>,
                        </p>

                        <p>
                            This product was not built quickly, and it was not built easily.<br />
                            It was built across countless nights, when progress was slow, uncertainty was constant, and momentum had to be created from belief alone. There were long stretches of working in isolation, choosing focus over comfort, and continuing even when there was no visible validation.
                        </p>

                        <p>
                            <span className="text-white font-medium">Building LoopSync </span>required more than technical effort. It demanded mental resilience, personal sacrifice, and time taken away from social life, rest, and certainty. There were moments of doubt, moments of exhaustion, and moments where continuing felt harder than stopping.
                        </p>

                        <p>
                            But the idea of what LoopSync could become never left.
                        </p>

                        <p>
                            I kept building with the hope that one day, this work would help someone else think more clearly, work more calmly, and lose fewer ideas to chaos. That hope is what carried this product forward.
                        </p>

                        <p>
                            This is a reflection of that journey, designed to be quiet, dependable, and respectful of your time and attention. It exists so your ideas don't have to struggle the way this product did to survive.
                        </p>

                        <p>
                            If you are here, using LoopSync anywhere in the world, know that it means something. This platform was built with intention, care, and a long-term commitment to doing things the right way.                        </p>

                        <p className="text-white/90 font-normal">
                            Thank you for being part of this.
                            <br />
                            Thank you for trusting something that took everything to build.
                        </p>

                    </div>

                    {/* Signature */}
                    <div className="mt-16 pl-6 md:pl-10">
                        <div className="w-100 h-20 relative opacity-100 mb-4">
                            {/* Placeholder for Signature Image if available, otherwise stylish text */}
                            <span className="font-handwriting text-4xl text-white transform -rotate-2 inline-block font-script italic">Ripun Basumatary</span>
                        </div>
                    </div>
                </div>

            </div>

            {/* Footer (Minimal Version for this page) */}
            <div className="py-12 text-center text-zinc-600 text-sm border-t border-white/5 mx-6">
                <p>
                    © 2025{" "}
                    <span className="text-zinc-500">Intellaris Private Limited</span>
                    . All rights reserved.
                </p>
            </div>

            {/* CSS for custom font if needed, though we rely on standard classes. 
                Adding a quick style tag for the handwriting font fallback 
            */}
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&display=swap');
                .font-handwriting {
                    font-family: 'Caveat', cursive;
                }
            `}</style>
        </div>
    );
}
