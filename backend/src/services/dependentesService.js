const dependentesRepository = require('../repositories/dependentesRepository');
const associadosRepository = require('../repositories/associadosRepository');

async function listar(associadoId) {
  return dependentesRepository.listarPorAssociado(associadoId);
}

async function criar(associadoId, body) {
  const associado = await associadosRepository.buscarPorId(associadoId);
  if (!associado) {
    const err = new Error('Associado não encontrado.');
    err.status = 404;
    throw err;
  }
  const id = await dependentesRepository.criar({ ...body, associado_id: associadoId });
  return dependentesRepository.buscarPorId(id);
}

async function atualizar(associadoId, dependenteId, body) {
  const dep = await dependentesRepository.buscarPorId(dependenteId);
  if (!dep || dep.associado_id !== Number(associadoId)) {
    const err = new Error('Dependente não encontrado.');
    err.status = 404;
    throw err;
  }
  const merged = {
    nome: body.nome ?? dep.nome,
    cpf: body.cpf ?? dep.cpf,
    tipo: body.tipo ?? dep.tipo,
    status: body.status ?? dep.status,
  };
  await dependentesRepository.atualizar(dependenteId, merged);
  return dependentesRepository.buscarPorId(dependenteId);
}

async function alterarStatus(associadoId, dependenteId, status) {
  const dep = await dependentesRepository.buscarPorId(dependenteId);
  if (!dep || dep.associado_id !== Number(associadoId)) {
    const err = new Error('Dependente não encontrado.');
    err.status = 404;
    throw err;
  }
  await dependentesRepository.atualizar(dependenteId, {
    nome: dep.nome,
    cpf: dep.cpf,
    tipo: dep.tipo,
    status,
  });
  return dependentesRepository.buscarPorId(dependenteId);
}

module.exports = { listar, criar, atualizar, alterarStatus };
