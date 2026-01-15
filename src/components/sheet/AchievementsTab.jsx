import React from 'react';

const AchievementsTab = ({ achievements, setAchievements }) => {
  const toggleAchievement = (name) => {
    setAchievements(prev => ({
      ...prev,
      [name]: { ...prev[name], unlocked: !prev[name].unlocked }
    }));
  };

  return (
    <div className="animate-[fadeIn_0.3s_ease-out]">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(achievements).map(([name, ach]) => (
          <div 
            key={name} 
            onClick={() => toggleAchievement(name)}
            className={`p-6 flex flex-col items-center justify-center text-center border rounded-none transition-all duration-300 cursor-pointer group relative
            ${ach.unlocked 
              ? 'border-amber-400/30 bg-amber-950/10 shadow-lg shadow-amber-950/20 hover:border-amber-400/60 hover:bg-amber-950/30' 
              : 'border-zinc-800 bg-zinc-900/40 grayscale hover:grayscale-0 hover:bg-zinc-800/80 hover:border-zinc-700'
            }`}
          >
            <div className={`absolute -top-4 bg-zinc-800 border ${ach.unlocked ? 'border-amber-500/50' : 'border-zinc-700'} px-2 py-0.5 rounded-none text-xs font-bold ${ach.unlocked ? 'text-amber-400' : 'text-zinc-400'} transition-all`}>
              {ach.unlocked ? 'DESBLOQUEADA' : 'BLOQUEADA'}
            </div>
            
            <span className="text-6xl mb-4 transition-transform duration-300 group-hover:scale-110">{ach.icon}</span>
            
            <h3 className={`font-bold text-lg mb-1 ${ach.unlocked ? 'text-amber-300' : 'text-zinc-300'}`}>
              {name}
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {ach.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AchievementsTab;