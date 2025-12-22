// Cron endpoint: Daily Summary
// Triggers daily statistics summary to be sent via n8n to Telegram
// Can be called by Vercel Cron or external scheduler

const { getDailyStats } = require('../../lib/supabase');
const { triggerDailySummary } = require('../../lib/n8n');

module.exports = async (req, res) => {
  // Verify cron secret for security
  const cronSecret = req.headers['x-cron-secret'] || req.query.secret;
  if (cronSecret !== process.env.CRON_SECRET && process.env.NODE_ENV === 'production') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Get date from query param or use yesterday
    const targetDate = req.query.date || getPreviousDate();
    
    console.log(`[DAILY SUMMARY] Generating summary for: ${targetDate}`);

    // Fetch daily stats from Supabase view
    const stats = await getDailyStats(targetDate);

    if (!stats || stats.total_calls === 0) {
      console.log(`[DAILY SUMMARY] No calls for ${targetDate}`);
      return res.status(200).json({
        success: true,
        message: 'No calls to report',
        date: targetDate,
        stats: stats
      });
    }

    // Trigger n8n webhook to send Telegram summary
    await triggerDailySummary(stats);

    console.log(`[DAILY SUMMARY] Summary sent for ${targetDate}:`, stats);

    res.status(200).json({
      success: true,
      message: 'Daily summary sent',
      date: targetDate,
      stats: stats
    });
  } catch (error) {
    console.error('[DAILY SUMMARY ERROR]', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
};

/**
 * Get previous date in YYYY-MM-DD format
 */
function getPreviousDate() {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return date.toISOString().split('T')[0];
}
