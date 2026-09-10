export const especialistaOpenApi = {
  openapi: '3.1.0',
  info: {
    title: 'API de Especialistas',
    version: '1.0.0',
    description: 'Documentación del módulo de especialistas del consultorio.',
  },
  tags: [
    {
      name: 'Especialista',
      description: 'Operaciones CRUD para administrar especialistas médicos.',
    },
  ],
  paths: {
    '/especialista': {
      get: {
        tags: ['Especialista'],
        summary: 'Listar especialistas',
        responses: {
          200: {
            description: 'Listado de especialistas.',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Especialista',
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Especialista'],
        summary: 'Crear un especialista',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/EspecialistaInput',
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Especialista creado correctamente.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Especialista',
                },
              },
            },
          },
          400: {
            description: 'Error de validación.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ValidationError',
                },
              },
            },
          },
          404: {
            description: 'La especialidad informada no existe.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },
    },
    '/especialista/{cod_especialista}': {
      get: {
        tags: ['Especialista'],
        summary: 'Obtener un especialista por id',
        parameters: [
          {
            name: 'cod_especialista',
            in: 'path',
            required: true,
            description: 'Código único del especialista.',
            schema: {
              type: 'integer',
              minimum: 1,
            },
          },
        ],
        responses: {
          200: {
            description: 'Especialista encontrado.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Especialista',
                },
              },
            },
          },
          400: {
            description: 'Parámetro inválido.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ValidationError',
                },
              },
            },
          },
          404: {
            description: 'Especialista no encontrado.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },
      put: {
        tags: ['Especialista'],
        summary: 'Actualizar un especialista',
        parameters: [
          {
            name: 'cod_especialista',
            in: 'path',
            required: true,
            description: 'Código único del especialista.',
            schema: {
              type: 'integer',
              minimum: 1,
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/EspecialistaInput',
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Especialista actualizado correctamente.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Especialista',
                },
              },
            },
          },
          400: {
            description: 'Error de validación.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ValidationError',
                },
              },
            },
          },
          404: {
            description: 'Especialista o especialidad no encontrada.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },
      delete: {
        tags: ['Especialista'],
        summary: 'Eliminar un especialista',
        parameters: [
          {
            name: 'cod_especialista',
            in: 'path',
            required: true,
            description: 'Código único del especialista.',
            schema: {
              type: 'integer',
              minimum: 1,
            },
          },
        ],
        responses: {
          204: {
            description: 'Especialista eliminado correctamente.',
          },
          400: {
            description: 'Parámetro inválido.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ValidationError',
                },
              },
            },
          },
          404: {
            description: 'Especialista no encontrado.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Especialista: {
        type: 'object',
        properties: {
          cod_especialista: {
            type: 'integer',
            description: 'Identificador autogenerado del especialista.',
          },
          matricula: {
            type: 'string',
            maxLength: 30,
            description: 'Matrícula profesional del especialista.',
            example: 'MP 12345',
          },
          nombre: {
            type: 'string',
            maxLength: 60,
            description: 'Nombre completo del especialista.',
            example: 'Laura Gómez',
          },
          telefono: {
            type: 'string',
            maxLength: 30,
            description: 'Teléfono de contacto del especialista.',
            example: '341 555-1234',
          },
          especialidad: {
            $ref: '#/components/schemas/Especialidad',
          },
        },
        required: ['cod_especialista', 'matricula', 'nombre', 'telefono', 'especialidad'],
      },
      EspecialistaInput: {
        type: 'object',
        properties: {
          matricula: {
            type: 'string',
            maxLength: 30,
            example: 'MP 12345',
          },
          nombre: {
            type: 'string',
            maxLength: 60,
            example: 'Laura Gómez',
          },
          telefono: {
            type: 'string',
            maxLength: 30,
            example: '341 555-1234',
          },
          cod_especialidad: {
            type: 'integer',
            minimum: 1,
            example: 1,
          },
        },
        required: ['matricula', 'nombre', 'telefono', 'cod_especialidad'],
      },
    },
  },
} as const;
