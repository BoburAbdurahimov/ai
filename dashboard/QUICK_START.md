# Quick Start - 5 Minutes

Get the dashboard running in 5 minutes.

---

## Step 1: Install (1 min)

```bash
cd dashboard
npm install
```

## Step 2: Configure (2 min)

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
# IMPORTANT: Use absolute paths
CLI_PATH=/Users/yourname/path/to/cli/index.js
BACKUP_DIR=/Users/yourname/path/to/backups

# Your Supabase credentials
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-key
```

**Get absolute path:**
```bash
# Mac/Linux
cd ../cli && pwd
# Output: /Users/yourname/projects/ai-call-center-mvp/cli

# Windows
cd ..\cli && cd
# Output: C:\Users\yourname\projects\ai-call-center-mvp\cli
```

## Step 3: Run (1 min)

```bash
npm run dev
```

## Step 4: Open (30 sec)

Visit: **http://localhost:3000**

## Step 5: Test (30 sec)

Click **"Create Backup"** button

---

## ✅ Success Checklist

You should see:
- ✅ Dashboard with 4 status cards
- ✅ Green indicators (if CLI working)
- ✅ Recent backups section
- ✅ Create backup button

---

## 🐛 Not Working?

### Issue: Styles not loading (plain HTML)

**Fix:**
```bash
npm install -D tailwindcss postcss autoprefixer tailwindcss-animate
npm run dev
```

### Issue: CLI_PATH error

**Fix:**
```bash
# Test your CLI path
node /your/absolute/path/cli/index.js --help

# Should see:
# Usage: rovodev [options] [command]
```

### Issue: Port 3000 in use

**Fix:**
```bash
npm run dev -- -p 3001
# Then visit http://localhost:3001
```

---

## 📚 Next Steps

1. **Read full guide**: `SETUP_GUIDE.md`
2. **Deploy to production**: `DEPLOYMENT.md`
3. **Customize**: Change colors in `tailwind.config.ts`

---

That's it! 🎉 You're running a production-ready backup dashboard.
