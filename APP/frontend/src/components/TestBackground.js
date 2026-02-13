import React, { useEffect, useRef } from 'react';

const TestBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) {
            console.log('TEST: Canvas is null');
            return;
        }

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        console.log('TEST: Canvas initialized', canvas.width, canvas.height);

        let frame = 0;

        const animate = () => {
            frame++;

            // Clear with gradient
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, '#f0f4ff');
            gradient.addColorStop(0.5, '#fef3f9');
            gradient.addColorStop(1, '#f0f9ff');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw moving circle
            const x = (Math.sin(frame * 0.01) * 200) + canvas.width / 2;
            const y = (Math.cos(frame * 0.01) * 200) + canvas.height / 2;

            const circleGradient = ctx.createRadialGradient(x, y, 0, x, y, 100);
            circleGradient.addColorStop(0, 'rgba(168, 162, 255, 0.5)');
            circleGradient.addColorStop(1, 'rgba(168, 162, 255, 0)');

            ctx.fillStyle = circleGradient;
            ctx.beginPath();
            ctx.arc(x, y, 100, 0, Math.PI * 2);
            ctx.fill();

            // Draw some dots
            for (let i = 0; i < 50; i++) {
                const dotX = (Math.sin(frame * 0.01 + i) * 300) + canvas.width / 2;
                const dotY = (Math.cos(frame * 0.01 + i) * 300) + canvas.height / 2;

                ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                ctx.beginPath();
                ctx.arc(dotX, dotY, 3, 0, Math.PI * 2);
                ctx.fill();
            }

            requestAnimationFrame(animate);
        };

        animate();
    }, []);

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 0
        }}>
            <canvas
                ref={canvasRef}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    display: 'block',
                    background: 'linear-gradient(135deg, #f0f4ff 0%, #fef3f9 50%, #f0f9ff 100%)'
                }}
            />
        </div>
    );
};

export default TestBackground;
