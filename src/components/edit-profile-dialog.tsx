"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Camera, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateProfile } from "@/app/actions/user";
import { useRouter } from "next/navigation";

interface EditProfileDialogProps {
    isOpen: boolean;
    onClose: () => void;
    initialData: {
        displayName: string;
        username: string;
        bio: string;
        avatarUrl: string;
    };
}

export default function EditProfileDialog({ isOpen, onClose, initialData }: EditProfileDialogProps) {
    const [formData, setFormData] = useState(initialData);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            await updateProfile({
                displayName: formData.displayName,
                username: formData.username,
                bio: formData.bio,
            });
            router.refresh();
            // If username changed, we might need to redirect
            if (formData.username !== initialData.username) {
                router.push(`/profile/${formData.username}`);
            }
            onClose();
        } catch (err: any) {
            setError(err.message || "Failed to update profile");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-zinc-900 border border-white/10 rounded-3xl p-8 z-[101] shadow-2xl"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
                            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                <X className="h-6 w-6 text-gray-400" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="flex flex-col items-center mb-8">
                                <div className="relative group cursor-pointer">
                                    <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                                        <Camera className="h-8 w-8 text-white" />
                                    </div>
                                    <img
                                        src={formData.avatarUrl}
                                        alt="Profile"
                                        className="h-24 w-24 rounded-full border-2 border-neon-purple object-cover"
                                    />
                                    <div className="absolute bottom-0 right-0 bg-neon-purple p-1.5 rounded-full border-2 border-zinc-900">
                                        <Camera className="h-4 w-4 text-white" />
                                    </div>
                                </div>
                                <button type="button" className="mt-3 text-sm font-bold text-neon-purple hover:text-neon-purple/80 transition-colors uppercase tracking-widest">
                                    Change Photo
                                </button>
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Display Name</label>
                                    <Input
                                        value={formData.displayName}
                                        onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                                        className="bg-white/5 border-white/10 focus:border-neon-purple rounded-xl h-12 text-white"
                                        placeholder="Full Name"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Username</label>
                                    <Input
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        className="bg-white/5 border-white/10 focus:border-neon-purple rounded-xl h-12 text-white"
                                        placeholder="username"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Bio</label>
                                    <textarea
                                        value={formData.bio}
                                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                        rows={3}
                                        className="w-full bg-white/5 border border-white/10 focus:border-neon-purple rounded-xl p-4 text-white focus:outline-none transition-colors resize-none"
                                        placeholder="Write something about yourself..."
                                    />
                                </div>
                            </div>

                            {error && (
                                <p className="text-red-500 text-sm font-bold text-center">{error}</p>
                            )}

                            <div className="flex items-center gap-4 pt-4">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={onClose}
                                    disabled={isLoading}
                                    className="flex-1 rounded-full h-12 font-bold text-gray-400 hover:text-white"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 bg-neon-purple hover:bg-neon-purple/80 text-white rounded-full h-12 font-bold transition-all shadow-[0_0_20px_rgba(157,0,255,0.3)]"
                                >
                                    {isLoading ? (
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    ) : (
                                        <Save className="mr-2 h-5 w-5" />
                                    )}
                                    {isLoading ? "Saving..." : "Save Changes"}
                                </Button>
                            </div>
                        </form>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
