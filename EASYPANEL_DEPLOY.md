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
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL (e.g., `https://xxx.supabase.co`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/public key |

### 4. Set Environment Variables (Runtime)

Add the following **Environment Variables** for the Node.js server:

| Variable | Description | Required |
|----------|-------------|----------|
| `NODE_ENV` | `production` | Yes |
| `PORT` | `3000` | Yes |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/public key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key (for admin operations) | Yes |
| `N8N_WEBHOOK_URL` | Your n8n webhook URL for supplement analysis | Yes |
| `STRIPE_SECRET_KEY` | Your Stripe secret key | Optional |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Your Stripe publishable key | Optional |
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

### Build-Time Variables (for Next.js frontend)
These are baked into the JavaScript bundle during build:
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key

### Runtime Variables (for Node.js server)
These are read by the server at startup:
- `NEXT_PUBLIC_SUPABASE_URL` - Same as above (used by auth middleware)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Same as above (used by auth middleware)
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key for admin database operations
- `N8N_WEBHOOK_URL` - URL do webhook n8n para análise de suplementos

---

## N8N Webhook Configuration

The app now uses n8n webhooks for AI analysis instead of direct OpenAI integration.

### Webhook Payload Format (sent to n8n)
```json
{
  "type": "text" | "image" | "audio",
  "content": "string - text, base64 image, or base64 audio",
  "user": {
    "id": "user uuid",
    "email": "email@example.com",
    "isPremium": false,
    "healthProfile": {
      "age": 30,
      "weight": 70,
      "height": 175,
      "goals": ["muscle gain", "energy"],
      "allergies": ["gluten"],
      "medications": [],
      "activityLevel": "moderate",
      "dietType": "omnivore"
    }
  },
  "timestamp": "2025-11-23T12:00:00.000Z"
}
```

### Expected Response Format (from n8n)
```json
{
  "success": true,
  "data": {
    "productName": "Product Name",
    "brand": "Brand",
    "score": 85,
    "ingredients": [
      {
        "name": "Vitamin D3",
        "actualDosage": "2000 IU",
        "idealDosage": "2000-4000 IU",
        "percentage": 90,
        "efficacy": "high",
        "explanation": "Adequate dosage..."
      }
    ],
    "totalSavings": 25.50,
    "onlineAlternatives": [
      {
        "name": "Alternative Product",
        "brand": "Brand",
        "score": 92,
        "price": 29.99,
        "currentPrice": 39.99,
        "savings": 10,
        "url": "https://..."
      }
    ],
    "localAlternatives": [
      {
        "name": "Local Product",
        "brand": "Brand",
        "score": 88,
        "price": 32.99,
        "location": "Pharmacy X",
        "distance": "0.5 km"
      }
    ]
  }
}
```

---

## Build Configuration

The app uses a multi-stage Docker build:

1. **Builder Stage**:
   - Installs dependencies
   - Receives `NEXT_PUBLIC_*` build arguments
   - Builds Next.js application

2. **Production Stage**:
   - Minimal Alpine image
   - Only production dependencies
   - Runs the optimized build

### Exposed Port

The app runs on port `3000` by default.

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

---

## Troubleshooting

### Build Fails with "Missing Supabase environment variables"

**Cause**: Build arguments not configured.

**Solution**: Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` as **Build Arguments** (not just Environment Variables).

### App Crashes on Start

1. Verify all required environment variables are set (check the table above)
2. Check application logs in EasyPanel
3. Ensure Supabase connection is working
4. Verify the health endpoint: `https://your-domain.com/api/health`

### "N8N_WEBHOOK_URL not configured" Error

**Cause**: Missing webhook URL.

**Solution**: Add `N8N_WEBHOOK_URL` environment variable with your n8n webhook endpoint.

### "Invalid Supabase URL" or Auth Errors

**Cause**: Wrong variable names or missing variables.

**Solution**: Ensure you're using:
- `NEXT_PUBLIC_SUPABASE_URL` (NOT `SUPABASE_URL`)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (NOT `SUPABASE_ANON_KEY`)
- `SUPABASE_SERVICE_ROLE_KEY` (NOT `SUPABASE_SERVICE_KEY`)

---

## Manual Docker Build (for testing)

```bash
# Build the image with build arguments
docker build \
  --build-arg NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co \
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key \
  -t nutrascan .

# Run the container with runtime environment variables
docker run -p 3000:3000 \
  -e NODE_ENV=production \
  -e NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key \
  -e SUPABASE_SERVICE_ROLE_KEY=your_service_key \
  -e N8N_WEBHOOK_URL=https://your-n8n.com/webhook/nutrascan-analyze \
  nutrascan
```

---

## Using docker-compose

Create a `.env` file with your variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
N8N_WEBHOOK_URL=https://your-n8n.com/webhook/nutrascan-analyze
STRIPE_SECRET_KEY=your_stripe_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable
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
