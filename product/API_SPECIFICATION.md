# API Specification - AI Call Center SaaS

Complete REST API documentation with request/response examples.

---

## 🌐 API Overview

**Base URL:** `https://api.callcenterai.uz/v1`

**Authentication:** Bearer JWT token in `Authorization` header

**Rate Limiting:** 
- Authenticated: 1000 requests/hour
- Unauthenticated: 100 requests/hour

**Versioning:** URL-based (`/v1`, `/v2`)

**Response Format:** JSON

**Error Handling:** Standard HTTP status codes + detailed error objects

---

## 🔐 Authentication

### POST /auth/signup
Create new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "Aziz Karimov",
  "organizationName": "My Business",
  "industry": "ecommerce"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "usr_abc123",
      "email": "user@example.com",
      "name": "Aziz Karimov"
    },
    "organization": {
      "id": "org_xyz789",
      "name": "My Business",
      "slug": "my-business"
    },
    "tokens": {
      "accessToken": "eyJhbGc...",
      "refreshToken": "eyJhbGc...",
      "expiresIn": 3600
    }
  }
}
```

### POST /auth/login
Login existing user.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "usr_abc123",
      "email": "user@example.com",
      "name": "Aziz Karimov",
      "organizationId": "org_xyz789",
      "role": "OWNER"
    },
    "tokens": {
      "accessToken": "eyJhbGc...",
      "refreshToken": "eyJhbGc...",
      "expiresIn": 3600
    }
  }
}
```

### POST /auth/refresh
Refresh access token.

**Request:**
```json
{
  "refreshToken": "eyJhbGc..."
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGc...",
    "expiresIn": 3600
  }
}
```

### POST /auth/logout
Logout and invalidate tokens.

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## 👤 Users

### GET /users/me
Get current user profile.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "usr_abc123",
    "email": "user@example.com",
    "name": "Aziz Karimov",
    "avatar": "https://cdn.example.com/avatars/abc123.jpg",
    "organizationId": "org_xyz789",
    "role": "OWNER",
    "language": "ru",
    "notificationPrefs": {
      "email": true,
      "telegram": true,
      "sms": false
    },
    "createdAt": "2024-12-01T10:00:00Z",
    "lastSeenAt": "2024-12-22T15:30:00Z"
  }
}
```

### PATCH /users/me
Update current user profile.

**Request:**
```json
{
  "name": "Aziz Karimov Updated",
  "language": "uz",
  "notificationPrefs": {
    "email": true,
    "telegram": true,
    "sms": true
  }
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "usr_abc123",
    "name": "Aziz Karimov Updated",
    "language": "uz",
    "updatedAt": "2024-12-22T15:35:00Z"
  }
}
```

### GET /users
List organization users (Admin+).

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 20, max: 100)
- `role` (string, optional)
- `search` (string, optional)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "usr_abc123",
        "email": "user@example.com",
        "name": "Aziz Karimov",
        "role": "OWNER",
        "isActive": true,
        "lastSeenAt": "2024-12-22T15:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 5,
      "pages": 1
    }
  }
}
```

### POST /users
Invite new user to organization (Admin+).

**Request:**
```json
{
  "email": "newuser@example.com",
  "name": "Dilnoza Rashidova",
  "role": "OPERATOR"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "id": "usr_def456",
    "email": "newuser@example.com",
    "name": "Dilnoza Rashidova",
    "role": "OPERATOR",
    "invitationSent": true
  }
}
```

---

## 📞 Calls

