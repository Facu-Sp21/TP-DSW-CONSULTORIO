export function esHorarioPasado(fecha: string, hora: string, ahora = new Date()): boolean {
  const fechaActual = [
    ahora.getFullYear(),
    String(ahora.getMonth() + 1).padStart(2, '0'),
    String(ahora.getDate()).padStart(2, '0'),
  ].join('-');

  if (fecha < fechaActual) return true;
  if (fecha > fechaActual) return false;

  const [horas, minutos] = hora.split(':').map(Number);
  return horas * 60 + minutos <= ahora.getHours() * 60 + ahora.getMinutes();
}
