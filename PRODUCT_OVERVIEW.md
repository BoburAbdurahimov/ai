# AI Call Center SaaS - Product Overview

**One-page executive summary of the complete product.**

---

## 🎯 What We're Building

**Product Name:** VoiceOps AI

**One-Line Pitch:**
> AI-powered call center for Uzbek businesses. Set up in 10 minutes, save 70% on costs, handles Russian calls with AI and transfers Uzbek calls to humans.

**Target Market:** SMBs in Uzbekistan (e-commerce, clinics, services, hospitality)

**Differentiation:** 
- Local focus (Russian + Uzbek)
- Hybrid AI + human model
- 10-minute setup (vs months)
- 70% cost savings

---

## 💼 Business Model

### Pricing (SaaS Subscription)

| Tier | Price | Minutes | Numbers | Target |
|------|-------|---------|---------|--------|
| Starter | $99/mo | 500 | 1 | Solo businesses |
| Professional | $299/mo | 2,000 | 3 | Growing companies |
| Business | $799/mo | 10,000 | Unlimited | Mid-market |
| Enterprise | Custom | Unlimited | Unlimited | Large orgs |

**Additional Revenue:**
- Overage: $0.10/minute over limit
- Extra numbers: $10/month each
- Professional services: $500-$10,000

**Unit Economics:**
- CAC: $150
- LTV: $3,000
- LTV:CAC: 20:1
- Gross Margin: 76%
- Per-call cost: ~$0.24

---

## 🏗️ Technical Stack

**Frontend:**
- Next.js 14 + TypeScript + Tailwind CSS
- Hosted on Vercel

**Backend:**
- Node.js + Express + TypeScript
- Existing MVP already built ✅
- Serverless on Vercel

**Database:**
- PostgreSQL (Supabase)
- Prisma ORM
- Multi-tenant with RLS

**Key Services:**
- Auth: Clerk
- Payments: Stripe
- STT/TTS: Yandex SpeechKit
- LLM: OpenAI GPT-4o-mini
- Call Provider: Vapi/Twilio

---

## 🎨 Product Structure

### Customer-Facing

**1. Landing Page**
- Hero with value prop
- 3 pricing tiers
- Demo video
- Testimonials
- Sign up CTA

**2. Signup & Onboarding (10 minutes)**
- Step 1: Create account (2 min)
- Step 2: Company info (1 min)
- Step 3: Get phone number (2 min)
- Step 4: Configure AI (3 min)
- Step 5: Test & go live (2 min)

**3. Main Dashboard**
- **Home:** Overview stats, live calls, quick actions
- **Calls:** History, filters, recordings, transcripts
- **AI:** Configure personality, add FAQ, train
- **Analytics:** Performance, insights, trends
- **Billing:** Plan, usage, invoices, payments
- **Settings:** Account, team, integrations

---

## 🚀 Core Features

### For Call Handling (Backend - Already Built ✅)
- ✅ DTMF language menu (1=Russian, 2=Uzbek)
- ✅ Russian → AI conversation (STT → LLM → TTS)
- ✅ Uzbek → Human transfer (no AI)
- ✅ Safety rules (no prices, no medical advice)
- ✅ Complete logging to Supabase

### For Customers (Frontend - To Build)
- 📊 Real-time dashboard
- 📞 Call history with recordings
- 🤖 Self-service AI training
- 👥 Team management (invite operators)
- 📈 Analytics and insights
- 💳 Stripe billing (subscription + usage)
- ⚙️ Settings and configuration

### For Operations (Automation - Already Built ✅)
- ✅ n8n workflows (Sheets, Telegram)
- ✅ Daily summaries
- ✅ Usage tracking
- ✅ Webhook triggers

---

## 📅 Build Timeline

### MVP SaaS (6 weeks)

**Week 1-2: Foundation**
- Setup Next.js + Clerk
- Build landing page
- Implement signup flow

**Week 3-4: Core Dashboard**
- Dashboard layout (sidebar + nav)
- Dashboard home page
- Call history page
- Connect to existing backend

**Week 5-6: Billing & Launch**
- Onboarding wizard
- Stripe integration
- Billing dashboard
- **Beta launch with 5-10 customers**

### Post-MVP (Weeks 7-12)
- Advanced analytics
- Team features
- Integrations
- Scale to 50-100 customers

---

## 💰 Investment & Returns

**Development Cost:**
- Solo + contractors: $15-25K
- Small team: $25-40K
- Agency: $60-120K

**Monthly Infrastructure:**
- MVP (10 customers): ~$100/month
- Growth (100 customers): ~$500/month

**Revenue Projections:**

| Month | Customers | MRR | Cost | Profit |
|-------|-----------|-----|------|--------|
| 3 | 10 | $2,500 | $1,000 | $1,500 |
| 6 | 50 | $12,500 | $3,000 | $9,500 |
| 12 | 200 | $50,000 | $10,000 | $40,000 |

**Break-even:** Month 2-3

---

## 📦 Deliverables (What You Have)

### Documentation (16 files)
- Business strategy
- Complete UX/UI designs
- Technical architecture
- API specifications
- Implementation roadmap

### Code (Already Built)
- Backend API (Node.js)
- Database schema (PostgreSQL)
- Call handling webhooks
- AI integration
- n8n workflows

### To Build (6 weeks)
- Frontend dashboard (Next.js)
- Onboarding wizard
- Billing integration (Stripe)
- Multi-tenant support

---

## ✅ What Makes This Implementable

**1. Backend Already Works**
- Not starting from scratch
- Proven call handling
- Already integrated: Yandex, LLM, n8n

**2. Use Existing Tools**
- Clerk for auth (not custom)
- Stripe for billing (not custom)
- Vercel for hosting (not servers)
- Supabase for database (not custom)

**3. Clear Scope**
- MVP = 6 weeks
- No over-engineering
- Ship and iterate

**4. Proven Stack**
- Next.js (popular, documented)
- TypeScript (type safety)
- Prisma (easy database)
- Standard patterns

---

## 🎯 Critical Path to Launch

**Must Have (Week 1-6):**
1. Landing page
2. Signup
3. Onboarding
4. Dashboard (view calls)
5. Billing (charge money)

**Nice to Have (Week 7-12):**
6. Advanced analytics
7. Team features
8. Integrations

**Future (Month 4+):**
9. Mobile app
10. Enterprise features
11. Regional expansion

---

## 🚀 START HERE

**TODAY:**
1. Decide: Build yourself, hire, or no-code?
2. If building: `npx create-next-app@latest`
3. If hiring: Post job with specs
4. If no-code: Launch landing page (Framer)

**WEEK 1:**
- Landing page live
- First signup working
- Backend connected

**WEEK 6:**
- Beta launch
- 5-10 paying customers
- Iterate based on feedback

---

## ❓ What's Your Actual Blocker?

Be honest:
- 💻 **Don't know how to code?** → Hire developer
- 💰 **No budget?** → No-code landing + manual onboarding
- ⏰ **No time?** → Hire agency
- 🤔 **Not sure if it'll work?** → Launch landing page, collect emails
- 📝 **Need more specs?** → You have enough, stop speccing!

**Tell me your REAL blocker and I'll give you a practical solution.** 🎯

What is it?