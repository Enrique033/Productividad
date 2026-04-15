import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { MetricsGrid, DistributionDonut, HourlyChart, PerformanceStatus } from './components/Productivity';
import { TicketLogger } from './components/WorkFlow';
import { BlockManager } from './components/BlockManager';
import { QuickActions } from "./components/QuickActions";
import { WorkBlock, Ticket, POINTS, getActiveBlock } from './lib/store';
import { downloadExcelByHour } from './lib/excel';
import { Trash2, Clock, Plus, Download, Calendar } from 'lucide-react';

export default function App() {
  // Estado para manejar la fecha del calendario y filtrado
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // 1. Estado de Bloques
  const [blocks, setBlocks] = useState<WorkBlock[]>(() => {
    const saved = localStorage.getItem('work_blocks');
    return saved ? JSON.parse(saved) : [
      { id: '1', name: 'ACD', start: '09:00', end: '15:00', metaPerHour: 3 },
      { id: '2', name: 'Seguimiento', start: '15:00', end: '20:00', metaPerHour: 2 }
    ];
  });

  // 2. Estado de Tickets (Usamos tickets_history para no perder días anteriores)
  const [tickets, setTickets] = useState<Ticket[]>(() => {
    const saved = localStorage.getItem('tickets_history');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((t: any) => ({ ...t, timestamp: new Date(t.timestamp) }));
    }
    return [];
  });

  // Persistencia
  useEffect(() => { localStorage.setItem('work_blocks', JSON.stringify(blocks)); }, [blocks]);
  useEffect(() => { localStorage.setItem('tickets_history', JSON.stringify(tickets)); }, [tickets]);

  // FILTRO: Esto asegura que el Dashboard solo cuente lo del día seleccionado en el calendario
  const filteredTickets = tickets.filter(t => 
    new Date(t.timestamp).toISOString().split('T')[0] === selectedDate
  );

  // 3. Cálculos Dinámicos
  const activeBlock = getActiveBlock(blocks);
  const totalPoints = filteredTickets.reduce((acc, t) => acc + t.points, 0);

  // Meta total del día (Suma de todos los bloques)
  const dailyMeta = blocks.reduce((acc, b) => {
    const [h1, m1] = b.start.split(':').map(Number);
    const [h2, m2] = b.end.split(':').map(Number);
    const hours = (h2 + m2/60) - (h1 + m1/60);
    return acc + (hours * b.metaPerHour);
  }, 0);

  // Lógica de "Esperado a esta hora" para el Semáforo
  const calculateExpected = () => {
    if (!activeBlock) return totalPoints;
    const [h, m] = activeBlock.start.split(':').map(Number);
    const now = new Date();
    const elapsed = (now.getHours() + now.getMinutes()/60) - (h + m/60);
    return Math.max(0, elapsed * activeBlock.metaPerHour);
  };

  // 4. Funciones de Gestión
