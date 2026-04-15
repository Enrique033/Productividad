// src/lib/store.ts
export interface WorkBlock {
  id: string;
  name: string;
  start: string;
  end: string;
  metaPerHour: number;
}

export interface Ticket {
  id: string;
  type: 'accionable' | 'conversacion';
  timestamp: Date;
  points: number;
  blockId: string;
}

export const POINTS = { 
  accionable: 1.0, 
  conversacion: 0.5 
};

export const getActiveBlock = (blocks: WorkBlock[]): WorkBlock | undefined => {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  return blocks.find(b => {
    const [sH, sM] = b.start.split(':').map(Number);
    const [eH, eM] = b.end.split(':').map(Number);
    const startMinutes = sH * 60 + sM;
    const endMinutes = eH * 60 + eM;
    return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
  });
};