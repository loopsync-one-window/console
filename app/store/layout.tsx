"use client";

import { useState, useEffect } from "react";
import { StoreSearchModal } from "./components/StoreSearchModal";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Navbar from "@/components/NavBar";
import { getCurrentUserId } from "@/lib/api";
import {
    Search,
    LayoutGrid,
    Gamepad2,
    AppWindow,
    Layers,
    MonitorPlay,
    Briefcase,
    Music,
    Activity,
    Code2,
    Settings,
    User,
    BookOpen,
    Film,
    CreditCard,
    Camera,
    Map,
    Sparkles,
    TheaterIcon,
    TouchpadIcon
} from "lucide-react";

export default function StoreLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [user, setUser] = useState<{ fullName: string; email: string } | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse user", e);
            }
        }
    }, []);

    const menuGroups = [
        {
            title: "Discover",
            items: [
                { name: "Today", icon: LayoutGrid, href: "/store" },
                { name: "Games", icon: Gamepad2, href: "/store/games" },
                { name: "Apps", icon: AppWindow, href: "/store/apps" },
                { name: "Extensions", icon: Layers, href: "/store/extensions" },
                { name: "Software", icon: MonitorPlay, href: "/store/software" },
            ]
        },
        {
            title: "Categories",
            items: [
                { name: "Productivity", icon: Briefcase, href: "/store/productivity" },
                { name: "Developer Tools", icon: Code2, href: "/store/developer" },
                { name: "Social Networking", icon: User, href: "/store/social" },
                { name: "Education", icon: BookOpen, href: "/store/education" },
                { name: "Entertainment", icon: Film, href: "/store/entertainment" },
                { name: "Health & Fitness", icon: Activity, href: "/store/health" },
                { name: "Finance", icon: CreditCard, href: "/store/finance" },
                { name: "Photo & Video", icon: Camera, href: "/store/photo-video" },
                { name: "Utilities", icon: Settings, href: "/store/utilities" },
                { name: "Travel", icon: Map, href: "/store/travel" },
                { name: "Others", icon: TouchpadIcon, href: "/store/others" },
            ]
        }
    ];

    return (
        <div className="flex h-screen w-full bg-[#000000] text-white font-sans overflow-hidden">
            {/* Sidebar */}
            <aside className="w-[260px] flex-shrink-0 flex flex-col bg-[#000] border-r border-white/5 backdrop-blur-2xl h-full pt-8 pb-6 px-4 z-40 transition-all duration-300">

                {/* Logo */}
                <div className="px-5 mb-8">
                    <img src="/resources/logo.svg" alt="LoopSync" className="h-7 w-auto" />
                </div>

                {/* Search Bar */}
                <div
                    className="mb-8 relative px-2 cursor-pointer group"
                    onClick={() => setIsSearchOpen(true)}
                >
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none group-hover:text-white transition-colors">
                        <Search className="w-3.5 h-3.5" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search"
                        readOnly
                        className="w-full bg-white/5 group-hover:bg-white/10 text-white text-[13px] font-medium rounded-lg pl-9 pr-3 py-2 border border-transparent focus:outline-none transition-all placeholder-zinc-600 cursor-pointer"
                    />
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto space-y-8 no-scrollbar px-2 pb-30">
                    {menuGroups.map((group, idx) => (
                        <div key={idx}>
                            {group.title && (
                                <h3 className="text-[11px] font-bold text-zinc-500 mb-3 px-3 uppercase tracking-widest opacity-80">{group.title}</h3>
                            )}
                            <ul className="space-y-0.5">
                                {group.items.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = pathname === item.href;
                                    return (
                                        <li key={item.name}>
                                            <Link
                                                href={item.href}
                                                className={`
                                                    group flex items-center gap-3 px-3 py-2 rounded-md text-[13px] font-medium transition-all duration-200
                                                    ${isActive
                                                        ? "bg-white/10 text-white shadow-sm"
                                                        : "text-zinc-400 hover:text-white hover:bg-white/5"
                                                    }
                                                `}
                                            >
                                                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-zinc-500 group-hover:text-zinc-300"}`} />
                                                <span>{item.name}</span>
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ))}
                </nav>

                {/* Footer User Profile (Only if logged in) */}
                {user && (
                    <div className="mt-auto pt-4 border-t border-white/5 px-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <button className="group flex items-center gap-3 w-full p-2 rounded-xl hover:bg-white/5 transition-all duration-200">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 flex items-center justify-center text-white text-[10px] font-bold shadow-lg group-hover:shadow-white/5">
                                {user.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
                            </div>
                            <div className="flex-1 min-w-0 text-left">
                                <p className="text-[13px] font-medium text-white group-hover:text-white transition-colors truncate">
                                    {user.fullName || "User"}
                                </p>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <p className="text-[11px] text-zinc-500 truncate">{user.email}</p>
                                </div>
                            </div>
                            <Settings className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                        </button>
                    </div>
                )}
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 h-full overflow-y-auto overflow-x-hidden relative scrollbar-hide">
                {children}
            </main>

            {/* Search Modal */}
            <StoreSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </div>
    );
}
