const swaggerJsdoc = require('swagger-jsdoc');

const bearer = [{ bearerAuth: [] }];
const jsonBody = (schema) => ({ required: true, content: { 'application/json': { schema } } });
const id = { name: 'id', in: 'path', required: true, schema: { type: 'integer' } };

module.exports = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: { title: 'HelpDesk API', version: process.env.API_VERSION || '1.0.0', description: 'API REST para abertura e atendimento de chamados.' },
    servers: [{ url: process.env.API_BASE_URL || '/' }],
    components: {
      securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } },
      schemas: {
        Usuario: { type: 'object', required: ['nome', 'email', 'senha', 'papel'], properties: { nome: { type: 'string' }, email: { type: 'string', format: 'email' }, senha: { type: 'string', minLength: 6 }, papel: { type: 'string', enum: ['cliente', 'tecnico'] } } },
        Login: { type: 'object', required: ['email', 'senha'], properties: { email: { type: 'string', format: 'email' }, senha: { type: 'string' } } },
        Chamado: { type: 'object', required: ['titulo', 'descricao'], properties: { titulo: { type: 'string' }, descricao: { type: 'string' }, status: { type: 'string', enum: ['Aberto', 'Em Atendimento', 'Concluído'] } } },
        Comentario: { type: 'object', required: ['mensagem'], properties: { mensagem: { type: 'string' } } }
      }
    },
    paths: {
      '/api/status': { get: { tags: ['Status'], responses: { 200: { description: 'API online.' } } } },
      '/api/register': { post: { tags: ['Autenticacao'], requestBody: jsonBody({ $ref: '#/components/schemas/Usuario' }), responses: { 201: { description: 'Usuario criado.' }, 400: { description: 'Dados invalidos.' } } } },
      '/api/login': { post: { tags: ['Autenticacao'], requestBody: jsonBody({ $ref: '#/components/schemas/Login' }), responses: { 200: { description: 'Token e usuario.' }, 401: { description: 'Credenciais invalidas.' } } } },
      '/api/chamados': {
        get: { tags: ['Chamados'], security: bearer, responses: { 200: { description: 'Lista filtrada pelo papel.' }, 401: { description: 'Nao autenticado.' } } },
        post: { tags: ['Chamados'], security: bearer, requestBody: jsonBody({ $ref: '#/components/schemas/Chamado' }), responses: { 201: { description: 'Chamado aberto pelo cliente.' }, 403: { description: 'Apenas clientes.' } } }
      },
      '/api/chamados/{id}': { get: { tags: ['Chamados'], security: bearer, parameters: [id], responses: { 200: { description: 'Chamado com comentarios.' }, 404: { description: 'Nao encontrado.' } } } },
      '/api/chamados/{id}/status': { patch: { tags: ['Atendimento'], security: bearer, parameters: [id], requestBody: jsonBody({ type: 'object', required: ['status'], properties: { status: { type: 'string', enum: ['Aberto', 'Em Atendimento', 'Concluído'] } } }), responses: { 200: { description: 'Status atualizado.' }, 403: { description: 'Apenas tecnicos.' } } } },
      '/api/chamados/{id}/comentarios': { post: { tags: ['Atendimento'], security: bearer, parameters: [id], requestBody: jsonBody({ $ref: '#/components/schemas/Comentario' }), responses: { 201: { description: 'Comentario adicionado.' }, 403: { description: 'Apenas tecnicos.' } } } }
    }
  },
  apis: []
});
