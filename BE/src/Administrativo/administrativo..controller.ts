import { Request, Response } from 'express';
import { ForbiddenError, NotFoundError } from '../shared/errorsModel.js';
import {
  sCreateAdministrativo,
  sDeleteAdministrativo,
  sGetAllAdministrativos,
  sGetAdministrativoById,
  sUpdateAdministrativo,
} from './administrativo.service.js';

export async function cGetAllAdministrativos(req: Request, res: Response) {
  const administrativos = await sGetAllAdministrativos();
  // Nunca devolvemos el hash de la contraseña al frontend
  res.json(administrativos.map(({ password, ...resto }) => resto));
}

export async function cGetAdministrativoById(req: Request, res: Response) {
  const id = Number(res.locals.params.id);
  const administrativo = await sGetAdministrativoById(id);

  if (!administrativo) {
    throw new NotFoundError('Administrativo no encontrado');
  }

  const { password, ...resto } = administrativo;
  res.json(resto);
}

export async function cCreateAdministrativo(req: Request, res: Response) {
  const nuevoAdmin = await sCreateAdministrativo(res.locals.body);
  const { password, ...resto } = nuevoAdmin;
  res.status(201).json(resto);
}

export async function cUpdateAdministrativo(req: Request, res: Response) {
  const id = Number(res.locals.params.id);

  // Un administrativo solo puede editarse a sí mismo, salvo que sea el propio admin logueado
  if (req.user?.rol === 'administrativo' && req.user.id !== id) {
    throw new ForbiddenError('No podés editar los datos de otro administrativo');
  }

  const administrativo = await sUpdateAdministrativo(id, res.locals.body);

  if (!administrativo) {
    throw new NotFoundError('Administrativo no encontrado');
  }

  const { password, ...resto } = administrativo;
  res.json(resto);
}

export async function cDeleteAdministrativo(req: Request, res: Response) {
  const id = Number(res.locals.params.id);
  const deleted = await sDeleteAdministrativo(id);

  if (!deleted) {
    throw new NotFoundError('Administrativo no encontrado');
  }

  res.status(204).send();
}
