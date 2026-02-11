import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '@/App.css';
import GoogleSearchIntro from './components/GoogleSearchIntro';
import HirelyticApp from './components/HirelyticApp';

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

    return (
        <div className="App">
            {showIntro && !hasSeenIntro ? (
                <GoogleSearchIntro onComplete={handleIntroComplete} />
            ) : (
                <HirelyticApp backendStatus={backendStatus} />
            )}
        </div>
    );
}

export default App;
