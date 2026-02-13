import React, { useEffect, useRef } from 'react';
import '../styles/AnimatedGradientBackground.css';

const AnimatedGradientBackground = () => {
    const canvasRef = useRef(null);
    const animationFrameRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;

        // Set canvas size
        const setCanvasSize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };
        setCanvasSize();

        // Gradient positions and offsets
        let offset1 = 0;
        let offset2 = 0;
        let offset3 = 0;
        let offset4 = 0;

        // Animation loop
        const animate = () => {
            offset1 += 0.0008;
            offset2 += 0.0012;
            offset3 += 0.001;
            offset4 += 0.0015;

            // Calculate gradient positions
            const x1 = width * 0.2 + Math.cos(offset1) * width * 0.3;
            const y1 = height * 0.3 + Math.sin(offset1) * height * 0.3;

            const x2 = width * 0.8 + Math.cos(offset2 + Math.PI) * width * 0.3;
            const y2 = height * 0.7 + Math.sin(offset2 + Math.PI) * height * 0.3;

            const x3 = width * 0.5 + Math.cos(offset3 + Math.PI / 2) * width * 0.4;
            const y3 = height * 0.5 + Math.sin(offset3 + Math.PI / 2) * height * 0.4;

            const x4 = width * 0.6 + Math.cos(offset4 + Math.PI * 1.5) * width * 0.25;
            const y4 = height * 0.4 + Math.sin(offset4 + Math.PI * 1.5) * height * 0.35;

            // Create radial gradients with much higher opacity
            const gradient1 = ctx.createRadialGradient(x1, y1, 0, x1, y1, width * 0.6);
            gradient1.addColorStop(0, 'rgba(168, 162, 255, 0.8)'); // Light purple - much more visible
            gradient1.addColorStop(0.5, 'rgba(168, 162, 255, 0.4)');
            gradient1.addColorStop(1, 'rgba(168, 162, 255, 0)');

            const gradient2 = ctx.createRadialGradient(x2, y2, 0, x2, y2, width * 0.65);
            gradient2.addColorStop(0, 'rgba(255, 182, 193, 0.7)'); // Light pink - much more visible
            gradient2.addColorStop(0.5, 'rgba(255, 182, 193, 0.35)');
            gradient2.addColorStop(1, 'rgba(255, 182, 193, 0)');

            const gradient3 = ctx.createRadialGradient(x3, y3, 0, x3, y3, width * 0.7);
            gradient3.addColorStop(0, 'rgba(179, 229, 252, 0.6)'); // Light blue - much more visible
            gradient3.addColorStop(0.5, 'rgba(179, 229, 252, 0.3)');
            gradient3.addColorStop(1, 'rgba(179, 229, 252, 0)');

            const gradient4 = ctx.createRadialGradient(x4, y4, 0, x4, y4, width * 0.55);
            gradient4.addColorStop(0, 'rgba(196, 181, 253, 0.75)'); // Light lavender - much more visible
            gradient4.addColorStop(0.5, 'rgba(196, 181, 253, 0.4)');
            gradient4.addColorStop(1, 'rgba(196, 181, 253, 0)');

            // Clear canvas with white base
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, width, height);

            // Apply gradients - no blend mode for more visible colors
            ctx.fillStyle = gradient1;
            ctx.fillRect(0, 0, width, height);

            ctx.fillStyle = gradient2;
            ctx.fillRect(0, 0, width, height);

            ctx.fillStyle = gradient3;
            ctx.fillRect(0, 0, width, height);

            ctx.fillStyle = gradient4;
            ctx.fillRect(0, 0, width, height);

            animationFrameRef.current = requestAnimationFrame(animate);
        };

        animate();

        // Handle resize
        const handleResize = () => {
            setCanvasSize();
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, []);

    return (
        <div className="animated-gradient-background">
            <canvas ref={canvasRef} className="gradient-canvas" />
            <div className="gradient-overlay"></div>
        </div>
    );
};

export default AnimatedGradientBackground;
