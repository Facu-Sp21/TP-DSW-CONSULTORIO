import { Router } from 'express';
import {
  cCreateEspecialista,
  cDeleteEspecialista,
  cGetAllEspecialistas,
  cGetEspecialistaById,
  cUpdateEspecialista,
} from './especialista.controller.js';
import { validate } from '../shared/schemaValidator.js';
import { requireAuth } from '../shared/auth/authMiddleware.js';
import { especialistaBodySchema, especialistaParamsSchema } from './especialista.schema.js';

const especialistaRouter = Router();

// Ver la lista y el detalle queda público (se usa para elegir especialista al sacar un turno)
especialistaRouter.get('/', cGetAllEspecialistas);
especialistaRouter.get('/:cod_especialista', validate({ params: especialistaParamsSchema }), cGetEspecialistaById);

// Alta de especialista: solo un administrativo
especialistaRouter.post(
  '/',
  requireAuth(['administrativo']),
  validate({ body: especialistaBodySchema }),
  cCreateEspecialista,
);

// Editar/borrar: un administrativo, o el propio especialista sobre sus datos
especialistaRouter.put(
  '/:cod_especialista',
  requireAuth(['administrativo', 'especialista']),
  validate({ body: especialistaBodySchema, params: especialistaParamsSchema }),
  cUpdateEspecialista,
);
especialistaRouter.delete(
  '/:cod_especialista',
  requireAuth(['administrativo']),
  validate({ params: especialistaParamsSchema }),
  cDeleteEspecialista,
);

export default especialistaRouter;
