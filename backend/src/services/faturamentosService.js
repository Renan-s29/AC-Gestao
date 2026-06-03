const {
  TAXA_ADMINISTRATIVA,
  PERCENTUAL_JUROS_DIA,
  PERCENTUAL_MULTA,
} = require('../config/constants');
const faturamentosRepository = require('../repositories/faturamentosRepository');
const associadosRepository = require('../repositories/associadosRepository');
const dependentesRepository = require('../repositories/dependentesRepository');
const planosRepository = require('../repositories/planosRepository');
const financeiroAssociadoService = require('./financeiroAssociadoService');

function calcularVencimentoPadrao(referenciaMes) {
  const [y, m] = referenciaMes.split('-').map(Number);
  const mesSeguinte = m === 12 ? 1 : m + 1;
  const anoSeguinte = m === 12 ? y + 1 : y;
  const dia = 10;
  const mm = String(mesSeguinte).padStart(2, '0');
  return `${anoSeguinte}-${mm}-${String(dia).padStart(2, '0')}`;
}

async function listar(filtros) {
  return faturamentosRepository.listar(filtros);
}

async function gerarMensal(referenciaMes) {
  if (!/^\d{4}-\d{2}$/.test(referenciaMes)) {
    const err = new Error('referencia_mes deve estar no formato YYYY-MM.');
    err.status = 400;
    throw err;
  }

  const associados = await associadosRepository.listar({});
  const criados = [];
  for (const a of associados) {
    if (a.status === 'inativo') continue;
    const existe = await faturamentosRepository.existeReferenciaMes(a.id, referenciaMes);
    if (existe) continue;

    const depsAtivos = await dependentesRepository.contarAtivosPorAssociado(a.id);
    const beneficiarios = 1 + depsAtivos;
    let valorPlano = 0;
    if (a.plano_saude_id) {
      const plano = await planosRepository.buscarPorId(a.plano_saude_id);
      valorPlano = plano ? Number(plano.valor) : 0;
    }
    const valorTotal = valorPlano + TAXA_ADMINISTRATIVA * beneficiarios;
    const dataVencimento = calcularVencimentoPadrao(referenciaMes);

    const id = await faturamentosRepository.inserir({
      associado_id: a.id,
      valor_total: valorTotal,
      data_vencimento: dataVencimento,
      data_pagamento: null,
      status: 'pendente',
      juros: 0,
      multa: 0,
      referencia_mes: referenciaMes,
    });
    criados.push(await faturamentosRepository.buscarPorId(id));
    await financeiroAssociadoService.sincronizarStatusFinanceiro(a.id);
  }
  return criados;
}

async function calcularJurosMulta(id) {
  const fat = await faturamentosRepository.buscarPorId(id);
  if (!fat) {
    const err = new Error('Faturamento não encontrado.');
    err.status = 404;
    throw err;
  }
  if (fat.status !== 'pendente') {
    const err = new Error('Apenas faturamentos pendentes podem ter juros/multa recalculados.');
    err.status = 400;
    throw err;
  }

  const principal = Number(fat.valor_total);
  const dias = financeiroAssociadoService.diasAtraso(fat.data_vencimento);
  let juros = 0;
  let multa = 0;
  if (dias > 0) {
    juros = Math.round(principal * PERCENTUAL_JUROS_DIA * dias * 100) / 100;
    multa = Math.round(principal * PERCENTUAL_MULTA * 100) / 100;
  }
  await faturamentosRepository.atualizarValores(id, { juros, multa, valor_total: principal });
  await financeiroAssociadoService.sincronizarStatusFinanceiro(fat.associado_id);
  return faturamentosRepository.buscarPorId(id);
}

async function verificarInadimplencia() {
  const pendentes = await faturamentosRepository.listarPendentesTodos();
  const mapa = new Map();
  for (const f of pendentes) {
    const dias = financeiroAssociadoService.diasAtraso(f.data_vencimento);
    if (dias <= 0) continue;
    const key = f.associado_id;
    if (!mapa.has(key)) {
      mapa.set(key, {
        associado_id: f.associado_id,
        razao_social: f.razao_social,
        faturas_em_atraso: [],
        maior_atraso_dias: 0,
      });
    }
    const item = mapa.get(key);
    item.faturas_em_atraso.push({
      id: f.id,
      referencia_mes: f.referencia_mes,
      data_vencimento: f.data_vencimento,
      dias_atraso: dias,
      valor_total: f.valor_total,
      juros: f.juros,
      multa: f.multa,
    });
    item.maior_atraso_dias = Math.max(item.maior_atraso_dias, dias);
  }
  return [...mapa.values()].sort((a, b) => b.maior_atraso_dias - a.maior_atraso_dias);
}

async function marcarPagamento(id, dataPagamento) {
  const fat = await faturamentosRepository.buscarPorId(id);
  if (!fat) {
    const err = new Error('Faturamento não encontrado.');
    err.status = 404;
    throw err;
  }
  await faturamentosRepository.marcarPago(id, dataPagamento);
  await financeiroAssociadoService.sincronizarStatusFinanceiro(fat.associado_id);
  return faturamentosRepository.buscarPorId(id);
}

module.exports = {
  listar,
  gerarMensal,
  calcularJurosMulta,
  verificarInadimplencia,
  marcarPagamento,
};
