import React, { useState, useEffect } from 'react';

const AchievementNotification = ({ achievementName, achievementData }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (achievementName && achievementData) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, 4000); // Notification visible for 4 seconds
      return () => clearTimeout(timer);
    }
  }, [achievementName, achievementData]);

  if (!visible || !achievementData) {
    return null;
  }

  return (
    <div className="fixed bottom-8 right-8 z-[2000] flex items-center gap-4 p-4 rounded-none shadow-2xl bg-zinc-900 border border-amber-400/50 animate-[slide-in_0.5s_cubic-bezier(0.25,1,0.5,1)_forwards,slide-out_0.5s_cubic-bezier(0.5,0,0.75,0)_4s_forwards]">
      <style>{`
        @keyframes slide-in {
          from { transform: translateX(120%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slide-out {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(120%); opacity: 0; }
        }
      `}</style>
      <span className="text-5xl">{achievementData.icon}</span>
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-amber-400">Conquista Desbloqueada</p>
        <h3 className="font-bold text-lg text-white">{achievementName}</h3>
      </div>
    </div>
  );
};

export default AchievementNotification;
