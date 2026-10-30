import { orm } from '../shared/db/orm.js';
import { Especialista } from '../especialista/especialista.entity.js';
import { Paciente } from '../paciente/paciente.entity.js';
import { Turno } from './turno.entity.js';
import { alreadyExistsError, BadRequestError } from '../shared/errorsModel.js';
import { chocaEnMinutos, horaAMinutos } from './turno.availability.js';
import { esTurnoValido } from './turno.calendar.js';
import { motivoQueImpideCerrar } from './turno.estado.js'; 
import { enviarCorreo } from '../Email/email.service.js';
import {verifyTokenGestionTurno} from '../shared/auth/jwt.js';
import { generarHorariosDelDia } from './turno.schedule.js';
import { HistoriaClinica } from '../historiaClinica/historiaClinica.entity.js';
import { sCreateHistoriaDePaciente } from '../historiaClinica/historiaClinica.service.js';

// Actualizamos el Input para usar fecha y hora separadas
type TurnoInput = {
  fecha: string; // 'YYYY-MM-DD'
  hora_inicio: string; // 'HH:mm'
  paciente: Paciente;
  especialista: Especialista;
  aceptaParticular?: boolean;
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

  for (const turnoGuardado of turnosDelDia.filter((turno) => turno.estado !== 'CANCELADO')) {
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

function obtenerObraSocialDelTurno(input: TurnoInput): Paciente['obraSocial'] {
  const obraSocialPaciente = input.paciente.obraSocial;
  const coincideConEspecialista = Boolean(
    obraSocialPaciente &&
    input.especialista.obrasSociales.getItems().some(
      (obraSocial) => obraSocial.cod_os === obraSocialPaciente.cod_os,
    ),
  );

  if (coincideConEspecialista) return obraSocialPaciente;

  if (!input.aceptaParticular) {
    throw new BadRequestError(
      `El especialista no acepta la obra social del paciente. La consulta particular tiene un valor de $${Number(input.especialista.consulta_particular).toFixed(2)}. Debe aceptar el pago particular para continuar.`,
    );
  }

  return null;
}

/**
 * Genera la grilla de turnos visual para el frontend
 */
export async function sGetHorariosDisponibles(
  fecha: string,
  especialista: Especialista
): Promise<string[]> {
  const duracion_minutos = especialista.especialidad?.duracion_minutos ?? 0;

  const slotsPosibles = generarHorariosDelDia(fecha, duracion_minutos);
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
  const ahora = new Date();
  const fechaHoy = [
    ahora.getFullYear(),
    String(ahora.getMonth() + 1).padStart(2, '0'),
    String(ahora.getDate()).padStart(2, '0'),
  ].join('-');
  const minutosActuales = ahora.getHours() * 60 + ahora.getMinutes();

  return slotsPosibles.filter((slot) => {
    if (fecha === fechaHoy && horaAMinutos(slot) <= minutosActuales) return false;

    const slotInicio = horaAMinutos(slot);
    const slotFin = slotInicio + duracion_minutos;

    // Verificamos si este slot choca con algún turno ya guardado
    const estaOcupado = turnosOcupados.filter((turnoG) => turnoG.estado !== 'CANCELADO').some((turnoG) => {
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

  return await orm.em.find(Turno, where, { populate: ['paciente.obraSocial', 'especialista.especialidad', 'obraSocial'] });
}

export async function sGetTurnoById(cod_turno: number): Promise<Turno | null> {
  return await orm.em.findOne(Turno, { cod_turno }, { populate: ['paciente.obraSocial', 'especialista', 'obraSocial'] });
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
  const obraSocial = obtenerObraSocialDelTurno(input);

  const turno = orm.em.create(Turno, {
    fecha: input.fecha,
    hora_inicio: input.hora_inicio,
    paciente: input.paciente,
    especialista: input.especialista,
    obraSocial,
  });

  await orm.em.persistAndFlush(turno);
  //se envía correo del turno CREADO (primer correo que recibe)
  await enviarCorreo(turno.paciente.email,  "Constancia de turno", turno, 'pend');  
  return turno;
}


export async function sUpdateTurno(
  cod_turno: number,
  input: TurnoInput
): Promise<Turno | null> {
  const turno = await orm.em.findOne(Turno, { cod_turno });
  if (!turno) return null;
  if (turno.estado !== 'PENDIENTE') {
    throw new BadRequestError('No se puede modificar un turno que ya fue confirmado, cancelado, atendido o marcado como ausente');
  }

  const duracion = input.especialista.especialidad?.duracion_minutos ?? 0;
  if (!esTurnoValido(input.fecha, input.hora_inicio, duracion)) {
    throw new BadRequestError(
      'El horario debe coincidir con la duración de la consulta y estar dentro de la atención de 08:00 a 17:00'
    );
  }

  await ensureTurnoDisponible(
    input.fecha,
    input.hora_inicio,
    input.especialista,
    input.paciente,
    cod_turno
  );
  const obraSocial = obtenerObraSocialDelTurno(input);

  turno.fecha = input.fecha;
  turno.hora_inicio = input.hora_inicio;
  turno.paciente = input.paciente;
  turno.especialista = input.especialista;
  turno.obraSocial = obraSocial;

  await orm.em.flush();
  return turno;
}

export async function sDeleteTurno(cod_turno: number): Promise<boolean> {
  const turno = await orm.em.findOne(Turno, { cod_turno });
  if (!turno) return false;
  if (turno.estado === 'CANCELADO') {
    throw new BadRequestError('El turno ya está cancelado');
  }
  if (turno.estado === 'ATENDIDO' || turno.estado === 'AUSENTE') {
    throw new BadRequestError('No se puede cancelar un turno atendido o marcado como ausente');
  }
  turno.estado = 'CANCELADO';
  await orm.em.flush();
  return true;
}

export async function sConfirmarTurno(token:string, accion:'confirmar'|'cancelar'): Promise<Turno> {
  const payload = verifyTokenGestionTurno(token);
  const turno = await orm.em.findOne(Turno, { cod_turno: payload.cod_turno });
   if (!turno) {
    throw new BadRequestError('El turno ya no existe');
  }
  // Impide confirmar/cancelar dos veces desde el mismo enlace.
  if (turno.estado !== 'PENDIENTE') {
    throw new BadRequestError('Este turno ya fue gestionado');
  }
  turno.estado = accion === 'confirmar'? 'CONFIRMADO': 'CANCELADO';
  await orm.em.flush();
  return turno;
}

//para mostrar el turno en confirmacióno de asistencia tengo que validar el token primero
export async function sGetTurnoDelCorreo(
  token: string,
): Promise<Turno> {
  const payload = verifyTokenGestionTurno(token);

  const turno = await sGetTurnoById(payload.cod_turno);

  if (!turno) {
    throw new BadRequestError('El turno ya no existe');
  }

  return turno;
}

export async function sAtenderTurno(
  cod_turno: number,
  datos: { diagnostico: string; indicaciones?: string },
): Promise<Turno | null> {
  const turno = await orm.em.findOne(Turno, { cod_turno });
  if (!turno) return null;

  const motivo = motivoQueImpideCerrar(turno.estado, turno.fecha);
  if (motivo) throw new BadRequestError(motivo);

  turno.estado = 'ATENDIDO';
  
  await sCreateHistoriaDePaciente({cod_turno: turno.cod_turno, indicaciones: datos.indicaciones?? undefined, diagnostico: datos.diagnostico});

  await orm.em.flush();
  return turno;
}

/** El paciente no se presentó a la consulta. */
export async function sMarcarAusente(cod_turno: number): Promise<Turno | null> {
  const turno = await orm.em.findOne(Turno, { cod_turno });
  if (!turno) return null;

  const motivo = motivoQueImpideCerrar(turno.estado, turno.fecha);
  if (motivo) throw new BadRequestError(motivo);

  turno.estado = 'AUSENTE';
  await orm.em.flush();
  return turno;
}