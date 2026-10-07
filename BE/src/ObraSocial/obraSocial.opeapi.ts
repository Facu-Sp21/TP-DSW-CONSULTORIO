
export const obraSocialOpenApi = {

  openapi: '3.1.0',

  info: {
    title: 'API de Obras Sociales',
    version: '1.0.0',
    description: 'Documentación del módulo de obras sociales del consultorio.',
  },

  tags: [
    {
      name: 'ObraSocial',
      description: 'Operaciones CRUD para administrar obras sociales.',
    },
  ],

  paths: {

    '/obraSocial': {

      get: {
        tags: ['ObraSocial'],
        summary: 'Listar obras sociales',

        responses: {

          200: {
            description: 'Listado de obras sociales.',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/ObraSocial',
                  },
                },
              },
            },
          },

        },
      },

      post: {
        tags: ['ObraSocial'],
        summary: 'Crear una obra social',

        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ObraSocialInput',
              },
            },
          },
        },

        responses: {

          201: {
            description: 'Obra social creada correctamente.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ObraSocial',
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
            description: 'La obra social ya existe.',
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

    '/obraSocial/{cod_os}': {

      get: {

        tags: ['ObraSocial'],
        summary: 'Obtener una obra social por id',

        parameters: [
          {
            name: 'cod_os',
            in: 'path',
            required: true,
            description: 'Código único de la obra social.',
            schema: {
              type: 'integer',
              minimum: 1,
            },
          },
        ],

        responses: {

          200: {
            description: 'Obra social encontrada.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ObraSocial',
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
            description: 'Obra social no encontrada.',
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

        tags: ['ObraSocial'],
        summary: 'Actualizar una obra social',

        parameters: [
          {
            name: 'cod_os',
            in: 'path',
            required: true,
            description: 'Código único de la obra social.',
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
                $ref: '#/components/schemas/ObraSocialInput',
              },
            },
          },
        },

        responses: {

          200: {
            description: 'Obra social actualizada correctamente.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ObraSocial',
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
            description: 'Obra social no encontrada.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },

          409: {
            description: 'La obra social ya existe.',
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

        tags: ['ObraSocial'],
        summary: 'Eliminar una obra social',

        parameters: [
          {
            name: 'cod_os',
            in: 'path',
            required: true,
            description: 'Código único de la obra social.',
            schema: {
              type: 'integer',
              minimum: 1,
            },
          },
        ],

        responses: {

          204: {
            description: 'Obra social eliminada correctamente.',
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
            description: 'Obra social no encontrada.',
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

      ObraSocial: {

        type: 'object',

        properties: {

          cod_os: {
            type: 'integer',
            description: 'Identificador autogenerado de la obra social.',
          },

          nombre: {
            type: 'string',
            maxLength: 60,
            description: 'Nombre de la obra social.',
            example: 'OSDE',
          },

        },

        required: ['cod_os', 'nombre'],

      },

      ObraSocialInput: {

        type: 'object',

        properties: {

          nombre: {
            type: 'string',
            maxLength: 60,
            example: 'OSDE',
          },

        },

        required: ['nombre'],

      },

    },

  },

} as const;

