# 🚀 Bug Tracker MERN - Deployment Guide

This guide walks you through deploying the Bug Tracker application to production using **free hosting services**.

---

## 📋 Pre-Deployment Checklist

Before deploying, ensure you have:

- [ ] A GitHub account with this project pushed to a repository
- [ ] A MongoDB Atlas account (free tier available)
- [ ] A Vercel account (for frontend hosting)
- [ ] A Render account (for backend hosting)

---

## Step 1: Set Up MongoDB Atlas (Database)

### 1.1 Create a MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up or log in
3. Create a new **FREE** cluster (M0 Sandbox)

### 1.2 Configure Database Access
1. Go to **Database Access** → Click **Add New Database User**
2. Create a user with:
   - Username: `bugtracker-admin`
   - Password: Generate a secure password (save it!)
   - Role: `Atlas admin` or `readWriteAnyDatabase`

### 1.3 Configure Network Access
1. Go to **Network Access** → Click **Add IP Address**
2. Click **Allow Access from Anywhere** (for Render to connect)
   - This adds `0.0.0.0/0` to the whitelist

### 1.4 Get Connection String
1. Go to **Database** → Click **Connect**
2. Choose **Connect your application**
3. Copy the connection string:
   ```
   mongodb+srv://bugtracker-admin:<password>@cluster0.xxxxx.mongodb.net/bug-tracker?retryWrites=true&w=majority
   ```
4. Replace `<password>` with your database user password

---

## Step 2: Push Code to GitHub

### 2.1 Initialize Git (if not already done)
```bash
cd bug-tracker-mern
git init
git add .
git commit -m "Initial commit - Bug Tracker MERN"
```

### 2.2 Create GitHub Repository
1. Go to [GitHub](https://github.com) → Click **New Repository**
2. Name it: `bug-tracker-mern`
3. Keep it **Public** (required for free Render/Vercel)
4. Don't add README (we already have one)

### 2.3 Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/bug-tracker-mern.git
git branch -M main
git push -u origin main
```

---

## Step 3: Deploy Backend to Render

### 3.1 Create Render Account
1. Go to [Render](https://render.com)
2. Sign up with your GitHub account

### 3.2 Create New Web Service
1. Click **New +** → **Web Service**
2. Connect your GitHub repository
3. Configure the service:

| Setting | Value |
|---------|-------|
| Name | `bug-tracker-api` |
| Region | Oregon (US West) |
| Branch | `main` |
| Root Directory | `backend` |
| Runtime | Node |
| Build Command | `npm install` |
| Start Command | `node server.js` |
| Plan | **Free** |

### 3.3 Add Environment Variables
In Render dashboard, add these environment variables:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `MONGODB_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | Generate secure key (see below) |
| `FRONTEND_URL` | Leave empty for now (add after frontend deployment) |

**Generate JWT Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3.4 Deploy
1. Click **Create Web Service**
2. Wait for deployment (5-10 minutes)
3. Copy your backend URL: `https://bug-tracker-api.onrender.com`

---

## Step 4: Deploy Frontend to Vercel

### 4.1 Create Vercel Account
1. Go to [Vercel](https://vercel.com)
2. Sign up with your GitHub account

### 4.2 Import Project
1. Click **Add New...** → **Project**
2. Import your `bug-tracker-mern` repository
3. Configure:

| Setting | Value |
|---------|-------|
| Project Name | `bug-tracker` |
| Framework Preset | Vite |
| Root Directory | `frontend` |
| Build Command | `npm run build` |
| Output Directory | `dist` |

### 4.3 Add Environment Variables
Click **Environment Variables** and add:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://YOUR-BACKEND-NAME.onrender.com/api` |

**Example:** `https://bug-tracker-api.onrender.com/api`

### 4.4 Deploy
1. Click **Deploy**
2. Wait for deployment (2-3 minutes)
3. Copy your frontend URL: `https://bug-tracker.vercel.app`

---

## Step 5: Update Backend CORS

### 5.1 Add Frontend URL to Render
1. Go to Render dashboard → Your backend service
2. Go to **Environment** tab
3. Add/Update:
   | Key | Value |
   |-----|-------|
   | `FRONTEND_URL` | `https://bug-tracker.vercel.app` |

4. Click **Save Changes** (this triggers a redeploy)

---

## Step 6: Seed Production Database (Optional)

To add demo data to your production database:

### Option A: Run seed locally pointing to production
```bash
cd backend
# Create a temporary .env with production MongoDB URI
MONGODB_URI="your-atlas-connection-string" npm run seed
```

### Option B: Seed via Render Shell
1. Go to Render dashboard → Your service → **Shell**
2. Run:
   ```bash
   npm run seed
   ```

---

## Step 7: Test Your Deployment

### 7.1 Test Backend API
Open in browser:
```
https://YOUR-BACKEND.onrender.com/api/auth/login
```
Should return: `{"success":false,"message":"Please provide email and password"}`

### 7.2 Test Frontend
1. Open: `https://YOUR-FRONTEND.vercel.app`
2. Try logging in with demo credentials:
   - Email: `demo@bugtracker.com`
   - Password: `demo123`

---

## 🔧 Troubleshooting

### Backend won't start
- Check Render logs for errors
- Verify MONGODB_URI is correct
- Ensure MongoDB Atlas allows connections from anywhere

### CORS Errors
- Verify FRONTEND_URL in Render matches your Vercel URL exactly
- Check for trailing slashes (should NOT have one)

### API calls fail
- Verify VITE_API_URL in Vercel is correct
- Ensure it ends with `/api`
- Redeploy frontend after changing env vars

### Cold Start (Render Free Tier)
- Free tier services spin down after 15 minutes of inactivity
- First request after inactivity takes 30-60 seconds
- This is normal for free tier

---

## 📝 Environment Variables Summary

### Backend (Render)
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/bug-tracker
JWT_SECRET=your-64-character-secret
FRONTEND_URL=https://your-app.vercel.app
```

### Frontend (Vercel)
```env
VITE_API_URL=https://your-backend.onrender.com/api
```

---

## 🎉 You're Done!

Your Bug Tracker is now live at:
- **Frontend:** `https://your-app.vercel.app`
- **Backend API:** `https://your-backend.onrender.com/api`

### Demo Credentials
- Email: `demo@bugtracker.com`
- Password: `demo123`

---

## 📚 Additional Resources

- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [Render Docs](https://render.com/docs)
- [Vercel Docs](https://vercel.com/docs)
