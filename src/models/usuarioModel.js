const db = require('../config/database');

const findById = async (id) => {
  const [rows] = await db.execute(
    'SELECT id_usuario AS id, nome, nick FROM usuarios WHERE id_usuario = ? LIMIT 1',
    [id]
  );
  return rows[0];
};

const findByLogin = async (login) => {
  const [rows] = await db.execute(
    'SELECT id_usuario AS id, nome, nick, senha FROM usuarios WHERE nick = ? LIMIT 1',
    [login]
  );
  return rows[0];
};

const create = async ({ nome, nick, senha }) => {
  const [result] = await db.execute(
    'INSERT INTO usuarios (nome, nick, senha) VALUES (?, ?, ?)',
    [nome, nick, senha]
  );
  return findById(result.insertId);
};

module.exports = { findById, findByLogin, create };
