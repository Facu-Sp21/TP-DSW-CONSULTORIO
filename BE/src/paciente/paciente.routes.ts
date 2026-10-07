import { Router } from 'express';
import {
  cCreatePaciente,
  cDeletePaciente,
  cGetAllPacientes,
  cGetPacienteById,
  cUpdatePaciente,
} from './paciente.controller.js';
import { validate } from '../shared/schemaValidator.js';
import { 
  pacienteBodySchema, 
  pacienteUpdateBodySchema, 
  pacienteParamsSchema 
} from './paciente.schema.js';

const pacienteRouter = Router();

pacienteRouter.post('/', validate({ body: pacienteBodySchema }), cCreatePaciente);

pacienteRouter.get('/', cGetAllPacientes);

pacienteRouter.get('/:nro_afiliado', validate({ params: pacienteParamsSchema }), cGetPacienteById);

pacienteRouter.put(
  '/:nro_afiliado',
  validate({ body: pacienteUpdateBodySchema, params: pacienteParamsSchema }),
  cUpdatePaciente,
);

pacienteRouter.delete('/:nro_afiliado', validate({ params: pacienteParamsSchema }), cDeletePaciente);

export default pacienteRouter;
