import{orm} from '../shared/db/orm.js';
import { ObraSocial } from './obraSocial.entity.js';

const em = orm.em;

export async function sGetObraSocialById(cod_os: number): Promise<ObraSocial | null> {
  
  return await em.findOne(ObraSocial, {cod_os});
}

export async function sGetObraSocialBynombre(nombre: string): Promise<ObraSocial | null> {
  return await em.findOne(ObraSocial, {nombre: nombre });
}


export async function sGetAllObrasSociales():Promise<ObraSocial[]>
{
   return await em.findAll(ObraSocial,{})
}


 export async function sCreateObraSocial(nombre:string):Promise<ObraSocial>
 {
   const os = em.create(ObraSocial,{nombre});
   em.persist(os);
   await em.flush();
   return os;
 }


 export async function sUpdateObraSocial(cod_os: number, nombre:string):Promise<ObraSocial | null>
 {
    const os = await em.findOne(ObraSocial,{cod_os});
    if(!os) return null;
    os.nombre = nombre;
    await em.flush();
    return os;
 }


 export async function sDeleteObraSocial(cod_os: number):Promise<ObraSocial | null>
 {
   const os = await em.findOne(ObraSocial,{cod_os});
   if(!os) return null;
   em.remove(os);
   await em.flush();
   return os;
 }