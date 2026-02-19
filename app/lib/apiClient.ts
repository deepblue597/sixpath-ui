import createClient from "openapi-fetch";
import type { paths } from "./api.d.ts";

/**
 * A single shared openapi-fetch client.
 * - Reads the base URL from the environment variable.
 * - Automatically attaches the JWT Bearer token from localStorage on every request.
 */
export const client = createClient<paths>({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  // Attach stored token to every request
  fetch: async (request) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (token) {
      request.headers.set("Authorization", `Bearer ${token}`);
    }

    return fetch(request);
  },
});
