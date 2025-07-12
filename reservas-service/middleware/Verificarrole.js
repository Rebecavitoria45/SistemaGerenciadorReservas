function verificarRole(permissoesPermitidas = []) {
  return (req, res, next) => {
    if (!req.usuario || !permissoesPermitidas.includes(req.usuario.role)) {
      return res.status(403).json({ msg: 'Acesso negado: permissão insuficiente' });
    }
    next();
  };
}
module.exports = verificarRole