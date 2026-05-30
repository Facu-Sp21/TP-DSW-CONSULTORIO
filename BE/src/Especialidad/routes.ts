import {Router} from 'express';
import {  cCreateEspecialidad, cDeleteEspecialidad, cGetAllEspecialidades ,cGetEspecialidadById, cUpdateEspecialidad } from './controller.js';
import {validate} from '../shared/schemaValidator.js';
import { especialidadBodySchema, especialidadParamsSchema } from './schema.js'; 


const especialidadRouter = Router();

especialidadRouter.post('/', validate({ body: especialidadBodySchema }), cCreateEspecialidad);
especialidadRouter.get('/', cGetAllEspecialidades);
especialidadRouter.get('/:cod_especialidad',validate({ params: especialidadParamsSchema }), cGetEspecialidadById);
especialidadRouter.put('/:cod_especialidad', validate({ body: especialidadBodySchema , params: especialidadParamsSchema }), cUpdateEspecialidad);
especialidadRouter.delete('/:cod_especialidad',validate({ params: especialidadParamsSchema }), cDeleteEspecialidad); 

export default especialidadRouter;