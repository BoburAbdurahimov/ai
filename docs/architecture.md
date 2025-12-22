# System Architecture

Detailed technical architecture of the AI Call Center MVP.

---

## High-Level Architecture

```
                           ┌─────────────────────┐
                           │   INCOMING CALL     │
                           │  (Vapi / Twilio)    │
                           └──────────┬──────────┘
                                      │
                                      ▼
                      ┌───────────────────────────┐
                      │   VERCEL EDGE NETWORK     │
                      │   (Serverless Functions)  │
                      └──────────┬────────────────┘
                                 │
                    ┌────────────┼────────────┐
                    │            │            │
                    ▼            ▼            ▼
            ┌───────────┐ ┌──────────┐ ┌──────────┐
            │   START   │ │  INPUT   │ │   END    │
            │  webhook  │ │ webhook  │ │ webhook  │
            └─────┬─────┘ └────┬─────┘ └────┬─────┘
                  │            │            │
                  │      ┌─────┴─────┐      │
                  │      │           │      │
                  │      ▼           ▼      │
                  │  ┌────────┐ ┌────────┐ │
                  │  │ DTMF   │ │ SPEECH │ │
                  │  │ Router │ │ Engine │ │
                  │  └────┬───┘ └───┬────┘ │
                  │       │         │      │
                  │   ┌───┴────┬────┴───┐  │
                  │   │        │        │  │
                  │   ▼        ▼        ▼  │
                  │ ┌──────┐ ┌─────────┐  │
                  │ │  RU  │ │   UZ    │  │
                  │ │  AI  │ │ HUMAN   │  │
                  │ └──┬───┘ └────┬────┘  │
                  │    │          │       │
                  └────┼──────────┼───────┘
                       │          │
                       ▼          ▼
                  ┌─────────────────────┐
                  │   SUPABASE (PG)     │
                  │  • calls            │
                  │  • call_events      │
                  │  • transcripts      │
                  └──────────┬──────────┘
                             │
                             ▼
                  ┌─────────────────────┐
                  │    n8n WEBHOOKS     │
                  └──┬──────────┬───────┘
                     │          │
          ┌──────────┼──────────┼──────────┐
          │          │          │          │
          ▼          ▼          ▼          ▼
    ┌─────────┐ ┌────────┐ ┌────────┐ ┌────────┐
    │ Sheets  │ │Telegram│ │ Daily  │ │ Email  │
    │  Sync   │ │ Alerts │ │Summary │ │(future)│
    └─────────┘ └────────┘ └────────┘ └────────┘
```

---

## Component Details

### 1. Call Provider Layer

**Responsibility:** Handle telephony, audio streaming

**Options:**
- Vapi (recommended for MVP)
- Twilio
- Vonage
- Custom SIP trunk

**Integration:**
- Receives calls from phone network
- Manages audio streams
- Sends webhooks to our backend
- Handles DTMF collection
- Manages call transfers

---

### 2. Vercel Serverless Layer

**Responsibility:** Business logic, routing, AI orchestration

**Key Functions:**

#### `/api/webhooks/call-start.js`
```javascript
Input: { callId, callerNumber, timestamp }
Process:
  1. Create call record in Supabase
  2. Log "start" event
  3. Return DTMF menu configuration
Output: { action: "gather", message: {...}, options: [...] }
```

#### `/api/webhooks/call-input.js`
```javascript
Input: { callId, inputType, input, audioData }
Process:
  if (inputType === "dtmf"):
    if (input === "1"): Route to Russian AI
    if (input === "2"): Route to Uzbek transfer
  if (inputType === "speech"):
    1. Yandex STT (audio → text)
    2. LLM processing (text → response)
    3. Safety filter
    4. Yandex TTS (response → audio)
Output: { action: "continue|transfer", message: {...} }
```

#### `/api/webhooks/call-end.js`
```javascript
Input: { callId, duration, endReason }
Process:
  1. Update call record (duration, outcome, status)
  2. Log "end" event
  3. Trigger n8n webhooks
  4. Mark as notified
Output: { success: true, outcome: "..." }
```

---

### 3. Database Layer (Supabase)

**PostgreSQL Schema:**

#### `calls` table (main record)
```sql
- id (UUID, PK)
- call_id (VARCHAR, unique)
- language (RU | UZ)
- handled_by (AI | HUMAN)
- outcome (info | booking | transfer | missed)
- call_duration_seconds (INT)
- timestamp (TIMESTAMPTZ)
- caller_number (VARCHAR)
- status (active | completed | failed)
- conversation_transcript (JSONB)
- n8n_notified (BOOLEAN)
```

