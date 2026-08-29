import { Request, Response } from 'express';
import { NotFoundError } from '../shared/errorsModel.js';
import {
  sGetAllEspecialidades,
  sGetEspecialidadById,
  sCreateEspecialidad,
  sUpdateEspecialidad,
  sDeleteEspecialidad,
  sGetEspecialistasByEspecialidad,
} from './especialidad.service.js';

export async function cGetAllEspecialidades(req: Request, res: Response) {
  const especialidades = await sGetAllEspecialidades();
  res.json(especialidades);
}

export async function cGetEspecialidadById(req: Request, res: Response) {
  const cod_especialidad = res.locals.params.cod_especialidad;
  const especialidad = await sGetEspecialidadById(cod_especialidad);

  if (!especialidad) {
    throw new NotFoundError('Especialidad no encontrada');
  }

  res.json(especialidad);
}

export async function cCreateEspecialidad(req: Request, res: Response) {
  const nombre = res.locals.body.nombre;
  const nuevaEspecialidad = await sCreateEspecialidad(nombre);
  res.status(201).json(nuevaEspecialidad);
}

export async function cUpdateEspecialidad(req: Request, res: Response) {
  const cod_especialidad = res.locals.params.cod_especialidad;
  const nombre = res.locals.body.nombre;

  const especialidad = await sUpdateEspecialidad(cod_especialidad, nombre);

  if (!especialidad) {
    throw new NotFoundError('Especialidad no encontrada');
  }

  res.json(especialidad);
}

export async function cGetEspecialistasByEspecialidad(req: Request, res: Response) {
  const cod_especialidad = res.locals.params.cod_especialidad;
  const especialidad = await sGetEspecialidadById(cod_especialidad);

  if (!especialidad) {
    throw new NotFoundError('Especialidad no encontrada');
  }

  const especialistas = await sGetEspecialistasByEspecialidad(cod_especialidad);
  res.json(especialistas);
}

export async function cDeleteEspecialidad(req: Request, res: Response) {
  const cod_especialidad = res.locals.params.cod_especialidad;
  const deleted = await sDeleteEspecialidad(cod_especialidad);

  if (!deleted) {
    throw new NotFoundError('Especialidad no encontrada');
  }

  res.status(204).send();
}
