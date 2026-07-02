const swaggerJsdoc = require('swagger-jsdoc');

const privateSecurity = [{ bearerAuth: [], userIdHeader: [] }];

const crudPaths = (tag, schema) => ({
  get: {
    tags: [tag],
    security: privateSecurity,
    responses: { 200: { description: 'Lista retornada com sucesso.' }, 401: { description: 'Nao autorizado.' }, 403: { description: 'Proibido.' } }
  },
  post: {
    tags: [tag],
    security: privateSecurity,
    requestBody: { required: true, content: { 'application/json': { schema } } },
    responses: { 201: { description: 'Registro criado com sucesso.' }, 401: { description: 'Nao autorizado.' }, 403: { description: 'Proibido.' } }
  }
});

const crudByIdPaths = (tag, schema) => ({
  get: {
    tags: [tag],
    security: privateSecurity,
    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
    responses: { 200: { description: 'Registro encontrado.' }, 404: { description: 'Registro nao encontrado.' } }
  },
  put: {
    tags: [tag],
    security: privateSecurity,
    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
    requestBody: { required: true, content: { 'application/json': { schema } } },
    responses: { 200: { description: 'Registro atualizado.' }, 404: { description: 'Registro nao encontrado.' } }
  },
  delete: {
    tags: [tag],
    security: privateSecurity,
    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
    responses: { 200: { description: 'Registro removido.' }, 404: { description: 'Registro nao encontrado.' } }
  }
});

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API REST - Loja',
      version: process.env.API_VERSION || '2.0.0',
      description: 'API relacional com MySQL, JWT e CRUD protegido.'
    },
    servers: [{ url: `http://localhost:${process.env.PORT || 3000}` }],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        userIdHeader: { type: 'apiKey', in: 'header', name: 'x-user-id' }
      },
      schemas: {
        Login: {
          type: 'object',
          required: ['nick', 'senha'],
          properties: {
            nick: { type: 'string', example: 'admin' },
            senha: { type: 'string', example: '123456' }
          }
        },
        Categoria: {
          type: 'object',
          required: ['nome'],
          properties: {
            nome: { type: 'string', example: 'Eletronicos' }
          }
        },
        Produto: {
          type: 'object',
          required: ['nome', 'valor', 'categoria_id'],
          properties: {
            nome: { type: 'string', example: 'Mouse' },
            valor: { type: 'number', example: 49.9 },
            estoque: { type: 'integer', example: 10 },
            categoria_id: { type: 'integer', example: 1 }
          }
        },
        Cliente: {
          type: 'object',
          required: ['nome', 'telefone'],
          properties: {
            nome: { type: 'string', example: 'Maria' },
            telefone: { type: 'string', example: '11999999999' },
            status: { type: 'string', example: 'bom' }
          }
        },
        Pedido: {
          type: 'object',
          required: ['cliente_id'],
          properties: {
            cliente_id: { type: 'integer', example: 1 },
            data: { type: 'string', example: '2026-07-02' },
            itens: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  produto_id: { type: 'integer', example: 1 },
                  quantidade: { type: 'integer', example: 2 },
                  valor: { type: 'number', example: 49.9 }
                }
              }
            }
          }
        }
      }
    },
    paths: {
      '/api/status': {
        get: {
          tags: ['Status'],
          responses: { 200: { description: 'API online.' } }
        }
      },
      '/api/login': {
        post: {
          tags: ['Autenticacao'],
          requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Login' } } } },
          responses: { 200: { description: 'Login realizado.' }, 401: { description: 'Credenciais invalidas.' } }
        }
      },
      '/api/categorias': crudPaths('Categorias', { $ref: '#/components/schemas/Categoria' }),
      '/api/categorias/{id}': crudByIdPaths('Categorias', { $ref: '#/components/schemas/Categoria' }),
      '/api/produtos': crudPaths('Produtos', { $ref: '#/components/schemas/Produto' }),
      '/api/produtos/{id}': crudByIdPaths('Produtos', { $ref: '#/components/schemas/Produto' }),
      '/api/clientes': crudPaths('Clientes', { $ref: '#/components/schemas/Cliente' }),
      '/api/clientes/{id}': crudByIdPaths('Clientes', { $ref: '#/components/schemas/Cliente' }),
      '/api/pedidos': crudPaths('Pedidos', { $ref: '#/components/schemas/Pedido' }),
      '/api/pedidos/{id}': crudByIdPaths('Pedidos', { $ref: '#/components/schemas/Pedido' })
    }
  },
  apis: []
};

module.exports = swaggerJsdoc(options);
