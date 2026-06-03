const associadosRepository = require('../repositories/associadosRepository');
const financeiroAssociadoService = require('./financeiroAssociadoService');

async function listar(filtros) {
  return associadosRepository.listar(filtros);
}

async function buscarPorId(id) {
  const a = await associadosRepository.buscarPorId(id);
  if (a) {
    await financeiroAssociadoService.sincronizarStatusFinanceiro(id);
    return associadosRepository.buscarPorId(id);
  }
  return null;
}

async function busca(termo) {
  if (!termo || String(termo).trim().length < 2) return [];
  return associadosRepository.buscaGeral(String(termo).trim());
}

async function criar(body) {
  const id = await associadosRepository.criar(body);
  return associadosRepository.buscarPorId(id);
}

async function atualizar(id, body) {
  const atual = await associadosRepository.buscarPorId(id);
  if (!atual) {
    const err = new Error('Associado não encontrado.');
    err.status = 404;
    throw err;
  }
  const merged = {
    razao_social: body.razao_social ?? atual.razao_social,
    cnpj: body.cnpj ?? atual.cnpj,
    telefone: body.telefone !== undefined ? body.telefone : atual.telefone,
    email: body.email ?? atual.email,
    data_associacao: body.data_associacao ?? atual.data_associacao,
    status: body.status ?? atual.status,
    plano_saude_id:
      body.plano_saude_id !== undefined ? body.plano_saude_id : atual.plano_saude_id,
  };
  await associadosRepository.atualizar(id, merged);
  return associadosRepository.buscarPorId(id);
}

async function inativar(id) {
  const atual = await associadosRepository.buscarPorId(id);
  if (!atual) {
    const err = new Error('Associado não encontrado.');
    err.status = 404;
    throw err;
  }
  await associadosRepository.atualizarStatus(id, 'inativo');
  return associadosRepository.buscarPorId(id);
}

module.exports = { listar, buscarPorId, busca, criar, atualizar, inativar };
