# Railway Backend Startup Issues - Troubleshooting Guide

## 🔴 Current Issue: Service Unavailable
Your backend is failing to start with "service unavailable" errors. This typically means the Spring Boot application is crashing on startup.

## ⚡ Quick Fix Steps

### 1. Check Railway Logs (MOST IMPORTANT)
1. Go to Railway Dashboard
2. Click on your backend service
3. Go to **Deployments** → Latest deployment
4. Click **View Logs**
5. Look for errors near the bottom

**Common error messages to look for:**
- `Unable to acquire JDBC Connection`
- `Could not connect to database`
- `Invalid JWT signature` or `JWT secret`
- `Failed to bind properties`
- `Application failed to start`

### 2. Verify ALL Environment Variables

Go to Railway → Your Service → **Variables** tab and ensure these are set:

#### ✅ Required Variables:

```bash
# Database - MUST match your Supabase exactly
DB_URL=jdbc:postgresql://db.pnekjnwarkpgrlsntaor.supabase.co:5432/postgres?sslmode=require
DB_USER=postgres.pnekjnwarkpgrlsntaor
DB_PASS=<YOUR_SUPABASE_PASSWORD>

# JWT Secret - MUST be at least 32 characters
JWT_SECRET=<GENERATE_THIS_USING_generate-jwt-secret.ps1>

# Spring Profile
SPRING_PROFILES_ACTIVE=prod

# Port (Railway sets this automatically, but verify)
PORT=8080
```

### 3. Get Your Supabase Database Password

If you don't remember your database password:

1. Go to https://app.supabase.com
2. Select your project: `pnekjnwarkpgrlsntaor`
3. Click **Settings** (gear icon)
4. Click **Database** in sidebar
5. Scroll to **Database Password** section
6. Click **Reset database password** if needed
7. **IMPORTANT**: Copy the new password immediately!

### 4. Generate JWT Secret

Run this in PowerShell:
```powershell
cd "c:\Users\jenny\Downloads\New folder\Festify Project\backend"
.\generate-jwt-secret.ps1
```

Copy the generated string and add it as `JWT_SECRET` in Railway.

### 5. Test Database Connection from Railway

The most common issue is database connectivity. To verify:

#### Check Supabase Connection Pooler Settings:
1. Go to Supabase → Settings → Database
2. Under **Connection Pooling**, note the connection string
3. Use **Session mode** for better compatibility

#### Update DB_URL if needed:
Try using the connection pooler URL instead:
```bash
DB_URL=jdbc:postgresql://aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require
DB_USER=postgres.pnekjnwarkpgrlsntaor
```

### 6. Common Fixes

#### Issue: "Unable to acquire JDBC Connection"
**Fix:**
- Verify `DB_URL` has `?sslmode=require` at the end
- Check `DB_USER` format: `postgres.PROJECT_ID`
- Verify `DB_PASS` is correct
- Try using Supabase connection pooler (port 6543)

#### Issue: "JWT secret must be at least 256 bits"
**Fix:**
- Run `generate-jwt-secret.ps1` to get a proper secret
- Ensure it's at least 32 characters long
- No special characters that might break in environment variables

#### Issue: "Application failed to start"
**Fix:**
- Check all required environment variables are set
- Verify no typos in variable names
- Check Railway logs for specific error

## 🔍 Step-by-Step Debugging

### Step 1: Check Logs
```
Railway → Service → Deployments → Latest → View Logs
```

Look for the **actual error message**. Common patterns:

**Database Error:**
```
Caused by: org.postgresql.util.PSQLException: 
FATAL: password authentication failed for user "postgres.xxx"
```
→ **Fix**: Wrong `DB_PASS`

**Connection Error:**
```
Caused by: java.net.UnknownHostException: db.xxx.supabase.co
```
→ **Fix**: Wrong `DB_URL`

**JWT Error:**
```
The specified key byte array is X bits which is not secure enough
```
→ **Fix**: `JWT_SECRET` too short

### Step 2: Verify Database Settings

Test your Supabase connection details:

#### Get Connection Info:
1. Supabase Dashboard → Project Settings → Database
2. Copy **Connection String** → **JDBC** tab
3. Should look like:
```
jdbc:postgresql://db.pnekjnwarkpgrlsntaor.supabase.co:5432/postgres
```

