const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const [scheme, token] = (req.get('authorization') || '').split(' ');
  if (scheme !== 'Bearer' || !token) return res.status(401).json({ error: 'Token Bearer obrigatorio.' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Token invalido ou expirado.' });
  }
};

module.exports.role = (papel) => (req, res, next) => req.user.papel === papel ? next() : res.status(403).json({ error: 'Acesso nao permitido para este perfil.' });
