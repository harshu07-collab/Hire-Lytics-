import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';
import { useTheme } from 'next-themes';
import * as THREE from 'three';
import '../styles/Laptop3D.css';

// High-quality Laptop Screen Texture Generator
function createLaptopScreenTexture(theme) {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1536;
    const ctx = canvas.getContext('2d');
    const isDark = theme === 'dark';

    // Background gradient
    const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    if (isDark) {
        bgGradient.addColorStop(0, '#0a0a0f');
        bgGradient.addColorStop(0.5, '#000000');
        bgGradient.addColorStop(1, '#0a0a1a');
    } else {
        bgGradient.addColorStop(0, '#f8fafc');
        bgGradient.addColorStop(0.5, '#ffffff');
        bgGradient.addColorStop(1, '#f1f5f9');
    }
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Header with gradient
    const headerGradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    if (isDark) {
        headerGradient.addColorStop(0, '#00ffff');
        headerGradient.addColorStop(0.5, '#00ff9d');
        headerGradient.addColorStop(1, '#00ffff');
    } else {
        headerGradient.addColorStop(0, '#10b981');
        headerGradient.addColorStop(0.5, '#3b82f6');
        headerGradient.addColorStop(1, '#10b981');
    }
    ctx.fillStyle = headerGradient;
    ctx.fillRect(0, 0, canvas.width, 120);

    // Header shadow
    ctx.shadowColor = isDark ? 'rgba(0, 255, 255, 0.5)' : 'rgba(16, 185, 129, 0.3)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 5;

    // Logo text with glow
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 56px Inter, system-ui, sans-serif';
    ctx.textBaseline = 'middle';
    ctx.fillText('HIRE-LYTICS', 60, 60);

    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    // Navigation items
    ctx.font = '500 28px Inter, system-ui, sans-serif';
    const navItems = ['Home', 'Features', 'About', 'Contact'];
    navItems.forEach((item, i) => {
        ctx.fillText(item, 1400 + i * 160, 60);
    });

    // Hero section background glow
    const heroGlow = ctx.createRadialGradient(400, 400, 0, 400, 400, 600);
    if (isDark) {
        heroGlow.addColorStop(0, 'rgba(0, 255, 255, 0.15)');
        heroGlow.addColorStop(0.5, 'rgba(0, 255, 157, 0.08)');
        heroGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    } else {
        heroGlow.addColorStop(0, 'rgba(16, 185, 129, 0.1)');
        heroGlow.addColorStop(0.5, 'rgba(59, 130, 246, 0.05)');
        heroGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
    }
    ctx.fillStyle = heroGlow;
    ctx.fillRect(0, 120, canvas.width, 500);

    // Hero title
    ctx.fillStyle = isDark ? '#ffffff' : '#1f2937';
    ctx.font = 'bold 80px Inter, system-ui, sans-serif';
    ctx.fillText('AI-Powered Resume', 100, 280);
    ctx.fillText('Analysis Platform', 100, 380);

    // Subtitle
    ctx.fillStyle = isDark ? '#00ff9d' : '#3b82f6';
    ctx.font = '400 32px Inter, system-ui, sans-serif';
    ctx.fillText('Optimize your resume with advanced AI technology', 100, 460);
    ctx.fillText('and land your dream job faster', 100, 510);

    // Stats cards with enhanced styling
    const cardY = 620;
    const cardData = [
        { value: '92%', label: 'ATS Score', color: isDark ? '#00ffff' : '#10b981' },
        { value: 'Top 5%', label: 'Ranking', color: isDark ? '#00ff9d' : '#3b82f6' },
        { value: '12+', label: 'AI Tips', color: isDark ? '#ff00ff' : '#8b5cf6' }
    ];

    cardData.forEach((card, i) => {
        const x = 100 + i * 640;
        
        // Card shadow
        ctx.shadowColor = isDark ? 'rgba(0, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)';
        ctx.shadowBlur = 30;
        ctx.shadowOffsetY = 10;

        // Card background
        ctx.fillStyle = isDark ? 'rgba(26, 26, 26, 0.9)' : 'rgba(255, 255, 255, 0.95)';
        ctx.fillRect(x, cardY, 560, 280);

        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;

        // Card border
        ctx.strokeStyle = card.color;
        ctx.lineWidth = 3;
        ctx.strokeRect(x, cardY, 560, 280);

        // Value
        ctx.fillStyle = card.color;
        ctx.font = 'bold 96px Inter, system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(card.value, x + 280, cardY + 130);

        // Label
        ctx.fillStyle = isDark ? '#a1a1aa' : '#6b7280';
        ctx.font = '500 32px Inter, system-ui, sans-serif';
        ctx.fillText(card.label, x + 280, cardY + 200);
        ctx.textAlign = 'left';
    });

    // Analytics chart section
    const chartY = 1000;
    
    // Chart background
    ctx.fillStyle = isDark ? 'rgba(26, 26, 26, 0.6)' : 'rgba(241, 245, 249, 0.8)';
    ctx.fillRect(100, chartY, 1846, 400);

    // Chart title
    ctx.fillStyle = isDark ? '#00ffff' : '#10b981';
    ctx.font = 'bold 36px Inter, system-ui, sans-serif';
    ctx.fillText('Resume Performance Analytics', 140, chartY + 60);

    // Chart bars with gradient
    const barData = [
        { height: 280, label: 'Keywords', color: isDark ? '#00ffff' : '#10b981' },
        { height: 220, label: 'Format', color: isDark ? '#00ff9d' : '#3b82f6' },
        { height: 180, label: 'Content', color: isDark ? '#ff00ff' : '#8b5cf6' },
        { height: 320, label: 'Overall', color: isDark ? '#ffff00' : '#f59e0b' },
        { height: 240, label: 'Impact', color: isDark ? '#00ffff' : '#10b981' }
    ];

    barData.forEach((bar, i) => {
        const barX = 200 + i * 350;
        const barWidth = 200;
        const barY = chartY + 350 - bar.height;

        // Bar gradient
        const barGradient = ctx.createLinearGradient(0, barY, 0, chartY + 350);
        barGradient.addColorStop(0, bar.color);
        barGradient.addColorStop(1, isDark ? 'rgba(0, 255, 255, 0.3)' : 'rgba(16, 185, 129, 0.3)');
        
        ctx.fillStyle = barGradient;
        ctx.fillRect(barX, barY, barWidth, bar.height);

        // Bar label
        ctx.fillStyle = isDark ? '#a1a1aa' : '#6b7280';
        ctx.font = '500 24px Inter, system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(bar.label, barX + barWidth / 2, chartY + 380);
        ctx.textAlign = 'left';
    });

    // Footer info
    ctx.fillStyle = isDark ? 'rgba(0, 255, 255, 0.6)' : 'rgba(16, 185, 129, 0.8)';
    ctx.font = '500 24px Inter, system-ui, sans-serif';
    ctx.fillText('Real-time AI analysis  Upload your resume  Get instant feedback', 100, 1480);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    texture.anisotropy = 16;
    return texture;
}