#### Format for Railway:
```bash
DB_URL=jdbc:postgresql://db.pnekjnwarkpgrlsntaor.supabase.co:5432/postgres?sslmode=require
DB_USER=postgres.pnekjnwarkpgrlsntaor
DB_PASS=your_password_here
```

### Step 3: Minimal Working Configuration

Start with JUST these variables:

```bash
DB_URL=jdbc:postgresql://db.pnekjnwarkpgrlsntaor.supabase.co:5432/postgres?sslmode=require
DB_USER=postgres.pnekjnwarkpgrlsntaor
DB_PASS=your_actual_password
JWT_SECRET=at_least_32_characters_long_random_string_1234567890abc
SPRING_PROFILES_ACTIVE=prod
```

**Don't add** optional variables (SMTP, ADMIN, etc.) until this works!

### Step 4: Force Redeploy

After updating environment variables:
1. Go to Railway → Deployments
2. Click **Deploy** (or three dots → Redeploy)
3. Watch the logs in real-time

## 🎯 Most Likely Issues (In Order)

### 1. Database Password Wrong (90% of cases)
**Symptom**: "password authentication failed"
**Fix**: Reset password in Supabase, update `DB_PASS` in Railway

### 2. JWT Secret Missing/Too Short
**Symptom**: "key byte array is not secure enough"
**Fix**: Run `generate-jwt-secret.ps1`, copy to Railway

### 3. Database URL Format Wrong
**Symptom**: "connection refused" or "unknown host"
**Fix**: Ensure format is exactly:
```
jdbc:postgresql://db.pnekjnwarkpgrlsntaor.supabase.co:5432/postgres?sslmode=require
```

### 4. SSL Mode Not Set
**Symptom**: "SSL required"
**Fix**: Add `?sslmode=require` to end of `DB_URL`

### 5. Wrong Port in Connection Pooler
**Symptom**: Connection timeout
**Fix**: Use port `5432` for direct connection, or `6543` for pooler

## 📋 Complete Environment Variables Checklist

Copy this and fill in your values:

```bash
# ===== REQUIRED (App won't start without these) =====
DB_URL=jdbc:postgresql://db.pnekjnwarkpgrlsntaor.supabase.co:5432/postgres?sslmode=require
DB_USER=postgres.pnekjnwarkpgrlsntaor
DB_PASS=
JWT_SECRET=
SPRING_PROFILES_ACTIVE=prod

# ===== OPTIONAL (Can add later) =====
# PORT=8080  (Railway sets this automatically)
# SMTP_USER=
# SMTP_PASS=
# SMTP_FROM=
# ADMIN_EMAIL=
# ADMIN_PASS=
```

## 🧪 Test After Deployment

Once Railway shows "Deployed" status (not just "Building"):

```bash
# Test health endpoint
curl https://festify-backend-production.up.railway.app/actuator/health

# Should return: {"status":"UP"}
```

If health check passes, test API:
```bash
curl https://festify-backend-production.up.railway.app/api/events
```

## 🆘 Still Not Working?

### Copy and share the Railway logs:
1. Go to latest deployment
2. Click **View Logs**
3. Scroll to the bottom
4. Copy the last 50-100 lines (the error section)
5. Share the error messages

### Things to share for debugging:
- [ ] Last 50 lines of Railway logs (error section)
- [ ] Confirm all 5 required env vars are set
- [ ] Confirm database password is correct (test in Supabase SQL editor)
- [ ] Confirm JWT_SECRET is at least 32 characters

## 💡 Quick Wins

### Try Connection Pooler:
If direct connection fails, try Supabase's connection pooler:

```bash
# Instead of port 5432, use 6543:
DB_URL=jdbc:postgresql://aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&user=postgres.pnekjnwarkpgrlsntaor&password=YOUR_PASSWORD
```

### Simplify JWT Secret:
Make sure JWT_SECRET has no special characters that might cause issues:
```bash
# Good:
JWT_SECRET=abcd1234efgh5678ijkl9012mnop3456qrst7890uvwx1234yz567890abcdef12

# Bad (special chars):
JWT_SECRET=abc@123#def$456!
```

## 📞 What to Check Right Now:

1. ✅ Railway logs - what's the actual error?
2. ✅ `DB_PASS` - is it correct? (Test in Supabase)
3. ✅ `JWT_SECRET` - is it at least 32 characters?
4. ✅ `DB_URL` - does it end with `?sslmode=require`?
5. ✅ All 5 required variables are set in Railway?

**Check the logs first - that will tell us exactly what's failing!**
