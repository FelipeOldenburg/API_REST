# API REST Loja

API REST em Node.js/Express usando MySQL, JWT e prepared statements.

## Rodar

```bash
npm install
mysql -u root -p < loja.sql
cp .env.example .env
npm run dev
```

Se o seu MySQL nao usa senha, remova o `-p` no comando acima. Ajuste `DB_USER` e `DB_PASSWORD` no `.env` conforme sua maquina.

## Rotas publicas

- `GET /api/status`
- `GET /api/versao`
- `POST /login`
- `POST /api/login`
- `POST /register`
- `POST /api/register`
- `GET /api-docs`

Crie um usuario para testar:

```json
{
  "nome": "Admin",
  "nick": "admin",
  "senha": "123456"
}
```

Depois faca login com `nick` e `senha`.

## Rotas privadas

Enviar sempre:

- `Authorization: Bearer <token>`
- `x-user-id: <id retornado no login>`

CRUDs:

- `/api/categorias`
- `/api/produtos`
- `/api/clientes`
- `/api/pedidos`

Exemplo para bloquear invasao:

```bash
curl http://localhost:3000/api/categorias
```

Resposta esperada: `401` sem token ou `403` sem `x-user-id`.

Exemplo de categoria:

```json
{
  "nome": "Eletronicos"
}
```

Exemplo de produto:

```json
{
  "nome": "Mouse USB",
  "valor": 49.9,
  "estoque": 10,
  "categoria_id": 5
}
```

Exemplo de cliente:

```json
{
  "nome": "Maria",
  "telefone": "51999999999",
  "status": "bom"
}
```

Exemplo de pedido:

```json
{
  "cliente_id": 1,
  "itens": [
    { "produto_id": 1, "quantidade": 1 }
  ]
}
```
