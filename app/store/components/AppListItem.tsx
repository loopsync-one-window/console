"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

export function AppListItem({ id, icon, color, title, subtitle, category }: { id: string; icon?: string; color?: string; title: string; subtitle: string; category: string }) {
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return (
        <Link href={`/store/${id}/${slug}`} className="block">
            <div className="flex items-center gap-5 p-5 rounded-[1.5rem] bg-black border border-white/5 hover:bg-white/5 hover:border-white/10 transition-all duration-300 cursor-pointer group hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/50">
                <div className={cn(
                    "w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 shadow-lg ring-1 ring-white/5",
                    icon ? 'bg-black' : color || 'bg-zinc-800' // Fixed: fallback to zinc-800 if color is missing
                )}>
                    {icon ? (
                        <img src={typeof icon === 'string' ? icon : (icon as any)?.['512'] || ''} alt={title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                        <div className={`w-full h-full flex items-center justify-center text-white/20 ${color || 'bg-zinc-800'}`}>
                            <div className="w-8 h-8 bg-white/20 rounded-md"></div>
                        </div>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="text-white font-bold text-lg truncate group-hover:text-white transition-colors">{title}</h4>
                    <p className="text-zinc-500 text-sm truncate font-medium">{subtitle}</p>
                    <span className="text-[11px] font-bold tracking-wider text-zinc-600 mt-1 inline-block uppercase bg-white/5 px-2 py-0.5 rounded-md text-zinc-500">{category}</span>
                </div>
                <div className="flex-shrink-0">
                    <button
                        onClick={(e) => {
                            if (category.toLowerCase() === 'extension') {
                                e.preventDefault();
                                window.open("https://loopsync.cloud/home", "_blank");
                            }
                        }}
                        className="bg-white/5 text-white font-bold text-xs uppercase px-5 py-2 rounded-full hover:bg-white hover:text-black transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                    >
                        {category.toLowerCase() === 'extension' ? 'Add Extension' : 'Get'}
                    </button>
                </div>
            </div>
        </Link>
    );
}
