# API Usage Examples

Complete guide with curl examples and code snippets for all API endpoints.

---

## 🔧 Base URL

```bash
# Development
BASE_URL="http://localhost:3000"

# Production
BASE_URL="https://your-app.vercel.app"
```

---

## 📦 Backup Management

### List All Backups

**Endpoint:** `GET /api/backups/list`

**curl:**
```bash
curl -X GET "$BASE_URL/api/backups/list"
```

**JavaScript:**
```javascript
const response = await fetch(`${BASE_URL}/api/backups/list`);
const data = await response.json();
console.log(data.backups);
```

**Response:**
```json
{
  "success": true,
  "backups": [
    {
      "name": "backup_2025-12-22_14-30-00",
      "path": "/path/to/backups/backup_2025-12-22_14-30-00",
      "date": "2025-12-22T14:30:00.000Z",
      "size": "2.45 MB"
    }
  ],
  "total": 1,
  "cached": false
}
```

### Create New Backup

**Endpoint:** `POST /api/backups/create`

**Full Backup:**
```bash
curl -X POST "$BASE_URL/api/backups/create" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "full",
    "compress": true
  }'
```

**Database Only:**
```bash
curl -X POST "$BASE_URL/api/backups/create" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "database",
    "compress": true
  }'
```

**JavaScript:**
```javascript
const response = await fetch(`${BASE_URL}/api/backups/create`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type: 'full',
    compress: true
  })
});

const data = await response.json();
console.log('Backup created:', data.backup.name);
```

**Response:**
```json
{
  "success": true,
  "backup": {
    "name": "backup_2025-12-22_15-00-00",
    "path": "/path/to/backups/backup_2025-12-22_15-00-00",
    "metadata": {
      "tables": 2,
      "records": 1247,
      "files": 3
    }
  }
}
```

### Get Backup Details

**Endpoint:** `GET /api/backups/[id]/details`

**curl:**
```bash
BACKUP_ID="backup_2025-12-22_14-30-00"
curl -X GET "$BASE_URL/api/backups/$BACKUP_ID/details"
```

**JavaScript:**
```javascript
const backupId = 'backup_2025-12-22_14-30-00';
const response = await fetch(`${BASE_URL}/api/backups/${backupId}/details`);
const data = await response.json();
console.log(data.backup);
```

**Response:**
```json
{
  "success": true,
  "backup": {
    "id": "backup_2025-12-22_14-30-00",
    "name": "backup_2025-12-22_14-30-00",
    "path": "/path/to/backups/backup_2025-12-22_14-30-00",
    "timestamp": "2025-12-22T14:30:00.000Z",
    "version": "1.0.0",
    "components": ["database", "config", "deployment"],
    "results": {
      "database": {
        "tables": 2,
        "records": 1247
      }
    }
  }
}
```

### Restore from Backup

**Endpoint:** `POST /api/backups/[id]/restore`

**Full Restore:**
```bash
BACKUP_ID="backup_2025-12-22_14-30-00"
curl -X POST "$BASE_URL/api/backups/$BACKUP_ID/restore" \
  -H "Content-Type: application/json" \
  -d '{
    "components": ["database", "config", "deployment"],
    "force": true
  }'
```

**Database Only:**
```bash
curl -X POST "$BASE_URL/api/backups/$BACKUP_ID/restore" \
  -H "Content-Type: application/json" \
  -d '{
    "components": ["database"],
    "force": true
  }'
```

**JavaScript:**
```javascript
const backupId = 'backup_2025-12-22_14-30-00';
const response = await fetch(`${BASE_URL}/api/backups/${backupId}/restore`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    components: ['database', 'config'],
    force: true
  })
});

const data = await response.json();
console.log('Restored:', data.restored);
```

**Response:**
```json
{
  "success": true,
  "restored": {
    "tablesRestored": 2,
    "recordsRestored": 1247,
    "filesRestored": 3
  }
}
```

### Get Backup Statistics

**Endpoint:** `GET /api/backups/stats`

**curl:**
```bash
curl -X GET "$BASE_URL/api/backups/stats"
```

**JavaScript:**
```javascript
const response = await fetch(`${BASE_URL}/api/backups/stats`);
const data = await response.json();
console.log('Total backups:', data.total);
console.log('Total size:', data.totalSize);
```

**Response:**
```json
{
  "success": true,
  "total": 10,
  "totalSize": 25600000,
  "oldest": {
    "name": "backup_2025-12-15_02-00-00",
    "date": "2025-12-15T02:00:00.000Z"
  },
  "newest": {
    "name": "backup_2025-12-22_14-30-00",
    "date": "2025-12-22T14:30:00.000Z"
  },
  "byDay": {
    "2025-12-22": 3,
    "2025-12-21": 2,
    "2025-12-20": 1
  },
  "sizeDistribution": {
    "small": 2,
    "medium": 5,
    "large": 3,
    "xlarge": 0
  }
}
```

