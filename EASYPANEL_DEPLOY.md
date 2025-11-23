# NutraScan AI - EasyPanel Deployment Guide

## Quick Deploy

### 1. Create a New App in EasyPanel

1. Go to your EasyPanel dashboard
2. Click "Create App"
3. Select "App" (not Static)
4. Choose "Dockerfile" as the build method

### 2. Configure Git Repository

Connect your Git repository:
- Repository URL: `https://github.com/your-username/nutrascan.git`
- Branch: `main`

### 3. Configure Build Arguments (CRITICAL!)

⚠️ **Important**: The frontend needs Supabase URLs at BUILD TIME. You must configure these as **Build Arguments** in EasyPanel.

In EasyPanel, go to your app settings and add these **Build Arguments**:

| Build Argument | Description |
|----------------|-------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL (e.g., `https://xxx.supabase.co`) |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon/public key |

### 4. Set Environment Variables (Runtime)

Add the following **Environment Variables** for the Node.js server:

| Variable | Description | Required |
|----------|-------------|----------|
| `NODE_ENV` | `production` | Yes |
| `PORT` | `5000` | Yes |
| `VITE_SUPABASE_URL` | Your Supabase project URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon/public key | Yes |
| `SUPABASE_SERVICE_KEY` | Your Supabase service role key (for admin operations) | Yes |
| `OPENAI_API_KEY` | Your OpenAI API key | Yes |
| `STRIPE_SECRET_KEY` | Your Stripe secret key | Optional |
| `STRIPE_PUBLISHABLE_KEY` | Your Stripe publishable key | Optional |
| `STRIPE_WEBHOOK_SECRET` | Your Stripe webhook secret | Optional |

### 5. Configure Domain

1. In EasyPanel, go to "Domains"
2. Add your custom domain or use the provided subdomain
3. Enable HTTPS (automatic with Let's Encrypt)

### 6. Deploy

Click "Deploy" and wait for the build to complete.

---

## Variable Names Reference

**IMPORTANT**: Use these EXACT variable names. The code expects these specific names:

### Build-Time Variables (for Vite frontend)
These are baked into the JavaScript bundle during build:
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anon key

### Runtime Variables (for Node.js server)
These are read by the server at startup:
- `VITE_SUPABASE_URL` - Same as above (used by auth middleware)
- `VITE_SUPABASE_ANON_KEY` - Same as above (used by auth middleware)
- `SUPABASE_SERVICE_KEY` - Service role key for admin database operations
- `OPENAI_API_KEY` - For AI analysis features

---

## Build Configuration

The app uses a multi-stage Docker build:

1. **Builder Stage**:
   - Installs dependencies
   - Receives `VITE_*` build arguments
   - Builds frontend (Vite) and backend (esbuild)

2. **Production Stage**:
   - Minimal Alpine image
   - Only production dependencies
   - Runs the optimized build

### Exposed Port

The app runs on port `5000` by default.

### Health Check

The app has a health check endpoint at `/api/health` that returns:
```json
{
  "status": "ok",
  "timestamp": "2025-11-22T00:00:00.000Z"
}
```

---

## Resource Requirements

Recommended minimum resources:
- **RAM**: 512MB - 1GB
- **CPU**: 0.5 - 1 vCPU
- **Storage**: 1GB

Note: Puppeteer (used for web scraping alternatives) requires additional memory. Consider 1GB+ RAM for production.

---

## Troubleshooting

### Build Fails with "Missing Supabase environment variables"

**Cause**: Build arguments not configured.

**Solution**: Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as **Build Arguments** (not just Environment Variables).

### App Crashes on Start

1. Verify all required environment variables are set (check the table above)
2. Check application logs in EasyPanel
3. Ensure Supabase connection is working
4. Verify the health endpoint: `https://your-domain.com/api/health`

### "Invalid Supabase URL" or Auth Errors

**Cause**: Wrong variable names or missing variables.

**Solution**: Ensure you're using:
- `VITE_SUPABASE_URL` (NOT `SUPABASE_URL`)
- `VITE_SUPABASE_ANON_KEY` (NOT `SUPABASE_ANON_KEY`)
- `SUPABASE_SERVICE_KEY` (NOT `SUPABASE_SERVICE_ROLE_KEY`)

### Puppeteer Issues

If you see Chromium/Puppeteer errors:
- The Dockerfile already includes all required dependencies
- Ensure the container has at least 512MB RAM

---

## Manual Docker Build (for testing)

```bash
# Build the image with build arguments
docker build \
  --build-arg VITE_SUPABASE_URL=https://your-project.supabase.co \
  --build-arg VITE_SUPABASE_ANON_KEY=your_anon_key \
  -t nutrascan .

# Run the container with runtime environment variables
docker run -p 5000:5000 \
  -e NODE_ENV=production \
  -e VITE_SUPABASE_URL=https://your-project.supabase.co \
  -e VITE_SUPABASE_ANON_KEY=your_anon_key \
  -e SUPABASE_SERVICE_KEY=your_service_key \
  -e OPENAI_API_KEY=your_openai_key \
  nutrascan
```

---

## Using docker-compose

Create a `.env` file with your variables:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_role_key
OPENAI_API_KEY=your_openai_key
STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable
STRIPE_WEBHOOK_SECRET=your_webhook_secret
```

Then run:
```bash
docker-compose up --build
```

---

## Support

For issues with deployment, check:
1. EasyPanel documentation: https://easypanel.io/docs
2. Application logs in EasyPanel dashboard
3. Health check endpoint: `https://your-domain.com/api/health`
