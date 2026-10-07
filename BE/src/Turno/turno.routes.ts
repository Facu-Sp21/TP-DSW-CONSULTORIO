import {Router} from "express";
import { cCreateTurno} from "./turno.controller.js"; /*, cDeleteTurno, cGetAllTurnos, cGetTurnoById, cUpdateTurno  */
import { validate } from "../shared/schemaValidator.js";
import { turnoBodySchema, turnoParamsSchema } from "./turno.schema.js";

const turnoRouter= Router();

turnoRouter.post('/', validate({body: turnoBodySchema}), cCreateTurno);
/*
turnoRouter.get('/', cGetAllTurnos);
turnoRouter.get('/:cod_turno', validate({params: turnoParamsSchema}), cGetTurnoById);
turnoRouter.put('/:cod_turno', validate({body: turnoBodySchema, params: turnoParamsSchema}), cUpdateTurno);
turnoRouter.delete('/:cod_turno', validate({params: turnoParamsSchema}), cDeleteTurno);
*/
export default turnoRouter;