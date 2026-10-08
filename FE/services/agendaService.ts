import { apiFetch } from './api';

// 1) Lo que devuelve el backend (formato real, ver BE/src/turno y BE/src/historiaClinica) // 
export type EstadoTurno = 'PENDIENTE' | 'ATENDIDO' | 'AUSENTE';

interface TurnoApi {
  cod_turno: number;
  fecha: string; // 'AAAA-MM-DD'
  hora_inicio: string; // 'HH:MM:SS' en los GET
  estado: EstadoTurno;
  paciente: {
    nro_afiliado: number;
    dni: string;
    nombre: string;
    telefono: string;
    cod_os: number | null;
  };
}

interface HistoriaApi {
  cod_historia: number;
  paciente: number; // sin cargar: llega solo el número de afiliado
  turno: { cod_turno: number; fecha: string };
  diagnostico: string;
  indicaciones?: string | null;
}

// El modelo que usan las pantallas del especialista (si el backend cambia, solo se tocan las funciones de conversión de abajo) //
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
  fecha: string; // AAAA-MM-DD (la del turno)
  diagnostico: string;
  indicaciones: string | null;
}

// Conversión: formato del backend -> formato de las pantallas //
function aTurnoAgenda(t: TurnoApi): TurnoAgenda {
  return {
    id: t.cod_turno,
    fecha: t.fecha,
    hora: t.hora_inicio.slice(0, 5), // '09:30:00' -> '09:30'
    estado: t.estado,
    paciente: {
      id: t.paciente.nro_afiliado,
      nombre: t.paciente.nombre,
      dni: t.paciente.dni,
      telefono: t.paciente.telefono,
    },
  };
}

function aEntradaHistoria(h: HistoriaApi): EntradaHistoria {
  return {
    id: h.cod_historia,
    pacienteId: h.paciente,
    turnoId: h.turno.cod_turno,
    fecha: h.turno.fecha,
    diagnostico: h.diagnostico,
    indicaciones: h.indicaciones ?? null,
  };
}

// Funciones que usan las pantallas (todas hablan con el backend) // 

/** Turnos de un especialista en un día. */
export async function getAgenda(codEspecialista: number, fecha: string): Promise<TurnoAgenda[]> {
  const turnos = await apiFetch<TurnoApi[]>(`/turno?cod_especialista=${codEspecialista}&fecha=${fecha}`);
  return turnos.map(aTurnoAgenda).sort((a, b) => a.hora.localeCompare(b.hora));
}

/** Un turno por su código. */
export async function getTurno(id: number): Promise<TurnoAgenda> {
  return aTurnoAgenda(await apiFetch<TurnoApi>(`/turno/${id}`));
}

/** Historia clínica de un paciente (la más nueva primero, el backend ya la devuelve ordenada). */
export async function getHistoria(pacienteId: number): Promise<EntradaHistoria[]> {
  const entradas = await apiFetch<HistoriaApi[]>(`/historia-clinica?nro_afiliado=${pacienteId}`);
  return entradas.map(aEntradaHistoria);
}

/** El especialista termina la consulta: el turno queda ATENDIDO y se guarda la historia clínica. */
export async function atenderTurno(id: number, datos: { diagnostico: string; indicaciones?: string }): Promise<void> {
  await apiFetch(`/turno/${id}/atender`, { method: 'POST', body: JSON.stringify(datos) });
}

/** El paciente no se presentó. */
export async function marcarAusente(id: number): Promise<void> {
  await apiFetch(`/turno/${id}/ausente`, { method: 'POST' });
}