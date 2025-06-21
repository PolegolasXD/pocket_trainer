const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const verifyToken = require('../middlewares/verifyToken');

router.get('/feedback/:feedbackId', verifyToken, chatController.getMensagensPorFeedback);

module.exports = router;
