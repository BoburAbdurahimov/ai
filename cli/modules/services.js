/**
 * Services Module - Check external services status
 */

const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');

/**
 * Check all external services status
 */
async function checkServicesStatus(verbose = false) {
  const services = {
    supabase: await checkSupabase(),
    yandex: await checkYandex(),
    llm: await checkLLM(),
    n8n: await checkN8N()
  };

  return services;
}

/**
 * Check Supabase connection
 */
async function checkSupabase() {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return {
        status: 'not-configured',
        message: 'Missing credentials'
      };
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { error } = await supabase.from('calls').select('id').limit(1);

    if (error) {
      return {
        status: 'error',
        message: error.message
      };
    }

    return {
      status: 'ok',
      message: 'Connected'
    };
  } catch (error) {
    return {
      status: 'error',
      message: error.message
    };
  }
}

/**
 * Check Yandex SpeechKit availability
 */
async function checkYandex() {
  try {
    const apiKey = process.env.YANDEX_API_KEY;
    const folderId = process.env.YANDEX_FOLDER_ID;

    if (!apiKey || !folderId) {
      return {
        status: 'not-configured',
        message: 'Missing credentials'
      };
    }

    // Simple connectivity check to Yandex Cloud
    const response = await axios.get('https://cloud.yandex.com', {
      timeout: 5000,
      validateStatus: () => true
    });

    return {
      status: response.status < 500 ? 'ok' : 'error',
      message: response.status < 500 ? 'Reachable' : 'Service unavailable'
    };
  } catch (error) {
    return {
      status: 'error',
      message: error.message
    };
  }
}

/**
 * Check LLM provider availability
 */
async function checkLLM() {
  try {
    const openaiKey = process.env.OPENAI_API_KEY;
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    const yandexKey = process.env.YANDEX_GPT_API_KEY;

    if (openaiKey) {
      // Check OpenAI
      try {
        const response = await axios.get('https://api.openai.com/v1/models', {
          headers: { 'Authorization': `Bearer ${openaiKey}` },
          timeout: 5000
        });

        return {
          status: 'ok',
          message: 'OpenAI connected',
          provider: 'OpenAI'
        };
      } catch (error) {
        return {
          status: 'error',
          message: `OpenAI: ${error.message}`,
          provider: 'OpenAI'
        };
      }
    } else if (anthropicKey) {
      return {
        status: 'configured',
        message: 'Anthropic configured',
        provider: 'Anthropic'
      };
    } else if (yandexKey) {
      return {
        status: 'configured',
        message: 'Yandex GPT configured',
        provider: 'Yandex'
      };
    }

    return {
      status: 'not-configured',
      message: 'No LLM provider configured'
    };
  } catch (error) {
    return {
      status: 'error',
      message: error.message
    };
  }
}

/**
 * Check n8n webhooks availability
 */
async function checkN8N() {
  try {
    const webhookUrl = process.env.N8N_WEBHOOK_BASE_URL;

    if (!webhookUrl) {
      return {
        status: 'not-configured',
        message: 'Missing webhook URL'
      };
    }

    // Try to reach n8n (might fail if webhook requires data)
    const response = await axios.get(webhookUrl, {
      timeout: 5000,
      validateStatus: () => true
    });

    // n8n webhooks typically return 404 or 400 when accessed without data
    // Status < 500 means the service is reachable
    return {
      status: response.status < 500 ? 'ok' : 'error',
      message: response.status < 500 ? 'Reachable' : 'Service unavailable'
    };
  } catch (error) {
    return {
      status: 'error',
      message: error.message
    };
  }
}

module.exports = {
  checkServicesStatus,
  checkSupabase,
  checkYandex,
  checkLLM,
  checkN8N
};
