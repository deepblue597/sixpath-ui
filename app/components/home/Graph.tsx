"use client";

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
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
  useReactFlow,
  ReactFlowProvider,
  NodeTypes,
  Handle,
  Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { UserResponse, ConnectionResponse } from "@/app/lib/types";

// ─── Types ────────────────────────────────────────────────────────────────────

interface GraphProps {
  peopleData: UserResponse[];
  connectionData: ConnectionResponse[];
  currentUser: UserResponse | null;
  onNodeClick: (node: Node) => void;
  onEdgeClick: (edge: Edge) => void;
}

type FilterMode = "all" | "company" | "sector";

// ─── Performance: LOD clustering ──────────────────────────────────────────────
// When there are >80 nodes, we cluster by company/sector to reduce DOM nodes.
const LOD_THRESHOLD = 80;

// ─── Layout helpers ───────────────────────────────────────────────────────────

/**
 * Radial layout: current user at center (0,0), connections arranged in
 * concentric rings grouped by sector/company.
 *
 * Ring 0 = direct connections of currentUser
 * Ring 1 = connections-of-connections
 * Isolated nodes live in a bottom strip.
 */
function buildRadialLayout(
  people: UserResponse[],
  connections: ConnectionResponse[],
  currentUserId: string,
  groupBy: FilterMode,
): Record<string, { x: number; y: number }> {
  const positions: Record<string, { x: number; y: number }> = {};
  const currentIdStr = currentUserId;

  // Build adjacency
  const adj = new Map<string, Set<string>>();
  people.forEach((p) => adj.set(p.id.toString(), new Set()));
  connections.forEach((c) => {
    const s = c.person1_id.toString();
    const t = c.person2_id.toString();
    adj.get(s)?.add(t);
    adj.get(t)?.add(s);
  });

  // BFS from currentUser to assign ring levels
  const levels = new Map<string, number>();
  levels.set(currentIdStr, 0);
  const queue = [currentIdStr];
  while (queue.length) {
    const curr = queue.shift()!;
    const lvl = levels.get(curr)!;
    for (const nb of adj.get(curr) ?? []) {
      if (!levels.has(nb)) {
        levels.set(nb, lvl + 1);
        queue.push(nb);
      }
    }
  }

  // Group by sector/company if requested, otherwise just angle-spread
  const groupKey = (p: UserResponse) => {
    if (groupBy === "company") return p.company ?? "Unknown";
    if (groupBy === "sector")
      return (p as any).sector ?? p.company ?? "Unknown";
    return "default";
  };

  // Place current user at center
  positions[currentIdStr] = { x: 0, y: 0 };

  // Gather rings
  const byLevel = new Map<number, UserResponse[]>();
  people.forEach((p) => {
    const id = p.id.toString();
    if (id === currentIdStr) return;
    const lvl = levels.get(id) ?? 99;
    if (!byLevel.has(lvl)) byLevel.set(lvl, []);
    byLevel.get(lvl)!.push(p);
  });

  const RING_GAP = 220; // px between rings

  byLevel.forEach((ring, lvl) => {
    if (lvl === 99) return; // isolated — handled below
    const radius = lvl * RING_GAP;

    // Sort ring by group so same-group nodes cluster together angularly
    const sorted =
      groupBy !== "all"
        ? [...ring].sort((a, b) => groupKey(a).localeCompare(groupKey(b)))
        : ring;

    sorted.forEach((p, i) => {
      // Slight jitter per-group for readability
      const angleOffset =
        groupBy !== "all" ? sectorAngleOffset(groupKey(p)) : 0;
      const baseAngle =
        (i / sorted.length) * 2 * Math.PI - Math.PI / 2 + angleOffset;
      positions[p.id.toString()] = {
        x: radius * Math.cos(baseAngle),
        y: radius * Math.sin(baseAngle),
      };
    });
  });

  // Isolated nodes: row below main graph
  const isolated = people.filter(
    (p) => !levels.has(p.id.toString()) && p.id.toString() !== currentIdStr,
  );
  isolated.forEach((p, i) => {
    const cols = 6;
    const col = i % cols;
    const row = Math.floor(i / cols);
    positions[p.id.toString()] = {
      x: (col - cols / 2) * 200,
      y: (byLevel.size + 1) * RING_GAP + row * 140 + 200,
    };
  });

  return positions;
}

