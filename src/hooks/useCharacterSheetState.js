import { useState, useEffect } from 'react';
import { initialAchievementsState } from '../data/achievements';

const getSaved = () => {
  const saved = localStorage.getItem('vanguard_sheet_data_v8');
  return saved ? JSON.parse(saved) : {};
};

export const useCharacterSheetState = () => {
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
  const [inventario, setInventario] = useState(initial.inventario || [{ item: '', qtd: 1, dano: '', isWeapon: false }]);
  const [habilidades, setHabilidades] = useState(initial.habilidades || [{ id: 1, nome: '', rank: '-', descricao: '' }]);
  
  // Combine saved achievements with the base structure to allow for future additions
  const [achievements, setAchievements] = useState(() => {
    const baseAchievements = initialAchievementsState();
    const savedAchievements = initial.achievements || {};
    // Merge saved data into the base structure
    Object.keys(baseAchievements).forEach(key => {
        if (savedAchievements[key]) {
            baseAchievements[key].unlocked = savedAchievements[key].unlocked;
        }
    });
    return baseAchievements;
  });


  const [activeTab, setActiveTab] = useState('dossie');
  const [darkMode, setDarkMode] = useState(initial.darkMode ?? true);
  const [effectsEnabled, setEffectsEnabled] = useState(initial.effectsEnabled ?? true);
  const [resultado, setResultado] = useState(null);
  const [rollDetails, setRollDetails] = useState({ source: 'D12', mod: 0 });
  const [isDead, setIsDead] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [notification, setNotification] = useState(null); // For achievement notifications
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);
  
  const [notes, setNotes] = useState(() => {
    const rawNotes = initial.notes || [];
    // Migrate old notes to object format and ensure positions
    return rawNotes.map((note, index) => {
      if (typeof note === 'string') {
        return {
          id: `${Date.now()}-${index}-${Math.random().toString(36).substr(2, 5)}`,
          content: note,
          x: 100 + (index * 50) % 500,
          y: 100 + (index * 50) % 400,
          connections: []
        };
      }
      // Ensure existing object notes have positions
      return {
        ...note,
        id: note.id || `${Date.now()}-${index}`,
        x: typeof note.x === 'number' ? note.x : (100 + (index * 50) % 500),
        y: typeof note.y === 'number' ? note.y : (100 + (index * 50) % 400),
        connections: note.connections || []
      };
    });
  });

  const [isNotepadOpen, setIsNotepadOpen] = useState(false);

  useEffect(() => {
    const dataToSave = {
      nome, persona, background, nivel, idade, arquetipo, bio, aparencia, lacos,
      imagem, vigor, vigorMax, folego, sanidade, fadiga, attrs, inventario, habilidades,
      achievements, darkMode, effectsEnabled, notes
    };
    localStorage.setItem('vanguard_sheet_data_v8', JSON.stringify(dataToSave));
  }, [nome, persona, background, nivel, idade, arquetipo, bio, aparencia, lacos, imagem, vigor, vigorMax, folego, sanidade, fadiga, attrs, inventario, habilidades, achievements, darkMode, effectsEnabled, notes]);

  useEffect(() => { 
    setTimeout(() => setShowContent(true), 100); 
  }, []);

  const state = {
    nome, persona, background, nivel, idade, arquetipo, bio, aparencia, lacos,
    imagem, vigor, vigorMax, folego, sanidade, fadiga, attrs, inventario, habilidades,
    achievements, activeTab, darkMode, effectsEnabled, resultado, rollDetails, isDead, showContent,
    notification, draggedItemIndex, notes, isNotepadOpen,
  };

  const setters = {
    setNome, setPersona, setBackground, setNivel, setIdade, setArquetipo, setBio, 
    setAparencia, setLacos, setImagem, setVigor, setVigorMax, setFolego, setSanidade,
    setFadiga, setAttrs, setInventario, setHabilidades, setAchievements, setActiveTab, setDarkMode,
    setEffectsEnabled, setResultado, setRollDetails, setIsDead, setShowContent,
    setNotification, setDraggedItemIndex, setNotes, setIsNotepadOpen,
  };

  return { ...state, ...setters };
};
