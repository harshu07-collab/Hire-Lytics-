import React from 'react';
import { motion } from 'framer-motion';
import '../styles/ResumeMachine.css';

const ResumeMachine = () => {
    return (
        <section className="resume-machine-section">
            <div className="machine-container">
                <motion.div
                    className="machine-header"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="machine-title">See the Magic Happen</h2>
                    <p className="machine-subtitle">
                        Watch how our AI transforms your resume in real-time
                    </p>
                </motion.div>

                <div className="machine-visual">
                    {/* Input Resume */}
                    <motion.div
                        className="resume-input"
                        animate={{
                            y: [0, 20, 20, 0],
                            opacity: [1, 1, 0, 0, 1],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                            times: [0, 0.2, 0.4, 0.45, 1]
                        }}
                    >
                        <div className="resume-sheet input">
                            <div className="sheet-header"></div>
                            <div className="sheet-lines">
                                <div className="sheet-line"></div>
                                <div className="sheet-line short"></div>
                                <div className="sheet-line"></div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Machine */}
                    <div className="machine-body">
                        <div className="machine-top">
                            <span className="machine-label">RESUME GRADER</span>
                        </div>
                        
                        {/* Gauge */}
                        <div className="machine-gauge">
                            <motion.div
                                className="gauge-needle"
                                animate={{
                                    rotate: [-45, 45, -45],
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    times: [0, 0.5, 1]
                                }}
                            />
                            <div className="gauge-arc"></div>
                        </div>

                        {/* Waveform */}
                        <div className="machine-waveform">
                            <motion.div
                                className="wave-line"
                                animate={{
                                    scaleY: [0.3, 1, 0.3, 0.8, 0.3],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            />
                            <motion.div
                                className="wave-line"
                                animate={{
                                    scaleY: [0.8, 0.3, 1, 0.3, 0.8],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: 0.2
                                }}
                            />
                            <motion.div
                                className="wave-line"
                                animate={{
                                    scaleY: [0.3, 0.8, 0.3, 1, 0.3],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: 0.4
                                }}
                            />
                        </div>

                        {/* Progress Bar */}
                        <div className="machine-progress">
                            <motion.div
                                className="progress-fill"
                                animate={{
                                    width: ["0%", "100%", "100%", "0%"],
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    times: [0, 0.4, 0.8, 1]
                                }}
                            />
                        </div>

                        {/* Status Lights */}
                        <div className="machine-lights">
                            <motion.span
                                className="light"
                                animate={{ opacity: [0.3, 1, 0.3] }}
                                transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                            />
                            <motion.span
                                className="light active"
                                animate={{ opacity: [0.3, 1, 0.3] }}
                                transition={{ duration: 1, repeat: Infinity, delay: 0.25 }}
                            />
                            <motion.span
                                className="light"
                                animate={{ opacity: [0.3, 1, 0.3] }}
                                transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
                            />
                            <motion.span
                                className="light"
                                animate={{ opacity: [0.3, 1, 0.3] }}
                                transition={{ duration: 1, repeat: Infinity, delay: 0.75 }}
                            />
                        </div>

                        {/* Slot */}
                        <div className="machine-slot"></div>
                    </div>

                    {/* Output Resume */}
                    <motion.div
                        className="resume-output"
                        animate={{
                            y: [20, 0, 0, 20],
                            opacity: [0, 0, 1, 1, 0],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                            times: [0, 0.4, 0.6, 0.9, 1]
                        }}
                    >
                        <div className="resume-sheet output">
                            <div className="sheet-header improved"></div>
                            <div className="sheet-lines">
                                <div className="sheet-line"></div>
                                <div className="sheet-line short"></div>
                                <div className="sheet-line"></div>
                            </div>
                            <div className="improved-badge">
                                <span>+25%</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default ResumeMachine;
