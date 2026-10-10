import {orm} from '../shared/db/orm.js';
import { Afiliado } from './afiliado.entity.js';
import { ObraSocial } from '../ObraSocial/obraSocial.entity.js';
const em= orm.em;

type AfiliadoInput = {
  nombreCompleto: string;
  dni: string;
  email: string;
  contrasenia: string;
  obraSocial: ObraSocial;

}
 //FALTA VALIDAR AUTORIZACION DE USUARIO
export async function sGetAllAfiliados(): Promise<Afiliado[]> {
  return await orm.em.find(Afiliado,{},{populate:['obraSocial']});

}
export async function sGetAfiliadoById(cod_afiliado: number): Promise<Afiliado | null> {
  return await orm.em.findOne(Afiliado,{cod_afiliado},{populate:['obraSocial']})
}
export async function sCreateAfiliado(input:AfiliadoInput): Promise<Afiliado> {
  const afiliado = orm.em.create(Afiliado, input);
  orm.em.persist(afiliado);
  await orm.em.flush();
  return afiliado;
} 
export async function sUpdateAfiliado(cod_afiliado: number, input: AfiliadoInput): Promise<Afiliado | null> {

  const afiliado = await orm.em.findOne(Afiliado, { cod_afiliado });
  if (!afiliado) {
    return null;
  }
  afiliado.nombreCompleto = input.nombreCompleto;
  afiliado.dni = input.dni;
  afiliado.email = input.email;
  afiliado.obraSocial = input.obraSocial;
  await orm.em.flush();
  return afiliado;
}
export async function sDeleteAfiliado(cod_afiliado: number): Promise<boolean> {
  const afiliado = await orm.em.findOne(Afiliado,{cod_afiliado});
  if(!afiliado){
    return false;
  }
  orm.em.remove(afiliado);
  await orm.em.flush();
  return true;
}

