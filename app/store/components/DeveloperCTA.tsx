"use client";

import Link from "next/link";
import { Terminal, ArrowUpRight, Code2, Globe, IndianRupee } from "lucide-react";
import React from 'react';

export function DeveloperCTA({ category }: { category: string }) {
    return (
        <section className="col-span-1 md:col-span-2 lg:col-span-3 py-20 px-6 text-center">
            <div className="relative overflow-hidden rounded-[2.5rem] bg-transparent border border-white/5 p-12 max-w-4xl mx-auto group">
                {/* Background Glows */}
                <div className="absolute top-[-50%] left-1/2 -translate-x-1/2 w-[60%] h-[100%] bg-pink-600 blur-[100px] rounded-full opacity-40 group-hover:opacity-60 transition-opacity duration-700" />

                <div className="relative z-10 flex flex-col items-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-500/10 border border-gray-500/20 text-white text-[10px] font-bold tracking-widest mb-6 uppercase">
                        <Terminal className="w-3 h-3" />
                        Developer Console
                    </div>

                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
                        Be the first to publish
                        {/* Be the first to publish <span className="text-white"> {category} </span> */}
                    </h2>

                    <p className="text-white text-lg max-w-xl mx-auto leading-relaxed mb-8">
                        The {category} category needs pioneers. Bring your project to LoopSync and reach users instantly.
                    </p>

                    <div className="flex flex-wrap justify-center gap-8 mb-10">
                        <FeatureItem icon={<Code2 />} label="Easy Publish" />
                        <FeatureItem icon={<Globe />} label="Global Reach" />
                        <FeatureItem icon={<IndianRupee />} label="Earn 95% Revenue" />
                    </div>

                    <Link href="/developers" className="inline-flex items-center gap-3 px-8 py-3 rounded-full bg-white text-black font-bold hover:bg-zinc-200 transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                        <span>Start Building</span>
                        <ArrowUpRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}

function FeatureItem({ icon, label }: { icon: React.ReactNode, label: string }) {
    return (
        <div className="flex items-center gap-2 text-white">
            {React.cloneElement(icon as React.ReactElement<any>, { size: 16 })}
            <span className="text-sm font-medium">{label}</span>
        </div>
    )
}
