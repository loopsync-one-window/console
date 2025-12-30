"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

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
    Check,
    ChevronDown,
    Download,
    ShieldCheck,
    Loader2,
    Flag,
    HelpCircle,
    Heart,
    ShoppingBag,
    CheckCircle2,
    Trash2
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PublisherProfileOverlay } from "../components/PublisherProfileOverlay";
import { Dithering } from "@paper-design/shaders-react";
import Link from "next/link";
import { toast } from "sonner";
import { getStoreAppDetails, getAppDownloadUrl, AppMock, getStoreApps, createPaymentOrder, verifyPayment, checkAppOwnership, reportApp, createContributionOrder, verifyContribution, getAppReviews, submitAppReview, deleteReview, Review, ReviewStats } from "@/lib/store-api";
import { cn } from "@/lib/utils";
import { containsBadWord } from "@/lib/badWords";
// import { Loader } from "@/components/ui/loader"; // Use SVG for specific loader style

const loadRazorpay = () => {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

import { CategoryView } from "../components/CategoryView";

// ... existing imports ...

export default function AppDetailsPage() {
    const params = useParams();
    const slug = params.slug;
    const appId = Array.isArray(slug) ? slug[0] : slug as string;

    // Check if this is a category view
    const CATEGORY_ROUTES = [
        "games", "apps", "extensions", "software",
        "productivity", "developer", "social", "education",
        "entertainment", "health", "finance", "photo-video",
        "utilities", "travel", "others"
    ];

    if (CATEGORY_ROUTES.includes(appId.toLowerCase())) {
        return <CategoryView categorySlug={appId.toLowerCase()} />;
    }

    const [app, setApp] = useState<AppMock | null>(null);
    const [loading, setLoading] = useState(true);

    // Existing states
    const [isExpanded, setIsExpanded] = useState(false);
    const [isWritingReview, setIsWritingReview] = useState(false);
    const [userRating, setUserRating] = useState(0);
    const [showPublisherProfile, setShowPublisherProfile] = useState(false);
    const [downloadState, setDownloadState] = useState<'idle' | 'downloading' | 'completed'>('idle');
    const [progress, setProgress] = useState(0);
    const [moreApps, setMoreApps] = useState<AppMock[]>([]);
    const [isCopied, setIsCopied] = useState(false);

    // Report State
    const [reportOpen, setReportOpen] = useState(false);
    const [reporting, setReporting] = useState(false);
    const [reportData, setReportData] = useState({ reason: '', description: '', name: '', email: '' });

    // Contribute State
    const [contributeOpen, setContributeOpen] = useState(false);
    const [contributionStep, setContributionStep] = useState<'info' | 'amount' | 'success'>('info');
    const [contributionAmount, setContributionAmount] = useState<string>('');

    // Reviews State
    const [reviews, setReviews] = useState<Review[]>([]);
    const [reviewStats, setReviewStats] = useState<ReviewStats | null>(null);
    const [reviewsLoading, setReviewsLoading] = useState(false);
    const [reviewFormData, setReviewFormData] = useState({ title: "", content: "" });
    const [submittingReview, setSubmittingReview] = useState(false);

    useEffect(() => {
        if (appId) {
            setReviewsLoading(true);
            getAppReviews(appId)
                .then(data => {
                    setReviews(data.reviews);
                    setReviewStats(data.stats);
                })
                .catch(err => console.error("Failed to fetch reviews", err))
                .finally(() => setReviewsLoading(false));
        }
    }, [appId]);

    const handleReviewSubmit = async () => {
        const token = localStorage.getItem('access_token') || "";

        if (userRating === 0) {
            toast.error("Please select a star rating");
            return;
        }
        if (!reviewFormData.title.trim()) {
            toast.error("Please enter a review title");
            return;
        }

        if (containsBadWord(reviewFormData.title) || containsBadWord(reviewFormData.content)) {
            toast.error("Review contains inappropriate content");
            return;
        }

        setSubmittingReview(true);
        try {
            const newReview = await submitAppReview(appId, {
                rating: userRating,
                title: reviewFormData.title,
                content: reviewFormData.content
            }, token);

            setReviews([newReview, ...reviews]);
            handleReviewSubmitSuccess(newReview);
            // Optimistically update stats? Or just refetch. For now, let's keep it simple.
            toast.success("Review submitted successfully");
            setIsWritingReview(false);
            setReviewFormData({ title: "", content: "" });
            setUserRating(0);
        } catch (e: any) {
            toast.error(e.message || "Failed to submit review");
        } finally {
            setSubmittingReview(false);
        }
    };

    const handleDeleteReview = async (reviewId: string) => {
        const token = localStorage.getItem('access_token') || "";
        try {
            await deleteReview(appId, reviewId, token);
            setReviews(reviews.filter(r => r.id !== reviewId));
            toast.success("Review deleted");

            // Cleanup local storage
            const myReviews = JSON.parse(localStorage.getItem('my_reviews') || '{}');
            delete myReviews[reviewId];
            localStorage.setItem('my_reviews', JSON.stringify(myReviews));
        } catch (e: any) {
            toast.error(e.message || "Failed to delete review");
        }
    };

    const [myReviewIds, setMyReviewIds] = useState<Record<string, number>>({});

    useEffect(() => {
        // Load my reviews from local storage
        const stored = localStorage.getItem('my_reviews');
        if (stored) {
            setMyReviewIds(JSON.parse(stored));
        }
    }, []);

    // Update submission to save to local storage
    const handleReviewSubmitSuccess = (review: Review) => {
        const newIds = { ...myReviewIds, [review.id]: Date.now() };
        setMyReviewIds(newIds);
        localStorage.setItem('my_reviews', JSON.stringify(newIds));
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(window.location.href);
        setIsCopied(true);
        toast.success("Link copied to clipboard");
        setTimeout(() => setIsCopied(false), 2000);
    };

    const handleReportSubmit = async () => {
        if (!reportData.reason || !reportData.description || !reportData.email) {
            toast.error("Please fill in all required fields");
            return;
        }
        setReporting(true);
        try {
            await reportApp(appId, {
                reason: reportData.reason,
                description: reportData.description,
                reporterName: reportData.name,
                reporterEmail: reportData.email
            });
            toast.success("Report submitted successfully");
            setReportOpen(false);
            setReportData({ reason: '', description: '', name: '', email: '' });
        } catch (e) {
            toast.error("Failed to submit report");
        } finally {
            setReporting(false);
        }
    };

    // Payment States
    const [isOwned, setIsOwned] = useState(false);
    const [paymentProcessing, setPaymentProcessing] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (appId && token) {
            checkAppOwnership(appId, token)
                .then(res => setIsOwned(res.owned))
                .catch(() => { }); // Ignore errors, assume not owned
        }
    }, [appId]);

    const handlePayment = async () => {
        console.log("Handle Payment Clicked");
        const token = localStorage.getItem('access_token') || ""; // Allow empty token

        console.log("Starting payment process for app:", app?.id);
        setPaymentProcessing(true);
        try {
            const res = await loadRazorpay();
            if (!res) {
                console.error("Razorpay script failed to load");
                toast.error('Razorpay SDK failed to load');
                setPaymentProcessing(false);
                return;
            }
            console.log("Razorpay script loaded");

            const order = await createPaymentOrder(app?.id || appId, token);
            console.log("Order created:", order);

            if (!order || !order.id) {
                console.error("Invalid order received:", order);
                toast.error("Failed to create payment order");
                setPaymentProcessing(false);
                return;
            }

            const options = {
                key: order.keyId,
                amount: order.amount,
                currency: order.currency,
                name: order.appName,
                description: order.description,
                image: app?.icon, // Optional branding
                order_id: order.id,
                handler: async function (response: any) {
                    try {
                        const verify = await verifyPayment({
                            razorpayOrderId: response.razorpay_order_id,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpaySignature: response.razorpay_signature,
                            appId: app?.id || appId
                        }, token);

                        if (verify.success) {
                            if (verify.accessToken) {
                                // Auto-login guest / update token
                                localStorage.setItem('access_token', verify.accessToken);
                                // Also update API token? usually lib reads from storage but better to be safe
                            }

                            toast.success("Payment Completed", {
                                description: "Your app is now installing..."
                            });
                            setIsOwned(true);
                            handleDownload(verify.accessToken || token);
                        } else {
                            toast.error("Payment Verification Failed");
                        }
                    } catch (e) {
                        toast.error("Payment Verification Failed");
                    } finally {
                        setPaymentProcessing(false);
                    }
                },
                theme: {
                    color: app?.branding?.activeColor || "#000000"
                }
            };

            const rzp1 = new (window as any).Razorpay(options);
            rzp1.on('payment.failed', function (response: any) {
                toast.error(response.error.description || "Payment Failed");
                setPaymentProcessing(false);
            });
            rzp1.open();

        } catch (e: any) {
            console.error(e);
            toast.error(e.message || "Payment initiation failed");
        }
    };

    const handleContributionPayment = async () => {
        const amount = typeof contributionAmount === 'string' ? parseInt(contributionAmount.replace(/,/g, '')) : contributionAmount;
        if (!amount || isNaN(amount) || amount < 50 || amount > 1000000000) {
            toast.error("Please enter a valid amount between ₹50 and ₹100 Crore");
            return;
        }

        const token = localStorage.getItem('access_token') || "";
        setPaymentProcessing(true);

        try {
            const res = await loadRazorpay();
            if (!res) {
                toast.error('Razorpay SDK failed to load');
                setPaymentProcessing(false);
                return;
            }

            const order = await createContributionOrder(appId, amount, token);
            if (!order || !order.id) {
                toast.error("Failed to create contribution order");
                setPaymentProcessing(false);
                return;
            }

            const options = {
                key: order.keyId,
                amount: order.amount,
                currency: order.currency,
                name: order.appName,
                description: order.description,
                image: typeof app?.icon === 'string' ? app.icon : (app?.icon as any)?.['512'],
                order_id: order.id,
                handler: async function (response: any) {
                    try {
                        const verify = await verifyContribution({
                            razorpayOrderId: response.razorpay_order_id,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpaySignature: response.razorpay_signature,
                            appId: app?.id || appId,
                        }, token);

                        if (verify.success) {
                            setContributionStep('success');
                        } else {
                            toast.error("Payment Verification Failed");
                        }
                    } catch (e) {
                        toast.error("Payment Verification Failed");
                    } finally {
                        setPaymentProcessing(false);
                    }
                },
                theme: {
                    color: app?.branding?.activeColor || "#000000"
                },
                modal: {
                    ondismiss: function () {
                        setPaymentProcessing(false);
                    }
                }
            };

            const rzp1 = new (window as any).Razorpay(options);
            rzp1.on('payment.failed', function (response: any) {
                toast.error(response.error.description || "Payment Failed");
                setPaymentProcessing(false);
            });
            rzp1.open();

        } catch (e) {
            console.error(e);
            toast.error("Payment initiation failed");
            setPaymentProcessing(false);
        }
    };

    useEffect(() => {
        if (app?.publisher?.id) {
            getStoreApps({ limit: 8, publisherId: app.publisher.id }).then(data => {
                setMoreApps(data.items.filter(a => a.id !== appId));
            });
        } else {
            // Initial/Fallback fetch
            getStoreApps({ limit: 4 }).then(data => {
                setMoreApps(data.items.filter(a => a.id !== appId).slice(0, 3));
            });
        }
    }, [appId, app?.publisher?.id]);

    useEffect(() => {
        if (appId) {
            getStoreAppDetails(appId)
                .then(setApp)
                .catch((e) => {
                    console.error(e);
                    toast.error("Failed to load app details");
                })
                .finally(() => setLoading(false));
        }
    }, [appId]);

    const handleDownload = async (overrideToken?: string) => {
        if (!app) return;
        setDownloadState('downloading');
        try {
            // Simulate progress for UX before real download or during?
            // Since we get a URL, we can just redirect. 
            // Let's do a fake/real progress hybrid.

            const startDownload = async () => {
                const token = overrideToken || localStorage.getItem('access_token') || undefined;
                const { downloadUrl } = await getAppDownloadUrl(app.id, "windows", token);
                const link = document.createElement('a');
                link.href = downloadUrl;
                link.setAttribute('download', ''); // key for download
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                setDownloadState('completed');
                toast.success("Download started");

                // Revert button logic
                setTimeout(() => {
                    setDownloadState('idle');
                    setProgress(0);
                }, 3000);
            };

            await startDownload();

        } catch (e) {
            console.error(e);
            toast.error("Download unavailable or failed");
            setDownloadState('idle');
            setProgress(0);
        }
    };

    // Progress simulation hook (keep existing but modify condition?)
    useEffect(() => {
        if (downloadState === 'downloading') {
            const interval = setInterval(() => {
                setProgress(prev => {
                    const next = prev + Math.random() * 15; // faster
                    if (next >= 100) {
                        // Don't auto-complete state here, wait for real action, or if simple link, just finish
                        if (next > 100) return 99;
                        return next;
                    }
                    return next;
                });
            }, 200);
            return () => clearInterval(interval);
        } else if (downloadState === 'idle') {
            setProgress(0);
        }
    }, [downloadState]);

    if (loading) {
        return <div className="min-h-screen bg-black flex items-center justify-center text-white">
            {/* <Loader /> */}
        </div>;
    }

    if (!app) {
        return <div className="min-h-screen bg-black flex items-center justify-center text-white">App not found</div>;
    }

    return (
        <div className="min-h-screen bg-black text-white">
            {/* PUBLISHER PROFILE OVERLAY */}
            {/* PUBLISHER PROFILE OVERLAY */}
            <PublisherProfileOverlay
                isOpen={showPublisherProfile}
                onClose={() => setShowPublisherProfile(false)}
                publisher={app.publisher}
            />

            {/* HERO */}
            <section className="relative px-6 md:px-10 pt-10 pb-16">
                {/* Gradient Mesh Background */}
                {/* Dithering Background with Blur Overlay */}
                <div className="absolute inset-0 z-0 opacity-100">
                    <Dithering
                        style={{ height: "100%", width: "100%" }}
                        colorBack="#000000"
                        colorFront={(app.branding?.activeColor && app.branding.activeColor.startsWith('#')) ? app.branding.activeColor : (app.branding?.activeColor === 'bg-white' ? '#ffffff' : '#42d09d')}
                        shape={"wave" as any}
                        type="8x8"
                        pxSize={1}
                        offsetX={0}
                        offsetY={0}
                        scale={0.8}
                        rotation={0}
                        speed={1.5}
                    />
                </div>
                <div className="absolute inset-0 z-0 backdrop-blur-sm bg-transparent pointer-events-none" />

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
                        <button
                            onClick={handleCopy}
                            className="w-9 h-9 p-2 rounded-full bg-transparent border border-white/10 flex items-center justify-center hover:bg-zinc-800 transition text-white"
                        >
                            {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share className="w-4 h-4" />}
                        </button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="w-9 h-9 p-2 rounded-full bg-transparent border border-white/10 flex items-center justify-center hover:bg-zinc-800 transition text-white focus:outline-none">
                                    <MoreHorizontal className="w-4 h-4" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 bg-[#000]/10 backdrop-blur-sm border-white/10 text-white rounded-xl p-1 shadow-2xl backdrop-blur-xl">
                                <DropdownMenuItem onClick={() => setReportOpen(true)} className="focus:bg-white/10 focus:text-white rounded-lg cursor-pointer flex gap-3 p-2.5 text-xs font-medium">
                                    <Flag className="w-4 h-4 text-zinc-400" /> Report Issue
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => window.open('https://loopsync.cloud/one-window/support/resources', '_blank')} className="focus:bg-white/10 focus:text-white rounded-lg cursor-pointer flex gap-3 p-2.5 text-xs font-medium">
                                    <HelpCircle className="w-4 h-4 text-zinc-400" /> Help & Support
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setContributeOpen(true)} className="focus:bg-white/10 focus:text-white rounded-lg cursor-pointer flex gap-3 p-2.5 text-xs font-medium">
                                    <Heart className="w-4 h-4 text-zinc-400" /> Contribute
                                </DropdownMenuItem>
                                <DropdownMenuItem className="focus:bg-white/10 focus:text-white rounded-lg cursor-pointer flex gap-3 p-2.5 text-xs font-medium">
                                    <ShoppingBag className="w-4 h-4 text-zinc-400" /> Acquire App
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* App Header */}
                <div className="relative z-10 max-w-6xl mx-auto flex flex-col md:flex-row gap-10 items-start">
                    {/* Icon */}
                    <div className="w-28 h-28 md:w-36 md:h-36 rounded-[28px] bg-zinc-900 border border-white/10 overflow-hidden shadow-xl relative">
                        {app.icon ? (
                            <>
                                <div className="absolute inset-0 bg-zinc-800 animate-pulse" />
                                <img
                                    src={typeof app.icon === 'string' ? app.icon : (app.icon as any)['512'] || Object.values(app.icon)[0] as string}
                                    alt={app.name}
                                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 opacity-0"
                                    onLoad={(e) => (e.currentTarget as HTMLImageElement).classList.remove('opacity-0')}
                                />
                            </>
                        ) : (
                            <div className={`w-full h-full flex items-center justify-center text-4xl font-bold ${app.branding?.activeColor || "bg-neutral-800"}`}>
                                {app.name.charAt(0)}
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                        <h1 className="text-4xl md:text-5xl text-white font-semibold tracking-tight mb-2">
                            {app.name}
                        </h1>
                        <div className="flex items-center gap-3 text-white text-base mb-6 font-medium">
                            <p className="uppercase">{app.category}</p>
                            <span className="text-white">|</span>
                            <div className="flex items-center gap-1.5 text-white">
                                <span
                                    onClick={() => setShowPublisherProfile(true)}
                                    className="hover:underline hover:underline-offset-2 cursor-pointer transition-all hover:text-white/80"
                                >
                                    {app.publisher?.name || "DeveloperX"}
                                </span>
                                {app.publisher?.verified && (
                                    <div className="relative group/badge cursor-help">
                                        <img src="/verified/badge.svg" alt="Verified" className="w-3.5 h-3.5" />
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-transparent backdrop-blur-sm border border-white/10 rounded text-[14px] font-medium text-white whitespace-nowrap opacity-0 group-hover/badge:opacity-100 transition-opacity pointer-events-none md:block hidden">
                                            Verified Publisher
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <p className="text-white font-medium text-lg leading-snug mb-6 max-w-md">
                            {app.shortDescription}
                        </p>

                        <div className="flex items-center gap-4">
                            {/* Main Action Button */}
                            <button
                                onClick={
                                    app.category.toLowerCase() === 'extension' ? () => window.open("https://loopsync.cloud/home", "_blank") :
                                        app.pricing.type === 'sub' ? () => window.location.href = "https://loopsync.cloud/home" :
                                            (isOwned || app.pricing.type === 'free') ? () => handleDownload() :
                                                handlePayment
                                }
                                disabled={paymentProcessing}
                                className={`
                                    relative overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] rounded-full text-sm font-semibold flex items-center justify-center
                                    ${downloadState === 'idle' && !paymentProcessing
                                        ? 'bg-white hover:bg-white/90 text-black w-auto min-w-[140px] px-6 py-5 active:scale-95'
                                        : 'bg-white/20 text-white w-36 py-5 cursor-default'
                                    }
                                `}
                            >
                                {/* Idle Text */}
                                <span className={`absolute transition-all duration-300 ${downloadState === 'idle' && !paymentProcessing ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
                                    {app.category.toLowerCase() === 'extension' ? 'Add Extension' :
                                        app.pricing.type === 'sub' ? 'Subscribe' :
                                            (isOwned || app.pricing.type === 'free') ? 'Get' :
                                                `Pay ₹${new Intl.NumberFormat('en-IN').format(Number(app.pricing.price))}`}
                                </span>

                                {/* Downloading/Processing State */}
                                <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${(downloadState === 'downloading' || downloadState === 'completed' || paymentProcessing) ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
                                    {paymentProcessing ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            {/* Progress Background */}
                                            <div
                                                className="absolute left-0 top-0 bottom-0 bg-white transition-all duration-100 ease-linear"
                                                style={{ width: `${progress}%` }}
                                            />
                                            {/* Percentage Text */}
                                            <span className="relative z-10 font-mono text-xs tabular-nums tracking-widest text-white mix-blend-difference font-bold">
                                                {downloadState === 'completed' ? 'OPEN' : `${Math.round(progress)}%`}
                                            </span>
                                        </>
                                    )}
                                </div>
                            </button>
                            <span className="text-xs font-medium bg-transparent backdrop-blur-sm text-white px-5 py-2.5 rounded-full">
                                {app.pricing.type === 'free' ? 'Free Download' : 'In-App Purchases'}
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* STATS */}
            <section className="border-t border-white/5">
                <div className="max-w-6xl mx-auto px-6 md:px-10 py-10 grid grid-cols-3 md:grid-cols-6 gap-y-8 text-center">
                    <Stat
                        title="Rating"
                        value={reviewStats ? reviewStats.averageRating.toFixed(1) : app.stats.rating.toFixed(1)}
                        below={`${new Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(app.stats.downloads)} Downloads`}
                    >
                        <Star className="w-4 h-4 fill-white" />
                    </Stat>

                    {/* Replaced 'Awards' with 'Size' as we don't have awards data yet */}
                    <Stat
                        title="Size"
                        value={(app.build?.platforms?.windows?.sizeMB || 0) > 0 ? `${(app.build?.platforms?.windows?.sizeMB || 0).toFixed(0)} MB` : 'Varies'}
                        below="On Disk"
                    >
                    </Stat>

                    <Stat
                        title="Age"
                        value={app.info?.ageRating || '4+'}
                        below="Years"
                    />

                    <Stat
                        title="Category"
                        below={app.category}
                    >
                        <Layers className="w-6 h-6 text-white" />
                    </Stat>

                    <Stat
                        title="Developer"
                        below={app.publisher.name.length > 12 ? app.publisher.name.substring(0, 10) + '...' : app.publisher.name}
                    >
                        <User className="w-6 h-6 text-white" />
                    </Stat>

                    <Stat
                        title="Language"
                        // value={app.info?.languages?.[0]?.substring(0, 2).toUpperCase() || 'EN'}
                        below={app.info?.languages?.length && app.info.languages.length > 1 ? `+ ${app.info.languages.length - 1} More` : "English"}
                    >
                        <Globe className="w-6 h-6 text-white" />
                    </Stat>
                </div>
            </section>

            {/* PREVIEW */}
            <section className="max-w-6xl mx-auto px-6 md:px-10 py-14">
                <h2 className="text-lg font-semibold mb-6">Preview</h2>
                <div className="flex gap-6 overflow-x-auto no-scrollbar snap-x">
                    {app.media?.previewVideo && (
                        <div className="relative snap-center flex-shrink-0 w-[280px] md:w-[560px] aspect-video rounded-3xl bg-zinc-900 border border-white/5 overflow-hidden group">
                            <video
                                src={app.media.previewVideo}
                                controls
                                className="w-full h-full object-cover"
                                poster={app.media.featureBanner}
                            />
                        </div>
                    )}
                    {app.media?.screenshots && app.media.screenshots.length > 0 ? (
                        app.media.screenshots.map((shot, i) => (
                            <div
                                key={i}
                                className="relative snap-center flex-shrink-0 w-[280px] md:w-[560px] aspect-video rounded-3xl bg-zinc-900 border border-white/5 overflow-hidden group"
                            >
                                <img
                                    src={shot}
                                    alt={`Preview ${i}`}
                                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition"
                                />
                            </div>
                        ))
                    ) : (
                        !app.media?.previewVideo && <div className="text-zinc-500">No previews available</div>
                    )}
                </div>
            </section>

            {/* DESCRIPTION */}
            <section className="border-t border-white/5">
                <div className="max-w-6xl mx-auto px-6 md:px-10 py-14 grid md:grid-cols-3 gap-12">
                    <div className="md:col-span-2">
                        <div
                            className={`relative overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[1000px]' : 'max-h-[140px]'}`}
                        >
                            <div className="text-zinc-300 leading-relaxed text-base whitespace-pre-line">
                                {app.descriptions?.long || app.fullDescription || "No description available."}
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

                    <div className="rounded-3xl bg-[#000000] border border-white/8 px-7 py-6 space-y-6">

                        {/* Publisher */}
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <h3
                                    onClick={() => setShowPublisherProfile(true)}
                                    className="text-base font-bold text-white hover:text-blue-400 cursor-pointer transition-colors"
                                >
                                    {app.publisher?.name}
                                </h3>
                                {app.publisher?.verified && (
                                    <div className="relative group/badge cursor-help">
                                        <img src="/verified/badge.svg" alt="Verified" className="w-4 h-4" />
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-zinc-800 border border-white/10 rounded text-[10px] font-medium text-white whitespace-nowrap opacity-0 group-hover/badge:opacity-100 transition-opacity pointer-events-none">
                                            Verified
                                        </div>
                                    </div>
                                )}
                            </div>

                            {app.publisher?.bio && (
                                <p className="text-sm text-zinc-400 leading-relaxed max-w-md">
                                    {app.publisher.bio}
                                </p>
                            )}
                        </div>

                        {/* Soft Divider */}
                        <div className="h-px bg-white/10" />

                        {/* Info Stack */}
                        <div className="space-y-5">
                            {/* <div>
                                <p className="text-[11px] uppercase tracking-wider text-zinc-500 mb-0.5">
                                    Provider
                                </p>
                                <p className="text-sm font-medium text-white">
                                    {app.info?.provider || app.publisher.name}
                                </p>
                            </div> */}

                            <div>
                                <p className="text-[11px] uppercase tracking-wider text-zinc-500 mb-0.5">
                                    Size
                                </p>
                                <p className="text-sm font-medium text-white">
                                    {app.build?.platforms?.windows?.sizeMB ? `${app.build.platforms.windows.sizeMB} MB` : (app.build?.platforms?.['windows']?.sizeMB === 0 ? '14 MB' : '10 MB')}
                                </p>
                            </div>

                            <div>
                                <p className="text-[11px] uppercase tracking-wider text-zinc-500 mb-0.5">
                                    Category
                                </p>
                                <p className="text-sm font-medium uppercase text-white">
                                    {app.category}
                                </p>
                            </div>

                            {/* <div>
                                <p className="text-[11px] uppercase tracking-wider text-zinc-500 mb-0.5">
                                    Compatibility
                                </p>
                                <p className="text-sm font-medium text-white">
                                    Works on this PC
                                </p>
                            </div> */}

                            {/* <div>
                                <p className="text-[11px] uppercase tracking-wider text-zinc-500 mb-0.5">
                                    Languages
                                </p>
                                <p className="text-sm font-medium text-white">
                                    {app.info?.languages?.join(', ') || 'English'}
                                </p>
                            </div> */}

                            {/* <div>
                                <p className="text-[11px] uppercase tracking-wider text-zinc-500 mb-0.5">
                                    Age Rating
                                </p>
                                <p className="text-sm font-medium text-white">
                                    {app.info?.ageRating || '4+'}
                                </p>
                            </div> */}

                            <div>
                                <p className="text-[11px] uppercase tracking-wider text-zinc-500 mb-0.5">
                                    Copyright
                                </p>
                                <p className="text-sm font-medium text-white">
                                    © {app.info?.copyright || `© ${new Date().getFullYear()} ${app.publisher.name}`}
                                </p>
                            </div>

                            {/* <div className="pt-2 space-y-2">
                                {app.info?.website && (
                                    <a href={app.info.website} target="_blank" rel="noopener noreferrer" className="block text-sm font-medium text-blue-400 hover:text-blue-300 transition">
                                        Developer Website
                                    </a>
                                )}
                                {app.info?.supportEmail && (
                                    <a href={`mailto:${app.info.supportEmail}`} className="block text-sm font-medium text-blue-400 hover:text-blue-300 transition">
                                        App Support
                                    </a>
                                )}
                                <a href="#" className="block text-sm font-medium text-blue-400 hover:text-blue-300 transition">
                                    Privacy Policy
                                </a>
                            </div> */}

                        </div>
                    </div>

                </div>
            </section>
            {/* APP PRIVACY */}
            {/* APP PRIVACY */}
            <section className="max-w-6xl mx-auto px-6 md:px-10 py-14 border-t border-white/5">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-[22px] font-semibold tracking-tight text-white">
                        App Privacy
                    </h2>
                    <Link href="/policies/privacy-policy" className="text-[15px] font-medium text-blue-500 hover:underline">
                        See Details
                    </Link>
                </div>

                {/* Description */}
                <p className="text-[15px] leading-relaxed text-zinc-400 max-w-3xl">
                    The developer, <span className="text-white font-medium">{app.info?.provider || app.publisher.name}</span>,
                    indicated that the app’s privacy practices may include handling of data as described below.
                    For more information, see the{" "}
                    <Link href="/policies/privacy-policy" className="text-blue-500 hover:underline cursor-pointer">
                        developer’s privacy policy
                    </Link>.
                </p>

                {/* Privacy Groups */}
                <div className="mt-12 space-y-14">
                    {/* Tracking */}
                    {app.privacy?.tracking && app.privacy.tracking.length > 0 && (
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <User className="w-5 h-5 text-white" />
                                <h3 className="text-[17px] font-semibold text-white">
                                    Data Used to Track You
                                </h3>
                            </div>

                            <p className="text-[14px] text-zinc-400 mb-6 max-w-2xl">
                                The following data may be used to track you across apps and websites owned by other companies.
                            </p>

                            <ul className="divide-y divide-white/5 border border-white/5 rounded-2xl overflow-hidden">
                                {app.privacy.tracking.map(item => (
                                    <li
                                        key={item}
                                        className="flex items-center justify-between px-5 py-4 text-[15px] text-zinc-300"
                                    >
                                        {item}
                                        <span className="text-zinc-500 text-sm">Used for tracking</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Linked Data */}
                    {app.privacy?.linked && app.privacy.linked.length > 0 && (
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <Layers className="w-5 h-5 text-white" />
                                <h3 className="text-[17px] font-semibold text-white">
                                    Data Linked to You
                                </h3>
                            </div>

                            <p className="text-[14px] text-zinc-400 mb-6 max-w-2xl">
                                The following data may be collected and linked to your identity.
                            </p>

                            <ul className="divide-y divide-white/5 border border-white/5 rounded-2xl overflow-hidden">
                                {app.privacy.linked.map(item => (
                                    <li
                                        key={item}
                                        className="flex items-center justify-between px-5 py-4 text-[15px] text-zinc-300"
                                    >
                                        {item}
                                        <span className="text-zinc-500 text-sm">Linked to identity</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
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
                                        value={reviewFormData.title}
                                        onChange={(e) => setReviewFormData({ ...reviewFormData, title: e.target.value })}
                                    />
                                    <textarea
                                        className="w-full bg-black border border-white/10 rounded-xl p-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 min-h-[120px] transition resize-none"
                                        placeholder="Review (Optional)"
                                        value={reviewFormData.content}
                                        onChange={(e) => setReviewFormData({ ...reviewFormData, content: e.target.value })}
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
                                        onClick={handleReviewSubmit}
                                        disabled={submittingReview}
                                        className="px-8 py-2.5 rounded-full font-medium bg-blue-600 text-white hover:bg-blue-500 transition shadow-lg shadow-blue-900/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {submittingReview ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col md:flex-row gap-10 mb-12">
                        {/* Summary */}
                        <div className="flex flex-col gap-1 min-w-[100px]">
                            <div className="text-6xl font-bold tracking-tighter">
                                {reviewStats ? reviewStats.averageRating.toFixed(1) : "0.0"}
                            </div>
                            <div className="text-base font-medium text-zinc-400">out of 5</div>
                        </div>

                        {/* Bars Section */}
                        <div className="flex-1 space-y-1.5 max-w-md pt-2">
                            {[5, 4, 3, 2, 1].map((star) => {
                                const count = reviewStats?.ratingDistribution[star as keyof typeof reviewStats.ratingDistribution] || 0;
                                const total = reviewStats?.totalReviews || 0;
                                const pct = total > 0 ? (count / total) * 100 : 0;

                                return (
                                    <div key={star} className="flex items-center gap-3 text-[10px] font-bold text-zinc-500">
                                        <div className="w-3 text-right flex justify-end">
                                            <Star className="w-2 h-2 fill-current" />
                                        </div>
                                        <div className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-zinc-400 rounded-full transition-all duration-500" style={{ width: `${pct}%` }}></div>
                                        </div>
                                    </div>
                                );
                            })}
                            <div className="text-right pt-2 text-zinc-500 font-medium text-xs">
                                {reviewStats?.totalReviews || 0} Ratings
                            </div>
                        </div>
                    </div>

                    {/* Review Cards Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {reviewsLoading ? (
                            <div className="col-span-full py-10 flex justify-center text-zinc-500">
                                <Loader2 className="w-6 h-6 animate-spin" />
                            </div>
                        ) : reviews.length > 0 ? (
                            reviews.map((review) => {
                                const isMyReview = !!myReviewIds[review.id];
                                const isRecent = isMyReview && (Date.now() - myReviewIds[review.id] < 10 * 60 * 1000);

                                return (
                                    <ReviewCard
                                        key={review.id}
                                        title={review.title}
                                        date={new Date(review.createdAt).toLocaleDateString()}
                                        user={review.userName || "User"}
                                        rating={review.rating}
                                        text={review.content}
                                        canDelete={isRecent}
                                        onDelete={() => handleDeleteReview(review.id)}
                                    />
                                )
                            })
                        ) : (
                            <div className="col-span-full py-10 text-center text-zinc-500">
                                No reviews yet. Be the first to review!
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* APP PRIVACY */}



            {/* INFORMATION */}
            {/* MORE APPS */}
            <section className="max-w-6xl mx-auto px-6 md:px-10 py-14 border-t border-white/5">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-[22px] font-semibold tracking-tight text-white mb-0">
                        More Apps
                    </h2>
                    <Link href="/store" className="text-[15px] font-medium text-blue-500 hover:underline">
                        See All
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {moreApps.map((item) => (
                        <AppListItem
                            key={item.id}
                            id={item.id}
                            icon={item.icon}
                            title={item.name}
                            subtitle={item.shortDescription || "No description"}
                            category={item.category || "Utility"}
                            color={item.branding?.activeColor}
                        />
                    ))}
                </div>
            </section>

            {/* Report Dialog */}
            <Dialog open={reportOpen} onOpenChange={setReportOpen}>
                <DialogContent className="bg-[#000]/20 backdrop-blur-sm border border-white/10 text-white sm:max-w-[520px] rounded-3xl p-7 shadow-[0_20px_60px_rgba(0,0,0,0.6)]">

                    {/* Header */}
                    <DialogHeader className="space-y-2">
                        <DialogTitle className="text-xl font-semibold tracking-tight">
                            Report this app
                        </DialogTitle>
                        <DialogDescription className="text-sm text-zinc-300 leading-relaxed">
                            Help us keep LoopSync safe by reporting apps that violate our guidelines.
                        </DialogDescription>
                    </DialogHeader>

                    {/* Body */}
                    <div className="mt-6 space-y-6">

                        {/* Reason */}
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold uppercase tracking-wider text-white">
                                Reason
                            </Label>

                            {/* You can replace this Input with Select later */}
                            <Input
                                placeholder="Harmful content, copyright issue, scam, etc."
                                className="h-11 bg-transparent border-white/10 rounded-xl text-white placeholder:text-zinc-400 focus:border-white/20"
                                value={reportData.reason}
                                onChange={(e) =>
                                    setReportData({ ...reportData, reason: e.target.value })
                                }
                            />
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold uppercase tracking-wider text-white">
                                Description
                            </Label>
                            <Textarea
                                placeholder="Explain what's wrong and how it affects users…"
                                className="min-h-[120px] bg-transparent border-white/10 rounded-xl text-white placeholder:text-zinc-400 resize-none focus:border-white/20"
                                value={reportData.description}
                                onChange={(e) =>
                                    setReportData({ ...reportData, description: e.target.value })
                                }
                            />
                            <p className="text-xs text-white">
                                Please be specific. This helps us review faster.
                            </p>
                        </div>

                        {/* Reporter Info */}
                        <div className="rounded-2xl border border-white/5 bg-white/transparent p-4 space-y-4">
                            <p className="text-sm font-medium text-white">
                                Your details
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Input
                                    placeholder="Your name"
                                    className="h-11 bg-transparent border-white/10 rounded-xl text-white placeholder:text-zinc-400 focus:border-white/20"
                                    value={reportData.name}
                                    onChange={(e) =>
                                        setReportData({ ...reportData, name: e.target.value })
                                    }
                                />

                                <Input
                                    type="email"
                                    placeholder="Email address"
                                    className="h-11 bg-transparent border-white/10 rounded-xl text-white placeholder:text-zinc-500 focus:border-white/20"
                                    value={reportData.email}
                                    onChange={(e) =>
                                        setReportData({ ...reportData, email: e.target.value })
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <DialogFooter className="mt-8 flex items-center justify-between gap-3">
                        <Button
                            variant="ghost"
                            onClick={() => setReportOpen(false)}
                            className="rounded-full px-5 text-zinc-400 hover:text-white hover:bg-white/5"
                        >
                            Cancel
                        </Button>

                        <Button
                            onClick={handleReportSubmit}
                            disabled={reporting}
                            className="rounded-full px-6 bg-red-800 hover:bg-red-700 text-white font-semibold"
                        >
                            {reporting ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Flag className="w-4 h-4" />
                            )}
                            Submit report
                        </Button>
                    </DialogFooter>

                </DialogContent>
            </Dialog>

            {/* Contribute Dialog */}
            <Dialog open={contributeOpen} onOpenChange={setContributeOpen}>
                <DialogContent
                    onInteractOutside={(e) => e.preventDefault()}
                    className="fixed left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2 z-50 bg-[#000]/10 flex flex-col items-center justify-center backdrop-blur-sm border border-white/10 text-white sm:max-w-[480px] sm:h-[70vh] rounded-[2rem] p-0 overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
                >
                    {/* <button
                        onClick={() => setContributeOpen(false)}
                        className="absolute right-4 top-4 p-2 rounded-full bg-black/20 text-white/50 hover:text-white hover:bg-white/10 transition z-50"
                    >
                        <X className="w-5 h-5" />
                    </button> */}

                    {contributionStep === 'info' && (
                        <div className="px-8 pb-10 relative z-10 text-center w-full animate-in fade-in zoom-in-95 duration-300">
                            {/* App Icon */}
                            <div className="w-24 h-24 mx-auto rounded-[1.5rem] bg-transparent overflow-hidden mb-6 relative">
                                {app.icon ? (
                                    <img
                                        src={typeof app.icon === 'string' ? app.icon : (app.icon as any)['512'] || Object.values(app.icon)[0] as string}
                                        alt={app.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className={`w-full h-full flex items-center justify-center text-2xl font-bold ${app.branding?.activeColor || "bg-neutral-800"}`}>
                                        {app.name.charAt(0)}
                                    </div>
                                )}
                            </div>

                            <DialogTitle className="text-2xl font-bold tracking-tight text-white mb-2">
                                Support {app.name}
                            </DialogTitle>

                            <p className="text-zinc-200 text-[15px] leading-relaxed mb-8 max-w-sm mx-auto">
                                Your contribution supports ongoing development <br />by the app's creator.
                            </p>

                            {/* Payment Note Card */}
                            <div className="bg-black/5 border border-white/10 mt-10 rounded-2xl p-5 mb-8 text-left relative overflow-hidden group">

                                <div className="flex gap-4 items-start relative z-10">
                                    <div className="p-2.5 rounded-xl bg-white text-red-600 shrink-0">
                                        <Heart className="w-6 h-6 fill-current" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-sm mb-1">
                                            Support Independent Developers
                                        </h4>
                                        <p className="text-xs text-zinc-300 font-medium">
                                            100% of your contribution goes directly to the developer. LoopSync takes 0% commission.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Action */}
                            <Button
                                onClick={() => setContributionStep('amount')}
                                className="w-full h-12 rounded-full bg-white text-black font-bold text-[15px] hover:bg-zinc-200 transition shadow-lg active:scale-95"
                            >
                                Continue
                            </Button>
                        </div>
                    )}

                    {contributionStep === 'amount' && (
                        <div className="px-8 pb-10 relative z-10 text-center w-[400px] animate-in fade-in slide-in-from-right-10 duration-300">
                            <DialogTitle className="text-2xl font-bold tracking-tight text-white mb-2">
                                Enter Contribution
                            </DialogTitle>
                            <p className="text-zinc-400 text-sm mb-8">
                                How much would you like to contribute?
                            </p>

                            <div className="grid grid-cols-2 gap-3 mb-6">
                                {[50, 100, 500, 1000].map(amt => (
                                    <button
                                        key={amt}
                                        onClick={() => setContributionAmount(amt.toString())}
                                        className={cn(
                                            "py-3 rounded-xl border font-semibold text-sm transition-all outline-none focus:ring-0",
                                            contributionAmount === amt.toString()
                                                ? "bg-white text-black border-white shadow-lg scale-[1.02]"
                                                : "bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10"
                                        )}
                                    >
                                        ₹{new Intl.NumberFormat('en-IN').format(amt)}
                                    </button>
                                ))}
                            </div>

                            <div className="relative mb-10">
                                <span className="absolute left-4 top-3.5 text-zinc-500 font-medium">₹</span>
                                <Input
                                    type="number"
                                    min={50}
                                    max={1000000000}
                                    placeholder="Enter custom amount"
                                    value={contributionAmount}
                                    onKeyDown={(e) => {
                                        if (["e", "E", "+", "-"].includes(e.key)) {
                                            e.preventDefault();
                                        }
                                    }}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        // Allow empty string to let user delete
                                        if (value === "") {
                                            setContributionAmount("");
                                            return;
                                        }
                                        // Strict check and max limit enforcement
                                        const numValue = Number(value);
                                        if (!isNaN(numValue) && numValue <= 1000000000) {
                                            setContributionAmount(value);
                                        }
                                    }}
                                    className="h-12 bg-transparent border-white/10 rounded-xl pl-8 text-white placeholder:text-zinc-600 focus:border-white/20 text-lg font-medium focus-visible:ring-0 focus-visible:ring-offset-0"
                                />
                                <div className="flex justify-between items-center mt-2 px-1">
                                    <p className="text-[10px] text-zinc-300 uppercase tracking-wider font-medium">
                                        Min: ₹50
                                    </p>
                                    <p className="text-[10px] text-zinc-300 uppercase tracking-wider font-medium">
                                        Max: ₹100 Cr
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    onClick={() => setContributionStep('info')}
                                    variant="ghost"
                                    className="flex-1 h-12 rounded-full bg-white/5 text-zinc-300 font-bold hover:bg-white/10 hover:text-white transition"
                                >
                                    Back
                                </Button>
                                <Button
                                    onClick={handleContributionPayment}
                                    disabled={!contributionAmount || parseInt(contributionAmount) < 50}
                                    className="flex-[2] h-12 rounded-full bg-white text-black font-bold hover:bg-zinc-200 transition shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {paymentProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : `Pay ${contributionAmount ? `₹${new Intl.NumberFormat('en-IN').format(Number(contributionAmount))}` : ''}`}
                                </Button>
                            </div>
                        </div>
                    )}

                    {contributionStep === 'success' && (
                        <div className="px-8 pb-10 relative z-10 text-center w-full animate-in fade-in zoom-in-95 duration-500 flex flex-col items-center justify-center h-full min-h-[50vh]">
                            <div className="w-20 h-20 rounded-full bg-green-500 text-white flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(34,197,94,0.4)]">
                                <Heart className="w-10 fill-current text-white h-10" />
                            </div>
                            <DialogTitle className="text-3xl mb-10 font-bold tracking-tight text-white mb-3">
                                We're grateful for your support. Thank you.
                            </DialogTitle>
                            <p className="text-zinc-300 text-lg leading-relaxed mb-8 max-w-sm">
                                Your contribution of <span className="text-white font-bold">₹{new Intl.NumberFormat('en-IN').format(Number(contributionAmount))}</span> has been received successfully.
                            </p>

                            <Button
                                onClick={() => {
                                    setContributeOpen(false);
                                    // Reset after delay to smooth exit
                                    setTimeout(() => {
                                        setContributionStep('info');
                                        setContributionAmount('');
                                    }, 400);
                                }}
                                className="w-full h-12 rounded-full bg-white text-black font-bold text-[15px] hover:bg-zinc-200 transition shadow-lg active:scale-95"
                            >
                                Done
                            </Button>
                        </div>
                    )}

                </DialogContent>
            </Dialog>


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
                <div className="flex items-center uppercase gap-1.5">
                    {children && (
                        <span className="flex items-center text-zinc-300">
                            {children}
                        </span>
                    )}

                    {value && (
                        <span className="text-2xl font-semibold uppercase tracking-tight leading-none">
                            {value}
                        </span>
                    )}
                </div>
            )}

            {/* BELOW LINE (Editors' Choice, etc.) */}
            {below && (
                <span className="text-[11px] font-medium uppercase text-zinc-400">
                    {below}
                </span>
            )}

            {sub && (
                <span className="text-[11px] text-zinc-500 uppercase leading-tight">
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

function ReviewCard({ title, date, user, rating, text, onDelete, canDelete, isDeleting }: { title: string; date: string; user: string; rating: number; text: string, onDelete?: () => void, canDelete?: boolean, isDeleting?: boolean }) {
    return (
        <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 flex flex-col gap-4 hover:bg-zinc-900/80 transition group relative">
            <div className="flex items-start justify-between">
                <div>
                    <h4 className="font-semibold text-white mb-1 group-hover:text-blue-400 transition">{title}</h4>
                    <div className="flex items-center gap-2">
                        <div className="flex text-amber-500">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-3.5 h-3.5 ${i < rating ? "fill-current" : "text-zinc-700"}`} />
                            ))}
                        </div>
                        <span className="text-xs text-zinc-500">• {date}</span>
                    </div>
                </div>
                {canDelete && (
                    <button
                        onClick={onDelete}
                        disabled={isDeleting}
                        className="text-zinc-600 hover:text-red-500 transition p-2 hover:bg-red-500/10 rounded-full"
                        title="Delete Review (Available for 10m)"
                    >
                        {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </button>
                )}
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed">{text}</p>
            <div className="flex items-center gap-2 mt-auto pt-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-300 ring-1 ring-white/10 uppercase">
                    {user.charAt(0)}
                </div>
                <span className="text-xs font-medium text-zinc-500">{user}</span>
            </div>
        </div>
    );
}

function AppListItem({ id, icon, color, title, subtitle, category }: { id: string; icon?: string; color?: string; title: string; subtitle: string; category: string }) {
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return (
        <Link href={`/store/${id}/${slug}`} className="block">
            <div className="flex items-center gap-5 p-5 rounded-[1.5rem] bg-black border border-white/5 hover:bg-white/5 hover:border-white/10 transition-all duration-300 cursor-pointer group hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/50">
                <div className={cn(
                    "w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 shadow-lg ring-1 ring-white/5",
                    icon ? 'bg-black' : color || 'bg-zinc-800'
                )}>
                    {icon ? (
                        <img
                            src={typeof icon === 'string' ? icon : (icon as any)['512'] || Object.values(icon)[0] as string}
                            alt={title}
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                        />
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
