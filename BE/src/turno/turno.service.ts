import { orm } from '../shared/db/orm.js';
import { Especialista } from '../especialista/especialista.entity.js';
import { Paciente } from '../paciente/paciente.entity.js';
import { Turno } from './turno.entity.js';
import { alreadyExistsError, BadRequestError } from '../shared/errorsModel.js';
import { chocaEnMinutos, generarSlots, horaAMinutos } from './turno.availability.js';
import { esTurnoValido } from './turno.calendar.js';

// Actualizamos el Input para usar fecha y hora separadas
type TurnoInput = {
  fecha: string; // 'YYYY-MM-DD'
  hora_inicio: string; // 'HH:mm'
  paciente: Paciente;
  especialista: Especialista;
};

// Actualizamos los filtros
type TurnoFilters = {
  nro_afiliado?: number;
  cod_especialista?: number;
  fecha?: string;
};

/**
 * Barrera de seguridad antes de insertar o actualizar un turno.
 * Lanza excepción si el paciente o el médico ya están ocupados.
 */
async function ensureTurnoDisponible(
  fecha: string,
  hora_inicio: string,
  especialista: Especialista,
  paciente: Paciente,
  cod_turno_ignoralo?: number // Para no chocarse consigo mismo en un UPDATE
) {
  // Buscamos solo los turnos de ese día específico
  const turnosDelDia = await orm.em.find(
    Turno,
    {
      $or: [
        { especialista: { cod_especialista: especialista.cod_especialista } },
        { paciente: { nro_afiliado: paciente.nro_afiliado } },
      ],
      fecha,
    },
    { populate: ['especialista.especialidad', 'paciente'] }
  );

  const duracionNuevo = especialista.especialidad?.duracion_minutos ?? 0;
  const nuevoInicio = horaAMinutos(hora_inicio);
  const nuevoFin = nuevoInicio + duracionNuevo;

  for (const turnoGuardado of turnosDelDia) {
    // Ignoramos el turno actual si estamos haciendo un update
    if (cod_turno_ignoralo && turnoGuardado.cod_turno === cod_turno_ignoralo) continue;

    const duracionGuardada = turnoGuardado.especialista.especialidad?.duracion_minutos ?? 0;
    const ocupadoInicio = horaAMinutos(turnoGuardado.hora_inicio);
    const ocupadoFin = ocupadoInicio + duracionGuardada;

    if (chocaEnMinutos(nuevoInicio, nuevoFin, ocupadoInicio, ocupadoFin)) {
      if (turnoGuardado.especialista.cod_especialista === especialista.cod_especialista) {
        throw new alreadyExistsError('El especialista ya tiene un turno asignado en ese horario');
      }
      if (turnoGuardado.paciente.nro_afiliado === paciente.nro_afiliado) {
        throw new alreadyExistsError('El paciente ya tiene un turno asignado en ese horario');
      }
    }
  }
}

/**
 * Genera la grilla de turnos visual para el frontend
 */
export async function sGetHorariosDisponibles(
  fecha: string,
  especialista: Especialista
): Promise<string[]> {
  const duracion_minutos = especialista.especialidad?.duracion_minutos ?? 0;

  // OJO: Acá definimos un horario fijo comercial para el ejemplo.
  const slotsPosibles = generarSlots('08:00', '17:00', duracion_minutos);
  if (slotsPosibles.length === 0) return [];

  // Traemos solo los turnos de ese médico ese día
  const turnosOcupados = await orm.em.find(
    Turno,
    {
      especialista: { cod_especialista: especialista.cod_especialista },
      fecha,
    },
    { populate: ['especialista.especialidad'] }
  );

  // Filtramos la grilla generada contra la base de datos
  return slotsPosibles.filter((slot) => {
    const slotInicio = horaAMinutos(slot);
    const slotFin = slotInicio + duracion_minutos;

    // Verificamos si este slot choca con algún turno ya guardado
    const estaOcupado = turnosOcupados.some((turnoG) => {
      const duracionOcupada = turnoG.especialista.especialidad?.duracion_minutos ?? 0;
      const ocuInicio = horaAMinutos(turnoG.hora_inicio);
      const ocuFin = ocuInicio + duracionOcupada;
      return chocaEnMinutos(slotInicio, slotFin, ocuInicio, ocuFin);
    });

    return !estaOcupado; // Si NO está ocupado, lo mantenemos
  });
}

/**
 * Listado general con filtros
 */
export async function sGetTurnos(filters: TurnoFilters = {}): Promise<Turno[]> {
  const where: Record<string, any> = {};
  if (filters.nro_afiliado) where.paciente = filters.nro_afiliado;
  if (filters.cod_especialista) where.especialista = filters.cod_especialista;
  if (filters.fecha) where.fecha = filters.fecha;

  return await orm.em.find(Turno, where, { populate: ['paciente', 'especialista'] });
}

export async function sGetTurnoById(cod_turno: number): Promise<Turno | null> {
  return await orm.em.findOne(Turno, { cod_turno }, { populate: ['paciente', 'especialista'] });
}

/**
 * Crear un nuevo turno
 */
export async function sCreateTurno(input: TurnoInput): Promise<Turno> {
  const duracion = input.especialista.especialidad?.duracion_minutos ?? 0;
  if (!esTurnoValido(input.fecha, input.hora_inicio, duracion)) {
    throw new BadRequestError(
      'El horario debe coincidir con la duración de la consulta y estar dentro de la atención de 08:00 a 17:00'
    );
  }

  await ensureTurnoDisponible(input.fecha, input.hora_inicio, input.especialista, input.paciente);

  const turno = orm.em.create(Turno, {
    fecha: input.fecha,
    hora_inicio: input.hora_inicio,
    paciente: input.paciente,
    especialista: input.especialista,
  });

  await orm.em.persistAndFlush(turno);
  return turno;
}

/**
 * Actualizar turno (ej: cambiar el día o la hora)
 */
export async function sUpdateTurno(
  cod_turno: number,
  input: TurnoInput
): Promise<Turno | null> {
  const turno = await orm.em.findOne(Turno, { cod_turno });
  if (!turno) return null;

  const duracion = input.especialista.especialidad?.duracion_minutos ?? 0;
  if (!esTurnoValido(input.fecha, input.hora_inicio, duracion)) {
    throw new BadRequestError(
      'El horario debe coincidir con la duración de la consulta y estar dentro de la atención de 08:00 a 17:00'
    );
  }

  // Pasamos el cod_turno para que no crea que choca consigo mismo
  await ensureTurnoDisponible(
    input.fecha,
    input.hora_inicio,
    input.especialista,
    input.paciente,
    cod_turno
  );

  turno.fecha = input.fecha;
  turno.hora_inicio = input.hora_inicio;
  turno.paciente = input.paciente;
  turno.especialista = input.especialista;

  await orm.em.flush();
  return turno;
}

export async function sDeleteTurno(cod_turno: number): Promise<boolean> {
  const turno = await orm.em.findOne(Turno, { cod_turno });
  if (!turno) return false;

  await orm.em.removeAndFlush(turno);
  return true;
}