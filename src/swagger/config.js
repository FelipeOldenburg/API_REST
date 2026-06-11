const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API REST - Eventos',
      version: '1.0.0',
      description: 'Documentacao da API REST de eventos com autenticacao JWT.',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: 'Servidor local',
      },
    ],
    tags: [
      {
        name: 'Autenticacao',
        description: 'Cadastro e login de usuarios',
      },
      {
        name: 'Eventos',
        description: 'CRUD principal de eventos',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Informe o token JWT gerado no login.',
        },
      },
      schemas: {
        RegisterRequest: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: {
              type: 'string',
              example: 'Felipe',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'felipe@email.com',
            },
            password: {
              type: 'string',
              example: '123456',
            },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'felipe@email.com',
            },
            password: {
              type: 'string',
              example: '123456',
            },
          },
        },
        LoginResponse: {
          type: 'object',
          properties: {
            token: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
          },
        },
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '665f1e2b8c5a4b001f123456',
            },
            name: {
              type: 'string',
              example: 'Felipe',
            },
            email: {
              type: 'string',
              example: 'felipe@email.com',
            },
            password: {
              type: 'string',
              example: '$2b$10$hashDaSenha',
            },
          },
        },
        EventRequest: {
          type: 'object',
          required: ['title'],
          properties: {
            title: {
              type: 'string',
              example: 'Apresentação do projeto',
            },
            description: {
              type: 'string',
              example: 'Demonstração da API com Swagger',
            },
            date: {
              type: 'string',
              format: 'date',
              example: '2026-06-11',
            },
          },
        },
        Event: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '665f1e2b8c5a4b001f654321',
            },
            title: {
              type: 'string',
              example: 'Apresentação do projeto',
            },
            description: {
              type: 'string',
              example: 'Demonstração da API com Swagger',
            },
            date: {
              type: 'string',
              format: 'date-time',
              example: '2026-06-11T00:00:00.000Z',
            },
            createdBy: {
              type: 'string',
              example: '665f1e2b8c5a4b001f123456',
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              example: 'Mensagem de erro',
            },
          },
        },
      },
    },
    paths: {
      '/register': {
        post: {
          tags: ['Autenticacao'],
          summary: 'Cadastrar usuário',
          description: 'Cria um novo usuario no sistema.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/RegisterRequest',
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Usuario cadastrado com sucesso.',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/User',
                  },
                },
              },
            },
            400: {
              description: 'Dados inválidos ou erro ao registrar.',
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
      '/login': {
        post: {
          tags: ['Autenticacao'],
          summary: 'Login de usuário',
          description: 'Autentica o usuário e retorna um token JWT.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/LoginRequest',
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Login realizado com sucesso.',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/LoginResponse',
                  },
                },
              },
            },
            400: {
              description: 'Usuario nao encontrado ou senha invalida.',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/ErrorResponse',
                  },
                },
              },
            },
            500: {
              description: 'Erro interno no login.',
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
      '/events': {
        get: {
          tags: ['Eventos'],
          summary: 'Listar eventos',
          description: 'Lista todos os eventos do usuário autenticado.',
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'Lista de eventos retornada com sucesso.',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/Event',
                    },
                  },
                },
              },
            },
            401: {
              description: 'Token nao informado ou invalido.',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/ErrorResponse',
                  },
                },
              },
            },
            400: {
              description: 'Erro ao buscar eventos.',
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
        post: {
          tags: ['Eventos'],
          summary: 'Criar evento',
          description: 'Cria um evento para o usuário autenticado.',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/EventRequest',
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Evento criado com sucesso.',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Event',
                  },
                },
              },
            },
            400: {
              description: 'Dados inválidos para criação do evento.',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/ErrorResponse',
                  },
                },
              },
            },
            401: {
              description: 'Token nao informado ou invalido.',
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
      '/events/{id}': {
        get: {
          tags: ['Eventos'],
          summary: 'Buscar evento por ID',
          description: 'Retorna um evento específico do usuário autenticado.',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              description: 'ID do evento.',
              schema: {
                type: 'string',
              },
            },
          ],
          responses: {
            200: {
              description: 'Evento encontrado com sucesso.',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Event',
                  },
                },
              },
            },
            400: {
              description: 'ID inválido.',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/ErrorResponse',
                  },
                },
              },
            },
            401: {
              description: 'Token nao informado ou invalido.',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/ErrorResponse',
                  },
                },
              },
            },
            404: {
              description: 'Evento nao encontrado.',
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
          tags: ['Eventos'],
          summary: 'Atualizar evento',
          description: 'Atualiza um evento existente do usuário autenticado.',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              description: 'ID do evento.',
              schema: {
                type: 'string',
              },
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/EventRequest',
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Evento atualizado com sucesso.',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Event',
                  },
                },
              },
            },
            400: {
              description: 'ID ou dados inválidos.',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/ErrorResponse',
                  },
                },
              },
            },
            401: {
              description: 'Token nao informado ou invalido.',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/ErrorResponse',
                  },
                },
              },
            },
            404: {
              description: 'Evento nao encontrado.',
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
          tags: ['Eventos'],
          summary: 'Excluir evento',
          description: 'Remove um evento existente do usuário autenticado.',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              description: 'ID do evento.',
              schema: {
                type: 'string',
              },
            },
          ],
          responses: {
            200: {
              description: 'Evento excluído com sucesso.',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      ok: {
                        type: 'boolean',
                        example: true,
                      },
                    },
                  },
                },
              },
            },
            400: {
              description: 'ID inválido.',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/ErrorResponse',
                  },
                },
              },
            },
            401: {
              description: 'Token nao informado ou invalido.',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/ErrorResponse',
                  },
                },
              },
            },
            404: {
              description: 'Evento nao encontrado.',
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
  },
  apis: [],
};

module.exports = swaggerJsdoc(options);
