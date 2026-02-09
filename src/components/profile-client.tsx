"use client";

import React, { useState } from "react";
import { UserButton } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Feed from "@/components/feed";
import { UserPlus, UserMinus, Share2, Grid, Bookmark, Heart, Settings, MoreHorizontal, Plus, Loader2 } from "lucide-react";
import EditProfileDialog from "@/components/edit-profile-dialog";
import { toggleFollow } from "@/app/actions/user";
import { useTransition } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { cn } from "@/lib/utils";

interface ProfileClientProps {
    username: string;
    displayName: string;
    bio: string;
    avatarUrl: string;
    userId: string; // The database ID of the user whose profile this is
    stats: {
        posts: number;
        followers: number;
        following: number;
    };
    isOwnProfile: boolean;
    isFollowing: boolean;
    createdItems: any[];
    savedItems: any[];
    likedItems: any[];
}

export default function ProfileClient({
    username,
    displayName,
    bio,
    avatarUrl,
    userId,
    stats,
    isOwnProfile,
    isFollowing: initialIsFollowing,
    createdItems,
    savedItems,
    likedItems
}: ProfileClientProps) {
    const [activeTab, setActiveTab] = useState("created");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
    const [isPending, startTransition] = useTransition();

    const handle = `@${username.toLowerCase()}`;

    const handleFollowToggle = () => {
        setIsFollowing(!isFollowing); // Optimistic update
        startTransition(async () => {
            try {
                await toggleFollow(userId);
            } catch (error) {
                setIsFollowing(isFollowing); // Revert on error
                console.error("Failed to toggle follow:", error);
            }
        });
    };

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-[2000ms]">
            <div className="max-w-7xl mx-auto px-4 pt-12 md:pt-20">
                {/* Header Section */}
                <div className="flex flex-col items-center md:items-center md:text-center space-y-6 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {/* Top Row: Avatar and Stats (Mobile Only layout) / Stacked (Desktop) */}
                    <div className="flex flex-row md:flex-col items-center justify-center gap-6 md:gap-8 w-full">
                        <button
                            onClick={() => isOwnProfile && setIsEditModalOpen(true)}
                            className={`relative group outline-none shrink-0 ${isOwnProfile ? "cursor-pointer" : "cursor-default"}`}
                        >
                            <div className="absolute -inset-1 bg-neon-gradient rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                            <Avatar className="h-24 w-24 md:h-[150px] md:w-[150px] border-4 border-background relative">
                                <AvatarImage src={avatarUrl} alt={displayName} />
                                <AvatarFallback className="bg-muted text-foreground text-2xl">{displayName.slice(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            {isOwnProfile && (
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                    <div className="bg-black/40 backdrop-blur-sm rounded-full p-2">
                                        <Grid className="h-6 w-6 text-white" />
                                    </div>
                                </div>
                            )}
                        </button>

                        {/* Mobile Stats (Horizontal) */}
                        <div className="flex md:hidden flex-1 items-center justify-around text-center">
                            <div className="flex flex-col items-center">
                                <span className="font-black text-foreground text-xl">{stats.posts}</span>
                                <span className="text-muted-foreground text-[10px] uppercase tracking-widest font-bold">Posts</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="font-black text-foreground text-xl">{stats.followers}</span>
                                <span className="text-muted-foreground text-[10px] uppercase tracking-widest font-bold">Followers</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="font-black text-foreground text-xl">{stats.following}</span>
                                <span className="text-muted-foreground text-[10px] uppercase tracking-widest font-bold">Following</span>
                            </div>
                        </div>
                    </div>

                    {/* Info Section: Name and Bio */}
                    <div className="space-y-4 text-left md:text-center w-full">
                        <div className="space-y-1">
                            <h1 className="text-2xl md:text-5xl font-bold tracking-tight text-foreground transition-colors duration-[2000ms]">{displayName}</h1>
                            <p className="text-neon-purple font-medium text-lg md:text-xl">{handle}</p>
                        </div>

                        <p className="max-w-md text-muted-foreground text-sm md:text-lg leading-relaxed mx-0 md:mx-auto">
                            {bio}
                        </p>
                    </div>

                    {/* Desktop Stats (Bulky) */}
                    <div className="hidden md:flex items-center gap-10 text-lg">
                        <div className="flex flex-col items-center">
                            <span className="font-black text-foreground text-2xl">{stats.posts}</span>
                            <span className="text-muted-foreground text-sm uppercase tracking-widest font-bold">Posts</span>
                        </div>
                        <div className="h-8 w-[1px] bg-border"></div>
                        <div className="flex flex-col items-center">
                            <span className="font-black text-foreground text-2xl">{stats.followers}</span>
                            <span className="text-muted-foreground text-sm uppercase tracking-widest font-bold">Followers</span>
                        </div>
                        <div className="h-8 w-[1px] bg-border"></div>
                        <div className="flex flex-col items-center">
                            <span className="font-black text-foreground text-2xl">{stats.following}</span>
                            <span className="text-muted-foreground text-sm uppercase tracking-widest font-bold">Following</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 md:gap-4 justify-start md:justify-center pt-2 w-full md:w-auto">
                        {!isOwnProfile ? (
                            <Button
                                onClick={handleFollowToggle}
                                disabled={isPending}
                                className={cn(
                                    "flex-1 md:flex-none rounded-full px-8 font-bold h-10 md:h-12 transition-all shadow-xl active:scale-95",
                                    isFollowing
                                        ? "bg-white/10 hover:bg-white/20 text-white border border-white/10"
                                        : "bg-neon-purple hover:bg-neon-purple/80 text-white shadow-[0_0_20px_rgba(157,0,255,0.3)] hover:shadow-[0_0_30px_rgba(157,0,255,0.5)]"
                                )}
                            >
                                {isFollowing ? (
                                    <><UserMinus className="mr-2 h-4 w-4 md:h-5 md:w-5" /> Unfollow</>
                                ) : (
                                    <><UserPlus className="mr-2 h-4 w-4 md:h-5 md:w-5" /> Follow</>
                                )}
                            </Button>
                        ) : (
                            <div className="flex flex-1 md:flex-none gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setIsEditModalOpen(true)}
                                    className="flex-1 border-border bg-background-alt hover:bg-muted rounded-full px-8 font-bold text-foreground h-10 md:h-12 transition-all shadow-lg active:scale-95"
                                >
                                    Edit Profile
                                </Button>
                                <Button
                                    asChild
                                    className="bg-neon-gradient hover:opacity-90 text-white rounded-full px-8 font-extrabold h-10 md:h-12 transition-all shadow-[0_0_25px_rgba(157,0,255,0.4)] hover:shadow-[0_0_40px_rgba(157,0,255,0.6)] active:scale-95 animate-in fade-in zoom-in duration-500"
                                >
                                    <a href="/create" className="flex items-center gap-2">
                                        <Plus className="h-5 w-5 md:h-6 md:w-6" />
                                        <span className="sm:inline font-black tracking-tight">CREATE PIN</span>
                                    </a>
                                </Button>
                            </div>
                        )}

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <div className="h-10 w-10 md:h-12 md:w-12 shrink-0 flex items-center justify-center glass rounded-full border border-border hover:bg-muted transition-all cursor-pointer active:scale-90">
                                    <Settings className="h-4 w-4 md:h-5 md:w-5 text-foreground" />
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="glass border-border text-foreground min-w-[200px]" align="end">
                                <DropdownMenuLabel>Profile Settings</DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-white/10" />
                                <DropdownMenuItem className="focus:bg-white/10 focus:text-white cursor-pointer py-3">
                                    Privacy Policy
                                </DropdownMenuItem>
                                <DropdownMenuItem className="focus:bg-white/10 focus:text-white cursor-pointer py-3">
                                    Terms of Service
                                </DropdownMenuItem>
                                {isOwnProfile && (
                                    <>
                                        <DropdownMenuSeparator className="bg-white/10" />
                                        <DropdownMenuItem className="focus:bg-white/10 focus:text-red-500 cursor-pointer text-red-400 py-3">
                                            Log Out
                                        </DropdownMenuItem>
                                    </>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <div className="h-10 w-10 md:h-12 md:w-12 shrink-0 flex items-center justify-center glass rounded-full border border-border hover:bg-muted transition-all cursor-pointer active:scale-90">
                            <Share2 className="h-4 w-4 md:h-5 md:w-5 text-foreground" />
                        </div>
                        <div className="h-10 px-3 md:h-12 md:pl-4 md:pr-3 flex items-center gap-2 md:gap-3 glass rounded-full border border-border hover:bg-muted transition-all cursor-pointer group">
                            <UserButton appearance={{
                                elements: {
                                    userButtonAvatarBox: "h-6 w-6 md:h-8 md:w-8",
                                }
                            }} />
                        </div>
                    </div>
                </div>

                {isOwnProfile && (
                    <EditProfileDialog
                        isOpen={isEditModalOpen}
                        onClose={() => setIsEditModalOpen(false)}
                        initialData={{
                            displayName,
                            username,
                            bio,
                            avatarUrl
                        }}
                    />
                )}

                {/* Tabs Section */}
                <Tabs defaultValue="created" className="w-full" onValueChange={setActiveTab}>
                    <div className="flex justify-center border-b border-border mb-8 sticky top-0 bg-background/80 backdrop-blur-md z-10 transition-colors duration-[2000ms]">
                        <TabsList className="bg-transparent h-12 md:h-16 gap-8 md:gap-24">
                            <TabsTrigger
                                value="created"
                                className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-4 data-[state=active]:border-neon-purple rounded-none h-full px-2 md:px-6 font-bold text-lg md:text-xl text-muted-foreground data-[state=active]:text-foreground transition-all flex items-center gap-2"
                            >
                                <Grid className="h-6 w-6 md:h-5 md:w-5" />
                                <span className="hidden md:inline">Created</span>
                            </TabsTrigger>
                            <TabsTrigger
                                value="saved"
                                className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-4 data-[state=active]:border-neon-pink rounded-none h-full px-2 md:px-6 font-bold text-lg md:text-xl text-muted-foreground data-[state=active]:text-foreground transition-all flex items-center gap-2"
                            >
                                <Bookmark className="h-6 w-6 md:h-5 md:w-5" />
                                <span className="hidden md:inline">Saved</span>
                            </TabsTrigger>
                            <TabsTrigger
                                value="liked"
                                className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-4 data-[state=active]:border-red-500 rounded-none h-full px-2 md:px-6 font-bold text-lg md:text-xl text-gray-400 data-[state=active]:text-white transition-all flex items-center gap-2"
                            >
                                <Heart className="h-6 w-6 md:h-5 md:w-5" />
                                <span className="hidden md:inline">Liked</span>
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="created" className="mt-0 focus-visible:outline-none">
                        <Feed variant="created" items={createdItems} />
                    </TabsContent>
                    <TabsContent value="saved" className="mt-0 focus-visible:outline-none">
                        <Feed variant="saved" items={savedItems} />
                    </TabsContent>
                    <TabsContent value="liked" className="mt-0 focus-visible:outline-none">
                        <Feed variant="liked" items={likedItems} />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
