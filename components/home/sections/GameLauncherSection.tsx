"use client";

import Link from "next/link";

export default function GameLauncherSection() {
    return (
        <section className="py-24 bg-transparent relative overflow-hidden w-full">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                {/* Left Content */}
                <div className="order-2 lg:order-1">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 font-geom">
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
    );
}
