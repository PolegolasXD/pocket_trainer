const express = require('express');
const router = express.Router();
const treinoSemanalController = require('../controllers/treinoSemanalController');
const verifyToken = require('../middlewares/verifyToken');
const verifyAdmin = require('../middlewares/verifyAdmin');

// Rotas para Alunos (ver seu próprio treino)
router.get('/', verifyToken, treinoSemanalController.getTreino);

// Rotas para Admins (gerenciar treinos de alunos) - A verificação de admin/aluno é feita no controller
router.get('/aluno/:aluno_id', verifyToken, treinoSemanalController.getTreino);
router.post('/', verifyToken, verifyAdmin, treinoSemanalController.addExercicio);
router.put('/:id', verifyToken, verifyAdmin, treinoSemanalController.updateExercicio);
router.delete('/:id', verifyToken, verifyAdmin, treinoSemanalController.deleteExercicio);

module.exports = router; 
