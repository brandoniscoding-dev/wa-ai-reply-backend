const suggestionsService = require("../services/suggestionsService");

exports.suggestions = async (req, res, next) => {
  try {
    const { identity, messages } = req.body;

    // Validation des messages
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Messages invalides ou vides." });
    }

    // Vérification de l'identité
    if (!identity || typeof identity !== 'string' || identity.trim() === "") {
      return res.status(400).json({ error: "Identité manquante ou invalide." });
    }

    // Vérification que "me" est dans les messages
    if (!messages.some(msg => msg.name.toLowerCase() === "me")) {
      return res.status(400).json({ error: "L'auteur 'me' doit être présent dans la conversation." });
    }

    console.log("[Controller] /suggestions - Identity :", identity);
    console.log("[Controller] /suggestions - Messages reçus :", messages);

    // Appel du service avec LangChain
    const suggestions = await suggestionsService.generateSuggestions(identity, messages);

    return res.status(200).json({ suggestions });
  } catch (error) {
    console.error("[ERROR] /suggestions - Erreur :", error);
    next(error);
  }
};