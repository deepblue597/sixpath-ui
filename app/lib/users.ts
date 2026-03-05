import { client } from "./apiClient";
import type { UserResponse, UserUpdate, UserCreate } from "./types";

/**
 * GET /users/
 * Returns a single page of contacts/connections of the authenticated user.
 */
export async function getAllUsers(params?: {
  offset?: number;
  limit?: number;
}): Promise<UserResponse[]> {
  const { data, error } = await client.GET("/users/", {
    params: { query: params },
  });

  if (error) throw new Error(JSON.stringify(error));
  return data;
}

/**
 * Fetches every user by paging through the API until all results are returned.
 */
export async function getAllUsersPaginated(): Promise<UserResponse[]> {
  const PAGE_SIZE = 100;
  const results: UserResponse[] = [];
  let offset = 0;

  while (true) {
    const page = await getAllUsers({ limit: PAGE_SIZE, offset });
    results.push(...page);
    if (page.length < PAGE_SIZE) break;
    offset += PAGE_SIZE;
  }

  return results;
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

/**
 * POST /users/
 * Creates a new contact/connection in the network.
 */
export async function createUser(payload: UserCreate): Promise<UserResponse> {
  const { data, error } = await client.POST("/users/", {
    body: payload,
  });

  if (error) throw new Error(JSON.stringify(error));
  return data;
}

/**
 * DELETE /users/{user_id}
 * Deletes a user by ID.
 */
export async function deleteUser(userId: number): Promise<void> {
  const { error } = await client.DELETE("/users/{user_id}", {
    params: { path: { user_id: userId } },
  });

  if (error) throw new Error(JSON.stringify(error));
}

/**
 * GET /users/filter-options
 */

export async function getUserFilterOptions(): Promise<{
  company: string[];
  sector: string[];
}> {
  const { data, error } = await client.GET("/users/filter-options");

  if (error) throw new Error(JSON.stringify(error));
  return data;
}
