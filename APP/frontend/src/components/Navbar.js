import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { Sun, Moon, User, LogOut } from 'lucide-react';
import { Switch } from './ui/switch';
import '../styles/Navbar.css';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);

        // Check for logged in user
        const checkUser = () => {
            const storedUser = sessionStorage.getItem('user');
            if (storedUser) {
                try {
                    setUser(JSON.parse(storedUser));
                } catch (error) {
                    console.error('Error parsing user data:', error);
                }
            }
        };
        checkUser();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        sessionStorage.removeItem('user');
        setUser(null);
        window.location.href = '/';
    };

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
                    {user ? (
                        <div className="user-menu">
                            <div className="user-info">
                                <User className="user-icon" size={18} />
                                <span className="user-name">{user.name}</span>
                            </div>
                            <button
                                className="btn-logout"
                                onClick={handleLogout}
                                aria-label="Logout"
                            >
                                <LogOut size={18} />
                                <span>Logout</span>
                            </button>
                        </div>
                    ) : (
                        <>
                            <a href="/login" className="btn-sign-in" data-testid="nav-sign-in-btn">Sign In</a>
                            <a href="/signup" className="btn-get-started" data-testid="nav-get-started-btn">Get Started</a>
                        </>
                    )}
                </div>
            </div>
        </motion.nav>
    );
};

export default Navbar;
