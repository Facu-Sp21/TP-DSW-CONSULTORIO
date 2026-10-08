import { Router } from 'express';
import {
  cCreateTurno,
  cDeleteTurno,
  cGetHorariosDisponibles,
  cGetTurnos,
  cGetTurnoById,
  cUpdateTurno,
  cAtenderTurno,
  cMarcarAusente,
} from './turno.controller.js';
import { validate } from '../shared/schemaValidator.js';
import { disponibilidadQuerySchema, turnoBodySchema, turnoParamsSchema, turnoQuerySchema } from './turno.schema.js';
import { atenderTurnoBodySchema } from '../historiaClinica/historiaClinica.schema.js';

const turnoRouter = Router();

turnoRouter.get('/', validate({ query: turnoQuerySchema }), cGetTurnos); // con este endpoint podemos filtrar por paciente, especialista y/o fecha
turnoRouter.get('/disponibles', validate({ query: disponibilidadQuerySchema }), cGetHorariosDisponibles); // para mostrar grilla de turnos en el front
turnoRouter.get('/:cod_turno', validate({ params: turnoParamsSchema }), cGetTurnoById);
turnoRouter.post('/', validate({ body: turnoBodySchema }), cCreateTurno);
turnoRouter.put('/:cod_turno',validate({ body: turnoBodySchema, params: turnoParamsSchema }),cUpdateTurno,);
turnoRouter.delete('/:cod_turno', validate({ params: turnoParamsSchema }), cDeleteTurno);
turnoRouter.post('/:cod_turno/atender', validate({ params: turnoParamsSchema, body: atenderTurnoBodySchema }), cAtenderTurno);
turnoRouter.post('/:cod_turno/ausente', validate({ params: turnoParamsSchema }), cMarcarAusente);
export default turnoRouter;
