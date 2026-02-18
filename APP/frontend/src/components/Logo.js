import React from 'react';

const Logo = ({ className = "" }) => (
    <div className={`flex items-center gap-3 ${className}`}>
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-sm">
            {/* Main outer ring with gradient feel */}
            <path 
                d="M20 5C11.7157 5 5 11.7157 5 20C5 28.2843 11.7157 35 20 35C28.2843 35 35 28.2843 35 20" 
                stroke="url(#logo-gradient-primary)" 
                strokeWidth="4" 
                strokeLinecap="round"
                className="opacity-90"
            />
            {/* Inner dynamic circle */}
            <circle cx="20" cy="20" r="5" fill="url(#logo-gradient-accent)" />
            {/* Interlocking accent arc */}
            <path 
                d="M30 20C30 25.5228 25.5228 30 20 30" 
                stroke="url(#logo-gradient-secondary)" 
                strokeWidth="4" 
                strokeLinecap="round"
            />
            <defs>
                <linearGradient id="logo-gradient-primary" x1="5" y1="5" x2="35" y2="35" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#10b981" />
                    <stop offset="1" stopColor="#059669" />
                </linearGradient>
                <linearGradient id="logo-gradient-secondary" x1="20" y1="20" x2="30" y2="30" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#34d399" />
                    <stop offset="1" stopColor="#10b981" />
                </linearGradient>
                <linearGradient id="logo-gradient-accent" x1="15" y1="15" x2="25" y2="25" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#10b981" />
                    <stop offset="1" stopColor="#047857" />
                </linearGradient>
            </defs>
        </svg>
        <span className="font-sans text-xl font-extrabold tracking-tighter text-slate-900 dark:text-emerald-400">
            HIRELYTIC
        </span>
    </div>
);

export default Logo;
