import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import { GoogleOAuthProvider } from '@react-oauth/google';
import '@/App.css';
import { AuthProvider } from './contexts/AuthContext';
import GoogleSearchIntro from './components/GoogleSearchIntro';
import HirelyticApp from './components/HirelyticApp';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ResumeTemplates from './pages/ResumeTemplates';
import TemplatePreview from './pages/TemplatePreview';
import ResumeAnalysis from './pages/ResumeAnalysis';
import JobSuggestions from './pages/JobSuggestions';
import ResumeEditor from './pages/ResumeEditor';

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

function App() {
    const [showIntro, setShowIntro] = useState(true);
    const [hasSeenIntro, setHasSeenIntro] = useState(false);
    const [backendStatus, setBackendStatus] = useState('checking');

    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

    useEffect(() => {
        // Check if user has seen the intro this session
        const introSeen = sessionStorage.getItem('hirelyticIntroSeen');
        if (introSeen === 'true') {
            setShowIntro(false);
            setHasSeenIntro(true);
        }

        // Check backend health
        const checkBackend = async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/api/`);
                if (response.data && response.data.status === 'ok') {
                    setBackendStatus('online');
                    console.log('Backend connection successful:', response.data.message);
                } else {
                    setBackendStatus('offline');
                }
            } catch (error) {
                console.error('Backend connection failed:', error.message);
                setBackendStatus('offline');
            }
        };

        checkBackend();
        const interval = setInterval(checkBackend, 30000);
        return () => clearInterval(interval);
    }, [BACKEND_URL]);

    const handleIntroComplete = () => {
        sessionStorage.setItem('hirelyticIntroSeen', 'true');
        setShowIntro(false);
        setHasSeenIntro(true);
    };

    const appContent = (
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            <AuthProvider>
                <Router>
                    <div className="App">
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/signup" element={<Signup />} />
                            <Route path="/templates" element={<ResumeTemplates backendStatus={backendStatus} />} />
                            <Route path="/templates/:templateId" element={<TemplatePreview backendStatus={backendStatus} />} />
                            <Route path="/builder" element={<ResumeEditor backendStatus={backendStatus} />} />
                            <Route path="/analysis" element={<ResumeAnalysis backendStatus={backendStatus} />} />
                            <Route path="/job-suggestions" element={<JobSuggestions backendStatus={backendStatus} />} />
                            <Route
                                path="/"
                                element={
                                    showIntro && !hasSeenIntro ? (
                                        <GoogleSearchIntro onComplete={handleIntroComplete} />
                                    ) : (
                                        <HirelyticApp backendStatus={backendStatus} />
                                    )
                                }
                            />
                        </Routes>
                    </div>
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );

    if (!GOOGLE_CLIENT_ID) {
        return appContent;
    }

    return (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            {appContent}
        </GoogleOAuthProvider>
    );
}

export default App;