// Real 3D Laptop Model Component
function LaptopModel({ theme }) {
    const laptopRef = useRef();
    const screenRef = useRef();
    const [hovered, setHovered] = useState(false);
    const [screenTexture, setScreenTexture] = useState(null);

    // Generate high-quality screen texture
    useEffect(() => {
        const texture = createLaptopScreenTexture(theme);
        setScreenTexture(texture);
    }, [theme]);

    // Smooth floating animation
    useFrame((state) => {
        if (laptopRef.current && !hovered) {
            const time = state.clock.elapsedTime;
            laptopRef.current.rotation.y = Math.sin(time * 0.25) * 0.15;
            laptopRef.current.position.y = Math.sin(time * 0.5) * 0.05;
        }
    });

    // Colors based on theme
    const isDark = theme === 'dark';
    const laptopColor = isDark ? '#0d0d0d' : '#e8e8e8';
    const screenColor = isDark ? '#000000' : '#1a1a1a';
    const keyboardColor = isDark ? '#080808' : '#d4d4d4';
    const accentColor = isDark ? '#00ffff' : '#10b981';
    const secondaryAccent = isDark ? '#00ff9d' : '#3b82f6';

    // Materials with enhanced properties
    const bodyMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: laptopColor,
        metalness: 0.9,
        roughness: 0.12,
        envMapIntensity: 2.5,
    }), [laptopColor]);

    const screenMaterial = useMemo(() => {
        if (screenTexture) {
            return new THREE.MeshStandardMaterial({
                map: screenTexture,
                emissive: isDark ? accentColor : '#10b981',
                emissiveIntensity: isDark ? 0.12 : 0.06,
                metalness: 0.05,
                roughness: 0.15,
            });
        }
        return new THREE.MeshStandardMaterial({
            color: screenColor,
            emissive: isDark ? accentColor : '#000000',
            emissiveIntensity: isDark ? 0.15 : 0,
        });
    }, [screenTexture, screenColor, isDark, accentColor]);

    return (
        <group
            ref={laptopRef}
            position={[0, 0, 0]}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
        >
            {/* Laptop Base */}
            <group position={[0, -0.05, 0]}>
                {/* Base Bottom - Main chassis */}
                <mesh position={[0, -0.05, 0]} castShadow receiveShadow>
                    <boxGeometry args={[3.6, 0.12, 2.6]} />
                    <primitive object={bodyMaterial} attach="material" />
                </mesh>

                {/* Base top surface */}
                <mesh position={[0, 0.01, 0]} castShadow receiveShadow>
                    <boxGeometry args={[3.6, 0.02, 2.6]} />
                    <meshStandardMaterial
                        color={isDark ? '#141414' : '#f0f0f0'}
                        metalness={0.85}
                        roughness={0.1}
                        envMapIntensity={2}
                    />
                </mesh>

                {/* Keyboard Area recessed */}
                <mesh position={[0, 0.02, -0.15]} castShadow receiveShadow>
                    <boxGeometry args={[3.3, 0.015, 2.1]} />
                    <meshStandardMaterial
                        color={keyboardColor}
                        metalness={0.3}
                        roughness={0.6}
                    />
                </mesh>

                {/* Individual Keys - 78 keys realistic layout */}
                {Array.from({ length: 78 }).map((_, i) => {
                    const row = Math.floor(i / 14);
                    const col = i % 14;
                    // Skip some positions for realistic layout
                    if (row === 0 && col > 13) return null;
                    if (row === 4 && col > 12) return null;
                    
                    const x = (col - 6.5) * 0.22;
                    const z = (row - 1.8) * 0.22 - 0.15;

                    return (
                        <mesh key={i} position={[x, 0.035, z]} castShadow>
                            <boxGeometry args={[0.18, 0.025, 0.18]} />
                            <meshStandardMaterial
                                color={isDark ? '#1f1f1f' : '#e5e5e5'}
                                metalness={0.5}
                                roughness={0.35}
                                emissive={isDark ? accentColor : '#000000'}
                                emissiveIntensity={isDark ? 0.06 : 0}
                            />
                        </mesh>
                    );
                })}

                {/* Spacebar */}
                <mesh position={[0, 0.035, 0.75]} castShadow>
                    <boxGeometry args={[1.4, 0.025, 0.18]} />
                    <meshStandardMaterial
                        color={isDark ? '#1f1f1f' : '#e5e5e5'}
                        metalness={0.5}
                        roughness={0.35}
                        emissive={isDark ? accentColor : '#000000'}
                        emissiveIntensity={isDark ? 0.06 : 0}
                    />
                </mesh>

                {/* Trackpad with glass effect */}
                <mesh position={[0, 0.03, 0.85]} castShadow receiveShadow>
                    <boxGeometry args={[1.3, 0.01, 0.9]} />
                    <meshPhysicalMaterial
                        color={isDark ? '#0a0a0a' : '#f5f5f5'}
                        metalness={0.1}
                        roughness={0.05}
                        transmission={0.1}
                        thickness={0.1}
                        clearcoat={1}
                        clearcoatRoughness={0.05}
                    />
                </mesh>

                {/* Trackpad Border Glow (Dark Mode) */}
                {isDark && (
                    <mesh position={[0, 0.036, 0.85]}>
                        <boxGeometry args={[1.35, 0.003, 0.95]} />
                        <meshStandardMaterial
                            color={accentColor}
                            emissive={accentColor}
                            emissiveIntensity={0.5}
                            transparent
                            opacity={0.6}
                        />
                    </mesh>
                )}

                {/* Speaker grilles */}
                {[-1.4, 1.4].map((x, i) => (
                    <group key={i} position={[x, 0.025, 0.85]}>
                        {Array.from({ length: 12 }).map((_, j) => (
                            <mesh key={j} position={[(j % 3) * 0.04, 0, Math.floor(j / 3) * 0.06]}>
                                <cylinderGeometry args={[0.008, 0.008, 0.01, 8]} />
                                <meshStandardMaterial color={isDark ? '#1a1a1a' : '#c0c0c0'} />
                            </mesh>
                        ))}
                    </group>
                ))}
            </group>

            {/* Laptop Screen/Lid */}
            <group position={[0, 1.25, -1.2]} rotation={[-0.25, 0, 0]}>
                {/* Screen Frame - Outer shell */}
                <mesh castShadow receiveShadow>
                    <boxGeometry args={[3.6, 2.3, 0.12]} />
                    <primitive object={bodyMaterial} attach="material" />
                </mesh>

                {/* Screen bezel */}
                <mesh position={[0, 0, 0.055]}>
                    <planeGeometry args={[3.4, 2.1]} />
                    <meshStandardMaterial
                        color={screenColor}
                        metalness={0.1}
                        roughness={0.3}
                    />
                </mesh>

                {/* Screen Display with Website Screenshot */}
                <mesh ref={screenRef} position={[0, 0, 0.065]} castShadow>
                    <planeGeometry args={[3.2, 2.0]} />
                    <primitive object={screenMaterial} attach="material" />
                </mesh>

                {/* Screen edge glow (Dark Mode) */}
                {isDark && (
                    <mesh position={[0, 0, 0.068]}>
                        <planeGeometry args={[3.22, 2.02]} />
                        <meshStandardMaterial
                            color={accentColor}
                            emissive={accentColor}
                            emissiveIntensity={0.3}
                            transparent
                            opacity={0.15}
                        />
                    </mesh>
                )}

                {/* Webcam housing */}
                <mesh position={[0, 1.05, 0.065]}>
                    <cylinderGeometry args={[0.05, 0.05, 0.015, 32]} />
                    <meshStandardMaterial
                        color={isDark ? '#1a1a1a' : '#2a2a2a'}
                        metalness={0.8}
                        roughness={0.2}
                    />
                </mesh>

                {/* Webcam lens with glow */}
                <mesh position={[0, 1.05, 0.075]} rotation={[Math.PI / 2, 0, 0]}>
                    <circleGeometry args={[0.025, 32]} />
                    <meshStandardMaterial
                        color="#000000"
                        emissive={isDark ? accentColor : '#3b82f6'}
                        emissiveIntensity={isDark ? 0.8 : 0.3}
                        metalness={1}
                        roughness={0}
                    />
                </mesh>

                {/* Logo on Back with glow effect */}
                <mesh position={[0, 0, -0.065]} rotation={[0, Math.PI, 0]} castShadow>
                    <circleGeometry args={[0.25, 64]} />
                    <meshStandardMaterial
                        color={isDark ? accentColor : '#10b981'}
                        emissive={isDark ? accentColor : '#10b981'}
                        emissiveIntensity={isDark ? 1.0 : 0.4}
                        metalness={0.95}
                        roughness={0.05}
                    />
                </mesh>

                {/* Logo ring */}
                <mesh position={[0, 0, -0.063]} rotation={[0, Math.PI, 0]}>
                    <ringGeometry args={[0.27, 0.29, 64]} />
                    <meshStandardMaterial
                        color={isDark ? secondaryAccent : '#10b981'}
                        emissive={isDark ? secondaryAccent : '#10b981'}
                        emissiveIntensity={isDark ? 0.6 : 0.2}
                        transparent
                        opacity={0.8}
                    />
                </mesh>
            </group>

            {/* Hinge - Enhanced */}
            <mesh position={[0, 0.06, -1.25]} rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[0.06, 0.06, 3.6, 32]} />
                <primitive object={bodyMaterial} attach="material" />
            </mesh>

            {/* Hinge caps */}
            {[-1.8, 1.8].map((x, i) => (
                <mesh key={i} position={[x, 0.06, -1.25]} rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[0.07, 0.07, 0.1, 32]} />
                    <meshStandardMaterial
                        color={isDark ? '#1a1a1a' : '#d0d0d0'}
                        metalness={0.9}
                        roughness={0.1}
                    />
                </mesh>
            ))}

            {/* Ambient Glow Lights (Dark Mode Only) */}
            {isDark && (
                <>
                    <pointLight position={[0, 1.5, 0]} intensity={0.8} color={accentColor} distance={4} decay={2} />
                    <pointLight position={[0, 0.5, 1]} intensity={0.5} color={secondaryAccent} distance={3} decay={2} />
                    <pointLight position={[-2, 1, -1]} intensity={0.3} color="#ff00ff" distance={3} decay={2} />
                </>
            )}
        </group>
    );
}