/** Deterministic angle offset so same group clusters on one arc side */
function sectorAngleOffset(key: string): number {
  let hash = 0;
  for (let i = 0; i < key.length; i++)
    hash = (hash * 31 + key.charCodeAt(i)) & 0xffffffff;
  return ((hash % 1000) / 1000) * 0.4 - 0.2; // ±0.2 radians
}

// ─── Sector colour palette ────────────────────────────────────────────────────

const PALETTE = [
  "#6366f1",
  "#f59e0b",
  "#10b981",
  "#ef4444",
  "#3b82f6",
  "#ec4899",
  "#14b8a6",
  "#f97316",
  "#8b5cf6",
  "#06b6d4",
  "#84cc16",
  "#e11d48",
];

function useSectorColors(people: UserResponse[], groupBy: FilterMode) {
  return useMemo(() => {
    if (groupBy === "all") return new Map<string, string>();
    const keys = Array.from(
      new Set(
        people.map((p) =>
          groupBy === "company"
            ? (p.company ?? "Unknown")
            : ((p as any).sector ?? p.company ?? "Unknown"),
        ),
      ),
    );
    const map = new Map<string, string>();
    keys.forEach((k, i) => map.set(k, PALETTE[i % PALETTE.length]));
    return map;
  }, [people, groupBy]);
}

// ─── Custom node types ─────────────────────────────────────────────────────────

function UserNode({ data }: { data: any }) {
  return (
    <>
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <div
        style={{
          background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
          color: "#fff",
          border: "3px solid #fff",
          boxShadow: "0 0 0 3px #4F46E5, 0 8px 32px rgba(79,70,229,0.45)",
          borderRadius: 999,
          padding: "12px 22px",
          fontWeight: 800,
          fontSize: 13,
          minWidth: 120,
          textAlign: "center",
          letterSpacing: "0.02em",
          whiteSpace: "nowrap",
          userSelect: "none",
        }}>
        👤 {data.label}
      </div>
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
    </>
  );
}

