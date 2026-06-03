USE ac_gestao;

-- Garante usuários de acesso do protótipo.
-- Senha de todos: password
INSERT INTO usuario (nome, email, senha_hash, perfil, status)
VALUES
  ('Administrador', 'admin@acgestao.local', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'ativo'),
  ('Financeiro', 'financeiro@acgestao.local', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'financeiro', 'ativo'),
  ('Atendimento', 'atendimento@acgestao.local', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'atendimento', 'ativo'),
  ('Gestor', 'gestor@acgestao.local', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'gestor', 'ativo')
ON DUPLICATE KEY UPDATE
  senha_hash = VALUES(senha_hash),
  perfil = VALUES(perfil),
  status = 'ativo';
