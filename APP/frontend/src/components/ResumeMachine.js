import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/ResumeMachine.css';

const ResumeMachine = () => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [cycleCount, setCycleCount] = useState(0);
    const [processingStage, setProcessingStage] = useState(0);
    const [resumePosition, setResumePosition] = useState(0); // 0-100% along conveyor

    useEffect(() => {
        // Auto-start animation cycle
        const interval = setInterval(() => {
            setIsProcessing(true);
            setCycleCount(prev => prev + 1);
            setProcessingStage(0);
            setResumePosition(0);

            // Stage 1: Resume enters conveyor (0-25%)
            setTimeout(() => {
                setProcessingStage(1);
                setResumePosition(25);
            }, 500);

            // Stage 2: Scanning station (25-40%)
            setTimeout(() => {
                setProcessingStage(2);
                setResumePosition(40);
            }, 2000);

            // Stage 3: AI Processing station (40-60%)
            setTimeout(() => {
                setProcessingStage(3);
                setResumePosition(60);
            }, 4000);

            // Stage 4: Enhancement station (60-80%)
            setTimeout(() => {
                setProcessingStage(4);
                setResumePosition(80);
            }, 6000);

            // Stage 5: Exit conveyor (80-100%)
            setTimeout(() => {
                setProcessingStage(5);
                setResumePosition(100);
            }, 8000);

            // Reset after animation completes
            setTimeout(() => {
                setIsProcessing(false);
                setProcessingStage(0);
                setResumePosition(0);
            }, 10000);
        }, 12000); // Cycle every 12 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <section className="resume-machine-section">
            <div className="machine-container">
                <motion.div
                    className="machine-header"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                >
                    <h2 className="machine-title">AI-Powered Resume Assembly Line</h2>
                    <p className="machine-subtitle">
                        Watch your resume transform through our automated enhancement stations
                    </p>
                </motion.div>

                <motion.div
                    className="assembly-line-container"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ delay: 0.2, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                >
                    {/* Main Conveyor Belt */}
                    <div className="conveyor-belt-wrapper">
                        {/* Conveyor Belt Track */}
                        <div className="conveyor-track">
                            {/* Animated Belt Surface */}
                            <motion.div
                                className="belt-surface"
                                animate={{
                                    backgroundPosition: isProcessing ? ['0% 0%', '100% 0%'] : '0% 0%'
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "linear"
                                }}
                            />

                            {/* Belt Rollers */}
                            <motion.div
                                className="belt-roller left-roller"
                                animate={{ rotate: isProcessing ? 360 : 0 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            >
                                <div className="roller-inner"></div>
                            </motion.div>
                            <motion.div
                                className="belt-roller right-roller"
                                animate={{ rotate: isProcessing ? 360 : 0 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            >
                                <div className="roller-inner"></div>
                            </motion.div>

                            {/* Resume Document on Belt */}
                            <AnimatePresence>
                                {isProcessing && (
                                    <motion.div
                                        key={`resume-${cycleCount}`}
                                        className="resume-on-belt"
                                        initial={{ x: '-120%', opacity: 0 }}
                                        animate={{
                                            x: `${resumePosition}%`,
                                            opacity: resumePosition < 100 ? 1 : 0
                                        }}
                                        exit={{ x: '120%', opacity: 0 }}
                                        transition={{
                                            x: { duration: 8, ease: "linear" },
                                            opacity: { duration: 0.5 }
                                        }}
                                    >
                                        <div className="document-icon">📄</div>
                                        <div className="document-lines">
                                            <div className="doc-line"></div>
                                            <div className="doc-line short"></div>
                                            <div className="doc-line"></div>
                                        </div>

                                        {/* Enhancement Glow Effect */}
                                        {processingStage >= 3 && (
                                            <motion.div
                                                className="enhancement-glow"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: [0, 1, 0] }}
                                                transition={{ duration: 1, repeat: Infinity }}
                                            />
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Processing Stations */}
                        <div className="processing-stations">
                            {/* Station 1: Scanner */}
                            <motion.div
                                className={`station scanner-station ${processingStage === 2 ? 'active' : ''}`}
                                style={{ left: '25%' }}
                            >
                                <div className="station-body">
                                    <div className="station-icon">🔍</div>
                                    <div className="station-label">SCAN</div>

                                    {/* Laser Scanner Beam */}
                                    <AnimatePresence>
                                        {processingStage === 2 && (
                                            <motion.div
                                                className="laser-beam"
                                                initial={{ scaleY: 0, opacity: 0 }}
                                                animate={{
                                                    scaleY: [0, 1, 1, 0],
                                                    opacity: [0, 1, 1, 0],
                                                    y: [0, 60, 60, 0]
                                                }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 1.5, repeat: 2 }}
                                            />
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Robotic Arm */}
                                <motion.div
                                    className="robotic-arm"
                                    animate={{
                                        rotate: processingStage === 2 ? [-5, 5, -5] : 0
                                    }}
                                    transition={{ duration: 0.5, repeat: processingStage === 2 ? Infinity : 0 }}
                                >
                                    <div className="arm-segment"></div>
                                    <div className="arm-joint"></div>
                                </motion.div>
                            </motion.div>

                            {/* Station 2: AI Processor */}
                            <motion.div
                                className={`station ai-station ${processingStage === 3 ? 'active' : ''}`}
                                style={{ left: '50%' }}
                            >
                                <div className="station-body">
                                    <div className="station-icon">🤖</div>
                                    <div className="station-label">AI PROCESS</div>

                                    {/* Neural Network Animation */}
                                    <div className="neural-network">
                                        {[...Array(6)].map((_, i) => (
                                            <motion.div
                                                key={`neuron-${i}`}
                                                className="neuron"
                                                style={{
                                                    left: `${(i % 3) * 40 + 10}%`,
                                                    top: `${Math.floor(i / 3) * 50 + 20}%`
                                                }}
                                                animate={{
                                                    scale: processingStage === 3 ? [1, 1.3, 1] : 1,
                                                    opacity: processingStage === 3 ? [0.5, 1, 0.5] : 0.5
                                                }}
                                                transition={{
                                                    duration: 0.8,
                                                    delay: i * 0.1,
                                                    repeat: processingStage === 3 ? Infinity : 0
                                                }}
                                            />
                                        ))}
                                    </div>

                                    {/* Data Particles */}
                                    <AnimatePresence>
                                        {processingStage === 3 && (
                                            <>
                                                {[...Array(8)].map((_, i) => (
                                                    <motion.div
                                                        key={`ai-particle-${cycleCount}-${i}`}
                                                        className="ai-particle"
                                                        initial={{
                                                            x: 0,
                                                            y: 0,
                                                            opacity: 0
                                                        }}
                                                        animate={{
                                                            x: Math.cos((i * Math.PI * 2) / 8) * 40,
                                                            y: Math.sin((i * Math.PI * 2) / 8) * 40,
                                                            opacity: [0, 1, 0]
                                                        }}
                                                        transition={{
                                                            duration: 1.5,
                                                            delay: i * 0.1,
                                                            repeat: Infinity
                                                        }}
                                                    />
                                                ))}
                                            </>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </motion.div>

                            {/* Station 3: Enhancer */}
                            <motion.div
                                className={`station enhancer-station ${processingStage === 4 ? 'active' : ''}`}
                                style={{ left: '75%' }}
                            >
                                <div className="station-body">
                                    <div className="station-icon">✨</div>
                                    <div className="station-label">ENHANCE</div>

                                    {/* Enhancement Rays */}
                                    <AnimatePresence>
                                        {processingStage === 4 && (
                                            <>
                                                {[...Array(5)].map((_, i) => (
                                                    <motion.div
                                                        key={`ray-${cycleCount}-${i}`}
                                                        className="enhancement-ray"
                                                        style={{
                                                            left: `${i * 20}%`,
                                                            animationDelay: `${i * 0.1}s`
                                                        }}
                                                        initial={{ scaleY: 0, opacity: 0 }}
                                                        animate={{
                                                            scaleY: [0, 1, 0],
                                                            opacity: [0, 1, 0]
                                                        }}
                                                        exit={{ opacity: 0 }}
                                                        transition={{
                                                            duration: 1,
                                                            delay: i * 0.1,
                                                            repeat: Infinity,
                                                            repeatDelay: 0.5
                                                        }}
                                                    />
                                                ))}
                                            </>
                                        )}
                                    </AnimatePresence>

                                    {/* Sparkle Effects */}
                                    <AnimatePresence>
                                        {processingStage === 4 && (
                                            <>
                                                {[...Array(6)].map((_, i) => (
                                                    <motion.div
                                                        key={`sparkle-${cycleCount}-${i}`}
                                                        className="station-sparkle"
                                                        style={{
                                                            left: `${Math.random() * 80 + 10}%`,
                                                            top: `${Math.random() * 60 + 20}%`
                                                        }}
                                                        initial={{ scale: 0, opacity: 0, rotate: 0 }}
                                                        animate={{
                                                            scale: [0, 1, 0],
                                                            opacity: [0, 1, 0],
                                                            rotate: [0, 180]
                                                        }}
                                                        transition={{
                                                            duration: 1,
                                                            delay: i * 0.15,
                                                            repeat: Infinity,
                                                            repeatDelay: 0.5
                                                        }}
                                                    >
                                                        ✨
                                                    </motion.div>
                                                ))}
                                            </>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Mechanical Piston */}
                                <motion.div
                                    className="piston"
                                    animate={{
                                        y: processingStage === 4 ? [0, 15, 0] : 0
                                    }}
                                    transition={{
                                        duration: 0.6,
                                        repeat: processingStage === 4 ? Infinity : 0
                                    }}
                                >
                                    <div className="piston-rod"></div>
                                    <div className="piston-head"></div>
                                </motion.div>
                            </motion.div>
                        </div>

                        {/* Gears Decoration */}
                        <div className="gears-container">
                            <motion.div
                                className="gear gear-1"
                                animate={{ rotate: isProcessing ? 360 : 0 }}
                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                            >
                                <div className="gear-tooth"></div>
                                <div className="gear-tooth"></div>
                                <div className="gear-tooth"></div>
                                <div className="gear-tooth"></div>
                                <div className="gear-tooth"></div>
                                <div className="gear-tooth"></div>
                            </motion.div>
                            <motion.div
                                className="gear gear-2"
                                animate={{ rotate: isProcessing ? -360 : 0 }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            >
                                <div className="gear-tooth"></div>
                                <div className="gear-tooth"></div>
                                <div className="gear-tooth"></div>
                                <div className="gear-tooth"></div>
                            </motion.div>
                        </div>

                        {/* Status Display */}
                        <div className="status-display">
                            <div className="display-screen">
                                <div className="screen-header">SYSTEM STATUS</div>
                                <div className="screen-content">
                                    <motion.div
                                        className="status-line"
                                        animate={{
                                            color: isProcessing ? '#10b981' : '#64748b'
                                        }}
                                    >
                                        ● {processingStage === 0 ? 'READY' :
                                           processingStage === 1 ? 'LOADING...' :
                                           processingStage === 2 ? 'SCANNING...' :
                                           processingStage === 3 ? 'PROCESSING...' :
                                           processingStage === 4 ? 'ENHANCING...' :
                                           'COMPLETE'}
                                    </motion.div>
                                    <div className="progress-bar">
                                        <motion.div
                                            className="progress-fill"
                                            animate={{
                                                width: `${resumePosition}%`
                                            }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Feature Tags */}
                    <div className="feature-tags">
                        <motion.div
                            className="feature-tag"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                            whileHover={{ scale: 1.05, y: -2 }}
                        >
                            <span className="tag-icon">⚙️</span>
                            Automated Process
                        </motion.div>
                        <motion.div
                            className="feature-tag"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                            whileHover={{ scale: 1.05, y: -2 }}
                        >
                            <span className="tag-icon">🤖</span>
                            AI-Powered
                        </motion.div>
                        <motion.div
                            className="feature-tag"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.6, duration: 0.5 }}
                            whileHover={{ scale: 1.05, y: -2 }}
                        >
                            <span className="tag-icon">⚡</span>
                            Lightning Fast
                        </motion.div>
                    </div>
                </motion.div>

                {/* Processing Stats */}
                <motion.div
                    className="processing-stats"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.7, duration: 0.6 }}
                >
                    <div className="stat-item">
                        <div className="stat-value">
                            <motion.span
                                key={isProcessing ? 'active' : 'idle'}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                {isProcessing ? '95%' : '100%'}
                            </motion.span>
                        </div>
                        <div className="stat-label">Success Rate</div>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat-item">
                        <div className="stat-value">
                            <motion.span
                                key={isProcessing ? 'processing' : 'ready'}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                {isProcessing ? '8s' : '<10s'}
                            </motion.span>
                        </div>
                        <div className="stat-label">Processing Time</div>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat-item">
                        <div className="stat-value">
                            <motion.span
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                50K+
                            </motion.span>
                        </div>
                        <div className="stat-label">Resumes Enhanced</div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default ResumeMachine;
