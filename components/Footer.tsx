"use client";

import Link from "next/link";
import { Globe, Check, ChevronDown, Facebook, Twitter, Instagram, Linkedin, Github } from "lucide-react";
import { useState, useEffect } from "react";

export default function Footer() {
    const [currency, setCurrency] = useState("INR");
    const [region, setRegion] = useState("India");
    const [flagCode, setFlagCode] = useState("in");
    const [currencySymbol, setCurrencySymbol] = useState("₹");

    useEffect(() => {
        // Lightweight IP-based geolocation using ipwho.is (CORS-friendly, no key)
        fetch('https://ipwho.is/')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setRegion(data.country);
                    setFlagCode(data.country_code.toLowerCase());

                    // Safe check for currency data
                    if (data.currency) {
                        setCurrency(data.currency.code);
                        setCurrencySymbol(data.currency.symbol);
                    }
                }
            })
            .catch(err => {
                console.error("Geo-detection failed, keeping defaults", err);
            });
    }, []);

    return (
        <footer className="w-full bg-black border-t border-white/5 pt-16 pb-8 mt-20 font-sans relative">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent blur-sm"></div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-35">

                {/* Main Footer Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12 mb-16">

                    {/* Brand Column */}
                    <div className="col-span-2 lg:col-span-2 flex flex-col items-start gap-4">
                        <Link href="/" className="flex items-center gap-2">
                            <img src="/resources/logo.svg" alt="LoopSync Logo" className="w-40 h-10" />
                        </Link>
                        <p className="text-zinc-500 text-sm leading-relaxed max-w-sm">
                            A cloud based single, intelligent framework that sees, understands, and reasons across anything you face.
                        </p>

                        <div className="flex items-center gap-4 mt-2">
                            <SocialLink href="#" icon={<Twitter className="w-4 h-4" />} label="Twitter" />
                            <SocialLink href="#" icon={<Github className="w-4 h-4" />} label="GitHub" />
                            <SocialLink href="#" icon={<Linkedin className="w-4 h-4" />} label="LinkedIn" />
                            <SocialLink href="#" icon={<Instagram className="w-4 h-4" />} label="Instagram" />
                        </div>
                    </div>

                    {/* Links Column 1: Store */}
                    <div className="flex flex-col gap-4">
                        <h4 className="font-geom font-semibold text-white">Store</h4>
                        <ul className="space-y-2.5 text-sm text-zinc-400">
                            <li><Link href="/store" className="hover:text-white transition-colors">Discover</Link></li>
                            <li><Link href="/store/apps" className="hover:text-white transition-colors">Apps</Link></li>
                            <li><Link href="/store/extensions" className="hover:text-white transition-colors">Extensions</Link></li>
                            <li><Link href="/store/software" className="hover:text-white transition-colors">Software</Link></li>
                        </ul>
                    </div>

                    {/* Links Column 2: Resources */}
                    <div className="flex flex-col gap-4">
                        <h4 className="font-geom font-semibold text-white">Resources</h4>
                        <ul className="space-y-2.5 text-sm text-zinc-400">
                            <li><Link href="/developers/docs" className="hover:text-white transition-colors">Developer Docs</Link></li>
                            <li><Link href="/one-window/support/resources" className="hover:text-white transition-colors">Support</Link></li>
                        </ul>
                    </div>

                    {/* Links Column 3: Company */}
                    <div className="flex flex-col gap-4">
                        <h4 className="font-geom font-semibold text-white">Company</h4>
                        <ul className="space-y-2.5 text-sm text-zinc-400">
                            <li><Link href="/company" className="hover:text-white transition-colors">About Us</Link></li>
                            <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                            <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                            <li><Link href="/one-window/support/resources" className="hover:text-white transition-colors">Contact</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar: Settings & Copyright */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">

                    {/* Selectors */}
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        {/* Region Selector */}
                        <div className="relative group">
                            <button className="flex items-center gap-2 bg-zinc-900/50 hover:bg-zinc-900 border border-white/5 hover:border-white/10 rounded-full px-4 py-2 text-xs font-medium text-zinc-300 transition-all">
                                <img
                                    src={`https://flagcdn.com/20x15/${flagCode}.png`}
                                    srcSet={`https://flagcdn.com/40x30/${flagCode}.png 2x`}
                                    alt={region}
                                    className="w-4 h-3 object-cover rounded-[1px]"
                                />
                                <span>{region}</span>
                                <ChevronDown className="w-3 h-3 text-zinc-500 ml-1" />
                            </button>
                        </div>

                        {/* Currency Selector */}
                        <div className="relative group">
                            <button className="flex items-center gap-2 bg-zinc-900/50 hover:bg-zinc-900 border border-white/5 hover:border-white/10 rounded-full px-4 py-2 text-xs font-medium text-zinc-300 transition-all">
                                <span className="text-zinc-500 font-serif italic text-sm leading-none">{currencySymbol}</span>
                                <span>{currency}</span>
                                <ChevronDown className="w-3 h-3 text-zinc-500 ml-1" />
                            </button>
                        </div>
                    </div>

                    {/* Copyright & Legal */}
                    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-xs text-zinc-500">
                        <span>© 2025 Intellaris Private Limited. All rights reserved.</span>
                        <div className="flex items-center gap-6">
                            <Link href="/policies/privacy-policy" className="hover:text-white transition-colors">Privacy</Link>
                            <Link href="/policies/terms-of-use" className="hover:text-white transition-colors">Terms</Link>
                            <Link href="/policies/cookies" className="hover:text-white transition-colors">Cookies</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function SocialLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
    return (
        <a
            href={href}
            aria-label={label}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-all border border-white/5 hover:border-white/10"
        >
            {icon}
        </a>
    );
}
