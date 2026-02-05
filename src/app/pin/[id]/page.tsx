"use client";

import React, { useRef, useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    ChevronLeft,
    MoreHorizontal,
    Share2,
    MessageCircle,
    Play,
    Pause,
    Volume2,
    VolumeX
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Slider } from "@/components/ui/slider";
import { dummyItems } from "@/components/feed";

export default function PinPage() {
    const params = useParams();
    const router = useRouter();
    const pinId = params.id;
    const item = dummyItems.find((i) => i.id.toString() === pinId);

    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleTimeUpdate = () => {
            setProgress((video.currentTime / video.duration) * 100);
        };

        const handleLoadedMetadata = () => {
            setDuration(video.duration);
        };

        video.addEventListener("timeupdate", handleTimeUpdate);
        video.addEventListener("loadedmetadata", handleLoadedMetadata);

        return () => {
            video.removeEventListener("timeupdate", handleTimeUpdate);
            video.removeEventListener("loadedmetadata", handleLoadedMetadata);
        };
    }, [item]);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const handleSliderChange = (value: number[]) => {
        if (videoRef.current) {
            const newTime = (value[0] / 100) * duration;
            videoRef.current.currentTime = newTime;
            setProgress(value[0]);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4 md:p-8">
            <div className="max-w-6xl w-full glass-dark rounded-[32px] overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[600px] border border-white/5">
                {/* Left Column: Media (60%) */}
                <div className="md:w-[60%] bg-white/5 flex items-center justify-center relative overflow-hidden group min-h-[400px] md:min-h-[600px]">
                    {item?.type === "video" ? (
                        <div className="relative w-full h-full flex items-center justify-center bg-black">
                            <video
                                ref={videoRef}
                                src={item.url}
                                autoPlay
                                muted={isMuted}
                                loop
                                playsInline
                                className="max-w-full max-h-full object-contain"
                                onPlay={() => setIsPlaying(true)}
                                onPause={() => setIsPlaying(false)}
                            />

                            {/* Custom Video Controls Overlay */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6 space-y-4">
                                {/* Timeline */}
                                <div className="flex items-center gap-4 text-white">
                                    <Slider
                                        value={[progress]}
                                        max={100}
                                        step={0.1}
                                        onValueChange={handleSliderChange}
                                        className="flex-1 cursor-pointer"
                                    />
                                </div>

                                {/* Control Buttons */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-white hover:bg-white/20 rounded-full h-12 w-12"
                                            onClick={togglePlay}
                                        >
                                            {isPlaying ? (
                                                <Pause className="h-6 w-6 fill-white" />
                                            ) : (
                                                <Play className="h-6 w-6 fill-white" />
                                            )}
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-white hover:bg-white/20 rounded-full h-12 w-12"
                                            onClick={toggleMute}
                                        >
                                            {isMuted ? (
                                                <VolumeX className="h-6 w-6" />
                                            ) : (
                                                <Volume2 className="h-6 w-6" />
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <img
                            src={item ? item.url : `https://picsum.photos/seed/${pinId}/1200/1600`}
                            alt={item?.title || "Detail"}
                            className="max-w-full max-h-full object-contain drop-shadow-2xl transition-transform duration-700 hover:scale-105"
                        />
                    )}
                </div>

                {/* Right Column: Interaction Panel (40%) */}
                <div className="md:w-[40%] flex flex-col h-full bg-transparent relative border-l border-white/5">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 sticky top-0 bg-transparent z-10">
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full text-white hover:bg-white/10"
                                onClick={() => router.back()}
                            >
                                <ChevronLeft className="h-6 w-6" />
                            </Button>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" className="rounded-full text-white hover:bg-white/10">
                                <Share2 className="h-5 w-5" />
                            </Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="rounded-full text-white hover:bg-white/10">
                                        <MoreHorizontal className="h-5 w-5" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="glass-dark border-white/10 text-white">
                                    <DropdownMenuItem className="hover:bg-white/10 cursor-pointer">Download Media</DropdownMenuItem>
                                    <DropdownMenuItem className="hover:bg-white/10 cursor-pointer text-red-400">Report Pin</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto px-8 py-4 space-y-6 pb-24 text-white">
                        {/* Title & Description */}
                        <div className="space-y-3">
                            <h1 className="text-3xl font-bold tracking-tight text-white leading-tight">
                                {item?.title || "Stunning Visual Inspiration"}
                            </h1>
                            <p className="text-gray-400 leading-relaxed font-medium">
                                Exploring the beauty of nature and architecture through a unique lens.
                                This piece captures the essence of tranquility and modern design.
                            </p>
                        </div>

                        {/* Uploader Info */}
                        <div className="flex items-center justify-between pt-6 border-t border-white/10">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-12 w-12 border border-white/20">
                                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${pinId}`} />
                                    <AvatarFallback className="bg-white/10">JD</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold text-white">Jane Doe</p>
                                    <p className="text-sm text-gray-500 font-medium tracking-wide leading-none">24k followers</p>
                                </div>
                            </div>
                            <Button variant="secondary" className="rounded-full font-bold bg-white/10 text-white hover:bg-white/20 border-white/5 h-10 px-6">
                                Follow
                            </Button>
                        </div>

                        {/* Comments Placeholder */}
                        <div className="pt-8 border-t border-white/10">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold tracking-tight">Comments</h3>
                                <span className="text-gray-500 font-medium">0 comments</span>
                            </div>
                            <div className="flex flex-col items-center justify-center py-12 text-center space-y-3 opacity-40">
                                <MessageCircle className="h-10 w-10 text-gray-400" />
                                <p className="text-sm font-medium">No comments yet. Be the first to share what you think!</p>
                            </div>
                        </div>
                    </div>

                    {/* Sticky Bottom Bar */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 glass-dark border-t border-white/10 flex items-center justify-end">
                        <Button className="bg-neon-gradient hover:opacity-90 text-white font-bold rounded-full px-10 py-6 text-lg shadow-[0_0_20px_rgba(157,0,255,0.3)] hover:shadow-[0_0_35px_rgba(255,0,234,0.6)] transition-all">
                            Save
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
