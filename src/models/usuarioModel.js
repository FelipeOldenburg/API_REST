const db = require('../config/database');

const findByEmail = async (email) => {
  const [rows] = await db.execute('SELECT id, nome, email, senha_hash, papel FROM usuarios WHERE email = ? LIMIT 1', [email]);
  return rows[0];
};

const create = async ({ nome, email, senhaHash, papel }) => {
  const [result] = await db.execute(
    'INSERT INTO usuarios (nome, email, senha_hash, papel) VALUES (?, ?, ?, ?)',
    [nome, email, senhaHash, papel]
  );
  return { id: result.insertId, nome, email, papel };
};

module.exports = { findByEmail, create };
