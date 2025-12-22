# AI Call Center MVP - Uzbekistan Market

**A serverless AI-powered call center backend for the Uzbekistan market with Russian AI and Uzbek human transfer.**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-repo/ai-call-center-mvp)

---

## 🎯 Overview

This MVP backend handles:
- ✅ **Russian calls** → AI conversation (Yandex SpeechKit + LLM)
- ✅ **Uzbek calls** → Immediate human operator transfer (NO AI)
- ✅ **DTMF language menu** (Press 1=Russian, Press 2=Uzbek)
- ✅ **Safety guardrails** (no hallucinated prices, no medical advice)
- ✅ **Complete logging** to Supabase (source of truth)
- ✅ **Google Sheets sync** for client visibility
- ✅ **Telegram alerts** for bookings, missed calls, transfers
- ✅ **Daily summaries** via Telegram

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         INCOMING CALL                            │
│                    (via Vapi or similar)                         │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                   VERCEL SERVERLESS API                          │
│                                                                   │
│  /api/webhooks/call-start   ──► DTMF Menu                       │
│  /api/webhooks/call-input   ──► Language Router                 │
│  /api/webhooks/call-end     ──► Finalize & Notify               │
│                                                                   │
└────────┬───────────────────────┬──────────────────────┬─────────┘
         │                       │                       │
         │ Press 1 (RU)          │ Press 2 (UZ)         │ Call End
         ▼                       ▼                       ▼
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│  RUSSIAN AI FLOW │    │  UZBEK TRANSFER  │    │  SUPABASE LOG    │
│                  │    │                  │    │                  │
│ 1. Yandex STT    │    │ Transfer to:     │    │ • calls table    │
│ 2. LLM Response  │    │ OPERATOR_PHONE   │    │ • call_events    │
│ 3. Safety Filter │    │ (NO AI)          │    │ • transcripts    │
│ 4. Yandex TTS    │    │                  │    │                  │
└──────────────────┘    └──────────────────┘    └────────┬─────────┘
                                                          │
                                                          ▼
                                                  ┌──────────────────┐
                                                  │   n8n WEBHOOKS   │
                                                  │                  │
                                                  │ 1. Google Sheets │
                                                  │ 2. Telegram      │
                                                  │ 3. Daily Summary │
                                                  └──────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Vercel account
- Supabase project
- Yandex Cloud account (SpeechKit)
- OpenAI/Anthropic/YandexGPT API key
- n8n instance
- Telegram bot
- Call provider (Vapi, Twilio, etc.)

### Installation

```bash
# Clone repository
git clone https://github.com/your-repo/ai-call-center-mvp.git
cd ai-call-center-mvp

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your credentials
nano .env

# Run locally
vercel dev

# Deploy to production
vercel --prod
```

### Database Setup

```bash
# Run schema in Supabase SQL Editor
cat supabase/schema.sql
# Copy and execute in Supabase
```

---

## 📁 Project Structure

```
ai-call-center-mvp/
├── api/                          # Vercel serverless functions
│   ├── webhooks/
│   │   ├── call-start.js        # Call initiation + DTMF menu
│   │   ├── call-input.js        # DTMF/speech input handler
│   │   └── call-end.js          # Call completion + notifications
│   ├── cron/
│   │   └── daily-summary.js     # Daily stats cron job
│   └── health.js                # Health check endpoint
├── lib/                          # Core utilities
│   ├── supabase.js              # Database operations
│   ├── yandex.js                # Yandex SpeechKit (STT/TTS)
│   ├── llm.js                   # LLM integration + safety
│   └── n8n.js                   # n8n webhook triggers
├── supabase/
│   └── schema.sql               # PostgreSQL schema
├── docs/                         # Documentation
│   ├── n8n-workflows.md         # n8n setup guide
│   └── deployment.md            # Deployment instructions
├── package.json
├── vercel.json                  # Vercel configuration
└── .env.example                 # Environment template
```

---

## 🔧 Configuration

### Required Environment Variables

