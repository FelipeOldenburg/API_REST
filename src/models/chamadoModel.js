const db = require('../config/database');

const list = async (usuario) => {
  const sql = `SELECT c.id, c.titulo, c.descricao, c.status, c.criado_em, c.atualizado_em,
                      u.nome AS cliente, COUNT(co.id) AS total_comentarios
               FROM helpdesk_chamados c
               JOIN helpdesk_usuarios u ON u.id = c.cliente_id
               LEFT JOIN helpdesk_comentarios_chamado co ON co.chamado_id = c.id
               ${usuario.papel === 'cliente' ? 'WHERE c.cliente_id = ?' : ''}
               GROUP BY c.id, u.nome ORDER BY c.atualizado_em DESC`;
  const [rows] = await db.execute(sql, usuario.papel === 'cliente' ? [usuario.id] : []);
  return rows;
};

const findById = async (id, usuario) => {
  const [rows] = await db.execute(
    `SELECT c.id, c.titulo, c.descricao, c.status, c.cliente_id, c.criado_em, c.atualizado_em, u.nome AS cliente
     FROM helpdesk_chamados c JOIN helpdesk_usuarios u ON u.id = c.cliente_id
     WHERE c.id = ? ${usuario.papel === 'cliente' ? 'AND c.cliente_id = ?' : ''} LIMIT 1`,
    usuario.papel === 'cliente' ? [id, usuario.id] : [id]
  );
  if (!rows[0]) return null;
  const [comentarios] = await db.execute(
    `SELECT co.id, co.mensagem, co.criado_em, u.nome AS autor, u.papel
     FROM helpdesk_comentarios_chamado co JOIN helpdesk_usuarios u ON u.id = co.autor_id
     WHERE co.chamado_id = ? ORDER BY co.criado_em ASC`,
    [id]
  );
  return { ...rows[0], comentarios };
};

const create = async ({ titulo, descricao }, clienteId) => {
  const [result] = await db.execute(
    'INSERT INTO helpdesk_chamados (titulo, descricao, cliente_id) VALUES (?, ?, ?)',
    [titulo, descricao, clienteId]
  );
  return findById(result.insertId, { id: clienteId, papel: 'cliente' });
};

const updateStatus = async (id, status) => {
  const [result] = await db.execute('UPDATE helpdesk_chamados SET status = ? WHERE id = ?', [status, id]);
  return result.affectedRows > 0;
};

const addComentario = async (id, mensagem, autorId) => {
  const [result] = await db.execute(
    'INSERT INTO helpdesk_comentarios_chamado (chamado_id, autor_id, mensagem) SELECT id, ?, ? FROM helpdesk_chamados WHERE id = ?',
    [autorId, mensagem, id]
  );
  return result.affectedRows ? result.insertId : null;
};

module.exports = { list, findById, create, updateStatus, addComentario };
