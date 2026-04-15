import React, { useState } from 'react';
import { WorkBlock } from '../lib/store';

interface TicketLoggerProps {
  // Ahora onAdd pide obligatoriamente el ticketId (string) antes del tipo
  onAdd: (ticketId: string, type: 'accionable' | 'conversacion') => void;
  activeBlock?: WorkBlock | null;
}

export const TicketLogger: React.FC<TicketLoggerProps> = ({ onAdd, activeBlock }) => {
  const [input, setInput] = useState('');

  // Función interna para centralizar el envío y validación
const handleAction = (type: 'accionable' | 'conversacion') => {
    // Si es Accionable, SÍ obligamos a poner ticket
    if (type === 'accionable' && !input.trim()) {
      alert("⚠️ Por favor, ingresa el número de ticket primero.");
      return;
    }

    // Si es Conversación y no hay input, le ponemos un texto genérico o el ID que haya
    const finalId = input.trim() || `CONV-${Date.now().toString().slice(-4)}`;
    
    onAdd(finalId, type);
    setInput(''); 
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAction('accionable');
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
          disabled={!activeBlock}
          placeholder={activeBlock ? `Registrar ticket en ${activeBlock.name}...` : "No hay bloque activo"}
          className="flex-1 bg-slate-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <button 
          onClick={() => handleAction('conversacion')}
          disabled={!activeBlock}
          className="bg-blue-50 text-blue-600 px-6 py-3 rounded-xl hover:bg-blue-100 transition-colors font-bold flex items-center gap-2 disabled:opacity-50"
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