// backend/routes/treinoRoutes.js
const express = require('express');
const router = express.Router();
const treinoController = require('../controllers/treinoController');
const verifyToken = require('../middlewares/verifyToken');

router.post('/', verifyToken, treinoController.createTreino);
router.get('/', verifyToken, treinoController.getTreinosDoAluno);
router.put('/:id', verifyToken, treinoController.updateTreino);
router.delete('/:id', verifyToken, treinoController.deleteTreino);

module.exports = router;