const Laptop3D = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <div className="laptop-3d-container">
            <Canvas shadows dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
                <PerspectiveCamera makeDefault position={[0, 1.5, 6.5]} fov={40} />

                {/* Enhanced Lighting Setup */}
                <ambientLight intensity={isDark ? 0.3 : 0.6} />
                
                {/* Main directional light */}
                <directionalLight
                    position={[5, 8, 5]}
                    intensity={isDark ? 1.0 : 1.5}
                    castShadow
                    shadow-mapSize={[2048, 2048]}
                    shadow-bias={-0.0001}
                />
                
                {/* Fill light */}
                <directionalLight
                    position={[-5, 4, 3]}
                    intensity={isDark ? 0.5 : 0.8}
                />
                
                {/* Rim light for edge definition */}
                <spotLight
                    position={[0, 5, -5]}
                    intensity={isDark ? 0.8 : 0.4}
                    angle={0.5}
                    penumbra={0.5}
                    color={isDark ? '#00ffff' : '#ffffff'}
                />

                {/* Environment for realistic reflections */}
                <Environment preset={isDark ? "city" : "studio"} />

                {/* 3D Laptop Model */}
                <LaptopModel theme={theme} />

                {/* Contact shadows for grounding */}
                <ContactShadows
                    position={[0, -0.5, 0]}
                    opacity={isDark ? 0.4 : 0.2}
                    scale={8}
                    blur={2.5}
                    far={4}
                />

                {/* Interactive Controls */}
                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    minDistance={4}
                    maxDistance={12}
                    maxPolarAngle={Math.PI / 2.2}
                    autoRotate={false}
                    autoRotateSpeed={0.5}
                    enableDamping
                    dampingFactor={0.1}
                />
            </Canvas>
        </div>
    );
};

export default Laptop3D;
