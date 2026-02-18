import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import '../styles/ResumeMachine.css';

const ResumeMachine = () => {
    const [parallaxOffset, setParallaxOffset] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [cycleCount, setCycleCount] = useState(0);
    const [processingStage, setProcessingStage] = useState(0);
    const resumeControls = useAnimation();
    const progressControls = useAnimation();
    const timersRef = useRef([]);
    const sparklePositions = [
        { left: '16%', top: '28%' },
        { left: '62%', top: '22%' },
        { left: '34%', top: '62%' },
        { left: '74%', top: '58%' },
        { left: '46%', top: '34%' },
        { left: '24%', top: '48%' }
    ];

    const clearTimers = () => {
        timersRef.current.forEach((timer) => clearTimeout(timer));
        timersRef.current = [];
    };

    useEffect(() => {
        let isMounted = true;

        const cycleDuration = 10; // seconds
        const stageTimings = [
            { stage: 1, time: 0.6 },
            { stage: 2, time: 2.0 },
            { stage: 3, time: 4.0 },
            { stage: 4, time: 6.4 },
            { stage: 5, time: 8.6 }
        ];

        const runCycle = async () => {
            if (!isMounted) {
                return;
            }

            clearTimers();
            setIsProcessing(true);
            setCycleCount((prev) => prev + 1);
            setProcessingStage(1);

            stageTimings.forEach(({ stage, time }) => {
                const timer = setTimeout(() => {
                    if (isMounted) {
                        setProcessingStage(stage);
                    }
                }, time * 1000);
                timersRef.current.push(timer);
            });

            const resumeAnimation = resumeControls.start({
                x: ['-120%', '5%', '30%', '55%', '80%', '110%'],
                opacity: [0, 1, 1, 1, 1, 0],
                transition: {
                    duration: cycleDuration,
                    times: [0, 0.08, 0.32, 0.55, 0.82, 1],
                    ease: 'linear'
                }
            });

            const progressAnimation = progressControls.start({
                width: ['0%', '8%', '32%', '55%', '82%', '100%'],
                transition: {
                    duration: cycleDuration,
                    times: [0, 0.08, 0.32, 0.55, 0.82, 1],
                    ease: 'linear'
                }
            });

            await Promise.all([resumeAnimation, progressAnimation]);

            if (!isMounted) {
                return;
            }

            setIsProcessing(false);
            setProcessingStage(0);

            const restartTimer = setTimeout(() => {
                if (isMounted) {
                    runCycle();
                }
            }, 1500);
            timersRef.current.push(restartTimer);
        };

        runCycle();

        return () => {
            isMounted = false;
            clearTimers();
        };
    }, [resumeControls, progressControls]);

    useEffect(() => {
        let frame = null;

        const handleScroll = () => {
            if (frame) {
                return;
            }
            frame = requestAnimationFrame(() => {
                const scrollTop = window.scrollY || window.pageYOffset || 0;
                const offset = Math.max(-20, Math.min(20, scrollTop * 0.04));
                setParallaxOffset(offset);
                frame = null;
            });
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (frame) {
                cancelAnimationFrame(frame);
            }
        };
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
                    style={{ '--parallax-offset': `${parallaxOffset}px` }}
                >
                    <div className="ambient-layer">
                        <div className="ambient-sweep"></div>
                        <div className="ambient-glow ambient-glow-left"></div>
                        <div className="ambient-glow ambient-glow-right"></div>
                        <div className="ambient-dots"></div>
                    </div>
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
                                    duration: 1.2,
                                    repeat: Infinity,
                                    ease: "linear"
                                }}
                            />
                            <div className="belt-scanlight" aria-hidden="true"></div>

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
                                        animate={resumeControls}
                                        exit={{ x: '120%', opacity: 0 }}
                                    >
                                        <div className="document-icon" aria-hidden="true">
                                            <div className="document-page" />
                                            <div className="document-lines">
                                                <div className="doc-line"></div>
                                                <div className="doc-line short"></div>
                                                <div className="doc-line"></div>
                                            </div>
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
                                        {processingStage >= 4 && (
                                            <motion.div
                                                className="enhancement-halo"
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: [0.2, 0.8, 0.2], scale: [0.9, 1.08, 0.9] }}
                                                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
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
                                    <div className="station-icon station-icon-scan" aria-hidden="true"></div>
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
                                    <div className="station-icon station-icon-ai" aria-hidden="true"></div>
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
                                    <div className="station-icon station-icon-enhance" aria-hidden="true"></div>
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
                                                            left: sparklePositions[i % sparklePositions.length].left,
                                                            top: sparklePositions[i % sparklePositions.length].top
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
                                                        <span className="sparkle-core" />
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
                                        <span className="status-dot" aria-hidden="true" />
                                        {processingStage === 0 ? 'READY' :
                                           processingStage === 1 ? 'LOADING...' :
                                           processingStage === 2 ? 'SCANNING...' :
                                           processingStage === 3 ? 'PROCESSING...' :
                                           processingStage === 4 ? 'ENHANCING...' :
                                           'COMPLETE'}
                                    </motion.div>
                                    <div className="progress-bar">
                                        <motion.div
                                            className="progress-fill"
                                            animate={progressControls}
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
                            <span className="tag-icon tag-icon-automation" aria-hidden="true"></span>
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
                            <span className="tag-icon tag-icon-ai" aria-hidden="true"></span>
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
                            <span className="tag-icon tag-icon-speed" aria-hidden="true"></span>
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
