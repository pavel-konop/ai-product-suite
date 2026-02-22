# AI Product Suite

An AI-powered web application for analyzing project requirements and generating landing pages.

## Features

- **Requirements Analyzer**: Submit client project briefs and get structured analysis
- **Landing Page Builder**: Create marketing landing page copy with AI
- **History Management**: View and revisit past analyses
- **Dark/Light Mode**: Includes Eastern Peak themed light mode

## Technology Stack

- Next.js 16 + React 19 + TypeScript
- Tailwind CSS
- PostgreSQL + Prisma ORM
- Anthropic Claude & Groq AI APIs

## Local Development

1. **Install dependencies**:
```bash
npm install
```

2. **Set up environment variables**:
Create `.env.local` file:
```env
# For local development with SQLite (optional)
# DATABASE_URL="file:./dev.db"

# For local PostgreSQL
DATABASE_URL="postgresql://user:password@localhost:5432/ai_product_suite"

# AI API Keys
ANTHROPIC_API_KEY=sk-ant-...
GROQ_API_KEY=gsk_...
```

3. **Run database migrations** (if using PostgreSQL):
```bash
npx prisma migrate dev
```

4. **Start development server**:
```bash
npm run dev
```

## Deploy to Vercel

### Step 1: Create Vercel Postgres Database

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Storage** → **Create Database** → **Postgres**
3. Select your project or create a new one
4. Copy the connection string

### Step 2: Configure Environment Variables

In your Vercel project settings, add these environment variables:

| Name | Value |
|------|-------|
| `DATABASE_URL` | Your Vercel Postgres connection string |
| `ANTHROPIC_API_KEY` | Your Anthropic API key |
| `GROQ_API_KEY` | Your Groq API key |

### Step 3: Deploy

Connect your GitHub repository to Vercel and deploy. The build script will automatically:
1. Generate Prisma client
2. Run database migrations (if configured)
3. Build the Next.js app

## Database Schema

The application uses a single `Project` model to store analyses and landing pages:

```prisma
model Project {
  id          String   @id @default(uuid())
  type        String   // 'requirements' | 'landing'
  title       String
  input       String
  output      String
  modelUsed   String
  createdAt   DateTime @default(now())
  parentId    String?
  parent      Project? @relation("DerivedFrom", fields: [parentId], references: [id])
  children    Project[] @relation("DerivedFrom")
}
```

## API Routes

- `POST /api/analyze` - Analyze project requirements
- `POST /api/landing` - Generate landing page content
- `GET /api/history` - List all projects
- `GET /api/history/[id]` - Get single project

## License

MIT
