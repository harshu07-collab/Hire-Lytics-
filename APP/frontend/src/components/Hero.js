import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import '../styles/Hero.css';

const Hero = () => {
    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 500], [0, 150]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);

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
                        transition={{ delay: 0.2, duration: 0.6 }}
                    >
                        <span className="badge-text">RESUME CHECKER</span>
                    </motion.div>

                    <motion.h1
                        className="hero-title"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                    >
                        Is Your Resume<br />Good Enough?
                    </motion.h1>

                    <motion.p
                        className="hero-subtitle"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                    >
                        AI-powered resume analysis for modern professionals.
                        <br />Get instant feedback and optimize for success.
                    </motion.p>

                    <motion.div
                        className="hero-cta"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.8 }}
                    >
                        <button className="btn-primary" data-testid="hero-check-resume-btn">
                            Check My Resume
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M7 10H17M17 10L13 6M17 10L13 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                        <button className="btn-secondary" data-testid="hero-learn-more-btn">Learn More</button>
                    </motion.div>
                </motion.div>

                <motion.div
                    className="hero-visual"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8, duration: 1 }}
                >
                    <div className="resume-card-container">
                        <motion.div
                            className="resume-card"
                            animate={{
                                y: [0, -10, 0],
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        >
                            <div className="resume-card-header">
                                <div className="resume-logo-mini">Enhancv</div>
                            </div>

                            <div className="resume-score-display">
                                <div className="score-label">Resume Score</div>
                                <motion.div
                                    className="score-circle"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 1.2, duration: 0.6, type: "spring" }}
                                >
                                    <svg viewBox="0 0 120 120" className="score-svg">
                                        <circle
                                            cx="60"
                                            cy="60"
                                            r="54"
                                            fill="none"
                                            stroke="#e5e7eb"
                                            strokeWidth="8"
                                        />
                                        <motion.circle
                                            cx="60"
                                            cy="60"
                                            r="54"
                                            fill="none"
                                            stroke="url(#scoreGradient)"
                                            strokeWidth="8"
                                            strokeLinecap="round"
                                            strokeDasharray={339.292}
                                            initial={{ strokeDashoffset: 339.292 }}
                                            animate={{ strokeDashoffset: 339.292 * 0.08 }}
                                            transition={{ delay: 1.4, duration: 2, ease: "easeOut" }}
                                            style={{ transform: 'rotate(-90deg)', transformOrigin: '60px 60px' }}
                                        />
                                        <defs>
                                            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" stopColor="#10b981" />
                                                <stop offset="100%" stopColor="#06b6d4" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                    <div className="score-number">
                                        <motion.span
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 2, duration: 0.5 }}
                                        >
                                            92
                                        </motion.span>
                                        <span className="score-total">/100</span>
                                    </div>
                                </motion.div>
                                <div className="score-time">24 hours</div>
                            </div>

                            <div className="resume-metrics">
                                <motion.div
                                    className="metric-item"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 1.6, duration: 0.6 }}
                                >
                                    <div className="metric-icon">✓</div>
                                    <div className="metric-text">ATS Parse Rate</div>
                                </motion.div>
                                <motion.div
                                    className="metric-item"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 1.8, duration: 0.6 }}
                                >
                                    <div className="metric-icon">✓</div>
                                    <div className="metric-text">Quantifying Impact</div>
                                </motion.div>
                                <motion.div
                                    className="metric-item"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 2.0, duration: 0.6 }}
                                >
                                    <div className="metric-icon">✓</div>
                                    <div className="metric-text">Repetition</div>
                                </motion.div>
                                <motion.div
                                    className="metric-item"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 2.2, duration: 0.6 }}
                                >
                                    <div className="metric-icon">✓</div>
                                    <div className="metric-text">Spelling & Grammar</div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
