import React, { useState } from 'react';
import { Plus, Trash2, Clock } from 'lucide-react';
import { WorkBlock } from '../lib/store';

interface Props {
  blocks: WorkBlock[];
  onAdd: (block: Omit<WorkBlock, 'id'>) => void;
  onRemove: (id: string) => void;
}

export const BlockManager: React.FC<Props> = ({ blocks, onAdd, onRemove }) => {
  const [name, setName] = useState('');
  const [start, setStart] = useState('09:00');
  const [end, setEnd] = useState('15:00');
  const [meta, setMeta] = useState(3);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    onAdd({ name, start, end, metaPerHour: meta });
    setName('');
  };

  return (
    <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm mb-6">
      <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
        <Clock size={18} className="text-orange-500" /> Configuración de Bloques
      </h3>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <input 
          className="input-premium col-span-2 md:col-span-1" 
          placeholder="Ej: ACD" 
          value={name} onChange={e => setName(e.target.value)} 
        />
        <input type="time" className="input-premium" value={start} onChange={e => setStart(e.target.value)} />
        <input type="time" className="input-premium" value={end} onChange={e => setEnd(e.target.value)} />
        <input 
          type="number" className="input-premium" 
          placeholder="Meta/h" value={meta} onChange={e => setMeta(Number(e.target.value))} 
        />
        <button type="submit" className="bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-all flex items-center justify-center gap-2">
          <Plus size={18} /> Añadir
        </button>
      </form>

      <div className="space-y-2">
        {blocks.map(b => (
          <div key={b.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <div>
              <span className="font-bold text-slate-700">{b.name}</span>
              <span className="text-xs text-slate-400 ml-3">{b.start} - {b.end} ({b.metaPerHour} pts/h)</span>
            </div>
            <button onClick={() => onRemove(b.id)} className="text-red-400 hover:text-red-600 p-1">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};