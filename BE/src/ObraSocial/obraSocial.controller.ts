import {Request, Response} from 'express';
import {NotFoundError, alreadyExistsError} from '../shared/errorsModel.js';
import {sGetAllObrasSociales, sGetObraSocialById, sCreateObraSocial, sUpdateObraSocial, sDeleteObraSocial, sGetObraSocialBynombre} from './obraSocial.service.js';  

export async function cGetAllObrasSociales(req: Request, res: Response) {
  const obrasSociales = await sGetAllObrasSociales();
  res.json(obrasSociales);  
}

 export async function cGetObraSocialById(req: Request, res: Response) {
  const cod_os = res.locals.params.cod_os;
  const obraSocial = await sGetObraSocialById(cod_os);
  if(!obraSocial){throw new NotFoundError('Obra Social no encontrada');}
  res.json(obraSocial);
 }
 
 export async function cCreateObraSocial(req: Request, res: Response) {
  const {nombre} = res.locals.body; 
  const existe = await sGetObraSocialBynombre(nombre); //habría que agregar restricción unique en nombre?
  if(existe)
    {
      throw new alreadyExistsError('Obra Social ya existente');
    }

  const nuevaObraSocial = await sCreateObraSocial(nombre);
  res.status(201).json(nuevaObraSocial);
 }

 export async function cUpdateObraSocial(req: Request, res: Response) {
  const cod_os = res.locals.params.cod_os;
  const os = await sGetObraSocialById(cod_os);

  if(!os){throw new NotFoundError('Obra Social no encontrada');}
  const nombre = res.locals.body.nombre;
  const existe = await sGetObraSocialBynombre(nombre);
  if(existe && existe.cod_os !== cod_os)
    {
      throw new alreadyExistsError('Obra Social ya existente');
    }

  const obraSocialActualizada = await sUpdateObraSocial(cod_os, nombre);
  res.json(obraSocialActualizada);
 }
 
 export async function cDeleteObraSocial(req: Request, res: Response) {
  const cod_os = res.locals.params.cod_os;
  const os = await sDeleteObraSocial(cod_os);
  if(!os)
    {
      throw new NotFoundError('Obra Social no encontrada');
    }
    res.status(204).send();
 }