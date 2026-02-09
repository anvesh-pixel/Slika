"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { SignInButton, SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { Home, User } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import ThemeSwitch from "./theme-switch";
import { SearchBar } from "./search-bar";

export default function Navbar() {
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

                    <Suspense fallback={<div className="flex-1 h-11 bg-background-alt/50 rounded-full" />}>
                        <SearchBar
                            isMobileSearchOpen={isMobileSearchOpen}
                            setIsMobileSearchOpen={setIsMobileSearchOpen}
                        />
                    </Suspense>

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
                        isMobileSearchOpen ? "text-neon-pink" : ""
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
        </>
    );
}

// Separate import for Search if needed or use local one
import { Search } from "lucide-react";
