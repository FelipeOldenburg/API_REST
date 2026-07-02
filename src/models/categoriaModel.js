const db = require('../config/database');

const findAll = async () => {
  const [rows] = await db.execute(
    'SELECT id_categoria AS id, nome FROM categorias ORDER BY id_categoria'
  );
  return rows;
};

const findById = async (id) => {
  const [rows] = await db.execute(
    'SELECT id_categoria AS id, nome FROM categorias WHERE id_categoria = ? LIMIT 1',
    [id]
  );
  return rows[0];
};

const create = async ({ nome }) => {
  const [result] = await db.execute(
    'INSERT INTO categorias (nome) VALUES (?)',
    [nome ?? null]
  );
  return findById(result.insertId);
};

const update = async (id, { nome }) => {
  const [result] = await db.execute(
    'UPDATE categorias SET nome = COALESCE(?, nome) WHERE id_categoria = ?',
    [nome ?? null, id]
  );
  return result.affectedRows ? findById(id) : null;
};

const remove = async (id) => {
  const [result] = await db.execute(
    'DELETE FROM categorias WHERE id_categoria = ?',
    [id]
  );
  return result.affectedRows > 0;
};

module.exports = { findAll, findById, create, update, remove };
