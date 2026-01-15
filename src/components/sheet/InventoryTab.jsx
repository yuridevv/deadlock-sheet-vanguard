import React, { useState } from 'react';
import { GripVertical, Sword, Trash2 } from 'lucide-react'; // Changed to lucide-react standard icons just in case local ones are limited

const InventoryTab = ({
  inventario,
  setInventario,
  draggedItemIndex,
  handleDragStart,
  handleDragOver,
  handleDragEnd
}) => {
  // Estado local para animação temporária de ativação
  const [activatingIndex, setActivatingIndex] = useState(null);

  const toggleWeapon = (i) => {
    const newInv = [...inventario];
    const isNowWeapon = !newInv[i].isWeapon;
    newInv[i] = { ...newInv[i], isWeapon: isNowWeapon };
    setInventario(newInv);

    if (isNowWeapon) {
        setActivatingIndex(i);
        setTimeout(() => setActivatingIndex(null), 500);
    }
  };

  return (
    <div className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
      {inventario.map((item, i) => (
        <div 
          key={i} 
          draggable 
          onDragStart={() => handleDragStart(i)}
          onDragOver={(e) => handleDragOver(e, i)}
          onDragEnd={handleDragEnd}
          className={`relative flex items-center gap-4 p-4 border transition-all duration-300 group
             ${draggedItemIndex === i ? 'opacity-30 border-dashed border-zinc-500' : ''}
             ${item.isWeapon ? 'bg-red-900/5 border-red-900/20 hover:border-red-900/40' : 'bg-white/[0.01] border-zinc-800/10 hover:border-zinc-700'}
             ${activatingIndex === i ? 'ring-1 ring-red-500 bg-red-900/20' : ''}
          `}
        >
          {/* Indicador de Arma Lateral (Visual Tech) */}
          {item.isWeapon && (
             <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-red-900 shadow-[0_0_8px_rgba(220,38,38,0.5)] animate-pulse" />
          )}

          <div className="cursor-grab active:cursor-grabbing text-zinc-700 hover:text-zinc-400 p-1">
            <GripVertical size={16} />
          </div>
          <span className="text-[10px] opacity-10 font-mono transition-opacity group-hover:opacity-30">{i+1}</span>
          
          <input 
            value={item.item} 
            onChange={(e) => {
                const newInv = [...inventario];
                newInv[i] = { ...newInv[i], item: e.target.value };
                setInventario(newInv);
            }} 
            className={`flex-1 bg-transparent outline-none text-sm font-bold smooth-input transition-colors
                ${item.isWeapon ? 'text-red-900 placeholder-red-900/30' : 'text-zinc-300 placeholder-zinc-700'}
            `}
            placeholder="Item" 
          />

          <div className="flex items-center gap-2 px-3 border-l border-zinc-800/20">
            <button 
                onClick={() => toggleWeapon(i)}
                className={`transition-all duration-300 transform active:scale-90 rounded-none p-1
                    ${item.isWeapon ? 'bg-red-900/20 text-red-500' : 'opacity-30 hover:opacity-100 hover:text-zinc-300'}
                    ${activatingIndex === i ? 'scale-125 text-red-400' : ''}
                `}
                title="Marcar como Arma"
            >
              <Sword size={14} className={item.isWeapon ? 'drop-shadow-[0_0_5px_rgba(239,68,68,0.6)]' : ''} />
            </button>
            
            {item.isWeapon && (
              <div className="relative animate-[fadeIn_0.3s_ease-out]">
                  <input 
                    value={item.dano || ''} 
                    onChange={(e) => {
                    const newInv = [...inventario];
                    newInv[i] = { ...newInv[i], dano: e.target.value };
                    setInventario(newInv);
                    }} 
                    className="w-20 bg-transparent outline-none text-xs font-mono text-red-400 focus:text-red-300 placeholder:text-red-900/50 smooth-input text-right" 
                    placeholder="DANO" 
                />
              </div>
            )}
          </div>
          <input type="number" value={item.qtd} onChange={(e) => {
            const newInv = [...inventario];
            newInv[i] = { ...newInv[i], qtd: e.target.value };
            setInventario(newInv);
          }} className="w-10 bg-transparent text-right outline-none text-sm font-black smooth-input" />
          <button onClick={() => setInventario(inventario.filter((_, idx) => idx !== i))} className="opacity-0 group-hover:opacity-100 text-red-900 transition-all duration-300 transform hover:scale-110"><Trash2 size={16}/></button>
        </div>
      ))}
      <button onClick={() => setInventario([...inventario, {item: '', qtd: 1, dano: '', isWeapon: false}])} className="w-full py-6 border border-dashed border-zinc-800/20 text-[10px] font-mono opacity-20 hover:opacity-100 uppercase hover:border-zinc-500 transition-all duration-300">+ Adicionar Item</button>
    </div>
  );
};

export default InventoryTab;