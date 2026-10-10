import { Request, Response } from 'express';
import { NotFoundError } from '../shared/errorsModel.js';
import { Afiliado } from './afiliado.entity.js';
import { sCreateAfiliado, sDeleteAfiliado, sGetAllAfiliados, sGetAfiliadoById, sUpdateAfiliado } from './afiliado.service.js';
import { sGetObraSocialById } from '../ObraSocial/obraSocial.service.js';
export async function cGetAllAfiliados(req: Request, res: Response) {
  const Afiliados = await sGetAllAfiliados();
  res.json(Afiliados);
}

export async function cGetAfiliadoById(req: Request, res: Response) {
  const id_afiliado = res.locals.params.id_Afiliado;
  const afiliado = await sGetAfiliadoById(id_afiliado);
  if(!afiliado) {
    throw new NotFoundError('Afiliado no encontrado');
  }
  res.json(afiliado);
}

export async function cCreateAfiliado(req: Request, res: Response) {
 
  const { nombreCompleto, dni, email, contrasenia, cod_os } = res.locals.body;
  const obraSocial= await sGetObraSocialById(cod_os);
  if(!obraSocial){
    throw new NotFoundError('Obra social no encontrada');
  }
  const afiliado = await sCreateAfiliado({ nombreCompleto, dni, email, contrasenia, obraSocial });
  res.status(201).json(afiliado);
}

export async function cUpdateAfiliado(req: Request, res: Response) {
  const id = res.locals.params.id_Afiliado;
  const {nombreCompleto, dni, email, contrasenia,cod_os} = res.locals.body;
  const obraSocial = await sGetObraSocialById(cod_os);
  if(!obraSocial){
    throw new NotFoundError('Obra social no encontrada');
  }
  const afiliadoActualizado = await sUpdateAfiliado(id,{
    nombreCompleto, dni, email, contrasenia, obraSocial});
  if(!afiliadoActualizado){
    throw new NotFoundError('Afiliado no encontrado');    
  }
}

export async function cDeleteAfiliado(req: Request, res: Response) {
  const id= res.locals.params.id_Afiliado;
  const eliminado = await sDeleteAfiliado(id);
  if(!eliminado){
    throw new NotFoundError('Afiliado no encontrado');
  }
  res.status(204).send();
}
