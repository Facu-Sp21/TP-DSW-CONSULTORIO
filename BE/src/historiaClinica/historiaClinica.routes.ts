import { Router, Request, Response } from 'express';
import { validate } from '../shared/schemaValidator.js';
import { historiaQuerySchema } from './historiaClinica.schema.js';
import { sGetHistoriaDePaciente } from './historiaClinica.service.js';

const historiaClinicaRouter = Router();

historiaClinicaRouter.get('/', validate({ query: historiaQuerySchema }), async (_req: Request, res: Response) => {
  res.json(await sGetHistoriaDePaciente(res.locals.query.nro_afiliado));
});

export default historiaClinicaRouter;