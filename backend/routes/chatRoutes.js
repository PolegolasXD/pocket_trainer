const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');
const chatController = require('../controllers/chatController');

router.post('/', verifyToken, chatController.gerarFeedbackIA);

module.exports = router;
