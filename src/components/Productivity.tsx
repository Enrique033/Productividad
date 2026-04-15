import React from 'react';

import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { Ticket } from '../lib/store';

// 1. INDICADOR DE SEGUIMIENTO (Semáforo de Ritmo)
export const PerformanceStatus = ({ currentPoints, targetPoints }: { currentPoints: number, targetPoints: number }) => {
  const diff = currentPoints - targetPoints;
  
  // Lógica de colores y estados
  let config = {
    text: 'En Meta',
    bgColor: 'bg-emerald-500',
    icon: '✅',
    message: '¡Buen ritmo! Sigue así.'
  };

  if (diff < -1.5) {
    config = { 
      text: 'Retrasado', 
      bgColor: 'bg-red-500', 
      icon: '⚠️', 
      message: 'Necesitas subir la velocidad para alcanzar la meta.' 
    };
  } else if (diff > 3) {
    config = { 
      text: 'Excelente', 
      bgColor: 'bg-blue-600', 
      icon: '🚀', 
      message: '¡Estás superando las expectativas!' 
    };
  }

  return (
    <div className={`${config.bgColor} text-white p-6 rounded-[32px] shadow-lg shadow-slate-200 transition-all duration-500 flex items-center justify-between mb-6`}>
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-black uppercase tracking-widest opacity-80">Estado de Productividad</span>
        </div>
        <h2 className="text-3xl font-black flex items-center gap-3">
          {config.icon} {config.text}
        </h2>
        <p className="text-xs font-medium opacity-90 mt-1">{config.message}</p>
      </div>
      <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl text-right min-w-[120px]">
        <p className="text-[10px] font-bold uppercase">Diferencia</p>
        <p className="text-2xl font-mono font-black">
          {diff > 0 ? `+${diff.toFixed(1)}` : diff.toFixed(1)}
        </p>
        <p className="text-[10px] opacity-80">puntos vs meta actual</p>
      </div>
    </div>
  );
};

// 2. GRÁFICO DE BARRAS POR HORA
export const HourlyChart = ({ tickets }: { tickets: Ticket[] }) => {
  // Definimos el rango fijo solicitado: 08:00 (8) a 22:00 (10 PM)
  const FIXED_START = 8;
  const FIXED_END = 22;

  // Generamos el array de datos para ese rango exacto
  const data = Array.from({ length: (FIXED_END - FIXED_START) + 1 }, (_, i) => {
    const h = FIXED_START + i;
    // Formateo simple para el eje X
    const hourStr = `${h.toString().padStart(2, '0')}:00`;
    
    const points = tickets
      .filter(t => {
        const ticketDate = new Date(t.timestamp);
        return ticketDate.getHours() === h;
      })
      .reduce((acc, t) => acc + t.points, 0);

    return { 
      hour: hourStr, 
      puntos: points 
    };
  });

  // Calculamos el ancho para que sea desplazable: 
  // 15 horas * 70px aprox = 1050px de ancho mínimo para que respire bien
  return (
    <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm mb-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <span>📊</span> Rendimiento Diario (08:00 - 22:00)
        </h3>
        <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-lg uppercase">
          Desliza para navegar
        </span>
      </div>
      
      {/* Contenedor con Scroll Horizontal */}
      <div className="overflow-x-auto pb-4 custom-scrollbar">
        <div className="h-64" style={{ minWidth: '1000px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="hour" 
                fontSize={10} 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94a3b8', fontWeight: 600}}
              />
              <YAxis 
                fontSize={10} 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94a3b8'}}
                allowDecimals={true}
              />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '16px', 
                  border: 'none', 
                  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                  fontSize: '12px'
                }}
                cursor={{ fill: '#f8fafc' }}
                formatter={(value: number) => [`${value.toFixed(1)} pts`, 'Productividad']}
              />
              <Bar 
                dataKey="puntos" 
                fill="#f97316" 
                radius={[6, 6, 0, 0]} 
                barSize={30}
                animationDuration={1000}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// 3. GRILLA DE MÉTRICAS (Ya la tenías, agregamos retoques)
export const MetricsGrid = ({ tickets, dailyMeta }: { tickets: Ticket[], dailyMeta: number }) => {
  const totalPoints = tickets.reduce((acc, t) => acc + t.points, 0);
  const progress = dailyMeta > 0 ? (totalPoints / dailyMeta) * 100 : 0;

  const stats = [
    { label: 'Meta del Día', value: dailyMeta, sub: 'puntos objetivo', icon: '🎯', color: 'text-orange-600' },
    { label: 'Accionables', value: tickets.filter(t=>t.type==='accionable').length, sub: '1.0 puntos', icon: '✅', color: 'text-emerald-600' },
    { label: 'Conversas', value: tickets.filter(t=>t.type==='conversacion').length, sub: '0.5 puntos', icon: '💬', color: 'text-blue-600' },
    { label: 'Puntos Hoy', value: totalPoints.toFixed(1), sub: `${progress.toFixed(0)}% logrado`, icon: '📈', color: 'text-slate-800' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((s, i) => (
        <div key={i} className="bg-white p-5 rounded-[28px] border border-slate-100 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xl">{s.icon}</span>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
          </div>
          <h3 className={`text-2xl font-black ${s.color}`}>{s.value}</h3>
          <p className="text-[10px] text-slate-400 font-bold mt-1">{s.sub}</p>
        </div>
      ))}
    </div>
  );
};

// 4. GRÁFICO CIRCULAR (Donut)
export const DistributionDonut = ({ tickets }: { tickets: Ticket[] }) => {
  const data = [
    { name: 'Accionables', value: tickets.filter(t => t.type === 'accionable').length, color: '#10b981' },
    { name: 'Conversas', value: tickets.filter(t => t.type === 'conversacion').length, color: '#3b82f6' }
  ];

  const total = tickets.length;

  return (
    <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
      <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
        <span>🍩</span> Distribución
      </h3>
      <div className="h-48 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} innerRadius={60} outerRadius={80} paddingAngle={8} dataKey="value">
              {data.map((entry, i) => <Cell key={i} fill={entry.color} stroke="none" />)}
            </Pie>
            <Tooltip 
  contentStyle={{ 
    borderRadius: '12px', // En CSS es borderRadius, no cornerRadius
    border: 'none',
    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' 
  }} 
  cursor={{ fill: 'transparent' }} // Esto limpia el efecto de fondo al pasar el mouse
/>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-black text-slate-800">{total}</span>
          <span className="text-[10px] text-slate-400 font-black uppercase">Total</span>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        {data.map(item => (
          <div key={item.name} className="flex justify-between items-center text-[11px]">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="font-bold text-slate-600 uppercase tracking-tight">{item.name}</span>
            </div>
            <span className="font-black text-slate-800">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};