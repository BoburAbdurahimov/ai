# Cost Analysis

Detailed cost breakdown for the AI Call Center MVP.

---

## Monthly Cost Estimate

### Scenario 1: 500 Calls/Month (MVP Launch)

**Assumptions:**
- Average call duration: 3 minutes
- 70% Russian (AI), 30% Uzbek (human transfer)
- 15% result in bookings
- 5% missed calls

| Service | Calculation | Monthly Cost |
|---------|-------------|--------------|
| **Vercel** | Free tier (100 hours/month) | $0 |
| **Supabase** | Free tier (500MB, <2GB bandwidth) | $0 |
| **Yandex STT** | 350 AI calls × 3 min × 0.5 RUB/min | ~$9 |
| **Yandex TTS** | 350 AI calls × 5 responses × 0.3 RUB/response | ~$7 |
| **OpenAI GPT-4o-mini** | 350 calls × 300 tokens × $0.15/1M input<br>350 calls × 100 tokens × $0.60/1M output | ~$8 |
| **n8n Cloud (Starter)** | Fixed monthly fee | $20 |
| **Call Provider (Vapi)** | 500 calls × 3 min × $0.05/min | $75 |
| **Telegram Bot** | Free | $0 |
| **Google Sheets** | Free | $0 |
| **TOTAL** | | **~$119/month** |

**Per-call cost:** ~$0.24

---

### Scenario 2: 2,000 Calls/Month (Growing)

**Assumptions:**
- Average call duration: 3 minutes
- Same distribution as Scenario 1

| Service | Calculation | Monthly Cost |
|---------|-------------|--------------|
| **Vercel** | Pro plan (400 hours/month) | $20 |
| **Supabase** | Pro plan (8GB database) | $25 |
| **Yandex STT** | 1,400 AI calls × 3 min × 0.5 RUB/min | ~$36 |
| **Yandex TTS** | 1,400 calls × 5 responses × 0.3 RUB/response | ~$28 |
| **OpenAI GPT-4o-mini** | 1,400 calls × 300 tokens × $0.15/1M<br>1,400 calls × 100 tokens × $0.60/1M | ~$32 |
| **n8n Cloud (Pro)** | Fixed monthly fee | $50 |
| **Call Provider (Vapi)** | 2,000 calls × 3 min × $0.05/min | $300 |
| **TOTAL** | | **~$491/month** |

**Per-call cost:** ~$0.25

---

### Scenario 3: 10,000 Calls/Month (Scale)

**Assumptions:**
- Average call duration: 3 minutes
- Same distribution

| Service | Calculation | Monthly Cost |
|---------|-------------|--------------|
| **Vercel** | Enterprise (contact sales) | ~$100 |
| **Supabase** | Pro plan (sufficient) | $25 |
| **Yandex STT** | 7,000 AI calls × 3 min × 0.5 RUB/min | ~$180 |
| **Yandex TTS** | 7,000 calls × 5 responses × 0.3 RUB/response | ~$140 |
| **OpenAI GPT-4o-mini** | 7,000 calls × 300 tokens × $0.15/1M<br>7,000 calls × 100 tokens × $0.60/1M | ~$160 |
| **n8n Cloud (Pro)** | Sufficient executions | $50 |
| **Call Provider (Vapi)** | 10,000 calls × 3 min × $0.05/min | $1,500 |
| **Redis Cache** | AWS ElastiCache t3.micro | $15 |
| **TOTAL** | | **~$2,170/month** |

**Per-call cost:** ~$0.22

---

## Cost Breakdown by Component

### 1. Call Provider (Largest Cost)

**Vapi Pricing:**
- $0.05 per minute (typical)
- Includes: telephony, audio streaming, DTMF, transfers

**Alternatives:**
- Twilio: $0.013/min + $1/phone/month
- Vonage: $0.012/min + $0.90/phone/month
- Custom SIP: Variable, requires more setup

**Optimization:**
- Negotiate volume discounts (>10k calls/month)
- Reduce average call duration (faster AI responses)
- Use cheaper provider for simple calls

---

### 2. Yandex SpeechKit (STT + TTS)

**Pricing:**
- STT: ~0.5 RUB/minute (~$0.0054/min)
- TTS: ~0.3 RUB per 1M characters (~$0.003 per response)

**Cost per AI call:**
- STT: 3 min × $0.0054 = $0.016
- TTS: 5 responses × $0.003 = $0.015
- **Total: ~$0.031/call**

