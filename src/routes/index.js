const router = require('express').Router();
const authController = require('../controllers/authController');
const chamadoController = require('../controllers/chamadoController');
const auth = require('../middlewares/auth');

router.get('/api/status', (req, res) => res.json({ status: 'online', versao: process.env.API_VERSION || '1.0.0' }));
router.post('/api/register', authController.register);
router.post('/api/login', authController.login);
router.get('/api/chamados', auth, chamadoController.list);
router.get('/api/chamados/:id', auth, chamadoController.get);
router.post('/api/chamados', auth, auth.role('cliente'), chamadoController.create);
router.patch('/api/chamados/:id/status', auth, auth.role('tecnico'), chamadoController.updateStatus);
router.post('/api/chamados/:id/comentarios', auth, auth.role('tecnico'), chamadoController.comment);

module.exports = router;
