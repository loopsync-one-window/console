import { X, Star } from "lucide-react";

export function PublisherProfileOverlay({
    isOpen,
    onClose,
    publisherName = "LoopSync Entertainment",
    apps = [],
    verified = true
}: {
    isOpen: boolean;
    onClose: () => void;
    publisherName?: string;
    apps?: any[];
    verified?: boolean;
}) {
    return (
        <div
            className={`fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                } overflow-hidden`}
        >
            {/* Close Button (fixed) */}
            <button
                onClick={onClose}
                className="fixed top-6 right-6 z-50 rounded-full p-2 text-white/80 hover:text-white transition"
            >
                <X className="w-5 h-5" />
            </button>

            {/* Scrollable Content */}
            <div className="absolute inset-0 overflow-y-auto overscroll-contain scroll-smooth-ios no-scrollbar">
                <div className="max-w-5xl mx-auto px-6 pt-28 pb-32 space-y-24">

                    {/* HEADER */}
                    <header className="space-y-6">
                        <div className="flex items-center gap-3">
                            <h1 className="text-4xl md:text-5xl font-semibold text-white tracking-tight">
                                {publisherName}
                            </h1>
                            {verified && (
                                <img
                                    src="/verified/badge.svg"
                                    alt="Verified"
                                    className="w-5 h-5 opacity-100"
                                />
                            )}
                        </div>

                        <p className="text-lg text-zinc-400 max-w-2xl leading-relaxed">
                            Building thoughtfully designed cloud-first products with a focus on
                            performance, reliability, and long-term usefulness.
                        </p>
                    </header>

                    {/* FEATURED APP */}
                    <section className="space-y-6">
                        <h2 className="text-xl font-semibold text-white">
                            Featured App
                        </h2>

                        <div className="rounded-3xl overflow-hidden border border-white/10 bg-zinc-900">
                            <img
                                src="/banner/banner.png"
                                alt="Featured App"
                                className="w-full h-[360px] object-cover"
                            />

                            <div className="p-8 space-y-4">
                                <h3 className="text-3xl font-semibold text-white tracking-tight">
                                    Rage Platformer
                                </h3>

                                <p className="text-zinc-400 max-w-xl">
                                    A console-quality cloud gaming experience designed to start
                                    instantly and perform consistently across devices.
                                </p>

                                <button className="mt-4 rounded-full bg-white text-black px-6 py-2.5 text-sm font-medium">
                                    View App
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* APPS LIST */}
                    <section className="space-y-10">
                        <div className="flex items-baseline justify-between">
                            <h2 className="text-xl font-semibold text-white">
                                Apps by {publisherName.split(" ")[0]}
                            </h2>
                            <span className="text-sm text-zinc-500">
                                {apps.length} apps
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            {apps.map((app) => (
                                <div
                                    key={app.id}
                                    className="flex items-center gap-5"
                                >
                                    <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center text-2xl">
                                        {app.icon}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-base font-medium text-white truncate">
                                            {app.title}
                                        </h3>
                                        <p className="text-sm text-zinc-500 truncate">
                                            {app.category}
                                        </p>
                                        <div className="flex items-center gap-1 mt-1">
                                            <Star className="w-3.5 h-3.5 fill-zinc-500 text-zinc-500" />
                                            <span className="text-xs text-zinc-400">
                                                {app.rating}
                                            </span>
                                        </div>
                                    </div>

                                    <button className="rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white">
                                        Get
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
}
