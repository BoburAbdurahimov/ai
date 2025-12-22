# Quick Start Guide

Get your AI Call Center MVP running in 30 minutes.

---

## Prerequisites Checklist

- [ ] Node.js 18+ installed
- [ ] Git installed
- [ ] Accounts created:
  - [ ] Vercel
  - [ ] Supabase
  - [ ] Yandex Cloud
  - [ ] OpenAI (or Anthropic)
  - [ ] n8n Cloud
  - [ ] Telegram
  - [ ] Call provider (Vapi/Twilio)

---

## Step 1: Clone & Install (2 min)

```bash
git clone https://github.com/your-repo/ai-call-center-mvp.git
cd ai-call-center-mvp
npm install
```

---

## Step 2: Setup Supabase (5 min)

1. Create project at [supabase.com](https://supabase.com)
2. Go to SQL Editor
3. Copy/paste `supabase/schema.sql`
4. Execute
5. Go to Settings → API, copy:
   - Project URL
   - anon key
   - service_role key

---

## Step 3: Setup Yandex (5 min)

1. Create account at [cloud.yandex.com](https://cloud.yandex.com)
2. Enable SpeechKit API
3. Create service account
4. Create API key
5. Copy API key and Folder ID

---

## Step 4: Get LLM API Key (2 min)

**Option A: OpenAI (Recommended)**
1. Go to [platform.openai.com](https://platform.openai.com)
2. Create API key
3. Add payment method

**Option B: Anthropic**
1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Create API key

---

## Step 5: Setup n8n (5 min)

1. Sign up at [n8n.io](https://n8n.io) (Starter plan)
2. Create 3 workflows (see `docs/n8n-workflows.md`):
   - Google Sheets Sync
   - Telegram Alerts
   - Daily Summary
3. Copy webhook URLs

---

## Step 6: Setup Telegram (3 min)

1. Message [@BotFather](https://t.me/botfather)
2. Send `/newbot`, follow prompts
3. Copy bot token
4. Send message to your bot
5. Visit: `https://api.telegram.org/bot<TOKEN>/getUpdates`
6. Copy chat ID

---

## Step 7: Configure Environment (3 min)

```bash
cp .env.example .env
nano .env
```

Fill in all values from steps 2-6.

---

## Step 8: Deploy to Vercel (3 min)

```bash
npm install -g vercel
vercel login
vercel --prod
```

Set environment variables:
```bash
vercel env add SUPABASE_URL
vercel env add SUPABASE_SERVICE_KEY
# ... add all env vars
```

Or set via Vercel Dashboard.

---

## Step 9: Setup Call Provider (5 min)

**Example: Vapi**

1. Create account at [vapi.ai](https://vapi.ai)
2. Purchase phone number
3. Configure webhooks:
   - Start: `https://your-app.vercel.app/api/webhooks/call-start`
   - Input: `https://your-app.vercel.app/api/webhooks/call-input`
   - End: `https://your-app.vercel.app/api/webhooks/call-end`
4. Copy API key and phone number ID

---

## Step 10: Test! (5 min)

### Health Check
```bash
curl https://your-app.vercel.app/api/health
```

### Make a Test Call
1. Call your phone number
2. Press 1 → Talk to AI in Russian
3. Press 2 → Transfer to operator

### Verify
- Check Supabase for call record
- Check Google Sheets for row
- Check Telegram for alerts

---

## Done! 🎉

Your AI Call Center MVP is live!

**Next Steps:**
- Monitor first 10 calls
- Adjust LLM prompts if needed
- Review `docs/deployment.md` for optimization
- Check `docs/troubleshooting.md` if issues

---

## Need Help?

- 📚 Full docs: `docs/deployment.md`
- 🐛 Troubleshooting: `docs/troubleshooting.md`
- 🏗️ Architecture: `docs/architecture.md`
- 💰 Costs: `docs/cost-analysis.md`
