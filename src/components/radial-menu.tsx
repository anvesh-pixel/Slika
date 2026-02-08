"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Download, Share2, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";

interface RadialOption {
    id: string;
    icon: React.ReactNode;
    label: string;
    color: string;
}

const options: RadialOption[] = [
    { id: "save", icon: <Bookmark className="h-5 w-5" />, label: "Save", color: "bg-neon-purple" },
    { id: "download", icon: <Download className="h-5 w-5" />, label: "Download", color: "bg-blue-500" },
    { id: "like", icon: <Heart className="h-5 w-5" />, label: "Like", color: "bg-neon-pink" },
    { id: "share", icon: <Share2 className="h-5 w-5" />, label: "Share", color: "bg-green-500" },
];

interface LongPressRadialMenuProps {
    onSelect: (id: string) => void;
    onClose: () => void;
    position: { x: number; y: number };
}

export default function LongPressRadialMenu({ onSelect, onClose, position }: LongPressRadialMenuProps) {
    const [activeOption, setActiveOption] = useState<string | null>(null);

    const handlePointerMove = (e: PointerEvent) => {
        const dx = e.clientX - position.x;
        const dy = e.clientY - position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Selection radius
        if (distance < 35) {
            setActiveOption(null);
            return;
        }

        // Calculate angle in degrees
        let angle = (Math.atan2(dy, dx) * 180) / Math.PI;
        if (angle < 0) angle += 360;

        // Radial Arc: 180 (Left) to 270 (Top)
        // Divide the 90-degree arc into 4 sectors of 22.5 degrees each
        // Sector 1: 180 - 202.5 -> Save
        // Sector 2: 202.5 - 225 -> Download
        // Sector 3: 225 - 247.5 -> Like
        // Sector 4: 247.5 - 270 -> Share
        // Let's broaden the total arc slightly for easier selection (e.g., 165 to 285)

        if (angle >= 165 && angle < 195) setActiveOption("save");
        else if (angle >= 195 && angle < 225) setActiveOption("download");
        else if (angle >= 225 && angle < 255) setActiveOption("like");
        else if (angle >= 255 && angle <= 285) setActiveOption("share");
        else setActiveOption(null);
    };

    const handlePointerUp = useCallback(() => {
        if (activeOption) {
            onSelect(activeOption);
        }
        onClose();
    }, [activeOption, onSelect, onClose]);

    useEffect(() => {
        window.addEventListener("pointermove", handlePointerMove);
        window.addEventListener("pointerup", handlePointerUp);
        return () => {
            window.removeEventListener("pointermove", handlePointerMove);
            window.removeEventListener("pointerup", handlePointerUp);
        };
    }, [handlePointerUp, position]);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="fixed z-[100] pointer-events-none touch-none"
                style={{ left: position.x, top: position.y }}
            >
                {/* Visual Origin */}
                <motion.div
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 h-10 w-10 bg-white/20 rounded-full border border-white/40 backdrop-blur-sm"
                />
                <div className="absolute -translate-x-1/2 -translate-y-1/2 h-2 w-2 bg-white rounded-full shadow-[0_0_15px_white]" />

                {/* Options in 90-degree Arc (Left to Top) */}
                {options.map((opt, index) => {
                    const isActive = activeOption === opt.id;
                    // Angles: 180 (Save), 210 (Download), 240 (Like), 270 (Share)
                    const angles = [180, 210, 240, 270];
                    const angle = angles[index] * (Math.PI / 180);
                    const radius = isActive ? 110 : 95;
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius;

                    return (
                        <motion.div
                            key={opt.id}
                            initial={{ x: 0, y: 0, scale: 0 }}
                            animate={{ x, y, scale: isActive ? 1.3 : 1 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            className={cn(
                                "absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2",
                                isActive ? "z-20" : "z-10"
                            )}
                        >
                            <div
                                className={cn(
                                    "h-12 w-12 rounded-full flex items-center justify-center text-white transition-all shadow-lg backdrop-blur-lg border border-white/20",
                                    isActive ? opt.color : "bg-black/50",
                                    isActive ? "shadow-[0_0_25px_rgba(255,255,255,0.4)] border-white/60" : ""
                                )}
                            >
                                {opt.icon}
                            </div>
                            <AnimatePresence>
                                {isActive && (
                                    <motion.span
                                        initial={{ opacity: 0, y: 5, scale: 0.8 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 5 }}
                                        className="px-3 py-1 bg-black/90 rounded-full text-[10px] font-bold text-white uppercase tracking-tighter whitespace-nowrap border border-white/10 shadow-xl"
                                    >
                                        {opt.label}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}

                {/* Arc Hint Visual */}
                <div className="absolute -translate-x-1/2 -translate-y-1/2 h-48 w-48 rounded-full border-t-2 border-l-2 border-white/10 -z-10"
                    style={{ borderRadius: '100% 0 0 0', transform: 'translate(-100%, -100%)' }} />
            </motion.div>
        </AnimatePresence>
    );
}
