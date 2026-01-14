import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, X, Network, Trash2, Search, Terminal, User, MapPin, FileText, Pencil } from 'lucide-react';
import EvidenceBoard from './EvidenceBoard';
import ErrorBoundary from '../core/ErrorBoundary';

const renderHighlightedText = (text) => {
    if (!text) return null;
    const regex = /([#@!][\w\u00C0-\u00FF]+)/g;
    const parts = text.split(regex);
    return parts.map((part, index) => {
        if (part.startsWith('#')) return <span key={index} className="inline-flex items-center text-purple-400 font-bold mx-0.5"><User size={10} className="mr-1 opacity-70" />{part}</span>;
        if (part.startsWith('@')) return <span key={index} className="inline-flex items-center text-emerald-400 font-bold mx-0.5"><MapPin size={10} className="mr-1 opacity-70" />{part}</span>;
        if (part.startsWith('!')) return <span key={index} className="inline-flex items-center text-red-400 font-bold mx-0.5"><FileText size={10} className="mr-1 opacity-70" />{part}</span>;
        return part;
    });
};

const CREEPY_PHRASES = [
    "THEY ARE WATCHING", "DON'T LOOK BEHIND", "NULL POINTER", "IT'S IN THE WALLS",
    "WAKE UP", "0xDEADBEEF", "SYSTEM FAILURE", "NOT REAL", "RUN", "FATAL ERROR"
];

const useGlitchText = (originalText, sanidade) => {
    const [displayText, setDisplayText] = useState(originalText);
    useEffect(() => { setDisplayText(originalText); }, [originalText]);
    useEffect(() => {
        if (sanidade > 0) { setDisplayText(originalText); return; }
        const interval = setInterval(() => {
            if (Math.random() > 0.7) { 
                const phrase = CREEPY_PHRASES[Math.floor(Math.random() * CREEPY_PHRASES.length)];
                setDisplayText(phrase);
                setTimeout(() => { setDisplayText(originalText); }, Math.random() * 800 + 200);
            }
        }, 2000);
        return () => clearInterval(interval);
    }, [sanidade, originalText]);
    return displayText;
};

const NoteListItem = ({ note, updateNoteContent, deleteNote, sanidade, darkMode }) => {
    const displayText = useGlitchText(note.content, sanidade);
    const [isTypingGlitch, setIsTypingGlitch] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const textareaRef = useRef(null);

    // Auto-grow logic
    useEffect(() => {
        if (isEditing && textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    }, [note.content, isEditing]);

    const handleInput = (e) => {
        updateNoteContent(note.id, e.target.value);
        if (sanidade <= 0) {
            setIsTypingGlitch(true);
            setTimeout(() => setIsTypingGlitch(false), 150);
        }
    };

    return (
        <motion.div 
            layoutId={note.id}
            className={`group relative border p-3 transition-all flex-shrink-0 ${
                darkMode ? 'bg-zinc-900/40 border-zinc-800' : 'bg-white/60 border-zinc-300'
            }`}
        >
            <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity z-20 flex gap-1">
                <button onClick={() => setIsEditing(!isEditing)} className="text-zinc-400 hover:text-emerald-500"><Pencil size={12} /></button>
                <button onClick={() => deleteNote(note.id)} className="text-zinc-400 hover:text-red-500"><Trash2 size={12} /></button>
            </div>
            <div className="mb-2 flex items-center gap-2">
                <div className={`w-1 h-1 ${sanidade <= 0 ? 'bg-red-500 animate-pulse' : 'bg-emerald-500/50'}`} />
                <span className="text-[10px] font-mono uppercase text-zinc-500">{note.id.split('-')[1]}</span>
            </div>
            
            <div className="relative min-h-[60px] h-auto cursor-text" onClick={() => { if(!isEditing) setIsEditing(true); }}>
                {isEditing ? (
                    <textarea
                        ref={textareaRef}
                        autoFocus
                        value={note.content}
                        onChange={handleInput}
                        onBlur={() => setIsEditing(false)}
                        className={`w-full bg-transparent outline-none resize-none text-sm font-mono leading-relaxed transition-colors block overflow-hidden ${darkMode ? 'text-zinc-300' : 'text-zinc-800'} ${isTypingGlitch ? 'text-red-600' : ''}`}
                        placeholder=">> INPUT"
                        spellCheck={false}
                    />
                ) : (
                    <div 
                        className={`w-full text-sm font-mono leading-relaxed whitespace-pre-wrap break-words ${isTypingGlitch || (sanidade <= 0 && displayText !== note.content) ? 'text-red-600 font-bold' : darkMode ? 'text-zinc-400' : 'text-zinc-700'}`}
                        style={{ minHeight: '60px' }}
                    >
                        {renderHighlightedText(displayText) || <span className="opacity-20 italic">vazio</span>}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

const Notepad = ({ isNotepadOpen, setIsNotepadOpen, notes, setNotes, sanidade, darkMode }) => {
  const [mode, setMode] = useState('notes'); 
  const [search, setSearch] = useState('');

  const addNote = () => {
    const newNote = { id: `${Date.now()}-${Math.random().toString(36).substr(2, 5)}`, content: '', x: 4000, y: 3000, connections: [] };
    setNotes(prev => [...prev, newNote]);
  };

  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const updateNoteContent = (id, content) => {
    setNotes(prev => prev.map(note => (note.id === id ? { ...note, content } : note)));
  };

  const filteredNotes = notes.filter(n => n.content.toLowerCase().includes(search.toLowerCase()));

  const variants = {
    initial: { opacity: 0, clipPath: 'inset(0 0 100% 0)' },
    animate: { opacity: 1, clipPath: 'inset(0 0 0% 0)', transition: { duration: 0.4, ease: "circOut" } },
    exit: { opacity: 0, clipPath: 'inset(100% 0 0 0)', transition: { duration: 0.3 } }
  };

  return (
    <AnimatePresence>
      {isNotepadOpen && (
        <motion.div
          variants={variants} initial="initial" animate="animate" exit="exit"
          className={`fixed z-50 border flex flex-col overflow-hidden rounded-none shadow-2xl ${
            darkMode ? 'bg-[#0a0a0a] border-zinc-800 text-zinc-200' : 'bg-[#f4f1ea] border-zinc-300 text-zinc-800'
          } ${mode === 'evidence' ? 'inset-4 md:inset-8' : 'bottom-24 right-6 w-[400px] h-[600px]'}`}
        >
          {/* Header (Fixo) */}
          <div className={`flex-none flex items-center justify-between px-4 py-3 border-b ${darkMode ? 'border-zinc-800 bg-zinc-900/90' : 'border-zinc-300 bg-zinc-100/90'}`}>
            <div className="flex border p-0.5 gap-px">
              <button onClick={() => setMode('notes')} className={`px-4 py-1.5 text-[10px] font-mono uppercase ${mode === 'notes' ? (darkMode ? 'bg-zinc-800 text-emerald-400' : 'bg-zinc-200 text-emerald-700') : 'text-zinc-500'}`}>ANOTAÇÕES</button>
              <button onClick={() => setMode('evidence')} className={`px-4 py-1.5 text-[10px] font-mono uppercase ${mode === 'evidence' ? (darkMode ? 'bg-zinc-800 text-blue-400' : 'bg-zinc-200 text-blue-700') : 'text-zinc-500'}`}>QUADRO</button>
            </div>
            <div className="flex gap-2">
                <button onClick={addNote} className="p-2 text-zinc-500 hover:text-emerald-500"><Plus size={16} /></button>
                <button onClick={() => setIsNotepadOpen(false)} className="p-2 text-zinc-500 hover:text-red-500"><X size={16} /></button>
            </div>
          </div>

          {/* Área Principal (Flexível) */}
          <div className="flex-1 relative overflow-hidden flex flex-col min-h-0">
            <AnimatePresence mode="wait">
                {mode === 'notes' ? (
                    <motion.div 
                        key="notes"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.2 }}
                        className="flex-1 flex flex-col min-h-0 h-full"
                    >
                        {/* Barra de Busca (Fixa) */}
                        <div className={`flex-none p-4 border-b ${darkMode ? 'border-zinc-800' : 'border-zinc-200'}`}>
                            <div className="relative group">
                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="BUSCAR..." className={`w-full border py-2 pl-9 pr-4 text-xs font-mono focus:outline-none ${darkMode ? 'bg-black border-zinc-800' : 'bg-white border-zinc-300'}`} />
                            </div>
                        </div>
                        
                        {/* Lista com Scroll (Flexível) */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                            {filteredNotes.map(note => (
                                <NoteListItem key={note.id} note={note} updateNoteContent={updateNoteContent} deleteNote={deleteNote} sanidade={sanidade} darkMode={darkMode} />
                            ))}
                        </div>

                        {/* Rodapé (Fixo) */}
                        <div className={`flex-none p-2 border-t text-[10px] font-mono flex justify-around items-center ${darkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-500' : 'bg-zinc-100 border-zinc-300 text-zinc-600'}`}>
                            <div className="flex items-center gap-1"><span className="text-purple-500 font-bold">#</span> <span>NPC</span></div>
                            <div className="flex items-center gap-1"><span className="text-emerald-500 font-bold">@</span> <span>Local</span></div>
                            <div className="flex items-center gap-1"><span className="text-red-500 font-bold">!</span> <span>Pista</span></div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div 
                        key="evidence"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0"
                    >
                        <ErrorBoundary><EvidenceBoard notes={notes} setNotes={setNotes} sanidade={sanidade} /></ErrorBoundary>
                    </motion.div>
                )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Notepad;