```bash
# Supabase
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJxxx...

# Yandex SpeechKit
YANDEX_API_KEY=AQxxx...
YANDEX_FOLDER_ID=b1gxxx...

# LLM (choose one)
OPENAI_API_KEY=sk-xxx...
# OR
ANTHROPIC_API_KEY=sk-ant-xxx...
# OR
YANDEX_GPT_API_KEY=AQxxx...

# Call Provider
VAPI_API_KEY=xxx...
VAPI_PHONE_NUMBER_ID=xxx...

# Human Operator
OPERATOR_PHONE_NUMBER=+998901234567

# n8n Webhooks
N8N_SHEETS_WEBHOOK=https://your-n8n.com/webhook/sheets-update
N8N_TELEGRAM_WEBHOOK=https://your-n8n.com/webhook/telegram-alert
N8N_DAILY_SUMMARY_WEBHOOK=https://your-n8n.com/webhook/daily-summary

# Security
WEBHOOK_SECRET=your-random-secret
CRON_SECRET=your-cron-secret
```

See `.env.example` for complete list.

---

## 📊 API Endpoints

### Webhook Endpoints (called by call provider)

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/webhooks/call-start` | POST | Call initiation, DTMF menu |
| `/api/webhooks/call-input` | POST | Handle DTMF/speech input |
| `/api/webhooks/call-end` | POST | Call completion, logging |

### Utility Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/health` | GET | Health check |
| `/api/cron/daily-summary` | GET/POST | Daily stats trigger |

---

## 🗣️ Call Flow

### 1. Call Starts

```
User calls → /api/webhooks/call-start
            ↓
Creates call record in Supabase
            ↓
Returns DTMF menu:
"Здравствуйте! Для русского языка нажмите 1.
O'zbek tili uchun 2 ni bosing."
```

### 2. User Presses 1 (Russian)

```
DTMF "1" → /api/webhooks/call-input
           ↓
Update: language=RU, handled_by=AI
           ↓
Start AI conversation:
  User speaks → Yandex STT → LLM (safety filter) → Yandex TTS
           ↓
Log all interactions to Supabase
```

### 3. User Presses 2 (Uzbek)

```
DTMF "2" → /api/webhooks/call-input
           ↓
Update: language=UZ, handled_by=HUMAN
           ↓
Transfer to OPERATOR_PHONE_NUMBER
           ↓
NO AI PROCESSING
```

### 4. Call Ends

```
Call ends → /api/webhooks/call-end
            ↓
Update call_duration_seconds, outcome
            ↓
Trigger n8n webhooks:
  • Google Sheets update
  • Telegram alert (if booking/missed/transfer)
            ↓
Call complete!
```

---

## 🛡️ Safety Features

The LLM integration includes strict safety guardrails:

### ❌ Forbidden Actions

- Quoting specific prices or costs
- Providing medical advice or diagnoses
- Guaranteeing specific outcomes
- Discussing treatments or medications

### ✅ Allowed Actions

- Providing general information
- Scheduling appointments/bookings
- Answering non-medical questions
- Transferring to human if needed

### Safety Implementation

```javascript
// From lib/llm.js
const SAFETY_RULES = {
  forbidden_topics: ['medical advice', 'diagnoses'],
  forbidden_actions: ['quote prices', 'make payment promises']
};

// Response is automatically filtered for forbidden patterns
function applySafetyFilter(response) {
  // Detects price patterns, medical terms, etc.
  // Returns safe fallback if violation detected
}
```

---

## 📈 Monitoring & Analytics

### Real-time via Telegram

Instant alerts for:
- 🎉 New bookings
- ⚠️ Missed calls
- 👤 Human transfers

### Daily Summary (22:00 UTC)

```
📊 DAILY REPORT - 22.12.2024

📞 Total calls: 47
├─ 🇷🇺 Russian: 35
└─ 🇺🇿 Uzbek: 12

🤖 AI handled: 35 (74%)
👤 Human transfers: 12 (26%)

📈 Results:
├─ ✅ Bookings: 8
├─ ❌ Missed: 3
└─ ℹ️ Info: 36

⏱️ Avg duration: 2:25
```

