// Las fechas viajan como texto 'AAAA-MM-DD' (sin hora ni zona horaria).

export function aISO(d: Date): string {
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}

export const hoyISO = () => aISO(new Date());

export function sumarDias(fecha: string, dias: number): string {
  const d = new Date(`${fecha}T12:00:00`);
  d.setDate(d.getDate() + dias);
  return aISO(d);
}

/** '2026-10-09' -> 'viernes, 9 de octubre' */
export const formatearFecha = (fecha: string) =>
  new Intl.DateTimeFormat('es-AR', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date(`${fecha}T12:00:00`));