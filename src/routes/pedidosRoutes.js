const router = require('express').Router();
const auth = require('../middlewares/auth');
const controller = require('../controllers/pedidoController');

router.use(auth);
router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

module.exports = router;
