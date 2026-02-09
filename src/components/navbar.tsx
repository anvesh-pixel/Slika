"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { SignInButton, SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { Search, Home, PlusSquare, MessageCircle, User } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import ThemeSwitch from "./theme-switch";
import { NavbarFilter } from "./navbar-filter";
import { useSearchParams } from "next/navigation";

export default function Navbar() {
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedSort, setSelectedSort] = useState("recommended");
    const [isVisible, setIsVisible] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
    const [isPending, startTransition] = React.useTransition();
    const searchParams = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
    const [selectedTypes, setSelectedTypes] = useState<string[]>(
        searchParams.get("types")?.split(",").filter(Boolean) || []
    );
    const pathname = usePathname();
    const router = useRouter();
    const { user } = useUser();
    const username = user?.username || user?.firstName?.toLowerCase()?.replace(/\s+/g, '_') || "me";
    const lastScrollY = useRef(0);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);

        const handleScroll = () => {
            // Only toggle visibility on mobile
            if (window.innerWidth >= 768) {
                if (!isVisible) setIsVisible(true);
                return;
            }

            const currentScrollY = window.scrollY;

            if (currentScrollY < lastScrollY.current || currentScrollY < 100) {
                setIsVisible(true);
            }
            else if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
                setIsVisible(false);
            }

            lastScrollY.current = currentScrollY;
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => {
            window.removeEventListener("resize", checkMobile);
            window.removeEventListener("scroll", handleScroll);
        };
    }, [isVisible]);

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
            <motion.nav
                initial={{ y: 0 }}
                animate={{ y: (isVisible || !isMobile) ? 0 : -100 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="glass sticky top-0 z-50 w-full px-4 py-3 transition-colors duration-[2000ms]"
            >
                <div className="mx-auto flex max-w-7xl items-center gap-4 h-16 w-full">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group shrink-0">
                        <div className="relative h-9 w-9 flex items-center justify-center transition-all group-hover:scale-105 duration-300 rounded-full overflow-hidden border border-border/50">
                            <Image
                                src="/logo.png"
                                alt="Slika Logo"
                                width={36}
                                height={36}
                                className="object-cover"
                                priority
                            />
                        </div>
                        <span className="text-neon-gradient text-2xl font-bold tracking-tight">Slika</span>
                    </Link>

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

                    <div className="hidden md:flex items-center gap-6 ml-auto">
                        <ThemeSwitch />
                        <SignedIn>
                            <button
                                onClick={() => router.push(`/profile/${username}`)}
                                className={cn(
                                    "p-1 rounded-full transition-all active:scale-95 outline-none border-2",
                                    pathname.startsWith("/profile") ? "border-neon-pink shadow-[0_0_10px_rgba(255,0,234,0.3)]" : "border-transparent hover:border-border transition-colors duration-[2000ms]"
                                )}
                            >
                                <Avatar className="h-9 w-9">
                                    <AvatarImage src={user?.imageUrl} alt={username} />
                                    <AvatarFallback className="bg-muted text-xs text-foreground">
                                        {username.slice(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                            </button>
                        </SignedIn>
                        <SignedOut>
                            <SignInButton mode="modal">
                                <Button className="bg-neon-gradient hover:opacity-90 rounded-full px-6 text-white font-bold h-10">
                                    Login
                                </Button>
                            </SignInButton>
                        </SignedOut>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Sticky Footer */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 h-[72px] bg-background/80 backdrop-blur-xl border-t border-border z-50 flex items-center justify-around px-2 pb-[env(safe-area-inset-bottom)] transition-colors duration-[2000ms]">
                <Link href="/" className={cn(
                    "flex flex-col items-center justify-center min-w-[64px] h-full transition-all gap-1",
                    pathname === "/" ? "text-neon-purple" : "text-muted-foreground hover:text-foreground"
                )}>
                    <Home className={cn("h-7 w-7", pathname === "/" && "drop-shadow-[0_0_8px_rgba(157,0,255,0.5)]")} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Home</span>
                </Link>

                <button
                    onClick={() => setIsMobileSearchOpen(true)}
                    className={cn(
                        "flex flex-col items-center justify-center min-w-[64px] h-full transition-all gap-1 text-muted-foreground hover:text-foreground outline-none",
                        isMobileSearchOpen && "text-neon-pink"
                    )}
                >
                    <Search className={cn("h-7 w-7", isMobileSearchOpen && "drop-shadow-[0_0_8px_rgba(255,0,234,0.5)]")} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Search</span>
                </button>

                <SignedIn>
                    <button
                        onClick={() => router.push(`/profile/${username}`)}
                        className={cn(
                            "flex flex-col items-center justify-center min-w-[64px] h-full transition-all gap-1 outline-none",
                            pathname.startsWith("/profile") ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <div className={cn(
                            "rounded-full p-0.5 transition-all",
                            pathname.startsWith("/profile") ? "bg-neon-gradient p-[2px] shadow-[0_0_10px_rgba(157,0,255,0.5)]" : "bg-transparent"
                        )}>
                            <div className="h-8 w-8 rounded-full border-2 border-border overflow-hidden pointer-events-none transition-colors duration-[2000ms]">
                                <img
                                    src={user?.imageUrl}
                                    alt={username}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest pointer-events-none">Profile</span>
                    </button>
                </SignedIn>
                <SignedOut>
                    <SignInButton mode="modal">
                        <button className="flex flex-col items-center justify-center min-w-[64px] h-full transition-all gap-1 text-muted-foreground hover:text-foreground outline-none">
                            <div className="h-8 w-8 rounded-full border-2 border-border flex items-center justify-center">
                                <User className="h-5 w-5" />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-widest">Login</span>
                        </button>
                    </SignInButton>
                </SignedOut>
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
