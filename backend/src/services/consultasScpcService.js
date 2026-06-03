const consultasScpcRepository = require('../repositories/consultasScpcRepository');
const associadosRepository = require('../repositories/associadosRepository');

async function registrar(body) {
  const a = await associadosRepository.buscarPorId(body.associado_id);
  if (!a) {
    const err = new Error('Associado não encontrado.');
    err.status = 404;
    throw err;
  }
  const id = await consultasScpcRepository.registrar(body);
  return consultasScpcRepository.buscarPorId(id);
}

async function listarPorAssociado(associadoId) {
  return consultasScpcRepository.listarPorAssociado(associadoId);
}

async function consolidadoGrafico(meses) {
  return consultasScpcRepository.consolidadoPorMes(Number(meses) || 6);
}

module.exports = { registrar, listarPorAssociado, consolidadoGrafico };
