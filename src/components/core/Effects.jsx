import React, { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// --- Componente de Partículas ---
const ParticleField = ({ isCritical, isUmbra, isInsane, darkMode }) => {
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
        let color;
        if (isInsane) {
          color = `rgba(168, 85, 247, ${this.opacity})`; // Bright purple for insanity
        } else if (isUmbra) {
          color = `rgba(107, 33, 168, ${this.opacity})`; // Darker purple for umbra
        } else if (isCritical) {
          color = `rgba(220, 38, 38, ${this.opacity})`;
        } else {
          color = darkMode ? `rgba(255, 255, 255, ${this.opacity})` : `rgba(0, 0, 0, ${this.opacity})`;
        }
        
        ctx.fillStyle = color;
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
  }, [isCritical, isUmbra, isInsane, darkMode]);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-40 transition-opacity duration-500" />;
};


const Effects = ({ effectsEnabled, isCritical, isUmbra, isInsane, darkMode, triggerVignette }) => {
    if (!effectsEnabled) return null;

    return (
        <>
            <ParticleField isCritical={isCritical} isUmbra={isUmbra} isInsane={isInsane} darkMode={darkMode} />
            <div className="crt-overlay pointer-events-none"></div>
            <div className="scanline-moving"></div>
            <div className={`bg-glow transition-colors duration-1000 ${isInsane ? 'bg-[#2e1065]' : isUmbra ? 'bg-[#0a0015]' : isCritical ? 'bg-[#440000]' : 'bg-[#111111]'}`}></div>
            
            {isUmbra && effectsEnabled && !isCritical && (
                <div className="fixed inset-0 pointer-events-none z-[97] opacity-20 mix-blend-screen"
                     style={{
                         background: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(139, 92, 246, 0.1) 2px, rgba(139, 92, 246, 0.1) 4px)'
                     }}
                ></div>
            )}

            <AnimatePresence>
                {triggerVignette && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.4 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 pointer-events-none z-[110] bg-[radial-gradient(circle,transparent_70%,rgba(153,27,27,0.2)_100%)] shadow-[inset_0_0_80px_rgba(153,27,27,0.3)]"
                    />
                )}
            </AnimatePresence>

            {isUmbra && effectsEnabled && !isCritical && (
                <div className="fixed inset-0 pointer-events-none z-[98] transition-opacity duration-1000 opacity-30"
                     style={{
                         background: 'radial-gradient(circle, transparent 60%, rgba(46, 16, 101, 0.1) 100%)',
                         boxShadow: 'inset 0 0 80px rgba(88, 28, 135, 0.15)'
                     }}
                ></div>
            )}

            {isInsane && (
                <div className="fixed inset-0 pointer-events-none z-[99] animate-pulse transition-opacity duration-1000"
                     style={{
                         background: 'radial-gradient(circle, transparent 50%, rgba(88, 28, 135, 0.1) 100%)',
                         boxShadow: 'inset 0 0 100px rgba(126, 34, 206, 0.2)'
                     }}
                ></div>
            )}

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