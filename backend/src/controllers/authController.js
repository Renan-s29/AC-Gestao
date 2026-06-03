const authService = require('../services/authService');

async function login(req, res, next) {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) {
      return res.status(400).json({ sucesso: false, mensagem: 'E-mail e senha são obrigatórios.' });
    }
    const resultado = await authService.login(email, senha);
    return res.json({ sucesso: true, dados: resultado });
  } catch (err) {
    return next(err);
  }
}

module.exports = { login };
