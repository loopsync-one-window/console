"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Play, Globe, ChevronDown, Check, Heart } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Dithering } from "@paper-design/shaders-react";

// Hero Carousel (Single Item) with Dithered Backdrop & Glass Card
function FeaturedCarousel({ apps }: { apps: AppMock[] }) {
    const [current, setCurrent] = useState(0);
    const count = apps.length;

    const next = () => {
        if (count > 0) setCurrent((c) => (c + 1) % count);
    };
    const prev = () => {
        if (count > 0) setCurrent((c) => (c - 1 + count) % count);
    };

    useEffect(() => {
        if (count === 0) return;
        const t = setInterval(next, 8000);
        return () => clearInterval(t);
    }, [count]);

    if (count === 0) {
        return (
            <section className="px-6 max-w-[1400px] mx-auto mt-6">
                <div className="w-full aspect-[21/9] rounded-[2rem] bg-black animate-pulse border border-white/5" />
            </section>
        );
    }

    const app = apps[current];
    const iconSrc = typeof app.icon === 'string' ? app.icon : (app.icon as any)?.['512'] || '';
    const slug = app.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // Determine color for dithering based on app branding or default to blue
    const ditherColor = (app.branding?.activeColor && app.branding.activeColor.startsWith('#'))
        ? app.branding.activeColor
        : '#3b82f6';

    return (
        <section className="relative w-full py-12 px-6 overflow-hidden">
            {/* BACKGROUND: Dithering + Blur */}
            <div className="absolute inset-0 z-0 transition-colors duration-1000">
                {/* Dithering Component */}
                <div className="absolute inset-0 opacity-100">
                    <Dithering
                        key={app.id} /* Re-render dither on app change to animate color if possible, or just let uniform update */
                        style={{ height: "100%", width: "100%" }}
                        colorBack="#000000ff"
                        colorFront={ditherColor}
                        shape={"wave" as any}
                        type="8x8"
                        pxSize={1}
                        offsetX={0}
                        offsetY={0}
                        scale={2}
                        rotation={0}
                    />
                </div>

                {/* Heavy Blur Overlay */}
                <div className="absolute inset-0 backdrop-blur-sm bg-gradient-to-t from-black via-transparent to-transparent" />
                <div className="absolute inset-0 bg-black/10" />
            </div>

            {/* FOREGROUND: Single "Hero" Card */}
            <div className="relative z-10 max-w-[95%] mx-auto group/carousel">
                <div className="relative w-full aspect-[16/10] md:aspect-[21/9] rounded-[2.5rem] overflow-hidden bg-black">

                    {/* Card Content (Background Image + Overlays) */}
                    <div className="absolute inset-0">
                        {apps.map((item, index) => {
                            const itemSrc = item.media?.featureBanner || item.media?.screenshots?.[0] || '/banner/banner.png';
                            const isActive = index === current;

                            return (
                                <div
                                    key={item.id}
                                    className={cn(
                                        "absolute inset-0 transition-opacity duration-1000",
                                        isActive ? "opacity-100 z-10" : "opacity-0 z-0"
                                    )}
                                >
                                    {/* Blurred Background to fill space */}
                                    <div className="absolute inset-0">
                                        <img
                                            src={itemSrc}
                                            alt=""
                                            className="w-full h-full object-cover rounded-[2.5rem] blur-2xl opacity-50 scale-105"
                                        />
                                    </div>

                                    {/* Main Fitted Image */}
                                    <div className="absolute inset-0 flex rounded-[2.5rem] items-center justify-end p-4 z-10">
                                        <img
                                            src={itemSrc}
                                            alt={item.name}
                                            className="max-w-full max-h-full rounded-[2.5rem] shadow-2xl"
                                        />
                                    </div>


                                    {/* Active Content Layer - Now with Blur Card */}
                                    <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10 z-20">
                                        <div className="w-full md:w-auto md:max-w-[500px]">
                                            {/* Glassmorphism Card Wrapper */}
                                            <div className="bg-black/10 backdrop-blur-sm rounded-[2.5rem] p-8 border border-white/5 shadow-2xl flex flex-col items-start gap-6">

                                                {/* Thumbnail - Card Context */}
                                                <div className="hidden md:block w-36 aspect-square rounded-3xl overflow-hidden shadow-2xl border border-white/5 relative shrink-0 bg-black/50">
                                                    <img
                                                        src={typeof item.icon === 'string' ? item.icon : (item.icon as any)?.['512'] || ''}
                                                        alt={item.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>

                                                {/* Info */}
                                                <div className="flex-1 space-y-4 pb-1">
                                                    <h1 className="text-3xl md:text-3xl font-black text-white tracking-tight drop-shadow-xl line-clamp-1">
                                                        {item.name}
                                                    </h1>

                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <span className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/10 text-white/90 font-medium text-xs uppercase tracking-wider backdrop-blur-md">
                                                            {item.category}
                                                        </span>
                                                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/20 border border-white/5 backdrop-blur-md">
                                                            <div className="flex text-amber-400">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <svg key={i} className={`w-3.5 h-3.5 ${i < Math.floor(item.stats?.rating || 4.8) ? 'fill-current' : 'text-white/20 fill-white/20'}`} viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                                                                ))}
                                                            </div>
                                                            <span className="text-white/70 text-xs font-bold">{(item.stats?.rating || 4.8).toFixed(1)}</span>
                                                        </div>
                                                    </div>

                                                    <div className="pt-2 flex gap-3">
                                                        <Link href={`/store/${item.id}/${slug}`}>
                                                            <button className="h-11 px-8 rounded-full bg-white text-black font-bold text-sm tracking-wide hover:bg-zinc-200 transition-colors shadow-lg active:scale-95">
                                                                View Details
                                                            </button>
                                                        </Link>
                                                        <button className="h-11 w-11 flex items-center justify-center rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors border border-white/10">
                                                            <Heart className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Navigation Arrows */}
                    <div className="absolute inset-y-0 right-6 z-40 flex flex-col justify-center gap-3">
                        <button
                            onClick={prev}
                            className="w-12 h-12 rounded-full border border-white/10 bg-black/30 backdrop-blur-md flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all hover:scale-105 active:scale-95"
                        >
                            <ChevronLeft className="w-6 h-6 -ml-0.5" />
                        </button>
                        <button
                            onClick={next}
                            className="w-12 h-12 rounded-full border border-white/10 bg-black/30 backdrop-blur-md flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all hover:scale-105 active:scale-95"
                        >
                            <ChevronRight className="w-6 h-6 ml-0.5" />
                        </button>
                    </div>
                </div>

                {/* Bottom Indicators */}
                <div className="flex justify-center gap-2 mt-6">
                    {apps.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrent(i)}
                            className={cn(
                                "h-1.5 rounded-full transition-all duration-300",
                                i === current ? "bg-white w-8 shadow-[0_0_10px_rgba(255,255,255,0.5)]" : "bg-white/20 w-1.5 hover:bg-white/40"
                            )}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

import { getStoreApps, AppMock } from "@/lib/store-api";

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
                <h1 className="text-3xl font-medium text-white font-geom tracking-tight">Discover</h1>

                <div className="flex items-center gap-8">
                    {/* Text Links */}
                    {/* Text Links */}
                    <nav className="flex items-center gap-6">
                        <Link href="/changelog" className="text-sm font-medium text-white hover:text-white/70 transition-colors">
                            Changelogs
                        </Link>
                        <Link href="/developers" className="text-sm font-medium text-white hover:text-white/70 transition-colors">
                            Developers
                        </Link>
                        <Link href="/beta" className="text-sm font-medium text-white hover:text-white/70 transition-colors">
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

