const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const verifyToken = require('../middlewares/verifyToken');
const verifyAdmin = require('../middlewares/verifyAdmin');

router.use(verifyToken);

router.post('/', feedbackController.createFeedback);
router.get('/', feedbackController.getFeedbacksDoAluno);
router.get('/treino/:treino_id', feedbackController.getFeedbacksDoTreino);
router.put('/:id', feedbackController.updateFeedback);
router.get('/:aluno_id/historico', feedbackController.getHistoricoDoAluno);

router.get('/todos', verifyAdmin, feedbackController.getTodosFeedbacks);
router.get('/student/:studentId', verifyAdmin, feedbackController.getFeedbacksByStudentId);
router.delete('/:id', verifyAdmin, feedbackController.deleteFeedback);

module.exports = router;
