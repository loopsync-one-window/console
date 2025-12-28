"use client";

import React, { useEffect, useState } from "react";
import { ArrowRight, Zap, Shield, Map } from "lucide-react";

// Isometric Maze Component
const IsometricMaze = () => {
    // Simple 8x8 grid map: 1 = wall, 0 = path
    // Using a hardcoded layout for a nice visual structure
    const mazeMap = [
        [1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 1, 1],
        [1, 1, 1, 1, 0, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 1, 0, 1],
        [1, 0, 1, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 1, 1, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1],
    ];

    // Path coordinates for animation sequence [row, col]
    const pathRoute = [
        [1, 1], [1, 2], [1, 3], [1, 4], [1, 5], // first corridor
        [2, 4], [3, 4], [3, 3], [3, 2], [3, 1], // loop back
        [4, 1], [5, 1], [6, 1], [6, 2], [6, 3], // snake down
        [5, 3], [4, 3], [5, 3] // hesitation/movement
    ];

    // We'll augment this with a more complex visual route manually or just lighting up cells

    return (
        <div className="relative w-full aspect-square md:aspect-[4/3] flex items-center justify-center perspective-1200 overflow-visible z-20">


            <div
                className="relative transform-style-3d scale-[0.7] sm:scale-[0.85] md:scale-100 duration-700 ease-out"
                style={{
                    transform: "perspective(1200px) rotateX(40deg) rotateY(0deg) rotateZ(0deg)",
                }}
            >

                <div className="grid grid-cols-8 gap-3 p-6 transform-style-3d">
                    {mazeMap.map((row, rowIndex) => (
                        row.map((cell, colIndex) => {
                            // Determine if this cell is part of a "highlighted" path
                            const isPath = cell === 0;
                            // Generate a unique delay for "breathing" animation if it's a wall
                            const delay = (rowIndex + colIndex) * 50;

                            return (
                                <MazeBlock
                                    key={`${rowIndex}-${colIndex}`}
                                    isWall={cell === 1}
                                    delay={delay}
                                    rowIndex={rowIndex}
                                    colIndex={colIndex}
                                />
                            );
                        })
                    ))}

                    {/* Render specific glowing 'player' or path trace */}
                    <PathTracer />
                </div>
            </div>
        </div>
    );
};

