const { pool } = require('../config/database');

async function listar() {
  const [rows] = await pool.query(
    'SELECT id, nome, valor, operadora, created_at, updated_at FROM planos_saude ORDER BY nome'
  );
  return rows;
}

async function buscarPorId(id) {
  const [rows] = await pool.query('SELECT * FROM planos_saude WHERE id = ? LIMIT 1', [id]);
  return rows[0] || null;
}

async function criar(dados) {
  const [r] = await pool.query(
    `INSERT INTO planos_saude (nome, valor, operadora) VALUES (:nome, :valor, :operadora)`,
    { nome: dados.nome, valor: dados.valor, operadora: dados.operadora }
  );
  return r.insertId;
}

async function atualizar(id, dados) {
  await pool.query(`UPDATE planos_saude SET nome = ?, valor = ?, operadora = ? WHERE id = ?`, [
    dados.nome,
    dados.valor,
    dados.operadora,
    id,
  ]);
}

module.exports = { listar, buscarPorId, criar, atualizar };
