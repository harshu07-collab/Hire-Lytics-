import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, PerspectiveCamera, MeshTransmissionMaterial, OrbitControls } from '@react-three/drei';
import { useTheme } from 'next-themes';
import * as THREE from 'three';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import '../styles/LivingDataCore.css';

// Enhanced Vertex Shader with better deformation
const vertexShader = `
uniform vec3 uMousePosition;
uniform float uMouseInfluence;
uniform float uTime;
uniform float uMouseVelocity;
uniform bool uMouseActive;

varying vec3 vNormal;
varying vec3 vPosition;
varying float vDisplacement;
varying vec2 vUv;

float smoothFalloff(float distance, float radius) {
    float normalized = clamp(distance / radius, 0.0, 1.0);
    return 1.0 - normalized * normalized * (3.0 - 2.0 * normalized);
}

void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    vUv = uv;

    vec3 newPosition = position;
    float displacement = 0.0;

    if (uMouseActive) {
        float dist = distance(position, uMousePosition);
        float influenceRadius = 3.0;

        if (dist < influenceRadius) {
            float influence = smoothFalloff(dist, influenceRadius);
            vec3 direction = normalize(position - uMousePosition);
            float baseDisplacement = influence * uMouseInfluence;
            float velocityBoost = uMouseVelocity * 0.5;
            displacement = baseDisplacement * (1.0 + velocityBoost);
            newPosition += direction * displacement * 0.8;

            // Add wave effect
            vec3 perpendicular = cross(direction, vec3(0.0, 1.0, 0.0));
            float wave = sin(dist * 4.0 - uTime * 3.0) * displacement * 0.2;
            newPosition += perpendicular * wave;
        }
    }

    // Enhanced breathing animation
    float breathe = sin(uTime * 0.6 + position.y * 1.5) * 0.03;
    breathe += sin(uTime * 0.4 + position.x * 1.2) * 0.02;
    newPosition += normal * breathe;

    vDisplacement = displacement;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
`;

// Enhanced Fragment Shader with dynamic neon-purple interaction
const fragmentShader = `
uniform vec3 uColorPrimary;
uniform vec3 uColorSecondary;
uniform vec3 uColorAccent;
uniform float uTime;
uniform bool uIsDark;
uniform float uGlowIntensity;

varying vec3 vNormal;
varying vec3 vPosition;
varying float vDisplacement;
varying vec2 vUv;

void main() {
    vec3 viewDirection = normalize(cameraPosition - vPosition);
    float fresnel = pow(1.0 - max(dot(viewDirection, vNormal), 0.0), 2.5);

    // Multi-layer gradient for depth
    float gradientY = (vPosition.y + 1.5) * 0.5;
    float gradientX = (vPosition.x + 1.5) * 0.4;
    float gradientZ = (vPosition.z + 1.5) * 0.3;

    // Base color with smooth gradient mixing
    vec3 baseColor = mix(uColorPrimary, uColorSecondary, gradientY);
    baseColor = mix(baseColor, uColorAccent, gradientX * 0.4);

    // Add depth with Z gradient
    if (uIsDark) {
        // Dark mode: Purple base with depth
        vec3 depthColor = mix(vec3(0.4, 0.1, 0.5), vec3(0.6, 0.15, 0.7), gradientZ);
        baseColor = mix(baseColor, depthColor, 0.4);
    } else {
        // Light mode: Neon green interior with gradient
        vec3 depthColor = mix(vec3(0.0, 1.0, 0.4), vec3(0.2, 1.0, 0.6), gradientZ);
        baseColor = mix(baseColor, depthColor, 0.5);
    }

    // Brightness adjustment
    baseColor *= uIsDark ? 0.9 : 1.1;

    // DYNAMIC CURSOR INTERACTION - Purple → Neon Green on hover
    if (uIsDark) {
        // Dark mode: Purple turns NEON GREEN when cursor interacts
        vec3 neonGreen = vec3(0.0, 2.0, 0.5);
        baseColor = mix(baseColor, neonGreen, vDisplacement * 1.0);
    } else {
        // Light mode: Brighter neon green on interaction
        vec3 brightNeonGreen = vec3(0.2, 2.2, 0.8);
        baseColor = mix(baseColor, brightNeonGreen, vDisplacement * 0.8);
    }

    // Fresnel rim lighting with neon colors
    vec3 rimColor = uIsDark ? vec3(0.0, 1.5, 0.6) : vec3(0.0, 1.3, 0.5);
    vec3 finalColor = mix(baseColor, rimColor, fresnel * 0.6);

    // Animated pulse
    float pulse1 = sin(uTime * 1.2) * 0.5 + 0.5;
    float pulse2 = sin(uTime * 1.8) * 0.3 + 0.7;
    float glow = fresnel * uGlowIntensity * (0.7 + pulse1 * 0.3);

    // Add glow with neon accent
    finalColor += rimColor * glow * pulse2 * 0.9;

    // Enhanced scanline effect for detail
    float scanline = sin(vPosition.y * 20.0 + uTime * 2.0) * 0.04;
    scanline += sin(vPosition.x * 15.0 - uTime * 1.5) * 0.02;
    finalColor += vec3(scanline);

    // Ensure visible colors
    if (uIsDark) {
        finalColor = max(finalColor, vec3(0.2, 0.1, 0.25));
    } else {
        finalColor = max(finalColor, vec3(0.3, 0.7, 0.5));
    }

    // Tone mapping for vibrant look
    finalColor = finalColor / (finalColor + vec3(0.7));
    finalColor = pow(finalColor, vec3(1.0 / 2.2));

    // Full opacity
    float alpha = 1.0;

    gl_FragColor = vec4(finalColor, alpha);
}
`;

