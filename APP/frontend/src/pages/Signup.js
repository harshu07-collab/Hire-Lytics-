import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Github, Chrome, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AnimatedGradientBackground from '../components/AnimatedGradientBackground';
import '../styles/Auth.css';

const Signup = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

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

        if (!formData.name) {
            newErrors.name = 'Name is required';
        } else if (formData.name.length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
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
            // Store user session
            sessionStorage.setItem('user', JSON.stringify({
                name: formData.name,
                email: formData.email,
                isAuthenticated: true
            }));

            // Show success message
            alert(`Account created successfully! Welcome, ${formData.name}!`);

            // Redirect to main app
            window.location.href = '/';
            setIsLoading(false);
        }, 1000);
    };

    const handleSocialSignup = (provider) => {
        // Placeholder for future OAuth integration
        console.log(`${provider} signup will be integrated in the future`);
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
                        <h1 className="auth-title">Create Account</h1>
                        <p className="auth-subtitle">Start your journey with Hirelytic</p>
                    </motion.div>

                    <motion.div className="social-buttons" variants={itemVariants}>
                        <button
                            className="social-button google"
                            onClick={() => handleSocialSignup('Google')}
                            type="button"
                        >
                            <Chrome size={20} />
                            <span>Google</span>
                        </button>
                        <button
                            className="social-button github"
                            onClick={() => handleSocialSignup('GitHub')}
                            type="button"
                        >
                            <Github size={20} />
                            <span>GitHub</span>
                        </button>
                    </motion.div>

                    <motion.div className="divider" variants={itemVariants}>
                        <span>Or sign up with email</span>
                    </motion.div>

                    <motion.form
                        className="auth-form"
                        onSubmit={handleSubmit}
                        variants={itemVariants}
                    >
                        <div className="form-group">
                            <label htmlFor="name" className="form-label">
                                Full Name
                            </label>
                            <div className="input-wrapper">
                                <User className="input-icon" size={20} />
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    className={`form-input ${errors.name ? 'error' : ''}`}
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                />
                            </div>
                            {errors.name && <span className="error-text">{errors.name}</span>}
                        </div>

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
                                    placeholder="Create a password"
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

                        <div className="form-group">
                            <label htmlFor="confirmPassword" className="form-label">
                                Confirm Password
                            </label>
                            <div className="input-wrapper">
                                <Lock className="input-icon" size={20} />
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                                    placeholder="Confirm your password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
                        </div>

                        <div className="terms-checkbox">
                            <label className="checkbox-label">
                                <input type="checkbox" className="checkbox" required />
                                <span>
                                    I agree to the{' '}
                                    <a href="#terms" className="auth-link">Terms of Service</a>
                                    {' '}and{' '}
                                    <a href="#privacy" className="auth-link">Privacy Policy</a>
                                </span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="submit-button"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="loading-spinner"></span>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </motion.form>

                    <motion.div className="auth-footer" variants={itemVariants}>
                        <p>
                            Already have an account?{' '}
                            <a href="/login" className="auth-link">Sign in</a>
                        </p>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default Signup;
