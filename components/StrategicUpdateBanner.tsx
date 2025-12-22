"use client"

import { ArrowRight, X, ArrowUpRight } from "lucide-react"
import { Dithering } from "@paper-design/shaders-react"

import Link from "next/link"

interface StrategicUpdateBannerProps {
    isVisible: boolean
    onClose?: () => void
}

export default function StrategicUpdateBanner({ isVisible, onClose }: StrategicUpdateBannerProps) {
    return (
        <div
            className={`fixed left-0 right-0 top-0 z-[10000] flex w-full items-center justify-center overflow-hidden py-4 transition-transform duration-1000 ease-out ${isVisible ? "translate-y-0" : "-translate-y-full"
                }`}
        >
            <div className="absolute inset-0 z-0 bg-transparent ">
                <Dithering
                    style={{ height: "100%", width: "100%" }}
                    colorBack="#000000"
                    colorFront="#911414"
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

            <div className="absolute inset-0 z-[1] backdrop-blur-[60px] pointer-events-none" />

            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 opacity-70 hover:opacity-100 transition-opacity text-white"
            >
                <X className="w-4 h-4" />
            </button>

            <div className="relative z-10 flex w-full items-center justify-center gap-6 px-6">
                <p className="text-sm font-semibold text-white">
                    <span className="font-semibold text-white"></span> We're opening acquisition conversations with aligned partners to scale globally, at a valuation of <span className="font-bold text-[14px] text-white">~$1.65M - $2.79M.</span>
                </p>
                <Link
                    href="/acquire"
                    className="group flex items-center gap-1 text-[14px] font-semibold text-white transition-all hover:opacity-80"
                >
                    <span className="underline underline-offset-4 pb-1">Acquire</span>
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
            </div>
        </div>
    )
}
