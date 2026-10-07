export const turnoOpenApi = {
  openapi: '3.1.0',
  info: {
    title: 'API de Turnos',
    version: '1.0.0',
    description: 'Documentación del módulo de turnos del consultorio.',
  },
  tags: [
    {
      name: 'Turno',
      description: 'Operaciones CRUD para administrar turnos.',
    },
  ],
  paths: {
    '/turno': {
      get: {
        tags: ['Turno'],
        summary: 'Listar turnos',
        parameters: [
          {
            name: 'nro_afiliado',
            in: 'query',
            required: false,
            description: 'Filtra los turnos de un paciente.',
            schema: {
              type: 'integer',
              minimum: 1,
            },
          },
          {
            name: 'cod_especialista',
            in: 'query',
            required: false,
            description: 'Filtra los turnos de un especialista.',
            schema: {
              type: 'integer',
              minimum: 1,
            },
          },
        ],
        responses: {
          200: {
            description: 'Listado de turnos.',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Turno',
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Turno'],
        summary: 'Crear un turno',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/TurnoInput',
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Turno creado correctamente.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Turno',
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
            description: 'Paciente o especialista no encontrado.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          409: {
            description: 'El especialista ya tiene un turno en ese horario.',
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
    '/turno/disponibles': {
      get: {
        tags: ['Turno'],
        summary: 'Listar horarios disponibles de un especialista en una fecha',
        parameters: [
          {
            name: 'cod_especialista',
            in: 'query',
            required: true,
            schema: { type: 'integer', minimum: 1 },
          },
          {
            name: 'fecha',
            in: 'query',
            required: true,
            description: 'Fecha local de atención.',
            schema: { type: 'string', format: 'date', example: '2026-10-01' },
          },
        ],
        responses: {
          200: {
            description: 'Horarios sin reservas y ajustados a la duración de la especialidad.',
          },
          404: {
            description: 'Especialista no encontrado.',
          },
        },
      },
    },
    '/turno/{cod_turno}': {
      get: {
        tags: ['Turno'],
        summary: 'Obtener un turno por id',
        parameters: [
          {
            name: 'cod_turno',
            in: 'path',
            required: true,
            description: 'Código único del turno.',
            schema: {
              type: 'integer',
              minimum: 1,
            },
          },
        ],
        responses: {
          200: {
            description: 'Turno encontrado.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Turno',
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
            description: 'Turno no encontrado.',
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
        tags: ['Turno'],
        summary: 'Actualizar un turno',
        parameters: [
          {
            name: 'cod_turno',
            in: 'path',
            required: true,
            description: 'Código único del turno.',
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
                $ref: '#/components/schemas/TurnoInput',
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Turno actualizado correctamente.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Turno',
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
            description: 'Turno, paciente o especialista no encontrado.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          409: {
            description: 'El especialista ya tiene un turno en ese horario.',
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
        tags: ['Turno'],
        summary: 'Eliminar un turno',
        parameters: [
          {
            name: 'cod_turno',
            in: 'path',
            required: true,
            description: 'Código único del turno.',
            schema: {
              type: 'integer',
              minimum: 1,
            },
          },
        ],
        responses: {
          204: {
            description: 'Turno eliminado correctamente.',
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
            description: 'Turno no encontrado.',
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
      Turno: {
        type: 'object',
        properties: {
          cod_turno: {
            type: 'integer',
            description: 'Identificador autogenerado del turno.',
          },
          fecha: {
            type: 'string',
            format: 'date',
            description: 'Fecha del turno en formato YYYY-MM-DD.',
            example: '2026-08-29',
          },
          hora_inicio: {
            type: 'string',
            pattern: '^([01]\\d|2[0-3]):([0-5]\\d)$',
            description: 'Hora de inicio del turno en formato HH:mm.',
            example: '14:30',
          },
          paciente: {
            $ref: '#/components/schemas/Paciente',
          },
          especialista: {
            $ref: '#/components/schemas/Especialista',
          },
        },
        required: ['cod_turno', 'fecha', 'hora_inicio', 'paciente', 'especialista'],
      },
      TurnoInput: {
        type: 'object',
        properties: {
          fecha: {
            type: 'string',
            format: 'date',
            example: '2026-08-29',
          },
          hora_inicio: {
            type: 'string',
            pattern: '^([01]\\d|2[0-3]):([0-5]\\d)$',
            example: '14:30',
          },
          nro_afiliado: {
            type: 'integer',
            minimum: 1,
            example: 1,
          },
          cod_especialista: {
            type: 'integer',
            minimum: 1,
            example: 1,
          },
        },
        required: ['fecha', 'hora_inicio', 'nro_afiliado', 'cod_especialista'],
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: 'Turno no encontrado',
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
                  example: 'hora_inicio',
                },
                message: {
                  type: 'string',
                  example: 'No se pueden reservar turnos en fechas u horarios pasados',
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
