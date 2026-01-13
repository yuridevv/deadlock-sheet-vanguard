import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, Dice5, Sun, Moon, HeartPulse, ScrollText, Skull, 
  Trash2, Crosshair, Download, Upload, Plus, Minus,
  Brain, Users, Eye, Camera, Star, Wind, ImageIcon, Sword, Zap, ZapOff
} from 'lucide-react';

// --- Componente de Partículas ---
const ParticleField = ({ isCritical, darkMode }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const particles = [];
    const particleCount = 60;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
          this.reset();
        }
      }
      draw() {
        ctx.fillStyle = isCritical ? `rgba(220, 38, 38, ${this.opacity})` : (darkMode ? `rgba(255, 255, 255, ${this.opacity})` : `rgba(0, 0, 0, ${this.opacity})`);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) particles.push(new Particle());

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    resize();
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, [isCritical, darkMode]);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-40 transition-opacity duration-500" />;
};

const AnimatedNumber = ({ value, className }) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (value !== displayValue) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setDisplayValue(value);
        setIsAnimating(false);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [value, displayValue]);

  return (
    <span className={`inline-block transition-all duration-300 transform ${isAnimating ? 'opacity-50 blur-[1px]' : 'opacity-100 blur-0'} ${className}`}>
      {displayValue}
    </span>
  );
};

