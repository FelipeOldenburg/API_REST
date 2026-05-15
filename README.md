# API_REST

# API de Eventos 🎉

API REST desenvolvida com Node.js e MongoDB para gerenciamento de eventos com autenticação de usuários.

##  Tecnologias utilizadas

- Node.js
- Express
- MongoDB
- Mongoose
- JWT (JSON Web Token)
- Bcrypt

---

##  Como rodar o projeto

npm install
cp .env.example .env
npm run dev

## Endpoints
POST /register
POST /login
GET /events
POST /events
PUT /events/:id
DELETE /events/:id

exemplo:

CRIAR USUARIO-POST

http://localhost:3000/register

body:
{
  "name": "Felipe",
  "email": "felipe@email.com",
  "password": "123456"
}

FAZER LOGIN-POST

body:
{
  "email": "felipe@email.com",
  "password": "123456"
}

Gera um token
{
  "token": "..."
}

CRIAR EVENTO-POST

http://localhost:3000/events COLOCAR O TOKEN CRIADO EM AUTHORIZATION

body:
{
  "title": "Meu evento",
  "description": "Evento de teste",
  "date": "2026-05-20"
}

LISTAR EVENTOS-GET

http://localhost:3000/events

//TOKEN NO AUTHORIZATION

EDITAR EVENTO-PUT

http://localhost:3000/events/ID_DO_EVENTO

body:
{
  "title": "Evento atualizado",
  "description": "Descrição nova"
}

DELETAR EVENTO-DELETE

http://localhost:3000/events/ID_DO_EVENTO



### 1. Clonar o repositório

```bash
git clone https://github.com/FelipeOldenburg/API_REST.git
cd api-evento
