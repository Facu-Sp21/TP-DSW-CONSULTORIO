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
  const cod_especialidad = req.query.especialidad ? Number(req.query.especialidad) : undefined;
  const especialistas = await sGetAllEspecialistas(cod_especialidad);
  res.json(especialistas);
}

export async function cGetEspecialistaById(req: Request, res: Response) {
  const cod_especialista = Number(res.locals.params.cod_especialista);
  const especialista = await sGetEspecialistaById(cod_especialista);
  if (!especialista) {
    throw new NotFoundError('Especialista no encontrado');
  }
  res.json(especialista);
}

export async function cCreateEspecialista(req: Request, res: Response) {
  const { matricula, nombre, email, telefono, contrasena, cod_especialidad } = res.locals.body;
  let especialidad = null;

  if (cod_especialidad) {
    especialidad = await sGetEspecialidadById(cod_especialidad);
    if (!especialidad) {
      throw new NotFoundError('Especialidad no encontrada');
    }
  }

  const claveFinal = contrasena || `doc${matricula.replace(/[^a-zA-Z0-9]/g, '')}`;

  const nuevoEspecialista = await sCreateEspecialista({
    matricula,
    nombre,
    email,
    telefono,
    contrasena: claveFinal,
    especialidad,
  });

  res.status(201).json(nuevoEspecialista);
}

export async function cUpdateEspecialista(req: Request, res: Response) {
  // Aseguramos que tome bien el ID de los parámetros validados por tu middleware
  const cod_especialista = Number(res.locals.params.cod_especialista);
  const { matricula, nombre, email, telefono, contrasena, cod_especialidad } = res.locals.body;
  let especialidad = null;

  if (cod_especialidad) {
    especialidad = await sGetEspecialidadById(cod_especialidad);
    if (!especialidad) {
      throw new NotFoundError('Especialidad no encontrada');
    }
  }

  const especialista = await sUpdateEspecialista(cod_especialista, {
    matricula,
    nombre,
    email,
    telefono,
    contrasena,
    especialidad,
  });

  if (!especialista) {
    throw new NotFoundError('Especialista no encontrado');
  }

  res.json(especialista);
}

export async function cDeleteEspecialista(req: Request, res: Response) {
  const cod_especialista = Number(res.locals.params.cod_especialista);
  const deleted = await sDeleteEspecialista(cod_especialista);
  if (!deleted) {
    throw new NotFoundError('Especialista no encontrado');
  }
  res.status(204).send();
}