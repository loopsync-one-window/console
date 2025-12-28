"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Play, Globe, ChevronDown, Check } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Mock Data for "Featured Carousel"
const FEATURED_APPS = [
    {
        id: 1,
        title: "Rage Platformer",
        description: "Experience the next generation of cloud gaming with zero latency. Jump into the action instantly.",
        image: "/banner/banner.png",
        logo: "/apps/daimond.png", // Using as placeholder logo
        category: "New Release",
        color: "text-blue-400",
        bgGradient: "from-blue-500/20 to-purple-500/20"
    },
    {
        id: 2,
        title: "Atlas",
        description: "Your intelligent screen analysis companion. Understand your workflow like never before.",
        image: "/apps/atlas.png",
        logo: "/apps/atlas.png",
        category: "Productivity",
        color: "text-emerald-400",
        bgGradient: "from-emerald-500/20 to-teal-500/20"
    },
    {
        id: 3,
        title: "Ceres Assist",
        description: "Navigate the web with an autonomous agent designed to save you hours every day.",
        image: "/apps/ceres.png",
        logo: "/apps/ceres.png",
        category: "Utility",
        color: "text-orange-400",
        bgGradient: "from-orange-500/20 to-red-500/20"
    }
];

function FeaturedCarousel() {
    const [current, setCurrent] = useState(0)

    const next = () => setCurrent((c) => (c + 1) % FEATURED_APPS.length)
    const prev = () => setCurrent((c) => (c - 1 + FEATURED_APPS.length) % FEATURED_APPS.length)

    useEffect(() => {
        const t = setInterval(next, 6000)
        return () => clearInterval(t)
    }, [])

    return (
        <section className="px-6 max-w-[1600px] mx-auto relative">
            <div className="relative aspect-[21/9] rounded-[28px] overflow-hidden bg-black border border-white/5 shadow-[0_40px_120px_rgba(0,0,0,0.6)]">

                {/* Slides */}
                {FEATURED_APPS.map((app, i) => (
                    <div
                        key={app.id}
                        className={cn(
                            "absolute inset-0 transition-opacity duration-1000 ease-[cubic-bezier(.4,0,.2,1)]",
                            i === current ? "opacity-100 z-10" : "opacity-0 z-0"
                        )}
                    >
                        {/* Image */}
                        <img
                            src={app.image}
                            alt={app.title}
                            className="absolute inset-0 w-full h-full object-cover"
                        />

                        {/* Dark edge fade (Apple style) */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent" />



                        {/* Content glass */}
                        <div className="absolute bottom-10 left-10 max-w-xl backdrop-blur-sm bg-black/20 border border-white/10 rounded-3xl p-8">
                            {/* Logo */}
                            {app.logo && (
                                <img src={app.logo} alt={`${app.title} logo`} className="w-16 h-16 object-contain mb-6 drop-shadow-lg rounded-xl" />
                            )}

                            <span className="text-xs uppercase tracking-widest text-white/60">
                                {app.category}
                            </span>

                            <h2 className="mt-3 text-4xl md:text-5xl font-semibold text-white leading-tight">
                                {app.title}
                            </h2>

                            <p className="mt-4 text-white/70 text-lg font-light">
                                {app.description}
                            </p>

                            <div className="mt-6 flex items-center gap-4">
                                <Link href={`/store/${app.title.toLowerCase().replace(/ /g, '-')}`}>
                                    <button className="px-6 py-3 rounded-full bg-white text-black text-sm font-medium hover:bg-zinc-200 transition">
                                        View App
                                    </button>
                                </Link>

                                <button className="w-11 h-11 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition">
                                    <Play className="w-4 h-4 fill-current" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Arrows */}
                <button
                    onClick={prev}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur border border-white/10 text-white opacity-0 hover:opacity-100 transition"
                >
                    <ChevronLeft className="w-5 h-5 mx-auto" />
                </button>

                <button
                    onClick={next}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur border border-white/10 text-white opacity-0 hover:opacity-100 transition"
                >
                    <ChevronRight className="w-5 h-5 mx-auto" />
                </button>

                {/* Indicators */}
                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
                    {FEATURED_APPS.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrent(i)}
                            className={cn(
                                "w-2 h-2 rounded-full transition",
                                i === current ? "bg-white" : "bg-white/30 hover:bg-white/50"
                            )}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default function StorePage() {
    const [regionOpen, setRegionOpen] = useState(false);
    const [selectedRegion, setSelectedRegion] = useState("Worldwide");

    return (
        <div className="w-full min-h-full pb-20 pt-8" onClick={() => setRegionOpen(false)}>
            {/* Top Navigation / Filters */}
            <div className="px-6 max-w-[1600px] mx-auto flex items-center justify-between gap-8 mb-8">
                <h1 className="text-3xl font-medium text-white font-geom tracking-tight">Discover</h1>

                <div className="flex items-center gap-8">
                    {/* Text Links */}
                    <nav className="flex items-center gap-6">
                        {["Changelogs", "Developers", "Beta"].map((item) => (
                            <button
                                key={item}
                                className="text-sm font-medium text-white hover:text-white/70 transition-colors"
                            >
                                {item}
                            </button>
                        ))}
                    </nav>

                    <div className="h-4 w-[1px] bg-white/10" />

                    {/* Region Dropdown */}
                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => setRegionOpen(!regionOpen)}
                            className={`flex items-center gap-2 pl-3 pr-4 py-2 rounded-full border text-sm font-medium transition-all group ${regionOpen ? 'bg-white/10 border-white/20 text-white' : 'bg-[#161616] border-white/10 text-zinc-300 hover:text-white hover:bg-white/10'}`}
                        >
                            <Globe className="w-3.5 h-3.5 text-zinc-500 group-hover:text-blue-400 transition-colors" />
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
            <FeaturedCarousel />

            {/* 2. ESSENTIAL APPS LIST */}
            <section className="px-8 max-w-[1600px] mx-auto mt-16">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-semibold text-white font-geom tracking-tight">Essential Apps</h3>
                    <button className="text-white/50 text-sm font-medium hover:text-white transition-colors">See All</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AppListItem
                        icon="/apps/atlas.png"
                        title="Atlas"
                        subtitle="Screen Analysis AI"
                        category="Productivity"
                    />
                    <AppListItem
                        icon="/apps/ceres.png"
                        title="Ceres Assist"
                        subtitle="Autonomous Browser Agent"
                        category="Utils"
                    />
                    <AppListItem
                        color="bg-purple-600"
                        title="CinemaOS"
                        subtitle="Pro Video Editing"
                        category="Creativity"
                    />
                    <AppListItem
                        color="bg-orange-500"
                        title="WriteOS+"
                        subtitle="Distraction-free Writing"
                        category="Productivity"
                    />
                    <AppListItem
                        color="bg-green-500"
                        title="PixelOS"
                        subtitle="Photo Manipulation"
                        category="Photography"
                    />
                    <AppListItem
                        color="bg-blue-800"
                        title="CodeStream"
                        subtitle="Collaborative IDE"
                        category="Developer"
                    />
                </div>
            </section>
        </div>
    );
}

function AppListItem({ icon, color, title, subtitle, category }: { icon?: string; color?: string; title: string; subtitle: string; category: string }) {
    return (
        <Link href={`/store/${title.toLowerCase().replace(/ /g, '-')}`} className="block">
            <div className="flex items-center gap-5 p-5 rounded-[1.5rem] bg-black border border-white/5 hover:bg-white/5 hover:border-white/10 transition-all duration-300 cursor-pointer group hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/50">
                <div className={cn(
                    "w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 shadow-lg ring-1 ring-white/5",
                    icon ? 'bg-black' : color || 'bg-zinc-800'
                )}>
                    {icon ? (
                        <img src={icon} alt={title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/20">
                            <div className="w-8 h-8 bg-white/20 rounded-md"></div>
                        </div>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="text-white font-bold text-lg truncate group-hover:text-white transition-colors">{title}</h4>
                    <p className="text-zinc-500 text-sm truncate font-medium">{subtitle}</p>
                    <span className="text-[11px] font-bold tracking-wider text-zinc-600 mt-1 inline-block uppercase bg-white/5 px-2 py-0.5 rounded-md text-zinc-500">{category}</span>
                </div>
                <div className="flex-shrink-0">
                    <button className="bg-white/5 text-white font-bold text-xs uppercase px-5 py-2 rounded-full hover:bg-white hover:text-black transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                        Get
                    </button>
                </div>
            </div>
        </Link>
    );
}