// Particle System - Enhanced with neon colors
function ParticleField({ theme }) {
    const particlesRef = useRef();
    const isDark = theme === 'dark';

    // Optimized particle count
    const particleCount = 60;
    const positions = useMemo(() => {
        const pos = new Float32Array(particleCount * 3);
        for (let i = 0; i < particleCount; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 10;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
        }
        return pos;
    }, []);

    useFrame((state) => {
        if (particlesRef.current) {
            particlesRef.current.rotation.y = state.clock.elapsedTime * 0.03;
        }
    });

    return (
        <points ref={particlesRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={particleCount}
                    array={positions}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.06}
                color={isDark ? '#a855f7' : '#00ff41'}
                transparent
                opacity={0.6}
                sizeAttenuation
            />
        </points>
    );
}

// Core 3D Model with Real-time Deformation
function DataCoreModel({ theme }) {
    const meshRef = useRef();
    const materialRef = useRef();
    const wireframeRef = useRef();
    const { viewport, camera, raycaster, pointer } = useThree();

    useEffect(() => {
        console.log('DataCoreModel mounted with theme:', theme);
    }, [theme]);

    // Mouse tracking state
    const mousePosition = useRef(new THREE.Vector3(0, 0, 5));
    const targetMousePosition = useRef(new THREE.Vector3(0, 0, 5));
    const mouseVelocity = useRef(0);
    const lastMousePosition = useRef(new THREE.Vector2(0, 0));
    const isMouseActive = useRef(false);
    const mouseTimeout = useRef(null);

    const isDark = theme === 'dark';

    // Create custom shader material with purple-neon dynamic colors
    const shaderMaterial = useMemo(() => {
        return new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                uMousePosition: { value: new THREE.Vector3(0, 0, 5) },
                uMouseInfluence: { value: 0.6 },
                uTime: { value: 0 },
                uMouseVelocity: { value: 0 },
                uMouseActive: { value: false },
                // Dark mode: Purple base, Light mode: Neon Green
                uColorPrimary: { value: new THREE.Color(isDark ? '#7c3aed' : '#00ff41') },
                uColorSecondary: { value: new THREE.Color(isDark ? '#a855f7' : '#10ff58') },
                uColorAccent: { value: new THREE.Color(isDark ? '#6b21a8' : '#00e63b') },
                uIsDark: { value: isDark },
                uGlowIntensity: { value: isDark ? 0.7 : 0.6 },
            },
            transparent: false,
            side: THREE.FrontSide,
            depthWrite: true,
        });
    }, [isDark]);

    // Update colors when theme changes
    useEffect(() => {
        if (materialRef.current) {
            materialRef.current.uniforms.uColorPrimary.value.set(isDark ? '#7c3aed' : '#00ff41');
            materialRef.current.uniforms.uColorSecondary.value.set(isDark ? '#a855f7' : '#10ff58');
            materialRef.current.uniforms.uColorAccent.value.set(isDark ? '#6b21a8' : '#00e63b');
            materialRef.current.uniforms.uIsDark.value = isDark;
            materialRef.current.uniforms.uGlowIntensity.value = isDark ? 0.7 : 0.6;
        }
    }, [isDark]);

    // Mouse move handler with raycasting
    useEffect(() => {
        const handleMouseMove = (event) => {
            // Update pointer for raycasting
            const rect = event.target.getBoundingClientRect();
            const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            // Calculate velocity
            const currentPos = new THREE.Vector2(x, y);
            const velocity = currentPos.distanceTo(lastMousePosition.current);
            mouseVelocity.current = THREE.MathUtils.lerp(mouseVelocity.current, velocity * 10, 0.1);
            lastMousePosition.current.copy(currentPos);

            // Raycast to get 3D position
            raycaster.setFromCamera(new THREE.Vector2(x, y), camera);

            // Create invisible plane at mesh position for raycasting
            const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
            const intersectPoint = new THREE.Vector3();
            raycaster.ray.intersectPlane(plane, intersectPoint);

            if (intersectPoint) {
                targetMousePosition.current.copy(intersectPoint);
                isMouseActive.current = true;

                // Reset timeout
                clearTimeout(mouseTimeout.current);
                mouseTimeout.current = setTimeout(() => {
                    isMouseActive.current = false;
                }, 150);
            }
        };

        const canvas = document.querySelector('.living-data-core-container canvas');
        if (canvas) {
            canvas.addEventListener('mousemove', handleMouseMove);
            return () => {
                canvas.removeEventListener('mousemove', handleMouseMove);
                clearTimeout(mouseTimeout.current);
            };
        }
    }, [camera, raycaster]);

    // Animation loop - OPTIMIZED for smooth 60fps
    useFrame((state, delta) => {
        if (!meshRef.current || !materialRef.current) return;

        const time = state.clock.elapsedTime;

        // Smooth mouse position interpolation - OPTIMIZED
        mousePosition.current.lerp(targetMousePosition.current, 0.1);

        // Decay velocity - SMOOTHER
        mouseVelocity.current *= 0.95;

        // Update shader uniforms - BATCH UPDATE
        const uniforms = materialRef.current.uniforms;
        uniforms.uTime.value = time;
        uniforms.uMousePosition.value.copy(mousePosition.current);
        uniforms.uMouseVelocity.value = mouseVelocity.current;
        uniforms.uMouseActive.value = isMouseActive.current;

        // SMOOTHER rotation with delta time
        meshRef.current.rotation.y += delta * 0.15;
        meshRef.current.rotation.x = Math.cos(time * 0.15) * 0.08;
        meshRef.current.rotation.z = Math.sin(time * 0.1) * 0.05;

        // Gentle floating - SMOOTHER
        meshRef.current.position.y = Math.sin(time * 0.4) * 0.08;
        meshRef.current.position.x = Math.cos(time * 0.25) * 0.04;

        // Update wireframe - OPTIMIZED
        if (wireframeRef.current) {
            wireframeRef.current.rotation.copy(meshRef.current.rotation);
            wireframeRef.current.position.copy(meshRef.current.position);
        }
    });

    // Create enhanced geometry - HIGHER DETAIL for better quality
    const geometry = useMemo(() => {
        // Increased segments for enhanced detail
        const geo = new THREE.TorusKnotGeometry(1.0, 0.35, 120, 28, 2, 3);
        geo.computeVertexNormals();
        return geo;
    }, []);

    // Wireframe geometry - Enhanced detail
    const wireframeGeometry = useMemo(() => {
        const geo = new THREE.TorusKnotGeometry(1.05, 0.36, 60, 14, 2, 3);
        return geo;
    }, []);

    useEffect(() => {
        if (meshRef.current && materialRef.current) {
            console.log('DataCore mesh and material ready');
        }
    }, []);

    return (
        <group>
            {/* Main mesh with shader material */}
            <mesh ref={meshRef} geometry={geometry}>
                <primitive ref={materialRef} object={shaderMaterial} attach="material" />
            </mesh>

            {/* Wireframe overlay - Enhanced visibility */}
            <mesh ref={wireframeRef} geometry={wireframeGeometry}>
                <meshBasicMaterial
                    color={isDark ? '#a855f7' : '#00ff41'}
                    wireframe
                    transparent
                    opacity={0.25}
                />
            </mesh>

            {/* Enhanced lighting - Neon colors */}
            {isDark ? (
                <>
                    <pointLight position={[3, 3, 3]} intensity={0.9} color="#a855f7" distance={10} decay={2} />
                    <pointLight position={[-3, -3, 3]} intensity={0.7} color="#00ff41" distance={10} decay={2} />
                    <pointLight position={[0, 3, -3]} intensity={0.6} color="#7c3aed" distance={8} decay={2} />
                </>
            ) : (
                <>
                    <pointLight position={[3, 3, 3]} intensity={0.9} color="#00ff41" distance={10} decay={2} />
                    <pointLight position={[-3, -3, 3]} intensity={0.7} color="#10ff58" distance={10} decay={2} />
                </>
            )}
        </group>
    );
}

