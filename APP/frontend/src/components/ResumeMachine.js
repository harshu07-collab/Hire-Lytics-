import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/ResumeMachine.css';

const ResumeMachine = () => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [cycleCount, setCycleCount] = useState(0);
    const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
    const [isClicking, setIsClicking] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [showInterface, setShowInterface] = useState(false);

    useEffect(() => {
        // Auto-start animation cycle with cursor interaction
        const interval = setInterval(() => {
            setIsProcessing(true);
            setCycleCount(prev => prev + 1);
            setCurrentStep(0);
            setShowInterface(true);

            // Reset after animation completes
            setTimeout(() => {
                setIsProcessing(false);
                setShowInterface(false);
            }, 12000); // Extended animation duration
        }, 15000); // Cycle every 15 seconds

        return () => clearInterval(interval);
    }, []);

    // Cursor animation sequence
    useEffect(() => {
        if (!isProcessing) return;

        const cursorSequence = [
            // Step 1: Move to sidebar menu (Manage Sections)
            { step: 0, delay: 500, x: -320, y: -150, click: false },
            { step: 1, delay: 1000, x: -320, y: -150, click: true },

            // Step 2: Move to "Write & improve my resume" button in chat
            { step: 2, delay: 1800, x: -100, y: -80, click: false },
            { step: 3, delay: 2300, x: -100, y: -80, click: true },

            // Step 3: Move to bullet points area in chat
            { step: 4, delay: 3500, x: -80, y: 60, click: false },
            { step: 5, delay: 4000, x: -80, y: 60, click: true },

            // Step 4: Move to AI Assistant icon in sidebar
            { step: 6, delay: 5200, x: -320, y: -60, click: false },
            { step: 7, delay: 5700, x: -320, y: -60, click: true },

            // Step 5: Move to check icon in sidebar
            { step: 8, delay: 7000, x: -320, y: 0, click: false },
            { step: 9, delay: 7500, x: -320, y: 0, click: true },

            // Step 6: Hover over enhanced resume preview
            { step: 10, delay: 9000, x: 220, y: 80, click: false },
            { step: 11, delay: 9800, x: 220, y: 80, click: true },

            // Step 7: Move to download button in sidebar
            { step: 12, delay: 11000, x: -320, y: 180, click: false },
            { step: 13, delay: 11500, x: -320, y: 180, click: true },
        ];

        cursorSequence.forEach(({ step, delay, x, y, click }) => {
            setTimeout(() => {
                setCursorPosition({ x, y });
                setCurrentStep(step);
                if (click) {
                    setIsClicking(true);
                    setTimeout(() => setIsClicking(false), 300);
                }
            }, delay);
        });
    }, [isProcessing, cycleCount]);

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
                    <h2 className="machine-title">AI-Powered Resume Enhancement</h2>
                    <p className="machine-subtitle">
                        Watch how users interact with our AI to transform their resume in real-time
                    </p>
                </motion.div>

                <motion.div
                    className="machine-visual"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ delay: 0.2, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                >
                    {/* Animated Cursor */}
                    <AnimatePresence>
                        {showInterface && (
                            <motion.div
                                className="animated-cursor"
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{
                                    opacity: 1,
                                    scale: isClicking ? 0.8 : 1,
                                    x: cursorPosition.x,
                                    y: cursorPosition.y
                                }}
                                exit={{ opacity: 0, scale: 0 }}
                                transition={{
                                    x: { duration: 0.8, ease: [0.4, 0, 0.2, 1] },
                                    y: { duration: 0.8, ease: [0.4, 0, 0.2, 1] },
                                    scale: { duration: 0.2 },
                                    opacity: { duration: 0.3 }
                                }}
                            >
                                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                                    <path
                                        d="M8 4 L8 24 L14 18 L18 28 L22 26 L18 16 L26 16 Z"
                                        fill="white"
                                        stroke="#1f2937"
                                        strokeWidth="1.5"
                                    />
                                    <motion.circle
                                        cx="16"
                                        cy="16"
                                        r="20"
                                        fill="none"
                                        stroke="rgba(16, 185, 129, 0.4)"
                                        strokeWidth="2"
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={isClicking ? {
                                            scale: [1, 2],
                                            opacity: [0.6, 0]
                                        } : {}}
                                        transition={{ duration: 0.6 }}
                                    />
                                </svg>
                                <motion.div
                                    className="cursor-glow"
                                    animate={{
                                        scale: isClicking ? [1, 1.5, 1] : 1,
                                        opacity: isClicking ? [0.8, 0, 0.8] : 0.6
                                    }}
                                    transition={{ duration: 0.6 }}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Interactive UI Mockup */}
                    <AnimatePresence>
                        {showInterface && (
                            <motion.div
                                className="ui-mockup-container"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{
                                    opacity: 1,
                                    scale: currentStep === 1 || currentStep === 3 || currentStep === 5 || currentStep === 7 || currentStep === 9 || currentStep === 11 || currentStep === 13 ? 1.05 : 1
                                }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                            >
                                {/* Sidebar Menu */}
                                <div className="sidebar-mockup">
                                    <div className="sidebar-header">
                                        <div className="logo-mock">📊</div>
                                        <div className="app-name">Hire-Lytics</div>
                                    </div>

                                    <div className="sidebar-menu">
                                        <motion.div
                                            className="menu-item"
                                            animate={{
                                                backgroundColor: currentStep === 1 ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                                                scale: currentStep === 1 ? 1.05 : 1
                                            }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <span className="menu-icon">📝</span>
                                            <span className="menu-text">Manage Sections</span>
                                        </motion.div>

                                        <motion.div
                                            className="menu-item"
                                            animate={{
                                                backgroundColor: currentStep === 7 ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                                                scale: currentStep === 7 ? 1.05 : 1
                                            }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <span className="menu-icon">🤖</span>
                                            <span className="menu-text">AI Assistant</span>
                                        </motion.div>

                                        <motion.div
                                            className="menu-item"
                                            animate={{
                                                backgroundColor: currentStep === 9 ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                                                scale: currentStep === 9 ? 1.05 : 1
                                            }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <span className="menu-icon">✓</span>
                                            <span className="menu-text">Check</span>
                                        </motion.div>

                                        <div className="menu-item">
                                            <span className="menu-icon">🎨</span>
                                            <span className="menu-text">Design & Font</span>
                                        </div>

                                        <div className="menu-item">
                                            <span className="menu-icon">📄</span>
                                            <span className="menu-text">Templates</span>
                                        </div>

                                        <motion.div
                                            className="menu-item download-item"
                                            animate={{
                                                backgroundColor: currentStep === 13 ? 'rgba(16, 185, 129, 0.3)' : 'rgba(16, 185, 129, 0.1)',
                                                scale: currentStep === 13 ? 1.08 : 1,
                                                boxShadow: currentStep === 13 ? '0 0 20px rgba(16, 185, 129, 0.4)' : '0 2px 8px rgba(0, 0, 0, 0.1)'
                                            }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <span className="menu-icon">⬇️</span>
                                            <span className="menu-text">Download</span>
                                        </motion.div>
                                    </div>

                                    <div className="sidebar-footer">
                                        <div className="branding-toggle">
                                            <span className="toggle-label">Branding</span>
                                            <motion.div
                                                className="toggle-switch"
                                                animate={{
                                                    backgroundColor: currentStep >= 8 ? '#10b981' : '#94a3b8'
                                                }}
                                            >
                                                <motion.div
                                                    className="toggle-knob"
                                                    animate={{
                                                        x: currentStep >= 8 ? 16 : 0
                                                    }}
                                                />
                                            </motion.div>
                                        </div>
                                    </div>
                                </div>

                                {/* Chat Interface Mockup */}
                                <div className="chat-mockup">
                                    <motion.div
                                        className="chat-bubble user-bubble"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: currentStep >= 0 ? 1 : 0, x: 0 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        <div className="bubble-text">help you today?</div>
                                        <div className="bubble-time">AI Assistant - 15:33</div>
                                    </motion.div>

                                    <motion.div
                                        className="chat-bubble assistant-bubble highlight-bubble"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{
                                            opacity: currentStep >= 2 ? 1 : 0,
                                            x: 0,
                                            scale: currentStep === 3 ? 1.05 : 1,
                                            boxShadow: currentStep === 3 ?
                                                "0 0 30px rgba(16, 185, 129, 0.4)" :
                                                "0 4px 12px rgba(0, 0, 0, 0.1)"
                                        }}
                                        transition={{ delay: 1.8 }}
                                    >
                                        <div className="bubble-text">Write & improve my resume</div>
                                        <div className="bubble-time">You - 15:33</div>
                                    </motion.div>

                                    <motion.div
                                        className="chat-bubble user-bubble"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: currentStep >= 4 ? 1 : 0, x: 0 }}
                                        transition={{ delay: 3.5 }}
                                    >
                                        <div className="bubble-text">How do you want to improve your resume?</div>
                                        <div className="bubble-time">AI Assistant - 15:33</div>
                                    </motion.div>

                                    <motion.div
                                        className="chat-bubble assistant-bubble highlight-bubble"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{
                                            opacity: currentStep >= 4 ? 1 : 0,
                                            x: 0,
                                            scale: currentStep === 5 ? 1.05 : 1,
                                            boxShadow: currentStep === 5 ?
                                                "0 0 30px rgba(16, 185, 129, 0.4)" :
                                                "0 4px 12px rgba(0, 0, 0, 0.1)"
                                        }}
                                        transition={{ delay: 3.8 }}
                                    >
                                        <div className="bubble-text">Re-write my bullets to show impact</div>
                                        <div className="bubble-time">You - 15:33</div>
                                    </motion.div>

                                    <motion.div
                                        className="chat-bubble user-bubble processing-bubble"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: currentStep >= 6 ? 1 : 0, x: 0 }}
                                        transition={{ delay: 5.5 }}
                                    >
                                        <div className="bubble-text">
                                            <motion.span
                                                animate={{ opacity: [0.3, 1, 0.3] }}
                                                transition={{ duration: 1.5, repeat: Infinity }}
                                            >
                                                Processing your request...
                                            </motion.span>
                                        </div>
                                        <div className="bubble-time">AI Assistant - 15:34</div>
                                    </motion.div>

                                    <motion.div
                                        className="chat-bubble user-bubble success-bubble"
                                        initial={{ opacity: 0, x: -20, scale: 0.9 }}
                                        animate={{
                                            opacity: currentStep >= 10 ? 1 : 0,
                                            x: 0,
                                            scale: currentStep >= 10 ? 1 : 0.9
                                        }}
                                        transition={{ delay: 9.2 }}
                                    >
                                        <div className="bubble-text">
                                            ✨ Your resume has been enhanced! Check the preview on the right.
                                        </div>
                                        <div className="bubble-time">AI Assistant - 15:34</div>
                                    </motion.div>
                                </div>

                                {/* Resume Preview Mockup */}
                                <motion.div
                                    className="resume-preview-mockup"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{
                                        opacity: currentStep >= 6 ? 1 : 0,
                                        scale: currentStep === 7 ? 1.08 : currentStep >= 6 ? 1 : 0.95,
                                        y: currentStep >= 6 ? 0 : 20
                                    }}
                                    transition={{ delay: 7, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                                >
                                    <div className="resume-header-mock">
                                        <div className="resume-title-mock">STRENGTHS</div>
                                        <div className="strength-badge">
                                            <span className="badge-icon-mock">🎯</span>
                                            Strategic Leadership
                                        </div>
                                    </div>
                                    <div className="resume-content-mock">
                                        <div className="skill-item-mock">
                                            <span className="check-icon">✓</span>
                                            <span>Problem-Solving Skills</span>
                                        </div>
                                        <div className="skill-item-mock">
                                            <span className="check-icon">✓</span>
                                            <span>Effective Communication</span>
                                        </div>
                                    </div>
                                    <div className="skills-section-mock">
                                        <div className="skill-tag-mock">Cloud Computing</div>
                                        <div className="skill-tag-mock">Project Management</div>
                                        <div className="skill-tag-mock">IT Security</div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    {/* Machine Body */}
                    <div className="machine-body">
                        {/* Input Slot */}
                        <div className="input-slot">
                            <div className="slot-label">Input</div>
                            <div className="slot-opening">
                                <motion.div
                                    className="slot-light"
                                    animate={{
                                        opacity: [0.3, 1, 0.3],
                                        scale: [1, 1.2, 1]
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                />
                            </div>
                        </div>

                        {/* Processing Core */}
                        <div className="processing-core">
                            {/* Enhanced Multi-layer Glow */}
                            <div className="core-glow">
                                <motion.div
                                    className="glow-ring"
                                    animate={{
                                        rotate: 360,
                                        scale: [1, 1.1, 1]
                                    }}
                                    transition={{
                                        rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                                        scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                                    }}
                                />
                                <motion.div
                                    className="glow-ring-2"
                                    animate={{
                                        rotate: -360,
                                        scale: [1.1, 1, 1.1]
                                    }}
                                    transition={{
                                        rotate: { duration: 4, repeat: Infinity, ease: "linear" },
                                        scale: { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
                                    }}
                                />
                                <motion.div
                                    className="glow-ring-3"
                                    animate={{
                                        rotate: 360,
                                        scale: [1, 1.15, 1],
                                        opacity: [0.3, 0.6, 0.3]
                                    }}
                                    transition={{
                                        rotate: { duration: 5, repeat: Infinity, ease: "linear" },
                                        scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                                        opacity: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                                    }}
                                />
                            </div>

                            {/* Energy Flow Lines */}
                            <div className="energy-flows">
                                {[...Array(6)].map((_, i) => (
                                    <motion.div
                                        key={`flow-${i}`}
                                        className="energy-line"
                                        style={{
                                            transform: `rotate(${i * 60}deg)`
                                        }}
                                        animate={{
                                            opacity: [0, 1, 0],
                                            scale: [0.8, 1.2, 0.8]
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            delay: i * 0.3,
                                            ease: "easeInOut"
                                        }}
                                    />
                                ))}
                            </div>

                            <div className="core-center">
                                {/* Enhanced SVG with multiple layers */}
                                <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
                                    {/* Outer hexagon */}
                                    <motion.path
                                        d="M50 15 L75 30 L75 60 L50 75 L25 60 L25 30 Z"
                                        stroke="url(#coreGradient)"
                                        strokeWidth="2"
                                        fill="none"
                                        initial={{ pathLength: 0, opacity: 0 }}
                                        animate={{
                                            pathLength: [0, 1, 1, 0],
                                            opacity: [0, 1, 1, 0]
                                        }}
                                        transition={{
                                            duration: 4,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                    />
                                    {/* Middle hexagon */}
                                    <motion.path
                                        d="M50 20 L70 32.5 L70 57.5 L50 70 L30 57.5 L30 32.5 Z"
                                        stroke="url(#coreGradient2)"
                                        strokeWidth="2"
                                        fill="none"
                                        initial={{ pathLength: 0, opacity: 0 }}
                                        animate={{
                                            pathLength: [0, 1, 1, 0],
                                            opacity: [0, 1, 1, 0]
                                        }}
                                        transition={{
                                            duration: 4,
                                            repeat: Infinity,
                                            delay: 0.5,
                                            ease: "easeInOut"
                                        }}
                                    />
                                    {/* Inner hexagon */}
                                    <motion.path
                                        d="M50 25 L65 35 L65 55 L50 65 L35 55 L35 35 Z"
                                        stroke="url(#coreGradient3)"
                                        strokeWidth="2.5"
                                        fill="rgba(6, 182, 212, 0.1)"
                                        initial={{ pathLength: 0, opacity: 0 }}
                                        animate={{
                                            pathLength: [0, 1, 1, 0],
                                            opacity: [0, 1, 1, 0]
                                        }}
                                        transition={{
                                            duration: 4,
                                            repeat: Infinity,
                                            delay: 1,
                                            ease: "easeInOut"
                                        }}
                                    />
                                    {/* Circuit pattern */}
                                    <motion.circle
                                        cx="50"
                                        cy="50"
                                        r="8"
                                        stroke="#10b981"
                                        strokeWidth="2"
                                        fill="none"
                                        animate={{
                                            scale: [1, 1.3, 1],
                                            opacity: [0.5, 1, 0.5]
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                    />
                                    <defs>
                                        <linearGradient id="coreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#06b6d4" />
                                            <stop offset="50%" stopColor="#10b981" />
                                            <stop offset="100%" stopColor="#06b6d4" />
                                        </linearGradient>
                                        <linearGradient id="coreGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
                                            <stop offset="0%" stopColor="#10b981" />
                                            <stop offset="50%" stopColor="#06b6d4" />
                                            <stop offset="100%" stopColor="#10b981" />
                                        </linearGradient>
                                        <linearGradient id="coreGradient3" x1="50%" y1="0%" x2="50%" y2="100%">
                                            <stop offset="0%" stopColor="#06b6d4" />
                                            <stop offset="100%" stopColor="#10b981" />
                                        </linearGradient>
                                    </defs>
                                </svg>

                                <motion.div
                                    className="ai-text"
                                    animate={{
                                        opacity: [0.5, 1, 0.5],
                                        scale: [0.95, 1.05, 0.95]
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                >
                                    AI
                                </motion.div>
                            </div>

                            {/* Enhanced Processing Particles */}
                            <AnimatePresence>
                                {isProcessing && (
                                    <>
                                        {/* Primary particles */}
                                        {[...Array(12)].map((_, i) => (
                                            <motion.div
                                                key={`particle-${cycleCount}-${i}`}
                                                className="processing-particle"
                                                initial={{
                                                    x: 0,
                                                    y: 0,
                                                    opacity: 0,
                                                    scale: 0
                                                }}
                                                animate={{
                                                    x: Math.cos((i * Math.PI * 2) / 12) * 90,
                                                    y: Math.sin((i * Math.PI * 2) / 12) * 90,
                                                    opacity: [0, 1, 0.5, 0],
                                                    scale: [0, 1.2, 0.8, 0]
                                                }}
                                                transition={{
                                                    duration: 2,
                                                    delay: i * 0.08,
                                                    ease: "easeOut"
                                                }}
                                            />
                                        ))}
                                        {/* Secondary smaller particles */}
                                        {[...Array(16)].map((_, i) => (
                                            <motion.div
                                                key={`particle-small-${cycleCount}-${i}`}
                                                className="processing-particle-small"
                                                initial={{
                                                    x: 0,
                                                    y: 0,
                                                    opacity: 0,
                                                    scale: 0
                                                }}
                                                animate={{
                                                    x: Math.cos((i * Math.PI * 2) / 16) * 60,
                                                    y: Math.sin((i * Math.PI * 2) / 16) * 60,
                                                    opacity: [0, 0.8, 0],
                                                    scale: [0, 1, 0]
                                                }}
                                                transition={{
                                                    duration: 1.5,
                                                    delay: 0.3 + i * 0.05,
                                                    ease: "easeOut"
                                                }}
                                            />
                                        ))}
                                        {/* Energy waves */}
                                        {[...Array(3)].map((_, i) => (
                                            <motion.div
                                                key={`wave-${cycleCount}-${i}`}
                                                className="energy-wave"
                                                initial={{
                                                    scale: 0,
                                                    opacity: 0
                                                }}
                                                animate={{
                                                    scale: [0, 2.5, 3],
                                                    opacity: [0, 0.6, 0]
                                                }}
                                                transition={{
                                                    duration: 2,
                                                    delay: i * 0.4,
                                                    ease: "easeOut"
                                                }}
                                            />
                                        ))}
                                    </>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Output Slot */}
                        <div className="output-slot">
                            <div className="slot-label">Output</div>
                            <div className="slot-opening">
                                <motion.div
                                    className="slot-light success"
                                    animate={{
                                        opacity: [0.3, 1, 0.3],
                                        scale: [1, 1.2, 1]
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                        delay: 0.5
                                    }}
                                />
                            </div>
                        </div>

                        {/* Status Indicators */}
                        <div className="status-indicators">
                            <motion.div
                                className="status-dot"
                                animate={{
                                    backgroundColor: ["#10b981", "#06b6d4", "#10b981"]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            />
                            <motion.div
                                className="status-dot"
                                animate={{
                                    backgroundColor: ["#06b6d4", "#10b981", "#06b6d4"]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: 0.3
                                }}
                            />
                            <motion.div
                                className="status-dot"
                                animate={{
                                    backgroundColor: ["#10b981", "#06b6d4", "#10b981"]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: 0.6
                                }}
                            />
                        </div>
                    </div>

                    {/* Animated Resume Documents */}
                    <AnimatePresence>
                        {isProcessing && (
                            <>
                                {/* Input Resume */}
                                <motion.div
                                    key={`input-${cycleCount}`}
                                    className="resume-document input-resume"
                                    initial={{ x: -100, y: 0, opacity: 0, rotate: -10, scale: 0.8 }}
                                    animate={{
                                        x: [-100, -50, 0],
                                        y: 0,
                                        opacity: [0, 1, 1],
                                        rotate: [-10, -3, 0],
                                        scale: [0.8, 1.02, 1]
                                    }}
                                    exit={{ opacity: 0, scale: 0.5, rotate: -5 }}
                                    transition={{
                                        duration: 1.2,
                                        ease: [0.4, 0, 0.2, 1]
                                    }}
                                >
                                    <motion.div
                                        className="document-glow-effect"
                                        animate={{
                                            opacity: [0, 0.5, 0],
                                            scale: [0.9, 1.1, 0.9]
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                    />
                                    <div className="document-header">
                                        <div className="doc-icon">📄</div>
                                        <div className="doc-title">Original Resume</div>
                                    </div>
                                    <div className="document-content">
                                        <motion.div
                                            className="doc-line"
                                            initial={{ width: 0 }}
                                            animate={{ width: "100%" }}
                                            transition={{ duration: 0.5, delay: 0.3 }}
                                        />
                                        <motion.div
                                            className="doc-line short"
                                            initial={{ width: 0 }}
                                            animate={{ width: "60%" }}
                                            transition={{ duration: 0.5, delay: 0.4 }}
                                        />
                                        <motion.div
                                            className="doc-line"
                                            initial={{ width: 0 }}
                                            animate={{ width: "100%" }}
                                            transition={{ duration: 0.5, delay: 0.5 }}
                                        />
                                        <motion.div
                                            className="doc-line medium"
                                            initial={{ width: 0 }}
                                            animate={{ width: "80%" }}
                                            transition={{ duration: 0.5, delay: 0.6 }}
                                        />
                                    </div>
                                    <div className="quality-badge basic">Basic</div>
                                </motion.div>

                                {/* Output Resume */}
                                <motion.div
                                    key={`output-${cycleCount}`}
                                    className="resume-document output-resume"
                                    initial={{ x: 0, y: 0, opacity: 0, rotate: 0, scale: 0.8 }}
                                    animate={{
                                        x: [0, 50, 100],
                                        y: 0,
                                        opacity: [0, 1, 1],
                                        rotate: [0, 3, 6],
                                        scale: [0.8, 1.02, 1]
                                    }}
                                    transition={{
                                        duration: 1.2,
                                        delay: 2.5,
                                        ease: [0.4, 0, 0.2, 1]
                                    }}
                                >
                                    <motion.div
                                        className="document-glow-effect enhanced"
                                        animate={{
                                            opacity: [0, 0.8, 0],
                                            scale: [0.9, 1.2, 0.9]
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                    />
                                    <div className="document-header enhanced">
                                        <div className="doc-icon">✨</div>
                                        <div className="doc-title">Enhanced Resume</div>
                                    </div>
                                    <div className="document-content">
                                        <motion.div
                                            className="doc-line enhanced"
                                            initial={{ width: 0 }}
                                            animate={{ width: "100%" }}
                                            transition={{ duration: 0.5, delay: 2.8 }}
                                        />
                                        <motion.div
                                            className="doc-line enhanced short"
                                            initial={{ width: 0 }}
                                            animate={{ width: "60%" }}
                                            transition={{ duration: 0.5, delay: 2.9 }}
                                        />
                                        <motion.div
                                            className="doc-line enhanced"
                                            initial={{ width: 0 }}
                                            animate={{ width: "100%" }}
                                            transition={{ duration: 0.5, delay: 3.0 }}
                                        />
                                        <motion.div
                                            className="doc-line enhanced medium"
                                            initial={{ width: 0 }}
                                            animate={{ width: "80%" }}
                                            transition={{ duration: 0.5, delay: 3.1 }}
                                        />
                                    </div>
                                    <div className="quality-badge premium">
                                        <span className="badge-icon">⭐</span>
                                        Premium
                                    </div>
                                    {/* Multiple sparkle effects */}
                                    <motion.div
                                        className="sparkle-effect"
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 2] }}
                                        transition={{ duration: 1, delay: 2.5 }}
                                    />
                                    <motion.div
                                        className="sparkle-effect sparkle-2"
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: [0, 1, 0], scale: [0, 1.8, 2.5] }}
                                        transition={{ duration: 1.2, delay: 2.7 }}
                                    />
                                    <motion.div
                                        className="sparkle-effect sparkle-3"
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: [0, 1, 0], scale: [0, 1.3, 2] }}
                                        transition={{ duration: 1, delay: 2.9 }}
                                    />
                                    {/* Success checkmarks */}
                                    {[...Array(4)].map((_, i) => (
                                        <motion.div
                                            key={`check-${i}`}
                                            className="success-check"
                                            style={{ top: `${35 + i * 25}%`, right: '10px' }}
                                            initial={{ opacity: 0, scale: 0, rotate: -180 }}
                                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                            transition={{ duration: 0.4, delay: 2.8 + i * 0.1 }}
                                        >
                                            ✓
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>

                    {/* Feature Tags */}
                    <div className="feature-tags">
                        <motion.div
                            className="feature-tag"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                        >
                            <span className="tag-icon">🎯</span>
                            ATS Optimized
                        </motion.div>
                        <motion.div
                            className="feature-tag"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                        >
                            <span className="tag-icon">🚀</span>
                            AI Enhanced
                        </motion.div>
                        <motion.div
                            className="feature-tag"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.6, duration: 0.5 }}
                        >
                            <span className="tag-icon">⚡</span>
                            Instant Results
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
                                {isProcessing ? '3s' : '&lt;5s'}
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
