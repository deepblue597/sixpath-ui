import createClient from "openapi-fetch";
import type { paths } from "./api.d.ts";

/**
 * A single shared openapi-fetch client.
 * - Reads the base URL from the environment variable.
 * - Automatically attaches the JWT Bearer token from localStorage on every request.
 * - Redirects to /login on 401 (token expired or invalid).
 */
export const client = createClient<paths>({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  fetch: async (request) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (token) {
      request.headers.set("Authorization", `Bearer ${token}`);
    }

    const response = await fetch(request);

    if (response.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("token");
      window.location.href = "/";
    }

    return response;
  },
});
