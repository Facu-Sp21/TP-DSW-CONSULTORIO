import { Request, Response } from 'express';
import { NotFoundError } from '../shared/errorsModel.js';
import { dbAdministrativos } from './repository.js';
import { Administrativo } from './entity.js';

export function cGetAllAdministrativos(req: Request, res: Response) {
  res.json(dbAdministrativos);
}

export function cGetAdministrativoById(req: Request, res: Response) {
  const id = parseInt(res.locals.params.id);
  const administrativo = dbAdministrativos.find((a) => a.id === id);

  if (!administrativo) {
    throw new NotFoundError('Administrativo no encontrado');
  }

  res.json(administrativo);
}

export function cCreateAdministrativo(req: Request, res: Response) {
  const { nombreCompleto, legajo, email, password } = res.locals.body;

  const nuevoId = dbAdministrativos.length > 0 ? Math.max(...dbAdministrativos.map(a => a.id)) + 1 : 1;
  
  const nuevoAdmin = new Administrativo(nuevoId, nombreCompleto, legajo, email, password);
  dbAdministrativos.push(nuevoAdmin);
  
  res.status(201).json(nuevoAdmin);
}

export function cUpdateAdministrativo(req: Request, res: Response) {
  const id = parseInt(res.locals.params.id);
  const { nombreCompleto, legajo, email, password } = res.locals.body;

  const adminIndex = dbAdministrativos.findIndex((a) => a.id === id);

  if (adminIndex === -1) {
    throw new NotFoundError('Administrativo no encontrado');
  }

  dbAdministrativos[adminIndex] = {
    ...dbAdministrativos[adminIndex],
    nombreCompleto: nombreCompleto || dbAdministrativos[adminIndex].nombreCompleto,
    legajo: legajo || dbAdministrativos[adminIndex].legajo,
    email: email || dbAdministrativos[adminIndex].email,
    password: password || dbAdministrativos[adminIndex].password
  };

  res.json(dbAdministrativos[adminIndex]);
}

export function cDeleteAdministrativo(req: Request, res: Response) {
  const id = parseInt(res.locals.params.id);
  const adminIndex = dbAdministrativos.findIndex((a) => a.id === id);

  if (adminIndex === -1) {
    throw new NotFoundError('Administrativo no encontrado');
  }

  dbAdministrativos.splice(adminIndex, 1);
  res.status(204).send();
}