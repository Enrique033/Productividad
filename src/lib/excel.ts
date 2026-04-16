import * as XLSX from 'xlsx';
import { Ticket, WorkBlock } from './store';

export const downloadExcelByHour = (tickets: Ticket[], blocks: WorkBlock[], dateSelected: string) => {
  // Filtramos por la fecha seleccionada
const filtered = tickets.filter(t => 
  new Date(t.timestamp).toLocaleDateString('en-CA') === dateSelected
);

  if (filtered.length === 0) {
    alert("No hay datos para exportar en esta fecha.");
    return;
  }

  // Mapeamos los datos con la nueva terminología
  const data = filtered.map(t => {
    const block = blocks.find(b => b.id === t.blockId);
    const groupName = block?.name || 'General';
    
    return {
      'FECHA': dateSelected,
      'HORA': new Date(t.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      
      // Si es conversación, ponemos N/A o vacío para que no salgan los IDs internos
      'IDENTIFICADOR': t.type === 'conversacion' ? 'Conversación' : t.id,
      
      'GRUPO': groupName,
      
      // Traducimos el tipo a lo que acordamos
      'CATEGORÍA': t.type === 'accionable' ? 'ACCIONABLE' : 'NO ACCIONABLE',
      
      // Detalle combinado como el de la lista
      'DETALLE': `${groupName} - ${t.type === 'accionable' ? 'Accionable' : 'No Accionable'}`,
      
      'PUNTOS': t.points
    };
  });

  // Generación del archivo
  const ws = XLSX.utils.json_to_sheet(data);
  
  // Ajustamos el ancho de las columnas para que se vea bien al abrirlo
  const colWidths = [
    { wch: 12 }, // Fecha
    { wch: 10 }, // Hora
    { wch: 20 }, // Identificador
    { wch: 15 }, // Grupo
    { wch: 18 }, // Categoría
    { wch: 25 }, // Detalle
    { wch: 10 }, // Puntos
  ];
  ws['!cols'] = colWidths;

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Reporte_Productividad");
  
  // Nombre del archivo dinámico
  XLSX.writeFile(wb, `Reporte_${dateSelected}.xlsx`);
};