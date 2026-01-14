import React from 'react';
import { GripVertical, Sword, Trash2 } from '../icons';

const InventoryTab = ({
  inventario,
  setInventario,
  draggedItemIndex,
  handleDragStart,
  handleDragOver,
  handleDragEnd
}) => {
  return (
    <div className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
      {inventario.map((item, i) => (
        <div 
          key={i} 
          draggable 
          onDragStart={() => handleDragStart(i)}
          onDragOver={(e) => handleDragOver(e, i)}
          onDragEnd={handleDragEnd}
          className={`flex items-center gap-4 p-4 border border-zinc-800/10 group bg-white/[0.01] hover:border-zinc-700 transition-all duration-300 ${draggedItemIndex === i ? 'opacity-30 border-dashed border-zinc-500' : ''}`}
        >
          <div className="cursor-grab active:cursor-grabbing text-zinc-700 hover:text-zinc-400 p-1">
            <GripVertical size={16} />
          </div>
          <span className="text-[10px] opacity-10 font-mono transition-opacity group-hover:opacity-30">{i+1}</span>
          <input value={item.item} onChange={(e) => {
            const newInv = [...inventario];
            newInv[i] = { ...newInv[i], item: e.target.value };
            setInventario(newInv);
          }} className="flex-1 bg-transparent outline-none text-sm font-bold smooth-input" placeholder="Item" />
          <div className="flex items-center gap-2 px-3 border-l border-zinc-800/20">
             <Sword size={12} className="opacity-30" />
             <input value={item.dano || ''} onChange={(e) => {
               const newInv = [...inventario];
               newInv[i] = { ...newInv[i], dano: e.target.value };
               setInventario(newInv);
             }} className="w-16 bg-transparent outline-none text-xs font-mono text-zinc-500 focus:text-zinc-300 placeholder:opacity-20 smooth-input" placeholder="Dano" />
          </div>
          <input type="number" value={item.qtd} onChange={(e) => {
            const newInv = [...inventario];
            newInv[i] = { ...newInv[i], qtd: e.target.value };
            setInventario(newInv);
          }} className="w-10 bg-transparent text-right outline-none text-sm font-black smooth-input" />
          <button onClick={() => setInventario(inventario.filter((_, idx) => idx !== i))} className="opacity-0 group-hover:opacity-100 text-red-900 transition-all duration-300 transform hover:scale-110"><Trash2 size={16}/></button>
        </div>
      ))}
      <button onClick={() => setInventario([...inventario, {item: '', qtd: 1, dano: ''}])} className="w-full py-6 border border-dashed border-zinc-800/20 text-[10px] font-mono opacity-20 hover:opacity-100 uppercase hover:border-zinc-500 transition-all duration-300">+ Adicionar Item</button>
    </div>
  );
};

export default InventoryTab;