### GET /calls
List calls with filtering and pagination.

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 20)
- `startDate` (ISO 8601 date)
- `endDate` (ISO 8601 date)
- `language` (string: "RU" | "UZ")
- `handledBy` (string: "AI" | "HUMAN" | "HYBRID")
- `outcome` (string: "INFO" | "BOOKING" | "TRANSFER" | "MISSED")
- `search` (string: search by caller number)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "calls": [
      {
        "id": "call_abc123",
        "callId": "call_abc123",
        "callerNumber": "+998901234567",
        "phoneNumber": "+998711234567",
        "language": "RU",
        "handledBy": "AI",
        "outcome": "BOOKING",
        "durationSeconds": 222,
        "startedAt": "2024-12-22T10:30:00Z",
        "endedAt": "2024-12-22T10:33:42Z",
        "aiConfidence": 87.5,
        "sentiment": "positive"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 1247,
      "pages": 63
    },
    "stats": {
      "totalCalls": 1247,
      "aiHandled": 1085,
      "humanTransfers": 162,
      "avgDuration": 195
    }
  }
}
```

### GET /calls/:id
Get detailed call information.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "call_abc123",
    "callId": "call_abc123",
    "callerNumber": "+998901234567",
    "phoneNumber": "+998711234567",
    "direction": "INBOUND",
    "status": "COMPLETED",
    "language": "RU",
    "handledBy": "AI",
    "outcome": "BOOKING",
    "outcomeDetails": "Appointment booked for Saturday 11 AM",
    "durationSeconds": 222,
    "startedAt": "2024-12-22T10:30:00Z",
    "endedAt": "2024-12-22T10:33:42Z",
    "recordingUrl": "https://cdn.example.com/recordings/call_abc123.mp3",
    "recordingDuration": 222,
    "transcript": [
      {
        "timestamp": "00:00",
        "speaker": "AI",
        "text": "Здравствуйте! Это CallCenter компании. Чем могу помочь?"
      },
      {
        "timestamp": "00:08",
        "speaker": "CALLER",
        "text": "Здравствуйте, я хочу записаться на прием."
      }
    ],
    "aiConfidence": 87.5,
    "sentiment": "positive",
    "intentDetected": "appointment_booking",
    "topics": ["booking", "appointment", "saturday"],
    "callQuality": 5,
    "events": [
      {
        "eventType": "start",
        "timestamp": "2024-12-22T10:30:00Z"
      },
      {
        "eventType": "language_selected",
        "eventData": { "language": "RU" },
        "timestamp": "2024-12-22T10:30:05Z"
      }
    ],
    "notes": [],
    "tags": ["appointment", "booking", "weekend"]
  }
}
```

### GET /calls/:id/recording
Download call recording.

**Response:** `302 Redirect` to signed S3 URL

### POST /calls/:id/notes
Add note to call.

**Request:**
```json
{
  "content": "Customer mentioned they need wheelchair access. Follow up needed."
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "id": "note_xyz789",
    "callId": "call_abc123",
    "content": "Customer mentioned they need wheelchair access. Follow up needed.",
    "createdBy": {
      "id": "usr_abc123",
      "name": "Aziz Karimov"
    },
    "createdAt": "2024-12-22T15:40:00Z"
  }
}
```

### POST /calls/:id/tags
Add tag to call.

**Request:**
```json
{
  "tag": "wheelchair-access"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "callId": "call_abc123",
    "tag": "wheelchair-access"
  }
}
```

### GET /calls/live
Get currently active calls.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "activeCalls": [
      {
        "id": "call_live123",
        "callId": "call_live123",
        "callerNumber": "+998901234567",
        "phoneNumber": "+998711234567",
        "language": "RU",
        "handledBy": "AI",
        "status": "ACTIVE",
        "durationSeconds": 45,
        "currentTranscript": [
          {
            "speaker": "AI",
            "text": "Здравствуйте! Чем могу помочь?"
          },
          {
            "speaker": "CALLER",
            "text": "Я хочу узнать ваши часы работы"
          }
        ],
        "aiConfidence": 92.0,
        "startedAt": "2024-12-22T15:40:00Z"
      }
    ],
    "count": 1
  }
}
```

---

## 🤖 AI Configuration

### GET /ai/config
Get AI configuration.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "assistantName": "Ассистент",
    "tone": "professional",
    "speakingStyle": "balanced",
    "greetingMessage": "Здравствуйте! Это виртуальный ассистент компании. Чем могу помочь?",
    "closingMessage": "Спасибо за звонок! До свидания!",
    "transferRules": {
      "confidenceThreshold": 70,
      "maxDuration": 300,
      "alwaysTransferUzbek": true,
      "transferOnRequest": true
    },
    "transferDestination": "queue",
    "safetyRules": {
      "forbiddenTopics": ["prices", "medical_advice"],
      "requireDisclaimers": true
    },
    "enableSentiment": true,
    "enableIntent": true,
    "updatedAt": "2024-12-20T10:00:00Z"
  }
}
```

### PATCH /ai/config
Update AI configuration.

**Request:**
```json
{
  "tone": "friendly",
  "greetingMessage": "Здравствуйте! Я ваш виртуальный помощник. Как я могу вам помочь сегодня?",
  "transferRules": {
    "confidenceThreshold": 75,
    "maxDuration": 240
  }
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "assistantName": "Ассистент",
    "tone": "friendly",
    "greetingMessage": "Здравствуйте! Я ваш виртуальный помощник. Как я могу вам помочь сегодня?",
    "updatedAt": "2024-12-22T15:45:00Z"
  }
}
```

