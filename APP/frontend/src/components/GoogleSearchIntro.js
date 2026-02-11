import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import '../styles/GoogleSearchIntro.css';

const GoogleSearchIntro = ({ onComplete }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [showResults, setShowResults] = useState(false);
    const [fadeOut, setFadeOut] = useState(false);
    const fullQuery = 'best resume analyzer';

    const handleResultClick = useCallback(() => {
        setFadeOut(true);
        setTimeout(() => {
            onComplete();
        }, 800);
    }, [onComplete]);

    useEffect(() => {
        // Typing animation
        let currentIndex = 0;
        const typingInterval = setInterval(() => {
            if (currentIndex < fullQuery.length) {
                setSearchQuery(fullQuery.substring(0, currentIndex + 1));
                currentIndex++;
            } else {
                clearInterval(typingInterval);
                // Show results after typing completes
                setTimeout(() => {
                    setShowResults(true);
                    // Auto-click the first result after 1.5 seconds
                    setTimeout(() => {
                        handleResultClick();
                    }, 1500);
                }, 500);
            }
        }, 100);

        return () => clearInterval(typingInterval);
    }, [handleResultClick]);

    return (
        <motion.div
            className={`search-intro-container ${fadeOut ? 'fade-out' : ''}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: fadeOut ? 0 : 1 }}
            transition={{ duration: 0.8 }}
        >
            <div className="search-content">
                <div className="search-logo">
                    <svg width="92" height="92" viewBox="0 0 92 92" fill="none">
                        <path d="M29.5 29.5L45.5 45.5M45.5 45.5L61.5 61.5M45.5 45.5L61.5 29.5M45.5 45.5L29.5 61.5" stroke="#4285F4" strokeWidth="3" strokeLinecap="round"/>
                        <circle cx="46" cy="46" r="44" stroke="#4285F4" strokeWidth="3"/>
                        <circle cx="46" cy="46" r="20" fill="#4285F4" opacity="0.1"/>
                    </svg>
                </div>

                <motion.div
                    className="search-box"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                >
                    <svg className="search-icon" width="20" height="20" viewBox="0 0 20 20">
                        <path d="M9 2a7 7 0 015.657 11.314l4.515 4.514a1 1 0 01-1.415 1.415l-4.514-4.515A7 7 0 119 2zm0 2a5 5 0 100 10 5 5 0 000-10z" fill="#9CA3AF"/>
                    </svg>
                    <input
                        type="text"
                        value={searchQuery}
                        readOnly
                        className="search-input"
                        placeholder="Search Google"
                    />
                    <div className="search-cursor"></div>
                </motion.div>

                {showResults && (
                    <motion.div
                        className="search-results"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <motion.div
                            className="search-result featured"
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2 }}
                            whileHover={{ scale: 1.02 }}
                            onClick={handleResultClick}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="result-header">
                                <div className="result-favicon">H</div>
                                <div className="result-url">hirelytic.ai</div>
                            </div>
                            <h3 className="result-title">HIRELYTIC – AI Resume Intelligence</h3>
                            <p className="result-description">
                                Optimize your resume with AI precision. Get instant ATS score analysis,
                                formatting suggestions, and AI-powered rewriting tools.
                            </p>
                        </motion.div>

                        <div className="search-result">
                            <div className="result-header">
                                <div className="result-favicon">R</div>
                                <div className="result-url">resumegenius.com</div>
                            </div>
                            <h3 className="result-title">Free Resume Checker & Analyzer</h3>
                            <p className="result-description">
                                Check your resume for free with our resume checker tool...
                            </p>
                        </div>

                        <div className="search-result">
                            <div className="result-header">
                                <div className="result-favicon">J</div>
                                <div className="result-url">jobscan.co</div>
                            </div>
                            <h3 className="result-title">Resume Scanner - ATS Optimization</h3>
                            <p className="result-description">
                                Scan your resume against job descriptions...
                            </p>
                        </div>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};

export default GoogleSearchIntro;
