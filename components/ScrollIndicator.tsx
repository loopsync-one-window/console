"use client"

import { Mouse } from "lucide-react"

export default function ScrollIndicator() {
    return (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce cursor-pointer opacity-100 hover:opacity-100 transition-opacity">
            <span className="text-xs text-white font-medium tracking-widest uppercase">More to See</span>
            <Mouse className="w-5 h-5 text-white" />
        </div>
    )
}
