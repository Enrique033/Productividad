import React, { useState } from 'react';
import { Download, Calendar, Trash2 } from 'lucide-react';

interface QuickActionsProps {
  onExport: (date: string) => void;
  onClearAll: () => void;
}

export const QuickActions = ({ onExport, onClearAll }: QuickActionsProps) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  return (
    <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-4">
      <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-2">
        <span>⚡</span> Acciones Rápidas
      </h3>

      {/* Selector de Fecha */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
          Día de consulta
        </label>
        <div className="relative group">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={16} />
          <input 
            type="date" 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full bg-slate-50 border-2 border-transparent rounded-2xl pl-10 pr-4 py-2.5 text-sm font-bold text-slate-700 focus:bg-white focus:border-orange-500/20 focus:ring-4 focus:ring-orange-500/5 transition-all outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 pt-2">
        {/* Botón Exportar */}
        <button 
          onClick={() => onExport(selectedDate)}
          className="flex items-center justify-center gap-2 bg-orange-500 text-white p-3.5 rounded-2xl font-black text-xs hover:bg-orange-600 active:scale-95 transition-all shadow-lg shadow-orange-200"
        >
          <Download size={18} /> EXPORTAR EXCEL
        </button>

        {/* Botón Limpiar Todo */}
        <button 
          onClick={onClearAll}
          className="flex items-center justify-center gap-2 bg-slate-100 text-slate-500 p-3 rounded-2xl font-bold text-xs hover:bg-red-50 hover:text-red-500 active:scale-95 transition-all"
        >
          <Trash2 size={16} /> LIMPIAR REGISTROS
        </button>
      </div>
    </div>
  );
};