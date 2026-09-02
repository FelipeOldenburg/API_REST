process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'smoke-secret';
process.env.FRONTEND_ORIGIN = 'http://localhost:5173';
const assert = require('node:assert/strict');
const http = require('node:http');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Usuario = require('../src/models/usuarioModel');
const Chamado = require('../src/models/chamadoModel');

const ticket = { id: 1, titulo: 'Acesso indisponivel', descricao: 'Nao consigo acessar', status: 'Aberto', cliente: 'Cliente', total_comentarios: 0, comentarios: [] };
Usuario.findByEmail = async () => ({ id: 2, nome: 'Cliente', email: 'cliente@example.com', papel: 'cliente', senha_hash: bcrypt.hashSync('123456', 4) });
Chamado.list = async () => [ticket];
Chamado.findById = async () => ticket;
Chamado.create = async () => ticket;
Chamado.updateStatus = async () => true;
Chamado.addComentario = async () => 1;
const app = require('../src/app');

const request = (port, path, options = {}) => new Promise((resolve, reject) => {
  const req = http.request({ host: '127.0.0.1', port, path, ...options }, (res) => {
    let raw = '';
    res.on('data', (chunk) => { raw += chunk; });
    res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: raw }));
  });
  req.on('error', reject);
  if (options.body) req.write(options.body);
  req.end();
});

(async () => {
  const server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  try {
    const port = server.address().port;
    const [status, blocked, home, swagger, preflight] = await Promise.all([
      request(port, '/api/status'), request(port, '/api/chamados'), request(port, '/'), request(port, '/api-docs/'),
      request(port, '/api/chamados', { method: 'OPTIONS', headers: { Origin: 'http://localhost:5173', 'Access-Control-Request-Method': 'GET' } })
    ]);
    const login = await request(port, '/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: 'cliente@example.com', senha: '123456' }) });
    const cliente = JSON.parse(login.body).token;
    const list = await request(port, '/api/chamados', { headers: { Authorization: `Bearer ${cliente}` } });
    const created = await request(port, '/api/chamados', { method: 'POST', headers: { Authorization: `Bearer ${cliente}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ titulo: 'Acesso', descricao: 'Falha de acesso' }) });
    const tecnico = jwt.sign({ id: 1, nome: 'Tecnico', papel: 'tecnico' }, process.env.JWT_SECRET);
    const forbidden = await request(port, '/api/chamados', { method: 'POST', headers: { Authorization: `Bearer ${tecnico}`, 'Content-Type': 'application/json' }, body: '{}' });
    const updated = await request(port, '/api/chamados/1/status', { method: 'PATCH', headers: { Authorization: `Bearer ${tecnico}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'Em Atendimento' }) });
    const commented = await request(port, '/api/chamados/1/comentarios', { method: 'POST', headers: { Authorization: `Bearer ${tecnico}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ mensagem: 'Analise iniciada' }) });
    assert.equal(JSON.parse(status.body).status, 'online');
    assert.equal(blocked.status, 401);
    assert.match(home.body, /HelpDesk API/);
    assert.equal(swagger.status, 200);
    assert.equal(preflight.headers['access-control-allow-origin'], 'http://localhost:5173');
    assert.equal(login.status, 200);
    assert.equal(list.status, 200);
    assert.equal(created.status, 201);
    assert.equal(forbidden.status, 403);
    assert.equal(updated.status, 200);
    assert.equal(commented.status, 201);
    console.log('smoke ok');
  } finally { server.close(); }
})().catch((error) => { console.error(error); process.exit(1); });
