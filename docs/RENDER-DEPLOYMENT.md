# 🚀 Render Deployment Guide for Festify Backend

Complete guide to deploy the Spring Boot backend to Render.com

## Prerequisites

- ✅ GitHub repository with backend code
- ✅ Render.com account (free tier available)
- ✅ Supabase PostgreSQL database credentials

## Quick Deploy (5 minutes)

### Step 1: Prepare Your Repository

Ensure these files exist in your repo (already included):
- ✅ `render-build.sh` - Build script
- ✅ `render-start.sh` - Start script  
- ✅ `render.yaml` - Render configuration
- ✅ `backend/Dockerfile` - Docker config

### Step 2: Create Web Service on Render

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `festify-backend`
   - **Region**: Oregon (or closest to you)
   - **Branch**: `main`
   - **Runtime**: `Docker`
   - **Dockerfile Path**: `./backend/Dockerfile`
   - **Docker Context**: `./backend`

### Step 3: Set Environment Variables

Add these in Render Dashboard → **Environment** tab:

#### Required Variables:

```bash
# Database (from Supabase Dashboard → Settings → Database)
DB_URL=jdbc:postgresql://db.pnekjnwarkpgrlsntaor.supabase.co:5432/postgres?prepareThreshold=0
DB_USER=postgres.pnekjnwarkpgrlsntaor
DB_PASS=your-supabase-password

# JWT Secret (generate random string)
JWT_SECRET=generate-a-strong-random-secret-key-min-256-bits

# Spring Profile
SPRING_PROFILES_ACTIVE=production
```

#### Optional Variables:

```bash
# SMTP (for email features)
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password
SMTP_FROM=noreply@festify.com

# Admin Account
ADMIN_EMAIL=admin@festify.com
ADMIN_PASS=SecureAdminPassword123!

# CORS (add your frontend URL)
ALLOWED_ORIGINS=https://your-frontend.vercel.app,http://localhost:3000
```

### Step 4: Deploy

1. Click **"Create Web Service"**
2. Render will automatically:
   - Build your Docker image
   - Deploy to cloud
   - Assign a URL: `https://festify-backend.onrender.com`

Build takes ~3-5 minutes ⏱️

### Step 5: Verify Deployment

Test your API:

```bash
# Health check
curl https://festify-backend.onrender.com/actuator/health

# Get events
curl https://festify-backend.onrender.com/api/events

# Get categories
curl https://festify-backend.onrender.com/api/categories
```

Expected health response:
```json
{
  "status": "UP",
  "components": {
    "db": { "status": "UP" },
    "diskSpace": { "status": "UP" },
    "ping": { "status": "UP" }
  }
}
```

## Configuration Details

### Database Connection

Your Supabase connection string format:
```
jdbc:postgresql://db.[project-ref].supabase.co:5432/postgres?prepareThreshold=0
```

**⚠️ Important:** Always include `?prepareThreshold=0` for Supabase compatibility!

### Resource Allocation

#### Free Tier:
- 512 MB RAM
- Shared CPU
- **Spins down after 15 min inactivity**
- Cold start: ~30-60 seconds

#### Starter ($7/month):
- 512 MB RAM
- 0.5 CPU
- **Always on** (no cold starts)
- Recommended for production

### JVM Settings

Pre-configured in `render-start.sh`:
```bash
JAVA_OPTS="-Xmx450m -Xms256m -XX:+UseG1GC"
```

Optimized for 512MB RAM instances.

### Connection Pool

Production settings in `application-production.properties`:
- Max connections: 3
- Min idle: 1
- Connection timeout: 30s

## Troubleshooting

### Build Fails

**Error: Java version mismatch**
```bash
# Render uses Java 17 by default
# Verify in render-build.sh:
export JAVA_HOME=/opt/java/openjdk
java -version
```

**Error: Permission denied on scripts**
```bash
# Make scripts executable locally:
chmod +x render-build.sh render-start.sh

# Commit changes:
git add render-build.sh render-start.sh
git commit -m "fix: Make scripts executable"
git push
```

### Database Connection Issues

**Error: Connection timeout**

