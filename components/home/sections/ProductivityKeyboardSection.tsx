"use client";

import { Search, MousePointer2, Zap } from "lucide-react";
import React from "react";
import Link from "next/link";

// Helper for standard square keys
const Key = ({ children, className = "", opacity = 1 }: { children: React.ReactNode, className?: string, opacity?: number }) => (
    <div
        className={`
            relative group
            aspect-square rounded-2xl
            bg-gradient-to-b from-[#000] to-[#000]
            active:translate-y-[3px]
            transition-all duration-75 ease-out
            flex flex-col justify-center items-center 
            text-zinc-500 font-medium text-sm
            select-none
            before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-b before:from-white/[0.06] before:to-transparent before:pointer-events-none
            ${className}
        `}
        style={{ opacity }}
    >
        <span className="relative z-10 group-hover:text-white transition-colors duration-300">{children}</span>
    </div>
);

// Helper for wider feature keys
const FeatureKey = ({
    icon: Icon,
    title,
    subtitle,
    className = ""
}: {
    icon: any,
    title: string,
    subtitle: string,
    className?: string
}) => (
    <div className={`
        relative group col-span-2 
        rounded-2xl 
        bg-zinc-600/10
        active:translate-y-[4px]
        transition-all duration-100 ease-out
        p-5 flex flex-col justify-between
        select-none cursor-pointer
        before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-b before:from-white/[0.06] before:to-transparent before:pointer-events-none
        ${className}
    `}>
        <div className="w-8 h-8 rounded-full bg-[#252525] shadow-inner flex items-center justify-center text-white group-hover:text-white transition-colors relative z-10">
            <Icon className="w-4 h-4" />
        </div>
        <div className="space-y-1 relative z-10">
            <span className="block text-white font-semibold text-sm drop-shadow-md">{title}</span>
            <span className="block text-zinc-500 text-[10px] tracking-wide group-hover:text-white transition-colors uppercase">{subtitle}</span>
        </div>
    </div>
);

export default function ProductivityKeyboardSection() {
    return (
        <section className="w-full bg-black py-12 sm:py-16 md:py-24 px-4 sm:px-6 md:px-20 relative overflow-hidden">
            {/* Realistic ambient light glow behind keyboard */}
            <div className="absolute right-[5%] top-1/2 -translate-y-1/2 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-white/[0.03] blur-[80px] sm:blur-[150px] rounded-full pointer-events-none"></div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-20 items-center relative z-10">

                {/* Left Content */}
                <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-6 lg:gap-8 z-10">
                    <h2 className="text-2xl sm:text-4xl md:text-4xl font-semibold text-white tracking-tight leading-tight">
                        It's not about more options.<br />
                        <span className="text-zinc-600">It's about less searching.</span>
                    </h2>

                    <button className="bg-white text-black min-h-12 px-8 rounded-full font-semibold flex items-center gap-2.5 hover:bg-zinc-200 transition-colors shadow-[0_0_40px_rgba(255,255,255,0.15)] active:scale-95 duration-200 text-sm sm:text-base"

                        onClick={() => window.location.href = "https://loopsync.cloud/open-account?login=false"}>

                        <span>Open Account</span>
                    </button>
                </div>

                {/* Right Content - Keyboard Grid Visualization */}
                <div
                    className="relative w-full scale-[0.65] xs:scale-[0.75] sm:scale-[0.85] lg:scale-100 origin-top bg-zinc-900/0 sm:origin-center lg:origin-right -mt-8 sm:mt-0"
                    style={{
                        maskImage: 'radial-gradient(circle at center, black 50%, transparent 100%)',
                        WebkitMaskImage: 'radial-gradient(circle at center, black 50%, transparent 100%)'
                    }}
                >
                    <div className="grid grid-cols-6 gap-2 sm:gap-2.5 p-2 sm:p-4 mx-auto max-w-fit lg:max-w-none">

                        {/* Row 1 */}
                        <Key className="col-span-1 opacity-20">0</Key>
                        <Key className="col-span-1 opacity-40">1</Key>
                        <Key className="col-span-1 opacity-60">2</Key>
                        <Key className="col-span-1 opacity-80">3</Key>
                        <Key className="col-span-1">4</Key>
                        <div className="col-span-1 aspect-square rounded-xl bg-transparent"></div>


                        {/* Row 2: Discover + cmd + Choose */}
                        <FeatureKey icon={Search} title="Discover." subtitle="Find apps instantly." />
                        <Key className="col-span-1">@</Key>
                        <FeatureKey icon={MousePointer2} title="Choose." subtitle="Select with ease." />
                        <div className="col-span-1 aspect-square rounded-xl bg-transparent"></div>


                        {/* Row 3: cmd + Use + filler */}
                        <div className="col-span-1 aspect-square rounded-xl bg-transparent"></div>
                        <Key className="col-span-1 border-white/20 text-zinc-300">⌘</Key>
                        <FeatureKey
                            icon={Zap}
                            title="Use."
                            subtitle="Launch immediately."
                        />
                        <Key className="col-span-1 opacity-60">S</Key>
                        <Key className="col-span-1 opacity-40">D</Key>


                        {/* Row 4 */}
                        <div className="col-span-1 aspect-square bg-transparent"></div>
                        <div className="col-span-1 aspect-square bg-transparent"></div>
                        <Key className="col-span-1" opacity={0.3}>Z</Key>
                        <Key className="col-span-1" opacity={0.3}>X</Key>
                        <Key className="col-span-1" opacity={0.3}>C</Key>
                        <div className="col-span-1 aspect-square bg-transparent"></div>

                    </div>
                </div>

            </div>
        </section>
    );
}