const addTicket = (ticketId: string, type: 'accionable' | 'conversacion') => {
  if (!activeBlock) return alert("⚠️ No hay bloque activo.");
  
  const newTicket: Ticket = {
    id: ticketId, // <--- AQUÍ: Usamos el ID que viene del input, no uno aleatorio
    type,
    timestamp: new Date(),
    points: POINTS[type],
    blockId: activeBlock.id
  };
  setTickets([newTicket, ...tickets]);
};

  const deleteTicket = (id: string) => {
    if(confirm("¿Seguro que deseas eliminar este registro?")) {
      setTickets(tickets.filter(t => t.id !== id));
    }
  };

  return (
    <Layout>
      <div className="animate-in space-y-8">
        
        {/* SEMÁFORO DE RITMO */}
        <PerformanceStatus 
          currentPoints={totalPoints} 
          targetPoints={calculateExpected()} 
        />

        {/* GESTIÓN DE BLOQUES */}
        <BlockManager 
          blocks={blocks} 
          onAdd={(b) => setBlocks([...blocks, { ...b, id: crypto.randomUUID() }])} 
          onRemove={(id) => setBlocks(blocks.filter(b => b.id !== id))} 
        />

        {/* MÉTRICAS Y GRÁFICO POR HORA */}
        <div className="space-y-6">
          <MetricsGrid tickets={filteredTickets} dailyMeta={Number(dailyMeta.toFixed(1))} />
          <HourlyChart tickets={filteredTickets} />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          <div className="lg:col-span-2 space-y-6">
<TicketLogger onAdd={(ticketId, type) => addTicket(ticketId, type)} 
  activeBlock={activeBlock} 
/>
            
            {/* LISTA CON OPCIÓN DE ELIMINAR */}
            <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-50 flex justify-between items-center">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Historial: {selectedDate}</h3>
                <span className="text-xs font-bold text-orange-500 bg-orange-50 px-3 py-1 rounded-full">{filteredTickets.length} total</span>
              </div>
              <div className="divide-y divide-slate-50 max-h-[400px] overflow-y-auto custom-scrollbar">
                {filteredTickets.length === 0 ? (
                  <div className="p-10 text-center text-slate-400 text-sm italic">Sin actividad registrada</div>
                ) : (
filteredTickets.map(ticket => (
  <div key={ticket.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50/50 group transition-all">
    <div className="flex items-center gap-4">
      {/* Indicador de color: Verde para accionable, Azul para conversa */}
      <div className={`w-3 h-3 rounded-full ${ticket.type === 'accionable' ? 'bg-emerald-500' : 'bg-blue-500'}`} />
      
      <div>
        {/* TÍTULO: Muestra 'Conversación' o el ID del Ticket según el tipo */}
        <p className="text-sm font-bold text-slate-700">
          {ticket.type === 'conversacion' ? 'Conversación' : ticket.id}
        </p>
        
        {/* SUBTÍTULO: Grupo - Tipo (Accionable / No Accionable) */}
        <p className="text-[10px] text-slate-400 font-bold uppercase">
          {blocks.find(b => b.id === ticket.blockId)?.name} - 
          <span className={ticket.type === 'accionable' ? 'text-emerald-500' : 'text-blue-500'}>
            {ticket.type === 'accionable' ? ' Accionable' : ' No Accionable'}
          </span>
        </p>
      </div>
    </div>

    <div className="flex items-center gap-6">
      <span className="text-xs text-slate-400 font-mono">
        {ticket.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </span>
      
      <span className={`text-sm font-black ${ticket.type === 'accionable' ? 'text-emerald-600' : 'text-blue-600'}`}>
        +{ticket.points.toFixed(1)}
      </span>

      <button 
        onClick={() => deleteTicket(ticket.id)}
        className="opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
      >
        <Trash2 size={16} />
      </button>
    </div>
  </div>
))
                )}
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <QuickActions 
              onExport={(date) => {
                setSelectedDate(date); // Al cambiar la fecha en el calendario, se actualiza la vista
                downloadExcelByHour(tickets, blocks, date);
              }} 
              onClearAll={() => {
                if (confirm("⚠️ ¿Estás seguro de que quieres borrar TODOS los registros del historial?")) {
                  setTickets([]);
                  localStorage.removeItem('tickets_history');
                }
              }}
            />
            <DistributionDonut tickets={filteredTickets} />
            
           {/* WIDGET BLOQUE ACTUAL */}
<div className="bg-slate-900 p-6 rounded-[32px] text-white shadow-xl">
  <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest mb-4">Estado del Turno</p>
  {activeBlock ? (
    <>
      <h4 className="text-2xl font-black mb-1 text-orange-400 capitalize">{activeBlock.name}</h4>
      <p className="text-sm text-slate-400 flex items-center gap-2 mb-6">
        <Clock size={14} /> {activeBlock.start} - {activeBlock.end}
      </p>
      
      <div className="space-y-3">
        <div className="flex justify-between text-xs font-bold">
          <span className="text-slate-500">Progreso del bloque</span>
          {/* CÁLCULO DEL PORCENTAJE */}
          <span className="text-white">
            {Math.round((tickets.filter(t => t.blockId === activeBlock.id).reduce((acc, t) => acc + t.points, 0) / 
            ((activeBlock.metaPerHour) * (Number(activeBlock.end.split(':')[0]) - Number(activeBlock.start.split(':')[0])))) * 100)}%
          </span>
        </div>
        
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          {/* Barra de progreso visual */}
          <div 
            className="bg-orange-500 h-full transition-all duration-500" 
            style={{ 
              width: `${Math.min(100, (tickets.filter(t => t.blockId === activeBlock.id).reduce((acc, t) => acc + t.points, 0) / 
              ((activeBlock.metaPerHour) * (Number(activeBlock.end.split(':')[0]) - Number(activeBlock.start.split(':')[0])))) * 100)}%` 
            }} 
          />
        </div>
      </div>
    </>
  ) : (
    <p className="text-slate-500 text-sm italic">Fuera de horario</p>
  )}
</div>
          </aside>
        </div>
      </div>
    </Layout>
  );
}