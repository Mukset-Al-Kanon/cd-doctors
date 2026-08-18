# CD Doctors AI — Production Deployment Guide

## 1. Deployment Stack Summary
- **Framework**: Next.js `14.2.35` (App Router)
- **UI & Logic**: React `18`, Tailwind CSS, TypeScript
- **Database Layer**: Prisma ORM with SQLite database (`prisma/dev.db`)
- **AI Integration**: Official `@google/genai` (`v2.17.1`) SDK with `gemini-2.5-flash` model
- **Node.js Requirement**: Node.js `v18.x` or `v20.x` LTS

---

## 2. Environment Variables

### Required Server-Side Environment Variables:
```env
# Google Gemini API Key (Server-Only)
GEMINI_API_KEY=your_google_gemini_api_key_here

# Database Connection (Optional if using default SQLite)
DATABASE_URL="file:./dev.db"
```

> ⚠️ **SECURITY WARNING**: `GEMINI_API_KEY` must **NEVER** be prefixed with `NEXT_PUBLIC_` and must **NEVER** be committed to source control or exposed to client JavaScript.

---

## 3. Build & Production Commands

### Installation & Client Generation:
```bash
npm install
npx prisma generate
```

### Production Build:
```bash
npm run build
```

### Start Production Server:
```bash
npm run start
```

---

## 4. Security & Privacy Safeguards
1. **API Key Security**: Kept strictly server-side in `process.env.GEMINI_API_KEY`.
2. **Blood Donor Privacy**: Backend search strictly filters `status = 'approved'`, `consent = true`, and `availability = 'available'`.
3. **Rate Limiting**: In-memory sliding window rate limiter (50 req/min per IP) protects POST `/api/ai/chat` against abuse.
4. **Prompt Injection Guardrails**: Rejects attempts asking for system instructions, API keys, hidden records, or raw database dumps.
5. **Git Safety**: `.env` and `.env.local` are explicitly listed in `.gitignore`.