#### `call_events` table (audit log)
```sql
- id (UUID, PK)
- call_id (VARCHAR, FK)
- event_type (start | dtmf_input | ai_response | end)
- event_data (JSONB)
- timestamp (TIMESTAMPTZ)
```

#### `daily_call_stats` view (analytics)
```sql
SELECT
  DATE(timestamp) as call_date,
  COUNT(*) as total_calls,
  COUNT(*) FILTER (WHERE handled_by = 'AI') as ai_handled,
  COUNT(*) FILTER (WHERE outcome = 'booking') as bookings,
  ...
GROUP BY DATE(timestamp)
```

---

### 4. AI Processing Layer

#### Yandex SpeechKit (STT/TTS)

**STT Configuration:**
```javascript
{
  endpoint: "stt.api.cloud.yandex.net",
  lang: "ru-RU",
  format: "oggopus",
  sampleRate: 8000,
  model: "phone-quality"
}
```

**TTS Configuration:**
```javascript
{
  endpoint: "tts.api.cloud.yandex.net",
  lang: "ru-RU",
  voice: "alena",
  emotion: "neutral",
  speed: 1.0
}
```

#### LLM Processing

**System Prompt:**
```
You are a professional call center AI for Uzbekistan.

STRICT RULES:
1. NEVER provide medical advice
2. NEVER quote specific prices
3. NEVER guarantee outcomes
4. Speak Russian only
5. Be concise (under 100 words)
6. Focus on: info, scheduling, general inquiries
```

**Safety Filter:**
```javascript
Forbidden patterns:
- /\d+\s*(рубл|доллар|евро|сум)/i  // Price patterns
- /(диагноз|лечение|препарат)/i     // Medical terms

If detected → Return safe fallback response
```

**Provider Options:**
- OpenAI GPT-4o-mini ($0.15/1M input, $0.60/1M output)
- Anthropic Claude Haiku ($0.25/1M input, $1.25/1M output)
- Yandex GPT Lite (500 RUB/1M tokens)

---

### 5. Automation Layer (n8n)

**Workflow 1: Google Sheets Sync**
```
Webhook → Extract data → Append to Sheet
Executions: 1 per call
```

**Workflow 2: Telegram Alerts**
```
Webhook → Switch (alert_type) → Format → Send Message
Executions: ~0.3 per call (30% trigger rate)
```

**Workflow 3: Daily Summary**
```
Cron (22:00 UTC) → Query stats → Format → Send Message
Executions: 1 per day
```

---

## Data Flow Diagrams

### Russian AI Call Flow

```
1. User speaks
   ↓
2. Audio stream → Yandex STT
   ↓
3. Text → LLM (with safety rules)
   ↓
4. Response → Safety Filter
   ↓
5. Filtered text → Yandex TTS
   ↓
6. Audio stream → User
   ↓
7. Log to Supabase (conversation_transcript)
   ↓
8. Repeat until call ends
```

### Uzbek Transfer Flow

```
1. User presses "2"
   ↓
2. Update: language=UZ, handled_by=HUMAN
   ↓
3. Log event: "uzbek_transfer"
   ↓
4. Call provider: Transfer to OPERATOR_PHONE
   ↓
5. NO AI PROCESSING
   ↓
6. Wait for call end
   ↓
7. Log outcome: "transfer"
   ↓
8. Trigger Telegram alert
```

---

## Security Architecture

### API Security

**Webhook Validation:**
```javascript
const signature = req.headers['x-webhook-signature'];
const expectedSig = hmac(WEBHOOK_SECRET, req.body);
if (signature !== expectedSig) return 401;
```

**Environment Variables:**
- All secrets in Vercel environment
- No hardcoded credentials
- Service keys never exposed client-side

**Supabase RLS (Production):**
```sql
ALTER TABLE calls ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Backend only"
  ON calls
  USING (auth.jwt()->>'role' = 'service_role');
```

---

## Performance Considerations

### Latency Budget (per call segment)

| Operation | Target | Max |
|-----------|--------|-----|
| DTMF processing | <100ms | 200ms |
| STT (Yandex) | <500ms | 1s |
| LLM response | <2s | 4s |
| TTS (Yandex) | <500ms | 1s |
| DB write | <50ms | 100ms |
| **Total per turn** | <3s | 6s |

### Vercel Function Limits

- Memory: 1024 MB (configurable)
- Timeout: 30s (enough for real-time processing)
- Cold start: ~200-500ms (acceptable)
- Concurrent executions: Unlimited (Hobby: 12)

