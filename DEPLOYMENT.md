# Taskio Deployment Guide

## Prerequisites
- GitHub account with repository access
- Vercel account (free tier available)
- Render account (free tier available)

---

## Step 1: Deploy Backend to Render

### Push Code to GitHub
```bash
cd taskio-backend
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### Deploy on Render
1. Go to [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your `taskio-backend` repository
4. Render will auto-detect `render.yaml` and `Dockerfile`
   - Or configure manually: **Runtime: Docker**, **Instance Type: Free**

### Configure Environment Variables
Add these in Render's Environment tab:

| Variable | Value | Notes |
|----------|-------|-------|
| `SPRING_PROFILES_ACTIVE` | `prod` | Required |
| `CORS_ALLOWED_ORIGINS` | `https://taskio.vercel.app` | Update with your actual Vercel URL after frontend deployment |
| `PORT` | `8080` | Optional - auto-set by Render |

5. Click "Create Web Service"
6. **Save your Render URL**: `https://taskio-backend.onrender.com`

---

## Step 2: Deploy Frontend to Vercel

### Push Code to GitHub
```bash
cd taskio
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### Deploy on Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your `taskio` repository
4. Vercel will auto-detect Next.js

### Configure Environment Variables
Add this in Vercel's Environment Variables:

| Variable | Value | Example |
|----------|-------|---------|
| `NEXT_PUBLIC_API_URL` | Your Render backend URL + `/api` | `https://taskio-backend.onrender.com/api` |

5. Click "Deploy"
6. **Save your Vercel URL**: `https://taskio.vercel.app`

---

## Step 3: Update CORS Configuration

⚠️ **Critical Step**: After both deployments are complete:

1. Go back to **Render** dashboard
2. Navigate to your backend service → **Environment** tab
3. Update `CORS_ALLOWED_ORIGINS` with your **actual Vercel URL**
   - Example: `https://taskio.vercel.app`
   - For multiple domains: `https://taskio.vercel.app,https://custom-domain.com`
4. Click "Save" and **manually redeploy** the backend

---

## Verification & Testing

### Quick Test
1. Visit your Vercel URL: `https://taskio.vercel.app`
2. Open DevTools (F12) → **Network** tab
3. Create a task
4. Verify API calls show **200 OK** status

### If Something Goes Wrong
- Check **Render logs**: Dashboard → Logs
- Check **Vercel logs**: Deployment → Functions
- Verify environment variables are set correctly
- Ensure both services are deployed

---

## Local Development Setup

Create `.env.local` in the frontend directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

---

## Important Notes

- **Render Free Tier**: Services spin down after 15 minutes of inactivity
  - First request after sleep takes ~30-60 seconds to wake up
- **Database**: Currently using H2 in-memory (data resets on restart)
  - For production, consider PostgreSQL on Render
- **Environment Variables**: Changes require manual redeploy to take effect

---

## Troubleshooting

### CORS Errors
```
Access to fetch... has been blocked by CORS policy
```

**Fix**:
1. Verify `CORS_ALLOWED_ORIGINS` in Render matches your exact Vercel URL (with `https://`)
2. Ensure no trailing slashes: `https://taskio.vercel.app` not `https://taskio.vercel.app/`
3. Redeploy backend after changing environment variables
4. Check Render logs for CORS-related errors

### 404 Not Found
```
GET https://taskio-backend.onrender.com/tasks 404
```

**Fix**:
1. Ensure `NEXT_PUBLIC_API_URL` ends with `/api`
   - ✅ Correct: `https://taskio-backend.onrender.com/api`
   - ❌ Wrong: `https://taskio-backend.onrender.com`
2. Verify backend is deployed and running in Render dashboard
3. Test API directly: `https://taskio-backend.onrender.com/api/tasks`

### Connection Refused / Failed to Fetch
```
net::ERR_CONNECTION_REFUSED
```

**Fix**:
1. Check backend URL is correct in Vercel environment variables
2. Verify Render service is running (might be sleeping)
3. Wait 30-60 seconds for Render to wake up on first request
4. Test backend health: `https://taskio-backend.onrender.com/api/tasks`

### Environment Variables Not Working

**Fix**:
1. **Always redeploy after changing environment variables**
2. **Vercel**: Settings → Environment Variables → Deployments → Redeploy
3. **Render**: Environment → Save Changes → Manual Deploy → Deploy latest commit

### Debugging Tools
- **Browser DevTools**: F12 → Network tab (see all API requests)
- **Render Logs**: Real-time backend logs and errors
- **Vercel Logs**: Deployment and function execution logs
- **Direct API Test**: `curl https://taskio-backend.onrender.com/api/tasks`

---

## Quick Reference

### Your URLs
| Service | URL |
|---------|-----|
| Frontend | `https://taskio.vercel.app` |
| Backend | `https://taskio-backend.onrender.com` |
| API Base | `https://taskio-backend.onrender.com/api` |

### Environment Variables
| Platform | Variable | Value |
|----------|----------|-------|
| **Render** | `CORS_ALLOWED_ORIGINS` | `https://taskio.vercel.app` |
| **Vercel** | `NEXT_PUBLIC_API_URL` | `https://taskio-backend.onrender.com/api` |

### Common Commands
```bash
# Test API directly
curl https://taskio-backend.onrender.com/api/tasks

# Check frontend environment
echo $NEXT_PUBLIC_API_URL

# View Render logs
# Go to: Dashboard → Your Service → Logs
```

**Remember**: Environment variables require a redeploy to take effect!
