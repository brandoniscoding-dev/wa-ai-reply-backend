const enhanceService = require('../services/enhanceService');

// Correct spelling and grammar mistakes
exports.correctMessage = async (req, res, next) => {
  try {
    const { text } = req.body;
    console.log("[API] /correct - Texte reçu :", text);

    const correctedText = await enhanceService.correctText(text);
    console.log("[API] /correct - Texte corrigé :", correctedText);

    res.json({ result: correctedText });
  } catch (error) {
    console.error("[ERROR] /correct :", error);
    next(error);
  }
};

// Change the tone of the message
exports.changeTone = async (req, res, next) => {
  try {
    const { text, tone } = req.body;
    console.log("[API] /tone - Texte reçu :", text);
    console.log("[API] /tone - Ton demandé :", tone);

    const tonedText = await enhanceService.changeTone(text, tone);
    console.log("[API] /tone - Texte transformé :", tonedText);

    res.json({ result: tonedText });
  } catch (error) {
    console.error("[ERROR] /tone :", error);
    next(error);
  }
};

// Adjust the size of the message (expand or shorten)
exports.adjustSize = async (req, res, next) => {
  try {
    const { text, size } = req.body;
    console.log("[API] /size - Texte reçu :", text);
    console.log("[API] /size - Taille demandée :", size);

    const resizedText = await enhanceService.adjustSize(text, size);
    console.log("[API] /size - Texte ajusté :", resizedText);

    res.json({ result: resizedText });
  } catch (error) {
    console.error("[ERROR] /size :", error);
    next(error);
  }
};

// Translate the message into another language
exports.translateMessage = async (req, res, next) => {
  try {
    const { text, targetLanguage } = req.body;
    console.log("[API] /translation - Texte reçu :", text);
    console.log("[API] /translation - Langue cible :", targetLanguage);

    const translatedText = await enhanceService.translateText(text, targetLanguage);
    console.log("[API] /translation - Texte traduit :", translatedText);

    res.json({ result: translatedText });
  } catch (error) {
    console.error("[ERROR] /translation :", error);
    next(error);
  }
};

