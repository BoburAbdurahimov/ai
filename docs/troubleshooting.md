# Troubleshooting Guide

Common issues and solutions for the AI Call Center MVP.

---

## Quick Diagnostics

### Step 1: Check Health Endpoint

```bash
curl https://your-app.vercel.app/api/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "services": {
    "supabase": "healthy",
    "yandex": "configured",
    "llm": "openai_configured",
    "n8n": {
      "sheets": "configured",
      "telegram": "configured"
    }
  }
}
```

If `status: "degraded"`, check which service is misconfigured.

### Step 2: Check Vercel Logs

```bash
vercel logs --follow
```

Look for error messages in real-time.

### Step 3: Check Supabase Logs

1. Open Supabase Dashboard
2. Go to Logs → Database
3. Filter by timestamp of issue

---

## Common Issues

### 1. Calls Not Connecting

**Symptom:** Phone rings but no DTMF menu plays

**Possible Causes:**

#### A. Webhook URL incorrect
```bash
# Verify in call provider settings
Expected: https://your-app.vercel.app/api/webhooks/call-start
Common mistake: http:// instead of https://
```

**Fix:** Update webhook URL in call provider dashboard

#### B. Webhook not receiving data
```bash
# Test manually
curl -X POST https://your-app.vercel.app/api/webhooks/call-start \
  -H "Content-Type: application/json" \
  -d '{"callId":"test_001","callerNumber":"+998901234567"}'
```

**Expected:** DTMF menu JSON response

**Fix:** Check Vercel logs for errors

#### C. Call provider configuration
- Verify phone number is active
- Check call forwarding settings
- Ensure webhooks are enabled

---

### 2. DTMF Menu Not Working

**Symptom:** User presses 1 or 2, nothing happens

**Possible Causes:**

#### A. DTMF input not being sent to webhook
```bash
# Check call provider logs
# Look for: "dtmf.collected" or similar event
```

**Fix:** Configure call provider to send DTMF events to `/api/webhooks/call-input`

#### B. Input type mismatch
```javascript
// Check what format provider sends
// Expected: { inputType: "dtmf", input: "1" }
// Some send: { digits: "1" }
```

**Fix:** Adjust code in `call-input.js` to match provider format

---

### 3. Russian AI Not Responding

**Symptom:** Press 1, but AI doesn't speak

**Possible Causes:**

#### A. Yandex API credentials invalid
```bash
# Test Yandex connection
curl -H "Authorization: Api-Key YOUR_KEY" \
  "https://stt.api.cloud.yandex.net/speech/v1/stt:recognize?folderId=YOUR_FOLDER"
```

**Fix:** Verify `YANDEX_API_KEY` and `YANDEX_FOLDER_ID` in Vercel env vars

#### B. LLM API key invalid
```bash
# Check which provider is configured
# OpenAI test:
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

**Fix:** Verify LLM API key in Vercel env vars

#### C. Audio format mismatch
- Provider sends audio in format Yandex doesn't accept
- Check logs for STT errors

**Fix:** Convert audio format or configure provider to send compatible format

---

### 4. Uzbek Transfer Not Working

**Symptom:** Press 2, call doesn't transfer

**Possible Causes:**

#### A. Operator phone number incorrect
```bash
# Check env var
OPERATOR_PHONE_NUMBER=+998901234567
# Must include country code (+998 for Uzbekistan)
```

**Fix:** Update `OPERATOR_PHONE_NUMBER` in Vercel

#### B. Call provider doesn't support transfers
- Some providers require special configuration
- Check provider documentation for "call transfer" or "call forwarding"

**Fix:** Enable call transfer in provider settings

#### C. Transfer payload format
```javascript
// Check what format provider expects
// Our format:
{
  action: "transfer",
  transfer: { to: "+998901234567", type: "blind" }
}
```

**Fix:** Adjust transfer format in `call-input.js` to match provider

---

### 5. Supabase Not Logging

**Symptom:** Calls work but no data in Supabase

**Possible Causes:**

#### A. Database connection failed
```bash
# Check Supabase credentials
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJxxx...
```

**Fix:** Verify credentials in Vercel env vars

#### B. Schema not created
```sql
-- Run in Supabase SQL Editor
SELECT * FROM calls LIMIT 1;
-- Should not error
```

**Fix:** Run `supabase/schema.sql` in SQL Editor

#### C. RLS blocking writes
```sql
-- Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

**Fix:** Temporarily disable RLS for testing:
```sql
ALTER TABLE calls DISABLE ROW LEVEL SECURITY;
```

---

### 6. Google Sheets Not Updating

**Symptom:** Calls complete but Sheets not updating

**Possible Causes:**

#### A. n8n webhook not configured
```bash
# Check env var
echo $N8N_SHEETS_WEBHOOK
# Should be: https://your-n8n.com/webhook/sheets-update
```

**Fix:** Set `N8N_SHEETS_WEBHOOK` in Vercel

#### B. n8n workflow not activated
- Check n8n dashboard
- Workflow must be **Active** (toggle on)

**Fix:** Activate workflow in n8n

#### C. Google Sheets permissions
- n8n service account must have **Editor** access
- Sheet ID must be correct

**Fix:** Share sheet with n8n service account email

#### D. Test n8n webhook manually
```bash
curl -X POST $N8N_SHEETS_WEBHOOK \
  -H "Content-Type: application/json" \
  -d '{
    "event": "sheets_update",
    "call_id": "test_001",
    "language": "RU",
    "handled_by": "AI",
    "outcome": "info",
    "call_duration_seconds": 60,
    "timestamp": "2024-12-22T10:00:00Z"
  }'
```

**Expected:** New row in Google Sheets

---

