const { pool } = require('../config/database');

/**
 * LGPD: CNPJ, e-mail e razão social são dados pessoais/empresariais sensíveis.
 * Em produção: criptografar colunas sensíveis ou usar vault; mascarar em listagens públicas;
 * registrar bases legais e finalidades no DPO.
 */
async function listar(filtros = {}) {
  const { status } = filtros;
  let sql = `SELECT a.id, a.razao_social, a.cnpj, a.telefone, a.email, a.data_associacao, a.status,
    a.plano_saude_id, a.created_at, a.updated_at, p.nome AS plano_nome
    FROM associados a
    LEFT JOIN planos_saude p ON p.id = a.plano_saude_id`;
  const params = [];
  if (status) {
    sql += ' WHERE a.status = ?';
    params.push(status);
  }
  sql += ' ORDER BY a.razao_social';
  const [rows] = await pool.query(sql, params);
  return rows;
}

async function buscarPorId(id) {
  const [rows] = await pool.query(
    `SELECT a.id, a.razao_social, a.cnpj, a.telefone, a.email, a.data_associacao, a.status,
      a.plano_saude_id, a.created_at, a.updated_at, p.nome AS plano_nome, p.valor AS plano_valor
     FROM associados a
     LEFT JOIN planos_saude p ON p.id = a.plano_saude_id
     WHERE a.id = ? LIMIT 1`,
    [id]
  );
  return rows[0] || null;
}

async function buscaGeral(termo) {
  const like = `%${termo}%`;
  const [rows] = await pool.query(
    `SELECT a.id, a.razao_social, a.cnpj, a.telefone, a.email, a.data_associacao, a.status, a.plano_saude_id
     FROM associados a
     WHERE a.razao_social LIKE ? OR a.cnpj LIKE ? OR a.email LIKE ?
     ORDER BY a.razao_social
     LIMIT 50`,
    [like, like, like]
  );
  return rows;
}

async function criar(dados) {
  const [r] = await pool.query(
    `INSERT INTO associados (razao_social, cnpj, telefone, email, data_associacao, status, plano_saude_id)
     VALUES (:razao_social, :cnpj, :telefone, :email, :data_associacao, :status, :plano_saude_id)`,
    {
      razao_social: dados.razao_social,
      cnpj: dados.cnpj,
      telefone: dados.telefone || null,
      email: dados.email,
      data_associacao: dados.data_associacao,
      status: dados.status || 'ativo',
      plano_saude_id: dados.plano_saude_id || null,
    }
  );
  return r.insertId;
}

async function atualizar(id, dados) {
  await pool.query(
    `UPDATE associados SET
      razao_social = ?, cnpj = ?, telefone = ?, email = ?, data_associacao = ?, status = ?, plano_saude_id = ?
     WHERE id = ?`,
    [
      dados.razao_social,
      dados.cnpj,
      dados.telefone ?? null,
      dados.email,
      dados.data_associacao,
      dados.status,
      dados.plano_saude_id ?? null,
      id,
    ]
  );
}

async function atualizarStatus(id, status) {
  await pool.query('UPDATE associados SET status = ? WHERE id = ?', [status, id]);
}

module.exports = {
  listar,
  buscarPorId,
  buscaGeral,
  criar,
  atualizar,
  atualizarStatus,
};
