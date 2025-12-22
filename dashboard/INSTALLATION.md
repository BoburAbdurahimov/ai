# Complete Installation Guide

Everything you need to get the 3D backup dashboard running.

---

## 📋 Prerequisites

- ✅ Node.js 18+ installed
- ✅ npm or yarn
- ✅ Modern browser (Chrome, Firefox, Safari, Edge)
- ✅ CLI tool set up (../cli)
- ✅ Supabase account

---

## 🚀 Step-by-Step Installation

### Step 1: Navigate to Dashboard

```bash
cd dashboard
```

### Step 2: Install All Dependencies

```bash
npm install
```

This installs **everything**, including:
- Next.js 14
- React 18
- TailwindCSS 3.4
- Three.js 0.161
- React Three Fiber 8.15
- Drei 9.95 (Three.js helpers)
- TypeScript
- All UI components

**Expected:** ~300 packages, ~30 seconds

### Step 3: Configure Environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
# Supabase (from your Supabase dashboard)
NEXT_PUBLIC_SUPABASE_URL=https://xyzcompany.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# CLI Paths (MUST BE ABSOLUTE!)
CLI_PATH=/Users/yourname/projects/ai-call-center-mvp/cli/index.js
BACKUP_DIR=/Users/yourname/projects/ai-call-center-mvp/backups
```

**Get absolute paths:**
```bash
# Mac/Linux
cd ../cli && pwd
cd ../backups && pwd

# Windows
cd ..\cli && cd
cd ..\backups && cd
```

### Step 4: Verify Setup

```bash
# Test CLI is accessible
node $CLI_PATH --help

# Should show:
# Usage: rovodev [options] [command]
```

### Step 5: Start Development Server

```bash
npm run dev
```

**Expected output:**
```
   ▲ Next.js 14.2.0
   - Local:        http://localhost:3000
   - ready in 2.5s
```

### Step 6: Open in Browser

Visit: **http://localhost:3000**

---

## ✅ Success Checklist

You should see:

### Dashboard Home
- ✅ Gradient background
- ✅ **3D Backup Visualization** with spinning sphere
- ✅ Animated particle background
- ✅ System status cards (4 cards)
- ✅ Create backup button
- ✅ Recent backups list

### Status Page
- ✅ **3D rotating globe**
- ✅ Glowing ring around globe
- ✅ Particle sparkles
- ✅ Detailed system info

### Test Interactions
- ✅ Drag to rotate 3D scenes
- ✅ Hover over spheres (pulse effect)
- ✅ Auto-rotation works
- ✅ Click "Create Backup" - success!

---

## 🎨 What You Get

### 🌟 3D Visualizations
- **Backup System Overview** - Central sphere + orbiting backups
- **Status Globe** - Rotating health indicator
- **Particle Background** - Subtle animated field
- **Interactive Controls** - Drag, rotate, zoom

### 🎯 Modern UI
- **TailwindCSS** - Responsive, beautiful design
- **Gradient cards** - Professional look
- **Glass morphism** - Frosted glass navbar
- **Smooth animations** - Loading states, transitions

### 🔧 Full Features
- **5 API Routes** - List, create, restore, details, status
- **4 Pages** - Dashboard, Backups, Details, Status
- **8 Components** - Status, List, Restore wizard, etc.
- **5 3D Components** - Sphere, Globe, Particles, Cubes, Background

---

## 🐛 Common Issues

### Issue: Styles Not Loading (Plain HTML)

**Symptoms:** No colors, plain white page

**Solution:**
```bash
# Reinstall Tailwind
npm install -D tailwindcss postcss autoprefixer tailwindcss-animate
npm run dev
```

### Issue: 3D Scenes Show Black Box

**Symptoms:** Black rectangle where 3D should be

**Solutions:**

1. **Check browser support:**
   - Chrome/Edge: ✅ Full support
   - Firefox: ✅ Full support
   - Safari: ✅ Full support (iOS 15+)
   - IE11: ❌ Not supported

2. **Check console for errors:**
   - Press F12 → Console tab
   - Look for Three.js errors

3. **Verify WebGL:**
   - Visit: https://get.webgl.org/
   - Should say "Your browser supports WebGL"

4. **Clear cache:**
   ```bash
   # Stop server (Ctrl+C)
   rm -rf .next
   npm run dev
   ```

### Issue: CLI_PATH Not Found

**Error:**
```
Error: spawn ENOENT
```

**Solutions:**

1. **Use absolute path:**
   ```bash
   # Get absolute path
   cd ../cli && pwd
   # Copy output to .env.local
   ```

2. **Test path:**
   ```bash
   node /your/absolute/path/cli/index.js --help
   ```

3. **Make executable:**
   ```bash
   chmod +x ../cli/index.js
   ```

### Issue: Port 3000 Already in Use

**Error:**
```
Error: listen EADDRINUSE :::3000
```

**Solution:**
```bash
# Option 1: Kill process
lsof -ti:3000 | xargs kill -9

