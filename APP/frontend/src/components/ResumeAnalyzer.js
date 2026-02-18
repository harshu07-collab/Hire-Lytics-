import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/ResumeAnalyzer.css';

const ResumeAnalyzer = ({ backendStatus }) => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const handleUploadClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Navigate to analysis page with file
        navigate('/analysis', { state: { file } });
    };

    return (
        <section className="analyzer-section" id="analyzer">
            <div className="analyzer-container">
                <motion.div
                    className="analyzer-header"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                >
                    <h2 className="analyzer-title">Start Your Resume Analysis</h2>
                    <p className="analyzer-subtitle">
                        Upload your resume and get instant AI-powered feedback in seconds
                    </p>
                </motion.div>

                <motion.div
                    className="analyzer-card"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ delay: 0.2, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                >
                    <motion.div
                        className="upload-area"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                    >
                        <div className="upload-icon">
                            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                                <rect width="64" height="64" rx="12" fill="#e0f2fe" />
                                <path d="M32 20V44M32 20L24 28M32 20L40 28" stroke="#06b6d4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M20 40V46C20 48.2091 21.7909 50 24 50H40C42.2091 50 44 48.2091 44 46V40" stroke="#06b6d4" strokeWidth="3" strokeLinecap="round"/>
                            </svg>
                        </div>
                        <h3 className="upload-title">Drop your resume here or choose a file</h3>
                        <p className="upload-description">PDF & DOCX only. Max 2MB file size.</p>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                            accept=".pdf,.docx"
                        />
                        <button
                            className="btn-upload"
                            onClick={handleUploadClick}
                            data-testid="upload-resume-btn"
                        >
                            Upload Your Resume
                        </button>
                        <p className="upload-privacy">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M8 1L3 3V7C3 10.5 5.5 13.5 8 15C10.5 13.5 13 10.5 13 7V3L8 1Z" stroke="#6b7280" strokeWidth="1.5" strokeLinejoin="round"/>
                            </svg>
                            Privacy guaranteed
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default ResumeAnalyzer;
