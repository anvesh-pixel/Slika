"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { MoreHorizontal, Heart, Download, Share2, Bookmark, Grid } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LongPressRadialMenu from "./radial-menu";
import { toggleLike, toggleSave } from "@/app/actions/interaction";
import { useTransition } from "react";

type FeedItem =
    | { type: "image"; id: number; height: number; url: string; title: string }
    | { type: "video"; id: number; url: string; title: string };

export const dummyItems: FeedItem[] = [
    { type: "image", id: 1, height: 400, url: "https://picsum.photos/seed/1/500/400", title: "Forest view" },
    { type: "video", id: 2, url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", title: "Big Buck Bunny" },
    { type: "image", id: 3, height: 800, url: "https://picsum.photos/seed/3/500/800", title: "Mountain peak" },
    { type: "video", id: 4, url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", title: "Elephants Dream" },
    { type: "image", id: 5, height: 500, url: "https://picsum.photos/seed/4/500/500", title: "City lights" },
    { type: "video", id: 6, url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", title: "For Bigger Blazes" },
    { type: "image", id: 7, height: 700, url: "https://picsum.photos/seed/5/500/700", title: "Desert dunes" },
    { type: "image", id: 8, height: 400, url: "https://picsum.photos/seed/6/500/400", title: "Autumn leaves" },
    { type: "image", id: 15, height: 600, url: "https://picsum.photos/seed/15/500/600", title: "Misty mountains" },
    { type: "image", id: 16, height: 450, url: "https://picsum.photos/seed/16/500/450", title: "Urban architecture" },
    { type: "image", id: 17, height: 850, url: "https://picsum.photos/seed/17/500/850", title: "Sunset beach" },
    { type: "image", id: 18, height: 550, url: "https://picsum.photos/seed/18/500/550", title: "Lavender fields" },
    { type: "image", id: 19, height: 750, url: "https://picsum.photos/seed/19/500/750", title: "Snowy path" },
    { type: "image", id: 20, height: 400, url: "https://picsum.photos/seed/20/500/400", title: "Green valley" },
    { type: "image", id: 21, height: 650, url: "https://picsum.photos/seed/21/500/650", title: "Old bridge" },
    { type: "image", id: 22, height: 800, url: "https://picsum.photos/seed/22/500/800", title: "Canyon walls" },
    { type: "image", id: 29, height: 500, url: "https://picsum.photos/seed/29/500/500", title: "Modern loft" },
    { type: "image", id: 30, height: 900, url: "https://picsum.photos/seed/30/500/900", title: "Arctic explorer" },
    { type: "image", id: 31, height: 450, url: "https://picsum.photos/seed/31/500/450", title: "Street art" },
    { type: "image", id: 32, height: 750, url: "https://picsum.photos/seed/32/500/750", title: "Tropical paradise" },
    { type: "image", id: 33, height: 600, url: "https://picsum.photos/seed/33/500/600", title: "Zen garden" },
    { type: "image", id: 34, height: 850, url: "https://picsum.photos/seed/34/500/850", title: "Lighthouse dawn" },
    { type: "image", id: 35, height: 550, url: "https://picsum.photos/seed/35/500/550", title: "Abstract geometry" },
    { type: "image", id: 36, height: 400, url: "https://picsum.photos/seed/36/500/400", title: "Quiet library" },
    { type: "image", id: 37, height: 700, url: "https://picsum.photos/seed/37/500/700", title: "Rustic kitchen" },
    { type: "image", id: 38, height: 950, url: "https://picsum.photos/seed/38/500/950", title: "Glacier lake" },
    { type: "image", id: 39, height: 450, url: "https://picsum.photos/seed/39/500/450", title: "Vintage car" },
    { type: "image", id: 40, height: 650, url: "https://picsum.photos/seed/40/500/650", title: "Sailing boat" },
    { type: "image", id: 41, height: 800, url: "https://picsum.photos/seed/41/500/800", title: "Foggy forest" },
    { type: "image", id: 42, height: 500, url: "https://picsum.photos/seed/42/500/500", title: "Coffee latte" },
    { type: "image", id: 43, height: 750, url: "https://picsum.photos/seed/43/500/750", title: "Wildflower meadow" },
    { type: "image", id: 44, height: 600, url: "https://picsum.photos/seed/44/500/600", title: "Sculpture park" },
    { type: "image", id: 45, height: 850, url: "https://picsum.photos/seed/45/500/850", title: "Deep canyon" },
    { type: "image", id: 46, height: 550, url: "https://picsum.photos/seed/46/500/550", title: "Night market" },
];

export const savedItems: FeedItem[] = [
    { type: "image", id: 9, height: 900, url: "https://picsum.photos/seed/7/500/900", title: "Starry night" },
    { type: "image", id: 10, height: 550, url: "https://picsum.photos/seed/8/500/550", title: "Rainy window" },
    { type: "image", id: 11, height: 750, url: "https://picsum.photos/seed/9/500/750", title: "Coffee break" },
    { type: "image", id: 12, height: 650, url: "https://picsum.photos/seed/10/500/650", title: "Neon streets" },
    { type: "image", id: 13, height: 450, url: "https://picsum.photos/seed/13/500/450", title: "Ocean waves" },
    { type: "image", id: 14, height: 700, url: "https://picsum.photos/seed/14/500/700", title: "Cyberpunk city" },
    { type: "image", id: 23, height: 800, url: "https://picsum.photos/seed/23/500/800", title: "Marble architecture" },
    { type: "image", id: 24, height: 500, url: "https://picsum.photos/seed/24/500/500", title: "Cozy cabin" },
    { type: "image", id: 25, height: 700, url: "https://picsum.photos/seed/25/500/700", title: "Golden hour" },
    { type: "image", id: 26, height: 600, url: "https://picsum.photos/seed/26/500/600", title: "Forest stream" },
    { type: "image", id: 27, height: 400, url: "https://picsum.photos/seed/27/500/400", title: "Minimalist desk" },
    { type: "image", id: 28, height: 850, url: "https://picsum.photos/seed/28/500/850", title: "Ancient ruins" },
    { type: "image", id: 50, height: 600, url: "https://picsum.photos/seed/50/500/600", title: "Whimsical forest" },
    { type: "image", id: 51, height: 450, url: "https://picsum.photos/seed/51/500/450", title: "Sleek car" },
    { type: "image", id: 52, height: 800, url: "https://picsum.photos/seed/52/500/800", title: "Volcanic rocks" },
    { type: "image", id: 53, height: 550, url: "https://picsum.photos/seed/53/500/550", title: "Market spice" },
    { type: "image", id: 54, height: 700, url: "https://picsum.photos/seed/54/500/700", title: "Mountain cabin" },
    { type: "image", id: 55, height: 900, url: "https://picsum.photos/seed/55/500/900", title: "Cliffs of Moher" },
    { type: "image", id: 56, height: 500, url: "https://picsum.photos/seed/56/500/500", title: "Lavender haze" },
    { type: "image", id: 57, height: 400, url: "https://picsum.photos/seed/57/500/400", title: "Urban sunset" },
    { type: "image", id: 58, height: 750, url: "https://picsum.photos/seed/58/500/750", title: "Secret garden" },
    { type: "image", id: 59, height: 650, url: "https://picsum.photos/seed/59/500/650", title: "Desert oasis" },
];

const useLongPressMobile = () => {
    const [radialMenu, setRadialMenu] = useState<{ x: number, y: number } | null>(null);
    const [isLongPressing, setIsLongPressing] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const handleTouchStart = (e: React.TouchEvent) => {
        const touch = e.touches[0];
        const { clientX, clientY } = touch;

        // Don't show radial menu if dropdown is already open
        if (showDropdown) return;

        timerRef.current = setTimeout(() => {
            setRadialMenu({ x: clientX, y: clientY });
            setIsLongPressing(true);
            if (navigator.vibrate) navigator.vibrate(60);
        }, 400);
    };

    const handleTouchEnd = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
        // Keep isLongPressing true for a brief moment to block the following click event
        setTimeout(() => setIsLongPressing(false), 250);
    };

    const handleTouchMove = () => {
        if (!isLongPressing && timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    };

    return {
        radialMenu,
        setRadialMenu,
        isLongPressing,
        handleTouchStart,
        handleTouchEnd,
        handleTouchMove,
        showDropdown,
        setShowDropdown
    };
};

function VideoFeedItem({ id, url, title }: { id: number; url: string; title: string }) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const {
        radialMenu,
        setRadialMenu,
        isLongPressing,
        handleTouchStart,
        handleTouchEnd,
        handleTouchMove,
        showDropdown,
        setShowDropdown
    } = useLongPressMobile();
    const [isPending, startTransition] = useTransition();

    const handleMouseEnter = () => {
        videoRef.current?.play().catch(() => { });
    };

    const handleMouseLeave = () => {
        videoRef.current?.pause();
    };

    const handleAction = (actionId: string) => {
        if (actionId === "like") {
            startTransition(() => toggleLike(id));
        } else if (actionId === "save") {
            startTransition(() => toggleSave(id));
        }
        console.log(`Action: ${actionId} for video ${id}`);
        setShowDropdown(false);
    };

    return (
        <div className="relative group">
            <Link
                href={`/pin/${id}`}
                onClick={(e) => { if (isLongPressing) e.preventDefault(); }}
                className={`group relative cursor-pointer overflow-hidden rounded-xl bg-background-alt border border-border transition-all duration-500 hover:border-neon-purple/20 hover:shadow-[0_0_10px_rgba(157,0,255,0.05)] dark:hover:border-neon-purple/30 dark:hover:shadow-[0_0_15px_rgba(157,0,255,0.15)] active:scale-95 block h-full ${isLongPressing ? 'pointer-events-none' : ''}`}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <video
                    ref={videoRef}
                    src={url}
                    muted
                    loop
                    playsInline
                    className="w-full h-auto transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-end p-4">
                    <span className="text-foreground font-medium text-sm truncate drop-shadow-md">{title}</span>
                </div>
                <div className="absolute top-3 right-3 glass rounded-full p-1.5 text-foreground opacity-80 group-hover:opacity-0 transition-opacity">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M16 3a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3zM9 13H2V3h7v10zm7-10v10l-6-5 6-5z" />
                    </svg>
                </div>
            </Link>

            {/* Mobile Trigger + Dropdown */}
            <div className="md:hidden absolute bottom-3 right-3 z-30">
                <DropdownMenu open={showDropdown} onOpenChange={setShowDropdown}>
                    <DropdownMenuTrigger asChild>
                        <button
                            type="button"
                            className="h-10 w-10 glass rounded-full flex items-center justify-center text-foreground active:scale-90 transition-all touch-none select-none border border-neon-purple/30 outline-none"
                            onTouchStart={handleTouchStart}
                            onTouchEnd={handleTouchEnd}
                            onTouchMove={handleTouchMove}
                            onPointerDown={(e) => {
                                // Prevent Radix from opening the menu immediately on pointer down
                                // We will handle it in onClick for a clean tap
                                e.preventDefault();
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (!isLongPressing) {
                                    setShowDropdown(true);
                                }
                            }}
                        >
                            <MoreHorizontal className="h-5 w-5" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="glass border-neon-purple/30 text-foreground min-w-[150px]" align="end" sideOffset={8}>
                        <DropdownMenuItem onClick={() => handleAction("save")} className="focus:bg-white/10 focus:text-neon-purple gap-2 cursor-pointer">
                            <Bookmark className="h-4 w-4" /> Save
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction("download")} className="focus:bg-white/10 focus:text-neon-purple gap-2 cursor-pointer">
                            <Download className="h-4 w-4" /> Download
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction("like")} className="focus:bg-white/10 focus:text-red-500 gap-2 cursor-pointer">
                            <Heart className="h-4 w-4" /> Like
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction("share")} className="focus:bg-white/10 focus:text-green-500 gap-2 cursor-pointer">
                            <Share2 className="h-4 w-4" /> Share
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {radialMenu && (
                <LongPressRadialMenu
                    position={radialMenu}
                    onSelect={handleAction}
                    onClose={() => setRadialMenu(null)}
                />
            )}
        </div>
    );
}

