import React from 'react';
import { motion } from 'framer-motion';
import '../styles/AIRewrite.css';

const AIRewrite = () => {
    return (
        <section className="ai-rewrite-section">
            <div className="ai-rewrite-container">
                <motion.div
                    className="ai-rewrite-content"
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="ai-rewrite-title">
                        Rewrite your resume with AI
                    </h2>
                    <p className="ai-rewrite-description">
                        Get your resume rewritten by the world's best <strong>AI engine (ChatGPT 4.0)</strong> in
                        combination with tailored prompts and a fine-tuned model based on your
                        resume and the job ad you're applying for to save time.
                    </p>
                    <p className="ai-rewrite-description">
                        Receive content suggestions based on the sections your resume currently has.
                        Generate a resume summary or objective based on your experience. Get skills
                        suggestions based on the industry you're applying for. Omit buzzwords, filler
                        words, and irrelevant content.
                    </p>
                    <div className="ai-rewrite-features">
                        <motion.div
                            className="feature-tag"
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2, duration: 0.4 }}
                            whileHover={{ scale: 1.05 }}
                        >
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M10 2L12.5 7.5L18 8L14 12.5L15 18L10 15L5 18L6 12.5L2 8L7.5 7.5L10 2Z" fill="#10b981" />
                            </svg>
                            AI-Powered Suggestions
                        </motion.div>
                        <motion.div
                            className="feature-tag"
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4, duration: 0.4 }}
                            whileHover={{ scale: 1.05 }}
                        >
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <circle cx="10" cy="10" r="8" stroke="#06b6d4" strokeWidth="2" fill="none" />
                                <path d="M6 10L9 13L14 7" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" fill="none" />
                            </svg>
                            Context-Aware Rewriting
                        </motion.div>
                        <motion.div
                            className="feature-tag"
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.6, duration: 0.4 }}
                            whileHover={{ scale: 1.05 }}
                        >
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <rect x="3" y="3" width="14" height="14" rx="2" stroke="#8b5cf6" strokeWidth="2" fill="none" />
                                <path d="M7 10H13M10 7V13" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                            Buzzword Elimination
                        </motion.div>
                    </div>
                </motion.div>

                <motion.div
                    className="ai-rewrite-visual"
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <div className="ai-interface">
                        <div className="ai-sidebar">
                            <div className="sidebar-item active">Sections</div>
                            <div className="sidebar-item">Templates</div>
                            <div className="sidebar-item">Design & Font</div>
                            <div className="sidebar-item">Improve text</div>
                            <div className="sidebar-item">Check</div>
                            <div className="sidebar-item">Download</div>
                            <div className="sidebar-item">Share</div>
                            <div className="sidebar-item">History</div>
                        </div>
                        <div className="ai-content">
                            <div className="chat-header">Help you today?</div>
                            <div className="chat-message assistant">AI Assistant - 15:33</div>
                            <div className="chat-message user">Write & improve my resume<br />You - 15:33</div>
                            <div className="chat-message assistant">How do you want to improve your resume?<br />AI Assistant - 15:33</div>
                            <div className="chat-options">
                                <div className="chat-option">Create tailored summary</div>
                                <div className="chat-option">Highlight my strengths</div>
                                <div className="chat-option">Highlight my achievements</div>
                                <div className="chat-option">Create suggestions for new bullets</div>
                                <div className="chat-option">Re-write my bullets to show impact</div>
                            </div>
                        </div>
                        <div className="ai-preview">
                            <div className="preview-card">
                                <div className="preview-header">STRENGTHS</div>
                                <div className="preview-item">
                                    <div className="preview-icon">▸</div>
                                    <div className="preview-text">
                                        <strong>Strategic Leadership</strong>
                                        <p>Proven ability to guide teams and projects toward successful outcomes</p>
                                    </div>
                                </div>
                                <div className="preview-item">
                                    <div className="preview-icon">▸</div>
                                    <div className="preview-text">
                                        <strong>Problem-Solving Skills</strong>
                                        <p>Expert in identifying and resolving complex technical challenges</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default AIRewrite;
