const express = require('express');
const router = express.Router();
const enhanceController = require('../controllers/enhanceController');
const { validateCorrect, validateTone, validateSize, validateTranslation } = require('../middlewares/validateRequest');

// Correct spelling and grammar
router.post('/correct', validateCorrect, enhanceController.correctMessage);

// Change message tone
router.post('/tone', validateTone, enhanceController.changeTone);

// Adjust message length (expand or shorten)
router.post('/size', validateSize, enhanceController.adjustSize);

// Translate message into another language
router.post('/translation', validateTranslation, enhanceController.translateMessage);

module.exports = router;
