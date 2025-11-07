# Railway Deployment Checklist

## Before You Start
- [ ] Have a Railway account (https://railway.app)
- [ ] Repository is pushed to GitHub
- [ ] Have Supabase database credentials ready
- [ ] Backend builds successfully locally

## Step 1: Prepare JWT Secret
```powershell
# Run this in PowerShell from backend directory:
.\generate-jwt-secret.ps1
```
- [ ] Copy the generated JWT secret
- [ ] Keep it safe (you'll need it in Step 5)

## Step 2: Get Supabase Credentials
1. Go to https://app.supabase.com
2. Select your project
3. Settings → Database
4. Connection String → JDBC tab
5. Copy the connection details:
   - [ ] Database URL (starts with `jdbc:postgresql://...`)
   - [ ] Username (format: `postgres.PROJECT_ID`)
   - [ ] Password (your database password)

## Step 3: Create Railway Project
1. Go to https://railway.app/new
2. Click "Deploy from GitHub repo"
3. Authorize Railway to access your GitHub
4. Select repository: `festify-application`
5. Click "Deploy Now"
   - [ ] Project created successfully

## Step 4: Configure Service Settings
1. Click on your deployed service
2. Go to **Settings** tab
3. Set these:
   - [ ] **Root Directory**: `backend`
   - [ ] **Dockerfile Path**: `Dockerfile`
   - [ ] **Build Command**: (leave empty - Dockerfile handles it)
   - [ ] **Start Command**: (leave empty - Dockerfile handles it)
4. Under **Networking**:
   - [ ] Click "Generate Domain"
   - [ ] Copy the generated URL (e.g., `https://your-service.up.railway.app`)
   - [ ] Save this URL - you'll need it for frontend configuration

## Step 5: Add Environment Variables
1. Go to **Variables** tab
2. Click "New Variable" for each:

### Required Variables:
```bash
DB_URL = jdbc:postgresql://db.YOUR_PROJECT.supabase.co:5432/postgres?sslmode=require
DB_USER = postgres.YOUR_PROJECT_ID
DB_PASS = your_database_password
JWT_SECRET = your_generated_64_char_secret
SPRING_PROFILES_ACTIVE = prod
```

- [ ] `DB_URL` added
- [ ] `DB_USER` added
- [ ] `DB_PASS` added
- [ ] `JWT_SECRET` added (from Step 1)
- [ ] `SPRING_PROFILES_ACTIVE` added

### Optional Variables (for email features):
```bash
SMTP_USER = your-email@gmail.com
SMTP_PASS = your-gmail-app-password
SMTP_FROM = noreply@festify.com
ADMIN_EMAIL = admin@festify.com
ADMIN_PASS = your-admin-password
```

- [ ] Email variables added (if needed)

## Step 6: Deploy
1. After adding variables, Railway will auto-redeploy
2. Watch the deployment logs:
   - [ ] Build starts
   - [ ] Docker image builds successfully
   - [ ] Container starts
   - [ ] Spring Boot starts
   - [ ] Database connection successful
   - [ ] Application running on port 8080

## Step 7: Verify Deployment
### Check Health Endpoint:
```bash
# Replace with your Railway URL
curl https://your-service.up.railway.app/actuator/health
```
Expected response:
```json
{"status":"UP"}
```
- [ ] Health check returns `UP`

### Check API Endpoint:
```bash
# Test events endpoint
curl https://your-service.up.railway.app/api/events
```
- [ ] API responds (even if empty array)

### Check Logs:
1. Railway Dashboard → Service → Deployments → Latest
2. Click "View Logs"
3. Look for:
   - [ ] "Started FestifyBackendApplication" message
   - [ ] No error messages
   - [ ] Database connection successful

## Step 8: Update Frontend Configuration
1. Open `frontend/festify/.env.local`
2. Update or add:
```bash
NEXT_PUBLIC_API_URL=https://your-service.up.railway.app
```
3. Remove any trailing slashes
   - [ ] Frontend .env.local updated
   - [ ] Frontend redeployed (if on Vercel/Railway)

## Step 9: Test End-to-End
- [ ] Frontend can reach backend
- [ ] Login works
- [ ] API calls work
- [ ] Database operations work
- [ ] Authentication flows work

## Troubleshooting

### Build Fails
**Problem**: Docker build fails
**Solutions**:
- [ ] Check Root Directory is set to `backend`
- [ ] Verify Dockerfile exists in backend folder
- [ ] Check Railway build logs for specific errors
- [ ] Ensure pom.xml has correct Java version (17)

### Application Won't Start
**Problem**: Build succeeds but app crashes
**Solutions**:
- [ ] Verify all required environment variables are set
- [ ] Check JWT_SECRET is at least 32 characters
- [ ] Verify database credentials are correct
- [ ] Check Railway logs for startup errors
- [ ] Ensure SPRING_PROFILES_ACTIVE=prod

### Database Connection Issues
**Problem**: "Cannot connect to database"
**Solutions**:
- [ ] Verify DB_URL includes `?sslmode=require`
- [ ] Check DB_USER format: `postgres.PROJECT_ID`
- [ ] Verify DB_PASS is correct
- [ ] Test Supabase connection from another tool
- [ ] Check Supabase allows external connections

### Health Check Fails
**Problem**: Railway shows unhealthy
**Solutions**:
- [ ] Check `/actuator/health` endpoint manually
- [ ] Verify application is running on port 8080
- [ ] Check if PORT env variable is set correctly
- [ ] Look for errors in application logs

### CORS Issues
**Problem**: Frontend can't reach backend
**Solutions**:
- [ ] Check CORS configuration in Spring Security
- [ ] Verify frontend is using correct backend URL
- [ ] Check browser console for CORS errors
- [ ] Ensure backend allows frontend domain

## Cost Management
- [ ] Railway free tier: $5 credit/month
- [ ] Monitor usage in Railway dashboard
- [ ] Consider upgrading if needed

## Security Checklist
- [ ] JWT_SECRET is strong and secret
- [ ] Database password is strong
- [ ] Environment variables are not in Git
- [ ] SMTP credentials are secure (if used)
- [ ] Admin password is strong (if set)
- [ ] HTTPS is enabled (Railway does this automatically)

## Post-Deployment
- [ ] Backend URL saved and documented
- [ ] Frontend configured with backend URL
- [ ] Database is populated with initial data (if needed)
- [ ] Admin account created (if configured)
- [ ] Email functionality tested (if configured)
- [ ] Monitoring/alerts set up (optional)

## Next Steps After Successful Deployment
1. Test all API endpoints
2. Verify authentication flows
3. Check database connections
4. Monitor logs for issues
5. Set up proper admin credentials
6. Configure email if needed
7. Add custom domain (optional)
8. Set up GitHub Actions for CI/CD (optional)

## Support Resources
- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- Spring Boot Docs: https://spring.io/projects/spring-boot
- Supabase Docs: https://supabase.com/docs

## Quick Reference URLs
- Railway Dashboard: https://railway.app/dashboard
- Your Backend URL: https://your-service.up.railway.app
- Health Check: https://your-service.up.railway.app/actuator/health
- API Base: https://your-service.up.railway.app/api

---

## Common Error Messages and Solutions

### "Could not find or load main class"
❌ **Error**: Java can't find the main class
✅ **Solution**: Ensure Spring Boot Maven plugin is configured in pom.xml

### "Unable to acquire JDBC Connection"
❌ **Error**: Can't connect to database
✅ **Solution**: Check DB_URL, DB_USER, DB_PASS environment variables

### "Invalid JWT signature"
❌ **Error**: JWT validation fails
✅ **Solution**: Ensure JWT_SECRET is set and matches between backend instances

### "Port already in use"
❌ **Error**: Port 8080 is occupied
✅ **Solution**: Railway handles this automatically, don't set PORT manually

### "Application failed to start"
❌ **Error**: Spring Boot won't start
✅ **Solution**: Check logs for specific error, verify all required beans can be created
