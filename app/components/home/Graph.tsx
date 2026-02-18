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
  NodeTypes,
  Background,
  Controls,
  MiniMap,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import PersonData from "@/personsData";
import connectionData from "@/connectionData";
import { Box } from "@mui/material";

// Custom Round Node Component
interface RoundNodeData {
  label: string;
  company: string;
  sector: string;
  color: string;
  colorSecondary: string;
}

const RoundNode = ({ data }: { data: RoundNodeData }) => {
  return (
    <div
      style={{
        width: 120,
        height: 120,
        borderRadius: "50%",
        background: `linear-gradient(135deg, ${data.color || "#4F46E5"} 0%, ${
          data.colorSecondary || "#7C3AED"
        } 100%)`,
        border: "3px solid #fff",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
        textAlign: "center",
        cursor: "grab",
      }}>
      <div
        style={{
          color: "#fff",
          fontWeight: "bold",
          fontSize: 14,
          marginBottom: 4,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          width: "100%",
        }}>
        {data.label}
      </div>
      <div
        style={{
          color: "rgba(255,255,255,0.9)",
          fontSize: 11,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          width: "100%",
        }}>
        {data.company}
      </div>
      <div
        style={{
          color: "rgba(255,255,255,0.8)",
          fontSize: 10,
          marginTop: 2,
        }}>
        {data.sector}
      </div>
    </div>
  );
};

const nodeTypes: NodeTypes = {
  roundNode: RoundNode,
};

// Color mapping for different sectors
const getSectorColor = (
  sector: string,
): { primary: string; secondary: string } => {
  const colors: Record<string, { primary: string; secondary: string }> = {
    Technology: { primary: "#4F46E5", secondary: "#7C3AED" },
    Finance: { primary: "#059669", secondary: "#10B981" },
    Software: { primary: "#DC2626", secondary: "#EF4444" },
    Pharmaceuticals: { primary: "#EA580C", secondary: "#F97316" },
    Healthcare: { primary: "#0891B2", secondary: "#06B6D4" },
    Education: { primary: "#7C2D12", secondary: "#C2410C" },
  };
  return colors[sector] || { primary: "#6366F1", secondary: "#818CF8" };
};

export default function Graph() {
  // Transform PersonData into React Flow nodes
  const initialNodes: Node[] = useMemo(() => {
    return PersonData.map((person, index) => {
      const colors = getSectorColor(person.sector);
      const angle = (index / PersonData.length) * 2 * Math.PI;
      const radius = 300;

      return {
        id: person.id.toString(),
        type: "roundNode",
        position: {
          x: 400 + radius * Math.cos(angle),
          y: 300 + radius * Math.sin(angle),
        },
        data: {
          label: `${person.first_name} ${person.last_name}`,
          company: person.company,
          sector: person.sector,
          color: colors.primary,
          colorSecondary: colors.secondary,
        },
      };
    });
  }, []);

  // Transform connectionData into React Flow edges
  const initialEdges: Edge[] = useMemo(() => {
    return connectionData.map((conn) => ({
      id: `${conn.person1_id}-${conn.person2_id}`,
      source: `${conn.person1_id}`,
      target: `${conn.person2_id}`,
      type: "default",
      animated: conn.strength >= 4, // Strong connections are animated
      style: {
        stroke: conn.strength >= 4 ? "#3b82f6" : "#64748b",
        strokeWidth: Math.max(4, conn.strength * 1.5),
      },
      label: conn.relationship,
      labelStyle: { fill: "#1e293b", fontSize: 12, fontWeight: 600 },
      labelBgStyle: { fill: "#ffffff", fillOpacity: 0.95 },
    }));
  }, []);

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
        // display: "flex",
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
        fitView
        // nodeTypes={nodeTypes}
        fitViewOptions={{ padding: 0.2, maxZoom: 1.5 }}
        minZoom={0.1}
        maxZoom={2}>
        <Background
          // variant="dots"
          gap={12}
          size={1}
          color="#e5e7eb"
        />
        <Controls />
        <MiniMap
          nodeColor={(node) =>
            (node.data as unknown as RoundNodeData).color || "#4F46E5"
          }
          nodeStrokeWidth={3}
        />
      </ReactFlow>
    </Box>
  );
}
