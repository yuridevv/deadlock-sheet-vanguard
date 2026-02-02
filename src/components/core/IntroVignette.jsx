import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function IntroVignette({ onComplete }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const sequence = [
      { time: 500, action: () => setStep(1) }, // INITIALIZING
      { time: 1200, action: () => setStep(2) }, // CONNECTING
      { time: 1800, action: () => setStep(3) }, // VERIFYING
      { time: 2400, action: () => setStep(4) }, // ACCESS GRANTED
      { time: 3000, action: () => onComplete() } // Fade out
    ];

    let timeouts = [];
    let accumulatedTime = 0;

    sequence.forEach(({ time, action }) => {
      accumulatedTime = time;
      timeouts.push(setTimeout(action, accumulatedTime));
    });

    return () => timeouts.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-[#050505] flex items-center justify-center font-mono text-zinc-400 select-none cursor-wait"
      exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
    >
      <div className="w-full max-w-md p-8 relative">
        {/* Scanline Effect */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,6px_100%] opacity-20" />
        
        <div className="space-y-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-end border-b border-zinc-800 pb-2 mb-8"
          >
            <span className="text-xs tracking-[0.2em] text-zinc-600">DEADLOCK OS v8.2</span>
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-red-900/50 rounded-none animate-pulse" />
              <div className="w-2 h-2 bg-zinc-800 rounded-none" />
              <div className="w-2 h-2 bg-zinc-800 rounded-none" />
            </div>
          </motion.div>

          <div className="h-32 font-bold text-sm space-y-2">
            <AnimatePresence mode='popLayout'>
              {step >= 0 && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }} 
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3 text-zinc-500"
                >
                  <span>&gt;</span> INITIALIZING CORE MODULES...
                </motion.div>
              )}
              {step >= 1 && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }} 
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3 text-zinc-400"
                >
                  <span>&gt;</span> ESTABLISHING SECURE HANDSHAKE...
                  <span className="animate-pulse">_</span>
                </motion.div>
              )}
              {step >= 2 && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }} 
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3 text-zinc-300"
                >
                  <span>&gt;</span> DECRYPTING DOSSIER FILES...
                </motion.div>
              )}
              {step >= 3 && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }} 
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-3 text-red-500 mt-4 tracking-widest"
                >
                  <span>&gt;</span> ACCESS GRANTED
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.div 
            className="h-1 bg-zinc-900 overflow-hidden mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div 
              className="h-full bg-red-900/60"
              initial={{ width: "0%" }}
              animate={{ width: step === 4 ? "100%" : `${step * 25}%` }}
              transition={{ duration: 0.5, ease: "circOut" }}
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
