import { apiFetch } from './api';

// ---------------------------------------------------------------------------
// 1) Lo que devuelve el backend de turnos (formato real, ver BE/src/turno)
// ---------------------------------------------------------------------------
interface TurnoApi {
  cod_turno: number;
  fecha: string; // 'AAAA-MM-DD'
  hora_inicio: string; // 'HH:MM:SS' en los GET (ojo: el POST lo devuelve como 'HH:MM')
  paciente: {
    nro_afiliado: number;
    dni: string;
    nombre: string;
    telefono: string;
    cod_os: number | null;
  };
}

// ---------------------------------------------------------------------------
// 2) El modelo que usan las pantallas del especialista
//    (si el backend cambia, solo se toca la función "aTurnoAgenda")
// ---------------------------------------------------------------------------
export type EstadoTurno = 'PENDIENTE' | 'ATENDIDO' | 'AUSENTE';

export interface PacienteAgenda {
  id: number;
  nombre: string;
  dni: string;
  telefono: string;
}

export interface TurnoAgenda {
  id: number;
  fecha: string; // AAAA-MM-DD
  hora: string; // HH:MM
  estado: EstadoTurno;
  paciente: PacienteAgenda;
}

export interface EntradaHistoria {
  id: number;
  pacienteId: number;
  turnoId: number;
  fecha: string; // AAAA-MM-DD
  diagnostico: string;
  indicaciones: string | null;
}

// ---------------------------------------------------------------------------
// 3) Datos de prueba SOLO para lo que el backend todavía no tiene:
//    el estado del turno y la historia clínica. Viven en memoria (al recargar la página se pierden).
// ---------------------------------------------------------------------------
const estados = new Map<number, EstadoTurno>();
const historia: EntradaHistoria[] = [];

const esperar = (ms = 250) => new Promise((resolver) => setTimeout(resolver, ms));

// ---------------------------------------------------------------------------
// 4) Conversión: formato del backend -> formato de las pantallas
// ---------------------------------------------------------------------------
function aTurnoAgenda(t: TurnoApi): TurnoAgenda {
  return {
    id: t.cod_turno,
    fecha: t.fecha,
    hora: t.hora_inicio.slice(0, 5), // '09:30:00' -> '09:30'
    estado: estados.get(t.cod_turno) ?? 'PENDIENTE',
    paciente: {
      id: t.paciente.nro_afiliado,
      nombre: t.paciente.nombre,
      dni: t.paciente.dni,
      telefono: t.paciente.telefono,
    },
  };
}

// ---------------------------------------------------------------------------
// 5) Funciones que usan las pantallas
// ---------------------------------------------------------------------------

/** REAL: turnos de un especialista en un día. */
export async function getAgenda(codEspecialista: number, fecha: string): Promise<TurnoAgenda[]> {
  const turnos = await apiFetch<TurnoApi[]>(`/turno?cod_especialista=${codEspecialista}&fecha=${fecha}`);
  return turnos.map(aTurnoAgenda).sort((a, b) => a.hora.localeCompare(b.hora));
}

/** REAL: un turno por su código. */
export async function getTurno(id: number): Promise<TurnoAgenda> {
  return aTurnoAgenda(await apiFetch<TurnoApi>(`/turno/${id}`));
}

/** PRUEBA: historia clínica de un paciente (más nueva primero). */
export async function getHistoria(pacienteId: number): Promise<EntradaHistoria[]> {
  await esperar();
  return historia.filter((h) => h.pacienteId === pacienteId).sort((a, b) => b.fecha.localeCompare(a.fecha));
}

/** PRUEBA: el especialista termina la consulta. */
export async function atenderTurno(id: number, datos: { diagnostico: string; indicaciones?: string }): Promise<void> {
  const turno = await getTurno(id);
  if (turno.estado !== 'PENDIENTE') throw new Error('Este turno ya no está pendiente de atención');
  estados.set(id, 'ATENDIDO');
  historia.push({
    id: historia.length + 1,
    pacienteId: turno.paciente.id,
    turnoId: id,
    fecha: turno.fecha,
    diagnostico: datos.diagnostico,
    indicaciones: datos.indicaciones ?? null,
  });
}

/** PRUEBA: el paciente no se presentó. */
export async function marcarAusente(id: number): Promise<void> {
  const turno = await getTurno(id);
  if (turno.estado !== 'PENDIENTE') throw new Error('Solo se puede marcar ausente un turno pendiente');
  estados.set(id, 'AUSENTE');
}