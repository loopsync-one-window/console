"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
    getAllUsers,
    getActiveSubscribersDetailed,
    notifyAllUsers,
    notifyUser,
    deleteUser,
    getAdminUserDetails,
    AdminUser,
} from "@/lib/admin-api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Search, Mail, RefreshCcw, ShieldCheck, Users, Activity, Bell, Eye, EyeOff, Trash2, AlertTriangle, FileText } from "lucide-react";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export default function AdminZeroTrustPage() {
    const [isLocked, setIsLocked] = useState(true);
    const [pinInput, setPinInput] = useState("");
    const [showPin, setShowPin] = useState(false);
    const [pinError, setPinError] = useState(false);

    // Session Constants
    const SESSION_KEY = "admin_session_expiry";
    const SESSION_DURATION = 20 * 60 * 1000; // 20 minutes

    const [loading, setLoading] = useState(false); // Changed to false initially to avoid flash before auth check
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [activeSubscribers, setActiveSubscribers] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [refreshing, setRefreshing] = useState(false);
    const [hideTrialUsers, setHideTrialUsers] = useState(false);

    // Notification State
    const [notifyOpen, setNotifyOpen] = useState(false);
    const [notifyTarget, setNotifyTarget] = useState<"all" | string>("all"); // 'all' or userId
    const [notifyTitle, setNotifyTitle] = useState("");
    const [notifyMessage, setNotifyMessage] = useState("");
    const [sendingNotify, setSendingNotify] = useState(false);

    // Delete User State
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<AdminUser | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // User Details State
    const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
    const [selectedUserDetail, setSelectedUserDetail] = useState<any>(null);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [detailedUser, setDetailedUser] = useState<AdminUser | null>(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [usersData, subscribersData] = await Promise.all([
                getAllUsers(),
                getActiveSubscribersDetailed(),
            ]);
            setUsers(usersData);
            setActiveSubscribers(subscribersData);
        } catch (error) {
            console.error("Failed to fetch admin data", error);
            toast.error("Failed to fetch admin data. Ensure you have admin privileges.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const startSession = () => {
        const expiry = Date.now() + SESSION_DURATION;
        localStorage.setItem(SESSION_KEY, expiry.toString());
        setIsLocked(false);
        setPinError(false);
        fetchData();
        return expiry;
    };

    const verifyPin = async (input: string) => {
        const encoder = new TextEncoder();
        const data = encoder.encode(input);
        const hashBuffer = await crypto.subtle.digest("SHA-256", data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
        return hashHex === "95bd39f9ee4294791c975a42598ae9d85d24ad63a6febb2acffce48a981b1620";
    };

    // Unlock Handler
    const handleUnlock = async (e?: React.FormEvent) => {
        e?.preventDefault();
        const isValid = await verifyPin(pinInput);
        if (isValid) {
            startSession();
        } else {
            setPinError(true);
            setPinInput("");
            toast.error("Access Denied: Incorrect PIN");
        }
    };

    // Check session on mount
    useEffect(() => {
        const checkSession = () => {
            const expiryStr = localStorage.getItem(SESSION_KEY);
            if (expiryStr) {
                const expiry = parseInt(expiryStr, 10);
                if (Date.now() < expiry) {
                    setIsLocked(false);
                    fetchData();

                    // Set timeout to auto-lock when session expires
                    const remaining = expiry - Date.now();
                    const timer = setTimeout(() => {
                        setIsLocked(true);
                        localStorage.removeItem(SESSION_KEY);
                        toast.info("Session expired. Please sign in again.");
                    }, remaining);
                    return () => clearTimeout(timer);
                } else {
                    localStorage.removeItem(SESSION_KEY);
                }
            }
        };

        return checkSession();
    }, []);

    // Auto-submit on 6 digits if desired, or just use form
    useEffect(() => {
        const checkPin = async () => {
            if (pinInput.length === 6) {
                const isValid = await verifyPin(pinInput);
                if (isValid) {
                    startSession();
                }
            }
        };
        checkPin();
    }, [pinInput]);

    const handleRefresh = () => {
        setRefreshing(true);
        fetchData();
    };

    const filteredUsers = users
        .filter((u) =>
            u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.id.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const handleSendNotification = async () => {
        if (!notifyTitle || !notifyMessage) {
            toast.error("Please provide both title and message");
            return;
        }

        setSendingNotify(true);
        try {
            if (notifyTarget === "all") {
                await notifyAllUsers(notifyTitle, notifyMessage);
                toast.success("Broadcast notification sent successfully");
            } else {
                await notifyUser(notifyTarget, notifyTitle, notifyMessage);
                toast.success("User notification sent successfully");
            }
            setNotifyOpen(false);
            setNotifyTitle("");
            setNotifyMessage("");
        } catch (error) {
            console.error("Failed to send notification", error);
            toast.error("Failed to send notification");
        } finally {
            setSendingNotify(false);
        }
    };

    const openNotifyUser = (userId: string) => {
        setNotifyTarget(userId);
        setNotifyOpen(true);
    };

    const openNotifyAll = () => {
        setNotifyTarget("all");
        setNotifyOpen(true);
    };

    const confirmDeleteUser = (user: AdminUser) => {
        setUserToDelete(user);
        setDeleteOpen(true);
    };

    const handleDeleteUser = async () => {
        if (!userToDelete) return;
        setIsDeleting(true);
        try {
            await deleteUser(userToDelete.id);
            toast.success("User deleted successfully");
            setUsers(users.filter(u => u.id !== userToDelete.id));
            setDeleteOpen(false);
        } catch (error) {
            console.error("Failed to delete user", error);
            toast.error("Failed to delete user");
        } finally {
            setIsDeleting(false);
            setUserToDelete(null);
        }
    };

    const handleViewDetails = async (user: AdminUser) => {
        setDetailedUser(user);
        setViewDetailsOpen(true);
        setLoadingDetails(true);
        try {
            const data = await getAdminUserDetails(user.email);
            if (data.success) {
                setSelectedUserDetail(data.data);
            } else {
                toast.error("Failed to fetch details: " + (data.message || "Unknown error"));
            }
        } catch (e) {
            toast.error("Error fetching details");
        } finally {
            setLoadingDetails(false);
        }
    };

    if (isLocked) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
                <div className="w-full max-w-sm space-y-8 animate-in fade-in zoom-in-95 duration-500">
                    <div className="flex flex-col items-center gap-4">
                        <div className="h-16 w-16 relative flex items-center justify-center rounded-2xl bg-black border border-white/10 ring-1 ring-white/20">
                            <div className="h-14 w-14 relative">
                                <Image src="/icon.svg" alt="LoopSync Logo" fill className="object-contain" />
                            </div>
                        </div>
                        <div className="text-center space-y-1">
                            <h1 className="text-2xl font-semibold tracking-tight text-white">Security Check</h1>
                            <p className="text-sm text-neutral-500">Enter PIN to access console.</p>
                        </div>
                    </div>

                    <form onSubmit={handleUnlock} className="space-y-4">
                        <div className="relative">
                            <Input
                                type={showPin ? "text" : "password"}
                                placeholder="Enter 4-digit PIN"
                                value={pinInput}
                                onChange={(e) => {
                                    setPinError(false);
                                    if (e.target.value.length <= 6 && /^\d*$/.test(e.target.value)) {
                                        setPinInput(e.target.value);
                                    }
                                }}
                                className={`bg-neutral-900/50 rounded-full border-white/10 h-12 text-center text-lg tracking-[0.5em] font-mono placeholder:tracking-normal placeholder:font-sans transition-all focus-visible:ring-white/0 ${pinError ? "border-red-500/50 ring-red-500/20" : ""
                                    }`}
                                autoFocus
                            />
                            <button
                                type="button"
                                onClick={() => setShowPin(!showPin)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors p-1"
                            >
                                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        <Button
                            type="submit"
                            className="w-full h-11 bg-white rounded-full text-black hover:bg-neutral-200 font-semibold transition-all"
                            disabled={pinInput.length !== 6}
                        >
                            Unlock Console
                        </Button>
                    </form>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-black text-white">
                <Loader2 className="w-8 h-8 animate-spin text-neutral-500" />
            </div>
        );
    }

    const totalUsers = users.length;
    const totalActiveSubs = Array.isArray(activeSubscribers) ? activeSubscribers.length : 0;

    return (
        <div className="h-screen bg-black text-white font-sans selection:bg-teal-500/30 selection:text-teal-200 flex flex-col lg:flex-row overflow-hidden">
            {/* Left Sidebar Panel */}
            <aside className="w-full lg:w-72 xl:w-80 border-b lg:border-b-0 lg:border-r border-white/10 bg-neutral-900/40 backdrop-blur-xl p-6 lg:p-8 flex flex-col gap-8 z-20 shrink-0">
                {/* Header / Brand */}
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="h-12 w-40 relative flex items-center justify-center">
                            <Image src="/resources/logo.svg" alt="LoopSync Logo" fill className="object-contain" />
                        </div>
                    </div>
                    <p className="text-xs text-neutral-500 font-medium">Secured Zero Trust Admin Console</p>
                </div>

                {/* Stats Overview */}
                <div className="space-y-5">
                    <h2 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Overview</h2>
                    <div className="space-y-3">
                        <div className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors group">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs text-neutral-400 font-medium group-hover:text-neutral-300 transition-colors">Total Users</span>
                                <Users className="h-3.5 w-3.5 text-neutral-600 group-hover:text-white transition-colors" />
                            </div>
                            <div className="text-2xl font-bold text-white tracking-tight">{totalUsers}</div>
                        </div>

                        <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 hover:border-emerald-500/20 transition-colors group">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs text-emerald-500/70 font-medium group-hover:text-emerald-400 transition-colors">Active Subscribers</span>
                                <Activity className="h-3.5 w-3.5 text-emerald-600/70 group-hover:text-emerald-500 transition-colors" />
                            </div>
                            <div className="text-2xl font-bold text-emerald-400 tracking-tight">{totalActiveSubs}</div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-auto space-y-3 pt-6 border-t border-white/5">
                    <Button
                        onClick={openNotifyAll}
                        className="w-full justify-start bg-white text-black hover:bg-neutral-200 transition-all active:scale-95 duration-200 font-medium"
                    >
                        <Bell className="w-4 h-4 mr-2" />
                        Broadcast Alert
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className="w-full justify-start text-neutral-400 hover:text-white hover:bg-white/5 transition-all active:scale-95 duration-200"
                    >
                        <RefreshCcw className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
                        Refresh Data
                    </Button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 p-6 md:p-10 lg:p-12 min-w-0 bg-black h-full overflow-y-auto">
                <div className="max-w-6xl mx-auto space-y-8">

                    <Tabs defaultValue="users" className="space-y-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-semibold tracking-tight text-white">Database</h2>
                                <p className="text-sm text-neutral-500 mt-1">Manage users, view plans, and monitor activity.</p>
                            </div>

                            <div className="flex items-center gap-4 bg-neutral-900/50 p-1 rounded-lg border border-white/10">
                                <TabsList className="bg-transparent border-0 p-0 h-9">
                                    <TabsTrigger
                                        value="users"
                                        className="text-xs px-4 rounded-md data-[state=active]:bg-white/10 data-[state=active]:text-white text-neutral-400 transition-all"
                                    >
                                        All Users
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="subscribers"
                                        className="text-xs px-4 rounded-md data-[state=active]:bg-white/10 data-[state=active]:text-white text-neutral-400 transition-all"
                                    >
                                        Subscribers
                                    </TabsTrigger>
                                </TabsList>
                            </div>
                        </div>

                        {/* Search Bar (Floating) */}
                        <div className="relative group max-w-md">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-neutral-500 group-focus-within:text-white transition-colors" />
                            </div>
                            <Input
                                placeholder="Search by name, email, or ID..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 h-11 bg-neutral-900/30 border-white/10 text-sm text-white placeholder:text-neutral-600 focus-visible:ring-1 focus-visible:ring-white/20 focus-visible:bg-neutral-900/50 transition-all rounded-xl"
                            />
                        </div>

                        <TabsContent value="users" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <div className="rounded-2xl border border-white/10 bg-neutral-900/20 backdrop-blur-sm overflow-hidden shadow-2xl shadow-black/40">
                                <Table>
                                    <TableHeader className="bg-neutral-900/80 border-b border-white/5">
                                        <TableRow className="border-none hover:bg-transparent">
                                            <TableHead className="text-neutral-400 font-medium pl-6 py-4">User Details</TableHead>
                                            <TableHead className="text-neutral-400 font-medium">Status</TableHead>
                                            <TableHead className="text-neutral-400 font-medium">Account</TableHead>
                                            <TableHead className="text-neutral-400 font-medium">Joined</TableHead>
                                            <TableHead className="text-right text-neutral-400 font-medium pr-6">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredUsers.length === 0 ? (
                                            <TableRow className="border-none hover:bg-transparent">
                                                <TableCell colSpan={5} className="h-48 text-center text-neutral-600">
                                                    No users found matching your search.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            filteredUsers.map((user) => (
                                                <TableRow key={user.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors group">
                                                    <TableCell className="pl-6 py-4">
                                                        <div className="flex flex-col">
                                                            <span className="font-medium text-white group-hover:text-teal-200 transition-colors">{user.fullName}</span>
                                                            <span className="text-xs text-neutral-500">{user.email}</span>
                                                            <span className="text-[9px] text-neutral-700 font-mono mt-1 uppercase tracking-wider">{user.id}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${user.status === "active"
                                                            ? "bg-emerald-500/5 text-emerald-400 border-emerald-500/10"
                                                            : "bg-neutral-800/50 text-neutral-400 border-neutral-700/30"
                                                            }`}>
                                                            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${user.status === "active" ? "bg-emerald-400" : "bg-neutral-500"}`}></span>
                                                            {user.status}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="text-sm text-neutral-300 capitalize">{user.accountType}</span>
                                                    </TableCell>
                                                    <TableCell className="text-neutral-500 text-sm">
                                                        {new Date(user.createdAt).toLocaleDateString(undefined, {
                                                            month: 'short', day: 'numeric', year: 'numeric'
                                                        })}
                                                    </TableCell>
                                                    <TableCell className="text-right pr-6">
                                                        <div className="flex items-center justify-end gap-1">
                                                            {/* Non-subscriber Indicator */}
                                                            {(() => {
                                                                const isSubscribed = activeSubscribers.some(sub => sub.user.id === user.id);
                                                                if (!isSubscribed) {
                                                                    const daysSince = Math.floor((new Date().getTime() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24));
                                                                    return (
                                                                        <div className="flex items-center gap-2 mr-2">
                                                                            <TooltipProvider>
                                                                                <Tooltip>
                                                                                    <TooltipTrigger asChild>
                                                                                        <div className="w-2 h-2 rounded-full bg-yellow-500 cursor-help" />
                                                                                    </TooltipTrigger>
                                                                                    <TooltipContent className="bg-white border-white/10 font-semibold rounded-full text-black text-xs">
                                                                                        <p>No Active Subscription</p>
                                                                                    </TooltipContent>
                                                                                </Tooltip>
                                                                            </TooltipProvider>
                                                                            <span className="text-xs text-neutral-500 font-semibold">{daysSince}d</span>
                                                                        </div>
                                                                    );
                                                                }
                                                                return null;
                                                            })()}

                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => handleViewDetails(user)}
                                                                className="text-neutral-500 hover:text-white hover:bg-white/10 h-8 w-8 rounded-full"
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Button>

                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => openNotifyUser(user.id)}
                                                                className="text-neutral-500 hover:text-white hover:bg-white/10 h-8 w-8 rounded-full"
                                                            >
                                                                <Mail className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => confirmDeleteUser(user)}
                                                                className="text-neutral-500 hover:text-red-400 hover:bg-red-500/10 h-8 w-8 rounded-full"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </TabsContent>

                        <TabsContent value="subscribers" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <div className="flex items-center justify-between mb-4 px-1">
                                <div className="text-sm text-neutral-400 font-medium">
                                    Displaying <span className="text-white">{activeSubscribers.filter(s => hideTrialUsers ? !s.isFreeTrial : true).length}</span> results
                                </div>
                                <div className="flex items-center gap-2 bg-neutral-900/50 px-3 py-1.5 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
                                    <Checkbox
                                        id="hideTrial"
                                        checked={hideTrialUsers}
                                        onCheckedChange={(c) => setHideTrialUsers(c === true)}
                                        className="border-white/20 data-[state=checked]:bg-white data-[state=checked]:text-black"
                                    />
                                    <Label htmlFor="hideTrial" className="text-xs text-neutral-400 font-medium cursor-pointer">Hide Trial Users</Label>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-neutral-900/20 backdrop-blur-sm overflow-hidden shadow-2xl shadow-black/40">
                                <Table>
                                    <TableHeader className="bg-neutral-900/80 border-b border-white/5">
                                        <TableRow className="border-none hover:bg-transparent">
                                            <TableHead className="text-neutral-400 font-medium pl-6 py-4">Subscriber</TableHead>
                                            <TableHead className="text-neutral-400 font-medium">Plan Details</TableHead>
                                            <TableHead className="text-neutral-400 font-medium">Billing</TableHead>
                                            <TableHead className="text-neutral-400 font-medium">Renewal</TableHead>
                                            <TableHead className="text-neutral-400 font-medium is-right">Status</TableHead>
                                            <TableHead className="text-right text-neutral-400 font-medium pr-6">Contact</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {activeSubscribers
                                            .filter(sub => hideTrialUsers ? !sub.isFreeTrial : true)
                                            .length === 0 ? (
                                            <TableRow className="border-none hover:bg-transparent">
                                                <TableCell colSpan={6} className="h-48 text-center text-neutral-600">
                                                    No subscribers found matching filters.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            activeSubscribers
                                                .filter(sub => hideTrialUsers ? !sub.isFreeTrial : true)
                                                .map((sub, idx) => (
                                                    <TableRow key={idx} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors group">
                                                        <TableCell className="pl-6 py-4">
                                                            <div className="flex flex-col">
                                                                <span className="font-medium text-white group-hover:text-teal-200 transition-colors">{sub.user.fullName}</span>
                                                                <span className="text-xs text-neutral-500">{sub.user.email}</span>
                                                                {sub.isFreeTrial && (
                                                                    <span className="inline-flex mt-1 text-[10px] font-bold text-blue-400 tracking-wide uppercase">
                                                                        Trial Active
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center text-xs font-bold text-neutral-300">
                                                                    {sub.plan.code.charAt(0)}
                                                                </div>
                                                                <div>
                                                                    <div className="text-sm text-neutral-200">{sub.plan.displayName || sub.plan.name}</div>
                                                                    <div className="text-[10px] text-neutral-500 font-mono">{sub.plan.code}</div>
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex flex-col">
                                                                <span className="text-sm text-neutral-300">
                                                                    {sub.plan.currency} <span className="font-semibold text-white">{(sub.amountPaise / 100).toFixed(2)}</span>
                                                                </span>
                                                                <span className="text-xs text-neutral-500 capitalize">{sub.plan.billingCycle.toLowerCase()}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className={`text-sm font-medium ${sub.daysRemaining < 3 ? "text-rose-400" : "text-neutral-300"}`}>
                                                                {sub.daysRemaining} days left
                                                            </div>
                                                            <div className="text-xs text-neutral-500">
                                                                Expires {new Date(sub.expiresAt).toLocaleDateString()}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-500 border border-emerald-500/20">
                                                                Active
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-right pr-6">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => openNotifyUser(sub.user.id)}
                                                                className="text-neutral-500 hover:text-white hover:bg-white/10 h-8 w-8 rounded-full"
                                                            >
                                                                <Mail className="h-4 w-4" />
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Notification Dialog */}
                <Dialog open={notifyOpen} onOpenChange={setNotifyOpen}>
                    <DialogContent className="sm:max-w-[500px] bg-[#0A0A0A]/50 rounded-3xl border-white/10 text-white shadow-2xl p-6 gap-6">
                        <DialogHeader>
                            <DialogTitle className="text-lg font-semibold text-white">Send Notification</DialogTitle>
                            <DialogDescription className="text-neutral-400 text-sm">
                                {notifyTarget === 'all'
                                    ? "Broadcasting message to all registered system users."
                                    : "Sending direct message to selected user."}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-5">
                            <div className="grid gap-2">
                                <Label htmlFor="title" className="text-neutral-300 text-xs font-medium uppercase tracking-wider mt-4">Title</Label>
                                <Input
                                    id="title"
                                    placeholder="Enter subject..."
                                    value={notifyTitle}
                                    onChange={(e) => setNotifyTitle(e.target.value)}
                                    className="bg-transparent border-white/10 text-white placeholder:text-neutral-600 focus-visible:ring-1 focus-visible:ring-white/20 h-10 rounded-lg"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="message" className="text-neutral-300 text-xs font-medium uppercase tracking-wider">Message</Label>
                                <Textarea
                                    id="message"
                                    placeholder="Type your message here..."
                                    className="min-h-[170px] bg-transparent border-white/10 text-white placeholder:text-neutral-600 focus-visible:ring-1 focus-visible:ring-white/20 resize-none rounded-lg p-3 text-sm leading-relaxed"
                                    value={notifyMessage}
                                    onChange={(e) => setNotifyMessage(e.target.value)}
                                />
                            </div>
                        </div>
                        <DialogFooter className="gap-3 sm:gap-0 mt-4">
                            <Button
                                variant="outline"
                                onClick={() => setNotifyOpen(false)}
                                className="bg-transparent border-white/10 text-neutral-400 hover:bg-white/5 mr-3 hover:text-white rounded-full"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSendNotification}
                                disabled={sendingNotify}
                                className="bg-white text-black hover:bg-neutral-200 rounded-full font-medium px-6"
                            >
                                {sendingNotify ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Sending
                                    </>
                                ) : (
                                    "Send"
                                )}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* User Details Modal */}
                <Dialog open={viewDetailsOpen} onOpenChange={setViewDetailsOpen}>
                    <DialogContent className="sm:max-w-[700px] bg-[#0A0A0A] rounded-3xl border-white/10 text-white shadow-2xl p-6 gap-6 outline-none">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-3 text-lg font-semibold text-white">
                                <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white font-bold">
                                    {detailedUser?.fullName?.charAt(0) || 'U'}
                                </div>
                                <div>
                                    <div>{detailedUser?.fullName}</div>
                                    <div className="text-xs text-neutral-500 font-normal">{detailedUser?.email}</div>
                                </div>
                            </DialogTitle>
                        </DialogHeader>

                        {loadingDetails ? (
                            <div className="flex h-60 items-center justify-center">
                                <Loader2 className="h-8 w-8 animate-spin text-neutral-500" />
                            </div>
                        ) : (
                            selectedUserDetail && (
                                <div className="space-y-6">
                                    {/* Credits Grid */}
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center justify-center text-center">
                                            <div className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2">Total Usage</div>
                                            <div className="text-2xl font-bold text-white">₹{(selectedUserDetail.usage?.total / 100).toLocaleString()}</div>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center justify-center text-center">
                                            <div className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2">Free Credits</div>
                                            <div className="text-2xl font-bold text-white">₹{(selectedUserDetail.credits?.free / 100).toLocaleString()}</div>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center justify-center text-center">
                                            <div className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2">Prepaid Credits</div>
                                            <div className="text-2xl font-bold text-white">₹{(selectedUserDetail.credits?.prepaid / 100).toLocaleString()}</div>
                                        </div>
                                    </div>

                                    {/* Invoices */}
                                    <div>
                                        <h3 className="text-sm font-medium text-neutral-300 mb-3 flex items-center gap-2">
                                            <FileText className="w-4 h-4 text-neutral-500" />
                                            Latest Invoices / Transactions
                                        </h3>
                                        <div className="rounded-xl border border-white/10 bg-black/40 overflow-hidden max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                                            {!selectedUserDetail.invoices || selectedUserDetail.invoices.length === 0 ? (
                                                <div className="p-8 text-center text-sm text-neutral-500">
                                                    No recent invoice or transaction history found.
                                                </div>
                                            ) : (
                                                <table className="w-full text-left text-sm">
                                                    <thead className="bg-white/5 text-neutral-400 font-medium text-xs uppercase tracking-wider sticky top-0 backdrop-blur-md">
                                                        <tr>
                                                            <th className="px-4 py-3 font-medium">Date</th>
                                                            <th className="px-4 py-3 font-medium">Amount</th>
                                                            <th className="px-4 py-3 font-medium">Description</th>
                                                            <th className="px-4 py-3 font-medium text-right">Reference</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-white/5">
                                                        {selectedUserDetail.invoices.map((inv: any, i: number) => (
                                                            <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                                                                <td className="px-4 py-3 text-neutral-400 whitespace-nowrap text-xs">
                                                                    {new Date(inv.createdAt).toLocaleString()}
                                                                </td>
                                                                <td className={`px-4 py-3 font-medium whitespace-nowrap ${inv.amount > 0 ? "text-emerald-400" : "text-white"
                                                                    }`}>
                                                                    {inv.amount > 0 ? '+' : ''}{(inv.amount / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                                                                </td>
                                                                <td className="px-4 py-3 text-neutral-300">
                                                                    {inv.description || inv.reason || 'N/A'}
                                                                </td>
                                                                <td className="px-4 py-3 text-right text-neutral-500 text-xs font-mono">
                                                                    {inv.referenceId || '-'}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        )}
                    </DialogContent>
                </Dialog>

                {/* Delete Confirmation Dialog */}
                <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                    <DialogContent className="sm:max-w-[425px] bg-[#0A0A0A] rounded-3xl border-white/10 text-white shadow-2xl p-6 gap-6">
                        <DialogHeader>
                            <div className="mx-auto w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-2">
                                <AlertTriangle className="h-6 w-6 text-red-500" />
                            </div>
                            <DialogTitle className="text-center text-xl font-semibold text-white">Delete User?</DialogTitle>
                            <DialogDescription className="text-center text-neutral-400 text-sm">
                                Are you sure you want to delete <span className="text-white font-bold">{userToDelete?.fullName}</span>. This action cannot be undone and will remove all associated data.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="grid grid-cols-2 gap-3 mt-2">
                            <Button
                                variant="outline"
                                onClick={() => setDeleteOpen(false)}
                                className="bg-transparent border-white/10 text-neutral-400 hover:bg-white/5 hover:text-white rounded-full w-full"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleDeleteUser}
                                disabled={isDeleting}
                                className="bg-red-800 hover:bg-red-900 text-white rounded-full w-full"
                            >
                                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Delete"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </main>
        </div>
    );
}
