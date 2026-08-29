import { especialidadOpenApi } from '../especialidad/especialidad.openapi.js';

export const openApiDocument = {
  openapi: '3.1.0',
  info: {
    title: 'API del consultorio',
    version: '1.0.0',
    description: 'Documentación de la API del consultorio.',
  },
  tags: especialidadOpenApi.tags,
  paths: especialidadOpenApi.paths,
  components: especialidadOpenApi.components,
} as const;