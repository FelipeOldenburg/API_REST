const router = require('express').Router();

const auth = require('../controllers/authController');
const event = require('../controllers/eventController');
const authMiddleware = require('../middlewares/auth');

router.post('/register', auth.register);
router.post('/login', auth.login);

router.get('/events', authMiddleware, event.getAll);
router.get('/events/:id', authMiddleware, event.getById);
router.post('/events', authMiddleware, event.create);
router.put('/events/:id', authMiddleware, event.update);
router.delete('/events/:id', authMiddleware, event.delete);

module.exports = router;
