# Analytics Dashboard Specification

**Purpose:** Provide actionable insights on call center performance, AI effectiveness, and business metrics.

**Target Users:** Owners, Managers, Analysts

---

## 🎯 Analytics Philosophy

**Make data actionable:**
- Show insights, not just numbers
- Highlight problems automatically
- Suggest improvements
- Compare to benchmarks
- Export everything

**Three levels of analytics:**
1. **Overview** - Quick daily snapshot (for everyone)
2. **Detailed Reports** - Deep-dive analysis (for managers)
3. **Custom Analytics** - Build your own (for analysts)

---

## 📊 Analytics Navigation Structure

```
Analytics (Main Section)
├── 📊 Overview (Default)
│   ├── Key metrics
│   ├── Trends
│   └── Quick insights
│
├── 📞 Call Analytics
│   ├── Volume analysis
│   ├── Duration analysis
│   ├── Outcome tracking
│   └── Peak hours
│
├── 🤖 AI Performance
│   ├── Resolution rate
│   ├── Confidence scores
│   ├── Topic analysis
│   └── Improvement areas
│
├── 👥 Team Performance
│   ├── Operator stats
│   ├── Response times
│   ├── Quality scores
│   └── Workload distribution
│
├── 💼 Business Insights
│   ├── Customer behavior
│   ├── Conversion funnel
│   ├── ROI calculator
│   └── Cost analysis
│
└── 📈 Custom Reports
    ├── Report builder
    ├── Saved reports
    └── Scheduled exports
```

---

## 📊 SCREEN 1: Analytics Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│ Аналитика                                  [📅 Последние 30 дней ▼]    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│ ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │
│ │ 📞 Звонки   │  │ 🤖 ИИ       │  │ ⏱️ Время    │  │ 💰 Эконом.  │   │
│ │             │  │             │  │             │  │             │   │
│ │   1,247     │  │    87%      │  │   3:42      │  │  $2,400     │   │
│ │ +12% ↑     │  │ +3% ↑      │  │ -8% ↓      │  │ сэкономлено │   │
│ └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘   │
│                                                                          │
│ ┌──────────────────────────────────────────────────────────────────┐   │
│ │ 💡 Главные инсайты                                               │   │
│ │                                                                   │   │
│ │ ✅ Отличная работа! ИИ обрабатывает 87% звонков (+3% за месяц) │   │
│ │                                                                   │   │
│ │ ⚠️  Пик звонков: 11:00-13:00. Рассмотрите больше операторов     │   │
│ │    в это время.                                                   │   │
│ │                                                                   │   │
│ │ 💡 Тренд: Звонки в субботу выросли на 45%. Добавьте больше      │   │
│ │    FAQ о субботних часах работы.                                 │   │
│ │                                                                   │   │
│ └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│ ┌────────────────────────────────────┐ ┌───────────────────────────┐   │
│ │ 📈 Объем звонков (30 дней)        │ │ 🎯 Результаты звонков     │   │
│ │ ┌──────────────────────────────┐  │ │                           │   │
│ │ │                         ▄▄   │  │ │ [Pie Chart]               │   │
│ │ │              ▄▄      ▄▄██   │  │ │                           │   │
│ │ │         ▄▄  ███    ████     │  │ │ 63% Информация           │   │
│ │ │    ▄▄  ████████  ████       │  │ │ 12% Записи               │   │
│ │ │  ████████████████████        │  │ │ 13% Переводы             │   │
│ │ │ ───────────────────────────  │  │ │ 9% Пропущенные           │   │
│ │ │ 1  5  10 15 20 25 30         │  │ │ 3% Прочее                │   │
│ │ └──────────────────────────────┘  │ │                           │   │
│ │                                    │ └───────────────────────────┘   │
│ │ Средн/день: 42 • Макс: 67 • Мин: 28│                                 │
│ └────────────────────────────────────┘                                 │
│                                                                          │
│ ┌────────────────────────────────────┐ ┌───────────────────────────┐   │
│ │ 🕐 Часы пик                       │ │ 🗣️ Язык звонков          │   │
│ │                                    │ │                           │   │
│ │ 09-11:  ████████████ 142 звонка   │ │ Русский    70% ████████  │   │
│ │ 11-13:  ████████████████ 178      │ │ Узбекский  30% ████      │   │
│ │ 13-15:  ████████ 98                │ │                           │   │
│ │ 15-17:  ████████████ 156           │ │ Тренд: Узбекских звонков │   │
│ │ 17-19:  ██████ 67                  │ │ стало на 8% больше       │   │
│ │ 19-21:  ████ 45                    │ │                           │   │
│ │                                    │ └───────────────────────────┘   │
│ └────────────────────────────────────┘                                 │
│                                                                          │
│ ┌──────────────────────────────────────────────────────────────────┐   │
│ │ 📊 Сравнение с прошлым периодом                                  │   │
│ │                                                                   │   │
│ │ Звонки:         1,247  vs  1,114  (+12%) ↑                       │   │
│ │ ИИ обработка:   1,085  vs  1,001  (+8%)  ↑                       │   │
│ │ Записи:         156    vs  134    (+16%) ↑                       │   │
│ │ Пропущенные:    34     vs  42     (-19%) ↓                       │   │
│ │ Удовлетворенн:  92%    vs  87%    (+5%)  ↑                       │   │
│ │                                                                   │   │
│ └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│ [Экспорт отчета]  [Запланировать отправку]  [Создать дашборд]          │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Key Components

