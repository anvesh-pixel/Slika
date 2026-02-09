"use client";

import React, { useRef, useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    ChevronLeft,
    MoreHorizontal,
    Share2,
    Heart,
    Download,
    MessageCircle,
    Send,
    Play,
    Pause,
    Volume2,
    VolumeX,
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
import "./like-button.css";

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
    const scrollRef = useRef<HTMLDivElement>(null);

    // Layout & Media States
    const [aspectRatio, setAspectRatio] = useState<number>(0); // width / height
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);

    // Interaction States
    const [isLiked, setIsLiked] = useState(initialIsLiked);
    const [isSaved, setIsSaved] = useState(initialIsSaved);
    const [comments, setComments] = useState<Comment[]>(initialComments);
    const [commentText, setCommentText] = useState("");
    const [isPending, startTransition] = useTransition();

    const displayName = pin.user.username || "Anonymous";
    const authorAvatar = pin.user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${pin.user.id}`;

    // Sync comments when initialComments changes (from server revalidation)
    useEffect(() => {
        setComments(initialComments);
    }, [initialComments]);

    // Video Logic
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleTimeUpdate = () => {
            if (video) {
                setProgress((video.currentTime / video.duration) * 100);
            }
        };

        const handleLoadedMetadata = () => {
            if (video) {
                setDuration(video.duration);
                setAspectRatio(video.videoWidth / video.videoHeight);
            }
        };

        video.addEventListener("timeupdate", handleTimeUpdate);
        video.addEventListener("loadedmetadata", handleLoadedMetadata);

        return () => {
            video.removeEventListener("timeupdate", handleTimeUpdate);
            video.removeEventListener("loadedmetadata", handleLoadedMetadata);
        };
    }, [pin.type]);

    const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const img = e.currentTarget;
        setAspectRatio(img.naturalWidth / img.naturalHeight);
    };

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) videoRef.current.pause();
            else videoRef.current.play();
            setIsPlaying(!isPlaying);
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    // Actions
    const handleLike = () => {
        startTransition(async () => {
            setIsLiked(!isLiked);
            try {
                await toggleLike(pin.id);
            } catch (error) {
                setIsLiked(isLiked);
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
                setIsSaved(isSaved);
                console.error("Save failed:", error);
            }
        });
    };

    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim() || isPending) return;

        const content = commentText;
        setCommentText("");

        startTransition(async () => {
            try {
                const newComment = await addComment(pin.id, content);
                setComments(prev => [newComment as any, ...prev]);
                scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
            } catch (error) {
                console.error("Comment failed:", error);
            }
        });
    };

    // Layout Decision: Ratio > 1.2 is Landscape
    const isLandscape = aspectRatio > 1.2;

    return (
        <div className="min-h-screen bg-background text-foreground font-sans transition-colors duration-[2000ms]">
            {/* Top Navigation Bar (Minimal) */}
            <div className="fixed top-0 left-0 right-0 z-50 p-6 pointer-events-none">
                <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full bg-background-alt/40 backdrop-blur-xl text-foreground hover:bg-background-alt/60 w-12 h-12 border border-border pointer-events-auto shadow-sm"
                    onClick={() => router.back()}
                >
                    <ChevronLeft className="h-6 w-6" />
                </Button>
            </div>

            <main className={cn(
                "w-full max-w-screen-2xl mx-auto flex flex-col md:p-8 pt-24",
                isLandscape ? "lg:flex-col items-center" : "lg:flex-row lg:items-start lg:justify-center gap-12"
            )}>

                {/* Media Section */}
                <div className={cn(
                    "relative flex items-center justify-center bg-background-alt/30 rounded-[2rem] overflow-hidden group transition-all duration-700",
                    isLandscape ? "w-full max-w-5xl aspect-video mb-12" : "w-full lg:w-[600px] xl:w-[700px] aspect-[4/5] md:aspect-auto"
                )}>
                    {pin.type === "video" ? (
                        <div className="w-full h-full flex items-center justify-center relative cursor-pointer" onClick={togglePlay}>
                            <video
                                ref={videoRef}
                                src={pin.imageUrl}
                                autoPlay
                                muted={isMuted}
                                loop
                                playsInline
                                className="w-full h-full object-contain"
                                onPlay={() => setIsPlaying(true)}
                                onPause={() => setIsPlaying(false)}
                            />

                            {/* Minimalism Video Controls */}
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] flex flex-col gap-3 p-4 rounded-3xl bg-black/20 backdrop-blur-xl border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <Slider
                                    value={[progress]}
                                    max={100}
                                    step={0.1}
                                    onValueChange={(v) => {
                                        if (videoRef.current) {
                                            videoRef.current.currentTime = (v[0] / 100) * duration;
                                            setProgress(v[0]);
                                        }
                                    }}
                                    className="cursor-pointer"
                                />
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <button onClick={(e) => { e.stopPropagation(); togglePlay(); }} className="text-white">
                                            {isPlaying ? <Pause className="h-5 w-5 fill-white" /> : <Play className="h-5 w-5 fill-white" />}
                                        </button>
                                        <button onClick={(e) => { e.stopPropagation(); toggleMute(); }} className="text-white">
                                            {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                                        </button>
                                    </div>
                                    <span className="text-[10px] font-black text-white/50 bg-white/10 px-2 py-1 rounded-md">
                                        {Math.floor(videoRef.current?.currentTime || 0)}S / {Math.floor(duration)}S
                                    </span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <img
                            src={pin.imageUrl}
                            alt={pin.title}
                            onLoad={handleImageLoad}
                            className="w-full h-full object-contain rounded-[2rem] hover:scale-[1.01] transition-transform duration-700"
                        />
                    )}
                </div>

                {/* Details Section (The Embed) */}
                <div className={cn(
                    "flex flex-col bg-background-alt/20 lg:bg-transparent p-8 md:p-0 min-h-screen md:min-h-0",
                    isLandscape ? "w-full max-w-3xl" : "w-full lg:w-[450px] shrink-0 sticky top-24"
                )}>
                    {/* Primary Actions Row */}
                    <div className="flex items-center justify-between mb-10 pb-6 border-b border-border/10">
                        <div className="flex items-center gap-2">
                            <div className="con-like shrink-0">
                                <input
                                    className="like"
                                    type="checkbox"
                                    title="like"
                                    checked={isLiked}
                                    onChange={handleLike}
                                    disabled={isPending}
                                />
                                <div className="checkmark">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="outline" viewBox="0 0 24 24">
                                        <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Zm-3.585,18.4a2.973,2.973,0,0,1-3.83,0C4.947,16.006,2,11.87,2,8.967a4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,11,8.967a1,1,0,0,0,2,0,4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,22,8.967C22,11.87,19.053,16.006,13.915,20.313Z"></path>
                                    </svg>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="filled" viewBox="0 0 24 24">
                                        <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Z"></path>
                                    </svg>
                                    <svg xmlns="http://www.w3.org/2000/svg" height="100" width="100" className="celebrate">
                                        <polygon className="poly" points="10,10 20,20"></polygon>
                                        <polygon className="poly" points="10,50 20,50"></polygon>
                                        <polygon className="poly" points="20,80 30,70"></polygon>
                                        <polygon className="poly" points="90,10 80,20"></polygon>
                                        <polygon className="poly" points="90,50 80,50"></polygon>
                                        <polygon className="poly" points="80,80 70,70"></polygon>
                                    </svg>
                                </div>
                            </div>
                            <span className={cn("text-sm font-black transition-colors duration-300", isLiked ? "text-red-500" : "text-foreground")}>
                                {isLiked ? 'Liked' : 'Like'}
                            </span>
                            <div className="flex items-center gap-2 ml-2">
                                <button className="p-3 bg-foreground/5 hover:bg-foreground/10 text-foreground rounded-2xl transition-all">
                                    <Share2 className="h-5 w-5" />
                                </button>
                                <button className="p-3 bg-foreground/5 hover:bg-foreground/10 text-foreground rounded-2xl transition-all">
                                    <Download className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                        <label className="relative shrink-0 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={isSaved}
                                onChange={handleSave}
                                disabled={isPending}
                                className="peer hidden"
                            />
                            <div className={cn(
                                "group flex w-fit items-center gap-2 overflow-hidden rounded-full border border-foreground p-2 px-5 font-black text-foreground transition-all active:scale-90",
                                "peer-checked:bg-foreground peer-checked:text-background",
                                isPending && "opacity-50 pointer-events-none"
                            )}>
                                <div className="z-10 transition group-hover:translate-x-4 uppercase tracking-tighter text-sm">
                                    {isSaved ? "Saved" : "Save"}
                                </div>
                                <svg
                                    className={cn(
                                        "size-6 transition group-hover:-translate-x-6 group-hover:-translate-y-3 group-hover:scale-[750%] duration-500",
                                        isSaved ? "fill-current" : "fill-none"
                                    )}
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
                                    />
                                </svg>
                            </div>
                        </label>
                    </div>

                    {/* Metadata */}
                    <div className="space-y-6 mb-12">
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-none text-foreground">
                            {pin.title}
                        </h1>
                        <p className="text-lg text-muted-foreground font-bold leading-relaxed opacity-70">
                            {pin.description || "No description provided."}
                        </p>
                    </div>

                    {/* Author Section */}
                    <div className="flex items-center justify-between p-4 bg-foreground/5 rounded-3xl mb-12 border border-border/5">
                        <Link href={`/profile/${pin.user.username}`} className="flex items-center gap-3">
                            <Avatar className="h-12 w-12 border-2 border-background shadow-lg">
                                <AvatarImage src={authorAvatar} />
                                <AvatarFallback className="bg-muted text-foreground font-black">{displayName.slice(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-black text-foreground text-base tracking-tight">{displayName}</p>
                                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest opacity-50">Content Creator</p>
                            </div>
                        </Link>
                        {!isOwnPin && (
                            <Button
                                variant="outline"
                                className="rounded-2xl font-black border-border/10 text-sm hover:bg-foreground hover:text-background h-10 px-6"
                            >
                                Follow
                            </Button>
                        )}
                    </div>

                    {/* Comments Thread */}
                    <div className="flex-1 min-h-[300px] flex flex-col">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-black text-foreground tracking-tight">Discussion</h3>
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-foreground/5 rounded-full">
                                <MessageCircle className="h-3.5 w-3.5 text-muted-foreground" />
                                <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{comments.length}</span>
                            </div>
                        </div>

                        <div
                            ref={scrollRef}
                            className="space-y-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar flex flex-col-reverse"
                        >
                            {comments.length > 0 ? (
                                comments.map((comment) => (
                                    <div key={comment.id} className="flex gap-4 group/comment animate-in fade-in slide-in-from-bottom-2 duration-300">
                                        <Avatar className="h-9 w-9 shrink-0 border border-border/5">
                                            <AvatarImage src={comment.user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.user.id}`} />
                                            <AvatarFallback className="bg-muted text-foreground text-xs">{comment.user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-black text-foreground tracking-tight">{comment.user.username}</p>
                                                <p className="text-[9px] text-muted-foreground font-bold uppercase opacity-30">
                                                    {new Date(comment.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                </p>
                                            </div>
                                            <p className="text-sm text-muted-foreground leading-relaxed font-bold opacity-80">{comment.content}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center py-10 opacity-20 bg-foreground/5 rounded-[2rem] border border-dashed border-border/50">
                                    <MessageCircle className="h-10 w-10 mb-2" />
                                    <p className="text-xs font-black uppercase tracking-widest">No thoughts yet</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Floating Comment Box (Premium Design) */}
                    <form
                        onSubmit={handleAddComment}
                        className="mt-12 group/input relative"
                    >
                        <div className="absolute inset-0 bg-neon-purple/20 blur-2xl opacity-0 group-focus-within/input:opacity-100 transition-opacity duration-700 pointer-events-none" />
                        <div className="relative flex items-center gap-3 bg-background-alt/40 border border-border/40 backdrop-blur-2xl rounded-3xl p-2 pl-4 shadow-2xl transition-all duration-500 group-focus-within/input:border-neon-purple/50 group-focus-within/input:bg-background-alt/60">
                            <input
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Share your thoughts..."
                                className="flex-1 bg-transparent border-none text-sm text-foreground font-bold placeholder:text-muted-foreground focus:outline-none py-3"
                            />
                            <button
                                type="submit"
                                disabled={!commentText.trim() || isPending}
                                className={cn(
                                    "h-10 w-10 flex items-center justify-center rounded-2xl transition-all duration-300",
                                    commentText.trim() ? "bg-neon-gradient text-white shadow-lg active:scale-90" : "bg-foreground/5 text-muted-foreground opacity-30"
                                )}
                            >
                                <Send className="h-5 w-5" />
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
