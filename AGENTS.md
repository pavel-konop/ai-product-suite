# AI Product Suite

An AI-powered web application for analyzing project requirements and generating landing pages.

## Project Overview

AI Product Suite is a Next.js-based web application that helps users:
- **Analyze Requirements**: Submit client project briefs and get structured analysis including functional requirements, user stories, acceptance criteria, technical recommendations, MVP scope, complexity estimation, risks, and AI opportunities.
- **Generate Landing Pages**: Create marketing landing page copy (headline, subheadline, features, CTA) based on project context.
- **History Management**: View and revisit past analyses and landing page generations.

The application integrates with multiple AI providers (Anthropic Claude and Groq) and persists data in a local SQLite database.

## Technology Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16.1.6 (App Router) |
| Runtime | React 19.2.3 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| Database | SQLite with Prisma ORM 5.22.0 |
| AI Providers | Anthropic Claude SDK, Groq API |
| UI Components | Radix UI (Select, Tabs) |
| Icons | Lucide React |
| Date Handling | date-fns |

## Project Structure

```
├── app/                      # Next.js App Router
│   ├── (tools)/              # Route group for tool pages
│   │   ├── analyzer/         # Requirements analyzer page (page.tsx)
│   │   ├── landing-builder/  # Landing page builder (page.tsx)
│   │   ├── history/          # Project history (page.tsx)
│   │   └── settings/         # Settings page (page.tsx)
│   ├── api/                  # API Routes
│   │   ├── analyze/          # POST /api/analyze - analyze requirements
│   │   ├── landing/          # POST /api/landing - generate landing page
│   │   ├── history/          # GET /api/history - list all projects
│   │   └── history/[id]/     # GET /api/history/[id] - get single project
│   ├── layout.tsx            # Root layout with navigation
│   ├── page.tsx              # Home/dashboard page
│   └── globals.css           # Global styles with Tailwind v4
├── components/               # React components (currently empty)
│   ├── shared/               # Shared components
│   └── ui/                   # UI components
├── lib/                      # Utility libraries
│   ├── ai-providers.ts       # AI provider implementations (Claude, Groq)
│   └── db.ts                 # Prisma client singleton + helpers
├── types/
│   └── index.ts              # TypeScript type definitions
├── prisma/
│   ├── schema.prisma         # Database schema
│   ├── dev.db                # SQLite database file
│   └── migrations/           # Prisma migrations
├── prisma.config.ts          # Prisma configuration
└── postcss.config.mjs        # PostCSS configuration for Tailwind v4
```

## Build and Development Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Run ESLint
npm run lint
```

The development server runs on http://localhost:3000 by default.

## Environment Configuration

Create `.env.local` file with the following variables:

```env
DATABASE_URL="file:./dev.db"
ANTHROPIC_API_KEY=sk-ant-...
GROQ_API_KEY=gsk_...
```

**Note**: The `.env` file contains default configuration for Prisma. API keys should be placed in `.env.local` which is gitignored.

## Database Schema

The application uses a single `Project` model:

```prisma
model Project {
  id          String   @id @default(uuid())
  type        String   // 'requirements' | 'landing'
  title       String   // Project name or headline
  input       String   // Original brief or context
  output      String   // JSON-serialized analysis result
  modelUsed   String   // AI model identifier
  createdAt   DateTime @default(now())
  parentId    String?  // For future: derived project support
  parent      Project? @relation("DerivedFrom", fields: [parentId], references: [id])
  children    Project[] @relation("DerivedFrom")
}
```

### Database Operations

```bash
# Generate Prisma client after schema changes
npx prisma generate

# Run migrations
npx prisma migrate dev

# Open Prisma Studio (database GUI)
npx prisma studio
```

## API Routes

### POST /api/analyze
Analyzes a project brief using AI.

Request body:
```json
{
  "brief": "string (min 10 chars)",
  "model": "claude-sonnet-4-5" | "groq"
}
```

Response:
```json
{
  "success": true,
  "data": { /* RequirementsAnalysis object */ },
  "id": "project-uuid"
}
```

### POST /api/landing
Generates landing page content.

Request body:
```json
{
  "context": "string (min 10 chars)",
  "model": "claude-sonnet-4-5" | "groq"
}
```

### GET /api/history
Returns all projects ordered by creation date (newest first).

### GET /api/history/[id]
Returns a single project by ID with parsed output.

## AI Providers

The application supports two AI providers via the `AIProvider` interface:

### ClaudeProvider
- Uses `@anthropic-ai/sdk`
- Model: `claude-sonnet-4-5`
- Handles JSON extraction from markdown code blocks

### GroqProvider
- Uses fetch API to Groq's OpenAI-compatible endpoint
- Model: `llama-3.3-70b-versatile`
- Uses `response_format: { type: 'json_object' }` for structured output

Provider selection is handled by `getProvider(model: string)` in `lib/ai-providers.ts`.

## Type Definitions

### RequirementsAnalysis
```typescript
interface RequirementsAnalysis {
  projectName: string;
  summary: string;
  functionalRequirements: string[];
  userStories: { role: string; action: string; benefit: string }[];
  acceptanceCriteria: string[];
  technicalRecommendations: string[];
  mvpScope: string;
  estimatedComplexity: 'Low' | 'Medium' | 'High';
  risks: string[];
  aiOpportunities: string[];
}
```

### LandingPage
```typescript
interface LandingPage {
  headline: string;
  subheadline: string;
  features: { title: string; description: string }[];
  cta: string;
}
```

## Code Style Guidelines

- **Language**: TypeScript with strict mode enabled
- **Imports**: Use path alias `@/` for project imports (configured in tsconfig.json)
- **Components**: Client components use `'use client'` directive
- **Styling**: Tailwind CSS with dark theme (slate color palette)
- **Icons**: Lucide React
- **Formatting**: ESLint with Next.js configurations

### Conventions
- API routes handle errors and return JSON with `{ success, data }` or `{ error }` shape
- Database helpers (`serializeForDb`, `parseFromDb`) handle JSON serialization
- Prisma client is singleton-patterned for development hot-reload safety

## Security Considerations

1. **API Keys**: Currently stored in `.env.local`. The Settings page UI mentions storing keys in localStorage for demo purposes, but the actual implementation uses server-side environment variables.

2. **Input Validation**: API routes validate minimum input length (10 characters) before processing.

3. **Database**: SQLite file (`prisma/dev.db`) is local and should not be committed to version control (already gitignored).

## Deployment

This is a standard Next.js application that can be deployed to Vercel or any platform supporting Next.js:

1. Set environment variables on the hosting platform
2. Ensure `DATABASE_URL` points to a persistent SQLite location or migrate to PostgreSQL/MySQL
3. Run `npm run build` for production build

**Note**: The current SQLite setup is suitable for single-instance deployments. For multi-instance deployments, consider migrating to PostgreSQL.

## Future Enhancements

- The `parentId` field in the Project model suggests planned support for derived projects (e.g., creating a landing page from a requirements analysis)
- Components directories are currently empty - UI components could be extracted from page files
