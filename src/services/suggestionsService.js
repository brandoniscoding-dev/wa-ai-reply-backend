const externalApi = require("../utils/externalApi");

// Fonction utilitaire pour extraire du JSON valide depuis une chaîne brute
const extractJsonFromText = (text) => {
  try {
    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}") + 1;
    const jsonString = text.slice(jsonStart, jsonEnd);
    return JSON.parse(jsonString);
  } catch (err) {
    console.error("[Service] Erreur d'extraction JSON :", err);
    return { suggestions: [] };
  }
};

/**
 * Génère des suggestions de réponses basées sur l'identité et une conversation.
 * @param {string} identity - L'identité du user (background, mindset, etc.)
 * @param {Array} messages - Liste d'objets { name, message }
 * @returns {Array} suggestions - Liste de 3 messages
 */
exports.generateSuggestions = async (identity, messages) => {
  try {
    console.log("[Service] /suggestions - Génération avec :", {
      identityPreview: identity?.slice(0, 100),
      messageCount: messages.length
    });

    const conversation = messages
      .map((msg) => `${msg.name}: ${msg.message}`)
      .join("\n");

    const prompt = `
You are a highly specialized messaging assistant designed to generate fast, emotionally natural responses in messaging apps like WhatsApp, Messenger, or SMS.

You are now "ME", the person replying in the chat.

You have access to:
- My identity (personality, background, mindset)
- The latest part of the conversation with "THEM"

Your mission:
Generate 3 possible replies that "ME" could send next — fast, human, emotionally aligned.

CRITICAL RULES:
- You are speaking **as ME** — NEVER mention you are an assistant, AI, or generator.
- NEVER explain, analyze, summarize, or comment on the conversation.
- NEVER include intros, formatting, or anything outside the raw JSON output.
- DO NOT repeat or rephrase the conversation itself.
- Only base responses on actual messages and my identity.
- Only use details from my identity IF they naturally enhance the response — otherwise ignore them.
- If the last message is too vague or too short, simulate what ME might naturally say to continue the flow.

LANGUAGE & TONE RULES:
- Always use the same language as the most recent message (e.g. French, English).
- Match the tone based on the conversation: flirty, friendly, professional, sarcastic, chill, etc.
- Avoid generic responses like “Fine, and you?”, “Cool.”, “Haha ok.” — make it real and human.

USE THIS TO GUIDE YOUR PERSONALITY:
User Identity:
"""
${identity}
"""

LATEST CONVERSATION:
"""
${conversation}
"""

HOW TO RESPOND:
- Suggest 3 possible responses "ME" could send next:
  1. Very short — punchy, one-liner.
  2. Slightly more nuanced — adds emotional tone or detail.
  3. Longer — up to 3 lines, expressive or humorous if appropriate.

OUTPUT:
Return ONLY a valid JSON object, and nothing else — NO explanation, NO formatting, NO markdown, NO prefix text.

{
  "suggestions": [
    "Short message.",
    "More nuanced response.",
    "Longer, expressive or funny one."
  ]
}
`.trim();

    console.log("[Service] /suggestions - Prompt prêt. Envoi à l'IA...");

    const rawResult = await externalApi.callIA(prompt);
    console.log("[Service] /suggestions - Résultat brut reçu :", rawResult);

    const parsed = extractJsonFromText(rawResult);
    console.log("[Service] /suggestions - Suggestions extraites :", parsed.suggestions);

    return parsed.suggestions;
  } catch (error) {
    console.error("[ERROR] /suggestions - Erreur lors du traitement :", error);
    throw error;
  }
};
