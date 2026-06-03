const faturamentosService = require('../services/faturamentosService');

async function listar(req, res, next) {
  try {
    const dados = await faturamentosService.listar({
      associado_id: req.query.associado_id,
      status: req.query.status,
    });
    return res.json({ sucesso: true, dados });
  } catch (err) {
    return next(err);
  }
}

async function gerarMensal(req, res, next) {
  try {
    const referencia_mes = req.body.referencia_mes;
    if (!referencia_mes) {
      return res.status(400).json({ sucesso: false, mensagem: 'referencia_mes (YYYY-MM) é obrigatório.' });
    }
    const dados = await faturamentosService.gerarMensal(referencia_mes);
    return res.status(201).json({ sucesso: true, dados });
  } catch (err) {
    return next(err);
  }
}

async function calcularJurosMulta(req, res, next) {
  try {
    const dados = await faturamentosService.calcularJurosMulta(req.params.id);
    return res.json({ sucesso: true, dados });
  } catch (err) {
    return next(err);
  }
}

async function inadimplencia(req, res, next) {
  try {
    const dados = await faturamentosService.verificarInadimplencia();
    return res.json({ sucesso: true, dados });
  } catch (err) {
    return next(err);
  }
}

async function marcarPagamento(req, res, next) {
  try {
    const { data_pagamento } = req.body;
    if (!data_pagamento) {
      return res.status(400).json({ sucesso: false, mensagem: 'data_pagamento (YYYY-MM-DD) é obrigatória.' });
    }
    const dados = await faturamentosService.marcarPagamento(req.params.id, data_pagamento);
    return res.json({ sucesso: true, dados });
  } catch (err) {
    return next(err);
  }
}

module.exports = { listar, gerarMensal, calcularJurosMulta, inadimplencia, marcarPagamento };
