"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, PlusSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { NavbarFilter } from "./navbar-filter";
import { cn } from "@/lib/utils";

interface SearchBarProps {
    isMobileSearchOpen: boolean;
    setIsMobileSearchOpen: (open: boolean) => void;
}

export function SearchBar({ isMobileSearchOpen, setIsMobileSearchOpen }: SearchBarProps) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();
    const [isPending, startTransition] = React.useTransition();

    const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
    const [selectedTypes, setSelectedTypes] = useState<string[]>(
        searchParams.get("types")?.split(",").filter(Boolean) || []
    );

    // Sync state with URL when it changes
    useEffect(() => {
        const types = searchParams.get("types")?.split(",").filter(Boolean) || [];
        setSelectedTypes(types);
        const q = searchParams.get("q") || "";
        setSearchQuery(q);
    }, [searchParams]);

    const updateURL = (query: string, types: string[]) => {
        startTransition(() => {
            const params = new URLSearchParams();
            if (query.trim()) params.set("q", query.trim());
            if (types.length > 0) params.set("types", types.join(","));

            const path = query.trim() || types.length > 0 ? "/search" : pathname === "/search" ? "/" : pathname;
            router.push(`${path}?${params.toString()}`, { scroll: false });
        });
    };

    const handleSearch = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        updateURL(searchQuery, selectedTypes);
        setIsMobileSearchOpen(false);
    };

    const onTypeToggle = (type: string) => {
        const next = selectedTypes.includes(type)
            ? selectedTypes.filter(t => t !== type)
            : [...selectedTypes, type];

        const final = next.length === 3 ? [] : next;
        setSelectedTypes(final);
        updateURL(searchQuery, final);
    };

    const onClearTypes = () => {
        setSelectedTypes([]);
        updateURL(searchQuery, []);
    };

    return (
        <>
            {/* Desktop Search */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 relative group max-w-2xl">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-neon-pink transition-colors">
                    <Search className="h-4 w-4" />
                </div>
                <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search images, creators..."
                    className="pl-10 h-11 w-full rounded-full bg-background-alt border-border focus-visible:ring-2 focus-visible:ring-neon-purple text-foreground placeholder:text-muted-foreground transition-all focus:bg-background-alt/80 shadow-inner"
                />
            </form>

            <div className="hidden md:block">
                <NavbarFilter
                    selectedTypes={selectedTypes}
                    onTypeToggle={onTypeToggle}
                    onClear={onClearTypes}
                />
            </div>

            {/* Mobile Search Overlay */}
            <AnimatePresence>
                {isMobileSearchOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-2xl md:hidden p-6 flex flex-col transition-colors duration-[2000ms]"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <span className="text-neon-gradient text-2xl font-bold tracking-tight">Search</span>
                            <button
                                onClick={() => setIsMobileSearchOpen(false)}
                                className="h-10 w-10 glass rounded-full flex items-center justify-center text-foreground active:scale-90 transition-all border border-border"
                            >
                                <PlusSquare className="h-6 w-6 rotate-45" />
                            </button>
                        </div>

                        <form onSubmit={handleSearch} className="relative group mb-8">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-neon-pink">
                                <Search className="h-5 w-5" />
                            </div>
                            <Input
                                autoFocus
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search images, creators..."
                                className="pl-12 h-14 w-full rounded-2xl bg-background-alt border-neon-purple/50 focus-visible:ring-2 focus-visible:ring-neon-pink text-foreground text-lg placeholder:text-muted-foreground transition-all focus:bg-background-alt/80 shadow-[0_0_20px_rgba(157,0,255,0.1)]"
                            />
                        </form>

                        <div className="mb-8">
                            <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs mb-4">Content Type</p>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={onClearTypes}
                                    className={cn(
                                        "px-6 py-3 rounded-xl glass border transition-all font-bold text-sm uppercase tracking-wider",
                                        selectedTypes.length === 0 ? "border-neon-purple text-white shadow-[0_0_15px_rgba(157,0,255,0.3)] bg-neon-purple/10" : "border-border text-muted-foreground"
                                    )}
                                >
                                    All
                                </button>
                                {[
                                    { id: 'photo', label: 'Photos' },
                                    { id: 'video', label: 'Videos' },
                                    { id: 'gif', label: 'Gifs' }
                                ].map((type) => (
                                    <button
                                        key={type.id}
                                        onClick={() => onTypeToggle(type.id)}
                                        className={cn(
                                            "px-6 py-3 rounded-xl glass border transition-all font-bold text-sm uppercase tracking-wider",
                                            selectedTypes.includes(type.id) ? "border-neon-pink text-white shadow-[0_0_15px_rgba(255,0,234,0.3)] bg-neon-pink/10" : "border-border text-muted-foreground"
                                        )}
                                    >
                                        {type.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col gap-4">
                            <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">Trending</p>
                            <div className="flex flex-wrap gap-2">
                                {["Nature", "Cyberpunk", "Minimalist", "Portrait", "Video"].map((tag) => (
                                    <button
                                        key={tag}
                                        onClick={() => {
                                            setSearchQuery(tag);
                                            startTransition(() => {
                                                const params = new URLSearchParams();
                                                params.set("q", tag);
                                                if (selectedTypes.length > 0) params.set("types", selectedTypes.join(","));
                                                router.push(`/search?${params.toString()}`, { scroll: false });
                                                setIsMobileSearchOpen(false);
                                            });
                                        }}
                                        className="px-4 py-2 rounded-full glass border border-border text-foreground text-sm hover:border-neon-purple transition-all"
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
