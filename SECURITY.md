# Security Checklist for Taskio

## ✅ Current Security Measures

### Frontend (Vercel)
- [x] Environment variables stored in Vercel dashboard (not in code)
- [x] `.env*` files gitignored
- [x] HTTPS enforced by default on Vercel
- [x] API URL configured via environment variable

### Backend (Render)
- [x] No hardcoded secrets in code
- [x] CORS configured via environment variable (must be set)
- [x] H2 console disabled in production
- [x] SQL query logging disabled in production
- [x] Database credentials use environment variables

## ⚠️ Important Configuration Required

### 1. Set CORS_ALLOWED_ORIGINS in Render
**REQUIRED** - Your backend will not work without this:
```
CORS_ALLOWED_ORIGINS=https://your-app.vercel.app
```

### 2. For Production Database (Recommended)
Current setup uses H2 in-memory (data is lost on restart). For production:

1. **Add PostgreSQL database in Render**
2. **Set these environment variables**:
   ```
   DB_URL=jdbc:postgresql://...
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   ```
3. **Update application-prod.properties** to use these variables

## 🔒 Security Best Practices Implemented

1. **No Secrets in Git**
   - All sensitive data uses environment variables
   - `.gitignore` excludes `.env*` files
   - Configuration files use placeholders like `${CORS_ALLOWED_ORIGINS}`

2. **Principle of Least Privilege**
   - Database user has minimal necessary permissions
   - H2 console disabled in production

3. **CORS Protection**
   - Must explicitly set allowed origins
   - No wildcard (*) origins allowed
   - Credentials handling configured properly

4. **Environment Separation**
   - Separate profiles for dev/prod
   - Production settings in `application-prod.properties`

## 🚨 Before Going to Production

- [ ] Replace H2 with PostgreSQL
- [ ] Set strong database password
- [ ] Configure CORS with exact domain (no wildcards)
- [ ] Set up monitoring and logging
- [ ] Enable HTTPS only
- [ ] Consider adding rate limiting
- [ ] Add API authentication if needed
- [ ] Review and test error messages (don't leak system info)

## 📝 Environment Variables Reference

### Vercel (Frontend)
| Variable | Required | Example |
|----------|----------|---------|
| `NEXT_PUBLIC_API_URL` | Yes | `https://taskio-backend.onrender.com/api` |

### Render (Backend)
| Variable | Required | Example |
|----------|----------|---------|
| `SPRING_PROFILES_ACTIVE` | Yes | `prod` |
| `CORS_ALLOWED_ORIGINS` | Yes | `https://taskio.vercel.app` |
| `PORT` | No | `8080` (auto-set by Render) |
| `DB_PASSWORD` | No | (Set when using PostgreSQL) |

## 🔍 Security Verification

After deployment, verify:
1. CORS is working (check browser console)
2. H2 console is not accessible at `/h2-console`
3. API responds only to allowed origins
4. HTTPS is enforced
5. No sensitive data in error responses
