import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { Switch } from './ui/switch';
import '../styles/Navbar.css';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (!mounted) return null;

    return (
        <motion.nav
            className={`navbar ${scrolled ? 'scrolled' : ''}`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
        >
            <div className="navbar-container">
                <div className="navbar-logo">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <rect width="32" height="32" rx="6" fill="#10b981"/>
                        <path d="M12 20V12M16 20V8M20 20V16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    <span className="logo-text">HIRELYTIC</span>
                </div>

                <div className="navbar-links">
                    <a href="#features" className="nav-link">Features</a>
                    <a href="#pricing" className="nav-link">Pricing</a>
                    <a href="#about" className="nav-link">About</a>
                    <a href="#contact" className="nav-link">Contact</a>
                </div>

                <div className="navbar-actions">
                    <div className="theme-toggle">
                        <Sun className="h-4 w-4 text-orange-500" />
                        <Switch 
                            checked={theme === 'dark'}
                            onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                            aria-label="Toggle theme"
                        />
                        <Moon className="h-4 w-4 text-blue-500" />
                    </div>
                    <button className="btn-sign-in" data-testid="nav-sign-in-btn">Sign In</button>
                    <button className="btn-get-started" data-testid="nav-get-started-btn">Get Started</button>
                </div>
            </div>
        </motion.nav>
    );
};

export default Navbar;
