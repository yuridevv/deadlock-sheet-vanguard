import React from 'react';
import { Skull } from '../icons';

const DeathScreen = ({ isDead, setIsDead }) => {
  if (!isDead) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex flex-col items-center justify-center p-6 text-center bg-black/90 animate-death-screen rounded-none">
      <div className="animate-skull-smooth text-red-600 mb-8">
        <Skull size={180} strokeWidth={0.5} />
      </div>
      <div className="animate-text-enter">
        <h1 className="font-serif text-5xl md:text-7xl mb-4 text-zinc-100 tracking-tighter">MORTO</h1>
        <p className="font-mono text-red-900 tracking-[0.5em] uppercase text-xs mb-12">System Failure // Character Dead</p>
        <button onClick={() => setIsDead(false)} className="px-12 py-4 border border-zinc-800 hover:border-red-600 text-zinc-500 hover:text-red-600 transition-all duration-300 font-mono uppercase text-[10px] tracking-widest hover:bg-red-950/10">
          REVIVER PERSONAGEM
        </button>
      </div>
    </div>
  );
};

export default DeathScreen;
