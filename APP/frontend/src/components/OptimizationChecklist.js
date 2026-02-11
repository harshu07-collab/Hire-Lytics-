import React from 'react';
import { motion } from 'framer-motion';
import '../styles/OptimizationChecklist.css';

const OptimizationChecklist = () => {
    const checklistSections = [
        {
            title: 'Content',
            icon: '✏️',
            items: [
                'ATS parse rate',
                'Quantifying impact',
                'Repetition',
                'Spelling & Grammar'
            ]
        },
        {
            title: 'Format',
            icon: '📄',
            items: [
                'File format and size',
                'Resume length',
                'Long bullet points with suggestions on how to shorten'
            ]
        },
        {
            title: 'Resume sections',
            icon: '📋',
            items: [
                'Contact information',
                'Essential sections',
                'Personality showcase with tips on how to improve'
            ]
        },
        {
            title: 'Style',
            icon: 'A',
            items: [
                'Consistent formatting',
                'Professional fonts',
                'Appropriate margins and spacing'
            ]
        }
    ];

    return (
        <section className="optimization-section" id="features">
            <div className="optimization-gradient"></div>
            <div className="optimization-container">
                <motion.div
                    className="optimization-header"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="optimization-title">Resume Optimization Checklist</h2>
                    <p className="optimization-subtitle">
                        We check for 16 crucial things across 5 different categories on your resume including<br />
                        content, file type, and keywords in the most important sections of your resume.
                    </p>
                </motion.div>

                <div className="checklist-grid">
                    {checklistSections.map((section, index) => (
                        <motion.div
                            key={section.title}
                            className="checklist-card"
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ delay: index * 0.15, duration: 0.6 }}
                            whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}
                        >
                            <div className="checklist-icon">{section.icon}</div>
                            <h3 className="checklist-title">{section.title}</h3>
                            <ul className="checklist-items">
                                {section.items.map((item, i) => (
                                    <motion.li
                                        key={i}
                                        className="checklist-item"
                                        initial={{ opacity: 0, x: -10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.15 + i * 0.1, duration: 0.4 }}
                                    >
                                        <svg className="check-icon" width="20" height="20" viewBox="0 0 20 20">
                                            <circle cx="10" cy="10" r="9" fill="#d1fae5" />
                                            <path d="M6 10L9 13L14 7" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                        </svg>
                                        {item}
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default OptimizationChecklist;
