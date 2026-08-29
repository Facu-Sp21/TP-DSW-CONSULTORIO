import { Router } from 'express';
import {
  cCreateEspecialista,
  cDeleteEspecialista,
  cGetAllEspecialistas,
  cGetEspecialistaById,
  cUpdateEspecialista,
} from './especialista.controller.js';
import { validate } from '../shared/schemaValidator.js';
import { especialistaBodySchema, especialistaParamsSchema } from './especialista.schema.js';

const especialistaRouter = Router();

especialistaRouter.post('/', validate({ body: especialistaBodySchema }), cCreateEspecialista);
especialistaRouter.get('/', cGetAllEspecialistas);
especialistaRouter.get('/:cod_especialista', validate({ params: especialistaParamsSchema }), cGetEspecialistaById);
especialistaRouter.put(
  '/:cod_especialista',
  validate({ body: especialistaBodySchema, params: especialistaParamsSchema }),
  cUpdateEspecialista,
);
especialistaRouter.delete('/:cod_especialista', validate({ params: especialistaParamsSchema }), cDeleteEspecialista);

export default especialistaRouter;
