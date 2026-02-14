import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useTheme } from 'next-themes';
import * as THREE from 'three';
import '../styles/LivingDataCore.css';

// Simple rotating cube for testing
function TestCube({ theme }) {
    const meshRef = useRef();
    const isDark = theme === 'dark';

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x += 0.01;
            meshRef.current.rotation.y += 0.01;
        }
    });

    return (
        <mesh ref={meshRef}>
            <boxGeometry args={[2, 2, 2]} />
            <meshStandardMaterial
                color={isDark ? '#00ffff' : '#10b981'}
                metalness={0.5}
                roughness={0.2}
            />
        </mesh>
    );
}

const LivingDataCoreSimple = () => {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        console.log('LivingDataCoreSimple mounted');
    }, []);

    if (!mounted) {
        console.log('LivingDataCoreSimple not mounted yet');
        return null;
    }

    console.log('LivingDataCoreSimple rendering with theme:', theme);

    return (
        <div className="living-data-core-container" style={{ position: 'relative' }}>
            {/* Debug text */}
            <div style={{
                position: 'absolute',
                top: '10px',
                left: '10px',
                color: '#10b981',
                fontSize: '14px',
                zIndex: 1000,
                background: 'rgba(0,0,0,0.5)',
                padding: '5px 10px',
                borderRadius: '4px'
            }}>
                3D Container Loaded ✓
            </div>

            <Canvas
                style={{ width: '100%', height: '100%' }}
                camera={{ position: [0, 0, 5], fov: 50 }}
            >
                <ambientLight intensity={0.5} />
                <directionalLight position={[5, 5, 5]} intensity={1} />
                <TestCube theme={theme} />
                <OrbitControls enableZoom={false} />
            </Canvas>

            <div className="interaction-hint">
                <span>Simple Test Cube - Rotate with mouse</span>
            </div>
        </div>
    );
};

export default LivingDataCoreSimple;
