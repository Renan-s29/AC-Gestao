const { pool } = require('../config/database');

async function registrar(dados) {
  const [r] = await pool.query(
    `INSERT INTO consultas_scpc (associado_id, data_consulta, valor) VALUES (:associado_id, :data_consulta, :valor)`,
    {
      associado_id: dados.associado_id,
      data_consulta: dados.data_consulta,
      valor: dados.valor ?? 0,
    }
  );
  return r.insertId;
}

async function listarPorAssociado(associadoId) {
  const [rows] = await pool.query(
    `SELECT id, associado_id, data_consulta, valor, created_at FROM consultas_scpc
     WHERE associado_id = ? ORDER BY data_consulta DESC`,
    [associadoId]
  );
  return rows;
}

/** Agrupa por mês para gráficos (YYYY-MM). */
async function consolidadoPorMes(limiteMeses = 6) {
  const [rows] = await pool.query(
    `SELECT DATE_FORMAT(data_consulta, '%Y-%m') AS mes,
            COUNT(*) AS total_consultas,
            SUM(valor) AS valor_total
     FROM consultas_scpc
     WHERE data_consulta >= DATE_SUB(CURDATE(), INTERVAL ? MONTH)
     GROUP BY DATE_FORMAT(data_consulta, '%Y-%m')
     ORDER BY mes ASC`,
    [limiteMeses]
  );
  return rows;
}

async function totalMesAtual() {
  const [rows] = await pool.query(
    `SELECT COUNT(*) AS qtd FROM consultas_scpc
     WHERE YEAR(data_consulta) = YEAR(CURDATE()) AND MONTH(data_consulta) = MONTH(CURDATE())`
  );
  return Number(rows[0]?.qtd || 0);
}

async function buscarPorId(id) {
  const [rows] = await pool.query(
    'SELECT id, associado_id, data_consulta, valor, created_at FROM consultas_scpc WHERE id = ? LIMIT 1',
    [id]
  );
  return rows[0] || null;
}

module.exports = {
  registrar,
  listarPorAssociado,
  consolidadoPorMes,
  totalMesAtual,
  buscarPorId,
};
