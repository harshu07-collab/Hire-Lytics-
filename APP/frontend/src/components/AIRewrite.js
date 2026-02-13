import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/AIRewrite.css';

// Animated particles for AI processing visualization
const Particle = ({ delay, x, y, color }) => (
    <motion.div
        className="ai-particle"
        style={{ backgroundColor: color }}
        initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
        animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
            x: [0, x],
            y: [0, y],
        }}
        transition={{
            duration: 2,
            delay: delay,
            repeat: Infinity,
            ease: "easeOut",
        }}
    />
);

// Animated ring for AI processing
const AnimatedRing = ({ size, delay, duration }) => (
    <motion.div
        className="ai-ring"
        style={{ width: size, height: size }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
            opacity: [0, 0.6, 0],
            scale: [0.8, 1.2, 1.4],
            rotate: [0, 180, 360],
        }}
        transition={{
            duration: duration,
            delay: delay,
            repeat: Infinity,
            ease: "easeInOut",
        }}
    />
);

// Floating skill badge
const SkillBadge = ({ skill, index, total }) => {
    const angle = (index / total) * 360;
    const radius = 80;
    const x = Math.cos((angle * Math.PI) / 180) * radius;
    const y = Math.sin((angle * Math.PI) / 180) * radius;

    return (
        <motion.div
            className="skill-badge"
            initial={{ opacity: 0, scale: 0 }}
            animate={{
                opacity: 1,
                scale: 1,
                x: [0, x, x * 0.5, x],
                y: [0, y, y * 0.5, y],
            }}
            transition={{
                duration: 4,
                delay: index * 0.3,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
            }}
            whileHover={{ scale: 1.2 }}
        >
            {skill}
        </motion.div>
    );
};

// AI Processing Visualization Component
const AIProcessingVisual = () => {
    const skills = ["ATS", "Keywords", "Impact", "Action Verbs", "Metrics", "Clarity"];
    const colors = ["#10b981", "#06b6d4", "#8b5cf6", "#f59e0b", "#ec4899", "#6366f1"];

    return (
        <div className="ai-processing-visual">
            {/* Central AI Core */}
            <motion.div
                className="ai-core"
                animate={{
                    boxShadow: [
                        "0 0 20px rgba(16, 185, 129, 0.4)",
                        "0 0 40px rgba(16, 185, 129, 0.6)",
                        "0 0 20px rgba(16, 185, 129, 0.4)",
                    ],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            >
                <motion.div
                    className="ai-core-inner"
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                >
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                        <path
                            d="M20 5L23.5 14.5L33 15L25.5 21.5L27.5 31L20 25.5L12.5 31L14.5 21.5L7 15L16.5 14.5L20 5Z"
                            fill="#10b981"
                        />
                    </svg>
                </motion.div>
            </motion.div>

            {/* Animated Rings */}
            <AnimatedRing size={120} delay={0} duration={3} />
            <AnimatedRing size={160} delay={0.5} duration={3.5} />
            <AnimatedRing size={200} delay={1} duration={4} />

            {/* Floating Particles */}
            {[...Array(12)].map((_, i) => (
                <Particle
                    key={i}
                    delay={i * 0.2}
                    x={Math.random() * 100 - 50}
                    y={Math.random() * 100 - 50}
                    color={colors[i % colors.length]}
                />
            ))}

            {/* Orbiting Skill Badges */}
            <div className="skill-badges-container">
                {skills.map((skill, index) => (
                    <SkillBadge
                        key={skill}
                        skill={skill}
                        index={index}
                        total={skills.length}
                    />
                ))}
            </div>

            {/* Processing Text */}
            <motion.div
                className="processing-text"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
            >
                <motion.span
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                >
                    AI Optimizing
                </motion.span>
                <motion.span
                    className="dots"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity }}
                >
                    ...
                </motion.span>
            </motion.div>

            {/* Stats Counter */}
            <div className="ai-stats">
                <motion.div
                    className="stat-item"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                >
                    <motion.span
                        className="stat-value"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        98%
                    </motion.span>
                    <span className="stat-label">ATS Score</span>
                </motion.div>
                <motion.div
                    className="stat-item"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                >
                    <motion.span
                        className="stat-value"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                    >
                        2.5x
                    </motion.span>
                    <span className="stat-label">Impact Boost</span>
                </motion.div>
            </div>
        </div>
    );
};

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
                            <AIProcessingVisual />
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default AIRewrite;
