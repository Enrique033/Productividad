import * as XLSX from 'xlsx';
import { Ticket, WorkBlock } from './store';

export const downloadExcelByHour = (tickets: Ticket[], blocks: WorkBlock[]) => {
  const data = tickets.map(t => ({
    Hora: new Date(t.timestamp).toLocaleTimeString(),
    Tipo: t.type.toUpperCase(),
    Puntos: t.points,
    Bloque: blocks.find(b => b.id === t.blockId)?.name || 'N/A'
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Reporte por Hora");
  XLSX.writeFile(wb, `Productividad_${new Date().toLocaleDateString()}.xlsx`);
};