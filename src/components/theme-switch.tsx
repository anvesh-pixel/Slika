"use client";

import React, { useEffect, useState } from "react";
import "./theme-switch.css";

const ThemeSwitch = () => {
    const [isDark, setIsDark] = useState(true);

    useEffect(() => {
        // Initial sync from localStorage or document class
        const savedTheme = localStorage.getItem("theme");
        const docClassDark = document.documentElement.classList.contains("dark");

        if (savedTheme) {
            setIsDark(savedTheme === "dark");
        } else {
            setIsDark(docClassDark);
        }
    }, []);

    const toggleTheme = () => {
        setIsDark(prev => {
            const next = !prev;
            const themeStr = next ? "dark" : "light";

            localStorage.setItem("theme", themeStr);

            if (next) {
                document.documentElement.classList.add("dark");
                document.documentElement.classList.remove("light");
            } else {
                document.documentElement.classList.remove("dark");
                document.documentElement.classList.add("light");
            }
            return next;
        });
    };

    return (
        <div className="flex items-center justify-center scale-90 md:scale-100 origin-right transition-all">
            <label className="switch">
                <input
                    id="theme-input"
                    type="checkbox"
                    checked={isDark}
                    onChange={toggleTheme}
                />
                <div className="slider round">
                    <div className="sun-moon">
                        <div className="sun-moon-inner">
                            <svg id="moon-dot-1" className="moon-dot" viewBox="0 0 100 100">
                                <circle cx={50} cy={50} r={50} />
                            </svg>
                            <svg id="moon-dot-2" className="moon-dot" viewBox="0 0 100 100">
                                <circle cx={50} cy={50} r={50} />
                            </svg>
                            <svg id="moon-dot-3" className="moon-dot" viewBox="0 0 100 100">
                                <circle cx={50} cy={50} r={50} />
                            </svg>
                            <svg id="light-ray-1" className="light-ray" viewBox="0 0 100 100">
                                <circle cx={50} cy={50} r={50} />
                            </svg>
                            <svg id="light-ray-2" className="light-ray" viewBox="0 0 100 100">
                                <circle cx={50} cy={50} r={50} />
                            </svg>
                            <svg id="light-ray-3" className="light-ray" viewBox="0 0 100 100">
                                <circle cx={50} cy={50} r={50} />
                            </svg>
                            <svg id="cloud-1" className="cloud-dark" viewBox="0 0 100 100">
                                <circle cx={50} cy={50} r={50} />
                            </svg>
                            <svg id="cloud-2" className="cloud-dark" viewBox="0 0 100 100">
                                <circle cx={50} cy={50} r={50} />
                            </svg>
                            <svg id="cloud-3" className="cloud-dark" viewBox="0 0 100 100">
                                <circle cx={50} cy={50} r={50} />
                            </svg>
                            <svg id="cloud-4" className="cloud-light" viewBox="0 0 100 100">
                                <circle cx={50} cy={50} r={50} />
                            </svg>
                            <svg id="cloud-5" className="cloud-light" viewBox="0 0 100 100">
                                <circle cx={50} cy={50} r={50} />
                            </svg>
                            <svg id="cloud-6" className="cloud-light" viewBox="0 0 100 100">
                                <circle cx={50} cy={50} r={50} />
                            </svg>
                        </div>
                    </div>
                    <div className="stars">
                        <svg id="star-1" className="star" viewBox="0 0 20 20">
                            <path d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z" />
                        </svg>
                        <svg id="star-2" className="star" viewBox="0 0 20 20">
                            <path d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z" />
                        </svg>
                        <svg id="star-3" className="star" viewBox="0 0 20 20">
                            <path d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z" />
                        </svg>
                        <svg id="star-4" className="star" viewBox="0 0 20 20">
                            <path d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z" />
                        </svg>
                    </div>
                </div>
            </label>
        </div>
    );
}

export default ThemeSwitch;