function ImageFeedItem({ id, url, title, height }: { id: number; url: string; title: string; height: number }) {
    const {
        radialMenu,
        setRadialMenu,
        isLongPressing,
        handleTouchStart,
        handleTouchEnd,
        handleTouchMove,
        showDropdown,
        setShowDropdown
    } = useLongPressMobile();
    const [isPending, startTransition] = useTransition();

    const handleAction = (actionId: string) => {
        if (actionId === "like") {
            startTransition(() => toggleLike(id));
        } else if (actionId === "save") {
            startTransition(() => toggleSave(id));
        }
        console.log(`Action: ${actionId} for item ${id}`);
        setShowDropdown(false);
    };

    return (
        <div className="relative group">
            <Link
                href={`/pin/${id}`}
                onClick={(e) => { if (isLongPressing) e.preventDefault(); }}
                className={`group relative cursor-pointer overflow-hidden rounded-xl bg-background-alt border border-border transition-all duration-500 hover:border-neon-pink/20 hover:shadow-[0_0_10px_rgba(255,0,234,0.05)] dark:hover:border-neon-pink/30 dark:hover:shadow-[0_0_15px_rgba(255,0,234,0.15)] active:scale-95 block h-full ${isLongPressing ? 'pointer-events-none' : ''}`}
            >
                <img
                    src={url}
                    alt={title}
                    width={500}
                    height={height}
                    className="w-full h-auto transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-end p-4">
                    <span className="text-foreground font-medium text-sm truncate drop-shadow-md">{title}</span>
                </div>
            </Link>

            {/* Mobile Trigger + Dropdown */}
            <div className="md:hidden absolute bottom-3 right-3 z-30">
                <DropdownMenu open={showDropdown} onOpenChange={setShowDropdown}>
                    <DropdownMenuTrigger asChild>
                        <button
                            type="button"
                            className="h-10 w-10 glass rounded-full flex items-center justify-center text-foreground active:scale-90 transition-all touch-none select-none border border-neon-pink/30 outline-none"
                            onTouchStart={handleTouchStart}
                            onTouchEnd={handleTouchEnd}
                            onTouchMove={handleTouchMove}
                            onPointerDown={(e) => {
                                // Prevent Radix from opening the menu immediately on pointer down
                                e.preventDefault();
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (!isLongPressing) {
                                    setShowDropdown(true);
                                }
                            }}
                        >
                            <MoreHorizontal className="h-5 w-5" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="glass border-neon-pink/30 text-foreground min-w-[150px]" align="end" sideOffset={8}>
                        <DropdownMenuItem onClick={() => handleAction("save")} className="focus:bg-muted focus:text-neon-purple gap-2 cursor-pointer">
                            <Bookmark className="h-4 w-4" /> Save
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction("download")} className="focus:bg-muted focus:text-neon-purple gap-2 cursor-pointer">
                            <Download className="h-4 w-4" /> Download
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction("like")} className="focus:bg-muted focus:text-neon-pink gap-2 cursor-pointer">
                            <Heart className="h-4 w-4" /> Like
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction("share")} className="focus:bg-muted focus:text-green-500 gap-2 cursor-pointer">
                            <Share2 className="h-4 w-4" /> Share
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {radialMenu && (
                <LongPressRadialMenu
                    position={radialMenu}
                    onSelect={handleAction}
                    onClose={() => setRadialMenu(null)}
                />
            )}
        </div>
    );
}

