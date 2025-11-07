# Quick Fix for Railway Deployment

## The Issue
Railway can't find the Dockerfile because it needs specific configuration.

## Solution - Two Options:

### Option 1: Use Railway Dashboard (RECOMMENDED)

1. **In Railway Project Settings:**
   - Click on your service
   - Go to **Settings** tab
   - Find **Build** section
   - Set these values:
     - **Root Directory**: `backend`
     - **Builder**: Docker
     - **Dockerfile Path**: `Dockerfile`
   
2. **Save and Redeploy**
   - Railway will now look for the Dockerfile in the `backend` folder

### Option 2: Railway Will Auto-Detect (After Push)

I've added two configuration files:
- `railway.toml` (in project root) - tells Railway where to find Dockerfile
- `backend/railway.json` - additional configuration

After pushing these files, Railway should automatically detect the configuration.

## Step-by-Step Deployment:

### 1. Push the updated config to GitHub:
```powershell
cd "c:\Users\jenny\Downloads\New folder\Festify Project"
git add .
git commit -m "Fix Railway Dockerfile configuration"
git push origin main
```

### 2. In Railway Dashboard:

#### Create New Service:
1. Go to https://railway.app/new
2. Click **"Deploy from GitHub repo"**
3. Select: `rishikaraj14/festify-application`
4. Railway will detect the configuration

#### OR if service already exists:
1. Go to your Railway project
2. Click on the backend service
3. Go to **Settings**
4. Under **Build** section:
   - ✅ **Root Directory**: `backend`
   - ✅ **Builder**: Docker (or Dockerfile)
   - ✅ **Dockerfile Path**: `Dockerfile`
5. Click **Save**
6. Go to **Deployments** → Click **Deploy**

### 3. Add Environment Variables:

Don't forget to add these in the **Variables** tab:

```bash
DB_URL=jdbc:postgresql://db.pnekjnwarkpgrlsntaor.supabase.co:5432/postgres?sslmode=require
DB_USER=postgres.YOUR_PROJECT_ID
DB_PASS=your_database_password
JWT_SECRET=run_generate-jwt-secret.ps1_to_get_this
SPRING_PROFILES_ACTIVE=prod
```

### 4. Get Your Supabase DB Connection:

Your Supabase project: `pnekjnwarkpgrlsntaor`

Get the connection details:
1. Go to https://app.supabase.com
2. Select your project
3. Settings → Database
4. Connection String → JDBC tab
5. Copy the connection string

Format for Railway:
```bash
DB_URL=jdbc:postgresql://db.pnekjnwarkpgrlsntaor.supabase.co:5432/postgres?sslmode=require
DB_USER=postgres.pnekjnwarkpgrlsntaor
DB_PASS=your_password_here
```

### 5. Generate JWT Secret:
```powershell
cd backend
.\generate-jwt-secret.ps1
# Copy the output and use it as JWT_SECRET
```

## Verify Deployment:

After Railway deploys successfully:

1. Get your Railway URL from **Settings** → **Networking** → **Generate Domain**
2. Test the health endpoint:
```bash
curl https://your-railway-url.up.railway.app/actuator/health
```

Should return: `{"status":"UP"}`

3. Update your frontend `.env.local`:
```bash
NEXT_PUBLIC_API_URL=https://your-railway-url.up.railway.app
```

## Common Issues:

### "Dockerfile not found"
- ✅ **Fix**: Set Root Directory to `backend` in Railway Settings

### "Build fails"
- Check Railway logs for specific error
- Ensure all environment variables are set
- Verify Dockerfile path is correct

### "App crashes on startup"
- Check environment variables (especially JWT_SECRET)
- Verify database connection (DB_URL, DB_USER, DB_PASS)
- Check Railway logs for errors

## Need More Help?

See the complete guide:
- `backend/RAILWAY_DEPLOYMENT.md`
- `backend/DEPLOYMENT_CHECKLIST.md`
