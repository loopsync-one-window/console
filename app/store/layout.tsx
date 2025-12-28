"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Navbar from "@/components/NavBar";
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
    User
} from "lucide-react";

export default function StoreLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const menuGroups = [
        {
            title: "Discover",
            items: [
                { name: "Today", icon: LayoutGrid, href: "/store" },
                { name: "Games", icon: Gamepad2, href: "/store/games" },
                { name: "Apps", icon: AppWindow, href: "/store/apps" },
                { name: "Arcade", icon: Layers, href: "/store/arcade" },
            ]
        },
        {
            title: "Categories",
            items: [
                { name: "Productivity", icon: Briefcase, href: "/store/productivity" },
                { name: "Entertainment", icon: MonitorPlay, href: "/store/entertainment" },
                { name: "Music", icon: Music, href: "/store/music" },
                { name: "Developer Tools", icon: Code2, href: "/store/developer" },
                { name: "Health & Fitness", icon: Activity, href: "/store/health" },
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
                <div className="mb-8 relative px-2">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none">
                        <Search className="w-3.5 h-3.5" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search"
                        className="w-full bg-white/5 focus:bg-white/10 text-white text-[13px] font-medium rounded-lg pl-9 pr-3 py-2 border border-transparent focus:border-white/10 focus:outline-none transition-all placeholder-zinc-600"
                    />
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto space-y-8 no-scrollbar px-2">
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

                {/* Footer User Profile */}
                <div className="mt-auto pt-4 border-t border-white/5 px-2">
                    <button className="group flex items-center gap-3 w-full p-2 rounded-xl hover:bg-white/5 transition-all duration-200">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 flex items-center justify-center text-white text-[10px] font-bold shadow-lg group-hover:shadow-white/5">
                            R
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                            <p className="text-[13px] font-medium text-white group-hover:text-white transition-colors truncate">Ripun Basumatary</p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <p className="text-[11px] text-zinc-500 truncate">ripun@intellaris.co</p>
                            </div>
                        </div>
                        <Settings className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 h-full overflow-y-auto overflow-x-hidden relative scrollbar-hide">
                {children}
            </main>
        </div>
    );
}
