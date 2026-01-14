import React, { useEffect, useRef } from 'react';
import { useCharacterSheetState } from './hooks/useCharacterSheetState';

// Core Components
import DeathScreen from './components/core/DeathScreen';
import Effects from './components/core/Effects';
import AchievementNotification from './components/core/AchievementNotification';

// Layout Components
import Header from './components/header/Header';
import Profile from './components/sheet/Profile';
import DisplayedAchievements from './components/sheet/DisplayedAchievements';
import DossierTab from './components/sheet/DossierTab';
import BiographyTab from './components/sheet/BiographyTab';
import InventoryTab from './components/sheet/InventoryTab';
import AchievementsTab from './components/sheet/AchievementsTab';
import StatusBar from './components/sidebar/StatusBar';
import FatigueStatus from './components/sidebar/FatigueStatus';
import DiceRoller from './components/sidebar/DiceRoller';
import CombatStats from './components/sidebar/CombatStats';

// Icons
import { HeartPulse, Wind, Brain } from './components/icons';

export default function VanguardDossierV7() {
  const state = useCharacterSheetState();
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  const {
    nome, persona, background, nivel, idade, arquetipo, bio, aparencia, lacos,
    imagem, vigor, vigorMax, folego, sanidade, fadiga, attrs, inventario, habilidades,
    achievements, activeTab, darkMode, effectsEnabled, resultado, rollDetails, isDead, showContent,
    notification, draggedItemIndex,
  } = state;

  const {
    setNome, setPersona, setBackground, setNivel, setIdade, setArquetipo, setBio, 
    setAparencia, setLacos, setImagem, setVigor, setVigorMax, setFolego, setSanidade,
    setFadiga, setAttrs, setInventario, setHabilidades, setAchievements, setActiveTab, setDarkMode,
    setEffectsEnabled, setResultado, setRollDetails, setIsDead, setNotification,
    setDraggedItemIndex,
  } = state;

  // --- Achievement Unlocking Logic ---
  useEffect(() => {
    if (resultado === null) return;
  
    let unlockedAchievementName = null;
  
    // Find the first achievement that can be unlocked
    for (const [name, ach] of Object.entries(achievements)) {
      if (!ach.unlocked && ach.trigger === 'roll') {
        let conditionMet = false;
        if (ach.condition.gte !== undefined && resultado >= ach.condition.gte) {
          conditionMet = true;
        }
        if (ach.condition.lte !== undefined && resultado <= ach.condition.lte) {
          if (ach.condition.attr) {
            if (rollDetails.source === ach.condition.attr) {
              conditionMet = true;
            }
          } else {
            conditionMet = true;
          }
        }
        
        if (conditionMet) {
          unlockedAchievementName = name;
          break; // Stop after finding one to show one notification at a time
        }
      }
    }
  
    if (unlockedAchievementName) {
      setAchievements(prev => ({
        ...prev,
        [unlockedAchievementName]: { ...prev[unlockedAchievementName], unlocked: true }
      }));
      setNotification(unlockedAchievementName);
    }
  }, [resultado, rollDetails, achievements, setAchievements, setNotification]);


  const penalidade = Number(fadiga);
  const isCritical = fadiga === 3;
  const isInsane = sanidade <= 0;
  const defesaBase = 6 + Number(attrs.Fisico);
  const reflexoBase = Math.max(Number(attrs.Destreza), Number(attrs.Instinto));

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagem(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const adjust = (setter, value, mod) => {
    let next = Number(value) + mod;
    if (next < 0) next = 0;
    setter(next);
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

  const rolarDado = () => {
    setResultado(Math.floor(Math.random() * 12) + 1);
    setRollDetails({ source: 'D12 Puro', mod: 0 });
  };

  const exportarFicha = () => {
    const dados = {
      version: "7.8_STABLE",
      perfil: { nome, persona, background, nivel, idade, arquetipo, bio, aparencia, lacos, imagem },
      atributos: attrs,
      status: { fadiga, vigor, vigorMax, folego, sanidade },
      habilidades,
      inventario,
      achievements
    };
    const blob = new Blob([JSON.stringify(dados, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `DOSSIER_${nome || 'INVESTIGADOR'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importarFicha = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const json = JSON.parse(ev.target.result);
        if (json.perfil) {
          setNome(json.perfil.nome || ''); setPersona(json.perfil.persona || '');
          setBackground(json.perfil.background || ''); setNivel(json.perfil.nivel || '01');
          setIdade(json.perfil.idade || ''); setArquetipo(json.perfil.arquetipo || '');
          setBio(json.perfil.bio || ''); setAparencia(json.perfil.aparencia || '');
          setLacos(json.perfil.lacos || ''); setImagem(json.perfil.imagem || null);
        }
        if (json.atributos) setAttrs(json.atributos);
        if (json.status) {
          setFadiga(json.status.fadiga || 0); setVigor(json.status.vigor || 20);
          setVigorMax(json.status.vigorMax || 20);
          setFolego(json.status.folego || 12); setSanidade(json.status.sanidade || 12);
        }
        setHabilidades(json.habilidades || [{ id: 1, nome: '', rank: '-' }]);
        setInventario(json.inventario || [{ item: '', qtd: 1, dano: '' }]);
        
        // Import achievements
        if (json.achievements) {
            setAchievements(prev => {
                const newState = {...prev};
                Object.keys(newState).forEach(key => {
                    if (json.achievements[key]) {
                        newState[key].unlocked = json.achievements[key].unlocked;
                    }
                });
                return newState;
            });
        }

      } catch (err) { alert("Erro ao ler o arquivo JSON. Verifique o formato."); }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input
  };
  
    const handleDragStart = (index) => {
    setDraggedItemIndex(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedItemIndex === null || draggedItemIndex === index) return;

    const newInventario = [...inventario];
    const itemSendoArrastado = newInventario[draggedItemIndex];
    
    newInventario.splice(draggedItemIndex, 1);
    newInventario.splice(index, 0, itemSendoArrastado);

    setDraggedItemIndex(index);
    setInventario(newInventario);
  };

  const handleDragEnd = () => {
    setDraggedItemIndex(null);
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 p-4 md:p-8 font-sans overflow-x-hidden relative rounded-none selection:bg-red-900 selection:text-white
      ${darkMode ? 'bg-[#050505] text-zinc-300' : 'bg-[#f4f1ea] text-zinc-800'}
      ${isInsane && effectsEnabled ? 'animate-flicker-screen' : ''} 
    `}>
      <Effects effectsEnabled={effectsEnabled} isCritical={isCritical} darkMode={darkMode} />
      <DeathScreen isDead={isDead} setIsDead={setIsDead} />
      <AchievementNotification achievementName={notification} achievementData={notification ? achievements[notification] : null} />

      <div className={`max-w-6xl mx-auto relative z-10 transition-opacity duration-700 ease-out ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <Header 
          effectsEnabled={effectsEnabled}
          setEffectsEnabled={setEffectsEnabled}
          exportarFicha={exportarFicha}
          fileInputRef={fileInputRef}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          setIsDead={setIsDead}
        />
        <input type="file" ref={fileInputRef} onChange={importarFicha} className="hidden" accept=".json" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <main className="lg:col-span-8 space-y-12">
            <Profile
              imageInputRef={imageInputRef}
              handleImageUpload={handleImageUpload}
              imagem={imagem}
              nome={nome} setNome={setNome}
              persona={persona} setPersona={setPersona}
              background={background} setBackground={setBackground}
              nivel={nivel} setNivel={setNivel}
              idade={idade} setIdade={setIdade}
              arquetipo={arquetipo} setArquetipo={setArquetipo}
            />
            
            <DisplayedAchievements achievements={achievements} />

            <nav className="flex gap-10 border-b border-zinc-800/10">
              {['dossie', 'biografia', 'inventario', 'conquistas'].map(t => (
                <button key={t} onClick={() => setActiveTab(t)} className={`pb-4 text-[10px] font-black uppercase tracking-widest transition-all duration-300 font-mono ${activeTab === t ? 'text-zinc-100 border-b-2 border-zinc-100' : 'text-zinc-600 hover:text-zinc-400'}`}>
                  {t}
                </button>
              ))}
            </nav>

            <div className="min-h-[400px]">
              {activeTab === 'dossie' && <DossierTab attrs={attrs} setAttrs={setAttrs} penalidade={penalidade} rolarAtributo={rolarAtributo} habilidades={habilidades} setHabilidades={setHabilidades} />}
              {activeTab === 'biografia' && <BiographyTab bio={bio} setBio={setBio} aparencia={aparencia} setAparencia={setAparencia} lacos={lacos} setLacos={setLacos} />}
              {activeTab === 'inventario' && <InventoryTab inventario={inventario} setInventario={setInventario} draggedItemIndex={draggedItemIndex} handleDragStart={handleDragStart} handleDragOver={handleDragOver} handleDragEnd={handleDragEnd} />}
              {activeTab === 'conquistas' && <AchievementsTab achievements={achievements} setAchievements={setAchievements} />}
            </div>
          </main>

          <aside className="lg:col-span-4 space-y-12">
            <div className="p-8 border border-zinc-800/40 bg-white/[0.01] space-y-12 hover:border-zinc-700 transition-colors duration-500">
              <StatusBar
                icon={<HeartPulse size={14} className="text-red-900"/>}
                label="Vigor"
                value={vigor}
                maxValue={vigorMax}
                onValueChange={(e) => handleStatusChange(e, setVigor)}
                onMaxValueChange={(e) => handleStatusChange(e, setVigorMax)}
                onAdjust={(mod) => adjust(setVigor, vigor, mod)}
                barColor="bg-red-900"
                hoverBorderColor="hover:border-red-900"
                hoverTextColor="group-hover:text-red-900/70"
              />
              <StatusBar
                icon={<Wind size={14} className="text-blue-900"/>}
                label="Fôlego"
                value={folego}
                maxValue={12}
                onValueChange={(e) => handleStatusChange(e, setFolego)}
                onAdjust={(mod) => adjust(setFolego, folego, mod)}
                barColor="bg-blue-900"
                hoverBorderColor="hover:border-blue-900"
                hoverTextColor="group-hover:text-blue-900/70"
              />
              <StatusBar
                icon={<Brain size={14} className="text-purple-900"/>}
                label="Sanidade"
                value={sanidade}
                maxValue={12}
                onValueChange={(e) => handleStatusChange(e, setSanidade)}
                onAdjust={(mod) => adjust(setSanidade, sanidade, mod)}
                barColor="bg-purple-900"
                hoverBorderColor="hover:border-purple-900"
                hoverTextColor="group-hover:text-purple-900/70"
                isInsane={isInsane}
                effectsEnabled={effectsEnabled}
              />
            </div>

            <FatigueStatus fadiga={fadiga} setFadiga={setFadiga} isCritical={isCritical} effectsEnabled={effectsEnabled} />

            <DiceRoller resultado={resultado} rollDetails={rollDetails} onRoll={rolarDado} />
            
            <CombatStats defesaBase={defesaBase} reflexoBase={reflexoBase} />
          </aside>
        </div>
      </div>
    </div>
  );
}