### POST /ai/test
Test AI with simulated conversation.

**Request:**
```json
{
  "userMessage": "Какие у вас часы работы?",
  "language": "ru"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "aiResponse": "Мы работаем с понедельника по пятницу с 9:00 до 18:00, в субботу с 10:00 до 15:00. Воскресенье - выходной день.",
    "confidence": 95.5,
    "intentDetected": "business_hours_inquiry",
    "sentiment": "neutral",
    "responseTime": 1250
  }
}
```

---

## 📚 Knowledge Base

### GET /knowledge
List knowledge base items.

**Query Parameters:**
- `page` (number)
- `limit` (number)
- `category` (string)
- `search` (string)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "kb_abc123",
        "category": "general",
        "question": "What are your business hours?",
        "answer": "We're open Monday to Friday from 9 AM to 6 PM...",
        "questionVariations": [
          "When are you open?",
          "What time do you close?"
        ],
        "usageCount": 47,
        "lastUsedAt": "2024-12-22T14:30:00Z",
        "isPriority": true,
        "isActive": true
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 127,
      "pages": 7
    }
  }
}
```

### POST /knowledge
Add new knowledge item.

**Request:**
```json
{
  "category": "delivery",
  "question": "Do you offer delivery?",
  "answer": "Yes, we offer free delivery within Tashkent for orders over 50,000 som.",
  "questionVariations": [
    "Can you deliver?",
    "Is delivery available?"
  ],
  "isPriority": false
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "id": "kb_new123",
    "category": "delivery",
    "question": "Do you offer delivery?",
    "answer": "Yes, we offer free delivery within Tashkent for orders over 50,000 som.",
    "createdAt": "2024-12-22T15:50:00Z"
  }
}
```

### PATCH /knowledge/:id
Update knowledge item.

**Request:**
```json
{
  "answer": "Yes, we offer free delivery within Tashkent for orders over 50,000 som. Delivery takes 1-3 business days."
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "kb_new123",
    "answer": "Yes, we offer free delivery within Tashkent for orders over 50,000 som. Delivery takes 1-3 business days.",
    "updatedAt": "2024-12-22T15:55:00Z"
  }
}
```

### DELETE /knowledge/:id
Delete knowledge item.

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Knowledge item deleted successfully"
}
```

---

## 📱 Phone Numbers

### GET /phone-numbers
List phone numbers.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "phoneNumbers": [
      {
        "id": "pn_abc123",
        "number": "+998711234567",
        "displayName": "Main Line",
        "provider": "vapi",
        "country": "UZ",
        "isActive": true,
        "businessHours": {
          "monday": { "open": "09:00", "close": "18:00" },
          "tuesday": { "open": "09:00", "close": "18:00" }
        },
        "afterHoursAction": "voicemail",
        "createdAt": "2024-12-01T10:00:00Z"
      }
    ]
  }
}
```

### POST /phone-numbers
Purchase new phone number.

**Request:**
```json
{
  "country": "UZ",
  "city": "Tashkent",
  "displayName": "Support Line"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "id": "pn_new123",
    "number": "+998715551234",
    "displayName": "Support Line",
    "provider": "vapi",
    "monthlyCost": 10.00,
    "isActive": true
  }
}
```

---

## 📊 Analytics

### GET /analytics/overview
Get analytics overview.

**Query Parameters:**
- `startDate` (ISO 8601)
- `endDate` (ISO 8601)
- `granularity` (string: "hour" | "day" | "week" | "month")

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "period": {
      "start": "2024-12-01T00:00:00Z",
      "end": "2024-12-22T23:59:59Z"
    },
    "metrics": {
      "totalCalls": 1247,
      "aiHandledCalls": 1085,
      "aiResolutionRate": 87.0,
      "humanTransfers": 162,
      "bookings": 156,
      "missedCalls": 34,
      "avgDuration": 195,
      "avgSatisfaction": 92.5,
      "totalMinutes": 4042
    },
    "languages": {
      "RU": 873,
      "UZ": 374
    },
    "outcomes": {
      "INFO": 789,
      "BOOKING": 156,
      "TRANSFER": 162,
      "MISSED": 34,
      "OTHER": 106
    },
    "trends": [
      {
        "date": "2024-12-01",
        "calls": 52,
        "aiResolutionRate": 85.0
      },
      {
        "date": "2024-12-02",
        "calls": 58,
        "aiResolutionRate": 86.2
      }
    ],
    "peakHours": [
      { "hour": 10, "calls": 142 },
      { "hour": 11, "calls": 156 },
      { "hour": 14, "calls": 138 }
    ]
  }
}
```

