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

/**
 * Request a password reset token for the given username.
 * Returns the reset token if the username exists, or null if not found.
 */
export async function requestPasswordReset(username: string): Promise<string | null> {
  const res = await fetch(`${BASE_URL}/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username }),
  });
  if (!res.ok) throw new Error("Failed to request password reset");
  const data = await res.json();
  return data.reset_token ?? null;
}

/**
 * Reset the user's password using the token from /auth/forgot-password.
 */
export async function resetPassword(token: string, newPassword: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, new_password: newPassword }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.detail ?? "Password reset failed");
  }
}

/** Returns true if any user account exists in the database. */
export async function accountExists(): Promise<boolean> {
  const res = await fetch(`${BASE_URL}/auth/account-exists`);
  if (!res.ok) return false;
  return res.json();
}
