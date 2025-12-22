# Deployment Guide

Complete step-by-step guide to deploy the AI Call Center MVP to production.

---

## Prerequisites

Before deployment, ensure you have:

- [ ] Vercel account (free tier works)
- [ ] Supabase project created
- [ ] Yandex Cloud account with SpeechKit enabled
- [ ] LLM API key (OpenAI, Anthropic, or Yandex GPT)
- [ ] n8n instance (cloud or self-hosted)
- [ ] Telegram bot token
- [ ] Call provider account (e.g., Vapi)
- [ ] Operator phone number for Uzbek transfers

---

## Step 1: Setup Supabase

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Choose region closest to Uzbekistan (e.g., Singapore, Mumbai)
4. Wait for project to initialize

### 1.2 Run Database Schema

1. Open Supabase SQL Editor
2. Copy contents of `supabase/schema.sql`
3. Execute the SQL script
4. Verify tables created: `calls`, `call_events`, `daily_call_stats` view

### 1.3 Get Credentials

From Project Settings → API:
- Copy `Project URL` → Save as `SUPABASE_URL`
- Copy `anon public` key → Save as `SUPABASE_ANON_KEY`
- Copy `service_role` key → Save as `SUPABASE_SERVICE_KEY`

---

## Step 2: Setup Yandex SpeechKit

### 2.1 Create Yandex Cloud Account

