"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
    getAllUsers,
    getActiveSubscribersDetailed,
    getAllDevelopers,
    deleteDeveloperAdmin,
    notifyAllUsers,
    notifyUser,
    deleteUser,
    deleteUsersBulk,
    getAdminUserDetails,
    getAdminAppsForReview,
    getAdminAppDetails,
    adminApproveApp,
    adminRejectApp,
    adminTerminateApp,
    AdminUser,
    Developer,
    ReviewedApp,
} from "@/lib/admin-api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Search, Mail, RefreshCcw, ShieldCheck, Users, Activity, Bell, Eye, EyeOff, Trash2, AlertTriangle, FileText, Code2, CheckCircle2, AppWindow, AlertCircle, LogOut } from "lucide-react";
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

import { useRouter } from "next/navigation";

export default function AdminZeroTrustPage() {
    const router = useRouter();
    const [isLocked, setIsLocked] = useState(true);
    const [pinInput, setPinInput] = useState("");
    const [showPin, setShowPin] = useState(false);
    const [pinError, setPinError] = useState(false);

    const [currentAdmin, setCurrentAdmin] = useState<{ fullName: string; email: string; role: string } | null>(null);

    // Session Constants
    const SESSION_KEY = "admin_session_expiry";
    const SESSION_DURATION = 20 * 60 * 1000; // 20 minutes

    useEffect(() => {
        const token = localStorage.getItem("admin.accessToken");
        if (!token) {
            router.push("/admin/auth");
        }
    }, [router]);

    const [loading, setLoading] = useState(false); // Changed to false initially to avoid flash before auth check
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [developers, setDevelopers] = useState<Developer[]>([]);
    const [activeSubscribers, setActiveSubscribers] = useState<any[]>([]);
    const [reviewApps, setReviewApps] = useState<ReviewedApp[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [refreshing, setRefreshing] = useState(false);
    const [hideTrialUsers, setHideTrialUsers] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

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
    const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
    const [isBulkDeleting, setIsBulkDeleting] = useState(false);

    // Delete Developer State
    const [deleteDevOpen, setDeleteDevOpen] = useState(false);
    const [devToDelete, setDevToDelete] = useState<Developer | null>(null);
    const [isDeletingDev, setIsDeletingDev] = useState(false);

    // User Details State
    const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
    const [selectedUserDetail, setSelectedUserDetail] = useState<any>(null);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [detailedUser, setDetailedUser] = useState<AdminUser | null>(null);

    // Developer Details State
    const [viewDevDetailsOpen, setViewDevDetailsOpen] = useState(false);
    const [detailedDev, setDetailedDev] = useState<Developer | null>(null);

    const fetchData = async () => {
        setLoading(true);
        console.log("Fetching admin data...");
        try {
            // Fetch users
            try {
                const usersData = await getAllUsers();
                console.log("Users fetched:", usersData);
                setUsers(usersData || []);
            } catch (e) {
                console.error("Failed to fetch users", e);
                toast.error("Failed to fetch users");
            }

            // Fetch subscribers
            try {
                const subscribersData = await getActiveSubscribersDetailed();
                console.log("Subscribers fetched:", subscribersData);
                setActiveSubscribers(subscribersData || []);
            } catch (e) {
                console.error("Failed to fetch subscribers", e);
            }

            // Fetch developers
            try {
                const developersData = await getAllDevelopers();
                console.log("Developers fetched:", developersData);
                setDevelopers(developersData || []);
            } catch (e) {
                console.error("Failed to fetch developers", e);
            }

            // Fetch apps
            try {
                const appsData = await getAdminAppsForReview();
                console.log("Apps fetched:", appsData);
                setReviewApps(appsData || []);
            } catch (e) {
                console.error("Failed to fetch apps", e);
            }

        } catch (error) {
            console.error("Critical failure in fetching data", error);
            toast.error("Failed to fetch admin data.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const confirmDeleteDev = (dev: Developer) => {
        setDevToDelete(dev);
        setDeleteDevOpen(true);
    };

    const handleDeleteDev = async () => {
        if (!devToDelete) return;
        setIsDeletingDev(true);
        try {
            await deleteDeveloperAdmin(devToDelete.id);
            toast.success("Developer deleted successfully");
            setDevelopers(developers.filter(d => d.id !== devToDelete.id));
            setDeleteDevOpen(false);
        } catch (error) {
            console.error("Failed to delete developer", error);
            toast.error("Failed to delete developer");
        } finally {
            setIsDeletingDev(false);
            setDevToDelete(null);
        }
    };

    const handleViewDevDetails = (dev: Developer) => {
        setDetailedDev(dev);
        setViewDevDetailsOpen(true);
    };

    // Review App State
    const [reviewAppOpen, setReviewAppOpen] = useState(false);
    const [selectedReviewApp, setSelectedReviewApp] = useState<any>(null); // Full details
    const [rejectReason, setRejectReason] = useState("");
    const [showRejectInput, setShowRejectInput] = useState(false);
    const [processingReview, setProcessingReview] = useState(false);

    const handleOpenReview = async (app: ReviewedApp) => {
        setProcessingReview(true);
        try {
            const details = await getAdminAppDetails(app.id);
            setSelectedReviewApp(details);
            setReviewAppOpen(true);
            setShowRejectInput(false);
            setRejectReason("");
        } catch (e) {
            toast.error("Failed to load app details");
        } finally {
            setProcessingReview(false);
        }
    };

    const handleApproveApp = async () => {
        if (!selectedReviewApp) return;
        setProcessingReview(true);
        try {
            await adminApproveApp(selectedReviewApp.id);
            toast.success("App approved successfully");
            setReviewApps(prev => prev.filter(a => a.id !== selectedReviewApp.id));
            setReviewAppOpen(false);
        } catch (e) {
            toast.error("Failed to approve app");
        } finally {
            setProcessingReview(false);
        }
    };

    const handleRejectApp = async () => {
        if (!selectedReviewApp) return;
        if (!showRejectInput) {
            setShowRejectInput(true);
            return;
        }
        if (!rejectReason.trim()) {
            toast.error("Please provide a rejection reason");
            return;
        }

        setProcessingReview(true);
        try {
            await adminRejectApp(selectedReviewApp.id, rejectReason);
            toast.success("App rejected");
            setReviewApps(prev => prev.filter(a => a.id !== selectedReviewApp.id));
            setReviewAppOpen(false);
        } catch (e) {
            toast.error("Failed to reject app");
        } finally {
            setProcessingReview(false);
        }
    };

    const handleTerminateApp = async () => {
        if (!selectedReviewApp) return;
        setProcessingReview(true);
        try {
            await adminTerminateApp(selectedReviewApp.id);
            toast.success("App Terminated", {
                description: "The application has been terminated successfully.",
            });
            setReviewApps(prev => prev.filter(a => a.id !== selectedReviewApp.id));
            setReviewAppOpen(false);
        } catch (error) {
            console.error(error);
            toast.error("Error", {
                description: "Failed to terminate app.",
            });
        } finally {
            setProcessingReview(false);
        }
    };

    const filteredDevelopers = developers
        .filter((d) =>
            d.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            d.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            d.id.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

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
    // Check session on mount
    useEffect(() => {
        const checkSession = () => {
            const expiryStr = localStorage.getItem(SESSION_KEY);
            if (expiryStr) {
                const expiry = parseInt(expiryStr, 10);
                if (Date.now() < expiry) {
                    setIsLocked(false);
                    fetchData(); // Fetch data if session is valid

                    // Restore Admin User Info
                    const storedAdmin = localStorage.getItem("admin.user");
                    if (storedAdmin) {
                        try {
                            setCurrentAdmin(JSON.parse(storedAdmin));
                        } catch (e) {
                            console.error("Failed to parse admin user");
                        }
                    }

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

        checkSession();
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

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedUsers(filteredUsers.map(u => u.id));
        } else {
            setSelectedUsers([]);
        }
    };

    const handleSelectUser = (userId: string, checked: boolean) => {
        if (checked) {
            setSelectedUsers(prev => [...prev, userId]);
        } else {
            setSelectedUsers(prev => prev.filter(id => id !== userId));
        }
    };

    const confirmBulkDelete = () => {
        setBulkDeleteOpen(true);
    };

    const handleBulkDelete = async () => {
        setIsBulkDeleting(true);
        try {
            await deleteUsersBulk(selectedUsers);
            toast.success(`${selectedUsers.length} users deleted successfully`);
            setUsers(users.filter(u => !selectedUsers.includes(u.id)));
            setSelectedUsers([]);
            setBulkDeleteOpen(false);
        } catch (error) {
            console.error("Failed to delete users", error);
            toast.error("Failed to delete users");
        } finally {
            setIsBulkDeleting(false);
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

    const handleLogout = () => {
        localStorage.removeItem("admin.accessToken");
        localStorage.removeItem("admin.user");
        localStorage.removeItem(SESSION_KEY);
        setCurrentAdmin(null);
        setIsLocked(true);
        router.push("/admin/auth");
        toast.success("Logged out successfully");
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
    const totalDevelopers = developers.length;
    const totalActiveDevs = developers.filter(d => d.status === 'ACTIVE').length;

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
                        <div className="p-4 rounded-xl bg-transparent border border-white/5 hover:border-white/10 transition-colors group">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs text-neutral-400 font-medium group-hover:text-neutral-300 transition-colors">Total Users</span>
                                <Users className="h-3.5 w-3.5 text-neutral-600 group-hover:text-white transition-colors" />
                            </div>
                            <div className="text-2xl font-bold text-white tracking-tight">{totalUsers}</div>
                        </div>

                        <div className="p-4 rounded-xl bg-transparent border border-white/5 hover:border-white/10 transition-colors group">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs text-emerald-500/70 font-medium group-hover:text-emerald-400 transition-colors">Active Subscribers</span>
                                <Activity className="h-3.5 w-3.5 text-emerald-600/70 group-hover:text-emerald-500 transition-colors" />
                            </div>
                            <div className="text-2xl font-bold text-emerald-400 tracking-tight">{totalActiveSubs}</div>
                        </div>

                        {/* Developers Stats */}
                        <div className="rounded-xl bg-transparent border border-white/5 hover:border-white/10 transition-colors group overflow-hidden">
                            <div className="flex items-stretch divide-x divide-white/10">
                                <div className="flex-1 p-4">
                                    <div className="flex items-center justify-between mb-2 gap-2">
                                        <span className="text-xs text-neutral-400 font-medium group-hover:text-neutral-300 transition-colors">Devs</span>
                                        <Code2 className="h-3.5 w-3.5 text-neutral-600 group-hover:text-white transition-colors" />
                                    </div>
                                    <div className="text-2xl font-bold text-white tracking-tight">{totalDevelopers}</div>
                                </div>
                                <div className="flex-1 p-4 bg-white/[0.02]">
                                    <div className="flex items-center justify-between mb-2 gap-2">
                                        <span className="text-xs text-neutral-400 font-medium group-hover:text-emerald-400 transition-colors">Active</span>
                                        <CheckCircle2 className="h-3.5 w-3.5 text-neutral-600 group-hover:text-emerald-500 transition-colors" />
                                    </div>
                                    <div className="text-2xl font-bold text-white tracking-tight">{totalActiveDevs}</div>
                                </div>
                            </div>
                        </div>

                        {/* Apps Stats */}
                        <div className="rounded-xl bg-whitetransparent border border-white/5 hover:border-white/10 transition-colors group overflow-hidden">
                            <div className="flex items-stretch divide-x divide-white/10">
                                <div className="flex-1 p-4">
                                    <div className="flex items-center justify-between mb-2 gap-2">
                                        <span className="text-xs text-neutral-400 font-medium group-hover:text-neutral-300 transition-colors">Apps</span>
                                        <AppWindow className="h-3.5 w-3.5 text-neutral-600 group-hover:text-white transition-colors" />
                                    </div>
                                    <div className="text-2xl font-bold text-white tracking-tight">{developers.reduce((acc, dev) => acc + (dev._count?.apps || 0), 0)}</div>
                                </div>
                                <div className="flex-1 p-4 bg-white/[0.02]">
                                    <div className="flex items-center justify-between mb-2 gap-2">
                                        <span className="text-xs text-neutral-400 font-medium group-hover:text-yellow-400 transition-colors">Review</span>
                                        <AlertCircle className="h-3.5 w-3.5 text-neutral-600 group-hover:text-yellow-500 transition-colors" />
                                    </div>
                                    <div className="text-2xl font-bold text-white tracking-tight">{reviewApps.length}</div>
                                </div>
                            </div>
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

                    {/* Admin User Profile */}
                    {currentAdmin && (
                        <div className="pt-4 mt-2 border-t border-white/5 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02]">
                                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-neutral-800 to-black flex items-center justify-center shrink-0">
                                    <span className="text-xs font-bold text-white">
                                        {currentAdmin.fullName.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-semibold text-white truncate">
                                        {currentAdmin.fullName}
                                    </p>
                                    <p className="text-[10px] text-neutral-500 truncate">
                                        {currentAdmin.email}
                                    </p>
                                </div>
                                {/* <div className="px-2 py-0.5 rounded-full bg-white/5 border border-white/5">
                                    <span className="text-[9px] font-semibold relative bottom-0.5 text-neutral-400 uppercase">
                                        {currentAdmin.role}
                                    </span>
                                </div> */}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleLogout}
                                    className="h-7 w-7 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-neutral-800 transition-colors ml-1"
                                    title="Logout"
                                >
                                    <LogOut className="h-3.5 w-3.5" />
                                </Button>
                            </div>
                        </div>
                    )}
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
                                    <TabsTrigger
                                        value="developers"
                                        className="text-xs px-4 rounded-md data-[state=active]:bg-white/10 data-[state=active]:text-white text-neutral-400 transition-all"
                                    >
                                        Developers
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="review"
                                        className="text-xs px-4 rounded-md data-[state=active]:bg-white/10 data-[state=active]:text-white text-neutral-400 transition-all"
                                    >
                                        Review Apps
                                    </TabsTrigger>
                                </TabsList>
                            </div>
                        </div>

                        {/* Search Bar (Floating) & Bulk Actions */}
                        <div className="flex items-center justify-between">
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

                            {selectedUsers.length > 0 && (
                                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                                    <Button
                                        onClick={confirmBulkDelete}
                                        variant="destructive"
                                        className="rounded-full bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20"
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Delete {selectedUsers.length} Selected
                                    </Button>
                                </div>
                            )}
                        </div>

                        <TabsContent value="users" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <div className="rounded-2xl border border-white/10 bg-neutral-900/20 backdrop-blur-sm overflow-hidden shadow-2xl shadow-black/40">
                                <Table>
                                    <TableHeader className="bg-neutral-900/80 border-b border-white/5">
                                        <TableRow className="border-none hover:bg-transparent">
                                            <TableHead className="w-12 pl-6 py-4">
                                                <Checkbox
                                                    checked={filteredUsers.length > 0 && selectedUsers.length === filteredUsers.length}
                                                    onCheckedChange={(checked) => handleSelectAll(!!checked)}
                                                    className="border-white/20 data-[state=checked]:bg-white data-[state=checked]:text-black"
                                                />
                                            </TableHead>
                                            <TableHead className="text-neutral-400 font-medium">User Details</TableHead>
                                            <TableHead className="text-neutral-400 font-medium">Status</TableHead>
                                            <TableHead className="text-neutral-400 font-medium">Account</TableHead>
                                            <TableHead className="text-neutral-400 font-medium">Joined</TableHead>
                                            <TableHead className="text-right text-neutral-400 font-medium pr-6">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredUsers.length === 0 ? (
                                            <TableRow className="border-none hover:bg-transparent">
                                                <TableCell colSpan={6} className="h-48 text-center text-neutral-600">
                                                    No users found matching your search.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            filteredUsers.map((user) => (
                                                <TableRow key={user.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors group">
                                                    <TableCell className="pl-6 py-4">
                                                        <Checkbox
                                                            checked={selectedUsers.includes(user.id)}
                                                            onCheckedChange={(checked) => handleSelectUser(user.id, !!checked)}
                                                            className="border-white/20 data-[state=checked]:bg-white data-[state=checked]:text-black"
                                                        />
                                                    </TableCell>
                                                    <TableCell>
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

                        <TabsContent value="developers" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <div className="rounded-2xl border border-white/10 bg-neutral-900/20 backdrop-blur-sm overflow-hidden shadow-2xl shadow-black/40">
                                <Table>
                                    <TableHeader className="bg-neutral-900/80 border-b border-white/5">
                                        <TableRow className="border-none hover:bg-transparent">
                                            <TableHead className="text-neutral-400 font-medium pl-6 py-4">Developer</TableHead>
                                            <TableHead className="text-neutral-400 font-medium">Status</TableHead>
                                            <TableHead className="text-neutral-400 font-medium">Verified</TableHead>
                                            <TableHead className="text-neutral-400 font-medium">Joined</TableHead>
                                            <TableHead className="text-right text-neutral-400 font-medium pr-6">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredDevelopers.length === 0 ? (
                                            <TableRow className="border-none hover:bg-transparent">
                                                <TableCell colSpan={5} className="h-48 text-center text-neutral-600">
                                                    No developers found matching your search.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            filteredDevelopers.map((dev) => (
                                                <TableRow key={dev.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors group">
                                                    <TableCell className="pl-6 py-4">
                                                        <div className="flex flex-col">
                                                            <span className="font-medium text-white group-hover:text-teal-200 transition-colors">{dev.fullName}</span>
                                                            <span className="text-xs text-neutral-500">{dev.email}</span>
                                                            <span className="text-[9px] text-neutral-700 font-mono mt-1 uppercase tracking-wider">{dev.id}</span>
                                                            {dev.license && <span className="text-[9px] text-teal-500/70 font-mono mt-0.5">{dev.license}</span>}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${dev.status === "ACTIVE"
                                                            ? "bg-emerald-500/5 text-emerald-400 border-emerald-500/10"
                                                            : "bg-neutral-800/50 text-neutral-400 border-neutral-700/30"
                                                            }`}>
                                                            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${dev.status === "ACTIVE" ? "bg-emerald-400" : "bg-neutral-500"}`}></span>
                                                            {dev.status}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        {dev.verifiedBadge ? (
                                                            <div className="flex items-center gap-1 text-blue-400">
                                                                <CheckCircle2 className="w-4 h-4" />
                                                                <span className="text-sm font-medium">Verified</span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-sm text-neutral-500">Unverified</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-neutral-500 text-sm">
                                                        {new Date(dev.createdAt).toLocaleDateString(undefined, {
                                                            month: 'short', day: 'numeric', year: 'numeric'
                                                        })}
                                                    </TableCell>
                                                    <TableCell className="text-right pr-6">
                                                        <div className="flex items-center justify-end gap-1">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => handleViewDevDetails(dev)}
                                                                className="text-neutral-500 hover:text-white hover:bg-white/10 h-8 w-8 rounded-full"
                                                            >
                                                                <Code2 className="h-4 w-4" />
                                                            </Button>

                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => confirmDeleteDev(dev)}
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

                        <TabsContent value="review" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <div className="rounded-2xl border border-white/10 bg-neutral-900/20 backdrop-blur-sm overflow-hidden shadow-2xl shadow-black/40">
                                <Table>
                                    <TableHeader className="bg-neutral-900/80 border-b border-white/5">
                                        <TableRow className="border-none hover:bg-transparent">
                                            <TableHead className="text-neutral-400 font-medium pl-6 py-4">Application</TableHead>
                                            <TableHead className="text-neutral-400 font-medium">Developer</TableHead>
                                            <TableHead className="text-neutral-400 font-medium">Version</TableHead>
                                            <TableHead className="text-neutral-400 font-medium">Status</TableHead>
                                            <TableHead className="text-right text-neutral-400 font-medium pr-6">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {reviewApps.length === 0 ? (
                                            <TableRow className="border-none hover:bg-transparent">
                                                <TableCell colSpan={5} className="h-48 text-center text-neutral-600">
                                                    No apps pending review.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            reviewApps.map((app) => (
                                                <TableRow key={app.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors group">
                                                    <TableCell className="pl-6 py-4">
                                                        <div className="flex flex-col">
                                                            <span className="font-medium text-white group-hover:text-teal-200 transition-colors">{app.name}</span>
                                                            <span className="text-[9px] text-neutral-700 font-mono mt-1 uppercase tracking-wider">{app.id}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex flex-col">
                                                            <span className="text-sm text-neutral-300">{app.developer.fullName}</span>
                                                            <span className="text-xs text-neutral-600">{app.developer.email}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="text-sm text-neutral-400 font-mono">{app.version || '1.0.0'}</span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border bg-yellow-500/5 text-yellow-500 border-yellow-500/10">
                                                            <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-yellow-500 animate-pulse"></span>
                                                            Review
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right pr-6">
                                                        <Button
                                                            size="sm"
                                                            onClick={() => handleOpenReview(app)}
                                                            className="bg-white text-black hover:bg-neutral-200 text-xs font-bold rounded-full h-8"
                                                        >
                                                            Review
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

                {/* Review App Dialog */}
                <Dialog open={reviewAppOpen} onOpenChange={setReviewAppOpen}>
                    <DialogContent className="sm:max-w-4xl bg-[#000] rounded-3xl border-white/10 text-white shadow-2xl p-0 gap-0 overflow-hidden max-h-[90vh] flex flex-col">
                        <DialogHeader className="p-6 border-b border-white/10 bg-neutral-900/20 backdrop-blur-sm sticky top-0 z-10">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                                        {selectedReviewApp?.icons ? (
                                            <img src={Object.values(selectedReviewApp.icons)[0] as string || ""} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-neutral-800 to-black" />
                                        )}
                                    </div>
                                    <div>
                                        <DialogTitle className="text-xl font-bold text-white mb-1">{selectedReviewApp?.name}</DialogTitle>
                                        <div className="text-sm text-neutral-400 flex items-center gap-2">
                                            {selectedReviewApp?.version && <span className="bg-white/10 px-2 py-0.5 rounded textxs font-mono text-white">{selectedReviewApp.version}</span>}
                                            <span>by {selectedReviewApp?.developer?.fullName}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        onClick={handleTerminateApp}
                                        disabled={processingReview}
                                        variant="outline"
                                        className="border-white/5 text-white hover:bg-white/10 hover:text-white font-semibold cursor-pointer rounded-full mr-2"
                                    >
                                        Terminate
                                    </Button>
                                    <Button
                                        onClick={handleRejectApp}
                                        disabled={processingReview}
                                        variant="outline"
                                        className="border-white/5 text-white bg-red-800 hover:bg-red-900 hover:text-white font-semibold cursor-pointer rounded-full"
                                    >
                                        Reject
                                    </Button>
                                    <Button
                                        onClick={handleApproveApp}
                                        disabled={processingReview}
                                        className="bg-blue-800 hover:bg-blue-700 cursor-pointer text-white rounded-full font-semibold"
                                    >
                                        {processingReview ? <Loader2 className="w-4 h-4 animate-spin" /> : "Approve & Publish"}
                                    </Button>
                                </div>
                            </div>

                            {showRejectInput && (
                                <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                                    <Label className="text-white text-xs uppercase font-semibold mb-2 block">Reason for Rejection</Label>
                                    <Textarea
                                        value={rejectReason}
                                        onChange={e => setRejectReason(e.target.value)}
                                        placeholder="Explain why the app is being rejected..."
                                        className="bg-white/5 border-white/5 text-white resize-none h-24 mt-5"
                                    />
                                    <div className="flex justify-end mt-2">
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            className="rounded-full bg-red-800 hover:bg-red-900 font-semibold cursor-pointer text-white"
                                            onClick={handleRejectApp}
                                        >
                                            Confirm Rejection
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </DialogHeader>

                        <div className="p-6 overflow-y-auto space-y-8 flex-1">
                            <div className="grid grid-cols-3 gap-8">
                                <div className="col-span-2 space-y-8">
                                    <div className="space-y-4">
                                        <Label className="text-xs uppercase font-bold text-neutral-500 tracking-wider">Description</Label>
                                        <div className="prose prose-invert max-w-none text-sm text-neutral-300">
                                            {selectedReviewApp?.fullDescription}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <Label className="text-xs uppercase font-bold text-neutral-500 tracking-wider">Screenshots</Label>
                                        <div className="grid grid-cols-2 gap-4">
                                            {selectedReviewApp?.screenshots?.map((url: string, i: number) => (
                                                <div key={i} className="aspect-video bg-white/5 rounded-lg overflow-hidden border border-white/5">
                                                    <img src={url} className="w-full h-full object-cover" />
                                                </div>
                                            ))}
                                            {(!selectedReviewApp?.screenshots || selectedReviewApp.screenshots.length === 0) && (
                                                <div className="text-neutral-500 text-sm italic">No screenshots provided.</div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Reviewer Info Section */}
                                    {selectedReviewApp?.reviewerInfo && (
                                        <div className="space-y-4 pt-6 border-t border-white/5">
                                            <Label className="text-xs uppercase font-bold text-neutral-500 tracking-wider">Reviewer Information</Label>

                                            <div className="grid gap-4 bg-white/5 p-4 rounded-xl border border-white/5 review-info-block">
                                                {selectedReviewApp.reviewerInfo.testCredentials && (
                                                    <div className="space-y-1">
                                                        <div className="text-xs text-neutral-400 font-medium uppercase">Test Credentials</div>
                                                        <pre className="text-xs bg-black/30 p-2 rounded text-neutral-300 font-mono whitespace-pre-wrap border border-white/5">
                                                            {selectedReviewApp.reviewerInfo.testCredentials}
                                                        </pre>
                                                    </div>
                                                )}

                                                {selectedReviewApp.reviewerInfo.functionality && (
                                                    <div className="space-y-1">
                                                        <div className="text-xs text-neutral-400 font-medium uppercase">Functionality</div>
                                                        <p className="text-sm text-neutral-300 leading-relaxed whitespace-pre-line">
                                                            {selectedReviewApp.reviewerInfo.functionality}
                                                        </p>
                                                    </div>
                                                )}

                                                {selectedReviewApp.reviewerInfo.limitations && (
                                                    <div className="space-y-1">
                                                        <div className="text-xs text-neutral-400 font-medium uppercase">Known Limitations</div>
                                                        <p className="text-sm text-neutral-300 leading-relaxed whitespace-pre-line">
                                                            {selectedReviewApp.reviewerInfo.limitations}
                                                        </p>
                                                    </div>
                                                )}

                                                {selectedReviewApp.reviewerInfo.guidance && (
                                                    <div className="space-y-1">
                                                        <div className="text-xs text-neutral-400 font-medium uppercase">Review Guidance</div>
                                                        <p className="text-sm text-neutral-300 leading-relaxed whitespace-pre-line">
                                                            {selectedReviewApp.reviewerInfo.guidance}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="col-span-1 space-y-6">
                                    <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-4">
                                        <Label className="text-xs uppercase font-bold text-neutral-500 tracking-wider">Distribution</Label>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-neutral-400">Pricing</span>
                                            <span className="text-white capitalize">{selectedReviewApp?.pricingModel}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-neutral-400">Price</span>
                                            <span className="text-white">₹{selectedReviewApp?.price}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-neutral-400">Region</span>
                                            <span className="text-white capitalize">{selectedReviewApp?.distributionMode}</span>
                                        </div>
                                    </div>

                                    <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-4">
                                        <Label className="text-xs uppercase font-bold text-neutral-500 tracking-wider">Build Artifacts</Label>
                                        {selectedReviewApp?.buildUrl ? (
                                            <Button className="w-full bg-white font-semibold text-black hover:bg-neutral-200 rounded-xl" asChild>
                                                <a href={selectedReviewApp.buildUrl} download>
                                                    <Code2 className="w-4 h-4 mr-2" />
                                                    Download Build
                                                </a>
                                            </Button>
                                        ) : (
                                            <div className="text-sm text-neutral-500">No build uploaded.</div>
                                        )}
                                        <div className="text-xs text-neutral-500 font-mono break-all border-t border-white/5 pt-3 mt-3">
                                            SHA: {selectedReviewApp?.verifyKey}
                                        </div>
                                    </div>

                                    <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-4">
                                        <Label className="text-xs uppercase font-bold text-neutral-500 tracking-wider">Metadata</Label>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedReviewApp?.tags?.map((tag: string) => (
                                                <span key={tag} className="px-2 py-1 rounded-md bg-white/10 text-xs text-white border border-white/5">{tag}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

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

                {/* Delete User Confirmation Dialog */}
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

                {/* Bulk Delete User Confirmation Dialog */}
                <Dialog open={bulkDeleteOpen} onOpenChange={setBulkDeleteOpen}>
                    <DialogContent className="sm:max-w-[425px] bg-[#0A0A0A] rounded-3xl border-white/10 text-white shadow-2xl p-6 gap-6">
                        <DialogHeader>
                            <div className="mx-auto w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-2">
                                <AlertTriangle className="h-6 w-6 text-red-500" />
                            </div>
                            <DialogTitle className="text-center text-xl font-semibold text-white">Delete {selectedUsers.length} Users?</DialogTitle>
                            <DialogDescription className="text-center text-neutral-400 text-sm">
                                Are you sure you want to delete <span className="text-white font-bold">{selectedUsers.length} selected users</span>. This action cannot be undone and will remove all associated data for these users.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="grid grid-cols-2 gap-3 mt-2">
                            <Button
                                variant="outline"
                                onClick={() => setBulkDeleteOpen(false)}
                                className="bg-transparent border-white/10 text-neutral-400 hover:bg-white/5 hover:text-white rounded-full w-full"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleBulkDelete}
                                disabled={isBulkDeleting}
                                className="bg-red-800 hover:bg-red-900 text-white rounded-full w-full"
                            >
                                {isBulkDeleting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Delete All"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Delete Developer Confirmation Dialog */}
                <Dialog open={deleteDevOpen} onOpenChange={setDeleteDevOpen}>
                    <DialogContent className="sm:max-w-[425px] bg-[#0A0A0A] rounded-3xl border-white/10 text-white shadow-2xl p-6 gap-6">
                        <DialogHeader>
                            <div className="mx-auto w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-2">
                                <AlertTriangle className="h-6 w-6 text-red-500" />
                            </div>
                            <DialogTitle className="text-center text-xl font-semibold text-white">Delete Developer?</DialogTitle>
                            <DialogDescription className="text-center text-neutral-400 text-sm">
                                Are you sure you want to delete <span className="text-white font-bold">{devToDelete?.fullName}</span>. This action cannot be undone and will remove all associated developer data.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="grid grid-cols-2 gap-3 mt-2">
                            <Button
                                variant="outline"
                                onClick={() => setDeleteDevOpen(false)}
                                className="bg-transparent border-white/10 text-neutral-400 hover:bg-white/5 hover:text-white rounded-full w-full"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleDeleteDev}
                                disabled={isDeletingDev}
                                className="bg-red-800 hover:bg-red-900 text-white rounded-full w-full"
                            >
                                {isDeletingDev ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Delete"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Developer Details Modal */}
                <Dialog open={viewDevDetailsOpen} onOpenChange={setViewDevDetailsOpen}>
                    <DialogContent className="sm:max-w-[700px] bg-[#0A0A0A] rounded-3xl border-white/10 text-white shadow-2xl p-6 gap-6 outline-none">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-3 text-lg font-semibold text-white">
                                <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white font-bold">
                                    {detailedDev?.fullName?.charAt(0) || 'D'}
                                </div>
                                <div>
                                    <div>{detailedDev?.fullName}</div>
                                    <div className="text-xs text-neutral-500 font-normal">{detailedDev?.email}</div>
                                </div>
                            </DialogTitle>
                        </DialogHeader>

                        {detailedDev && (
                            <div className="space-y-6">
                                {/* Developer specific details */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                        <div className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2">Status</div>
                                        <div className="text-lg font-bold text-white flex items-center gap-2">
                                            {detailedDev.status}
                                            {detailedDev.verifiedBadge && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                        <div className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2">License</div>
                                        <div className="text-lg font-bold text-white font-mono">{detailedDev.license || "N/A"}</div>
                                    </div>
                                </div>

                                {/* Last Payment Status */}
                                <div>
                                    <h3 className="text-sm font-medium text-neutral-300 mb-3 flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-neutral-500" />
                                        Payment History
                                    </h3>
                                    <div className="rounded-xl border border-white/10 bg-black/40 overflow-hidden max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                                        {!detailedDev.paymentOrders || detailedDev.paymentOrders.length === 0 ? (
                                            <div className="p-8 text-center text-sm text-neutral-500">
                                                No payment history found.
                                            </div>
                                        ) : (
                                            <table className="w-full text-left text-sm">
                                                <thead className="bg-white/5 text-neutral-400 font-medium text-xs uppercase tracking-wider sticky top-0 backdrop-blur-md">
                                                    <tr>
                                                        <th className="px-4 py-3 font-medium">Date</th>
                                                        <th className="px-4 py-3 font-medium">Amount</th>
                                                        <th className="px-4 py-3 font-medium">Status</th>
                                                        <th className="px-4 py-3 font-medium text-right">Order ID</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-white/5">
                                                    {detailedDev.paymentOrders.map((order, i) => (
                                                        <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                                                            <td className="px-4 py-3 text-neutral-400 whitespace-nowrap text-xs">
                                                                {new Date(order.createdAt).toLocaleString()}
                                                            </td>
                                                            <td className="px-4 py-3 font-medium whitespace-nowrap text-white">
                                                                {(order.amount).toLocaleString('en-IN', { style: 'currency', currency: order.currency })}
                                                            </td>
                                                            <td className="px-4 py-3">
                                                                <span className={`text-xs px-2 py-0.5 rounded-full ${order.status === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                                                    {order.status}
                                                                </span>
                                                            </td>
                                                            <td className="px-4 py-3 text-right text-neutral-500 text-xs font-mono">
                                                                {order.id}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </main>
        </div>
    );
}
