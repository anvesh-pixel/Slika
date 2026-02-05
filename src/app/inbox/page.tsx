"use client";

import React, { useState } from "react";
import { Search, Send, Plus, MoreVertical, Paperclip, Smile } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

// Mock Data
const conversations = [
    {
        id: "1",
        user: {
            name: "Anvesh",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anvesh",
            status: "Online",
        },
        messages: [
            { id: "m1", text: "Hey! Did you see the new neon design?", sender: "them", time: "10:30 AM" },
            { id: "m2", text: "Yeah, it looks amazing! Love the purple-pink gradients.", sender: "me", time: "10:32 AM" },
            { id: "m3", text: "The glassmorphism adds a really premium feel.", sender: "them", time: "10:33 AM" },
        ],
    },
    {
        id: "2",
        user: {
            name: "Design Team",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Design",
            status: "Online",
        },
        messages: [
            { id: "m1", text: "New assets are ready for the feed.", sender: "them", time: "9:00 AM" },
            { id: "m2", text: "Great, I'll start integrating them now.", sender: "me", time: "9:15 AM" },
        ],
    },
    {
        id: "3",
        user: {
            name: "Sarah Jenkins",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
            status: "Offline",
        },
        messages: [
            { id: "m1", text: "Can we review the profile page soon?", sender: "them", time: "Yesterday" },
        ],
    },
];

export default function InboxPage() {
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
    const [messageInput, setMessageInput] = useState("");

    const activeChat = conversations.find((c) => c.id === selectedChatId);

    return (
        <div className="h-[calc(100vh-4.5rem)] bg-black flex overflow-hidden">
            {/* Sidebar: Conversation List */}
            <div className="w-full md:w-[350px] border-r border-white/10 flex flex-col glass-dark h-full">
                {/* Sidebar Header */}
                <div className="p-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-white tracking-tight">Messages</h1>
                    <Button variant="ghost" size="icon" className="rounded-full text-white hover:bg-white/10">
                        <Plus className="h-5 w-5" />
                    </Button>
                </div>

                {/* Sidebar Search */}
                <div className="px-6 mb-4">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 group-focus-within:text-neon-pink transition-colors" />
                        <Input
                            placeholder="Search messages..."
                            className="pl-10 rounded-full bg-white/5 border-white/10 focus:ring-neon-purple text-white"
                        />
                    </div>
                </div>

                {/* User List */}
                <ScrollArea className="flex-1">
                    <div className="px-3 space-y-1">
                        {conversations.map((chat) => (
                            <button
                                key={chat.id}
                                onClick={() => setSelectedChatId(chat.id)}
                                className={cn(
                                    "w-full p-3 flex items-center gap-3 rounded-xl transition-all duration-300 group",
                                    selectedChatId === chat.id
                                        ? "bg-white/10 border-l-4 border-neon-purple"
                                        : "hover:bg-white/5 hover:border-l-4 hover:border-white/10"
                                )}
                            >
                                <div className="relative">
                                    <Avatar className="h-12 w-12 border border-white/10">
                                        <AvatarImage src={chat.user.avatar} />
                                        <AvatarFallback>{chat.user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    {chat.user.status === "Online" && (
                                        <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-black"></div>
                                    )}
                                </div>
                                <div className="flex-1 text-left">
                                    <div className="flex justify-between items-baseline">
                                        <p className="font-semibold text-white truncate">{chat.user.name}</p>
                                        <span className="text-[10px] text-gray-500 font-medium">10:30 AM</span>
                                    </div>
                                    <p className="text-xs text-gray-400 truncate font-medium">
                                        {chat.messages[chat.messages.length - 1].text}
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>
                </ScrollArea>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col h-full bg-black/40 relative">
                {activeChat ? (
                    <>
                        {/* Chat Top Bar */}
                        <div className="h-20 glass-dark border-b border-white/10 px-6 flex items-center justify-between z-10">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10 border border-white/10">
                                    <AvatarImage src={activeChat.user.avatar} />
                                    <AvatarFallback>{activeChat.user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-bold text-white leading-none mb-1">{activeChat.user.name}</p>
                                    <p className="text-xs text-neon-pink font-semibold">{activeChat.user.status}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full">
                                    <MoreVertical className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <ScrollArea className="flex-1 p-6">
                            <div className="space-y-6 max-w-4xl mx-auto">
                                {activeChat.messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={cn(
                                            "flex flex-col max-w-[70%] space-y-1",
                                            msg.sender === "me" ? "ml-auto items-end" : "items-start"
                                        )}
                                    >
                                        <div
                                            className={cn(
                                                "px-4 py-2.5 rounded-2xl text-[15px] font-medium leading-relaxed shadow-lg",
                                                msg.sender === "me"
                                                    ? "bg-neon-gradient text-white rounded-br-none"
                                                    : "bg-white/10 text-white rounded-bl-none border border-white/5"
                                            )}
                                        >
                                            {msg.text}
                                        </div>
                                        <span className="text-[10px] text-gray-500 font-bold px-1">{msg.time}</span>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>

                        {/* Input Area */}
                        <div className="p-4 bg-transparent">
                            <div className="max-w-4xl mx-auto glass-dark rounded-2xl border border-white/10 p-2 flex items-center gap-2 shadow-2xl">
                                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-neon-pink rounded-full">
                                    <Paperclip className="h-5 w-5" />
                                </Button>
                                <Input
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 bg-transparent border-none focus-visible:ring-0 text-white placeholder:text-gray-500 h-10"
                                />
                                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-neon-purple rounded-full">
                                    <Smile className="h-5 w-5" />
                                </Button>
                                <Button
                                    size="icon"
                                    className="bg-neon-gradient rounded-full h-10 w-10 shadow-[0_0_15px_rgba(157,0,255,0.4)] hover:shadow-[0_0_20px_rgba(255,0,234,0.6)] transition-all"
                                >
                                    <Send className="h-5 w-5 text-white" />
                                </Button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                        <div className="bg-white/5 p-8 rounded-full mb-6 border border-white/10 shadow-[0_0_50px_rgba(157,0,255,0.1)]">
                            <Send className="h-12 w-12 text-neon-purple opacity-50" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Select a conversation</h2>
                        <p className="text-gray-500 max-w-xs font-medium">
                            Choose one of your active chats or start a new one to begin messaging.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
