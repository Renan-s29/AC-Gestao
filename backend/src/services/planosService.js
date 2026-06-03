const planosRepository = require('../repositories/planosRepository');

async function listar() {
  return planosRepository.listar();
}

async function criar(body) {
  const id = await planosRepository.criar(body);
  return planosRepository.buscarPorId(id);
}

async function atualizar(id, body) {
  const atual = await planosRepository.buscarPorId(id);
  if (!atual) {
    const err = new Error('Plano não encontrado.');
    err.status = 404;
    throw err;
  }
  const merged = {
    nome: body.nome ?? atual.nome,
    valor: body.valor !== undefined ? body.valor : atual.valor,
    operadora: body.operadora ?? atual.operadora,
  };
  await planosRepository.atualizar(id, merged);
  return planosRepository.buscarPorId(id);
}

module.exports = { listar, criar, atualizar };
