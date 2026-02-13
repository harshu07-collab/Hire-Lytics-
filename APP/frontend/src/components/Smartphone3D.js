import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, RoundedBox, ContactShadows } from '@react-three/drei';
import { useTheme } from 'next-themes';
import * as THREE from 'three';
import '../styles/Smartphone3D.css';

// Enhanced Smartphone Screen Texture Generator - Modern Hire-Lytics UI
function createSmartphoneScreenTexture(theme) {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 2048;
    const ctx = canvas.getContext('2d');
    const isDark = theme === 'dark';

    // Background gradient
    const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    if (isDark) {
        bgGradient.addColorStop(0, '#0f172a');
        bgGradient.addColorStop(1, '#1e293b');
    } else {
        bgGradient.addColorStop(0, '#f8fafc');
        bgGradient.addColorStop(1, '#ffffff');
    }
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Status bar
    ctx.fillStyle = isDark ? '#0f172a' : '#ffffff';
    ctx.fillRect(0, 0, canvas.width, 60);
    ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
    ctx.font = 'bold 24px Arial, sans-serif';
    ctx.fillText('9:41', 40, 40);
    
    // Header with gradient
    const headerGradient = ctx.createLinearGradient(0, 60, 0, 160);
    headerGradient.addColorStop(0, '#10b981');
    headerGradient.addColorStop(1, '#059669');
    ctx.fillStyle = headerGradient;
    ctx.fillRect(0, 60, canvas.width, 100);

    // Logo and brand
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 40px Arial, sans-serif';
    ctx.fillText('Hire-Lytics', 50, 130);
    
    // Menu icon
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    for (let i = 0; i < 3; i++) {
        ctx.fillRect(900, 95 + i * 12, 40, 6);
    }

    // Hero Section
    const heroY = 220;
    ctx.fillStyle = isDark ? '#f8fafc' : '#1f2937';
    ctx.font = 'bold 56px Arial, sans-serif';
    ctx.fillText('AI-Powered', 50, heroY);
    ctx.fillText('Resume', 50, heroY + 70);
    ctx.fillStyle = '#10b981';
    ctx.fillText('Enhancement', 50, heroY + 140);

    // Subtitle
    ctx.fillStyle = isDark ? '#94a3b8' : '#6b7280';
    ctx.font = '28px Arial, sans-serif';
    ctx.fillText('Transform your resume with', 50, heroY + 200);
    ctx.fillText('intelligent AI analysis', 50, heroY + 240);

    // Stats Cards - Modern design
    const cardY = 560;
    const cardWidth = 430;
    const cardHeight = 180;
    const gap = 64;

    // Card 1 - ATS Score
    const card1Gradient = ctx.createLinearGradient(50, cardY, 50, cardY + cardHeight);
    card1Gradient.addColorStop(0, isDark ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.1)');
    card1Gradient.addColorStop(1, isDark ? 'rgba(16, 185, 129, 0.05)' : 'rgba(16, 185, 129, 0.02)');
    ctx.fillStyle = card1Gradient;
    ctx.beginPath();
    ctx.roundRect(50, cardY, cardWidth, cardHeight, 20);
    ctx.fill();
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 72px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('95%', 50 + cardWidth/2, cardY + 85);
    ctx.fillStyle = isDark ? '#94a3b8' : '#6b7280';
    ctx.font = '24px Arial, sans-serif';
    ctx.fillText('ATS Score', 50 + cardWidth/2, cardY + 125);

    // Card 2 - Success Rate
    const card2Gradient = ctx.createLinearGradient(50 + cardWidth + gap, cardY, 50 + cardWidth + gap, cardY + cardHeight);
    card2Gradient.addColorStop(0, isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)');
    card2Gradient.addColorStop(1, isDark ? 'rgba(59, 130, 246, 0.05)' : 'rgba(59, 130, 246, 0.02)');
    ctx.fillStyle = card2Gradient;
    ctx.beginPath();
    ctx.roundRect(50 + cardWidth + gap, cardY, cardWidth, cardHeight, 20);
    ctx.fill();
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#3b82f6';
    ctx.font = 'bold 72px Arial, sans-serif';
    ctx.fillText('50K+', 50 + cardWidth + gap + cardWidth/2, cardY + 85);
    ctx.fillStyle = isDark ? '#94a3b8' : '#6b7280';
    ctx.font = '24px Arial, sans-serif';
    ctx.fillText('Resumes', 50 + cardWidth + gap + cardWidth/2, cardY + 125);
    ctx.textAlign = 'left';

    // Performance Metrics Section
    const metricsY = 820;
    ctx.fillStyle = isDark ? '#f8fafc' : '#1f2937';
    ctx.font = 'bold 32px Arial, sans-serif';
    ctx.fillText('Performance Metrics', 50, metricsY);

    const metrics = [
        { label: 'Keywords Match', value: 0.95, color: '#10b981' },
        { label: 'Format Score', value: 0.88, color: '#3b82f6' },
        { label: 'Content Quality', value: 0.92, color: '#8b5cf6' },
        { label: 'ATS Compatibility', value: 0.96, color: '#f59e0b' }
    ];

    metrics.forEach((metric, i) => {
        const y = metricsY + 50 + i * 90;
        
        // Label
        ctx.fillStyle = isDark ? '#cbd5e1' : '#4b5563';
        ctx.font = '22px Arial, sans-serif';
        ctx.fillText(metric.label, 50, y);

        // Percentage
        ctx.fillStyle = isDark ? '#f8fafc' : '#1f2937';
        ctx.font = 'bold 22px Arial, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(`${Math.round(metric.value * 100)}%`, 974, y);
        ctx.textAlign = 'left';

        // Background bar
        ctx.fillStyle = isDark ? '#334155' : '#e5e7eb';
        ctx.beginPath();
        ctx.roundRect(50, y + 15, 924, 16, 8);
        ctx.fill();

        // Progress bar with gradient
        const barGradient = ctx.createLinearGradient(50, 0, 50 + 924 * metric.value, 0);
        barGradient.addColorStop(0, metric.color);
        barGradient.addColorStop(1, metric.color + 'aa');
        ctx.fillStyle = barGradient;
        ctx.beginPath();
        ctx.roundRect(50, y + 15, 924 * metric.value, 16, 8);
        ctx.fill();
    });

    // Feature Tags
    const tagsY = 1280;
    const tags = ['ATS Optimized', 'AI Enhanced', 'Instant Results'];
    const tagColors = ['#10b981', '#3b82f6', '#8b5cf6'];
    let tagX = 50;

    tags.forEach((tag, i) => {
        const tagWidth = ctx.measureText(tag).width + 60;
        
        // Tag background
        ctx.fillStyle = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';
        ctx.beginPath();
        ctx.roundRect(tagX, tagsY, tagWidth, 56, 28);
        ctx.fill();
        ctx.strokeStyle = tagColors[i];
        ctx.lineWidth = 2;
        ctx.stroke();

        // Tag text
        ctx.fillStyle = tagColors[i];
        ctx.font = 'bold 22px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(tag, tagX + tagWidth/2, tagsY + 36);
        ctx.textAlign = 'left';
        
        tagX += tagWidth + 24;
    });

    // CTA Button
    const btnY = 1400;
    const btnGradient = ctx.createLinearGradient(50, btnY, 50, btnY + 80);
    btnGradient.addColorStop(0, '#10b981');
    btnGradient.addColorStop(1, '#059669');
    ctx.fillStyle = btnGradient;
    ctx.beginPath();
    ctx.roundRect(50, btnY, 924, 80, 16);
    ctx.fill();

    // Button shadow
    ctx.shadowColor = 'rgba(16, 185, 129, 0.4)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 8;
    ctx.beginPath();
    ctx.roundRect(50, btnY, 924, 80, 16);
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 32px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Analyze My Resume', 512, btnY + 50);
    ctx.textAlign = 'left';

    // Bottom navigation bar
    ctx.fillStyle = isDark ? '#0f172a' : '#ffffff';
    ctx.fillRect(0, 1988, canvas.width, 60);
    
    // Home indicator
    ctx.fillStyle = isDark ? '#475569' : '#cbd5e1';
    ctx.beginPath();
    ctx.roundRect(362, 2008, 300, 8, 4);
    ctx.fill();

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    texture.anisotropy = 16;
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
}

