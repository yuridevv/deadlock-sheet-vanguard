import React, { useRef, useEffect, useMemo } from 'react';

const HeartMonitor = ({ vigor, vigorMax, sanidade, fadiga, isDead }) => {
  const canvasRef = useRef(null);

  // Definição de Cores e Status
  const { colorStr, bpm, statusLabel } = useMemo(() => {
    if (isDead) return { colorStr: '#dc2626', bpm: 0, statusLabel: 'FLATLINE' }; 

    const healthPerc = vigor / vigorMax;
    const sanityPerc = sanidade / 12;
    const isHighFatigue = fadiga >= 2;

    let level = 0; 
    if (healthPerc < 0.3 || sanityPerc <= 0.25 || fadiga >= 3) level = 3;
    else if (healthPerc < 0.6 || sanityPerc <= 0.5 || isHighFatigue) level = 2;
    else if (healthPerc < 0.9 || sanityPerc <= 0.75) level = 1;

    switch (level) {
      case 3: return { colorStr: '#ef4444', bpm: 160 + Math.random() * 10, statusLabel: 'CRITICAL' }; 
      case 2: return { colorStr: '#f97316', bpm: 130 + Math.random() * 5, statusLabel: 'DANGER' };   
      case 1: return { colorStr: '#eab308', bpm: 100 + Math.random() * 5, statusLabel: 'ALERT' };    
      default: return { colorStr: '#10b981', bpm: 75 + Math.random() * 2, statusLabel: 'NORMAL' };   
    }
  }, [vigor, vigorMax, sanidade, fadiga, isDead]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    let x = 0; 
    let y = rect.height / 2; 
    const speed = isDead ? 1 : 2 + (bpm / 60); 
    
    let animationFrameId;
    
    // Padrão PQRST simplificado
    const beatPattern = [
       { dx: 5, dy: 0 }, { dx: 5, dy: -5 }, { dx: 5, dy: 5 }, { dx: 5, dy: 0 }, 
       { dx: 3, dy: 10 }, { dx: 3, dy: -40 }, { dx: 3, dy: 15 }, 
       { dx: 5, dy: 0 }, { dx: 8, dy: -8 }, { dx: 8, dy: 8 }, { dx: 15, dy: 0 } 
    ];

    let beatIndex = -1;
    let lastBeatTime = 0;
    
    const render = (time) => {
      const beatInterval = 60000 / (bpm || 1); 
      
      if (!isDead && beatIndex === -1 && time - lastBeatTime > beatInterval) {
        beatIndex = 0;
        lastBeatTime = time;
      }

      let targetY = rect.height / 2;
      let stepSpeed = speed;

      if (beatIndex >= 0) {
        const step = beatPattern[beatIndex];
        targetY = (rect.height / 2) + step.dy;
        stepSpeed = speed * 1.5; 
      }

      const clearWidth = 20;
      ctx.clearRect(x, 0, clearWidth, rect.height);
      
      if (x >= rect.width) x = 0;

      ctx.beginPath();
      ctx.strokeStyle = colorStr;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      const prevX = x;
      const prevY = y;
      
      x += stepSpeed;
      
      if (beatIndex >= 0) {
          y = targetY;
          beatIndex++;
          if (beatIndex >= beatPattern.length) {
              beatIndex = -1;
              y = rect.height / 2;
          }
      } else {
          y = (rect.height / 2) + (Math.random() * 2 - 1);
      }

      ctx.moveTo(prevX, prevY);
      ctx.lineTo(x, y);
      ctx.stroke();

      // Scanbar vertical
      ctx.fillStyle = '#ffffff';
      ctx.globalAlpha = 0.5;
      ctx.fillRect(x + 2, 0, 2, rect.height);
      ctx.globalAlpha = 1.0;

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => cancelAnimationFrame(animationFrameId);
  }, [bpm, colorStr, isDead]);

  return (
    <div className="w-full bg-black border-2 border-zinc-800 relative shadow-xl group rounded-none">
      {/* Parafusos Decorativos */}
      <div className="absolute top-1 left-1 w-1 h-1 bg-zinc-700 rounded-full" />
      <div className="absolute top-1 right-1 w-1 h-1 bg-zinc-700 rounded-full" />
      <div className="absolute bottom-1 left-1 w-1 h-1 bg-zinc-700 rounded-full" />
      <div className="absolute bottom-1 right-1 w-1 h-1 bg-zinc-700 rounded-full" />

      {/* Header Info */}
      <div className="absolute top-2 left-4 right-4 flex justify-between items-center z-10 pointer-events-none">
        <span className={`text-[10px] font-mono tracking-widest ${isDead ? 'text-red-500 animate-pulse' : 'text-zinc-500'}`}>
           VITAL_MONITOR // {statusLabel}
        </span>
        <div className="flex flex-col items-end bg-black/50 px-1 backdrop-blur-sm">
             <span className="text-xl font-mono font-bold leading-none text-zinc-300">
                {Math.round(bpm)} <span className="text-[10px] text-zinc-600 font-normal">BPM</span>
             </span>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="h-28 w-full relative border-t border-b border-zinc-900 bg-[#050505]">
        {/* Grid Background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ 
               backgroundImage: `linear-gradient(${colorStr}44 1px, transparent 1px), 
                                 linear-gradient(90deg, ${colorStr}44 1px, transparent 1px)`, 
               backgroundSize: '15px 15px' 
             }} 
        />
        
        <canvas 
            ref={canvasRef} 
            className="w-full h-full block"
            style={{ filter: `drop-shadow(0 0 3px ${colorStr})` }}
        />
      </div>
      
      {/* Glare e Vignette */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/5 to-transparent z-20" />
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_30px_rgba(0,0,0,1)] z-30" />
    </div>
  );
};

export default HeartMonitor;
