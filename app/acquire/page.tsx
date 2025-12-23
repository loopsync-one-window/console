"use client"

import {
    ArrowRight,
    Check,
    ChevronDown,
    Loader2,
    Send,
    Building2,
    Briefcase,
    Search
} from "lucide-react"
import { Dithering } from "@paper-design/shaders-react"
import { useState, useRef, useEffect, useMemo } from "react"
import Link from "next/link"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"

import { countries, Country } from "@/lib/countries";

// Reusable Dropdown Component
interface FormDropdownProps {
    label: string;
    value: string;
    options: string[];
    onChange: (value: string) => void;
    placeholder?: string;
}

const PRIORITY_COUNTRY_CODES = ["US", "GB", "AE", "SA", "SG", "CA", "DE", "CH", "AU", "IN"];

const CountryDropdown = ({ value, onChange }: { value: Country, onChange: (c: Country) => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Focus search when opened
    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            // Small delay to ensure render
            setTimeout(() => searchInputRef.current?.focus(), 50);
        } else {
            setSearchQuery(""); // Reset search on close
        }
    }, [isOpen]);

    const filteredCountries = useMemo(() => {
        let result = countries;

        if (searchQuery) {
            const lower = searchQuery.toLowerCase();
            return result.filter(c =>
                c.name.toLowerCase().includes(lower) ||
                c.dial_code.includes(lower) ||
                c.code.toLowerCase().includes(lower)
            );
        }

        // Return priority sorted list logic only for display if needed, 
        // using the PRIORITY_COUNTRY_CODES to hoist them to the top
        return [...result].sort((a, b) => {
            const aPriority = PRIORITY_COUNTRY_CODES.indexOf(a.code);
            const bPriority = PRIORITY_COUNTRY_CODES.indexOf(b.code);

            // If both are priority, sort by their order in PRIORITY_LIST
            if (aPriority !== -1 && bPriority !== -1) return aPriority - bPriority;

            // If only a is priority, it comes first
            if (aPriority !== -1) return -1;

            // If only b is priority, it comes first
            if (bPriority !== -1) return 1;

            // Otherwise, keep original order (or sort alphabetically if not already)
            return 0; // Assuming 'countries' list is already acceptable order
        });
    }, [searchQuery]);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full bg-transparent px-0 py-2.5 text-sm appearance-none focus:outline-none transition-all duration-300 font-medium tracking-wide text-left flex items-center justify-between group`}
            >
                <span className="truncate mr-2 text-white flex items-center gap-2">
                    <span className="text-lg leading-none">{value.flag}</span>
                    <span className="opacity-80">{value.dial_code}</span>
                </span>
                <ChevronDown className={`w-3.5 h-3.5 flex-shrink-0 text-neutral-600 transition-transform duration-300 ${isOpen ? 'rotate-180 text-white' : 'group-hover:text-white'}`} />
            </button>

            <div className={`absolute left-0 w-[300px] top-full mt-2 bg-[#0A0A0A] border border-white/10 rounded-xl overflow-hidden shadow-2xl backdrop-blur-xl transition-all duration-200 z-50 origin-top ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-2 pointer-events-none'}`}>
                {/* Search Bar */}
                <div className="p-2 border-b border-white/10 sticky top-0 bg-[#0A0A0A] z-10">
                    <div className="flex items-center gap-2 bg-white/5 rounded-lg px-2 py-1.5 focus-within:bg-white/10 transition-colors border border-white/5 focus-within:border-white/20">
                        <Search className="w-3.5 h-3.5 text-white/40" />
                        <input
                            ref={searchInputRef}
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search country..."
                            className="bg-transparent border-none text-xs text-white placeholder-white/30 focus:outline-none w-full"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                </div>

                <div className="p-1.5 space-y-0.5 max-h-60 overflow-y-auto custom-scrollbar">
                    {filteredCountries.length > 0 ? (
                        filteredCountries.map((country) => (
                            <button
                                key={country.code}
                                type="button"
                                onClick={() => {
                                    onChange(country);
                                    setIsOpen(false);
                                }}
                                className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-medium tracking-wide transition-all duration-200 flex items-center gap-3 group/option ${value.code === country.code ? 'bg-white text-black' : 'text-white/60 hover:bg-white/10 hover:text-white'}`}
                            >
                                <span className="text-lg leading-none flex-shrink-0">{country.flag}</span>
                                <span className="truncate flex-1">{country.name}</span>
                                <span className={`flex-shrink-0 opacity-60 ${value.code === country.code ? 'text-black/60' : ''}`}>{country.dial_code}</span>
                            </button>
                        ))
                    ) : (
                        <div className="p-4 text-center text-xs text-white/30">
                            No countries found
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const FormDropdown = ({ label, value, options, onChange, placeholder = "Select" }: FormDropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="space-y-2 group/input" ref={dropdownRef}>
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 group-focus-within/input:text-white transition-colors duration-300 whitespace-nowrap">
                {label}
            </label>
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={`w-full bg-transparent border-b px-0 py-2.5 text-sm appearance-none focus:outline-none transition-all duration-300 font-medium tracking-wide text-left flex items-center justify-between group ${isOpen ? 'border-white' : 'border-white/20 focus:border-white'}`}
                >
                    <span className={`truncate mr-2 ${!value ? "text-neutral-700" : "text-white"}`}>
                        {value || placeholder}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 flex-shrink-0 text-neutral-600 transition-transform duration-300 ${isOpen ? 'rotate-180 text-white' : 'group-hover:text-white'}`} />
                </button>

                <div className={`absolute left-0 right-0 top-full mt-2 bg-[#0A0A0A] border border-white/10 rounded-xl overflow-hidden shadow-2xl backdrop-blur-xl transition-all duration-200 z-50 origin-top ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-2 pointer-events-none'}`}>
                    <div className="p-1.5 space-y-0.5 max-h-48 overflow-y-auto custom-scrollbar">
                        {options.map((option) => (
                            <button
                                key={option}
                                type="button"
                                onClick={() => {
                                    onChange(option);
                                    setIsOpen(false);
                                }}
                                className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-medium tracking-wide transition-all duration-200 flex items-center justify-between group/option ${value === option ? 'bg-white text-black' : 'text-white/60 hover:bg-white/10 hover:text-white'}`}
                            >
                                <span className="truncate">{option}</span>
                                {value === option && (
                                    <div className="w-1.5 h-1.5 rounded-full bg-black animate-pulse flex-shrink-0 ml-2" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

import { submitAcquisitionInquiry } from "@/lib/api"

export default function AcquirePage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState<Country>(countries.find(c => c.code === "US") || countries[0]);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phoneNumber: "",
        organization: "",
        role: "",
        buyerType: "",
        acquisitionScope: "",
        timeline: "",
        message: "",
        acknowledgement: false
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const payload = {
                ...formData,
                phoneNumber: `${selectedCountry.dial_code} ${formData.phoneNumber}`
            };
            await submitAcquisitionInquiry(payload);
            setShowSuccessModal(true);
            setFormData({
                name: "", email: "", phoneNumber: "", organization: "", role: "",
                buyerType: "", acquisitionScope: "", timeline: "",
                message: "", acknowledgement: false
            });
            setSelectedCountry(countries.find(c => c.code === "US") || countries[0]);
        } catch (error) {
            console.error("Failed to submit inquiry:", error);
            // Optionally add error handling UI
            alert("Something went wrong. Please try again.")
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="h-screen bg-[#000000] text-white overflow-hidden relative font-sans selection:bg-white/20">
            <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
                <DialogContent className="bg-white rounded-3xl text-black border-none sm:max-w-md p-8">
                    <div className="flex flex-col items-center justify-center text-center space-y-6">
                        <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center">
                            <Check className="w-8 h-8 text-white" />
                        </div>
                        <div className="space-y-2">
                            <DialogTitle className="text-2xl font-bold tracking-tight">Request Received</DialogTitle>
                            <DialogDescription className="text-black font-medium">
                                We've received your inquiry. Our strategic team will review your profile and get back to you shortly.
                            </DialogDescription>
                        </div>
                        <button
                            onClick={() => setShowSuccessModal(false)}
                            className="w-full bg-black text-white rounded-full py-3 font-semibold text-sm hover:bg-neutral-800 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </DialogContent>
            </Dialog>

            <div className="grid grid-cols-2 h-screen">

                {/* Left Column: Form */}
                <div className="flex flex-col relative z-20 h-screen bg-black/95">
                    {/* Header */}
                    <div className="absolute top-0 left-0 w-full p-6 pl-12 flex items-center justify-between z-50 backdrop-blur-md">
                        <div className="flex items-center gap-3 opacity-100 hover:opacity-100 transition-opacity cursor-default">
                            <Link
                                className="flex items-center justify-center gap-2"
                                href="/"
                            >
                                <img
                                    src="/resources/logo.svg"
                                    alt="LoopSync Logo"
                                    className="h-9 w-auto brightness-150 contrast-125"
                                />
                            </Link>
                            <div className="h-3 w-[1px] bg-white/20" />
                            <span className="text-xs font-mono uppercase tracking-widest text-white/50">Acquire</span>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col justify-center pl-12 pr-12 max-w-xl mx-auto w-full pt-120 overflow-y-auto scrollbar-hide scroll-smooth">
                        <div className="mb-8 space-y-2">
                            <h1 className="text-2xl font-semibold tracking-tight text-white mb-1">Strategic Acquisition</h1>
                            <p className="text-white/50 text-sm font-light leading-relaxed">
                                Connect with us regarding acquisition opportunities and strategic partnerships.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8 max-w-lg mx-auto w-full">
                            <div className="space-y-8">
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-2 group/input">
                                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 group-focus-within/input:text-white transition-colors duration-300">Full Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-transparent border-b border-white/20 px-0 py-2.5 text-sm text-white placeholder-neutral-700 focus:outline-none focus:border-white transition-all duration-300 font-medium tracking-wide"
                                            placeholder="YOUR NAME"
                                        />
                                    </div>
                                    <div className="space-y-2 group/input">
                                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 group-focus-within/input:text-white transition-colors duration-300">Work Email</label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full bg-transparent border-b border-white/20 px-0 py-2.5 text-sm text-white placeholder-neutral-700 focus:outline-none focus:border-white transition-all duration-300 font-medium tracking-wide"
                                            placeholder="EMAIL ADDRESS"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-8">
                                    <div className="space-y-2 group/input">
                                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 group-focus-within/input:text-white transition-colors duration-300">Phone Number</label>
                                        <div className="flex gap-2 border-b border-white/20 group-focus-within/input:border-white transition-colors duration-300">
                                            <div className="flex-shrink-0 min-w-[80px]">
                                                <CountryDropdown
                                                    value={selectedCountry}
                                                    onChange={setSelectedCountry}
                                                />
                                            </div>
                                            <input
                                                type="tel"
                                                required
                                                value={formData.phoneNumber}
                                                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                                className="flex-1 w-full bg-transparent border-none px-0 py-2.5 text-sm text-white placeholder-neutral-700 focus:outline-none font-medium tracking-wide"
                                                placeholder="PHONE NUMBER"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-2 group/input">
                                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 group-focus-within/input:text-white transition-colors duration-300">Organization</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.organization}
                                            onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                                            className="w-full bg-transparent border-b border-white/20 px-0 py-2.5 text-sm text-white placeholder-neutral-700 focus:outline-none focus:border-white transition-all duration-300 font-medium tracking-wide"
                                            placeholder="COMPANY NAME"
                                        />
                                    </div>
                                    <div className="space-y-2 group/input">
                                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 group-focus-within/input:text-white transition-colors duration-300">Role</label>
                                        <input
                                            type="text"
                                            value={formData.role}
                                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                            className="w-full bg-transparent border-b border-white/20 px-0 py-2.5 text-sm text-white placeholder-neutral-700 focus:outline-none focus:border-white transition-all duration-300 font-medium tracking-wide"
                                            placeholder="YOUR ROLE"
                                        />
                                    </div>
                                </div>

                                {/* Buyer Type */}
                                <div className="grid grid-cols-1 gap-8">
                                    <FormDropdown
                                        label="Buyer Type"
                                        value={formData.buyerType}
                                        onChange={(val) => setFormData({ ...formData, buyerType: val })}
                                        options={[
                                            "Strategic (Company / Corp Dev)",
                                            "Financial (Investor / Fund)",
                                            "Founder / Operator",
                                            "Other"
                                        ]}
                                        placeholder="Select Buyer Type"
                                    />
                                </div>

                                {/* Scope and Timeline */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                    <FormDropdown
                                        label="Acquisition Scope"
                                        value={formData.acquisitionScope}
                                        onChange={(val) => setFormData({ ...formData, acquisitionScope: val })}
                                        options={[
                                            "Full Acquisition",
                                            "Majority Stake",
                                            "Strategic Partnership",
                                            "Exploring Options"
                                        ]}
                                        placeholder="Select Scope"
                                    />
                                    <FormDropdown
                                        label="Expected Timeline"
                                        value={formData.timeline}
                                        onChange={(val) => setFormData({ ...formData, timeline: val })}
                                        options={[
                                            "Immediate (0-30 days)",
                                            "1-3 months",
                                            "3-6 months",
                                            "Exploratory"
                                        ]}
                                        placeholder="Select Timeline"
                                    />
                                </div>

                                <div className="space-y-2 group/input">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 group-focus-within/input:text-white transition-colors duration-300">Inquiry Details</label>
                                    <textarea
                                        required
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        className="w-full bg-transparent border-b border-white/20 px-0 py-6 text-sm text-white placeholder-neutral-700 min-h-[40px] resize-none focus:outline-none focus:border-white transition-all duration-300 font-medium tracking-wide"
                                        placeholder="Briefly describe your interest..."
                                    />
                                </div>

                                {/* Confidentiality Checkbox */}
                                <div className="space-y-4 pt-2">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">Confidentiality Acknowledgement</label>
                                    <label className="flex items-start gap-3 cursor-pointer group mt-4">
                                        <div className="relative pt-0.5">
                                            <input
                                                type="checkbox"
                                                required
                                                checked={formData.acknowledgement}
                                                onChange={(e) => setFormData({ ...formData, acknowledgement: e.target.checked })}
                                                className="peer appearance-none w-4 h-4 border border-white/20 rounded bg-transparent checked:bg-white checked:border-white transition-all duration-200"
                                            />
                                            <Check className="w-3 h-3 text-black absolute top-1.5 left-0.5 opacity-0 peer-checked:opacity-100 transition-opacity duration-200 pointer-events-none" />
                                        </div>
                                        <span className="text-sm text-white group-hover:text-white transition-colors duration-200 font-medium leading-snug">
                                            I understand that confidential details will be shared only after executing an NDA.
                                        </span>
                                    </label>
                                </div>
                            </div>

                            <div className="pt-4 pb-2">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="group relative inline-flex h-10 items-center justify-center overflow-hidden rounded-full bg-white px-8 font-medium text-black transition-all duration-300 hover:bg-neutral-200 disabled:opacity-70 disabled:hover:bg-white"
                                >
                                    <div className="flex items-center gap-2.5">
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                <span className="text-[10px] font-bold uppercase tracking-widest">Processing</span>
                                            </>
                                        ) : (
                                            <>
                                                <span className="text-[10px] font-bold uppercase tracking-widest">Request Details</span>
                                                <Send className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-0.5" />
                                            </>
                                        )}
                                    </div>
                                </button>
                            </div>
                        </form>

                        <div className="mt-8 border-t border-white/5 pt-6 flex items-center justify-between text-[10px] text-white uppercase tracking-wider">
                            <p>Intellaris Private Limited. © 2025</p>
                            <div className="flex gap-4">
                                <Link href="https://loopsync.cloud/policies/privacy-policy" className="hover:text-white/40 transition-colors">Privacy</Link>
                                <Link href="https://loopsync.cloud/policies/terms-of-use" className="hover:text-white/40 transition-colors">Terms</Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Visuals */}
                <div className="relative h-screen overflow-hidden bg-black flex flex-col z-10 border-l border-white/5">
                    {/* Red Dithering Background */}
                    <div className="absolute inset-0 z-0 bg-transparent">
                        <Dithering
                            style={{ height: "100%", width: "100%" }}
                            colorBack="#000000"
                            colorFront="#0055ffff"
                            shape={"cat" as any}
                            type="4x4"
                            pxSize={3.5}
                            offsetX={0}
                            offsetY={0}
                            scale={0.8}
                            rotation={0}
                            speed={0.5}
                        />
                    </div>

                    <div className="absolute inset-0 z-[1] backdrop-blur-[80px] pointer-events-none" />

                    {/* Top Right Header Text */}
                    <div className="absolute top-6 right-8 z-[1000] flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/5 rounded-full backdrop-blur-md">
                        <span className="text-xs font-semibold text-white uppercase tracking-wider">Strategic Desk</span>
                    </div>

                    {/* Showcase Text */}
                    <div className="absolute inset-0 flex items-center justify-center z-30 bg-transparent backdrop-blur-sm pointer-events-none">
                        <div className="w-full max-w-xl">
                            <div className="text-white py-20 px-6 flex flex-col items-center relative">
                                <div className="text-center mb-10 relative z-20">
                                    <h1 className="text-5xl font-bold mb-2">LoopSync<sup className="text-sm ml-2 align-super">TM</sup></h1>
                                    <p className="text-white font-semibold text-2xl tracking-wide">Global Expansion.</p>

                                    <p className="text-white/80 text-lg mt-12 max-w-3xl mx-auto leading-relaxed font-light">
                                        "Scaling intelligent frameworks to
                                        <br /><span className="text-white font-bold italic">global markets</span>."
                                    </p>

                                    <div className="mt-8 inline-block px-6 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-md">
                                        <p className="text-sm font-medium text-white/90">
                                            Valuation: <span className="text-white font-bold">~$1.65M – $2.79M</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div >
        </div >
    )
}
