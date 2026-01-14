import React from 'react';

const DisplayedAchievements = ({ achievements }) => {
  const unlockedAchievements = Object.entries(achievements || {}).filter(([, ach]) => ach.unlocked);

  if (unlockedAchievements.length === 0) {
    return null; // Don't render the section if there are no achievements
  }

  return (
    <section className="mt-8 border-t border-b border-zinc-800/20 py-4">
        <h3 className="text-[10px] font-black opacity-30 uppercase tracking-widest mb-4 font-mono text-center">CONQUISTAS DESBLOQUEADAS</h3>
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-2">
            {unlockedAchievements.map(([name, ach]) => (
                <div key={name} className="relative group flex items-center justify-center"
                     title={`${name}: ${ach.description}`} // Fallback for browsers
                >
                   <span className="text-3xl cursor-default transition-transform duration-200 hover:scale-125">{ach.icon}</span>
                   {/* Custom Tooltip */}
                   <div className="absolute bottom-full mb-3 w-max max-w-xs p-3 
                               bg-zinc-900 border border-zinc-700 rounded-md shadow-lg 
                               text-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none
                               transform translate-y-2 group-hover:translate-y-0 duration-200">
                        <h4 className="font-bold text-amber-300 text-sm">{name}</h4>
                        <p className="text-xs text-zinc-300">{ach.description}</p>
                        <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-zinc-700"></div>
                   </div>
                </div>
            ))}
        </div>
    </section>
  );
};

export default DisplayedAchievements;
