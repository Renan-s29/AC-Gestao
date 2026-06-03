const associadosService = require('../services/associadosService');

async function listar(req, res, next) {
  try {
    const dados = await associadosService.listar({ status: req.query.status });
    return res.json({ sucesso: true, dados });
  } catch (err) {
    return next(err);
  }
}

async function buscarPorId(req, res, next) {
  try {
    const item = await associadosService.buscarPorId(req.params.id);
    if (!item) return res.status(404).json({ sucesso: false, mensagem: 'Associado não encontrado.' });
    return res.json({ sucesso: true, dados: item });
  } catch (err) {
    return next(err);
  }
}

async function busca(req, res, next) {
  try {
    const dados = await associadosService.busca(req.query.q);
    return res.json({ sucesso: true, dados });
  } catch (err) {
    return next(err);
  }
}

async function criar(req, res, next) {
  try {
    const { razao_social, cnpj, email, data_associacao } = req.body;
    if (!razao_social || !cnpj || !email || !data_associacao) {
      return res.status(400).json({ sucesso: false, mensagem: 'Campos obrigatórios: razao_social, cnpj, email, data_associacao.' });
    }
    const dados = await associadosService.criar(req.body);
    return res.status(201).json({ sucesso: true, dados });
  } catch (err) {
    return next(err);
  }
}

async function atualizar(req, res, next) {
  try {
    const dados = await associadosService.atualizar(req.params.id, req.body);
    return res.json({ sucesso: true, dados });
  } catch (err) {
    return next(err);
  }
}

async function inativar(req, res, next) {
  try {
    const dados = await associadosService.inativar(req.params.id);
    return res.json({ sucesso: true, dados });
  } catch (err) {
    return next(err);
  }
}

module.exports = { listar, buscarPorId, busca, criar, atualizar, inativar };
