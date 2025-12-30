"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
    LayoutGrid,
    BarChart3,
    Settings,
    Bell,
    Box,
    ChevronDown,
    ArrowUpRight,
    Landmark,
    IndianRupee
} from "lucide-react";

import OverviewContent from "./OverviewContent";
import AnalyticsContent from "./AnalyticsContent";
import RevenueContent from "./RevenueContent";
import BankingContent from "./BankingContent";
import SettingsContent from "./SettingsContent";

export default function ConsoleDashboard() {
    const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'revenue' | 'banking' | 'settings'>('overview');
    const [selectedRegion, setSelectedRegion] = useState("Worldwide");
    const [regionOpen, setRegionOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#d1aea0]/30 flex flex-col">
            {/* Minimal Top Nav */}
            <header className="fixed top-0 left-0 right-0 h-16 border-b border-white/5 bg-[#050505]/80 backdrop-blur-md z-50 flex items-center justify-between px-6">
                <div className="flex items-center gap-4">
                    <Link href="/" className="flex items-center gap-4 group">
                        <img src="/resources/logo.svg" alt="LoopSync" className="h-7 w-auto brightness-200" />
                        <div className="h-4 w-[1px] bg-white/10"></div>
                        <div className="flex items-center gap-2">
                            <img src="/products-logo.svg" alt="Console" className="h-8 w-8 object-contain brightness-0 invert" />
                            <span className="font-semibold text-sm tracking-wide text-white/90">Developer Console</span>
                        </div>
                    </Link>
                    <div className="h-4 w-[1px] bg-white/10 mx-2"></div>
                    <div className="relative">
                        <button
                            onClick={() => setRegionOpen(!regionOpen)}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 cursor-pointer hover:bg-white/10 transition-colors outline-none"
                        >
                            <Box className="w-3.5 h-3.5 text-zinc-400" />
                            <span className="text-xs font-medium text-zinc-300">{selectedRegion}</span>
                            <ChevronDown className={`w-3 h-3 text-zinc-500 transition-transform ${regionOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {regionOpen && (
                            <div className="absolute top-full right-0 mt-2 w-48 bg-[#0A0A0A] border border-white/10 rounded-xl shadow-2xl backdrop-blur-xl overflow-hidden z-[60]">
                                <div className="p-1">
                                    <button
                                        onClick={() => { setSelectedRegion('Worldwide'); setRegionOpen(false); }}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${selectedRegion === 'Worldwide' ? 'text-white bg-white/5' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
                                    >
                                        Worldwide
                                        {selectedRegion === 'Worldwide' && <div className="w-1.5 h-1.5 rounded-full bg-[#d1aea0]" />}
                                    </button>
                                    <button
                                        onClick={() => { setSelectedRegion('India'); setRegionOpen(false); }}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${selectedRegion === 'India' ? 'text-white bg-white/5' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
                                    >
                                        India
                                        {selectedRegion === 'India' && <div className="w-1.5 h-1.5 rounded-full bg-[#d1aea0]" />}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button className="p-2 text-zinc-500 hover:text-white transition-colors relative">
                        <Bell className="w-4 h-4" />
                        <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#d1aea0] rounded-full border border-[#050505]"></div>
                    </button>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#d1aea0] to-orange-400 border border-white/10"></div>
                </div>
            </header>

            <div className="flex flex-1 pt-16">

                {/* Sidebar */}
                <aside className="w-64 border-r border-white/5 bg-[#050505] fixed top-16 bottom-0 left-0 hidden md:flex flex-col p-4">
                    <div className="space-y-1">
                        <SidebarItem
                            icon={<LayoutGrid className="w-4 h-4" />}
                            label="Overview"
                            active={activeTab === 'overview'}
                            onClick={() => setActiveTab('overview')}
                        />
                        <SidebarItem
                            icon={<BarChart3 className="w-4 h-4" />}
                            label="Analytics"
                            active={activeTab === 'analytics'}
                            onClick={() => setActiveTab('analytics')}
                        />
                        <SidebarItem
                            icon={<IndianRupee className="w-4 h-4" />}
                            label="Revenue"
                            active={activeTab === 'revenue'}
                            onClick={() => setActiveTab('revenue')}
                        />
                        <SidebarItem
                            icon={<Landmark className="w-4 h-4" />}
                            label="Banking"
                            active={activeTab === 'banking'}
                            onClick={() => setActiveTab('banking')}
                        />
                        <SidebarItem
                            icon={<Settings className="w-4 h-4" />}
                            label="Settings"
                            active={activeTab === 'settings'}
                            onClick={() => setActiveTab('settings')}
                        />
                    </div>

                    <div className="mt-auto">
                        <div className="p-4 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/5">
                            <p className="text-xs text-zinc-400 mb-2">Documentation</p>
                            <Link href="/developers/docs" className="flex items-center gap-2 text-sm font-medium text-white hover:text-[#d1aea0] transition-colors">
                                Read the Docs <ArrowUpRight className="w-3 h-3" />
                            </Link>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 ml-0 md:ml-80 p-8 md:p-16 overflow-y-auto min-h-[calc(100vh-4rem)]">
                    <div className="max-w-5xl mx-auto">
                        {activeTab === 'overview' && <OverviewContent setActiveTab={setActiveTab} />}
                        {activeTab === 'analytics' && <AnalyticsContent />}
                        {activeTab === 'revenue' && <RevenueContent />}
                        {activeTab === 'banking' && <BankingContent />}
                        {activeTab === 'settings' && <SettingsContent />}
                    </div>
                </main>
            </div>
        </div>
    );
}

// ------------------- Sidebar Components -------------------

function SidebarItem({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${active
                ? "bg-white/5 text-white font-medium"
                : "text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.02]"
                }`}>
            {icon}
            {label}
        </button>
    )
}
