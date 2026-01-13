# Taskio Deployment Guide

## Frontend Deployment (Vercel)

### Prerequisites
- GitHub account with your code pushed
- Vercel account (free tier available)

### Steps:

1. **Push your code to GitHub** (if not already done):
   ```bash
   cd c:\Users\pawel.pawluk\dev\github.com\p2well\taskio
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your `taskio` repository
   - Vercel will auto-detect Next.js
   - Add environment variable:
     - Name: `NEXT_PUBLIC_API_URL`
     - Value: (leave empty for now, update after backend deployment)
   - Click "Deploy"

3. **After deployment, note your Vercel URL** (e.g., `https://taskio-xxx.vercel.app`)

---

## Backend Deployment (Render)

### Prerequisites
- GitHub account with your code pushed
- Render account (free tier available)

### Steps:

1. **Push your backend code to GitHub** (if not already done):
   ```bash
   cd c:\Users\pawel.pawluk\dev\github.com\p2well\taskio-backend
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Deploy to Render**:
   - Go to [render.com](https://render.com)
   - Click "New +" → "Web Service"
   - Connect your `taskio-backend` repository
   - Render will automatically detect `render.yaml` and `Dockerfile`
   - Or configure manually:
     - **Name**: taskio-backend
     - **Runtime**: Docker
     - **Instance Type**: Free
     - Dockerfile will handle build and run automatically

3. **Add Environment Variables** in Render:
   - `SPRING_PROFILES_ACTIVE`: `prod`
   - `CORS_ALLOWED_ORIGINS`: `https://taskio-xxx.vercel.app` (use your Vercel URL)
   - `PORT`: `8080`

4. **Click "Create Web Service"**

5. **Note your Render URL** (e.g., `https://taskio-backend.onrender.com`)

---

## Final Configuration

### Update Vercel Environment Variable:
1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add/Update:
   - `NEXT_PUBLIC_API_URL`: `https://taskio-backend.onrender.com/api`
4. Redeploy your frontend

### Update Render CORS:
1. Go to your Render service
2. Navigate to "Environment"
3. Update `CORS_ALLOWED_ORIGINS` with your actual Vercel domain

---

## Important Notes

- **Render Free Tier**: Spins down after 15 minutes of inactivity (first request may be slow)
- **Database**: Currently using H2 in-memory (data resets on restart)
- **For production**: Consider upgrading to PostgreSQL on Render

## Testing Your Deployment

1. Visit your Vercel URL: `https://taskio-xxx.vercel.app`
2. Create a task to test frontend-backend connection
3. Check Render logs if issues occur: Dashboard → Logs

## Local Environment Setup

Create a `.env.local` file in the frontend directory:
```bash
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```
