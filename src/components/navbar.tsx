"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { SignInButton, SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { Search, Home, PlusSquare, MessageCircle, User } from "lucide-react";
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

export default function Navbar() {
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedSort, setSelectedSort] = useState("recommended");
    const [isVisible, setIsVisible] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
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

    return (
        <>
            <motion.nav
                initial={{ y: 0 }}
                animate={{ y: (isVisible || !isMobile) ? 0 : -100 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="glass-dark sticky top-0 z-50 w-full px-4 py-3"
            >
                <div className="mx-auto flex max-w-7xl items-center gap-4 h-16 w-full">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group shrink-0">
                        <div className="bg-neon-gradient h-8 w-8 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(157,0,255,0.5)] group-hover:shadow-[0_0_25px_rgba(255,0,234,0.7)] transition-all">
                            <span className="text-white font-bold text-xl">S</span>
                        </div>
                        <span className="text-neon-gradient text-2xl font-bold tracking-tight">Slika</span>
                    </Link>

                    {/* Search Bar - Desktop Only */}
                    <div className="hidden md:flex flex-1 relative group max-w-2xl">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-neon-pink transition-colors">
                            <Search className="h-4 w-4" />
                        </div>
                        <Input
                            placeholder="Search images, creators..."
                            className="pl-10 h-11 w-full rounded-full bg-white/5 border-white/10 focus-visible:ring-2 focus-visible:ring-neon-purple text-white placeholder:text-gray-500 transition-all focus:bg-white/10 shadow-inner"
                        />
                    </div>

                    <div className="hidden md:flex items-center gap-3 ml-auto">
                        <SignedIn>
                            <button
                                onClick={() => router.push(`/profile/${username}`)}
                                className={cn(
                                    "p-1 rounded-full transition-all active:scale-95 outline-none border-2",
                                    pathname.startsWith("/profile") ? "border-neon-pink shadow-[0_0_10px_rgba(255,0,234,0.3)]" : "border-transparent hover:border-white/20"
                                )}
                            >
                                <Avatar className="h-9 w-9">
                                    <AvatarImage src={user?.imageUrl} alt={username} />
                                    <AvatarFallback className="bg-white/10 text-xs text-white">
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
            <div className="md:hidden fixed bottom-0 left-0 right-0 h-[72px] bg-black/80 backdrop-blur-xl border-t border-white/10 z-50 flex items-center justify-around px-2 pb-[env(safe-area-inset-bottom)]">
                <Link href="/" className={cn(
                    "flex flex-col items-center justify-center min-w-[64px] h-full transition-all gap-1",
                    pathname === "/" ? "text-neon-purple" : "text-gray-500 hover:text-white"
                )}>
                    <Home className={cn("h-7 w-7", pathname === "/" && "drop-shadow-[0_0_8px_rgba(157,0,255,0.5)]")} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Home</span>
                </Link>

                <button
                    onClick={() => setIsMobileSearchOpen(true)}
                    className={cn(
                        "flex flex-col items-center justify-center min-w-[64px] h-full transition-all gap-1 text-gray-500 hover:text-white outline-none",
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
                            pathname.startsWith("/profile") ? "text-white" : "text-gray-500 hover:text-white"
                        )}
                    >
                        <div className={cn(
                            "rounded-full p-0.5 transition-all",
                            pathname.startsWith("/profile") ? "bg-neon-gradient p-[2px] shadow-[0_0_10px_rgba(157,0,255,0.5)]" : "bg-transparent"
                        )}>
                            <div className="h-8 w-8 rounded-full border-2 border-black overflow-hidden pointer-events-none">
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
                        <button className="flex flex-col items-center justify-center min-w-[64px] h-full transition-all gap-1 text-gray-500 hover:text-white outline-none">
                            <div className="h-8 w-8 rounded-full border-2 border-white/10 flex items-center justify-center">
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
                        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl md:hidden p-6 flex flex-col"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <span className="text-neon-gradient text-2xl font-bold tracking-tight">Search</span>
                            <button
                                onClick={() => setIsMobileSearchOpen(false)}
                                className="h-10 w-10 glass-dark rounded-full flex items-center justify-center text-white active:scale-90 transition-all border border-white/10"
                            >
                                <PlusSquare className="h-6 w-6 rotate-45" />
                            </button>
                        </div>

                        <div className="relative group mb-8">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-neon-pink">
                                <Search className="h-5 w-5" />
                            </div>
                            <Input
                                autoFocus
                                placeholder="Search images, creators..."
                                className="pl-12 h-14 w-full rounded-2xl bg-white/5 border-neon-purple/50 focus-visible:ring-2 focus-visible:ring-neon-pink text-white text-lg placeholder:text-gray-500 transition-all focus:bg-white/10 shadow-[0_0_20px_rgba(157,0,255,0.1)]"
                            />
                        </div>

                        <div className="flex flex-col gap-4">
                            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Trending</p>
                            <div className="flex flex-wrap gap-2">
                                {["Nature", "Cyberpunk", "Minimalist", "Portrait", "Video"].map((tag) => (
                                    <button
                                        key={tag}
                                        className="px-4 py-2 rounded-full glass-dark border border-white/10 text-white text-sm hover:border-neon-purple transition-all"
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
