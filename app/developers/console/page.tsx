"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
    LayoutGrid,
    Plus,
    Settings,
    BarChart3,
    MoreHorizontal,
    Search,
    Bell,
    Box,
    ChevronDown,
    ArrowUpRight,
    DollarSign,
    CreditCard,
    Download,
    Edit2,
    Key,
    User,
    Shield,
    Trash2,
    Landmark,
    Building2,
    CheckCircle2,
    Copy
} from "lucide-react";
import Navbar from "@/components/NavBar";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Legend,
    PieChart,
    Pie,
    Cell
} from "recharts";

export default function ConsoleDashboard() {
    const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'revenue' | 'banking' | 'settings'>('overview');
    const [selectedRegion, setSelectedRegion] = useState("Global (US-East)");
    const [regionOpen, setRegionOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#d1aea0]/30 flex flex-col">
            {/* Minimal Top Nav */}
            <header className="fixed top-0 left-0 right-0 h-16 border-b border-white/5 bg-[#050505]/80 backdrop-blur-md z-50 flex items-center justify-between px-6">
                <div className="flex items-center gap-4">
                    <Link href="/" className="flex items-center gap-4 group">
                        <img src="/resources/logo.svg" alt="LoopSync" className="h-9 w-auto brightness-200" />
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
                                        onClick={() => { setSelectedRegion('Global (US-East)'); setRegionOpen(false); }}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${selectedRegion === 'Global (US-East)' ? 'text-white bg-white/5' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
                                    >
                                        Global (US-East)
                                        {selectedRegion === 'Global (US-East)' && <div className="w-1.5 h-1.5 rounded-full bg-[#d1aea0]" />}
                                    </button>
                                    <button
                                        onClick={() => { setSelectedRegion('India (AP-South)'); setRegionOpen(false); }}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${selectedRegion === 'India (AP-South)' ? 'text-white bg-white/5' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
                                    >
                                        India (AP-South)
                                        {selectedRegion === 'India (AP-South)' && <div className="w-1.5 h-1.5 rounded-full bg-[#d1aea0]" />}
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
                            icon={<DollarSign className="w-4 h-4" />}
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
                        {activeTab === 'overview' && <OverviewContent />}
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

// ------------------- Tab Contents -------------------

function OverviewContent() {
    return (
        <div className="animate-[fadeIn_0.5s_ease-out]">
            <div className="flex items-end justify-between mb-12">
                <div>
                    <h1 className="text-3xl font-light text-white mb-2">Good afternoon, Ripun.</h1>
                    <p className="text-zinc-500 text-sm">Here is what's happening with your apps today.</p>
                </div>
                <Link href="/developers/console/publish" className="flex items-center gap-2 px-4 py-2 bg-white text-black text-sm font-semibold rounded-full hover:bg-[#d1aea0] transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                    <Plus className="w-4 h-4" />
                    Publish App
                </Link>
            </div>

            {/* Search / Filter Bar */}
            <div className="flex items-center gap-4 mb-8">
                <div className="relative flex-1 max-w-sm group">
                    <Search className="w-4 h-4 text-zinc-600 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-white transition-colors" />
                    <input
                        type="text"
                        placeholder="Search applications..."
                        className="w-full bg-white/[0.02] border border-white/5 rounded-lg pl-10 pr-4 py-2.5 text-sm text-zinc-300 placeholder:text-zinc-700 focus:outline-none focus:border-white/20 transition-all"
                    />
                </div>
            </div>

            {/* Apps Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AppCard name="Ceres Assist" id="app_cn823...9s8" status="live" users="12.5k" iconColor="bg-purple-500" />
                <AppCard name="Lumiflage" id="app_x92k2...1m2" status="review" users="--" iconColor="bg-orange-500" />

                {/* Publish New Placeholder Card */}
                <Link href="/developers/console/publish" className="group relative flex flex-col items-center justify-center gap-4 h-full min-h-[13rem] rounded-3xl border border-dashed border-white/10 bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/20 transition-all duration-300">
                    <div className="w-12 h-12 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-zinc-500 group-hover:text-white group-hover:scale-110 transition-all duration-300">
                        <Plus className="w-5 h-5" />
                    </div>
                    <span className="text-zinc-500 text-sm font-medium group-hover:text-zinc-300 transition-colors">Publish new app</span>
                </Link>
            </div>

            {/* Recent Activity Section */}
            <div className="mt-16">
                <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-widest mb-6 border-b border-white/5 pb-4">Recent Activity</h3>
                <div className="space-y-1">
                    <ActivityRow action="Deployment successful" app="Ceres Assist" time="2m ago" success />
                    <ActivityRow action="Build failed" app="Lumiflage" time="1h ago" error />
                    <ActivityRow action="New API Key generated" app="Global Config" time="5h ago" neutral />
                </div>
            </div>
        </div>
    );
}

function AnalyticsContent() {
    // Mock Data
    const trafficData = [
        { name: 'Mon', users: 4000, revenue: 2400 },
        { name: 'Tue', users: 3000, revenue: 1398 },
        { name: 'Wed', users: 2000, revenue: 9800 },
        { name: 'Thu', users: 2780, revenue: 3908 },
        { name: 'Fri', users: 1890, revenue: 4800 },
        { name: 'Sat', users: 2390, revenue: 3800 },
        { name: 'Sun', users: 3490, revenue: 4300 },
    ];

    const deviceData = [
        { name: 'Desktop', value: 65, color: '#d1aea0' },
        { name: 'Mobile', value: 25, color: '#ffb380' },
        { name: 'Tablet', value: 10, color: '#888' },
    ];

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-[#0A0A0A] border border-white/10 p-3 rounded-xl shadow-xl backdrop-blur-md">
                    <p className="text-zinc-400 text-xs mb-1">{label}</p>
                    <p className="text-white font-bold text-sm">
                        {payload[0].value.toLocaleString()}
                        <span className="text-zinc-500 font-normal ml-1">{payload[0].name === 'users' ? 'Users' : 'Revenue'}</span>
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="animate-[fadeIn_0.5s_ease-out] space-y-8">
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-3xl font-light text-white mb-2">Analytics</h1>
                    <p className="text-zinc-500 text-sm">Real-time insights into your application performance.</p>
                </div>
                <div className="flex items-center gap-2 bg-white/[0.03] border border-white/5 p-1 rounded-lg">
                    <button className="px-3 py-1.5 text-xs font-medium bg-[#d1aea0] text-black rounded-md shadow-sm">7 Days</button>
                    <button className="px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white transition-colors">30 Days</button>
                    <button className="px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white transition-colors">Year</button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard label="Total Users" value="12,543" change="+12%" />
                <StatCard label="Active Sessions" value="842" change="+5%" />
                <StatCard label="Avg. Session Duration" value="4m 32s" change="+8%" />
            </div>

            {/* Main Chart Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[28rem]">
                {/* Traffic Chart */}
                <div className="lg:col-span-2 p-6 rounded-3xl bg-white/[0.03] border border-white/5 flex flex-col">
                    <h3 className="text-sm font-medium text-white mb-6 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#d1aea0]" />
                        User Traffic Trends
                    </h3>
                    <div className="flex-1 w-full min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trafficData}>
                                <defs>
                                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#d1aea0" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#d1aea0" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis
                                    dataKey="name"
                                    stroke="#555"
                                    tick={{ fill: '#555', fontSize: 10 }}
                                    tickLine={false}
                                    axisLine={false}
                                    dy={10}
                                />
                                <YAxis
                                    stroke="#555"
                                    tick={{ fill: '#555', fontSize: 10 }}
                                    tickLine={false}
                                    axisLine={false}
                                    dx={-10}
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }} />
                                <Area
                                    type="monotone"
                                    dataKey="users"
                                    stroke="#d1aea0"
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorUsers)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Engagement/Device Chart */}
                <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 flex flex-col">
                    <h3 className="text-sm font-medium text-white mb-6">Device Distribution</h3>
                    <div className="flex-1 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={deviceData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {deviceData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0A0A0A', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Center Text */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-3xl font-bold text-white">65%</span>
                            <span className="text-xs text-zinc-500 uppercase tracking-widest">Desktop</span>
                        </div>
                    </div>
                    <div className="mt-4 space-y-3">
                        {deviceData.map((item) => (
                            <div key={item.name} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                                    <span className="text-zinc-400">{item.name}</span>
                                </div>
                                <span className="text-white font-medium">{item.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>


        </div>
    )
}

function RevenueContent() {
    return (
        <div className="animate-[fadeIn_0.5s_ease-out]">
            <div className="flex items-end justify-between mb-12">
                <div>
                    <h1 className="text-3xl font-light text-white mb-2">Revenue</h1>
                    <p className="text-zinc-500 text-sm">Manage your earnings and payouts.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-white/[0.05] text-white text-sm font-medium rounded-full hover:bg-white/[0.1] transition-colors border border-white/10">
                    <Download className="w-4 h-4" />
                    Export Report
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                <div className="p-8 rounded-3xl bg-gradient-to-br from-[#d1aea0]/20 to-black border border-[#d1aea0]/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-100 transform translate-x-1/4 -translate-y-1/4">
                        <DollarSign className="w-32 h-32 text-[#d1aea0]" />
                    </div>
                    <p className="text-zinc-400 text-sm font-medium mb-2 uppercase tracking-wide">Total Earnings</p>
                    <h2 className="text-4xl font-bold text-white mb-1">$14,290.80</h2>
                    <p className="text-[#d1aea0] text-sm flex items-center gap-1">
                        <ArrowUpRight className="w-3 h-3" /> +15.3% this month
                    </p>
                </div>

                <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/5 relative">
                    <p className="text-zinc-400 text-sm font-medium mb-2 uppercase tracking-wide">Next Payout</p>
                    <div className="flex items-baseline gap-2 mb-1">
                        <h2 className="text-4xl font-bold text-white">$2,450.00</h2>
                        <span className="text-zinc-500 text-sm">pending</span>
                    </div>
                    <p className="text-zinc-500 text-sm">Scheduled for Jan 01, 2026</p>
                </div>
            </div>

            <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-widest mb-6 border-b border-white/5 pb-4">Transaction History</h3>
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
                <div className="grid grid-cols-4 p-4 border-b border-white/5 text-xs text-zinc-500 font-medium uppercase tracking-wider">
                    <div>Date</div>
                    <div>Description</div>
                    <div>Status</div>
                    <div className="text-right">Amount</div>
                </div>
                <TransactionRow date="Dec 20, 2025" desc="Payout #8821" status="Completed" amount="$3,100.00" />
                <TransactionRow date="Nov 20, 2025" desc="Payout #7732" status="Completed" amount="$2,950.00" />
                <TransactionRow date="Oct 20, 2025" desc="Payout #6643" status="Completed" amount="$2,800.00" />
            </div>
        </div>
    )
}

function BankingContent() {
    return (
        <div className="animate-[fadeIn_0.5s_ease-out] pb-20">
            <div className="mb-10">
                <h1 className="text-3xl font-light text-white mb-2">Banking & Payouts</h1>
                <p className="text-zinc-500 text-sm">Manage where you receive funds and billing details.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Payout Method */}
                <div className="flex flex-col gap-4">
                    <h2 className="text-lg font-medium text-zinc-200">Payout Method</h2>
                    <div className="flex-1 p-8 rounded-3xl bg-gradient-to-br from-zinc-900/50 to-black border border-white/5 relative overflow-hidden group min-h-[14rem]">
                        <div className="absolute top-0 right-0 p-8 opacity-100 group-hover:opacity-100 transition-opacity">
                            <Landmark className="w-32 h-32 text-[#fff]/5" />
                        </div>
                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <p className="text-sm font-semibold text-white tracking-wide">HDFC BANK</p>
                                    <p className="text-xs text-zinc-500 uppercase tracking-wider">Primary Account</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <p className="text-2xl font-mono text-white tracking-widest">•••• •••• 8291</p>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Account Holder</p>
                                        <p className="text-sm text-zinc-300 font-medium">RIPUN BASUMATARY</p>
                                    </div>
                                    <button className="text-xs bg-white text-black px-4 py-2 rounded-lg font-semibold hover:bg-zinc-200 transition-colors">
                                        Change
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tax & Address */}
                <div className="flex flex-col gap-4">
                    <h2 className="text-lg font-medium text-zinc-200">Tax & Billing</h2>
                    <div className="flex-1 p-6 rounded-3xl bg-gradient-to-br from-zinc-900/50 to-black border border-white/5 backdrop-blur-xl flex flex-col">

                        <div className="flex-1 space-y-6">
                            <div className="flex items-center justify-between pb-6 border-b border-white/5">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-white">Tax Verification</p>
                                    <p className="text-xs text-zinc-500">GSTIN / PAN Status</p>
                                </div>
                                <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span className="text-xs font-medium">Verified</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Billing Address</label>
                                    <textarea readOnly defaultValue="123 Innovation Drive, Tech Park,&#10;Sector 5, Salt Lake City,&#10;Kolkata - 700091, India" className="w-full bg-black/20 mt-2 border border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-300 focus:border-[#d1aea0]/50 outline-none transition-colors resize-none h-24 font-semibold leading-relaxed" />
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 mt-auto">
                            <button className="w-full py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-sm font-medium text-white transition-colors">
                                Update Billing Details
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <h2 className="text-lg font-medium text-zinc-200 mb-4">License & Registration</h2>
                <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 relative overflow-hidden">
                    <div className="flex items-start justify-between mb-8">
                        <div>
                            <p className="text-base font-semibold text-white tracking-wide">Developer License</p>
                            <p className="text-sm text-zinc-400">Perpetual License - vPA4</p>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span className="text-xs font-bold uppercase tracking-wider">Paid</span>
                        </div>
                    </div>

                    <div className="space-y-4 border-t border-white/5 pt-6">
                        <div className="flex justify-between text-sm">
                            <span className="text-zinc-400">Registration Fee</span>
                            <span className="font-mono text-white">₹388.04</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-zinc-400">Taxes (18%)</span>
                            <span className="font-mono text-white">₹69.85</span>
                        </div>

                        <div className="py-4 border-t border-b border-white/5">
                            <div className="flex items-start gap-4">
                                <img
                                    src="/verified/badge.svg"
                                    alt="Verified Badge"
                                    className="h-5 w-5 mt-0.5"

                                />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-white">Verified Developer Identity</p>
                                    <p className="text-xs text-zinc-500 mt-1 leading-relaxed max-w-md">
                                        Stand out as a trusted developer with a verified badge that boosts profile visibility and user confidence.
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className="block text-sm font-mono text-white">₹399.89</span>
                                    <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider">PAID</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center pt-2">
                            <span className="text-base font-medium text-white">Total Paid</span>
                            <span className="text-xl font-bold text-white">₹857.78</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-12">
                <h2 className="text-lg font-medium text-zinc-200 mb-4">Payout Schedule</h2>
                <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#d1aea0]/10 flex items-center justify-center text-[#d1aea0]">
                            <DollarSign className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-white">Automatic Payouts</p>
                            <p className="text-xs text-zinc-500">Payouts are processed on the 1st of every month.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-zinc-400">Next payout: <span className="text-white font-mono">Jan 01</span></span>
                        <div className="h-4 w-[1px] bg-white/10 mx-4"></div>
                        <button className="text-xs text-[#d1aea0] font-medium hover:underline">Change Schedule</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

function SettingsContent() {
    return (
        <div className="animate-[fadeIn_0.5s_ease-out] pb-20">
            <div className="mb-10">
                <h1 className="text-3xl font-light text-white mb-2">Settings</h1>
                <p className="text-zinc-500 text-sm">Manage your account, team, and preferences.</p>
            </div>

            <div className="grid grid-cols-1 gap-8">

                {/* Profile Section */}
                <section className="space-y-4">
                    <h2 className="text-lg font-medium text-zinc-200">Profile & Visibility</h2>
                    <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 backdrop-blur-xl">
                        <div className="flex items-start gap-6">
                            <div className="relative">
                                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#d1aea0] to-orange-400 border-2 border-white/10 shrink-0"></div>
                                <button className="absolute bottom-0 right-0 p-1.5 rounded-full bg-zinc-800 border border-black text-white hover:bg-zinc-700 transition-colors">
                                    <Edit2 className="w-3 h-3" />
                                </button>
                            </div>
                            <div className="flex-1 space-y-4 w-full">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Display Name</label>
                                        <input type="text" defaultValue="Ripun" className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#d1aea0]/50 outline-none transition-colors mt-2" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Email Address</label>
                                        <input type="email" defaultValue="ripun@loopsync.com" className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#d1aea0]/50 outline-none transition-colors mt-2" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Bio</label>
                                    <textarea defaultValue="Building the future of loops." className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#d1aea0]/50 outline-none transition-colors resize-none h-20 mt-2" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* API Keys */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-medium text-zinc-200">API Access</h2>
                        <button className="text-xs text-[#d1aea0] hover:underline">View Documentation</button>
                    </div>
                    <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 backdrop-blur-xl space-y-4">
                        <div className="flex items-center justify-between p-4 bg-black/20 border border-white/5 rounded-2xl">
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 rounded-lg bg-[#d1aea0]/10 text-[#d1aea0]">
                                    <Key className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-white">Production Key</p>
                                    <p className="text-xs text-zinc-500 font-mono mt-0.5">pk_live_837...98x2</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="text-xs bg-white/5 hover:bg-white/10 text-zinc-300 px-3 py-1.5 rounded-lg transition-colors border border-white/5">Copy</button>
                                <button className="text-xs bg-white/5 hover:bg-white/10 text-white px-3 py-1.5 rounded-lg transition-colors border border-white/5">Roll Key</button>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-black/20 border border-white/5 rounded-2xl opacity-60">
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 rounded-lg bg-zinc-800 text-zinc-400">
                                    <Key className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-white">Test Key</p>
                                    <p className="text-xs text-zinc-500 font-mono mt-0.5">pk_test_726...11z9</p>
                                </div>
                            </div>
                            <button className="text-xs bg-white/5 hover:bg-white/10 text-zinc-300 px-3 py-1.5 rounded-lg transition-colors border border-white/5">Copy</button>
                        </div>
                    </div>
                </section>

                {/* Notifications */}
                <section className="space-y-4">
                    <h2 className="text-lg font-medium text-zinc-200">Notifications</h2>
                    <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 backdrop-blur-xl">
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-white">Deployment Status</p>
                                    <p className="text-xs text-zinc-500">Get notified when your builds succeed or fail.</p>
                                </div>
                                <ToggleSwitch defaultChecked />
                            </div>
                            <div className="w-full h-px bg-white/5"></div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-white">Payout Updates</p>
                                    <p className="text-xs text-zinc-500">Receive emails about your earnings and transfers.</p>
                                </div>
                                <ToggleSwitch defaultChecked />
                            </div>
                            <div className="w-full h-px bg-white/5"></div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-white">Marketing Emails</p>
                                    <p className="text-xs text-zinc-500">Product updates and newsletters.</p>
                                </div>
                                <ToggleSwitch />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Danger Zone */}
                <section className="space-y-4">
                    <h2 className="text-lg font-medium text-red-500">Danger Zone</h2>
                    <div className="p-6 rounded-3xl border border-red-500/10 bg-red-500/[0.02] backdrop-blur-xl flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-white">Delete Developer Account</p>
                            <p className="text-xs text-zinc-500 mt-1">Permanently remove this workspace and all associated data.</p>
                        </div>
                        <button className="px-4 py-2 rounded-lg bg-red-900 text-white text-xs font-semibold hover:bg-red-500/20 transition-colors border border-red-500/20">
                            Delete Account
                        </button>
                    </div>
                </section>

            </div>
        </div>
    )
}

// ------------------- Helper Components -------------------

function ToggleSwitch({ defaultChecked }: { defaultChecked?: boolean }) {
    return (
        <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" defaultChecked={defaultChecked} />
            <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#d1aea0]"></div>
        </label>
    )
}

function AppCard({ name, id, status, users, iconColor }: { name: string, id: string, status: 'live' | 'review' | 'draft', users: string, iconColor: string }) {
    const [showMenu, setShowMenu] = useState(false);

    return (
        <Link href={`/developers/console/apps/${id}`} className="group relative block p-6 rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all duration-300">
            <div className="flex justify-between items-start mb-6">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/5 group-hover:bg-white/20 transition-colors">
                    <div className="w-4 h-4 rounded-md bg-white"></div>
                </div>

                <div className="relative">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setShowMenu(!showMenu);
                        }}
                        className={`p-1.5 rounded-lg transition-colors ${showMenu ? 'bg-white/10 text-white' : 'text-zinc-600 hover:text-white hover:bg-white/10'}`}
                    >
                        <MoreHorizontal className="w-4 h-4" />
                    </button>

                    {showMenu && (
                        <>
                            <div
                                className="fixed inset-0 z-40 cursor-default"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setShowMenu(false);
                                }}
                            />
                            <div
                                className="absolute right-0 top-full mt-2 w-48 bg-[#0A0A0A] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden animate-[fadeIn_0.1s_ease-out]"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                }}
                            >
                                <button className="w-full text-left px-4 py-2.5 text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-3">
                                    <Edit2 className="w-3.5 h-3.5 text-zinc-500" /> Edit App
                                </button>
                                <button className="w-full text-left px-4 py-2.5 text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-3">
                                    <Copy className="w-3.5 h-3.5 text-zinc-500" /> Copy ID
                                </button>
                                <div className="h-px bg-white/5 my-1" />
                                <button className="w-full text-left px-4 py-2.5 text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-3">
                                    <Trash2 className="w-3.5 h-3.5" /> Delete
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <h3 className="text-lg font-semibold text-white mb-1 tracking-tight">{name}</h3>
            <p className="text-xs text-zinc-500 font-mono mb-6 truncate opacity-60">{id}</p>

            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${status === 'live' ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]' :
                        status === 'review' ? 'bg-zinc-400' : 'bg-zinc-600'
                        }`}></span>
                    <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest">{status}</span>
                </div>
                <div className="text-xs text-zinc-400 font-medium">
                    <span className="text-white">{users}</span> users
                </div>
            </div>
        </Link>
    )
}

function ActivityRow({ action, app, time, success, error, neutral }: { action: string, app: string, time: string, success?: boolean, error?: boolean, neutral?: boolean }) {
    return (
        <div className="flex items-center justify-between py-3 px-4 hover:bg-white/[0.02] rounded-lg transition-colors group cursor-default">
            <div className="flex items-center gap-4">
                <div className={`w-1.5 h-1.5 rounded-full ${success ? 'bg-green-500' : error ? 'bg-red-500' : 'bg-zinc-500'
                    }`}></div>
                <span className="text-sm text-zinc-300">
                    {action} <span className="text-zinc-600 mx-2">&bull;</span> <span className="text-zinc-500">{app}</span>
                </span>
            </div>
            <span className="text-xs text-zinc-600 font-mono group-hover:text-zinc-400 transition-colors">{time}</span>
        </div>
    )
}

function StatCard({ label, value, change }: { label: string, value: string, change: string }) {
    return (
        <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5">
            <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium mb-2">{label}</p>
            <div className="flex items-baseline justify-between">
                <h3 className="text-2xl font-bold text-white">{value}</h3>
                <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">{change}</span>
            </div>
        </div>
    )
}

function TransactionRow({ date, desc, status, amount }: { date: string, desc: string, status: string, amount: string }) {
    return (
        <div className="grid grid-cols-4 p-4 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors text-sm items-center">
            <div className="text-zinc-400">{date}</div>
            <div className="text-white font-medium">{desc}</div>
            <div>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                    {status}
                </span>
            </div>
            <div className="text-right text-white font-mono">{amount}</div>
        </div>
    )
}
