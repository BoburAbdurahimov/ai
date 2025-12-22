// LLM integration for Russian conversation logic
const axios = require('axios');

// Safety rules enforcement
const SAFETY_RULES = {
  forbidden_topics: ['medical advice', 'diagnoses', 'treatment recommendations'],
  forbidden_actions: ['quote prices', 'make payment promises', 'guarantee results'],
  system_prompt: `You are a professional call center AI assistant for a business in Uzbekistan.

STRICT RULES:
1. NEVER provide medical advice, diagnoses, or treatment recommendations
2. NEVER quote specific prices or make payment commitments
3. NEVER guarantee specific outcomes or results
4. Always speak in Russian (ru-RU)
5. Be polite, professional, and helpful
6. If asked about prices, say "Для уточнения цен, пожалуйста, свяжитесь с нашим менеджером"
7. If asked medical questions, say "Для медицинских вопросов, пожалуйста, проконсультируйтесь с врачом"
8. Focus on: information, scheduling, general inquiries
9. Keep responses concise (under 100 words)
10. Always ask if the caller needs anything else before ending

Your goal: Help the caller with information and booking, while staying within safety boundaries.`
};

/**
 * Get LLM response with safety guardrails
 */
async function getChatResponse(conversationHistory, userMessage) {
  const provider = detectProvider();
  
  // Add user message to history
  const messages = [
    { role: 'system', content: SAFETY_RULES.system_prompt },
    ...conversationHistory,
    { role: 'user', content: userMessage }
  ];

  let response;

  try {
    switch (provider) {
      case 'openai':
        response = await getOpenAIResponse(messages);
        break;
      case 'anthropic':
        response = await getAnthropicResponse(messages);
        break;
      case 'yandex':
        response = await getYandexGPTResponse(messages);
        break;
      default:
        throw new Error('No LLM provider configured');
    }

    // Apply safety filter to response
    const safeResponse = applySafetyFilter(response);

    return {
      success: true,
      message: safeResponse,
      raw: response
    };
  } catch (error) {
    console.error('LLM error:', error.message);
    return {
      success: false,
      error: error.message,
      message: 'Извините, произошла ошибка. Пожалуйста, повторите ваш вопрос.'
    };
  }
}

/**
 * OpenAI integration
 */
async function getOpenAIResponse(messages) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OpenAI API key not configured');

  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-4o-mini', // Cost-effective for MVP
      messages: messages,
      max_tokens: 150,
      temperature: 0.7
    },
    {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    }
  );

  return response.data.choices[0].message.content;
}

/**
 * Anthropic Claude integration
 */
async function getAnthropicResponse(messages) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('Anthropic API key not configured');

  // Convert messages format for Claude
  const system = messages.find(m => m.role === 'system')?.content || '';
  const conversationMessages = messages.filter(m => m.role !== 'system');

  const response = await axios.post(
    'https://api.anthropic.com/v1/messages',
    {
      model: 'claude-3-haiku-20240307', // Cost-effective
      max_tokens: 150,
      system: system,
      messages: conversationMessages
    },
    {
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json'
      },
      timeout: 10000
    }
  );

  return response.data.content[0].text;
}

/**
 * Yandex GPT integration (local option for Russia/Uzbekistan)
 */
async function getYandexGPTResponse(messages) {
  const apiKey = process.env.YANDEX_GPT_API_KEY || process.env.YANDEX_API_KEY;
  const folderId = process.env.YANDEX_FOLDER_ID;
  
  if (!apiKey || !folderId) throw new Error('Yandex GPT credentials not configured');

  const response = await axios.post(
    'https://llm.api.cloud.yandex.net/foundationModels/v1/completion',
    {
      modelUri: `gpt://${folderId}/yandexgpt-lite/latest`,
      completionOptions: {
        temperature: 0.7,
        maxTokens: 150
      },
      messages: messages
    },
    {
      headers: {
        'Authorization': `Api-Key ${apiKey}`,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    }
  );

  return response.data.result.alternatives[0].message.text;
}

/**
 * Detect which LLM provider is configured
 */
function detectProvider() {
  if (process.env.OPENAI_API_KEY) return 'openai';
  if (process.env.ANTHROPIC_API_KEY) return 'anthropic';
  if (process.env.YANDEX_GPT_API_KEY || (process.env.YANDEX_API_KEY && process.env.YANDEX_FOLDER_ID)) return 'yandex';
  return null;
}

/**
 * Apply safety filter to LLM response
 */
function applySafetyFilter(response) {
  const lowerResponse = response.toLowerCase();

  // Check for forbidden content
  const forbiddenPatterns = [
    /\d+\s*(рубл|доллар|евро|сум)/i, // Price patterns
    /(стоимость|цена|оплата)\s*[\d]/i, // Price discussion with numbers
    /(диагноз|лечение|препарат|таблетк)/i, // Medical terms
  ];

  for (const pattern of forbiddenPatterns) {
    if (pattern.test(lowerResponse)) {
      console.warn('Safety filter triggered:', response);
      return 'Извините, я не могу предоставить эту информацию. Пожалуйста, свяжитесь с нашим менеджером для получения подробностей.';
    }
  }

  return response;
}

module.exports = {
  getChatResponse,
  SAFETY_RULES
};
