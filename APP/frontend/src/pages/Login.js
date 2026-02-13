import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, Github, Chrome, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AnimatedGradientBackground from '../components/AnimatedGradientBackground';
import '../styles/Auth.css';

const Login = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    // Temporary credentials for demo
    const DEMO_CREDENTIALS = {
        username: 'Harsh Gupta',
        email: 'harsh@hirelytic.com',
        password: 'harsh@123'
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            // Check demo credentials
            if (formData.email === DEMO_CREDENTIALS.email && formData.password === DEMO_CREDENTIALS.password) {
                // Store user session
                sessionStorage.setItem('user', JSON.stringify({
                    name: DEMO_CREDENTIALS.username,
                    email: DEMO_CREDENTIALS.email,
                    isAuthenticated: true
                }));

                // Redirect to main app
                window.location.href = '/';
            } else {
                setErrors({
                    general: 'Invalid email or password. Try: harsh@hirelytic.com / harsh@123'
                });
            }
            setIsLoading(false);
        }, 1000);
    };

    const handleSocialLogin = (provider) => {
        // Placeholder for future OAuth integration
        console.log(`${provider} login will be integrated in the future`);
        alert(`${provider} authentication will be available soon!`);
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: [0.4, 0, 0.2, 1]
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.4
            }
        }
    };

    return (
        <div className="auth-container">
            <AnimatedGradientBackground />

            <motion.div
                className="auth-content"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <button
                    className="back-button"
                    onClick={() => navigate('/')}
                    aria-label="Go back to home"
                >
                    <ArrowLeft size={20} />
                    <span>Back to Home</span>
                </button>

                <div className="auth-card">
                    <motion.div className="auth-header" variants={itemVariants}>
                        <div className="auth-logo">
                            <svg width="48" height="48" viewBox="0 0 32 32" fill="none">
                                <rect width="32" height="32" rx="6" fill="#10b981"/>
                                <path d="M12 20V12M16 20V8M20 20V16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                        </div>
                        <h1 className="auth-title">Welcome Back</h1>
                        <p className="auth-subtitle">Sign in to continue to Hirelytic</p>
                    </motion.div>

                    {errors.general && (
                        <motion.div
                            className="error-banner"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            {errors.general}
                        </motion.div>
                    )}

                    <motion.form
                        className="auth-form"
                        onSubmit={handleSubmit}
                        variants={itemVariants}
                    >
                        <div className="form-group">
                            <label htmlFor="email" className="form-label">
                                Email Address
                            </label>
                            <div className="input-wrapper">
                                <Mail className="input-icon" size={20} />
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className={`form-input ${errors.email ? 'error' : ''}`}
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                />
                            </div>
                            {errors.email && <span className="error-text">{errors.email}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="password" className="form-label">
                                Password
                            </label>
                            <div className="input-wrapper">
                                <Lock className="input-icon" size={20} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    className={`form-input ${errors.password ? 'error' : ''}`}
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {errors.password && <span className="error-text">{errors.password}</span>}
                        </div>

                        <div className="form-options">
                            <label className="checkbox-label">
                                <input type="checkbox" className="checkbox" />
                                <span>Remember me</span>
                            </label>
                            <a href="#forgot" className="forgot-link">Forgot password?</a>
                        </div>

                        <button
                            type="submit"
                            className="submit-button"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="loading-spinner"></span>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </motion.form>

                    <motion.div className="divider" variants={itemVariants}>
                        <span>Or continue with</span>
                    </motion.div>

                    <motion.div className="social-buttons" variants={itemVariants}>
                        <button
                            className="social-button google"
                            onClick={() => handleSocialLogin('Google')}
                            type="button"
                        >
                            <Chrome size={20} />
                            <span>Google</span>
                        </button>
                        <button
                            className="social-button github"
                            onClick={() => handleSocialLogin('GitHub')}
                            type="button"
                        >
                            <Github size={20} />
                            <span>GitHub</span>
                        </button>
                    </motion.div>

                    <motion.div className="auth-footer" variants={itemVariants}>
                        <p>
                            Don't have an account?{' '}
                            <a href="/signup" className="auth-link">Sign up</a>
                        </p>
                    </motion.div>

                    <motion.div className="demo-credentials" variants={itemVariants}>
                        <p className="demo-title">Demo Credentials:</p>
                        <p className="demo-text">Email: harsh@hirelytic.com</p>
                        <p className="demo-text">Password: harsh@123</p>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
