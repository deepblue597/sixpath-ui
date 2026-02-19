import type { Token } from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Login — POST /auth/login
 *
 * FastAPI's OAuth2 expects application/x-www-form-urlencoded,
 * so we can't use the JSON-based openapi-fetch client here.
 * We use plain fetch and store the returned JWT in localStorage.
 */
export async function login(
  username: string,
  password: string,
): Promise<Token> {
  const body = new URLSearchParams({ username, password, scope: "" });

  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.detail ?? "Invalid credentials");
  }

  const token: Token = await res.json();
  localStorage.setItem("token", token.access_token);
  return token;
}

/**
 * Logout — clears the token from localStorage.
 * The backend /auth/logout endpoint is a no-op (stateless JWT),
 * so client-side removal is all that's needed.
 */
export function logout(): void {
  localStorage.removeItem("token");
}

/** Returns the stored JWT or null if not logged in. */
export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

/** True if a token exists in localStorage. */
export function isAuthenticated(): boolean {
  return getToken() !== null;
}
