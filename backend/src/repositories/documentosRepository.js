const { pool } = require('../config/database');

async function listarPorAssociado(associadoId) {
  const [rows] = await pool.query(
    `SELECT id, associado_id, nome_original, nome_armazenado, caminho_relativo, created_at
     FROM documentos_associado WHERE associado_id = ? ORDER BY created_at DESC`,
    [associadoId]
  );
  return rows;
}

async function inserir(dados) {
  const [r] = await pool.query(
    `INSERT INTO documentos_associado (associado_id, nome_original, nome_armazenado, caminho_relativo)
     VALUES (:associado_id, :nome_original, :nome_armazenado, :caminho_relativo)`,
    dados
  );
  return r.insertId;
}

async function buscarPorId(id) {
  const [rows] = await pool.query('SELECT * FROM documentos_associado WHERE id = ? LIMIT 1', [id]);
  return rows[0] || null;
}

module.exports = { listarPorAssociado, inserir, buscarPorId };
