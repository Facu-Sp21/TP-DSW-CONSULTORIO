import { Request, Response } from 'express';
import { NotFoundError } from '../shared/errorsModel.js';
import { dbEspecialidades } from './repository.js';

export function cGetAllEspecialidades(req: Request, res: Response) {
  res.json(dbEspecialidades);
}

export function cGetEspecialidadById(req: Request, res: Response) {
  const cod_especialidad  = res.locals.params.cod_especialidad;
  const especialidad = dbEspecialidades.find((e) => e.cod_especialidad === cod_especialidad);


  if (!especialidad) {
    throw new NotFoundError('Especialidad no encontrada');
  }

  res.json(especialidad);
}

export function cCreateEspecialidad(req: Request, res: Response) {
  const nombre  = res.locals.body.nombre;
  const nuevaEspecialidad = { cod_especialidad: dbEspecialidades.length + 1, nombre };
  dbEspecialidades.push(nuevaEspecialidad);
  res.status(201).json(nuevaEspecialidad);
}

export function cUpdateEspecialidad(req: Request, res: Response) {
  const cod_especialidad = res.locals.params.cod_especialidad;
  const nombre = res.locals.body.nombre;

  const especialidadIndex = dbEspecialidades.findIndex((e) => e.cod_especialidad === cod_especialidad);

  if (especialidadIndex === -1) {
    throw new NotFoundError('Especialidad no encontrada');
  }

  dbEspecialidades[especialidadIndex].nombre = nombre;
  res.json(dbEspecialidades[especialidadIndex]);
}

export function cDeleteEspecialidad(req: Request, res: Response) {
  const cod_especialidad = res.locals.params.cod_especialidad;
  const especialidadIndex = dbEspecialidades.findIndex((e) => e.cod_especialidad === cod_especialidad);

  if (especialidadIndex === -1) {
    throw new NotFoundError('Especialidad no encontrada');
  }

  dbEspecialidades.splice(especialidadIndex, 1);
  res.status(204).send();
}