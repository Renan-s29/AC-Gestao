const beneficiosService = require('../services/beneficiosService');

async function status(req, res, next) {
  try {
    const dados = await beneficiosService.statusBeneficios(req.params.id);
    return res.json({ sucesso: true, dados });
  } catch (err) {
    return next(err);
  }
}

module.exports = { status };
