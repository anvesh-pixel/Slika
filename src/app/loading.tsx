"use client";

import React from "react";
import { motion } from "framer-motion";

export default function Loading() {
    return (
        <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black overflow-hidden">
            {/* Background Ambient Glows */}
            <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-[40%] left-1/2 -translate-x-1/2 translate-y-1/2 w-[400px] h-[400px] bg-pink-600/10 blur-[100px] rounded-full" />

            <div className="relative flex flex-col items-center gap-12">
                {/* Slika Logo - High Visibility Design */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="relative text-center"
                >
                    {/* Main Text: Using simple white for absolute visibility */}
                    <h1 className="text-7xl sm:text-9xl font-black tracking-[0.1em] text-white drop-shadow-[0_0_15px_rgba(157,0,255,0.7)]">
                        SLIKA
                    </h1>

                    {/* Subtle neon underline accent */}
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ delay: 0.5, duration: 1.5, ease: "circOut" }}
                        className="h-[4px] bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 mt-2 rounded-full shadow-[0_0_10px_#9d00ff]"
                    />
                </motion.div>

                {/* Minimalist Loading Bar */}
                <div className="w-48 h-[2px] bg-white/10 rounded-full overflow-hidden relative">
                    <motion.div
                        initial={{ left: "-100%" }}
                        animate={{ left: "100%" }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                    />
                </div>

                {/* Status Tag */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="flex items-center gap-3"
                >
                    <span className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_#9d00ff]" />
                    <p className="text-white/50 text-[10px] font-bold uppercase tracking-[0.3em]">
                        Initializing Environment
                    </p>
                </motion.div>
            </div>

            {/* Modern Grid Overlay (Optional Subtle Visual) */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        </div>
    );
}
