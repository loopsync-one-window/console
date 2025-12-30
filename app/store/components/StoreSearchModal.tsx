"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, Loader2, PackageOpen } from "lucide-react";
import { AppMock, getStoreApps } from "@/lib/store-api";
import { AppListItem } from "./AppListItem";

export function StoreSearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<AppMock[]>([]);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Focus input on open
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 50);
        } else {
            setQuery("");
            setResults([]);
        }
    }, [isOpen]);

    // Debounced Search
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (!query.trim()) {
                setResults([]);
                return;
            }

            setLoading(true);
            try {
                // Assuming getStoreApps accepts a generic query object that is stringified
                const data = await getStoreApps({ search: query });
                setResults(data.items);
            } catch (error) {
                console.error("Search failed:", error);
            } finally {
                setLoading(false);
            }
        }, 400);

        return () => clearTimeout(timer);
    }, [query]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300 animate-in fade-in"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div
                className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-top-4 duration-300 text-left"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Search Header */}
                <div className="flex items-center gap-3 px-6 py-5 border-b border-white/5 bg-white/[0.02]">
                    <Search className="w-5 h-5 text-zinc-500" />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search for apps, categories, games..."
                        className="flex-1 bg-transparent text-lg text-white placeholder-zinc-500 focus:outline-none placeholder:font-light"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Escape" && onClose()}
                    />
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-full hover:bg-white/10 text-zinc-500 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Results Area */}
                <div className="max-h-[60vh] overflow-y-auto overflow-x-hidden min-h-[300px]">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-48 gap-3 text-zinc-500">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                            <p className="text-sm">Searching the store...</p>
                        </div>
                    ) : results.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4 p-4">
                            {results.map((app) => (
                                <div key={app.id} onClick={onClose}>
                                    <AppListItem
                                        id={app.id}
                                        icon={app.icon}
                                        title={app.name}
                                        subtitle={app.shortDescription || "No description"}
                                        category={app.category || "General"}
                                        color={app.branding?.activeColor}
                                    />
                                </div>
                            ))}
                        </div>
                    ) : query ? (
                        <div className="flex flex-col items-center justify-center h-48 gap-3 text-zinc-500">
                            <PackageOpen className="w-10 h-10 text-zinc-700" />
                            <p className="text-sm">No apps found for "{query}"</p>
                        </div>
                    ) : (
                        <div className="p-8 text-center">
                            <p className="text-zinc-600 text-sm mb-6">Try searching for...</p>
                            <div className="flex flex-wrap justify-center gap-2">
                                {["Productivity", "Games", "Social", "Tools"].map(s => (
                                    <button
                                        key={s}
                                        onClick={() => setQuery(s)}
                                        className="px-4 py-2 rounded-full bg-white/5 border border-white/5 text-sm text-zinc-400 hover:text-white hover:border-white/20 transition-all"
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Hint */}
                <div className="px-6 py-3 bg-white/[0.02] border-t border-white/5 text-right">
                    <span className="text-[10px] text-zinc-600 font-medium">ESC to close</span>
                </div>
            </div>
        </div>
    );
}
