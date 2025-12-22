# AI Features Documentation

Complete guide to AI-powered features in your backup management system.

---

## 🤖 Overview

Your system now includes cutting-edge AI capabilities powered by OpenAI GPT-4:

- ✅ **Intelligent Pattern Analysis** - AI analyzes backup patterns and trends
- ✅ **Anomaly Detection** - Automatically detects unusual backup behavior
- ✅ **Smart Recommendations** - Context-aware suggestions for optimization
- ✅ **Natural Language Chat** - Conversational interface for backup management
- ✅ **Predictive Analytics** - Forecast storage needs and failure risks
- ✅ **Automated Insights** - Non-technical health summaries

---

## 🎯 AI Services

### 1. Pattern Analysis (`lib/ai/service.ts`)

**Analyzes backup patterns to identify:**
- Backup frequency (too frequent, optimal, too infrequent)
- Size growth trends (normal, increasing, decreasing)
- Failure patterns and rates
- Optimization opportunities

**Usage:**
```typescript
import { analyzeBackupPatterns } from '@/lib/ai/service';

const analysis = await analyzeBackupPatterns(backups);

console.log(analysis.frequency); // 'optimal'
console.log(analysis.sizeGrowth); // 'normal'
console.log(analysis.failureRate); // 5
console.log(analysis.recommendations); // ['...', '...']
```

**API Endpoint:**
```bash
POST /api/ai/analyze
{
  "analysisType": "patterns",
  "userId": "user-uuid"
}
```

### 2. Anomaly Detection

**Detects:**
- Unusual backup sizes (statistical outliers)
- Backup failures
- Long-running operations
- Abnormal patterns

**Usage:**
```typescript
import { detectAnomalies } from '@/lib/ai/service';

const { anomalies, overallHealth } = await detectAnomalies(backups);

anomalies.forEach(a => {
  console.log(`${a.severity}: ${a.reason}`);
});

console.log(`Health: ${overallHealth}%`);
```

**Features:**
- Z-score based statistical analysis
- Multiple severity levels (low, medium, high)
- Overall health scoring
- Detailed reasoning for each anomaly

### 3. Smart Recommendations

**Generates personalized recommendations based on:**
- System status (database, config, deployment)
- Backup history and patterns
- Storage usage
- Best practices

**Usage:**
```typescript
import { generateRecommendations } from '@/lib/ai/service';

const recommendations = await generateRecommendations(
  systemStatus,
  backups,
  storageUsage
);

// Returns: ["Reduce backup frequency...", "Enable compression...", ...]
```

**API Endpoint:**
```bash
POST /api/ai/analyze
{
  "analysisType": "recommendations",
  "userId": "user-uuid"
}
```

### 4. Natural Language Chat (`lib/ai/chatbot.ts`)

**Conversational interface for:**
- Creating backups
- Checking status
- Listing backups
- Troubleshooting issues
- Getting help

**Usage:**
```typescript
import { processChatMessage } from '@/lib/ai/chatbot';

const response = await processChatMessage(
  "What's my system status?",
  conversationHistory,
  systemContext
);

console.log(response.message); // Natural language response
console.log(response.suggestedActions); // Actionable buttons
console.log(response.intent); // 'status'
```

**API Endpoint:**
```bash
POST /api/ai/chat
{
  "message": "What's my system status?",
  "conversationHistory": [...],
  "userId": "user-uuid"
}
```

**Features:**
- Context-aware responses
- Suggested actions (clickable buttons)
- Intent detection
- Multi-turn conversations
- Error explanations in simple terms

### 5. Predictive Analytics (`lib/ai/predictions.ts`)

**Predicts:**
- Future storage needs (linear regression)
- Backup failure risk
- Optimal backup schedules
- Resource requirements

**Usage:**
```typescript
import { predictStorageNeeds, predictFailureRisk } from '@/lib/ai/predictions';

// Predict storage for next 30 days
const prediction = await predictStorageNeeds(backups, 30);
console.log(`Predicted: ${prediction.prediction / 1024 / 1024}MB`);
console.log(`Confidence: ${prediction.confidence * 100}%`);

// Assess failure risk
const risk = predictFailureRisk(backups);
console.log(`Risk: ${risk.risk} (score: ${risk.score})`);
console.log(`Factors: ${risk.factors.join(', ')}`);
```

**Prediction Features:**
- Linear regression for storage forecasting
- Timeline visualization data
- Confidence scores
- Risk assessment with contributing factors

### 6. Query Interface

**Natural language queries:**
```typescript
import { queryBackupsNL } from '@/lib/ai/service';

const result = await queryBackupsNL(
  "Show me failed backups from last week",
  backups
);

console.log(result.answer); // Natural language answer
console.log(result.data); // Filtered/calculated data
```

**Supported Queries:**
- "How many backups do I have?"
- "Show me failed backups"
- "What's my largest backup?"
- "When was my last backup?"
- "How much storage am I using?"

---

## 🎨 UI Components

### AIInsights Component

**Displays:**
- AI-powered recommendations
- Detected anomalies with severity
- Pattern analysis summary
- Overall system health score

**Usage:**
```tsx
import { AIInsights } from '@/components/AIInsights';

<AIInsights userId="user-uuid" />
```

**Features:**
- One-click analysis trigger
- Color-coded severity badges
- Actionable recommendations
- Real-time refresh

### AIChatbot Component

**Interactive chatbot with:**
- Floating chat button
- Conversation history
- Suggested actions
- Quick reply buttons
- Context-aware responses

**Usage:**
```tsx
import { AIChatbot } from '@/components/AIChatbot';

// Add to layout
<AIChatbot />
```

