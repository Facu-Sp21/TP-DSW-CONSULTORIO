import { Router, Request, Response } from 'express';
import { validate } from '../shared/schemaValidator.js';
import { historiaQuerySchema, crearHistoriaBodySchema} from './historiaClinica.schema.js';
import { cCreateHistoriaDePaciente, cGetHistoriaDePaciente } from './historiaClinica.controller.js';

const historiaClinicaRouter = Router();

historiaClinicaRouter.get('/', validate({ query: historiaQuerySchema }), cGetHistoriaDePaciente);


historiaClinicaRouter.post('/',validate({body: crearHistoriaBodySchema}),cCreateHistoriaDePaciente);

export default historiaClinicaRouter;