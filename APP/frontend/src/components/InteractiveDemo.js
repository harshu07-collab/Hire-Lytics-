import React from 'react';
import { motion } from 'framer-motion';
import '../styles/InteractiveDemo.css';

const InteractiveDemo = () => {
    const cursorVariants = {
        initial: { x: 0, y: 0, scale: 1 },
        animate: {
            x: [0, 150, 150, 280, 280, 400, 400, 0],
            y: [0, 50, 150, 150, 250, 250, 350, 0],
            scale: [1, 1, 0.8, 0.8, 1, 1, 0.8, 1],
            transition: {
                duration: 12,
                repeat: Infinity,
                ease: "easeInOut",
                times: [0, 0.1, 0.15, 0.25, 0.3, 0.4, 0.45, 1]
            }
        }
    };

    const clickVariants = {
        initial: { scale: 0, opacity: 0 },
        animate: {
            scale: [0, 1.5, 0],
            opacity: [0, 0.5, 0],
            transition: {
                duration: 0.5,
                repeat: Infinity,
                repeatDelay: 2.5,
                times: [0, 0.5, 1]
            }
        }
    };

    return (
        <section className="interactive-demo-section">
            <div className="demo-container">
                <motion.div
                    className="demo-header"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="demo-title">Experience the Platform</h2>
                    <p className="demo-subtitle">
                        See how easy it is to optimize your resume with our intuitive interface
                    </p>
                </motion.div>

                <div className="demo-visual">
                    {/* Main Preview */}
                    <motion.div
                        className="demo-main-preview"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <div className="preview-resume">
                            <div className="preview-name-large">ISABELLE TODD</div>
                            <div className="preview-tagline-large">
                                I solve problems and help people overcome obstacles.
                            </div>
                            <div className="preview-contact-row">
                                <span>+1 (555) 111 1111</span>
                                <span>isabelle@gmail.com</span>
                                <span>New York City, NY</span>
                            </div>
                            
                            <div className="preview-section-large">
                                <div className="section-title-large">EXPERIENCE</div>
                                <div className="experience-item-large">
                                    <div className="exp-header">
                                        <span className="exp-title-large">Product Owner</span>
                                        <span className="exp-date-large">02/2020 - 04/2021</span>
                                    </div>
                                    <div className="exp-company-large">C Lab Services</div>
                                    <ul className="exp-bullets-large">
                                        <li>Drove the launch of a new tracking software at E-LAB</li>
                                        <li>Led the team in making key product strategy decisions</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Animated Cursor */}
                        <motion.div
                            className="demo-cursor"
                            variants={cursorVariants}
                            initial="initial"
                            animate="animate"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87c.44 0 .66-.53.35-.85L6.35 2.86a.5.5 0 0 0-.85.35Z" fill="#1f2937" stroke="white" strokeWidth="2"/>
                            </svg>
                            <motion.div
                                className="cursor-click"
                                variants={clickVariants}
                                initial="initial"
                                animate="animate"
                            />
                        </motion.div>
                    </motion.div>

                    {/* Template Selector Popup */}
                    <motion.div
                        className="demo-popup"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <div className="popup-header">
                            <span>Select a template</span>
                            <button className="popup-close">×</button>
                        </div>
                        <div className="template-grid">
                            <div className="template-option">
                                <div className="template-preview modern">
                                    <div className="t-prev-header"></div>
                                    <div className="t-prev-body">
                                        <div className="t-prev-line"></div>
                                        <div className="t-prev-line short"></div>
                                    </div>
                                </div>
                                <span className="t-prev-label">Double column</span>
                            </div>
                            <div className="template-option active">
                                <div className="template-preview single">
                                    <div className="t-prev-sidebar"></div>
                                    <div className="t-prev-main">
                                        <div className="t-prev-line"></div>
                                        <div className="t-prev-line short"></div>
                                    </div>
                                </div>
                                <span className="t-prev-label">Single column</span>
                                <div className="selected-check">✓</div>
                            </div>
                            <div className="template-option">
                                <div className="template-preview minimal">
                                    <div className="t-prev-line"></div>
                                    <div className="t-prev-line"></div>
                                    <div className="t-prev-line short"></div>
                                </div>
                                <span className="t-prev-label">Minimal</span>
                            </div>
                            <div className="template-option">
                                <div className="template-preview professional">
                                    <div className="t-prev-top"></div>
                                    <div className="t-prev-content">
                                        <div className="t-prev-line"></div>
                                        <div className="t-prev-line short"></div>
                                    </div>
                                </div>
                                <span className="t-prev-label">Professional</span>
                            </div>
                        </div>
                        <button className="continue-btn">Continue editing</button>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default InteractiveDemo;
