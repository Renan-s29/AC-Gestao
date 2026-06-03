const dashboardService = require('../services/dashboardService');

async function resumo(req, res, next) {
  try {
    const dados = await dashboardService.resumo();
    return res.json({ sucesso: true, dados });
  } catch (err) {
    return next(err);
  }
}

async function autocomplete(req, res, next) {
  try {
    const dados = await dashboardService.autocomplete(req.query.q);
    return res.json({ sucesso: true, dados });
  } catch (err) {
    return next(err);
  }
}

module.exports = { resumo, autocomplete };
