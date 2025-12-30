import { X, Star, User } from "lucide-react";
import { AppMock, getStoreApps } from "@/lib/store-api";
import Link from "next/link";
import { useState, useEffect } from "react";

export function PublisherProfileOverlay({
    isOpen,
    onClose,
    publisher
}: {
    isOpen: boolean;
    onClose: () => void;
    publisher?: AppMock['publisher'];
}) {
    const [fetchedApps, setFetchedApps] = useState<AppMock[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && publisher?.id) {
            setLoading(true);
            // Fetch all apps by this publisher (foolproof)
            getStoreApps({ publisherId: publisher.id, limit: 100 })
                .then(data => {
                    setFetchedApps(data.items);
                })
                .catch(err => console.error("Failed to fetch publisher apps", err))
                .finally(() => setLoading(false));
        }
    }, [isOpen, publisher?.id]);

    // If no publisher data, return null
    if (!publisher) return null;

    // Use fetched apps if available, otherwise fallback to empty
    const displayApps = fetchedApps;

    // Pick a featured app (prioritize one with a banner)
    const featuredApp = displayApps.find(a => a.media?.featureBanner) || displayApps[0];
    const otherApps = featuredApp ? displayApps.filter(a => a.id !== featuredApp.id) : displayApps;

    return (
        <div
            className={`fixed inset-0 z-[100] bg-black/20 backdrop-blur-3xl transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                } overflow-hidden`}
        >
            {/* Close Button (fixed) */}
            <button
                onClick={onClose}
                className="fixed top-6 right-6 z-50 rounded-full p-2 text-white/80 hover:text-white transition bg-white/5 hover:bg-white/10 active:scale-95"
            >
                <X className="w-6 h-6" />
            </button>

            {/* Scrollable Content */}
            <div className="absolute inset-0 overflow-y-auto overscroll-contain scroll-smooth-ios no-scrollbar">
                <div className="max-w-5xl mx-auto px-6 pt-28 pb-32 space-y-24">

                    {/* HEADER */}
                    <header className="space-y-8">
                        <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-8">
                            {/* Profile Picture */}
                            <div className="w-24 h-24 rounded-full bg-zinc-800 border-2 border-white/10 overflow-hidden shadow-2xl relative shrink-0">
                                {publisher.avatar ? (
                                    <img
                                        src={publisher.avatar}
                                        alt={publisher.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-zinc-500">
                                        <User className="w-10 h-10" />
                                    </div>
                                )}
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                                        {publisher.name}
                                    </h1>
                                    {publisher.verified && (
                                        <div className="relative group cursor-help pt-2">
                                            <img
                                                src="/verified/badge.svg"
                                                alt="Verified"
                                                className="w-6 h-6"
                                            />
                                            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-2 py-1 bg-white text-black text-xs font-bold rounded shadow-lg opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap">
                                                Verified Publisher
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {publisher.bio && (
                                    <p className="text-lg text-white/80 max-w-2xl leading-relaxed">
                                        {publisher.bio}
                                    </p>
                                )}
                            </div>
                        </div>
                    </header>

                    {/* FEATURED APP */}
                    {featuredApp && (
                        <section className="space-y-6">
                            <h2 className="text-xl font-semibold text-white">
                                Featured App
                            </h2>

                            <Link href={`/store/${featuredApp.id}/${featuredApp.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} onClick={onClose}>
                                <div className="rounded-[2.5rem] overflow-hidden border border-white/10 bg-transparent group relative shadow-2xl">
                                    <div className="aspect-[21/9] w-full relative overflow-hidden">
                                        <img
                                            src={featuredApp.media?.featureBanner || "/banner/banner.png"}
                                            alt="Featured App"
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                    </div>

                                    <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                                        {/* Glass Card for Details */}
                                        <div className="bg-black/20 backdrop-blur-xl border border-white/5 rounded-[2rem] p-6 md:p-8 flex items-end justify-between gap-6 shadow-xl">
                                            <div className="flex gap-6 items-center">
                                                <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-zinc-800 border border-white/5 overflow-hidden shrink-0 shadow-lg">
                                                    {featuredApp.icon ? (
                                                        <img src={typeof featuredApp.icon === 'string' ? featuredApp.icon : (featuredApp.icon as any)?.['512'] || ''} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-zinc-500 font-bold text-2xl">{featuredApp.name[0]}</div>
                                                    )}
                                                </div>
                                                <div className="space-y-2">
                                                    <span className="inline-block px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold text-white border border-white/5 uppercase tracking-wide">
                                                        {featuredApp.category}
                                                    </span>
                                                    <h3 className="text-2xl md:text-4xl font-black text-white tracking-tight drop-shadow-lg">
                                                        {featuredApp.name}
                                                    </h3>
                                                    <p className="hidden md:block text-zinc-300 max-w-lg text-sm md:text-base font-medium line-clamp-1 opacity-90">
                                                        {featuredApp.shortDescription}
                                                    </p>
                                                </div>
                                            </div>

                                            <button className="hidden md:block rounded-full bg-white text-black px-8 py-3.5 text-sm font-bold shadow-xl hover:bg-zinc-200 transition-transform active:scale-95 shrink-0">
                                                View App
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </section>
                    )}

                    {/* APPS LIST (Show ALL apps including featured) */}
                    {displayApps.length > 0 && (
                        <section className="space-y-10">
                            <div className="flex items-baseline justify-between">
                                <h2 className="text-xl font-semibold text-white">
                                    Apps by {publisher.name.split(" ")[0]}
                                </h2>
                                <span className="text-sm text-white font-medium">
                                    {displayApps.length} apps
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-x-8 gap-y-12">
                                {displayApps.map((app) => {
                                    const iconSrc = typeof app.icon === 'string' ? app.icon : (app.icon as any)?.['512'] || '';
                                    const slug = app.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                                    return (
                                        <Link
                                            key={app.id}
                                            href={`/store/${app.id}/${slug}`}
                                            onClick={onClose}
                                            className="group flex items-center gap-6 p-4 rounded-3xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5"
                                        >
                                            <div className="w-20 h-20 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center text-2xl overflow-hidden shrink-0 shadow-lg">
                                                {iconSrc ? (
                                                    <img src={iconSrc} alt={app.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                                ) : (
                                                    <div className="text-zinc-700 font-bold text-xl">{app.name[0]}</div>
                                                )}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-lg font-bold text-white truncate group-hover:text-white transition-colors">
                                                    {app.name}
                                                </h3>
                                                <p className="text-sm text-white uppercase truncate mb-1.5">
                                                    {app.category}
                                                </p>
                                                <div className="flex items-center gap-1.5">
                                                    <div className="flex text-amber-400">
                                                        <Star className="w-3.5 h-3.5 fill-current" />
                                                    </div>
                                                    <span className="text-xs font-bold text-white">
                                                        {app.stats.rating.toFixed(1)}
                                                    </span>
                                                </div>
                                            </div>

                                            <button className="rounded-full bg-white/10 px-6 py-2.5 text-sm font-bold text-white group-hover:bg-white group-hover:text-black transition-all">
                                                Get
                                            </button>
                                        </Link>
                                    )
                                })}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
}
