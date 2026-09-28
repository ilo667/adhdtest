const BASE = "/api";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...init?.headers },
    ...init,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw Object.assign(new Error(body.message ?? res.statusText), {
      status: res.status,
      body,
    });
  }
  return res.json() as Promise<T>;
}

export type Question = { id: number; key: string; prompt: string; position: number };
export type QuizData = { versionId: number; questions: Question[] };
export type AttemptResult = { attemptToken: string; result: "HIGH" | "LOW"; score: number; maxScore: number };
export type LatestAttempt = { result: "HIGH" | "LOW"; score: number; max_score: number; completed_at: string } | null;
export type User = { id: number; email: string };
export type AuthResponse = { user: User; latestAttempt: LatestAttempt };

export const api = {
  getActiveQuiz: () => request<QuizData>("/quiz/active"),

  submitAttempt: (versionId: number, answers: { questionId: number; value: number }[]) =>
    request<AttemptResult>("/quiz/attempts", {
      method: "POST",
      body: JSON.stringify({ versionId, answers }),
    }),

  register: (email: string, password: string, attemptToken?: string) =>
    request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, attemptToken }),
    }),

  login: (email: string, password: string) =>
    request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  getMe: () => request<AuthResponse>("/auth/customer"),

  linkAttempt: (attemptToken: string) =>
    request<AuthResponse>("/auth/link-attempt", {
      method: "POST",
      body: JSON.stringify({ attemptToken }),
    }),

  logout: () =>
    request<{ ok: boolean }>("/auth/logout", { method: "POST" }),
};