const { ConversationChain } = require("langchain/chains");
const { ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate } = require("langchain/prompts");
const { ConversationBufferMemory } = require("langchain/memory");
const { callIA } = require("../utils/externalApi");

// Classe personnalisée pour intégrer Gemini avec LangChain
class GeminiLLM {
  constructor(apiKey, apiUrl) {
    this.apiKey = apiKey;
    this.apiUrl = apiUrl;
  }

  async call(prompt) {
    const response = await callIA(prompt);
    return response;
  }
}

// Initialisation du modèle Gemini
const llm = new GeminiLLM(process.env.IA_API_KEY, process.env.IA_API_URL);

// Fonction utilitaire pour extraire du JSON valide
const extractJsonFromText = (text) => {
  try {
    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}") + 1;
    if (jsonStart === -1 || jsonEnd === 0) {
      throw new Error("No valid JSON found");
    }
    const jsonString = text.slice(jsonStart, jsonEnd);
    const parsed = JSON.parse(jsonString);
    if (!parsed.suggestions || !Array.isArray(parsed.suggestions)) {
      throw new Error("Invalid suggestions format");
    }
    return parsed;
  } catch (err) {
    console.error("[Service] Erreur d'extraction JSON :", err);
    return { suggestions: [] };
  }
};

/**
 * Génère des suggestions de réponses basées sur l'identité et une conversation.
 * @param {string} identity - L'identité de l'utilisateur (par défaut : "I am not AI")
 * @param {Array} messages - Liste d'objets { name, message }
 * @returns {Promise<Array>} suggestions - Liste de 3 messages
 */
exports.generateSuggestions = async (identity, messages = []) => {
  try {
    console.log("[Service] /suggestions - Génération avec :", {
      identityPreview: identity?.slice(0, 100) || "I am not AI",
      messageCount: messages.length
    });

    // Création du prompt
    const prompt = ChatPromptTemplate.fromMessages([
      SystemMessagePromptTemplate.fromTemplate(`
        Tu es "ME", l'utilisateur qui répond dans la conversation, en adoptant pleinement ma personnalité, mon ton et mon style de communication comme si j'écrivais moi-même. Ton objectif est de générer des réponses naturelles, humaines et connectées émotionnellement au contexte.

        Identité de l'utilisateur :
        """
        ${identity}
        """

        Règles :
        - Réponds uniquement en tant que "ME", sans mentionner que tu es une IA.
        - Ne commente pas, n'explique pas, ne résume pas la conversation.
        - Génère un JSON avec 3 suggestions variées :
          1. Courte : Une réponse directe et percutante.
          2. Nuancée : 1-2 phrases avec une profondeur émotionnelle.
          3. Expressive : Jusqu'à 3 phrases, créative ou humoristique si approprié.
        - Utilise le français et respecte le ton de la conversation (familier, amical, etc.).
        - Base-toi sur l'historique et l'identité pour des réponses spécifiques.
        - Si la dernière réponse est "Massa", réponds de manière naturelle et engageante.
      `),
      HumanMessagePromptTemplate.fromTemplate(`
        Historique de la conversation :
        {conversation}

        Génère un JSON avec 3 suggestions pour la prochaine réponse de "ME" :
        {
          "suggestions": [
            "Courte réponse.",
            "Réponse nuancée.",
            "Réponse expressive."
          ]
        }
      `)
    ]);

    // Initialisation de la mémoire
    const memory = new ConversationBufferMemory();
    const conversation = new ConversationChain({
      llm,
      prompt,
      memory
    });

    // Ajout des messages à la mémoire
    const conversationText = messages
      .map((msg) => `${msg.name}: ${msg.message}`)
      .join("\n");

    console.log("[Service] /suggestions - Prompt prêt. Envoi à l'IA...");

    // Appel à l'IA via LangChain
    const rawResult = await conversation.predict({ conversation: conversationText });
    console.log("[Service] /suggestions - Résultat brut reçu :", rawResult);

    // Extraction des suggestions
    const parsed = extractJsonFromText(rawResult);
    console.log("[Service] /suggestions - Suggestions extraites :", parsed.suggestions);

    return parsed.suggestions;
  } catch (error) {
    console.error("[ERROR] /suggestions - Erreur lors du traitement :", error);
    return [];
  }
};