"use client";

import { useState } from "react";
import {
    ChevronLeft,
    ChevronRight,
    Share,
    MoreHorizontal,
    Star,
    Award,
    Layers,
    User,
    Play,
    Globe2,
    Globe,
    PenLine,
    X,
    Grid3X3,
    CheckCircle2,
} from "lucide-react";
import { PublisherProfileOverlay } from "../components/PublisherProfileOverlay";
import { Dithering } from "@paper-design/shaders-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function AppDetailsPage() {
    const params = useParams();
    const [isExpanded, setIsExpanded] = useState(false);
    const [isWritingReview, setIsWritingReview] = useState(false);
    const [userRating, setUserRating] = useState(0);
    const [showPublisherProfile, setShowPublisherProfile] = useState(false);

    return (
        <div className="min-h-screen bg-black text-white">
            {/* PUBLISHER PROFILE OVERLAY */}
            <PublisherProfileOverlay
                isOpen={showPublisherProfile}
                onClose={() => setShowPublisherProfile(false)}
                apps={PUBLISHER_APPS}
            />

            {/* HERO */}
            <section className="relative px-6 md:px-10 pt-10 pb-16">
                {/* Gradient Mesh Background */}
                {/* Dithering Background with Blur Overlay */}
                <div className="absolute inset-0 z-0 opacity-100">
                    <Dithering
                        style={{ height: "100%", width: "100%" }}
                        colorBack="#000000"
                        colorFront="#42d09d"
                        shape={"wave" as any}
                        type="4x4"
                        pxSize={2}
                        offsetX={0}
                        offsetY={0}
                        scale={0.8}
                        rotation={0}
                        speed={1.5}
                    />
                </div>
                <div className="absolute inset-0 z-0 backdrop-blur-3xl bg-transparent pointer-events-none" />

                {/* Top Nav */}
                <div className="relative z-10 max-w-6xl mx-auto flex items-center justify-between mb-10">
                    <Link
                        href="/store"
                        className="flex items-center gap-1 text-sm text-white hover:text-white transition"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Store
                    </Link>

                    <div className="flex gap-2">
                        <IconButton icon={<Share />} />
                        <IconButton icon={<MoreHorizontal />} />
                    </div>
                </div>

                {/* App Header */}
                <div className="relative z-10 max-w-6xl mx-auto flex flex-col md:flex-row gap-10 items-start">
                    {/* Icon */}
                    <div className="w-28 h-28 md:w-36 md:h-36 rounded-[28px] bg-zinc-900 border border-white/10 overflow-hidden shadow-xl">
                        <img
                            src="/apps/daimond.png"
                            alt="App Icon"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                        <h1 className="text-4xl md:text-5xl text-white font-semibold tracking-tight mb-2">
                            Rage Platformer
                        </h1>
                        <div className="flex items-center gap-3 text-white text-base mb-6 font-medium">
                            <p>Action · Indie · Strategy</p>
                            <span className="text-white">|</span>
                            <div className="flex items-center gap-1.5 text-white">
                                <span
                                    onClick={() => setShowPublisherProfile(true)}
                                    className="hover:underline hover:underline-offset-2 cursor-pointer transition-all hover:text-white/80"
                                >
                                    LoopSync Entertainment
                                </span>
                                <div className="relative group/badge cursor-help">
                                    <img src="/verified/badge.svg" alt="Verified" className="w-3.5 h-3.5" />
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-transparent backdrop-blur-sm border border-white/10 rounded text-[14px] font-medium text-white whitespace-nowrap opacity-0 group-hover/badge:opacity-100 transition-opacity pointer-events-none md:block hidden">
                                        Verified Publisher
                                    </div>
                                </div>
                            </div>
                        </div>

                        <p className="text-white font-medium text-lg leading-snug mb-6 max-w-md">
                            Master the art of precision platforming in a world of neon chaos.
                        </p>

                        <div className="flex items-center gap-4">
                            <button className="bg-white hover:bg-white/80 text-black hover:text-black transition px-8 py-3 rounded-full text-sm font-semibold active:scale-[0.88]">
                                Get
                            </button>
                            <span className="text-xs font-medium text-white">
                                In-App Purchases
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* STATS */}
            <section className="border-t border-white/5">
                <div className="max-w-6xl mx-auto px-6 md:px-10 py-10 grid grid-cols-3 md:grid-cols-6 gap-y-8 text-center">
                    <Stat title="Rating" value="4.8" below="12K Ratings">
                        <Star className="w-4 h-4 fill-white" />
                    </Stat>

                    <Stat title="Awards" value="" below="Editors' Choice">
                        <Award className="w-6 h-6 text-zinc-300" />
                    </Stat>

                    <Stat title="Age" value="12+" below="Years Old" />
                    <Stat title="Category" below="Action">
                        <Layers className="w-6 h-6 text-zinc-300" />
                    </Stat>

                    <Stat title="Developer" below="LoopSync Inc">
                        <User className="w-6 h-6 text-zinc-300" />
                    </Stat>

                    <Stat title="Language" below="EN +24 More">
                        <Globe className="w-6 h-6 text-zinc-300" />
                    </Stat>
                </div>
            </section>

            {/* PREVIEW */}
            <section className="max-w-6xl mx-auto px-6 md:px-10 py-14">
                <h2 className="text-lg font-semibold mb-6">Preview</h2>
                <div className="flex gap-6 overflow-x-auto no-scrollbar snap-x">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="relative snap-center flex-shrink-0 w-[280px] md:w-[560px] aspect-video rounded-3xl bg-zinc-900 border border-white/5 overflow-hidden group"
                        >
                            <img
                                src="/banner/banner.png"
                                alt={`Preview ${i}`}
                                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition"
                            />
                            {i === 1 && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-12 h-12 rounded-full bg-black/60 backdrop-blur border border-white/20 flex items-center justify-center">
                                        <Play className="w-5 h-5 fill-white" />
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* DESCRIPTION */}
            <section className="border-t border-white/5">
                <div className="max-w-6xl mx-auto px-6 md:px-10 py-14 grid md:grid-cols-3 gap-12">
                    <div className="md:col-span-2">
                        <div
                            className={`relative overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[1000px]' : 'max-h-[140px]'}`}
                        >
                            <div className="text-zinc-300 leading-relaxed text-base">
                                Experience the ultimate precision-based platformer built for speed
                                and mastery. Rage Platformer pushes reflexes to the limit with
                                handcrafted levels, brutal traps, and global leaderboards.
                                <br />
                                <br />
                                Jump in instantly — no installs, no updates, just gameplay. Discover hidden paths, unlock secret characters, and compete in weekly challenges to earn exclusive rewards. Whether you are a casual player or a hardcore speedrunner, Rage Platformer offers endless hours of adrenaline-pumping fun.
                                <br />
                                <br />
                                Join a community of millions of players and start your adventure today. The world of neon chaos awaits your arrival.
                            </div>

                            {!isExpanded && (
                                <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-black to-transparent pointer-events-none" />
                            )}
                        </div>

                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="mt-4 text-blue-400 font-medium hover:underline focus:outline-none"
                        >
                            {isExpanded ? "Read less" : "Read more"}
                        </button>
                    </div>

                    <div className="rounded-3xl bg-[#0B0B0B] border border-white/8 px-7 py-6 space-y-6">

                        {/* Publisher */}
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <h3
                                    onClick={() => setShowPublisherProfile(true)}
                                    className="text-base font-bold text-white hover:text-blue-400 cursor-pointer transition-colors"
                                >
                                    LoopSync Entertainment
                                </h3>
                                <div className="relative group/badge cursor-help">
                                    <img src="/verified/badge.svg" alt="Verified" className="w-4 h-4" />
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-zinc-800 border border-white/10 rounded text-[10px] font-medium text-white whitespace-nowrap opacity-0 group-hover/badge:opacity-100 transition-opacity pointer-events-none">
                                        Verified
                                    </div>
                                </div>
                            </div>

                            <p className="text-sm text-zinc-400 leading-relaxed max-w-md">
                                Designing refined cloud experiences with performance, polish, and long-term reliability at the core.
                            </p>
                        </div>

                        {/* Soft Divider */}
                        <div className="h-px bg-white/10" />

                        {/* Info Stack */}
                        <div className="space-y-4">

                            <div>
                                <p className="text-[11px] uppercase tracking-wider text-zinc-500 mb-0.5">
                                    Download Size
                                </p>
                                <p className="text-sm font-medium text-white">
                                    1.2 GB
                                </p>
                            </div>

                            <div>
                                <p className="text-[11px] uppercase tracking-wider text-zinc-500 mb-0.5">
                                    Device Compatibility
                                </p>
                                <p className="text-sm font-medium text-emerald-400">
                                    Optimized for this device
                                </p>
                            </div>

                            <div>
                                <p className="text-[11px] uppercase tracking-wider text-zinc-500 mb-0.5">
                                    Experience
                                </p>
                                <p className="text-sm font-medium text-white">
                                    Console-grade performance
                                </p>
                            </div>

                        </div>
                    </div>

                </div>
            </section>

            {/* REVIEWS */}
            <section className="border-t border-white/5">
                <div className="max-w-6xl mx-auto px-6 md:px-10 py-14">
                    <div className="flex items-center justify-between mb-10">
                        <h2 className="text-2xl font-bold tracking-tight">Ratings & Reviews</h2>
                        <button
                            onClick={() => setIsWritingReview(!isWritingReview)}
                            className="text-blue-400 font-medium text-sm flex items-center gap-2 hover:bg-blue-500/10 px-4 py-2 rounded-full transition"
                        >
                            <PenLine className="w-4 h-4" />
                            Write a Review
                        </button>
                    </div>

                    {isWritingReview && (
                        <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6 mb-10 animate-in fade-in slide-in-from-top-2">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-semibold text-white">Write a Review</h3>
                                <button onClick={() => setIsWritingReview(false)}>
                                    <X className="w-5 h-5 text-zinc-500 hover:text-white transition" />
                                </button>
                            </div>
                            <div className="space-y-5">
                                <div className="flex gap-2">
                                    <span className="text-sm font-medium text-zinc-400 mr-2 pt-1">Tap to Rate:</span>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button key={star} onClick={() => setUserRating(star)} className="focus:outline-none">
                                            <Star className={`w-7 h-7 transition ${star <= userRating ? "fill-blue-500 text-blue-500" : "text-zinc-600 hover:text-blue-400"}`} />
                                        </button>
                                    ))}
                                </div>
                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        className="w-full bg-black border border-white/10 rounded-xl p-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 transition"
                                        placeholder="Title"
                                    />
                                    <textarea
                                        className="w-full bg-black border border-white/10 rounded-xl p-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 min-h-[120px] transition resize-none"
                                        placeholder="Review (Optional)"
                                    />
                                </div>
                                <div className="flex justify-end gap-3 pt-2">
                                    <button
                                        onClick={() => setIsWritingReview(false)}
                                        className="px-6 py-2.5 rounded-full font-medium text-zinc-400 hover:text-white transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => setIsWritingReview(false)}
                                        className="px-8 py-2.5 rounded-full font-medium bg-blue-600 text-white hover:bg-blue-500 transition shadow-lg shadow-blue-900/20 active:scale-95"
                                    >
                                        Submit
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col md:flex-row gap-10 mb-12">
                        {/* Summary */}
                        <div className="flex flex-col gap-1 min-w-[100px]">
                            <div className="text-6xl font-bold tracking-tighter">4.8</div>
                            <div className="text-base font-medium text-zinc-400">out of 5</div>
                        </div>

                        {/* Bars Section */}
                        <div className="flex-1 space-y-1.5 max-w-md pt-2">
                            {[
                                { stars: 5, pct: '82%' },
                                { stars: 4, pct: '12%' },
                                { stars: 3, pct: '4%' },
                                { stars: 2, pct: '1%' },
                                { stars: 1, pct: '1%' },
                            ].map((item) => (
                                <div key={item.stars} className="flex items-center gap-3 text-[10px] font-bold text-zinc-500">
                                    <div className="w-3 text-right flex justify-end">
                                        <Star className="w-2 h-2 fill-current" />
                                    </div>
                                    <div className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-zinc-400 rounded-full" style={{ width: item.pct }}></div>
                                    </div>
                                </div>
                            ))}
                            <div className="text-right pt-2 text-zinc-500 font-medium text-xs">
                                12,403 Ratings
                            </div>
                        </div>
                    </div>

                    {/* Review Cards Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                        <ReviewCard
                            title="Absolutely incredible!"
                            date="2d ago"
                            user="AlexGemini"
                            rating={5}
                            text="The graphics are stunning and the gameplay is silky smooth. Best platformer I've played on cloud. Totally recommend it!"
                        />
                        <ReviewCard
                            title="Good but needs updates"
                            date="1w ago"
                            user="ProGamer99"
                            rating={4}
                            text="Love the concept, but some levels are impossibly hard. Needs a checkpoint system update soon otherwise it's perfect."
                        />
                        <ReviewCard
                            title="Worth every penny"
                            date="3w ago"
                            user="CloudMaster"
                            rating={5}
                            text="No latency issues at all. It feels like running locally. Kudos to the dev team for this masterpiece."
                        />
                        <ReviewCard
                            title="Challenging & Fun"
                            date="1mo ago"
                            user="SpeedRunnerX"
                            rating={5}
                            text="If you love speedrunning, this is it. The mechanics are precise and the world is beautiful."
                        />
                    </div>
                </div>
            </section>

        </div>
    );
}

/* ---------- Components ---------- */

function IconButton({ icon }: { icon: React.ReactNode }) {
    return (
        <button className="w-9 h-9 p-2 rounded-full bg-transparent border border-white/10 flex items-center justify-center hover:bg-zinc-800 transition">
            {icon}
        </button>
    );
}

const PUBLISHER_APPS = [
    { id: 1, title: "CinemaOS Studio", category: "Video Production", rating: "4.9", color: "bg-purple-600", icon: "🎬" },
    { id: 2, title: "Rage Platformer", category: "Action Game", rating: "4.8", color: "bg-red-600", icon: "🔥" },
    { id: 3, title: "CloudSync Pro", category: "Utility", rating: "4.7", color: "bg-blue-500", icon: "☁️" },
    { id: 4, title: "AudioFlow", category: "Music", rating: "4.6", color: "bg-emerald-500", icon: "🎵" },
    { id: 5, title: "Pixel Canvas", category: "Design", rating: "4.8", color: "bg-pink-500", icon: "🎨" },
    { id: 6, title: "CodeRunner IDE", category: "Development", rating: "5.0", color: "bg-yellow-600", icon: "💻" },
];

function Stat({
    title,
    value,
    sub,
    children,
    below,
}: {
    title: string
    value?: string
    sub?: string
    children?: React.ReactNode
    below?: string
}) {
    return (
        <div className="flex flex-col items-center gap-1 text-center">
            <span className="text-[11px] uppercase tracking-wide text-zinc-500">
                {title}
            </span>

            {(value || children) && (
                <div className="flex items-center gap-1.5">
                    {children && (
                        <span className="flex items-center text-zinc-300">
                            {children}
                        </span>
                    )}

                    {value && (
                        <span className="text-2xl font-semibold tracking-tight leading-none">
                            {value}
                        </span>
                    )}
                </div>
            )}

            {/* BELOW LINE (Editors' Choice, etc.) */}
            {below && (
                <span className="text-[11px] font-medium text-zinc-400">
                    {below}
                </span>
            )}

            {sub && (
                <span className="text-[11px] text-zinc-500 leading-tight">
                    {sub}
                </span>
            )}
        </div>
    )
}


function Meta({ label, value }: { label: string; value: string | React.ReactNode }) {
    return (
        <div>
            <p className="text-zinc-500 mb-1">{label}</p>
            <div className="text-white font-medium">{value}</div>
        </div>
    );
}

function ReviewCard({ title, date, user, rating, text }: { title: string, date: string, user: string, rating: number, text: string }) {
    return (
        <div className="bg-zinc-900/50 border border-white/5 p-5 rounded-2xl flex flex-col gap-3 hover:bg-zinc-900 transition">
            <div className="flex justify-between items-start">
                <div className="font-bold text-sm text-white">{title}</div>
                <div className="text-xs text-zinc-500">{date}</div>
            </div>
            <div className="flex items-center gap-2">
                <div className="flex text-orange-400">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < rating ? 'fill-current' : 'text-zinc-700 fill-zinc-700'}`} />
                    ))}
                </div>
                <div className="text-xs text-zinc-500 font-medium">{user}</div>
            </div>
            <p className="text-zinc-300 text-sm leading-relaxed">
                {text}
            </p>
        </div>
    )
}
