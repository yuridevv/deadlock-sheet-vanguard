import React from 'react';
import AnimatedNumber from '../core/AnimatedNumber';
import { Dice5 } from '../icons';

const DiceRoller = ({ resultado, rollDetails, onRoll }) => {
  return (
    <div 
      onClick={onRoll} 
      className="p-12 border border-zinc-800 flex flex-col items-center justify-center gap-4 hover:bg-zinc-100 hover:text-black transition-all duration-300 cursor-pointer group relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-zinc-100 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-bottom z-0"></div>
      <div className="relative z-10 flex flex-col items-center">
        {resultado ? (
          <div className="text-center animate-in zoom-in duration-300">
            <p className="text-7xl font-serif"><AnimatedNumber value={resultado} /></p>
            <p className="text-[10px] font-mono uppercase tracking-widest mt-2">Rolagem de {rollDetails.source}</p>
            <p className="text-[9px] opacity-40 font-mono mt-1">MOD: {rollDetails.mod >= 0 ? '+' : ''}{rollDetails.mod}</p>
          </div>
        ) : (
          <>
            <Dice5 size={40} className="opacity-10 group-hover:rotate-180 transition-all duration-500 ease-out" />
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] opacity-40 mt-4 transition-all duration-500 group-hover:tracking-[0.5em] group-hover:opacity-100">Roll Dice</span>
          </>
        )}
      </div>
    </div>
  );
};

export default DiceRoller;
