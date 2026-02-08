"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Upload, X, Loader2, Image as ImageIcon, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUpload } from "@/hooks/use-upload";
import { createPin } from "@/app/actions/pin";
import { cn } from "@/lib/utils";

export default function CreatePage() {
    const router = useRouter();
    const { uploadFile, isUploading } = useUpload();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
    const [isPublishing, setIsPublishing] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target?.files?.[0];
        if (file) {
            const result = await uploadFile(file);
            if (result.publicUrl) {
                setUploadedImageUrl(result.publicUrl);
            }
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const file = e.dataTransfer.files?.[0];
        if (file) {
            const result = await uploadFile(file);
            if (result.publicUrl) {
                setUploadedImageUrl(result.publicUrl);
            }
        }
    };

    const handlePublish = async () => {
        if (!title || !uploadedImageUrl) return;

        setIsPublishing(true);
        try {
            const pin = await createPin({
                title,
                description,
                imageUrl: uploadedImageUrl
            });

            if (pin) {
                router.push(`/pin/${pin.id}`);
            }
        } catch (error) {
            console.error("Failed to publish pin:", error);
            alert("Failed to publish pin. Please try again.");
        } finally {
            setIsPublishing(false);
        }
    };

    const isPublishDisabled = !title || !uploadedImageUrl || isUploading || isPublishing;

    return (
        <div className="min-h-screen bg-black pt-24 pb-12 px-4 md:px-8">
            <div className="max-w-5xl mx-auto">
                <div className="flex flex-col md:flex-row gap-12">

                    {/* Left Column: Upload Area */}
                    <div className="md:w-1/2">
                        <div
                            className={cn(
                                "relative aspect-[3/4] rounded-[40px] border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center overflow-hidden",
                                dragActive ? "border-neon-purple bg-white/5" : "border-white/10 bg-[#0a0a0a]",
                                uploadedImageUrl ? "border-solid border-white/5" : "hover:border-white/20"
                            )}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            onClick={() => !uploadedImageUrl && fileInputRef.current?.click()}
                        >
                            {!uploadedImageUrl ? (
                                <div className="text-center p-8 space-y-4 cursor-pointer">
                                    <div className="h-20 w-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                                        {isUploading ? (
                                            <Loader2 className="h-10 w-10 text-neon-purple animate-spin" />
                                        ) : (
                                            <Upload className="h-10 w-10 text-gray-400" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-xl font-bold text-white mb-2">
                                            {isUploading ? "Uploading your masterpiece..." : "Choose a file or drag and drop"}
                                        </p>
                                        <p className="text-gray-500 font-medium">
                                            We recommend high-quality .jpg or .png files under 20MB
                                        </p>
                                    </div>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        className="hidden"
                                        accept="image/*,video/*"
                                        onChange={handleFileChange}
                                        disabled={isUploading}
                                    />
                                </div>
                            ) : (
                                <div className="relative w-full h-full group">
                                    <img
                                        src={uploadedImageUrl}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 h-16 w-16"
                                            onClick={(e: React.MouseEvent) => {
                                                e.stopPropagation();
                                                setUploadedImageUrl(null);
                                            }}
                                        >
                                            <X className="h-8 w-8" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Form Area */}
                    <div className="md:w-1/2 space-y-10 py-4">
                        <div className="space-y-2">
                            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Create New Pin</h1>
                            <p className="text-gray-500 font-medium text-lg">Share your vision with the world.</p>
                        </div>

                        <div className="space-y-8">
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">Title</label>
                                <Input
                                    placeholder="Add a catchy title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="h-16 text-xl bg-white/5 border-white/10 rounded-2xl focus-visible:ring-neon-purple px-6 text-white placeholder:text-gray-600"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">Description</label>
                                <Textarea
                                    placeholder="Tell everyone what your Pin is about..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="min-h-[160px] text-lg bg-white/5 border-white/10 rounded-2xl focus-visible:ring-neon-purple p-6 text-white placeholder:text-gray-600 resize-none"
                                />
                            </div>

                            <div className="pt-6">
                                <Button
                                    onClick={handlePublish}
                                    disabled={isPublishDisabled}
                                    className={cn(
                                        "w-full h-16 rounded-2xl text-xl font-bold transition-all flex items-center justify-center gap-3 shadow-xl",
                                        isPublishDisabled
                                            ? "bg-white/5 text-gray-600 border border-white/5 cursor-not-allowed"
                                            : "bg-neon-gradient text-white hover:opacity-90 shadow-purple-500/20 active:scale-[0.98]"
                                    )}
                                >
                                    {isUploading || isPublishing ? (
                                        <>
                                            <Loader2 className="h-6 w-6 animate-spin" />
                                            {isUploading ? "Uploading..." : "Publishing..."}
                                        </>
                                    ) : (
                                        <>
                                            Publish Pin
                                            <Send className="h-6 w-6" />
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>

                        {/* Extra Info / Tips */}
                        <div className="p-8 rounded-[32px] bg-white/5 border border-white/10 flex gap-6 items-start">
                            <div className="h-10 w-10 rounded-full bg-neon-purple/20 flex items-center justify-center shrink-0">
                                <ImageIcon className="h-5 w-5 text-neon-purple" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-white font-bold">Pro Tip</p>
                                <p className="text-gray-500 text-sm leading-relaxed">
                                    High-resolution images with vertical aspect ratios (like 2:3 or 9:16) often perform better in the feed.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
