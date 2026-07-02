const db = require('../config/database');

const findAll = async () => {
  const [rows] = await db.execute(
    'SELECT id_produto AS id, nome, valor, estoque, categorias_id_categoria AS categoria_id FROM produtos ORDER BY id_produto'
  );
  return rows;
};

const findById = async (id) => {
  const [rows] = await db.execute(
    'SELECT id_produto AS id, nome, valor, estoque, categorias_id_categoria AS categoria_id FROM produtos WHERE id_produto = ? LIMIT 1',
    [id]
  );
  return rows[0];
};

const create = async ({ nome, valor, preco, estoque, categorias_id_categoria, categoria_id, categoriaId }) => {
  const [result] = await db.execute(
    'INSERT INTO produtos (nome, valor, estoque, categorias_id_categoria) VALUES (?, ?, ?, ?)',
    [nome ?? null, valor ?? preco ?? null, estoque ?? 1, categorias_id_categoria ?? categoria_id ?? categoriaId ?? null]
  );
  return findById(result.insertId);
};

const update = async (id, { nome, valor, preco, estoque, categorias_id_categoria, categoria_id, categoriaId }) => {
  const [result] = await db.execute(
    'UPDATE produtos SET nome = COALESCE(?, nome), valor = COALESCE(?, valor), estoque = COALESCE(?, estoque), categorias_id_categoria = COALESCE(?, categorias_id_categoria) WHERE id_produto = ?',
    [nome ?? null, valor ?? preco ?? null, estoque ?? null, categorias_id_categoria ?? categoria_id ?? categoriaId ?? null, id]
  );
  return result.affectedRows ? findById(id) : null;
};

const remove = async (id) => {
  const [result] = await db.execute(
    'DELETE FROM produtos WHERE id_produto = ?',
    [id]
  );
  return result.affectedRows > 0;
};

module.exports = { findAll, findById, create, update, remove };
