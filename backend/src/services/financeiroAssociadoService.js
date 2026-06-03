const {
  DIAS_BLOQUEIO_BENEFICIOS,
  DIAS_SUSPENSAO_TOTAL,
} = require('../config/constants');
const faturamentosRepository = require('../repositories/faturamentosRepository');
const associadosRepository = require('../repositories/associadosRepository');

function diasAtraso(dataVencimentoStr) {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const venc = new Date(dataVencimentoStr);
  venc.setHours(0, 0, 0, 0);
  const diff = Math.floor((hoje.getTime() - venc.getTime()) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
}

/**
 * Atualiza status do associado conforme inadimplência:
 * - > DIAS_SUSPENSAO_TOTAL dias em alguma fatura pendente → suspenso
 * - > DIAS_BLOQUEIO_BENEFICIOS dias → beneficios_bloqueados
 * - pendência leve (até bloqueio) → ativo (mantém benefícios)
 * - sem pendências → ativo
 * Não altera associados já inativos manualmente.
 */
async function sincronizarStatusFinanceiro(associadoId) {
  const associado = await associadosRepository.buscarPorId(associadoId);
  if (!associado || associado.status === 'inativo') return associado;

  const pendentes = await faturamentosRepository.listarPendentesPorAssociado(associadoId);
  if (pendentes.length === 0) {
    if (associado.status !== 'ativo') {
      await associadosRepository.atualizarStatus(associadoId, 'ativo');
    }
    return associadosRepository.buscarPorId(associadoId);
  }

  const maxDias = Math.max(...pendentes.map((f) => diasAtraso(f.data_vencimento)));

  let novoStatus = associado.status;
  if (maxDias > DIAS_SUSPENSAO_TOTAL) {
    novoStatus = 'suspenso';
  } else if (maxDias > DIAS_BLOQUEIO_BENEFICIOS) {
    novoStatus = 'beneficios_bloqueados';
  } else {
    novoStatus = 'ativo';
  }

  if (novoStatus !== associado.status) {
    await associadosRepository.atualizarStatus(associadoId, novoStatus);
  }
  return associadosRepository.buscarPorId(associadoId);
}

function bloquearBeneficiosPorInadimplencia(associado) {
  if (!associado) return true;
  if (associado.status === 'suspenso' || associado.status === 'beneficios_bloqueados') return true;
  return false;
}

module.exports = {
  diasAtraso,
  sincronizarStatusFinanceiro,
  bloquearBeneficiosPorInadimplencia,
};
