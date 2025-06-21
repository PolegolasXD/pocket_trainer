// backend/routes/treinoRoutes.js
const express = require('express');
const router = express.Router();
const treinoController = require('../controllers/treinoController');
const verifyToken = require('../middlewares/verifyToken');
const verifyAdmin = require('../middlewares/verifyAdmin');

router.get('/exercises', verifyToken, treinoController.getUniqueExercises);
router.post('/', verifyToken, treinoController.createTreino);
router.post('/bulk', verifyToken, treinoController.createBulkTreinos);
router.get('/', verifyToken, treinoController.getTreinosDoAluno);
router.get('/student/:studentId', verifyToken, verifyAdmin, treinoController.getTreinosByStudentId);
router.put('/:id', verifyToken, treinoController.updateTreino);
router.delete('/:id', verifyToken, treinoController.deleteTreino);

module.exports = router;
