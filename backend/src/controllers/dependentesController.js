const dependentesService = require('../services/dependentesService');

async function listar(req, res, next) {
  try {
    const associadoId = req.params.associadoId;
    const dados = await dependentesService.listar(associadoId);
    return res.json({ sucesso: true, dados });
  } catch (err) {
    return next(err);
  }
}

async function criar(req, res, next) {
  try {
    const { nome, cpf } = req.body;
    if (!nome || !cpf) {
      return res.status(400).json({ sucesso: false, mensagem: 'nome e cpf são obrigatórios.' });
    }
    const dados = await dependentesService.criar(req.params.associadoId, req.body);
    return res.status(201).json({ sucesso: true, dados });
  } catch (err) {
    return next(err);
  }
}

async function atualizar(req, res, next) {
  try {
    const dados = await dependentesService.atualizar(
      req.params.associadoId,
      req.params.dependenteId,
      req.body
    );
    return res.json({ sucesso: true, dados });
  } catch (err) {
    return next(err);
  }
}

async function alterarStatus(req, res, next) {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ sucesso: false, mensagem: 'status é obrigatório.' });
    }
    const dados = await dependentesService.alterarStatus(
      req.params.associadoId,
      req.params.dependenteId,
      status
    );
    return res.json({ sucesso: true, dados });
  } catch (err) {
    return next(err);
  }
}

module.exports = { listar, criar, atualizar, alterarStatus };
