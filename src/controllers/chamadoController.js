const Chamado = require('../models/chamadoModel');
const STATUS = ['Aberto', 'Em Atendimento', 'Concluído'];

/** @async @param {import('express').Request} req @param {import('express').Response} res @returns {Promise<void>} @throws {Error} Falha ao listar. */
exports.list = async (req, res) => {
  try { res.json(await Chamado.list(req.user)); }
  catch (error) { console.error('Erro ao listar chamados:', error.message); res.status(500).json({ error: 'Erro ao listar chamados.' }); }
};

/** @async @param {import('express').Request} req @param {import('express').Response} res @returns {Promise<void>} @throws {Error} Falha ao consultar. */
exports.get = async (req, res) => {
  try {
    const chamado = await Chamado.findById(req.params.id, req.user);
    if (!chamado) return res.status(404).json({ error: 'Chamado nao encontrado.' });
    res.json(chamado);
  } catch (error) { console.error('Erro ao consultar chamado:', error.message); res.status(500).json({ error: 'Erro ao consultar chamado.' }); }
};

/** @async @param {import('express').Request} req @param {import('express').Response} res @returns {Promise<void>} @throws {Error} Falha ao criar. */
exports.create = async (req, res) => {
  const chamado = { titulo: (req.body.titulo || '').trim(), descricao: (req.body.descricao || '').trim() };
  if (!chamado.titulo || !chamado.descricao) return res.status(400).json({ error: 'Titulo e descricao sao obrigatorios.' });
  try { res.status(201).json(await Chamado.create(chamado, req.user.id)); }
  catch (error) { console.error('Erro ao abrir chamado:', error.message); res.status(500).json({ error: 'Erro ao abrir chamado.' }); }
};

/** @async @param {import('express').Request} req @param {import('express').Response} res @returns {Promise<void>} @throws {Error} Falha ao atualizar. */
exports.updateStatus = async (req, res) => {
  if (!STATUS.includes(req.body.status)) return res.status(400).json({ error: `Status deve ser: ${STATUS.join(', ')}.` });
  try {
    if (!(await Chamado.updateStatus(req.params.id, req.body.status))) return res.status(404).json({ error: 'Chamado nao encontrado.' });
    res.json(await Chamado.findById(req.params.id, req.user));
  } catch (error) { console.error('Erro ao atualizar status:', error.message); res.status(500).json({ error: 'Erro ao atualizar status.' }); }
};

/** @async @param {import('express').Request} req @param {import('express').Response} res @returns {Promise<void>} @throws {Error} Falha ao comentar. */
exports.comment = async (req, res) => {
  const mensagem = (req.body.mensagem || '').trim();
  if (!mensagem) return res.status(400).json({ error: 'Mensagem obrigatoria.' });
  try {
    if (!(await Chamado.addComentario(req.params.id, mensagem, req.user.id))) return res.status(404).json({ error: 'Chamado nao encontrado.' });
    res.status(201).json(await Chamado.findById(req.params.id, req.user));
  } catch (error) { console.error('Erro ao comentar:', error.message); res.status(500).json({ error: 'Erro ao comentar.' }); }
};
