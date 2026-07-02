const db = require('../config/database');

const normalizeItems = (data) => data.itens || data.items || [];
const getClienteId = (data) => data.clientes_id_cliente || data.cliente_id || data.clienteId;
const getProdutoId = (item) => item.produtos_id_produto || item.produto_id || item.produtoId;
const getPreco = (item) => item.valor ?? item.preco_unitario ?? item.precoUnitario;
const today = () => new Date().toISOString().slice(0, 10);

const findAll = async () => {
  const [rows] = await db.execute(
    `SELECT p.id_pedido AS id, p.data, p.clientes_id_cliente AS cliente_id,
      COALESCE(SUM(pp.quantidade * pp.valor), 0) AS total
     FROM pedidos p
     LEFT JOIN produtos_pedidos pp ON pp.pedidos_id_pedido = p.id_pedido
     GROUP BY p.id_pedido, p.data, p.clientes_id_cliente
     ORDER BY p.id_pedido`
  );
  return rows;
};

const findById = async (id) => {
  const [rows] = await db.execute(
    `SELECT p.id_pedido AS id, p.data, p.clientes_id_cliente AS cliente_id,
      COALESCE(SUM(pp.quantidade * pp.valor), 0) AS total
     FROM pedidos p
     LEFT JOIN produtos_pedidos pp ON pp.pedidos_id_pedido = p.id_pedido
     WHERE p.id_pedido = ?
     GROUP BY p.id_pedido, p.data, p.clientes_id_cliente
     LIMIT 1`,
    [id]
  );

  if (!rows[0]) return null;

  const [itens] = await db.execute(
    `SELECT produtos_id_produto AS produto_id, pedidos_id_pedido AS pedido_id, quantidade, valor
     FROM produtos_pedidos
     WHERE pedidos_id_pedido = ?
     ORDER BY produtos_id_produto`,
    [id]
  );

  return { ...rows[0], itens };
};

const productPrice = async (conn, produtoId) => {
  const [rows] = await conn.execute(
    'SELECT valor FROM produtos WHERE id_produto = ? LIMIT 1',
    [produtoId]
  );

  if (!rows[0]) throw new Error('Produto nao encontrado');
  return Number(rows[0].valor);
};

const saveItems = async (conn, pedidoId, itens) => {
  for (const item of itens) {
    const produtoId = getProdutoId(item);
    const quantidade = Number(item.quantidade || 1);

    if (!produtoId || quantidade <= 0) {
      throw new Error('Item de pedido invalido');
    }

    const valor = Number(getPreco(item) ?? await productPrice(conn, produtoId));

    await conn.execute(
      'INSERT INTO produtos_pedidos (produtos_id_produto, pedidos_id_pedido, quantidade, valor) VALUES (?, ?, ?, ?)',
      [produtoId, pedidoId, quantidade, valor]
    );
  }
};

const create = async (data) => {
  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    if (!getClienteId(data)) {
      throw new Error('cliente_id obrigatorio');
    }

    const [result] = await conn.execute(
      'INSERT INTO pedidos (data, clientes_id_cliente) VALUES (?, ?)',
      [data.data || today(), getClienteId(data)]
    );

    await saveItems(conn, result.insertId, normalizeItems(data));
    await conn.commit();

    return findById(result.insertId);
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
};

const update = async (id, data) => {
  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    const [result] = await conn.execute(
      'UPDATE pedidos SET data = COALESCE(?, data), clientes_id_cliente = COALESCE(?, clientes_id_cliente) WHERE id_pedido = ?',
      [data.data ?? null, getClienteId(data) ?? null, id]
    );

    if (!result.affectedRows) {
      await conn.rollback();
      return null;
    }

    if (Array.isArray(data.itens) || Array.isArray(data.items)) {
      await conn.execute('DELETE FROM produtos_pedidos WHERE pedidos_id_pedido = ?', [id]);
      await saveItems(conn, id, normalizeItems(data));
    }

    await conn.commit();
    return findById(id);
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
};

const remove = async (id) => {
  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();
    await conn.execute('DELETE FROM produtos_pedidos WHERE pedidos_id_pedido = ?', [id]);
    const [result] = await conn.execute('DELETE FROM pedidos WHERE id_pedido = ?', [id]);
    await conn.commit();
    return result.affectedRows > 0;
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
};

module.exports = { findAll, findById, create, update, remove };
