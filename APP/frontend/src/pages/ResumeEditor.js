import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Download } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ResumeBuilder from '../components/ResumeBuilder';
import '../styles/ResumeEditor.css';
import { useAuth } from '../contexts/AuthContext';

const ResumeEditor = ({ backendStatus }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { isAuthenticated, accessToken } = useAuth();
    const [template, setTemplate] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [resumeDraft, setResumeDraft] = useState(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadError, setDownloadError] = useState('');

    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
    const templateId = useMemo(() => {
        const params = new URLSearchParams(location.search);
        return params.get('template');
    }, [location.search]);

    useEffect(() => {
        let isMounted = true;

        const fetchTemplate = async () => {
            if (!templateId) {
                setTemplate(null);
                return;
            }
            try {
                const response = await axios.get(`${BACKEND_URL}/api/templates/${encodeURIComponent(templateId)}`);
                if (isMounted) {
                    setTemplate(response.data?.template || null);
                }
            } catch (error) {
                console.error('Error loading template for editor:', error);
                if (isMounted) {
                    setErrorMessage('Unable to load the selected template. You can still edit your resume.');
                }
            }
        };

        fetchTemplate();
        return () => {
            isMounted = false;
        };
    }, [BACKEND_URL, templateId]);

    const handleDownload = async () => {
        if (!isAuthenticated) {
            navigate('/signup');
            return;
        }
        if (!resumeDraft) {
            setDownloadError('Please update your resume before downloading.');
            return;
        }

        setIsDownloading(true);
        setDownloadError('');

        try {
            const response = await axios.post(
                `${BACKEND_URL}/api/resume/pdf`,
                { resume: resumeDraft, template: template },
                {
                    responseType: 'blob',
                    headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {}
                }
            );
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${(template?.name || 'resume').replace(/\s+/g, '-').toLowerCase()}.pdf`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download failed:', error);
            const status = error?.response?.status;
            const fallback = status === 401
                ? 'Your session expired. Please log in again to download.'
                : 'Failed to generate PDF. Please try again.';

            try {
                const payload = error?.response?.data;
                if (payload instanceof Blob) {
                    const text = await payload.text();
                    const parsed = JSON.parse(text);
                    const detail = parsed?.detail || parsed?.message;
                    setDownloadError(detail ? `${fallback} (${detail})` : fallback);
                } else if (payload?.detail) {
                    setDownloadError(`${fallback} (${payload.detail})`);
                } else {
                    setDownloadError(fallback);
                }
            } catch (parseError) {
                setDownloadError(fallback);
            }
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="resume-editor-page">
            <Navbar backendStatus={backendStatus} />
            <motion.section
                className="resume-editor-hero"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
                <button className="editor-back" type="button" onClick={() => navigate('/templates')}>
                    <ArrowLeft size={18} />
                    Back to Templates
                </button>
                <div className="editor-title">
                    <span className="editor-badge">Resume Editor</span>
                    <h1>Edit Your Resume</h1>
                    <p>
                        Update your resume content and review it using the selected template style.
                    </p>
                </div>
                {template && (
                    <div className="editor-template">
                        <div className="template-name">{template.name}</div>
                        <div className="template-category">{template.category}</div>
                    </div>
                )}
                <div className="editor-actions">
                    <button
                        className={`editor-download ${!isAuthenticated ? 'locked' : ''}`}
                        type="button"
                        onClick={handleDownload}
                        disabled={isDownloading}
                    >
                        <Download size={18} />
                        {isAuthenticated ? (isDownloading ? 'Preparing PDF...' : 'Download PDF') : 'Sign up to download'}
                    </button>
                    {!isAuthenticated && (
                        <div className="editor-hint">Create an account to unlock downloads.</div>
                    )}
                </div>
                {downloadError && <div className="editor-error">{downloadError}</div>}
                {errorMessage && <div className="editor-error">{errorMessage}</div>}
            </motion.section>

            <ResumeBuilder activeTemplate={template} onResumeChange={setResumeDraft} />
            <Footer />
        </div>
    );
};

export default ResumeEditor;
