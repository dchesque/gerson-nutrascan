# NutraScan AI - Intelligent Supplement Analysis

## Project Overview
NutraScan AI is a full-stack web application that uses OCR and AI to intelligently analyze supplement quality, effectiveness, dosage, and cost-benefit. The app features multi-input entry (photo/text/voice), AI-powered ingredient analysis, comprehensive 0-100 scoring, and a premium subscription model.

## Key Features
- **Multi-Input Analysis**: Scan supplements via photo, text, or voice input
- **AI-Powered Evaluation**: Uses OpenAI GPT-5 for intelligent ingredient analysis
- **Comprehensive Scoring**: 0-100 scale evaluating effectiveness, dosage, and value
- **Alternative Recommendations**: Online retailers and local store options with price comparisons
- **Premium Subscription**: $9.99/month for unlimited analyses (Stripe integration)
- **User History**: Track all previous supplement analyses
- **AI Chat Assistant**: Get personalized supplement recommendations

## Tech Stack
- **Frontend**: React + TypeScript, Tailwind CSS, shadcn/ui components
- **Backend**: Express.js with PostgreSQL
- **AI Integration**: OpenAI GPT-5 API
- **Payments**: Stripe
- **State Management**: TanStack React Query

## Project Structure
```
├── client/src/
│   ├── pages/           # Page components (home, results, history, profile, subscribe)
│   ├── components/      # Reusable UI components
│   ├── lib/            # Utilities (api.ts, queryClient.ts)
│   └── App.tsx         # Main routing
├── server/
│   ├── index.ts        # Express server entry
│   ├── routes.ts       # API endpoints (/api/analyze, /api/history, etc)
│   ├── ai.ts          # OpenAI integration for analysis
│   ├── storage.ts     # In-memory storage interface
│   └── vite.ts        # Vite dev server setup
├── shared/
│   └── schema.ts      # Shared TypeScript types and Zod schemas
└── package.json
```

## API Endpoints
- `POST /api/analyze` - Analyze a supplement (requires: type, content)
- `GET /api/analysis/:id` - Retrieve specific analysis
- `GET /api/history` - Get user's analysis history
- `GET /api/user/status` - Get user subscription status
- `POST /api/ai/recommend` - Get AI recommendation for a goal
- `POST /api/create-subscription` - Create Stripe subscription

## Environment Setup
Required environment variables (add as secrets):
- `OPENAI_API_KEY` - OpenAI API key for GPT-5 access
- `STRIPE_SECRET_KEY` - Stripe secret key for payments
- `VITE_STRIPE_PUBLIC_KEY` - Stripe public key (frontend access)
- `SESSION_SECRET` - Session management (auto-generated)

## Running Locally
The app runs on `http://localhost:5000` with:
- Frontend served via Vite on port 5000
- Express backend on port 5000 (same port via proxy)

## User Workflows
1. **Free User**: 1 free supplement analysis, then prompted to upgrade
2. **Premium User**: Unlimited analyses for $9.99/month via Stripe
3. **Analysis Flow**: Input supplement → AI analysis → Results page with score, ingredients, alternatives → View history

## Recent Changes
- Implemented lazy-loading of OpenAI client to handle missing API keys gracefully
- Connected all frontend pages to backend APIs
- Added Stripe subscription integration with client secret generation
- Created comprehensive API layer (client/src/lib/api.ts) for all backend calls
- Fixed ScanInterface to use text input as fallback for photo/voice (OCR coming soon)

## Next Steps
- Implement actual photo/OCR scanning
- Add voice recording and transcription
- Deploy to production with Replit deployment
- Implement user authentication and database persistence
- Add geolocation for local store recommendations