**Features:**
- Fixed position (bottom-right)
- Collapsible interface
- Message history
- Action buttons
- Loading states

---

## 🔧 Configuration

### Environment Variables

```env
# OpenAI (Recommended)
OPENAI_API_KEY=sk-...

# Or Anthropic
ANTHROPIC_API_KEY=sk-ant-...
```

### Model Selection

Edit `lib/ai/service.ts`:

```typescript
// Use GPT-4 Turbo (recommended)
model: 'gpt-4-turbo-preview'

// Or GPT-3.5 (faster, cheaper)
model: 'gpt-3.5-turbo'

// Or GPT-4o (balanced)
model: 'gpt-4o'
```

### Cost Optimization

**1. Use GPT-3.5 for simple tasks:**
```typescript
// In chatbot.ts for quick queries
model: 'gpt-3.5-turbo'
```

**2. Implement caching:**
```typescript
// Cache analysis results
cache.set('ai-analysis', results, { ttl: 3600000 }); // 1 hour
```

**3. Rate limiting (already implemented):**
```typescript
// Strict rate limiting for AI endpoints
await limiters.strict.check(3, clientId); // 3 requests per minute
```

---

## 📊 API Reference

### POST /api/ai/analyze

**Request:**
```json
{
  "analysisType": "full|patterns|anomalies|recommendations",
  "userId": "optional-user-uuid"
}
```

**Response:**
```json
{
  "success": true,
  "analysis": {
    "patterns": { ... },
    "anomalies": { ... },
    "recommendations": [...]
  },
  "metadata": {
    "analysisType": "full",
    "backupsAnalyzed": 50,
    "duration": "2500ms"
  }
}
```

### POST /api/ai/chat

**Request:**
```json
{
  "message": "What's my system status?",
  "conversationHistory": [
    {"role": "user", "content": "Hello"},
    {"role": "assistant", "content": "Hi! How can I help?"}
  ],
  "userId": "optional-user-uuid"
}
```

**Response:**
```json
{
  "success": true,
  "response": {
    "message": "Your system is healthy...",
    "suggestedActions": [
      {
        "label": "View Details",
        "action": "view_status",
        "params": {}
      }
    ],
    "intent": "status"
  }
}
```

---

## 💡 Use Cases

### 1. Daily Health Check

```typescript
// Morning routine
const analysis = await analyzeBackupPatterns(recentBackups);
const { overallHealth } = await detectAnomalies(allBackups);

if (overallHealth < 80) {
  // Send alert
  await sendSlackNotification(`System health: ${overallHealth}%`);
}
```

### 2. Pre-Deployment Check

```typescript
// Before major changes
const risk = predictFailureRisk(backups);

if (risk.risk === 'high') {
  console.log('⚠️  High failure risk detected:');
  risk.factors.forEach(f => console.log(`  - ${f}`));
  // Maybe delay deployment
}
```

### 3. Customer Support

```typescript
// Handle support queries
const answer = await queryBackupsNL(
  "Why did my last backup fail?",
  userBackups
);

// Send to customer
sendEmail(customer, answer.answer);
```

### 4. Cost Optimization

```typescript
// Weekly optimization review
const recommendations = await generateRecommendations(
  systemStatus,
  backups,
  usage
);

// Act on recommendations
recommendations.forEach(rec => {
  if (rec.includes('compression')) {
    // Enable compression
  }
});
```

---

## 🧪 Testing

### Test AI Analysis

```bash
curl -X POST http://localhost:3000/api/ai/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "analysisType": "full"
  }'
```

### Test Chatbot

```bash
curl -X POST http://localhost:3000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Show me my backups"
  }'
```

---

## 🚨 Limitations

### Rate Limiting
- AI endpoints: **3 requests/minute** (expensive operations)
- Chat endpoint: **10 requests/minute**

### Fallbacks
- All AI functions have rule-based fallbacks
- System works without AI (graceful degradation)
- Offline mode supported

### Data Requirements
- Pattern analysis: Minimum 2 backups
- Predictions: Minimum 3 backups for accuracy
- Anomaly detection: Works with any amount

---

## 💰 Cost Estimates

### GPT-4 Turbo Pricing

| Operation | Tokens | Cost |
|-----------|--------|------|
| Pattern Analysis | ~2,000 | $0.02 |
| Anomaly Detection | ~1,500 | $0.015 |
| Recommendations | ~2,500 | $0.025 |
| Chat Message | ~500 | $0.005 |

**Monthly estimate** (100 users, 10 analyses/user/month):
- 1,000 analyses × $0.02 = **$20/month**
- 5,000 chat messages × $0.005 = **$25/month**
- **Total: ~$45/month**

### Cost Optimization Tips

1. Cache analysis results (1 hour)
2. Use GPT-3.5 for simple queries (10x cheaper)
3. Batch operations when possible
4. Rate limit aggressively

---

## 🎉 Benefits

### For Users
✅ **Proactive insights** - Catch issues before they happen  
✅ **Natural language** - No technical knowledge required  
✅ **Automated optimization** - AI suggests improvements  
✅ **Peace of mind** - 24/7 monitoring and analysis  

### For Admins
✅ **Reduced support tickets** - Chatbot handles common questions  
✅ **Early warning system** - Anomaly detection alerts  
✅ **Data-driven decisions** - Predictive analytics  
✅ **Cost optimization** - AI recommendations  

---

## 📚 Next Steps

1. **Set up OpenAI API key**
2. **Add AIInsights to dashboard**
3. **Enable AIChatbot**
4. **Test analysis endpoints**
5. **Monitor AI costs**
6. **Gather user feedback**

---

**Your backup system is now intelligent!** 🧠✨
