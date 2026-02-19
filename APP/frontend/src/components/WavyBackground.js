import React from 'react';
import { useTheme } from 'next-themes';
import '@/styles/WavyBackground.css';

const WavyBackground = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <div className={`wavy-background-container ${isDark ? 'dark' : 'light'}`}>
            <svg viewBox="0 0 1440 800" preserveAspectRatio="none" className="wavy-svg">
                <defs>
                    <linearGradient id="wavy-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" className="stop-start" />
                        <stop offset="50%" className="stop-middle" />
                        <stop offset="100%" className="stop-end" />
                    </linearGradient>
                    <filter id="wavy-glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="8" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>
                
                {/* 3 Wavy lines staggered - Top Left to Bottom Rightish */}
                <path 
                    className="wavy-path line-1" 
                    d="M-100,100 Q200,50 450,250 T900,150 T1540,400" 
                    fill="none" 
                    stroke="url(#wavy-gradient)" 
                    strokeWidth="2.5" 
                    filter="url(#wavy-glow)" 
                />
                <path 
                    className="wavy-path line-2" 
                    d="M-100,250 Q350,450 600,200 T1100,450 T1540,250" 
                    fill="none" 
                    stroke="url(#wavy-gradient)" 
                    strokeWidth="2" 
                    filter="url(#wavy-glow)" 
                />
                <path 
                    className="wavy-path line-3" 
                    d="M-100,400 Q150,650 500,450 T1000,600 T1540,400" 
                    fill="none" 
                    stroke="url(#wavy-gradient)" 
                    strokeWidth="3" 
                    filter="url(#wavy-glow)" 
                />
            </svg>
        </div>
    );
};

export default WavyBackground;
