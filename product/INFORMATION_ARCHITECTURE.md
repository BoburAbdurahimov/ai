# Information Architecture - AI Call Center SaaS

Complete site map, navigation structure, and user flows.

---

## 🗺️ Site Map

```
CallCenterAI Platform
│
├── 🏠 Public Website (Marketing)
│   ├── Home
│   ├── Features
│   ├── Pricing
│   ├── Use Cases
│   ├── Resources
│   │   ├── Blog
│   │   ├── Documentation
│   │   ├── API Reference
│   │   └── Help Center
│   ├── About Us
│   └── Contact
│
├── 🔐 Authentication
│   ├── Sign Up
│   ├── Sign In
│   ├── Forgot Password
│   ├── Reset Password
│   └── Email Verification
│
├── 🎯 Onboarding Flow (First-time users)
│   ├── Step 1: Welcome & Account Setup
│   ├── Step 2: Business Information
│   ├── Step 3: Phone Number Setup
│   ├── Step 4: AI Configuration
│   ├── Step 5: Test Call
│   └── Step 6: Go Live
│
├── 📊 Main Dashboard (Post-login)
│   │
│   ├── 📈 Overview Dashboard
│   │   ├── Real-time Call Status
│   │   ├── Today's Stats
│   │   ├── Quick Actions
│   │   └── Recent Activity
│   │
│   ├── 📞 Calls
│   │   ├── Live Calls (real-time monitoring)
│   │   ├── Call History
│   │   │   ├── All Calls
│   │   │   ├── Filters (date, language, outcome, duration)
│   │   │   └── Search
│   │   ├── Call Detail View
│   │   │   ├── Recording Player
│   │   │   ├── Transcript
│   │   │   ├── Timeline
│   │   │   ├── Metadata
│   │   │   └── Actions (download, share, flag)
│   │   └── Call Analytics
│   │       ├── Volume Trends
│   │       ├── Duration Analysis
│   │       ├── Outcome Distribution
│   │       └── Language Breakdown
│   │
│   ├── 🤖 AI Assistant
│   │   ├── AI Configuration
│   │   │   ├── Personality & Tone
│   │   │   ├── Knowledge Base
│   │   │   ├── Response Templates
│   │   │   └── Safety Rules
│   │   ├── Training
│   │   │   ├── Upload FAQs
│   │   │   ├── Review Conversations
│   │   │   └── Improve Responses
│   │   └── Testing
│   │       ├── Simulation Mode
│   │       └── Test Scenarios
│   │
│   ├── 👥 Team
│   │   ├── Team Members
│   │   │   ├── List View
│   │   │   ├── Add Member
│   │   │   ├── Edit Roles
│   │   │   └── Remove Member
│   │   ├── Roles & Permissions
│   │   ├── Operator Dashboard (for team members)
│   │   │   ├── Incoming Transfers
│   │   │   ├── My Call Queue
│   │   │   └── My Performance
│   │   └── Team Performance
│   │       ├── Individual Stats
│   │       ├── Leaderboard
│   │       └── Activity Log
│   │
│   ├── 📱 Phone Numbers
│   │   ├── Active Numbers
│   │   ├── Buy New Number
│   │   ├── Number Settings
│   │   │   ├── Forwarding Rules
│   │   │   ├── Business Hours
│   │   │   ├── Voicemail
│   │   │   └── Greeting Message
│   │   └── Number Analytics
│   │
│   ├── 📊 Analytics & Reports
│   │   ├── Dashboard Overview
│   │   ├── Call Analytics
│   │   │   ├── Volume Report
│   │   │   ├── Performance Report
│   │   │   ├── Quality Report
│   │   │   └── Custom Reports
│   │   ├── AI Performance
│   │   │   ├── Resolution Rate
│   │   │   ├── Sentiment Analysis
│   │   │   ├── Common Topics
│   │   │   └── Improvement Areas
│   │   ├── Business Insights
│   │   │   ├── Customer Behavior
│   │   │   ├── Peak Hours
│   │   │   ├── Conversion Funnel
│   │   │   └── ROI Calculator
│   │   └── Export & Scheduling
│   │       ├── Export Data (CSV, PDF)
│   │       ├── Scheduled Reports
│   │       └── Email Delivery
│   │
│   ├── 🔗 Integrations
│   │   ├── Available Integrations
│   │   │   ├── CRM (Bitrix24, amoCRM)
│   │   │   ├── Messaging (Telegram, WhatsApp)
│   │   │   ├── Calendar (Google, Outlook)
│   │   │   └── Payment (Click, Payme)
│   │   ├── Connected Apps
│   │   ├── API Access
│   │   │   ├── API Keys
│   │   │   ├── Webhooks
│   │   │   └── Documentation
│   │   └── Zapier/n8n
│   │
│   ├── 💳 Billing & Usage
│   │   ├── Current Plan
│   │   ├── Usage This Month
│   │   │   ├── Minutes Used
│   │   │   ├── Calls Count
│   │   │   └── Cost Breakdown
│   │   ├── Billing History
│   │   │   ├── Invoices
│   │   │   ├── Payment Methods
│   │   │   └── Receipts
│   │   ├── Upgrade/Downgrade
│   │   └── Payment Settings
│   │       ├── Add Card
│   │       ├── Local Payment (Click, Payme)
│   │       └── Billing Address
│   │
│   ├── ⚙️ Settings
│   │   ├── Account Settings
│   │   │   ├── Profile
│   │   │   ├── Company Info
│   │   │   ├── Timezone & Language
│   │   │   └── Delete Account
│   │   ├── Notification Settings
│   │   │   ├── Email Notifications
│   │   │   ├── SMS Notifications
│   │   │   ├── Telegram Notifications
│   │   │   └── Webhook Notifications
│   │   ├── Security
│   │   │   ├── Change Password
│   │   │   ├── Two-Factor Auth
│   │   │   ├── Active Sessions
│   │   │   └── Audit Log
│   │   └── Preferences
│   │       ├── Dashboard Widgets
│   │       ├── Date Format
│   │       └── Default Filters
│   │
│   └── 📚 Help & Support
│       ├── Getting Started Guide
│       ├── Video Tutorials
│       ├── Knowledge Base
│       ├── Contact Support
│       │   ├── Live Chat
│       │   ├── Submit Ticket
│       │   └── Schedule Call
│       └── Community Forum
│
└── 👔 Admin Panel (Internal use only)
    ├── Customer Management
    ├── System Monitoring
    ├── Feature Flags
    ├── Support Tickets
    └── Analytics
```