1. Check DB_URL format:
   ```
   jdbc:postgresql://[host]:5432/postgres?prepareThreshold=0
   ```

2. Verify Supabase credentials in Dashboard

3. Check Supabase network restrictions

**Error: Too many connections**

Reduce connection pool in `application-production.properties`:
```properties
spring.datasource.hikari.maximum-pool-size=2
spring.datasource.hikari.minimum-idle=1
```

### Application Crashes

**Error: OutOfMemoryError**

Option 1: Reduce JVM heap size
```bash
# In render-start.sh:
JAVA_OPTS="-Xmx400m -Xms200m"
```

Option 2: Upgrade Render plan to 1GB RAM

### CORS Errors

Add your frontend URL to environment variables:
```bash
ALLOWED_ORIGINS=https://your-app.vercel.app,https://your-app.netlify.app
```

Or update `SecurityConfig.java` directly.

## Monitoring

### View Logs

Render Dashboard → **Logs** tab

Real-time log streaming available.

### Health Checks

Render automatically monitors:
- Path: `/actuator/health`
- Interval: Every 30 seconds
- Auto-restart on failures

### Metrics

View in Render Dashboard:
- CPU usage
- Memory usage
- Network traffic
- Request count

## Auto-Deploy Setup

Enable automatic deployments on Git push:

1. Render Dashboard → **Settings**
2. **Auto-Deploy**: Enable
3. Every push to `main` triggers deployment

## Custom Domain

To use your own domain:

1. Render Dashboard → **Settings**
2. Add custom domain
3. Update DNS records (Render provides instructions)
4. SSL certificate auto-provisioned (free)

## Cost Optimization

### Free Tier Tips:
- ✅ Accepts cold starts
- ✅ Low traffic apps
- ✅ Development/testing

### When to Upgrade:
- ❌ Can't accept 30-60s cold starts
- ❌ Need 24/7 uptime
- ❌ Higher traffic volume
- ❌ Need better performance

## Environment Variables Summary

| Variable | Required | Description |
|----------|----------|-------------|
| `DB_URL` | ✅ | PostgreSQL JDBC URL with `?prepareThreshold=0` |
| `DB_USER` | ✅ | Database username |
| `DB_PASS` | ✅ | Database password |
| `JWT_SECRET` | ✅ | JWT signing secret (256+ bits) |
| `SPRING_PROFILES_ACTIVE` | ✅ | Set to `production` |
| `SMTP_USER` | ⚪ | Email username (optional) |
| `SMTP_PASS` | ⚪ | Email password (optional) |
| `ALLOWED_ORIGINS` | ⚪ | Comma-separated frontend URLs |
| `ADMIN_EMAIL` | ⚪ | Admin account email |
| `ADMIN_PASS` | ⚪ | Admin account password |

## Security Checklist

Before going to production:

- [ ] Change default admin password
- [ ] Use strong JWT secret (256+ bits random)
- [ ] Enable HTTPS only (Render provides free SSL)
- [ ] Add only necessary CORS origins
- [ ] Set up database backups (Supabase)
- [ ] Review exposed actuator endpoints
- [ ] Enable rate limiting (if needed)
- [ ] Set up monitoring alerts

## Next Steps

After successful deployment:

1. **Update Frontend**: Change `NEXT_PUBLIC_API_URL` to your Render URL
2. **Test All Endpoints**: Run integration tests against production
3. **Monitor Logs**: Check for errors in first 24 hours
4. **Performance Testing**: Verify response times
5. **Set Up CI/CD**: Automated testing before deploy

## Support

- **Render Docs**: https://render.com/docs
- **Render Community**: https://community.render.com
- **GitHub Issues**: [Your repo]/issues

---

## Quick Reference

```bash
# Your backend URL (after deployment)
https://festify-backend.onrender.com

# Health check
GET /actuator/health

# API endpoints
GET /api/events
GET /api/categories
GET /api/colleges
POST /api/events (auth required)
```

**Deployment Status**: ✅ Ready for production

**Estimated Setup Time**: 5-10 minutes

**Cost**: $0 (free tier) or $7/month (starter)
