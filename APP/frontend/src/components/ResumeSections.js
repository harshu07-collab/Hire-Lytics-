import React from 'react';
import { motion } from 'framer-motion';
import '../styles/ResumeSections.css';

const ResumeSections = () => {
    return (
        <section className="resume-sections">
            <div className="sections-container">
                <motion.div
                    className="sections-content"
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="section-number">1</div>
                    <h2 className="sections-title">
                        Enhancv's Resume Checker forms<br />its ATS score with a two-tier system
                    </h2>
                    <p className="sections-description">
                        When you're applying for a job, there's a high chance your resume will be screened
                        through an applicant tracking system way before it finds its way on a recruiter's
                        screen. ATS helps hiring managers find the right candidates by searching for
                        keywords and adding the resume to a database.
                    </p>
                    <p className="sections-description">
                        That's why the success of your resume is highly dependent on how optimized your
                        resume is for the job you're applying for, the resume template you're using, and what
                        skills and keywords you have included.
                    </p>
                </motion.div>

                <motion.div
                    className="sections-visual"
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <div className="mock-device">
                        <div className="device-screen">
                            <div className="screen-content">
                                <div className="content-bar teal"></div>
                                <div className="content-bar purple"></div>
                                <div className="content-bar mint"></div>
                                <div className="content-text">
                                    <div className="text-line"></div>
                                    <div className="text-line short"></div>
                                    <div className="text-line"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            <div className="sections-container reverse">
                <motion.div
                    className="sections-visual"
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="mock-grader">
                        <div className="grader-header">RESUME GRADER</div>
                        <div className="grader-score">
                            <div className="arc-container">
                                <svg viewBox="0 0 100 60" className="arc-svg">
                                    <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#fbbf24" strokeWidth="8" strokeLinecap="round" />
                                </svg>
                            </div>
                        </div>
                        <div className="grader-dots">
                            <span className="dot purple"></span>
                            <span className="dot pink"></span>
                            <span className="dot cyan"></span>
                            <span className="dot mint"></span>
                        </div>
                        <div className="grader-bar"></div>
                    </div>
                </motion.div>

                <motion.div
                    className="sections-content"
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <div className="section-number">2</div>
                    <h2 className="sections-title">
                        What our checker identifies
                    </h2>
                    <p className="sections-description">
                        Similar to an ATS, we analyze and attempt to comprehend your resume. The
                        greater our understanding of your resume, the more effectively it aligns with a
                        company's ATS.
                    </p>
                    <p className="sections-description">
                        Our checker evaluates formatting, content structure, keyword optimization, and
                        readability to ensure your resume passes both automated systems and human review.
                    </p>
                </motion.div>
            </div>
        </section>
    );
};

export default ResumeSections;
