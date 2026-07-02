const router = require('express').Router();

const auth = require('../controllers/authController');

router.use('/api', require('./apiRoutes'));

router.post('/register', auth.register);
router.post('/login', auth.login);
router.post('/api/register', auth.register);
router.post('/api/login', auth.login);

router.use('/api/categorias', require('./categoriaRoutes'));
router.use('/api/produtos', require('./produtosRoutes'));
router.use('/api/clientes', require('./clientesRoutes'));
router.use('/api/pedidos', require('./pedidosRoutes'));

module.exports = router;
