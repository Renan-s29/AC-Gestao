const { pool } = require('../config/database');

async function listarPorAssociado(associadoId) {
  const [rows] = await pool.query(
    `SELECT id, associado_id, nome, cpf, tipo, status, created_at, updated_at
     FROM dependentes WHERE associado_id = ? ORDER BY nome`,
    [associadoId]
  );
  return rows;
}

async function contarAtivosPorAssociado(associadoId) {
  const [rows] = await pool.query(
    `SELECT COUNT(*) AS qtd FROM dependentes WHERE associado_id = ? AND status = 'ativo'`,
    [associadoId]
  );
  return Number(rows[0]?.qtd || 0);
}

async function buscarPorId(id) {
  const [rows] = await pool.query('SELECT * FROM dependentes WHERE id = ? LIMIT 1', [id]);
  return rows[0] || null;
}

async function criar(dados) {
  const [r] = await pool.query(
    `INSERT INTO dependentes (associado_id, nome, cpf, tipo, status)
     VALUES (:associado_id, :nome, :cpf, :tipo, :status)`,
    {
      associado_id: dados.associado_id,
      nome: dados.nome,
      cpf: dados.cpf,
      tipo: dados.tipo || 'dependente',
      status: dados.status || 'ativo',
    }
  );
  return r.insertId;
}

async function atualizar(id, dados) {
  await pool.query(
    `UPDATE dependentes SET nome = ?, cpf = ?, tipo = ?, status = ? WHERE id = ?`,
    [dados.nome, dados.cpf, dados.tipo, dados.status, id]
  );
}

module.exports = {
  listarPorAssociado,
  contarAtivosPorAssociado,
  buscarPorId,
  criar,
  atualizar,
};