// Simple 3D Smartphone Model Component
function SmartphoneModel({ theme }) {
    const phoneRef = useRef();
    const [hovered, setHovered] = useState(false);
    const [screenTexture, setScreenTexture] = useState(null);

    useEffect(() => {
        const texture = createSmartphoneScreenTexture(theme);
        setScreenTexture(texture);
    }, [theme]);

    useFrame((state) => {
        if (phoneRef.current && !hovered) {
            const time = state.clock.elapsedTime;
            phoneRef.current.rotation.y = Math.sin(time * 0.3) * 0.2;
            phoneRef.current.position.y = Math.sin(time * 0.6) * 0.03;
        }
    });

    const isDark = theme === 'dark';
    const phoneColor = isDark ? '#0a0a0a' : '#1a1a1a';

    const bodyMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: phoneColor,
        metalness: 0.9,
        roughness: 0.15,
        envMapIntensity: 1.8,
    }), [phoneColor]);

    const frameMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: isDark ? '#2a2a2a' : '#e5e5e5',
        metalness: 0.95,
        roughness: 0.1,
        envMapIntensity: 2.0,
    }), [isDark]);

    const screenMaterial = useMemo(() => {
        if (screenTexture) {
            return new THREE.MeshBasicMaterial({
                map: screenTexture,
                toneMapped: false,
            });
        }
        return new THREE.MeshStandardMaterial({
            color: '#000000',
        });
    }, [screenTexture]);

    return (
        <group
            ref={phoneRef}
            position={[0, 0, 0]}
            rotation={[0.05, 0, 0]}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
        >
            {/* Phone Body - Main Frame */}
            <RoundedBox args={[1.42, 2.82, 0.12]} radius={0.14} smoothness={8} castShadow receiveShadow>
                <primitive object={frameMaterial} attach="material" />
            </RoundedBox>

            {/* Phone Body - Back Panel */}
            <RoundedBox args={[1.38, 2.78, 0.10]} radius={0.13} smoothness={8} castShadow receiveShadow>
                <primitive object={bodyMaterial} attach="material" />
            </RoundedBox>

            {/* Screen Bezel */}
            <mesh position={[0, 0, 0.06]}>
                <planeGeometry args={[1.30, 2.70]} />
                <meshStandardMaterial color="#000000" metalness={0.5} roughness={0.5} />
            </mesh>

            {/* Screen */}
            <mesh position={[0, 0, 0.065]}>
                <planeGeometry args={[1.26, 2.66]} />
                <primitive object={screenMaterial} attach="material" />
            </mesh>

            {/* Camera Module on Back */}
            <group position={[0.35, 0.8, -0.07]} rotation={[0, Math.PI, 0]}>
                {/* Camera bump */}
                <RoundedBox args={[0.5, 0.6, 0.04]} radius={0.08} smoothness={4}>
                    <meshStandardMaterial
                        color={isDark ? '#1a1a1a' : '#2a2a2a'}
                        metalness={0.8}
                        roughness={0.2}
                    />
                </RoundedBox>
                
                {/* Main camera lens */}
                <mesh position={[-0.12, 0.15, 0.025]}>
                    <circleGeometry args={[0.12, 32]} />
                    <meshStandardMaterial
                        color="#0a0a0a"
                        metalness={0.9}
                        roughness={0.1}
                    />
                </mesh>
                <mesh position={[-0.12, 0.15, 0.03]}>
                    <circleGeometry args={[0.08, 32]} />
                    <meshStandardMaterial
                        color="#1a1a2e"
                        metalness={0.95}
                        roughness={0.05}
                    />
                </mesh>
                
                {/* Secondary camera lens */}
                <mesh position={[-0.12, -0.15, 0.025]}>
                    <circleGeometry args={[0.10, 32]} />
                    <meshStandardMaterial
                        color="#0a0a0a"
                        metalness={0.9}
                        roughness={0.1}
                    />
                </mesh>
                
                {/* Third camera lens */}
                <mesh position={[0.12, 0, 0.025]}>
                    <circleGeometry args={[0.08, 32]} />
                    <meshStandardMaterial
                        color="#0a0a0a"
                        metalness={0.9}
                        roughness={0.1}
                    />
                </mesh>
            </group>

            {/* Logo on Back */}
            <mesh position={[-0.3, -0.5, -0.065]} rotation={[0, Math.PI, 0]}>
                <circleGeometry args={[0.12, 32]} />
                <meshStandardMaterial
                    color={isDark ? '#10b981' : '#059669'}
                    emissive={isDark ? '#10b981' : '#059669'}
                    emissiveIntensity={isDark ? 0.6 : 0.3}
                    metalness={0.9}
                    roughness={0.1}
                />
            </mesh>

        </group>
    );
}

const Smartphone3D = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <div className="smartphone-3d-container">
            <Canvas shadows dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
                <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={40} />

                <ambientLight intensity={0.8} />
                <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
                <directionalLight position={[-5, 3, 2]} intensity={0.6} />

                <Environment preset={isDark ? "city" : "studio"} />

                <SmartphoneModel theme={theme} />

                <ContactShadows
                    position={[0, -1.5, 0]}
                    opacity={0.3}
                    scale={4}
                    blur={2}
                    far={4}
                />

                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    minDistance={3}
                    maxDistance={8}
                    maxPolarAngle={Math.PI / 2}
                    autoRotate={false}
                    enableDamping
                    dampingFactor={0.1}
                />
            </Canvas>
        </div>
    );
};

export default Smartphone3D;
