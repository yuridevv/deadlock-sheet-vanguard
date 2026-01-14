import React from 'react';
import { Camera, Download, Upload, Sun, Moon, Skull, Zap, ZapOff } from '../icons';

const Header = ({
  effectsEnabled,
  setEffectsEnabled,
  exportarFicha,
  fileInputRef,
  darkMode,
  setDarkMode,
  setIsDead,
}) => {
  return (
    <header className="flex justify-between items-center mb-16">
      <div className="flex items-center gap-6 group">
        <div className="p-4 border border-zinc-800/40 bg-zinc-900/10 transition-all duration-300 group-hover:border-zinc-600">
          <Camera size={24} className="text-zinc-600 transition-colors group-hover:text-zinc-400" />
        </div>
        <div>
          <h2 className="text-[10px] font-black tracking-[0.5em] opacity-30 uppercase font-mono transition-opacity group-hover:opacity-50">DEADLOCK SHEET</h2>
          <p className="text-[9px] font-bold opacity-20 uppercase font-mono">Version 0.8.1 // VANGUARD</p>
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={() => setEffectsEnabled(!effectsEnabled)} title="Alternar Efeitos de Luz" className={`p-3 border border-zinc-800/30 transition-all duration-200 ${effectsEnabled ? 'text-zinc-200 bg-zinc-800' : 'text-zinc-600 hover:text-zinc-400'}`}>
          {effectsEnabled ? <Zap size={18}/> : <ZapOff size={18}/>}
        </button>
        <button onClick={exportarFicha} className="p-3 border border-zinc-800/30 hover:bg-zinc-800 transition-all duration-200 text-zinc-500 hover:text-zinc-200"><Download size={18}/></button>
        <button onClick={() => fileInputRef.current.click()} className="p-3 border border-zinc-800/30 hover:bg-zinc-800 transition-all duration-200 text-zinc-500 hover:text-zinc-200"><Upload size={18}/></button>
        <button onClick={() => setDarkMode(!darkMode)} className="p-3 border border-zinc-800/30 hover:bg-zinc-800 transition-all duration-200 text-zinc-500 hover:text-zinc-200">{darkMode ? <Sun size={18}/> : <Moon size={18}/>}</button>
        <button onClick={() => setIsDead(true)} className="p-3 text-red-900/40 hover:text-red-500 transition-all duration-200 hover:bg-red-950/10"><Skull size={18}/></button>
      </div>
    </header>
  );
};

export default Header;
