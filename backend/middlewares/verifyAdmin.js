function verifyAdmin(req, res, next) {
  if (req.user && req.user.role === 'admin') {
    return next();
  }

  return res.status(403).json({ error: 'Acesso restrito: apenas administradores' });
}

module.exports = verifyAdmin;
