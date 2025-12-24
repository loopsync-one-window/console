"use client";

import React, { useState, Suspense, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { Dithering } from "@paper-design/shaders-react";
import { useRouter, useSearchParams } from "next/navigation";
import Script from "next/script";

// Define Types
type RegistrationResponse = {
    success: boolean;
    registrationId: string;
    pricing: {
        baseFee: number;
        tax: number;
        verifiedBadgeFee: number;
        currency: string;
    };
    license: {
        type: string;
        version: string;
    };
};

declare global {
    interface Window {
        Razorpay: any;
    }
}

const API_BASE_URL = "https://srv01.loopsync.cloud/api/v1";

function AccountContent() {
    const [isLogin, setIsLogin] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(true);

    // Form State
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: ""
    });

    // Registration Data (persisted across renders if needed, but here simple state works for single session)
    const [registrationData, setRegistrationData] = useState<RegistrationResponse | null>(null);

    const router = useRouter();
    const searchParams = useSearchParams();
    const isPaymentMode = searchParams.get('payments') === 'one-time';

    useEffect(() => {
        const refreshSession = async () => {
            try {
                // Attempt to refresh token using HttpOnly cookie
                const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                });

                if (res.ok) {
                    const data = await res.json();

                    // Case 1: Payment Pending
                    if (data.paymentRequired && data.developerId) {
                        setRegistrationData({
                            success: true,
                            registrationId: data.developerId,
                            pricing: data.pricing || {
                                baseFee: 1.00,
                                tax: 1.00,
                                verifiedBadgeFee: 1.00,
                                currency: 'INR',
                            },
                            license: {
                                type: 'Developer License',
                                version: 'Perpetual License - vPA4'
                            }
                        } as RegistrationResponse);

                        // Ensure we are in payment mode
                        if (!isPaymentMode) {
                            router.push('/developers/account?payments=one-time');
                        }
                    }
                    // Case 2: Already Logged In (Active)
                    else if (data.accessToken) {
                        // If we are just visiting login page, redirect to console
                        router.push("/developers/console");
                    }
                }
            } catch (error) {
                // Session invalid or expired, stay on login/signup
                console.log("Session refresh failed", error);
            } finally {
                setIsRefreshing(false);
            }
        };

        refreshSession();
    }, [isPaymentMode, router]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.type === 'text' && e.target.placeholder === '' ? 'fullName' : e.target.type]: e.target.value });
    };

    // Specific change handlers to map correctly to inputs
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, fullName: e.target.value }));
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, email: e.target.value }));
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, password: e.target.value }));


    const handleRegister = async () => {
        if (!formData.fullName || !formData.email || !formData.password) return;
        setIsSubmitting(true);
        try {
            const res = await fetch(`${API_BASE_URL}/developers/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await res.json();

            if (res.ok && data.success) {
                setRegistrationData(data);
                // We don't push param here directly, we rely on the view logic or push it now
                router.push('/developers/account?payments=one-time');
            } else {
                alert(data.message || "Registration failed");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred during registration.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLoginSubmit = async () => {
        if (!formData.email || !formData.password) return;
        setIsSubmitting(true);
        try {
            const res = await fetch(`${API_BASE_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: formData.email, password: formData.password }),
            });

            const data = await res.json();

            // Check if payment is required (Pending Developer)
            if (data.paymentRequired && data.developerId) {
                // Set registration data needed for payment flow
                setRegistrationData({
                    success: true,
                    registrationId: data.developerId,
                    pricing: data.pricing || {
                        baseFee: 388.04,
                        tax: 69.85,
                        verifiedBadgeFee: 399.89,
                        // Defaults if server doesn't return pricing in this specific error response
                    },
                    license: {
                        type: 'Developer License',
                        version: 'Perpetual License - vPA4'
                    }
                } as RegistrationResponse);

                router.push('/developers/account?payments=one-time');
                return;
            }

            // Should set cookies automatically via HttpOnly
            if (res.ok) {
                router.push("/developers/console");
            } else {
                alert(data.message || "Login failed");
            }
        } catch (error) {
            console.error(error);
            alert("Login error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isLogin) {
            await handleLoginSubmit();
        } else {
            await handleRegister();
        }
    };

    const handlePayment = async () => {
        if (!registrationData?.registrationId) {
            // Ideally should check if we have ID, if not, maybe redirect back or error
            // utilizing a fallback ID for demo if strictly needed, but better to error.
            if (!formData.email) {
                // User refreshed page on payment step?
                alert("Session lost. Please register again.");
                router.push('/developers/account');
                return;
            }
            // Recover logic could go here (e.g., look up pending user by email), but keeping simple
        }

        setIsPaymentProcessing(true);
        try {
            // 1. Create Order
            const orderRes = await fetch(`${API_BASE_URL}/developers/payment/create-order`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    registrationId: registrationData?.registrationId,
                    verifiedBadge: isVerified
                }),
            });
            const orderData = await orderRes.json();

            if (!orderRes.ok) throw new Error(orderData.message || "Order creation failed");

            // 2. Open Razorpay
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_live_RhvHwqmzLiw3HA', // Ensure env var is set
                amount: orderData.amount, // Amount is already in paise from API
                // However, my server implementation: `amount: Math.round(totalAmount * 100)` -> Server sends paise?
                // Checking server code: `amount: Math.round(totalAmount * 100)` passed to razorpay.orders.create
                // Server response `amount` field in `createPaymentOrder` returns `totalAmount` (float), NOT the paise value for client use if client re-calculates?
                // Server return: `amount: totalAmount` (float). 
                // Razorpay checkout options need `amount` in smallest currency unit?
                // Actually the `order_id` is the most important part. The execution happens on "amount" specified in order usually.

                currency: orderData.currency,
                name: "LoopSync Developer",
                description: "Developer Account Registration",
                order_id: orderData.orderId,
                handler: async function (response: any) {
                    await verifyPayment(response.razorpay_order_id, response.razorpay_payment_id, response.razorpay_signature);
                },
                prefill: {
                    name: formData.fullName,
                    email: formData.email,
                },
                theme: {
                    color: "#000000",
                },
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.on('payment.failed', function (response: any) {
                alert(response.error.description);
                setIsPaymentProcessing(false);
            });
            rzp1.open();

        } catch (error) {
            console.error(error);
            alert("Payment initialization failed");
            setIsPaymentProcessing(false);
        }
    };

    const verifyPayment = async (orderId: string, paymentId: string, signature: string) => {
        try {
            const verifyRes = await fetch(`${API_BASE_URL}/developers/payment/verify`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    orderId,
                    paymentId,
                    signature
                }),
            });
            const verifyData = await verifyRes.json();

            if (verifyRes.ok && verifyData.success) {
                // Payment Verified, Account Active
                // Now, auto-login or redirect to login? 
                // The requirements say: "4. Login After Registration". 
                // It doesn't explicitly say "Auto Login".
                // But generally users expect to be logged in. 
                // However, the `auth/login` endpoint sets cookies. verify endpoint does NOT return token cookies.
                // So we can:
                // 1. Call login endpoint silently with password (if we still have it - yes state)
                // 2. Or redirect to login page.

                // Let's attempt auto-login
                const loginRes = await fetch(`${API_BASE_URL}/auth/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: formData.email, password: formData.password }),
                });

                if (loginRes.ok) {
                    router.push('/developers/console');
                } else {
                    router.push('/developers/account'); // Fallback to login screen
                }
            } else {
                alert("Payment verification failed");
                setIsPaymentProcessing(false);
            }
        } catch (e) {
            console.error(e);
            alert("Verification error");
            setIsPaymentProcessing(false);
        }
    }

    return (
        <div className="h-screen bg-[#000000] text-white overflow-hidden relative font-sans selection:bg-[#d1aea0ff]/30">
            <Script
                id="razorpay-checkout-js"
                src="https://checkout.razorpay.com/v1/checkout.js"
            />

            <div className="grid grid-cols-2 h-screen">

                {/* Left Column: Form */}
                <div className="flex flex-col relative z-20 h-screen overflow-y-auto scrollbar-hide bg-black/95">
                    {/* Header */}
                    <div className="absolute top-0 left-0 w-full p-6 pl-12 flex items-center justify-between z-50">
                        <div className="flex items-center gap-3 opacity-100 hover:opacity-100 transition-opacity cursor-default">
                            <Link href="/" className="flex items-center justify-center gap-2">
                                <img
                                    src="/resources/logo.svg"
                                    alt="LoopSync Logo"
                                    className="h-9 w-auto brightness-150 contrast-125"
                                />
                            </Link>
                            <div className="h-3 w-[1px] bg-white/20" />
                            <span className="text-xs font-mono uppercase tracking-widest text-white/50">Developer Console</span>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col justify-center pl-12 pr-12 max-w-xl mx-auto w-full pt-12">
                        {isPaymentMode ? (
                            // Payment Mode UI
                            <div className="mb-0 space-y-6 animate-[fadeIn_0.5s_ease-out]">
                                <div className="space-y-2">

                                    <img src="/products-logo.svg" alt="LOGO" className="w-12 h-12 mb-8" />
                                    <h1 className="text-2xl font-semibold tracking-tight text-white">
                                        Complete Registration
                                    </h1>
                                    <p className="text-zinc-400 text-sm font-medium ">
                                        To verify your identity and ensure platform quality, a one-time developer registration fee is required.
                                    </p>
                                </div>

                                <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 space-y-4">
                                    <div className="flex items-center justify-between pb-4 border-b border-white/5">
                                        <span className="text-sm text-zinc-300 tracking-wide">
                                            Developer License
                                        </span>

                                        <span className="text-sm font-semibold text-white tracking-wide">
                                            {registrationData?.license?.version || "Perpetual License - vPA4"}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-zinc-300">Registration Fee</span>
                                        <span className="text-sm font-semibold text-zinc-400">₹{registrationData?.pricing?.baseFee.toFixed(2) || "388.04"}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-zinc-300">Taxes (18%)</span>
                                        <span className="text-sm font-semibold text-zinc-400">₹{registrationData?.pricing?.tax.toFixed(2) || "69.85"}</span>
                                    </div>

                                    {/* Verified Badge Option */}
                                    <div className="py-4 border-t border-b border-white/5 space-y-3">
                                        <div className="flex items-start gap-3">
                                            <div className="flex h-5 items-center">
                                                <input
                                                    id="verified-badge"
                                                    type="checkbox"
                                                    checked={isVerified}
                                                    onChange={(e) => setIsVerified(e.target.checked)}
                                                    className="h-4 w-4 cursor-pointer rounded border-zinc-600 bg-black/20 text-[#d1aea0] focus:ring-[#d1aea0] focus:ring-offset-0"
                                                />
                                            </div>
                                            <div className="text-sm">
                                                <label
                                                    htmlFor="verified-badge"
                                                    className="font-semibold cursor-pointer text-white flex items-center gap-2 tracking-wide"
                                                >
                                                    Verified Developer Identity
                                                    <img
                                                        src="/verified/badge.svg"
                                                        alt="Verified Badge"
                                                        className="h-4 w-4"
                                                    />
                                                </label>

                                                <p className="text-white/70 text-xs mt-1 leading-relaxed">
                                                    Stand out as a trusted developer with a verified badge <br />that boosts
                                                    profile visibility and user confidence.
                                                </p>
                                            </div>

                                            <div className="ml-auto text-sm font-semibold text-zinc-400">
                                                +₹{registrationData?.pricing?.verifiedBadgeFee.toFixed(2) || "399.89"}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-2 flex items-center justify-between">
                                        <span className="text-base font-semibold text-white">Total</span>
                                        <span className="text-xl font-bold text-[#fff]">
                                            {(() => {
                                                const base = (registrationData?.pricing?.baseFee || 388.04) + (registrationData?.pricing?.tax || 69.85);
                                                const verified = isVerified ? (registrationData?.pricing?.verifiedBadgeFee || 399.89) : 0;
                                                return `₹${(base + verified).toFixed(2)}`;
                                            })()}
                                        </span>
                                    </div>
                                </div>

                                <div className="pt-4 space-y-4">
                                    <button
                                        onClick={handlePayment}
                                        disabled={isPaymentProcessing}
                                        className="group relative inline-flex h-12 w-full items-center justify-center overflow-hidden rounded-full bg-[#fff] font-medium text-black transition-all duration-300 hover:bg-[#fff]/80 cursor-pointer disabled:opacity-70"
                                    >
                                        <div className="flex items-center gap-2.5">
                                            {isPaymentProcessing ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    <span className="text-xs font-bold uppercase">Processing Payment</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="text-xs font-bold uppercase">Pay & Complete Setup</span>
                                                    <ArrowRight className="w-3.5 h-3.5" />
                                                </>
                                            )}
                                        </div>
                                    </button>
                                    <button
                                        onClick={() => router.push('/developers/account')}
                                        disabled={isPaymentProcessing}
                                        className="w-full text-xs text-zinc-500 hover:text-white transition-colors uppercase font-medium"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            // Standard Login/Signup UI
                            <>
                                <div className="mb-8 space-y-2">
                                    <h1 className="text-2xl font-semibold tracking-tight text-white mb-1">
                                        {isLogin ? "Welcome back" : "Join the ecosystem"}
                                    </h1>
                                    <p className="text-white text-sm font-medium leading-relaxed">
                                        {isLogin
                                            ? "Enter your credentials to access the console."
                                            : "Create your dev account to start shipping apps."}
                                    </p>
                                </div>
                            </>
                        )}

                        {!isPaymentMode && (
                            <form onSubmit={handleSubmit} className="space-y-8 max-w-lg mx-auto w-full">
                                <div className="space-y-6">

                                    {!isLogin && (
                                        <div className="space-y-2 group/input">
                                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 group-focus-within/input:text-[#fff] transition-colors duration-300">Full Name</label>
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={formData.fullName}
                                                onChange={handleNameChange}
                                                className="w-full bg-transparent uppercase border-b border-white/20 px-0 py-2.5 text-sm text-white placeholder-neutral-700 focus:outline-none focus:border-[#fff] transition-all duration-300 font-medium tracking-wide"
                                                placeholder=""
                                            />
                                        </div>
                                    )}

                                    <div className="space-y-2 group/input">
                                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 group-focus-within/input:text-[#fff] transition-colors duration-300">Email Address</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleEmailChange}
                                            className="w-full bg-transparent border-b border-white/20 px-0 py-2.5 text-sm text-white placeholder-neutral-700 focus:outline-none focus:border-[#fff] transition-all duration-300 font-medium tracking-wide"
                                            placeholder=""
                                        />
                                    </div>

                                    <div className="space-y-2 group/input">
                                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 group-focus-within/input:text-[#fff] transition-colors duration-300">Password</label>
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handlePasswordChange}
                                            className="w-full bg-transparent border-b border-white/20 px-0 py-2.5 text-sm text-white placeholder-neutral-700 focus:outline-none focus:border-[#fff] transition-all duration-300 font-medium tracking-wide"
                                            placeholder=""
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 pb-2">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="group relative inline-flex h-10 items-center justify-center overflow-hidden rounded-full bg-[#fff] px-8 font-medium text-black transition-all duration-300 hover:bg-[#d4afa0] disabled:opacity-70 disabled:hover:bg-[#fff] w-full sm:w-auto"
                                    >
                                        <div className="flex items-center gap-2.5">
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                    <span className="text-[10px] font-bold uppercase tracking-widest">Processing</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="text-[10px] font-bold uppercase tracking-widest">{isLogin ? "Sign In" : "Create Account"}</span>
                                                    <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-0.5" />
                                                </>
                                            )}
                                        </div>
                                    </button>
                                </div>
                            </form>
                        )}

                        {!isPaymentMode && (
                            <div className="mt-8 border-t border-white/5 pt-6 flex items-center justify-between text-[10px] text-white/20 uppercase tracking-wider">
                                <button
                                    onClick={() => setIsLogin(!isLogin)}
                                    className="text-[#fff] hover:text-[#d4afa0] text-[14px] transition-colors font-semibold"
                                >
                                    {isLogin ? "Create an account" : "Back to login"}
                                </button>
                                <div className="flex gap-4">
                                    <Link href="/policies/privacy-policy" className="hover:text-white/40 transition-colors">Privacy</Link>
                                    <Link href="/policies/terms-of-use" className="hover:text-white/40 transition-colors">Terms</Link>
                                </div>
                            </div>
                        )}

                    </div>
                </div>

                {/* Right Column: Visuals */}
                <div className="relative h-screen overflow-hidden bg-black flex flex-col z-10 border-l border-white/5 hidden md:flex">
                    {/* Grayscale Dithering Background - Customized colors */}
                    <div className="absolute inset-0 z-0 opacity-100">
                        <Dithering
                            style={{ height: "100%", width: "100%" }}
                            colorBack="#000000"
                            colorFront="#d1aea0ff"
                            shape={"circle" as any}
                            type="4x4"
                            pxSize={3.5}
                            offsetX={0}
                            offsetY={0}
                            scale={0.8}
                            rotation={0}
                            speed={0.5}
                        />
                    </div>

                    {/* Top Right Header Text */}
                    <div className="absolute top-6 right-8 z-[1000] flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/5 rounded-full backdrop-blur-md">
                        <span className="text-xs font-semibold text-white uppercase tracking-wider">Secure Console Access</span>
                    </div>

                    {/* Content Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center z-30 bg-transparent backdrop-blur-3xl pointer-events-none">
                        <div className="w-full max-w-xl text-center">
                            <div className="text-white py-20 px-6 flex flex-col items-center relative z-20">
                                <img src="/products-logo.svg" alt="Logo" className="w-16 h-16 mb-8 object-contain brightness-0 invert" />
                                <h1 className="text-5xl font-bold mb-2">Publish your Apps</h1>
                                <p className="text-[#fff] font-semibold text-xl tracking-wide">
                                    A place to share your work.
                                </p>

                                <p className="text-white text-lg mt-20 max-w-2xl mx-auto leading-relaxed font-normal">
                                    Bring your projects to LoopSync and make them available to others
                                    to share freely or offer as products, all in one place.
                                </p>

                            </div>
                        </div>
                    </div>

                </div>

            </div>

            {/* Payment Processing Modal */}
            {isPaymentProcessing && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-[fadeIn_0.3s_ease-out]">
                    <div className="bg-white text-black p-8 rounded-3xl flex flex-col items-center gap-6 w-80 shadow-2xl scale-100 animate-[scaleIn_0.3s_ease-out]">
                        <div className="w-12 h-12 rounded-full border-4 border-zinc-100 border-t-black animate-spin"></div>
                        <div className="text-center space-y-1">
                            <h3 className="text-lg font-bold">Processing Payment</h3>
                            <p className="text-[10px] text-zinc-400 uppercase font-semibold">Please wait a moment</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function DeveloperAccountPage() {
    return (
        <Suspense fallback={
            <div className="h-screen w-full bg-black flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-white animate-spin" />
            </div>
        }>
            <AccountContent />
        </Suspense>
    );
}
