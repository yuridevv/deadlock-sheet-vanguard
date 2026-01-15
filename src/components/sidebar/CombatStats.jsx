import React from 'react';
import AnimatedNumber from '../core/AnimatedNumber';
import { Shield, Crosshair } from '../icons';

const CombatStats = ({ defesaBase, reflexoBase, darkMode }) => {
  return (
    <div className={`grid grid-cols-2 divide-x divide-zinc-800/20 border-y border-zinc-800/20 py-4 ${darkMode ? 'bg-white/[0.01]' : 'bg-black/[0.01]'}`}>
      <div className="px-4 flex flex-col items-center">
        <div className="flex items-center gap-2 mb-1">
          <Shield size={12} className="opacity-40" />
          <span className="text-[10px] font-mono opacity-40 uppercase tracking-tighter">Defense</span>
        </div>
        <div className="text-3xl font-serif font-bold tracking-tight">
          <AnimatedNumber value={defesaBase} />
        </div>
      </div>
      <div className="px-4 flex flex-col items-center">
        <div className="flex items-center gap-2 mb-1">
          <Crosshair size={12} className="opacity-40" />
          <span className="text-[10px] font-mono opacity-40 uppercase tracking-tighter">Reflex</span>
        </div>
        <div className="text-3xl font-serif font-bold tracking-tight">
          <AnimatedNumber value={reflexoBase} />
        </div>
      </div>
    </div>
  );
};

export default CombatStats;