### 7. Telegram Alerts Not Sending

**Symptom:** Calls complete but no Telegram messages

**Possible Causes:**

#### A. Bot token invalid
```bash
# Test bot
curl https://api.telegram.org/bot$BOT_TOKEN/getMe
```

**Fix:** Get new token from @BotFather

#### B. Chat ID incorrect
```bash
# Get chat ID
curl https://api.telegram.org/bot$BOT_TOKEN/getUpdates
# Look for "chat":{"id":123456789}
```

**Fix:** Update chat ID in n8n Telegram node

#### C. Bot blocked by user
- User must start conversation with bot first
- Send `/start` to bot in Telegram

**Fix:** Unblock bot, send `/start`

---

### 8. Daily Summary Not Running

**Symptom:** No daily summary message at 22:00 UTC

**Possible Causes:**

#### A. Vercel Cron not configured
```json
// Check vercel.json
{
  "crons": [{
    "path": "/api/cron/daily-summary",
    "schedule": "0 22 * * *"
  }]
}
```

**Fix:** Add cron config and redeploy

#### B. Cron secret mismatch
```bash
# Environment must have
CRON_SECRET=your-secret-here
```

**Fix:** Set `CRON_SECRET` in Vercel

#### C. Test manually
```bash
curl "https://your-app.vercel.app/api/cron/daily-summary?secret=YOUR_CRON_SECRET"
```

**Expected:** Daily summary sent to Telegram

---

### 9. Safety Filter Too Aggressive

**Symptom:** AI refuses to answer normal questions

**Possible Causes:**

#### A. Safety patterns too broad
```javascript
// In lib/llm.js
const forbiddenPatterns = [
  /\d+\s*(рубл|доллар)/i  // Might catch: "я звонил 2 раза"
];
```

**Fix:** Refine regex patterns to be more specific

#### B. False positives in safety filter
- Review logs for safety filter triggers
- Adjust patterns as needed

**Fix:** Update `applySafetyFilter()` in `lib/llm.js`

---

### 10. High Latency (Slow Response)

**Symptom:** AI takes >10 seconds to respond

**Possible Causes:**

#### A. Cold start
- Vercel functions have ~200-500ms cold start
- First call after idle period is slower

**Fix:** This is normal, subsequent calls will be faster

#### B. LLM timeout
```javascript
// In lib/llm.js
timeout: 10000  // 10 seconds
```

**Fix:** Increase timeout or optimize prompt

#### C. Network latency
- Check user location vs Yandex/LLM server location
- Test with `curl -w "@curl-format.txt" URL`

**Fix:** Choose closer region or use CDN

---

## Debugging Workflow

### For Any Issue:

1. **Check health endpoint** (`/api/health`)
2. **Check Vercel logs** (`vercel logs --follow`)
3. **Check Supabase logs** (Dashboard → Logs)
4. **Test individual components**:
   - Yandex STT/TTS
   - LLM API
   - n8n webhooks
   - Database writes
5. **Review call provider logs**
6. **Test with manual curl requests**

### Logs to Collect:

```bash
# Vercel logs
vercel logs > vercel_logs.txt

# Supabase query
SELECT * FROM call_events 
WHERE call_id = 'problem_call_id' 
ORDER BY timestamp;

# n8n executions
# Screenshot from n8n dashboard

# Call provider logs
# Export from provider dashboard
```

---

## Performance Issues

### Issue: High Costs

**Diagnosis:**
```sql
-- Check call volume and duration
SELECT 
  DATE(timestamp) as date,
  COUNT(*) as calls,
  AVG(call_duration_seconds) as avg_duration,
  COUNT(*) FILTER (WHERE handled_by = 'AI') as ai_calls
FROM calls
WHERE timestamp > NOW() - INTERVAL '30 days'
GROUP BY DATE(timestamp);
```

**Optimizations:**
1. Reduce LLM max_tokens (150 → 100)
2. Use cheaper LLM (GPT-4 → GPT-4o-mini)
3. Cache common responses
4. Optimize prompts to be shorter

### Issue: Database Growing Too Fast

**Diagnosis:**
```sql
SELECT pg_size_pretty(pg_total_relation_size('calls'));
SELECT pg_size_pretty(pg_total_relation_size('call_events'));
```

**Fix:**
```sql
-- Archive old calls (older than 90 days)
DELETE FROM calls WHERE timestamp < NOW() - INTERVAL '90 days';

-- Or export and delete
COPY (SELECT * FROM calls WHERE timestamp < NOW() - INTERVAL '90 days') 
TO '/path/archive.csv' CSV HEADER;
```

---

## Emergency Procedures

### Total System Outage

1. **Immediate:** Check Vercel status (status.vercel.com)
2. **Immediate:** Check Supabase status (status.supabase.com)
3. **Notify:** Send Telegram message to team
4. **Fallback:** Forward calls directly to operator
5. **Recovery:** Follow disaster recovery plan

### Data Loss

1. **Immediate:** Stop all writes
2. **Assess:** What data was lost?
3. **Restore:** From Supabase backup (last 7 days)
4. **Verify:** Check data integrity
5. **Resume:** Restart system

---

## Getting Help

### Internal Debugging:

1. Check all documentation in `/docs`
2. Review code comments
3. Test with `/api/health`
4. Check environment variables

### External Resources:

- **Vercel:** https://vercel.com/docs
- **Supabase:** https://supabase.com/docs
- **Yandex SpeechKit:** https://cloud.yandex.com/en/docs/speechkit
- **n8n:** https://docs.n8n.io

### Support Channels:

- Vercel: support@vercel.com
- Supabase: support@supabase.io
- Your call provider's support

---

**Last Updated:** 2024-12-22
