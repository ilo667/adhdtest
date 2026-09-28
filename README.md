# BrainsMate — ADHD Test Funnel

Full-stack ADHD screening quiz with personalised report.  
Flow: **Quiz → Account Creation → Report → Sign In**

---

## Quick Start

### Prerequisites

- Node.js 20+
- PostgreSQL running locally
- `DATABASE_URL` environment variable set

### 1. Environment

Create `backend/.env` (or add to the root `.env.local`):

```env
DATABASE_URL=postgres://user:password@localhost:5432/adhdtest
JWT_SECRET=change-me-in-production
PORT=3001
FRONTEND_URL=http://localhost:3000
```

### 2. Backend

```bash
cd backend
npm install
npm run db:setup   # applies schema + seeds questions
npm run start:dev  # runs on port 3001
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev        # runs on port 3000
```

Open **http://localhost:3000**.

---

## Solution Structure

```
adhdtest/
├── backend/              # NestJS API (port 3001)
│   ├── src/
│   │   ├── auth/         # JWT auth: register, login, me, logout
│   │   ├── quiz/         # Quiz endpoints: active quiz + submit attempt
│   │   └── database/     # Global PostgreSQL pool (pg package)
│   └── sql/
│       ├── schema.sql    # Tables: users, quiz_versions, questions, quiz_attempts, answers
│       └── seed.sql      # Quiz version 1 with 5 ADHD screening questions
│
└── frontend/             # Next.js 16 app (port 3000)
    ├── app/
    │   ├── page.tsx      # Landing
    │   ├── quiz/         # Quiz flow (one question at a time)
    │   ├── register/     # Account creation (links quiz attempt to user)
    │   ├── login/        # Sign in
    │   └── report/       # HIGH / LOW ADHD Traits report
    └── lib/
        └── api.ts        # Typed fetch client (all API calls)
```

---

## Data Model

```
quiz_versions   — versioned quiz snapshots (is_active flag)
questions       — tied to a quiz_version; text + position
quiz_attempts   — result of one quiz run (score, result HIGH|LOW, attempt_token UUID)
                  user_id nullable → filled on account creation
answers         — individual answer per question per attempt (value 0–3)
users           — email + bcrypt password hash
```

Every attempt stores its own `quiz_version_id` and all individual `answers`.  
This means past results remain intact even when questions are updated.

---

## Key Architectural Decisions

| Decision | Rationale |
|----------|-----------|
| **Raw `pg` (no ORM)** | Consistent with the existing codebase; minimal overhead for a focused feature. |
| **JWT in httpOnly cookie** | XSS-safe; `credentials: 'include'` on the frontend makes it transparent. |
| **`attemptToken` bridge** | Anonymous quiz attempt is submitted first; the UUID token is stored in `localStorage` and sent during registration. The backend links the attempt to the new user in a single `UPDATE`. No answers need to be re-submitted. |
| **Quiz versioning** | The schema separates `quiz_versions` → `questions` → `answers`. Changing questions creates a new version; old attempts reference their original version and answers forever. |
| **Retake = new attempt** | No special logic needed. `GET /auth/me` always returns the attempt with the latest `completed_at`. Old attempts are preserved. |
| **Next.js rewrite proxy** | The frontend proxies `/api/*` to the backend, avoiding CORS complexity in production. The `BACKEND_URL` env var makes it deployable. |

---

## Scoring Logic

Quiz answers use a 4-point Likert scale:

| Answer | Value |
|--------|-------|
| Strongly Disagree | 0 |
| Disagree | 1 |
| Agree | 2 |
| Strongly Agree | 3 |

**Result: HIGH** if 2 or more answers are "Agree" or "Strongly Agree" (value ≥ 2).  
**Result: LOW** otherwise.

This matches the design intent ("2 and more Agree/Strongly agree → HIGH TRAITS REPORT").

---

## How the System Handles Future Changes

- **New quiz questions:** Create a new `quiz_versions` row with `is_active = TRUE` (and set the old one to `FALSE`). All existing attempts keep their original version and scores intact.
- **New report sections:** Add sections to the report page that query `answers` filtered by `question_key`. Historical answers are preserved per-attempt.
- **New report logic:** The scoring lives in `quiz.service.ts` (`createAttempt`) and can be changed per version. The `result` field on `quiz_attempts` stores the computed outcome at submission time.

---

## Trade-offs

- **No ORM** — raw SQL is explicit and fast, but migrations must be managed manually.
- **No email verification** — out of scope per task requirements.
- **Single active quiz version** — simpler to reason about; a multi-active version system would need UI for version selection.
- **`localStorage` for `attemptToken`** — works on the same device/browser; a different device would require re-taking the quiz.

---

## Running Tests

```bash
cd backend
npm test              # unit tests (AuthService)
npm run test:e2e      # e2e tests (requires running DB)
```