---

## 🧭 Primary Navigation Structure

### Top Navigation Bar (Logged In)
```
┌─────────────────────────────────────────────────────────────────┐
│ [Logo] Dashboard | Calls | AI | Team | Analytics | [Search] 🔔 👤│
└─────────────────────────────────────────────────────────────────┘
```

### Sidebar Navigation (Collapsed/Expanded)
```
┌──────────────┐
│ 📈 Dashboard │
│ 📞 Calls     │
│ 🤖 AI        │
│ 👥 Team      │
│ 📱 Numbers   │
│ 📊 Analytics │
│ 🔗 Apps      │
│ 💳 Billing   │
│ ⚙️ Settings  │
│ ─────────────│
│ 📚 Help      │
│ 💬 Support   │
└──────────────┘
```

---

## 👤 User Roles & Permissions

### Role: Owner
**Full access to everything**
- ✅ All dashboard features
- ✅ Billing & subscription
- ✅ Team management
- ✅ Delete account
- ✅ API keys

### Role: Admin
**Manage operations, no billing**
- ✅ All dashboard features
- ✅ Team management
- ✅ AI configuration
- ❌ Billing
- ❌ Delete account

### Role: Manager
**Oversee team and calls**
- ✅ View all calls
- ✅ View analytics
- ✅ Manage team schedule
- ❌ AI configuration
- ❌ Billing

### Role: Operator
**Handle transferred calls**
- ✅ View assigned calls
- ✅ Take live calls
- ✅ View own performance
- ❌ View other operators
- ❌ Configuration

### Role: Viewer
**Read-only access**
- ✅ View dashboard
- ✅ View calls (no recordings)
- ✅ View analytics
- ❌ Make changes
- ❌ Team access

---

This provides the complete site structure. Next, I'll create detailed user flows!
