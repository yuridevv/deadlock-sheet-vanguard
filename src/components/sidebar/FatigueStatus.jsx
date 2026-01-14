import React from 'react';

const FatigueStatus = ({ fadiga, setFadiga, isCritical, effectsEnabled }) => {
  return (
    <div className={`p-8 border transition-all duration-500 ${isCritical && effectsEnabled ? 'border-red-600 bg-red-950/20 shadow-[0_0_50px_rgba(255,0,0,0.15)]' : 'border-zinc-800/40'}`}>
      <p className="text-[10px] font-black uppercase text-center tracking-[0.4em] opacity-20 mb-6 font-mono transition-opacity">Status de Fadiga</p>
      <div className="flex gap-4">
        {[1, 2, 3].map(i => (
          <button 
            key={i} 
            onClick={() => setFadiga(i === fadiga ? i - 1 : i)} 
            className={`h-20 flex-1 border transition-all duration-300 relative overflow-hidden group ${
              fadiga >= i 
                ? (i === 3 ? 'bg-red-700 border-red-500 shadow-[0_0_15px_rgba(220,38,38,0.5)]' : 'bg-zinc-200 border-white shadow-[0_0_10px_rgba(255,255,255,0.3)]') 
                : 'bg-transparent border-zinc-800 hover:border-zinc-500'
            }`}
          >
            {fadiga >= i && <div className="absolute inset-0 bg-white/10 animate-pulse"></div>}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FatigueStatus;
