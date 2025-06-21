const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const verifyToken = require('../middlewares/verifyToken');
const verifyAdmin = require('../middlewares/verifyAdmin');

router.use(verifyToken, verifyAdmin);

router.get('/treinos', adminController.getAllTreinos);
router.get('/treinos/:aluno_id', adminController.getTreinosPorAluno);
router.get('/estatisticas', adminController.getEstatisticas);
router.get('/estatisticas/exercicio/:nome', adminController.getEstatisticasPorExercicio);
router.get('/evolucao/:aluno_id/:exercicio', adminController.getEvolucaoDoExercicio);
router.get('/estatisticas/chat', adminController.getChatFeedbackStats);

module.exports = router;
