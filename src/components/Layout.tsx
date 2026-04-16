import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react'; // Asegúrate de tener instalada lucide-react


// 1. LA LISTA DE INGREDIENTES (Interface)
interface LayoutProps {
  children: React.ReactNode;
  isDark: boolean;
  setIsDark: (val: boolean) => void;
  isOnBreak: boolean;
  setIsOnBreak: (val: boolean) => void;
  breakSeconds: number;
  formatBreakTime: (s: number) => string;
}

// 2. LA OLLA DONDE LOS RECIBES (Componente) - FUSIONADO PARA QUE FUNCIONE
export const Layout = ({ 
  children, 
  isDark, 
  setIsDark, 
  isOnBreak, 
  setIsOnBreak,
  breakSeconds,
  formatBreakTime 
}: LayoutProps) => {

  
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    // Añadimos transition-colors para que el cambio no sea brusco
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-500">
      {/* Header Premium */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200/60 dark:border-orange-500/10 px-6 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">

            
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-200 dark:shadow-none">
              <span className="text-white text-xl font-bold">📊</span>
            </div>
            <div>
              <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
                Dashboard <span className="text-emerald-600 dark:text-emerald-400 font-medium">de Productividad</span>
              </h1>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-semibold">
                {time.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>
            </div>
          </div>

<div className="flex items-center gap-4">

{/* --- BOTÓN DE BREAK (CAFÉ) --- */}
<button
  // Se bloquea si llegó a 3600s (1 hora) y no está activo actualmente
  disabled={breakSeconds >= 3600 && !isOnBreak}
  onClick={() => setIsOnBreak(!isOnBreak)}
  className={`p-2.5 rounded-2xl transition-all border flex items-center gap-2 font-bold ${
    isOnBreak 
      ? 'bg-orange-500 border-orange-400 text-white animate-pulse shadow-lg shadow-orange-500/20' 
      : breakSeconds >= 3600 
        ? 'bg-slate-200 dark:bg-slate-900 text-slate-400 border-slate-300 dark:border-slate-800 cursor-not-allowed opacity-60' 
        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:scale-105'
  }`}
  title={
    breakSeconds >= 3600 && !isOnBreak 
      ? "Límite de break agotado por hoy" 
      : isOnBreak ? "Terminar descanso" : "Tomar un descanso"
  }
>
  <span className={isOnBreak ? 'scale-125' : ''}>
    {breakSeconds >= 3600 && !isOnBreak ? '🚫' : '☕'}
  </span>
  
  <span className="hidden md:block text-xs uppercase tracking-tight">
    {breakSeconds >= 3600 && !isOnBreak 
      ? 'Agotado' 
      : isOnBreak ? 'En Break' : 'Break'}
  </span>
  
  {/* Cronómetro al lado del texto */}
  {isOnBreak && (
    <span className="ml-2 font-mono text-xs bg-orange-600 px-2 py-0.5 rounded-full text-white">
      {formatBreakTime(breakSeconds)}
    </span>
  )}
</button>


            {/* BOTÓN SOL/LUNA */}
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-orange-400 hover:scale-110 active:scale-95 transition-all border border-slate-200 dark:border-slate-700"
              title={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            

            {/* Reloj Digital Premium */}
            <div className="hidden sm:flex bg-slate-100/50 dark:bg-slate-800/50 px-4 py-2 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 items-center gap-3">
               <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
               </div>
               <span className="text-xl font-mono font-bold text-slate-700 dark:text-slate-300">
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

      {/* Footer Minimalista Firmado */}
      <footer className="max-w-7xl mx-auto px-8 py-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 dark:text-slate-500 text-xs">
        <div className="flex flex-col items-center md:items-start gap-1">
          <p className="font-bold text-slate-600 dark:text-slate-400">© 2026 Elvis Sebastian</p>
          <p>Dashboard SaaS Premium • Productividad optimizada</p>
        </div>
        
        <div className="flex gap-6 font-medium">
          <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500"/> Accionable: 1pt</span>
          <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500"/> Conversa: 0.5pt</span>
        </div>
      </footer>
    </div>
  );
};