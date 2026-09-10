import { Request, Response } from 'express';
import { NotFoundError } from '../shared/errorsModel.js';
import { sGetEspecialidadById } from '../especialidad/especialidad.service.js';
import {
  sCreateEspecialista,
  sDeleteEspecialista,
  sGetAllEspecialistas,
  sGetEspecialistaById,
  sUpdateEspecialista,
} from './especialista.service.js';

export async function cGetAllEspecialistas(req: Request, res: Response) {
  const especialistas = await sGetAllEspecialistas();
  res.json(especialistas);
}

export async function cGetEspecialistaById(req: Request, res: Response) {
  const cod_especialista = res.locals.params.cod_especialista;
  const especialista = await sGetEspecialistaById(cod_especialista);

  if (!especialista) {
    throw new NotFoundError('Especialista no encontrado');
  }

  res.json(especialista);
}

export async function cCreateEspecialista(req: Request, res: Response) {
  const { matricula, nombre, telefono, cod_especialidad } = res.locals.body;
  const especialidad = await sGetEspecialidadById(cod_especialidad);

  if (!especialidad) {
    throw new NotFoundError('Especialidad no encontrada');
  }

  const nuevoEspecialista = await sCreateEspecialista({
    matricula,
    nombre,
    telefono,
    especialidad,
  });

  res.status(201).json(nuevoEspecialista);
}

export async function cUpdateEspecialista(req: Request, res: Response) {
  const cod_especialista = res.locals.params.cod_especialista;
  const { matricula, nombre, telefono, cod_especialidad } = res.locals.body;
  const especialidad = await sGetEspecialidadById(cod_especialidad);

  if (!especialidad) {
    throw new NotFoundError('Especialidad no encontrada');
  }

  const especialista = await sUpdateEspecialista(cod_especialista, {
    matricula,
    nombre,
    telefono,
    especialidad,
  });

  if (!especialista) {
    throw new NotFoundError('Especialista no encontrado');
  }

  res.json(especialista);
}

export async function cDeleteEspecialista(req: Request, res: Response) {
  const cod_especialista = res.locals.params.cod_especialista;
  const deleted = await sDeleteEspecialista(cod_especialista);

  if (!deleted) {
    throw new NotFoundError('Especialista no encontrado');
  }

  res.status(204).send();
}