function PersonNode({ data }: { data: any }) {
  return (
    <>
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <div
        style={{
          background: data.faded ? "rgba(248,250,252,0.3)" : "#f8fafc",
          border: `2px solid ${data.faded ? "rgba(203,213,225,0.3)" : (data.groupColor ?? "#cbd5e1")}`,
          borderRadius: 10,
          padding: "8px 14px",
          fontSize: 12,
          minWidth: 120,
          textAlign: "center",
          whiteSpace: "pre-line",
          opacity: data.faded ? 0.25 : 1,
          transition: "all 0.25s ease",
          userSelect: "none",
          boxShadow: data.faded
            ? "none"
            : `0 2px 8px ${data.groupColor ? data.groupColor + "33" : "rgba(0,0,0,0.06)"}`,
        }}>
        <div style={{ fontWeight: 700, fontSize: 12.5, color: "#1e293b" }}>
          {data.name}
        </div>
        {data.sub && (
          <div
            style={{
              fontSize: 10.5,
              color: data.groupColor ?? "#64748b",
              marginTop: 2,
            }}>
            {data.sub}
          </div>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
    </>
  );
}

function ClusterNode({ data }: { data: any }) {
  return (
    <>
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <div
        style={{
          background: data.color + "22",
          border: `2px dashed ${data.color}`,
          borderRadius: 14,
          padding: "10px 18px",
          fontSize: 12,
          textAlign: "center",
          userSelect: "none",
          minWidth: 130,
        }}>
        <div style={{ fontWeight: 700, color: data.color }}>{data.label}</div>
        <div style={{ fontSize: 10.5, color: "#64748b", marginTop: 2 }}>
          {data.count} people
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
    </>
  );
}

const nodeTypes: NodeTypes = {
  userNode: UserNode,
  personNode: PersonNode,
  clusterNode: ClusterNode,
};

// ─── Filter bar ───────────────────────────────────────────────────────────────

interface FilterBarProps {
  groupBy: FilterMode;
  setGroupBy: (m: FilterMode) => void;
  activeFilter: string | null;
  setActiveFilter: (f: string | null) => void;
  options: string[];
  totalNodes: number;
  visibleNodes: number;
  isClustered: boolean;
}

function FilterBar({
  groupBy,
  setGroupBy,
  activeFilter,
  setActiveFilter,
  options,
  totalNodes,
  visibleNodes,
  isClustered,
}: FilterBarProps) {
  return (
    <div
      style={{
        position: "absolute",
        top: 12,
        left: 12,
        zIndex: 10,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(8px)",
        border: "1px solid #e2e8f0",
        borderRadius: 12,
        padding: "12px 14px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        minWidth: 200,
        maxWidth: 240,
      }}>
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: "#94a3b8",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}>
        SixPaths
      </div>

      {/* Group by */}
      <div>
        <div
          style={{
            fontSize: 10.5,
            color: "#64748b",
            marginBottom: 5,
            fontWeight: 600,
          }}>
          Group by
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {(["all", "company", "sector"] as FilterMode[]).map((m) => (
            <button
              key={m}
              onClick={() => {
                setGroupBy(m);
                setActiveFilter(null);
              }}
              style={{
                flex: 1,
                padding: "4px 0",
                border: "1px solid",
                borderColor: groupBy === m ? "#4F46E5" : "#e2e8f0",
                borderRadius: 6,
                background: groupBy === m ? "#4F46E5" : "#fff",
                color: groupBy === m ? "#fff" : "#64748b",
                fontSize: 11,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.15s",
                textTransform: "capitalize",
              }}>
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Filter chips */}
      {groupBy !== "all" && options.length > 0 && (
        <div>
          <div
            style={{
              fontSize: 10.5,
              color: "#64748b",
              marginBottom: 5,
              fontWeight: 600,
            }}>
            Filter {groupBy}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            <button
              onClick={() => setActiveFilter(null)}
              style={{
                padding: "3px 8px",
                borderRadius: 20,
                border: "1px solid",
                borderColor: !activeFilter ? "#4F46E5" : "#e2e8f0",
                background: !activeFilter ? "#EEF2FF" : "#fff",
                color: !activeFilter ? "#4F46E5" : "#64748b",
                fontSize: 10.5,
                fontWeight: 600,
                cursor: "pointer",
              }}>
              All
            </button>
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() =>
                  setActiveFilter(activeFilter === opt ? null : opt)
                }
                style={{
                  padding: "3px 8px",
                  borderRadius: 20,
                  border: "1px solid",
                  borderColor: activeFilter === opt ? "#4F46E5" : "#e2e8f0",
                  background: activeFilter === opt ? "#EEF2FF" : "#fff",
                  color: activeFilter === opt ? "#4F46E5" : "#64748b",
                  fontSize: 10.5,
                  fontWeight: 600,
                  cursor: "pointer",
                  maxWidth: 120,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
                title={opt}>
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Stats */}
      <div
        style={{
          borderTop: "1px solid #f1f5f9",
          paddingTop: 8,
          fontSize: 10.5,
          color: "#94a3b8",
          display: "flex",
          justifyContent: "space-between",
        }}>
        <span>
          {visibleNodes} / {totalNodes} nodes
        </span>
        {isClustered && (
          <span style={{ color: "#f59e0b", fontWeight: 600 }}>
            ⚡ clustered
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Inner graph (needs ReactFlow context) ────────────────────────────────────

function GraphInner({
  peopleData,
  connectionData,
  currentUser,
  onNodeClick,
  onEdgeClick,
}: GraphProps) {
  const { fitView } = useReactFlow();

  const [groupBy, setGroupBy] = useState<FilterMode>("all");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const currentIdStr = currentUser?.id.toString() ?? "";

  // Sector/company colours
  const sectorColors = useSectorColors(peopleData, groupBy);

  // Group options for the filter bar
  const groupOptions = useMemo(() => {
    if (groupBy === "all") return [];
    const keys = new Set(
      peopleData.map((p) =>
        groupBy === "company"
          ? (p.company ?? "Unknown")
          : ((p as any).sector ?? p.company ?? "Unknown"),
      ),
    );
    return Array.from(keys).sort();
  }, [peopleData, groupBy]);

  // Should we cluster? (LOD)
  const shouldCluster = peopleData.length > LOD_THRESHOLD && groupBy !== "all";

  // Build nodes and edges
  const { nodes: computedNodes, edges: computedEdges } = useMemo(() => {
    if (!peopleData.length) return { nodes: [], edges: [] };

    const posMap = buildRadialLayout(
      peopleData,
      connectionData,
      currentIdStr,
      groupBy,
    );

    // ── Clustered mode ──────────────────────────────────────────────────────
    if (shouldCluster) {
      const groupKeyFn = (p: UserResponse) =>
        groupBy === "company"
          ? (p.company ?? "Unknown")
          : ((p as any).sector ?? p.company ?? "Unknown");

      const groups = new Map<string, UserResponse[]>();
      peopleData.forEach((p) => {
        const k = groupKeyFn(p);
        if (!groups.has(k)) groups.set(k, []);
        groups.get(k)!.push(p);
      });

      const clusterNodes: Node[] = [];
      const clusterEdges: Edge[] = [];

      // Current user node
      clusterNodes.push({
        id: currentIdStr,
        type: "userNode",
        position: { x: 0, y: 0 },
        data: {
          label:
            currentUser?.username ??
            `${currentUser?.first_name} ${currentUser?.last_name}`,
        },
      });

      const clusterIds = new Set<string>();
      const CLUSTER_RADIUS = 400;
      const gKeys = Array.from(groups.keys());

      gKeys.forEach((key, i) => {
        const angle = (i / gKeys.length) * 2 * Math.PI - Math.PI / 2;
        const cx = CLUSTER_RADIUS * Math.cos(angle);
        const cy = CLUSTER_RADIUS * Math.sin(angle);
        const color = sectorColors.get(key) ?? "#6366f1";
        const members = groups.get(key)!;
        const clusterId = `cluster-${key}`;
        const faded = activeFilter !== null && activeFilter !== key;

        clusterNodes.push({
          id: clusterId,
          type: "clusterNode",
          position: { x: cx, y: cy },
          data: { label: key, count: members.length, color, faded },
          style: { opacity: faded ? 0.2 : 1, transition: "opacity 0.25s" },
        });

        clusterEdges.push({
          id: `e-${currentIdStr}-${clusterId}`,
          source: currentIdStr,
          target: clusterId,
          style: {
            stroke: faded ? "#e2e8f0" : color,
            strokeWidth: 2,
            opacity: faded ? 0.15 : 0.7,
          },
        });

        clusterIds.add(clusterId);
      });

      return { nodes: clusterNodes, edges: clusterEdges };
    }

    // ── Full node mode ──────────────────────────────────────────────────────
    const groupKeyFn = (p: UserResponse) =>
      groupBy === "company"
        ? (p.company ?? "Unknown")
        : ((p as any).sector ?? p.company ?? "Unknown");

    const personNodes: Node[] = peopleData.map((person) => {
      const isMe = person.id.toString() === currentIdStr;
      const pos = posMap[person.id.toString()] ?? { x: 0, y: 0 };
      const gKey = groupKeyFn(person);
      const groupColor = groupBy !== "all" ? sectorColors.get(gKey) : undefined;
      const faded = activeFilter !== null && gKey !== activeFilter;

      if (isMe) {
        return {
          id: person.id.toString(),
          type: "userNode",
          position: pos,
          data: {
            label:
              person.username ?? `${person.first_name} ${person.last_name}`,
          },
        };
      }

      return {
        id: person.id.toString(),
        type: "personNode",
        position: pos,
        data: {
          name: `${person.first_name} ${person.last_name}`,
          sub: groupBy === "all" ? person.company : gKey,
          groupColor,
          faded,
        },
      };
    });

    // Add currentUser node if not in peopleData
    if (
      currentUser &&
      !peopleData.some((p) => p.id.toString() === currentIdStr)
    ) {
      personNodes.unshift({
        id: currentIdStr,
        type: "userNode",
        position: { x: 0, y: 0 },
        data: {
          label:
            currentUser.username ??
            `${currentUser.first_name} ${currentUser.last_name}`,
        },
      });
    }

    const personEdges: Edge[] = connectionData.map((conn) => {
      const s = conn.person1_id.toString();
      const t = conn.person2_id.toString();

      // Check if either endpoint is faded
      const sp = peopleData.find((p) => p.id.toString() === s);
      const tp = peopleData.find((p) => p.id.toString() === t);
      const gKeyS = sp ? groupKeyFn(sp) : null;
      const gKeyT = tp ? groupKeyFn(tp) : null;
      const edgeFaded =
        activeFilter !== null &&
        gKeyS !== activeFilter &&
        gKeyT !== activeFilter &&
        s !== currentIdStr &&
        t !== currentIdStr;

      const strength = conn.strength ?? 1;
      const color = sectorColors.get(gKeyS ?? "") ?? "#94a3b8";

      return {
        id: `${s}-${t}`,
        source: s,
        target: t,
        animated: strength >= 4 && !edgeFaded,
        style: {
          stroke: edgeFaded
            ? "#e2e8f0"
            : groupBy !== "all"
              ? color
              : strength >= 4
                ? "#4F46E5"
                : "#94a3b8",
          strokeWidth: Math.max(1, strength * 0.7),
          opacity: edgeFaded ? 0.08 : 0.75,
          transition: "all 0.25s",
        },
        label: conn.relationship ?? undefined,
        labelStyle: { fill: "#1e293b", fontSize: 10, fontWeight: 600 },
        labelBgStyle: { fill: "#ffffff", fillOpacity: 0.85 },
      };
    });

    return { nodes: personNodes, edges: personEdges };
  }, [
    peopleData,
    connectionData,
    currentIdStr,
    groupBy,
    activeFilter,
    sectorColors,
    shouldCluster,
    currentUser,
  ]);

  const [nodes, setNodes] = useState<Node[]>(computedNodes);
  const [edges, setEdges] = useState<Edge[]>(computedEdges);

  // Sync when computed values change (filter, groupBy, data changes)
  useEffect(() => {
    setNodes(computedNodes);
    setEdges(computedEdges);
    // Re-fit view after layout changes
    setTimeout(() => fitView({ duration: 500, padding: 0.25 }), 50);
  }, [computedNodes, computedEdges, fitView]);

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

  const visibleNodes = useMemo(
    () => nodes.filter((n) => !n.data?.faded).length,
    [nodes],
  );

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        minHeight: 700,
        position: "relative",
        borderRadius: 12,
        overflow: "hidden",
        border: "1px solid #e5e7eb",
      }}>
      <FilterBar
        groupBy={groupBy}
        setGroupBy={(m) => {
          setGroupBy(m);
          setActiveFilter(null);
        }}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        options={groupOptions}
        totalNodes={peopleData.length}
        visibleNodes={visibleNodes}
        isClustered={shouldCluster}
      />

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={(_, node) => onNodeClick(node)}
        onEdgeClick={(_, edge) => onEdgeClick(edge)}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.3, maxZoom: 1.0 }}
        minZoom={0.05}
        maxZoom={2.5}
        // Performance: only re-render edges in viewport
        onlyRenderVisibleElements
        // Reduce edge label rendering cost when zoomed out
        elevateEdgesOnSelect
        defaultEdgeOptions={{ interactionWidth: 10 }}>
        <Background gap={24} size={1} color="#f1f5f9" />
        <Controls position="bottom-right" />
        <MiniMap
          nodeStrokeWidth={2}
          nodeColor={(n): string => {
            if (n.type === "userNode") return "#4F46E5";
            if (n.type === "clusterNode")
              return (n.data?.color as string) ?? "#6366f1";
            return n.data?.faded ? "#f1f5f9" : "#94a3b8";
          }}
          style={{ borderRadius: 8 }}
        />
      </ReactFlow>
    </div>
  );
}

// ─── Public export (wraps with ReactFlowProvider) ─────────────────────────────

export default function Graph(props: GraphProps) {
  return (
    <ReactFlowProvider>
      <GraphInner {...props} />
    </ReactFlowProvider>
  );
}
