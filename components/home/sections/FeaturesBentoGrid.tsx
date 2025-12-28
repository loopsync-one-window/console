"use client";

import { Video, MessageSquare, Zap, Scan, Image, FileText } from "lucide-react";

export default function FeaturesBentoGrid() {
    return (
        <section className="py-16 md:py-24 mt-16 px-4 sm:px-6 max-w-7xl mx-auto w-full">
            <div className="text-center mb-12 md:mb-16">
                <h2 className="text-2xl sm:text-3xl font-medium mb-3">And this is just the beginning.</h2>
                <p className="text-zinc-400 text-sm sm:text-base">We're actively preparing <span className="text-white font-bold">Studio 6.0</span> for release on Windows & Mac.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:min-h-[500px]">
                {/* Studio 6.0 Card - Clean Grid Layout */}
                <div className="col-span-1 md:col-span-1 bg-[#000] rounded-[2rem] p-6 border border-white/5 relative overflow-hidden group flex flex-col h-auto md:h-full min-h-[500px] md:min-h-0">
                    <div className="text-center relative z-10 mb-6">
                        <h1 className="text-2xl font-semibold text-white">Studio 6.0</h1>
                        <p className="text-zinc-300 text-xs">The end-to-end workspace for modern creation.</p>
                    </div>

                    {/* Nested Bento Grid Container */}
                    <div className="flex-1 flex flex-col gap-3 w-full md:grid md:grid-cols-2 md:grid-rows-4">

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
                        <div className="col-span-1 row-span-2 bg-transparent border border-white/5 rounded-3xl p-4 flex flex-col justify-between gap-4 hover:bg-zinc-900/80 transition-all group/item relative overflow-hidden cursor-default min-h-[140px] md:min-h-0">
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
                        <div className="col-span-1 row-span-1 bg-transparent border border-white/5 rounded-3xl p-4 flex flex-col justify-center items-start gap-2 hover:bg-zinc-900/80 transition-all group/item cursor-default hover:border-gray-500/20 min-h-[80px]">
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
                        <div className="col-span-1 row-span-1 bg-transparent border border-white/5 rounded-3xl p-4 flex flex-col justify-center items-start gap-2 hover:bg-zinc-900/80 transition-all group/item cursor-default hover:border-gray-500/20 min-h-[80px]">
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
                    <div className="flex-1 bg-[#000] rounded-[2rem] p-6 border border-white/5 relative overflow-hidden group flex flex-col min-h-[250px]">
                        <style dangerouslySetInnerHTML={{
                            __html: `
                          @keyframes playheadScan {
                            0% { left: 0%; }
                            100% { left: 100%; }
                          }
                        `}} />

                        <div className="flex-1 flex flex-col gap-3 relative z-10 w-full text-left">
                            {/* Video Preview Area */}
                            <div className="h-28 bg-zinc-900 rounded-3xl border border-white/5 relative overflow-hidden flex items-center justify-center group-hover:border-white/10 transition-colors w-full">
                                <div className="absolute inset-0 bg-transparent"></div>

                            </div>

                            {/* Timeline Tracks */}
                            <div className="bg-zinc-900/50 rounded-3xl border border-white/5 p-3 relative overflow-hidden flex flex-col gap-2 h-24 w-full">
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
                    <div className=" bg-[#000] rounded-[2rem] p-6 border border-white/5 relative overflow-hidden group flex flex-col justify-between hover:border-white/5 transition-colors min-h-[120px]">
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
                    <div className="flex-1 bg-[#000] rounded-[2rem] p-6 border border-white/5 relative overflow-hidden group flex flex-col hover:border-white/5 transition-colors min-h-[250px]">
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
    );
}
