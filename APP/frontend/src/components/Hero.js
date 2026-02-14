import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import '../styles/Hero.css';
import Smartphone3D from './Smartphone3D';
import Laptop3D from './Laptop3D';

const Hero = () => {
    const { scrollY } = useScroll();
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    const y = useTransform(scrollY, [0, 500], [0, 150]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);

    useEffect(() => {
        setMounted(true);
    }, []);

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    if (!mounted) return null;

    return (
        <section className="hero-section">
            <div className="hero-gradient-bg"></div>

            <div className="hero-container">
                <motion.div
                    className="hero-content"
                    style={{ y, opacity }}
                >
                    <motion.div
                        className="hero-badge"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                    >
                        <span className="badge-text">RESUME CHECKER</span>
                    </motion.div>

                    <motion.h1
                        className="hero-title"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                    >
                        Is Your Resume<br />Good Enough?
                    </motion.h1>

                    <motion.p
                        className="hero-subtitle"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                    >
                        AI-powered resume analysis for modern professionals.
                        <br />Get instant feedback and optimize for success.
                    </motion.p>

                    <motion.div
                        className="hero-cta"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                    >
                        <button 
                            className="btn-primary" 
                            data-testid="hero-check-resume-btn"
                            onClick={() => scrollToSection('analyzer')}
                        >
                            Check My Resume
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M7 10H17M17 10L13 6M17 10L13 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                        <button 
                            className="btn-secondary" 
                            data-testid="hero-learn-more-btn"
                            onClick={() => scrollToSection('features')}
                        >
                            Learn More
                        </button>
                    </motion.div>
                </motion.div>

                <motion.div
                    className="hero-visual"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6, duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                >
                    <div className="visual-wrapper">
                        <AnimatePresence mode="wait">
                            {theme === 'dark' ? (
                                <motion.div
                                    key="laptop"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.5 }}
                                    className="device-container laptop-wrap"
                                >
                                    <Laptop3D />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="smartphone"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.5 }}
                                    className="device-container smartphone-wrap"
                                >
                                    <Smartphone3D />
                                </motion.div>
                            )}
                        </AnimatePresence>
                        
                        {/* Floating elements */}
                        <motion.div
                            className="floating-element element-1"
                            animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: [0.4, 0, 0.6, 1] }}
                        >
                            <div className="glass-card">
                                <span className="text-success">✓</span> ATS Ready
                            </div>
                        </motion.div>

                        <motion.div
                            className="floating-element element-2"
                            animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: [0.4, 0, 0.6, 1], delay: 0.5 }}
                        >
                            <div className="glass-card">
                                <span className="text-blue">★</span> Top 5%
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