1. Go to [cloud.yandex.com](https://cloud.yandex.com)
2. Create account (may require Russian/Uzbekistan phone number)
3. Create or select folder

### 2.2 Enable SpeechKit API

1. Go to Cloud Console
2. Navigate to SpeechKit service
3. Click "Enable API"
4. Wait for activation

### 2.3 Create API Key

1. Go to Service Accounts
2. Create new service account
3. Assign role: `ai.speechkit-tts.user` and `ai.speechkit-stt.user`
4. Create API key
5. Copy API key → Save as `YANDEX_API_KEY`
6. Copy Folder ID → Save as `YANDEX_FOLDER_ID`

---

## Step 3: Setup LLM Provider

Choose ONE of the following:

### Option A: OpenAI (Recommended for MVP)

1. Go to [platform.openai.com](https://platform.openai.com)
2. Create API key
3. Copy key → Save as `OPENAI_API_KEY`
4. Add payment method (GPT-4o-mini is cost-effective)

**Expected Cost:** ~$0.01-0.02 per call

### Option B: Anthropic Claude

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Create API key
3. Copy key → Save as `ANTHROPIC_API_KEY`

**Expected Cost:** ~$0.008-0.015 per call

### Option C: Yandex GPT (Local option)

1. Use same Yandex Cloud account
2. Enable YandexGPT API
3. Use same API key and folder ID
4. Set `YANDEX_GPT_API_KEY` (or reuse `YANDEX_API_KEY`)

**Expected Cost:** ~500 RUB per 1M tokens

---

## Step 4: Setup n8n

### 4.1 Choose Deployment Method

**Option A: n8n Cloud (Recommended)**
- Go to [n8n.io](https://n8n.io)
- Sign up for Starter plan ($20/month)
- No server management needed

**Option B: Self-hosted**
- Deploy to DigitalOcean, AWS, or VPS
- Install via Docker: `docker run -d -p 5678:5678 n8nio/n8n`
- Setup SSL certificate (Let's Encrypt)

### 4.2 Create Workflows

Follow instructions in `docs/n8n-workflows.md` to create:
1. Google Sheets Sync workflow
2. Telegram Alerts workflow
3. Daily Summary workflow

### 4.3 Get Webhook URLs

Copy webhook URLs from each workflow:
- Save Sheets webhook → `N8N_SHEETS_WEBHOOK`
- Save Telegram webhook → `N8N_TELEGRAM_WEBHOOK`
- Save Daily Summary webhook → `N8N_DAILY_SUMMARY_WEBHOOK`

---

## Step 5: Setup Telegram Bot

### 5.1 Create Bot

1. Open Telegram, search for [@BotFather](https://t.me/botfather)
2. Send `/newbot`
3. Choose bot name and username
4. Copy bot token

### 5.2 Get Chat ID

1. Send any message to your bot
2. Open: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
3. Find `"chat":{"id":123456789}`
4. Copy chat ID

### 5.3 Configure in n8n

In n8n Telegram nodes:
- Bot Token: Your bot token
- Chat ID: Your chat ID

---

## Step 6: Setup Call Provider (Vapi Example)

### 6.1 Create Vapi Account

1. Go to [vapi.ai](https://vapi.ai)
2. Create account
3. Add payment method

### 6.2 Create Phone Number

1. Go to Phone Numbers
2. Purchase Uzbekistan number (if available) or international number
3. Copy Phone Number ID → Save as `VAPI_PHONE_NUMBER_ID`

### 6.3 Configure Webhooks

In Vapi Dashboard → Webhooks:

**Call Start:**
- URL: `https://your-app.vercel.app/api/webhooks/call-start`
- Event: `call.started`

**Call Input:**
- URL: `https://your-app.vercel.app/api/webhooks/call-input`
- Event: `call.message` or `call.dtmf`

**Call End:**
- URL: `https://your-app.vercel.app/api/webhooks/call-end`
- Event: `call.ended`

### 6.4 Get API Key

- Copy Vapi API key → Save as `VAPI_API_KEY`

---

## Step 7: Deploy to Vercel

### 7.1 Install Vercel CLI

```bash
npm install -g vercel
```

### 7.2 Login to Vercel

```bash
vercel login
```

### 7.3 Configure Environment Variables

Create `.env` file (use `.env.example` as template):

```bash
# Supabase
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_KEY=eyJxxx...

# Yandex
YANDEX_API_KEY=AQxxx...
YANDEX_FOLDER_ID=b1gxxx...

# LLM (choose one)
OPENAI_API_KEY=sk-xxx...

# Call Provider
VAPI_API_KEY=xxx...
VAPI_PHONE_NUMBER_ID=xxx...

# Operator
OPERATOR_PHONE_NUMBER=+998901234567

# n8n
N8N_SHEETS_WEBHOOK=https://your-n8n.com/webhook/sheets-update
N8N_TELEGRAM_WEBHOOK=https://your-n8n.com/webhook/telegram-alert
N8N_DAILY_SUMMARY_WEBHOOK=https://your-n8n.com/webhook/daily-summary

# Security
WEBHOOK_SECRET=generate-random-secret-here
CRON_SECRET=generate-another-secret-here

# Environment
NODE_ENV=production
```

### 7.4 Deploy

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### 7.5 Set Environment Variables in Vercel

```bash
# Set all env vars
vercel env add SUPABASE_URL
vercel env add SUPABASE_SERVICE_KEY
vercel env add YANDEX_API_KEY
vercel env add YANDEX_FOLDER_ID
vercel env add OPENAI_API_KEY
# ... etc for all variables
```

Or set via Vercel Dashboard:
1. Go to Project Settings → Environment Variables
2. Add each variable
3. Redeploy

---

## Step 8: Configure Vercel Cron

### 8.1 Enable Cron Jobs

Already configured in `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/daily-summary",
      "schedule": "0 22 * * *"
    }
  ]
}
```

This runs daily at 22:00 UTC (02:00 Tashkent time).

### 8.2 Adjust Schedule (Optional)

To change time (e.g., 18:00 UTC = 23:00 Tashkent):

```json
"schedule": "0 18 * * *"
```

Cron format: `minute hour day month day-of-week`

---

## Step 9: Update Call Provider Webhooks

After deployment, update webhooks in your call provider with production URLs:

```
Call Start: https://your-app.vercel.app/api/webhooks/call-start
Call Input: https://your-app.vercel.app/api/webhooks/call-input
Call End: https://your-app.vercel.app/api/webhooks/call-end
```

---

## Step 10: Test Production Deployment

### 10.1 Health Check

```bash
curl https://your-app.vercel.app/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "services": {
    "supabase": "healthy",
    "yandex": "configured",
    "llm": "openai_configured",
    "n8n": {
      "sheets": "configured",
      "telegram": "configured",
      "daily_summary": "configured"
    },
    "operator_phone": "configured"
  }
}
```

### 10.2 Test Call Flow

1. Call your Vapi phone number
2. Verify DTMF menu plays
3. Press 1 (Russian) → Test AI conversation
4. Check Supabase for call record
5. Check Google Sheets for row
6. Check Telegram for any alerts

### 10.3 Test Uzbek Transfer

1. Call your Vapi phone number
2. Press 2 (Uzbek)
3. Verify call transfers to operator phone
4. Check logs in Supabase

---

## Post-Deployment Checklist

- [ ] Health check returns "healthy"
- [ ] Test Russian call → AI responds
- [ ] Test Uzbek call → Transfers to operator
- [ ] Google Sheets updates automatically
- [ ] Telegram alerts working
- [ ] Daily summary scheduled (wait for next day)
- [ ] All calls logged in Supabase
- [ ] No errors in Vercel logs
- [ ] n8n workflows show successful executions

---

## Monitoring

### Vercel Logs

View real-time logs:
```bash
vercel logs --follow
```

Or in Vercel Dashboard → Logs

### Supabase Logs

Check database activity:
- Supabase Dashboard → Logs → Database

### n8n Executions

Check workflow history:
- n8n Dashboard → Executions

### Telegram Monitoring

Bot will send alerts for:
- New bookings
- Missed calls
- Human transfers
- Daily summary

---

## Estimated Costs (Monthly)

**Scenario: 500 calls/month, avg 3 min/call**

| Service | Cost |
|---------|------|
| Vercel (Hobby) | $0 (free tier) |
| Supabase (Free) | $0 (upgrade to Pro $25 if >500MB) |
| Yandex SpeechKit | ~$15 (STT+TTS) |
| OpenAI GPT-4o-mini | ~$5-10 |
| n8n Cloud (Starter) | $20 |
| Vapi | ~$50-100 (per-minute) |
| Telegram Bot | $0 (free) |
| **TOTAL** | **~$90-165/month** |

**Per-call cost:** ~$0.18-0.33

---

## Scaling Considerations

**For 5,000 calls/month:**
- Upgrade Supabase to Pro ($25/month)
- Upgrade n8n to Pro ($50/month)
- Consider dedicated Yandex Cloud resources
- Estimated total: ~$300-400/month

**For 50,000 calls/month:**
- Consider moving to AWS/GCP for better pricing
- Implement Redis for caching
- Use load balancer
- Estimated total: ~$2,000-3,000/month

---

## Troubleshooting

See `docs/troubleshooting.md` for common issues and solutions.

---

## Security Best Practices

1. **Rotate API Keys** quarterly
2. **Enable Supabase RLS** (Row Level Security) for production
3. **Add webhook signature verification** to all endpoints
4. **Monitor Vercel logs** for suspicious activity
5. **Rate limit** API endpoints if needed
6. **Use strong secrets** for WEBHOOK_SECRET and CRON_SECRET
7. **Restrict Supabase service key** to backend only (never expose)

---

## Next Steps

After successful deployment:

1. Monitor first 24 hours closely
2. Collect feedback from test calls
3. Adjust LLM prompts if needed
4. Fine-tune safety rules
5. Optimize for your specific use case
6. Consider adding more languages/features

---

**Deployment complete! Your AI Call Center MVP is live.** 🎉
