import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, ExternalLink, Pencil } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/TemplatePreview.css';

const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.08 }
    }
};

const cardVariants = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }
};

const TemplatePreview = ({ backendStatus }) => {
    const navigate = useNavigate();
    const { templateId } = useParams();
    const [template, setTemplate] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [source, setSource] = useState('');
    const [lastUpdated, setLastUpdated] = useState('');

    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

    useEffect(() => {
        let isMounted = true;

        const fetchTemplate = async () => {
            setIsLoading(true);
            setErrorMessage('');

            try {
                const response = await axios.get(`${BACKEND_URL}/api/templates/${encodeURIComponent(templateId)}`);
                if (!isMounted) {
                    return;
                }
                setTemplate(response.data?.template || null);
                setSource(response.data?.source || '');
                setLastUpdated(response.data?.last_updated || '');
            } catch (error) {
                console.error('Error loading template:', error);
                if (!isMounted) {
                    return;
                }
                setErrorMessage('Template not found or unavailable.');
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchTemplate();
        return () => {
            isMounted = false;
        };
    }, [BACKEND_URL, templateId]);

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

    const handleEdit = () => {
        if (!template) {
            return;
        }
        navigate(`/builder?template=${encodeURIComponent(template.id)}`);
    };

    return (
        <div className="template-preview-page">
            <Navbar backendStatus={backendStatus} />
            <motion.section className="template-preview-shell" initial="hidden" animate="show" variants={containerVariants}>
                <motion.div className="template-preview-header" variants={cardVariants}>
                    <button className="template-back" type="button" onClick={() => navigate('/templates')}>
                        <ArrowLeft size={18} />
                        Back to Templates
                    </button>
                    <div className="template-preview-title">
                        <span className="template-badge">Template Preview</span>
                        <h1>{template?.name || 'Loading template...'}</h1>
                        <p>{template?.description || 'Review the template and start editing your resume content.'}</p>
                        <div className="template-meta-row">
                            {template?.category && <span className="template-pill">{template.category}</span>}
                            {source && <span className="template-pill">Source: {source}</span>}
                            {formattedUpdated && <span className="template-pill">Updated {formattedUpdated}</span>}
                        </div>
                    </div>
                    <div className="template-preview-actions">
                        <button className="action-button primary" type="button" onClick={handleEdit} disabled={!template}>
                            <Pencil size={18} />
                            Edit Template
                        </button>
                        {(template?.previewUrl || template?.preview_url) && (
                            <a
                                className="action-button ghost"
                                href={template.previewUrl || template.preview_url}
                                target="_blank"
                                rel="noreferrer"
                            >
                                <ExternalLink size={18} />
                                Open Full Preview
                            </a>
                        )}
                    </div>
                </motion.div>

                <motion.div className="template-preview-body" variants={cardVariants}>
                    {isLoading && <div className="template-preview-loading">Loading preview...</div>}
                    {!isLoading && errorMessage && <div className="template-preview-error">{errorMessage}</div>}
                    {!isLoading && !errorMessage && template && (
                        <div className="template-preview-panel">
                            {(template.previewType || template.preview_type) === 'iframe' ? (
                                <div className="preview-embed large">
                                    <iframe
                                        src={template.previewUrl || template.preview_url}
                                        title={`${template.name} preview`}
                                        loading="lazy"
                                        sandbox="allow-same-origin allow-scripts"
                                        referrerPolicy="no-referrer"
                                    ></iframe>
                                </div>
                            ) : (template.previewUrl || template.preview_url) ? (
                                <img
                                    className="template-preview-image"
                                    src={template.previewUrl || template.preview_url}
                                    alt={`${template.name} preview`}
                                />
                            ) : (
                                <div className="template-preview-placeholder">
                                    Preview not available yet.
                                </div>
                            )}
                            <div className="template-preview-note">
                                If the preview does not load, use the "Open Full Preview" button.
                            </div>
                        </div>
                    )}
                </motion.div>
            </motion.section>
            <Footer />
        </div>
    );
};

export default TemplatePreview;