export default function VanguardDossierV7() {
  // --- INICIALIZAÇÃO SEGURA DO STORAGE ---
  const getSaved = () => {
    const saved = localStorage.getItem('vanguard_sheet_data_v8');
    return saved ? JSON.parse(saved) : {};
  };
  const initial = getSaved();

  const [nome, setNome] = useState(initial.nome || '');
  const [persona, setPersona] = useState(initial.persona || '');
  const [background, setBackground] = useState(initial.background || '');
  const [nivel, setNivel] = useState(initial.nivel || '01');
  const [idade, setIdade] = useState(initial.idade || '');
  const [arquetipo, setArquetipo] = useState(initial.arquetipo || '');
  const [bio, setBio] = useState(initial.bio || '');
  const [aparencia, setAparencia] = useState(initial.aparencia || '');
  const [lacos, setLacos] = useState(initial.lacos || '');
  const [imagem, setImagem] = useState(initial.imagem || null); 
  
  const [vigor, setVigor] = useState(initial.vigor ?? 20);
  const [vigorMax, setVigorMax] = useState(initial.vigorMax ?? 20);
  const [folego, setFolego] = useState(initial.folego ?? 12);
  const [sanidade, setSanidade] = useState(initial.sanidade ?? 12);
  const [fadiga, setFadiga] = useState(initial.fadiga ?? 0);

  const [attrs, setAttrs] = useState(initial.attrs || {
    Fisico: 0, Destreza: 0, Vontade: 0, Intelecto: 0, Instinto: 0, Presenca: 0
  });
  const [inventario, setInventario] = useState(initial.inventario || [{ item: '', qtd: 1, dano: '' }]);
  const [habilidades, setHabilidades] = useState(initial.habilidades || [{ id: 1, nome: '', rank: '-' }]);

  // NOVOS ESTADOS
  const [activeTab, setActiveTab] = useState('dossie');
  const [darkMode, setDarkMode] = useState(initial.darkMode ?? true);
  const [effectsEnabled, setEffectsEnabled] = useState(initial.effectsEnabled ?? true);
  const [resultado, setResultado] = useState(null);
  const [rollDetails, setRollDetails] = useState({ source: 'D12', mod: 0 });
  const [isDead, setIsDead] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  // --- SALVAMENTO AUTOMÁTICO ---
  useEffect(() => {
    const dataToSave = {
      nome, persona, background, nivel, idade, arquetipo, bio, aparencia, lacos,
      imagem, vigor, vigorMax, folego, sanidade, fadiga, attrs, inventario, habilidades,
      darkMode, effectsEnabled
    };
    localStorage.setItem('vanguard_sheet_data_v8', JSON.stringify(dataToSave));
  }, [nome, persona, background, nivel, idade, arquetipo, bio, aparencia, lacos, imagem, vigor, vigorMax, folego, sanidade, fadiga, attrs, inventario, habilidades, darkMode, effectsEnabled]);

  const penalidade = Number(fadiga);
  const isCritical = fadiga === 3; 
  const isInsane = sanidade <= 0;   
  const defesaBase = 6 + Number(attrs.Fisico);
  const reflexoBase = Math.max(Number(attrs.Destreza), Number(attrs.Instinto));

  useEffect(() => { 
    setTimeout(() => setShowContent(true), 100); 
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagem(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const adjust = (val, set, mod) => {
    let next = Number(val) + mod;
    if (next < 0) next = 0;
    set(next);
  };

  const handleStatusChange = (e, setter) => {
    const val = e.target.value;
    if (val === '') { setter(''); return; }
    const num = parseInt(val, 10);
    if (!isNaN(num)) setter(num);
  };

  const rolarAtributo = (attrName, valorAtributo) => {
    const dado = Math.floor(Math.random() * 12) + 1;
    const mod = Number(valorAtributo) - penalidade;
    setResultado(dado + mod);
    setRollDetails({ source: attrName, mod: mod });
  };

  const exportarFicha = () => {
    const dados = {
      version: "7.8_STABLE",
      perfil: { nome, persona, background, nivel, idade, arquetipo, bio, aparencia, lacos, imagem },
      atributos: attrs,
      status: { fadiga, vigor, vigorMax, folego, sanidade },
      habilidades, inventario
    };
    const blob = new Blob([JSON.stringify(dados, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `DOSSIER_${nome || 'INVESTIGADOR'}.json`;
    a.click();
  };

  const importarFicha = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const json = JSON.parse(ev.target.result);
        if(json.perfil) {
          setNome(json.perfil.nome || ''); setPersona(json.perfil.persona || '');
          setBackground(json.perfil.background || ''); setNivel(json.perfil.nivel || '');
          setIdade(json.perfil.idade || ''); setArquetipo(json.perfil.arquetipo || '');
          setBio(json.perfil.bio || ''); setAparencia(json.perfil.aparencia || '');
          setLacos(json.perfil.lacos || ''); setImagem(json.perfil.imagem || null);
        }
        if(json.atributos) setAttrs(json.atributos);
        if(json.status) {
          setFadiga(json.status.fadiga || 0); setVigor(json.status.vigor || 0);
          setVigorMax(json.status.vigorMax || 20);
          setFolego(json.status.folego || 0); setSanidade(json.status.sanidade || 0);
        }
        setHabilidades(json.habilidades || []);
        setInventario(json.inventario || []);
      } catch (err) { alert("Erro no JSON."); }
    };
    reader.readAsText(file);
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 p-4 md:p-8 font-sans overflow-x-hidden relative rounded-none selection:bg-red-900 selection:text-white
      ${darkMode ? 'bg-[#050505] text-zinc-300' : 'bg-[#f4f1ea] text-zinc-800'}
      ${isInsane && effectsEnabled ? 'animate-flicker-screen' : ''} 
    `}>
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@300;400;700;900&family=JetBrains+Mono&display=swap');
        .font-serif { font-family: 'Playfair Display', serif; }
        .font-inter { font-family: 'Inter', sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }

        input[type=number]::-webkit-inner-spin-button, 
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }

        .crt-overlay {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%), 
                      linear-gradient(90deg, rgba(255, 0, 0, 0.02), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.02));
          background-size: 100% 3px, 3px 100%; z-index: 100; pointer-events: none; opacity: 0.6;
        }

        @keyframes scanline-roll { 0% { transform: translateY(-100%); } 100% { transform: translateY(100%); } }
        .scanline-moving {
          position: fixed; top: 0; left: 0; width: 100%; height: 100px;
          background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.02), transparent);
          z-index: 102; pointer-events: none; animation: scanline-roll 10s linear infinite;
        }

        .bg-glow {
          position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
          width: 80vw; height: 80vh; border-radius: 10%; filter: blur(150px);
          z-index: -1; transition: background-color 0.8s cubic-bezier(0.4, 0, 0.2, 1); opacity: 0.12;
        }

        @keyframes death-fade-in {
          0% { opacity: 0; backdrop-filter: blur(0px); transform: scale(1.02); }
          100% { opacity: 1; backdrop-filter: blur(8px); transform: scale(1); }
        }
        @keyframes skull-enter-smooth {
          0% { opacity: 0; transform: scale(0.8) translateY(20px); filter: brightness(0) blur(10px); }
          100% { opacity: 1; transform: scale(1) translateY(0); filter: brightness(1.2) drop-shadow(0 0 30px #ff0000) blur(0); }
        }
        @keyframes text-enter-slide {
           0% { opacity: 0; transform: translateY(10px); }
           100% { opacity: 1; transform: translateY(0); }
        }

        .animate-death-screen { animation: death-fade-in 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-skull-smooth { animation: skull-enter-smooth 1s cubic-bezier(0.22, 1, 0.36, 1) forwards; animation-delay: 0.2s; opacity: 0; }
        .animate-text-enter { animation: text-enter-slide 0.8s ease-out forwards; animation-delay: 0.5s; opacity: 0; }

        .siren-active { animation: sirenRed 2s infinite ease-in-out; }
        @keyframes sirenRed {
          0%, 100% { box-shadow: inset 0 0 0px rgba(220, 0, 0, 0); }
          50% { box-shadow: inset 0 0 150px rgba(180, 0, 0, 0.25); }
        }

        @keyframes alarm-pulse-overlay {
            0%, 100% { background-color: rgba(60, 0, 0, 0); }
            50% { background-color: rgba(120, 0, 0, 0.12); }
        }
        .alarm-overlay-active {
            animation: alarm-pulse-overlay 2s infinite ease-in-out;
            pointer-events: none; position: fixed; inset: 0; z-index: 99;
        }

        @keyframes flicker-animation {
            0% { opacity: 1; filter: brightness(1); }
            2% { opacity: 0.9; filter: brightness(0.9); }
            4% { opacity: 1; filter: brightness(1); }
            5% { opacity: 0.3; filter: brightness(0.4); }
            6% { opacity: 1; filter: brightness(1); }
            12% { opacity: 1; filter: brightness(1); }
            13% { opacity: 0.1; filter: brightness(0.2); }
            14% { opacity: 1; filter: brightness(1); }
            100% { opacity: 1; filter: brightness(1); }
        }
        .animate-flicker-screen { animation: flicker-animation 8s infinite; }

        .smooth-input { transition: color 0.2s, border-color 0.2s, background-color 0.2s, transform 0.1s; }
        .smooth-input:focus { transform: translateY(-1px); }
      `}</style>

      {effectsEnabled && <ParticleField isCritical={isCritical} darkMode={darkMode} />}
      {effectsEnabled && <div className="crt-overlay pointer-events-none"></div>}
      {effectsEnabled && <div className="scanline-moving"></div>}
      <div className="bg-glow" style={{ backgroundColor: (isCritical && effectsEnabled) ? '#440000' : '#111111' }}></div>
      
      {isCritical && effectsEnabled && <div className="alarm-overlay-active"></div>}
      {isCritical && effectsEnabled && <div className="fixed inset-0 pointer-events-none z-[101] siren-active"></div>}

      {isDead && (
        <div className="fixed inset-0 z-[1000] flex flex-col items-center justify-center p-6 text-center bg-black/90 animate-death-screen rounded-none">
          <div className="animate-skull-smooth text-red-600 mb-8">
            <Skull size={180} strokeWidth={0.5} />
          </div>
          <div className="animate-text-enter">
            <h1 className="font-serif text-5xl md:text-7xl mb-4 text-zinc-100 tracking-tighter">MORTO</h1>
            <p className="font-mono text-red-900 tracking-[0.5em] uppercase text-xs mb-12">System Failure // Character Dead</p>
            <button onClick={() => setIsDead(false)} className="px-12 py-4 border border-zinc-800 hover:border-red-600 text-zinc-500 hover:text-red-600 transition-all duration-300 font-mono uppercase text-[10px] tracking-widest hover:bg-red-950/10">
              REVIVER PERSONAGEM
            </button>
          </div>
        </div>
      )}

      <div className={`max-w-6xl mx-auto relative z-10 transition-opacity duration-700 ease-out ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        
        <header className="flex justify-between items-center mb-16">
          <div className="flex items-center gap-6 group">
            <div className="p-4 border border-zinc-800/40 bg-zinc-900/10 transition-all duration-300 group-hover:border-zinc-600">
              <Camera size={24} className="text-zinc-600 transition-colors group-hover:text-zinc-400" />
            </div>
            <div>
              <h2 className="text-[10px] font-black tracking-[0.5em] opacity-30 uppercase font-mono transition-opacity group-hover:opacity-50">DEADLOCK SHEET</h2>
              <p className="text-[9px] font-bold opacity-20 uppercase font-mono">Archive 0.7.8 // VANGUARD</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setEffectsEnabled(!effectsEnabled)} title="Alternar Efeitos de Luz" className={`p-3 border border-zinc-800/30 transition-all duration-200 ${effectsEnabled ? 'text-zinc-200 bg-zinc-800' : 'text-zinc-600 hover:text-zinc-400'}`}>
              {effectsEnabled ? <Zap size={18}/> : <ZapOff size={18}/>}
            </button>
            <button onClick={exportarFicha} className="p-3 border border-zinc-800/30 hover:bg-zinc-800 transition-all duration-200 text-zinc-500 hover:text-zinc-200"><Download size={18}/></button>
            <button onClick={() => fileInputRef.current.click()} className="p-3 border border-zinc-800/30 hover:bg-zinc-800 transition-all duration-200 text-zinc-500 hover:text-zinc-200"><Upload size={18}/></button>
            <button onClick={() => setDarkMode(!darkMode)} className="p-3 border border-zinc-800/30 hover:bg-zinc-800 transition-all duration-200 text-zinc-500 hover:text-zinc-200">{darkMode ? <Sun size={18}/> : <Moon size={18}/>}</button>
            <button onClick={() => setIsDead(true)} className="p-3 text-red-900/40 hover:text-red-500 transition-all duration-200 hover:bg-red-950/10"><Skull size={18}/></button>
          </div>
        </header>

        <input type="file" ref={fileInputRef} onChange={importarFicha} className="hidden" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <main className="lg:col-span-8 space-y-12">
            <section className="flex flex-col md:flex-row gap-10 items-start border-b border-zinc-800/10 pb-12 transition-colors duration-300 hover:border-zinc-800/30">
              <div onClick={() => imageInputRef.current.click()} className="w-40 h-48 bg-zinc-900/20 border border-zinc-800/30 flex items-center justify-center relative grayscale cursor-pointer group overflow-hidden transition-all duration-300 hover:border-zinc-500 hover:shadow-[0_0_30px_rgba(0,0,0,0.3)] hover:grayscale-0">
                  {imagem ? (
                    <img src={imagem} alt="Perfil" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 ease-out" />
                  ) : (
                    <ImageIcon size={40} className="opacity-10 group-hover:scale-110 transition-transform duration-300 ease-out" />
                  )}
                  <input type="file" ref={imageInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
              </div>

              <div className="flex-1 w-full space-y-6">
                <input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="NOME DO SUJEITO" className="w-full bg-transparent font-serif text-5xl md:text-6xl outline-none placeholder:opacity-5 transition-all duration-300 focus:placeholder:opacity-10" />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {[
                    {label: 'Persona', val: persona, set: setPersona},
                    {label: 'Ocupação', val: background, set: setBackground},
                    {label: 'Nível', val: nivel, set: setNivel},
                    {label: 'Idade', val: idade, set: setIdade},
                    {label: 'Arquétipo', val: arquetipo, set: setArquetipo}
                  ].map((field) => (
                    <div key={field.label} className="group">
                      <label className="text-[9px] font-black opacity-30 uppercase tracking-widest mb-1 block font-mono transition-opacity group-focus-within:opacity-60">{field.label}</label>
                      <input value={field.val} onChange={(e) => field.set(e.target.value)} className="w-full bg-transparent border-b border-transparent focus:border-zinc-700 text-sm font-bold outline-none transition-all duration-300 py-1" placeholder="..." />
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <nav className="flex gap-10 border-b border-zinc-800/10">
              {['dossie', 'biografia', 'inventario'].map(t => (
                <button key={t} onClick={() => setActiveTab(t)} className={`pb-4 text-[10px] font-black uppercase tracking-widest transition-all duration-300 font-mono ${activeTab === t ? 'text-zinc-100 border-b-2 border-zinc-100' : 'text-zinc-600 hover:text-zinc-400'}`}>
                  {t}
                </button>
              ))}
            </nav>

            <div className="min-h-[400px]">
              {activeTab === 'dossie' && (
                <div className="space-y-12 animate-[fadeIn_0.3s_ease-out]">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.keys(attrs).map(attr => (
                      <div key={attr} className="p-6 border border-zinc-800/20 bg-white/[0.01] hover:bg-white/[0.02] hover:border-zinc-700 transition-all duration-300 group focus-within:border-zinc-500">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex flex-col">
                            <label className="text-[11px] font-black opacity-30 uppercase font-mono group-hover:opacity-50 transition-opacity">{attr}</label>
                            <span className="text-[14px] font-mono font-bold text-zinc-500">Total: {Number(attrs[attr]) - penalidade}</span>
                          </div>
                          <div className="flex gap-2">
                             <button onClick={() => rolarAtributo(attr, attrs[attr])} className="p-1 text-zinc-600 hover:text-white transition-colors"><Dice5 size={14}/></button>
                             {penalidade > 0 && <span className="text-[10px] font-black text-red-900 animate-pulse">-{penalidade}</span>}
                          </div>
                        </div>
                        <input type="number" value={attrs[attr]} onChange={(e) => setAttrs({...attrs, [attr]: e.target.value})} className="bg-transparent text-4xl font-light w-full outline-none font-serif smooth-input" />
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center opacity-30">
                      <h3 className="text-[10px] font-black uppercase tracking-widest font-mono">Habilidades e Maestrias</h3>
                      <button onClick={() => setHabilidades([...habilidades, {id: Date.now(), nome: '', rank: ''}])} className="hover:text-white transition-colors"><Plus size={16}/></button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {habilidades.map((h, i) => (
                        <div key={h.id} className="flex items-center gap-4 p-4 border border-zinc-800/10 bg-white/[0.01] hover:border-zinc-700 transition-all duration-300 group">
                          <input value={h.nome} onChange={(e) => {
                            const newH = [...habilidades];
                            newH[i] = { ...newH[i], nome: e.target.value };
                            setHabilidades(newH);
                          }} className="flex-1 bg-transparent text-xs font-bold outline-none smooth-input" placeholder="Habilidade..." />
                          <input value={h.rank} onChange={(e) => {
                            const newH = [...habilidades];
                            newH[i] = { ...newH[i], rank: e.target.value };
                            setHabilidades(newH);
                          }} className="w-8 bg-transparent text-right text-xs opacity-40 outline-none smooth-input" />
                          <button onClick={() => setHabilidades(habilidades.filter(hab => hab.id !== h.id))} className="opacity-0 group-hover:opacity-100 text-red-900 transition-opacity duration-300"><Trash2 size={14}/></button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'biografia' && (
                <div className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
                  <div className="space-y-2 group">
                    <label className="text-[10px] font-black opacity-20 uppercase font-mono flex items-center gap-2 group-focus-within:opacity-50 transition-opacity"><ScrollText size={14}/> Arquivo Pessoal</label>
                    <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="w-full bg-transparent border border-zinc-800/20 p-6 h-40 outline-none text-sm font-inter focus:border-zinc-600 transition-colors duration-300 resize-none" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2 group">
                      <label className="text-[10px] font-black opacity-20 uppercase font-mono flex items-center gap-2 group-focus-within:opacity-50 transition-opacity"><Eye size={14}/> Aparência</label>
                      <textarea value={aparencia} onChange={(e) => setAparencia(e.target.value)} className="w-full bg-transparent border border-zinc-800/20 p-6 h-32 outline-none text-sm font-inter focus:border-zinc-600 transition-colors duration-300 resize-none" />
                    </div>
                    <div className="space-y-2 group">
                      <label className="text-[10px] font-black opacity-20 uppercase font-mono flex items-center gap-2 group-focus-within:opacity-50 transition-opacity"><Users size={14}/> Contatos</label>
                      <textarea value={lacos} onChange={(e) => setLacos(e.target.value)} className="w-full bg-transparent border border-zinc-800/20 p-6 h-32 outline-none text-sm font-inter focus:border-zinc-600 transition-colors duration-300 resize-none" />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'inventario' && (
                <div className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
                  {inventario.map((item, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 border border-zinc-800/10 group bg-white/[0.01] hover:border-zinc-700 transition-all duration-300">
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
              )}
            </div>
          </main>

          <aside className="lg:col-span-4 space-y-12">
            <div className="p-8 border border-zinc-800/40 bg-white/[0.01] space-y-12 hover:border-zinc-700 transition-colors duration-500">
              <div className="space-y-4 group">
                <div className="flex justify-between items-end mb-2">
                  <label className="text-[10px] font-black uppercase tracking-widest font-mono flex items-center gap-2 group-hover:text-red-900/70 transition-colors"><HeartPulse size={14} className="text-red-900"/> Vigor</label>
                  <div className="flex items-center gap-3">
                    <button onClick={() => adjust(vigor, setVigor, -1)} className="p-1 border border-zinc-800 opacity-40 hover:opacity-100 hover:border-red-900 transition-all duration-300"><Minus size={12}/></button>
                    <div className="flex items-center gap-1 font-serif">
                      <input type="number" value={vigor} onChange={(e) => handleStatusChange(e, setVigor)} className="w-12 bg-transparent text-2xl text-right outline-none font-serif hover:text-white transition-colors placeholder:text-zinc-700" placeholder="0" />
                      <span className="text-zinc-700">/</span>
                      <input type="number" value={vigorMax} onChange={(e) => handleStatusChange(e, setVigorMax)} className="w-12 bg-transparent text-lg text-zinc-600 outline-none font-serif hover:text-white transition-colors" />
                    </div>
                    <button onClick={() => adjust(vigor, setVigor, 1)} className="p-1 border border-zinc-800 opacity-40 hover:opacity-100 hover:border-red-900 transition-all duration-300"><Plus size={12}/></button>
                  </div>
                </div>
                <div className="h-1 bg-zinc-900 w-full overflow-hidden rounded-full">
                  <div className="h-full bg-red-900 transition-all duration-500 ease-out" style={{width: `${Math.min((vigor/vigorMax)*100, 100)}%`}}></div>
                </div>
              </div>

              <div className="space-y-4 group">
                <div className="flex justify-between items-end mb-2">
                  <label className="text-[10px] font-black uppercase tracking-widest font-mono flex items-center gap-2 group-hover:text-blue-900/70 transition-colors"><Wind size={14} className="text-blue-900"/> Fôlego</label>
                  <div className="flex items-center gap-3">
                    <button onClick={() => adjust(folego, setFolego, -1)} className="p-1 border border-zinc-800 opacity-40 hover:opacity-100 hover:border-blue-900 transition-all duration-300"><Minus size={12}/></button>
                    <div className="flex items-center gap-1 font-serif">
                       <input type="number" value={folego} onChange={(e) => handleStatusChange(e, setFolego)} className="w-12 bg-transparent text-2xl text-right outline-none font-serif hover:text-white transition-colors" />
                      <span className="text-zinc-700">/ 12</span>
                    </div>
                    <button onClick={() => adjust(folego, setFolego, 1)} className="p-1 border border-zinc-800 opacity-40 hover:opacity-100 hover:border-blue-900 transition-all duration-300"><Plus size={12}/></button>
                  </div>
                </div>
                <div className="h-1 bg-zinc-900 w-full overflow-hidden rounded-full">
                  <div className="h-full bg-blue-900 transition-all duration-500 ease-out" style={{width: `${(folego/12)*100}%`}}></div>
                </div>
              </div>

              <div className="space-y-4 group">
                <div className="flex justify-between items-end mb-2">
                  <label className={`text-[10px] font-black uppercase tracking-widest font-mono flex items-center gap-2 transition-colors ${(isInsane && effectsEnabled) ? 'text-purple-500 animate-pulse' : 'group-hover:text-purple-900/70'}`}><Brain size={14} className="text-purple-900"/> Sanidade</label>
                  <div className="flex items-center gap-3">
                    <button onClick={() => adjust(sanidade, setSanidade, -1)} className="p-1 border border-zinc-800 opacity-40 hover:opacity-100 hover:border-purple-900 transition-all duration-300"><Minus size={12}/></button>
                    <div className="flex items-center gap-1 font-serif">
                      <input type="number" value={sanidade} onChange={(e) => handleStatusChange(e, setSanidade)} className={`w-12 bg-transparent text-2xl text-right outline-none font-serif hover:text-white transition-colors ${(isInsane && effectsEnabled) ? 'text-purple-500' : ''}`} />
                      <span className="text-zinc-700">/ 12</span>
                    </div>
                    <button onClick={() => adjust(sanidade, setSanidade, 1)} className="p-1 border border-zinc-800 opacity-40 hover:opacity-100 hover:border-purple-900 transition-all duration-300"><Plus size={12}/></button>
                  </div>
                </div>
                <div className="h-1 bg-zinc-900 w-full overflow-hidden rounded-full">
                  <div className={`h-full transition-all duration-500 ease-out ${(isInsane && effectsEnabled) ? 'bg-purple-600' : 'bg-purple-900'}`} style={{width: `${(sanidade/12)*100}%`}}></div>
                </div>
              </div>
            </div>

            <div className={`p-8 border transition-all duration-500 ${(isCritical && effectsEnabled) ? 'border-red-600 bg-red-950/20 shadow-[0_0_50px_rgba(255,0,0,0.15)]' : 'border-zinc-800/40'}`}>
              <p className="text-[10px] font-black uppercase text-center tracking-[0.4em] opacity-20 mb-6 font-mono transition-opacity">Status de Fadiga</p>
              <div className="flex gap-4">
                {[1,2,3].map(i => (
                  <button key={i} onClick={()=>setFadiga(i === fadiga ? i-1 : i)} className={`h-20 flex-1 border transition-all duration-300 relative overflow-hidden group ${fadiga >= i ? (i === 3 ? 'bg-red-700 border-red-500 shadow-[0_0_15px_rgba(220,38,38,0.5)]' : 'bg-zinc-200 border-white shadow-[0_0_10px_rgba(255,255,255,0.3)]') : 'bg-transparent border-zinc-800 hover:border-zinc-500'}`}>
                    {fadiga >= i && <div className="absolute inset-0 bg-white/10 animate-pulse"></div>}
                  </button>
                ))}
              </div>
            </div>

            <div onClick={() => { setResultado(Math.floor(Math.random() * 12) + 1); setRollDetails({source: 'D12 Puro', mod: 0}); }} className="p-12 border border-zinc-800 flex flex-col items-center justify-center gap-4 hover:bg-zinc-100 hover:text-black transition-all duration-300 cursor-pointer group relative overflow-hidden">
              <div className="absolute inset-0 bg-zinc-100 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-bottom z-0"></div>
              <div className="relative z-10 flex flex-col items-center">
                {resultado ? (
                  <div className="text-center animate-in zoom-in duration-300">
                    <p className="text-7xl font-serif"><AnimatedNumber value={resultado} /></p>
                    <p className="text-[10px] font-mono uppercase tracking-widest mt-2">Rolagem de {rollDetails.source}</p>
                    <p className="text-[9px] opacity-40 font-mono mt-1">MOD: {rollDetails.mod >= 0 ? '+' : ''}{rollDetails.mod}</p>
                  </div>
                ) : (
                  <>
                    <Dice5 size={40} className="opacity-10 group-hover:rotate-180 transition-all duration-500 ease-out" />
                    <span className="text-[10px] font-mono uppercase tracking-[0.3em] opacity-40 mt-4 transition-all duration-500 group-hover:tracking-[0.5em] group-hover:opacity-100">Roll Dice</span>
                  </>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-px bg-zinc-800/20 border border-zinc-800/20 overflow-hidden">
               <div className="p-6 text-center hover:bg-white/[0.02] transition-colors duration-300">
                  <Shield size={16} className="mx-auto mb-2 opacity-10"/>
                  <p className="text-[9px] font-mono opacity-30 uppercase">Defesa</p>
                  <p className="text-4xl font-serif"><AnimatedNumber value={defesaBase} /></p>
               </div>
               <div className="p-6 text-center hover:bg-white/[0.02] transition-colors duration-300">
                  <Crosshair size={16} className="mx-auto mb-2 opacity-10"/>
                  <p className="text-[9px] font-mono opacity-30 uppercase">Reflexo</p>
                  <p className="text-4xl font-serif"><AnimatedNumber value={reflexoBase} /></p>
               </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}