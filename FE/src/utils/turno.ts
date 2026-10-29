interface TurnoAgendado {
  fecha: string;
  hora_inicio: string;
  estado?: string;
  cod_especialista?: number;
  nro_afiliado?: number;
  especialista?: {
    cod_especialista: number;
    especialidad?: {
      duracion_minutos?: number;
    } | null;
  } | null;
  paciente?: {
    nro_afiliado: number;
  } | null;
}

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

export function tieneConflictoDeTurno(
  fecha: string,
  hora: string,
  duracion: number,
  codEspecialista: number,
  codPaciente: number | '',
  turnos: readonly TurnoAgendado[],
): boolean {
  const inicio = minutosDesdeMedianoche(hora);
  const fin = inicio + duracion;

  return turnos.some((turno) => {
    if (turno.fecha !== fecha || turno.estado?.toUpperCase() === 'CANCELADO') return false;

    const mismoEspecialista = Number(turno.cod_especialista ?? turno.especialista?.cod_especialista) === codEspecialista;
    const mismoPaciente = codPaciente !== '' &&
      Number(turno.nro_afiliado ?? turno.paciente?.nro_afiliado) === codPaciente;
    if (!mismoEspecialista && !mismoPaciente) return false;

    const inicioExistente = minutosDesdeMedianoche(turno.hora_inicio);
    const duracionExistente = turno.especialista?.especialidad?.duracion_minutos;
    const finExistente = inicioExistente +
      (duracionExistente && duracionExistente > 0 ? duracionExistente : duracion);

    return inicio < finExistente && inicioExistente < fin;
  });
}

function minutosDesdeMedianoche(hora: string): number {
  const [horas, minutos] = hora.split(':').map(Number);
  return horas * 60 + minutos;
}
