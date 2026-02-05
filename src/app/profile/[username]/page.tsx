"use client";

import React from "react";
import { useParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Feed from "@/components/feed";

export default function ProfilePage() {
    const params = useParams();
    const username = params.username as string;

    // In a real app, you'd fetch user data based on the username
    const displayName = username.charAt(0).toUpperCase() + username.slice(1);
    const handle = `@${username.toLowerCase()}`;

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="max-w-7xl mx-auto px-4 pt-16">
                {/* Header Section */}
                <div className="flex flex-col items-center text-center space-y-6 mb-12">
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-neon-gradient rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                        <Avatar className="h-[120px] w-[120px] border-4 border-black relative">
                            <AvatarImage src="https://github.com/shadcn.png" alt={displayName} />
                            <AvatarFallback className="bg-white/10">{displayName.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                    </div>

                    <div className="space-y-1">
                        <h1 className="text-4xl font-bold tracking-tight text-white">{displayName}</h1>
                        <p className="text-gray-400 font-medium text-lg">{handle}</p>
                    </div>

                    <div className="flex items-center gap-3 text-sm font-semibold text-gray-400">
                        <span>0 followers</span>
                        <div className="h-1 w-1 bg-gray-600 rounded-full"></div>
                        <span>0 following</span>
                    </div>

                    <div className="flex items-center gap-4 pt-2">
                        <Button variant="secondary" className="glass-dark rounded-full px-8 font-bold text-white hover:bg-white/20 border-white/10 h-11">
                            Share
                        </Button>
                        <Button variant="secondary" className="glass-dark rounded-full px-8 font-bold text-white hover:bg-white/20 border-white/10 h-11">
                            Edit Profile
                        </Button>
                    </div>
                </div>

                {/* Tabs Section */}
                <Tabs defaultValue="created" className="w-full">
                    <div className="flex justify-center border-b border-white/10 mb-8">
                        <TabsList className="bg-transparent h-12 gap-12">
                            <TabsTrigger
                                value="created"
                                className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-4 data-[state=active]:border-neon-purple rounded-none h-full px-4 font-bold text-lg text-gray-400 data-[state=active]:text-white transition-all"
                            >
                                Created
                            </TabsTrigger>
                            <TabsTrigger
                                value="saved"
                                className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-4 data-[state=active]:border-neon-pink rounded-none h-full px-4 font-bold text-lg text-gray-400 data-[state=active]:text-white transition-all"
                            >
                                Saved
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="created" className="mt-0 focus-visible:outline-none">
                        <Feed variant="created" />
                    </TabsContent>
                    <TabsContent value="saved" className="mt-0 focus-visible:outline-none">
                        <Feed variant="saved" />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
