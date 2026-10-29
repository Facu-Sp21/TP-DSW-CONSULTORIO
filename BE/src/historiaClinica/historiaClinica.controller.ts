import { sGetHistoriaDePaciente, sCreateHistoriaDePaciente } from "./historiaClinica.service.js";
import {Request, Response} from 'express';

export async function cCreateHistoriaDePaciente (req: Request, res: Response){
  const hc = await sCreateHistoriaDePaciente(res.locals.body);
  return res.status(201).json(hc);

}

export async function cGetHistoriaDePaciente(req: Request, res:Response)
{
  res.json(await sGetHistoriaDePaciente(res.locals.query.nro_afiliado));
}