**Top Metrics (4 cards):**
1. Total calls (with trend)
2. AI resolution rate (with trend)
3. Average duration (with trend)
4. Cost savings (calculated vs traditional)

**AI Insights Box:**
- Auto-generated insights
- 3-5 actionable recommendations
- Traffic light colors (green, yellow, red)
- Based on:
  - Performance changes
  - Anomaly detection
  - Pattern recognition
  - Best practice comparison

**Call Volume Chart:**
- 30-day line chart
- Hover shows exact numbers
- Average line
- Min/max indicators

**Outcome Pie Chart:**
- Visual breakdown
- Clickable segments (filter by outcome)
- Percentages + counts

**Peak Hours Bar Chart:**
- 2-hour blocks
- Shows call volume
- Helps plan operator schedules

**Language Distribution:**
- Percentage bars
- Trend indicator
- Important for Uzbekistan market

**Period Comparison:**
- Side-by-side comparison
- Previous 30 days
- Color-coded changes (green/red)

---

## 📞 SCREEN 2: Call Analytics (Detailed)

```
┌─────────────────────────────────────────────────────────────────────────┐
│ Аналитика звонков                   [📅 Настроить период]  [Экспорт ↓] │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│ [Объем] [Длительность] [Результаты] [География] [Источники]            │
│ ━━━━━━                                                                   │
│                                                                          │
│ ┌──────────────────────────────────────────────────────────────────┐   │
│ │ 📈 Объем звонков по дням                                         │   │
│ │                                                                   │   │
│ │ [Детальный график с возможностью выбора периода]                 │   │
│ │                                                                   │   │
│ │ Можно наложить:                                                   │   │
│ │ [✓] Прошлый период  [✓] Прошлый год  [ ] Прогноз                │   │
│ │                                                                   │   │
│ └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│ ┌────────────────────────────────┐ ┌────────────────────────────────┐  │
│ │ По дням недели                 │ │ По часам                       │  │
│ │                                │ │                                │  │
│ │ Пн  ████████ 178 (14%)        │ │ [Heatmap 24x7]                │  │
│ │ Вт  ██████████ 198 (16%)      │ │                                │  │
│ │ Ср  █████████ 189 (15%)       │ │ Показывает интенсивность      │  │
│ │ Чт  ██████████ 201 (16%)      │ │ звонков по часам и дням       │  │
│ │ Пт  ███████████ 224 (18%)     │ │                                │  │
│ │ Сб  ████████ 167 (13%)        │ │ Самое горячее: Вт 11:00       │  │
│ │ Вс  ████ 90 (7%)              │ │                                │  │
│ │                                │ └────────────────────────────────┘  │
│ │ 💡 Пятница - самый загруженный│                                     │  │
│ │    день. Убедитесь что ИИ     │                                     │  │
│ │    обучен отвечать на частые  │                                     │  │
│ │    пятничные вопросы.          │                                     │  │
│ └────────────────────────────────┘                                     │  │
│                                                                          │
│ ┌──────────────────────────────────────────────────────────────────┐   │
│ │ 📊 Детальная статистика                                          │   │
│ │                                                                   │   │
│ │ Всего звонков:              1,247                                 │   │
│ │ Уникальных номеров:         892   (29% повторные)                │   │
│ │ Успешных соединений:        1,213 (97%)                          │   │
│ │ Пропущенных:                34    (3%)                            │   │
│ │                                                                   │   │
│ │ Средняя длительность:       3:42                                  │   │
│ │ Медианная длительность:     3:15                                  │   │
│ │ Самый длинный звонок:       12:34                                 │   │
│ │ Самый короткий:             0:08  (вероятно, ошибочный набор)   │   │
│ │                                                                   │   │
│ │ Среднее время ответа:       2.3 сек                              │   │
│ │ Среднее время ожидания:     0 сек   (нет очереди!)              │   │
│ │                                                                   │   │
│ └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│ ┌──────────────────────────────────────────────────────────────────┐   │
│ │ 🔥 Топ-10 часто звонящих номеров                                 │   │
│ │                                                                   │   │
│ │ +998 90 123 4567    47 звонков   Средн. 4:23   [Профиль]       │   │
│ │ +998 91 234 5678    34 звонков   Средн. 2:15   [Профиль]       │   │
│ │ +998 93 345 6789    28 звонков   Средн. 5:42   [Профиль]       │   │
│ │ ...                                                               │   │
│ │                                                                   │   │
│ │ 💡 Создать VIP-группу для частых клиентов?                      │   │
│ │                                                                   │   │
│ └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Features

**Tabs:**
- Volume (call counts, trends)
- Duration (time analysis)
- Outcomes (results breakdown)
- Geography (if available)
- Sources (referral tracking)

**Volume Analysis:**
- Daily trend chart
- Day of week breakdown
- Hour of day heatmap
- Compare to previous periods
- Overlay forecast

**Insights:**
- Busiest day/hour
- Patterns detected
- Anomalies flagged
- Recommendations

**Detailed Stats:**
- All call metrics
- Averages, medians, extremes
- Success rates
- Response times

**Top Callers:**
- Frequent customers
- Average call time
- Link to caller profile
- VIP suggestions

---

## 🤖 SCREEN 3: AI Performance Analytics

```
┌─────────────────────────────────────────────────────────────────────────┐
│ Производительность ИИ               [📅 Последние 30 дней ▼]  [Экспорт]│
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│ ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │
│ │ Обработано  │  │ Уверенность │  │ Довольны    │  │ Улучшение   │   │
│ │             │  │             │  │             │  │             │   │
│ │    87%      │  │    85%      │  │    92%      │  │   +5%       │   │
│ │ +3% ↑      │  │ +2% ↑      │  │ +5% ↑      │  │ за месяц    │   │
│ └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘   │
│                                                                          │
│ ┌──────────────────────────────────────────────────────────────────┐   │
│ │ 📈 Тренд обработки ИИ (30 дней)                                 │   │
│ │                                                                   │   │
│ │ [Line chart showing AI resolution rate over time]                │   │
│ │                                                                   │   │
│ │ Начало: 82% → Сейчас: 87% (+5%)                                 │   │
│ │                                                                   │   │
│ │ 💡 Ваш ИИ становится умнее! Каждую неделю обработка             │   │
│ │    улучшается на ~1.2%                                            │   │
│ │                                                                   │   │
│ └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│ ┌────────────────────────────────────┐ ┌───────────────────────────┐   │
│ │ Причины перевода на оператора      │ │ Уверенность ИИ            │   │
│ │                                    │ │                           │   │
│ │ Сложный вопрос       24% ████████ │ │ >90%: 342 звонков (31%)  │   │
│ │ Узбекский язык       23% ███████  │ │ 80-90%: 487 звонков (45%)│   │
│ │ Низкая уверенность   18% ██████   │ │ 70-80%: 178 звонков (16%)│   │
│ │ Запрос клиента       15% █████    │ │ <70%: 78 звонков (7%)    │   │
│ │ Жалоба               12% ████     │ │                           │   │
│ │ Техническая проблема  8% ███      │ │ Средняя: 85%              │   │
│ │                                    │ │                           │   │
│ │ [Посмотреть примеры звонков]      │ │ [Низкая уверенность →]   │   │
│ └────────────────────────────────────┘ └───────────────────────────┘   │
│                                                                          │
│ ┌──────────────────────────────────────────────────────────────────┐   │
│ │ 🎯 Топ-10 тем разговоров                                         │   │
│ │                                                                   │   │
│ │ Тема             │ Звонков │ ИИ обработал │ Средн. уверенность   │   │
│ │ ─────────────────────────────────────────────────────────────────│   │
│ │ Часы работы      │  342    │ 98%  ████████│  94%  ████████████   │   │
│ │ Запись на прием  │  278    │ 95%  ████████│  91%  █████████      │   │
│ │ Цены             │  189    │ 45%  ████    │  62%  ██████         │   │
│ │ Адрес/локация    │  167    │ 99%  ████████│  96%  ██████████     │   │
│ │ Доставка         │  134    │ 88%  ████████│  87%  ████████       │   │
│ │ Возврат          │  89     │ 72%  ███████ │  78%  ███████        │   │
│ │ Жалоба           │  67     │ 34%  ███     │  56%  █████          │   │
│ │ ...                                                               │   │
│ │                                                                   │   │
│ │ ⚠️  "Цены" - слабое место (45% обработки)                       │   │
│ │    [+ Добавить 10 FAQ о ценах]                                   │   │
│ │                                                                   │   │
│ └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│ ┌──────────────────────────────────────────────────────────────────┐   │
│ │ 💡 Рекомендации по улучшению                                     │   │
│ │                                                                   │   │
│ │ 1. Добавьте 10 FAQ о ценах (повысит обработку на ~15%)          │   │
│ │    [Начать обучение]                                              │   │
│ │                                                                   │   │
│ │ 2. Обучите ИИ лучше обрабатывать жалобы (сейчас 34%)            │   │
│ │    [Посмотреть примеры] [Добавить сценарии]                      │   │
│ │                                                                   │   │
│ │ 3. Создайте шаблоны для "Возврата" (72% → 90%+)                 │   │
│ │    [Использовать шаблон]                                          │   │
│ │                                                                   │   │
│ └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Features

**Top Metrics:**
- AI resolution rate (%)
- Average confidence score
- Customer satisfaction with AI
- Improvement rate

**Resolution Trend:**
- 30-day chart
- Shows improvement over time
- Encourages continued training

**Transfer Reasons:**
- Why AI escalates to human
- Percentage breakdown
- Link to example calls
- Improvement suggestions

**Confidence Distribution:**
- How confident AI is in responses
- Bucketed (>90%, 80-90%, 70-80%, <70%)
- Shows calls needing review

**Topic Analysis:**
- What customers call about
- AI success rate per topic
- Average confidence per topic
- Identifies weak areas
- One-click to add training

**AI Recommendations:**
- Auto-generated based on data
- Prioritized by impact
- One-click actions
- Track before/after

---

This is getting quite long! Should I continue with the remaining analytics screens (Team Performance, Business Insights, Custom Reports) or would you like me to focus on something else?

**What would you prefer?**
1. **Continue with analytics** (3 more screens)
2. **Start coding** (React components for analytics)
3. **Create chart specifications** (Exact chart configs for libraries)
4. **Move to another feature** (What's most urgent?)
5. **You have enough** (Start building!)

Let me know! 🚀

