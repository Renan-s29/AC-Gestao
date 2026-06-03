const { pool } = require('../config/database');

function normalizarUsuario(usuario) {
  if (!usuario) return null;
  return {
    ...usuario,
    id: usuario.id ?? usuario.id_usuario,
    role: usuario.role ?? usuario.perfil,
    perfil: usuario.perfil ?? usuario.role,
  };
}

async function buscarPorEmail(email) {
  // Primeiro tenta a view/tabela de compatibilidade `usuarios`.
  // Se o banco estiver com a estrutura oficial do DER, tenta também `usuario`.
  try {
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE email = ? LIMIT 1', [email]);
    if (rows[0]) return normalizarUsuario(rows[0]);
  } catch (e) {
    // ignora e tenta a tabela oficial abaixo
  }

  const [rows] = await pool.query('SELECT * FROM usuario WHERE email = ? LIMIT 1', [email]);
  return normalizarUsuario(rows[0] || null);
}

async function buscarPorIdSemSenha(id) {
  try {
    const [rows] = await pool.query(
      'SELECT id, nome, email, role, status, created_at, updated_at FROM usuarios WHERE id = ? LIMIT 1',
      [id]
    );
    if (rows[0]) return normalizarUsuario(rows[0]);
  } catch (e) {}

  const [rows] = await pool.query(
    `SELECT id_usuario AS id, nome, email, perfil AS role, status, criado_em AS created_at, atualizado_em AS updated_at
       FROM usuario WHERE id_usuario = ? LIMIT 1`,
    [id]
  );
  return normalizarUsuario(rows[0] || null);
}

module.exports = { buscarPorEmail, buscarPorIdSemSenha };