# Option 2: Use different port
npm run dev -- -p 3001
```

### Issue: Dependencies Not Installing

**Error:**
```
npm ERR! code ERESOLVE
```

**Solution:**
```bash
# Force install
npm install --legacy-peer-deps

# Or clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 🎮 Testing 3D Features

### Test 1: Backup Visualization

1. Go to Dashboard home
2. Scroll to "🌌 Backup System Overview"
3. Should see:
   - ✅ Spinning central sphere (green if healthy)
   - ✅ Smaller orbiting spheres
   - ✅ Starfield background
   - ✅ Auto-rotation

**Interact:**
- Click and drag to rotate
- Hover over spheres

### Test 2: Status Globe

1. Go to `/status` page
2. Scroll to "🌍 System Health Visualization"
3. Should see:
   - ✅ Rotating globe
   - ✅ Glowing ring
   - ✅ Sparkle particles
   - ✅ Smooth animation

**Interact:**
- Drag to rotate faster
- Watch auto-rotation

### Test 3: Particle Background

1. Look at page background
2. Should see:
   - ✅ Subtle particles
   - ✅ Slow rotation
   - ✅ Doesn't obstruct content
   - ✅ Fixed position (no scroll)

---

## 📊 Performance Check

### Expected Performance

| Device | FPS | Load Time |
|--------|-----|-----------|
| Desktop (High-end) | 60 | 1-2s |
| Desktop (Mid-range) | 45-60 | 2-3s |
| Laptop | 40-60 | 2-4s |
| Mobile (Modern) | 30-45 | 3-5s |
| Mobile (Older) | 20-30 | 5-8s |

### Monitor Performance

1. **Open DevTools** (F12)
2. **Performance tab** → Record
3. **Interact** with 3D scenes
4. **Stop** recording
5. **Check FPS** - should be 30+ for smooth

### If Performance is Poor

```typescript
// components/3d/AnimatedBackground.tsx
// Reduce particles
const positions = new Float32Array(1000 * 3); // Was 5000

// components/3d/BackupSphere.tsx
// Lower geometry detail
<Sphere args={[1, 32, 32]}>  // Was 64, 64
```

---

## 🚢 Building for Production

### Step 1: Test Build

```bash
npm run build
```

**Expected output:**
```
✓ Compiled successfully
✓ Collecting page data
✓ Generating static pages (4/4)
✓ Finalizing page optimization
```

### Step 2: Test Production Build

```bash
npm run start
```

Visit http://localhost:3000 and test all features.

### Step 3: Deploy

See `DEPLOYMENT.md` for:
- Vercel deployment (5 minutes)
- Docker deployment
- VPS deployment

---

## 🎨 Next Steps

### Immediate
1. ✅ Create your first backup via UI
2. ✅ Test restore wizard
3. ✅ Play with 3D scenes
4. ✅ Try on mobile

### Customization
1. 📝 Change colors in `tailwind.config.ts`
2. 🎨 Modify 3D sphere colors
3. 🔧 Adjust animation speeds
4. 🖼️ Add your logo

### Advanced
1. 🔐 Add authentication (Clerk/NextAuth)
2. 📊 Add analytics dashboard
3. ⏰ Implement scheduled backups
4. 📧 Set up email notifications

---

## 📚 Documentation

| Doc | Purpose |
|-----|---------|
| `QUICK_START.md` | 5-minute setup |
| `SETUP_GUIDE.md` | Detailed setup |
| `3D_FEATURES.md` | 3D visualization guide |
| `DEPLOYMENT.md` | Production deployment |
| `components/3d/README.md` | 3D component API |

---

## 🎓 Learning Path

### Day 1: Get It Running
- ✅ Install dependencies
- ✅ Configure environment
- ✅ Test locally

### Day 2: Explore Features
- ✅ Create backups
- ✅ Test restore
- ✅ Try 3D interactions

### Day 3: Customize
- ✅ Change colors
- ✅ Modify UI
- ✅ Add your branding

### Week 2: Deploy
- ✅ Deploy to Vercel
- ✅ Test in production
- ✅ Share with team

---

## 🆘 Getting Help

### Still Having Issues?

1. **Check documentation:**
   - `SETUP_GUIDE.md` - Setup issues
   - `3D_FEATURES.md` - 3D problems
   - `components/3d/README.md` - Component API

2. **Check logs:**
   - Terminal output
   - Browser console (F12)
   - Network tab

3. **Test components:**
   ```bash
   # Test CLI
   node ../cli/index.js status
   
   # Test API
   curl http://localhost:3000/api/status/health
   ```

4. **Start fresh:**
   ```bash
   rm -rf node_modules .next package-lock.json
   npm install
   npm run dev
   ```

---

## 🎉 You're Ready!

Your dashboard is now ready with:
- ✅ Modern UI with TailwindCSS
- ✅ Stunning 3D visualizations
- ✅ Interactive backup management
- ✅ Real-time system monitoring
- ✅ Production-ready code
- ✅ Comprehensive documentation

**Time to deploy and wow your users!** 🚀✨

---

Need help? Check the docs or create an issue.
Built with ❤️ for AI Call Center MVP
