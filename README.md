# BrainsMate — ADHD Screening Funnel

Full-stack ADHD quiz with personalised report.  
Flow: **Landing → Quiz → Account Creation → Report → Sign In**

Stack: **NestJS** (backend) · **Next.js 16 App Router** (frontend) · **PostgreSQL** · **Vercel** (deployment)

---

## Solution Structure

```
adhdtest/
├── backend/                      # NestJS REST API
│   ├── api/index.ts              # Vercel serverless entrypoint
│   ├── src/
│   │   ├── app.module.ts         # Root module — wires everything together
│   │   ├── main.ts               # Bootstrap: CORS, ValidationPipe, cookieParser
│   │   ├── auth/                 # Auth module: register, login, /customer, logout
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── jwt-auth.guard.ts # Custom guard: reads JWT from httpOnly cookie
│   │   │   └── dto/              # RegisterDto, LoginDto (class-validator)
│   │   ├── quiz/                 # Quiz module: serve active quiz, accept attempts
│   │   │   ├── quiz.controller.ts
│   │   │   ├── quiz.service.ts
│   │   │   └── dto/              # CreateAttemptDto with nested QuizAnswerDto
│   │   └── database/             # Global pg Pool — injected across modules
│   └── sql/
│       ├── schema.sql            # DDL — idempotent (IF NOT EXISTS + ALTER migrations)
│       └── seed.sql              # Quiz v1 with 5 ADHD screening questions
│
└── frontend/                     # Next.js 16 App Router
    ├── app/
    │   ├── page.tsx              # Landing — gender selection → quiz
    │   ├── quiz/page.tsx         # One question at a time, arrow navigation
    │   ├── register/page.tsx     # Two-step: email → password
    │   ├── login/page.tsx        # Sign in
    │   └── report/page.tsx       # HIGH / LOW report with score gauge, FAQ
    ├── components/
    │   └── BrainIcon.tsx         # Shared logo component
    └── lib/
        └── api.ts                # Typed fetch wrapper — single source of truth for all API calls
```

---

## Data Model

```
users
  id BIGSERIAL PK
  email         VARCHAR UNIQUE
  password_hash VARCHAR          -- bcrypt, 10 rounds

quiz_versions
  id        BIGSERIAL PK
  is_active BOOLEAN              -- enforced unique at DB level: only one active at a time
  created_at TIMESTAMPTZ

questions
  id              BIGSERIAL PK
  quiz_version_id FK → quiz_versions
  question_key    VARCHAR        -- stable identifier across versions (e.g. "lose_track_of_time")
  question_text   TEXT
  position        INTEGER

quiz_attempts
  id              BIGSERIAL PK
  user_id         FK → users (nullable — filled on registration)
  quiz_version_id FK → quiz_versions
  attempt_token   UUID UNIQUE    -- bridges anonymous attempt to account
  score           INTEGER        -- raw sum of answer values
  max_score       INTEGER        -- questions × 4 (max value per question)
  result          VARCHAR        -- HIGH | LOW, computed at submission time
  completed_at    TIMESTAMPTZ

answers
  id           BIGSERIAL PK
  attempt_id   FK → quiz_attempts
  question_id  FK → questions
  answer_value INTEGER (0–4)    -- Strongly Disagree=0 … Strongly Agree=4
  UNIQUE (attempt_id, question_id)
```

### Scoring

5-point Likert scale per question (0–4). **Result is HIGH** if 2 or more answers have value ≥ 3 (Agree / Strongly Agree). Result and score are computed server-side at submission and stored immutably — re-scoring old attempts after a logic change does not affect historical results.

---

## Key Architectural Decisions

**Anonymous-first quiz with `attemptToken` bridge**  
The quiz is submitted before account creation. The backend returns a UUID `attempt_token` which the frontend stores in `localStorage`. On registration, the token is sent and the backend runs a single `UPDATE quiz_attempts SET user_id = $1 WHERE attempt_token = $2 AND user_id IS NULL`. This decouples the quiz flow from auth entirely — the user completes the quiz with zero friction, then creates an account only to view their report.

**Quiz versioning**  
Questions belong to a `quiz_version`, not to a global pool. Every attempt stores `quiz_version_id` and full individual `answers`. Changing the quiz means inserting a new `quiz_versions` row and flipping `is_active`. Old attempts remain fully intact and queryable. There is no schema migration needed when questions change.

**Result stored at submission, not computed on read**  
`result` and `score` are written once to `quiz_attempts`. Changing the scoring algorithm does not silently alter historical reports. If future business logic needs re-scoring, it is an explicit migration, not an accidental side-effect.

**JWT in httpOnly cookie**  
Tokens are never accessible to JavaScript, which eliminates XSS-based token theft. The frontend uses `credentials: 'include'` on every fetch — there is no token management code anywhere in the client. Logout is a `POST /auth/logout` that clears the cookie server-side.

**Next.js rewrite proxy**  
`/api/*` → backend eliminates browser CORS entirely. The backend URL is an environment variable; swapping it requires no frontend code change. On Vercel this is implemented via CDN routing rules.

**Raw `pg`, no ORM**  
The schema is intentionally simple and stable. Raw SQL keeps queries explicit, avoids N+1 footguns from lazy loading, and removes the abstraction layer between the developer and the database. Schema changes are managed via idempotent `schema.sql` with `ALTER TABLE` migrations appended as needed.

---

## Trade-offs

| Decision | Cost | Benefit |
|---|---|---|
| No ORM | Schema migrations are manual SQL | Full control over queries; no hidden behaviour |
| `localStorage` for `attemptToken` | Lost if user clears storage or switches device — they must retake the quiz | Simple; no server-side session state for anonymous users |
| Single active quiz version | Cannot A/B test two versions simultaneously | Simpler query (`WHERE is_active = TRUE`); no version-selection UI needed |
| Result stored at submission | Changing scoring logic does not backfill old results | Historical reports are immutable and auditable |
| No email verification | Fake emails can be registered | Out of scope for a screening funnel; trivially addable later |
| Generic login error message | Slightly less helpful UX | Prevents user enumeration — attacker cannot distinguish "email not found" from "wrong password" |

---

## Extensibility

**Changing quiz questions**  
Insert a new `quiz_versions` row with `is_active = TRUE` (the DB partial unique index ensures the old active version is set to `FALSE` first), then add questions linked to the new version. Old attempts remain intact — they reference their original `quiz_version_id` and individual answers. `GET /quiz/active` automatically serves the new version.

**Changing the scoring algorithm**  
Edit `quiz.service.ts → createAttempt`. Because `result` is persisted at submission time, old attempts are unaffected. If backfilling is needed, write a one-off migration that re-runs the new formula against stored `answers`.

**Adding personalised report sections**  
Each `answer` row references a `question_id` which links back to a stable `question_key`. New report sections can query `answers JOIN questions ON question_key = 'specific_key'` for a given `attempt_id` — no schema change required.

**Scaling beyond a single active version**  
The schema supports multiple quiz versions already. Serving them requires adding a version-selection parameter to `GET /quiz/active` and updating the frontend to pass it. The rest of the system is unchanged.
