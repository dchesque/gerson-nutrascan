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

### 3. Set Environment Variables

Add the following environment variables in EasyPanel:

| Variable | Description |
|----------|-------------|
| `NODE_ENV` | `production` |
| `PORT` | `5000` |
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_ANON_KEY` | Your Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key |
| `OPENAI_API_KEY` | Your OpenAI API key |
| `STRIPE_SECRET_KEY` | Your Stripe secret key |
| `STRIPE_PUBLISHABLE_KEY` | Your Stripe publishable key |
| `STRIPE_WEBHOOK_SECRET` | Your Stripe webhook secret |

### 4. Configure Domain

1. In EasyPanel, go to "Domains"
2. Add your custom domain or use the provided subdomain
3. Enable HTTPS (automatic with Let's Encrypt)

### 5. Deploy

Click "Deploy" and wait for the build to complete.

## Build Configuration

The app uses a multi-stage Docker build:

1. **Builder Stage**: Installs dependencies and builds the app
2. **Production Stage**: Runs the optimized production build

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

## Resource Requirements

Recommended minimum resources:
- **RAM**: 512MB - 1GB
- **CPU**: 0.5 - 1 vCPU
- **Storage**: 1GB

Note: Puppeteer (used for web scraping alternatives) requires additional memory. Consider 1GB+ RAM for production.

## Troubleshooting

### Build Fails

1. Check that all environment variables are set
2. Ensure the Dockerfile is in the root directory
3. Check build logs for specific errors

### App Crashes on Start

1. Verify all required environment variables are set
2. Check application logs in EasyPanel
3. Ensure Supabase connection is working

### Puppeteer Issues

If you see Chromium/Puppeteer errors:
- The Dockerfile already includes all required dependencies
- Ensure the container has at least 512MB RAM

## Manual Docker Build (for testing)

```bash
# Build the image
docker build -t nutrascan .

# Run the container
docker run -p 5000:5000 \
  -e NODE_ENV=production \
  -e SUPABASE_URL=your_url \
  -e SUPABASE_ANON_KEY=your_key \
  -e SUPABASE_SERVICE_ROLE_KEY=your_service_key \
  -e OPENAI_API_KEY=your_openai_key \
  nutrascan
```

## Support

For issues with deployment, check:
1. EasyPanel documentation: https://easypanel.io/docs
2. Application logs in EasyPanel dashboard
3. Health check endpoint: `https://your-domain.com/api/health`
