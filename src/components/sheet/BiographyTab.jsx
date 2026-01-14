import React from 'react';
import { ScrollText, Eye, Users } from '../icons';

const BiographyTab = ({ bio, setBio, aparencia, setAparencia, lacos, setLacos }) => {
  return (
    <div className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
      <div className="space-y-2 group">
        <label className="text-[10px] font-black opacity-20 uppercase font-mono flex items-center gap-2 group-focus-within:opacity-50 transition-opacity"><ScrollText size={14}/> Arquivo Pessoal</label>
        <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="w-full bg-transparent border border-zinc-800/20 p-6 h-40 outline-none text-sm font-inter focus:border-zinc-600 transition-colors duration-300 resize-none" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2 group">
          <label className="text-[10px] font-black opacity-20 uppercase font-mono flex items-center gap-2 group-focus-within:opacity-50 transition-opacity"><Eye size={14}/> Aparência</label>
          <textarea value={aparencia} onChange={(e) => setAparencia(e.target.value)} className="w-full bg-transparent border border-zinc-800/20 p-6 h-32 outline-none text-sm font-inter focus:border-zinc-600 transition-colors duration-300 resize-none" />
        </div>
        <div className="space-y-2 group">
          <label className="text-[10px] font-black opacity-20 uppercase font-mono flex items-center gap-2 group-focus-within:opacity-50 transition-opacity"><Users size={14}/> Contatos</label>
          <textarea value={lacos} onChange={(e) => setLacos(e.target.value)} className="w-full bg-transparent border border-zinc-800/20 p-6 h-32 outline-none text-sm font-inter focus:border-zinc-600 transition-colors duration-300 resize-none" />
        </div>
      </div>
    </div>
  );
};

export default BiographyTab;
