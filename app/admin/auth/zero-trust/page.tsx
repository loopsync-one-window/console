"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import {
    getAllUsers,
    getActiveSubscribersDetailed,
    getAllDevelopers,
    deleteDeveloperAdmin,
    getAllAdminApps,
    notifyAllUsers,
    notifyUser,
    deleteUser,
    deleteUsersBulk,
    getAdminUserDetails,
    getAdminAppsForReview,
    getAdminAppDetails,
    adminApproveApp,
    adminPublishApp,
    adminRejectApp,
    adminTerminateApp,
    adminReopenApp,
    uploadAdminBuild,
    AdminUser,
    Developer,
    ReviewedApp,
    getAppRejectionHistory,
    getAdminFlags,
    getAdminPurchases,
    getAdminContributions
} from "@/lib/admin-api";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Search, Mail, RefreshCcw, ShieldCheck, Users, Activity, Bell, Eye, EyeOff, Trash2, AlertTriangle, FileText, Code2, CheckCircle2, AppWindow, AlertCircle, LogOut, History, Folder, File as FileIcon, ChevronRight, ChevronDown, Package, Key, Copy, Check, Download, FileWarning, CloudUpload, X, Plus, MoreHorizontal } from "lucide-react";
import JSZip from "jszip";
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
    const [activeSubscribers, setActiveSubscribers] = useState<any[]>([]);
    const [developers, setDevelopers] = useState<Developer[]>([]);
    const [reviewApps, setReviewApps] = useState<ReviewedApp[]>([]);
    const [allApps, setAllApps] = useState<ReviewedApp[]>([]);
    const [flags, setFlags] = useState<any[]>([]);
    const [purchases, setPurchases] = useState<any[]>([]);
    const [contributions, setContributions] = useState<any[]>([]);
    const [stats, setStats] = useState({ activeSubscribers: 0, totalUsers: 0 });
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
    // Add missing state for bundle size in review dialog
    const [bundleSize, setBundleSize] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<{
        name: string;
        content: string | null;
        type: 'image' | 'text' | 'other';
        language?: string;
    } | null>(null);
    const [detailedUser, setDetailedUser] = useState<AdminUser | null>(null);
    const [registerBuildOpen, setRegisterBuildOpen] = useState(false);
    const [isDraggingOver, setIsDraggingOver] = useState(false);
    const [droppedFiles, setDroppedFiles] = useState<any[]>([]);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [manualUploadStatus, setManualUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
    const [uploadedBuildInfo, setUploadedBuildInfo] = useState<{ path: string, filename: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [loadedZip, setLoadedZip] = useState<JSZip | null>(null);

    // Developer Details State
    const [viewDevDetailsOpen, setViewDevDetailsOpen] = useState(false);
    const [detailedDev, setDetailedDev] = useState<Developer | null>(null);

    // App Privacy & Info State
    const [privacyTracking, setPrivacyTracking] = useState<string[]>([]);
    const [privacyLinked, setPrivacyLinked] = useState<string[]>([]);
    const [extraInfo, setExtraInfo] = useState({
        ageRating: '4+',
        copyright: '',
        website: '',
        supportEmail: ''
    });

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setDroppedFiles([{
                name: file.name,
                path: file.name, // Local path not available in browser
                size: file.size,
                type: 'file', // generic
                rawFile: file
            }]);
            setManualUploadStatus('idle');
            setUploadedBuildInfo(null);
            setUploadProgress(0);
        }
    };

    const handleManualUpload = async (fileNode: any) => {
        console.log("Manual upload triggered", fileNode);
        if (!selectedReviewApp) {
            toast.error("No app selected for review");
            console.error("No selectedReviewApp");
            return;
        }
        if (!fileNode.rawFile) {
            toast.error("File data missing");
            console.error("No rawFile in fileNode", fileNode);
            return;
        }

        setManualUploadStatus('uploading');
        setUploadProgress(5);

        try {
            // Simulated progress for UX
            const interval = setInterval(() => {
                setUploadProgress(prev => {
                    if (prev >= 90) {
                        return 90;
                    }
                    return prev + 10;
                });
            }, 300);

            console.log("Starting uploadAdminBuild...");
            const uploadResult = await uploadAdminBuild(
                selectedReviewApp.id,
                selectedReviewApp.version || '1.0.0',
                'windows',
                fileNode.rawFile
            );
            console.log("Upload result:", uploadResult);

            clearInterval(interval);
            setUploadProgress(100);
            setManualUploadStatus('success');
            setUploadedBuildInfo({
                path: uploadResult.key,
                filename: uploadResult.filename
            });
            toast.success("Manual upload successful! You can now publish.");
        } catch (error) {
            console.error("Manual upload failed:", error);
            setManualUploadStatus('error');
            setUploadProgress(0);
            toast.error("Upload failed");
        }
    };

    const fetchData = async () => {
        setLoading(true);
        console.log("Fetching admin data...");
        try {
            // Fetch users
            try {
                const usersData = await getAllUsers();
                console.log("Users fetched:", usersData);
                setUsers(usersData || []);
                setStats(prev => ({ ...prev, totalUsers: usersData.length }));
            } catch (e) {
                console.error("Failed to fetch users", e);
                toast.error("Failed to fetch users");
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

            // Fetch all apps
            try {
                const allAppsData = await getAllAdminApps();
                console.log("All Apps fetched:", allAppsData);
                setAllApps(allAppsData || []);
            } catch (e) {
                console.error("Failed to fetch all apps", e);
            }

            // Fetch Flags
            try {
                const flagsData = await getAdminFlags();
                setFlags(flagsData || []);
            } catch (e) {
                console.error("Failed to fetch flags", e);
            }

            // Fetch Purchases
            try {
                const purchasesData = await getAdminPurchases();
                setPurchases(purchasesData || []);
            } catch (e) {
                console.error("Failed to fetch purchases", e);
            }

            // Fetch Contributions
            try {
                const contributionsData = await getAdminContributions();
                setContributions(contributionsData || []);
            } catch (e) {
                console.error("Failed to fetch contributions", e);
            }

            // Fetch subscribers
            try {
                const subscribersData = await getActiveSubscribersDetailed();
                setActiveSubscribers(subscribersData || []);
                setStats(prev => ({ ...prev, activeSubscribers: subscribersData.length }));
            } catch (e) { console.error(e); }

            // Users count
            // setStats(prev => ({ ...prev, totalUsers: users.length })); // users might not be set yet due to async state


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

            // Pre-fill store info from developer details
            // 'website' is on the App object (Official Website), not the developer relation
            // 'supportEmail' is also on the App object
            setExtraInfo({
                ageRating: '4+',
                copyright: `2025 ${details.developer?.fullName || ''}`,
                website: details.website || '',
                supportEmail: details.supportEmail || details.developer?.email || ''
            });

            // Fetch history when opening review details
            await fetchAppHistoryForReview(app.id);
            setReviewAppOpen(true);
            setShowRejectInput(false);
            setRejectReason("");
        } catch (e) {
            toast.error("Failed to load app details");
        } finally {
            setProcessingReview(false);
        }

    };

    const fetchAppHistoryForReview = async (appId: string) => {
        try {
            const history = await getAppRejectionHistory(appId);
            setHistoryData(history || []);
        } catch (error) {
            console.error(error);
        }
    };

    const handleApproveApp = async () => {
        if (!selectedReviewApp) return;
        setProcessingReview(true);
        try {
            // Prepare build details from dropped files if available
            let buildDetails = null;

            if (droppedFiles.length > 0) {
                const fileNode = droppedFiles[0];
                let uploadedPath = fileNode.path;
                let buildId = fileNode.name;

                // 1. Check if manually uploaded first
                if (uploadedBuildInfo && manualUploadStatus === 'success') {
                    uploadedPath = uploadedBuildInfo.path;
                    buildId = uploadedBuildInfo.filename;
                }
                // 2. Otherwise upload now
                else if (fileNode.rawFile) {
                    try {
                        toast.loading("Uploading build...");
                        const uploadResult = await uploadAdminBuild(
                            selectedReviewApp.id,
                            selectedReviewApp.version || '1.0.0',
                            'windows',
                            fileNode.rawFile
                        );
                        toast.dismiss();
                        uploadedPath = uploadResult.key; // S3 Key
                        // The backend returns { key, url, filename }
                        // BUT consistent with other parts, we might want to store just the filename or whatever schema uses.
                        // based on schema: platforms: { [platform]: { buildId, sizeMB, path } }
                        // The user's system seems to treat 'buildId' synonymous with 'filename' in the S3 key construction for downloads.
                        buildId = uploadResult.filename;

                        // Force a small delay to ensure S3 consistency if immediate download is attempted (optional but safer)
                        await new Promise(r => setTimeout(r, 1000));

                        toast.success("Build uploaded successfully");
                    } catch (uploadError) {
                        console.error("Upload failed", uploadError);
                        toast.error("Failed to upload build file");
                        setProcessingReview(false);
                        return;
                    }
                }

                buildDetails = {
                    platform: 'windows',
                    buildId: buildId,
                    version: selectedReviewApp.version || '1.0.0',
                    sizeMB: fileNode.size ? parseFloat((fileNode.size / (1024 * 1024)).toFixed(2)) : 0,
                    path: uploadedPath,
                    color: selectedReviewApp.color,
                    privacyTracking,
                    privacyLinked,
                    ...extraInfo
                };
            } else {
                // Even if no specific build dropped, send metadata if updated
                buildDetails = {
                    color: selectedReviewApp.color,
                    privacyTracking,
                    privacyLinked,
                    ...extraInfo
                };
            }

            await adminPublishApp(selectedReviewApp.id, buildDetails);
            toast.success("App approved & published successfully");
            setReviewApps(prev => prev.filter(a => a.id !== selectedReviewApp.id));
            setReviewAppOpen(false);
            // Refresh to see status update
            fetchData();
        } catch (e) {
            console.error(e);
            toast.error("Failed to approve & publish app");
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

    const handleReopenApp = async () => {
        if (!selectedReviewApp) return;
        setProcessingReview(true);
        try {
            await adminReopenApp(selectedReviewApp.id);
            toast.success("App Reopened", {
                description: "The application has been reopened for review.",
            });
            // Update local state and close
            setReviewApps(prev => prev.filter(a => a.id !== selectedReviewApp.id));
            setReviewAppOpen(false);
            fetchData();
        } catch (error) {
            console.error(error);
            toast.error("Failed to reopen app");
        } finally {
            setProcessingReview(false);
        }
    };

    const handleReopenAppFromTable = async (app: ReviewedApp) => {
        try {
            await adminReopenApp(app.id);
            toast.success("App Reopened", {
                description: "The application has been reopened for review.",
            });
            fetchData();
        } catch (error) {
            console.error(error);
            toast.error("Failed to reopen app");
        }
    };

    // History State
    const [historyOpen, setHistoryOpen] = useState(false);
    const [historyData, setHistoryData] = useState<any[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [selectedHistoryApp, setSelectedHistoryApp] = useState<ReviewedApp | null>(null);

    const handleViewHistory = async (app: ReviewedApp) => {
        setSelectedHistoryApp(app);
        setHistoryOpen(true);
        setLoadingHistory(true);
        try {
            const history = await getAppRejectionHistory(app.id);
            setHistoryData(history || []);
        } catch (e) {
            console.error("Failed to fetch history", e);
            toast.error("Failed to fetch rejection history");
        } finally {
            setLoadingHistory(false);
        }
    };

    const filteredDevelopers = developers
        .filter((d) =>
            d.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            d.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            d.id.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());

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
        setSelectedUserDetail(null);
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
                        <div className="h-10 w-40 relative flex items-center justify-center">
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
                                <h2 className="text-2xl font-semibold tracking-tight text-white">Data Console</h2>
                                {/* <p className="text-sm text-neutral-500 mt-1">Manage users, view plans, and monitor activity.</p> */}
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
                                    <TabsTrigger
                                        value="all-apps"
                                        className="text-xs px-4 rounded-md data-[state=active]:bg-white/10 data-[state=active]:text-white text-neutral-400 transition-all"
                                    >
                                        All Apps
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="draft-apps"
                                        className="text-xs px-4 rounded-md data-[state=active]:bg-white/10 data-[state=active]:text-white text-neutral-400 transition-all"
                                    >
                                        Draft Apps
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="flags"
                                        className="text-xs px-4 rounded-md data-[state=active]:bg-white/10 data-[state=active]:text-white text-neutral-400 transition-all"
                                    >
                                        Flags
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="purchases"
                                        className="text-xs px-4 rounded-md data-[state=active]:bg-white/10 data-[state=active]:text-white text-neutral-400 transition-all"
                                    >
                                        Purchases
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="contributions"
                                        className="text-xs px-4 rounded-md data-[state=active]:bg-white/10 data-[state=active]:text-white text-neutral-400 transition-all"
                                    >
                                        Contributions
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
                                                            <div className="flex items-center gap-1 text-white">
                                                                <CheckCircle2 className="w-4 h-4" />
                                                                <span className="text-sm font-medium">Badge Active</span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-sm text-neutral-500">Badge Inactive</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-neutral-500 text-sm">
                                                        {new Date(dev.createdAt || '').toLocaleDateString(undefined, {
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

                        <TabsContent value="all-apps" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <div className="rounded-2xl border border-white/10 bg-neutral-900/20 backdrop-blur-sm overflow-hidden shadow-2xl shadow-black/40">
                                <Table>
                                    <TableHeader className="bg-neutral-900/80 border-b border-white/5">
                                        <TableRow className="border-none hover:bg-transparent">
                                            <TableHead className="pl-6 py-4 text-neutral-400 font-medium">App Name</TableHead>
                                            <TableHead className="text-neutral-400 font-medium">Developer</TableHead>
                                            <TableHead className="text-neutral-400 font-medium">Status</TableHead>
                                            <TableHead className="text-neutral-400 font-medium">Rejection Reason</TableHead>
                                            <TableHead className="text-right text-neutral-400 font-medium">Last Updated</TableHead>
                                            <TableHead className="text-right pr-6 text-neutral-400 font-medium">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {allApps.filter(a => a.status !== 'draft').length === 0 ? (
                                            <TableRow className="border-none hover:bg-transparent">
                                                <TableCell colSpan={6} className="h-48 text-center text-neutral-600">
                                                    No active apps found.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            allApps.filter(a => a.status !== 'draft').map((app) => (
                                                <TableRow key={app.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                                                    <TableCell className="pl-6 py-4 font-medium text-white">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-8 h-8 rounded-lg bg-white flex items-center justify-center`}>
                                                                <span className="text-black font-bold text-xs">{app.name.charAt(0).toUpperCase()}</span>
                                                            </div>
                                                            {app.name}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-neutral-300">
                                                        <div className="flex flex-col">
                                                            <span>{app.developer?.fullName}</span>
                                                            <span className="text-xs text-neutral-500">{app.developer?.email}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            className={`
                                                                ${app.status === 'live' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : ''}
                                                                ${app.status === 'review' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : ''}
                                                                ${app.status === 'rejected' ? 'bg-red-500/10 text-red-400 border-red-500/20' : ''}
                                                                ${app.status === 'terminated' ? 'bg-red-900/20 text-red-500 border-red-500/20' : ''}
                                                                ${app.status === 'draft' ? 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20' : ''}
                                                            `}
                                                            variant="outline"
                                                        >
                                                            {app.status.toUpperCase()}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="max-w-[200px]">
                                                        {app.rejectionReason ? (
                                                            <TooltipProvider>
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <div className="flex items-center gap-1.5 text-red-400 cursor-help">
                                                                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                                                            <span className="truncate text-sm">{app.rejectionReason}</span>
                                                                        </div>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent className="max-w-xs bg-neutral-900 border-white/10 text-white">
                                                                        <p>{app.rejectionReason}</p>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </TooltipProvider>
                                                        ) : (
                                                            <span className="text-neutral-600">-</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-right text-neutral-400">
                                                        {new Date(app.updatedAt || '').toLocaleDateString()}
                                                    </TableCell>
                                                    <TableCell className="text-right pr-6">
                                                        <div className="flex items-center justify-end gap-2">
                                                            {app.status === 'terminated' && (
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() => handleReopenAppFromTable(app)}
                                                                    className="h-8 rounded-full border-emerald-500/20 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300 text-xs font-medium"
                                                                >
                                                                    Reopen
                                                                </Button>
                                                            )}
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => handleViewHistory(app)}
                                                                className="w-8 h-8 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
                                                                title="View Rejection History"
                                                            >
                                                                <History className="w-4 h-4" />
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

                        <TabsContent value="draft-apps" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <div className="rounded-2xl border border-white/10 bg-neutral-900/20 backdrop-blur-sm overflow-hidden shadow-2xl shadow-black/40">
                                <Table>
                                    <TableHeader className="bg-neutral-900/80 border-b border-white/5">
                                        <TableRow className="border-none hover:bg-transparent">
                                            <TableHead className="pl-6 py-4 text-neutral-400 font-medium">App Name</TableHead>
                                            <TableHead className="text-neutral-400 font-medium">Developer</TableHead>
                                            <TableHead className="text-neutral-400 font-medium">Status</TableHead>
                                            <TableHead className="text-right text-neutral-400 font-medium">Last Updated</TableHead>
                                            <TableHead className="text-right pr-6 text-neutral-400 font-medium">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {allApps.filter(a => a.status === 'draft').length === 0 ? (
                                            <TableRow className="border-none hover:bg-transparent">
                                                <TableCell colSpan={5} className="h-48 text-center text-neutral-600">
                                                    No draft apps found.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            allApps.filter(a => a.status === 'draft').map((app) => (
                                                <TableRow key={app.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                                                    <TableCell className="pl-6 py-4 font-medium text-white">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-8 h-8 rounded-lg ${app.color || 'bg-white'} flex items-center justify-center`}>
                                                                <span className="text-black font-bold text-xs">{app.name.charAt(0).toUpperCase()}</span>
                                                            </div>
                                                            {app.name}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-neutral-300">
                                                        <div className="flex flex-col">
                                                            <span>{app.developer?.fullName}</span>
                                                            <span className="text-xs text-neutral-500">{app.developer?.email}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            className="bg-neutral-500/10 text-neutral-400 border-neutral-500/20"
                                                            variant="outline"
                                                        >
                                                            DRAFT
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right text-neutral-400">
                                                        {new Date(app.updatedAt || '').toLocaleDateString()}
                                                    </TableCell>
                                                    <TableCell className="text-right pr-6">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleViewHistory(app)}
                                                            className="w-8 h-8 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
                                                            title="View Rejection History"
                                                        >
                                                            <History className="w-4 h-4" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </TabsContent>

                        <TabsContent value="flags" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <div className="rounded-2xl border border-white/10 bg-neutral-900/20 backdrop-blur-sm overflow-hidden shadow-2xl shadow-black/40">
                                <Table>
                                    <TableHeader className="bg-neutral-900/80 border-b border-white/5">
                                        <TableRow className="border-none hover:bg-transparent">
                                            <TableHead className="text-neutral-400 font-medium pl-6">App Name</TableHead>
                                            <TableHead className="text-neutral-400 font-medium">Reason</TableHead>
                                            <TableHead className="text-neutral-400 font-medium">Reporter</TableHead>
                                            <TableHead className="text-neutral-400 font-medium">Description</TableHead>
                                            <TableHead className="text-neutral-400 font-medium">Date</TableHead>
                                            <TableHead className="text-right text-neutral-400 font-medium pr-6">Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {flags.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={6} className="h-24 text-center text-neutral-500">
                                                    No flagged apps found.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            flags.map((flag) => (
                                                <TableRow key={flag.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                    <TableCell className="font-medium text-white pl-6">
                                                        {flag.appName}
                                                        <div className="text-[10px] text-neutral-500 font-mono">{flag.appId}</div>
                                                    </TableCell>
                                                    <TableCell className="text-neutral-300">
                                                        <span className="px-2 py-1 rounded-md bg-red-500/10 text-red-400 text-xs font-medium border border-red-500/20">
                                                            {flag.reason}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="text-sm text-neutral-300">{flag.reporterName}</div>
                                                        <div className="text-xs text-neutral-500">{flag.reporterEmail}</div>
                                                    </TableCell>
                                                    <TableCell className="text-neutral-400 max-w-[300px] truncate" title={flag.description}>
                                                        {flag.description}
                                                    </TableCell>
                                                    <TableCell className="text-neutral-400 font-mono text-xs">
                                                        {new Date(flag.createdAt).toLocaleDateString()}
                                                    </TableCell>
                                                    <TableCell className="text-right pr-6">
                                                        <span className="text-xs uppercase font-bold text-neutral-500">{flag.status}</span>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </TabsContent>

                        <TabsContent value="purchases" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <div className="rounded-2xl border border-white/10 bg-neutral-900/20 backdrop-blur-sm overflow-hidden shadow-2xl shadow-black/40">
                                <Table>
                                    <TableHeader className="bg-neutral-900/80 border-b border-white/5">
                                        <TableRow className="border-none hover:bg-transparent">
                                            <TableHead className="text-neutral-400 font-medium pl-6">Purchase ID</TableHead>
                                            <TableHead className="text-neutral-400 font-medium">App Name</TableHead>
                                            <TableHead className="text-neutral-400 font-medium">User</TableHead>
                                            <TableHead className="text-neutral-400 font-medium">Amount</TableHead>
                                            <TableHead className="text-neutral-400 font-medium">Status</TableHead>
                                            <TableHead className="text-neutral-400 font-medium">Date</TableHead>
                                            <TableHead className="text-right text-neutral-400 font-medium pr-6">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {purchases.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={7} className="h-24 text-center text-neutral-500">
                                                    No purchases found.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            purchases.map((purchase) => (
                                                <TableRow key={purchase.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                    <TableCell className="font-mono text-xs text-neutral-500 pl-6">
                                                        {purchase.id}
                                                    </TableCell>
                                                    <TableCell className="text-white font-medium">
                                                        {purchase.appName || 'Unknown'}
                                                    </TableCell>
                                                    <TableCell className="text-neutral-400 text-xs font-mono">
                                                        {purchase.userId}
                                                    </TableCell>
                                                    <TableCell className="text-emerald-400 font-bold">
                                                        {/* Assuming amount is raw number now */}
                                                        ₹{purchase.amount ? parseFloat(purchase.amount).toFixed(2) : '0.00'}
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${purchase.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                                            'bg-neutral-500/10 text-neutral-400'
                                                            }`}>
                                                            {purchase.status}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-neutral-400 font-mono text-xs">
                                                        {new Date(purchase.createdAt).toLocaleString()}
                                                    </TableCell>
                                                    <TableCell className="text-right pr-6">
                                                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-neutral-400 hover:text-white">
                                                            <MoreHorizontal className="w-4 h-4" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </TabsContent>

                        <TabsContent value="contributions" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <div className="rounded-2xl border border-white/10 bg-neutral-900/20 backdrop-blur-sm overflow-hidden shadow-2xl shadow-black/40">
                                <Table>
                                    <TableHeader className="bg-neutral-900/80 border-b border-white/5">
                                        <TableRow className="border-none hover:bg-transparent">
                                            <TableHead className="text-neutral-400 font-medium pl-6">Contribution ID</TableHead>
                                            <TableHead className="text-neutral-400 font-medium">App</TableHead>
                                            <TableHead className="text-neutral-400 font-medium">Contributor</TableHead>
                                            <TableHead className="text-neutral-400 font-medium">Amount</TableHead>
                                            <TableHead className="text-neutral-400 font-medium">Date</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {contributions.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={5} className="h-24 text-center text-neutral-500">
                                                    No contributions found.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            contributions.map((contribution) => (
                                                <TableRow key={contribution.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                    <TableCell className="font-mono text-xs text-neutral-500 pl-6">
                                                        {contribution.invoiceNumber}
                                                    </TableCell>
                                                    <TableCell className="text-white font-medium">
                                                        <div className="flex items-center gap-2">
                                                            {contribution.appIcon && (
                                                                <div className="w-6 h-6 rounded bg-neutral-800 overflow-hidden border border-white/10">
                                                                    <img
                                                                        src={typeof contribution.appIcon === 'string' ? contribution.appIcon : (contribution.appIcon['512'] || Object.values(contribution.appIcon)[0]) as string}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                </div>
                                                            )}
                                                            {contribution.appName || 'Unknown'}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-neutral-400 text-xs">
                                                        <div className="flex flex-col">
                                                            <span className="text-neutral-300 font-medium">{contribution.user?.fullName}</span>
                                                            <span className="text-[10px] text-neutral-500">{contribution.user?.email}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-green-400 font-bold">
                                                        ₹{contribution.amount ? parseFloat(contribution.amount).toFixed(2) : '0.00'}
                                                    </TableCell>
                                                    <TableCell className="text-neutral-400 font-mono text-xs">
                                                        {new Date(contribution.createdAt).toLocaleString()}
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
                    <DialogContent className="w-[90vw] max-w-none bg-[#000] rounded-3xl border-white/10 text-white shadow-2xl p-0 gap-0 overflow-hidden h-[90vh] flex flex-col">
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
                                    {selectedReviewApp?.status === 'terminated' ? (
                                        <div className="flex items-center gap-2">
                                            <Button
                                                onClick={handleReopenApp}
                                                disabled={processingReview}
                                                className="bg-emerald-600 hover:bg-emerald-700 cursor-pointer text-white rounded-full font-semibold"
                                            >
                                                {processingReview ? <Loader2 className="w-4 h-4 animate-spin" /> : "Reopen for Review"}
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <Button
                                                onClick={() => setRegisterBuildOpen(!registerBuildOpen)}
                                                variant="outline"
                                                className={`border-white/5 font-semibold cursor-pointer rounded-full mr-2 ${registerBuildOpen ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/50' : 'text-white hover:bg-white/10'}`}
                                            >
                                                <CloudUpload className="w-4 h-4 mr-2" />
                                                Register Build
                                            </Button>
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
                                    )}
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

                        <Tabs defaultValue="build" className="flex flex-1 flex-col overflow-hidden h-full">
                            <div className="px-6 border-b border-white/5 bg-neutral-900/10 shrink-0">
                                <TabsList className="bg-transparent border-0 p-0 h-12 w-full justify-start gap-6">
                                    <TabsTrigger value="build" className="bg-transparent border-b-2 border-transparent data-[state=active]:border-white/10 data-[state=active]:text-white text-neutral-500 rounded-none h-full px-0 font-medium shadow-none">Overview & Build</TabsTrigger>
                                    <TabsTrigger value="privacy" className="bg-transparent border-b-2 border-transparent data-[state=active]:border-white/10 data-[state=active]:text-white text-neutral-500 rounded-none h-full px-0 font-medium shadow-none">Privacy & Info</TabsTrigger>
                                </TabsList>
                            </div>

                            <TabsContent value="build" className="flex-1 overflow-hidden flex h-full mt-0 border-0 p-0 outline-none data-[state=inactive]:hidden">
                                {/* Sidebar - File Tree */}
                                <div className="w-[320px] bg-black/20 border-r border-white/5 flex flex-col h-full">
                                    <div className="p-4 border-b border-white/5 flex items-center gap-2 bg-neutral-900/20 backdrop-blur-sm">
                                        <Package className="w-4 h-4 text-emerald-400" />
                                        <span className="text-sm font-semibold text-white tracking-wide">Build Explorer</span>
                                    </div>
                                    <div className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                                        {selectedReviewApp?.buildUrl ? (
                                            <BuildFileTree url={selectedReviewApp.buildUrl} onSizeCalculated={setBundleSize} onFileSelect={setSelectedFile} onZipLoaded={setLoadedZip} />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center h-48 text-neutral-500 gap-2">
                                                <Folder className="w-8 h-8 opacity-20" />
                                                <span className="text-xs">No build uploaded</span>
                                            </div>
                                        )}
                                    </div>
                                    {/* Meta Quick View */}
                                    <div className="p-4 border-t border-white/5 bg-neutral-900/10 space-y-3">
                                        <div>
                                            <div className="text-[10px] uppercase font-bold text-neutral-500 mb-1">Bundle Size</div>
                                            <div className="text-xs text-white font-mono">{bundleSize || "Loading..."}</div>
                                        </div>
                                        <div>
                                            <div className="text-[10px] uppercase font-bold text-neutral-500 mb-1">SHA Checksum</div>
                                            <div className="text-[10px] text-neutral-400 font-mono break-all leading-tight">
                                                {selectedReviewApp?.verifyKey || 'N/A'}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Main Content */}
                                <div className="flex-1 overflow-y-auto bg-gradient-to-br from-neutral-900/10 to-transparent">
                                    <div className="p-8 space-y-8 max-w-5xl mx-auto">

                                        {/* Register Build Panel */}
                                        {registerBuildOpen && (
                                            <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                                                <div className="flex items-center justify-between mb-4">
                                                    <Label className="text-xs uppercase font-bold text-indigo-400 tracking-wider flex items-center gap-2">
                                                        <CloudUpload className="w-4 h-4" />
                                                        Build Registration
                                                    </Label>
                                                    <Button size="sm" variant="ghost" onClick={() => setRegisterBuildOpen(false)} className="h-6 w-6 p-0 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white">
                                                        <X className="w-4 h-4" />
                                                    </Button>
                                                </div>

                                                <div
                                                    className={`rounded-2xl border border-dashed transition-all duration-300 p-8 ${isDraggingOver
                                                        ? 'border-indigo-500 bg-indigo-500/10'
                                                        : 'border-white/10 bg-black/20 hover:border-white/20'
                                                        }`}
                                                    onDragOver={(e) => {
                                                        e.preventDefault();
                                                        setIsDraggingOver(true);
                                                    }}
                                                    onDragLeave={(e) => {
                                                        e.preventDefault();
                                                        setIsDraggingOver(false);
                                                    }}
                                                    onDrop={(e) => {
                                                        e.preventDefault();
                                                        setIsDraggingOver(false);

                                                        // Handle OS File Drop
                                                        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                                                            const file = e.dataTransfer.files[0];
                                                            // Create a "node-like" object but with the raw File
                                                            const fileNode = {
                                                                name: file.name,
                                                                size: file.size,
                                                                // Special flag or prop to hold the raw file
                                                                rawFile: file,
                                                                path: file.name // Temporary path
                                                            };
                                                            setDroppedFiles([fileNode]);

                                                            // Reset and start upload progress simulation (real upload happens on Approve)
                                                            setUploadProgress(0);
                                                            const interval = setInterval(() => {
                                                                setUploadProgress(prev => {
                                                                    if (prev >= 100) {
                                                                        clearInterval(interval);
                                                                        return 100;
                                                                    }
                                                                    return prev + 10;
                                                                });
                                                            }, 100);
                                                            return;
                                                        }

                                                        const data = e.dataTransfer.getData("application/json");
                                                        if (data) {
                                                            try {
                                                                const node = JSON.parse(data);

                                                                // Initial state with node info (no file yet)
                                                                setDroppedFiles([node]);

                                                                // Extract content if available (for "Remote Server" drops) to enable Re-Upload
                                                                if (loadedZip) {
                                                                    const zipFile = loadedZip.file(node.path);
                                                                    if (zipFile) {
                                                                        toast.promise(
                                                                            zipFile.async('blob'),
                                                                            {
                                                                                loading: 'Extracting remote file...',
                                                                                success: (blob) => {
                                                                                    const file = new File([blob], node.name, { type: 'application/octet-stream' });
                                                                                    setDroppedFiles([{
                                                                                        ...node,
                                                                                        rawFile: file, // Attach raw file to enable "Upload Now" button
                                                                                        size: blob.size
                                                                                    }]);
                                                                                    setManualUploadStatus('idle');
                                                                                    setUploadedBuildInfo(null);
                                                                                    return 'Remote file ready for upload';
                                                                                },
                                                                                error: 'Failed to extract remote file'
                                                                            }
                                                                        );
                                                                    }
                                                                }

                                                                // Simulate upload visualization
                                                                setUploadProgress(0);
                                                                setTimeout(() => setUploadProgress(30), 200);
                                                                setTimeout(() => setUploadProgress(60), 600);
                                                                setTimeout(() => setUploadProgress(90), 1000);
                                                                setTimeout(() => setUploadProgress(100), 1500);
                                                            } catch (err) {
                                                                console.error("Drop error", err);
                                                            }
                                                        }
                                                    }}
                                                >
                                                    <div className="flex flex-col items-center justify-center gap-4 text-center">
                                                        <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${isDraggingOver ? 'bg-indigo-500/20 text-indigo-400' : 'bg-white/5 text-neutral-500'
                                                            }`}>
                                                            <Folder className="w-8 h-8" />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-white font-semibold">Drag & Drop build file here</h4>
                                                            <p className="text-sm text-neutral-500 mt-1">From the Build Explorer sidebar</p>
                                                        </div>
                                                    </div>

                                                    {/* Existing Build Info */}
                                                    {selectedReviewApp?.currentBuild && (
                                                        <div className="mt-6 p-4 rounded-xl bg-neutral-900/50 border border-white/10 text-left">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <Package className="w-4 h-4 text-neutral-400" />
                                                                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Current Build Status</span>
                                                            </div>
                                                            <div className="space-y-1">
                                                                <div className="flex justify-between items-center text-sm">
                                                                    <span className="text-neutral-500">Version:</span>
                                                                    <span className="text-white font-mono">{selectedReviewApp.currentBuild.version}</span>
                                                                </div>
                                                                <div className="flex justify-between items-center text-sm">
                                                                    <span className="text-neutral-500">Platform:</span>
                                                                    <div className="flex gap-1">
                                                                        {Object.keys(selectedReviewApp.currentBuild.platforms || {}).map(p => (
                                                                            <span key={p} className="text-xs bg-white/10 px-1.5 py-0.5 rounded text-white capitalize">{p}</span>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                                {/* Show details for the first platform found */}
                                                                {(() => {
                                                                    const platforms = selectedReviewApp.currentBuild.platforms || {};
                                                                    const firstPlatform = Object.values(platforms)[0] as any;
                                                                    if (firstPlatform) {
                                                                        return (
                                                                            <>
                                                                                <div className="flex justify-between items-center text-sm">
                                                                                    <span className="text-neutral-500">File:</span>
                                                                                    <span className="text-emerald-400 font-mono truncate max-w-[200px]" title={firstPlatform.buildId}>{firstPlatform.buildId}</span>
                                                                                </div>
                                                                                <div className="flex justify-between items-center text-sm">
                                                                                    <span className="text-neutral-500">Size:</span>
                                                                                    <span className="text-white font-mono">{firstPlatform.sizeMB} MB</span>
                                                                                </div>
                                                                            </>
                                                                        );
                                                                    }
                                                                    return null;
                                                                })()}
                                                                <div className="flex justify-between items-center text-sm">
                                                                    <span className="text-neutral-500">Last Updated:</span>
                                                                    <span className="text-neutral-400">{new Date(selectedReviewApp.currentBuild.updatedAt).toLocaleDateString()}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {droppedFiles.length > 0 && (
                                                        <div className="mt-8 space-y-4">
                                                            <div className="flex items-center justify-between text-xs text-neutral-400">
                                                                <span className="uppercase font-bold tracking-wider text-emerald-500">NEW BUILD VERIFIED</span>
                                                            </div>

                                                            <div className="bg-emerald-500/5 rounded-xl border border-emerald-500/20 overflow-hidden">
                                                                {droppedFiles.map((file: any, i: number) => (
                                                                    <div key={i} className="flex flex-col gap-3 p-4 border-b border-white/5 last:border-0 relative">
                                                                        <div className="flex items-center gap-3">
                                                                            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                                                                                <FileIcon className="w-5 h-5" />
                                                                            </div>
                                                                            <div className="flex-1 min-w-0 text-left">
                                                                                <div className="text-sm font-bold text-white truncate">{file.name}</div>
                                                                                {file.rawFile ? (
                                                                                    <div className="text-xs text-emerald-500/70 font-mono mt-0.5">Ready for Upload • {(file.size / (1024 * 1024)).toFixed(2)} MB</div>
                                                                                ) : (
                                                                                    <div className="text-xs text-blue-400/70 font-mono mt-0.5">Remote Build Selected • {(file.size / (1024 * 1024)).toFixed(2)} MB</div>
                                                                                )}
                                                                            </div>
                                                                            {manualUploadStatus === 'idle' && (
                                                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-neutral-500 hover:text-red-400" onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    setDroppedFiles(droppedFiles.filter((f: any) => f.path !== file.path));
                                                                                    setManualUploadStatus('idle');
                                                                                    setUploadedBuildInfo(null);
                                                                                }}>
                                                                                    <X className="w-4 h-4" />
                                                                                </Button>
                                                                            )}
                                                                        </div>

                                                                        {/* Upload Progress "Proof" */}
                                                                        {(processingReview || manualUploadStatus === 'uploading') && (
                                                                            <div className="space-y-1.5 mt-2 bg-black/40 p-3 rounded-lg border border-white/5">
                                                                                <div className="flex justify-between text-[10px] font-medium uppercase tracking-wider">
                                                                                    <span className="text-white font-medium animate-pulse">Uploading to LoopSync CLoud Console...</span>
                                                                                    <span className="text-white font-medium">{uploadProgress}%</span>
                                                                                </div>
                                                                                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                                                                    <div className="h-full bg-indigo-500 transition-all duration-300 w-full origin-left" style={{ width: `${uploadProgress}%` }}></div>
                                                                                </div>
                                                                            </div>
                                                                        )}

                                                                        {manualUploadStatus === 'error' && (
                                                                            <div className="mt-2 text-xs text-red-500 font-medium bg-red-500/10 p-2 rounded border border-red-500/20">
                                                                                Upload failed. Please try again.
                                                                            </div>
                                                                        )}

                                                                        {/* Manual Upload Actions */}
                                                                        {manualUploadStatus === 'idle' && !uploadedBuildInfo && file.rawFile && (
                                                                            <div className="mt-2 flex justify-end">
                                                                                <Button
                                                                                    size="sm"
                                                                                    variant="secondary"
                                                                                    className="h-7 text-xs bg-indigo-600 text-white font-semibold hover:bg-indigo-500 border border-indigo-600"
                                                                                    onClick={(e) => {
                                                                                        e.stopPropagation();
                                                                                        handleManualUpload(file);
                                                                                    }}
                                                                                >
                                                                                    <CloudUpload className="w-3 h-3 mr-1.5" />
                                                                                    Upload New Build
                                                                                </Button>
                                                                            </div>
                                                                        )}

                                                                        {uploadedBuildInfo && (
                                                                            <div className="mt-2 flex items-center gap-2 text-xs text-emerald-400 font-medium bg-emerald-500/10 p-2 rounded border border-emerald-500/20">
                                                                                <CheckCircle2 className="w-3 h-3" />
                                                                                Verified & Upload Completed
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    <input
                                                        type="file"
                                                        ref={fileInputRef}
                                                        className="hidden"
                                                        onChange={handleFileSelect}
                                                        accept=".exe,.zip,.dmg,.pkg,.deb,.rpm,.AppImage,.msi" // Basic restriction
                                                    />
                                                </div>

                                                {/* Color Palette Section */}
                                                {/* Color Palette Section */}
                                                <div className="grid grid-cols-2 gap-8 mt-8 pt-8 border-t border-white/5">
                                                    {/* Left: Palette Selection */}
                                                    <div className="space-y-4">
                                                        <div className="flex items-center justify-between">
                                                            <Label className="text-xs uppercase font-bold text-neutral-500 tracking-wider">
                                                                Brand Color Palette
                                                            </Label>
                                                            <span className="text-[10px] text-neutral-600 font-medium bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                                                                Select a preset
                                                            </span>
                                                        </div>

                                                        <div className="bg-black/20 rounded-2xl p-4 border border-white/5 shadow-inner">
                                                            <div className="grid grid-cols-6 gap-3">
                                                                {['#ef4444', '#f97316', '#f59e0b', '#84cc16', '#22c55e', '#06b6d4', '#3b82f6', '#6366f1', '#a855f7', '#d946ef', '#ec4899', '#f43f5e'].map(c => (
                                                                    <button
                                                                        key={c}
                                                                        className={`w-9 h-9 rounded-full transition-all duration-300 relative group ${selectedReviewApp?.color === c ? 'ring-2 ring-white ring-offset-2 ring-offset-[#0A0A0A] scale-110' : 'hover:scale-105 hover:ring-2 hover:ring-white/20 hover:ring-offset-1 hover:ring-offset-[#0A0A0A]'}`}
                                                                        style={{ backgroundColor: c }}
                                                                        onClick={() => {
                                                                            if (selectedReviewApp) {
                                                                                setSelectedReviewApp({ ...selectedReviewApp, color: c });
                                                                            }
                                                                        }}
                                                                    >
                                                                        {selectedReviewApp?.color === c && (
                                                                            <Check className="w-4 h-4 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 drop-shadow-md" strokeWidth={3} />
                                                                        )}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-4 px-1">
                                                            <div className="flex-1 h-px bg-white/5"></div>
                                                            <span className="text-[10px] text-neutral-600 font-medium">OR</span>
                                                            <div className="flex-1 h-px bg-white/5"></div>
                                                        </div>

                                                        <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                                                            <div className="w-10 h-10 rounded-lg shadow-inner ring-1 ring-white/10" style={{ backgroundColor: selectedReviewApp?.color || '#ffffff' }} />
                                                            <div className="space-y-0.5">
                                                                <div className="text-[10px] uppercase font-bold text-neutral-500 tracking-wide">Active Color</div>
                                                                <div className="text-sm font-mono text-white tracking-wide">{selectedReviewApp?.color || 'N/A'}</div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Right: Logo Picker */}
                                                    <div className="space-y-4">
                                                        <div className="flex items-center justify-between">
                                                            <Label className="text-xs uppercase font-bold text-neutral-500 tracking-wider">
                                                                Pick from Logo
                                                            </Label>
                                                            <span className="text-[10px] text-neutral-600 font-medium bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                                                                Click pixels to sample
                                                            </span>
                                                        </div>

                                                        <div className="bg-black/20 rounded-2xl p-6 border border-white/5 shadow-inner flex flex-col items-center justify-center min-h-[200px] relative group">
                                                            {selectedReviewApp?.icons?.['512'] ? (
                                                                <>
                                                                    <div className="relative w-32 h-32 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 transition-transform duration-500 group-hover:scale-105 group-hover:shadow-[0_0_30px_-5px_var(--highlight-color)]" style={{ '--highlight-color': selectedReviewApp?.color || '#ffffff' } as React.CSSProperties}>
                                                                        <div className="absolute inset-0 bg-[#0A0A0A] bg-[url('https://transparenttextures.com/patterns/dark-matter.png')] opacity-50"></div>
                                                                        <img
                                                                            src={selectedReviewApp.icons['512']}
                                                                            alt="App Icon"
                                                                            crossOrigin="anonymous"
                                                                            className="relative w-full h-full object-contain p-4 cursor-crosshair z-10"
                                                                            onClick={(e) => {
                                                                                const img = e.currentTarget;
                                                                                const canvas = document.createElement('canvas');
                                                                                canvas.width = img.naturalWidth;
                                                                                canvas.height = img.naturalHeight;
                                                                                const ctx = canvas.getContext('2d');
                                                                                if (ctx) {
                                                                                    ctx.drawImage(img, 0, 0);
                                                                                    const rect = img.getBoundingClientRect();
                                                                                    const x = (e.clientX - rect.left) * (img.naturalWidth / rect.width);
                                                                                    const y = (e.clientY - rect.top) * (img.naturalHeight / rect.height);
                                                                                    const pixel = ctx.getImageData(x, y, 1, 1).data;
                                                                                    const hex = '#' + [pixel[0], pixel[1], pixel[2]].map(x => x.toString(16).padStart(2, '0')).join('');
                                                                                    if (selectedReviewApp) {
                                                                                        setSelectedReviewApp({ ...selectedReviewApp, color: hex });
                                                                                        toast.success(`Color picked: ${hex}`);
                                                                                    }
                                                                                }
                                                                            }}
                                                                        />
                                                                    </div>
                                                                    <div className="mt-4 text-center space-y-1 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                                                        <p className="text-xs font-medium text-neutral-300">Intelligent Color Sampler</p>
                                                                        <p className="text-[10px] text-neutral-500">Click anywhere on the logo icon to instantly extract and apply the brand theme.</p>
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <div className="flex flex-col items-center justify-center text-neutral-600 gap-2">
                                                                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center">
                                                                        <AppWindow className="w-6 h-6 opacity-20" />
                                                                    </div>
                                                                    <span className="text-xs">No icon available</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {selectedFile && (
                                            <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                                                <div className="flex items-center justify-between">
                                                    <Label className="text-xs uppercase font-bold text-white tracking-wider flex items-center gap-2">
                                                        <FileText className="w-4 h-4 text-emerald-400" />
                                                        File Preview: <span className="text-emerald-300 normal-case font-mono">{selectedFile.name}</span>
                                                    </Label>
                                                    <Button size="sm" variant="ghost" onClick={() => setSelectedFile(null)} className="h-6 text-neutral-500 hover:text-white">
                                                        Close Preview
                                                    </Button>
                                                </div>

                                                <div className="rounded-xl border border-white/10 bg-[#0A0A0A] overflow-hidden shadow-2xl">
                                                    {selectedFile.type === 'text' ? (
                                                        <ScrollArea className="h-[500px] w-full">
                                                            <div className="p-4">
                                                                <pre className="text-xs font-mono text-neutral-300 whitespace-pre-wrap break-all leading-relaxed">
                                                                    {selectedFile.content}
                                                                </pre>
                                                            </div>
                                                        </ScrollArea>
                                                    ) : selectedFile.type === 'image' ? (
                                                        <div className="h-[500px] w-full flex items-center justify-center bg-[url('https://transparenttextures.com/patterns/dark-matter.png')]">
                                                            <img src={selectedFile.content || ""} className="max-w-full max-h-full object-contain" />
                                                        </div>
                                                    ) : (
                                                        <div className="h-64 flex flex-col items-center justify-center text-neutral-500 gap-4">
                                                            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5">
                                                                {selectedFile.name.endsWith('.exe') ? (
                                                                    <AppWindow className="w-8 h-8 text-neutral-400" />
                                                                ) : (
                                                                    <FileWarning className="w-8 h-8 text-neutral-400" />
                                                                )}
                                                            </div>
                                                            <div className="text-center space-y-1">
                                                                <p className="text-sm font-medium text-neutral-300">Preview not available</p>
                                                                <p className="text-xs text-neutral-500">
                                                                    This file type ({selectedFile.name.split('.').pop()}) cannot be viewed in the browser.
                                                                </p>
                                                            </div>
                                                            {selectedFile.content && (
                                                                <Button size="sm" variant="outline" asChild className="mt-2 border-white/10 hover:bg-white/5 text-white hover:text-white">
                                                                    <a href={selectedFile.content || "#"} download={selectedFile.name}>
                                                                        <Download className="w-4 h-4 mr-2" />
                                                                        Download File
                                                                    </a>
                                                                </Button>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* App Header & Overview */}
                                        <div className="grid grid-cols-3 gap-8">
                                            <div className="col-span-2 space-y-6">
                                                <div>
                                                    <Label className="text-xs uppercase font-bold text-emerald-500/80 mb-2 block tracking-wider">About this App</Label>
                                                    <h3 className="text-2xl font-bold text-white mb-2">{selectedReviewApp?.shortDescription}</h3>
                                                    <div className="prose prose-invert prose-sm max-w-none text-neutral-300 leading-relaxed">
                                                        {selectedReviewApp?.fullDescription || "No detailed description provided."}
                                                    </div>
                                                </div>

                                                <div className="pt-6 border-t border-white/5">
                                                    <Label className="text-xs uppercase font-bold text-emerald-500/80 mb-4 block tracking-wider">Media Gallery</Label>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        {selectedReviewApp?.bannerUrl && (
                                                            <div className="col-span-2 aspect-video bg-black/40 rounded-xl overflow-hidden border border-white/10 relative group">
                                                                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md text-[10px] font-bold text-white z-10">FEATURE BANNER</div>
                                                                <img src={selectedReviewApp.bannerUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                                            </div>
                                                        )}
                                                        {selectedReviewApp?.videoUrl && (
                                                            <div className="col-span-2 aspect-video bg-black/40 rounded-xl overflow-hidden border border-white/10 relative group">
                                                                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md text-[10px] font-bold text-white z-10">PREVIEW VIDEO</div>
                                                                <video src={selectedReviewApp.videoUrl} controls className="w-full h-full object-cover" />
                                                            </div>
                                                        )}
                                                        {selectedReviewApp?.screenshots?.map((url: string, i: number) => (
                                                            <div key={i} className="aspect-video bg-black/40 rounded-xl overflow-hidden border border-white/10 relative group cursor-pointer" onClick={() => window.open(url, '_blank')}>
                                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                                    <Eye className="w-6 h-6 text-white drop-shadow-lg" />
                                                                </div>
                                                                <img src={url} className="w-full h-full object-cover" />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-span-1 space-y-6">
                                                {/* Info Cards */}
                                                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4 backdrop-blur-sm">
                                                    <Label className="text-xs uppercase font-bold text-neutral-400 tracking-wider">App Details</Label>

                                                    <div className="space-y-3">
                                                        <div className="flex justify-between items-center py-1 border-b border-white/5 pb-2">
                                                            <span className="text-sm text-neutral-400">Version</span>
                                                            <span className="text-sm font-mono text-white">{selectedReviewApp?.version || '1.0.0'}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center py-1 border-b border-white/5 pb-2">
                                                            <span className="text-sm text-neutral-400">Pricing</span>
                                                            <span className="text-sm text-white capitalize">{selectedReviewApp?.pricingModel}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center py-1 border-b border-white/5 pb-2">
                                                            <span className="text-sm text-neutral-400">Price</span>
                                                            <span className="text-sm text-white">₹{selectedReviewApp?.price}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center py-1 border-b border-white/5 pb-2">
                                                            <span className="text-sm text-neutral-400">Category</span>
                                                            <span className="text-sm text-white">Productivity</span>
                                                        </div>
                                                        <div className="flex justify-between items-center py-1 border-b border-white/5 pb-2">
                                                            <span className="text-sm text-neutral-400">Platforms</span>
                                                            <div className="flex gap-1 flex-wrap justify-end max-w-[60%]">
                                                                {selectedReviewApp?.platforms && selectedReviewApp.platforms.length > 0 ? (
                                                                    selectedReviewApp.platforms.map((p: string) => (
                                                                        <span key={p} className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-white capitalize border border-white/5">{p}</span>
                                                                    ))
                                                                ) : (
                                                                    <span className="text-sm text-white">All Platforms</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="flex justify-between items-center py-1">
                                                            <span className="text-sm text-neutral-400">Availability</span>
                                                            <span className="text-sm text-white max-w-[150px] truncate text-right" title={selectedReviewApp?.distributionRegions?.join(', ')}>
                                                                {selectedReviewApp?.distributionMode === 'global'
                                                                    ? 'Global'
                                                                    : (selectedReviewApp?.distributionRegions && selectedReviewApp.distributionRegions.length > 0
                                                                        ? selectedReviewApp.distributionRegions.join(', ')
                                                                        : 'Global')}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="pt-2">
                                                        <div className="flex flex-wrap gap-2">
                                                            {selectedReviewApp?.tags?.map((tag: string) => (
                                                                <span key={tag} className="px-2 py-1 rounded-md bg-white/10 text-[10px] font-medium text-neutral-300 border border-white/5 uppercase tracking-wide">{tag}</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Reviewer Info */}
                                                {selectedReviewApp?.reviewerInfo && (
                                                    <div className="rounded-2xl border border-white/10 overflow-hidden">
                                                        <div className="bg-white/5 p-4 py-3 border-b border-white/5 flex items-center gap-2">
                                                            <div className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-400">
                                                                <ShieldCheck className="w-3.5 h-3.5" />
                                                            </div>
                                                            <Label className="text-xs uppercase font-bold text-neutral-300 tracking-wider">App Review Information</Label>
                                                        </div>

                                                        <div className="p-4 space-y-6 bg-black/20">
                                                            {selectedReviewApp.reviewerInfo.testCredentials && (
                                                                <div className="space-y-2">
                                                                    <Label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
                                                                        <Key className="w-3 h-3" />
                                                                        Test Access (Credentials & Steps)
                                                                    </Label>
                                                                    <div className="relative group">
                                                                        <pre className="text-xs bg-black/40 p-3 rounded-xl border border-white/5 text-neutral-300 font-mono whitespace-pre-wrap break-all pr-10 hover:border-white/10 transition-colors">
                                                                            {selectedReviewApp.reviewerInfo.testCredentials}
                                                                        </pre>
                                                                        <Button
                                                                            size="icon"
                                                                            variant="ghost"
                                                                            className="absolute right-1 top-1 h-7 w-7 text-neutral-500 hover:text-white hover:bg-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                                                            onClick={() => {
                                                                                navigator.clipboard.writeText(selectedReviewApp.reviewerInfo.testCredentials || "");
                                                                                toast.success("Credentials copied to clipboard");
                                                                            }}
                                                                        >
                                                                            <Copy className="w-3.5 h-3.5" />
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {selectedReviewApp.reviewerInfo.functionality && (
                                                                <div className="space-y-2">
                                                                    <Label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
                                                                        <AppWindow className="w-3 h-3" />
                                                                        App Functionality Overview
                                                                    </Label>
                                                                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                                                                        <p className="text-xs text-neutral-300 leading-relaxed whitespace-pre-line">
                                                                            {selectedReviewApp.reviewerInfo.functionality}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {selectedReviewApp.reviewerInfo.limitations && (
                                                                <div className="space-y-2">
                                                                    <Label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
                                                                        <AlertTriangle className="w-3 h-3" />
                                                                        Known Limitations
                                                                    </Label>
                                                                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                                                                        <p className="text-xs text-neutral-300 leading-relaxed whitespace-pre-line">
                                                                            {selectedReviewApp.reviewerInfo.limitations}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {selectedReviewApp.reviewerInfo.guidance && (
                                                                <div className="space-y-2">
                                                                    <Label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
                                                                        <FileText className="w-3 h-3" />
                                                                        Review Guidance
                                                                    </Label>
                                                                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                                                                        <p className="text-xs text-neutral-300 leading-relaxed whitespace-pre-line">
                                                                            {selectedReviewApp.reviewerInfo.guidance}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Download Action */}
                                                {selectedReviewApp?.buildUrl && (
                                                    <Button className="w-full h-12 bg-white text-black hover:bg-neutral-200 rounded-xl font-bold shadow-lg shadow-white/5" asChild>
                                                        <a href={selectedReviewApp.buildUrl} download>
                                                            <Code2 className="w-4 h-4 mr-2" />
                                                            Download Source Build
                                                        </a>
                                                    </Button>
                                                )}
                                            </div>
                                        </div>

                                        {/* History Section */}
                                        {historyData && historyData.length > 0 && (
                                            <div className="pt-8 border-t border-white/5">
                                                <Label className="text-xs uppercase font-bold text-neutral-500 mb-4 block tracking-wider">Review History</Label>
                                                <div className="relative border-l border-white/10 ml-3 space-y-8">
                                                    {historyData.map((record, i) => (
                                                        <div key={i} className="pl-8 relative">
                                                            <div className={`absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full border-2 border-[#0A0A0A] ${record.action === 'REJECTED' ? 'bg-red-500' :
                                                                record.action === 'TERMINATED' ? 'bg-red-700' :
                                                                    record.action === 'REOPENED' ? 'bg-emerald-500' :
                                                                        'bg-neutral-600'
                                                                }`}></div>
                                                            <div className="flex flex-col gap-1">
                                                                <div className="flex items-center gap-3">
                                                                    <span className={`text-sm font-bold ${record.action === 'REJECTED' ? 'text-red-400' : 'text-white'
                                                                        }`}>{record.action}</span>
                                                                    <span className="text-xs text-neutral-500">{new Date(record.createdAt).toLocaleString()}</span>
                                                                </div>
                                                                {record.reason && (
                                                                    <p className="text-sm text-neutral-400 bg-white/5 p-3 rounded-lg border border-white/5 mt-1 inline-block">
                                                                        "{record.reason}"
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </TabsContent>
                            <TabsContent value="privacy" className="flex-1 overflow-y-auto bg-neutral-900/50 p-8 mt-0 outline-none data-[state=inactive]:hidden">
                                <div className="max-w-4xl mx-auto grid grid-cols-2 gap-12">
                                    {/* Privacy Column */}
                                    <div className="space-y-8">
                                        <div>
                                            <h3 className="text-lg font-semibold text-white mb-1">Data Used to Track You</h3>
                                            <p className="text-sm text-neutral-400 mb-4">The following data may be used to track you across apps and websites owned by other companies.</p>
                                            <div className="space-y-3">
                                                {["Identifiers", "Usage Data", "Location"].map(item => (
                                                    <label key={item} className="flex items-center gap-3 text-sm text-neutral-300 cursor-pointer hover:text-white transition-colors">
                                                        <input
                                                            type="checkbox"
                                                            className="w-4 h-4 rounded border-white/10 bg-black checked:bg-emerald-500 accent-emerald-500"
                                                            checked={privacyTracking.includes(item)}
                                                            onChange={e => {
                                                                if (e.target.checked) setPrivacyTracking([...privacyTracking, item]);
                                                                else setPrivacyTracking(privacyTracking.filter(i => i !== item));
                                                            }}
                                                        />
                                                        {item}
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-semibold text-white mb-1">Data Linked to You</h3>
                                            <p className="text-sm text-neutral-400 mb-4">The following data may be collected and linked to your identity.</p>
                                            <div className="space-y-3">
                                                {["Purchases", "Location", "Contact Info", "User Content", "Identifiers", "Usage Data", "Diagnostics"].map(item => (
                                                    <label key={item} className="flex items-center gap-3 text-sm text-neutral-300 cursor-pointer hover:text-white transition-colors">
                                                        <input
                                                            type="checkbox"
                                                            className="w-4 h-4 rounded border-white/10 bg-black checked:bg-emerald-500 accent-emerald-500"
                                                            checked={privacyLinked.includes(item)}
                                                            onChange={e => {
                                                                if (e.target.checked) setPrivacyLinked([...privacyLinked, item]);
                                                                else setPrivacyLinked(privacyLinked.filter(i => i !== item));
                                                            }}
                                                        />
                                                        {item}
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Info Column */}
                                    <div className="space-y-6">
                                        <h3 className="text-lg font-semibold text-white mb-2">Store Information</h3>

                                        <div className="space-y-2">
                                            <Label>Age Rating</Label>
                                            <select
                                                className="w-full bg-black border border-white/10 rounded-md p-2 text-sm text-white focus:border-emerald-500 outline-none"
                                                value={extraInfo.ageRating}
                                                onChange={e => setExtraInfo({ ...extraInfo, ageRating: e.target.value })}
                                            >
                                                <option value="4+">4+</option>
                                                <option value="9+">9+</option>
                                                <option value="12+">12+</option>
                                                <option value="17+">17+</option>
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Copyright</Label>
                                            <Input
                                                className="bg-black border-white/10 text-white focus:border-emerald-500"
                                                placeholder="© 2025 LoopSync Entertainment"
                                                value={extraInfo.copyright}
                                                onChange={e => setExtraInfo({ ...extraInfo, copyright: e.target.value })}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Developer Website</Label>
                                            <Input
                                                className="bg-black border-white/10 text-white focus:border-emerald-500"
                                                placeholder="https://example.com"
                                                value={extraInfo.website}
                                                onChange={e => setExtraInfo({ ...extraInfo, website: e.target.value })}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Support Email</Label>
                                            <Input
                                                className="bg-black border-white/10 text-white focus:border-emerald-500"
                                                placeholder="support@example.com"
                                                value={extraInfo.supportEmail}
                                                onChange={e => setExtraInfo({ ...extraInfo, supportEmail: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
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
                {/* App Activity History Dialog */}
                <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
                    <DialogContent className="sm:max-w-[600px] bg-[#0A0A0A] rounded-3xl border-white/10 text-white shadow-2xl p-6 gap-6">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-semibold text-white flex items-center gap-2">
                                <History className="w-5 h-5 text-neutral-400" />
                                App Activity History
                            </DialogTitle>
                            <DialogDescription className="text-neutral-400 text-sm">
                                View activity logs for <span className="text-white font-bold">{selectedHistoryApp?.name}</span>.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="rounded-xl border border-white/10 bg-black/40 overflow-hidden h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                            {loadingHistory ? (
                                <div className="p-8 flex justify-center">
                                    <Loader2 className="w-6 h-6 animate-spin text-neutral-500" />
                                </div>
                            ) : (!historyData || historyData.length === 0) ? (
                                <div className="p-8 text-center text-sm text-neutral-500">
                                    No activity history found.
                                </div>
                            ) : (
                                <div className="divide-y divide-white/5">
                                    {historyData.map((record, i) => (
                                        <div key={i} className="p-4 hover:bg-white/[0.02] transition-colors">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className={`text-xs font-bold uppercase ${record.action === 'REJECTED' ? 'text-red-400' :
                                                    record.action === 'TERMINATED' ? 'text-red-500' :
                                                        record.action === 'REOPENED' ? 'text-emerald-400' :
                                                            'text-neutral-400'
                                                    }`}>
                                                    {record.action || 'REJECTED'}
                                                </span>
                                                <span className="text-xs text-neutral-500">
                                                    {new Date(record.createdAt).toLocaleString()}
                                                </span>
                                            </div>
                                            {record.reason && (
                                                <p className="text-sm text-neutral-300 leading-relaxed whitespace-pre-wrap">
                                                    {record.reason}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
            </main >
        </div >
    );
}
// --- Build File Tree Components ---

interface FileNode {
    name: string;
    path: string;
    type: 'file' | 'folder';
    size: number;
    children?: FileNode[];
}

function BuildFileTree({ url, onSizeCalculated, onFileSelect, onZipLoaded }: {
    url: string;
    onSizeCalculated: (size: string) => void;
    onFileSelect: (file: any) => void;
    onZipLoaded?: (zip: JSZip) => void;
}) {
    const [structure, setStructure] = useState<FileNode[] | null>(null);
    const [rootZip, setRootZip] = useState<JSZip | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchZip = async () => {
            try {
                setLoading(true);
                const response = await fetch(url);
                if (!response.ok) throw new Error("Failed to fetch build");
                const blob = await response.blob();

                // Calculate and report size immediately upon fetch
                onSizeCalculated(formatBytes(blob.size));

                const zip = await JSZip.loadAsync(blob);
                setRootZip(zip); // Store the zip instance
                if (onZipLoaded) onZipLoaded(zip);

                const root: FileNode[] = [];
                const paths: { [key: string]: FileNode } = {};

                // First pass: create nodes
                zip.forEach((relativePath, zipEntry) => {
                    const parts = relativePath.split('/');
                    const fileName = parts.pop();
                    if (!fileName && zipEntry.dir) return; // Skip empty folder entries if redundant

                    // Reconstruct simple tree
                    // Note: This is a simplified flat-to-tree for zip.
                    // A robust implementation would handle nested folders recursively.
                    // For now, let's just show a simplified list or 1-level depth if complex

                    // Actually, let's do a proper tree construction
                    let currentLevel = root;
                    let currentPath = "";

                    parts.forEach((part, index) => {
                        // This logic handles creating folder nodes
                        // We can improve this if needed, but for now let's just List them flat-ish or use a helper
                    });
                });

                // Simpler Approach for speed:
                // Parse distinct paths
                const nodes: FileNode[] = [];

                zip.forEach((relativePath, zipEntry) => {
                    if (zipEntry.dir) return;
                    nodes.push({
                        name: relativePath,
                        path: relativePath,
                        type: 'file',
                        size: (zipEntry as any)._data?.uncompressedSize || 0
                    });
                });

                // Convert flat list of files to tree
                const tree = buildTreeFromPaths(nodes);

                setStructure(tree);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError("Could not load build structure");
                setLoading(false);
            }
        };

        if (url) fetchZip();
    }, [url]);

    const handleNodeClick = async (node: FileNode) => {
        if (node.type !== 'file' || !rootZip) return;

        try {
            const file = rootZip.file(node.path);
            if (!file) return;

            const name = node.name.toLowerCase();
            const isImage = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(name);
            const isText = /\.(txt|json|js|jsx|ts|tsx|css|html|md|xml|yml|yaml|env|config)$/i.test(name) || !name.includes('.');

            if (isImage) {
                const blob = await file.async('blob');
                const url = URL.createObjectURL(blob);
                onFileSelect({
                    name: node.name,
                    content: url,
                    type: 'image'
                });
            } else if (isText) {
                const text = await file.async('string');
                onFileSelect({
                    name: node.name,
                    content: text,
                    type: 'text'
                });
            } else {
                // Convert binary/other files to blob for downloading
                const blob = await file.async('blob');
                const url = URL.createObjectURL(blob);
                onFileSelect({
                    name: node.name,
                    content: url, // Pass the blob URL
                    type: 'other'
                });
            }
        } catch (e) {
            console.error("Error reading file", e);
            // toast.error("Failed to read file content"); // Assuming toast is available
        }
    };

    if (loading) return <div className="flex items-center justify-center h-32 text-neutral-500 gap-2"><Loader2 className="animate-spin w-4 h-4" /><span className="text-xs">Parsing Bundle...</span></div>;
    if (error) return <div className="p-4 text-xs text-red-400 text-center">{error}</div>;
    if (!structure) return null;

    return (
        <div className="text-xs font-mono">
            {structure.map((node, i) => (
                <TreeNode key={i} node={node} level={0} onSelect={handleNodeClick} />
            ))}
        </div>
    );
}

function buildTreeFromPaths(files: FileNode[]): FileNode[] {
    const root: FileNode[] = [];

    files.forEach(file => {
        const parts = file.path.split('/');
        let currentLevel = root;

        parts.forEach((part, index) => {
            const isFile = index === parts.length - 1;
            const existingNode = currentLevel.find(n => n.name === part);

            if (existingNode) {
                if (!isFile && existingNode.children) {
                    currentLevel = existingNode.children;
                }
            } else {
                const newNode: FileNode = {
                    name: part,
                    path: file.path,
                    type: isFile ? 'file' : 'folder',
                    size: isFile ? file.size : 0,
                    children: isFile ? undefined : []
                };
                currentLevel.push(newNode);
                if (!isFile && newNode.children) {
                    currentLevel = newNode.children;
                }
            }
        });
    });

    // Sort: Folders first, then files
    const sortNodes = (nodes: FileNode[]) => {
        nodes.sort((a, b) => {
            if (a.type === b.type) return a.name.localeCompare(b.name);
            return a.type === 'folder' ? -1 : 1;
        });
        nodes.forEach(n => {
            if (n.children) sortNodes(n.children);
        });
    };
    sortNodes(root);
    return root;
}

function TreeNode({ node, level, onSelect }: { node: FileNode, level: number, onSelect: (node: FileNode) => void }) {
    const [isOpen, setIsOpen] = useState(level < 2); // Open top levels by default
    const hasChildren = node.type === 'folder' && node.children && node.children.length > 0;

    const handleClick = () => {
        if (node.type === 'folder') {
            setIsOpen(!isOpen);
        } else {
            onSelect(node);
        }
    };

    const handleDragStart = (e: React.DragEvent) => {
        e.dataTransfer.setData("application/json", JSON.stringify(node));
        e.dataTransfer.effectAllowed = "copy";

        // Create a custom drag ghost if needed, or default
        const dragPreview = document.createElement("div");
        dragPreview.innerText = node.name;
        dragPreview.style.background = "#333";
        dragPreview.style.color = "#fff";
        dragPreview.style.padding = "4px 8px";
        dragPreview.style.borderRadius = "4px";
        dragPreview.style.position = "absolute";
        dragPreview.style.top = "-1000px";
        document.body.appendChild(dragPreview);
        e.dataTransfer.setDragImage(dragPreview, 0, 0);
        setTimeout(() => document.body.removeChild(dragPreview), 0);
    };

    return (
        <div>
            <div
                className={`flex items-center gap-1.5 py-1 px-2 hover:bg-white/5 cursor-pointer rounded select-none transition-colors ${node.name.startsWith('.') ? 'opacity-50' : ''}`}
                style={{ paddingLeft: `${level * 12 + 8}px` }}
                onClick={handleClick}
                draggable={true}
                onDragStart={handleDragStart}
            >
                <div className="text-neutral-500 w-3 h-3 flex items-center justify-center shrink-0">
                    {node.type === 'folder' && (
                        isOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />
                    )}
                </div>

                {node.type === 'folder' ? (
                    <Folder className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                ) : (
                    <FileIcon className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                )}

                <span className={`truncate ${node.type === 'folder' ? 'text-neutral-200 font-medium' : 'text-neutral-400'}`}>
                    {node.name}
                </span>

                {node.type === 'file' && (
                    <span className="ml-auto text-[9px] text-neutral-600 pl-2">
                        {formatBytes(node.size)}
                    </span>
                )}
            </div>

            {hasChildren && isOpen && (
                <div className="animate-in slide-in-from-top-1 fade-in duration-200">
                    {node.children!.map((child, i) => (
                        <TreeNode key={i} node={child} level={level + 1} onSelect={onSelect} />
                    ))}
                </div>
            )}
        </div>
    );
}

function formatBytes(bytes: number, decimals = 1) {
    if (!+bytes) return '0 B';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
