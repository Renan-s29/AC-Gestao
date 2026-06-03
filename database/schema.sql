-- AC-Gestão: esquema relacional oficial do protótipo P1 (MySQL 8+)
-- Entidades em português conforme DER do documento: ASSOCIADO, DEPENDENTE,
-- PLANO_SAUDE, FATURAMENTO, CONSULTA_SCPC e LOG_ACESSO.

USE ac_gestao;
SET FOREIGN_KEY_CHECKS = 0;

DROP VIEW IF EXISTS documentos_associado;
DROP VIEW IF EXISTS usuarios;
DROP VIEW IF EXISTS consultas_scpc;
DROP VIEW IF EXISTS faturamentos;
DROP VIEW IF EXISTS dependentes;
DROP VIEW IF EXISTS associados;
DROP VIEW IF EXISTS planos_saude;

DROP TABLE IF EXISTS documento;
DROP TABLE IF EXISTS log_acesso;
DROP TABLE IF EXISTS usuario;
DROP TABLE IF EXISTS consulta_scpc;
DROP TABLE IF EXISTS faturamento;
DROP TABLE IF EXISTS dependente;
DROP TABLE IF EXISTS associado;
DROP TABLE IF EXISTS plano_saude;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE plano_saude (
  id_plano INT AUTO_INCREMENT PRIMARY KEY,
  nome_plano VARCHAR(150) NOT NULL,
  valor DECIMAL(12, 2) NOT NULL DEFAULT 0,
  operadora VARCHAR(150) NOT NULL DEFAULT 'Operadora não informada',
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE associado (
  id_associado INT AUTO_INCREMENT PRIMARY KEY,
  razao_social VARCHAR(255) NOT NULL,
  cnpj VARCHAR(18) NOT NULL,
  telefone VARCHAR(30),
  email VARCHAR(180) NOT NULL,
  data_associacao DATE NOT NULL,
  status VARCHAR(40) NOT NULL DEFAULT 'ativo',
  id_plano INT NULL,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_associado_cnpj (cnpj),
  KEY idx_associado_email (email),
  KEY idx_associado_razao (razao_social),
  KEY idx_associado_status (status),
  CONSTRAINT fk_associado_plano
    FOREIGN KEY (id_plano) REFERENCES plano_saude (id_plano)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE dependente (
  id_dependente INT AUTO_INCREMENT PRIMARY KEY,
  id_associado INT NOT NULL,
  nome VARCHAR(200) NOT NULL,
  cpf VARCHAR(14) NOT NULL,
  tipo VARCHAR(50) NOT NULL DEFAULT 'dependente',
  status VARCHAR(30) NOT NULL DEFAULT 'ativo',
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_dependente_associado (id_associado),
  CONSTRAINT fk_dependente_associado
    FOREIGN KEY (id_associado) REFERENCES associado (id_associado)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE faturamento (
  id_faturamento INT AUTO_INCREMENT PRIMARY KEY,
  id_associado INT NOT NULL,
  valor_total DECIMAL(14, 2) NOT NULL DEFAULT 0,
  data_vencimento DATE NOT NULL,
  data_pagamento DATE NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'pendente',
  juros DECIMAL(14, 2) NOT NULL DEFAULT 0,
  multa DECIMAL(14, 2) NOT NULL DEFAULT 0,
  referencia_mes CHAR(7) NULL COMMENT 'YYYY-MM',
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_faturamento_associado (id_associado),
  KEY idx_faturamento_vencimento (data_vencimento),
  KEY idx_faturamento_status (status),
  CONSTRAINT fk_faturamento_associado
    FOREIGN KEY (id_associado) REFERENCES associado (id_associado)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE consulta_scpc (
  id_consulta INT AUTO_INCREMENT PRIMARY KEY,
  id_associado INT NOT NULL,
  data_consulta DATE NOT NULL,
  valor DECIMAL(12, 2) NOT NULL DEFAULT 0,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_consulta_associado (id_associado),
  KEY idx_consulta_data (data_consulta),
  CONSTRAINT fk_consulta_associado
    FOREIGN KEY (id_associado) REFERENCES associado (id_associado)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE usuario (
  id_usuario INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  email VARCHAR(180) NOT NULL,
  senha_hash VARCHAR(255) NOT NULL,
  perfil VARCHAR(40) NOT NULL DEFAULT 'atendimento',
  status VARCHAR(20) NOT NULL DEFAULT 'ativo',
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_usuario_email (email),
  KEY idx_usuario_perfil (perfil)
) ENGINE=InnoDB;

CREATE TABLE log_acesso (
  id_log INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT NULL,
  id_associado INT NULL,
  usuario VARCHAR(180) NULL,
  acao VARCHAR(255) NOT NULL,
  data_hora TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_log_usuario (id_usuario),
  KEY idx_log_associado (id_associado),
  CONSTRAINT fk_log_usuario FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_log_associado FOREIGN KEY (id_associado) REFERENCES associado (id_associado) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE documento (
  id_documento INT AUTO_INCREMENT PRIMARY KEY,
  id_associado INT NOT NULL,
  nome_original VARCHAR(255) NOT NULL,
  nome_armazenado VARCHAR(255) NOT NULL,
  caminho_relativo VARCHAR(500) NOT NULL,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_documento_associado (id_associado),
  CONSTRAINT fk_documento_associado
    FOREIGN KEY (id_associado) REFERENCES associado (id_associado)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Views de compatibilidade usadas pelo backend.
-- Assim o banco principal fica igual ao DER do documento, mas a aplicação continua funcional.
CREATE OR REPLACE VIEW planos_saude AS
SELECT id_plano AS id, nome_plano AS nome, valor, operadora, criado_em AS created_at, atualizado_em AS updated_at FROM plano_saude;

CREATE OR REPLACE VIEW associados AS
SELECT id_associado AS id, razao_social, cnpj, telefone, email, data_associacao, status,
       id_plano AS plano_saude_id, criado_em AS created_at, atualizado_em AS updated_at
FROM associado;

CREATE OR REPLACE VIEW dependentes AS
SELECT id_dependente AS id, id_associado AS associado_id, nome, cpf, tipo, status,
       criado_em AS created_at, atualizado_em AS updated_at
FROM dependente;

CREATE OR REPLACE VIEW faturamentos AS
SELECT id_faturamento AS id, id_associado AS associado_id, valor_total, data_vencimento, data_pagamento,
       status, juros, multa, referencia_mes, criado_em AS created_at, atualizado_em AS updated_at
FROM faturamento;

CREATE OR REPLACE VIEW consultas_scpc AS
SELECT id_consulta AS id, id_associado AS associado_id, data_consulta, valor, criado_em AS created_at
FROM consulta_scpc;

CREATE OR REPLACE VIEW usuarios AS
SELECT id_usuario AS id, nome, email, senha_hash, perfil AS role, status,
       criado_em AS created_at, atualizado_em AS updated_at
FROM usuario;

CREATE OR REPLACE VIEW documentos_associado AS
SELECT id_documento AS id, id_associado AS associado_id, nome_original, nome_armazenado,
       caminho_relativo, criado_em AS created_at
FROM documento;