### Google Sheets

Live dashboard with columns:
- Call ID
- Date/Time
- Language (RU/UZ)
- Handled By (AI/HUMAN)
- Outcome (info/booking/transfer/missed)
- Duration (seconds)
- Caller Number

---

## 💰 Cost Estimation

**For 500 calls/month (avg 3 min/call):**

| Service | Monthly Cost |
|---------|--------------|
| Vercel (Hobby) | $0 |
| Supabase (Free) | $0 |
| Yandex SpeechKit | ~$15 |
| OpenAI GPT-4o-mini | ~$5-10 |
| n8n Cloud (Starter) | $20 |
| Vapi (call provider) | ~$50-100 |
| Telegram Bot | $0 |
| **TOTAL** | **~$90-165/month** |

**Per-call cost:** ~$0.18-0.33

See `docs/deployment.md` for scaling estimates.

---

## 🧪 Testing

### Health Check

```bash
curl https://your-app.vercel.app/api/health
```

### Test Call Flow

1. Call your phone number
2. Press 1 for Russian → Talk with AI
3. Press 2 for Uzbek → Transfer to operator
4. Check Supabase for logs
5. Check Google Sheets for entry
6. Check Telegram for alerts

### Manual Webhook Test

```bash
# Test call start
curl -X POST https://your-app.vercel.app/api/webhooks/call-start \
  -H "Content-Type: application/json" \
  -d '{"callId":"test_001","callerNumber":"+998901234567"}'
```

---

## 📚 Documentation

- **[Deployment Guide](docs/deployment.md)** - Complete deployment instructions
- **[n8n Workflows](docs/n8n-workflows.md)** - n8n setup and configuration
- **[Architecture](docs/architecture.md)** - Detailed system design

---

## 🔒 Security

- ✅ Environment variables for sensitive data
- ✅ Webhook signature verification (add `WEBHOOK_SECRET`)
- ✅ Supabase RLS (enable for production)
- ✅ Rate limiting (add if needed)
- ✅ HTTPS only (enforced by Vercel)
- ✅ No client-side exposure of API keys

---

## 🐛 Troubleshooting

**Call not connecting:**
- Check Vercel logs: `vercel logs --follow`
- Verify webhook URLs in call provider
- Check health endpoint: `/api/health`

**AI not responding:**
- Verify Yandex API key and folder ID
- Check LLM API key is valid
- Review Supabase logs for errors

**No Google Sheets updates:**
- Test n8n webhook manually
- Check n8n execution logs
- Verify service account permissions

**No Telegram alerts:**
- Verify bot token and chat ID
- Test webhook in n8n
- Check bot is not blocked

---

## 🚧 Roadmap (Post-MVP)

- [ ] Multi-tenant support
- [ ] Admin dashboard
- [ ] Call recording storage
- [ ] Advanced analytics
- [ ] A/B testing for prompts
- [ ] More language support
- [ ] Sentiment analysis
- [ ] CRM integrations

---

## 📄 License

MIT License - See LICENSE file

---

## 🤝 Contributing

This is an MVP. Contributions welcome after initial launch.

---

## 📞 Support

For issues or questions:
1. Check documentation in `/docs`
2. Review Vercel logs
3. Check Supabase logs
4. Test with `/api/health`

---

## 🎉 Credits

Built with:
- [Vercel](https://vercel.com) - Serverless hosting
- [Supabase](https://supabase.com) - PostgreSQL database
- [Yandex SpeechKit](https://cloud.yandex.com/en/services/speechkit) - STT/TTS
- [OpenAI](https://openai.com) / [Anthropic](https://anthropic.com) - LLM
- [n8n](https://n8n.io) - Workflow automation
- [Telegram](https://telegram.org) - Notifications

---

**Ready to deploy?** Follow the [Deployment Guide](docs/deployment.md) to get started! 🚀
