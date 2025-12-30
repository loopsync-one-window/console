import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import {
    AnalyticsOverview, AnalyticsTraffic, AnalyticsDevices, AnalyticsRealtime, OverviewApp,
    getAnalyticsOverview, getAnalyticsTraffic, getAnalyticsDevices, getAnalyticsRealtime, getOverviewSnapshot
} from "@/lib/api";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

export default function AnalyticsContent() {
    const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
    const [traffic, setTraffic] = useState<AnalyticsTraffic | null>(null);
    const [devices, setDevices] = useState<AnalyticsDevices | null>(null);
    const [realtime, setRealtime] = useState<AnalyticsRealtime | null>(null);
    const [loading, setLoading] = useState(true);
    const [range, setRange] = useState('7d');
    const [apps, setApps] = useState<OverviewApp[]>([]);
    const [selectedAppId, setSelectedAppId] = useState<string | undefined>(undefined);

    // Fetch Apps
    React.useEffect(() => {
        getOverviewSnapshot('').then(data => setApps(data.apps)).catch(console.error);
    }, []);

    // Fetch initial data
    React.useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [ov, tr, dev] = await Promise.all([
                    getAnalyticsOverview(range, 'worldwide', selectedAppId),
                    getAnalyticsTraffic(range, 'worldwide', selectedAppId),
                    getAnalyticsDevices(range, 'worldwide', selectedAppId)
                ]);
                setOverview(ov);
                setTraffic(tr);
                setDevices(dev);
            } catch (e) {
                console.error("Failed to load analytics", e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [range, selectedAppId]);

    // Real-time polling
    React.useEffect(() => {
        const fetchRealtime = async () => {
            try {
                const rt = await getAnalyticsRealtime(selectedAppId);
                setRealtime(rt);
            } catch (e) { console.error(e); }
        };

        // Initial fetch
        fetchRealtime();

        // Poll every 5s
        const interval = setInterval(fetchRealtime, 5000);
        return () => clearInterval(interval);
    }, [selectedAppId]);

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

    if (loading && !overview) return (
        <div className="flex flex-col items-center justify-center h-[50vh] text-zinc-500 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#d1aea0]" />
        </div>
    );

    const deviceColors: Record<string, string> = { 'Desktop': '#d1aea0', 'Mobile': '#ffb380', 'Tablet': '#888' };

    return (
        <div className="animate-[fadeIn_0.5s_ease-out] space-y-8">
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-3xl font-light text-white mb-2">Analytics</h1>
                    <div className="flex items-center gap-2 text-zinc-500 text-sm">
                        <span>Real-time insights tailored for you.</span>
                        {realtime && (
                            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-medium text-[10px] uppercase tracking-wider animate-pulse">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                Live: {realtime.activeUsers} Users
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex items-center gap-2 px-3 py-1.5 bg-white/[0.03] border border-white/5 rounded-lg text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/5 transition-colors">
                                {selectedAppId ? apps.find(a => a.id === selectedAppId)?.name || 'Unknown App' : 'All Apps'}
                                <ChevronDown className="w-4 h-4 text-zinc-500" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 bg-[#0A0A0A] border-white/10 text-zinc-300">
                            <DropdownMenuItem
                                className="focus:bg-white/5 cursor-pointer"
                                onClick={() => setSelectedAppId(undefined)}
                            >
                                All Apps
                            </DropdownMenuItem>
                            {apps.map(app => (
                                <DropdownMenuItem
                                    key={app.id}
                                    className="focus:bg-white/5 cursor-pointer truncate"
                                    onClick={() => setSelectedAppId(app.id)}
                                >
                                    {app.name}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <div className="flex items-center gap-2 bg-white/[0.03] border border-white/5 p-1 rounded-lg">
                        {['7d', '30d', '1y'].map((r) => (
                            <button
                                key={r}
                                onClick={() => setRange(r)}
                                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${range === r ? "bg-[#d1aea0] text-black shadow-sm" : "text-zinc-400 hover:text-white"}`}
                            >
                                {r === '7d' ? '7 Days' : r === '30d' ? '30 Days' : 'Year'}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    label="Total Downloads"
                    value={overview?.totalUsers.toLocaleString() || "0"}
                    change={`+${overview?.totalUsersChangePercent}%`}
                />
                <StatCard
                    label="Active Sessions"
                    value={overview?.activeSessions.toLocaleString() || "0"}
                    change={`+${overview?.activeSessionsChangePercent}%`}
                />
                <StatCard
                    label="Avg. Session Duration"
                    value={`${Math.floor((overview?.avgSessionDurationSec || 0) / 60)}m ${(overview?.avgSessionDurationSec || 0) % 60}s`}
                    change={`+${overview?.avgSessionDurationChangePercent}%`}
                />
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
                            <AreaChart data={traffic?.points || []}>
                                <defs>
                                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#d1aea0" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#d1aea0" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis
                                    dataKey="label"
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
                                    data={devices?.devices || []}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="percentage"
                                    nameKey="type"
                                    stroke="none"
                                >
                                    {devices?.devices.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={deviceColors[entry.type] || '#888'} />
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
                            <span className="text-3xl font-bold text-white">{devices?.devices[0]?.percentage || 0}%</span>
                            <span className="text-xs text-zinc-500 uppercase tracking-widest">{devices?.devices[0]?.type || "N/A"}</span>
                        </div>
                    </div>
                    <div className="mt-4 space-y-3">
                        {devices?.devices.map((item) => (
                            <div key={item.type} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: deviceColors[item.type] || '#888' }} />
                                    <span className="text-zinc-400">{item.type}</span>
                                </div>
                                <span className="text-white font-medium">{item.percentage}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>


        </div >
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
