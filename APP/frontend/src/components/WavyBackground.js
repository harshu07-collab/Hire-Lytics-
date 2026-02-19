import React, { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';

const WavyBackground = () => {
    const canvasRef = useRef(null);
    const { theme } = useTheme();

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        // Configuration
        const lineCount = 3;
        const lines = [];
        
        // Resize canvas
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resize);
        resize();

        // Line properties
        class WavyLine {
            constructor(index) {
                this.index = index;
                this.reset();
                // Stagger start times
                this.progress = -index * 0.4; 
            }

            reset() {
                this.x = -100;
                this.y = -100;
                this.progress = 0;
                this.speed = 0.002 + Math.random() * 0.001;
                this.points = [];
                this.seed = Math.random() * 1000;
                this.amplitude = 30 + Math.random() * 40;
                this.frequency = 0.005 + Math.random() * 0.005;
            }

            update() {
                this.progress += this.speed;
                
                if (this.progress > 1.5) {
                    this.reset();
                }

                // Calculate current position along a diagonal path from top-left to bottom-right
                const screenDiagonal = Math.sqrt(canvas.width ** 2 + canvas.height ** 2);
                const currentDist = this.progress * screenDiagonal;
                
                // Angle of the diagonal
                const angle = Math.atan2(canvas.height, canvas.width);
                
                this.x = Math.cos(angle) * currentDist - 200;
                this.y = Math.sin(angle) * currentDist - 200;
            }

            draw() {
                if (this.progress < 0) return;

                ctx.beginPath();
                
                const segments = 50;
                const segmentLength = 400; // Total length of the visible line
                
                for (let i = 0; i <= segments; i++) {
                    const t = i / segments;
                    // Uneven movement using multiple sine waves
                    const wave = Math.sin(t * 10 + this.progress * 20 + this.seed) * this.amplitude +
                                 Math.sin(t * 5 - this.progress * 15 + this.seed) * (this.amplitude / 2);
                    
                    // Direction perpendicular to the path
                    const perpAngle = Math.atan2(canvas.height, canvas.width) + Math.PI / 2;
                    
                    const px = this.x + (Math.cos(Math.atan2(canvas.height, canvas.width)) * t * segmentLength) + Math.cos(perpAngle) * wave;
                    const py = this.y + (Math.sin(Math.atan2(canvas.height, canvas.width)) * t * segmentLength) + Math.sin(perpAngle) * wave;
                    
                    if (i === 0) ctx.moveTo(px, py);
                    else ctx.lineTo(px, py);
                }

                // Gradient calculation
                const gradient = ctx.createLinearGradient(this.x, this.y, this.x + segmentLength, this.y + segmentLength);
                
                // Color transition: Neon green to light purple
                // Adjusting colors based on theme for better blending
                const isDark = theme === 'dark';
                const neonGreen = isDark ? 'rgba(57, 255, 20, 0.8)' : 'rgba(16, 185, 129, 0.4)';
                const lightPurple = isDark ? 'rgba(224, 176, 255, 0.8)' : 'rgba(139, 92, 246, 0.4)';
                
                gradient.addColorStop(0, neonGreen);
                gradient.addColorStop(1, lightPurple);

                ctx.strokeStyle = gradient;
                ctx.lineWidth = 2.5;
                ctx.lineCap = 'round';
                
                // Glow effect
                ctx.shadowBlur = 10;
                ctx.shadowColor = isDark ? 'rgba(57, 255, 20, 0.3)' : 'rgba(16, 185, 129, 0.1)';
                
                ctx.stroke();
                ctx.shadowBlur = 0; // Reset for next line
            }
        }

        // Initialize lines
        for (let i = 0; i < lineCount; i++) {
            lines.push(new WavyLine(i));
        }

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            lines.forEach(line => {
                line.update();
                line.draw();
            });

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [theme]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 0,
                opacity: 0.6,
            }}
        />
    );
};

export default WavyBackground;
