import { useEffect, useRef } from 'react';
import styles from './MindfulnessPlayer.module.css';

export default function AudioVisualizer({ analyser, color = '#14B8A6', isPlaying }) {
    const canvasRef = useRef(null);
    const animFrameRef = useRef(null);

    useEffect(() => {
        if (!analyser || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Set canvas resolution
        const dpr = window.devicePixelRatio || 1;
        const size = 280;
        canvas.width = size * dpr;
        canvas.height = size * dpr;
        ctx.scale(dpr, dpr);

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        const cx = size / 2;
        const cy = size / 2;
        const baseRadius = 80;

        const draw = () => {
            animFrameRef.current = requestAnimationFrame(draw);
            analyser.getByteFrequencyData(dataArray);

            ctx.clearRect(0, 0, size, size);

            // Outer glow ring
            const avg = dataArray.reduce((a, b) => a + b, 0) / bufferLength;
            const glowRadius = baseRadius + 30 + (avg / 255) * 30;

            const gradient = ctx.createRadialGradient(cx, cy, baseRadius - 10, cx, cy, glowRadius + 20);
            gradient.addColorStop(0, `${color}20`);
            gradient.addColorStop(0.5, `${color}10`);
            gradient.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(cx, cy, glowRadius + 20, 0, Math.PI * 2);
            ctx.fill();

            // Frequency bars in a circle
            const barCount = 64;
            const step = Math.floor(bufferLength / barCount);

            for (let i = 0; i < barCount; i++) {
                const val = dataArray[i * step] / 255;
                const angle = (i / barCount) * Math.PI * 2 - Math.PI / 2;
                const barLength = 10 + val * 45;

                const x1 = cx + Math.cos(angle) * (baseRadius + 5);
                const y1 = cy + Math.sin(angle) * (baseRadius + 5);
                const x2 = cx + Math.cos(angle) * (baseRadius + 5 + barLength);
                const y2 = cy + Math.sin(angle) * (baseRadius + 5 + barLength);

                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.strokeStyle = `${color}${Math.floor(40 + val * 60).toString(16).padStart(2, '0')}`;
                ctx.lineWidth = 2.5;
                ctx.lineCap = 'round';
                ctx.stroke();
            }

            // Inner circle (pulse)
            const pulseRadius = baseRadius - 5 + (avg / 255) * 8;
            ctx.beginPath();
            ctx.arc(cx, cy, pulseRadius, 0, Math.PI * 2);
            ctx.fillStyle = `${color}15`;
            ctx.fill();
            ctx.strokeStyle = `${color}40`;
            ctx.lineWidth = 2;
            ctx.stroke();

            // Center dot
            ctx.beginPath();
            ctx.arc(cx, cy, 4, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
        };

        if (isPlaying) {
            draw();
        }

        return () => {
            if (animFrameRef.current) {
                cancelAnimationFrame(animFrameRef.current);
            }
        };
    }, [analyser, color, isPlaying]);

    // Idle animation when not playing
    useEffect(() => {
        if (isPlaying || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        const size = 280;
        canvas.width = size * dpr;
        canvas.height = size * dpr;
        ctx.scale(dpr, dpr);

        const cx = size / 2;
        const cy = size / 2;
        let frame = 0;

        const drawIdle = () => {
            animFrameRef.current = requestAnimationFrame(drawIdle);
            ctx.clearRect(0, 0, size, size);
            frame++;

            const breathe = Math.sin(frame * 0.015) * 10;
            const radius = 80 + breathe;

            // Breathing ring
            const gradient = ctx.createRadialGradient(cx, cy, radius - 20, cx, cy, radius + 20);
            gradient.addColorStop(0, `${color}15`);
            gradient.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(cx, cy, radius + 20, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.arc(cx, cy, radius, 0, Math.PI * 2);
            ctx.strokeStyle = `${color}30`;
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(cx, cy, 4, 0, Math.PI * 2);
            ctx.fillStyle = `${color}60`;
            ctx.fill();
        };

        drawIdle();

        return () => {
            if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        };
    }, [isPlaying, color]);

    return (
        <canvas
            ref={canvasRef}
            className={styles.visualizer}
            style={{ width: 280, height: 280 }}
        />
    );
}
