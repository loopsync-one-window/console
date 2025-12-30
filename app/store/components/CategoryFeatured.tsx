"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { AppMock } from "@/lib/store-api";

interface CategoryFeaturedProps {
    apps: AppMock[];
}

export function CategoryFeatured({ apps }: CategoryFeaturedProps) {
    const [current, setCurrent] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    // Auto-rotate
    useEffect(() => {
        if (apps.length <= 1 || isHovered) return;
        const interval = setInterval(() => {
            setCurrent(prev => (prev + 1) % apps.length);
        }, 6000);
        return () => clearInterval(interval);
    }, [apps.length, isHovered]);

    if (!apps || apps.length === 0) return null;

    const next = () => setCurrent((c) => (c + 1) % apps.length);
    const prev = () => setCurrent((c) => (c - 1 + apps.length) % apps.length);

    return (
        <div
            className="group relative w-full aspect-[2/1] md:aspect-[2.4/1] lg:h-[450px] lg:aspect-auto rounded-[2rem] overflow-hidden mb-12 border border-white/5 shadow-2xl bg-[#0a0a0a]"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Slides */}
            {apps.map((app, index) => {
                const isActive = index === current;
                // Use feature banner, fallback to screenshot, fallback to generic
                const banner = app.media?.featureBanner || app.media?.screenshots?.[0] || '/banner/banner.png';
                const slug = app.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

                return (
                    <div
                        key={app.id}
                        className={cn(
                            "absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]",
                            isActive ? "opacity-100 z-10 scale-100" : "opacity-0 z-0 scale-105"
                        )}
                    >
                        {/* Background Image */}
                        <img
                            src={banner}
                            alt={app.name}
                            className="absolute inset-0 w-full h-full object-cover"
                        />

                        {/* Gradient Overlays for Readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent opacity-70" />

                        {/* Content */}
                        <div className="absolute inset-0 p-8 md:p-12 lg:p-16 flex flex-col justify-end items-start">
                            <div className={cn(
                                "space-y-4 max-w-2xl transition-all duration-700 delay-100 transform",
                                isActive ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                            )}>
                                <div className="flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-700">
                                    <span className="text-blue-400 text-xs font-bold uppercase tracking-widest leading-none mb-1">{app.category}</span>
                                    <span className="w-1 h-1 rounded-full bg-zinc-600 mb-1" />
                                    <span className="text-zinc-400 text-xs font-bold uppercase tracking-widest leading-none mb-1">Featured</span>
                                </div>

                                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[0.9] drop-shadow-2xl">
                                    {app.name}
                                </h2>

                                <p className="text-lg md:text-xl text-zinc-200 font-medium line-clamp-2 leading-relaxed drop-shadow-lg max-w-lg">
                                    {app.shortDescription}
                                </p>

                                <div className="pt-6 flex items-center gap-4">
                                    <Link href={`/store/${app.id}/${slug}`}>
                                        <button className="h-12 px-10 rounded-full bg-white text-black font-bold text-sm tracking-wide hover:bg-zinc-200 transition-all flex items-center gap-2 transform active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                                            View Details
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* Navigation Arrows (Show on Hover) */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-between px-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button onClick={prev} className="pointer-events-auto w-12 h-12 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-all hover:scale-105 active:scale-95">
                    <ChevronLeft className="w-6 h-6 -ml-0.5" />
                </button>
                <button onClick={next} className="pointer-events-auto w-12 h-12 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-all hover:scale-105 active:scale-95">
                    <ChevronRight className="w-6 h-6 ml-0.5" />
                </button>
            </div>

            {/* Pagination Dots */}
            <div className="absolute bottom-8 right-10 z-20 flex items-center gap-2.5">
                {apps.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrent(i)}
                        className={cn(
                            "h-2 rounded-full transition-all duration-300 backdrop-blur-sm border border-transparent hover:border-white/20",
                            i === current ? "w-8 bg-white" : "w-2 bg-white/20 hover:bg-white/40"
                        )}
                    />
                ))}
            </div>
        </div>
    );
}
