const externalApi = require('../utils/externalApi');

exports.correctText = async (text) => {
  try {
    console.log("[Service] /correct - Texte reçu pour correction :", text);

    const prompt = `
You are a professional proofreader.

Instructions:
- Correct all grammar, punctuation, and spelling mistakes in the text.
- DO NOT change the language of the text under any circumstances.
- DO NOT modify the writing style, tone, or structure unless required for grammatical accuracy.
- Preserve the original language of the input text exactly.
- Return ONLY the corrected text without explanations or additional comments.

Text to correct:
"""${text}"""
  `;
    console.log("[Service] /correct - Prompt généré :", prompt);

    const result = await externalApi.callIA(prompt.trim());
    console.log("[Service] /correct - Résultat reçu de l'API :", result);

    return result;
  } catch (error) {
    console.error("[ERROR] /correct - Erreur lors du traitement :", error);
    throw error;
  }
};

exports.changeTone = async (text, tone) => {
  try {
    console.log("[Service] /tone - Texte reçu pour ajustement du ton :", text);
    console.log("[Service] /tone - Ton demandé :", tone);

    const prompt = `
You are a skilled copywriter specialized in adjusting the tone of texts.

Instructions:
- Rewrite the text using a "${tone}" tone (examples: formal, friendly, professional, casual, persuasive, etc.).
- Maintain the original language of the text as it is, without translating it.
- Preserve the meaning, context, and intent of the original message.
- Return ONLY the rewritten text with the new tone, without any explanations or extra comments.

Text to adapt:
"""${text}"""
  `;
    console.log("[Service] /tone - Prompt généré :", prompt);

    const result = await externalApi.callIA(prompt.trim());
    console.log("[Service] /tone - Résultat reçu de l'API :", result);

    return result;
  } catch (error) {
    console.error("[ERROR] /tone - Erreur lors du traitement :", error);
    throw error;
  }
};

exports.adjustSize = async (text, size) => {
  try {
    const action = size === 'shorten' ? 'shorten' : 'expand';
    console.log("[Service] /size - Texte reçu pour ajustement de la taille :", text);
    console.log("[Service] /size - Action demandée :", action);

    const prompt = `
You are a professional editor specialized in adjusting the length of texts.

Instructions:
- If asked to "shorten", make the text more concise by removing redundancies and unnecessary words.
- If asked to "expand", add relevant details and examples to enrich the text.
- Maintain the original meaning, logic, and language of the text. DO NOT translate the text into another language.
- Ensure the result sounds natural and coherent.
- Return ONLY the modified version, without any commentary or explanation.

Action: "${action.toUpperCase()}"
Text to process:
"""${text}"""
  `;
    console.log("[Service] /size - Prompt généré :", prompt);

    const result = await externalApi.callIA(prompt.trim());
    console.log("[Service] /size - Résultat reçu de l'API :", result);

    return result;
  } catch (error) {
    console.error("[ERROR] /size - Erreur lors du traitement :", error);
    throw error;
  }
};

exports.translateText = async (text, targetLanguage) => {
  try {
    console.log("[Service] /translation - Texte reçu pour traduction :", text);
    console.log("[Service] /translation - Langue cible :", targetLanguage);

    const prompt = `
You are a professional translator.

Instructions:
- Translate the following text into "${targetLanguage}".
- Maintain the original tone, style, and nuances as much as possible.
- Make sure the translation sounds natural and fluent for a native speaker.
- Return ONLY the translated version without any comments, explanations, or notes.

Text to translate:
"""${text}"""
  `;
    console.log("[Service] /translation - Prompt généré :", prompt);

    const result = await externalApi.callIA(prompt.trim());
    console.log("[Service] /translation - Résultat reçu de l'API :", result);

    return result;
  } catch (error) {
    console.error("[ERROR] /translation - Erreur lors du traitement :", error);
    throw error;
  }
};
