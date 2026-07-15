import { Request, Response } from 'express';
import { NotFoundError } from '../shared/errorsModel.js';
import { dbAfiliados } from './repository.js';
import { Afiliado } from './entity.js';

export function cGetAllAfiliados(req: Request, res: Response) {
  res.json(dbAfiliados);
}

export function cGetAfiliadoById(req: Request, res: Response) {
  
  const id = parseInt(res.locals.params.id);
  const afiliado = dbAfiliados.find((a) => a.id === id);

  if (!afiliado) {
    throw new NotFoundError('Afiliado no encontrado');
  }

  res.json(afiliado);
}

export function cCreateAfiliado(req: Request, res: Response) {
  const { nombreCompleto, dni, email, password, obraSocialId } = res.locals.body;

  
  const nuevoId = dbAfiliados.length > 0 ? Math.max(...dbAfiliados.map(a => a.id)) + 1 : 1;
  
  const nuevoAfiliado = new Afiliado(nuevoId, nombreCompleto, dni, email, password, obraSocialId);
  dbAfiliados.push(nuevoAfiliado);
  
  res.status(201).json(nuevoAfiliado);
}

export function cUpdateAfiliado(req: Request, res: Response) {
  const id = parseInt(res.locals.params.id);
  const { nombreCompleto, dni, email, password, obraSocialId } = res.locals.body;

  const afiliadoIndex = dbAfiliados.findIndex((a) => a.id === id);

  if (afiliadoIndex === -1) {
    throw new NotFoundError('Afiliado no encontrado');
  }

  
  dbAfiliados[afiliadoIndex] = {
    ...dbAfiliados[afiliadoIndex],
    nombreCompleto: nombreCompleto || dbAfiliados[afiliadoIndex].nombreCompleto,
    dni: dni || dbAfiliados[afiliadoIndex].dni,
    email: email || dbAfiliados[afiliadoIndex].email,
    password: password || dbAfiliados[afiliadoIndex].password,
    obraSocialId: obraSocialId !== undefined ? obraSocialId : dbAfiliados[afiliadoIndex].obraSocialId
  };

  res.json(dbAfiliados[afiliadoIndex]);
}

export function cDeleteAfiliado(req: Request, res: Response) {
  const id = parseInt(res.locals.params.id);
  const afiliadoIndex = dbAfiliados.findIndex((a) => a.id === id);

  if (afiliadoIndex === -1) {
    throw new NotFoundError('Afiliado no encontrado');
  }

  dbAfiliados.splice(afiliadoIndex, 1);
  res.status(204).send();
}