import { Router } from 'express';
import { 
  cCreateAfiliado, 
  cDeleteAfiliado, 
  cGetAllAfiliados, 
  cGetAfiliadoById, 
  cUpdateAfiliado 
} from './controller.js';
import { validate } from '../shared/schemaValidator.js';
import { afiliadoBodySchema, afiliadoParamsSchema } from './schema.js';

const afiliadoRouter = Router();

afiliadoRouter.post('/', validate({ body: afiliadoBodySchema }), cCreateAfiliado);
afiliadoRouter.get('/', cGetAllAfiliados);
afiliadoRouter.get('/:id', validate({ params: afiliadoParamsSchema }), cGetAfiliadoById);
afiliadoRouter.put('/:id', validate({ body: afiliadoBodySchema, params: afiliadoParamsSchema }), cUpdateAfiliado);
afiliadoRouter.delete('/:id', validate({ params: afiliadoParamsSchema }), cDeleteAfiliado);

export default afiliadoRouter;