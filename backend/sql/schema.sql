CREATE TABLE IF NOT EXISTS users (
  id            BIGSERIAL PRIMARY KEY,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS quiz_versions (
  id         BIGSERIAL PRIMARY KEY,
  is_active  BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS questions (
  id              BIGSERIAL PRIMARY KEY,
  quiz_version_id BIGINT NOT NULL REFERENCES quiz_versions(id) ON DELETE RESTRICT,
  question_key    VARCHAR(100) NOT NULL,
  question_text   TEXT NOT NULL,
  position        INTEGER NOT NULL,
  UNIQUE (quiz_version_id, question_key),
  UNIQUE (quiz_version_id, position)
);

CREATE TABLE IF NOT EXISTS quiz_attempts (
  id              BIGSERIAL PRIMARY KEY,
  user_id         BIGINT REFERENCES users(id) ON DELETE SET NULL,
  quiz_version_id BIGINT NOT NULL REFERENCES quiz_versions(id) ON DELETE RESTRICT,
  attempt_token   UUID NOT NULL UNIQUE,
  score           INTEGER NOT NULL,
  max_score       INTEGER NOT NULL,
  result          VARCHAR(20) NOT NULL CHECK (result IN ('HIGH', 'LOW')),
  completed_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS answers (
  id           BIGSERIAL PRIMARY KEY,
  attempt_id   BIGINT NOT NULL REFERENCES quiz_attempts(id) ON DELETE CASCADE,
  question_id  BIGINT NOT NULL REFERENCES questions(id) ON DELETE RESTRICT,
  answer_value INTEGER NOT NULL CHECK (answer_value BETWEEN 0 AND 4),
  UNIQUE (attempt_id, question_id)
);

CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_completed ON quiz_attempts (user_id, completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_answers_attempt ON answers (attempt_id);
CREATE INDEX IF NOT EXISTS idx_questions_version ON questions (quiz_version_id, position);

-- Enforce single active version at DB level
CREATE UNIQUE INDEX IF NOT EXISTS idx_single_active_version ON quiz_versions (is_active) WHERE is_active = TRUE;

-- Migrations for existing databases
ALTER TABLE quiz_versions DROP COLUMN IF EXISTS version;
ALTER TABLE answers DROP CONSTRAINT IF EXISTS answers_answer_value_check;
ALTER TABLE answers ADD CONSTRAINT answers_answer_value_check CHECK (answer_value BETWEEN 0 AND 4);
