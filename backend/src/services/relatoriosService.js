const XLSX = require('xlsx');
const PDFDocument = require('pdfkit');
const { pool } = require('../config/database');

async function buscarDadosExportacao({ dataInicio, dataFim, status, associadoId }) {
  const params = [];
  let whereF = 'WHERE 1=1';
  if (dataInicio) {
    whereF += ' AND f.data_vencimento >= ?';
    params.push(dataInicio);
  }
  if (dataFim) {
    whereF += ' AND f.data_vencimento <= ?';
    params.push(dataFim);
  }
  if (status) {
    whereF += ' AND f.status = ?';
    params.push(status);
  }
  if (associadoId) {
    whereF += ' AND f.associado_id = ?';
    params.push(associadoId);
  }

  const [rows] = await pool.query(
    `SELECT f.id, f.associado_id, a.razao_social, f.valor_total, f.data_vencimento, f.data_pagamento,
            f.status, f.juros, f.multa, f.referencia_mes
     FROM faturamentos f
     INNER JOIN associados a ON a.id = f.associado_id
     ${whereF}
     ORDER BY f.data_vencimento DESC`,
    params
  );
  return rows;
}

async function gerarExcelBuffer(filtros) {
  const dados = await buscarDadosExportacao(filtros);
  const ws = XLSX.utils.json_to_sheet(
    dados.map((r) => ({
      ID: r.id,
      Associado: r.razao_social,
      Valor: r.valor_total,
      Vencimento: r.data_vencimento,
      Pagamento: r.data_pagamento,
      Status: r.status,
      Juros: r.juros,
      Multa: r.multa,
      Referencia: r.referencia_mes,
    }))
  );
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Faturamentos');
  return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
}

async function gerarPdfBuffer(filtros) {
  const dados = await buscarDadosExportacao(filtros);
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40 });
    const chunks = [];
    doc.on('data', (c) => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    doc.fontSize(16).text('AC-Gestão — Relatório de faturamento', { underline: true });
    doc.moveDown();
    doc.fontSize(10).text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`);
    doc.moveDown();

    dados.slice(0, 200).forEach((r, i) => {
      doc
        .fontSize(9)
        .text(
          `${i + 1}. ${r.razao_social} | R$ ${Number(r.valor_total).toFixed(2)} | Venc: ${r.data_vencimento} | ${r.status}`
        );
    });
    if (dados.length > 200) {
      doc.text('... (limite de 200 linhas no PDF de demonstração)');
    }
    doc.end();
  });
}

module.exports = { buscarDadosExportacao, gerarExcelBuffer, gerarPdfBuffer };
