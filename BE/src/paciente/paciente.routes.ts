import { Router } from 'express';
import {
  cCreatePaciente,
  cDeletePaciente,
  cGetAllPacientes,
  cGetPacienteById,
  cUpdatePaciente,
} from './paciente.controller.js';
import { validate } from '../shared/schemaValidator.js';
import { requireAuth } from '../shared/auth/authMiddleware.js';
import { 
  pacienteBodySchema, 
  pacienteUpdateBodySchema, 
  pacienteParamsSchema 
} from './paciente.schema.js';

const pacienteRouter = Router();

// El registro queda público: cualquiera puede crear su cuenta de paciente
pacienteRouter.post('/', validate({ body: pacienteBodySchema }), cCreatePaciente);

// Listar todos los pacientes: solo el personal administrativo
pacienteRouter.get('/', requireAuth(['administrativo']), cGetAllPacientes);

// Ver/editar/borrar un paciente puntual: el propio paciente o un administrativo
pacienteRouter.get(
  '/:nro_afiliado',
  requireAuth(['administrativo', 'paciente']),
  validate({ params: pacienteParamsSchema }),
  cGetPacienteById,
);

pacienteRouter.put(
  '/:nro_afiliado',
  requireAuth(['administrativo', 'paciente']),
  validate({ body: pacienteUpdateBodySchema, params: pacienteParamsSchema }),
  cUpdatePaciente,
);

pacienteRouter.delete(
  '/:nro_afiliado',
  requireAuth(['administrativo', 'paciente']),
  validate({ params: pacienteParamsSchema }),
  cDeletePaciente,
);

export default pacienteRouter;
