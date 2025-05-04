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

exports.generateSuggestions = async (messages) => {
  try {
    console.log("[Service] /suggestions - Génération à partir de messages :", messages);

    const conversation = messages
      .map((msg) => `${msg.name}: ${msg.message}`)
      .join("\n");

    const prompt = `
You are a highly specialized assistant designed to help users respond quickly and naturally to chat messages in messaging apps like WhatsApp, Messenger, or SMS.

Your role is to imagine you are "ME", the person who is about to reply. Based on the last few messages in a chat with another person ("THEM"), you will suggest 3 appropriate responses that I (the user) could send next.

IMPORTANT BEHAVIOR RULES:
- NEVER introduce yourself, explain your reasoning, or mention you are an assistant or AI.
- NEVER output explanations, summaries, comments, or meta information.
- NEVER respond to questions that require factual answers, external information, or deep reasoning.
- Your only goal is to help ME keep the conversation going naturally.

INSTRUCTIONS:
- Read the latest part of the conversation.
- Use the same language as the conversation (French, English, etc.).
- Assume the tone and relationship based on the context (friendly, professional, flirty, casual, etc.).
- Suggest 3 different responses ME could send next:
  - 1st: very short and direct (1 line max).
  - 2nd: slightly more detailed or nuanced.
  - 3rd: longer, more expressive or humorous (up to 3 short sentences).
- All responses must sound 100% human, casual, and emotionally natural.
- If the last message is a question, respond naturally as ME would — never with a robotic tone.
- Avoid over-formality or generic phrases.
- Prioritize realism, speed, and emotional relevance.

OUTPUT FORMAT:
Return a valid JSON object in this format:
{
  "suggestions": [
    "First response here.",
    "Second response, a bit longer.",
    "Third response, more expressive or detailed."
  ]
}

Do not include anything else besides the JSON.

Now process the following conversation and provide your response suggestions.

Conversation:
${conversation}
`.trim();

    console.log("[Service] /suggestions - Prompt généré :", prompt);

    const rawResult = await externalApi.callIA(prompt);
    console.log("[Service] /suggestions - Résultat brut :", rawResult);

    const parsed = extractJsonFromText(rawResult);
    console.log("[Service] /suggestions - Suggestions extraites :", parsed.suggestions);

    return parsed.suggestions;
  } catch (error) {
    console.error("[ERROR] /suggestions - Erreur lors du traitement :", error);
    throw error;
  }
};
