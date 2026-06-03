const associadosRepository = require('../repositories/associadosRepository');
const consultasScpcRepository = require('../repositories/consultasScpcRepository');
const faturamentosService = require('./faturamentosService');
const { pool } = require('../config/database');

async function pendenciasSaude() {
  const [rows] = await pool.query(
    `SELECT a.id, a.razao_social, a.status,
      (SELECT COUNT(*) FROM dependentes d WHERE d.associado_id = a.id AND d.status = 'ativo') AS dependentes_ativos
     FROM associados a
     WHERE a.status IN ('beneficios_bloqueados', 'suspenso') AND a.status <> 'inativo'
     LIMIT 20`
  );
  return rows;
}

async function resumo() {
  const inadimplentes = await faturamentosService.verificarInadimplencia();
  const consultasMes = await consultasScpcRepository.totalMesAtual();
  const consolidado = await consultasScpcRepository.consolidadoPorMes(6);
  const saude = await pendenciasSaude();

  return {
    inadimplentes: inadimplentes.slice(0, 10),
    total_inadimplentes: inadimplentes.length,
    consultas_scpc_mes: consultasMes,
    pendencias_saude: saude,
    pendencias_saude_total: saude.length,
    faturamento_scpc_mes: Number((consultasMes * 15.90).toFixed(2)),
    grafico_consultas_scpc: consolidado,
  };
}

async function autocomplete(termo) {
  if (!termo || String(termo).trim().length < 2) return [];
  return associadosRepository.buscaGeral(String(termo).trim());
}

module.exports = { resumo, autocomplete, pendenciasSaude };
