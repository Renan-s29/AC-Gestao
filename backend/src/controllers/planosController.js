const planosService = require('../services/planosService');

async function listar(req, res, next) {
  try {
    const dados = await planosService.listar();
    return res.json({ sucesso: true, dados });
  } catch (err) {
    return next(err);
  }
}

async function criar(req, res, next) {
  try {
    const { nome, valor, operadora } = req.body;
    if (!nome || valor === undefined || !operadora) {
      return res.status(400).json({ sucesso: false, mensagem: 'nome, valor e operadora são obrigatórios.' });
    }
    const dados = await planosService.criar(req.body);
    return res.status(201).json({ sucesso: true, dados });
  } catch (err) {
    return next(err);
  }
}

async function atualizar(req, res, next) {
  try {
    const dados = await planosService.atualizar(req.params.id, req.body);
    return res.json({ sucesso: true, dados });
  } catch (err) {
    return next(err);
  }
}

module.exports = { listar, criar, atualizar };
