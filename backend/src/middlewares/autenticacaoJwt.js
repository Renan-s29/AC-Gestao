const jwt = require('jsonwebtoken');
require('dotenv').config();

function autenticacaoJwt(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ sucesso: false, mensagem: 'Token não informado.' });
  }
  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
    req.usuario = payload;
    return next();
  } catch {
    return res.status(401).json({ sucesso: false, mensagem: 'Token inválido ou expirado.' });
  }
}

module.exports = { autenticacaoJwt };
