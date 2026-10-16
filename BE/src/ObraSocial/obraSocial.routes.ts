import{Router} from 'express';
import {validate} from '../shared/schemaValidator.js';
import { obraSocialParamsSchema, obraSocialBodySchema } from './obraSocial.schema.js';
import { cGetAllObrasSociales, cGetObraSocialById, cCreateObraSocial, cUpdateObraSocial, cDeleteObraSocial } from './obraSocial.controller.js'; 
const obraSocialRouter = Router();


obraSocialRouter.get('/', cGetAllObrasSociales);
obraSocialRouter.get('/:cod_os', validate({ params: obraSocialParamsSchema }), cGetObraSocialById);
obraSocialRouter.post('/', validate({ body: obraSocialBodySchema }), cCreateObraSocial);
obraSocialRouter.put('/:cod_os', validate({ params: obraSocialParamsSchema, body: obraSocialBodySchema }), cUpdateObraSocial);
obraSocialRouter.delete('/:cod_os', validate({ params: obraSocialParamsSchema }), cDeleteObraSocial);


export default obraSocialRouter;