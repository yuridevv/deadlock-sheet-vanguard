import React from 'react';
import { NotebookPen } from '../icons';

const NotepadToggleButton = ({ isNotepadOpen, setIsNotepadOpen }) => {
  return (
    <button
      onClick={() => setIsNotepadOpen(!isNotepadOpen)}
      className="fixed bottom-4 right-4 z-50 p-3 rounded-full bg-zinc-800 text-white shadow-lg hover:bg-zinc-700 transition-colors"
      aria-label="Toggle Notepad"
    >
      <NotebookPen size={24} />
    </button>
  );
};

export default NotepadToggleButton;
