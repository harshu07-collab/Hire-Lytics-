import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, Github, Chrome, ArrowLeft, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import Logo from '../components/Logo';
import AnimatedGradientBackground from '../components/AnimatedGradientBackground';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Auth.css';

const Login = () => {
    const navigate = useNavigate();
    const { login, BACKEND_URL, setAuthError } = useAuth();
    const isGoogleEnabled = Boolean(process.env.REACT_APP_GOOGLE_CLIENT_ID);

    const [step, setStep] = useState('email');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

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

    const handleSendOTP = async (e) => {
        e.preventDefault();

        const newErrors = {};
        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Email is invalid';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsLoading(true);
        setErrors({});

        try {
            const response = await axios.post(
                `${BACKEND_URL}/api/auth/login/send-otp`,
                { email, type: 'login' }
            );

            console.log('OTP sent:', response.data);
            setStep('otp');
            if (response.data.otp) {
                console.log('DEBUG OTP:', response.data.otp);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.detail || 'Failed to send OTP';
            setErrors({ general: errorMessage });
            setAuthError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();

        if (!otp || otp.length !== 6) {
            setErrors({ otp: 'OTP must be 6 digits' });
            return;
        }

        setIsLoading(true);
        setErrors({});

        try {
            const response = await axios.post(
                `${BACKEND_URL}/api/auth/login/verify-otp`,
                { email, otp }
            );

            const { access_token, refresh_token, user } = response.data;
            login(user, access_token, refresh_token);

            setTimeout(() => {
                window.location.href = '/';
            }, 500);
        } catch (error) {
            const errorMessage = error.response?.data?.detail || 'Failed to verify OTP';
            setErrors({ general: errorMessage });
            setAuthError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            setIsLoading(true);

            const response = await axios.post(
                `${BACKEND_URL}/api/auth/google`,
                { token: credentialResponse.credential }
            );

            const { access_token, refresh_token, user } = response.data;
            login(user, access_token, refresh_token);

            setTimeout(() => {
                window.location.href = '/';
            }, 500);
        } catch (error) {
            const errorMessage = error.response?.data?.detail || 'Google authentication failed';
            setErrors({ general: errorMessage });
            setAuthError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleError = () => {
        setErrors({ general: 'Google authentication failed' });
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
                        <Logo className="mb-4 justify-center" />
                        <h1 className="auth-title">Welcome Back</h1>
                        <p className="auth-subtitle">
                            {step === 'email' ? 'Sign in to continue to Hirelytic' : 'Verify your email with OTP'}
                        </p>
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

                    {step === 'email' && (
                        <motion.form
                            className="auth-form"
                            onSubmit={handleSendOTP}
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
                                        className={`form-input ${errors.email ? 'error' : ''}`}
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            if (errors.email) {
                                                setErrors({ ...errors, email: '' });
                                            }
                                        }}
                                        disabled={isLoading}
                                    />
                                </div>
                                {errors.email && <span className="error-text">{errors.email}</span>}
                            </div>

                            <button
                                type="submit"
                                className="submit-button"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader size={20} className="animate-spin" />
                                        <span>Sending OTP...</span>
                                    </>
                                ) : (
                                    'Send OTP'
                                )}
                            </button>
                        </motion.form>
                    )}

                    {step === 'otp' && (
                        <motion.form
                            className="auth-form"
                            onSubmit={handleVerifyOTP}
                            variants={itemVariants}
                        >
                            <div className="form-group">
                                <label htmlFor="otp" className="form-label">
                                    Enter 6-digit OTP
                                </label>
                                <p className="form-helper">
                                    Check your email {email} for the code
                                </p>
                                <div className="input-wrapper">
                                    <Lock className="input-icon" size={20} />
                                    <input
                                        type="text"
                                        id="otp"
                                        className={`form-input otp-input ${errors.otp ? 'error' : ''}`}
                                        placeholder="000000"
                                        value={otp}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                                            setOtp(value);
                                            if (errors.otp) {
                                                setErrors({ ...errors, otp: '' });
                                            }
                                        }}
                                        disabled={isLoading}
                                        maxLength="6"
                                    />
                                </div>
                                {errors.otp && <span className="error-text">{errors.otp}</span>}
                            </div>

                            <button
                                type="submit"
                                className="submit-button"
                                disabled={isLoading || otp.length !== 6}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader size={20} className="animate-spin" />
                                        <span>Verifying...</span>
                                    </>
                                ) : (
                                    'Verify OTP'
                                )}
                            </button>

                            <button
                                type="button"
                                className="resend-button"
                                onClick={handleSendOTP}
                                disabled={isLoading}
                            >
                                Resend OTP
                            </button>
                        </motion.form>
                    )}

                    {step === 'email' && isGoogleEnabled && (
                        <>
                            <motion.div className="divider" variants={itemVariants}>
                                <span>Or continue with</span>
                            </motion.div>

                            <motion.div className="social-buttons social-buttons-single" variants={itemVariants}>
                                <div className="google-login-wrapper">
                                    <GoogleLogin
                                        onSuccess={handleGoogleSuccess}
                                        onError={handleGoogleError}
                                        shape="pill"
                                        size="large"
                                        width="260"
                                        useOneTap
                                    />
                                </div>
                            </motion.div>
                        </>
                    )}

                    <motion.div className="auth-footer" variants={itemVariants}>
                        <p>
                            Don't have an account?{' '}
                            <a href="/signup" className="auth-link">Sign up</a>
                        </p>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
