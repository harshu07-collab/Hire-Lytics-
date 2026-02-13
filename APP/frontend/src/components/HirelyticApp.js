import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import Hero from './Hero';
import ResumeMachine from './ResumeMachine';
import ResumeAnalyzer from './ResumeAnalyzer';
import OptimizationChecklist from './OptimizationChecklist';
import ResumeSections from './ResumeSections';
import AIRewrite from './AIRewrite';
import ResumeBuilder from './ResumeBuilder';
import Footer from './Footer';
import '../styles/HirelyticApp.css';

const HirelyticApp = ({ backendStatus }) => {
    useEffect(() => {
        // Add smooth scroll behavior
        document.documentElement.style.scrollBehavior = 'smooth';
    }, []);

    return (
        <motion.div
            className="hirelytic-app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
            <Navbar />
            {backendStatus === 'offline' && (
                <div style={{
                    background: '#fee2e2',
                    color: '#991b1b',
                    padding: '0.5rem',
                    textAlign: 'center',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                }}>
                    ⚠️ Backend server is offline. Some features may not work as expected.
                </div>
            )}
            <Hero />
            <ResumeMachine />
            <ResumeAnalyzer backendStatus={backendStatus} />
            <OptimizationChecklist />
            <ResumeSections />
            <AIRewrite />
            <ResumeBuilder />
            <Footer />
        </motion.div>
    );
};

export default HirelyticApp;
