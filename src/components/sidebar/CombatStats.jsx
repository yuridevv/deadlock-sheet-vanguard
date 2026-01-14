import React from 'react';
import AnimatedNumber from '../core/AnimatedNumber';
import { Shield, Crosshair } from '../icons';

const CombatStats = ({ defesaBase, reflexoBase }) => {
  return (
    <div className="grid grid-cols-2 gap-px bg-zinc-800/20 border border-zinc-800/20 overflow-hidden">
      <div className="p-6 text-center hover:bg-white/[0.02] transition-colors duration-300">
        <Shield size={16} className="mx-auto mb-2 opacity-10" />
        <p className="text-[9px] font-mono opacity-30 uppercase">Defesa</p>
        <p className="text-4xl font-serif"><AnimatedNumber value={defesaBase} /></p>
      </div>
      <div className="p-6 text-center hover:bg-white/[0.02] transition-colors duration-300">
        <Crosshair size={16} className="mx-auto mb-2 opacity-10" />
        <p className="text-[9px] font-mono opacity-30 uppercase">Reflexo</p>
        <p className="text-4xl font-serif"><AnimatedNumber value={reflexoBase} /></p>
      </div>
    </div>
  );
};

export default CombatStats;
