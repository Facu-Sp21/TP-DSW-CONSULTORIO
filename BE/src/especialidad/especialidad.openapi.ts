export const especialidadOpenApi = {
  openapi: '3.1.0',
  info: {
    title: 'API de Especialidades',
    version: '1.0.0',
    description: 'Documentación del módulo de especialidades del consultorio.',
  },
  tags: [
    {
      name: 'Especialidad',
      description: 'Operaciones CRUD para administrar especialidades médicas.',
    },
  ],
  paths: {
    '/especialidad': {
      get: {
        tags: ['Especialidad'],
        summary: 'Listar especialidades',
        responses: {
          200: {
            description: 'Listado de especialidades.',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Especialidad',
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Especialidad'],
        summary: 'Crear una especialidad',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/EspecialidadInput',
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Especialidad creada correctamente.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Especialidad',
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
          409: {
            description: 'El recurso ya existe.',
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
    '/especialidad/{cod_especialidad}': {
      get: {
        tags: ['Especialidad'],
        summary: 'Obtener una especialidad por id',
        parameters: [
          {
            name: 'cod_especialidad',
            in: 'path',
            required: true,
            description: 'Código único de la especialidad.',
            schema: {
              type: 'integer',
              minimum: 1,
            },
          },
        ],
        responses: {
          200: {
            description: 'Especialidad encontrada.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Especialidad',
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
            description: 'Especialidad no encontrada.',
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
        tags: ['Especialidad'],
        summary: 'Actualizar una especialidad',
        parameters: [
          {
            name: 'cod_especialidad',
            in: 'path',
            required: true,
            description: 'Código único de la especialidad.',
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
                $ref: '#/components/schemas/EspecialidadInput',
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Especialidad actualizada correctamente.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Especialidad',
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
            description: 'Especialidad no encontrada.',
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
        tags: ['Especialidad'],
        summary: 'Eliminar una especialidad',
        parameters: [
          {
            name: 'cod_especialidad',
            in: 'path',
            required: true,
            description: 'Código único de la especialidad.',
            schema: {
              type: 'integer',
              minimum: 1,
            },
          },
        ],
        responses: {
          204: {
            description: 'Especialidad eliminada correctamente.',
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
            description: 'Especialidad no encontrada.',
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
      Especialidad: {
        type: 'object',
        properties: {
          cod_especialidad: {
            type: 'integer',
            description: 'Identificador autogenerado de la especialidad.',
          },
          nombre: {
            type: 'string',
            maxLength: 60,
            description: 'Nombre de la especialidad.',
            example: 'Cardiología',
          },
        },
        required: ['cod_especialidad', 'nombre'],
      },
      EspecialidadInput: {
        type: 'object',
        properties: {
          nombre: {
            type: 'string',
            maxLength: 60,
            description: 'Nombre de la especialidad.',
            example: 'Pediatría',
          },
        },
        required: ['nombre'],
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: 'Especialidad no encontrada',
          },
        },
        required: ['message'],
      },
      ValidationError: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: 'Validation error',
          },
          errors: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                path: {
                  type: 'string',
                  example: 'nombre',
                },
                message: {
                  type: 'string',
                  example: 'El nombre de la especialidad es obligatorio',
                },
              },
              required: ['path', 'message'],
            },
          },
        },
        required: ['message', 'errors'],
      },
    },
  },
} as const;
