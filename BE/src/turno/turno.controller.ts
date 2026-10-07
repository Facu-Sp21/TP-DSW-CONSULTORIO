import { Request, Response } from 'express';
import { NotFoundError } from '../shared/errorsModel.js';
import { sGetEspecialistaById } from '../especialista/especialista.service.js';
import { sGetPacienteById } from '../paciente/paciente.service.js';
import {
  sCreateTurno,
  sDeleteTurno,
  sGetHorariosDisponibles,
  sGetTurnos,
  sGetTurnoById,
  sUpdateTurno,
} from './turno.service.js';

export async function cGetTurnos(req: Request, res: Response) {
  const turnos = await sGetTurnos(res.locals.query);
  res.json(turnos);
}

export async function cGetHorariosDisponibles(req: Request, res: Response) {
  const { fecha, cod_especialista } = res.locals.query;
  const especialista = await sGetEspecialistaById(cod_especialista);

  if (!especialista) {
    throw new NotFoundError('Especialista no encontrado');
  }

  const horarios = await sGetHorariosDisponibles(fecha, especialista);
  res.json({
    fecha: fecha,
    horarios,
  }); // ej: { fecha: '2026-09-22', horarios: ['08:00', '08:30', '09:00', ...] }
}

export async function cGetTurnoById(req: Request, res: Response) {
  const cod_turno = res.locals.params.cod_turno;
  const turno = await sGetTurnoById(cod_turno);

  if (!turno) {
    throw new NotFoundError('Turno no encontrado');
  }

  res.json(turno);
}

export async function cCreateTurno(req: Request, res: Response) {
  const { fecha, hora_inicio, nro_afiliado, cod_especialista } = res.locals.body;
  const paciente = await sGetPacienteById(nro_afiliado);

  if (!paciente) {
    throw new NotFoundError('Paciente no encontrado');
  }

  const especialista = await sGetEspecialistaById(cod_especialista);

  if (!especialista) {
    throw new NotFoundError('Especialista no encontrado');
  }

  const nuevoTurno = await sCreateTurno({
    fecha,
    hora_inicio,
    paciente,
    especialista,
  });

  res.status(201).json(nuevoTurno);
}

export async function cUpdateTurno(req: Request, res: Response) {
  const cod_turno = res.locals.params.cod_turno;
  const { fecha, hora_inicio, nro_afiliado, cod_especialista } = res.locals.body;
  const paciente = await sGetPacienteById(nro_afiliado);

  if (!paciente) {
    throw new NotFoundError('Paciente no encontrado');
  }

  const especialista = await sGetEspecialistaById(cod_especialista);

  if (!especialista) {
    throw new NotFoundError('Especialista no encontrado');
  }

  const turno = await sUpdateTurno(cod_turno, {
    fecha,
    hora_inicio,
    paciente,
    especialista,
  });

  if (!turno) {
    throw new NotFoundError('Turno no encontrado');
  }

  res.json(turno);
}

export async function cDeleteTurno(req: Request, res: Response) {
  const cod_turno = res.locals.params.cod_turno;
  const deleted = await sDeleteTurno(cod_turno);

  if (!deleted) {
    throw new NotFoundError('Turno no encontrado');
  }

  res.status(204).send();
}
