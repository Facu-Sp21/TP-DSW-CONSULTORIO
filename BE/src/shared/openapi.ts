import { especialidadOpenApi } from '../especialidad/especialidad.openapi.js';
import { especialistaOpenApi } from '../especialista/especialista.openapi.js';
import { pacienteOpenApi } from '../paciente/paciente.openapi.js';
import { turnoOpenApi } from '../turno/turno.openapi.js';
import { obraSocialOpenApi } from '../ObraSocial/obraSocial.opeapi.js';

const tags = [...especialidadOpenApi.tags, ...especialistaOpenApi.tags, ...pacienteOpenApi.tags, ...turnoOpenApi.tags,...obraSocialOpenApi.tags];
const paths = {
  ...especialidadOpenApi.paths,
  ...especialistaOpenApi.paths,
  ...pacienteOpenApi.paths,
  ...turnoOpenApi.paths,
  ...obraSocialOpenApi.paths,
};
const components = {
  schemas: {
    ...especialidadOpenApi.components.schemas,
    ...especialistaOpenApi.components.schemas,
    ...pacienteOpenApi.components.schemas,
    ...turnoOpenApi.components.schemas,
    ...obraSocialOpenApi.components.schemas,
  },
};

export const openApiDocument = {
  openapi: '3.1.0',
  info: {
    title: 'API del consultorio',
    version: '1.0.0',
    description: 'Documentación de la API del consultorio.',
  },
  tags,
  paths,
  components,
} as const;
