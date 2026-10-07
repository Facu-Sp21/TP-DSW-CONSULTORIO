import {Request,Response} from 'express';
import {sCreateTurno} from "./turno.service.js"; /*, sDeleteTurno, sGetAllTurnos, sGetTurnoById, sUpdateTurno}*/
import {sGetAfiliadoById} from "../Afiliado/afiliado.service.js";
import {sGetEspecialistaById} from "../especialista/especialista.service.js";
import {NotFoundError} from "../shared/errorsModel.js";

export async function cCreateTurno(req: Request, res: Response) {
  const {fecha, hora, cod_afiliado, cod_especialista} = res.locals.body;
  const afiliado = await sGetAfiliadoById(cod_afiliado);
  const especialista = await sGetEspecialistaById(cod_especialista);
  if(afiliado && especialista) {
    const turno = await sCreateTurno({fecha, hora, afiliado, especialista});
    res.status(201).json(turno);
    
  } else throw(new NotFoundError("Afiliado o Especialista no encontrado"));
  
}
