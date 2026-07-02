const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({ error: 'Sem token' });

  const requestUserId = req.headers['x-user-id'] || req.body.usuario_id || req.query.usuario_id;

  if (!requestUserId) {
    return res.status(403).json({ error: 'ID do usuario obrigatorio' });
  }

  try {
    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const tokenUserId = decoded.id || decoded.usuario_id;

    if (!tokenUserId || String(tokenUserId) !== String(requestUserId)) {
      return res.status(403).json({ error: 'Usuario nao autorizado' });
    }

    req.user = { id: tokenUserId };
    next();
  } catch {
    res.status(401).json({ error: 'Token invalido' });
  }
};
