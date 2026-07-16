import { Router } from 'express';
import { 
  cCreateAdministrativo, 
  cDeleteAdministrativo, 
  cGetAllAdministrativos, 
  cGetAdministrativoById, 
  cUpdateAdministrativo 
} from './controller.js';
import { validate } from '../shared/schemaValidator.js';
import { administrativoBodySchema, administrativoParamsSchema } from './schema.js';

const administrativoRouter = Router();

administrativoRouter.post('/', validate({ body: administrativoBodySchema }), cCreateAdministrativo);
administrativoRouter.get('/', cGetAllAdministrativos);
administrativoRouter.get('/:id', validate({ params: administrativoParamsSchema }), cGetAdministrativoById);
administrativoRouter.put('/:id', validate({ body: administrativoBodySchema, params: administrativoParamsSchema }), cUpdateAdministrativo);
administrativoRouter.delete('/:id', validate({ params: administrativoParamsSchema }), cDeleteAdministrativo);

export default administrativoRouter;