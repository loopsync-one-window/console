"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Play, Globe, ChevronDown, Check, Heart, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Dithering } from "@paper-design/shaders-react";

// Hero Carousel (Single Item) with Dithered Backdrop & Glass Card
// Hero Carousel (Today Tab Style)
function FeaturedCarousel({ apps }: { apps: AppMock[] }) {
    // Take first 5 apps for the "Today" grid
    const featuredApps = apps.slice(0, 5);
    const [ratings, setRatings] = useState<Record<string, number>>({});

    useEffect(() => {
        if (featuredApps.length === 0) return;

        const fetchRatings = async () => {
            const results = await Promise.all(
                featuredApps.map(app =>
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
    }, [apps]); // Depend on apps prop since featuredApps is derived

    const getRandomTag = (index: number) => {
        const tags = ["HAPPENING NOW", "NOW AVAILABLE", "MAJOR UPDATE", "NEW SEASON"];
        return tags[index % tags.length];
    };

    const getRandomSubtitle = (index: number) => {
        const subs = ["New Features", "Major Update", "Limited Time Event", "Editor's Choice"];
        return subs[index % subs.length];
    };

    const getGridClass = (index: number) => {
        switch (index) {
            case 0: return "md:col-span-2 h-[500px]";
            case 1: return "md:col-span-1 h-[500px]";
            case 2: return "md:col-span-1 h-[500px]";
            case 3: return "md:col-span-2 h-[500px]";
            case 4: return "md:col-span-3 h-[450px]";
            default: return "md:col-span-1 h-[500px]";
        }
    };

    if (apps.length === 0) {
        return (
            <section className="px-6 max-w-[1600px] mx-auto mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="w-full h-[500px] rounded-[2rem] bg-zinc-900 animate-pulse border border-white/5" />
                    <div className="w-full h-[500px] rounded-[2rem] bg-zinc-900 animate-pulse border border-white/5" />
                </div>
            </section>
        );
    }

    return (
        <section className="px-6 max-w-[1600px] mx-auto pt-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featuredApps.map((app, index) => {
                    const iconSrc = typeof app.icon === 'string' ? app.icon : (app.icon as any)?.['512'] || '';
                    const itemSrc = app.media?.featureBanner || app.media?.screenshots?.[0] || '/banner/banner.png';
                    const slug = app.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                    const color = app.branding?.activeColor || '#3b82f6';

                    // Use fetched real-time rating or fallback to list stats
                    const displayRating = ratings[app.id] !== undefined ? ratings[app.id] : (app.stats?.rating ?? 0);

                    return (
                        <div
                            key={app.id}
                            style={{ backgroundColor: color }}
                            className={cn(
                                "group relative w-full rounded-[1.75rem] overflow-hidden shadow-2xl transition-all hover:scale-[1.01] duration-300 border border-white/5",
                                getGridClass(index)
                            )}
                        >
                            {/* Background Image - Blurred Texture */}
                            <div className="absolute inset-0 opacity-100 mix-blend-overlay">
                                <img
                                    src={itemSrc}
                                    alt={app.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125 blur-xl scale-110 saturate-150"
                                />
                            </div>

                            {/* Gradient Overlay for Uniformity */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-40" />

                            {/* Card Content Wrapper */}
                            <div className="absolute inset-0 z-10 pointer-events-none">

                                {/* Top Tag - Absolute */}
                                <div className="absolute top-6 left-6 flex items-start">
                                    <span
                                        style={{ backgroundColor: color }}
                                        className="px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wider shadow-sm"
                                    >
                                        {getRandomTag(index)}
                                    </span>
                                </div>

                                {/* Editorial Text - Absolute above footer */}
                                <div className="absolute bottom-[5.5rem] left-6 right-6 p-2">
                                    <h4 className="text-[11px] font-bold text-white/60 uppercase tracking-widest mb-1.5">
                                        {getRandomSubtitle(index)}
                                    </h4>
                                    <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-2 drop-shadow-md line-clamp-2">
                                        {app.shortDescription || app.name}
                                    </h3>
                                    <p className="text-white/80 text-sm uppercase font-medium line-clamp-2">
                                        {app.name} &mdash; {app.category}
                                    </p>
                                </div>

                                {/* Colored Footer Bar - Pinned to Bottom */}
                                <div
                                    style={{ backgroundColor: color }}
                                    className="absolute bottom-0 left-0 right-0 p-4 flex items-center gap-4 pointer-events-auto border-t border-white/10"
                                >
                                    {/* Icon */}
                                    <div className="relative ml-3 w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-white/20 shadow-lg bg-black/20">
                                        <img
                                            src={iconSrc}
                                            alt={app.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Meta */}
                                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                                        <h5 className="text-white font-bold text-[15px] truncate leading-tight">
                                            {app.name}
                                        </h5>
                                        <p className="text-white/60 uppercase text-[13px] truncate">
                                            {app.category} &bull; {displayRating.toFixed(1)} ★
                                        </p>
                                    </div>

                                    {/* Action Button */}
                                    <Link href={`/store/${app.id}/${slug}`}>
                                        <button className="h-9 px-6 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-bold uppercase tracking-wider transition-colors border border-white/10">
                                            View
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

import { getStoreApps, AppMock, getAppReviews } from "@/lib/store-api";

import { AppListItem } from "./components/AppListItem";

export default function StorePage() {
    const [regionOpen, setRegionOpen] = useState(false);
    const [selectedRegion, setSelectedRegion] = useState("Worldwide");
    const [apps, setApps] = useState<AppMock[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApps = async () => {
            try {
                const data = await getStoreApps();
                setApps(data.items);
            } catch (e) {
                console.error("Failed to fetch store apps", e);
            } finally {
                setLoading(false);
            }
        };
        fetchApps();
    }, []);

    return (
        <div className="w-full min-h-full pb-20 pt-8" onClick={() => setRegionOpen(false)}>
            {/* Top Navigation / Filters */}
            <div className="px-6 max-w-[1600px] mx-auto flex items-center justify-between gap-8 mb-8">
                <div className="flex items-center gap-5">
                    <h1 className="text-5xl font-bold text-white tracking-tight">Today</h1>
                    <div className="px-3 py-1 rounded-full border border-white/10 bg-white/5 relative top-1">
                        <span className="text-[11px] font-semibold text-white/60 uppercase relative bottom-0.5">
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-8">
                    {/* Text Links */}
                    <nav className="flex items-center gap-6">
                        <Link href="/changelog" className="flex items-center gap-1 text-sm font-medium text-white hover:underline transition-colors">
                            Changelogs
                            <ArrowUpRight className="w-3.5 h-3.5 text-white" />
                        </Link>
                        <Link href="/developers" className="text-sm font-medium text-white hover:underline transition-colors">
                            Developers
                        </Link>
                        <Link href="/beta" className="text-sm font-medium text-white hover:underline transition-colors">
                            Beta
                        </Link>
                    </nav>

                    <div className="h-4 w-[1px] bg-transparent" />

                    {/* Region Dropdown */}
                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => setRegionOpen(!regionOpen)}
                            className={`flex items-center gap-2 pl-3 pr-4 py-2 rounded-full border text-sm font-medium transition-all group ${regionOpen ? 'bg-transparent border-white/20 text-white' : 'bg-transparent border-transparent text-zinc-300 hover:text-white hover:bg-white/10'}`}
                        >
                            <Globe className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white transition-colors" />
                            <span>{selectedRegion}</span>
                            <ChevronDown className={`w-3 h-3 text-zinc-500 ml-1 transition-transform ${regionOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {regionOpen && (
                            <div className="absolute right-0 top-full mt-2 w-48 bg-[#111] border border-white/10 rounded-xl shadow-2xl p-1.5 z-30 overflow-hidden flex flex-col gap-0.5">
                                {["Worldwide", "India", "United States", "Europe", "Asia"].map((region) => (
                                    <button
                                        key={region}
                                        onClick={() => {
                                            setSelectedRegion(region);
                                            setRegionOpen(false);
                                        }}
                                        className="flex items-center justify-between px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-white/10 transition-colors w-full text-left"
                                    >
                                        {region}
                                        {selectedRegion === region && <Check className="w-3.5 h-3.5 text-white" />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 1. FEATURED CAROUSEL */}
            <FeaturedCarousel apps={apps} />

            {/* 2. ESSENTIAL APPS LIST */}
            <section className="px-8 max-w-[1600px] mx-auto mt-16">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-semibold text-white font-geom tracking-tight">Essential Apps</h3>
                    <button className="text-white/50 text-sm font-medium hover:text-white transition-colors">See All</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        // Skeletons
                        [...Array(6)].map((_, i) => (
                            <div key={i} className="flex items-center gap-5 p-5 rounded-[1.5rem] bg-black border border-white/5 animate-pulse">
                                <div className="w-16 h-16 rounded-2xl bg-white/5" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-white/5 rounded w-3/4" />
                                    <div className="h-3 bg-white/5 rounded w-1/2" />
                                </div>
                            </div>
                        ))
                    ) : apps.length === 0 ? (
                        <div className="col-span-3 text-center py-20 text-neutral-500">
                            No apps available right now.
                        </div>
                    ) : (
                        apps.map((app) => (
                            <AppListItem
                                key={app.id}
                                id={app.id}
                                icon={app.icon}
                                title={app.name}
                                subtitle={app.shortDescription || "No description"}
                                category={app.category || "Utility"}
                                color={app.branding?.activeColor}
                            />
                        ))
                    )}
                </div>
            </section>
        </div>
    );
}

