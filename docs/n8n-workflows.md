# n8n Workflow Configuration Guide

This document describes the three n8n workflows required for the AI Call Center MVP.

## Overview

**Data Flow:** Backend → Supabase → n8n → (Google Sheets + Telegram)

**Three Required Workflows:**
1. Google Sheets Sync (updates spreadsheet with call data)
2. Telegram Alerts (instant notifications for critical events)
3. Daily Summary (scheduled daily report)

---

## Workflow 1: Google Sheets Sync

**Purpose:** Update Google Sheets with every completed call for client visibility

**Trigger:** Webhook from backend (`N8N_SHEETS_WEBHOOK`)

**Workflow Steps:**

```
1. Webhook Trigger
   ├─ Method: POST
   ├─ Path: /webhook/sheets-update
   └─ Authentication: None (can add later)

2. Extract Data
   ├─ call_id
   ├─ language (RU/UZ)
   ├─ handled_by (AI/HUMAN)
   ├─ outcome (info/booking/transfer/missed)
   ├─ call_duration_seconds
   ├─ timestamp
   └─ caller_number

3. Google Sheets Node
   ├─ Operation: Append
   ├─ Spreadsheet ID: [YOUR_SHEET_ID]
   ├─ Sheet Name: "Calls"
   └─ Columns:
       • Column A: Call ID
       • Column B: Date/Time
       • Column C: Language
       • Column D: Handled By
       • Column E: Outcome
       • Column F: Duration (seconds)
       • Column G: Caller Number
```

**Sample Payload:**
```json
{
  "event": "sheets_update",
  "call_id": "call_abc123",
  "language": "RU",
  "handled_by": "AI",
  "outcome": "booking",
  "call_duration_seconds": 180,
  "timestamp": "2024-12-22T10:30:00Z",
  "caller_number": "+998901234567"
}
```

**Google Sheets Setup:**
1. Create a new Google Sheet
2. Add header row: `Call ID | Date/Time | Language | Handled By | Outcome | Duration | Caller`
3. Share sheet with n8n service account (read/write)
4. Set permissions: View-only for clients

---

## Workflow 2: Telegram Alerts

**Purpose:** Send instant notifications for critical events (bookings, missed calls, transfers)

**Trigger:** Webhook from backend (`N8N_TELEGRAM_WEBHOOK`)

**Workflow Steps:**

```
1. Webhook Trigger
   ├─ Method: POST
   ├─ Path: /webhook/telegram-alert
   └─ Authentication: None

2. Switch Node (based on alert_type)
   ├─ Case: "new_booking"
   ├─ Case: "missed_call"
   └─ Case: "human_transfer"

3. Format Message Node
   └─ Create formatted text based on case

4. Telegram Node
   ├─ Operation: Send Message
   ├─ Chat ID: [YOUR_TELEGRAM_CHAT_ID]
   └─ Message: Formatted text
```

**Sample Payload:**
```json
{
  "event": "telegram_alert",
  "alert_type": "new_booking",
  "call_id": "call_abc123",
  "language": "RU",
  "handled_by": "AI",
  "outcome": "booking",
  "timestamp": "2024-12-22T10:30:00Z",
  "caller_number": "+998901234567"
}
```

**Message Templates:**

**New Booking:**
```
🎉 НОВАЯ ЗАПИСЬ!

📞 ID: call_abc123
🗣️ Язык: Русский
🤖 Обработано: AI
📅 Время: 22.12.2024 10:30
📱 Номер: +998901234567
```

**Missed Call:**
```
⚠️ ПРОПУЩЕННЫЙ ЗВОНОК

📞 ID: call_abc123
🗣️ Язык: Русский
📅 Время: 22.12.2024 10:30
📱 Номер: +998901234567
```

**Human Transfer:**
```
👤 ПЕРЕВОД НА ОПЕРАТОРА

📞 ID: call_abc123
🗣️ Язык: Узбекский
📅 Время: 22.12.2024 10:30
📱 Номер: +998901234567
```

---

## Workflow 3: Daily Summary

**Purpose:** Send aggregated daily statistics every evening

**Trigger:** Webhook from backend cron job (`N8N_DAILY_SUMMARY_WEBHOOK`)

**Workflow Steps:**

```
1. Webhook Trigger
   ├─ Method: POST
   ├─ Path: /webhook/daily-summary
   └─ Authentication: None

2. Extract Stats
   ├─ date
   ├─ total_calls
   ├─ ai_handled_calls
   ├─ human_transfers
   ├─ bookings
   ├─ missed_calls
   ├─ russian_calls
   ├─ uzbek_calls
   └─ avg_duration_seconds

3. Format Summary Message
   └─ Create comprehensive daily report

4. Telegram Node
   ├─ Operation: Send Message
   ├─ Chat ID: [YOUR_TELEGRAM_CHAT_ID]
   └─ Message: Formatted summary
```

