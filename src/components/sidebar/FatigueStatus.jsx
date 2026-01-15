import React, { useState } from 'react';
import { Skull } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FatigueStatus = ({ fadiga, setFadiga, isCritical, effectsEnabled, onFadigaClick }) => {
  const [activePulse, setActivePulse] = useState(null);

  const handleClick = (i) => {
    const newValue = i === fadiga ? i - 1 : i;
    setFadiga(newValue);
    
    // Disparar animação de vinheta interna
    setActivePulse(i);
    setTimeout(() => setActivePulse(null), 400);

    if (onFadigaClick) onFadigaClick();
  };

  return (
    <div className={`p-8 border transition-all duration-500 ${isCritical && effectsEnabled ? 'border-red-600 bg-red-950/20 shadow-[0_0_50px_rgba(255,0,0,0.15)]' : 'border-zinc-800/40'}`}>
      <p className="text-[10px] font-black uppercase text-center tracking-[0.4em] opacity-20 mb-6 font-mono transition-opacity">Status de Fadiga</p>
      <div className="flex gap-4">
        {[1, 2, 3].map(i => (
          <button 
            key={i} 
            onClick={() => handleClick(i)} 
            className={`h-20 flex-1 border transition-all duration-300 relative overflow-hidden group ${
              fadiga >= i 
                ? (i === 3 ? 'bg-red-700 border-red-500 shadow-[0_0_15px_rgba(220,38,38,0.5)]' : 'bg-zinc-200 border-white shadow-[0_0_10px_rgba(255,255,255,0.3)]') 
                : 'bg-transparent border-zinc-800 hover:border-zinc-500'
            }`}
          >
            {/* Vinheta de Animação Interna */}
            <AnimatePresence>
              {activePulse === i && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1.2 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 z-10 pointer-events-none bg-[radial-gradient(circle,transparent_30%,rgba(255,255,255,0.4)_100%)]"
                />
              )}
            </AnimatePresence>

            {fadiga >= i && <div className="absolute inset-0 bg-white/10 animate-pulse"></div>}
            
            {i === 3 && (
              <div className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-500 ${fadiga === 3 ? 'opacity-30' : 'opacity-0'}`}>
                <Skull size={40} className="text-white animate-pulse" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FatigueStatus;
