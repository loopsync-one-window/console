"use client";

import { useState, useEffect } from "react";
import { AppListItem } from "./AppListItem";
import { CategoryFeatured } from "./CategoryFeatured";
import { DeveloperCTA } from "./DeveloperCTA";
import { getStoreApps, AppMock } from "@/lib/store-api";
import { Dithering } from "@paper-design/shaders-react";

interface CategoryViewProps {
    categorySlug: string;
}

export function CategoryView({ categorySlug }: CategoryViewProps) {
    const [apps, setApps] = useState<AppMock[]>([]);
    const [loading, setLoading] = useState(true);

    // Map slug to display title
    const getTitle = (slug: string) => {
        if (slug === 'apps') return 'Apps';
        if (slug === 'games') return 'Games';
        if (slug === 'software') return 'Software';
        if (slug === 'extensions') return 'Extensions';

        return slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    useEffect(() => {
        const fetchApps = async () => {
            setLoading(true);
            try {
                // Fetch apps - optimizing by asking for more initially to filter client side
                const data = await getStoreApps({ limit: 100 });
                let filtered = data.items;

                switch (categorySlug) {
                    case 'games':
                        filtered = filtered.filter(a => a.category?.toLowerCase() === 'game' || a.category?.toLowerCase() === 'games');
                        break;
                    case 'apps':
                        // All categories EXCEPT games and extensions
                        filtered = filtered.filter(a => {
                            const c = a.category?.toLowerCase() || '';
                            return c !== 'game' && c !== 'games' && c !== 'extension' && c !== 'extensions';
                        });
                        break;
                    case 'extensions':
                        filtered = filtered.filter(a => a.category?.toLowerCase() === 'extension' || a.category?.toLowerCase() === 'extensions');
                        break;
                    case 'software':
                        filtered = filtered.filter(a => a.category?.toLowerCase() === 'software');
                        break;
                    default:
                        // Specific category
                        // Try to match somewhat loosely
                        filtered = filtered.filter(a => a.category?.toLowerCase() === categorySlug.replace(/-/g, ' '));
                        break;
                }

                setApps(filtered);
            } catch (e) {
                console.error("Failed to fetch apps", e);
            } finally {
                setLoading(false);
            }
        };

        fetchApps();
    }, [categorySlug]);

    return (
        <div className="w-full min-h-full pb-20 pt-8 relative">
            <div className="fixed inset-0 z-0 opacity-30 pointer-events-none">
                {/* <Dithering
                    style={{ height: "100%", width: "100%" }}
                    colorBack="#000000"
                    colorFront="#949494ff"
                    shape={"wave" as any}
                    type="4x4"
                    pxSize={1}
                    offsetX={0}
                    offsetY={0}
                    scale={1}
                    rotation={1}
                /> */}
                <div className="absolute inset-0 backdrop-blur-sm" />
            </div>

            <div className="px-8 max-w-[1600px] mx-auto relative z-10">
                {/* Title Section */}
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-medium text-white font-geom tracking-tight">{getTitle(categorySlug)}</h1>
                </div>

                {/* Featured Carousel */}
                {!loading && apps.length > 0 && (
                    <CategoryFeatured apps={apps.slice(0, 5)} />
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* ... grid items ... */}
                    {loading ? (
                        [...Array(6)].map((_, i) => (
                            <div key={i} className="flex items-center gap-5 p-5 rounded-[1.5rem] bg-black border border-white/5 animate-pulse">
                                <div className="w-16 h-16 rounded-2xl bg-white/5" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-white/5 rounded w-3/4" />
                                    <div className="h-3 bg-white/5 rounded w-1/2" />
                                </div>
                            </div>
                        ))
                    ) : apps.length === 0 ? (
                        <DeveloperCTA category={getTitle(categorySlug)} />
                    ) : (
                        apps.map((app) => (
                            <AppListItem
                                key={app.id}
                                id={app.id}
                                icon={app.icon}
                                title={app.name}
                                subtitle={app.shortDescription || "No description"}
                                category={app.category || "Utility"}
                                color={app.branding?.activeColor}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