**Sample Payload:**
```json
{
  "event": "daily_summary",
  "date": "2024-12-21",
  "total_calls": 47,
  "ai_handled_calls": 35,
  "human_transfers": 12,
  "bookings": 8,
  "missed_calls": 3,
  "russian_calls": 35,
  "uzbek_calls": 12,
  "avg_duration_seconds": 145
}
```

**Summary Message Template:**
```
📊 ЕЖЕДНЕВНЫЙ ОТЧЕТ - 21.12.2024

📞 Всего звонков: 47
├─ 🇷🇺 Русский: 35
└─ 🇺🇿 Узбекский: 12

🤖 Обработано AI: 35 (74%)
👤 Переведено оператору: 12 (26%)

📈 Результаты:
├─ ✅ Записи: 8
├─ ❌ Пропущенные: 3
└─ ℹ️ Информационные: 36

⏱️ Средняя длительность: 2:25

---
Создано AI Call Center MVP
```

---

## Setup Instructions

### 1. Create n8n Workflows

1. Log in to your n8n instance
2. Create three new workflows using the structures above
3. Activate each workflow
4. Copy webhook URLs

### 2. Configure Environment Variables

Add webhook URLs to your `.env`:

```bash
N8N_SHEETS_WEBHOOK=https://your-n8n.com/webhook/sheets-update
N8N_TELEGRAM_WEBHOOK=https://your-n8n.com/webhook/telegram-alert
N8N_DAILY_SUMMARY_WEBHOOK=https://your-n8n.com/webhook/daily-summary
```

### 3. Setup Telegram Bot

1. Create bot via [@BotFather](https://t.me/botfather)
2. Get bot token
3. Get your chat ID (send message to bot, then call `https://api.telegram.org/bot<TOKEN>/getUpdates`)
4. Configure Telegram node in n8n with token and chat ID

### 4. Setup Google Sheets

1. Create new Google Sheet
2. Add headers: `Call ID | Date/Time | Language | Handled By | Outcome | Duration | Caller`
3. Share with n8n service account
4. Set client users to "View only"
5. Copy Sheet ID from URL

### 5. Setup Cron Job for Daily Summary

**Option A: Vercel Cron (Recommended)**

Add to `vercel.json`:
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

**Option B: External Cron (EasyCron, etc.)**

Create a daily task:
```
URL: https://your-app.vercel.app/api/cron/daily-summary?secret=YOUR_CRON_SECRET
Time: 22:00 UTC daily
Method: GET
```

---

## Testing

### Test Sheets Sync
```bash
curl -X POST https://your-n8n.com/webhook/sheets-update \
  -H "Content-Type: application/json" \
  -d '{
    "event": "sheets_update",
    "call_id": "test_001",
    "language": "RU",
    "handled_by": "AI",
    "outcome": "info",
    "call_duration_seconds": 60,
    "timestamp": "2024-12-22T10:00:00Z",
    "caller_number": "+998901234567"
  }'
```

### Test Telegram Alert
```bash
curl -X POST https://your-n8n.com/webhook/telegram-alert \
  -H "Content-Type: application/json" \
  -d '{
    "event": "telegram_alert",
    "alert_type": "new_booking",
    "call_id": "test_002",
    "language": "RU",
    "handled_by": "AI",
    "outcome": "booking",
    "timestamp": "2024-12-22T10:00:00Z",
    "caller_number": "+998901234567"
  }'
```

### Test Daily Summary
```bash
curl -X POST https://your-n8n.com/webhook/daily-summary \
  -H "Content-Type: application/json" \
  -d '{
    "event": "daily_summary",
    "date": "2024-12-21",
    "total_calls": 47,
    "ai_handled_calls": 35,
    "human_transfers": 12,
    "bookings": 8,
    "missed_calls": 3,
    "russian_calls": 35,
    "uzbek_calls": 12,
    "avg_duration_seconds": 145
  }'
```

---

## Cost Considerations

**n8n Pricing:**
- Self-hosted: Free (requires server)
- Cloud Starter: $20/month (5,000 executions)
- Cloud Pro: $50/month (10,000 executions)

**Expected Monthly Executions (for 500 calls/month):**
- Sheets updates: 500 executions
- Telegram alerts: ~150 executions (30% trigger rate)
- Daily summaries: 30 executions
- **Total: ~680 executions/month** (well within Starter plan)

---

## Troubleshooting

**Webhook not triggering:**
- Check webhook URL is correct in `.env`
- Verify workflow is activated in n8n
- Check n8n execution logs

**Google Sheets not updating:**
- Verify service account has write access
- Check Sheet ID is correct
- Ensure column mapping matches headers

**Telegram messages not sending:**
- Verify bot token is correct
- Ensure chat ID is valid
- Check bot is not blocked by user

**Daily summary not running:**
- Verify cron job is configured
- Check `CRON_SECRET` matches
- Test manually: `GET /api/cron/daily-summary?secret=YOUR_SECRET`
