import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, RoundedBox, ContactShadows } from '@react-three/drei';
import { useTheme } from 'next-themes';
import * as THREE from 'three';
import '../styles/Smartphone3D.css';

// Simple Smartphone Screen Texture Generator
function createSmartphoneScreenTexture(theme) {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 2048;
    const ctx = canvas.getContext('2d');
    const isDark = theme === 'dark';

    // Background - bright solid color
    ctx.fillStyle = isDark ? '#111111' : '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Header bar
    ctx.fillStyle = isDark ? '#00aaaa' : '#10b981';
    ctx.fillRect(0, 0, canvas.width, 100);

    // Logo text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px Arial, sans-serif';
    ctx.fillText('HIRE-LYTICS', 30, 65);

    // Hero title
    ctx.fillStyle = isDark ? '#ffffff' : '#000000';
    ctx.font = 'bold 48px Arial, sans-serif';
    ctx.fillText('AI-Powered', 40, 180);
    ctx.fillText('Resume Analysis', 40, 240);

    // Subtitle
    ctx.fillStyle = isDark ? '#00ff9d' : '#3b82f6';
    ctx.font = '24px Arial, sans-serif';
    ctx.fillText('Optimize your resume', 40, 300);
    ctx.fillText('with AI technology', 40, 335);

    // Stats cards
    const cardData = [
        { value: '92%', label: 'ATS Score', color: isDark ? '#00ffff' : '#10b981' },
        { value: 'Top 5%', label: 'Ranking', color: isDark ? '#00ff9d' : '#3b82f6' }
    ];

    cardData.forEach((card, i) => {
        const y = 400 + i * 200;
        
        ctx.fillStyle = isDark ? '#1a1a1a' : '#f0f0f0';
        ctx.fillRect(50, y, 924, 160);

        ctx.strokeStyle = card.color;
        ctx.lineWidth = 3;
        ctx.strokeRect(50, y, 924, 160);

        ctx.fillStyle = card.color;
        ctx.font = 'bold 64px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(card.value, 512, y + 80);

        ctx.fillStyle = isDark ? '#aaaaaa' : '#666666';
        ctx.font = '24px Arial, sans-serif';
        ctx.fillText(card.label, 512, y + 125);
        ctx.textAlign = 'left';
    });

    const analyticsY = 820;
    
    ctx.fillStyle = isDark ? '#00ffff' : '#10b981';
    ctx.font = 'bold 28px Arial, sans-serif';
    ctx.fillText('Performance Metrics', 50, analyticsY);

    const barData = [
        { label: 'Keywords', value: 0.92, color: isDark ? '#00ffff' : '#10b981' },
        { label: 'Format', value: 0.85, color: isDark ? '#00ff9d' : '#3b82f6' },
        { label: 'Content', value: 0.78, color: isDark ? '#ff6b6b' : '#ef4444' },
        { label: 'Overall', value: 0.92, color: isDark ? '#ffd700' : '#f59e0b' }
    ];

    barData.forEach((bar, i) => {
        const y = analyticsY + 40 + i * 80;
        
        ctx.fillStyle = isDark ? '#aaaaaa' : '#666666';
        ctx.font = '20px Arial, sans-serif';
        ctx.fillText(bar.label, 50, y);

        ctx.fillStyle = isDark ? '#ffffff' : '#000000';
        ctx.font = 'bold 20px Arial, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(`${Math.round(bar.value * 100)}%`, 974, y);
        ctx.textAlign = 'left';

        ctx.fillStyle = isDark ? '#333333' : '#dddddd';
        ctx.fillRect(50, y + 15, 924, 20);

        ctx.fillStyle = bar.color;
        ctx.fillRect(50, y + 15, 924 * bar.value, 20);
    });

    const btnY = 1280;
    ctx.fillStyle = isDark ? '#00aaaa' : '#10b981';
    ctx.fillRect(50, btnY, 924, 60);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Analyze My Resume', 512, btnY + 40);
    ctx.textAlign = 'left';

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
        metalness: 0.8,
        roughness: 0.2,
        envMapIntensity: 1.5,
    }), [phoneColor]);

    const screenMaterial = useMemo(() => {
        if (screenTexture) {
            return new THREE.MeshBasicMaterial({
                map: screenTexture,
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
            {/* Phone Body */}
            <RoundedBox args={[1.4, 2.8, 0.12]} radius={0.12} smoothness={4} castShadow receiveShadow>
                <primitive object={bodyMaterial} attach="material" />
            </RoundedBox>

            {/* Screen */}
            <mesh position={[0, 0, 0.065]}>
                <planeGeometry args={[1.28, 2.68]} />
                <primitive object={screenMaterial} attach="material" />
            </mesh>

            {/* Logo on Back */}
            <mesh position={[0, 0.5, -0.065]} rotation={[0, Math.PI, 0]}>
                <circleGeometry args={[0.15, 32]} />
                <meshStandardMaterial
                    color={isDark ? '#00aaaa' : '#10b981'}
                    emissive={isDark ? '#00aaaa' : '#10b981'}
                    emissiveIntensity={isDark ? 0.8 : 0.4}
                    metalness={0.9}
                    roughness={0.1}
                />
            </mesh>

            {/* Simple Camera on Back */}
            <mesh position={[0, -0.3, -0.065]} rotation={[0, Math.PI, 0]}>
                <circleGeometry args={[0.08, 32]} />
                <meshStandardMaterial
                    color="#1a1a1a"
                    metalness={0.9}
                    roughness={0.1}
                />
            </mesh>
            <mesh position={[0, -0.3, -0.07]} rotation={[0, Math.PI, 0]}>
                <circleGeometry args={[0.05, 32]} />
                <meshStandardMaterial
                    color="#000000"
                    emissive={isDark ? '#00aaaa' : '#3b82f6'}
                    emissiveIntensity={isDark ? 0.5 : 0.2}
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
