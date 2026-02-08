"use client";

import React, { useState } from "react";
import { UserButton } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Feed from "@/components/feed";
import { UserPlus, Share2, Grid, Bookmark, Heart } from "lucide-react";
import EditProfileDialog from "@/components/edit-profile-dialog";

interface ProfileClientProps {
    username: string;
    displayName: string;
    bio: string;
    avatarUrl: string;
    stats: {
        posts: number;
        followers: number;
        following: number;
    };
    isOwnProfile: boolean;
    createdItems: any[];
    savedItems: any[];
}

export default function ProfileClient({
    username,
    displayName,
    bio,
    avatarUrl,
    stats,
    isOwnProfile,
    createdItems,
    savedItems
}: ProfileClientProps) {
    const [activeTab, setActiveTab] = useState("created");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const handle = `@${username.toLowerCase()}`;

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="max-w-7xl mx-auto px-4 pt-16">
                {/* Header Section */}
                <div className="flex flex-col items-center text-center space-y-6 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <button
                        onClick={() => isOwnProfile && setIsEditModalOpen(true)}
                        className={`relative group outline-none ${isOwnProfile ? "cursor-pointer" : "cursor-default"}`}
                    >
                        <div className="absolute -inset-1 bg-neon-gradient rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                        <Avatar className="h-[150px] w-[150px] border-4 border-black relative">
                            <AvatarImage src={avatarUrl} alt={displayName} />
                            <AvatarFallback className="bg-white/10 text-2xl">{displayName.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        {isOwnProfile && (
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                <div className="bg-black/40 backdrop-blur-sm rounded-full p-2">
                                    <Grid className="h-6 w-6 text-white" />
                                </div>
                            </div>
                        )}
                    </button>

                    <div className="space-y-2">
                        <h1 className="text-5xl font-bold tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">{displayName}</h1>
                        <p className="text-neon-purple font-medium text-xl">{handle}</p>
                    </div>

                    <p className="max-w-md text-gray-400 text-lg leading-relaxed">
                        {bio}
                    </p>

                    <div className="flex items-center gap-10 text-lg">
                        <div className="flex flex-col items-center">
                            <span className="font-black text-white text-2xl">{stats.posts}</span>
                            <span className="text-gray-500 text-sm uppercase tracking-widest font-bold">Posts</span>
                        </div>
                        <div className="h-8 w-[1px] bg-white/10"></div>
                        <div className="flex flex-col items-center">
                            <span className="font-black text-white text-2xl">{stats.followers}</span>
                            <span className="text-gray-500 text-sm uppercase tracking-widest font-bold">Followers</span>
                        </div>
                        <div className="h-8 w-[1px] bg-white/10"></div>
                        <div className="flex flex-col items-center">
                            <span className="font-black text-white text-2xl">{stats.following}</span>
                            <span className="text-gray-500 text-sm uppercase tracking-widest font-bold">Following</span>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 pt-4 px-2 w-full">
                        {!isOwnProfile && (
                            <Button className="flex-1 sm:flex-none bg-neon-purple hover:bg-neon-purple/80 text-white rounded-full px-8 font-bold h-12 transition-all shadow-[0_0_20px_rgba(157,0,255,0.3)] hover:shadow-[0_0_30px_rgba(157,0,255,0.5)]">
                                <UserPlus className="mr-2 h-5 w-5" /> Follow
                            </Button>
                        )}
                        {isOwnProfile && (
                            <Button
                                variant="outline"
                                onClick={() => setIsEditModalOpen(true)}
                                className="flex-1 sm:flex-none border-white/10 bg-white/5 hover:bg-white/10 rounded-full px-8 font-bold text-white h-12 transition-all"
                            >
                                Edit Profile
                            </Button>
                        )}
                        <div className="flex items-center gap-2 md:gap-4">
                            <div className="h-12 w-12 flex items-center justify-center glass-dark rounded-full border border-white/10 hover:bg-white/20 transition-all cursor-pointer">
                                <Share2 className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
                            </div>
                            <div className="h-12 pl-4 pr-3 flex items-center gap-3 glass-dark rounded-full border border-white/10 hover:bg-white/20 transition-all cursor-pointer group">
                                <span className="text-sm font-bold text-white opacity-60 group-hover:opacity-100 transition-opacity">Account</span>
                                <UserButton appearance={{
                                    elements: {
                                        userButtonAvatarBox: "h-8 w-8",
                                    }
                                }} />
                            </div>
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
                    <div className="flex justify-center border-b border-white/10 mb-8 sticky top-0 bg-black/80 backdrop-blur-md z-10 py-4">
                        <TabsList className="bg-transparent h-12 gap-12 md:gap-24">
                            <TabsTrigger
                                value="created"
                                className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-4 data-[state=active]:border-neon-purple rounded-none h-full px-4 md:px-6 font-bold text-lg md:text-xl text-gray-400 data-[state=active]:text-white transition-all flex items-center gap-2"
                            >
                                <Grid className="h-5 w-5" />
                                Created
                            </TabsTrigger>
                            <TabsTrigger
                                value="saved"
                                className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-4 data-[state=active]:border-neon-pink rounded-none h-full px-4 md:px-6 font-bold text-lg md:text-xl text-gray-400 data-[state=active]:text-white transition-all flex items-center gap-2"
                            >
                                <Bookmark className="h-5 w-5" />
                                Saved
                            </TabsTrigger>
                            <TabsTrigger
                                value="liked"
                                className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-4 data-[state=active]:border-green-500 rounded-none h-full px-4 md:px-6 font-bold text-lg md:text-xl text-gray-400 data-[state=active]:text-white transition-all flex items-center gap-2"
                            >
                                <Heart className="h-5 w-5" />
                                Liked
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
                        <Feed variant="liked" items={[]} />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
