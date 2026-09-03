# HelpDesk API REST

Backend JSON do sistema HelpDesk, desacoplado do frontend consumidor.

## Funcionalidades

- cadastro/login com `bcryptjs` e JWT Bearer;
- cliente abre e lista somente seus chamados;
- tecnico lista todos, altera status e comenta;
- status `Aberto`, `Em Atendimento` e `Concluído`;
- SQL parametrizado com `mysql2.execute()`;
- Swagger UI em `/api-docs`;
- CORS limitado a `FRONTEND_ORIGIN` em producao.
- tabelas `helpdesk_*` isoladas das tabelas legadas do banco Loja/MVC.

## Instalacao e execucao

```bash
npm install
mysql -u root -p < helpdesk.sql
copy .env.example .env
npm run dev
```

API: `http://localhost:3000`

Swagger: `http://localhost:3000/api-docs`

Execute `npm test` para validar status, Swagger, CORS, rota protegida e autorizacao por papel.

## Variaveis de ambiente

| Variavel | Uso |
| --- | --- |
| `PORT` | Porta da API. |
| `DB_HOST`, `DB_PORT` | Endereco do MySQL. |
| `DB_USER`, `DB_PASSWORD`, `DB_NAME` | Credenciais e banco. |
| `DB_SSL`, `DB_SSL_REJECT_UNAUTHORIZED` | TLS do banco gerenciado. |
| `JWT_SECRET` | Chave longa e aleatoria para assinar tokens. |
| `FRONTEND_ORIGIN` | URL publica exata do frontend aceita pelo CORS. |
| `API_VERSION` | Versao retornada pelo endpoint de status. |

O `.env` local e ignorado e nao deve ser commitado.

## API

- `POST /api/register` e `POST /api/login`: publicas.
- `GET /api/chamados` e `GET /api/chamados/:id`: autenticadas.
- `POST /api/chamados`: somente cliente.
- `PATCH /api/chamados/:id/status`: somente tecnico.
- `POST /api/chamados/:id/comentarios`: somente tecnico.

Envie `Authorization: Bearer <token>` nas rotas privadas. Os schemas e exemplos ficam no Swagger.

## Deploy

1. Importe `helpdesk.sql` em um MySQL gerenciado e habilite TLS quando exigido. A API tambem cria as tabelas `helpdesk_*` no primeiro acesso, preservando tabelas legadas como `usuarios`.
2. Crie a API no Render pelo `render.yaml` e configure todas as variaveis sem usar `localhost`.
3. Publique o repositorio `helpdesk-web` separadamente na Vercel.
4. Configure `FRONTEND_ORIGIN` na API com a URL final da Vercel.

Repositorio: https://github.com/FelipeOldenburg/API_REST.git

URLs de producao: registre aqui apos criar os servicos no Render e na Vercel.
