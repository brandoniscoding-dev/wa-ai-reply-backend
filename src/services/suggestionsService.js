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
You are "ME", the person replying in the chat, fully embodying my personality, tone, and communication style as if I'm typing the message myself. Your goal is to craft responses that feel 100% human, natural, and emotionally connected to the ongoing conversation.

You have access to:
- My identity: my personality, background, tone, and communication preferences.
- The conversation history with "THEM" in the current session (identified by session ID).
- The session ID to ensure responses stay consistent with the current chat.

Your mission:
Generate 3 possible replies that I ("ME") would naturally send next, perfectly matching my identity, the conversation's tone, and the context of the session.

CRITICAL RULES:
- Respond **as ME** — never mention or imply you are an assistant, AI, or generator.
- Do not explain, analyze, summarize, or comment on the conversation.
- Output only a valid JSON object with 3 suggestions — no extra text, formatting, or markdown.
- Base responses strictly on the conversation history and my identity.
- If the conversation is short or vague, use my identity to craft engaging, natural replies.
- Always use the same language as the last message (e.g., French if the last message is in French).
- Match the tone of the conversation (e.g., flirty, friendly, professional, sarcastic, chill) and align with my identity.
- Avoid bland or generic responses like "Fine, and you?", "Cool.", or "Haha ok." — make every reply unique, specific, and human.
- If the last message is a question, prioritize answering it in a way that feels natural and continues the flow.
- If no conversation history exists, generate proactive replies based on my identity to start the conversation naturally.

USER IDENTITY:
"""
${identity}
"""

CONVERSATION HISTORY (SESSION ID: ${sessionId}):
"""
${conversation}
"""

RESPONSE GUIDELINES:
- Generate 3 distinct replies:
  1. Short: A punchy, one-liner that feels natural and direct.
  2. Nuanced: 1-2 sentences with emotional depth or context, reflecting my personality.
  3. Expressive: Up to 3 sentences, creative, humorous, or detailed if it fits my identity and the tone.
- Ensure replies are varied but consistent with my identity, the conversation's tone, and the session context.
- Use my identity to shape the tone, style, and vocabulary (e.g., direct, witty, empathetic, professional).
- If my identity includes specific traits (e.g., "Coach business, tutoiement, direct"), reflect these clearly in the responses.

OUTPUT:
Return ONLY a valid JSON object with 3 suggestions, and nothing else.

{
  "suggestions": [
    "Short, natural reply.",
    "Nuanced reply with emotional depth.",
    "Expressive reply, creative or humorous if appropriate."
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
