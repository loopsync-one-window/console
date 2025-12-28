"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function NotesSection() {
    return (
        <section className="py-32 px-6 text-center bg-transparent relative w-full">
            <div className="max-w-4xl mx-auto flex flex-col items-center">

                {/* Label */}
                <div className="mb-6">
                    <span className="text-sm font-bold tracking-[0.2em] text-zinc-500 uppercase">
                        LoopSync Notes
                    </span>
                </div>

                {/* Headline */}
                <h2 className="text-5xl md:text-4xl font-bold tracking-tight text-white mb-6 leading-tight font-geom">
                    A space for<br className="hidden md:block" />
                    uninterrupted thinking.
                </h2>

                {/* Subheadline */}
                <p className="text-[14px] text-zinc-400 max-w-2xl mb-12 leading-relaxed">
                    A place where thoughts don't get left behind, no matter where you are.<br className="hidden md:block" />
                    Collect ideas while out touching grass.
                </p>

                {/* Link/Button */}
                <Link href="/notes" className="group inline-flex items-center gap-2 text-zinc-300 hover:text-white font-medium transition-colors text-lg">
                    <span>Explore LoopSync Notes</span>
                    <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                        <ArrowRight className="w-3 h-3 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                    </div>
                </Link>

            </div>
        </section >
    );
}
