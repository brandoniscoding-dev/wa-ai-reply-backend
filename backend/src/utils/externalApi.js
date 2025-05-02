const axios = require('axios');
const { logger } = require('./logger');
require('dotenv').config(); // Load environment variables

const IA_API_URL = process.env.IA_API_URL; // Gemini API URL
const IA_API_KEY = process.env.IA_API_KEY; // Gemini API Key


exports.callIA = async (prompt) => {
  try {
    // Validate the API URL and Key
    if (!IA_API_URL || !IA_API_KEY) {
      throw new Error('API URL or API Key is missing.');
    }

    const requestUrl = `${IA_API_URL}?key=${IA_API_KEY}`;

    const response = await axios.post(
      requestUrl,
      {
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }],
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    // Extract and validate the AI response
    const aiResponse = response.data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    
    if (!aiResponse) {
      throw new Error('Empty response from AI.');
    }

    return aiResponse;
  } catch (error) {
    // Log the error and rethrow with a custom message
    logger.error('AI service error:', error.message);

    if (error.response) {
      console.error('Gemini API response error:', error.response.data);
    } else {
      console.error('Unexpected error:', error);
    }

    throw new Error('There was an error communicating with the AI service.');
  }
};
