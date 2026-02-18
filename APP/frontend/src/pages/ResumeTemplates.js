import React, { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Layers, CheckCircle2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/ResumeTemplates.css';

const categories = [
    'All',
    'Creative',
    'Traditional',
    'Modern',
    'Simple',
    'Professional',
    'Minimal'
];

const templates = [
    {
        id: 'trad-heritage',
        name: 'Heritage Serif',
        category: 'Traditional',
        description: 'Classic layout with strong typographic hierarchy.',
        accent: 'emerald'
    },
    {
        id: 'trad-column',
        name: 'Executive Column',
        category: 'Traditional',
        description: 'Two-column structure built for experienced roles.',
        accent: 'slate'
    },
    {
        id: 'modern-grid',
        name: 'Gridline Modern',
        category: 'Modern',
        description: 'Crisp grid system with balanced white space.',
        accent: 'teal'
    },
    {
        id: 'modern-impact',
        name: 'Impact Bold',
        category: 'Modern',
        description: 'Strong headline with ATS-safe sections.',
        accent: 'blue'
    },
    {
        id: 'creative-aurora',
        name: 'Aurora Studio',
        category: 'Creative',
        description: 'Vibrant accents for design and media roles.',
        accent: 'cyan'
    },
    {
        id: 'creative-portfolio',
        name: 'Portfolio Flow',
        category: 'Creative',
        description: 'Portfolio-forward layout with project highlights.',
        accent: 'rose'
    },
    {
        id: 'simple-clean',
        name: 'Clean Slate',
        category: 'Simple',
        description: 'Minimal sections and clear scanning path.',
        accent: 'amber'
    },
    {
        id: 'simple-core',
        name: 'Core Essentials',
        category: 'Simple',
        description: 'Single-column, clean spacing, quick scan.',
        accent: 'stone'
    },
    {
        id: 'pro-analyst',
        name: 'Analyst Prime',
        category: 'Professional',
        description: 'Structured sections for metrics-heavy roles.',
        accent: 'emerald'
    },
    {
        id: 'pro-strategy',
        name: 'Strategy Deck',
        category: 'Professional',
        description: 'Executive-ready summary and achievements.',
        accent: 'blue'
    },
    {
        id: 'minimal-air',
        name: 'Open Air',
        category: 'Minimal',
        description: 'Ultra-clean style with generous margins.',
        accent: 'slate'
    },
    {
        id: 'minimal-line',
        name: 'Linework',
        category: 'Minimal',
        description: 'Thin rules and crisp typography focus.',
        accent: 'teal'
    },
    {
        id: 'creative-wave',
        name: 'Waveform',
        category: 'Creative',
        description: 'Soft gradients for modern creatives.',
        accent: 'indigo'
    },
    {
        id: 'modern-studio',
        name: 'Studio Modern',
        category: 'Modern',
        description: 'Compact header with premium polish.',
        accent: 'emerald'
    }
];

const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
            staggerChildren: 0.08
        }
    }
};

const cardVariants = {
    hidden: { opacity: 0, y: 24, scale: 0.98 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

const ResumeTemplates = ({ backendStatus }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [activeCategory, setActiveCategory] = useState('All');

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const category = params.get('category');
        if (category) {
            const normalized = category.trim().toLowerCase();
            const matched = categories.find((item) => item.toLowerCase() === normalized);
            if (matched) {
                setActiveCategory(matched);
            }
        }
    }, [location.search]);

    const filteredTemplates = useMemo(() => {
        if (activeCategory === 'All') {
            return templates;
        }
        return templates.filter((template) => template.category === activeCategory);
    }, [activeCategory]);

    const handleCategoryClick = (category) => {
        setActiveCategory(category);
        if (category === 'All') {
            navigate('/templates');
        } else {
            navigate(`/templates?category=${encodeURIComponent(category.toLowerCase())}`);
        }
    };

    return (
        <div className="templates-page">
            <Navbar backendStatus={backendStatus} />
            <div className="templates-ambient">
                <span className="ambient-orb orb-one"></span>
                <span className="ambient-orb orb-two"></span>
                <span className="ambient-orb orb-three"></span>
            </div>

            <motion.section
                className="templates-hero"
                initial="hidden"
                animate="show"
                variants={containerVariants}
            >
                <motion.div className="templates-hero-content" variants={cardVariants}>
                    <span className="templates-badge">
                        <Sparkles size={16} />
                        Curated Resume Templates
                    </span>
                    <h1>Find the Perfect Resume Template</h1>
                    <p>
                        Sharp layouts built for clarity, ATS readiness, and a premium first impression. Choose a
                        style and explore professional templates crafted for modern hiring teams.
                    </p>
                    <div className="templates-hero-meta">
                        <div className="meta-item">
                            <Layers size={18} />
                            <span>14 ready-to-use layouts</span>
                        </div>
                        <div className="meta-item">
                            <CheckCircle2 size={18} />
                            <span>ATS-focused formatting</span>
                        </div>
                    </div>
                </motion.div>
            </motion.section>

            <motion.section className="templates-filter" initial="hidden" animate="show" variants={containerVariants}>
                <motion.div className="filter-row" variants={cardVariants}>
                    {categories.map((category) => (
                        <button
                            key={category}
                            type="button"
                            className={`filter-pill ${activeCategory === category ? 'active' : ''}`}
                            onClick={() => handleCategoryClick(category)}
                        >
                            {category}
                        </button>
                    ))}
                </motion.div>
            </motion.section>

            <motion.section
                className="templates-grid"
                initial="hidden"
                animate="show"
                variants={containerVariants}
            >
                {filteredTemplates.map((template) => (
                    <motion.article
                        key={template.id}
                        className={`template-card accent-${template.accent}`}
                        variants={cardVariants}
                        whileHover={{ y: -8, scale: 1.02 }}
                        transition={{ type: 'spring', stiffness: 220, damping: 18 }}
                    >
                        <div className="template-preview">
                            <div className="preview-header">
                                <span className="preview-dot"></span>
                                <span className="preview-dot"></span>
                                <span className="preview-dot"></span>
                            </div>
                            <div className="preview-body">
                                <div className="preview-line thick"></div>
                                <div className="preview-line"></div>
                                <div className="preview-line short"></div>
                                <div className="preview-block"></div>
                                <div className="preview-line"></div>
                                <div className="preview-line short"></div>
                            </div>
                        </div>
                        <div className="template-content">
                            <div className="template-meta">
                                <span className="template-category">{template.category}</span>
                                <span className="template-tag">ATS Ready</span>
                            </div>
                            <h3>{template.name}</h3>
                            <p>{template.description}</p>
                            <button className="template-action" type="button">
                                Preview Template
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    </motion.article>
                ))}
            </motion.section>
            <Footer />
        </div>
    );
};

export default ResumeTemplates;
