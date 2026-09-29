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

export interface Question { id: number; key: string; prompt: string; position: number }
export interface QuizData { versionId: number; questions: Question[] }
export interface AttemptResult { attemptToken: string; result: "HIGH" | "LOW"; score: number; maxScore: number }
export interface LatestAttempt { result: "HIGH" | "LOW"; score: number; maxScore: number; completedAt: string }
export interface User { id: number; email: string }
export interface AuthResponse { user: User; latestAttempt: LatestAttempt | null }

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