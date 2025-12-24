"use client";

import React from "react";
import {
    Search,
    Gamepad2,
    Music,
    Languages,
    Scan,
    MessageSquare,
    Clock,
    Monitor,
    Zap,
    Command,
    ArrowRight,
    Globe,
    ArrowUpRight,
    Video,
    Image,
    FileText
} from "lucide-react";
import Navbar from "@/components/NavBar";
import Link from "next/link";

export default function ProductsPage() {
    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-red-500/30 overflow-x-hidden relative">
            {/* Navbar */}
            <Navbar />

            {/* Background Watermark */}
            <div className="absolute top-24 -left-24 md:-left-40 w-[500px] md:w-[700px] h-[500px] md:h-[700px] pointer-events-none select-none z-0">
                <img
                    src="/products-logo.svg"
                    alt="Product Logo"
                    className="w-full h-full object-contain brightness-150"
                />
            </div>

            {/* ----------------- PRO & TRANSLATION SECTION ----------------- */}
            <section className="pt-24 pb-48 mt-40 px-6 text-center max-w-5xl mx-auto">
                <div className="mb-6">
                    <img
                        src="/products-logo.svg"
                        alt="Product Logo"
                        className="w-16 h-16 mx-auto object-contain brightness-150"
                    />
                </div>

                <style dangerouslySetInnerHTML={{
                    __html: `
                  @keyframes sunriseText {
                    0% {
                      background-position: 50% 100%;
                      opacity: 0;
                      transform: translateY(20px);
                      filter: blur(8px);
                    }
                    100% {
                      background-position: 50% 0%;
                      opacity: 1;
                      transform: translateY(0);
                      filter: blur(0);
                    }
                  }
                  @keyframes sunGlow {
                    0% { opacity: 0; transform: scale(0.8); }
                    100% { opacity: 1; transform: scale(1); }
                  }
                `}} />

                <div className="relative inline-block mb-6">
                    {/* Subtle Sun Glow Background */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-orange-500/15 blur-[60px] rounded-full -z-10 animate-[sunGlow_2s_ease-out_forwards]"></div>

                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight relative z-10">
                        <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-orange-300 bg-[length:100%_200%] animate-[sunriseText_1.8s_cubic-bezier(0.2,0.8,0.2,1)_forwards] inline-block">
                            Precision Meets Productivity.
                        </span>
                    </h2>
                </div>
                <p className="text-xl text-zinc-400 mb-8">
                    More than AI. Built for real productivity.
                </p>

                <div className="flex flex-col items-center gap-4 mb-24">
                    <Link href="/pricing" className="px-6 py-3 rounded-full bg-white text-black font-medium hover:bg-zinc-200 transition-colors">
                        Compare Plans
                    </Link>
                    <span className="text-sm text-zinc-500">Starting at ₹759/month</span>
                </div>


                {/* Translation Feature Highlight */}
                <div className="relative w-full text-left">
                    <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-64 text-right pr-8 hidden lg:block">
                        {/* Decorative left text? Optional based on screenshot */}
                    </div>

                    <div className="bg-gradient-to-b from-[#1A1A1A] to-black border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row relative">

                        {/* Left Half (Input) */}
                        <div className="flex-1 p-8 border-r border-white/5 relative">
                            <div className="absolute top-4 right-4 flex gap-2">
                                <span className="text-xs text-zinc-500">System</span>
                            </div>
                            <div className="mt-8 text-3xl font-light text-zinc-300">
                                Interface Controls
                            </div>
                            {/* Cursor */}
                            <div className="w-0.5 h-8 bg-blue-500 animate-pulse mt-2"></div>
                        </div>

                        {/* Center Swap Icon */}
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-[#2A2A2A] rounded-full border border-white/10 flex items-center justify-center z-10">
                            <ArrowRight className="w-4 h-4 text-zinc-500" />
                        </div>

                        {/* Right Half (Output) */}
                        <div className="flex-1 p-8 bg-black/50">
                            <div className="absolute top-4 right-4 flex gap-2">
                                <span className="text-xs text-zinc-500">User</span>
                            </div>
                            <div className="mt-8 text-3xl font-light text-zinc-600">
                                Input & Output
                            </div>
                        </div>
                    </div>

                    {/* Floating Info Right */}
                    {/* <div className="lg:absolute lg:-right-64 lg:top-1/2 lg:-translate-y-1/2 w-64 pl-8 mt-8 lg:mt-0">
                        <h3 className="text-xl font-bold mb-2">Don't get lost in translation.</h3>
                        <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                            Quickly translate text on the fly, check pronunciation or dictate your own words.
                        </p>
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-blue-500/10 text-blue-400 text-xs font-medium border border-blue-500/20">
                            <Languages className="w-3 h-3" /> Translator
                        </span>
                    </div> */}

                </div>

            </section>




            {/* ----------------- EXTENSIBILITY SECTION ----------------- */}
            <section className=" px-6 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <p className="text-zinc-400 text-lg mb-2">Built to extend as your <span className="text-white font-medium">needs grow.</span></p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Atlas Card */}
                    <Link href="/products/atlas" className="group relative bg-[#000] border border-white/5 rounded-[2rem] p-8 overflow-hidden hover:border-white/10 transition-colors h-[400px] flex flex-col">
                        <style dangerouslySetInnerHTML={{
                            __html: `
                          @keyframes scanVertical {
                            0% { top: 0; opacity: 0; }
                            15% { opacity: 1; }
                            85% { opacity: 1; }
                            100% { top: 100%; opacity: 0; }
                          }
                        `}} />
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-blue-400">

                                    <img
                                        src="/apps/atlas.png"
                                        alt="Product Logo"
                                        className="w-12 h-12 rounded-xl mx-auto object-contain brightness-150"
                                    />


                                </div>
                                <span className="font-semibold text-lg">Atlas</span>
                            </div>
                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                                <ArrowRight className="w-4 h-4 text-white" />
                            </div>
                        </div>
                        <p className="text-zinc-400 mb-8">Pick any part of your screen, use custom commands, and get smart analysis instantly.</p>

                        {/* Abstract Visual: Screen Selection & columns */}
                        <div className="mt-auto relative h-40 w-full">
                            {/* "Screen" Background */}
                            <div className="absolute inset-0 bg-zinc-900/30 rounded-3xl border border-white/5 overflow-hidden">
                                <div className="p-4 space-y-2 opacity-20">
                                    <div className="h-2 bg-zinc-500 rounded w-3/4"></div>
                                    <div className="h-2 bg-zinc-500 rounded w-1/2"></div>
                                    <div className="h-2 bg-zinc-500 rounded w-full"></div>
                                    <div className="h-2 bg-zinc-500 rounded w-2/3"></div>
                                    <div className="h-2 bg-zinc-500 rounded w-5/6"></div>
                                </div>
                            </div>

                            {/* Selection Box */}
                            <div className="absolute top-4 left-4 w-32 h-24 border border-blue-500/50 border-dashed bg-blue-500/5 rounded-md z-10">
                                {/* Corner handles */}
                                <div className="absolute -top-1 -left-1 w-2 h-2 bg-blue-500"></div>
                                <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500"></div>
                                <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-500"></div>
                                <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-blue-500"></div>
                                {/* Scan Beam */}
                                <div className="absolute left-0 right-0 h-[4px] bg-blue-400 shadow-[0_0_12px_rgba(96,165,250,0.8)] animate-[scanVertical_3s_linear_infinite]"></div>
                            </div>

                            {/* Response Popover (3 Columns) */}
                            <div className="absolute top-8 left-28 w-48 bg-[#151515] border border-white/10 rounded-lg shadow-2xl p-3 z-20 flex gap-2 animate-[slideUpFade_1s_ease-out_forwards]">
                                {/* Column 1 */}
                                <div className="flex-1 space-y-1.5">
                                    <div className="h-1.5 bg-zinc-600 rounded w-full"></div>
                                    <div className="h-1.5 bg-zinc-700 rounded w-3/4"></div>
                                    <div className="h-1.5 bg-zinc-700 rounded w-full"></div>
                                </div>
                                {/* Column 2 */}
                                <div className="flex-1 space-y-1.5 border-l border-white/5 pl-2">
                                    <div className="h-1.5 bg-zinc-600 rounded w-5/6"></div>
                                    <div className="h-1.5 bg-zinc-700 rounded w-full"></div>
                                </div>
                                {/* Column 3 */}
                                <div className="flex-1 space-y-1.5 border-l border-white/5 pl-2">
                                    <div className="h-1.5 bg-zinc-600 rounded w-full"></div>
                                    <div className="h-1.5 bg-zinc-700 rounded w-2/3"></div>
                                    <div className="h-1.5 bg-zinc-700 rounded w-full"></div>
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* Ceres Assist Card */}
                    <Link href="/products/ceres-assist" className="group relative bg-[#000] border border-white/5 rounded-[2rem] p-8 overflow-hidden hover:border-white/10 transition-colors h-[400px] flex flex-col">
                        <style dangerouslySetInnerHTML={{
                            __html: `
                          @keyframes browserType {
                            0% { width: 0; }
                            50% { width: 80%; }
                            100% { width: 80%; }
                          }
                          @keyframes cursorFloat {
                            0% { transform: translate(0, 0); }
                            25% { transform: translate(120px, 40px); }
                            50% { transform: translate(120px, 40px) scale(0.9); }
                            75% { transform: translate(0, 0); }
                            100% { transform: translate(0, 0); }
                          }
                          @keyframes buttonPulse {
                             0%, 45% { transform: scale(1); opacity: 0.5; }
                             50% { transform: scale(0.95); opacity: 1; }
                             55%, 100% { transform: scale(1); opacity: 0.5; }
                          }
                        `}} />
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                                    <img
                                        src="/apps/ceres.png"
                                        alt="Product Logo"
                                        className="w-12 h-12 rounded-xl mx-auto object-contain brightness-150"
                                    />
                                </div>
                                <span className="font-semibold text-lg">Ceres Assist</span>
                            </div>
                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                                <ArrowRight className="w-4 h-4 text-white" />
                            </div>
                        </div>
                        <p className="text-zinc-400 mb-8">An autonomous browser agent that navigates the web to perform complex tasks for you.</p>

                        {/* Abstract Visual: Browser Agent UI */}
                        <div className="mt-auto relative h-48 w-full bg-zinc-900/40 rounded-t-xl border-t border-x border-white/5 overflow-hidden">
                            {/* Browser Header */}
                            <div className="h-8 bg-white/5 border-b border-white/5 flex items-center px-3 gap-2">
                                <div className="flex gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/20"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/20"></div>
                                </div>
                                {/* Address Bar */}
                                <div className="flex-1 ml-4 h-5 bg-black/40 rounded flex items-center px-2">
                                    <div className="h-2 bg-zinc-600 rounded-sm animate-[browserType_4s_steps(20)_infinite] w-0 overflow-hidden text-[0px]">Searching...</div>
                                </div>
                            </div>

                            {/* Browser Body */}
                            <div className="p-6 relative h-full">
                                {/* Mock Content */}
                                <div className="space-y-3">
                                    <div className="h-20 bg-white/5 rounded-lg w-full flex items-center justify-center border border-white/5">
                                        <div className="w-36 h-10 bg-white p-4 rounded-full text-black text-xs flex items-center justify-center animate-[buttonPulse_4s_infinite]">
                                            Confirm Booking
                                        </div>
                                    </div>
                                    <div className="h-2 bg-zinc-800 rounded w-2/3"></div>
                                    <div className="h-2 bg-zinc-800 rounded w-1/2"></div>
                                </div>

                                {/* Agent Cursor */}
                                <div className="absolute top-4 left-4 w-4 h-4 z-10 animate-[cursorFloat_4s_ease-in-out_infinite]">
                                    <svg viewBox="0 0 24 24" fill="currentColor" className="text-white drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]">
                                        <path d="M3.5 3.5L10 20L12.5 13.5L19 11L3.5 3.5Z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </Link>


                    {/* Lumiflage Card */}
                    <Link href="/products/lumiflage" className="group relative bg-[#000] border border-white/5 rounded-[2rem] p-8 overflow-hidden hover:border-white/10 transition-colors h-[400px] flex flex-col">
                        <style dangerouslySetInnerHTML={{
                            __html: `
                          @keyframes softGlow {
                            0%, 100% { opacity: 0.5; box-shadow: 0 0 20px 5px rgba(255, 200, 150, 0.1); transform: scale(1); }
                            50% { opacity: 1; box-shadow: 0 0 40px 10px rgba(255, 220, 180, 0.2); transform: scale(1.02); }
                          }
                          @keyframes faceReveal {
                            0%, 100% { filter: brightness(0.3); }
                            50% { filter: brightness(1.2); }
                          }
                        `}} />

                        <div className="flex items-center justify-between mb-4 relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white border border-white/10">
                                    <div className="border-7 border-white"></div>
                                </div>
                                <span className="font-semibold text-lg text-white">Lumiflage</span>
                            </div>
                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                                <ArrowRight className="w-4 h-4 text-white" />
                            </div>
                        </div>
                        <p className="text-zinc-400 mb-8 relative z-10">A soft screen light that keeps your face visible on video calls - even in the dark.</p>

                        {/* Lumiflage Visual - Dark Room Effect */}
                        <div className="mt-auto relative h-48 w-full flex items-center justify-center">
                            <div className="absolute inset-0 bg-black/50 z-0"></div>

                            {/* The Screen / Light Source */}
                            <div className="relative z-10 w-48 h-32 bg-black border-6 border-white rounded-3xl animate-[softGlow_4s_ease-in-out_infinite] flex items-center justify-center">
                                {/* Abstract "Face" getting lit */}
                                <div className="w-16 h-16 rounded-full bg-white border border-white/10 animate-[faceReveal_4s_ease-in-out_infinite] flex items-center justify-center relative overflow-hidden">
                                    <div className="absolute top-[20%] w-[60%] h-[60%] bg-zinc-600 rounded-full opacity-50"></div>
                                    <div className="absolute bottom-[-10%] w-[80%] h-[50%] bg-zinc-600 rounded-full opacity-50"></div>
                                </div>

                                {/* Screen Reflection overlay */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent rounded-lg pointer-events-none"></div>
                            </div>

                            {/* Ambient Light Spill on "Desk" */}
                            <div className="absolute bottom-0 w-3/4 h-12 bg-white/5 blur-2xl rounded-full mb-2 animate-[softGlow_4s_ease-in-out_infinite]"></div>
                        </div>
                    </Link>
                </div>
            </section >



            {/* ----------------- FEATURES BENTO GRID ----------------- */}
            < section className="py-24 px-6 max-w-7xl mx-auto" >
                <div className="text-center mb-16">
                    <h2 className="text-2xl md:text-3xl font-medium mb-3">And this is just the beginning.</h2>
                    <p className="text-zinc-400">We're actively preparing <span className="text-white font-bold">Studio 6.0</span> for release on Windows & Mac.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-[500px]">
                    {/* Studio 6.0 Card - Clean Grid Layout */}
                    <div className="col-span-1 md:col-span-1 bg-[#000] rounded-[2rem] p-6 border border-white/5 relative overflow-hidden group flex flex-col h-[500px]">
                        <div className="text-center relative z-10 mb-6">
                            <h1 className="text-[25px] font-semibold text-white">Studio 6.0</h1>
                            <p className="text-zinc-300 text-xs">The end-to-end workspace for modern creation.</p>
                        </div>

                        {/* Nested Bento Grid Container */}
                        <div className="flex-1 grid grid-cols-2 grid-rows-4 gap-3 mt-10 w-full">

                            {/* Large Item: Unified Workflow */}
                            <div className="col-span-2 row-span-1 bg-transparent border border-white/5 rounded-3xl p-4 flex items-center justify-between hover:border-white/10 transition-all group/item cursor-default overflow-hidden relative">
                                <div className="absolute inset-0 hover:bg-zinc-900/80 opacity-0 group-hover/item:opacity-100 transition-opacity"></div>
                                <div className="flex flex-col z-10">
                                    <span className="text-sm font-medium text-white mb-0.5">Unified Workflow</span>
                                    <span className="text-[10px] text-zinc-500">All tools, one core.</span>
                                </div>
                                <div className="flex -space-x-2">
                                    <div className="w-8 h-8 rounded-full bg-zinc-800 border-2 border-zinc-950 flex items-center justify-center text-gray-400 text-xs"><Video className="w-3 h-3" /></div>
                                    <div className="w-8 h-8 rounded-full bg-zinc-800 border-2 border-zinc-950 flex items-center justify-center text-gray-400 text-xs"><MessageSquare className="w-3 h-3" /></div>
                                    <div className="w-8 h-8 rounded-full bg-zinc-800 border-2 border-zinc-950 flex items-center justify-center text-gray-400 text-xs"><Zap className="w-3 h-3" /></div>
                                </div>
                            </div>

                            {/* Tall Left: Video Creation */}
                            <div className="col-span-1 row-span-2 bg-transparent border border-white/5 rounded-3xl p-4 flex flex-col justify-between hover:bg-zinc-900/80 transition-all group/item relative overflow-hidden cursor-default">
                                <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/10 blur-xl rounded-full -mr-4 -mt-4"></div>
                                <div className="flex justify-between items-start">
                                    <div className="p-2 bg-gray-500/10 rounded-lg text-red-500">
                                        <Video className="w-4 h-4" />
                                    </div>
                                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
                                </div>
                                <div className="space-y-1.5 mt-2">
                                    {/* Abstract Track Bars */}
                                    <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden"><div className="w-2/3 h-full bg-gray-300/20"></div></div>
                                    <div className="h-1.5 w-3/4 bg-zinc-800 rounded-full overflow-hidden"><div className="w-1/2 h-full bg-gray-300/20"></div></div>
                                    <div className="h-1.5 w-5/6 bg-zinc-800 rounded-full overflow-hidden"><div className="w-3/4 h-full bg-gray-300/20"></div></div>
                                </div>
                                <span className="text-sm font-medium text-zinc-300 group-hover/item:text-white mt-1">Video Creation</span>
                            </div>

                            {/* Small Right 1: Script Engine */}
                            <div className="col-span-1 row-span-1 bg-transparent border border-white/5 rounded-3xl p-4 flex flex-col justify-center items-start gap-2 hover:bg-zinc-900/80 transition-all group/item cursor-default hover:border-gray-500/20">
                                <div className="flex items-center gap-2 text-gray-400">
                                    <div className="p-1.5 bg-gray-500/10 rounded-md"><MessageSquare className="w-3 h-3" /></div>
                                    <span className="text-xs font-semibold uppercase tracking-wider opacity-70">Script</span>
                                </div>
                                <div className="w-full space-y-1 opacity-50">
                                    <div className="h-1 w-full bg-zinc-700 rounded-full"></div>
                                    <div className="h-1 w-2/3 bg-zinc-700 rounded-full"></div>
                                </div>
                            </div>

                            {/* Small Right 2: Creative Boards */}
                            <div className="col-span-1 row-span-1 bg-transparent border border-white/5 rounded-3xl p-4 flex flex-col justify-center items-start gap-2 hover:bg-zinc-900/80 transition-all group/item cursor-default hover:border-gray-500/20">
                                <div className="flex items-center gap-2 text-gray-400">
                                    <div className="p-1.5 bg-gray-500/10 rounded-md"><Scan className="w-3 h-3" /></div>
                                    <span className="text-xs font-semibold uppercase tracking-wider opacity-70">Boards</span>
                                </div>
                                <div className="grid grid-cols-2 gap-1 w-8 opacity-50">
                                    <div className="h-3 w-3 bg-zinc-700 rounded-sm"></div>
                                    <div className="h-3 w-3 bg-zinc-700 rounded-sm"></div>
                                    <div className="h-3 w-3 bg-zinc-700 rounded-sm"></div>
                                    <div className="h-3 w-3 bg-zinc-600 rounded-sm"></div>
                                </div>
                            </div>



                        </div>
                    </div>

                    {/* Middle Column (Stacked) */}
                    <div className="col-span-1 md:col-span-1 flex flex-col gap-6">

                        {/* CinemaOS Movie Editor Item */}
                        <div className="flex-1 bg-[#000] rounded-[2rem] p-6 border border-white/5 relative overflow-hidden group flex flex-col">
                            <style dangerouslySetInnerHTML={{
                                __html: `
                              @keyframes playheadScan {
                                0% { left: 0%; }
                                100% { left: 100%; }
                              }
                            `}} />

                            <div className="flex-1 flex flex-col gap-3 relative z-10">
                                {/* Video Preview Area */}
                                <div className="h-28 bg-zinc-900 rounded-3xl border border-white/5 relative overflow-hidden flex items-center justify-center group-hover:border-white/10 transition-colors">
                                    <div className="absolute inset-0 bg-transparent"></div>

                                </div>

                                {/* Timeline Tracks */}
                                <div className="bg-zinc-900/50 rounded-3xl border border-white/5 p-3 relative overflow-hidden flex flex-col gap-2 h-24">
                                    {/* Track 1 */}
                                    <div className="h-2 w-[80%] bg-gray-500/30 rounded-full"></div>
                                    {/* Track 2 */}
                                    <div className="h-2 w-[50%] bg-gray-500/30 rounded-full ml-10"></div>
                                    {/* Track 3 */}
                                    <div className="h-2 w-[60%] bg-gray-500/30 rounded-full ml-4"></div>
                                    {/* Track 4 */}
                                    <div className="h-2 w-[40%] bg-gray-500/30 rounded-full"></div>

                                    {/* Playhead */}
                                    <div className="absolute top-0 bottom-0 w-0.5 bg-gray-500 animate-[playheadScan_3s_linear_infinite] z-10 box-content border-x border-gray-500/20 left-0"></div>
                                </div>
                            </div>

                            <div className="mt-4 flex justify-between items-end relative z-10">
                                <div>
                                    <h3 className="font-medium text-lg text-white">CinemaOS</h3>
                                    <p className="text-xs text-zinc-500">Pro-grade non-linear editing.</p>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                                    <Video className="w-4 h-4 text-zinc-400" />
                                </div>
                            </div>
                        </div>

                        {/* PixelOS Photo Editor Item */}
                        <div className=" bg-[#000] rounded-[2rem] p-6 border border-white/5 relative overflow-hidden group flex flex-col justify-between hover:border-white/5 transition-colors">
                            <div className="mt-0 flex justify-between items-end relative z-10">
                                <div>
                                    <h3 className="font-medium text-lg text-white">PixelOS</h3>
                                    <p className="text-xs text-zinc-500">Intelligent photo editing.</p>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                                    <Image className="w-4 h-4 text-zinc-400" />
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Right Column (Flow & More) */}
                    <div className="col-span-1 md:col-span-1 flex flex-col gap-6">

                        {/* WriteOS+ Document Editor Item */}
                        <div className="flex-1 bg-[#000] rounded-[2rem] p-6 border border-white/5 relative overflow-hidden group flex flex-col hover:border-white/5 transition-colors">
                            {/* Editor Mockup */}
                            <div className="flex-1 bg-zinc-900/50 rounded-xl border border-white/5 flex flex-col overflow-hidden relative group-hover:border-white/10 transition-colors">
                                {/* Toolbar */}
                                <div className="h-10 border-b border-white/5 bg-white/5 flex items-center px-4 gap-3">
                                    <div className="w-3 h-3 rounded-full bg-red-500 border border-red-500/30"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500 border border-yellow-500/30"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500 border border-green-500/30"></div>
                                    <div className="w-px h-4 bg-white/10 mx-2"></div>
                                    <div className="flex gap-1.5 opacity-50">
                                        <div className="w-3 h-3 rounded-sm bg-zinc-400"></div>
                                        <div className="w-3 h-3 rounded-sm bg-zinc-600"></div>
                                        <div className="w-3 h-3 rounded-sm bg-zinc-600"></div>
                                        <div className="w-3 h-3 rounded-sm bg-zinc-600"></div>
                                    </div>
                                </div>
                                {/* Content */}
                                <div className="p-5 font-mono text-xs">
                                    <h3 className="text-sm font-bold text-white mb-3 tracking-wide">Stay in Flow</h3>
                                    <p className="text-zinc-400 leading-relaxed">
                                        The "flow state," also known simply as "flow," is a psychological concept describing a state of deep immersion.
                                        <span className="inline-block w-1.5 h-3 bg-blue-500 ml-0.5 animate-pulse align-middle"></span>
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4 flex justify-between items-end">
                                <div>
                                    <h3 className="font-medium text-lg text-white">WriteOS+</h3>
                                    <p className="text-xs text-zinc-500">Intelligent documents.</p>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                                    <FileText className="w-4 h-4 text-zinc-400" />
                                </div>
                            </div>
                        </div>

                        {/* And so much more... */}
                        <div className="h-32 bg-[#000] rounded-[2rem] p-6 border border-white/5 relative overflow-hidden flex items-center justify-center group cursor-pointer hover:border-white/5 transition-colors">
                            <div className="absolute inset-0 grid grid-cols-4 gap-2 opacity-20 transform scale-110">
                                {Array.from({ length: 16 }).map((_, i) => (
                                    <div key={i} className="rounded-lg border border-gray-500/30 bg-gray-500/40"></div>
                                ))}
                            </div>
                            <div className="relative z-10">
                                <span className="font-medium text-lg">And so much more...</span>
                            </div>
                        </div>

                    </div>
                </div>
            </section >



            {/* ----------------- GAME LAUNCHER SECTION ----------------- */}
            < section className="py-24 bg-black relative overflow-hidden" >
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Left Content */}
                    <div className="order-2 lg:order-1">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">
                            Play Free Games. Powered by the xCloud.
                        </h2>
                        <p className="text-xl text-zinc-400 mb-8 leading-relaxed">
                            Access a growing library of games hosted on the cloud, LoopSync has you covered.
                        </p>

                    </div>

                    {/* Right Content (Rage Platformer Showcase) */}
                    <div className="order-1 lg:order-2 relative flex justify-center lg:justify-end">
                        {/* Card Design */}
                        <div className="relative w-full max-w-md bg-[#000] rounded-3xl border border-white/10 overflow-hidden shadow-2xl group cursor-pointer hover:border-white/20 transition-all">
                            {/* Background Image / Blur */}
                            <div className="absolute inset-0">
                                <div className="absolute inset-0 bg-gradient-to-t from-[#000] via-[#000]/80 to-transparent z-10"></div>
                                <img src="/apps/daimond.png" alt="Rage Platformer" className="w-full h-full object-cover opacity-50 group-hover:scale-110 transition-transform duration-700" />
                            </div>

                            <div className="relative z-20 p-8 flex flex-col h-[400px] justify-between">
                                <div className="flex justify-between items-start">
                                    <div className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/5 text-xs font-medium text-white">
                                        Featured Game
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center gap-4 mb-4">
                                        <img src="/apps/daimond.png" alt="Logo" className="w-16 h-16 rounded-2xl shadow-xl ring-1 ring-white/10" />
                                        <div>
                                            <h3 className="text-2xl font-bold text-white leading-none">Rage Platformer</h3>
                                            <div className="flex items-center gap-2 mt-2">
                                                <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">v1.0.0</span>
                                                <span className="text-xs text-zinc-300">Unreal Engine 5</span>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-sm text-zinc-300 leading-relaxed mb-6 line-clamp-3">
                                        A visually refined 2D platformer developed using Unreal Engine 5, combining tight controls, engaging level design, and fluid character movement.
                                    </p>

                                    <div className="flex items-center gap-4">
                                        <Link href="/home" className="flex-1 bg-white text-black font-semibold py-3 rounded-xl hover:bg-zinc-200 transition-colors text-center">
                                            Install Game
                                        </Link>
                                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-white/10 transition-colors">
                                            <img src="/resources/windows.svg" className="w-5 h-5 invert opacity-70" alt="Windows" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section >










            {/* ----------------- RAYCAST NOTES SECTION ----------------- */}
            < section className="py-32 px-6 text-center bg-black relative" >
                <div className="max-w-4xl mx-auto flex flex-col items-center">

                    {/* Label */}
                    <div className="mb-6">
                        <span className="text-sm font-bold tracking-[0.2em] text-zinc-500 uppercase">
                            LoopSync Notes
                        </span>
                    </div>

                    {/* Headline */}
                    <h2 className="text-5xl md:text-4xl font-bold tracking-tight text-white mb-6 leading-tight">
                        A space for<br className="hidden md:block" />
                        uninterrupted thinking.
                    </h2>

                    {/* Subheadline */}
                    <p className="text-[14px] text-zinc-400 max-w-2xl mb-12 leading-relaxed">
                        A place where thoughts don't get left behind, no matter where you are.<br className="hidden md:block" />
                        Collect ideas while out touching grass.
                    </p>

                    {/* Link/Button */}
                    <Link href="/notes" className="group inline-flex items-center gap-2 text-zinc-300 hover:text-white font-medium transition-colors text-lg">
                        <span>Explore LoopSync Notes</span>
                        <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                            <ArrowRight className="w-3 h-3 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                        </div>
                    </Link>

                </div>
            </section >

            {/* Divider */}
            < div className="border-t border-white/5 mb-20" ></div >

            {/* Center Content */}
            < div className="text-center text-white text-sm space-y-1 mb-20" >
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
            </div >

            {/* Copyright */}
            < div className="fixed bottom-0 left-0 right-0 z-20 pb-6 px-6" >
                <div className="flex items-center justify-center relative">

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
            </div >
        </div >
    );
}