### Database Optimization

**Indexes:**
- `calls.call_id` (unique, fast lookup)
- `calls.timestamp` (DESC, for daily stats)
- `calls.language`, `calls.outcome` (filtering)
- `call_events.call_id` (join performance)

**Query Patterns:**
- Single call lookup: <10ms
- Daily aggregation: <50ms
- n8n batch queries: <100ms

---

## Scalability

### Current Capacity

**Vercel Hobby:**
- 100GB bandwidth/month
- 100 hours function execution/month
- Sufficient for ~500-1000 calls/month

**Supabase Free:**
- 500MB database
- 2GB bandwidth
- Sufficient for ~5000 call records

### Scaling Path

**Stage 1: 0-1000 calls/month**
- Current architecture (no changes)
- Cost: ~$90-165/month

**Stage 2: 1000-10,000 calls/month**
- Upgrade to Vercel Pro ($20/month)
- Upgrade to Supabase Pro ($25/month)
- Cost: ~$200-300/month

**Stage 3: 10,000+ calls/month**
- Consider dedicated infrastructure
- Implement caching (Redis)
- Move to AWS/GCP for better pricing
- Cost: Custom pricing

---

## Monitoring & Observability

### Metrics to Track

**Call Metrics:**
- Total calls per day
- Success rate (completed vs failed)
- Average duration
- Language distribution (RU vs UZ)
- Outcome distribution

**AI Metrics:**
- STT success rate
- LLM response time
- TTS generation time
- Safety filter triggers

**System Metrics:**
- Webhook success rate
- Database write latency
- n8n execution success rate
- API error rate

### Logging Strategy

**Vercel Logs:**
```javascript
console.log('[CALL START]', callId, callerNumber);
console.log('[STT]', transcribedText);
console.log('[LLM]', aiResponse);
console.error('[ERROR]', error.message, error.stack);
```

**Supabase Logs:**
- All events logged to `call_events` table
- Full conversation in `conversation_transcript` JSONB
- Query via SQL for debugging

---

## Disaster Recovery

### Backup Strategy

**Database:**
- Supabase: Automatic daily backups (retained 7 days)
- Export to CSV weekly (manual or automated)

**Code:**
- Git repository (GitHub/GitLab)
- Vercel auto-deploys from `main` branch

**Configuration:**
- Environment variables backed up in password manager
- `.env.example` documented in repo

### Failure Scenarios

**Scenario 1: Yandex API Down**
- Fallback: Return error message, suggest callback
- Manual: Switch to Google Cloud Speech/TTS

**Scenario 2: LLM API Down**
- Fallback: Use cached responses or simple rules
- Manual: Switch to backup LLM provider

**Scenario 3: Supabase Down**
- Immediate: Calls fail gracefully
- Manual: Restore from backup, update DNS

**Scenario 4: n8n Down**
- Impact: No Sheets updates, no Telegram alerts
- Recovery: Backfill from Supabase after n8n recovers

---

## Cost Optimization

### Current Optimizations

1. **GPT-4o-mini** instead of GPT-4 (10x cheaper)
2. **Serverless** instead of dedicated servers
3. **Free tiers** for Vercel + Supabase initially
4. **Single STT/TTS provider** (Yandex) for consistency
5. **Efficient prompts** (short responses = lower cost)

### Future Optimizations

1. **Caching**: Cache common responses
2. **Streaming**: Stream TTS audio for faster UX
3. **Batch processing**: Batch n8n notifications
4. **Reserved capacity**: If volume high, negotiate rates

---

## Technology Decisions

### Why Node.js?
- Fast development speed
- Large ecosystem (Vercel, Supabase SDKs)
- Good for I/O-heavy workloads (API calls)
- Excellent async/await support

### Why Vercel?
- Serverless = no server management
- Auto-scaling
- Edge network (low latency)
- Easy deployment (`vercel --prod`)
- Free tier for MVP

### Why Supabase?
- PostgreSQL (reliable, proven)
- Real-time capabilities (future use)
- Good free tier
- Easy SQL editor
- REST API + SDK

### Why Yandex SpeechKit?
- Best for Russian language
- Good quality for phone audio
- Regional presence (low latency)
- Competitive pricing

### Why n8n?
- Visual workflow editor (easy to modify)
- Self-hostable (cost control)
- Many integrations (Sheets, Telegram, etc.)
- Better than Zapier for complex logic

---

**Architecture Review Date:** 2024-12-22  
**Next Review:** After 1000 calls or 3 months