---

## 📅 Backup Scheduling

### List Schedules

**Endpoint:** `GET /api/backups/schedule`

**curl:**
```bash
curl -X GET "$BASE_URL/api/backups/schedule"
```

**Response:**
```json
{
  "success": true,
  "schedules": [
    {
      "id": "schedule_1703257200000",
      "name": "Daily Backup",
      "cron": "0 2 * * *",
      "type": "full",
      "enabled": true,
      "compress": true,
      "retentionDays": 30,
      "lastRun": "2025-12-22T02:00:00.000Z",
      "nextRun": "2025-12-23T02:00:00.000Z"
    }
  ],
  "total": 1
}
```

### Create Schedule

**Endpoint:** `POST /api/backups/schedule`

**curl:**
```bash
curl -X POST "$BASE_URL/api/backups/schedule" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Daily Backup",
    "cron": "0 2 * * *",
    "type": "full",
    "enabled": true,
    "compress": true,
    "retentionDays": 30
  }'
```

**Common Cron Patterns:**
```bash
# Every hour
"0 * * * *"

# Daily at 2 AM
"0 2 * * *"

# Every Sunday at 3 AM
"0 3 * * 0"

# Every 6 hours
"0 */6 * * *"

# First day of month at midnight
"0 0 1 * *"
```

### Update Schedule

**Endpoint:** `PUT /api/backups/schedule`

**curl:**
```bash
curl -X PUT "$BASE_URL/api/backups/schedule" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "schedule_1703257200000",
    "enabled": false
  }'
```

### Delete Schedule

**Endpoint:** `DELETE /api/backups/schedule`

**curl:**
```bash
SCHEDULE_ID="schedule_1703257200000"
curl -X DELETE "$BASE_URL/api/backups/schedule?id=$SCHEDULE_ID"
```

---

## 📊 System Monitoring

### Health Check

**Endpoint:** `GET /api/status/health`

**Basic Check:**
```bash
curl -X GET "$BASE_URL/api/status/health"
```

**Verbose Check:**
```bash
curl -X GET "$BASE_URL/api/status/health?verbose=true"
```

**JavaScript:**
```javascript
const response = await fetch(`${BASE_URL}/api/status/health?verbose=true`);
const data = await response.json();

if (data.status.database.connected) {
  console.log('✓ Database is connected');
} else {
  console.error('✗ Database is disconnected');
}
```

**Response:**
```json
{
  "success": true,
  "status": {
    "database": {
      "connected": true,
      "tables": 2,
      "totalRecords": 1247,
      "lastUpdate": "2025-12-22T14:30:00.000Z"
    },
    "config": {
      "complete": true,
      "missing": []
    },
    "deployment": {
      "healthy": true,
      "status": "running",
      "url": "https://your-app.vercel.app"
    },
    "services": {
      "supabase": {
        "status": "ok",
        "message": "Connected"
      },
      "yandex": {
        "status": "ok",
        "message": "Reachable"
      }
    }
  }
}
```

---

## 🔔 Webhooks

### Backup Complete Webhook

**Endpoint:** `POST /api/webhooks/backup-complete`

**curl:**
```bash
curl -X POST "$BASE_URL/api/webhooks/backup-complete" \
  -H "Content-Type: application/json" \
  -H "x-webhook-signature: your-secret-key" \
  -d '{
    "backupId": "backup_2025-12-22_14-30-00",
    "status": "completed",
    "metadata": {
      "tables": 2,
      "records": 1247,
      "duration": "15s"
    }
  }'
```

**Node.js Webhook Handler:**
```javascript
const express = require('express');
const app = express();

app.post('/webhooks/backup-complete', (req, res) => {
  const signature = req.headers['x-webhook-signature'];
  
  // Verify signature
  if (signature !== process.env.WEBHOOK_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { backupId, status, metadata } = req.body;
  
  // Process webhook
  console.log(`Backup ${backupId} ${status}`);
  
  res.json({ success: true });
});
```

---

## 🔐 Authentication Examples

### API Key (Future)

**curl:**
```bash
curl -X GET "$BASE_URL/api/backups/list" \
  -H "x-api-key: your-api-key-here"
```

### Bearer Token (Future)

**curl:**
```bash
curl -X GET "$BASE_URL/api/backups/list" \
  -H "Authorization: Bearer your-token-here"
```

