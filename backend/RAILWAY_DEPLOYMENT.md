# Railway Deployment Guide for Festify Backend

## Prerequisites
1. Railway account (sign up at https://railway.app)
2. GitHub repository connected to Railway
3. Supabase database credentials

## Quick Deployment Steps

### 1. Create New Project on Railway
1. Go to https://railway.app/new
2. Click "Deploy from GitHub repo"
3. Select your `festify-application` repository
4. Choose "Deploy now"

### 2. Configure Service
1. Railway will detect the Dockerfile automatically
2. Click on your service → Settings
3. Set **Root Directory**: `backend`
4. Set **Dockerfile Path**: `Dockerfile`

### 3. Add Environment Variables
Go to your service → Variables tab and add these:

#### Required Variables:
```bash
# Database (Get from Supabase Project Settings → Database)
DB_URL=jdbc:postgresql://YOUR_SUPABASE_HOST:5432/postgres?sslmode=require
DB_USER=postgres.YOUR_PROJECT_ID
DB_PASS=your_supabase_database_password

# JWT Secret (Generate a strong random string)
JWT_SECRET=your-secret-key-at-least-32-characters-long

# Spring Profile
SPRING_PROFILES_ACTIVE=prod

# Port (Railway auto-assigns, but we default to 8080)
PORT=8080
```

#### Optional Variables (for email features):
```bash
# SMTP Configuration (if using Gmail)
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-specific-password
SMTP_FROM=noreply@festify.com

# Admin Account
ADMIN_EMAIL=admin@festify.com
ADMIN_PASS=change-this-password
```

### 4. Get Supabase Database Connection Details

#### From Supabase Dashboard:
1. Go to your Supabase project
2. Click **Settings** (gear icon) → **Database**
3. Scroll to **Connection String** section
4. Select **JDBC** tab
5. Copy the connection string

#### Format for Railway:
```bash
# The JDBC URL format:
DB_URL=jdbc:postgresql://db.YOUR_PROJECT.supabase.co:5432/postgres?sslmode=require

# Username (usually postgres.YOUR_PROJECT_ID)
DB_USER=postgres.abcdefghijklmnop

# Password (your database password)
DB_PASS=your_database_password
```

### 5. Generate JWT Secret
Run this in PowerShell to generate a secure JWT secret:
```powershell
# Generate a random 64-character secret
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | ForEach-Object {[char]$_})
```

### 6. Deploy
1. Click **Deploy** button in Railway
2. Railway will:
   - Clone your repo
   - Build using Dockerfile
   - Start the application
   - Expose it on a public URL

### 7. Get Your Backend URL
1. Go to your service → Settings
2. Under **Networking**, click **Generate Domain**
3. Your backend will be available at: `https://your-service.up.railway.app`
4. Copy this URL for frontend configuration

### 8. Update Frontend Configuration
Add to your frontend `.env.local`:
```bash
NEXT_PUBLIC_API_URL=https://your-service.up.railway.app
```

## Troubleshooting

### Build Fails
**Check:**
- Root Directory is set to `backend`
- Dockerfile path is correct
- All required env variables are set

**View logs:**
- Click on your service → Deployments → Latest deployment → View logs

### Database Connection Issues
**Check:**
- DB_URL includes `?sslmode=require`
- DB_USER matches Supabase format (postgres.PROJECT_ID)
- DB_PASS is correct
- Supabase allows connections from Railway IPs

**Test connection:**
```bash
# In Railway deployment logs, look for:
HikariPool-1 - Starting...
HikariPool-1 - Start completed
```

### Application Won't Start
**Check:**
- PORT environment variable is set
- JWT_SECRET is at least 32 characters
- Health check endpoint: `/actuator/health`

**View startup logs:**
- Railway Deployment → View logs
- Look for Spring Boot startup banner
- Check for error messages

### Health Check Failing
**Verify endpoint:**
```bash
curl https://your-service.up.railway.app/actuator/health
```

**Should return:**
```json
{"status": "UP"}
```

## Railway Configuration Files

### `railway.json` (created)
- Specifies Dockerfile build
- Sets health check path
- Configures restart policy

### `Dockerfile` (existing)
- Multi-stage build for optimization
- Uses Java 17 JRE
- Includes health checks
- Runs as non-root user

## Environment Variables Summary

| Variable | Required | Example | Description |
|----------|----------|---------|-------------|
| `DB_URL` | ✅ Yes | `jdbc:postgresql://...` | Supabase database URL |
| `DB_USER` | ✅ Yes | `postgres.abcd1234` | Database username |
| `DB_PASS` | ✅ Yes | `your_password` | Database password |
| `JWT_SECRET` | ✅ Yes | `random_64_chars...` | JWT signing secret |
| `SPRING_PROFILES_ACTIVE` | ✅ Yes | `prod` | Spring profile |
| `PORT` | ⚠️ Auto | `8080` | Application port |
| `SMTP_USER` | ❌ Optional | `email@gmail.com` | Email sender |
| `SMTP_PASS` | ❌ Optional | `app_password` | Email password |
| `SMTP_FROM` | ❌ Optional | `noreply@festify.com` | From address |
| `ADMIN_EMAIL` | ❌ Optional | `admin@festify.com` | Admin email |
| `ADMIN_PASS` | ❌ Optional | `secure_password` | Admin password |

## Post-Deployment Checklist

- [ ] Backend deploys successfully
- [ ] Health check endpoint returns `{"status":"UP"}`
- [ ] Database connection successful
- [ ] Test API endpoint: `GET /api/events`
- [ ] CORS allows frontend domain
- [ ] JWT authentication works
- [ ] Update frontend `NEXT_PUBLIC_API_URL`
- [ ] Test end-to-end login flow

## Deployment Commands (if using Railway CLI)

### Install Railway CLI
```powershell
# Using Scoop
scoop install railway

# Or download from https://docs.railway.app/develop/cli
```

### Deploy from CLI
```bash
# Login to Railway
railway login

# Link to project
railway link

# Add environment variables
railway variables set DB_URL="jdbc:postgresql://..."
railway variables set DB_USER="postgres.xxx"
railway variables set DB_PASS="password"
railway variables set JWT_SECRET="your-secret"

# Deploy
railway up
```

## Monitoring

### View Logs
```bash
# From CLI
railway logs

# Or in Dashboard:
Service → Deployments → Latest → View Logs
```

### Check Metrics
- Service → Metrics tab
- View CPU, Memory, Network usage
- Monitor request rates

### Set up Alerts
- Service → Settings → Notifications
- Configure alerts for:
  - Deployment failures
  - High memory usage
  - Crash loops

## Scaling

### Vertical Scaling
- Service → Settings → Resources
- Adjust CPU and Memory limits
- Railway auto-scales within limits

### Database Connection Pooling
Already configured in `application.properties`:
- Max pool size: 5
- Min idle: 2
- Connection timeout: 30s

## Cost Optimization

### Free Tier
- $5 credit per month
- Enough for development/testing
- Shared resources

### Pro Plan
- $20/month
- Better performance
- More resources
- Custom domains

## Security Notes

✅ **Implemented:**
- Non-root container user
- Environment variable secrets
- SSL database connections
- JWT authentication
- Health checks

⚠️ **Recommendations:**
1. Rotate JWT_SECRET regularly
2. Use strong database passwords
3. Enable Railway's built-in DDoS protection
4. Monitor access logs
5. Set up rate limiting (if needed)

## Support

- **Railway Docs**: https://docs.railway.app
- **Railway Discord**: https://discord.gg/railway
- **Supabase Docs**: https://supabase.com/docs
- **Spring Boot Docs**: https://spring.io/projects/spring-boot

---

## Quick Reference: Full Environment Variables Template

```bash
# Database
DB_URL=jdbc:postgresql://db.YOUR_PROJECT.supabase.co:5432/postgres?sslmode=require
DB_USER=postgres.YOUR_PROJECT_ID
DB_PASS=YOUR_DATABASE_PASSWORD

# JWT
JWT_SECRET=YOUR_64_CHARACTER_RANDOM_STRING

# Spring
SPRING_PROFILES_ACTIVE=prod
PORT=8080

# Optional: Email
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@festify.com

# Optional: Admin
ADMIN_EMAIL=admin@festify.com
ADMIN_PASS=secure-admin-password
```

**Need the backend URL?** After deployment, find it in:
- Railway Dashboard → Your Service → Settings → Networking → Generate Domain
- Copy the URL (e.g., `https://festify-backend-production.up.railway.app`)
- Use this as `NEXT_PUBLIC_API_URL` in your frontend
