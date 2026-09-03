CREATE DATABASE IF NOT EXISTS helpdesk CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE helpdesk;

CREATE TABLE IF NOT EXISTS helpdesk_usuarios (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  senha_hash VARCHAR(100) NOT NULL,
  papel ENUM('cliente', 'tecnico') NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS helpdesk_chamados (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(140) NOT NULL,
  descricao TEXT NOT NULL,
  status ENUM('Aberto', 'Em Atendimento', 'Concluído') NOT NULL DEFAULT 'Aberto',
  cliente_id INT UNSIGNED NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT helpdesk_fk_chamados_cliente FOREIGN KEY (cliente_id) REFERENCES helpdesk_usuarios(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS helpdesk_comentarios_chamado (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  chamado_id INT UNSIGNED NOT NULL,
  autor_id INT UNSIGNED NOT NULL,
  mensagem TEXT NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT helpdesk_fk_comentarios_chamado FOREIGN KEY (chamado_id) REFERENCES helpdesk_chamados(id) ON DELETE CASCADE,
  CONSTRAINT helpdesk_fk_comentarios_autor FOREIGN KEY (autor_id) REFERENCES helpdesk_usuarios(id)
) ENGINE=InnoDB;
