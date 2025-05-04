const suggestionsService = require("../services/suggestionsService");

exports.suggestions = async (req, res, next) => {
  try {
    const messages = req.body;
    console.log("[Controller] /suggestions - Messages reçus :", messages);

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Messages invalides ou vides." });
    }

    const suggestions = await suggestionsService.generateSuggestions(messages);
    return res.status(200).json({ suggestions });
  } catch (error) {
    console.error("[ERROR] /suggestions :", error);
    next(error);
  }
};
