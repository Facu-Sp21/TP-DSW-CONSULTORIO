import { especialidadOpenApi } from '../especialidad/especialidad.openapi.js';
import { especialistaOpenApi } from '../especialista/especialista.openapi.js';

const tags = [...especialidadOpenApi.tags, ...especialistaOpenApi.tags];
const paths = {
  ...especialidadOpenApi.paths,
  ...especialistaOpenApi.paths,
};
const components = {
  schemas: {
    ...especialidadOpenApi.components.schemas,
    ...especialistaOpenApi.components.schemas,
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
