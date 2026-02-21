import { client } from "./apiClient";
import type {
  ConnectionResponse,
  ConnectionCreate,
  ConnectionUpdate,
} from "./types";

export async function getAllConnections(): Promise<ConnectionResponse[]> {
  const { data, error } = await client.GET("/connections/all");

  if (error) throw new Error(JSON.stringify(error));
  return data;
}

export async function getConnectionById(
  connectionId: number,
): Promise<ConnectionResponse> {
  const { data, error } = await client.GET("/connections/{connection_id}", {
    params: { path: { connection_id: connectionId } },
  });

  if (error) throw new Error(JSON.stringify(error));
  return data;
}

export async function createConnection(
  payload: ConnectionCreate,
): Promise<ConnectionResponse> {
  const { data, error } = await client.POST("/connections/", {
    body: payload,
  });

  if (error) throw new Error(JSON.stringify(error));
  return data;
}

export async function updateConnection(
  connectionId: number,
  payload: ConnectionUpdate,
): Promise<ConnectionResponse> {
  const { data, error } = await client.PUT("/connections/{connection_id}", {
    params: { path: { connection_id: connectionId } },
    body: payload,
  });

  if (error) throw new Error(JSON.stringify(error));
  return data;
}

export async function deleteConnection(connectionId: number): Promise<void> {
  const { error } = await client.DELETE("/connections/{connection_id}", {
    params: { path: { connection_id: connectionId } },
  });

  if (error) throw new Error(JSON.stringify(error));
}
