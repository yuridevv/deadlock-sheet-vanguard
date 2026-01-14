import React from 'react';
import { Plus, Minus } from '../icons';

const StatusBar = ({
  icon,
  label,
  value,
  maxValue,
  onValueChange,
  onMaxValueChange,
  onAdjust,
  barColor,
  hoverBorderColor,
  hoverTextColor,
  isInsane,
  effectsEnabled
}) => {
  const percentage = maxValue > 0 ? Math.min((value / maxValue) * 100, 100) : 0;
  
  const labelClasses = `text-[10px] font-black uppercase tracking-widest font-mono flex items-center gap-2 transition-colors ${
    (isInsane && effectsEnabled) ? 'text-purple-500 animate-pulse' : hoverTextColor
  }`;
  
  const valueInputClasses = `w-12 bg-transparent text-2xl text-right outline-none font-serif hover:text-white transition-colors ${
    (isInsane && effectsEnabled) ? 'text-purple-500' : ''
  }`;
  
  const barClasses = `h-full transition-all duration-500 ease-out ${
    (isInsane && effectsEnabled) ? 'bg-purple-600' : barColor
  }`;

  return (
    <div className="space-y-4 group">
      <div className="flex justify-between items-end mb-2">
        <label className={labelClasses}>
          {icon} {label}
        </label>
        <div className="flex items-center gap-3">
          <button onClick={() => onAdjust(-1)} className={`p-1 border border-zinc-800 opacity-40 hover:opacity-100 ${hoverBorderColor} transition-all duration-300`}><Minus size={12}/></button>
          <div className="flex items-center gap-1 font-serif">
            <input 
              type="number" 
              value={value} 
              onChange={onValueChange} 
              className={valueInputClasses}
              placeholder="0"
            />
            <span className="text-zinc-700">/</span>
            {onMaxValueChange ? (
              <input 
                type="number" 
                value={maxValue} 
                onChange={onMaxValueChange} 
                className="w-12 bg-transparent text-lg text-zinc-600 outline-none font-serif hover:text-white transition-colors" 
              />
            ) : (
              <span className="text-lg text-zinc-600">{maxValue}</span>
            )}
          </div>
          <button onClick={() => onAdjust(1)} className={`p-1 border border-zinc-800 opacity-40 hover:opacity-100 ${hoverBorderColor} transition-all duration-300`}><Plus size={12}/></button>
        </div>
      </div>
      <div className="h-1 bg-zinc-900 w-full overflow-hidden rounded-full">
        <div className={barClasses} style={{width: `${percentage}%`}}></div>
      </div>
    </div>
  );
};

export default StatusBar;
