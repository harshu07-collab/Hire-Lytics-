import React from 'react';
import { motion } from 'framer-motion';
import '../styles/ResumeBuilder.css';

const ResumeBuilder = () => {
    return (
        <section className="resume-builder-section">
            <div className="builder-container">
                <motion.div
                    className="builder-content"
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="builder-title">
                        Use the best resume builder in the industry
                    </h2>
                    <p className="builder-description">
                        After receiving your checker score you can continue editing and improving your
                        job application with Enhancv's resume builder. Quickly add, reorder, or remove
                        sections.
                    </p>
                    <p className="builder-description">
                        Tailor your resume based on the job posting you're applying for. Ensure that you
                        have the right keywords and skills to match with PDF formatting that an ATS can
                        easily read.
                    </p>
                    <motion.button
                        className="btn-builder"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        data-testid="continue-editing-btn"
                    >
                        Continue Editing
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M7 10H17M17 10L13 6M17 10L13 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </motion.button>
                </motion.div>

                <motion.div
                    className="builder-visual"
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <div className="resume-preview-container">
                        <div className="resume-preview">
                            <div className="preview-header-section">
                                <div className="preview-name">ISABELLE TODD</div>
                                <div className="preview-tagline">I solve problems and help people overcome obstacles.</div>
                                <div className="preview-contact">
                                    <span>+1 (555) 111 1111</span>
                                    <span>isabelle@gmail.com</span>
                                    <span>https://www.linkedin....</span>
                                    <span>New York City, NY</span>
                                </div>
                            </div>
                            <div className="preview-section">
                                <div className="section-title">EXPERIENCE</div>
                                <div className="experience-item">
                                    <div className="exp-title">Product Owner</div>
                                    <div className="exp-company">E-Lab Services</div>
                                    <div className="exp-date">02/2020 - 04/2021</div>
                                    <div className="exp-location">Hamburg, Germany</div>
                                    <ul className="exp-bullets">
                                        <li>Drove the launch of a new tracking software at E-LAB that...</li>
                                        <li>Led the team in making key product strategy decisions...</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="template-selector">
                            <div className="selector-label">Select a template</div>
                            <div className="template-options">
                                <div className="template-thumb active"></div>
                                <div className="template-thumb"></div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            <motion.div
                className="keywords-section"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
            >
                <div className="keywords-badge">Keywords</div>
                <div className="keywords-visual">
                    <div className="keyword-cloud">
                        {['Leadership', 'Strategy', 'Management', 'Analysis', 'Communication', 'Problem-solving'].map((keyword, i) => (
                            <motion.span
                                key={keyword}
                                className="keyword-tag"
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.4 }}
                                whileHover={{ scale: 1.1, y: -2 }}
                            >
                                {keyword}
                            </motion.span>
                        ))}
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

export default ResumeBuilder;