**Alternatives:**
- Google Cloud Speech: $0.006/15 sec (~$0.024/min)
- AWS Transcribe: $0.024/min
- Deepgram: $0.0045/min (cheaper but may have quality tradeoffs)

**Optimization:**
- Use streaming for faster UX (same cost)
- Reduce TTS character count (shorter responses)
- Cache common TTS responses

---

### 3. LLM (OpenAI GPT-4o-mini)

**Pricing:**
- Input: $0.15 per 1M tokens
- Output: $0.60 per 1M tokens

**Cost per AI call:**
- Average input: 300 tokens (system prompt + conversation)
- Average output: 100 tokens (concise response)
- Input cost: 300 × $0.15/1M = $0.000045
- Output cost: 100 × $0.60/1M = $0.000060
- **Total: ~$0.0001/call** (negligible)

**Alternatives:**
- Anthropic Claude Haiku: $0.25/$1.25 per 1M tokens
- Yandex GPT Lite: 500 RUB/1M tokens (~$5.40)
- GPT-3.5-turbo: $0.50/$1.50 per 1M tokens

**Optimization:**
- Use shorter system prompts
- Limit max_tokens to 100-150
- Cache conversation context efficiently

---

### 4. Infrastructure (Vercel + Supabase)

**Vercel Costs:**
- Hobby: Free (up to 100 hours/month function execution)
- Pro: $20/month (400 hours/month)
- Enterprise: Custom pricing

**Supabase Costs:**
- Free: Up to 500MB database, 2GB bandwidth
- Pro: $25/month (8GB database, 50GB bandwidth)
- Team: $599/month (unlimited for larger scale)

**Typical Usage:**
- 500 calls: ~5 hours function time, ~50MB database → Free
- 2,000 calls: ~20 hours function time, ~200MB database → Free/Pro border
- 10,000 calls: ~100 hours function time, ~1GB database → Pro tier

---

### 5. n8n Automation

**n8n Cloud Pricing:**
- Starter: $20/month (5,000 executions)
- Pro: $50/month (10,000 executions)

**Execution Count:**
- Per call: 1 Sheets update + ~0.3 Telegram alerts = 1.3 executions
- 500 calls: ~650 executions (Starter sufficient)
- 2,000 calls: ~2,600 executions (Starter sufficient)
- 10,000 calls: ~13,000 executions (Pro tier)

**Self-hosted Alternative:**
- DigitalOcean Droplet: $6/month (1GB RAM)
- Unlimited executions
- Requires maintenance

---

## Cost Optimization Strategies

### 1. Reduce Call Duration

**Current:** 3 min average → $0.15/call (at $0.05/min)

**Target:** 2 min average → $0.10/call

**How:**
- Faster AI responses (optimize LLM prompts)
- Streaming TTS (perceived faster)
- Direct transfers for complex requests

**Savings:** $0.05/call × 500 calls = **$25/month**

---

### 2. Use Cheaper LLM

**Current:** GPT-4o-mini → ~$0.0001/call

**Alternative:** GPT-3.5-turbo → ~$0.0003/call (actually more expensive)

**Verdict:** GPT-4o-mini is already optimal for cost/quality

---

### 3. Cache TTS Responses

**Concept:** Store common AI responses as pre-generated audio

**Example:**
- "Здравствуйте! Чем могу помочь?"
- "Спасибо за звонок. До свидания!"
- Common FAQs

**Savings:** ~30% of TTS costs = **~$8/month** (for 2,000 calls)

**Implementation:**
```javascript
const ttsCache = {
  'greeting': 'cached_audio_greeting.opus',
  'goodbye': 'cached_audio_goodbye.opus'
};
```

---

### 4. Self-host n8n

**Current:** n8n Cloud Pro = $50/month (at 10k calls)

**Alternative:** DigitalOcean Droplet = $6/month

**Savings:** **$44/month**

**Tradeoff:** Requires server management, monitoring, backups

---

### 5. Negotiate Call Provider Rates

**Current:** Vapi at $0.05/min

**Target:** Negotiate to $0.04/min for >5k calls/month

**Savings (at 10k calls):**
- Current: 10,000 × 3 min × $0.05 = $1,500
- Negotiated: 10,000 × 3 min × $0.04 = $1,200
- **Savings: $300/month**

---

### 6. Use Multiple LLM Providers

**Concept:** Route to cheapest available provider

