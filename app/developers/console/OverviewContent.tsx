"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import {
    Plus,
    Search,
    Loader2,
    MoreHorizontal,
    Edit2,
    Copy,
    Trash2,
    Check,
    AlertCircle,
    ArrowRight,
} from "lucide-react";
import {
    getOverviewSnapshot,
    OverviewSnapshot,
    deleteApp,
} from "@/lib/api";

/* =========================
   Overview Content
========================= */

export default function OverviewContent() {
    const [data, setData] = useState<OverviewSnapshot | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [appToDelete, setAppToDelete] = useState<any>(null);
    const [deletingAppId, setDeletingAppId] = useState<string | null>(null);
    const [appToResolve, setAppToResolve] = useState<any>(null);

    /* Debounce search */
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(searchTerm), 400);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    /* Fetch overview data */
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const snapshot = await getOverviewSnapshot(debouncedSearch);
                setData(snapshot);
            } catch (e) {
                console.error("Failed to load overview", e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [debouncedSearch]);

    if (loading && !data) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] text-zinc-500 gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-[#d1aea0]" />
            </div>
        );
    }

    const getTimeAgo = (timestamp: string) => {
        const seconds = Math.floor(
            (Date.now() - new Date(timestamp).getTime()) / 1000
        );
        const intervals = [
            { label: "y", value: 31536000 },
            { label: "mo", value: 2592000 },
            { label: "d", value: 86400 },
            { label: "h", value: 3600 },
            { label: "m", value: 60 },
        ];
        for (const i of intervals) {
            const count = Math.floor(seconds / i.value);
            if (count > 1) return `${count}${i.label} ago`;
        }
        return `${seconds}s ago`;
    };

    return (
        <div className="animate-[fadeIn_0.5s_ease-out]">
            {/* Header */}
            <div className="flex items-end justify-between mb-12">
                <div>
                    <h1 className="text-3xl font-light text-white mb-2 capitalize">
                        {data?.context.timeOfDay},{" "}
                        {data?.context.displayName}.
                    </h1>
                    <p className="text-zinc-500 text-sm">
                        Here is what's happening with your apps today.
                    </p>
                </div>
                <Link
                    href="/developers/console/publish"
                    className="flex items-center gap-2 px-4 py-2 bg-white text-black text-sm font-semibold rounded-full hover:bg-[#d1aea0] transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Publish App
                </Link>
            </div>

            {/* Search */}
            <div className="flex items-center gap-4 mb-8">
                <div className="relative flex-1 max-w-sm">
                    <Search className="w-4 h-4 text-zinc-600 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search applications..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white/[0.02] border border-white/5 rounded-lg pl-10 pr-4 py-2.5 text-sm text-zinc-300 focus:outline-none focus:border-white/20"
                    />
                </div>
            </div>

            {/* Apps Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data?.apps.map((app) => (
                    <AppCard
                        key={app.id}
                        name={app.name}
                        id={app.id}
                        status={app.status}
                        users={
                            app.users
                                ? app.users > 1000
                                    ? `${(app.users / 1000).toFixed(1)}k`
                                    : app.users.toString()
                                : "--"
                        }
                        iconColor={app.color}
                        logoUrl={app.logoUrl}
                        rejectionReason={app.rejectionReason}
                        isDeleting={deletingAppId === app.id}
                        onDeleteClick={() => setAppToDelete(app)}
                        onResolveClick={() => setAppToResolve(app)}
                    />
                ))}

                {/* Publish new app card */}
                <Link
                    href="/developers/console/publish"
                    className="flex flex-col items-center justify-center gap-4 min-h-[13rem] rounded-3xl border border-dashed border-white/10 bg-white/[0.01] hover:bg-white/[0.03] transition-all"
                >
                    <Plus className="w-6 h-6 text-zinc-500" />
                    <span className="text-zinc-500 text-sm">
                        Publish new app
                    </span>
                </Link>
            </div>

            {/* Recent Activity */}
            <div className="mt-16">
                <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-widest mb-6 border-b border-white/5 pb-4">
                    Recent Activity
                </h3>

                <div className="space-y-1">
                    {data?.activity.map((item) => (
                        <ActivityRow
                            key={item.id}
                            action={item.message}
                            app={item.appName}
                            time={getTimeAgo(item.timestamp)}
                            success={item.type.includes("success")}
                            error={item.type.includes("failed")}
                            neutral={
                                !item.type.includes("success") &&
                                !item.type.includes("failed")
                            }
                        />
                    ))}

                    {data?.activity.length === 0 && (
                        <div className="text-zinc-600 text-sm">
                            No recent activity
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Modal */}
            <DeleteAppModal
                isOpen={!!appToDelete}
                app={appToDelete}
                onClose={() => setAppToDelete(null)}
                onConfirm={async (id: string) => {
                    setDeletingAppId(id);
                    setAppToDelete(null);
                    try {
                        await deleteApp(id);
                        setData((prev) =>
                            prev
                                ? {
                                    ...prev,
                                    apps: prev.apps.filter((a) => a.id !== id),
                                }
                                : null
                        );
                    } finally {
                        setDeletingAppId(null);
                    }
                }}
            />

            {/* Rejection Details Modal */}
            <RejectionDetailsModal
                isOpen={!!appToResolve}
                app={appToResolve}
                onClose={() => setAppToResolve(null)}
            />
        </div>
    );
}

