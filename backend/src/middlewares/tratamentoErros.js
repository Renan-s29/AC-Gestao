/**
 * Middleware central de erros — não vaza stack trace em produção.
 */
// eslint-disable-next-line no-unused-vars
function tratamentoErros(err, req, res, next) {
  if (err.code === 'ER_DUP_ENTRY') {
    err.status = 409;
    err.message = 'Registro duplicado (ex.: CNPJ ou e-mail já existente).';
  }

  const status = err.status || err.statusCode || 500;
  const mensagem =
    status === 500 && process.env.NODE_ENV === 'production'
      ? 'Erro interno do servidor.'
      : err.message || 'Erro interno do servidor.';

  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.error(err);
  }

  res.status(status).json({
    sucesso: false,
    mensagem,
    ...(process.env.NODE_ENV !== 'production' && err.detalhes ? { detalhes: err.detalhes } : {}),
  });
}

module.exports = { tratamentoErros };
