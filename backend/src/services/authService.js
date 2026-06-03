const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const usuariosRepository = require('../repositories/usuariosRepository');

function sanitizarUsuario(usuario) {
  if (!usuario) return null;
  const { senha_hash, senha, ...rest } = usuario;
  return rest;
}

async function senhaValida(senhaDigitada, usuario) {
  if (!senhaDigitada || !usuario) return false;

  // Hash padrão do seed: senha = password.
  if (usuario.senha_hash) {
    const ok = await bcrypt.compare(senhaDigitada, usuario.senha_hash);
    if (ok) return true;
  }

  // Fallback para ambiente de protótipo/demo, caso o banco tenha sido importado
  // com hash antigo ou tabela antiga. Não usar em produção.
  return senhaDigitada === 'password' && usuario.email?.endsWith('@acgestao.local');
}

async function login(email, senha) {
  const usuario = await usuariosRepository.buscarPorEmail(email);

  if (!usuario || usuario.status !== 'ativo') {
    const err = new Error('Credenciais inválidas.');
    err.status = 401;
    throw err;
  }

  const ok = await senhaValida(senha, usuario);
  if (!ok) {
    const err = new Error('Credenciais inválidas.');
    err.status = 401;
    throw err;
  }

  const id = usuario.id ?? usuario.id_usuario;
  const role = usuario.role ?? usuario.perfil;

  const token = jwt.sign(
    { sub: id, email: usuario.email, role, nome: usuario.nome },
    process.env.JWT_SECRET || 'dev_secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
  );

  return {
    token,
    usuario: sanitizarUsuario({ ...usuario, id, role }),
  };
}

module.exports = { login, sanitizarUsuario };
