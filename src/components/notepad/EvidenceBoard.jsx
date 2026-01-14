import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { Link2, Trash2, ZoomIn, ZoomOut, RefreshCcw, Move, Unlink, User, MapPin, FileText, Pencil } from 'lucide-react';

const CREEPY_PHRASES = [
    "THEY ARE WATCHING", "DON'T LOOK BEHIND", "NULL POINTER", "IT'S IN THE WALLS",
    "WAKE UP", "0xDEADBEEF", "SYSTEM FAILURE", "NOT REAL", "RUN", "FATAL ERROR"
];

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

const NoteCard = ({ 
    note, scale, setNotes, connectingFrom, setConnectingFrom, 
    handleConnect, setIsPanningDisabled, sanidade
}) => {
    const isConnecting = connectingFrom === note.id;
    const isTarget = connectingFrom && connectingFrom !== note.id;
    
    const displayText = useGlitchText(note.content, sanidade);
    const [isTypingGlitch, setIsTypingGlitch] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const textareaRef = useRef(null);

    useEffect(() => {
        if (isEditing && textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    }, [note.content, isEditing]);

    return (
        <motion.div
            id={`note-${note.id}`}
            // VOLTANDO PARA O MOVIMENTO ORIGINAL (DRAG NATIVO)
            drag={!isEditing}
            dragMomentum={false}
            dragElastic={0}
            onDragStart={() => setIsPanningDisabled(true)}
            onDragEnd={(event, info) => {
                setIsPanningDisabled(false);
                // Atualiza a posição real no estado global
                const newX = note.x + info.offset.x / scale;
                const newY = note.y + info.offset.y / scale;
                setNotes(prev => prev.map(n => n.id === note.id ? { ...n, x: newX, y: newY } : n));
            }}
            initial={false}
            animate={{ 
                x: note.x,
                y: note.y,
                scale: isTarget ? 1.05 : 1,
                zIndex: isConnecting || isTarget || isEditing ? 50 : 20
            }}
            className={`absolute w-64 flex flex-col backdrop-blur-md border transition-colors duration-200
                ${isConnecting ? 'border-blue-500 bg-blue-900/30 ring-2 ring-blue-500/20' : 'border-zinc-800 bg-zinc-900/90'}
                ${isTypingGlitch ? 'ring-2 ring-red-600 bg-red-900/20' : ''}
            `}
            style={{ position: 'absolute', top: 0, left: 0 }}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => isTarget && handleConnect(note.id)}
        >
            <div className="h-8 px-3 flex items-center justify-between border-b border-zinc-800 bg-zinc-900/50 cursor-grab active:cursor-grabbing">
                <div className="flex items-center gap-2">
                    <Move size={12} className="text-zinc-600" />
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">{note.id.split('-')[1]}</span>
                </div>
                <div className="flex gap-1">
                    <button onClick={(e) => { e.stopPropagation(); setConnectingFrom(isConnecting ? null : note.id); }} className={`p-1 hover:text-blue-400 ${isConnecting ? 'text-blue-400' : ''}`} title="Conectar"><Link2 size={14} /></button>
                    <button onClick={(e) => { e.stopPropagation(); setIsEditing(!isEditing); }} className={`p-1 hover:text-emerald-400 ${isEditing ? 'text-emerald-400' : 'text-zinc-500'}`} title="Editar"><Pencil size={14} /></button>
                    <button onClick={(e) => { e.stopPropagation(); setNotes(prev => prev.filter(n => n.id !== note.id)); }} className="p-1 hover:text-red-400 text-zinc-500" title="Excluir"><Trash2 size={14} /></button>
                </div>
            </div>

            <div className="relative min-h-[140px] bg-black/20 overflow-hidden h-auto">
                {isEditing ? (
                    <textarea
                        ref={textareaRef}
                        autoFocus
                        value={note.content}
                        onChange={(e) => {
                            setNotes(prev => prev.map(n => n.id === note.id ? { ...n, content: e.target.value } : n));
                            if (sanidade <= 0) { setIsTypingGlitch(true); setTimeout(() => setIsTypingGlitch(false), 100); }
                        }}
                        onBlur={() => setIsEditing(false)}
                        className={`w-full p-3 bg-transparent outline-none resize-none text-sm font-mono leading-relaxed transition-colors ${isTypingGlitch ? 'text-red-600' : 'text-zinc-300'}`}
                        placeholder=">> INPUT"
                        spellCheck={false}
                    />
                ) : (
                    <div 
                        className={`w-full p-3 text-sm font-mono leading-relaxed whitespace-pre-wrap break-words ${isTypingGlitch || (sanidade <= 0 && displayText !== note.content) ? 'text-red-600 font-bold' : 'text-zinc-400'}`}
                        style={{ minHeight: '140px' }}
                    >
                        {renderHighlightedText(displayText) || <span className="opacity-20 italic">vazio</span>}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

const ConnectionLines = ({ notes, handleDisconnect }) => (
    <svg className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-visible z-10">
        {notes.map(note => (note.connections || []).map(targetId => {
            const target = notes.find(n => n.id === targetId);
            if (!target) return null;
            const sX = note.x + 128; const sY = note.y + 16;
            const eX = target.x + 128; const eY = target.y + 16;
            const mX = (sX + eX) / 2; const mY = (sY + eY) / 2;
            return (
                <g key={`${note.id}-${targetId}`} className="group pointer-events-auto">
                    <line x1={sX} y1={sY} x2={eX} y2={eY} stroke="#52525b" strokeWidth="2" className="transition-all group-hover:stroke-red-500 opacity-60 group-hover:opacity-100" strokeDasharray="5,5" />
                    <foreignObject x={mX - 10} y={mY - 10} width="20" height="20">
                        <div onClick={(e) => { e.stopPropagation(); handleDisconnect(note.id, targetId); }} className="w-5 h-5 bg-zinc-900 border border-zinc-600 rounded-full flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-900 hover:border-red-500">
                            <Unlink size={10} className="text-zinc-400 hover:text-white" />
                        </div>
                    </foreignObject>
                </g>
            );
        }))}
    </svg>
);

const EvidenceBoard = ({ notes, setNotes, sanidade }) => {
    const [connectingFrom, setConnectingFrom] = useState(null);
    const [isPanningDisabled, setIsPanningDisabled] = useState(false);

    const handleConnect = (targetId) => {
        if (connectingFrom && connectingFrom !== targetId) {
            setNotes(prev => prev.map(n => n.id === connectingFrom ? { ...n, connections: [...(n.connections || []), targetId] } : n));
            setConnectingFrom(null);
        }
    };

    return (
        <div className="w-full h-full bg-[#050505] relative overflow-hidden select-none group">
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] bg-repeat"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.9)_100%)]"></div>
            </div>

            <TransformWrapper
                initialScale={1} minScale={0.1} maxScale={4} centerOnInit={true}
                panning={{ disabled: isPanningDisabled }}
            >
                {({ zoomIn, zoomOut, resetTransform, state }) => (
                    <>
                        <div className="absolute top-6 left-6 z-50 flex flex-col gap-px bg-zinc-800 border border-zinc-700 shadow-xl">
                            <button onClick={() => zoomIn(0.2)} className="p-3 text-zinc-400 hover:text-emerald-400 transition-colors"><ZoomIn size={18} /></button>
                            <button onClick={() => zoomOut(0.2)} className="p-3 text-zinc-400 hover:text-emerald-400 transition-colors"><ZoomOut size={18} /></button>
                            <button onClick={() => resetTransform()} className="p-3 text-zinc-400 hover:text-emerald-400 transition-colors"><RefreshCcw size={18} /></button>
                        </div>
                        <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }} contentStyle={{ width: "100%", height: "100%" }}>
                            <div className="relative w-[8000px] h-[6000px] -translate-x-[3500px] -translate-y-[2500px]" onClick={() => setConnectingFrom(null)}>
                                <svg width="100%" height="100%" className="absolute inset-0 opacity-5">
                                    <defs>
                                        <pattern id="board-grid" width="100" height="100" patternUnits="userSpaceOnUse">
                                            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="white" strokeWidth="1"/>
                                        </pattern>
                                    </defs>
                                    <rect width="100%" height="100%" fill="url(#board-grid)" />
                                </svg>

                                <ConnectionLines notes={notes} handleDisconnect={(s, t) => setNotes(prev => prev.map(n => n.id === s ? { ...n, connections: n.connections.filter(id => id !== t) } : n))} />
                                {notes.map(note => (
                                    <NoteCard key={note.id} note={note} scale={state?.scale || 1} setNotes={setNotes} connectingFrom={connectingFrom} setConnectingFrom={setConnectingFrom} handleConnect={handleConnect} setIsPanningDisabled={setIsPanningDisabled} sanidade={sanidade} />
                                ))}
                            </div>
                        </TransformComponent>
                    </>
                )}
            </TransformWrapper>
        </div>
    );
};

export default EvidenceBoard;
