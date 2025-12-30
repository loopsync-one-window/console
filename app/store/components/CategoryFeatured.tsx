
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { AppMock, getAppReviews } from "@/lib/store-api";

interface CategoryFeaturedProps {
    apps: AppMock[];
}

export function CategoryFeatured({ apps }: CategoryFeaturedProps) {
    const [current, setCurrent] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [ratings, setRatings] = useState<Record<string, number>>({});

    // Fetch ratings
    useEffect(() => {
        if (!apps || apps.length === 0) return;

        const fetchRatings = async () => {
            const results = await Promise.all(
                apps.map(app =>
                    getAppReviews(app.id)
                        .then((data: any) => ({ id: app.id, rating: data.stats.averageRating }))
                        .catch(() => ({ id: app.id, rating: app.stats?.rating ?? 0 }))
                )
            );

            const newRatings: Record<string, number> = {};
            results.forEach((r: { id: string, rating: number }) => newRatings[r.id] = r.rating);
            setRatings(newRatings);
        };

        fetchRatings();
    }, [apps]);

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
                const displayRating = ratings[app.id] !== undefined ? ratings[app.id] : (app.stats?.rating ?? 0);

                return (
                    <div
                        key={app.id}
                        style={{ backgroundColor: app.branding?.activeColor || '#0a0a0a' }}
                        className={cn(
                            "absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]",
                            isActive ? "opacity-100 z-10" : "opacity-0 z-0"
                        )}
                    >
                        {/* Background Image - Blurred Texture */}
                        <div className="absolute inset-0 opacity-60 mix-blend-overlay">
                            <img
                                src={banner}
                                alt={app.name}
                                className="w-full h-full object-cover blur-xl scale-110 saturate-150"
                            />
                        </div>

                        {/* Gradient Overlays for Readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-40" />

                        {/* Content */}
                        <div className="absolute inset-0 z-20 pointer-events-none">
                            {/* Main Text Floating */}
                            <div className={cn(
                                "absolute bottom-32 left-8 md:left-12 max-w-3xl transition-all duration-700 delay-100 transform",
                                isActive ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                            )}>
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="p-1.5 rounded-lg bg-white/10 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold uppercase tracking-wider">
                                        Featured
                                    </span>
                                </div>
                                <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight mb-2 drop-shadow-lg">
                                    {app.name}
                                </h2>
                                <p className="text-white/80 text-lg md:text-xl font-medium line-clamp-2 max-w-2xl drop-shadow-md">
                                    {app.shortDescription}
                                </p>
                            </div>

                            {/* Pinned Footer */}
                            <div
                                style={{ backgroundColor: app.branding?.activeColor || '#0a0a0a' }}
                                className="absolute bottom-0 left-0 right-0 p-6 flex items-center gap-5 pointer-events-auto border-t border-white/10"
                            >
                                {/* Icon */}
                                <div className="relative ml-5 w-14 h-14 rounded-2xl overflow-hidden shrink-0 border border-white/20 shadow-lg bg-black/20">
                                    <img
                                        src={typeof app.icon === 'string' ? app.icon : (app.icon as any)?.['512'] || ''}
                                        alt={app.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Meta */}
                                <div className="flex-1 min-w-0 flex flex-col justify-center">
                                    <h5 className="text-white font-bold text-lg truncate leading-tight">
                                        {app.name}
                                    </h5>
                                    <p className="text-white/60 uppercase text-xs font-semibold tracking-wide truncate">
                                        {app.category} &bull; {displayRating.toFixed(1)} ★
                                    </p>
                                </div>

                                {/* Action Button */}
                                <Link href={`/store/${app.id}/${slug}`}>
                                    <button className="h-11 px-8 mr-20 rounded-full bg-white/20 hover:bg-white/30 text-white text-sm font-bold uppercase tracking-wider transition-colors border border-white/10 shadow-lg">
                                        View Details
                                    </button>
                                </Link >
                            </div >
                        </div >
                    </div >
                );
            })}

            {/* Navigation Arrows (Show on Hover) */}
            <div className="absolute top-1/2 -translate-y-1/2 left-4 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-auto">
                <button onClick={prev} className="w-12 h-12 rounded-full bg-black/20 backdrop-blur-xl border border-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-all hover:scale-105 active:scale-95">
                    <ChevronLeft className="w-6 h-6 -ml-0.5" />
                </button>
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 right-4 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-auto">
                <button onClick={next} className="w-12 h-12 rounded-full bg-black/20 backdrop-blur-xl border border-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-all hover:scale-105 active:scale-95">
                    <ChevronRight className="w-6 h-6 ml-0.5" />
                </button>
            </div>

            {/* Pagination Dots */}
            <div className="absolute bottom-32 right-12 z-20 flex items-center gap-2.5">
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
        </div >
    );
}
