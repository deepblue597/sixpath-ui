/**
 * Re-exports generated types from api.d.ts under friendly names.
 * Do not add manual types here — update the backend and re-run:
 *   npx openapi-typescript http://0.0.0.0:8000/openapi.json -o app/lib/api.d.ts
 */
import type { components } from "./api.d.ts";

export type UserResponse = components["schemas"]["UserResponse"];
export type UserUpdate = components["schemas"]["UserUpdate"];
export type UserCreate = components["schemas"]["UserCreate"];
export type ConnectionResponse = components["schemas"]["ConnectionResponse"];
export type ConnectionCreate = components["schemas"]["ConnectionCreate"];
export type ConnectionUpdate = components["schemas"]["ConnectionUpdate"];
export type ReferralResponse = components["schemas"]["ReferralResponse"];
export type ReferralCreate = components["schemas"]["ReferralCreate"];
export type ReferralUpdate = components["schemas"]["ReferralUpdate"];
export type Token = components["schemas"]["Token"];
