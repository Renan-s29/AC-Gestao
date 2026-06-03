const relatoriosService = require('../services/relatoriosService');

async function excel(req, res, next) {
  try {
    const buf = await relatoriosService.gerarExcelBuffer({
      dataInicio: req.query.data_inicio,
      dataFim: req.query.data_fim,
      status: req.query.status,
      associadoId: req.query.associado_id,
    });
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="ac-gestao-faturamentos.xlsx"');
    return res.send(buf);
  } catch (err) {
    return next(err);
  }
}

async function pdf(req, res, next) {
  try {
    const buf = await relatoriosService.gerarPdfBuffer({
      dataInicio: req.query.data_inicio,
      dataFim: req.query.data_fim,
      status: req.query.status,
      associadoId: req.query.associado_id,
    });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="ac-gestao-faturamentos.pdf"');
    return res.send(buf);
  } catch (err) {
    return next(err);
  }
}

module.exports = { excel, pdf };
