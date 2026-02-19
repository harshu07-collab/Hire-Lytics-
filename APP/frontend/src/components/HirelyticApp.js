import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import Hero from './Hero';
import ResumeMachine from './ResumeMachine';
import ResumeAnalyzer from './ResumeAnalyzer';
import LivingDataCore from './LivingDataCore';
import LivingDataCoreSimple from './LivingDataCoreSimple';
import OptimizationChecklist from './OptimizationChecklist';
import ResumeSections from './ResumeSections';
import AIRewrite from './AIRewrite';
import ResumeBuilder from './ResumeBuilder';
import Footer from './Footer';
import WavyBackground from './WavyBackground';
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
            <WavyBackground />
            <Navbar backendStatus={backendStatus} />
            <Hero />
            <ResumeMachine />
            <ResumeAnalyzer backendStatus={backendStatus} />

            {/* Living Data Core - Interactive 3D Element */}
            <section className="data-core-section">
                <div className="data-core-content">
                    <motion.div
                        className="data-core-header"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                    >
                        <h2 className="data-core-title">Intelligent Data Processing</h2>
                        <p className="data-core-subtitle">
                            Experience our AI-powered analysis engine in action.
                            Watch how data transforms in real-time.
                        </p>
                    </motion.div>
                    <LivingDataCore />
                </div>
            </section>

            <OptimizationChecklist />
            <ResumeSections />
            <AIRewrite />
            <ResumeBuilder />
            <Footer />
        </motion.div>
    );
};

export default HirelyticApp;
