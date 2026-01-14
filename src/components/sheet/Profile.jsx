import React from 'react';
import { ImageIcon } from '../icons';

const Profile = ({
  imageInputRef,
  handleImageUpload,
  imagem,
  nome,
  setNome,
  persona,
  setPersona,
  background,
  setBackground,
  nivel,
  setNivel,
  idade,
  setIdade,
  arquetipo,
  setArquetipo,
}) => {
  const fields = [
    { label: 'Persona', val: persona, set: setPersona },
    { label: 'Ocupação', val: background, set: setBackground },
    { label: 'Nível', val: nivel, set: setNivel },
    { label: 'Idade', val: idade, set: setIdade },
    { label: 'Arquétipo', val: arquetipo, set: setArquetipo }
  ];

  return (
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
          {fields.map((field) => (
            <div key={field.label} className="group">
              <label className="text-[9px] font-black opacity-30 uppercase tracking-widest mb-1 block font-mono transition-opacity group-focus-within:opacity-60">{field.label}</label>
              <input value={field.val} onChange={(e) => field.set(e.target.value)} className="w-full bg-transparent border-b border-transparent focus:border-zinc-700 text-sm font-bold outline-none transition-all duration-300 py-1" placeholder="..." />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Profile;