// Main Component
const LivingDataCore = () => {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [error, setError] = useState(null);
    const isDark = theme === 'dark';

    useEffect(() => {
        setMounted(true);

        // Check WebGL support
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (!gl) {
                setError('WebGL not supported');
            }
        } catch (e) {
            setError('WebGL initialization failed');
        }
    }, []);

    if (!mounted) return null;

    if (error) {
        return (
            <div className="living-data-core-container" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '400px',
                color: isDark ? '#94a3b8' : '#6b7280'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <p>3D visualization requires WebGL support</p>
                    <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                        Please enable hardware acceleration in your browser
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="living-data-core-container">
            <Canvas
                shadows
                dpr={[1, 1.5]}
                gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: 'high-performance',
                    stencil: false,
                    depth: true,
                    preserveDrawingBuffer: false,
                }}
                performance={{ min: 0.5 }}
                frameloop="always"
                onCreated={(state) => {
                    console.log('Living Data Core Canvas created successfully');
                    state.gl.setClearColor(new THREE.Color('#000000'), 0);
                    state.gl.toneMappingExposure = 1.2;
                }}
                onError={(error) => {
                    console.error('Living Data Core Canvas error:', error);
                }}
            >
                <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />

                {/* Enhanced Lighting Setup - Neon colors */}
                <ambientLight intensity={isDark ? 0.5 : 0.7} />
                <directionalLight
                    position={[5, 5, 5]}
                    intensity={isDark ? 0.9 : 1.1}
                    castShadow
                />
                <directionalLight
                    position={[-5, -5, -5]}
                    intensity={isDark ? 0.6 : 0.8}
                />
                <spotLight
                    position={[0, 5, 0]}
                    intensity={isDark ? 0.7 : 0.8}
                    angle={0.6}
                    penumbra={1}
                    color={isDark ? '#a855f7' : '#00ff41'}
                />

                {/* HDR Environment */}
                <Environment preset={isDark ? 'night' : 'sunset'} />

                {/* Particle Field for ambient effect */}
                <ParticleField theme={theme} />

                {/* The Living Data Core */}
                <DataCoreModel theme={theme} />

                {/* Orbit Controls - SMOOTHER */}
                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    autoRotate
                    autoRotateSpeed={0.3}
                    maxPolarAngle={Math.PI / 1.5}
                    minPolarAngle={Math.PI / 3}
                    enableDamping
                    dampingFactor={0.05}
                />

                {/* Post-processing - Enhanced neon glow */}
                {typeof window !== 'undefined' && (
                    <EffectComposer>
                        <Bloom
                            intensity={isDark ? 0.9 : 0.8}
                            luminanceThreshold={0.4}
                            luminanceSmoothing={0.9}
                            radius={0.7}
                        />
                    </EffectComposer>
                )}
            </Canvas>

            {/* Instructional hint */}
            <div className="interaction-hint">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 2L2 6L10 10L18 6L10 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                    <path d="M2 14L10 18L18 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 10L10 14L18 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Drag to rotate • Move cursor to deform</span>
            </div>
        </div>
    );
};

export default LivingDataCore;
