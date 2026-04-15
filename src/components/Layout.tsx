import React, { useState, useEffect } from 'react';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans">
      {/* Header Premium */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-6 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-200">
              <span className="text-white text-xl font-bold">📊</span>
            </div>
            <div>
              <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
                Dashboard <span className="text-emerald-600 font-medium">de Productividad</span>
              </h1>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
                {time.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>
            </div>
          </div>

          {/* Reloj Digital Premium */}
          <div className="flex items-center gap-4">
            <div className="bg-slate-100/50 px-4 py-2 rounded-2xl border border-slate-200/50 flex items-center gap-3">
               <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
               </div>
               <span className="text-xl font-mono font-bold text-slate-700">
                {time.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
               </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto p-6 md:p-8">
        {children}
      </main>

      {/* Footer Minimalista */}
      <footer className="max-w-7xl mx-auto px-8 py-6 border-t border-slate-200 flex justify-between items-center text-slate-400 text-xs">
        <p>Dashboard SaaS Premium • Productividad optimizada</p>
        <div className="flex gap-4">
          <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"/> Accionable: 1pt</span>
          <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500"/> Conversa: 0.5pt</span>
        </div>
      </footer>
    </div>
  );
};