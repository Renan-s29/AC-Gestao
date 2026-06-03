const consultasScpcService = require('../services/consultasScpcService');

async function registrar(req, res, next) {
  try {
    const { associado_id, data_consulta } = req.body;
    if (!associado_id || !data_consulta) {
      return res.status(400).json({ sucesso: false, mensagem: 'associado_id e data_consulta são obrigatórios.' });
    }
    const dados = await consultasScpcService.registrar(req.body);
    return res.status(201).json({ sucesso: true, dados });
  } catch (err) {
    return next(err);
  }
}

async function listarPorAssociado(req, res, next) {
  try {
    const associadoId = req.params.associadoId || req.params.id;
    const dados = await consultasScpcService.listarPorAssociado(associadoId);
    return res.json({ sucesso: true, dados });
  } catch (err) {
    return next(err);
  }
}

async function consolidado(req, res, next) {
  try {
    const dados = await consultasScpcService.consolidadoGrafico(req.query.meses);
    return res.json({ sucesso: true, dados });
  } catch (err) {
    return next(err);
  }
}

module.exports = { registrar, listarPorAssociado, consolidado };
