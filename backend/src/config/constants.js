/**
 * Constantes de negócio configuráveis via .env (LGPD/compliance podem exigir auditoria de alterações).
 */
function numEnv(name, defaultValue) {
  const v = process.env[name];
  if (v === undefined || v === '') return defaultValue;
  const n = Number(v);
  return Number.isFinite(n) ? n : defaultValue;
}

module.exports = {
  TAXA_ADMINISTRATIVA: numEnv('TAXA_ADMINISTRATIVA', 40),
  DIAS_BLOQUEIO_BENEFICIOS: numEnv('DIAS_BLOQUEIO_BENEFICIOS', 5),
  DIAS_SUSPENSAO_TOTAL: numEnv('DIAS_SUSPENSAO_TOTAL', 30),
  /** Juros simples por dia sobre o valor principal em atraso (ex.: 0.0005 = 0,05% ao dia). */
  PERCENTUAL_JUROS_DIA: numEnv('PERCENTUAL_JUROS_DIA', 0.0005),
  /** Multa única sobre o principal (ex.: 0.02 = 2%). */
  PERCENTUAL_MULTA: numEnv('PERCENTUAL_MULTA', 0.02),
};
