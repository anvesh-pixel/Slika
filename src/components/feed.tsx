"use client";

import React, { useRef } from "react";
import Link from "next/link";

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
    { type: "image", id: 9, height: 900, url: "https://picsum.photos/seed/7/500/900", title: "Starry night" },
    { type: "image", id: 10, height: 550, url: "https://picsum.photos/seed/8/500/550", title: "Rainy window" },
    { type: "image", id: 11, height: 750, url: "https://picsum.photos/seed/9/500/750", title: "Coffee break" },
    { type: "image", id: 12, height: 650, url: "https://picsum.photos/seed/10/500/650", title: "Neon streets" },
];

function VideoFeedItem({ id, url, title }: { id: number; url: string; title: string }) {
    const videoRef = useRef<HTMLVideoElement>(null);

    const handleMouseEnter = () => {
        videoRef.current?.play().catch((err) => console.log("Video play interrupted", err));
    };

    const handleMouseLeave = () => {
        videoRef.current?.pause();
    };

    return (
        <Link
            href={`/pin/${id}`}
            className="break-inside-avoid group relative cursor-pointer overflow-hidden rounded-xl bg-white/5 border border-white/10 transition-all duration-500 hover:border-neon-purple/50 hover:shadow-[0_0_20px_rgba(157,0,255,0.2)] active:scale-95 mb-4 block"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <video
                ref={videoRef}
                src={url}
                muted
                loop
                playsInline
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-end p-4">
                <span className="text-white font-medium text-sm truncate drop-shadow-md">{title}</span>
            </div>
            {/* Video Indicator */}
            <div className="absolute top-3 right-3 glass-dark rounded-full p-1.5 text-white opacity-80 group-hover:opacity-0 transition-opacity">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M16 3a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3zM9 13H2V3h7v10zm7-10v10l-6-5 6-5z" />
                </svg>
            </div>
        </Link>
    );
}

function ImageFeedItem({ id, url, title, height }: { id: number; url: string; title: string; height: number }) {
    return (
        <Link
            href={`/pin/${id}`}
            className="break-inside-avoid group relative cursor-pointer overflow-hidden rounded-xl bg-white/5 border border-white/10 transition-all duration-500 hover:border-neon-pink/50 hover:shadow-[0_0_20px_rgba(255,0,234,0.2)] active:scale-95 mb-4 block"
        >
            <img
                src={url}
                alt={title}
                width={500}
                height={height}
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-end p-4">
                <span className="text-white font-medium text-sm truncate drop-shadow-md">{title}</span>
            </div>
        </Link>
    );
}

export default function Feed({ variant = "created" }: { variant?: "created" | "saved" }) {
    console.log(`Feed variant: ${variant}`);
    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="columns-2 md:columns-3 lg:columns-4 gap-4">
                {dummyItems.map((item) => (
                    item.type === "video" ? (
                        <VideoFeedItem key={item.id} id={item.id} url={item.url} title={item.title} />
                    ) : (
                        <ImageFeedItem key={item.id} id={item.id} url={item.url} title={item.title} height={item.height} />
                    )
                ))}
            </div>
        </div>
    );
}
