"use client";

import React, { useRef, useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    ChevronLeft,
    MoreHorizontal,
    Share2,
    MessageCircle,
    Play,
    Pause,
    Volume2,
    VolumeX,
    Heart,
    Download,
    Bookmark,
    Send,
    Grid
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
import { cn } from "@/lib/utils";
import { toggleLike, toggleSave, addComment } from "@/app/actions/interaction";

interface Comment {
    id: number;
    content: string;
    createdAt: string;
    user: {
        id: string;
        username: string;
        avatarUrl: string | null;
    };
}

interface PinClientProps {
    pin: {
        id: number;
        title: string;
        description: string | null;
        imageUrl: string;
        type: string;
        user: {
            id: string;
            username: string | null;
            avatarUrl: string | null;
        };
    };
    isOwnPin: boolean;
    initialIsLiked: boolean;
    initialIsSaved: boolean;
    initialComments: Comment[];
}

export default function PinClient({
    pin,
    isOwnPin,
    initialIsLiked,
    initialIsSaved,
    initialComments
}: PinClientProps) {
    const router = useRouter();
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [isLiked, setIsLiked] = useState(initialIsLiked);
    const [isSaved, setIsSaved] = useState(initialIsSaved);
    const [comments, setComments] = useState<Comment[]>(initialComments);
    const [commentText, setCommentText] = useState("");
    const [isPending, startTransition] = useTransition();
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);

    const displayName = pin.user.username || "Anonymous";
    const authorAvatar = pin.user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${pin.user.id}`;

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
    }, []);

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

    const handleLike = () => {
        startTransition(async () => {
            setIsLiked(!isLiked);
            try {
                await toggleLike(pin.id);
            } catch (error) {
                setIsLiked(isLiked); // Rollback
                console.error("Like failed:", error);
            }
        });
    };

    const handleSave = () => {
        startTransition(async () => {
            setIsSaved(!isSaved);
            try {
                await toggleSave(pin.id);
            } catch (error) {
                setIsSaved(isSaved); // Rollback
                console.error("Save failed:", error);
            }
        });
    };

    const handleAddComment = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!commentText.trim()) return;

        const content = commentText;
        setCommentText("");

        startTransition(async () => {
            try {
                const newComment = await addComment(pin.id, content);
                // The comment will be re-fetched by Server Component due to revalidatePath
                // But we can optimistically update or let the refresh handle it.
                // Since revalidatePath is used, the parent will pass new initialComments.
            } catch (error) {
                console.error("Comment failed:", error);
            }
        });
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-0 md:p-8 font-sans">
            <div className="max-w-7xl w-full md:glass-dark md:rounded-[40px] overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-screen md:min-h-[750px] md:border md:border-white/5 relative">

                {/* Left Column: Media Section */}
                <div className="md:w-[55%] lg:w-[60%] bg-[#0a0a0a] flex items-center justify-center relative overflow-hidden group">
                    <div
                        className="absolute inset-0 opacity-20 blur-3xl scale-150 pointer-events-none"
                        style={{
                            backgroundImage: `url(${pin.imageUrl})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}
                    />

                    {pin.type === "video" ? (
                        <div className="relative w-full h-full flex items-center justify-center z-10">
                            <video
                                ref={videoRef}
                                src={pin.imageUrl}
                                autoPlay
                                muted={isMuted}
                                loop
                                playsInline
                                className="max-w-full max-h-[85vh] md:max-h-full object-contain pointer-events-auto shadow-2xl"
                                onPlay={() => setIsPlaying(true)}
                                onPause={() => setIsPlaying(false)}
                                onClick={togglePlay}
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6 md:p-10 space-y-4 font-bold">
                                <div className="flex items-center gap-4">
                                    <Slider
                                        value={[progress]}
                                        max={100}
                                        step={0.1}
                                        onValueChange={handleSliderChange}
                                        className="flex-1 cursor-pointer"
                                    />
                                    <span className="text-[10px] font-bold text-white/70 w-8 tabular-nums">
                                        {Math.floor(videoRef.current?.currentTime || 0)}s
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <button onClick={togglePlay} className="p-2 text-white hover:scale-110 transition-transform">
                                            {isPlaying ? <Pause className="h-6 w-6 fill-white" /> : <Play className="h-6 w-6 fill-white" />}
                                        </button>
                                        <button onClick={toggleMute} className="p-2 text-white hover:scale-110 transition-transform">
                                            {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="relative z-10 p-4 md:p-8 flex items-center justify-center w-full h-full">
                            <img
                                src={pin.imageUrl}
                                alt={pin.title}
                                className="max-w-full max-h-[85vh] md:max-h-[700px] object-contain rounded-2xl md:rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-transform duration-700 hover:scale-[1.02] active:scale-100"
                                loading="eager"
                            />
                        </div>
                    )}

                    <div className="absolute top-6 left-6 z-20">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full bg-black/20 backdrop-blur-md text-white hover:bg-white/10 w-12 h-12 border border-white/5"
                            onClick={() => router.back()}
                        >
                            <ChevronLeft className="h-7 w-7" />
                        </Button>
                    </div>
                </div>

                {/* Right Column: Interaction Panel */}
                <div className="md:w-[45%] lg:w-[40%] flex flex-col h-full bg-black md:bg-transparent relative z-20">
                    <div className="flex items-center justify-between p-6 md:p-8 border-b border-white/5 bg-black/20 backdrop-blur-md font-bold">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleLike}
                                disabled={isPending}
                                className={cn(
                                    "flex items-center justify-center p-3 rounded-full transition-all active:scale-75",
                                    isLiked ? "text-neon-pink bg-white/5 shadow-[0_0_15px_rgba(255,0,234,0.3)]" : "text-white hover:bg-white/10"
                                )}
                            >
                                <Heart className={cn("h-6 w-6", isLiked ? "fill-neon-pink" : "")} />
                            </button>
                            <button className="p-3 text-white hover:bg-white/10 rounded-full transition-all">
                                <Download className="h-6 w-6" />
                            </button>
                            <button className="p-3 text-white hover:bg-white/10 rounded-full transition-all">
                                <Share2 className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="flex items-center gap-3">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="rounded-full text-white hover:bg-white/10 h-10 w-10">
                                        <MoreHorizontal className="h-5 w-5" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="glass-dark border-white/10 text-white min-w-[180px]">
                                    <DropdownMenuItem className="hover:bg-white/10 cursor-pointer py-3 px-4 text-red-400 font-bold">
                                        Report Pin
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <Button
                                className={cn(
                                    "rounded-full font-black px-8 h-12 transition-all shadow-lg text-base",
                                    isSaved ? "bg-white text-black" : "bg-neon-gradient text-white hover:opacity-90"
                                )}
                                onClick={handleSave}
                                disabled={isPending}
                            >
                                {isSaved ? "Saved" : "Save"}
                            </Button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto px-6 md:px-10 py-8 space-y-10 custom-scrollbar">
                        <div className="space-y-4">
                            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white leading-[1.1]">
                                {pin.title}
                            </h1>
                            <p className="text-gray-400 leading-relaxed text-base md:text-lg font-bold opacity-80">
                                {pin.description || "No description provided."}
                            </p>
                        </div>

                        <div className="flex items-center justify-between py-6 border-y border-white/5">
                            <Link href={`/profile/${pin.user.username}`} className="flex items-center gap-4 group/author cursor-pointer">
                                <Avatar className="h-14 w-14 border-2 border-white/10 group-hover/author:border-neon-purple transition-all duration-300 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                                    <AvatarImage src={authorAvatar} />
                                    <AvatarFallback className="bg-white/10 text-white font-bold">{displayName.slice(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-black text-white text-lg group-hover/author:text-neon-purple transition-colors">{displayName}</p>
                                    <p className="text-xs text-gray-500 font-black uppercase tracking-[0.2em]">Collector</p>
                                </div>
                            </Link>
                            {!isOwnPin && (
                                <Button
                                    variant="outline"
                                    className="rounded-full font-black border-white/10 text-white hover:bg-white hover:text-black hover:border-white h-11 px-8 transition-all active:scale-95"
                                >
                                    Follow
                                </Button>
                            )}
                        </div>

                        {/* Comments Section */}
                        <div className="space-y-8 pb-10">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-black tracking-tight text-white/90">Discussion</h3>
                                <span className="text-gray-500 font-black text-sm uppercase tracking-widest">{comments.length} Comments</span>
                            </div>

                            {comments.length > 0 ? (
                                <div className="space-y-8">
                                    {comments.map((comment) => (
                                        <div key={comment.id} className="flex gap-4 group/comment">
                                            <Avatar className="h-10 w-10 shrink-0 border border-white/5 transition-transform group-hover/comment:scale-105">
                                                <AvatarImage src={comment.user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.user.id}`} />
                                                <AvatarFallback className="bg-white/5 text-white text-xs">{comment.user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 space-y-1">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-sm font-black text-white hover:text-neon-purple transition-colors cursor-pointer">{comment.user.username}</p>
                                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">
                                                        {new Date(comment.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                    </p>
                                                </div>
                                                <p className="text-sm text-gray-300 leading-relaxed font-bold opacity-90">{comment.content}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-10 text-center space-y-4 opacity-30">
                                    <MessageCircle className="h-10 w-10 text-gray-500" />
                                    <p className="text-gray-500 font-black text-sm uppercase tracking-widest">No thoughts yet</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Input */}
                    <form onSubmit={handleAddComment} className="p-6 border-t border-white/5 bg-black/40 backdrop-blur-xl flex items-center gap-3">
                        <Avatar className="h-10 w-10 border border-white/10 shrink-0 shadow-lg">
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=viewer`} />
                            <AvatarFallback className="bg-white/5 text-white">U</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 relative group/input">
                            <input
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Share your thoughts..."
                                className="w-full bg-white/5 border border-white/10 rounded-2xl h-12 pl-5 pr-12 text-sm text-white font-bold placeholder:text-gray-600 focus:outline-none focus:border-neon-purple/50 focus:bg-white/[0.08] transition-all"
                            />
                            <button
                                type="submit"
                                disabled={!commentText.trim() || isPending}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-neon-purple hover:scale-110 disabled:opacity-30 disabled:hover:scale-100 transition-all font-bold"
                            >
                                <Send className="h-5 w-5" />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
