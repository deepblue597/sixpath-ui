import { client } from "./apiClient";
import type { UserResponse, UserUpdate } from "./types";

/**
 * GET /users/
 * Returns all contacts/connections of the authenticated user.
 */
export async function getAllUsers(): Promise<UserResponse[]> {
  const { data, error } = await client.GET("/users/");

  if (error) throw new Error(JSON.stringify(error));
  return data;
}

/**
 * GET /users/me
 * Returns the currently authenticated user's profile.
 */
export async function getMe(): Promise<UserResponse> {
  const { data, error } = await client.GET("/users/me");

  if (error) throw new Error(JSON.stringify(error));
  return data;
}

/**
 * GET /users/{user_id}
 * Returns a single user by ID.
 */
export async function getUserById(userId: number): Promise<UserResponse> {
  const { data, error } = await client.GET("/users/{user_id}", {
    params: { path: { user_id: userId } },
  });

  if (error) throw new Error(JSON.stringify(error));
  return data;
}

/**
 * PUT /users/{user_id}
 * Updates a user by ID.
 */
export async function updateUser(
  userId: number,
  payload: UserUpdate,
): Promise<UserResponse> {
  const { data, error } = await client.PUT("/users/{user_id}", {
    params: { path: { user_id: userId } },
    body: payload,
  });

  if (error) throw new Error(JSON.stringify(error));
  return data;
}
