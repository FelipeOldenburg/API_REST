const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuarioModel');

/** @async @param {import('express').Request} req @param {import('express').Response} res @returns {Promise<void>} @throws {Error} Falha de persistencia. */
exports.register = async (req, res) => {
  const usuario = { nome: (req.body.nome || '').trim(), email: (req.body.email || '').trim().toLowerCase(), papel: req.body.papel };
  if (!usuario.nome || !/^\S+@\S+\.\S+$/.test(usuario.email) || !['cliente', 'tecnico'].includes(usuario.papel) || String(req.body.senha || '').length < 6) {
    return res.status(400).json({ error: 'Dados invalidos; a senha deve ter ao menos 6 caracteres.' });
  }
  try {
    res.status(201).json(await Usuario.create({ ...usuario, senhaHash: await bcrypt.hash(req.body.senha, 10) }));
  } catch (error) {
    console.error('Erro ao cadastrar usuario:', error.message);
    res.status(error.code === 'ER_DUP_ENTRY' ? 409 : 500).json({ error: error.code === 'ER_DUP_ENTRY' ? 'E-mail ja cadastrado.' : 'Erro ao cadastrar usuario.' });
  }
};

/** @async @param {import('express').Request} req @param {import('express').Response} res @returns {Promise<void>} @throws {Error} Falha de autenticacao. */
exports.login = async (req, res) => {
  try {
    const usuario = await Usuario.findByEmail((req.body.email || '').trim().toLowerCase());
    if (!usuario || !(await bcrypt.compare(req.body.senha || '', usuario.senha_hash))) return res.status(401).json({ error: 'Credenciais invalidas.' });
    if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET nao configurado');
    const token = jwt.sign({ id: usuario.id, nome: usuario.nome, papel: usuario.papel }, process.env.JWT_SECRET, { expiresIn: '1d' });
    delete usuario.senha_hash;
    res.json({ token, usuario });
  } catch (error) {
    console.error('Erro no login:', error.message);
    res.status(500).json({ error: 'Erro ao realizar login.' });
  }
};
