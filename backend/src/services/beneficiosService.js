const associadosRepository = require('../repositories/associadosRepository');
const financeiroAssociadoService = require('./financeiroAssociadoService');

async function statusBeneficios(associadoId) {
  await financeiroAssociadoService.sincronizarStatusFinanceiro(associadoId);
  const associado = await associadosRepository.buscarPorId(associadoId);
  if (!associado) {
    const err = new Error('Associado não encontrado.');
    err.status = 404;
    throw err;
  }
  const bloqueado = financeiroAssociadoService.bloquearBeneficiosPorInadimplencia(associado);
  return {
    associado_id: associado.id,
    status_financeiro_associado: associado.status,
    beneficios_liberados: !bloqueado,
    observacao:
      'LGPD: o uso de dados cadastrais para bloqueio de benefícios deve constar em política interna e comunicação ao titular.',
  };
}

module.exports = { statusBeneficios };
