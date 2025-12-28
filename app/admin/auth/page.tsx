"use client";

import React, { useState, Suspense, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Loader2, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { Dithering } from "@paper-design/shaders-react";
import { useRouter } from "next/navigation";
import { loginAdmin, registerAdmin } from "@/lib/admin-api";

// Define Types
type AdminAuthResponse = {
    accessToken: string;
    refreshToken: string; // If implemented
    expiresAt?: number;
    admin: {
        id: string;
        email: string;
        fullName: string;
        role: string;
    };
};

// Removed duplicate API_BASE_URL (using imported functions instead)

function AdminAuthContent() {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: ""
    });

    const router = useRouter();

    useEffect(() => {
        // Check if already logged in
        const token = localStorage.getItem("admin.accessToken");
        if (token) {
            router.push("/admin/auth/zero-trust");
        }
    }, [router]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAuth = async () => {
        if (!formData.email || !formData.password) return;
        if (!isLogin && !formData.fullName) return;

        setIsSubmitting(true);

        try {
            let data;
            if (isLogin) {
                data = await loginAdmin(formData.email, formData.password);
            } else {
                data = await registerAdmin(formData.fullName, formData.email, formData.password);
            }

            if (data.accessToken) {
                localStorage.setItem("admin.accessToken", data.accessToken);
                if (data.admin) {
                    localStorage.setItem("admin.user", JSON.stringify(data.admin));
                }
                router.push("/admin/auth/zero-trust");
            } else {
                alert("Authentication successful but no token received.");
            }
        } catch (error: any) {
            console.error(error);
            alert(error.message || "An error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await handleAuth();
    };

    return (
        <div className="h-screen bg-[#000000] text-white overflow-hidden relative font-sans selection:bg-[#d1aea0ff]/30">
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
                                    className="h-7 w-auto brightness-150 contrast-125"
                                />
                            </Link>
                            <div className="h-3 w-[1px] bg-white/20" />
                            <span className="text-xs font-mono uppercase tracking-widest text-white/50">Admin Console</span>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col justify-center pl-12 pr-12 max-w-xl mx-auto w-full pt-12">
                        <div className="mb-8 space-y-2">
                            <h1 className="text-3xl font-semibold text-white mb-1">
                                {isLogin ? "Admin Access" : "Register Admin"}
                            </h1>
                            <p className="text-white text-sm font-medium leading-relaxed">
                                {isLogin
                                    ? "Enter your credentials to access the admin portal."
                                    : "Create a new administrative account."}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8 max-w-lg mx-auto w-full">
                            <div className="space-y-6">

                                {!isLogin && (
                                    <div className="space-y-2 group/input">
                                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 group-focus-within/input:text-[#fff] transition-colors duration-300">Full Name</label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleInputChange}
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
                                        onChange={handleInputChange}
                                        className="w-full bg-transparent border-b border-white/20 px-0 py-2.5 text-sm text-white placeholder-neutral-700 focus:outline-none focus:border-[#fff] transition-all duration-300 font-medium tracking-wide"
                                        placeholder=""
                                    />
                                </div>

                                <div className="space-y-2 group/input">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 group-focus-within/input:text-[#fff] transition-colors duration-300">Password</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            className="w-full bg-transparent border-b border-white/20 px-0 py-2.5 text-sm text-white placeholder-neutral-700 focus:outline-none focus:border-[#fff] transition-all duration-300 font-medium tracking-wide pr-8"
                                            placeholder=""
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-0 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors cursor-pointer p-1"
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 pb-2">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="group relative inline-flex h-10 items-center justify-center overflow-hidden rounded-full bg-[#fff] px-8 font-medium text-black transition-all duration-300 hover:bg-[#09ee70] disabled:opacity-70 disabled:hover:bg-[#fff] w-full sm:w-auto"
                                >
                                    <div className="flex items-center gap-2.5">
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                <span className="text-[10px] font-bold uppercase tracking-widest">Verifying</span>
                                            </>
                                        ) : (
                                            <>
                                                <span className="text-[12px] font-bold uppercase">{isLogin ? "Authenticate" : "Register Admin"}</span>
                                                <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-0.5" />
                                            </>
                                        )}
                                    </div>
                                </button>
                            </div>
                        </form>

                        <div className="mt-8 border-t border-white/5 pt-6 flex items-center justify-between text-[10px] text-white/20 uppercase tracking-wider">
                            <button
                                onClick={() => setIsLogin(!isLogin)}
                                className="text-[#fff] hover:text-[#09ee70] text-[14px] transition-colors font-semibold"
                            >
                                {isLogin ? "Register new admin" : "Back to login"}
                            </button>

                        </div>

                    </div>
                </div>

                {/* Right Column: Visuals */}
                <div className="relative h-screen overflow-hidden bg-black flex flex-col z-10 border-l border-white/5 hidden md:flex">
                    {/* Grayscale Dithering Background */}
                    <div className="absolute inset-0 z-0 opacity-100">
                        <Dithering
                            style={{ height: "100%", width: "100%" }}
                            colorBack="#000000ff"
                            colorFront="#ee0909ff"
                            shape={"circle" as any}
                            type="4x4"
                            pxSize={6.5}
                            offsetX={0}
                            offsetY={0}
                            scale={0.8}
                            rotation={0}
                            speed={0.5}
                        />
                    </div>

                    {/* Top Right Header Text */}
                    <div className="absolute top-6 right-8 z-[1000] flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/5 rounded-full backdrop-blur-md">
                        <span className="text-xs font-semibold text-white uppercase tracking-wider">Restricted Access</span>
                    </div>

                    {/* Content Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center z-30 bg-transparent backdrop-blur-3xl pointer-events-none">
                        <div className="w-full max-w-xl text-center">
                            <div className="text-white py-20 px-6 flex flex-col items-center relative z-20">
                                <img src="/products-logo.svg" alt="Logo" className="w-16 h-16 mb-8 object-contain brightness-0 invert" />
                                <h1 className="text-5xl font-bold mb-2">Admin Zero Trust</h1>
                                <p className="text-[#fff] font-semibold text-xl tracking-wide">
                                    System Control Center
                                </p>

                                <p className="text-white text-lg mt-20 max-w-2xl mx-auto leading-relaxed font-normal">
                                    Manage users, developers, billing, and platform configurations.<br />
                                    Authorized personnel only.
                                </p>

                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}

export default function AdminAuthPage() {
    return (
        <Suspense fallback={
            <div className="h-screen w-full bg-black flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-white animate-spin" />
            </div>
        }>
            <AdminAuthContent />
        </Suspense>
    );
}
