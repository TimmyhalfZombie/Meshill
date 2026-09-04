import React, { useEffect, useRef } from 'react';

export default function FirefliesCanvas({ themeColor = '#6bf0ff' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initStars();
    };
    window.addEventListener('resize', handleResize);

    // Stars
    let stars = [];
    const initStars = () => {
      stars = [];
      const starCount = Math.floor((width * height) / 10000);
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height * 0.7,
          radius: Math.random() * 1.2 + 0.3,
          alpha: Math.random() * 0.7 + 0.2,
          twinkleSpeed: Math.random() * 0.02 + 0.005,
          twinklePhase: Math.random() * Math.PI * 2,
        });
      }
    };
    initStars();

    // Fireflies
    const fireflyCount = Math.min(35, Math.floor(width / 35));
    const fireflies = [];
    for (let i = 0; i < fireflyCount; i++) {
      fireflies.push({
        x: Math.random() * width,
        y: Math.random() * height * 0.8 + height * 0.1,
        radius: Math.random() * 2.5 + 1.5,
        baseAlpha: Math.random() * 0.5 + 0.3,
        pulseSpeed: Math.random() * 0.04 + 0.015,
        pulsePhase: Math.random() * Math.PI * 2,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.4 - 0.2,
        angle: Math.random() * Math.PI * 2,
        angularSpeed: (Math.random() - 0.5) * 0.03,
      });
    }



    // Mouse tracking for subtle attraction
    let mouse = { x: -1000, y: -1000 };
    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    let time = 0;

    const render = () => {
      time += 0.016;
      ctx.clearRect(0, 0, width, height);

      // Draw Twinkling Stars
      for (let s of stars) {
        s.twinklePhase += s.twinkleSpeed;
        const currentAlpha = s.alpha * (0.6 + 0.4 * Math.sin(s.twinklePhase));
        ctx.fillStyle = `rgba(235, 245, 255, ${currentAlpha})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fill();
      }



      // Draw Floating Bioluminescent Fireflies
      for (let f of fireflies) {
        f.angle += f.angularSpeed;
        f.x += f.vx + Math.sin(f.angle) * 0.4;
        f.y += f.vy + Math.cos(f.angle) * 0.3;
        f.pulsePhase += f.pulseSpeed;

        // Subtle mouse interaction
        const dx = mouse.x - f.x;
        const dy = mouse.y - f.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          f.x -= (dx / dist) * 0.8;
          f.y -= (dy / dist) * 0.8;
        }

        // Screen wrap
        if (f.x < -20) f.x = width + 20;
        if (f.x > width + 20) f.x = -20;
        if (f.y < -20) f.y = height + 20;
        if (f.y > height + 20) f.y = -20;

        const pulse = 0.5 + 0.5 * Math.sin(f.pulsePhase);
        const alpha = f.baseAlpha * pulse;
        if (alpha < 0.02) continue;

        ctx.save();
        // Firefly outer glow
        const glowRadius = f.radius * (5 + pulse * 3);
        const grad = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, glowRadius);
        grad.addColorStop(0, themeColor);
        grad.addColorStop(0.3, themeColor);
        grad.addColorStop(1, 'transparent');

        ctx.globalAlpha = alpha * 0.6;
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(f.x, f.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();

        // Firefly bright core
        ctx.globalAlpha = alpha;
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#ffffff';
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.radius * (0.8 + 0.2 * pulse), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [themeColor]);

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
        zIndex: 5,
      }}
    />
  );
}
