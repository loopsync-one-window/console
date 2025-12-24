"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
    ChevronLeft,
    Upload,
    Image as ImageIcon,
    Monitor,
    Smartphone,
    Globe,
    Plus,
    X,
    CheckCircle2,
    Loader2,
    ChevronDown,
    Check,
    Copy,
    CheckCircle,
    Video
} from "lucide-react";

export default function PublishAppPage() {
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form States
    const [appName, setAppName] = useState("");
    const [appCategory, setAppCategory] = useState("productivity");
    const [customCategory, setCustomCategory] = useState("");
    const [shortDescription, setShortDescription] = useState("");
    const [fullDescription, setFullDescription] = useState("");
    const [pricingModel, setPricingModel] = useState("free");

    // Region State
    const [selectedRegion, setSelectedRegion] = useState("Global (US-East)");
    const [regionOpen, setRegionOpen] = useState(false);

    const handleProceed = () => {
        // Validation could go here
        setStep(2);
        window.scrollTo(0, 0);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // In case it's triggered by form
        setIsSubmitting(true);
        // Simulate API
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsSubmitting(false);
        // In real app, redirect to success or console
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#d1aea0]/30 flex flex-col relative overflow-hidden">
            {/* Watermark */}
            <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 opacity-[0.015]"
                    style={{
                        backgroundImage: "repeating-linear-gradient(-45deg, white 0, white 1px, transparent 1px, transparent 20px)"
                    }}
                />
                <div className="text-[35vw] font-black text-white/[0.02] -rotate-[15deg] select-none blur-sm tracking-tighter">
                    vPA4
                </div>
            </div>

            {/* Header */}
            <header className="fixed top-0 left-0 right-0 h-16 border-b border-white/5 bg-[#050505]/80 backdrop-blur-md z-50 flex items-center justify-between px-6">
                <div className="flex items-center gap-4">
                    {step === 1 ? (
                        <Link href="/developers/console" className="p-2 rounded-full hover:bg-white/5 transition-colors text-zinc-400 hover:text-white">
                            <ChevronLeft className="w-5 h-5" />
                        </Link>
                    ) : (
                        <button onClick={() => setStep(1)} className="p-2 rounded-full hover:bg-white/5 transition-colors text-zinc-400 hover:text-white">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                    )}
                    <div className="h-6 w-[1px] bg-white/10"></div>
                    <div className="flex items-center gap-2">
                        <span className={`text-sm tracking-wide ${step === 1 ? 'font-semibold text-white' : 'text-zinc-500'}`}>1. Details</span>
                        <span className="text-zinc-600">/</span>
                        <span className={`text-sm tracking-wide ${step === 2 ? 'font-semibold text-white' : 'text-zinc-500'}`}>2. Technical & Review</span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button className="text-zinc-400 text-sm hover:text-white transition-colors">Cancel</button>
                    {step === 1 ? (
                        <button
                            onClick={handleProceed}
                            className="px-4 py-1.5 bg-white text-black text-xs font-semibold uppercase rounded-full hover:bg-zinc-200 transition-colors flex items-center gap-2"
                        >
                            Save Draft & Proceed
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="px-4 py-1.5 bg-[#fff] text-black text-xs font-bold uppercase tracking-wider rounded-full hover:bg-[#fff]/80 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                            {isSubmitting ? "Submitting..." : "Submit for Review"}
                        </button>
                    )}
                </div>
            </header>

            <main className="flex-1 max-w-5xl mx-auto w-full p-8 md:p-12 relative z-10 mt-16">
                <form className="space-y-12" onSubmit={(e) => e.preventDefault()}>

                    {/* STEP 1: Details */}
                    {step === 1 && (
                        <div className="space-y-12 animate-[fadeIn_0.3s_ease-out]">

                            {/* section 1: Basic Info */}
                            <section className="grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-white/5 pb-12 pt-20">
                                <div className="md:col-span-1 space-y-2">
                                    <h2 className="text-lg font-medium text-white">App Identity</h2>
                                    <p className="text-sm text-zinc-500 leading-relaxed">Basic information about your application that will be displayed to users.</p>
                                </div>
                                <div className="md:col-span-2 space-y-6">

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Application Name</label>
                                        <input
                                            type="text"
                                            value={appName}
                                            onChange={(e) => setAppName(e.target.value)}
                                            placeholder="e.g. Zen Focus"
                                            className="w-full mt-2 bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-700 focus:border-[#d1aea0]/50 outline-none transition-colors"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Category</label>
                                            <CustomSelect
                                                value={appCategory}
                                                onChange={setAppCategory}
                                                placeholder="Select Category"
                                                options={[
                                                    { value: "productivity", label: "Productivity" },
                                                    { value: "entertainment", label: "Entertainment" },
                                                    { value: "games", label: "Games" },
                                                    { value: "finance", label: "Finance" },
                                                    { value: "education", label: "Education" },
                                                    { value: "social", label: "Social" },
                                                    { value: "utilities", label: "Utilities" },
                                                    { value: "devtools", label: "Developer Tools" },
                                                    { value: "other", label: "Other" },
                                                ]}
                                            />
                                            {appCategory === "other" && (
                                                <input
                                                    type="text"
                                                    value={customCategory}
                                                    onChange={(e) => setCustomCategory(e.target.value)}
                                                    placeholder="Specify Category"
                                                    className="w-full mt-2 bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-700 focus:border-[#d1aea0]/50 outline-none transition-colors animate-[fadeIn_0.2s_ease-out]"
                                                />
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Pricing Model</label>
                                            <CustomSelect
                                                value={pricingModel}
                                                onChange={setPricingModel}
                                                placeholder="Select Pricing"
                                                options={[
                                                    { value: "free", label: "Free" },
                                                    { value: "paid", label: "Paid (One-time)" },
                                                    { value: "subscription", label: "Subscription" },
                                                ]}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Hosting Region</label>
                                        <div className="relative mt-2">
                                            <button
                                                type="button"
                                                onClick={() => setRegionOpen(!regionOpen)}
                                                className={`w-full bg-black/20 border rounded-xl px-4 py-3 text-sm text-white flex items-center justify-between transition-colors ${regionOpen ? "border-[#d1aea0]/50 bg-black/40" : "border-white/10 hover:border-white/20"}`}
                                            >
                                                <div className="flex flex-col items-start">
                                                    <span>{selectedRegion}</span>
                                                </div>
                                                <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform duration-200 ${regionOpen ? "rotate-180" : ""}`} />
                                            </button>

                                            {regionOpen && (
                                                <>
                                                    <div className="fixed inset-0 z-10" onClick={() => setRegionOpen(false)} />
                                                    <div className="absolute top-full left-0 right-0 mt-2 bg-[#0A0A0A] border border-white/10 rounded-xl shadow-xl overflow-hidden z-20 animate-[fadeIn_0.1s_ease-out] p-1">
                                                        <button
                                                            onClick={() => { setSelectedRegion('Global (US-East)'); setRegionOpen(false); }}
                                                            className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${selectedRegion === 'Global (US-East)' ? 'text-white bg-white/5' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
                                                        >
                                                            <div>
                                                                <span className="block text-sm font-medium">Global (US-East)</span>
                                                                <span className="text-[10px] text-zinc-500">Optimized for worldwide access</span>
                                                            </div>
                                                            {selectedRegion === 'Global (US-East)' && <div className="w-1.5 h-1.5 rounded-full bg-[#d1aea0]" />}
                                                        </button>
                                                        <button
                                                            onClick={() => { setSelectedRegion('India (AP-South)'); setRegionOpen(false); }}
                                                            className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${selectedRegion === 'India (AP-South)' ? 'text-white bg-white/5' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
                                                        >
                                                            <div>
                                                                <span className="block text-sm font-medium">India (AP-South)</span>
                                                                <span className="text-[10px] text-zinc-500">Optimized for South Asian users</span>
                                                            </div>
                                                            {selectedRegion === 'India (AP-South)' && <div className="w-1.5 h-1.5 rounded-full bg-[#d1aea0]" />}
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </section>


                            {/* section 2: Media */}
                            <section className="grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-white/5 pb-12">
                                <div className="md:col-span-1 space-y-2">
                                    <h2 className="text-lg font-medium text-white">Visual Assets</h2>
                                    <p className="text-sm text-zinc-500 leading-relaxed">Upload your app icon and screenshots. High quality assets improve conversion.</p>
                                </div>
                                <div className="md:col-span-2 space-y-8">

                                    <div className="flex items-start gap-6">
                                        <div className="w-24 h-24 rounded-2xl bg-white/[0.03] border border-dashed border-white/20 flex items-center justify-center cursor-pointer hover:bg-white/[0.05] transition-colors group">
                                            <Upload className="w-6 h-6 text-zinc-600 group-hover:text-white transition-colors" />
                                        </div>
                                        <div className="space-y-1 pt-2">
                                            <h3 className="text-sm font-medium text-white">App Icon</h3>
                                            <p className="text-xs text-zinc-500">512x512px PNG or JPG. Max 2MB.</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-6">
                                        <div className="w-80 h-48 rounded-2xl bg-white/[0.03] border border-dashed border-white/20 flex items-center justify-center cursor-pointer hover:bg-white/[0.05] transition-colors group">
                                            <Video className="w-6 h-6 text-zinc-600 group-hover:text-white transition-colors" />
                                        </div>
                                        <div className="space-y-1 pt-2">
                                            <h3 className="text-sm font-medium text-white">Video Introduction <span className="text-zinc-500 font-normal ml-1">(Optional)</span></h3>
                                            <p className="text-xs text-zinc-500">1920x1080px MP4. Max 50MB.</p>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center justify-between">
                                            Screenshots
                                            <span className="text-[10px] font-normal normal-case text-zinc-500">Drag & drop to reorder</span>
                                        </label>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="aspect-video rounded-xl bg-white/[0.03] border border-dashed border-white/20 flex flex-col items-center justify-center cursor-pointer hover:bg-white/[0.05] transition-colors group">
                                                <ImageIcon className="w-6 h-6 text-zinc-600 group-hover:text-white mb-2 transition-colors" />
                                                <span className="text-[10px] text-zinc-600 group-hover:text-zinc-400">Upload</span>
                                            </div>
                                            <div className="aspect-video rounded-xl bg-white/[0.03] border border-dashed border-white/20 flex flex-col items-center justify-center cursor-pointer hover:bg-white/[0.05] transition-colors group">
                                                <ImageIcon className="w-6 h-6 text-zinc-600 group-hover:text-white mb-2 transition-colors" />
                                                <span className="text-[10px] text-zinc-600 group-hover:text-zinc-400">Upload</span>
                                            </div>
                                            <div className="aspect-video rounded-xl bg-white/[0.03] border border-dashed border-white/20 flex flex-col items-center justify-center cursor-pointer hover:bg-white/[0.05] transition-colors group">
                                                <ImageIcon className="w-6 h-6 text-zinc-600 group-hover:text-white mb-2 transition-colors" />
                                                <span className="text-[10px] text-zinc-600 group-hover:text-zinc-400">Upload</span>
                                            </div>
                                            <div className="aspect-video rounded-xl bg-white/[0.03] border border-dashed border-white/20 flex flex-col items-center justify-center cursor-pointer hover:bg-white/[0.05] transition-colors group">
                                                <Plus className="w-6 h-6 text-zinc-600 group-hover:text-white mb-1 transition-colors" />
                                                <span className="text-[10px] text-zinc-600 group-hover:text-zinc-400">Add More</span>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </section>


                            {/* section 3: Details */}
                            <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="md:col-span-1 space-y-2">
                                    <h2 className="text-lg font-medium text-white">Listing Details</h2>
                                    <p className="text-sm text-zinc-500 leading-relaxed">A compelling description tells users what your app does and why they should use it.</p>
                                </div>
                                <div className="md:col-span-2 space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Short Description</label>
                                        <input
                                            type="text"
                                            value={shortDescription}
                                            onChange={(e) => setShortDescription(e.target.value)}
                                            placeholder="Brief elevator pitch (Max 300 chars)"
                                            className="w-full mt-2 bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-700 focus:border-[#d1aea0]/50 outline-none transition-colors"
                                            maxLength={300}
                                        />
                                        <div className="text-right text-[10px] text-zinc-600 pt-1">{shortDescription.length}/300</div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Full Description</label>
                                        <textarea
                                            value={fullDescription}
                                            onChange={(e) => setFullDescription(e.target.value)}
                                            placeholder="Explain features, usage..."
                                            className="w-full mt-2 h-40 bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-700 focus:border-[#d1aea0]/50 outline-none transition-colors resize-none leading-relaxed"
                                        />
                                    </div>

                                    <div className="space-y-4 pt-4">
                                        <h3 className="text-sm font-medium text-white pb-2 border-b border-white/5">Supported Platforms</h3>
                                        <div className="flex gap-4">
                                            <PlatformCheckbox icon={<Globe className="w-4 h-4" />} label="Web" />
                                            <PlatformCheckbox icon={<Monitor className="w-4 h-4" />} label="Desktop" />
                                            <PlatformCheckbox icon={<Smartphone className="w-4 h-4" />} label="Mobile" />
                                        </div>
                                    </div>

                                </div>
                            </section>
                        </div>
                    )}


                    {/* STEP 2: Technical & Review */}
                    {step === 2 && (
                        <div className="space-y-12 animate-[fadeIn_0.3s_ease-out]">

                            {/* Source Code */}
                            <section className="grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-white/5 pb-12 pt-20">
                                <div className="md:col-span-1 space-y-2">
                                    <h2 className="text-lg font-medium text-white">Build Source Code</h2>
                                    <p className="text-sm text-zinc-500 leading-relaxed">Upload your project files. We support .zip archives up to 500MB.</p>
                                </div>
                                <div className="md:col-span-2 space-y-6">
                                    <div className="border-2 border-dashed border-white/10 rounded-3xl p-12 flex flex-col items-center justify-center text-center hover:bg-white/[0.02] transition-colors group cursor-pointer bg-white/[0.01]">
                                        <div className="w-16 h-16 rounded-full bg-white/[0.03] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                            <Upload className="w-6 h-6 text-zinc-400 group-hover:text-white transition-colors" />
                                        </div>
                                        <h3 className="text-white font-medium mb-1">Upload Project Archive</h3>
                                        <p className="text-sm text-zinc-500 max-w-xs">Drag and drop your .zip file here, or click to browse files.</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Project Verification</h4>
                                            <span className="text-[10px] text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20">Required</span>
                                        </div>

                                        <p className="text-sm text-zinc-400">To verify your ownership, please add the following <span className="font-mono font-semibold text-white">`loopsync.json`</span> file to the root of your project before uploading.</p>

                                        <div className="relative group">
                                            <div className="absolute top-3 right-3 flex gap-2">
                                                <span className="text-[10px] text-zinc-500 font-mono bg-white/5 px-2 py-1 rounded">loopsync.json</span>
                                                <button
                                                    onClick={() => navigator.clipboard.writeText(`{\n  "app_id": "app_${Math.random().toString(36).substr(2, 9)}",\n  "verification_token": "verify_${Math.random().toString(36).substr(2, 12)}",\n  "timestamp": ${Date.now()}\n}`)}
                                                    className="p-1.5 rounded-md bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                                                    title="Copy to Clipboard"
                                                >
                                                    <Copy className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                            <pre className="p-4 rounded-xl bg-black/40 border border-white/10 font-mono text-sm text-zinc-300 overflow-x-auto">
                                                {`{
  "app_id": "app_x92k2m2",
  "verification_token": "verify_8x92k2m292k2",
  "timestamp": 1704928291
}`}
                                            </pre>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Reviewer Info */}
                            <section className="grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-white/5 pb-12">
                                <div className="md:col-span-1 space-y-2">
                                    <h2 className="text-lg font-medium text-white">Reviewer Information</h2>
                                    <p className="text-sm text-zinc-500 leading-relaxed">Provide details to help our team review your app efficiently.</p>
                                </div>
                                <div className="md:col-span-2 space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Technical Description / How it was built</label>
                                        <textarea
                                            placeholder="Explain the technologies used, architecture, and any specific build instructions..."
                                            className="w-full mt-2 h-32 bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-700 focus:border-[#d1aea0]/50 outline-none transition-colors resize-none leading-relaxed"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Reviewer Notes</label>
                                        <textarea
                                            placeholder="Any special instructions, hidden features, or context for the reviewer..."
                                            className="w-full mt-2 h-32 bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-700 focus:border-[#d1aea0]/50 outline-none transition-colors resize-none leading-relaxed"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Test Credentials (If applicable)</label>
                                        <div className="grid grid-cols-2 gap-4">
                                            <input
                                                type="text"
                                                placeholder="Username"
                                                className="w-full mt-2 bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-700 focus:border-[#d1aea0]/50 outline-none transition-colors"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Password"
                                                className="w-full mt-2 bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-700 focus:border-[#d1aea0]/50 outline-none transition-colors"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Policies */}
                            <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="md:col-span-1 space-y-2">
                                    <h2 className="text-lg font-medium text-white">Policies & Compliance</h2>
                                    <p className="text-sm text-zinc-500 leading-relaxed">Links to your legal documents.</p>
                                </div>
                                <div className="md:col-span-2 space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Privacy Policy URL</label>
                                        <input
                                            type="url"
                                            placeholder="https://"
                                            className="w-full mt-2 bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-700 focus:border-[#d1aea0]/50 outline-none transition-colors"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Terms of Service URL</label>
                                        <input
                                            type="url"
                                            placeholder="https://"
                                            className="w-full mt-2 bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-700 focus:border-[#d1aea0]/50 outline-none transition-colors"
                                        />
                                    </div>
                                </div>
                            </section>

                        </div>
                    )}
                </form>
            </main>
        </div>
    );
}

function PlatformCheckbox({ icon, label }: { icon: React.ReactNode, label: string }) {
    const [checked, setChecked] = useState(false);
    return (
        <button
            type="button"
            onClick={() => setChecked(!checked)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm transition-all ${checked
                ? "bg-[#d1aea0]/10 border-[#d1aea0]/30 text-[#d1aea0]"
                : "bg-white/[0.02] border-white/5 text-zinc-500 hover:border-white/10 hover:bg-white/[0.04]"
                }`}>
            {icon}
            {label}
            {checked && <CheckCircle2 className="w-3.5 h-3.5 ml-1" />}
        </button>
    )
}

function CustomSelect({ value, onChange, options, placeholder }: { value: string, onChange: (val: string) => void, options: { value: string, label: string }[], placeholder?: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const selectedOption = options.find(o => o.value === value);

    return (
        <div className="relative mt-2">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full bg-black/20 border rounded-xl px-4 py-3 text-sm text-white flex items-center justify-between transition-colors
                ${isOpen ? "border-[#d1aea0]/50 bg-black/40" : "border-white/10 hover:border-white/20"}
                `}
            >
                <span className={selectedOption ? "text-white" : "text-zinc-700"}>
                    {selectedOption?.label || "Select..."}
                </span>
                <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
                    <div className="absolute top-full left-0 right-0 mt-2 bg-[#0A0A0A] border border-white/10 rounded-xl shadow-xl overflow-hidden z-20 animate-[fadeIn_0.1s_ease-out]">
                        <div className="max-h-60 overflow-y-auto p-1 scrollbar-thin scrollbar-thumb-white/10">
                            {options.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => {
                                        onChange(option.value);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full flex items-center justify-between px-3 py-2.5 text-sm rounded-lg transition-colors ${selectedOption?.value === option.value
                                        ? "bg-[#d1aea0]/10 text-[#d1aea0]"
                                        : "text-zinc-300 hover:bg-white/5 hover:text-white"
                                        }`}
                                >
                                    <span>{option.label}</span>
                                    {selectedOption?.value === option.value && <Check className="w-3.5 h-3.5" />}
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
