import React, { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowRight, Sparkles, Layers, CheckCircle2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/ResumeTemplates.css';

const fallbackTemplates = [
    {
        id: 'trad-heritage',
        name: 'Heritage Serif',
        category: 'Traditional',
        description: 'Classic layout with strong typographic hierarchy.',
        accent: 'emerald',
        previewUrl: '',
        downloadUrl: ''
    },
    {
        id: 'trad-column',
        name: 'Executive Column',
        category: 'Traditional',
        description: 'Two-column structure built for experienced roles.',
        accent: 'slate',
        previewUrl: '',
        downloadUrl: ''
    },
    {
        id: 'modern-grid',
        name: 'Gridline Modern',
        category: 'Modern',
        description: 'Crisp grid system with balanced white space.',
        accent: 'teal',
        previewUrl: '',
        downloadUrl: ''
    },
    {
        id: 'modern-impact',
        name: 'Impact Bold',
        category: 'Modern',
        description: 'Strong headline with ATS-safe sections.',
        accent: 'blue',
        previewUrl: '',
        downloadUrl: ''
    },
    {
        id: 'creative-aurora',
        name: 'Aurora Studio',
        category: 'Creative',
        description: 'Vibrant accents for design and media roles.',
        accent: 'cyan',
        previewUrl: '',
        downloadUrl: ''
    },
    {
        id: 'creative-portfolio',
        name: 'Portfolio Flow',
        category: 'Creative',
        description: 'Portfolio-forward layout with project highlights.',
        accent: 'rose',
        previewUrl: '',
        downloadUrl: ''
    },
    {
        id: 'simple-clean',
        name: 'Clean Slate',
        category: 'Simple',
        description: 'Minimal sections and clear scanning path.',
        accent: 'amber',
        previewUrl: '',
        downloadUrl: ''
    },
    {
        id: 'simple-core',
        name: 'Core Essentials',
        category: 'Simple',
        description: 'Single-column, clean spacing, quick scan.',
        accent: 'stone',
        previewUrl: '',
        downloadUrl: ''
    },
    {
        id: 'pro-analyst',
        name: 'Analyst Prime',
        category: 'Professional',
        description: 'Structured sections for metrics-heavy roles.',
        accent: 'emerald',
        previewUrl: '',
        downloadUrl: ''
    },
    {
        id: 'pro-strategy',
        name: 'Strategy Deck',
        category: 'Professional',
        description: 'Executive-ready summary and achievements.',
        accent: 'blue',
        previewUrl: '',
        downloadUrl: ''
    },
    {
        id: 'minimal-air',
        name: 'Open Air',
        category: 'Minimal',
        description: 'Ultra-clean style with generous margins.',
        accent: 'slate',
        previewUrl: '',
        downloadUrl: ''
    },
    {
        id: 'minimal-line',
        name: 'Linework',
        category: 'Minimal',
        description: 'Thin rules and crisp typography focus.',
        accent: 'teal',
        previewUrl: '',
        downloadUrl: ''
    },
    {
        id: 'creative-wave',
        name: 'Waveform',
        category: 'Creative',
        description: 'Soft gradients for modern creatives.',
        accent: 'indigo',
        previewUrl: '',
        downloadUrl: ''
    },
    {
        id: 'modern-studio',
        name: 'Studio Modern',
        category: 'Modern',
        description: 'Compact header with premium polish.',
        accent: 'emerald',
        previewUrl: '',
        downloadUrl: ''
    }
];

const slugify = (value) =>
    value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') || 'template';

const normalizeTemplates = (payload) => {
    const rawTemplates = Array.isArray(payload) ? payload : payload?.templates || [];
    return rawTemplates
        .filter(Boolean)
        .map((template, index) => {
            const name = template?.name || template?.title || `Template ${index + 1}`;
            const category = template?.category || 'General';
            const templateId = template?.id || template?.slug || `${slugify(category)}-${index + 1}`;
            return {
                id: templateId,
                name,
                category,
                description: template?.description || template?.summary || '',
                accent: template?.accent || 'emerald',
                previewUrl: template?.preview_url || template?.previewUrl || '',
                downloadUrl: template?.download_url || template?.downloadUrl || '',
                previewType: template?.preview_type || template?.previewType || '',
                updatedAt: template?.updated_at || template?.updatedAt || ''
            };
        });
};

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

const handleCardMove = (event) => {
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const midX = rect.width / 2;
    const midY = rect.height / 2;
    const rotateX = ((y - midY) / midY) * -6;
    const rotateY = ((x - midX) / midX) * 6;

    card.style.setProperty('--tilt-x', `${rotateX.toFixed(2)}deg`);
    card.style.setProperty('--tilt-y', `${rotateY.toFixed(2)}deg`);
    card.style.setProperty('--glow-x', `${(x / rect.width) * 100}%`);
    card.style.setProperty('--glow-y', `${(y / rect.height) * 100}%`);
};

const handleCardLeave = (event) => {
    const card = event.currentTarget;
    card.style.setProperty('--tilt-x', '0deg');
    card.style.setProperty('--tilt-y', '0deg');
    card.style.setProperty('--glow-x', '50%');
    card.style.setProperty('--glow-y', '50%');
};

const ResumeTemplates = ({ backendStatus }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [activeCategory, setActiveCategory] = useState('All');
    const [templates, setTemplates] = useState(fallbackTemplates);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [lastUpdated, setLastUpdated] = useState('');
    const [dataSource, setDataSource] = useState('');

    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

    const categories = useMemo(() => {
        const unique = new Set(templates.map((template) => template.category).filter(Boolean));
        return ['All', ...Array.from(unique)];
    }, [templates]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const category = params.get('category');
        if (!category) {
            setActiveCategory('All');
            return;
        }
        const normalized = category.trim().toLowerCase();
        const matched = categories.find((item) => item.toLowerCase() === normalized);
        setActiveCategory(matched || 'All');
    }, [location.search, categories]);

    useEffect(() => {
        if (activeCategory !== 'All' && !categories.includes(activeCategory)) {
            setActiveCategory('All');
        }
    }, [activeCategory, categories]);

    useEffect(() => {
        let isMounted = true;

        const fetchTemplates = async (showSpinner) => {
            if (showSpinner) {
                setIsLoading(true);
            } else {
                setIsRefreshing(true);
            }
            setErrorMessage('');

            try {
                const response = await axios.get(`${BACKEND_URL}/api/templates`);
                const normalized = normalizeTemplates(response.data);

                if (normalized.length > 0) {
                    setTemplates(normalized);
                } else {
                    setErrorMessage('No templates available yet.');
                }

                setLastUpdated(response.data?.last_updated || response.data?.updated_at || '');
                setDataSource(response.data?.source || '');
            } catch (error) {
                console.error('Error fetching templates:', error);
                const fallbackMessage = backendStatus === 'offline'
                    ? 'Backend is offline. Showing cached templates.'
                    : 'Could not fetch templates. Showing cached templates.';
                setErrorMessage(fallbackMessage);
                setTemplates((current) => (current.length ? current : fallbackTemplates));
            } finally {
                if (!isMounted) {
                    return;
                }
                if (showSpinner) {
                    setIsLoading(false);
                } else {
                    setIsRefreshing(false);
                }
            }
        };

        fetchTemplates(true);
        const interval = setInterval(() => fetchTemplates(false), 60000);

        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, [BACKEND_URL, backendStatus]);

    const filteredTemplates = useMemo(() => {
        if (activeCategory === 'All') {
            return templates;
        }
        return templates.filter((template) => template.category === activeCategory);
    }, [activeCategory, templates]);

    const formattedUpdated = useMemo(() => {
        if (!lastUpdated) {
            return '';
        }
        const date = new Date(lastUpdated);
        if (Number.isNaN(date.getTime())) {
            return '';
        }
        return date.toLocaleString();
    }, [lastUpdated]);

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
                            <span>{templates.length} ready-to-use layouts</span>
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
                <div className="templates-status">
                    {isLoading && <span className="status-pill">Loading templates...</span>}
                    {!isLoading && errorMessage && <span className="status-pill error">{errorMessage}</span>}
                    {!isLoading && !errorMessage && (
                        <>
                            {dataSource && <span className="status-pill">Source: {dataSource}</span>}
                            {formattedUpdated && <span className="status-pill">Updated {formattedUpdated}</span>}
                            {isRefreshing && <span className="status-pill">Refreshing...</span>}
                        </>
                    )}
                </div>
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
                        onMouseMove={handleCardMove}
                        onMouseLeave={handleCardLeave}
                    >
                        <div
                            className={`template-preview ${
                                template.previewType === 'iframe'
                                    ? 'has-embed'
                                    : template.previewUrl
                                        ? 'has-image'
                                        : ''
                            }`}
                        >
                            {template.previewType === 'iframe' ? (
                                <div className="preview-embed">
                                    <iframe
                                        src={template.previewUrl}
                                        title={`${template.name} preview`}
                                        loading="lazy"
                                        sandbox="allow-same-origin allow-scripts"
                                        referrerPolicy="no-referrer"
                                    ></iframe>
                                </div>
                            ) : template.previewUrl ? (
                                <img src={template.previewUrl} alt={`${template.name} preview`} loading="lazy" />
                            ) : (
                                <>
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
                                </>
                            )}
                        </div>
                        <div className="template-content">
                            <div className="template-meta">
                                <span className="template-category">{template.category}</span>
                                <span className="template-tag">ATS Ready</span>
                            </div>
                            <h3>{template.name}</h3>
                            <p>{template.description}</p>
                            <button
                                className="template-action"
                                type="button"
                                onClick={() => navigate(`/templates/${template.id}`)}
                            >
                                Preview Template
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    </motion.article>
                ))}
                {!isLoading && filteredTemplates.length === 0 && (
                    <div className="templates-empty">
                        No templates available in this category yet.
                    </div>
                )}
            </motion.section>
            <Footer />
        </div>
    );
};

export default ResumeTemplates;