**JavaScript:**
```javascript
const response = await fetch(`${BASE_URL}/api/backups/list`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

---

## 🚨 Error Handling

### Error Response Format

```json
{
  "success": false,
  "error": "Validation failed",
  "code": "VALIDATION_ERROR",
  "fields": {
    "type": "Invalid backup type"
  }
}
```

### Common Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `VALIDATION_ERROR` | 400 | Invalid input data |
| `UNAUTHORIZED` | 401 | Missing or invalid auth |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |

### Handle Errors

**JavaScript:**
```javascript
try {
  const response = await fetch(`${BASE_URL}/api/backups/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'invalid' })
  });

  const data = await response.json();

  if (!data.success) {
    console.error(`Error: ${data.error}`);
    if (data.fields) {
      console.error('Field errors:', data.fields);
    }
  }
} catch (error) {
  console.error('Network error:', error);
}
```

**Python:**
```python
import requests

try:
    response = requests.post(
        f"{BASE_URL}/api/backups/create",
        json={"type": "full", "compress": True}
    )
    
    data = response.json()
    
    if not data["success"]:
        print(f"Error: {data['error']}")
    else:
        print(f"Backup created: {data['backup']['name']}")
        
except requests.exceptions.RequestException as e:
    print(f"Network error: {e}")
```

---

## 🔄 Rate Limiting

### Rate Limit Headers (Future)

```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1703257800
```

### Handle Rate Limits

**JavaScript:**
```javascript
async function createBackupWithRetry(maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    const response = await fetch(`${BASE_URL}/api/backups/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'full' })
    });

    if (response.status === 429) {
      // Rate limited, wait and retry
      const retryAfter = response.headers.get('Retry-After') || 60;
      console.log(`Rate limited, waiting ${retryAfter}s...`);
      await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
      continue;
    }

    return await response.json();
  }

  throw new Error('Max retries exceeded');
}
```

---

## 📱 Integration Examples

### React Hook

```typescript
// hooks/useBackups.ts
import { useState, useEffect } from 'react';

export function useBackups() {
  const [backups, setBackups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBackups();
  }, []);

  async function fetchBackups() {
    try {
      const res = await fetch('/api/backups/list');
      const data = await res.json();
      setBackups(data.backups);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function createBackup(type = 'full') {
    const res = await fetch('/api/backups/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, compress: true })
    });
    const data = await res.json();
    
    if (data.success) {
      await fetchBackups(); // Refresh list
    }
    
    return data;
  }

  return { backups, loading, error, createBackup, refresh: fetchBackups };
}
```

### Vue.js Composable

```typescript
// composables/useBackups.ts
import { ref } from 'vue';

export function useBackups() {
  const backups = ref([]);
  const loading = ref(true);

  async function fetchBackups() {
    const res = await fetch('/api/backups/list');
    const data = await res.json();
    backups.value = data.backups;
    loading.value = false;
  }

  fetchBackups();

  return { backups, loading, fetchBackups };
}
```

### Python Client

```python
import requests

class BackupClient:
    def __init__(self, base_url):
        self.base_url = base_url
    
    def list_backups(self):
        response = requests.get(f"{self.base_url}/api/backups/list")
        return response.json()
    
    def create_backup(self, type='full', compress=True):
        response = requests.post(
            f"{self.base_url}/api/backups/create",
            json={'type': type, 'compress': compress}
        )
        return response.json()
    
    def restore_backup(self, backup_id, components=None):
        if components is None:
            components = ['database', 'config', 'deployment']
        
        response = requests.post(
            f"{self.base_url}/api/backups/{backup_id}/restore",
            json={'components': components, 'force': True}
        )
        return response.json()

# Usage
client = BackupClient('https://your-app.vercel.app')
backups = client.list_backups()
print(f"Total backups: {backups['total']}")
```

---

## 🧪 Testing

### Postman Collection

Save as `backup-api.postman_collection.json`:

```json
{
  "info": {
    "name": "Backup Management API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "List Backups",
      "request": {
        "method": "GET",
        "url": "{{baseUrl}}/api/backups/list"
      }
    },
    {
      "name": "Create Backup",
      "request": {
        "method": "POST",
        "url": "{{baseUrl}}/api/backups/create",
        "body": {
          "mode": "raw",
          "raw": "{\"type\": \"full\", \"compress\": true}"
        }
      }
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3000"
    }
  ]
}
```

### Jest Tests

```typescript
describe('Backup API', () => {
  it('should list backups', async () => {
    const response = await fetch('/api/backups/list');
    const data = await response.json();
    
    expect(data.success).toBe(true);
    expect(Array.isArray(data.backups)).toBe(true);
  });

  it('should create backup', async () => {
    const response = await fetch('/api/backups/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'full' })
    });
    const data = await response.json();
    
    expect(data.success).toBe(true);
    expect(data.backup.name).toMatch(/^backup_\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}$/);
  });
});
```

---

## 📚 Additional Resources

- [BACKEND.md](./BACKEND.md) - Backend architecture
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide
- [README.md](./README.md) - Project overview

---

Need help? Check the troubleshooting section in `SETUP_GUIDE.md`
