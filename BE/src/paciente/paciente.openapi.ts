export const pacienteOpenApi = {
  openapi: '3.1.0',
  info: {
    title: 'API de Pacientes',
    version: '1.0.0',
    description: 'Documentación del módulo de pacientes del consultorio.',
  },
  tags: [
    {
      name: 'Paciente',
      description: 'Operaciones CRUD para administrar pacientes.',
    },
  ],
  paths: {
    '/paciente': {
      get: {
        tags: ['Paciente'],
        summary: 'Listar pacientes',
        responses: {
          200: {
            description: 'Listado de pacientes.',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Paciente',
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Paciente'],
        summary: 'Crear un paciente',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/PacienteInput',
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Paciente creado correctamente.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Paciente',
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
        },
      },
    },
    '/paciente/{nro_afiliado}': {
      get: {
        tags: ['Paciente'],
        summary: 'Obtener un paciente por id',
        parameters: [
          {
            name: 'nro_afiliado',
            in: 'path',
            required: true,
            description: 'Número de afiliado del paciente.',
            schema: {
              type: 'integer',
              minimum: 1,
            },
          },
        ],
        responses: {
          200: {
            description: 'Paciente encontrado.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Paciente',
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
            description: 'Paciente no encontrado.',
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
        tags: ['Paciente'],
        summary: 'Actualizar un paciente',
        parameters: [
          {
            name: 'nro_afiliado',
            in: 'path',
            required: true,
            description: 'Número de afiliado del paciente.',
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
                $ref: '#/components/schemas/PacienteInput',
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Paciente actualizado correctamente.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Paciente',
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
            description: 'Paciente no encontrado.',
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
        tags: ['Paciente'],
        summary: 'Eliminar un paciente',
        parameters: [
          {
            name: 'nro_afiliado',
            in: 'path',
            required: true,
            description: 'Número de afiliado del paciente.',
            schema: {
              type: 'integer',
              minimum: 1,
            },
          },
        ],
        responses: {
          204: {
            description: 'Paciente eliminado correctamente.',
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
            description: 'Paciente no encontrado.',
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
      Paciente: {
        type: 'object',
        properties: {
          nro_afiliado: {
            type: 'integer',
            description: 'Identificador autogenerado del paciente.',
          },
          dni: {
            type: 'string',
            maxLength: 20,
            description: 'DNI del paciente.',
            example: '38123456',
          },
          nombre: {
            type: 'string',
            maxLength: 60,
            description: 'Nombre completo del paciente.',
            example: 'María Fernández',
          },
          telefono: {
            type: 'string',
            maxLength: 30,
            description: 'Teléfono de contacto del paciente.',
            example: '341 555-1234',
          },
          direccion: {
            type: 'string',
            maxLength: 100,
            description: 'Dirección del paciente.',
            example: 'San Luis 1234',
          },
          email: {
            type: 'string',
            maxLength: 120,
            description: 'Email del paciente.',
            example: 'maria@example.com',
          },
          contrasena: {
            type: 'string',
            maxLength: 100,
            description: 'Contraseña del paciente.',
          },
          cod_os: {
            type: ['integer', 'null'],
            description: 'Código de obra social del paciente, si corresponde.',
            minimum: 1,
          },
        },
        required: ['nro_afiliado', 'dni', 'nombre', 'telefono', 'direccion', 'email', 'contrasena'],
      },
      PacienteInput: {
        type: 'object',
        properties: {
          dni: {
            type: 'string',
            maxLength: 20,
            example: '38123456',
          },
          nombre: {
            type: 'string',
            maxLength: 60,
            example: 'María Fernández',
          },
          telefono: {
            type: 'string',
            maxLength: 30,
            example: '341 555-1234',
          },
          direccion: {
            type: 'string',
            maxLength: 100,
            example: 'San Luis 1234',
          },
          email: {
            type: 'string',
            maxLength: 120,
            example: 'maria@example.com',
          },
          contrasena: {
            type: 'string',
            maxLength: 100,
            example: 'secreta123',
          },
          cod_os: {
            type: 'integer',
            minimum: 1,
            example: 2,
          },
        },
        required: ['dni', 'nombre', 'telefono', 'direccion', 'email', 'contrasena'],
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: 'Paciente no encontrado',
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
                  example: 'El nombre del paciente es obligatorio',
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
