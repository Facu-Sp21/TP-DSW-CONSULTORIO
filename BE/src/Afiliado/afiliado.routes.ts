import { Router } from 'express';
import { 
  cCreateAfiliado, 
  cDeleteAfiliado, 
  cGetAllAfiliados, 
  cGetAfiliadoById, 
  cUpdateAfiliado 
} from './afiliado.controller.js';
import { validate } from '../shared/schemaValidator.js';
import { afiliadoBodySchema, afiliadoParamsSchema } from './afiliado.schema.js';

const afiliadoRouter = Router();

afiliadoRouter.post('/', validate({ body: afiliadoBodySchema }), cCreateAfiliado);
afiliadoRouter.get('/', cGetAllAfiliados);
afiliadoRouter.get('/:cod_afiliado', validate({ params: afiliadoParamsSchema }), cGetAfiliadoById);
afiliadoRouter.put('/:cod_afiliado', validate({ body: afiliadoBodySchema, params: afiliadoParamsSchema }), cUpdateAfiliado);
afiliadoRouter.delete('/:cod_afiliado', validate({ params: afiliadoParamsSchema }), cDeleteAfiliado);

export default afiliadoRouter;