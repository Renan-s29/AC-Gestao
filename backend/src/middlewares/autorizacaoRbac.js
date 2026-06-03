/**
 * RBAC: roles admin | financeiro | atendimento | gestor
 * admin tem acesso a todas as rotas protegidas por esta função.
 */
function autorizarRoles(...rolesPermitidas) {
  const flat = rolesPermitidas.flat();
  return (req, res, next) => {
    const role = req.usuario?.role;
    if (!role) {
      return res.status(403).json({ sucesso: false, mensagem: 'Papel não identificado.' });
    }
    if (role === 'admin' || flat.includes(role)) {
      return next();
    }
    return res.status(403).json({ sucesso: false, mensagem: 'Sem permissão para este recurso.' });
  };
}

module.exports = { autorizarRoles };
