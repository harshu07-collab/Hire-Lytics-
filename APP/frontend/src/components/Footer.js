import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
    return (
        <footer className="footer" id="contact">
            <div className="footer-container">
                <div className="footer-grid">
                    <div className="footer-brand" id="about">
                        <div className="footer-logo">
                            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                                <rect width="32" height="32" rx="6" fill="#10b981"/>
                                <path d="M12 20V12M16 20V8M20 20V16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                            <span className="footer-logo-text">HIRELYTIC</span>
                        </div>
                        <p className="footer-tagline">
                            AI-powered resume intelligence for modern professionals.
                            Optimize your career journey with confidence.
                        </p>
                    </div>

                    <div className="footer-links">
                        <div className="footer-column">
                            <h4 className="footer-heading">Product</h4>
                            <a href="#features" className="footer-link">Features</a>
                            <a href="#pricing" className="footer-link">Pricing</a>
                            <a href="#" className="footer-link">Resume Checker</a>
                            <a href="#" className="footer-link">AI Rewriter</a>
                        </div>

                        <div className="footer-column">
                            <h4 className="footer-heading">Company</h4>
                            <a href="#about" className="footer-link">About</a>
                            <a href="#" className="footer-link">Blog</a>
                            <a href="#" className="footer-link">Careers</a>
                            <a href="#contact" className="footer-link">Contact</a>
                        </div>

                        <div className="footer-column">
                            <h4 className="footer-heading">Resources</h4>
                            <a href="#" className="footer-link">Help Center</a>
                            <a href="#" className="footer-link">Resume Templates</a>
                            <a href="#" className="footer-link">Career Guides</a>
                            <a href="#" className="footer-link">ATS Tips</a>
                        </div>

                        <div className="footer-column">
                            <h4 className="footer-heading">Legal</h4>
                            <a href="#" className="footer-link">Privacy Policy</a>
                            <a href="#" className="footer-link">Terms of Service</a>
                            <a href="#" className="footer-link">Cookie Policy</a>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p className="footer-copyright">
                        © 2026 HIRELYTIC. All rights reserved.
                    </p>
                    <div className="footer-social">
                        <a href="#" className="social-link" aria-label="Twitter">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M6.29 18.25c7.55 0 11.67-6.25 11.67-11.67 0-.18 0-.35-.01-.53A8.35 8.35 0 0020 3.92a8.18 8.18 0 01-2.36.65 4.12 4.12 0 001.8-2.27 8.22 8.22 0 01-2.6 1 4.1 4.1 0 00-6.99 3.74 11.65 11.65 0 01-8.46-4.29 4.1 4.1 0 001.27 5.48A4.07 4.07 0 01.8 7.72v.05a4.1 4.1 0 003.29 4.02 4.1 4.1 0 01-1.85.07 4.1 4.1 0 003.83 2.85A8.23 8.23 0 010 16.7a11.62 11.62 0 006.29 1.84"/>
                            </svg>
                        </a>
                        <a href="#" className="social-link" aria-label="LinkedIn">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M4.98 3.5c0 1.38-1.11 2.5-2.48 2.5-1.38 0-2.5-1.12-2.5-2.5C0 2.12 1.11 1 2.5 1c1.37 0 2.48 1.12 2.48 2.5zM5 8H0v12h5V8zM20 13.32c0-4.57-2.16-6.32-5.04-6.32-2.03 0-3.43 1.14-3.96 2.11V8H7v12h4v-6.57c0-1.86.53-3.71 2.79-3.71 2.25 0 2.34 2.29 2.34 3.86V20H20v-6.68z"/>
                            </svg>
                        </a>
                        <a href="#" className="social-link" aria-label="GitHub">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 0C4.48 0 0 4.48 0 10c0 4.42 2.87 8.17 6.84 9.49.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.71-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.58 9.58 0 0110 4.84c.85.01 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85 0 1.34-.01 2.42-.01 2.75 0 .27.18.58.69.48A10.02 10.02 0 0020 10c0-5.52-4.48-10-10-10z" clipRule="evenodd"/>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