export default function Feed({
    variant = "discover",
    items: initialItems
}: {
    variant?: "discover" | "created" | "saved" | "liked",
    items?: FeedItem[]
}) {
    const items = (initialItems && initialItems.length > 0)
        ? initialItems
        : (variant === "discover" ? dummyItems : []);

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center space-y-6 animate-in fade-in duration-700">
                <div className="h-24 w-24 rounded-full bg-background-alt border border-border flex items-center justify-center mb-4 transition-colors duration-[2000ms]">
                    {variant === "created" ? (
                        <Grid className="h-10 w-10 text-muted-foreground" />
                    ) : variant === "liked" ? (
                        <Heart className="h-10 w-10 text-muted-foreground" />
                    ) : (
                        <Bookmark className="h-10 w-10 text-muted-foreground" />
                    )}
                </div>
                <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-foreground">
                        {variant === "created" ? "Nothing here yet" : variant === "liked" ? "No liked pins" : "No saved pins"}
                    </h3>
                    <p className="text-muted-foreground max-w-sm mx-auto">
                        {variant === "created"
                            ? "Start creating and sharing your inspiration with the world."
                            : variant === "liked"
                                ? "Pins you like will appear here for you to revisit anytime."
                                : "Pins you save will appear here for easy access later."}
                    </p>
                </div>
                {variant === "created" && (
                    <Link href="/create">
                        <Button className="bg-neon-gradient text-white rounded-full px-8 font-bold h-12 shadow-[0_0_20px_rgba(157,0,255,0.3)] hover:shadow-[0_0_30px_rgba(157,0,255,0.5)] transition-all">
                            Create your first Pin
                        </Button>
                    </Link>
                )}
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-2 sm:px-4 py-8">
            <div className="columns-2 md:columns-3 lg:columns-4 gap-2 sm:gap-4 lg:gap-6">
                {items.map((item) => (
                    <div key={item.id} className="break-inside-avoid mb-2 sm:mb-4 lg:mb-6">
                        {item.type === "video" ? (
                            <VideoFeedItem id={item.id} url={item.url} title={item.title} />
                        ) : (
                            <ImageFeedItem id={item.id} url={item.url} title={item.title} height={item.height} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
