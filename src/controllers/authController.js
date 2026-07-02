const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuarioModel');

const getPassword = (req) => req.body.password || req.body.senha;

const passwordMatches = async (plain, stored) => {
  if (!stored) return false;
  if (stored.startsWith('$2a$') || stored.startsWith('$2b$') || stored.startsWith('$2y$')) {
    return bcrypt.compare(plain, stored);
  }
  if (/^[a-f0-9]{32}$/i.test(stored)) {
    return crypto.createHash('md5').update(plain).digest('hex') === stored;
  }
  return plain === stored;
};

exports.register = async (req, res) => {
  const nome = req.body.nome || req.body.name;
  const nick = req.body.nick || req.body.email;
  const senha = getPassword(req);

  if (!nome || !nick || !senha) {
    return res.status(400).json({ error: 'Dados invalidos' });
  }

  try {
    const hash = await bcrypt.hash(senha, 10);
    const usuario = await Usuario.create({ nome, nick, senha: hash });

    res.status(201).json(usuario);
  } catch {
    res.status(400).json({ error: 'Erro ao registrar' });
  }
};

exports.login = async (req, res) => {
  const login = req.body.nick || req.body.email;
  const senha = getPassword(req);

  if (!login || !senha) {
    return res.status(400).json({ error: 'Dados invalidos' });
  }

  try {
    const usuario = await Usuario.findByLogin(login);

    if (!usuario || !(await passwordMatches(senha, usuario.senha))) {
      return res.status(401).json({ error: 'Credenciais invalidas' });
    }

    const token = jwt.sign(
      { id: usuario.id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    delete usuario.senha;
    res.json({ token, usuario });
  } catch {
    res.status(500).json({ error: 'Erro no login' });
  }
};
