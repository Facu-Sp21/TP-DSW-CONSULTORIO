import { Request, Response } from 'express';
import { NotFoundError } from '../shared/errorsModel.js';
import {
  sCreatePaciente,
  sDeletePaciente,
  sGetAllPacientes,
  sGetPacienteById,
  sUpdatePaciente,
} from './paciente.service.js';

export async function cGetAllPacientes(req: Request, res: Response) {
  const pacientes = await sGetAllPacientes();
  res.json(pacientes);
}

export async function cGetPacienteById(req: Request, res: Response) {
  const nro_afiliado = res.locals.params.nro_afiliado;
  const paciente = await sGetPacienteById(nro_afiliado);

  if (!paciente) {
    throw new NotFoundError('Paciente no encontrado');
  }

  res.json(paciente);
}

export async function cCreatePaciente(req: Request, res: Response) {
  const paciente = await sCreatePaciente(res.locals.body);
  res.status(201).json(paciente);
}

export async function cUpdatePaciente(req: Request, res: Response) {
  const nro_afiliado = res.locals.params.nro_afiliado;
  const paciente = await sUpdatePaciente(nro_afiliado, res.locals.body);

  if (!paciente) {
    throw new NotFoundError('Paciente no encontrado');
  }

  res.json(paciente);
}

export async function cDeletePaciente(req: Request, res: Response) {
  const nro_afiliado = res.locals.params.nro_afiliado;
  const deleted = await sDeletePaciente(nro_afiliado);

  if (!deleted) {
    throw new NotFoundError('Paciente no encontrado');
  }

  res.status(204).send();
}
