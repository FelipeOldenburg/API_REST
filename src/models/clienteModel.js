const db = require('../config/database');

const findAll = async () => {
  const [rows] = await db.execute(
    'SELECT id_cliente AS id, nome, telefone, status FROM clientes ORDER BY id_cliente'
  );
  return rows;
};

const findById = async (id) => {
  const [rows] = await db.execute(
    'SELECT id_cliente AS id, nome, telefone, status FROM clientes WHERE id_cliente = ? LIMIT 1',
    [id]
  );
  return rows[0];
};

const create = async ({ nome, telefone, status }) => {
  const [result] = await db.execute(
    'INSERT INTO clientes (nome, telefone, status) VALUES (?, ?, ?)',
    [nome ?? null, telefone ?? null, status || 'medio']
  );
  return findById(result.insertId);
};

const update = async (id, { nome, telefone, status }) => {
  const [result] = await db.execute(
    'UPDATE clientes SET nome = COALESCE(?, nome), telefone = COALESCE(?, telefone), status = COALESCE(?, status) WHERE id_cliente = ?',
    [nome ?? null, telefone ?? null, status ?? null, id]
  );
  return result.affectedRows ? findById(id) : null;
};

const remove = async (id) => {
  const [result] = await db.execute(
    'DELETE FROM clientes WHERE id_cliente = ?',
    [id]
  );
  return result.affectedRows > 0;
};

module.exports = { findAll, findById, create, update, remove };
