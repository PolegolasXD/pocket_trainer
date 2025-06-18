const express = require('express');
const router = express.Router();
const mensagemController = require('../controllers/mensagemController');
const verifyToken = require('../middlewares/verifyToken');

router.get('/feedback/:feedbackId', verifyToken, mensagemController.getMensagensPorFeedback);

module.exports = router;
