const suggestionsService = require("../services/suggestionsService");

exports.suggestions = async (req, res, next) => {
  try {
    // Extraction de l'identité et des messages du corps de la requête
    const { identity, messages } = req.body;

    // Vérification que les messages sont présents et sous forme de tableau
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Messages invalides ou vides." });
    }

    // Vérification que l'identité est fournie
    if (!identity || typeof identity !== 'string' || identity.trim() === "") {
      return res.status(400).json({ error: "Identité manquante ou invalide." });
    }

    console.log("[Controller] /suggestions - Identity :", identity);
    console.log("[Controller] /suggestions - Messages reçus :", messages);

    // Appel du service pour générer les suggestions
    const suggestions = await suggestionsService.generateSuggestions(identity, messages);

    // Retour des suggestions sous forme de JSON
    return res.status(200).json({ suggestions });
  } catch (error) {
    console.error("[ERROR] /suggestions - Erreur :", error);
    next(error); // Passer l'erreur au middleware de gestion des erreurs
  }
};