**Implementation:**
```javascript
const providers = [
  { name: 'openai', cost: 0.0001, available: true },
  { name: 'anthropic', cost: 0.00015, available: true },
  { name: 'yandex', cost: 0.00008, available: false }
];

const cheapest = providers.filter(p => p.available).sort((a,b) => a.cost - b.cost)[0];
```

**Savings:** ~20% on LLM costs (minimal absolute savings due to low LLM cost)

---

## Revenue vs Cost Analysis

### Break-even Calculation

**Assumptions:**
- Sell to businesses at **$300/month** per client
- Each client receives ~500 calls/month

**Costs:**
- Direct costs: ~$119/month per client
- Platform overhead: ~$50/month (amortized)
- **Total cost:** ~$169/month per client

**Gross margin:** $300 - $169 = **$131/month** (44% margin)

**Break-even:** 1 client

---

### Scaling Economics

| Clients | Calls/Month | Monthly Revenue | Monthly Cost | Profit | Margin |
|---------|-------------|-----------------|--------------|--------|--------|
| 1 | 500 | $300 | $169 | $131 | 44% |
| 5 | 2,500 | $1,500 | $700 | $800 | 53% |
| 10 | 5,000 | $3,000 | $1,200 | $1,800 | 60% |
| 20 | 10,000 | $6,000 | $2,200 | $3,800 | 63% |
| 50 | 25,000 | $15,000 | $4,500 | $10,500 | 70% |

**Key Insight:** Margins improve with scale due to:
- Platform costs amortized across clients
- Volume discounts from providers
- Operational efficiency

---

## Hidden Costs to Consider

### Development & Maintenance

- Initial development: ~40 hours (your time)
- Ongoing maintenance: ~5 hours/month
- Bug fixes, updates: ~10 hours/month

**Value:** $75/hour × 15 hours = **$1,125/month** (opportunity cost)

---

### Support & Monitoring

- Daily monitoring: 15 min/day = 7.5 hours/month
- Customer support: Variable
- On-call availability: Stress/time cost

**Recommendation:** Build monitoring dashboards early to reduce time spent

---

### Compliance & Legal

- Data privacy (GDPR, local laws): Consult lawyer
- Call recording consent: May be required
- Terms of service: Legal review

**Budget:** $500-2,000 one-time for legal review

---

## Cost Comparison: Build vs Buy

### Build (This MVP)

**Pros:**
- Full control
- Lower per-call cost at scale
- Customizable

**Cons:**
- Development time
- Maintenance burden

**Total Cost (first year):**
- Development: $3,000 (40 hours × $75)
- Running costs: $1,428 (12 months × $119)
- **Total: $4,428**

---

### Buy (Existing SaaS)

**Example:** Synthflow, Air.ai, etc.

**Typical Pricing:** $500-1,000/month

**Total Cost (first year):** $6,000-12,000

**Verdict:** Building is **30-60% cheaper** if you have technical skills

---

## Long-term Cost Projections

### Year 1: MVP Phase
- 1-5 clients
- ~2,500 calls/month average
- Cost: ~$700/month
- Revenue: ~$1,500/month
- **Profit: ~$800/month**

### Year 2: Growth Phase
- 10-20 clients
- ~10,000 calls/month average
- Cost: ~$2,200/month
- Revenue: ~$6,000/month
- **Profit: ~$3,800/month**

### Year 3: Scale Phase
- 50+ clients
- ~25,000+ calls/month
- Cost: ~$4,500/month
- Revenue: ~$15,000/month
- **Profit: ~$10,500/month**

---

## Recommendations

### For MVP Launch (500-1000 calls/month):
1. ✅ Use free tiers (Vercel, Supabase)
2. ✅ Use GPT-4o-mini (best cost/quality)
3. ✅ Start with n8n Cloud Starter
4. ✅ Focus on product-market fit, not optimization

### For Growth (1000-5000 calls/month):
1. ⚠️ Monitor costs weekly
2. ⚠️ Implement caching for TTS
3. ⚠️ Negotiate call provider rates
4. ⚠️ Consider self-hosting n8n

### For Scale (5000+ calls/month):
1. 🚀 Migrate to dedicated infrastructure
2. 🚀 Implement Redis caching
3. 🚀 Use reserved capacity pricing
4. 🚀 Hire DevOps for optimization

---

**Last Updated:** 2024-12-22  
**Next Review:** After 1,000 calls
