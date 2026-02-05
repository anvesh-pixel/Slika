"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
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

    return (
        <nav className="glass-dark sticky top-0 z-50 w-full px-4 py-3">
            <div className="mx-auto flex max-w-7xl items-center gap-4 h-16 w-full">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group shrink-0">
                    <div className="bg-neon-gradient h-8 w-8 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(157,0,255,0.5)] group-hover:shadow-[0_0_25px_rgba(255,0,234,0.7)] transition-all">
                        <span className="text-white font-bold text-xl">S</span>
                    </div>
                    <span className="text-neon-gradient text-2xl font-bold tracking-tight">Slika</span>
                </Link>

                {/* Search Bar */}
                <div className="flex-1 relative group">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-neon-pink transition-colors">
                        <Search className="h-4 w-4" />
                    </div>
                    <Input
                        placeholder="Search for inspiration..."
                        className="pl-10 h-10 w-full rounded-full bg-white/5 border-white/10 focus-visible:ring-2 focus-visible:ring-neon-purple text-white placeholder:text-gray-500 transition-all focus:bg-white/10"
                    />
                </div>

                {/* Dropdowns */}
                <div className="hidden md:flex items-center gap-2">
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-[140px] h-10 rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10 hover:border-neon-purple focus:ring-neon-purple transition-all">
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent className="glass-dark border-white/10 text-white" position="popper" sideOffset={4}>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="ui-ux">UI/UX</SelectItem>
                            <SelectItem value="photography">Photography</SelectItem>
                            <SelectItem value="vectors">Vectors</SelectItem>
                            <SelectItem value="videos">Videos</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={selectedSort} onValueChange={setSelectedSort}>
                        <SelectTrigger className="w-[140px] h-10 rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10 hover:border-neon-pink focus:ring-neon-pink transition-all">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent className="glass-dark border-white/10 text-white" position="popper" sideOffset={4}>
                            <SelectItem value="recommended">Recommended</SelectItem>
                            <SelectItem value="newest">Newest</SelectItem>
                            <SelectItem value="most-viewed">Most Viewed</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Right Side: Actions */}
                <div className="flex items-center gap-2 shrink-0">
                    <Button className="bg-neon-gradient hover:opacity-90 rounded-full px-6 text-white font-bold shadow-[0_0_15px_rgba(157,0,255,0.3)] hover:shadow-[0_0_20px_rgba(255,0,234,0.5)] transition-all">
                        Upload
                    </Button>
                    <Link href="/inbox">
                        <Button variant="ghost" className="font-semibold text-white hover:bg-white/10 hover:text-neon-pink transition-all hidden sm:inline-flex">
                            Inbox
                        </Button>
                    </Link>
                    <Link href="/profile/akshat">
                        <Button variant="ghost" className="font-semibold text-white hover:bg-white/10 hover:text-neon-pink transition-all hidden sm:inline-flex">
                            Profile
                        </Button>
                    </Link>
                    <Button variant="ghost" className="font-semibold text-white hover:bg-white/10 hover:text-neon-purple transition-all">
                        Login
                    </Button>
                </div>
            </div>
        </nav>
    );
}
