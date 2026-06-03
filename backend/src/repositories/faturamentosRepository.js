const { pool } = require('../config/database');

async function listar(filtros = {}) {
  const { associado_id, status } = filtros;
  let sql = `SELECT f.*, a.razao_social FROM faturamentos f
    INNER JOIN associados a ON a.id = f.associado_id WHERE 1=1`;
  const params = [];
  if (associado_id) {
    sql += ' AND f.associado_id = ?';
    params.push(associado_id);
  }
  if (status) {
    sql += ' AND f.status = ?';
    params.push(status);
  }
  sql += ' ORDER BY f.data_vencimento DESC';
  const [rows] = await pool.query(sql, params);
  return rows;
}

async function buscarPorId(id) {
  const [rows] = await pool.query('SELECT * FROM faturamentos WHERE id = ? LIMIT 1', [id]);
  return rows[0] || null;
}

async function listarPendentesPorAssociado(associadoId) {
  const [rows] = await pool.query(
    `SELECT * FROM faturamentos WHERE associado_id = ? AND status = 'pendente' ORDER BY data_vencimento`,
    [associadoId]
  );
  return rows;
}

async function listarPendentesTodos() {
  const [rows] = await pool.query(
    `SELECT f.*, a.razao_social FROM faturamentos f
     INNER JOIN associados a ON a.id = f.associado_id
     WHERE f.status = 'pendente'`
  );
  return rows;
}

async function inserir(dados) {
  const [r] = await pool.query(
    `INSERT INTO faturamentos (associado_id, valor_total, data_vencimento, data_pagamento, status, juros, multa, referencia_mes)
     VALUES (:associado_id, :valor_total, :data_vencimento, :data_pagamento, :status, :juros, :multa, :referencia_mes)`,
    {
      associado_id: dados.associado_id,
      valor_total: dados.valor_total,
      data_vencimento: dados.data_vencimento,
      data_pagamento: dados.data_pagamento || null,
      status: dados.status || 'pendente',
      juros: dados.juros ?? 0,
      multa: dados.multa ?? 0,
      referencia_mes: dados.referencia_mes || null,
    }
  );
  return r.insertId;
}

async function atualizarValores(id, { juros, multa, valor_total }) {
  await pool.query(
    `UPDATE faturamentos SET juros = ?, multa = ?, valor_total = ? WHERE id = ?`,
    [juros, multa, valor_total, id]
  );
}

async function marcarPago(id, dataPagamento) {
  await pool.query(
    `UPDATE faturamentos SET status = 'pago', data_pagamento = ? WHERE id = ?`,
    [dataPagamento, id]
  );
}

async function existeReferenciaMes(associadoId, referenciaMes) {
  const [rows] = await pool.query(
    `SELECT id FROM faturamentos WHERE associado_id = ? AND referencia_mes = ? LIMIT 1`,
    [associadoId, referenciaMes]
  );
  return !!rows[0];
}

module.exports = {
  listar,
  buscarPorId,
  listarPendentesPorAssociado,
  listarPendentesTodos,
  inserir,
  atualizarValores,
  marcarPago,
  existeReferenciaMes,
};
