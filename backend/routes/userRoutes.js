const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../middlewares/verifyToken');
const verifyAdmin = require('../middlewares/verifyAdmin');

router.post('/', userController.createUser);
router.post('/login', userController.login);

router.get('/me', verifyToken, userController.getMe);
router.get('/me/chat_stats', verifyToken, userController.getChatStats);
router.post('/me/dashboard-analysis', verifyToken, userController.generateDashboardAnalysis);
router.get('/', verifyToken, verifyAdmin, userController.getAllUsers);
router.delete('/:id', verifyToken, verifyAdmin, userController.deleteUser);

// Rotas com :id devem vir por último para evitar conflitos
router.get('/:id', verifyToken, userController.getUserById);
router.put('/:id', verifyToken, userController.updateUser);

module.exports = router;
