import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/ResumeAnalysis.css';
import '../styles/JobSuggestions.css';

const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.08 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }
};

const JobSuggestions = ({ backendStatus }) => {
    const navigate = useNavigate();
    const [suggestions, setSuggestions] = useState([]);
    const [suggestionTitle, setSuggestionTitle] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

    useEffect(() => {
        const fetchSuggestions = async () => {
            setIsLoading(true);
            setErrorMessage('');

            try {
                const response = await axios.get(`${BACKEND_URL}/api/job_suggestions`);
                const title = response.data?.title || '';
                const jobs = response.data?.jobs || [];
                const error = response.data?.error || '';
                setSuggestionTitle(title);
                setSuggestions(jobs);

                if (error) {
                    setErrorMessage(error);
                } else if (jobs.length === 0) {
                    setErrorMessage('No jobs found for the latest resume yet.');
                }
            } catch (error) {
                console.error('Error fetching job suggestions:', error);
                setErrorMessage('Failed to fetch suggestions. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchSuggestions();
    }, [BACKEND_URL]);

    return (
        <div className="resume-analysis-page job-suggestions-page">
            <Navbar backendStatus={backendStatus} />
            <div className="premium-bg-container">
                <div className="gradient-overlay"></div>
                <div className="digital-grain"></div>
                <div className="pulse-circles">
                    <div className="pulse-circle c1"></div>
                    <div className="pulse-circle c2"></div>
                </div>
                <div className="background-waves">
                    <svg viewBox="0 0 1440 800" preserveAspectRatio="none" className="bg-wave-svg">
                        <defs>
                            <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#39ff14" stopOpacity="0.6">
                                    <animate attributeName="stop-color" values="#39ff14;#00f2fe;#39ff14" dur="8s" repeatCount="indefinite" />
                                </stop>
                                <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.4" />
                                <stop offset="100%" stopColor="#bc13fe" stopOpacity="0.3">
                                    <animate attributeName="stop-color" values="#bc13fe;#7c3aed;#bc13fe" dur="10s" repeatCount="indefinite" />
                                </stop>
                            </linearGradient>
                            <filter id="wave-glow" x="-20%" y="-20%" width="140%" height="140%">
                                <feGaussianBlur stdDeviation="6" result="blur" />
                                <feComposite in="SourceGraphic" in2="blur" operator="over" />
                            </filter>
                        </defs>
                        <path className="wave-path line-1" d="M-100,150 Q200,50 450,250 T900,150 T1540,350" fill="none" stroke="url(#wave-gradient)" strokeWidth="2" filter="url(#wave-glow)" />
                        <path className="wave-path line-2" d="M-100,300 Q350,450 600,200 T1100,400 T1540,150" fill="none" stroke="url(#wave-gradient)" strokeWidth="1.5" filter="url(#wave-glow)" />
                        <path className="wave-path line-3" d="M-100,450 Q150,650 500,450 T1000,550 T1540,350" fill="none" stroke="url(#wave-gradient)" strokeWidth="2.5" filter="url(#wave-glow)" />
                        <path className="wave-path line-4" d="M-100,600 Q400,300 700,500 T1200,300 T1540,650" fill="none" stroke="url(#wave-gradient)" strokeWidth="1.8" filter="url(#wave-glow)" />
                        <path className="wave-path line-5" d="M-100,750 Q250,550 550,750 T1050,650 T1540,850" fill="none" stroke="url(#wave-gradient)" strokeWidth="2.2" filter="url(#wave-glow)" />
                    </svg>
                </div>
            </div>

            <motion.div className="job-suggestions-content" initial="hidden" animate="show" variants={containerVariants}>
                <div className="job-suggestions-header">
                    <button className="back-button" onClick={() => navigate('/analysis')}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M12 4L6 10L12 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Back to Analysis
                    </button>
                    <h1>Job Suggestions</h1>
                    <p>Roles picked from your most recent resume analysis.</p>
                </div>

                <motion.div className="job-suggestions-panel" variants={itemVariants}>
                    {isLoading && (
                        <div className="job-suggestions-loading">
                            <div className="loading-spinner"></div>
                            <span>Fetching suggestions...</span>
                        </div>
                    )}

                    {!isLoading && errorMessage && (
                        <div className="job-suggestions-empty">
                            <p>{errorMessage}</p>
                            <button className="btn-primary" onClick={() => navigate('/')}>
                                Upload a Resume
                            </button>
                        </div>
                    )}

                    {!isLoading && !errorMessage && (
                        <motion.div className="job-suggestions-list" variants={containerVariants} initial="hidden" animate="show">
                            {suggestionTitle && (
                                <motion.div className="job-suggestion-hero" variants={itemVariants}>
                                    <div className="job-suggestion-label">Top match</div>
                                    <div className="job-suggestion-highlight">{suggestionTitle}</div>
                                    <div className="job-suggestion-subtext">Targeted roles based on your resume strengths.</div>
                                </motion.div>
                            )}
                            {suggestions.map((item, index) => (
                                <motion.a
                                    key={`${item.jobUrl || item.title}-${index}`}
                                    className="job-suggestion-card"
                                    href={item.jobUrl || '#'}
                                    target="_blank"
                                    rel="noreferrer"
                                    variants={itemVariants}
                                    whileHover={{ y: -6 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <div className="job-suggestion-title">{item.title || 'Role'}</div>
                                    <div className="job-suggestion-meta">{item.companyName || 'Company'}</div>
                                    <span className="job-suggestion-badge">View Job</span>
                                </motion.a>
                            ))}
                        </motion.div>
                    )}
                </motion.div>
            </motion.div>
            <Footer />
        </div>
    );
};

export default JobSuggestions;
