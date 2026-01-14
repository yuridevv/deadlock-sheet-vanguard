import React from 'react';
import { Dice5, Plus, Trash2 } from '../icons';

const DossierTab = ({
  attrs,
  setAttrs,
  penalidade,
  rolarAtributo,
  habilidades,
  setHabilidades,
}) => {
  return (
    <div className="space-y-12 animate-[fadeIn_0.3s_ease-out]">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Object.keys(attrs).map(attr => (
          <div key={attr} className="p-6 border border-zinc-800/20 bg-white/[0.01] hover:bg-white/[0.02] hover:border-zinc-700 transition-all duration-300 group focus-within:border-zinc-500">
            <div className="flex justify-between items-start mb-4">
              <div className="flex flex-col">
                <label className="text-[11px] font-black opacity-30 uppercase font-mono group-hover:opacity-50 transition-opacity">{attr}</label>
                <span className="text-[14px] font-mono font-bold text-zinc-500">Total: {Number(attrs[attr]) - penalidade}</span>
              </div>
              <div className="flex gap-2">
                 <button onClick={() => rolarAtributo(attr, attrs[attr])} className="p-1 text-zinc-600 hover:text-white transition-colors"><Dice5 size={14}/></button>
                 {penalidade > 0 && <span className="text-[10px] font-black text-red-900 animate-pulse">-{penalidade}</span>}
              </div>
            </div>
            <input type="number" value={attrs[attr]} onChange={(e) => setAttrs({...attrs, [attr]: e.target.value})} className="bg-transparent text-4xl font-light w-full outline-none font-serif smooth-input" />
          </div>
        ))}
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center opacity-30">
          <h3 className="text-[10px] font-black uppercase tracking-widest font-mono">Habilidades/Maestrias</h3>
          <button onClick={() => setHabilidades([...habilidades, {id: Date.now(), nome: '', rank: ''}])} className="hover:text-white transition-colors"><Plus size={16}/></button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {habilidades.map((h, i) => (
            <div key={h.id} className="flex items-center gap-4 p-4 border border-zinc-800/30 bg-white/[0.02] hover:border-zinc-500 transition-all duration-300 group">
              <input 
                value={h.nome} 
                onChange={(e) => {
                  const newH = [...habilidades];
                  newH[i] = { ...newH[i], nome: e.target.value };
                  setHabilidades(newH);
                }} 
                className="flex-1 bg-transparent text-xs font-bold outline-none border-b border-zinc-800/50 focus:border-zinc-400 py-1 transition-colors placeholder:text-zinc-600" 
                placeholder="Nome da Habilidade" 
              />
              <div className="relative">
                <input 
                  value={h.rank} 
                  onChange={(e) => {
                    const newH = [...habilidades];
                    newH[i] = { ...newH[i], rank: e.target.value };
                    setHabilidades(newH);
                  }} 
                  className="w-10 bg-zinc-900/50 border border-zinc-800 focus:border-zinc-500 text-center text-xs font-mono font-bold py-1 outline-none transition-all rounded-sm placeholder:opacity-30" 
                  placeholder="0"
                />
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[7px] font-mono opacity-20 uppercase tracking-tighter">Maestria</div>
              </div>
              <button onClick={() => setHabilidades(habilidades.filter(hab => hab.id !== h.id))} className="opacity-0 group-hover:opacity-100 text-red-900 transition-opacity duration-300"><Trash2 size={14}/></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DossierTab;
