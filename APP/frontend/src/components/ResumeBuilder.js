import React, { useMemo, useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import '../styles/ResumeBuilder.css';

const defaultResume = {
    name: 'Isabelle Todd',
    title: 'Product Owner',
    email: 'isabelle@gmail.com',
    phone: '+1 (555) 111-1111',
    location: 'New York City, NY',
    linkedin: 'linkedin.com/in/isabelle-todd',
    summary: 'I solve problems and help people overcome obstacles. Passionate about building products that scale and delight customers.',
    experienceTitle: 'Product Owner',
    experienceCompany: 'E-Lab Services',
    experienceDates: '02/2020 - 04/2021',
    experienceLocation: 'Hamburg, Germany',
    experienceBullets: 'Drove the launch of a new tracking software that improved reporting speed by 45%.\nLed the team in making key product strategy decisions and prioritized customer feedback.'
};

const ResumeBuilder = ({ activeTemplate, initialResume, onResumeChange }) => {
    const previewRef = useRef(null);
    const [resume, setResume] = useState(() => initialResume || defaultResume);

    const bullets = useMemo(
        () => resume.experienceBullets.split('\n').map((line) => line.trim()).filter(Boolean),
        [resume.experienceBullets]
    );

    const handleChange = (field) => (event) => {
        setResume((current) => ({
            ...current,
            [field]: event.target.value
        }));
    };

    useEffect(() => {
        if (onResumeChange) {
            onResumeChange(resume);
        }
    }, [resume, onResumeChange]);

    const [isDownloading, setIsDownloading] = useState(false);
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

    const handleDownload = async () => {
        setIsDownloading(true);
        try {
            const response = await axios.post(
                `${BACKEND_URL}/api/resume/pdf`,
                {
                    resume: resume,
                    template: activeTemplate
                },
                { responseType: 'blob' }
            );

            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            const filename = `${(resume.name || 'resume').replace(/[^a-z0-9._-]+/gi, '-').toLowerCase()}.pdf`;
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading resume:', error);
            alert("Failed to download resume. Please try again.");
        } finally {
            setIsDownloading(false);
        }
    };

    const handleReview = () => {
        if (previewRef.current) {
            previewRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <section className="resume-builder-section">
            <div className="builder-container">
                <motion.div
                    className="builder-content"
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="builder-title">
                        Use the best resume builder in the industry
                    </h2>
                    <p className="builder-description">
                        After receiving your checker score you can continue editing and improving your
                        job application with Hirelytic's resume builder. Quickly add, reorder, or remove
                        sections.
                    </p>
                    <p className="builder-description">
                        Tailor your resume based on the job posting you're applying for. Ensure that you
                        have the right keywords and skills to match with PDF formatting that an ATS can
                        easily read.
                    </p>
                    <div className="builder-form">
                        <div className="form-field">
                            <label className="form-label" htmlFor="resume-name">Full name</label>
                            <input
                                id="resume-name"
                                className="form-input"
                                value={resume.name}
                                onChange={handleChange('name')}
                                placeholder="Your name"
                            />
                        </div>
                        <div className="form-grid">
                            <div className="form-field">
                                <label className="form-label" htmlFor="resume-title">Role</label>
                                <input
                                    id="resume-title"
                                    className="form-input"
                                    value={resume.title}
                                    onChange={handleChange('title')}
                                    placeholder="Product Owner"
                                />
                            </div>
                            <div className="form-field">
                                <label className="form-label" htmlFor="resume-location">Location</label>
                                <input
                                    id="resume-location"
                                    className="form-input"
                                    value={resume.location}
                                    onChange={handleChange('location')}
                                    placeholder="City, State"
                                />
                            </div>
                        </div>
                        <div className="form-grid">
                            <div className="form-field">
                                <label className="form-label" htmlFor="resume-email">Email</label>
                                <input
                                    id="resume-email"
                                    className="form-input"
                                    value={resume.email}
                                    onChange={handleChange('email')}
                                    placeholder="you@email.com"
                                />
                            </div>
                            <div className="form-field">
                                <label className="form-label" htmlFor="resume-phone">Phone</label>
                                <input
                                    id="resume-phone"
                                    className="form-input"
                                    value={resume.phone}
                                    onChange={handleChange('phone')}
                                    placeholder="+1 (555) 123-4567"
                                />
                            </div>
                        </div>
                        <div className="form-field">
                            <label className="form-label" htmlFor="resume-linkedin">LinkedIn</label>
                            <input
                                id="resume-linkedin"
                                className="form-input"
                                value={resume.linkedin}
                                onChange={handleChange('linkedin')}
                                placeholder="linkedin.com/in/yourname"
                            />
                        </div>
                        <div className="form-field">
                            <label className="form-label" htmlFor="resume-summary">Summary</label>
                            <textarea
                                id="resume-summary"
                                className="form-textarea"
                                rows="3"
                                value={resume.summary}
                                onChange={handleChange('summary')}
                            />
                        </div>
                        <div className="form-divider">Experience</div>
                        <div className="form-grid">
                            <div className="form-field">
                                <label className="form-label" htmlFor="resume-exp-title">Role</label>
                                <input
                                    id="resume-exp-title"
                                    className="form-input"
                                    value={resume.experienceTitle}
                                    onChange={handleChange('experienceTitle')}
                                />
                            </div>
                            <div className="form-field">
                                <label className="form-label" htmlFor="resume-exp-company">Company</label>
                                <input
                                    id="resume-exp-company"
                                    className="form-input"
                                    value={resume.experienceCompany}
                                    onChange={handleChange('experienceCompany')}
                                />
                            </div>
                        </div>
                        <div className="form-grid">
                            <div className="form-field">
                                <label className="form-label" htmlFor="resume-exp-dates">Dates</label>
                                <input
                                    id="resume-exp-dates"
                                    className="form-input"
                                    value={resume.experienceDates}
                                    onChange={handleChange('experienceDates')}
                                />
                            </div>
                            <div className="form-field">
                                <label className="form-label" htmlFor="resume-exp-location">Location</label>
                                <input
                                    id="resume-exp-location"
                                    className="form-input"
                                    value={resume.experienceLocation}
                                    onChange={handleChange('experienceLocation')}
                                />
                            </div>
                        </div>
                        <div className="form-field">
                            <label className="form-label" htmlFor="resume-exp-bullets">Impact bullets (one per line)</label>
                            <textarea
                                id="resume-exp-bullets"
                                className="form-textarea"
                                rows="4"
                                value={resume.experienceBullets}
                                onChange={handleChange('experienceBullets')}
                            />
                        </div>
                        <div className="form-actions" style={{ gap: '12px' }}>
                            <button className="btn-builder" type="button" onClick={handleReview}>
                                Review
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M7 10H17M17 10L13 6M17 10L13 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                            <button
                                className="btn-builder"
                                type="button"
                                onClick={handleDownload}
                                disabled={isDownloading}
                                style={{
                                    background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                                    boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)'
                                }}
                            >
                                {isDownloading ? 'Generating...' : 'Download PDF'}
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4" />
                                    <polyline points="7 10 12 15 17 10" />
                                    <line x1="12" y1="15" x2="12" y2="3" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    className="builder-visual"
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <div className="resume-preview-container" ref={previewRef}>
                        {activeTemplate && (
                            <div className="active-template-banner">
                                <div>
                                    <div className="banner-label">Editing Template</div>
                                    <div className="banner-name">{activeTemplate.name}</div>
                                    <div className="banner-meta">{activeTemplate.category}</div>
                                </div>
                                {(activeTemplate.previewUrl || activeTemplate.preview_url) && (
                                    <a
                                        className="banner-link"
                                        href={activeTemplate.previewUrl || activeTemplate.preview_url}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        Open Preview
                                    </a>
                                )}
                            </div>
                        )}
                        <div className={`resume-preview category-${(activeTemplate?.category || 'general').toLowerCase()}`}>
                            <div className="preview-header-section">
                                <div className="preview-name">{resume.name.toUpperCase()}</div>
                                <div className="preview-tagline">{resume.summary}</div>
                                <div className="preview-contact">
                                    <span>{resume.phone}</span>
                                    <span>{resume.email}</span>
                                    <span>{resume.linkedin}</span>
                                    <span>{resume.location}</span>
                                </div>
                            </div>
                            <div className="preview-section">
                                <div className="section-title">SUMMARY</div>
                                <div className="summary-text">{resume.title}</div>
                            </div>
                            <div className="preview-section">
                                <div className="section-title">EXPERIENCE</div>
                                <div className="experience-item">
                                    <div className="exp-title">{resume.experienceTitle}</div>
                                    <div className="exp-company">{resume.experienceCompany}</div>
                                    <div className="exp-date">{resume.experienceDates}</div>
                                    <div className="exp-location">{resume.experienceLocation}</div>
                                    <ul className="exp-bullets">
                                        {bullets.map((bullet) => (
                                            <li key={bullet}>{bullet}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            <motion.div
                className="keywords-section"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
            >
                <div className="keywords-badge">Keywords</div>
                <div className="keywords-visual">
                    <div className="keyword-cloud">
                        {['Leadership', 'Strategy', 'Management', 'Analysis', 'Communication', 'Problem-solving'].map((keyword, i) => (
                            <motion.span
                                key={keyword}
                                className="keyword-tag"
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.4 }}
                                whileHover={{ scale: 1.1, y: -2 }}
                            >
                                {keyword}
                            </motion.span>
                        ))}
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

export default ResumeBuilder;
