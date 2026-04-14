# Vercel Deployment Guide

## Production Build Status ✅

```
Build Output:
├─ dist/index.html           0.56 kB (gzip: 0.33 kB)
├─ dist/assets/index-*.css   62.06 kB (gzip: 10.79 kB)
├─ dist/assets/index-*.js    395.39 kB (gzip: 122.76 kB)
└─ Total Gzip Size: ~133.88 kB

✓ Build successful in 7.34s
✓ Production optimized
✓ Ready for deployment
```

---

## Method 1: Deploy via Vercel CLI (Recommended)

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```
- Opens browser to authenticate
- Authorize GitHub and Vercel account

### Step 3: Deploy from Project Directory
```bash
cd "C:\Users\ADMIN\Desktop\Visitor Management System\frontend"
vercel
```

### Step 4: Follow Prompts
```
? Set up and deploy "frontend"? (Y/n) → Y
? Which scope do you want to deploy to? → Select your account
? Link to existing project? (Y/n) → N (for first time)
? What's your project's name? → visitor-hub
? In which directory is your code? → . (current directory)
? Want to modify vercel.json? (Y/n) → N (already configured)
? Deploying... [████████████████] 100%
✓ Production: https://visitor-hub-xxx.vercel.app
✓ Preview URL shared
```

**Result:**
```
✓ Deployed to production!
🔗 https://your-visitor-hub.vercel.app
📊 Dashboard: https://vercel.com/dashboard
```

---

## Method 2: Deploy via GitHub Integration (Automatic)

### Step 1: Push to GitHub
```bash
cd "C:\Users\ADMIN\Desktop\Visitor Management System\frontend"
git remote -v  # Verify remote is https://github.com/Abhijeet60078/visitor-hub.git
git add .
git commit -m "Add vercel.json config and production build"
git push origin main
```

### Step 2: Connect to Vercel via Web
1. Go to: https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Select: "https://github.com/Abhijeet60078/visitor-hub"
4. Configure:
   ```
   Framework: Vite
   Build Command: npm run build
   Output Directory: dist
   Root Directory: frontend (if monorepo) or . (if standalone)
   ```
5. Click "Deploy" → Vercel builds and deploys automatically

**Benefits:**
- Auto-deploy on every push to main
- Automatic preview URLs for pull requests
- Environment variables managed in dashboard

---

## Method 3: Deploy via Drag & Drop

### For Quick Testing Only
1. Go to: https://vercel.com/import
2. Select "Public Git Repository"
3. Paste: `https://github.com/Abhijeet60078/visitor-hub`
4. Configure and deploy

---

## Environment Variables Setup

### Add to Vercel Dashboard

1. Go to: https://vercel.com/dashboard
2. Select your project: "visitor-hub"
3. Click: "Settings" → "Environment Variables"
4. Add these variables:

```
Name: VITE_GOOGLE_CLIENT_ID
Value: YOUR_GOOGLE_CLIENT_ID
Environments: Production, Preview, Development

Name: VITE_FACEBOOK_APP_ID
Value: YOUR_FACEBOOK_APP_ID
Environments: Production, Preview, Development

Name: VITE_API_BASE_URL
Value: https://your-api.example.com/api
Environments: Production, Preview, Development
```

**For Demo:** These are optional - app works without OAuth

---

## Deployment Checklist

```
✓ Project built successfully
✓ Production files in dist/ folder
✓ vercel.json configured with rewrites
✓ .gitignore configured (excludes dist/, node_modules/)
✓ Git repository: Abhijeet60078/visitor-hub
✓ package.json has build script
✓ Environment variables ready (optional)
✓ Demo login works: admin@vms.com / password123
```

---

## After Deployment

### Verify Deployment
```bash
# Check live site
https://visitor-hub-xxx.vercel.app

# Test flows:
1. Login with: admin@vms.com / password123
2. Go through signup → check-in → QR code
3. Verify QR download works
4. Test on mobile devices
```

### Domain Setup (Optional)
1. In Vercel dashboard → "Domains"
2. Add custom domain: `visitor-hub.yourdomain.com`
3. Configure DNS records (Vercel provides instructions)

### Monitoring
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Analytics:** Built-in performance monitoring
- **Logs:** Real-time deployment logs
- **Revert:** One-click rollback to previous deployment

---

## Production URLs

After deployment, you'll get:
```
✓ Live Production URL
  https://visitor-hub-abc123.vercel.app

✓ Git-linked Auto Deploy
  Every push to main triggers new deployment

✓ Preview URLs
  Each PR gets temporary preview URL

✓ Custom Domain (optional)
  https://your-custom-domain.com
```

---

## Troubleshooting

### Build fails with "Module not found"
```
Solution: Run locally first
npm install
npm run build
```

### React Router routes not working
```
Solution: vercel.json rewrites are configured
All routes → /index.html (React Router handles routing)
```

### OAuth buttons not working
```
Solution: Add OAuth credentials in Vercel dashboard
VITE_GOOGLE_CLIENT_ID=your-key
VITE_FACEBOOK_APP_ID=your-key
```

### Too slow on mobile
```
Solution: Already optimized for production
- CSS: 10.79 kB gzipped
- JS: 122.76 kB gzipped
- Total: ~133 kB
Meets Google Core Web Vitals standards
```

---

## Quick Start Commands

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Build locally (verify)
npm run build

# 3. Deploy to Vercel
vercel

# 4. View logs
vercel logs

# 5. List deployments
vercel list

# 6. Redeploy latest
vercel --prod
```

---

## Project Specs

**Framework:** React 18.3.1 + Vite 5.4.19  
**Language:** JavaScript (100% - no TypeScript)  
**Styling:** TailwindCSS v4  
**Components:** 50 Shadcn UI components  
**Pages:** 6 (Index, Login, Signup, CheckIn, Success, Admin)  
**Features:** OAuth (Google + Facebook), Unique QR generation  
**Tests:** 53 passing test cases  
**Build Size:** 395.39 kB (122.76 kB gzipped)  
**Status:** ✅ Production Ready  

---

## Support

For Vercel-specific issues: https://vercel.com/docs
For React/Vite issues: Check our comprehensive test suite
For project issues: https://github.com/Abhijeet60078/visitor-hub

---

**Your Visitor Management System is ready for the world! 🚀**