const MazeBlock = ({ isWall, delay, rowIndex, colIndex }: { isWall: boolean, delay: number, rowIndex: number, colIndex: number }) => {
    return (
        <div
            className={`
                w-8 h-8 md:w-10 md:h-10
                relative transition-all duration-500 transform-style-3d
            `}
        >
            {isWall ? (
                // Wall Block (3D Box) - Monochromatic
                <div className="w-full h-full relative transform-style-3d group">

                    {/* Top Face (Visible Main) */}
                    <div
                        className="absolute inset-0 bg-[#0a0a0a] border border-white/10 rounded-[2px]"
                        style={{ transform: "translateZ(24px)" }}
                    >
                    </div>

                    {/* Front Face */}
                    <div
                        className="absolute bottom-0 left-0 w-full h-[24px] bg-black border-x border-b border-white/10 origin-bottom rounded-b-[2px]"
                        style={{ transform: "rotateX(-90deg) translateY(100%)" }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black" />
                    </div>

                    {/* Right Face */}
                    <div
                        className="absolute top-0 right-0 h-full w-[24px] bg-[#050505] border-r border-b border-white/5 origin-right"
                        style={{ transform: "rotateY(90deg) translateX(100%)" }}
                    >
                    </div>
                </div>
            ) : (
                // Floor Block (Path) - Dark Grey
                <div
                    className="w-full h-full rounded-[4px] bg-[#111] border border-white/[0.05] shadow-inner"
                    style={{ transform: "translateZ(0px)" }}
                >
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-zinc-800 rounded-full" />
                </div>
            )}
        </div>
    );
};

const PathTracer = () => {
    // CSS-only animated dot moving through the grid?
    // Implementing a full coordinate-mapped movement is complex in pure CSS class composition without inline styles for every step.
    // Let's visual a "Ghost" moving through a preset path using keyframes defined globally or an absolute glowing orb moving around.

    // For simplicity and robustness, we will position a glowing entity that moves between specific coordinates.
    // We assume 8x8 grid, approx 48px + 4px gap per cell.

    // Adjusted sizes for the new grid layout
    return (
        <div
            className="absolute top-0 left-0 padding-box ml-[24px] mt-[24px] md:ml-[24px] md:mt-[24px] z-50 pointer-events-none"
            style={{
                // Offset to align with the first coordinate (assuming approximate sizing)
                // This will need visual tweaking based on gap/size.
                // Grid gap=3 (12px), Block=10 (40px) -> Total cell = 52px approx
            }}>
            <div className="w-10 h-10 relative animate-maze-traverse transform-style-3d">
                {/* Floating Orb - White */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)] z-20"
                    style={{ transform: "translateZ(40px)" }} />
                {/* Floor Reflection - Faint White */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-white/10 blur-[8px] rounded-full"
                    style={{ transform: "translateZ(2px)" }} />
            </div>
        </div>
    );
}

export default function MazeSection() {
    return (
        <section className="w-full bg-black py-16 md:py-24 px-4 sm:px-6 md:px-20 border-t border-white/5 relative overflow-hidden">
            {/* Background noise texture */}
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none"></div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

                {/* Left: 3D Maze Visualization */}
                <div className="order-2 lg:order-1 w-full flex justify-center lg:justify-start">
                    <IsometricMaze />
                </div>

                {/* Right: Content */}
                <div className="order-1 lg:order-2 flex flex-col items-start gap-6 lg:gap-8 z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-zinc-300 mb-2">
                        <Map className="w-3 h-3" />
                        <span>Smart Routing</span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl lg:text-3xl font-semibold text-white tracking-tight leading-[1.1]">
                        Finds the path,<br />
                        <span className="text-zinc-600">so you don't have to.</span>
                    </h2>

                    <p className="text-base text-zinc-400 max-w-lg leading-relaxed">
                        Complex workflows often feel like a maze. Our intelligent routing engine analyzes thousands of possibilities in real-time to find the most efficient execution path for your tasks.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full mt-4">
                        <div className="flex flex-col gap-3 group translate-y-0 hover:-translate-y-1 transition-transform duration-300">
                            <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-white group-hover:bg-zinc-800 transition-colors">
                                <Zap className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-white font-medium mb-1">Instant Optimization</h4>
                                <p className="text-sm text-zinc-500">Reduces latency by pre-calculating optimal nodes.</p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 group translate-y-0 hover:-translate-y-1 transition-transform duration-300">
                            <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-white group-hover:bg-zinc-800 transition-colors">
                                <Shield className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-white font-medium mb-1">Secure Tunnels</h4>
                                <p className="text-sm text-zinc-500">Isolated execution paths for sensitive data operations.</p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button className="text-white font-medium flex items-center gap-2 group text-sm hover:text-zinc-300 transition-colors">
                            Explore Routing Logic <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>

            </div>

            {/* Add custom keyframes for the maze runner to global css ideally, but we can inject a style tag here for self-containment if needed, or rely on simple transitions. 
                 Let's inject a style tag for the specific maze traverse animation.
             */}
            <style jsx global>{`
                @keyframes maze-traverse {
                    0% { transform: translate(68px, 68px); }   /* R1, C1 */
                    10% { transform: translate(120px, 68px); } /* R1, C2 */
                    20% { transform: translate(172px, 68px); } /* R1, C3 */
                    30% { transform: translate(224px, 68px); } /* R1, C4 */
                    40% { transform: translate(224px, 120px); } /* R2, C4 */
                    50% { transform: translate(172px, 120px); } /* R2, C3 */
                    60% { transform: translate(172px, 172px); } /* R3, C3 */
                    70% { transform: translate(120px, 172px); } /* R3, C2 */
                    80% { transform: translate(68px, 172px); }  /* R3, C1 */
                    90% { transform: translate(68px, 224px); }  /* R4, C1 */
                    100% { transform: translate(68px, 68px); }  /* Loop */
                }
                .animate-maze-traverse {
                    animation: maze-traverse 8s infinite linear;
                }
             `}</style>
        </section>
    );
}
