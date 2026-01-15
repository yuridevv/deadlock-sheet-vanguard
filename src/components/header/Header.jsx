import React, { useRef } from 'react';
import { Upload, Download, Moon, Sun, Skull, Zap, Notebook, Info } from 'lucide-react';

export default function Header({ 
    effectsEnabled, 
    setEffectsEnabled, 
    exportarFicha, 
    fileInputRef, 
    darkMode, 
    setDarkMode, 
    setIsDead,
    isNotepadOpen,
    setIsNotepadOpen
}) {
    return (
        <header className="mb-12 relative">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pt-10 px-2 relative z-10">
                <div className="space-y-2">
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase relative inline-block group cursor-default">
                        <span className="relative z-10">DEADLOCK</span>
                        <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-red-900 via-transparent to-transparent group-hover:via-red-800 transition-all duration-500"></span>
                        <span className="text-xs absolute -top-3 left-1 font-mono text-zinc-500 tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-opacity duration-500">VANGUARD</span>
                    </h1>
                    <div className="flex items-center gap-3 text-xs font-mono tracking-widest text-zinc-500">
                        <span>OPERATIONAL_OS_V8.1</span>
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 md:gap-3">
                    {/* Botão de Notepad */}
                    <button 
                        onClick={() => setIsNotepadOpen(!isNotepadOpen)} 
                        className={`p-2.5 rounded-lg border transition-all duration-300 relative group overflow-hidden ${isNotepadOpen ? 'bg-zinc-800 text-emerald-400 border-emerald-500/50' : 'bg-transparent text-zinc-500 border-zinc-700/50 hover:border-zinc-500 hover:text-zinc-300'}`}
                        title="Abrir Sistema de Dados (Notas)"
                    >
                        <Notebook size={18} />
                        <div className="absolute top-full right-0 mt-2 w-64 bg-zinc-900/95 border border-zinc-700 p-3 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50 text-left backdrop-blur-md">
                            <p className="text-[10px] font-bold text-zinc-400 mb-2 uppercase tracking-wider flex items-center gap-1">
                                <Info size={10} /> Sintaxe de Dados
                            </p>
                            <ul className="space-y-1 text-xs font-mono">
                                <li className="text-zinc-500"><span className="text-purple-400">#NPC</span> - Personagens</li>
                                <li className="text-zinc-500"><span className="text-emerald-400">@Local</span> - Localizações</li>
                                <li className="text-zinc-500"><span className="text-red-400">!Pista</span> - Evidências</li>
                            </ul>
                        </div>
                    </button>

                    <div className="w-px h-8 bg-zinc-800 mx-1 hidden md:block" />

                    <button onClick={() => fileInputRef.current.click()} className="p-2.5 rounded-lg border border-zinc-700/50 hover:border-zinc-500 text-zinc-500 hover:text-zinc-300 bg-transparent transition-all duration-300" title="Importar Ficha (JSON)">
                        <Upload size={18} />
                    </button>
                    
                    <button onClick={exportarFicha} className="p-2.5 rounded-lg border border-zinc-700/50 hover:border-zinc-500 text-zinc-500 hover:text-zinc-300 bg-transparent transition-all duration-300" title="Exportar Ficha">
                        <Download size={18} />
                    </button>

                    <div className="w-px h-8 bg-zinc-800 mx-1 hidden md:block" />

                    <button onClick={() => setDarkMode(!darkMode)} className="p-2.5 rounded-lg border border-zinc-700/50 hover:border-zinc-500 text-zinc-500 hover:text-zinc-300 bg-transparent transition-all duration-300" title="Alternar Tema">
                        {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                    </button>
                    
                    <button onClick={() => setEffectsEnabled(!effectsEnabled)} className={`p-2.5 rounded-lg border transition-all duration-300 ${effectsEnabled ? 'text-zinc-400 border-zinc-600 bg-zinc-800/50' : 'text-zinc-600 border-zinc-800 hover:text-zinc-400'}`} title="Alternar Efeitos Visuais">
                        <Zap size={18} className={effectsEnabled ? "fill-current" : ""} />
                    </button>

                    <button 
                        onClick={() => setIsDead(true)} 
                        className="p-2.5 rounded-lg border border-red-900/30 hover:border-red-600 text-red-900/50 hover:text-red-600 hover:bg-red-950/30 transition-all duration-300 group" 
                        title="Registrar Óbito"
                    >
                        <Skull size={18} className="group-hover:animate-pulse" />
                    </button>
                </div>
            </div>
        </header>
    );
}