import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import '../styles/ResumeAnalysis.css';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const ResumeAnalysis = ({ backendStatus }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [currentStep, setCurrentStep] = useState(0);
    const [analysisComplete, setAnalysisComplete] = useState(false);
    const [analysisData, setAnalysisData] = useState(null);
    const [selectedTab, setSelectedTab] = useState('content');
    const [expandedSection, setExpandedSection] = useState('ats-parse-rate');
    const [viewMode, setViewMode] = useState('original'); // 'original' or 'enhanced'
    const [dataReady, setDataReady] = useState(false);
    const [pdfFile, setPdfFile] = useState(null);
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

    const analysisSteps = [
        { id: 1, label: 'Parsing your resume', icon: '📄' },
        { id: 2, label: 'Analyzing your experience', icon: '🔍' },
        { id: 3, label: 'Extracting your skills', icon: '⚡' },
        { id: 4, label: 'Generating recommendations', icon: '✨' }
    ];

    useEffect(() => {
        // Get file from location state
        const file = location.state?.file;

        if (!file) {
            navigate('/');
            return;
        }

        // Store PDF file for preview
        setPdfFile(file);

        if (!isAnalyzing) {
            setIsAnalyzing(true);
            analyzeResume(file);
        }

        // Start analysis animation
        const stepInterval = setInterval(() => {
            setCurrentStep(prev => {
                if (prev < analysisSteps.length - 1) {
                    return prev + 1;
                } else {
                    clearInterval(stepInterval);
                    return prev;
                }
            });
        }, 1500);

        return () => clearInterval(stepInterval);
    }, [location.state]); // Only run when location state changes

    // Watch for both data being ready AND animation reaching last step
    useEffect(() => {
        if (dataReady && currentStep === analysisSteps.length - 1) {
            setAnalysisComplete(true);
        }
    }, [dataReady, currentStep]);

    const analyzeResume = async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(`${BACKEND_URL}/api/analyze`, formData);
            setAnalysisData(response.data);
            setDataReady(true);

        } catch (error) {
            console.error('Error analyzing resume:', error);

            // Fallback to mock data
            setTimeout(() => {
                setAnalysisData({
                    score: 92,
                    filename: file.name,
                    breakdown: {
                        ats_parse_rate: 65,
                        formatting: 72,
                        skills_match: 58,
                        grammar: 85
                    },
                    issues: {
                        content: [
                            { type: 'error', title: 'ATS Parse Rate', description: 'Some information on your resume is visible and readable by applicant tracking systems but your score suggests the resume template you\'re using has some parsing issues.', impact: '1 Issue' },
                            { type: 'success', title: 'Quantifying Impact', description: 'Great job! Your resume includes quantified achievements.', impact: 'No Issues' },
                            { type: 'success', title: 'Repetition', description: 'Your resume has minimal repetition.', impact: 'No Issues' },
                            { type: 'error', title: 'Spelling & Grammar', description: 'We found 3 spelling or grammar errors.', impact: '5 Issues' }
                        ],
                        sections: [
                            { type: 'success', title: 'Contact Information', description: 'All required contact details are present.', impact: 'No Issues' },
                            { type: 'warning', title: 'Work Experience', description: 'Consider adding more quantifiable achievements.', impact: '2 Issues' },
                            { type: 'success', title: 'Education', description: 'Education section is well formatted.', impact: 'No Issues' }
                        ],
                        ats_essentials: [
                            { type: 'success', title: 'File Format', description: 'PDF format is ATS-friendly.', impact: 'No Issues' },
                            { type: 'warning', title: 'Keywords', description: 'Add more industry-specific keywords.', impact: '5 Issues' },
                            { type: 'error', title: 'Formatting', description: 'Avoid using tables and text boxes.', impact: '3 Issues' }
                        ],
                        tailoring: [
                            { type: 'warning', title: 'Job Match', description: 'Resume could be better tailored to target role.', impact: '4 Issues' },
                            { type: 'success', title: 'Skills Alignment', description: 'Core skills match job requirements.', impact: 'No Issues' }
                        ]
                    }
                });
                setDataReady(true);
            }, 5000);
        }
    };

    const getScoreColor = (score) => {
        if (score >= 80) return '#10b981';
        if (score >= 60) return '#f59e0b';
        return '#ef4444';
    };

    const getScoreLabel = (score) => {
        if (score >= 80) return 'Excellent';
        if (score >= 60) return 'Good';
        return 'Needs Improvement';
    };

    const pdfPreview = React.useMemo(() => {
        if (!pdfFile) return null;
        return (
            <Document
                file={pdfFile}
                onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                onLoadError={(error) => {
                    console.error('Error loading PDF:', error);
                }}
                loading={
                    <div className="pdf-loading">
                        <div className="loading-spinner"></div>
                        <p>Loading PDF...</p>
                    </div>
                }
                error={
                    <div className="pdf-error">
                        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                            <circle cx="24" cy="24" r="20" fill="#fee2e2" />
                            <path d="M24 16v8m0 4h.01" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
                        </svg>
                        <p>Failed to load PDF</p>
                    </div>
                }
            >
                <Page
                    pageNumber={pageNumber}
                    scale={2.2}
                    renderTextLayer={true}
                    renderAnnotationLayer={true}
                    className={viewMode === 'enhanced' ? 'enhanced-page' : ''}
                />
            </Document>
        );
    }, [pdfFile, pageNumber, viewMode]);

    const tabData = {
        content: { label: 'CONTENT', score: 58, color: '#ef4444' },
        sections: { label: 'SECTIONS', score: 85, color: '#10b981' },
        ats_essentials: { label: 'ATS ESSENTIALS', score: 63, color: '#f59e0b' },
        tailoring: { label: 'TAILORING', score: 71, color: '#f59e0b' }
    };

    return (
        <div className="resume-analysis-page">
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
            <AnimatePresence mode="wait">
                {!analysisComplete ? (
                    <motion.div
                        key="analyzing"
                        className="analysis-loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {/* Floating particles */}
                        <div className="particles">
                            {[...Array(20)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="particle"
                                    initial={{
                                        x: Math.random() * window.innerWidth,
                                        y: Math.random() * window.innerHeight,
                                        scale: Math.random() * 0.5 + 0.5,
                                        opacity: 0
                                    }}
                                    animate={{
                                        y: [null, Math.random() * window.innerHeight],
                                        x: [null, Math.random() * window.innerWidth],
                                        opacity: [0, 0.6, 0]
                                    }}
                                    transition={{
                                        duration: Math.random() * 10 + 10,
                                        repeat: Infinity,
                                        ease: "linear",
                                        delay: Math.random() * 5
                                    }}
                                />
                            ))}
                        </div>

                        <div className="loading-container">
                            <motion.div
                                className="loading-logo"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                <div className="logo-circle">
                                    <svg width="120" height="120" viewBox="0 0 120 120">
                                        {/* Outer rotating ring */}
                                        <motion.circle
                                            cx="60"
                                            cy="60"
                                            r="52"
                                            stroke="#e5e7eb"
                                            strokeWidth="2"
                                            fill="none"
                                            opacity="0.3"
                                        />
                                        <motion.circle
                                            cx="60"
                                            cy="60"
                                            r="52"
                                            stroke="url(#gradient1)"
                                            strokeWidth="3"
                                            fill="none"
                                            strokeDasharray="327"
                                            strokeLinecap="round"
                                            animate={{
                                                strokeDashoffset: [327, 0],
                                                rotate: [0, 360]
                                            }}
                                            transition={{
                                                strokeDashoffset: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                                                rotate: { duration: 3, repeat: Infinity, ease: "linear" }
                                            }}
                                            style={{ transformOrigin: '60px 60px' }}
                                        />

                                        {/* Middle ring */}
                                        <motion.circle
                                            cx="60"
                                            cy="60"
                                            r="42"
                                            stroke="url(#gradient2)"
                                            strokeWidth="2"
                                            fill="none"
                                            strokeDasharray="264"
                                            strokeLinecap="round"
                                            animate={{
                                                strokeDashoffset: [0, -264],
                                                rotate: [0, -360]
                                            }}
                                            transition={{
                                                strokeDashoffset: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
                                                rotate: { duration: 4, repeat: Infinity, ease: "linear" }
                                            }}
                                            style={{ transformOrigin: '60px 60px' }}
                                        />

                                        {/* Center icon */}
                                        <motion.g
                                            initial={{ scale: 0 }}
                                            animate={{ scale: [0.8, 1, 0.8] }}
                                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                            style={{ transformOrigin: '60px 60px' }}
                                        >
                                            <circle cx="60" cy="60" r="20" fill="url(#gradient3)" opacity="0.2" />
                                            <path
                                                d="M50 60 L55 65 L70 50"
                                                stroke="#6366f1"
                                                strokeWidth="3"
                                                fill="none"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </motion.g>

                                        <defs>
                                            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" stopColor="#39ff14" />
                                                <stop offset="100%" stopColor="#8b5cf6" />
                                            </linearGradient>
                                            <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stopColor="#00f2fe" />
                                                <stop offset="100%" stopColor="#bc13fe" />
                                            </linearGradient>
                                            <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" stopColor="#39ff14" />
                                                <stop offset="100%" stopColor="#8b5cf6" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </div>
                            </motion.div>

                            <motion.h2
                                className="loading-title"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                Analyzing Your Resume
                            </motion.h2>
                            <motion.p
                                className="loading-subtitle"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                Our AI is carefully reviewing your resume to provide detailed insights
                            </motion.p>

                            <div className="analysis-steps">
                                {analysisSteps.map((step, index) => (
                                    <motion.div
                                        key={step.id}
                                        className={`step-item ${index <= currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.2 }}
                                    >
                                        <div className="step-icon">
                                            {index < currentStep ? (
                                                <motion.svg
                                                    width="24"
                                                    height="24"
                                                    viewBox="0 0 24 24"
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{ type: "spring", stiffness: 200 }}
                                                >
                                                    <circle cx="12" cy="12" r="10" fill="#10b981" />
                                                    <path d="M8 12l2 2 4-4" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                                                </motion.svg>
                                            ) : index === currentStep ? (
                                                <motion.div
                                                    className="step-spinner"
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                >
                                                    <svg width="24" height="24" viewBox="0 0 24 24">
                                                        <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.1)" strokeWidth="2" fill="none" />
                                                        <path d="M12 2a10 10 0 0 1 10 10" stroke="#39ff14" strokeWidth="3" fill="none" strokeLinecap="round" />
                                                    </svg>
                                                </motion.div>
                                            ) : (
                                                <div className="step-pending">
                                                    <svg width="24" height="24" viewBox="0 0 24 24">
                                                        <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.2)" strokeWidth="2" fill="none" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                        <div className="step-label">{step.label}</div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Progress Bar */}
                            <motion.div
                                className="loading-progress-container"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                            >
                                <div className="progress-info">
                                    <span className="progress-label">Analysis Progress</span>
                                    <span className="progress-percentage">{Math.round((currentStep + 1) / analysisSteps.length * 100)}%</span>
                                </div>
                                <div className="loading-progress-bar">
                                    <motion.div
                                        className="loading-progress-fill"
                                        initial={{ width: '0%' }}
                                        animate={{ width: `${((currentStep + 1) / analysisSteps.length) * 100}%` }}
                                        transition={{ duration: 0.5, ease: "easeOut" }}
                                    />
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="results"
                        className="analysis-results-page"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Header */}
                        <div className="results-header">
                            <button className="back-button" onClick={() => navigate('/')}>
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M12 4L6 10L12 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Back
                            </button>
                            <div className="header-actions">
                                <button className="btn-secondary">New Upload</button>
                                <button className="btn-primary">Edit & Fix Resume</button>
                            </div>
                        </div>

                        <div className="results-layout">
                            {/* Left Sidebar */}
                            <div className="results-sidebar">
                                <motion.div
                                    className="score-card"
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <h3 className="score-title">Your Score</h3>
                                    <div className="score-circle-container">
                                        <div className="score-circle-glow"></div>
                                        <svg viewBox="0 0 200 200" className="score-circle-svg">
                                            <circle
                                                cx="100"
                                                cy="100"
                                                r="85"
                                                fill="none"
                                                stroke="#f1f5f9"
                                                strokeWidth="12"
                                            />
                                            <motion.circle
                                                cx="100"
                                                cy="100"
                                                r="85"
                                                fill="none"
                                                stroke={getScoreColor(analysisData?.score || 61)}
                                                strokeWidth="12"
                                                strokeLinecap="round"
                                                strokeDasharray={534.07}
                                                initial={{ strokeDashoffset: 534.07 }}
                                                animate={{ strokeDashoffset: 534.07 * (1 - (analysisData?.score || 61) / 100) }}
                                                transition={{ duration: 1.5, ease: "easeOut" }}
                                                style={{ transform: 'rotate(-90deg)', transformOrigin: '100px 100px' }}
                                            />
                                        </svg>
                                        <div className="score-number">
                                            <motion.span
                                                className="score-value"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.5 }}
                                            >
                                                {analysisData?.score || 61}
                                            </motion.span>
                                            <span className="score-total">/100</span>
                                        </div>
                                    </div>
                                    <div className="score-issues">{analysisData?.score >= 80 ? 'No' : '5'} issues found</div>
                                </motion.div>

                                {/* Category Tabs */}
                                <div className="category-tabs">
                                    {Object.entries(tabData).map(([key, data], index) => (
                                        <motion.button
                                            key={key}
                                            className={`category-tab ${selectedTab === key ? 'active' : ''}`}
                                            onClick={() => setSelectedTab(key)}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.3 + index * 0.1 }}
                                        >
                                            <div className="tab-header">
                                                <span className="tab-label">{data.label}</span>
                                                <span className="tab-score" style={{ color: data.color }}>
                                                    {data.score}%
                                                </span>
                                            </div>
                                            <div className="tab-progress-bar">
                                                <motion.div
                                                    className="tab-progress-fill"
                                                    style={{ backgroundColor: data.color }}
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${data.score}%` }}
                                                    transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                                                />
                                            </div>
                                        </motion.button>
                                    ))}
                                </div>
                            </div>

                            {/* Main Content */}
                            <div className="results-main">
                                <div className="content-header">
                                    <div className="content-badge">
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                            <circle cx="10" cy="10" r="8" fill="#6366f1" opacity="0.2" />
                                            <circle cx="10" cy="10" r="4" fill="#6366f1" />
                                        </svg>
                                        {tabData[selectedTab].label}
                                    </div>
                                    <div className="issues-found">4 issues found</div>
                                </div>

                                {/* Issues List */}
                                <div className="issues-list">
                                    {analysisData?.issues?.[selectedTab]?.map((issue, index) => (
                                        <motion.div
                                            key={index}
                                            className={`issue-card ${expandedSection === `${selectedTab}-${index}` ? 'expanded' : ''}`}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            <div
                                                className="issue-header"
                                                onClick={() => setExpandedSection(expandedSection === `${selectedTab}-${index}` ? null : `${selectedTab}-${index}`)}
                                            >
                                                <div className="issue-title-row">
                                                    <div className={`issue-icon ${issue.type}`}>
                                                        {issue.type === 'error' ? (
                                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                                <circle cx="10" cy="10" r="8" fill="#fef2f2" />
                                                                <path d="M10 6v4m0 4h.01" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
                                                            </svg>
                                                        ) : issue.type === 'warning' ? (
                                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                                <circle cx="10" cy="10" r="8" fill="#fffbeb" />
                                                                <path d="M10 6v4m0 4h.01" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
                                                            </svg>
                                                        ) : (
                                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                                <circle cx="10" cy="10" r="8" fill="#f0fdf4" />
                                                                <path d="M7 10l2 2 4-4" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                    <h4 className="issue-title">{issue.title}</h4>
                                                    <span className="issue-impact">{issue.impact}</span>
                                                    <svg
                                                        className={`expand-icon ${expandedSection === `${selectedTab}-${index}` ? 'rotated' : ''}`}
                                                        width="20"
                                                        height="20"
                                                        viewBox="0 0 20 20"
                                                        fill="none"
                                                    >
                                                        <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <AnimatePresence>
                                                {expandedSection === `${selectedTab}-${index}` && (
                                                    <motion.div
                                                        className="issue-content"
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.3 }}
                                                    >
                                                        <p className="issue-description">{issue.description}</p>
                                                        {issue.type !== 'success' && (
                                                            <div className="issue-actions">
                                                                <button className="btn-fix">Fix This Issue</button>
                                                                <button className="btn-learn">Learn More</button>
                                                            </div>
                                                        )}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* Right Preview Panel */}
                            <div className="results-preview">
                                <div className="preview-header">
                                    <div className="preview-title">
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                            <path d="M4 4h12v12H4V4z" stroke="currentColor" strokeWidth="1.5" fill="none" />
                                            <path d="M7 7h6M7 10h6M7 13h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        </svg>
                                        Your Resume
                                    </div>
                                    <div className="view-toggle">
                                        <button
                                            className={`toggle-btn ${viewMode === 'original' ? 'active' : ''}`}
                                            onClick={() => setViewMode('original')}
                                        >
                                            Original
                                        </button>
                                        <button
                                            className={`toggle-btn ${viewMode === 'enhanced' ? 'active' : ''}`}
                                            onClick={() => setViewMode('enhanced')}
                                        >
                                            Enhancv
                                        </button>
                                    </div>
                                </div>

                                <div className="preview-content">
                                    <div className="resume-preview-card">
                                        {pdfFile ? (
                                            <div className="pdf-preview-container">
                                                <div className="scanning-line"></div>
                                                {viewMode === 'enhanced' && (
                                                    <div className="enhanced-badge-overlay">
                                                        <span className="enhanced-badge-icon">✨</span>
                                                        <span className="enhanced-badge-text">AI ENHANCED VIEW</span>
                                                    </div>
                                                )}
                                                {pdfPreview}
                                                {numPages && numPages > 1 && (
                                                    <div className="pdf-navigation">
                                                        <button
                                                            className="pdf-nav-btn"
                                                            onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
                                                            disabled={pageNumber <= 1}
                                                        >
                                                            ←
                                                        </button>
                                                        <span className="pdf-page-info">
                                                            Page {pageNumber} of {numPages}
                                                        </span>
                                                        <button
                                                            className="pdf-nav-btn"
                                                            onClick={() => setPageNumber(prev => Math.min(prev + 1, numPages))}
                                                            disabled={pageNumber >= numPages}
                                                        >
                                                            →
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="resume-preview-placeholder">
                                                <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                                                    <rect width="64" height="64" rx="8" fill="#f1f5f9" />
                                                    <path d="M24 20h16v24H24V20z" stroke="#94a3b8" strokeWidth="2" fill="none" />
                                                    <path d="M28 28h8M28 32h8M28 36h6" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
                                                </svg>
                                                <p className="preview-filename">{analysisData?.filename || 'Resume.pdf'}</p>
                                                <p className="preview-note">Upload a resume to see preview</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ResumeAnalysis;
