-- AC-Gestão: criação limpa do banco de dados MySQL
-- ATENÇÃO: este script apaga e recria o banco ac_gestao para facilitar os testes do protótipo.

DROP DATABASE IF EXISTS ac_gestao;
CREATE DATABASE ac_gestao
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE ac_gestao;
