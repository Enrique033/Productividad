// src/components/WorkFlow.tsx
import React, { useState } from 'react'; // Esto quitará el 90% de las líneas rojas
import { Ticket, WorkBlock } from '../lib/store'; // Ruta corregida

interface TicketLoggerProps {
  onAdd: (type: 'accionable' | 'conversacion') => void;
  activeBlock?: WorkBlock;
}

export const TicketLogger: React.FC<TicketLoggerProps> = ({ onAdd, activeBlock }) => {
  const [input, setInput] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && input.trim()) {
      onAdd('accionable');
      setInput('');
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm mb-6">
      <div className="flex items-center gap-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={activeBlock ? `Registrar ticket en ${activeBlock.name}...` : "No hay bloque activo"}
          className="flex-1 bg-slate-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
        />
        <button 
          onClick={() => onAdd('conversacion')}
          className="bg-blue-50 text-blue-600 px-6 py-3 rounded-xl hover:bg-blue-100 transition-colors font-bold flex items-center gap-2"
          title="Registrar Conversación (0.5 pts)"
        >
          <span>💬</span> Conversa
        </button>
      </div>
      <p className="text-[10px] text-slate-400 mt-3 ml-1 flex items-center gap-2">
        <span className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 text-slate-500 font-mono">Enter</span>
        para ticket Accionable (1.0 pt)
      </p>
    </div>
  );
};