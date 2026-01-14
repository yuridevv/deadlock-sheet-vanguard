import React, { useEffect, useRef } from 'react';

// --- Componente de Partículas ---
const ParticleField = ({ isCritical, darkMode }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const particles = [];
    const particleCount = 60;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
          this.reset();
        }
      }
      draw() {
        ctx.fillStyle = isCritical ? `rgba(220, 38, 38, ${this.opacity})` : (darkMode ? `rgba(255, 255, 255, ${this.opacity})` : `rgba(0, 0, 0, ${this.opacity})`);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) particles.push(new Particle());

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    resize();
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, [isCritical, darkMode]);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-40 transition-opacity duration-500" />;
};


const Effects = ({ effectsEnabled, isCritical, darkMode }) => {
    if (!effectsEnabled) return null;

    return (
        <>
            <ParticleField isCritical={isCritical} darkMode={darkMode} />
            <div className="crt-overlay pointer-events-none"></div>
            <div className="scanline-moving"></div>
            <div className="bg-glow" style={{ backgroundColor: isCritical ? '#440000' : '#111111' }}></div>
            {isCritical && (
                <>
                    <div className="alarm-overlay-active"></div>
                    <div className="fixed inset-0 pointer-events-none z-[101] siren-active"></div>
                </>
            )}
        </>
    );
};

export default Effects;
