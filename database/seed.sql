-- AC-Gestão: dados iniciais para demonstração
-- Senha padrão de todos os usuários: password

USE ac_gestao;

INSERT INTO plano_saude (nome_plano, valor, operadora) VALUES
  ('Essencial', 120.00, 'Saúde Mais'),
  ('Executivo', 280.00, 'Vida Plena'),
  ('Premium', 450.00, 'União Saúde');

INSERT INTO associado (razao_social, cnpj, telefone, email, data_associacao, status, id_plano) VALUES
  ('Comércio Silva Ltda', '12.345.678/0001-90', '(11) 3000-1001', 'contato@silva.com.br', '2022-03-15', 'ativo', 1),
  ('Distribuidora Norte', '98.765.432/0001-10', '(11) 3000-2002', 'financeiro@norte.com.br', '2021-08-01', 'beneficios_bloqueados', 2),
  ('Padaria Central ME', '11.222.333/0001-44', '(11) 3000-3003', 'central@padaria.com', '2023-01-10', 'suspenso', 1),
  ('Tech Solutions SA', '55.444.333/0001-22', '(11) 3000-4004', 'contato@techsolutions.com', '2020-11-20', 'ativo', 3);

INSERT INTO dependente (id_associado, nome, cpf, tipo, status) VALUES
  (1, 'Maria Silva', '111.222.333-44', 'conjuge', 'ativo'),
  (1, 'João Silva', '111.222.333-55', 'filho', 'ativo'),
  (2, 'Ana Costa', '222.333.444-66', 'conjuge', 'ativo'),
  (2, 'Pedro Costa', '222.333.444-77', 'filho', 'carencia'),
  (4, 'Carlos Souza', '333.444.555-88', 'conjuge', 'ativo');

INSERT INTO faturamento (id_associado, valor_total, data_vencimento, data_pagamento, status, juros, multa, referencia_mes) VALUES
  (1, 320.00, DATE_SUB(CURDATE(), INTERVAL 10 DAY), NULL, 'pendente', 0, 0, DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 1 MONTH), '%Y-%m')),
  (2, 680.00, DATE_SUB(CURDATE(), INTERVAL 20 DAY), NULL, 'pendente', 0, 0, DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 1 MONTH), '%Y-%m')),
  (3, 200.00, DATE_SUB(CURDATE(), INTERVAL 45 DAY), NULL, 'pendente', 0, 0, DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 2 MONTH), '%Y-%m')),
  (4, 530.00, DATE_SUB(CURDATE(), INTERVAL 5 DAY), CURDATE(), 'pago', 0, 0, DATE_FORMAT(CURDATE(), '%Y-%m'));

INSERT INTO consulta_scpc (id_associado, data_consulta, valor) VALUES
  (1, DATE_SUB(CURDATE(), INTERVAL 5 DAY), 15.90),
  (1, DATE_SUB(CURDATE(), INTERVAL 20 DAY), 15.90),
  (2, DATE_SUB(CURDATE(), INTERVAL 2 DAY), 15.90),
  (4, CURDATE(), 15.90),
  (4, DATE_SUB(CURDATE(), INTERVAL 15 DAY), 15.90);

INSERT INTO usuario (nome, email, senha_hash, perfil, status) VALUES
  ('Administrador', 'admin@acgestao.local', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'ativo'),
  ('Financeiro', 'financeiro@acgestao.local', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'financeiro', 'ativo'),
  ('Atendimento', 'atendimento@acgestao.local', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'atendimento', 'ativo'),
  ('Gestor', 'gestor@acgestao.local', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'gestor', 'ativo');

INSERT INTO log_acesso (id_usuario, id_associado, usuario, acao) VALUES
  (1, 1, 'admin@acgestao.local', 'Consulta de ficha digital do associado'),
  (2, 2, 'financeiro@acgestao.local', 'Geração de relatório financeiro'),
  (3, 4, 'atendimento@acgestao.local', 'Inclusão de dependente em benefício');