### GET /analytics/calls
Get call volume analytics.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "volumeByDay": [
      { "date": "2024-12-15", "count": 52 },
      { "date": "2024-12-16", "count": 58 }
    ],
    "volumeByHour": [
      { "hour": 9, "count": 89 },
      { "hour": 10, "count": 142 }
    ],
    "avgDurationTrend": [
      { "date": "2024-12-15", "avgSeconds": 185 },
      { "date": "2024-12-16", "avgSeconds": 192 }
    ]
  }
}
```

### GET /analytics/ai-performance
Get AI performance metrics.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "resolutionRate": 87.0,
    "resolutionTrend": [
      { "date": "2024-12-15", "rate": 85.0 },
      { "date": "2024-12-16", "rate": 86.2 }
    ],
    "avgConfidence": 85.5,
    "transferReasons": [
      { "reason": "complex_question", "count": 42, "percentage": 26 },
      { "reason": "uzbek_language", "count": 38, "percentage": 23 },
      { "reason": "low_confidence", "count": 32, "percentage": 20 }
    ],
    "topTopics": [
      { "topic": "business_hours", "count": 178 },
      { "topic": "booking", "count": 156 },
      { "topic": "pricing", "count": 89 }
    ],
    "sentimentDistribution": {
      "positive": 65,
      "neutral": 28,
      "negative": 7
    }
  }
}
```

---

## 💳 Billing

### GET /billing/subscription
Get current subscription.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "plan": "PROFESSIONAL",
    "status": "ACTIVE",
    "currentPeriodStart": "2024-12-01T00:00:00Z",
    "currentPeriodEnd": "2024-12-31T23:59:59Z",
    "cancelAtPeriodEnd": false,
    "usage": {
      "minutes": 4042,
      "minutesIncluded": 2000,
      "overageMinutes": 2042,
      "overageCost": 204.20
    },
    "nextBillingDate": "2025-01-01T00:00:00Z",
    "nextBillingAmount": 503.20
  }
}
```

### POST /billing/subscription/upgrade
Upgrade subscription plan.

**Request:**
```json
{
  "plan": "BUSINESS"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "plan": "BUSINESS",
    "status": "ACTIVE",
    "effectiveDate": "2024-12-23T00:00:00Z",
    "proratedAmount": 166.67
  }
}
```

### GET /billing/invoices
List invoices.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "invoices": [
      {
        "id": "inv_abc123",
        "invoiceNumber": "INV-2024-12-001",
        "amount": 29900,
        "currency": "USD",
        "status": "paid",
        "periodStart": "2024-12-01",
        "periodEnd": "2024-12-31",
        "paidAt": "2024-12-01T10:00:00Z",
        "invoiceUrl": "https://example.com/invoices/inv_abc123",
        "invoicePdf": "https://example.com/invoices/inv_abc123.pdf"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 3
    }
  }
}
```

---

## 🔗 Integrations

### GET /integrations
List integrations.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "integrations": [
      {
        "id": "int_abc123",
        "type": "bitrix24",
        "name": "Bitrix24 CRM",
        "isActive": true,
        "lastSyncAt": "2024-12-22T15:30:00Z",
        "config": {
          "webhookUrl": "https://example.bitrix24.com/webhook/..."
        }
      }
    ]
  }
}
```

### POST /integrations
Add new integration.

**Request:**
```json
{
  "type": "telegram",
  "name": "Telegram Notifications",
  "config": {
    "botToken": "123456:ABC-DEF...",
    "chatId": "123456789"
  }
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "id": "int_new123",
    "type": "telegram",
    "name": "Telegram Notifications",
    "isActive": true,
    "createdAt": "2024-12-22T16:00:00Z"
  }
}
```

---

## ❌ Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request parameters",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

**Error Codes:**
- `VALIDATION_ERROR` (400) - Invalid input
- `UNAUTHORIZED` (401) - Missing or invalid auth token
- `FORBIDDEN` (403) - Insufficient permissions
- `NOT_FOUND` (404) - Resource not found
- `CONFLICT` (409) - Resource already exists
- `RATE_LIMIT_EXCEEDED` (429) - Too many requests
- `INTERNAL_ERROR` (500) - Server error

---

This completes the API specification! Next, I'll create authentication and billing system specs.
