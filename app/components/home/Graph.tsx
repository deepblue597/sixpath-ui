"use client";

import { useState, useCallback, useMemo } from "react";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  Background,
  Controls,
  MiniMap,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Box } from "@mui/material";
import { UserResponse, ConnectionResponse } from "@/app/lib/types";

interface GraphProps {
  peopleData: UserResponse[];
  connectionData: ConnectionResponse[];
  currentUser: UserResponse | null;
  onNodeClick: (node: Node) => void;
  onEdgeClick: (edge: Edge) => void;
}

// --- Layout helpers ---

/** BFS to find all connected components. Returns array of sets of node ids. */
function findComponents(
  ids: string[],
  edges: { source: string; target: string }[],
): string[][] {
  const adj = new Map<string, Set<string>>();
  ids.forEach((id) => adj.set(id, new Set()));
  edges.forEach(({ source, target }) => {
    adj.get(source)?.add(target);
    adj.get(target)?.add(source);
  });

  const visited = new Set<string>();
  const components: string[][] = [];

  for (const id of ids) {
    if (visited.has(id)) continue;
    const component: string[] = [];
    const queue = [id];
    visited.add(id);
    while (queue.length) {
      const curr = queue.shift()!;
      component.push(curr);
      for (const neighbor of adj.get(curr) ?? []) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }
    components.push(component);
  }
  // Largest components first
  return components.sort((a, b) => b.length - a.length);
}

/** Arrange nodes in a circle within a cluster. */
function clusterPositions(
  nodeIds: string[],
  cx: number,
  cy: number,
): Record<string, { x: number; y: number }> {
  const positions: Record<string, { x: number; y: number }> = {};
  const n = nodeIds.length;
  if (n === 1) {
    positions[nodeIds[0]] = { x: cx, y: cy };
    return positions;
  }
  const radius = Math.max(100, n * 40); // scale radius with cluster size
  nodeIds.forEach((id, i) => {
    const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
    positions[id] = {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    };
  });
  return positions;
}

/** Place clusters in a wrapped row layout with generous spacing. */
function buildPositionMap(
  components: string[][],
  currentUserId?: string,
): Record<string, { x: number; y: number }> {
  const allPositions: Record<string, { x: number; y: number }> = {};

  // The component containing the current user goes first and centered
  if (currentUserId) {
    const idx = components.findIndex((c) => c.includes(currentUserId));
    if (idx > 0) {
      const [main] = components.splice(idx, 1);
      components.unshift(main);
    }
  }

  const clusterGapX = 500;
  const clusterGapY = 450;
  const clustersPerRow = 3;

  components.forEach((component, i) => {
    const col = i % clustersPerRow;
    const row = Math.floor(i / clustersPerRow);
    const cx = col * clusterGapX + 300;
    const cy = row * clusterGapY + 300;
    const positions = clusterPositions(component, cx, cy);
    Object.assign(allPositions, positions);
  });

  return allPositions;
}

// --- Component ---

export default function Graph({
  peopleData,
  connectionData,
  currentUser,
  onNodeClick,
  onEdgeClick,
}: GraphProps) {
  const initialNodes: Node[] = useMemo(() => {
    if (!peopleData.length) return [];

    const allIds = peopleData.map((p) => p.id.toString());
    if (currentUser && !allIds.includes(currentUser.id.toString())) {
      allIds.push(currentUser.id.toString());
    }

    const edgePairs = connectionData.map((c) => ({
      source: c.person1_id.toString(),
      target: c.person2_id.toString(),
    }));

    const components = findComponents(allIds, edgePairs);
    const posMap = buildPositionMap(components, currentUser?.id.toString());

    const nodes: Node[] = peopleData.map((person) => {
      const isMe = currentUser?.id === person.id;
      const pos = posMap[person.id.toString()] ?? { x: 0, y: 0 };
      return {
        id: person.id.toString(),
        position: pos,
        data: {
          label: isMe
            ? `👤 ${person.username ?? `${person.first_name} ${person.last_name}`}`
            : `${person.first_name} ${person.last_name}${person.company ? `\n${person.company}` : ""}`,
        },
        style: isMe
          ? {
              background: "#4F46E5",
              color: "#fff",
              border: "2px solid #3730A3",
              borderRadius: 8,
              padding: "10px 16px",
              fontWeight: 700,
              fontSize: 14,
              minWidth: 140,
              textAlign: "center",
            }
          : {
              background: "#f8fafc",
              border: "1px solid #cbd5e1",
              borderRadius: 8,
              padding: "8px 14px",
              fontSize: 13,
              minWidth: 130,
              textAlign: "center",
              whiteSpace: "pre-line",
            },
      };
    });

    // Add current user node if not already in peopleData
    if (currentUser && !peopleData.some((p) => p.id === currentUser.id)) {
      const pos = posMap[currentUser.id.toString()] ?? { x: 0, y: 0 };
      nodes.unshift({
        id: currentUser.id.toString(),
        position: pos,
        data: {
          label: `👤 ${currentUser.username ?? `${currentUser.first_name} ${currentUser.last_name}`}`,
        },
        style: {
          background: "#4F46E5",
          color: "#fff",
          border: "2px solid #3730A3",
          borderRadius: 8,
          padding: "10px 16px",
          fontWeight: 700,
          fontSize: 14,
          minWidth: 140,
          textAlign: "center",
        },
      });
    }

    return nodes;
  }, [peopleData, connectionData, currentUser]);

  const initialEdges: Edge[] = useMemo(() => {
    return connectionData.map((conn) => ({
      id: `${conn.person1_id}-${conn.person2_id}`,
      source: `${conn.person1_id}`,
      target: `${conn.person2_id}`,
      animated: (conn.strength ?? 0) >= 4,
      style: {
        stroke: (conn.strength ?? 0) >= 4 ? "#4F46E5" : "#94a3b8",
        strokeWidth: Math.max(1.5, (conn.strength ?? 1) * 0.8),
      },
      label: conn.relationship ?? undefined,
      labelStyle: { fill: "#1e293b", fontSize: 11, fontWeight: 600 },
      labelBgStyle: { fill: "#ffffff", fillOpacity: 0.9 },
    }));
  }, [connectionData]);

  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        minHeight: "700px",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
      }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={(_, node) => onNodeClick(node)}
        onEdgeClick={(_, edge) => onEdgeClick(edge)}
        fitView
        fitViewOptions={{ padding: 0.25, maxZoom: 1.2 }}
        minZoom={0.1}
        maxZoom={2}>
        <Background gap={16} size={1} color="#e5e7eb" />
        <Controls />
        <MiniMap nodeStrokeWidth={3} />
      </ReactFlow>
    </Box>
  );
}
