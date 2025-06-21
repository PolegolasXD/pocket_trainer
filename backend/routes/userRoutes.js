const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../middlewares/verifyToken');
const verifyAdmin = require('../middlewares/verifyAdmin');

router.post('/register', userController.createUser);
router.post('/login', userController.login);

router.get('/me', verifyToken, userController.getMe);
router.get('/me/chat_stats', verifyToken, userController.getChatStats);
router.post('/me/dashboard-analysis', verifyToken, userController.generateDashboardAnalysis);
router.get('/', verifyToken, verifyAdmin, userController.getAllUsers);
router.get('/students', verifyToken, verifyAdmin, userController.getStudents);
router.get('/:id/chat_stats', verifyToken, verifyAdmin, userController.getChatStatsByStudentId);
router.post('/:id/dashboard-analysis', verifyToken, verifyAdmin, userController.generateDashboardAnalysisForStudent);
router.delete('/:id', verifyToken, verifyAdmin, userController.deleteUser);

// Rotas com :id devem vir por último para evitar conflitos
router.get('/:id', verifyToken, userController.getUserById);
router.put('/:id', verifyToken, userController.updateUser);

module.exports = router;