/* =========================
   App Card
========================= */

function AppCard({
    name,
    id,
    status,
    users,
    iconColor,
    logoUrl,
    onDeleteClick,
    onResolveClick,
    isDeleting,
    rejectionReason,
}: any) {
    const [open, setOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const { toast } = useToast();

    if (isDeleting) return null;

    return (
        <div className="group relative flex flex-col p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-white/5 hover:bg-white/[0.02] transition-all duration-500 ease-out h-full min-h-[210px]">
            {/* <Link
                href={status === 'review' ? '#' : `/developers/console/apps/${id}`}
                onClick={(e) => {
                    if (status === 'review') {
                        e.preventDefault();
                        toast({
                            title: "Action Disabled",
                            description: "This app is currently under review. Editing is disabled until the review is complete.",
                            variant: "destructive"
                        });
                    }
                }}
                className={`absolute inset-0 z-0 rounded-[2rem] ${status === 'review' ? 'cursor-not-allowed' : ''}`}
            /> */}

            <div className="relative z-10 flex justify-between items-start mb-auto">
                <div className="flex flex-col gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-[#fff]/5 border border-white/5 flex items-center justify-center overflow-hidden relative">
                        {logoUrl ? (
                            <img src={logoUrl} alt={name} className="w-full h-full object-cover" />
                        ) : (
                            <div className={`w-5 h-5 rounded-lg ${iconColor}`} />
                        )}
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-white tracking-tight mb-1.5 group-hover:text-[#fff] transition-colors">{name}</h3>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono text-zinc-500 bg-white/[0.03] px-2 py-0.5 rounded-md border border-white/5 tracking-wide">{id}</span>
                        </div>
                    </div>
                </div>

                <div className="relative">
                    {status !== 'terminated' && (
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setOpen(!open);
                            }}
                            className="w-8 h-8 flex items-center justify-center rounded-full text-zinc-500 hover:text-white hover:bg-white/10 transition-all duration-300"
                        >
                            <MoreHorizontal className="w-5 h-5" />
                        </button>
                    )}

                    {open && status !== 'terminated' && (
                        <>
                            <div className="fixed inset-0 z-20" onClick={(e) => { e.stopPropagation(); setOpen(false); }} />
                            <div className="absolute right-0 top-10 w-48 bg-black backdrop-blur-sm border border-white/[0.1] rounded-xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.8)] z-30 overflow-hidden animate-in fade-in zoom-in-95 duration-100 p-1.5">
                                <Link
                                    href={status === 'review' ? '#' : `/developers/console/publish?edit=${id}`}
                                    onClick={(e) => {
                                        if (status === 'review') {
                                            e.preventDefault();
                                            toast({
                                                title: "Action Disabled",
                                                description: "This app is currently under review. Editing is disabled until the review is complete.",
                                                variant: "destructive"
                                            });
                                        }
                                    }}
                                    className={`flex items-center gap-3 w-full px-3 py-2.5 text-xs font-medium rounded-lg transition-colors ${status === 'review'
                                        ? "text-zinc-600 cursor-not-allowed"
                                        : "text-zinc-400 hover:text-white hover:bg-white/[0.08]"}`}
                                >
                                    <Edit2 className="w-3.5 h-3.5" /> Manage App
                                </Link>
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        navigator.clipboard.writeText(id);
                                        setCopied(true);
                                        setTimeout(() => setCopied(false), 2000);
                                    }}
                                    className="flex items-center gap-3 w-full px-3 py-2.5 text-xs font-medium text-zinc-400 hover:text-white hover:bg-white/[0.08] rounded-lg transition-colors"
                                >
                                    {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                                    {copied ? "Copied" : "Copy ID"}
                                </button>
                                <div className="h-px bg-white/[0.06] my-1 mx-2" />
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setOpen(false);
                                        onDeleteClick();
                                    }}
                                    className="flex items-center gap-3 w-full px-3 py-2.5 text-xs font-medium text-red-400 hover:bg-red-800/10 rounded-lg transition-colors"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    Delete
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between mt-6">
                <div className="flex flex-col gap-0.5 max-w-[60%]">
                    <span className="text-[10px] uppercase tracking-wider text-white font-semibold">Status</span>
                    <div className={`flex items-center gap-2 px-3 py-1.5 border w-fit mt-1 ${status === 'live' ? 'bg-green-500/10 border-green-500/20' :
                        status === 'review' ? 'bg-yellow-500/10 border-yellow-500/20' :
                            status === 'rejected' ? 'bg-red-500/10 border-red-500/20' :
                                status === 'terminated' ? 'bg-red-500/10 border-red-500/20' : 'bg-zinc-500/10 border-zinc-500/20'
                        }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${status === 'live' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' :
                            status === 'review' ? 'bg-yellow-500' :
                                status === 'rejected' ? 'bg-red-500' :
                                    status === 'terminated' ? 'bg-red-500' : 'bg-zinc-500'
                            }`} />
                        <span className={`text-[10px] font-bold uppercase tracking-wide ${status === 'live' ? 'text-green-400' :
                            status === 'review' ? 'text-yellow-400' :
                                status === 'rejected' ? 'text-red-400' :
                                    status === 'terminated' ? 'text-red-400' : 'text-zinc-400'
                            }`}>{status}</span>
                    </div>
                </div>

                <div className="flex flex-col gap-1 items-end relative">
                    {status === 'rejected' ? (
                        <>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onResolveClick();
                                }}
                                className="text-[12px] font-semibold text-white mt-5 hover:text-white/80 cursor-pointer transition-colors flex items-center gap-1 bg-transparent px-3 py-1.5 rounded-full"
                            >
                                <AlertCircle className="w-3 h-3" />
                                See Issues
                            </button>
                        </>
                    ) : status === 'terminated' ? (
                        <>
                            <button
                                onClick={(e) => {
                                    e.preventDefault(); // Do nothing, just show status
                                }}
                                className="text-[12px] font-semibold text-white mt-5 cursor-not-allowed flex items-center gap-1 bg-transparent px-3 py-1.5 rounded-full"
                            >
                                <AlertCircle className="w-3 h-3" />
                                Policy Violation
                            </button>
                        </>
                    ) : (
                        <>
                            <span className="text-[10px] uppercase tracking-wider text-zinc-600 font-semibold">Active Users</span>
                            <span className="text-sm font-medium text-white">{users}</span>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

/* =========================
   Activity Row
========================= */

function ActivityRow({ action, app, time, success, error }: any) {
    return (
        <div className="flex justify-between px-4 py-3 rounded-lg hover:bg-white/[0.02]">
            <span className="text-sm text-zinc-300">
                {action} · <span className="text-zinc-500">{app}</span>
            </span>
            <span className="text-xs text-zinc-600">{time}</span>
        </div>
    );
}

/* =========================
   Delete Modal
========================= */

function DeleteAppModal({ isOpen, app, onClose, onConfirm }: any) {
    const [value, setValue] = useState("");

    useEffect(() => {
        if (isOpen) setValue("");
    }, [isOpen]);

    if (!isOpen || !app) return null;

    return (
        <div className="fixed inset-0 z-50 flex bg-black/20 backdrop-blur-sm items-center justify-center">
            <div className="absolute inset-0 bg-black/20 cursor-pointer" onClick={onClose} />
            <div className="relative bg-transparent backdrop-blur-sm border border-white/10 rounded-3xl p-6 w-full max-w-md">
                <h3 className="text-lg font-semibold mb-2">
                    Delete Application?
                </h3>
                <p className="text-sm text-zinc-400 mb-4">
                    Type <b>DELETE</b> to confirm deletion of{" "}
                    <b>{app.name}</b>.
                </p>

                <input
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="DELETE"
                    className="w-full mb-4 rounded-full bg-white/5 border border-white/10 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white/10"
                />

                <div className="flex justify-end gap-3">
                    <button onClick={onClose} className="text-sm text-white">
                        Cancel
                    </button>
                    <button
                        disabled={value !== "DELETE"}
                        onClick={() => onConfirm(app.id)}
                        className="bg-red-800 px-4 py-2 rounded-full text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

/* =========================
   Rejection Details Modal
========================= */

function RejectionDetailsModal({ isOpen, app, onClose }: any) {
    if (!isOpen || !app) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="absolute inset-0" onClick={onClose} />
            <div className="relative bg-[#000] border border-white/5 rounded-3xl p-8 w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="flex items-start gap-4 mb-6">
                    <div className="w-10 h-10 rounded-full bg-red-600/20 flex items-center justify-center shrink-0">
                        <AlertCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-white mb-1">
                            Issue Details
                        </h3>
                        <p className="text-sm text-zinc-400">
                            Please review the issues below required to publish <b>{app.name}</b>.
                        </p>
                    </div>
                </div>

                <div className="bg-white/5 rounded-2xl p-6 mb-8 max-h-[60vh] overflow-y-auto">
                    <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
                        {app.rejectionReason || "No specific reason provided."}
                    </p>
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-full text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                    >
                        Close
                    </button>
                    <Link
                        href={`/developers/console/publish?edit=${app.id}`}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-black text-sm font-semibold hover:bg-zinc-200 transition-colors"
                    >
                        Resolve Issue
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
