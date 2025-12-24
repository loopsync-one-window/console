"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
    ChevronLeft,
    Star,
    Download,
    Share2,
    MoreHorizontal,
    Globe,
    Smartphone,
    ShieldCheck,
    History,
    Calendar,
    HardDrive,
    Languages,
    Check,
    Info,
    Edit3,
    Image
} from "lucide-react";

export default function AppDetailPage({ params }: { params: { id: string } }) {
    const [isInstalling, setIsInstalling] = useState(false);

    // Mock data based on ID (in real app, fetch data)
    const appData = {
        name: "Ceres Assist",
        developer: "LoopSync Inc.",
        category: "Productivity",
        rating: 4.8,
        reviews: "1.2k",
        size: "145 MB",
        version: "2.4.0",
        updated: "2 days ago",
        downloads: "12k+",
        description: "Experience the next evolution of productivity with Ceres Assist. Seamlessly sync your workflow across all devices with our proprietary loop technology. Designed for professionals who demand excellence.",
        whatsNew: "Performance improvements and bug fixes. Added new dark mode toggle and improved sync latency.",
        screenshots: [1, 2, 3, 4]
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#d1aea0]/30 flex flex-col">

            {/* Header / Nav */}
            <header className="fixed top-0 left-0 right-0 h-16 border-b border-white/5 bg-[#050505]/80 backdrop-blur-md z-50 flex items-center justify-between px-6">
                <div className="flex items-center gap-4">
                    <Link href="/developers/console" className="p-2 rounded-full hover:bg-white/5 transition-colors text-zinc-400 hover:text-white">
                        <ChevronLeft className="w-5 h-5" />
                    </Link>
                    <div className="h-6 w-[1px] bg-white/10"></div>
                    <span className="text-sm font-semibold text-white/90">App Details</span>
                </div>
                <div className="flex items-center gap-2">
                    <button className="p-2 text-zinc-400 hover:text-white transition-colors">
                        <Share2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-zinc-400 hover:text-white transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                    </button>
                </div>
            </header>

            <main className="flex-1 max-w-6xl mx-auto w-full p-6 md:p-12 animate-[fadeIn_0.4s_ease-out] mt-16">

                {/* Hero Section */}
                <div className="flex flex-col md:flex-row gap-8 mb-12 mt-20">
                    <div className="w-40 h-40 rounded-[2.5rem] text-center flex items-center justify-center bg-white/5 shadow-2xl shadow-white/10 shrink-0 border border-white/10" >
                        <div className="border-20 border-white"></div>
                    </div>
                    <div className="flex-1 pt-2">
                        <div className="flex items-start justify-between">
                            <div>
                                <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">{appData.name}</h1>
                                <p className="text-lg text-white/50 font-semibold mb-4">{appData.developer}</p>
                            </div>
                            <div className="flex gap-3">
                                <Link href={`/developers/console/publish?edit=${params.id}`} className="px-5 py-2.5 rounded-full bg-white/[0.05] border border-white/10 text-white font-medium text-sm hover:bg-white/10 transition-colors flex items-center gap-2">
                                    <Edit3 className="w-4 h-4" />
                                    Update Package
                                </Link>
                                <button className="px-5 py-2.5 rounded-full bg-white text-black font-bold text-sm hover:bg-zinc-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.15)]">
                                    View in Store
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-8 mt-2">
                            <div className="flex items-center gap-1.5 text-zinc-400 text-sm">
                                <span className="font-semibold text-white text-base">{appData.rating}</span>
                                <Star className="w-4 h-4 fill-white text-white" />
                                <span className="text-xs ml-1">• {appData.reviews} Ratings</span>
                            </div>
                            <div className="w-[1px] h-4 bg-white/10" />
                            <div className="text-sm text-zinc-400">
                                <span className="font-semibold text-white text-base block md:inline">{appData.category}</span>
                            </div>
                            <div className="w-[1px] h-4 bg-white/10 hidden md:block" />
                            <div className="text-sm text-zinc-400 hidden md:block">
                                <span className="font-semibold text-white text-base">4+</span> Years
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* Left/Main Column */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Screenshots */}
                        <section className="space-y-4">
                            <h2 className="text-xl font-semibold text-white">Preview</h2>
                            <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent -mx-6 px-6 md:mx-0 md:px-0">
                                {appData.screenshots.map((i) => (
                                    <div key={i} className="w-72 h-48 md:w-80 md:h-52 rounded-2xl bg-zinc-900 border border-white/10 shrink-0 relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-transparent" />
                                        <div className="absolute inset-0 flex items-center justify-center text-zinc-700 font-mono text-xs group-hover:text-zinc-500 transition-colors">
                                            Screenshot {i}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Description */}
                        <section className="space-y-4">
                            <h2 className="text-xl font-semibold text-white">Description</h2>
                            <p className="text-zinc-400 leading-relaxed">
                                {appData.description}
                            </p>
                            <p className="text-zinc-400 leading-relaxed">
                                LoopSync technology ensures that your data is always where you need it, when you need it. Secure, fast, and reliable.
                            </p>
                        </section>

                        {/* What's New */}
                        <section className="space-y-4">
                            <div className="flex items-baseline justify-between">
                                <h2 className="text-xl font-semibold text-white">What's New</h2>
                                <span className="text-sm text-[#d1aea0] font-medium text-right">Version {appData.version}</span>
                            </div>
                            <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/5">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-xs text-zinc-500 uppercase font-bold tracking-wider">{appData.updated}</span>
                                </div>
                                <p className="text-zinc-300 text-sm leading-relaxed">
                                    {appData.whatsNew}
                                </p>
                            </div>
                        </section>
                    </div>

                    {/* Right/Sidebar Column */}
                    <div className="space-y-8">

                        {/* Information Block */}
                        <section>
                            <h2 className="text-lg font-medium text-white mb-4">Information</h2>
                            <div className="rounded-3xl bg-white/[0.02] border border-white/5 overflow-hidden">
                                <InfoRow label="Provider" value={appData.developer} />
                                <InfoRow label="Size" value={appData.size} />
                                <InfoRow label="Category" value={appData.category} />
                                <InfoRow label="Compatibility" value="Works on this device" icon={<Check className="w-3.5 h-3.5 text-emerald-400" />} />
                                <InfoRow label="Languages" value="English, Spanish, +4" />
                                <InfoRow label="Age Rating" value="4+ Years" border={false} />
                            </div>
                        </section>

                        {/* Supports */}
                        <section>
                            <h2 className="text-lg font-medium text-white mb-4">Supports</h2>
                            <div className="flex flex-wrap gap-2">
                                <SupportBadge icon={<Globe className="w-3.5 h-3.5" />} label="Web" />
                                <SupportBadge icon={<Smartphone className="w-3.5 h-3.5" />} label="Mobile" />
                                <SupportBadge icon={<ShieldCheck className="w-3.5 h-3.5" />} label="Secure Enclave" />
                            </div>
                        </section>

                        {/* Stats mini */}
                        <section className="p-6 rounded-3xl bg-gradient-to-br from-[#d1aea0]/10 to-transparent border border-[#d1aea0]/20">
                            <h3 className="text-sm font-semibold text-[#d1aea0] uppercase tracking-wider mb-1">Total Downloads</h3>
                            <div className="text-3xl font-bold text-white tracking-tight">{appData.downloads}</div>
                        </section>

                    </div>
                </div>

            </main>
        </div>
    );
}

function InfoRow({ label, value, icon, border = true }: { label: string, value: string, icon?: React.ReactNode, border?: boolean }) {
    return (
        <div className={`flex items-center justify-between p-4 ${border ? 'border-b border-white/5' : ''} hover:bg-white/[0.02] transition-colors`}>
            <span className="text-sm text-zinc-500">{label}</span>
            <div className="flex items-center gap-2">
                {icon}
                <span className="text-sm font-medium text-white">{value}</span>
            </div>
        </div>
    )
}

function SupportBadge({ icon, label }: { icon: React.ReactNode, label: string }) {
    return (
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-xs text-zinc-300">
            {icon}
            {label}
        </div>
    )
}
