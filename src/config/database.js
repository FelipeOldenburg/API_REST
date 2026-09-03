const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'helpdesk',
  ssl: process.env.DB_SSL === 'true'
    ? { rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false' }
    : undefined,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const schema = [
  `CREATE TABLE IF NOT EXISTS helpdesk_usuarios (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(190) NOT NULL UNIQUE,
    senha_hash VARCHAR(100) NOT NULL,
    papel ENUM('cliente', 'tecnico') NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB`,
  `CREATE TABLE IF NOT EXISTS helpdesk_chamados (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(140) NOT NULL,
    descricao TEXT NOT NULL,
    status ENUM('Aberto', 'Em Atendimento', 'Concluído') NOT NULL DEFAULT 'Aberto',
    cliente_id INT UNSIGNED NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT helpdesk_fk_chamados_cliente FOREIGN KEY (cliente_id) REFERENCES helpdesk_usuarios(id)
  ) ENGINE=InnoDB`,
  `CREATE TABLE IF NOT EXISTS helpdesk_comentarios_chamado (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    chamado_id INT UNSIGNED NOT NULL,
    autor_id INT UNSIGNED NOT NULL,
    mensagem TEXT NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT helpdesk_fk_comentarios_chamado FOREIGN KEY (chamado_id) REFERENCES helpdesk_chamados(id) ON DELETE CASCADE,
    CONSTRAINT helpdesk_fk_comentarios_autor FOREIGN KEY (autor_id) REFERENCES helpdesk_usuarios(id)
  ) ENGINE=InnoDB`
];

let schemaPromise;

const ensureSchema = () => {
  if (!schemaPromise) {
    schemaPromise = (async () => {
      for (const statement of schema) await pool.execute(statement);
    })().catch((error) => {
      schemaPromise = null;
      throw error;
    });
  }
  return schemaPromise;
};

module.exports = {
  execute: async (...args) => {
    await ensureSchema();
    return pool.execute(...args);
  }
};
