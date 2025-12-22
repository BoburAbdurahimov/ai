// Health check endpoint
// Verifies that all services are configured and accessible

const { supabase } = require('../lib/supabase');

module.exports = async (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {}
  };

  try {
    // Check Supabase connection
    const { error: dbError } = await supabase.from('calls').select('count').limit(1);
    health.services.supabase = dbError ? 'unhealthy' : 'healthy';

    // Check Yandex credentials
    health.services.yandex = (
      process.env.YANDEX_API_KEY && process.env.YANDEX_FOLDER_ID
    ) ? 'configured' : 'not_configured';

    // Check LLM provider
    if (process.env.OPENAI_API_KEY) {
      health.services.llm = 'openai_configured';
    } else if (process.env.ANTHROPIC_API_KEY) {
      health.services.llm = 'anthropic_configured';
    } else if (process.env.YANDEX_GPT_API_KEY) {
      health.services.llm = 'yandex_gpt_configured';
    } else {
      health.services.llm = 'not_configured';
    }

    // Check n8n webhooks
    health.services.n8n = {
      sheets: process.env.N8N_SHEETS_WEBHOOK ? 'configured' : 'not_configured',
      telegram: process.env.N8N_TELEGRAM_WEBHOOK ? 'configured' : 'not_configured',
      daily_summary: process.env.N8N_DAILY_SUMMARY_WEBHOOK ? 'configured' : 'not_configured'
    };

    // Check operator phone
    health.services.operator_phone = process.env.OPERATOR_PHONE_NUMBER ? 'configured' : 'not_configured';

    // Overall status
    const isHealthy = health.services.supabase === 'healthy' &&
                      health.services.yandex !== 'not_configured' &&
                      health.services.llm !== 'not_configured';

    health.status = isHealthy ? 'healthy' : 'degraded';

    const statusCode = isHealthy ? 200 : 503;
    res.status(statusCode).json(health);

  } catch (error) {
    console.error('[HEALTH CHECK ERROR]', error);
    res.status(500).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
};
