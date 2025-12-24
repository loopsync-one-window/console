"use client";

import React from "react";
import Navbar from "@/components/NavBar";
import Link from "next/link";
import { ArrowRight, Download, CheckCircle, MousePointer, Command, Zap, ArrowUpRight, Upload } from "lucide-react";

export default function AtlasProductPage() {
    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500/30 overflow-x-hidden relative">
            {/* Navbar */}
            <Navbar />

            {/* Background Watermark */}
            <div className="absolute top-24 -right-24 md:-right-40 w-[500px] md:w-[700px] h-[500px] md:h-[700px] pointer-events-none select-none z-0 ">
                <img
                    src="/products-logo.svg"
                    alt="Atlas Logo"
                    className="w-full h-full object-contain brightness-150 grayscale"
                />
            </div>

            {/* Hero Section */}
            <section className="pt-48 pb-20 px-6 max-w-6xl mx-auto relative z-10 text-center md:text-left">
                <div className="flex flex-col md:flex-row items-center gap-12">
                    <div className="flex-1 space-y-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-500/10 border border-gray-500/20 text-gray-400 text-xs font-medium">
                            <Zap className="w-3 h-3" />
                            <span>v1.0 Available Now</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                            Atlas <span className="text-zinc-500">Extension</span>
                        </h1>

                        <p className="text-xl text-zinc-400 max-w-2xl leading-relaxed">
                            Your intelligent companion for the web. Analyze any part of your screen, get instant context, and automate your workflow with a single click.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                            <button className="px-8 py-4 rounded-full bg-white text-black font-semibold hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2">
                                <Download className="w-5 h-5" />
                                Add to Browser
                            </button>
                            <Link href="/products" className="px-8 py-4 rounded-full bg-zinc-900 border border-white/10 text-white font-medium hover:bg-zinc-800 transition-colors">
                                View All Products
                            </Link>
                        </div>
                    </div>


                </div>
            </section>

            {/* Steps Section */}
            <section className="py-24 px-6 bg-[#050505] border-t border-white/5">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Get Started in Seconds</h2>
                        <p className="text-zinc-400">Follow these simple steps to activate your intelligent workspace.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent -translate-x-1/2"></div>

                        {/* Step 1 */}
                        <div className="relative group md:text-right pr-0 md:pr-12">
                            <div className="md:hidden absolute left-0 top-0 bottom-0 w-px bg-white/10 ml-4"></div>
                            <div className="relative z-10 flex flex-col md:items-end pl-12 md:pl-0">
                                <div className="absolute left-0 md:left-auto md:-right-[25px] top-0 w-8 h-8 rounded-full bg-zinc-900 border border-white/20 flex items-center justify-center text-sm font-bold shadow-[0_0_15px_rgba(0,0,0,1)] group-hover:border-gray-500/50 group-hover:text-white transition-colors">1</div>
                                <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-white transition-colors mr-12">Install the Extension</h3>
                                <p className="text-zinc-400 mb-4 mr-12">
                                    Download the Atlas extension from the Browser Extension Store. It's lightweight and built for privacy.
                                </p>
                                <div className="inline-block p-4 rounded-xl bg-zinc-900/50 border border-white/5 mr-12">
                                    <Download className="w-6 h-6 text-zinc-500" />
                                </div>
                            </div>
                        </div>
                        <div className="hidden md:block"></div> {/* Spacer */}

                        {/* Step 2 */}
                        <div className="hidden md:block"></div> {/* Spacer */}
                        <div className="relative group pl-0 md:pl-12">
                            <div className="md:hidden absolute left-0 top-0 bottom-0 w-px bg-white/10 ml-4"></div>
                            <div className="relative z-10 pl-12">
                                <div className="absolute left-0 md:-left-[25px] top-0 w-8 h-8 rounded-full bg-zinc-900 border border-white/20 flex items-center justify-center text-sm font-bold shadow-[0_0_15px_rgba(0,0,0,1)] group-hover:border-gray-500/50 group-hover:text-white transition-colors">2</div>
                                <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-white transition-colors">Pin to Toolbar</h3>
                                <p className="text-zinc-400 mb-4">
                                    Click the puzzle piece icon in your browser and pin Atlas for quick access to your intelligent tools.
                                </p>
                                <div className="inline-block p-4 rounded-xl bg-zinc-900/50 border border-white/5">
                                    <img src="/icons/pin-icon.svg" alt="" className="w-6 h-6 opacity-50 grayscale" />
                                    {/* Fallback icon if image missing */}
                                    <div className="hidden"><CheckCircle className="w-6 h-6 text-zinc-500" /></div>
                                </div>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="relative group md:text-right pr-0 md:pr-12">
                            <div className="md:hidden absolute left-0 top-0 bottom-0 w-px bg-white/10 ml-4"></div>
                            <div className="relative z-10 flex flex-col md:items-end pl-12 md:pl-0">
                                <div className="absolute left-0 md:left-auto md:-right-[25px] top-0 w-8 h-8 rounded-full bg-zinc-900 border border-white/20 flex items-center justify-center text-sm font-bold shadow-[0_0_15px_rgba(0,0,0,1)] group-hover:border-gray-500/50 group-hover:text-white transition-colors">3</div>
                                <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-white transition-colors mr-12">Launch with Command+Shift+Q</h3>
                                <p className="text-zinc-400 mb-4 mr-12">
                                    Use the shortcut <span className="text-white px-1.5 py-0.5 bg-white/10 rounded text-sm font-mono">Cmd+Shift+Q</span> or click the Atlas icon to open the command palette.
                                </p>
                                <div className="inline-block p-4 rounded-xl bg-zinc-900/50 border border-white/5 mr-12">
                                    <Command className="w-6 h-6 text-zinc-500" />
                                </div>
                            </div>
                        </div>
                        <div className="hidden md:block"></div> {/* Spacer */}

                        {/* Step 4 */}
                        <div className="hidden md:block"></div> {/* Spacer */}
                        <div className="relative group pl-0 md:pl-12">
                            <div className="md:hidden absolute left-0 top-0 bottom-0 w-px bg-white/10 ml-4"></div>
                            <div className="relative z-10 pl-12">
                                <div className="absolute left-0 md:-left-[25px] top-0 w-8 h-8 rounded-full bg-zinc-900 border border-white/20 flex items-center justify-center text-sm font-bold shadow-[0_0_15px_rgba(0,0,0,1)] group-hover:border-gray-500/50 group-hover:text-white transition-colors">4</div>
                                <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-white transition-colors">Select & Analyze</h3>
                                <p className="text-zinc-400 mb-4">
                                    Draw a box around any content on your screen to analyze it, translate it, or ask questions about it.
                                </p>
                                <div className="inline-block p-4 rounded-xl bg-zinc-900/50 border border-white/5">
                                    <MousePointer className="w-6 h-6 text-zinc-500" />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Footer CTA */}
            <section className="py-20 text-center">
                <div className="max-w-2xl mx-auto px-6">
                    <h2 className="text-3xl font-bold mb-6">Ready to upgrade your workflow?</h2>
                    <button className="px-8 py-4 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-500 transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)]">
                        Install Atlas for Free
                    </button>
                </div>
            </section>

            {/* Publish Section inspired by Raycast/Vercel */}
            <section className="bg-black border-t border-white/10">
                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/10 max-w-6xl mx-auto border-x border-white/10">

                    {/* Left: Visual */}
                    <div className="relative h-[400px] md:h-[500px] bg-black overflow-hidden flex items-center justify-center p-8 group">
                        {/* Grid Background */}
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px]"></div>

                        {/* Label */}
                        <div className="absolute top-6 left-6 font-mono text-xs text-zinc-500 tracking-widest">PACKAGE 2.0</div>

                        {/* Central Graphic (Isometric Stack) */}
                        <div className="relative z-10 perspective-1000">
                            {/* Abstract 'Floppy' Stack layers */}
                            <div className="relative w-48 h-48 transform rotate-x-60 rotate-z-45 transition-transform duration-700 group-hover:rotate-z-[60deg] group-hover:scale-110 preserve-3d">

                                {/* Bottom Layer (Stack Base) */}
                                <div className="absolute inset-0 bg-zinc-900 border border-white/10 rounded-xl transform -translate-z-12 shadow-2xl"></div>
                                <div className="absolute inset-0 bg-zinc-900 border border-white/10 rounded-xl transform -translate-z-8 shadow-2xl"></div>
                                <div className="absolute inset-0 bg-zinc-800 border border-white/10 rounded-xl transform -translate-z-4 shadow-xl"></div>

                                {/* Top Layer (Active Item) */}
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-900 border border-blue-400/30 rounded-xl transform translate-z-0 shadow-[0_0_50px_rgba(37,99,235,0.3)] flex items-center justify-center overflow-hidden">
                                    {/* Floppy/Item details */}
                                    {/* Metal slider */}
                                    <div className="absolute top-0 w-2/3 h-16 bg-white/10 backdrop-blur-md rounded-b-lg border-x border-b border-white/10"></div>
                                    {/* Label area */}
                                    <div className="absolute bottom-6 w-3/4 h-2 bg-white/20 rounded-full"></div>
                                    <div className="absolute bottom-10 w-1/2 h-2 bg-white/10 rounded-full"></div>
                                    {/* Icon */}
                                    <div className="text-white/20 transform scale-150">
                                        <Upload className="w-24 h-24" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Content */}
                    <div className="relative h-[400px] md:h-auto bg-black p-12 flex flex-col justify-end items-start group">
                        {/* Top Right Arrow */}
                        <div className="absolute top-6 right-6 text-zinc-600 group-hover:text-white transition-colors">
                            <ArrowUpRight className="w-6 h-6" />
                        </div>

                        <div className="relative z-10 w-full max-w-md">
                            <img src="/products-logo.svg" alt="App Logo" className="w-16 h-16 mb-6 object-contain brightness-150" />
                            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-gray-500/10 border border-gray-500/20 text-gray-400 text-xs font-semibold uppercase tracking-wider">
                                For Developers
                            </div>
                            <h3 className="text-3xl font-bold text-white mb-4">Publish to LoopSync</h3>
                            <p className="text-zinc-400 text-lg leading-relaxed">
                                Build, ship, and monetize. Submit your products to the LoopSync Store and reach the entire ecosystem.
                            </p>
                        </div>
                    </div>

                </div>

                {/* Bottom Bar: Get Started */}
                <div className="border-t border-b border-white/10 max-w-6xl mx-auto border-x border-white/10">
                    <Link href="/developers" className="flex items-center justify-center gap-3 py-6 group hover:bg-white/5 transition-colors cursor-pointer">
                        <span className="font-mono text-sm uppercase tracking-widest text-white">Open Developer Console</span>
                        <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
                    </Link>
                </div>
            </section>

            {/* Divider */}
            <div className="border-t border-white/5 mb-20"></div>

            {/* Center Content */}
            <div className="text-center text-white text-sm space-y-1 mb-20">
                <p>
                    © 2025{" "}
                    <a
                        href="https://www.intellaris.co"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold underline hover:font-bold cursor-pointer"
                    >
                        Intellaris Private Limited
                    </a>
                    . All rights reserved.
                </p>

                <p className="flex flex-wrap justify-center items-center gap-x-2 text-white/70">
                    <a href="/policies/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</a>
                    <span className="text-white/40">|</span>
                    <a href="/policies/software-license" className="hover:text-white transition-colors">Software License</a>
                    <span className="text-white/40">|</span>
                    <a href="/policies/terms-of-use" className="hover:text-white transition-colors">Terms of Use</a>
                    <span className="text-white/40">|</span>
                    <a href="/policies/fair-use-policy" className="hover:text-white transition-colors">Fair Use Policy</a>
                    <span className="text-white/40">|</span>
                    <a href="/policies/refund-policy" className="hover:text-white transition-colors">Refund Policy</a>
                </p>
            </div>

            {/* Copyright */}
            <div className="fixed bottom-0 left-0 right-0 z-20 pb-6 px-6 pointer-events-none">
                <div className="flex items-center justify-center relative pointer-events-auto">

                    {/* QR Code */}
                    <div className="absolute right-0 pr-4 mb-20 flex flex-col items-center space-y-1 mb-10">
                        <a href="https://loopsync.cloud/one-window/support/resources" target="_blank" rel="noopener noreferrer">
                            <img
                                src="/resources/qr-support.svg"
                                alt="QR Code"
                                className="w-20 h-20 opacity-90 hover:opacity-100 transition duration-200"
                            />
                        </a>
                        <span className="text-white text-xs font-medium text-center leading-tight max-w-[8rem]">
                            Scan or Click for<br /><span className="font-semibold text-white">One Window Support</span>
                        </span>
                    </div>

                </div>
            </div>

        </div>
    );
}
